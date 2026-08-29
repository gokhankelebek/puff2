import s from "./Chrome.module.css";
import {
  DELIVERY_STRIP_FEE_LABEL,
  DELIVERY_TERMS_LABEL,
} from "@/lib/hotels";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import SearchBox from "./SearchBox";
import { headers } from "next/headers";
import { PATH_HEADER } from "@/lib/age-shared";
import { SHOP_ADDRESS_LINE, SHOP_STREET } from "@/lib/shop";

export const PHONE_DISPLAY = "(702) 613-7799";
export const PHONE_HREF = "tel:+17026137799";

/* -------------------------------------------------------------------------
   The lockup.

   This used to be set type — Yellowtail "Puff" beside Bebas "VEGAS" — which
   the handoff drew as a stand-in. The shop has a real logo, so the real logo
   is what ships. See components/Logo.tsx for why it is painted from masks
   rather than shown as the original red artwork.
   ------------------------------------------------------------------------- */

export function Wordmark({ size = "sm" }: { size?: "sm" | "lg" }) {
  /* The full lockup only where there is room for the tagline to be read.
     In the header it is the compact pair. */
  return size === "lg" ? (
    <Logo variant="lockup" className={s.lockupLg} />
  ) : (
    <Logo variant="compact" className={s.lockupSm} />
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
      {/* Links to the gate rather than affirming inline: the design replaces
          a one-tap "I'm 21" with a real date of birth, and that needs a page.
          Still a plain link, so it works with scripting off. */}
      <a className={s.ageAffirm} href="/age">
        Verify my age
      </a>
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
        {/* Two controls for one job, and only ever one of them visible.
            SearchBox is the live one and needs JavaScript; the plain link is
            the fallback and is hidden the moment the head script sets
            data-js, so a phone without JS gets the real search page rather
            than a dead trigger. */}
        <div className={s.headerSearch}>
          <SearchBox />
        </div>
        <a className={s.searchPill} href="/search">
          Search
        </a>
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
  /* "Floor" means the whole floor — the department index — not the vape
     shelf that happened to be first alphabetically. */
  { label: "Floor", href: "/floor" },
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
        21+ with valid ID, at the counter and at every handover. Nicotine is an
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
