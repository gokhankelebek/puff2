import { headers } from "next/headers";
import s from "./Home.module.css";
import PageNicotineWarning from "@/components/PageNicotineWarning";
import Bulbs from "@/components/Bulbs";
import {
  AgeBanner,
  BottomNav,
  Footer,
  Header,
  UtilityBar,
} from "@/components/Chrome";
import { AGE_HEADER } from "@/lib/age-shared";
import { hourBand, pacificHour, type HourBand } from "@/lib/time";
import {
  commerce,
  formatMoney,
  stockLabel,
  DEPARTMENT_LABELS,
  type Department,
  type Product,
} from "@/lib/commerce";
import {
  DELIVERY_STRIP_FEE_LABEL,
  DELIVERY_TERMS_LABEL,
  HOTELS,
} from "@/lib/hotels";
import { SHOP_STREET } from "@/lib/shop";
import { DepartmentMark } from "@/components/Icons";

/**
 * Which departments lead the shelf, by hour.
 *
 * Survives from the previous design because it was never art direction: a
 * 4 a.m. arrival and a 2 p.m. arrival want different things off the same
 * shelf, and that is a merchandising fact rather than a visual one.
 */
const SHELF_ORDER: Record<HourBand, Department[]> = {
  hours: ["vape", "cigarettes", "accessories", "cigars"],
  daytime: ["cigars", "vape", "accessories", "hookah"],
  evening: ["hookah", "vape", "cigars", "accessories"],
  late: ["vape", "accessories", "hookah", "cigarettes"],
};

/** The rail bleeds its last card off-screen as a scroll affordance, so an
 *  even count would sit flush and read as the end of the list. */
const RAIL_SIZE = 9;

/**
 * "THE FLOOR" — the 2×2 grid.
 *
 * The design draws DISPOSABLES / GLASS / HEMP & CBD / CIGARS with a subtitle
 * each. Departments and their counts come from the catalogue rather than the
 * mock, so a tile can never advertise a shelf that is empty.
 */
const FLOOR: { department: Department; note: string }[] = [
  { department: "vape", note: "Disposables, pods and juice" },
  { department: "glass", note: "Blown here in Vegas" },
  { department: "hemp", note: "COAs on file" },
  { department: "cigars", note: "Walk-in humidor" },
];

