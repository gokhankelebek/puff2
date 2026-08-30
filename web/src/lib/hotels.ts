/**
 * Strip properties we deliver to.
 *
 * ── What this deliberately does not contain ────────────────────────────────
 *
 * Meet points. Every resort handles outside delivery differently, several
 * change the rule by time of night, and none of it is published anywhere I can
 * verify. Inventing "meet at the north valet" would read as authoritative and
 * would strand a driver and a customer at two different doors.
 *
 * So `meet` is optional. Where the shop has filled one in, the page states it.
 * Where it has not, the page says the driver will text when they are close —
 * which is what actually happens, and is a better promise than a wrong one.
 *
 * ── Towers ─────────────────────────────────────────────────────────────────
 *
 * The reason this file exists rather than a flat list of names. A guest says
 * "I'm at Bellagio" when they are in the Spa Tower, which has its own entrance
 * a long way from the main porte cochère. Same property, two doors. Asking
 * which tower up front is the single thing that stops a driver circling.
 */

export type Hotel = {
  slug: string;
  name: string;
  /**
   * Towers or wings with their own entrance.
   *
   * Currently UNUSED. It existed for room delivery, which the shop does not
   * do — guests meet the runner at valet or rideshare pickup, so the site no
   * longer asks which tower. The data is kept rather than deleted because it
   * is real and correct, and because a multi-tower property like Caesars
   * (six) or Mandalay Bay (three) may well have more than one valet stand. If
   * runners start ending up at the wrong one, this is the field to bring back.
   */
  towers?: string[];
  /** Filled in by the shop as it learns each property. */
  meet?: string;
  /**
   * Boulevard-frontage pin for the mile/fee meter only.
   * Not a surveyed pedestrian access — do not feed these into walk-times.py.
   */
  geo: { lat: number; lng: number };
};

export const HOTELS: Hotel[] = [
  // Nearest first — these are the walk-in overlap, and most delivery volume.
  { slug: "horseshoe", name: "Horseshoe Las Vegas", towers: ["North Tower", "South Tower", "Jubilee Tower"], geo: { lat: 36.1144, lng: -115.1706 } },
  { slug: "cromwell", name: "The Cromwell", geo: { lat: 36.1151, lng: -115.1718 } },
  { slug: "bellagio", name: "Bellagio", towers: ["Main Tower", "Spa Tower"], geo: { lat: 36.11419, lng: -115.1735 } },
  { slug: "flamingo", name: "Flamingo Las Vegas", towers: ["Go Rooms", "Fab Rooms", "Bungalows"], geo: { lat: 36.1161, lng: -115.1708 } },
  { slug: "paris", name: "Paris Las Vegas", towers: ["Main Tower", "Burgundy Tower"], geo: { lat: 36.1122, lng: -115.1704 } },
  { slug: "caesars-palace", name: "Caesars Palace", towers: ["Augustus", "Octavius", "Julius", "Palace", "Forum", "Roman"], geo: { lat: 36.1163, lng: -115.1733 } },
  { slug: "cosmopolitan", name: "The Cosmopolitan", towers: ["Chelsea Tower", "Boulevard Tower"], geo: { lat: 36.1105, lng: -115.1728 } },
  { slug: "linq", name: "The LINQ", geo: { lat: 36.1174, lng: -115.1712 } },
  { slug: "planet-hollywood", name: "Planet Hollywood", geo: { lat: 36.1100, lng: -115.1714 } },
  { slug: "harrahs", name: "Harrah's Las Vegas", geo: { lat: 36.1192, lng: -115.1720 } },

  // The rest of the Strip.
  { slug: "aria", name: "ARIA", geo: { lat: 36.1074, lng: -115.1766 } },
  { slug: "vdara", name: "Vdara", geo: { lat: 36.1094, lng: -115.1780 } },
  { slug: "park-mgm", name: "Park MGM", towers: ["Park MGM", "NoMad"], geo: { lat: 36.1050, lng: -115.1768 } },
  { slug: "nyny", name: "New York-New York", geo: { lat: 36.1018, lng: -115.1745 } },
  { slug: "excalibur", name: "Excalibur", geo: { lat: 36.0988, lng: -115.1755 } },
  { slug: "luxor", name: "Luxor", towers: ["Pyramid", "East Tower", "West Tower"], geo: { lat: 36.0955, lng: -115.1761 } },
  { slug: "mandalay-bay", name: "Mandalay Bay", towers: ["Mandalay Bay", "Delano", "Four Seasons"], geo: { lat: 36.0909, lng: -115.1765 } },
  { slug: "mgm-grand", name: "MGM Grand", towers: ["Main Tower", "West Wing", "Signature"], geo: { lat: 36.1028, lng: -115.1703 } },
  { slug: "venetian", name: "The Venetian", geo: { lat: 36.1215, lng: -115.1697 } },
  { slug: "palazzo", name: "The Palazzo", geo: { lat: 36.1238, lng: -115.1677 } },
  { slug: "wynn", name: "Wynn Las Vegas", geo: { lat: 36.1265, lng: -115.1654 } },
  { slug: "encore", name: "Encore", geo: { lat: 36.1288, lng: -115.1648 } },
  { slug: "treasure-island", name: "Treasure Island", geo: { lat: 36.1219, lng: -115.1726 } },
  { slug: "mirage", name: "The Mirage", geo: { lat: 36.1212, lng: -115.1742 } },
  { slug: "resorts-world", name: "Resorts World", towers: ["Hilton", "Conrad", "Crockfords"], geo: { lat: 36.1365, lng: -115.1648 } },
  { slug: "sahara", name: "Sahara Las Vegas", geo: { lat: 36.1425, lng: -115.1566 } },
  { slug: "strat", name: "The STRAT", geo: { lat: 36.1475, lng: -115.1556 } },
  { slug: "fontainebleau", name: "Fontainebleau", geo: { lat: 36.1378, lng: -115.1588 } },
  { slug: "waldorf", name: "Waldorf Astoria", geo: { lat: 36.1072, lng: -115.1765 } },
  { slug: "sls-w", name: "W Las Vegas", geo: { lat: 36.1422, lng: -115.1564 } },
];

