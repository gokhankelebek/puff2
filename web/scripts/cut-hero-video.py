#!/usr/bin/env python3
"""
Cut the homepage hero loop from YouTube dG0pQgTDB60.

    ../.venv-hero/bin/python scripts/cut-hero-video.py              # download + cut
    ../.venv-hero/bin/python scripts/cut-hero-video.py --probe      # contact sheet
    ../.venv-hero/bin/python scripts/cut-hero-video.py --skip-download

The source is a 6:46 compilation titled "The Fountains of Bellagio". Most of
it is not this shop: daylight lake views, Via Bellagio luxury shops, a
Niagara selfie, a canyon hike. KEEP below is the night footage of *this*
block — Flamingo Rd, Grand Bazaar / Flamingo across the lake, and the
sidewalk looking at the fountains (the view from our side of the Strip).

Edit KEEP and re-run. Do not hand-edit public/hero/puff-night.mp4.

venv (once):

    python3 -m venv .venv-hero
    .venv-hero/bin/pip install yt-dlp pillow
"""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CACHE = Path(__file__).resolve().parent / ".hero-cache"
PROBE = CACHE / "probe"
PUBLIC = ROOT / "public" / "hero"
YOUTUBE_ID = "dG0pQgTDB60"
SOURCE_URL = f"https://www.youtube.com/watch?v={YOUTUBE_ID}"
SOURCE = CACHE / f"{YOUTUBE_ID}.mp4"
OUT_MP4 = PUBLIC / "puff-night.mp4"
OUT_POSTER = PUBLIC / "puff-night.webp"

# (start, end, why we keep it)
# Times are source timestamps. Everything else is dropped.
KEEP: list[tuple[str, str, str]] = [
    ("00:00.00", "00:02.80", "Strip sidewalk, Bellagio fountains at night"),
    ("00:42.00", "01:02.00", "Flamingo Rd / this block, then Flamingo + Grand Bazaar"),
    ("02:30.00", "02:42.00", "Paris / Eiffel at night — across the lake from the shop"),
]

# Frame used for the still poster (must land inside a KEEP range).
POSTER_AT = "00:51.00"

FFMPEG = shutil.which("ffmpeg") or "/opt/homebrew/bin/ffmpeg"
FFPROBE = shutil.which("ffprobe") or "/opt/homebrew/bin/ffprobe"


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--skip-download", action="store_true")
    ap.add_argument("--probe", action="store_true", help="Write a timestamped contact sheet, then stop")
    ap.add_argument("--keep", action="append", metavar="START,END", help="Override KEEP (repeatable). Times as MM:SS or seconds.")
    args = ap.parse_args()

    if not Path(FFMPEG).exists():
        sys.exit("ffmpeg not found")

    CACHE.mkdir(parents=True, exist_ok=True)
    PUBLIC.mkdir(parents=True, exist_ok=True)

    if not args.skip_download:
        download()
    if not SOURCE.exists():
        sys.exit(f"missing source: {SOURCE}")

    if args.probe:
        probe()
        return 0

    keep = KEEP
    if args.keep:
        keep = []
        for raw in args.keep:
            start, end = raw.split(",", 1)
            keep.append((start.strip(), end.strip(), "cli"))

    cut(keep)
    poster()
    size = OUT_MP4.stat().st_size / (1024 * 1024)
    dur = duration(OUT_MP4)
    print(f"wrote {OUT_MP4.relative_to(ROOT)}  {dur:.1f}s  {size:.1f} MB")
    print(f"wrote {OUT_POSTER.relative_to(ROOT)}")
    return 0


def download() -> None:
    yt = ROOT / ".venv-hero" / "bin" / "python"
    if not yt.exists():
        sys.exit(
            "missing .venv-hero — python3 -m venv .venv-hero && "
            ".venv-hero/bin/pip install yt-dlp pillow"
        )
    if SOURCE.exists() and SOURCE.stat().st_size > 1_000_000:
        print(f"source already at {SOURCE}")
        return
    run(
        [
            str(yt),
            "-m",
            "yt_dlp",
            "-f",
            "bv[height<=1080]+ba/b[height<=1080]",
            "--no-playlist",
            "--merge-output-format",
            "mp4",
            "-o",
            str(SOURCE.with_suffix(".%(ext)s")),
            SOURCE_URL,
        ]
    )


