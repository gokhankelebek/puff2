import s from "./Chrome.module.css";
import {
  DELIVERY_STRIP_FEE_LABEL,
  DELIVERY_TERMS_LABEL,
} from "@/lib/hotels";
import ThemeToggle from "./ThemeToggle";
import { headers } from "next/headers";
import { PATH_HEADER } from "@/lib/age-shared";
import { SHOP_ADDRESS_LINE, SHOP_STREET } from "@/lib/shop";

export const PHONE_DISPLAY = "(702) 613-7799";
export const PHONE_HREF = "tel:+17026137799";

/* -------------------------------------------------------------------------
   The lockup.

   Marquee Neon sets the logo as type: Yellowtail "Puff" in magenta beside
   Bebas "VEGAS" in cyan, both glowing. That is a deliberate departure from
   what was here before — the shop's actual raster mark, which is still on
   disk at public/brand/logo*.webp if the real sign is ever wanted back.

   The glow is a token, not a literal, which is the whole reason this survives
   day mode: at 2 p.m. --glow-*-text resolves to `none` and the same two words
   render as flat pigment, exactly like an unlit tube.
   ------------------------------------------------------------------------- */

export function Wordmark({ size = "sm" }: { size?: "sm" | "lg" }) {
  return (
    <span className={s.lockup} data-size={size}>
      <span className={s.lockupPuff}>Puff</span>
      <span className={s.lockupVegas}>Vegas</span>
    </span>
  );
}

/* -------------------------------------------------------------------------
   Utility bar.

   One of the two islands that stay lit at any hour (data-island="lit"), so it
   keeps the night ramp even in day mode. It is the sign band.
   ------------------------------------------------------------------------- */

export function UtilityBar({ hotel }: { hotel?: string }) {
  return (
    <div className={s.utility} data-island="lit">
      <span className={s.utilityHours}>Open 24 hours</span>
      <span className={s.utilityDot} aria-hidden="true">
        ·
      </span>
      <span className={s.utilityAddr}>{SHOP_STREET}</span>
      <a className={s.utilityPhone} href={PHONE_HREF}>
        {PHONE_DISPLAY}
      </a>
      <span className={s.utilityRight}>
        {hotel ? (
          <>
            Delivering to {hotel} ·{" "}
            <a className={s.utilityChange} href="/delivery">
              change
            </a>
          </>
        ) : (
          <a className={s.utilityChange} href="/delivery">
            Set your hotel
          </a>
        )}
      </span>
      <span className={s.utilityAge}>21+ only</span>
    </div>
  );
}

/* -------------------------------------------------------------------------
   Age banner.

   The affirm control is a real form POST to /api/age, so it works with
   scripting off. That is a hard rule here and it survives the redesign
   unchanged — see docs/ARCHITECTURE.md.
   ------------------------------------------------------------------------- */

export function AgeBanner({ affirmed }: { affirmed: boolean }) {
  if (affirmed) return null;

  return (
    <aside className={s.ageBanner} aria-label="Age verification">
      <span className={s.ageLabel}>21+ only</span>
      <p className={s.ageCopy}>ID at the door, every time.</p>
      <form action="/api/age" method="POST">
        <button className={s.ageAffirm} type="submit">
          I&rsquo;m 21 or older
        </button>
      </form>
    </aside>
  );
}

/* -------------------------------------------------------------------------
   Header — logo, search affordance, menu.

   The search control is an <a> to /search, not an input. The design draws a
   "SEARCH" pill; making it a link means the header costs no JavaScript and the
   real search page (which already works as a GET form) does the work.
   ------------------------------------------------------------------------- */

export function Header() {
  return (
    <header className={s.header}>
      <a href="/" aria-label="Puff Vegas — home" className={s.brand}>
        <Wordmark />
      </a>
      <div className={s.headerActions}>
        <a className={s.searchPill} href="/search">
          Search
        </a>
        <ThemeToggle />
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------
   Bottom navigation — FLOOR / BRANDS / DELIVERY / VISIT.

   Replaces the six-department tab bar. The design moves department switching
   into "THE FLOOR" and gives the bar the four things a customer arrives
   wanting: browse, brand-loyal browse, get it delivered, come here.
   ------------------------------------------------------------------------- */

const NAV = [
  { label: "Floor", href: "/vape" },
  { label: "Brands", href: "/vape/brands" },
  { label: "Delivery", href: "/delivery" },
  { label: "Visit", href: "/pickup" },
] as const;

export async function BottomNav() {
  const h = await headers();
  const path = h.get(PATH_HEADER) ?? "";

  return (
    <>
      <div className={s.navSpacer} aria-hidden="true" />
      <nav className={s.bottomNav} aria-label="Sections">
        {NAV.map(({ label, href }) => {
          const here = path === href || path.startsWith(`${href}/`);
          return (
            <a
              key={href}
              className={s.navItem}
              href={href}
              aria-current={here ? "page" : undefined}
            >
              {label}
            </a>
          );
        })}
      </nav>
    </>
  );
}

/* -------------------------------------------------------------------------
   Footer.
   ------------------------------------------------------------------------- */

export function Footer() {
  return (
    <footer className={s.footer}>
      <p className={s.footerHours}>
        Never closed · {SHOP_ADDRESS_LINE.toUpperCase()}
      </p>
      <p className={s.footerLegal}>
        21+ with valid ID, at the counter and at your door. Nicotine is an
        addictive chemical. We do not ship — local delivery only. Hemp products
        sold in compliance with Nevada law.
      </p>
      <div className={s.footerSwitch}>
        <ThemeToggle />
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------
   Status strip — OPEN, and the delivery terms as one phrase.
   ------------------------------------------------------------------------- */

export function StatusModule({ eta = DELIVERY_TERMS_LABEL }: { eta?: string }) {
  return (
    <section className={s.status} aria-label="Store status">
      <div className={s.statusCell}>
        <span className={s.statusLabel}>Status</span>
        <span className={s.statusOpen}>
          <span className={s.liveDot} aria-hidden="true" />
          Open
        </span>
      </div>
      <div className={s.statusCell}>
        <span className={s.statusLabel}>Strip delivery</span>
        <span className={s.statusValue}>{eta}</span>
      </div>
      <div className={s.statusCell}>
        <span className={s.statusLabel}>Fee</span>
        <span className={s.statusValue}>{DELIVERY_STRIP_FEE_LABEL} flat</span>
      </div>
    </section>
  );
}
