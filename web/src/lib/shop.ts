/**
 * The shop's own facts, in one place.
 *
 * This file exists because the Marquee Neon handoff specifies the address as
 * "3535 S Las Vegas Blvd" throughout, and that is wrong. The real suite is
 * 611-613 at 3649 S Las Vegas Blvd, inside Grand Bazaar Shops — established
 * by georeferencing the 600-series row against two suites OSM has surveyed
 * with unit numbers (Subway 601, Ben & Jerry's 606) and cross-checked against
 * Ole Red's own node. Google's "Grand Bazaar Shops" pin is 85 m away and falls
 * outside the mall footprint: it is the mall's Boulevard marker, not us.
 *
 * See docs/LOCATION.md. The owner confirmed it independently.
 *
 * A design mock is not a source of truth about where a business is. Everything
 * that prints an address reads it from here, so the wrong one cannot creep
 * back in one screen at a time.
 */

export const SHOP_STREET = "3649 S Las Vegas Blvd";
export const SHOP_SUITE = "Ste 611-613";
export const SHOP_CITY = "Las Vegas";
export const SHOP_REGION = "NV";
export const SHOP_POSTAL = "89109";
export const SHOP_MALL = "Grand Bazaar Shops";

/** The one-line form used in footers and the utility bar. */
export const SHOP_ADDRESS_LINE = `${SHOP_STREET}`;

/** The full postal form, for JSON-LD and the visit page. */
export const SHOP_ADDRESS_FULL = `${SHOP_STREET} ${SHOP_SUITE}, ${SHOP_CITY}, ${SHOP_REGION} ${SHOP_POSTAL}`;

/**
 * Suite 611-613 itself, not the mall. Do not replace with a Google pin.
 */
export const SHOP_GEO = { lat: 36.113777, lng: -115.172005 } as const;
