# Data pipeline

Everything the site renders is generated. Nothing is hand-edited in
`src/lib/commerce/*.generated.json` — fix the **importer** and re-run.

## Hard rules

1. **Never change anything in Lightspeed.** Catalogue problems — bad titles,
   wrong categories, missing brands — get fixed in our importer, not the POS.
2. **We own slugs and images.** The shop is leaving Lightspeed. Nothing may key
   on a vendor ID; the slug is ours and must stay stable.
3. **Vendor image rights are settled** — permission has been granted. Don't re-raise it.

---

## The chain

```
research/lightspeed-product-export.csv          6,305 SKU rows
        │  npx tsx scripts/import-lightspeed.ts ../research/lightspeed-product-export.csv
        ▼
src/lib/commerce/catalog.generated.json         1,415 product MODELS  (175 publishable)
        │  npx tsx scripts/fetch-images.ts
        ▼
web/public/p/*                                  172 images + images.generated.json
        │  python3 scripts/cutout-images.py      (needs .venv-cutout)
        ▼
                                                170 cut out, 2 plated
        │  npx tsx scripts/build-search-index.ts
        ▼
src/lib/search-index.ts                         ~48 KB
        │  npx tsx scripts/build-ecwid-redirects.ts
        ▼
src/lib/ecwid-redirects.generated.json          old Ecwid URLs → 301 map (next.config.ts)
```

Re-run the redirect builder after the importer, so a product that starts
publishing starts receiving its old Ecwid URL. **Restart the dev server after**
— next.config.ts is not hot-reloaded.

`scripts/match-ecwid-titles.ts` proposes title matches against the old Ecwid
storefront; `--apply` writes them. Run it *before* the importer when reconciling.

---

## Where the 6,305 → 175 goes

| Stage | Count |
|---|---|
| SKU rows in the export | 6,305 |
| Grouped into models | 1,415 |
| **Published** | **175** |

Of the 1,240 unpublished:

- **559** are one POS "sell online" flag away from publishing — no code change needed.
- **459** classify as `unknown` (fail-closed) and need a rule or a human.
- **27** are grey inventory awaiting a policy call.
- **2** (`rhino`, `xxx`) need a human to look at them.

Published breakdown by regulatory class:
`ends 74 · cigar 23 · pouch 23 · cigarette 17 · accessory 19 · rollYourOwn 13 · hookah 6`

161 of 175 carry a brand; all 175 carry a price.

---

## Images

**172 of 175 published products have an image.** Missing, all generic SKUs needing
a shop decision on what to even photograph:

- `butane`
- `mpb-hookah-bowl`
- `vape-juice`

### Background removal — `scripts/cutout-images.py`

rembg `isnet-general-use` ONNX saliency segmentation in a dedicated venv
(`web/.venv-cutout`). **170 cut out, 2 deliberately plated.**

An earlier flood-fill approach hollowed out white products (Salem, Capri, Eve,
Virginia Slims) into empty outlines. It was replaced wholesale — don't reintroduce it.

Tuning constants and why they exist:

| Constant | Purpose |
|---|---|
| `MASK_LEVEL = 0.5` | translucent masks on low-contrast packs (Camel came out at mean alpha 135) |
| `EDGE_BAND = 2` | |
| `HOLE_BIG_SHARE = 0.6`, `HOLE_SOFT_LEVEL = 0.25` | the model traces *printing* rather than packaging; holes are judged by size-vs-mask and model confidence |
| `FORCE_PLATE` | names the two products the model misreads — these get a plate instead |

Guards learned the hard way, all now in the script:

- `already_transparent()` pass-through — re-segmenting a transparent source made
  `convert("RGB")` discard alpha and bite chunks out of three tins.
- **One original per slug.** A stale watermarked PNG kept shipping after a WebP
  replacement because `listdir` order picked it.
- A transient fetch failure must fall back to the cached original, not delete it.

### Sourcing gotchas

- **Ecwid's JSON-LD `ImageObject.url` is the product *page*, not the image.**
  Read `contentUrl`. Reading `url` silently saved seven HTML documents as `.jpg`
  and *replaced* seven good POS images with them. `fetch-images.ts` now
  magic-byte-sniffs every download — a HEAD request confirms a file exists
  without decoding it, which is exactly how this got missed the first time.
- The storefront WAF needs **2 workers + 0.7 s delay** or it blocks the crawl.
- **Check for watermarks visually.** The first Spaceman and Pyne Pod images
  carried visible "ELEMENT VAPE" branding and had to be re-sourced.

---

## Homepage hero

`public/hero/storefront-{640,1254}.webp` — the shop's own storefront, supplied
by the owner. Native art is 1254 square; the two widths are served by `srcset`
because the panel is roughly 640px on a phone and 700px on desktop, and the
large file is 280KB. Nothing above 1254 exists on purpose: the source has no
more detail and upscaling only inflates the download.

The earlier hero is gone. `puff-night.mp4` was removed for weight, and
`puff-night.webp` — a still from the same unlicensed third-party compilation —
was deleted once the hero rebuild orphaned it. `scripts/cut-hero-video.py`
remains but is on no build path and produces nothing the site uses.

## Search

`src/lib/search.ts` holds the scorer, shared by the server page and the client
typeahead so the two cannot disagree. `search-index.ts` is generated.

Two bugs worth not repeating:

- `toDoc` caps flavours at 12, which made every product look equally generic and
  flattened ranking. The true count is carried separately as `nf`.
- Indexing a second copy of the catalogue with the **filtered** loop counter
  shifted every department by one and filed Acid cigars under accessories
  (`cigar` returned 25 client / 49 server). Read fields off the model directly.

There is **no Elf Bar** in either the POS export or the live site. Searching for
it correctly returns nothing — that is not a bug.
