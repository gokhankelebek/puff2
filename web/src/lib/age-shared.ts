/**
 * Constants only — no node builtins.
 *
 * Middleware runs in the Edge runtime, which has no `node:crypto`. Anything
 * the middleware touches has to live here; the HMAC lives in `age.ts` and is
 * only ever imported from Node contexts (route handlers, server components).
 */

export const AGE_COOKIE = "pv_age";
/** Normalised single bit injected by middleware. See middleware.ts. */
export const AGE_HEADER = "x-pv-age";
/** Pathname for the tab bar's aria-current. Same request, not a cache key. */
export const PATH_HEADER = "x-pv-path";
export const AGE_MAX_AGE = 60 * 60 * 24 * 365; // 365 days
