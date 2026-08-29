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
  /** Towers or wings with their own entrance. Empty when there is one door. */
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

/**
 * The Strip, abstracted to the landmarks people actually name.
 *
 * A tourist says "I'm at Bellagio", not "3600 S Las Vegas Blvd". This is that
 * list, north → south, with the shop on the line so the delivery page can
 * show *where you are relative to us* rather than a wall of hotel names.
 *
 * Spacing on the diagram is even on purpose. Distances on each node are
 * separate: miles are haversine from the suite pin, walking minutes come
 * only from WALKS (already on the marquee). Delivery fee is the published
 * meter in this file ($10 / first 5 miles, then $5 a mile). Drive time is
 * still the shop's Strip-wide figure — about 14 minutes — not a per-node
 * guess. The walk-times table is stale (see docs/LOCATION.md); we still
 * show those minutes because they are already live elsewhere, and Bellagio
 * is owner-verified at 3.
 *
 * `hotel` is the slug in HOTELS. Grand Bazaar has none — that node is us,
 * and it points at /pickup rather than starting a delivery.
 *
 * `geo` is a Boulevard-frontage pin so the meter can print a mile figure.
 * It is NOT a surveyed pedestrian access point — do not feed these into
 * walk-times.py.
 */
export type StripLandmark = {
  id: string;
  label: string;
  hotel?: string;
  here?: boolean;
  geo?: { lat: number; lng: number };
  /** Must match `WALKS[].place` exactly when we already publish a walk time. */
  walkPlace?: string;
};

export const STRIP_LANDMARKS: StripLandmark[] = [
  { id: "sahara", label: "Sahara", hotel: "sahara", geo: { lat: 36.1425, lng: -115.1566 } },
  { id: "wynn", label: "Wynn", hotel: "wynn", geo: { lat: 36.1265, lng: -115.1654 } },
  { id: "venetian", label: "Venetian", hotel: "venetian", geo: { lat: 36.1215, lng: -115.1697 } },
  {
    id: "caesars",
    label: "Caesars",
    hotel: "caesars-palace",
    geo: { lat: 36.1163, lng: -115.1733 },
    walkPlace: "Caesars Palace",
  },
  {
    id: "bellagio",
    label: "Bellagio",
    hotel: "bellagio",
    geo: { lat: 36.11419, lng: -115.1735 },
    walkPlace: "Bellagio",
  },
  {
    id: "cosmopolitan",
    label: "Cosmopolitan",
    hotel: "cosmopolitan",
    geo: { lat: 36.1105, lng: -115.1728 },
    walkPlace: "The Cosmopolitan",
  },
  { id: "grand-bazaar", label: "Grand Bazaar", here: true },
  { id: "mgm", label: "MGM", hotel: "mgm-grand", geo: { lat: 36.1028, lng: -115.1703 } },
  { id: "luxor", label: "Luxor", hotel: "luxor", geo: { lat: 36.0955, lng: -115.1761 } },
  {
    id: "mandalay-bay",
    label: "Mandalay Bay",
    hotel: "mandalay-bay",
    geo: { lat: 36.0909, lng: -115.1765 },
  },
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
 * Same shape the west-valley 24/7 shops run: a merchandise floor, a cheap
 * first band, then a per-mile meter. Every hotel in HOTELS sits inside the
 * first 5 miles from the suite pin (Sahara is 2.2; Mandalay Bay is 1.6), so
 * Strip delivery is the band fee, not a made-up hotel surcharge. Off-Strip
 * is the same function, quoted on the call.
 */
export const DELIVERY_MINIMUM_CENTS = 3000;
export const DELIVERY_BAND_MILES = 5;
export const DELIVERY_BAND_FEE_CENTS = 1000;
export const DELIVERY_PER_MILE_CENTS = 500;

export function deliveryFeeCents(meters: number): number {
  const extra = milesFromMeters(meters) - DELIVERY_BAND_MILES;
  if (extra <= 0) return DELIVERY_BAND_FEE_CENTS;
  return DELIVERY_BAND_FEE_CENTS + Math.round(extra * DELIVERY_PER_MILE_CENTS);
}

export function deliveryFeeForHotel(slug: string): number {
  const hotel = hotelBySlug(slug);
  if (hotel?.geo) return deliveryFeeCents(metersFromShop(hotel.geo));
  return DELIVERY_BAND_FEE_CENTS;
}

export function formatDeliveryFee(cents: number): string {
  if (cents % 100 === 0) return `$${cents / 100}`;
  return `$${(cents / 100).toFixed(2)}`;
}

export const DELIVERY_STRIP_FEE_LABEL = formatDeliveryFee(DELIVERY_BAND_FEE_CENTS);
export const DELIVERY_MINIMUM_LABEL = `$${DELIVERY_MINIMUM_CENTS / 100} min`;

/** Clark County sales tax, applied at 8.375% — same as the product pages. */
export const TAX_RATE = 0.08375;
