import s from "./DepartmentArt.module.css";
import type { Department } from "@/lib/commerce/types";

/**
 * Card art for a department — the neon product renders in
 * public/dept-art (built by scripts/build-dept-art.sh).
 *
 * This is the BIG version of a department mark, for the floor cards only. It
 * is a photograph with its night ground baked in, so it is never used where
 * DepartmentIcon's recolourable masks are needed: at small sizes, or on a
 * surface whose colour follows the day/night theme. The box it fills paints
 * --art-ground, which matches the renders, so the card reads as one dark
 * photo in either theme.
 *
 * Decorative: the department name is always adjacent in the markup.
 */
export default function DepartmentArt({
  department,
  sizes,
}: {
  department: Department;
  /** The rendered width of the box at each breakpoint, as the call site knows it. */
  sizes: string;
}) {
  const src = (w: number) => `/dept-art/${department}-${w}.webp`;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={s.art}
      src={src(640)}
      srcSet={`${src(320)} 320w, ${src(640)} 640w, ${src(960)} 960w`}
      sizes={sizes}
      width={1536}
      height={1024}
      alt=""
      loading="lazy"
      decoding="async"
    />
  );
}
