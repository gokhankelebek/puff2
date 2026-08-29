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
 * Masks are 192px so the largest render (64px) stays crisp at 3x. Every icon
 * was trimmed to its own ink and re-fitted into a common box, so a tall
 * lighter and a wide cigar carry the same optical weight in one grid.
 *
 * Decorative: the department name is always adjacent in the markup.
 */
export default function DepartmentIcon({
  department,
  size = 56,
  className,
}: {
  department: Department;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`${s.icon} ${className ?? ""}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
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
