import type { CommerceAdapter } from "./types";
import { catalogAdapter } from "./catalog";

/**
 * The single seam between the UI and whoever holds the catalogue.
 *
 * Today that is `catalog.generated.json`, produced by
 * `scripts/import-lightspeed.ts` from the Lightspeed X-Series export. When the
 * shop leaves Lightspeed, the replacement is a new adapter file and a change to
 * THIS line — nothing in `app/` or `components/` should need to know.
 *
 * `fixtureAdapter` is kept for tests and for working offline.
 */
export const commerce: CommerceAdapter = catalogAdapter;

export { fixtureAdapter } from "./fixtures";
export { CATALOG_SIZE } from "./catalog";
export * from "./types";
