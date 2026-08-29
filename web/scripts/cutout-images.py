#!/usr/bin/env python3
"""
Lift product photographs off their background so they sit on the dark page.

    ../.venv-cutout/bin/python scripts/cutout-images.py            # everything
    ../.venv-cutout/bin/python scripts/cutout-images.py --dry-run  # report only
    ../.venv-cutout/bin/python scripts/cutout-images.py --only eve --only salem
    ../.venv-cutout/bin/python scripts/cutout-images.py --no-trim  # keep framing

Reads `research/ingest/originals/`, writes transparent WebP into `public/p/`,
and updates `src/lib/commerce/images.generated.json` in place. Originals are
never modified, so this is re-runnable and every knob can be retuned without
re-downloading anything.

Runs under the venv at `web/.venv-cutout`, not the system Python — Homebrew's
is externally managed and pip refuses to write to it. See HARVESTER.md.

── Why a segmentation model and not a colour key ──────────────────────────────

The first version did this with a flood fill inward from the frame edge, and it
got most of the way. It could not survive three cases, all common here:

  * **A white product on white.** Half this catalogue is white objects —
    cigarette packs, pouch tins, white disposables. A Salem pack and the paper
    behind it are the same colour, so a fill walks straight through the pack
    and hollows it out. Blocking the fill at the silhouette rescued most, but
    the Adjust MyCool device — white, soft-edged, beside a colourful box — still
    shipped as an empty outline.
  * **A backdrop that is not flat.** The Lucy Breakers shot sits on a pale
    gradient. Any single threshold either leaves a torn sheet of it behind or
    eats the tins.
  * **Background trapped inside the product.** The Woyu hookah's hose curls
    into a closed loop, and the backdrop inside that loop is not reachable from
    the frame edge, so it stayed as a white crescent floating over the page.

A saliency model has no trouble with any of them, because it answers "which
pixels are the product" rather than "which pixels are white".

── What the model gets wrong, and the fix ─────────────────────────────────────

On low-contrast subjects it hedges: the Camel Blue pack came back at a mean
alpha of 135, so the whole pack was half-transparent and the dark page showed
straight through it. The model is reliable about *where* the object is and
unreliable about *how opaque*, so only its mask is used — the interior is forced
fully opaque and its soft alpha is kept only in a two-pixel edge band.

Edges are then despilled. A pixel that is 40% product and 60% white backdrop was
baked into the JPEG as a pale blend; left alone it becomes a bright halo, which
on a dark page is the most obvious tell of a bad cutout.
"""

import argparse
import json
import os
import shutil

import numpy as np
from PIL import Image
from scipy import ndimage

try:
    from rembg import new_session, remove
except ImportError:  # pragma: no cover
    raise SystemExit(
        "rembg is missing. This script runs under web/.venv-cutout, not the\n"
        "system Python:\n\n"
        "    python3 -m venv .venv-cutout\n"
        "    .venv-cutout/bin/pip install rembg onnxruntime pillow numpy scipy\n"
        "    .venv-cutout/bin/python scripts/cutout-images.py\n"
    )

HERE = os.path.dirname(os.path.abspath(__file__))
WEB = os.path.dirname(HERE)
ORIGINALS = os.path.join(WEB, "..", "research", "ingest", "originals")
OUT_DIR = os.path.join(WEB, "public", "p")
IMAGE_MAP = os.path.join(WEB, "src", "lib", "commerce", "images.generated.json")

# isnet-general-use over the u2net default: better on packaging with printed
# text, which is most of this catalogue.
MODEL = "isnet-general-use"

# Above this the model says "product". Its confidence is not trusted — see the
# note above — only its extent.
MASK_LEVEL = 0.5
EDGE_BAND = 2          # px of the model's own soft alpha kept at the boundary

# Specks, as a share of the largest piece. Below this they are model noise.
SPECK_SHARE = 0.004

# Holes enclosed by the subject need judging one at a time, because two very
# different things look identical here.
#
#   * A Camel Blue pack is white card with a printed border. The model marks
#     the printing and calls the white face background, leaving the pack as an
#     empty frame with the page showing through the middle.
#   * The Woyu hookah's hose curls into a closed loop, and what shows through
#     that loop really is the backdrop. Filling it paints a white crescent over
#     the page.
#
# Two signals separate them. A hole bigger than the mask around it means the
# model traced an outline rather than found an object (Camel's hole is 173% of
# its mask; the hose loop is 20%). And the model's own confidence inside the
# hole is telling even when it is below the mask threshold: 0.45 for the Capri
# pack face it was unsure about, 0.02 for the hose loop it was sure about.
HOLE_BIG_SHARE = 0.6
HOLE_SOFT_LEVEL = 0.25

# Despill only against a backdrop we can actually identify: bright and even.
DESPILL_MIN_LUMA = 190
DESPILL_MAX_SPREAD = 30

# Sanity rails. Outside these the model has misread the picture — usually a
# marketing banner, where "the salient object" is not a meaningful question.
MIN_SUBJECT = 0.02
MAX_SUBJECT = 0.92