export function hotelBySlug(slug?: string): Hotel | undefined {
  if (!slug) return undefined;
  return HOTELS.find((h) => h.slug === slug);
}

/**
 * Names people type that are not the current marquee.
 *
 * Bally's is Horseshoe. SLS is W Las Vegas. Delano and Four Seasons check
 * in at Mandalay Bay. Keep these on the query path so a GET form can resolve
 * them without the spine needing a second pin.
 */
const HOTEL_ALIASES: Record<string, string> = {
  "ballys": "horseshoe",
  "bally": "horseshoe",
  "ballys las vegas": "horseshoe",
  sls: "sls-w",
  "sls las vegas": "sls-w",
  "w hotel": "sls-w",
  "w las vegas": "sls-w",
  delano: "mandalay-bay",
  "delano las vegas": "mandalay-bay",
  "four seasons": "mandalay-bay",
  "four seasons las vegas": "mandalay-bay",
  nomad: "park-mgm",
  "nomad las vegas": "park-mgm",
  ph: "planet-hollywood",
  "planet hollywood": "planet-hollywood",
  ti: "treasure-island",
  "treasure island": "treasure-island",
  caesars: "caesars-palace",
  caesar: "caesars-palace",
  "caesars palace": "caesars-palace",
  cosmo: "cosmopolitan",
  "the cosmopolitan": "cosmopolitan",
  mgm: "mgm-grand",
  "mgm grand": "mgm-grand",
  "new york": "nyny",
  "new york new york": "nyny",
  "ny ny": "nyny",
  nyny: "nyny",
  stratosphere: "strat",
  "the strat": "strat",
  "park mgm": "park-mgm",
  "waldorf astoria": "waldorf",
  "resorts world": "resorts-world",
  "mandalay bay": "mandalay-bay",
  mandalay: "mandalay-bay",
};

/** Extra datalist entries — aliases that are not already a hotel's `name`. */
export const HOTEL_SEARCH_HINTS = [
  "Bally's",
  "SLS",
  "Delano",
  "Four Seasons",
  "NoMad",
  "Cosmo",
  "Planet Hollywood",
  "Treasure Island",
  "Caesars",
  "NYNY",
  "Stratosphere",
] as const;

