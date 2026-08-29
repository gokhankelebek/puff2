import type { Department } from "@/lib/commerce/types";
/**
 * The icon system.
 *
 * Every icon is a true side-elevation silhouette of the real object — no
 * metaphor, because in retail recognition beats cleverness. And every icon
 * contains exactly one ember-filled element: the hot point, where the object
 * generates heat. That single rule is what makes an otherwise plain outline
 * set read as a system, and it is not copyable by anyone else in the category.
 */

type IconProps = { size?: number; className?: string };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

const EMBER = "var(--magenta)";

export function IconDisposables({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      {/* Cap and body as two stacked rounds — a disposable, not a letterform. */}
      <rect x="9.5" y="1.6" width="5" height="4.2" rx="1.4" />
      <rect x="7.2" y="5.2" width="9.6" height="16.6" rx="2.6" />
      <circle cx="12" cy="18.6" r="1.7" fill={EMBER} stroke="none" />
    </svg>
  );
}

export function IconMods({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="5.5" y="9" width="13" height="12.5" rx="1.5" />
      <rect x="8.5" y="3.5" width="7" height="5.5" />
      <path d="M10.5 3.5h3" />
      <circle cx="12" cy="15" r="2.2" fill={EMBER} stroke="none" />
    </svg>
  );
}

export function IconPods({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <path d="M7 8.5h10" />
      <rect x="9.5" y="11" width="5" height="6.5" fill={EMBER} stroke="none" />
    </svg>
  );
}

export function IconEliquid({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M9 2.5h6" />
      <path d="M10 2.5v3.2c0 .6-.3 1-.8 1.4C8 8 7.5 9 7.5 10.3V20a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5v-9.7c0-1.3-.5-2.3-1.7-3.2-.5-.4-.8-.8-.8-1.4V2.5" />
      <path
        d="M7.5 14h9v6a1.5 1.5 0 0 1-1.5 1.5H9A1.5 1.5 0 0 1 7.5 20v-6z"
        fill={EMBER}
        stroke="none"
      />
    </svg>
  );
}

export function IconCigarettes({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      {/* A 2px stroke cannot outline a 3px-tall stick — it collapses. One line. */}
      <path d="M2.8 12h16.4" />
      <path d="M7.2 10.2v3.6" />
      <circle cx="21.2" cy="12" r="1.6" fill={EMBER} stroke="none" />
    </svg>
  );
}

export function IconCigars({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M2.8 12c0-2 1.5-3.4 3.4-3.4h9.4c.9 0 1.7.4 2.4 1L21.6 12l-3.6 2.4c-.7.6-1.5 1-2.4 1H6.2C4.3 15.4 2.8 14 2.8 12z" />
      <path d="M8.4 8.6v6.8" />
      <path d="M10.6 8.6v6.8" />
      <circle cx="20.8" cy="12" r="1.7" fill={EMBER} stroke="none" />
    </svg>
  );
}

export function IconHookah({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M8.2 21.5h7.6" />
      <path d="M9 21.5c0-2.6 1.2-4.2 3-6.4 1.8 2.2 3 3.8 3 6.4" />
      <path d="M12 15.2V8.4" />
      <path d="M9.6 8.4h4.8" />
      <path d="M15.4 13.8c2.8.6 4.4 2.8 3.6 6.4" />
      <rect x="10" y="2.4" width="4" height="6" rx="0.7" fill={EMBER} stroke="none" />
    </svg>
  );
}

export function IconShisha({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <ellipse cx="12" cy="8.5" rx="7.5" ry="2.5" />
      <path d="M4.5 8.5v6c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5v-6" />
      <circle cx="12" cy="8.5" r="1.8" fill={EMBER} stroke="none" />
    </svg>
  );
}

export function IconGlass({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      {/* Straight tube into a wide base — a water pipe, not a vase. */}
      <path d="M9.2 2.6h5.6v11.2c2.2 1.2 3.4 3.4 3.4 6.6H5.8c0-3.2 1.2-5.4 3.4-6.6V2.6z" />
      <path d="M5.8 20.4h12.4" />
      <path d="M14.8 7.2h5" />
      <circle cx="20.4" cy="7.2" r="1.7" fill={EMBER} stroke="none" />
    </svg>
  );
}

export function IconLighters({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="7.5" y="9" width="9" height="12.5" rx="1" />
      <path d="M9 9V6.5h6V9" />
      <path d="M12 6.5V4.2c0-.9.7-1.7 1.6-1.7" stroke={EMBER} />
      <circle cx="14.4" cy="2.5" r="1.6" fill={EMBER} stroke="none" />
    </svg>
  );
}

