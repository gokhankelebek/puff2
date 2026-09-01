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

/**
 * The canonical origin for absolute URLs — canonical tags, Open Graph, and the
 * JSON-LD @id/url. Env-driven ON PURPOSE:
 *
 *  - Today the site is still being built and served on the Vercel preview, so
 *    this defaults to the actually-served production origin. Nothing
 *    self-canonicalizes to a domain we do not serve.
 *  - At launch on puffvegas.us, set NEXT_PUBLIC_SITE_URL=https://puffvegas.us
 *    once DNS points at Vercel and the old URLs 301 — one env var, whole site
 *    flips. It is deliberately NOT hardcoded to puffvegas.us now: DNS is not
 *    there yet, so canonicalizing to it would point every page at the stale
 *    old site.
 */
function resolveSiteOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const SITE_ORIGIN = resolveSiteOrigin();

/**
 * Whether this deployment may be indexed. OFF while building, so nothing gets
 * indexed under the preview domain and then has to be migrated to puffvegas.us.
 * Flip it at launch: set NEXT_PUBLIC_SITE_INDEXABLE=1 (alongside the site URL).
 */
export const SITE_INDEXABLE = process.env.NEXT_PUBLIC_SITE_INDEXABLE === "1";
