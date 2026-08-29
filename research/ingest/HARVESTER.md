# Where product images come from

Coverage: **172 of 175 live products (98%)**. 170 have had their background
removed and render with no container; 2 keep theirs on a plate.

Three steps, always in this order:

```
cd web \
  && npx tsx scripts/fetch-images.ts \
  && .venv-cutout/bin/python scripts/cutout-images.py \
  && npx tsx scripts/build-search-index.ts
```

The third step regenerates `src/lib/search-index.ts`, the trimmed catalogue the
search typeahead scores against in the browser. It reads both the catalogue and
the image map, so it runs last.

The first two are incremental, so re-running after a small change costs seconds
rather than reprocessing all 172.

**Step one** reads every source below, keeps the highest-priority image per
product, caches the untouched download in `originals/`, writes
`public/p/<slug>.<ext>`, and regenerates `missing-images.tsv` with whatever is
still bare.

**Step two** lifts each product off its backdrop and rewrites `public/p` as
transparent WebP. It always works from `originals/`, so it is re-runnable and
undoes itself. It skips any image whose output is already newer than its
original; pass `--force` after changing the algorithm.

Step one only rewrites an original when the downloaded bytes actually changed,
which is what makes that timestamp check trustworthy. It also falls back to the
cached original when a vendor host is unreachable, so a flaky network cannot
quietly delete a picture the shop already has.

## Sources, in priority order

| Priority | Provenance   | Where it lives                     | Count |
|---------:|--------------|------------------------------------|------:|
| 4        | `own`        | `images/<slug>.<ext>`              | 0     |
| 3        | `supplier`   | `supplier.tsv`, `harvest/`         | 6     |
| 2        | `ecwid`      | `ecwid-crawl.tsv` + two older files| 161   |
| 1        | `lightspeed` | `latest.tsv`                       | 5     |

A higher priority always wins, so dropping a real photo shoot into `images/`
named `<slug>.jpg` quietly retires the interim art. Nothing needs deleting.

Every entry records its provenance, so "where did this picture come from and on
what basis are we using it" is always answerable.

## The storefront crawl — the main source

```
python3 crawl-storefront.py     # writes ecwid-crawl.tsv + ecwid-crawl.json
```