export default async function HomePage() {
  const h = await headers();
  const affirmed = h.get(AGE_HEADER) === "1";

  const band = hourBand(pacificHour(new Date()));
  const all = await commerce.getProducts();
  const rail = buildShelf(all, band).slice(0, RAIL_SIZE);

  const counts = all.reduce<Partial<Record<Department, number>>>((acc, p) => {
    acc[p.department] = (acc[p.department] ?? 0) + 1;
    return acc;
  }, {});

  const departmentCount = new Set(all.map((p) => p.department)).size;

  /* Day and night say the same thing about the shop and a different thing
     about the hour. Both are driven by the same clock that decides the shelf
     order, so the page cannot claim 4 a.m. while merchandising for noon. */
  const night = band === "late" || band === "hours";
  const heroHour = night ? "It's 4 AM." : "It's 2 PM.";
  const railHeading = night ? "Moving tonight" : "Moving today";

  /* Five names, then the count of everything else. HOTELS is the real list,
     so "+ N more" cannot drift out of step with the picker on /delivery. */
  const featured = HOTELS.slice(0, 5);
  const moreHotels = Math.max(0, HOTELS.length - featured.length);

  return (
    <>
      <UtilityBar />
      <AgeBanner affirmed={affirmed} />
      <Header />
      <Bulbs />

      <main className={s.main}>
        <section className={s.hero} aria-labelledby="hero-title">
          <div className={s.heroCopy}>
            <p className={s.eyebrow}>Open 24 hours · Center Strip</p>
            <h1 className={s.heroTitle} id="hero-title">
              {heroHour}
              <br />
              We&rsquo;re open.
            </h1>
            <p className={s.heroSub}>
              Walk in at {SHOP_STREET}, or we&rsquo;ll bring it to your hotel
              room. {DELIVERY_TERMS_LABEL}.
            </p>
            <div className={s.heroCtas}>
              <a className={s.ctaPrimary} href="/delivery">
                Deliver to my room
              </a>
              <a className={s.ctaGhost} href="/vape">
                Browse
              </a>
            </div>

            {/* The second lit island: neon at any hour, day mode included. */}
            <div className={s.picker} data-island="lit">
              <p className={s.pickerTitle}>Where are you staying?</p>
              <ul className={s.chipRow}>
                {featured.map((hotel) => (
                  <li key={hotel.slug}>
                    <a
                      className={s.chip}
                      href={`/delivery?hotel=${encodeURIComponent(hotel.slug)}`}
                    >
                      {hotel.name}
                    </a>
                  </li>
                ))}
                <li>
                  <a className={s.chipMore} href="/delivery">
                    + {moreHotels} more
                  </a>
                </li>
              </ul>
              <p className={s.pickerNote}>
                Typical hotel run: 25–40 min · {DELIVERY_TERMS_LABEL}
              </p>
            </div>
          </div>

          <div className={s.heroMedia} aria-hidden="true">
            <span className={s.photoNote}>The shop at 4 AM</span>
          </div>
        </section>

        <Bulbs />

        <section className={s.floor} aria-labelledby="floor-title">
          <div className={s.sectionHead}>
            <h2 className={s.sectionTitle} id="floor-title">
              The floor
            </h2>
            <a className={s.sectionLink} href="/vape">
              All {departmentCount} →
            </a>
          </div>
          <ul className={s.floorGrid}>
            {FLOOR.map(({ department, note }, i) => {
              const n = counts[department] ?? 0;
              return (
                <li key={department}>
                  <a className={s.floorCard} href={`/${department}`} data-ground={(i % 4) + 1}>
                    <span className={s.floorShot}>
                      <DepartmentMark department={department} size={64} />
                    </span>
                    <span className={s.floorName}>
                      {DEPARTMENT_LABELS[department]}
                    </span>
                    {/* Only claim a count when there is one. An empty shelf
                        says what it is rather than showing "0 in stock". */}
                    <span className={s.floorNote}>
                      {n > 0 ? `${n} in stock` : note}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>

        <Bulbs />

        <section className={s.rail} aria-labelledby="rail-title">
          <div className={s.sectionHead}>
            <h2 className={s.sectionTitle} id="rail-title">
              {railHeading}
            </h2>
            <span className={s.sectionMeta}>{stockSyncLabel(rail)}</span>
          </div>
          <ul className={s.railTrack}>
            {rail.map((p, i) => (
              <li key={p.slug} className={s.railItem}>
                <a className={s.railCard} href={`/p/${p.slug}`} data-ground={(i % 4) + 1}>
                  <span className={s.railShot}>
                    {p.images[0] ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        className={s.railImg}
                        src={p.images[0].src}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <DepartmentMark department={p.department} size={56} />
                    )}
                  </span>
                  <span className={s.railName}>{p.title}</span>
                  <span className={s.railPrice}>{formatMoney(p.price)}</span>
                  <StockNote product={p} />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <Bulbs />

        <section className={s.deliveryBand} data-island="lit" aria-labelledby="band-title">
          <h2 className={s.bandTitle} id="band-title">
            {DELIVERY_STRIP_FEE_LABEL} flat.
            <br />
            No minimum.
          </h2>
          <ul className={s.bandStats}>
            <li className={s.bandStat}>
              <span className={s.bandFigure}>25–40</span>
              <span className={s.bandLabel}>Minutes, typical</span>
            </li>
            <li className={s.bandStat}>
              <span className={s.bandFigure}>{HOTELS.length}</span>
              <span className={s.bandLabel}>Strip hotels served</span>
            </li>
            <li className={s.bandStat}>
              <span className={s.bandFigure}>24/7</span>
              <span className={s.bandLabel}>Every hour</span>
            </li>
          </ul>
          <a className={s.ctaPrimary} href="/delivery">
            Start a delivery
          </a>
        </section>

        {/* 21 CFR 1143.3(a) attaches to the ADVERTISEMENT, and a priced grid of
            ENDS listings is one. See docs/COMPLIANCE.md. */}
        <PageNicotineWarning products={rail} />
      </main>

      <Bulbs />
      <Footer />
      <BottomNav />
    </>
  );
}

/**
 * Stock is a claim with provenance, so the rail says when it was last counted
 * rather than implying it is live. Falls back to saying nothing at all — an
 * invented timestamp is worse than an absent one.
 */
function stockSyncLabel(products: Product[]): string {
  const counted = products
    .map((p) => p.stock.countedAt)
    .filter((d): d is Date => d instanceof Date)
    .sort((a, b) => a.getTime() - b.getTime())
    .at(-1);
  if (!counted) return "";
  const mins = Math.round((Date.now() - counted.getTime()) / 60000);
  if (!Number.isFinite(mins) || mins < 0) return "";
  if (mins < 60) return `updated ${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `updated ${hours} h ago`;
  return `updated ${Math.round(hours / 24)} d ago`;
}

/** Green in stock, magenta when it is nearly gone, dim when it is not there. */
function StockNote({ product: p }: { product: Product }) {
  const tone =
    p.stock.tier === "out"
      ? "out"
      : p.stock.tier === "low"
        ? "low"
        : "in";
  return (
    <span className={s.railStock} data-tone={tone}>
      {stockLabel(p.stock)}
    </span>
  );
}

/**
 * The shelf: the leading departments for this hour, interleaved so no single
 * department owns the top of the rail, and out-of-stock last.
 */
function buildShelf(all: Product[], band: HourBand): Product[] {
  const order = SHELF_ORDER[band];
  const byDept = new Map<Department, Product[]>();

  for (const p of all) {
    if (!order.includes(p.department)) continue;
    const list = byDept.get(p.department) ?? [];
    list.push(p);
    byDept.set(p.department, list);
  }

  for (const [, list] of byDept) {
    list.sort((a, b) => {
      const aOut = a.stock.tier === "out" ? 1 : 0;
      const bOut = b.stock.tier === "out" ? 1 : 0;
      if (aOut !== bOut) return aOut - bOut;
      return (b.popularity ?? 0) - (a.popularity ?? 0);
    });
  }

  const out: Product[] = [];
  for (let round = 0; out.length < RAIL_SIZE * 2; round += 1) {
    let added = false;
    for (const dept of order) {
      const next = byDept.get(dept)?.[round];
      if (next) {
        out.push(next);
        added = true;
      }
    }
    if (!added) break;
  }
  return out;
}
