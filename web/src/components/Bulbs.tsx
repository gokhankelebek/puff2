import s from "./Bulbs.module.css";

/**
 * The marquee bulb strip.
 *
 * The signature element of Marquee Neon and the only divider the design uses.
 * It is pure CSS — a repeating radial-gradient, no image request — and the
 * whole recipe lives in tokens (`--bulb-*` in globals.css), which is what lets
 * day mode put the bulbs out without any call site knowing how a bulb is drawn.
 *
 * `chase` is the Fremont-style bulb run: the background steps one bulb-pitch
 * at a time rather than sliding, because a smooth translate reads as a
 * gradient wipe and not as individual lamps switching. It is opt-in per
 * instance — a page with a chase on every divider is a fairground, not a shop —
 * and `prefers-reduced-motion` stops it globally.
 *
 * Decorative by definition, so it is always aria-hidden.
 */
export default function Bulbs({ chase = false }: { chase?: boolean }) {
  return (
    <div
      className={s.bulbs}
      data-chase={chase ? "on" : undefined}
      aria-hidden="true"
    />
  );
}
