/**
 * Constants only — no node builtins.
 *
 * Kept free of node builtins so the proxy (src/proxy.ts) and every page can
 * share it without dragging the HMAC along; that lives in `age.ts`.
 */

export const AGE_COOKIE = "pv_age";
/** Normalised single bit injected by the proxy. See proxy.ts. */
export const AGE_HEADER = "x-pv-age";
/** Pathname for the tab bar's aria-current. Same request, not a cache key. */
export const PATH_HEADER = "x-pv-path";
/* 30 days. The handoff specifies the pass length, and it is short enough
   that a shared hotel device does not stay affirmed for a year. */
export const AGE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
