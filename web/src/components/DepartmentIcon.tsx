import s from "./DepartmentIcon.module.css";
import type { Department } from "@/lib/commerce/types";

/**
 * The department icons.
 *
 * The artwork is raster, but it is NOT painted raster: each icon ships as two
 * alpha-only masks — one for the black linework, one for the magenta accent —
 * and CSS paints them. The stroke layer takes `currentColor` and the accent
 * layer takes `var(--magenta)`.
 *
 * That is the whole point. A flat PNG with the ink baked in is what broke the
 * previous department art: those marks were dark stickers drawn for a light
 * ground, and three of six vanished on the midnight cards. Masking means the
 * same file reads cyan at 4 a.m. and #0E7C99 at 2 p.m. without a second set of
 * assets, and inherits any colour a call site sets.
 *
 * Masks are 192px so the largest render stays crisp at 3x. Every icon was
 * trimmed to its own ink and re-fitted into a common box, so a tall lighter
 * and a wide cigar carry the same optical weight in one grid.
 *
 * Size comes from CSS, via `--dept-icon-h`, and NOT from a pixel prop. The
 * containers this sits in are fluid — a card is 244px on desktop and about
 * 160px at 375 — so a fixed 56px icon is a different fraction of its box at
 * every breakpoint, which is exactly how the sizes drifted apart. Expressing
 * the height as a percentage of the box keeps one optical weight everywhere.
 *
 * Decorative: the department name is always adjacent in the markup.
 */
export default function DepartmentIcon({
  department,
  className,
}: {
  department: Department;
  className?: string;
}) {
  return (
    <span className={`${s.icon} ${className ?? ""}`} aria-hidden="true">
      <span
        className={s.stroke}
        style={{
          maskImage: `url(/dept-icons/${department}-stroke.png)`,
          WebkitMaskImage: `url(/dept-icons/${department}-stroke.png)`,
        }}
      />
      <span
        className={s.accent}
        style={{
          maskImage: `url(/dept-icons/${department}-accent.png)`,
          WebkitMaskImage: `url(/dept-icons/${department}-accent.png)`,
        }}
      />
    </span>
  );
}