TRIM_PAD = 0.05
WEBP_QUALITY = 82

# Images the model reads as an outline rather than an object, where nothing
# separates the mistake from a correct answer automatically.
#
# Both are a pale pack carrying colourful printing: the model marks the print
# and drops the pack, and unlike the Camel case the missing area is not a hole
# enclosed by anything, so there is nothing to fill. Every automatic signal
# tried — the model's confidence in the missing region, the ratio of a
# flood-filled silhouette to the mask — puts them on the same side as the Woyu
# hookah's hose loop, which is a hole that genuinely should stay open.
#
# So they are named. They keep their backdrop and get a plate, which is
# unremarkable next to a product with its face punched out.
FORCE_PLATE = {
    "fasta-drop-50k-nicotine-vape": "model keeps only the red frame, box face drops out",
    "lucky-strike": "model keeps the roundel, the white pack body drops out",
}


def luma(a: np.ndarray) -> np.ndarray:
    return a[..., 0] * 0.299 + a[..., 1] * 0.587 + a[..., 2] * 0.114


def border_ring(shape, width=4) -> np.ndarray:
    h, w = shape
    m = np.zeros((h, w), bool)
    m[:width, :] = m[-width:, :] = True
    m[:, :width] = m[:, -width:] = True
    return m


def backdrop(rgb: np.ndarray):
    """The backdrop colour, if the frame has an identifiable flat one."""
    edge = rgb[border_ring(rgb.shape[:2])]
    bg = np.median(edge, axis=0)
    if luma(bg[None])[0] < DESPILL_MIN_LUMA:
        return None
    if float(np.median(np.abs(edge - bg).max(axis=-1))) > DESPILL_MAX_SPREAD:
        return None
    return bg


def already_transparent(img: Image.Image) -> bool:
    """Some sources ship a cutout already. Re-segmenting one is destructive:
    `convert("RGB")` throws its alpha away, so the model is handed whatever
    garbage sat behind the transparent pixels and bites chunks out of the
    product. Three `on!` tins came back with holes in their rims that way."""
    if img.mode not in ("RGBA", "LA") and not (
        img.mode == "P" and "transparency" in img.info
    ):
        return False
    return bool(np.asarray(img.convert("RGBA"))[..., 3].min() < 250)


def cutout(img: Image.Image, session):
    """Return (RGBA array, note) or (None, reason-it-was-declined)."""
    rgb = np.asarray(img.convert("RGB"), np.float32)
    soft = np.asarray(
        remove(img.convert("RGB"), session=session).convert("RGBA"), np.float32
    )[..., 3] / 255.0

    mask = soft > MASK_LEVEL
    if not mask.any():
        return None, "model found no subject"

    filled = ndimage.binary_fill_holes(mask)
    holes = filled & ~mask
    if holes.any():
        hlab, hn = ndimage.label(holes)
        mask_size = mask.sum()
        for i in range(1, hn + 1):
            h = hlab == i
            outline_only = h.sum() > HOLE_BIG_SHARE * mask_size
            model_unsure = soft[h].mean() > HOLE_SOFT_LEVEL
            if outline_only or model_unsure:
                mask |= h

    # Drop specks before measuring anything, so a stray fleck cannot make a
    # failed segmentation look like a successful one.
    labels, n = ndimage.label(mask)
    if n > 1:
        sizes = ndimage.sum(mask, labels, range(1, n + 1))
        for i, sz in enumerate(sizes, start=1):
            if sz < SPECK_SHARE * sizes.max():
                mask[labels == i] = False

    subject = float(mask.mean())
    if subject < MIN_SUBJECT:
        return None, f"nothing left ({subject:.1%} kept)"
    if subject > MAX_SUBJECT:
        return None, f"no background found ({subject:.1%} kept)"

    # Force the interior opaque, keep the model's soft alpha only at the rim.
    # This is the whole reason its alpha is not used directly: on a pale pack it
    # hedges at ~0.5 across the entire object and the page shows through.
    inner = ndimage.binary_erosion(mask, iterations=EDGE_BAND)
    outer = ndimage.binary_dilation(mask, iterations=EDGE_BAND)
    alpha = np.zeros_like(soft)
    alpha[outer] = np.clip(soft[outer], 0.0, 1.0)
    alpha[inner] = 1.0
    alpha = ndimage.gaussian_filter(alpha, sigma=0.5)

    bg = backdrop(rgb)
    note = f"{subject:.0%} subject"
    if bg is None:
        out = rgb
        note += ", no despill"
    else:
        # F = (C - (1-a)·bg) / a — what the pixel would have been without the
        # backdrop blended into it.
        a = alpha[..., None]
        out = np.clip(
            np.where(a > 0.05, (rgb - (1.0 - a) * bg) / np.maximum(a, 0.05), rgb),
            0, 255,
        )

    return np.dstack([out, alpha * 255.0]).astype(np.uint8), note