Walks `puffvegas.us/sitemap.xml` and reads each product page's JSON-LD
`Product.name` and image. **Use the JSON-LD name, not `og:title`** — Ecwid's
`og:title` is an SEO string ("Flum UT Bar 50K Disposable Vape $36.99 — Puff
Vegas"), and keying on it is what left a third of the first harvest unmatched.

Two things to know before re-running it:

- **Rate limits.** The site sits behind a WAF. A 12-way run tripped it outright
  and 4-way still drew 429s on 62 of 222 pages. Two workers with a 0.7s pause
  gets a clean sweep in about four minutes.
- **It resumes.** Pages already in `ecwid-crawl.json` are skipped, so a partial
  run is never wasted.

`ecwid-scrape.tsv` and `ecwid-matched.tsv` are the earlier browser-era harvest,
kept only because they still cover a few pages the sitemap omits.

## Reconciling names

```
cd web && npx tsx scripts/match-ecwid-titles.ts          # propose
cd web && npx tsx scripts/match-ecwid-titles.ts --apply  # write
```

Scores cleaned storefront titles against products that still have no image, and
requires both a minimum similarity and a clear win over the runner-up. It is
deliberately unwilling to guess: it refused the Foger and Off Stamp kit/pod
pairs, which are genuinely different SKUs with near-identical names. Those went
into `ecwid-matched.tsv` by hand instead.

## Vendor pages, for anything the storefront never listed

```
python3 vendor-image.py "<Product Name>" <url> [<fallback url> ...]
```

Prints a `Product Name ~~ URL` line for `supplier.tsv`. Give it the official
brand page first and a distributor behind it; it stops at the first URL that
yields something that is actually a photograph. Brand sites that render client
side (spacemans.com) return nothing useful, which is why the fallbacks matter.

Only run this against vendors who have given permission. Everything it produces
is recorded with `supplier` provenance.

## Network

This all assumes a network that can reach tobacco and vape hosts. On the
school connection it could not — `curl` returned nothing for every vendor site
*and* for `puffvegas.us` itself, which is what the `window.name` browser bridge
in git history was working around. On a home connection everything resolves
normally and none of that is needed.

## Background removal

```
cd web
python3 -m venv .venv-cutout                                    # first time only
.venv-cutout/bin/pip install rembg onnxruntime pillow numpy scipy

.venv-cutout/bin/python scripts/cutout-images.py                # incremental
.venv-cutout/bin/python scripts/cutout-images.py --force        # after a tuning change
.venv-cutout/bin/python scripts/cutout-images.py --only eve     # one product
.venv-cutout/bin/python scripts/cutout-images.py --dry-run
```

It needs its own venv because Homebrew's Python is externally managed and pip
refuses to install into it. The venv is ~460MB and gitignored; the model
(~180MB) downloads to `~/.rembg` on first run.

### Why a model and not a colour key

The first version flood-filled inward from the frame edge. It handled most of
the catalogue and could not handle three things, all common here:

- **A white product on white.** Half these products are white objects —
  cigarette packs, pouch tins, white disposables. A Salem pack and the paper
  behind it are the same colour, so the fill walks through the pack and hollows
  it out. Blocking the fill at the silhouette saved most of them; the Adjust
  MyCool device still shipped as an empty outline.
- **A backdrop that is not flat.** The Lucy Breakers shot sits on a pale
  gradient. Every threshold either left a torn sheet of it behind or ate the
  tins.
- **Background trapped inside the product.** The Woyu hookah's hose curls into
  a closed loop; what shows through it is unreachable from the frame edge, so
  it stayed as a white crescent floating over the page.

`isnet-general-use` handles all three, because it answers "which pixels are the
product" instead of "which pixels are white".

### Three things the model gets wrong

Its raw output is not usable as-is. Each of these was a visible defect on the
page before it was corrected:

1. **It hedges on low-contrast subjects.** The Camel Blue pack came back at a
   mean alpha of 135 — half transparent, with the dark page showing through.
   The model is reliable about *where* the object is and unreliable about *how
   opaque*, so only its mask is used: the interior is forced fully opaque and
   its soft alpha kept only in a two-pixel edge band.

2. **It traces printing, not packaging.** On a white pack with a printed
   border it marks the print and calls the white face background, leaving an
   empty frame. Enclosed holes are therefore judged one at a time — but a hole
   is not always wrong, because the hookah's hose loop is a real one. Two
   signals separate them: a hole *larger than the mask around it* means an
   outline was traced rather than an object found (Camel's is 173% of its mask,
   the hose loop 20%), and the model's confidence inside the hole is telling
   even below the mask threshold (0.45 for the Capri face it was unsure about,
   0.02 for the hose loop it was sure about).

3. **It does not despill.** A pixel that is 40% product and 60% white backdrop
   was baked into the JPEG as a pale blend. Left alone it becomes a bright halo
   — the most obvious tell of a bad cutout on a dark page.

### Plates, and the two named exceptions

An image the model misreads is restored to its original and tagged
`plate: "light"` or `plate: "dark"` in `images.generated.json`; the page puts a
rounded plate behind it, matched to the picture. A white plate under an
already-black product shot looks exactly as broken as no plate under a white
one.

Two are named explicitly in `FORCE_PLATE`, because nothing separates their
failure from a correct answer automatically:

| Product | Why |
|---|---|
| `fasta-drop-50k-nicotine-vape` | Model keeps only the red frame; the box face drops out |
| `lucky-strike` | Model keeps the roundel; the white pack body drops out |

Both are a pale pack carrying colourful printing, and unlike the Camel case the
missing area is not enclosed by anything, so there is nothing to fill. Every
automatic signal tried — the model's confidence in the missing region, the
ratio of a flood-filled silhouette to the mask — puts them on the same side as
the Woyu hookah's hose loop, which is a hole that genuinely should stay open. A
plate is unremarkable next to a product with its face punched out.

`spaceman-sp40000-puff` was a third entry until a plain single-device shot
replaced the SMOK marketing banner it had been standing on. Fixing the source
image beat tuning the algorithm — worth trying first when a cutout looks wrong.

### Watermarks

Check any new vendor URL for a retailer watermark before adding it. The first
Spaceman and Pyne Pod images came off Element Vape's CDN with "ELEMENT VAPE"
baked into the picture, and it was only caught by looking at the results.

## Still bare (3)

| Product | Why |
|---|---|
| `Butane` | Generic unbranded SKU — no product to photograph |
| `Vape-Juice` | A catch-all line item, not a real product |
| `Mpb Hookah bowl` | "Mpb" is a shop-internal abbreviation, not a findable brand |

All three want a decision from the shop rather than more searching: either a
phone photo on the counter, or dropping them from the published catalogue.
