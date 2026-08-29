# Where the shop actually is

Resolved 2026-08-26 after getting it wrong repeatedly. Keep this file — the
answer is not obvious and the obvious sources disagree.

## The answer

```
Puff Vegas · Suite 611, 612, 613 · Grand Bazaar Shops
3649 S Las Vegas Blvd, Las Vegas, NV 89109

geo: 36.113777, -115.172005
```

Used in `web/src/app/layout.tsx` (JSON-LD `geo` **and** `areaServed.geoMidpoint`)
and as `SHOP` in `research/ingest/walk-times.py`. Keep those three in sync.

## Why not Google's pin

Google's **"Grand Bazaar Shops"** pin is `36.1144636, -115.1724136`. It is:

- **85 m** from the suite, and
- **outside the mall's own OSM footprint** (way `115557694`).

It marks the mall's Boulevard frontage, not a tenant. Do not copy it into
structured data.

## How it was derived

1. The mall's own retailer directory lists Puff Vegas as **Suite 611, 612, 613**
   — <http://grandbazaarshops.com/retailers/>
2. Its [directory map](http://grandbazaarshops.com/view-directory-map/) draws 612
   and 613 in the **600-series row along the mall's southern edge**, between 610
   and 614. (Map image: `.../wp-content/uploads/2025/05/Directory-Map-05.2025-2.jpg`)
3. That row was georeferenced from the two suites OSM has surveyed **with unit
   numbers**: Subway (601) and Ben & Jerry's (606). They are 13.0 m apart in
   exactly the direction and spacing the map draws.
4. **Independent check:** the same fit places the map's Ole Red block within
   **16 m** of Ole Red's own OSM node, and the cross-axis prediction agrees with
   OSM to **0.4 m**. The fit is not self-confirming.
5. **Corroboration:** street numbering. The whole 600 row is `3649`, south of
   Duck Donuts (3615), IT'SUGAR (3623) and Ole Red (3627). Numbers increase going
   south on the Boulevard.

## Neighbours (from the mall directory)

`610` and `614` either side. Then 609 Happy Lemon · 616 World Crawl Las Vegas ·
617 Dirt Dog · 606 Ben & Jerry's · 608 Dirt Dog Bar · 601 Subway.

**Ole Red is suite 700**, at the mall's north-west end — 60–70 m away by
measurement, "at most 100 m" per the owner, and the whole walk is inside Grand
Bazaar Shops. It remains the right landmark for `/pickup`: it is the
most visible thing from the Strip. The copy says to walk in past the neon guitar
and continue to the 600s. Don't downgrade it to "next door" (implies adjacency)
or escalate it to "the wrong end" (it isn't).

---

## Walk times

`research/ingest/walk-times.py` → `web/src/lib/walks.ts`, read by both
`components/Marquee.tsx` and `/pickup`.

### The model

Straight-line distance × detour factor. **Not OSRM.**

```
DETOUR = 1.58      # 161 m Google / 102 m straight line
PACE   = 80.0      # m/min — 161 m in 2 min
```

Calibrated against one Google walking route the owner supplied: the Starbucks on
Bellagio's Boulevard frontage → Grand Bazaar Shops, over the Las Vegas Blvd
Overpass. 0.1 mi, 2 min.

### Why OSRM was abandoned

It walks the overpass's full ramp geometry — thirteen segments of 10–77 m,
switchbacks and landings — where Google takes the direct line. On Strip bridge
crossings it **over-counts by about 2.75×**, and nearly every landmark here is
across a bridge, so every published figure was inflated. Bellagio came out at 8
minutes; the real answer is 3.

**The owner said 3 minutes from Bellagio and was right. It took two corrections
and a screenshot to accept that.** Weight local knowledge accordingly.

### 🔴 The table is stale and deliberately not regenerated

`SHOP` moved 85 m when the suite was pinned properly, which shifts **9 of the 10**
published figures. They have not been republished, because `NEAREST` in that
script is hand-estimated and at least one entry is provably wrong — its "Ole Red"
point sits 45 m from where OSM puts Ole Red. Regenerating against a bad
access-point table only publishes a differently-wrong answer.

**`NEAREST` needs surveying before the table is republished.** Bellagio comes out
at 3 minutes either way, so the one owner-verified figure is safe meanwhile.