def trim(rgba: np.ndarray) -> np.ndarray:
    """Crop to the subject and recentre on a square, so a grid reads evenly."""
    ys, xs = np.nonzero(rgba[..., 3] > 10)
    if not len(ys):
        return rgba
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    sub = rgba[y0:y1, x0:x1]
    sh, sw = sub.shape[:2]
    side = int(max(sh, sw) * (1 + 2 * TRIM_PAD))
    canvas = np.zeros((side, side, 4), np.uint8)
    oy, ox = (side - sh) // 2, (side - sw) // 2
    canvas[oy:oy + sh, ox:ox + sw] = sub
    return canvas


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--no-trim", action="store_true")
    ap.add_argument("--only", action="append", default=[])
    ap.add_argument("--force", action="store_true",
                    help="re-segment even images whose output is already current")
    args = ap.parse_args()

    imap = json.load(open(IMAGE_MAP))
    session = new_session(MODEL)

    done, declined, skipped = [], [], []
    unchanged = 0
    before = after = 0

    for slug, rec in sorted(imap.items()):
        if args.only and slug not in args.only:
            continue
        # Resolve by slug, never by the record's current filename — that name
        # points at this script's own output once it has run once.
        found = [f for f in os.listdir(ORIGINALS) if os.path.splitext(f)[0] == slug]
        if not found:
            skipped.append((slug, "no original on disk"))
            continue
        # Newest wins. fetch-images.ts keeps one original per slug, but if a
        # stale one ever survives, picking by listdir order silently ships it.
        name = max(found, key=lambda f: os.path.getmtime(os.path.join(ORIGINALS, f)))
        path = os.path.join(ORIGINALS, name)

        # Inference is a few seconds an image, so skip work that is already
        # done: fetch-images.ts only rewrites an original when the bytes
        # actually changed, which makes the timestamp a reliable signal.
        out_existing = os.path.join(OUT_DIR, rec["src"].split("/")[-1])
        if (
            not args.force
            and (rec.get("cutout") or rec.get("plate"))
            and os.path.exists(out_existing)
            and os.path.getmtime(out_existing) >= os.path.getmtime(path)
        ):
            unchanged += 1
            continue

        img = Image.open(path)
        if slug in FORCE_PLATE:
            rgba, note = None, FORCE_PLATE[slug]
        elif already_transparent(img):
            rgba = np.asarray(img.convert("RGBA")).copy()
            note = "already transparent, passed through"
        else:
            rgba, note = cutout(img, session)

        if rgba is None:
            declined.append((slug, note))
            if not args.dry_run:
                # Restore the untouched original, so a decline always undoes an
                # earlier run rather than leaving last run's cutout in place
                # with a record that no longer describes it.
                out = os.path.join(OUT_DIR, name)
                if not os.path.exists(out):
                    shutil.copy2(path, out)
                stale_name = rec["src"].split("/")[-1]
                if stale_name != name and os.path.exists(os.path.join(OUT_DIR, stale_name)):
                    os.remove(os.path.join(OUT_DIR, stale_name))
                rec["src"] = f"/p/{name}"
                rec.pop("cutout", None)
                rec["bytes"] = os.path.getsize(out)
                # A declined image keeps whatever backdrop it came with, so the
                # page has to put a plate behind it. Record which kind: a white
                # plate under an already-black product shot looks just as broken
                # as no plate under a white one.
                edge = np.asarray(img.convert("RGB"), np.float32)[
                    border_ring((img.height, img.width))
                ]
                rec["plate"] = "light" if float(np.median(luma(edge))) > 150 else "dark"
            continue

        if not args.no_trim:
            rgba = trim(rgba)

        out_name = f"{slug}.webp"
        before += os.path.getsize(path)
        if not args.dry_run:
            Image.fromarray(rgba, "RGBA").save(
                os.path.join(OUT_DIR, out_name), "WEBP",
                quality=WEBP_QUALITY, method=6,
            )
            after += os.path.getsize(os.path.join(OUT_DIR, out_name))
            if name != out_name and os.path.exists(os.path.join(OUT_DIR, name)):
                os.remove(os.path.join(OUT_DIR, name))
            rec["src"] = f"/p/{out_name}"
            rec["cutout"] = True
            rec.pop("plate", None)
            rec["bytes"] = os.path.getsize(os.path.join(OUT_DIR, out_name))
        done.append((slug, note))

    if not args.dry_run:
        json.dump(imap, open(IMAGE_MAP, "w"), indent=1)

    print(f"cut out    {len(done)}")
    print(f"unchanged  {unchanged}")
    print(f"declined   {len(declined)}")
    print(f"skipped    {len(skipped)}")
    if after:
        print(f"size       {before // 1024} KB -> {after // 1024} KB")
    if declined:
        print("\ndeclined — left exactly as they were:")
        for slug, why in declined:
            print(f"  {slug:44} {why}")
    for slug, why in skipped:
        print(f"  ! {slug:44} {why}")
    if args.dry_run:
        print("\n(dry run — nothing written)")


main()
