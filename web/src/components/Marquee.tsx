import s from "./Marquee.module.css";
import { WALKS } from "@/lib/walks";

/**
 * The walking-distance ticker.
 *
 * The logo says LIGHTING UP LAS VEGAS and sets VEGAS in marquee bulbs, so a
 * scrolling sign is the one piece of motion on this site that is actually
 * on-brand rather than decoration. The bullet between items is a bulb.
 *
 * ── It is not a client component ───────────────────────────────────────────
 *
 * No JavaScript is involved. The scroll is a CSS animation and the pause
 * control is a checkbox the CSS reads — same stance as the age gate's form POST
 * and the facets-as-links: the thing still works before hydration, and on a
 * cold connection that is most of the time a shopper is looking at it.
 *
 * ── Why there is a pause control at all ────────────────────────────────────
 *
 * WCAG 2.2.2 applies to content that moves automatically, runs longer than
 * five seconds and sits alongside other content — which is exactly this. Hover
 * and focus pause it, but neither exists on a phone, so a real control is
 * needed and `prefers-reduced-motion` stops it outright.
 */

export default function Marquee() {
  /* Rendered twice, back to back. The track is translated by exactly -50%, so
     the second copy lands where the first began and the seam never shows. */
  const items = [...WALKS, ...WALKS];

  return (
    <div className={s.wrap}>
      <input
        type="checkbox"
        id="marquee-pause"
        className={s.toggle}
        /* Not decorative: it is the WCAG 2.2.2 pause mechanism. */
      />
      <div className={s.viewport}>
        <ul className={s.track} aria-label="Walking distance from the shop">
          {items.map((w, i) => {
            const live = i < WALKS.length;
            const body = (
              <>
                <span className={s.bulb} aria-hidden="true" />
                <span className={s.min}>{w.minutes} min</span>
                <span className={s.place}>{w.place}</span>
              </>
            );
            return (
              <li
                className={s.item}
                key={`${w.place}-${i}`}
                aria-hidden={live ? undefined : true}
              >
                {live ? (
                  <a className={s.hit} href="/pickup#walks">
                    {body}
                  </a>
                ) : (
                  body
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <label className={s.pause} htmlFor="marquee-pause">
        <span className={s.pauseOn}>Pause</span>
        <span className={s.pauseOff}>Play</span>
      </label>
    </div>
  );
}