export function IconAccessories({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      {/* Zippo: the one accessory silhouette that still reads at 24px. */}
      <rect x="7" y="9.2" width="10" height="12.2" rx="1.2" />
      <path d="M8.4 9.2V6.6h7.2v2.6" />
      <path d="M12 6.6V4.2c0-1 .8-1.8 1.8-1.8" stroke={EMBER} />
      <circle cx="14.6" cy="2.4" r="1.5" fill={EMBER} stroke="none" />
    </svg>
  );
}

export function IconDelivery({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M2.5 16.5v-4l3.5-1 2.5-3.5h8l3.5 4.5h1.5v4z" />
      <circle cx="7" cy="16.5" r="2" />
      <circle cx="17" cy="16.5" r="2" />
      <rect x="19.5" y="8" width="2.5" height="2.5" fill={EMBER} stroke="none" />
    </svg>
  );
}

export function IconHemp({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      {/* A leaf, not a marijuana leaf — five narrow lobes on a stem. The
          distinction is the whole compliance point of this department. */}
      <path d="M12 21v-6" />
      <path d="M12 15c0-3.4 1.6-6.2 3.6-7.6C16.9 6.5 18 6.2 18 6.2s.2 1.2-.4 2.6c-.9 2.2-3.1 4.4-5.6 6.2z" />
      <path d="M12 15c0-3.4-1.6-6.2-3.6-7.6C7.1 6.5 6 6.2 6 6.2s-.2 1.2.4 2.6c.9 2.2 3.1 4.4 5.6 6.2z" />
      <path d="M12 13.4c0-3 .7-5.7 1.6-7.5.6-1.2 1.3-2.3 1.3-2.3s-.5 1.6-.6 3.2" />
      <path d="M12 13.4c0-3-.7-5.7-1.6-7.5C9.8 4.7 9.1 3.6 9.1 3.6s.5 1.6.6 3.2" />
      <circle cx="12" cy="17.6" r="1.5" fill={EMBER} stroke="none" />
    </svg>
  );
}

/* The owner's raster department art (public/dept/*.webp) is deliberately NOT
   used here. Those marks are dark stickers -- a near-black body on transparent,
   drawn for a light ground -- and on Marquee Neon's midnight cards three of the
   six (hookah, glass, accessories) disappear entirely. The drawn glyph is
   vector and strokes in currentColor, so it reads on any ground, which is also
   what the handoff asks for: a real icon set at the same optical size.
   The raster art is still on disk if a lighter treatment ever wants it. */

/**
 * The owner's department art. Deliberately PARTIAL over Department.
 *
 * These are photographs the shop supplied, so a department only appears here
 * once its art exists. Hemp has none yet — inventing one would put a stock
 * image in the one place the site is supposed to be showing the actual shop.
 * `DepartmentMark` falls back to the drawn glyph instead.
 */
export const DEPT_MARKS: Partial<Record<Department, string>> = {
  vape: "/dept/vape.webp",
  cigars: "/dept/cigars.webp",
  cigarettes: "/dept/cigarettes.webp",
  hookah: "/dept/hookah.webp",
  glass: "/dept/glass.webp",
  accessories: "/dept/accessories.webp",
};

export type DeptMarkId = Department;

/** The owner's department art — used on the tab bar and the category doors. */
export function DepartmentMark({
  department,
  size = 48,
  className,
}: {
  department: DeptMarkId;
  size?: number;
  className?: string;
}) {
  const art = DEPT_MARKS[department];
  /* No photograph for this department yet — the glyph is the honest stand-in.
     See DEPT_MARKS. */
  if (!art) {
    return <DepartmentGlyph department={department} size={size} className={className} />;
  }
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      className={className}
      src={art}
      alt=""
      width={size}
      height={size}
      decoding="async"
    />
  );
}

/**
 * The department silhouette, used as a stand-in wherever a product photograph
 * will eventually go.
 *
 * This is scaffolding with a job: an empty grey cell reads as a broken image,
 * whereas an object silhouette reads as a product awaiting its photograph.
 * It keeps the grid legible as a SHELF during the months before the shoot.
 */
export function DepartmentGlyph({
  department,
  size = 44,
  className,
}: {
  department: Department;
  size?: number;
  className?: string;
}) {
  const map = {
    vape: IconDisposables,
    cigars: IconCigars,
    cigarettes: IconCigarettes,
    hookah: IconHookah,
    glass: IconGlass,
    hemp: IconHemp,
    accessories: IconAccessories,
  } as const;
  const Glyph = map[department];
  return <Glyph size={size} className={className} />;
}
