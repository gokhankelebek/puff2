/**
 * Walking times from the shop to nearby Strip properties.
 *
 * Lives here rather than inside the marquee because the directions page needs
 * the same list, and two copies of a number this easy to get wrong would drift
 * within a week. The full working — including two failed attempts — is in
 * research/ingest/walk-times.py.
 *
 * Short version: routing these on OSRM over OSM data over-counts Strip bridge
 * crossings by about 2.75x, because it walks the overpass's entire ramp
 * geometry. These are straight-line distance times a 1.58 detour factor at
 * 80 m/min, both calibrated against a Google Maps route the shop owner
 * measured himself — 161m and 2 minutes from Bellagio's Boulevard frontage to
 * Grand Bazaar, over the Las Vegas Blvd Overpass.
 */

import { SHOP_GEO } from "./hotels";

export type Walk = {
  minutes: number;
  place: string;
  /** True when the route crosses Las Vegas Blvd on the pedestrian overpass. */
  bridge?: boolean;
};

export const WALKS: Walk[] = [
  { minutes: 2, place: "Ole Red" },
  { minutes: 2, place: "Horseshoe" },
  { minutes: 3, place: "Bellagio", bridge: true },
  { minutes: 5, place: "Flamingo" },
  { minutes: 5, place: "Caesars Palace", bridge: true },
  { minutes: 5, place: "The Cromwell" },
  { minutes: 6, place: "Paris" },
  { minutes: 7, place: "The LINQ" },
  { minutes: 9, place: "The Cosmopolitan", bridge: true },
  { minutes: 10, place: "Planet Hollywood" },
];

/**
 * Hotels that already have a published walk time. Do not add a slug just
 * because HOTELS has a geo pin — those pins are not surveyed doors.
 */
const WALK_BY_HOTEL_SLUG: Partial<Record<string, string>> = {
  horseshoe: "Horseshoe",
  bellagio: "Bellagio",
  flamingo: "Flamingo",
  "caesars-palace": "Caesars Palace",
  cromwell: "The Cromwell",
  paris: "Paris",
  linq: "The LINQ",
  cosmopolitan: "The Cosmopolitan",
  "planet-hollywood": "Planet Hollywood",
};

export function walkForHotelSlug(slug: string): Walk | undefined {
  const place = WALK_BY_HOTEL_SLUG[slug];
  if (!place) return undefined;
  return WALKS.find((w) => w.place === place);
}

/**
 * Google walking directions to suite 611-613, not the Grand Bazaar pin.
 * `origin` is a published place name (Bellagio, Ole Red); Google resolves
 * the door. We do not pass hotel.geo — those are fee pins.
 */
export function mapsWalkingUrl(origin?: string): string {
  const params = new URLSearchParams({
    api: "1",
    destination: `${SHOP_GEO.lat},${SHOP_GEO.lng}`,
    travelmode: "walking",
  });
  if (origin) params.set("origin", `${origin}, Las Vegas, NV`);
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
