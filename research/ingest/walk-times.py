#!/usr/bin/env python3
"""
Walking times from the shop to Strip landmarks.

    python3 walk-times.py        # prints the table and the WALKS array

── Read this before changing the method ───────────────────────────────────────

The first version of this routed every landmark on OSRM's foot profile over OSM
data. It was wrong, badly and systematically, and it took the shop owner telling
me twice before I checked it properly.

The ground truth is one Google Maps walking route the owner sent, from the
Starbucks on Bellagio's Boulevard frontage to Grand Bazaar Shops, over the same
Las Vegas Blvd Overpass:

    straight line   ~102 m
    Google           161 m,  2 min      <- what a customer's phone says
    OSRM             443 m,  5.9 min    <- what this script used to publish

OSRM walks the overpass's full ramp geometry — thirteen segments of 10 to 77
metres, switchbacks and landings — where Google takes the direct line. On Strip
bridge crossings it over-counts by about 2.75x, and since almost every landmark
here is across a bridge, every published figure was inflated. Bellagio came out
at 8 minutes when the real answer is 3.

So the model is now straight-line distance times a detour factor, both
calibrated against that Google route:

    detour  161 / 102 = 1.58
    pace    161 m / 2 min = 80 m/min  (4.8 km/h)

That is a crude model fitted to a single point, and it is still better than a
precise answer to the wrong question.

── Why the published table has not been regenerated ───────────────────────────

SHOP moved 85 m when the suite was pinned properly, which shifts nine of the ten
published figures. They have deliberately not been republished, because NEAREST
below is hand-estimated and at least one entry is now provably wrong: "Ole Red"
sits 45 m from where OSM puts Ole Red. Regenerating against a bad access-point
table would only publish a differently-wrong answer. NEAREST needs surveying
first. Bellagio, the one figure the owner verified against his own phone, comes
out at 3 minutes either way.

Spot-check anything that matters in Google Maps, which is what the customer will
be holding.
"""
import math

DETOUR = 1.58
PACE = 80.0  # metres per minute

# The shop itself — suite 611-613, not the mall.
#
# Resolved from the Grand Bazaar Shops directory map, which draws 612 and 613 in
# the 600-series row on the mall's southern edge. The row is georeferenced from
# the two suites OSM has surveyed with unit numbers (Subway 601, Ben & Jerry's
# 606); the same fit lands the map's Ole Red block within 16 m of Ole Red's own
# OSM node. Google's "Grand Bazaar Shops" pin, which this used to use, is 85 m
# north-west and outside the mall footprint.
SHOP = (36.113777, -115.172005)

# The nearest pedestrian access point of each property — for anything across a
# road that means the corner where its overpass starts, not its front door.
NEAREST = {
    "Ole Red":          (36.11393, -115.17233),
    "Horseshoe":        (36.11400, -115.17180),
    "Bellagio":         (36.11419, -115.17350),   # the Starbucks corner
    "Flamingo":         (36.11640, -115.17210),
    "Caesars Palace":   (36.11630, -115.17330),
    "The Cromwell":     (36.11651, -115.17225),
    "Paris":            (36.11248, -115.17055),
    "The LINQ":         (36.11730, -115.17190),
    "The Cosmopolitan": (36.11050, -115.17280),
    "Planet Hollywood": (36.11000, -115.17170),
}


def haversine(a, b):
    R = 6371000
    p1, p2 = math.radians(a[0]), math.radians(b[0])
    dp, dl = p2 - p1, math.radians(b[1] - a[1])
    h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * R * math.asin(math.sqrt(h))


rows = []
print(f"{'place':<18} {'line m':>7} {'walk m':>7} {'min':>5} {'publish':>8}")
print("-" * 50)
for name, pt in sorted(NEAREST.items(), key=lambda kv: haversine(SHOP, kv[1])):
    line = haversine(SHOP, pt)
    walk = line * DETOUR
    mins = walk / PACE
    pub = max(1, math.ceil(mins))
    rows.append((pub, name))
    print(f"{name:<18} {line:7.0f} {walk:7.0f} {mins:5.1f} {pub:8d}")

print("\nWALKS for src/components/Marquee.tsx:")
for pub, name in rows:
    print(f'  [{pub}, "{name}"],')
