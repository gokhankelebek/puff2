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
  strokeWidth: 1.5,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

const EMBER = "var(--volt)";

export function IconDisposables({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="8.5" y="2.5" width="7" height="19" rx="1.5" />
      <path d="M10 2.5v3.5h4V2.5" />
      <circle cx="12" cy="18.5" r="1.4" fill={EMBER} stroke="none" />
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
      <rect x="2.5" y="10" width="19" height="4.5" rx="1" />
      <path d="M15.5 10v4.5" />
      <rect x="18.5" y="10" width="3" height="4.5" rx="1" fill={EMBER} stroke="none" />
    </svg>
  );
}

export function IconCigars({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3 12.5c0-1.4 1.1-2.5 2.5-2.5h11l3 1.2-3 1.3H5.5A2.5 2.5 0 0 1 3 12.5z" />
      <path d="M13 10v3.5" />
      <path d="M16.5 10l3 1.2-3 1.3z" fill={EMBER} stroke="none" />
    </svg>
  );
}

export function IconHookah({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M8.5 21.5c0-2.2 1.4-3.4 2.4-4.2.6-.5.6-1.3.6-2V9.5h1v5.8c0 .7 0 1.5.6 2 1 .8 2.4 2 2.4 4.2z" />
      <path d="M9 9.5h6l-1.2-2.5h-3.6z" />
      <path d="M15.5 12.5h3" />
      <rect x="10.2" y="3" width="3.6" height="4" fill={EMBER} stroke="none" />
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
      <path d="M10 2.5h4v9l3.5 8a1.5 1.5 0 0 1-1.4 2H7.9a1.5 1.5 0 0 1-1.4-2l3.5-8z" />
      <path d="M13 8h4" />
      <rect x="16.5" y="6" width="3.5" height="4" rx=".8" fill={EMBER} stroke="none" />
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
      <path d="M6 18.5l3-13 3 13 3-13" />
      <path d="M15 5.5l2.5 4.5" />
      <circle cx="18" cy="11.5" r="2" fill={EMBER} stroke="none" />
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
  department: "vape" | "cigars" | "cigarettes" | "hookah" | "glass" | "accessories";
  size?: number;
  className?: string;
}) {
  const map = {
    vape: IconDisposables,
    cigars: IconCigars,
    cigarettes: IconCigarettes,
    hookah: IconHookah,
    glass: IconGlass,
    accessories: IconAccessories,
  } as const;
  const Glyph = map[department];
  return <Glyph size={size} className={className} />;
}
