# Open decisions

Things that are blocked on a human, not on code. Roughly in order of how much
they hold back.

---

## Nothing is deployed

**puffvegas.us still serves the old Ecwid storefront.** Everything in `web/` runs
only on localhost. No hosting, domain cutover, or redirect map has been decided.
The old storefront's URLs should be inventoried before cutover — `research/ingest/`
has crawl output that can seed a redirect table.

## Shop decisions

| Item | Detail |
|---|---|
| **559 products** | One POS "sell online" flag away from publishing. No code change needed — someone has to decide they should be online. Remember: **the flag gets flipped in Lightspeed by the shop; we never edit the POS ourselves.** |
| **27 grey-inventory items** | Need a policy call on whether they are sold online at all. |
| **`rhino`, `xxx`** | Two models a human needs to look at directly. |
| **3 products with no image** | `butane`, `mpb-hookah-bowl`, `vape-juice` — all generic SKUs. Needs a decision on what to even photograph. |
| **Elf Bar** | Absent from both the POS export and the live site. Deliberate, or a gap in the catalogue? |
| **`meet` points in `web/src/lib/hotels.ts`** | Left empty on purpose. Every resort handles outside delivery differently, several change the rule by time of night, and none of it is published anywhere verifiable. Inventing "meet at the north valet" would read as authoritative and strand a driver and a customer at two different doors. The shop should fill these in as it learns each property. |
| **Night-shoot photography** | `/pickup` has three labelled empty placeholders: *Ole Red from the Boulevard · the turn into Grand Bazaar · our door*. Most people arrive in the dark and the Strip looks nothing like its daytime self. Placeholders are labelled as placeholders rather than filled with stock. |

## The homepage hero 🔴

Both files came from a **third-party YouTube compilation** ("The Fountains of
Bellagio", `dG0pQgTDB60`), pulled via `yt-dlp` by `scripts/cut-hero-video.py`.

1. **Weight — ✅ settled.** `public/hero/puff-night.mp4` has been deleted. The
   autoplaying 7.3 MB loop was by far the heaviest asset on a site whose whole
   thesis is a cold Strip connection at 3 a.m. on a phone. The poster already
   carried the LCP, so nothing load-bearing was lost.
2. **Rights — 🔴 still open, and deleting the video did not fix it.**
   `public/hero/puff-night.webp` is a **still frame from that same footage** and
   is now the entire hero. It remains someone else's copyrighted material used
   as commercial advertising, with Bellagio and Caesars signage identifiable in
   it. Needs either a licence or replacement with footage the shop owns — a
   night shoot of this block would also serve the `/pickup` placeholders.

   Nothing is deployed yet (puffvegas.us still serves Ecwid), so there is no
   live exposure — but this must be resolved before launch, not at launch.

## Needs counsel 🔴

- **21 CFR 1143.3(b)(2) — the 20 %-of-advertisement area test** applied to a
  scrolling browse grid. See [COMPLIANCE.md](COMPLIANCE.md).
- **Square's written position on web-originated, door-paid orders.** Gates any
  future web checkout.
- **NRS 370.585(4)(b) and delivery.** Currently handled conservatively
  (cigarettes are pickup-only); a definitive read would settle it.

## Engineering, unblocked but not done

- **Republish the walk-times table.** `SHOP` moved 85 m; 9 of 10 figures shift.
  Blocked on surveying `NEAREST` in `research/ingest/walk-times.py`, which is
  hand-estimated and has at least one provably wrong entry. See
  [LOCATION.md](LOCATION.md).
- **459 `unknown`-class models** need classification rules (or a decision that
  they stay off).
