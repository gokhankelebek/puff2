import s from "./Logo.module.css";

/**
 * The shop's real logo — the cloud, the lowercase "puff", "LIGHTING UP LAS
 * VEGAS", and "VEGAS" set in marquee bulbs.
 *
 * It replaces the type lockup the handoff drew (Yellowtail "Puff" beside Bebas
 * "VEGAS"), which was an approximation of this. Using the actual mark is
 * better on every count, and one detail makes it belong here rather than
 * merely be tolerated: the real "VEGAS" is already built out of marquee bulbs,
 * which is the design's own signature element. So it is painted GOLD, the same
 * token as the bulb strips, and the logo and the dividers read as one idea.
 *
 * Painted, not pictured. The source art is a single flat red (#c0181c-ish) on
 * transparent, and that red measures about 3:1 on the midnight ground — it
 * cannot carry the mark legibly, and it is not in this palette at all. So the
 * lockup ships as three alpha-only masks in register on one canvas, and CSS
 * colours them:
 *
 *   cloud + "puff"  -> --magenta   the primary
 *   tagline         -> --text-mute quiet, it is a line of small caps
 *   bulb "VEGAS"    -> --gold      the marquee tie-in
 *
 * Which means it also follows day/night for free, the same way the department
 * icons do. The original red art stays at public/brand/*.webp untouched.
 */
export default function Logo({
  variant = "lockup",
  className,
}: {
  /**
   * `lockup`  the full mark, tagline and all — for the age gate and footer.
   * `compact` mark + bulb VEGAS, re-composed side by side with the tagline
   *           dropped. At header size that line renders about four pixels
   *           tall, which is not small type, it is a smudge.
   * `mark`    the cloud and "puff" alone.
   */
  variant?: "lockup" | "compact" | "mark";
  className?: string;
}) {
  if (variant === "compact") {
    return (
      <span
        className={`${s.compact} ${className ?? ""}`}
        role="img"
        aria-label="Puff Vegas"
      >
        <span className={s.compactMark} />
        <span className={s.compactVegas} />
      </span>
    );
  }

  if (variant === "mark") {
    return (
      <span
        className={`${s.mark} ${className ?? ""}`}
        role="img"
        aria-label="Puff Vegas"
      />
    );
  }

  return (
    <span
      className={`${s.lockup} ${className ?? ""}`}
      role="img"
      aria-label="Puff Vegas — lighting up Las Vegas"
    >
      <span className={s.layerMark} />
      <span className={s.layerTagline} />
      <span className={s.layerVegas} />
    </span>
  );
}