def probe() -> None:
    PROBE.mkdir(parents=True, exist_ok=True)
    for old in PROBE.glob("f*.jpg"):
        old.unlink()
    run(
        [
            FFMPEG,
            "-y",
            "-i",
            str(SOURCE),
            "-vf",
            "fps=1/3,scale=480:-1,"
            "drawtext=fontfile=/System/Library/Fonts/Helvetica.ttc:"
            "text='%{pts\\:hms}':x=8:y=8:fontsize=20:fontcolor=white:"
            "box=1:boxcolor=black@0.7",
            str(PROBE / "f%04d.jpg"),
        ]
    )
    from PIL import Image, ImageDraw, ImageFont

    files = sorted(PROBE.glob("f*.jpg"))
    cols, thumb_w, pad = 10, 192, 4
    thumbs: list[tuple[int, Image.Image]] = []
    for p in files:
        n = int(p.stem[1:])
        t = (n - 1) * 3
        im = Image.open(p).convert("RGB")
        h = int(im.height * thumb_w / im.width)
        thumbs.append((t, im.resize((thumb_w, h))))
    thumb_h = thumbs[0][1].height
    rows = (len(thumbs) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * (thumb_w + pad) + pad, rows * (thumb_h + 18) + 18), (12, 12, 12))
    draw = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 12)
    except OSError:
        font = ImageFont.load_default()
    for i, (t, im) in enumerate(thumbs):
        r, c = divmod(i, cols)
        x = pad + c * (thumb_w + pad)
        y = 16 + r * (thumb_h + 18)
        sheet.paste(im, (x, y))
        m, s = divmod(t, 60)
        draw.text((x + 4, y - 14), f"{m:02d}:{s:02d}", fill=(255, 220, 80), font=font)
    out = CACHE / "contact.jpg"
    sheet.save(out, quality=85)
    print(f"wrote {out}  ({len(files)} frames @ 3s)")
    print("edit KEEP in this script, then re-run without --probe")


def cut(keep: list[tuple[str, str, str]]) -> None:
    parts = []
    for start, end, why in keep:
        a, b = seconds(start), seconds(end)
        if b <= a:
            sys.exit(f"bad KEEP {start} → {end}")
        parts.append((a, b, why))
        print(f"  keep {start}–{end}  {why}")

    chains = []
    labels = []
    for i, (a, b, _) in enumerate(parts):
        chains.append(f"[0:v]trim=start={a}:end={b},setpts=PTS-STARTPTS[v{i}]")
        labels.append(f"[v{i}]")
    n = len(parts)
    # 1280-wide is enough for a cover-crop hero and keeps the loop small
    # enough to sit on the homepage. CRF 28 is the quality/size trade.
    filters = (
        ";".join(chains)
        + f";{''.join(labels)}concat=n={n}:v=1:a=0[cat];"
        + "[cat]scale=1280:-2:flags=lanczos,fps=30,format=yuv420p[v]"
    )

    tmp = CACHE / "puff-night.tmp.mp4"
    run(
        [
            FFMPEG,
            "-y",
            "-i",
            str(SOURCE),
            "-filter_complex",
            filters,
            "-map",
            "[v]",
            "-an",
            "-c:v",
            "libx264",
            "-preset",
            "medium",
            "-crf",
            "28",
            "-pix_fmt",
            "yuv420p",
            "-movflags",
            "+faststart",
            str(tmp),
        ]
    )
    tmp.replace(OUT_MP4)


def poster() -> None:
    run(
        [
            FFMPEG,
            "-y",
            "-ss",
            str(seconds(POSTER_AT)),
            "-i",
            str(SOURCE),
            "-frames:v",
            "1",
            "-vf",
            "scale=1536:-2:flags=lanczos",
            str(OUT_POSTER),
        ]
    )


def duration(path: Path) -> float:
    out = subprocess.check_output(
        [FFPROBE, "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
        text=True,
    )
    return float(out.strip())


def seconds(ts: str) -> float:
    ts = ts.strip()
    if ":" not in ts:
        return float(ts)
    parts = [float(p) for p in ts.split(":")]
    if len(parts) == 2:
        m, s = parts
        return m * 60 + s
    h, m, s = parts
    return h * 3600 + m * 60 + s


def run(cmd: list[str]) -> None:
    print("+", " ".join(cmd[:8]), "…" if len(cmd) > 8 else "")
    subprocess.run(cmd, check=True)


if __name__ == "__main__":
    raise SystemExit(main())