export function normalizeHotelQuery(raw: string): string {
  return raw
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[''`]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/^(the|hotel|casino)\s+/, "")
    .replace(/\s+/g, " ");
}

/**
 * Resolve a typed name, alias, or slug. Invalid input returns undefined —
 * the delivery page stays on the unselected spine rather than 404ing.
 *
 * Ambiguous fragments ("las vegas") do not guess.
 */
export function hotelByQuery(raw?: string): Hotel | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;

  const bySlug = hotelBySlug(trimmed.toLowerCase());
  if (bySlug) return bySlug;

  const q = normalizeHotelQuery(trimmed);
  if (!q) return undefined;

  const aliased = HOTEL_ALIASES[q];
  if (aliased) return hotelBySlug(aliased);

  const exact = HOTELS.find((h) => normalizeHotelQuery(h.name) === q);
  if (exact) return exact;

  if (q.length < 3) return undefined;

  const hits = HOTELS.filter((h) => {
    const n = normalizeHotelQuery(h.name);
    return n.includes(q) || q.includes(n);
  });
  if (hits.length === 1) return hits[0];
  return undefined;
}

/**
 * Las Vegas Boulevard as a transit diagram, north → south.
 *
 * East and west are hand-placed. Longitude on a hotel's fee pin is a
 * frontage guess and would put several properties on the wrong kerb.
 * `center` opens extra air around the Horseshoe–Cosmo cluster so names
 * do not share a cell.
 */
export type SpineSide = "west" | "east";

export type SpineStop =
  | { kind: "pole"; label: "North" | "South" }
  | { kind: "shop"; side: "east"; center?: boolean }
  | {
      kind: "hotel";
      slug: string;
      side: SpineSide;
      center?: boolean;
    };

export const STRIP_SPINE: SpineStop[] = [
  { kind: "pole", label: "North" },
  { kind: "hotel", slug: "strat", side: "east" },
  { kind: "hotel", slug: "sahara", side: "east" },
  { kind: "hotel", slug: "sls-w", side: "east" },
  { kind: "hotel", slug: "fontainebleau", side: "east" },
  { kind: "hotel", slug: "resorts-world", side: "west" },
  { kind: "hotel", slug: "encore", side: "east" },
  { kind: "hotel", slug: "wynn", side: "east" },
  { kind: "hotel", slug: "treasure-island", side: "west" },
  { kind: "hotel", slug: "palazzo", side: "east" },
  { kind: "hotel", slug: "venetian", side: "east" },
  { kind: "hotel", slug: "mirage", side: "west" },
  { kind: "hotel", slug: "harrahs", side: "east" },
  { kind: "hotel", slug: "linq", side: "east", center: true },
  { kind: "hotel", slug: "flamingo", side: "east", center: true },
  { kind: "hotel", slug: "cromwell", side: "east", center: true },
  { kind: "hotel", slug: "caesars-palace", side: "west", center: true },
  { kind: "hotel", slug: "bellagio", side: "west", center: true },
  { kind: "hotel", slug: "horseshoe", side: "east", center: true },
  { kind: "shop", side: "east", center: true },
  { kind: "hotel", slug: "cosmopolitan", side: "west", center: true },
  { kind: "hotel", slug: "paris", side: "east", center: true },
  { kind: "hotel", slug: "planet-hollywood", side: "east", center: true },
  { kind: "hotel", slug: "waldorf", side: "west" },
  { kind: "hotel", slug: "vdara", side: "west" },
  { kind: "hotel", slug: "aria", side: "west" },
  { kind: "hotel", slug: "park-mgm", side: "west" },
  { kind: "hotel", slug: "mgm-grand", side: "east" },
  { kind: "hotel", slug: "nyny", side: "west" },
  { kind: "hotel", slug: "excalibur", side: "west" },
  { kind: "hotel", slug: "luxor", side: "west" },
  { kind: "hotel", slug: "mandalay-bay", side: "west" },
  { kind: "pole", label: "South" },
];


/** Suite 611-613. Keep in sync with layout.tsx JSON-LD and walk-times.py SHOP. */
export const SHOP_GEO = { lat: 36.113777, lng: -115.172005 } as const;

export function metersFromShop(geo: { lat: number; lng: number }): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const p1 = toRad(SHOP_GEO.lat);
  const p2 = toRad(geo.lat);
  const dp = p2 - p1;
  const dl = toRad(geo.lng - SHOP_GEO.lng);
  const h =
    Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function formatMiles(meters: number): string {
  const miles = meters / 1609.344;
  if (miles < 0.15) return "0.1 mi";
  return `${miles.toFixed(1)} mi`;
}

export function milesFromMeters(meters: number): number {
  return meters / 1609.344;
}

/**
 * Delivery economics — published before the order, not at the door.
 *
 * ── This used to be a meter, and deliberately is not any more ──────────────
 *
 * The old model was the west-valley shape: a $30 merchandise floor, $10 for
 * the first 5 miles, then $5 a mile. It priced correctly and it read badly.
 * Every hotel in HOTELS already sat inside the first band (Sahara 2.2 mi,
 * Mandalay Bay 1.6), so the meter's variable half never actually varied for
 * a Strip run — it just made the customer wonder whether it would.
 *
 * "$20 flat, no minimum" is now the offer, and it is a headline rather than a
 * footnote: a single number a guest can accept at 4 a.m. without doing
 * arithmetic, and no floor to clear before a single item is worth ordering.
 * Losing the minimum is the substantive half — a $6 lighter is now a real
 * order instead of a $30 puzzle.
 *
 * The distance helpers are kept below because the Boulevard diagram still
 * prints a mile figure per hotel; they no longer price anything.
 */
export const DELIVERY_FEE_CENTS = 2000;

/** No merchandise floor. Kept as a named zero so call sites read honestly and
 *  a future floor has one place to come back to. */
export const DELIVERY_MINIMUM_CENTS = 0;

export function deliveryFeeCents(): number {
  return DELIVERY_FEE_CENTS;
}

export function deliveryFeeForHotel(_slug?: string): number {
  return DELIVERY_FEE_CENTS;
}

export function formatDeliveryFee(cents: number): string {
  if (cents % 100 === 0) return `$${cents / 100}`;
  return `$${(cents / 100).toFixed(2)}`;
}

export const DELIVERY_STRIP_FEE_LABEL = formatDeliveryFee(DELIVERY_FEE_CENTS);
export const DELIVERY_MINIMUM_LABEL = "no minimum";
/** The two facts as one phrase — the site says this in a dozen places. */
export const DELIVERY_TERMS_LABEL = `${DELIVERY_STRIP_FEE_LABEL} flat · no minimum`;

/** Clark County sales tax, applied at 8.375% — same as the product pages. */
/* Clark County sales tax. Currently unused: the only caller was the product
   page's all-in estimate, removed once it became clear the $20 is charged per
   order rather than per item. Kept because the rate is a fact the order flow
   will need the day tax is computed rather than collected at handoff. */
export const TAX_RATE = 0.08375;
