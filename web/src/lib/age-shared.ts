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
export const AGE_MAX_AGE = 60 * 60 * 24 * 365; // 365 days
