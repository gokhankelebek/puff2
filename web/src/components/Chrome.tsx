import { DepartmentMark } from "./Icons";
import s from "./Chrome.module.css";
import { BAND_LABEL, type HourBand } from "@/lib/time";
import {
  DELIVERY_MINIMUM_LABEL,
  DELIVERY_STRIP_FEE_LABEL,
} from "@/lib/hotels";
import ThemeToggle from "./ThemeToggle";
import SearchBox from "./SearchBox";
import { headers } from "next/headers";
import { PATH_HEADER } from "@/lib/age-shared";

export const PHONE_DISPLAY = "(702) 613-7799";
export const PHONE_HREF = "tel:+17026137799";

/* -------------------------------------------------------------------------
   Film grain — one of the constants. Inline SVG turbulence, no image request.
   ------------------------------------------------------------------------- */

export function Grain() {
  return (
    <svg className={s.grain} aria-hidden="true">
      <filter id="pv-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.8"
          numOctaves={3}
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#pv-grain)" />
    </svg>
  );
}

/* -------------------------------------------------------------------------
   Wordmark — the real logo.

   Previously this was set type: "PUFF" plus a dot, a stand-in drawn before
   anyone had supplied the mark. The actual lockup is the smoke cloud, the
   lowercase "puff", the "LIGHTING UP LAS VEGAS" line and "VEGAS" in marquee
   bulbs — pulled from the live storefront's header at 2718×1112 with alpha.

   The bulbs in VEGAS are knocked out of the letterforms rather than painted
   white, so on this dark ground they read as unlit bulbs in a sign. That suits
   a shop whose whole position is being open at 4am, and it is the reason the
   mark is used as-is rather than recoloured.
   ------------------------------------------------------------------------- */

const MARKS = {
  /* cloud + "puff" only */
  mark: { src: "/brand/logo-mark.webp", w: 1338, h: 1022 },
  /* the whole lockup, including LIGHTING UP LAS VEGAS and the bulb VEGAS */
  full: { src: "/brand/logo.webp", w: 2718, h: 1112 },
} as const;

export function Wordmark({
  size = 28,
  variant = "mark",
}: {
  size?: number;
  variant?: keyof typeof MARKS;
}) {
  const m = MARKS[variant];
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      className={s.wordmark}
      src={m.src}
      alt="Puff Vegas — lighting up Las Vegas"
      /* Real intrinsic dimensions, so the header cannot reflow while it loads. */
      width={Math.round((size * m.w) / m.h)}
      height={size}
      style={{ height: size }}
    />
  );
}

/* -------------------------------------------------------------------------
   Age banner.

   Legally and architecturally load-bearing. It is IN THE DOCUMENT FLOW: it
   never overlays, never locks scroll, never blurs content, never gates the
   phone number. Paid acquisition does not exist in this category, so a design
   decision that costs SEO costs the business.

   The affirm control is a real form POST, so it works with JS disabled.
   ------------------------------------------------------------------------- */

export function AgeBanner({ affirmed }: { affirmed: boolean }) {
  if (affirmed) return null;

  return (
    <aside className={s.ageBanner} aria-label="Age verification">
      <span className={s.ageLabel}>21+ only</span>
      <p className={s.ageCopy}>
        ID at the door, every time.
      </p>
      <form action="/api/age" method="POST">
        <button className={s.ageAffirm} type="submit">
          I&rsquo;m 21 or older
        </button>
      </form>
    </aside>
  );
}

/* -------------------------------------------------------------------------
   Header — the department switcher. Six departments, always visible.
   The mental model is "which store am I in".
   ------------------------------------------------------------------------- */

const DEPARTMENTS = [
  { id: "vape", label: "Vape", tab: "Vape", href: "/vape" },
  { id: "cigars", label: "Cigars", tab: "Cigars", href: "/cigars" },
  { id: "cigarettes", label: "Cigarettes", tab: "Cigs", href: "/cigarettes" },
  { id: "hookah", label: "Hookah", tab: "Hookah", href: "/hookah" },
  { id: "glass", label: "Glass", tab: "Glass", href: "/glass" },
  { id: "accessories", label: "Accessories", tab: "Gear", href: "/accessories" },
] as const;

export function Header() {
  return (
    <header className={s.header}>
      <a href="/" aria-label="Puff Vegas — home" className={s.brand}>
        <Wordmark size={40} />
      </a>
      <nav className={s.nav} aria-label="Departments">
        {DEPARTMENTS.map(({ label, href }) => (
          <a key={href} className={s.navLink} href={href}>
            {label}
          </a>
        ))}
      </nav>
      <SearchBox />
      {/* In the initial HTML of every page, so it survives total JS failure. */}
      <a className={s.phone} href={PHONE_HREF}>
        {PHONE_DISPLAY}
      </a>
      <ThemeToggle />
    </header>
  );
}

/* -------------------------------------------------------------------------
   Status strip — OPEN and the published delivery numbers.
   No clock. The time is not the product.
   ------------------------------------------------------------------------- */

export function StatusModule({
  band,
  eta = `${DELIVERY_STRIP_FEE_LABEL} · ${DELIVERY_MINIMUM_LABEL.toUpperCase()}`,
}: {
  band: HourBand;
  eta?: string;
}) {
  return (
    <section className={s.status} aria-label="Store status">
      <div className={s.statusCell}>
        <span className={s.statusLabel}>Status</span>
        <span className={s.statusOpen}>
          <span className={s.liveDot} aria-hidden="true" />
          OPEN
        </span>
      </div>
      <div className={s.statusCell}>
        <span className={s.statusLabel}>Strip delivery</span>
        <span className={s.statusValue}>{eta}</span>
      </div>
      <div className={s.statusCell}>
        <span className={s.statusLabel}>Now</span>
        <span className={s.statusBand}>{BAND_LABEL[band]}</span>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
   Mobile department switcher — a persistent bottom tab bar, not a hamburger.
   Switching departments swaps the entire browse grammar, so it stays visible.
   ------------------------------------------------------------------------- */

export async function TabBar() {
  const h = await headers();
  const path = h.get(PATH_HEADER) ?? "";

  return (
    <>
      <div className={s.tabSpacer} aria-hidden="true" />
      <nav className={s.tabBar} aria-label="Departments">
        {DEPARTMENTS.map(({ id, label, tab, href }) => {
          const here = path === href || path.startsWith(`${href}/`);
          return (
            <a
              key={href}
              className={s.tab}
              href={href}
              aria-label={label}
              aria-current={here ? "page" : undefined}
            >
              <DepartmentMark department={id} size={36} className={s.tabMark} />
              <span className={s.tabLabel}>{tab}</span>
            </a>
          );
        })}
      </nav>
    </>
  );
}
