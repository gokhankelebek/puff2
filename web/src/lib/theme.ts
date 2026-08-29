/**
 * Day / night switching.
 *
 * ── Why localStorage and not a cookie ──────────────────────────────────────
 *
 * The age gate already costs us a cache dimension: the middleware normalises
 * its cookie down to a single bit precisely so there are exactly two cached
 * variants of every URL at the CDN. A theme cookie would double that to four
 * — and buy nothing, because the theme changes nothing the server renders. It
 * is one attribute on `<html>`. So the choice lives in localStorage, never
 * reaches the server, and the cache stays two-way.
 *
 * (These routes are server-rendered on demand rather than prerendered, since
 * the age gate reads headers and the hero renders a clock. That makes the
 * per-URL variant count matter more, not less.)
 *
 * The cost is that the theme is not in the server HTML, which is what
 * `INIT_SCRIPT` is for: it runs synchronously while the browser is still
 * parsing `<head>`, before the first paint, so there is no flash of the wrong
 * palette. See node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md
 *
 * ── Why "auto" is not a third button ───────────────────────────────────────
 *
 * Nothing is stored while the site is following the system. Choosing the
 * palette that already matches the system clears the override rather than
 * pinning it, so the ordinary "put it back" case returns to following the OS
 * without a third control to explain.
 */

export type Theme = "light" | "dark";

export const THEME_KEY = "puff-theme";

/** Resolved palette, on `<html>`. Always present once the script has run. */
export const THEME_ATTR = "data-theme";

/** "user" or "system" — lets the toggle show whether a choice is pinned. */
export const SOURCE_ATTR = "data-theme-source";

/**
 * Runs in `<head>` before first paint. Deliberately tiny and dependency-free;
 * it is inlined into the HTML of every page.
 *
 * It always writes a resolved value, so the CSS never has to reason about the
 * absent case at runtime. The bare `:root` dark palette and the
 * `prefers-color-scheme` block remain the JS-off fallback.
 */
export const INIT_SCRIPT = `(function(){try{
var s=localStorage.getItem(${JSON.stringify(THEME_KEY)});
var u=s==="light"||s==="dark";
var t=u?s:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");
var r=document.documentElement;
r.setAttribute(${JSON.stringify(THEME_ATTR)},t);
r.setAttribute(${JSON.stringify(SOURCE_ATTR)},u?"user":"system");
r.setAttribute("data-js","1");
}catch(e){}})()`.replace(/\n/g, "");

export function systemTheme(): Theme {
  return typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export function currentTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.getAttribute(THEME_ATTR) === "light"
    ? "light"
    : "dark";
}

/**
 * Apply a palette and persist the choice — unless it already matches the
 * system, in which case the override is cleared and the site goes back to
 * following the OS.
 */
export function setTheme(next: Theme): void {
  const pinned = next !== systemTheme();
  try {
    if (pinned) localStorage.setItem(THEME_KEY, next);
    else localStorage.removeItem(THEME_KEY);
  } catch {
    // Private browsing, storage disabled. The switch still applies for this
    // page view; it just will not be remembered.
  }
  const root = document.documentElement;
  root.setAttribute(THEME_ATTR, next);
  root.setAttribute(SOURCE_ATTR, pinned ? "user" : "system");
  syncThemeColor(next, pinned);
}

const RUNTIME_META = "data-theme-runtime";

/**
 * Keep the browser chrome in step with the page.
 *
 * The layout ships two media-scoped `theme-color` tags, which is all the
 * system-preference case needs. Rather than overwrite those — which would be
 * one-way, since the original media queries are then gone — a pinned choice
 * inserts its own tag ahead of them and unpinning removes it again. The
 * browser honours the first tag whose media matches, so an unscoped tag at the
 * front wins while it is there and leaves no trace once it is not.
 */
export function syncThemeColor(theme: Theme, pinned: boolean): void {
  const head = document.head;
  const existing = head.querySelector(`meta[${RUNTIME_META}]`);
  if (!pinned) {
    existing?.remove();
    return;
  }
  const meta = existing ?? document.createElement("meta");
  meta.setAttribute("name", "theme-color");
  meta.setAttribute(RUNTIME_META, "");
  meta.setAttribute("content", theme === "light" ? "#f7f2e8" : "#0a0714");
  if (!existing) head.prepend(meta);
}
