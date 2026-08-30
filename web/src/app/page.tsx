import { headers } from "next/headers";
import s from "./Home.module.css";
import PageNicotineWarning from "@/components/PageNicotineWarning";
import Bulbs from "@/components/Bulbs";
import { AgeBanner, BottomNav, Footer, Header, UtilityBar } from "@/components/Chrome";
import { AGE_HEADER } from "@/lib/age-shared";
import { hourLabel, isNight, vegasHour } from "@/lib/time";
import {
  commerce,
  formatMoney,
  stockLabel,
  DEPARTMENT_LABELS,
  DEPARTMENTS,
  type Department,
  type Product,
} from "@/lib/commerce";
import {
  DELIVERY_STRIP_FEE_LABEL,
  DELIVERY_TERMS_LABEL,
  HOTELS,
} from "@/lib/hotels";
import { SHOP_MALL, SHOP_STREET } from "@/lib/shop";
import DepartmentIcon from "@/components/DepartmentIcon";

/**
 * Which departments lead the rail.
 *
 * A flat order, not the old four-band system that re-sorted the whole shelf
 * by time of day. That was the previous art direction's whole thesis -- the
 * hour as the product -- and it is not this one. Marquee Neon asks the clock
 * two questions (is it night, is it graveyard) and nothing more.
 */
const RAIL_ORDER: Department[] = ["vape", "glass", "cigars", "accessories"];

/**
 * Nine on mobile, where the rail scrolls and the last card bleeds off-screen
 * as the scroll affordance. Ten on desktop, where it becomes a 5-across grid
 * and nine would leave a hole in the second row.
 */
const RAIL_SIZE = 10;

/**
 * "THE FLOOR" — every department, in the order the shop wants them walked.
 *
 * The handoff draws four tiles and an "ALL 9 →". We show all of them and let
 * the extras slide on desktop, so the link is a shortcut to the index rather
 * than the only way to discover that a sixth shelf exists.
 *
 * The note is the fallback for a shelf with nothing published on it. It has to
 * be true on its own terms: hemp does NOT say "COAs on file", because none are
 * on file yet — that is exactly why it has nothing to list.
 */
const FLOOR_NOTES: Record<Department, string> = {
  vape: "Disposables, pods and juice",
  cigars: "Walk-in humidor",
  cigarettes: "Every pack, behind the counter",
  hookah: "Shisha, bowls and charcoal",
  glass: "Blown here in Vegas",
  hemp: "In the shop, not listed yet",
  accessories: "Lighters, papers, grinders",
};


export default async function HomePage() {
  const h = await headers();
  const affirmed = h.get(AGE_HEADER) === "1";
  const hour = vegasHour();
  const all = await commerce.getProducts();
  const rail = buildShelf(all).slice(0, RAIL_SIZE);

  /* On the shelf, not merely listed. This counted every product in the
     department and labelled the result "in stock", so the homepage claimed 74
     vape in stock while /floor — which filters out the "out" tier — said 68.
     Inventory credibility is the thing this site differentiates on; it cannot
     be the thing the homepage is loosest about. Same predicate as
     app/floor/page.tsx. */
  const counts = all.reduce<Partial<Record<Department, number>>>((acc, p) => {
    if (p.stock.tier === "out") return acc;
    acc[p.department] = (acc[p.department] ?? 0) + 1;
    return acc;
  }, {});

  const departmentCount = new Set(all.map((p) => p.department)).size;

  /* One clock, read once: the headline and the rail heading cannot disagree
     about what time it is. */
  const night = isNight(hour);
  const heroHour = hourLabel(hour);
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
            <p className={s.eyebrow}>Center Strip · {SHOP_MALL}</p>
            <h1 className={s.heroTitle} id="hero-title">
              {heroHour}
              <br />
              We&rsquo;re open.
            </h1>
            <p className={s.heroSub}>
              Walk in at{" "}
              <a className={s.heroAddr} href="/pickup">
                {SHOP_STREET}
              </a>
              , or we&rsquo;ll run it to your hotel and meet you downstairs.
            </p>
            {/* The flat fee and the missing minimum are the offer, and they
                were the tail of a grey sentence. Own line, own weight. */}
            <p className={s.heroTerms}>{DELIVERY_TERMS_LABEL}</p>
            {/* Two ways to buy, sized as peers. "Browse" used to sit here and
                was demoted for competing with the primary — correctly, because
                it was a smaller action and the floor is right below with its
                own link. Coming to the shop is not a smaller action; it is the
                other sale, and for anyone already on the Strip it is the better
                one. Which fits depends on where the reader is standing, which
                the page cannot know. */}
            <div className={s.heroCtas}>
              <a className={s.ctaPrimary} href="/delivery">
                Deliver to my hotel
              </a>
              <a className={s.ctaGhost} href="/pickup">
                Come to the shop
              </a>
            </div>

          </div>

          <div className={s.heroMedia}>
            {/* A photograph of the actual shop, replacing a generated
                storefront render. A real address with an invented shopfront is
                a trust problem, not a styling one, so the render is gone
                rather than moved to another section.

                The LCP. srcset because the panel is ~640px on a phone and
                ~620px on desktop; the source is 1024 wide, so 1x is covered
                and 2x is soft. A higher-resolution original would fix that —
                see docs/OPEN-DECISIONS.md. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={s.heroImg}
              src="/hero/interior-1024.webp"
              srcSet="/hero/interior-640.webp 640w, /hero/interior-1024.webp 1024w"
              sizes="(min-width: 1200px) 620px, 100vw"
              width={1024}
              height={768}
              alt="Inside Puff Vegas: the SMOKE SHOP sign over the back counter, wall of vapes and cigars, glass cases of pipes."
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </section>

        <Bulbs />

        <section className={s.floor} aria-labelledby="floor-title">
          <div className={s.sectionHead}>
            <h2 className={s.sectionTitle} id="floor-title">
              The floor
            </h2>
            <a className={s.sectionLink} href="/floor">
              All {departmentCount} →
            </a>
          </div>
          <ul className={s.floorGrid}>
            {DEPARTMENTS.map((department, i) => {
              const n = counts[department] ?? 0;
              return (
                <li key={department} className={s.floorCell}>
                  <a
                    className={s.floorCard}
                    href={`/${department}`}
                    data-ground={(i % 4) + 1}
                  >
                    <span className={s.floorShot}>
                      <DepartmentIcon department={department} />
                    </span>
                    <span className={s.floorName}>
                      {DEPARTMENT_LABELS[department]}
                    </span>
                    {/* Only claim a count when there is one. An empty shelf
                        says what it is rather than showing "0 in stock". */}
                    <span className={s.floorNote}>
                      {n > 0 ? `${n} in stock` : FLOOR_NOTES[department]}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>

        <Bulbs />

        {/* 21 CFR 1143.3(a) attaches to the ADVERTISEMENT, and the priced
            grid below is one. It sits directly above that grid rather than at
            the top of the page — see components/NicotineWarning.module.css. */}
        <PageNicotineWarning products={rail} />

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
                      <DepartmentIcon department={p.department} />
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

        {/* The shop, given the same weight as the delivery band below it.
            The homepage carried two delivery sections and none for the shop,
            and reached /pickup only through an address link inside a grey
            sentence — the strongest asset the business has, with no button
            anywhere on its own front page.

            On the page surface rather than lit, so the two bands read as two
            offers instead of one long dark stretch: the shop is a real room,
            the delivery band is a neon service. */}
        <section className={s.shopBand} aria-labelledby="shop-title">
          <h2 className={s.shopTitle} id="shop-title">
            No fee.
            <br />
            No wait.
          </h2>
          <ul className={s.bandStats}>
            <li className={s.bandStat}>
              <span className={s.shopFigure}>{all.length}</span>
              <span className={s.shopLabel}>On the floor</span>
            </li>
            <li className={s.bandStat}>
              <span className={s.shopFigure}>$0</span>
              <span className={s.shopLabel}>To walk in</span>
            </li>
            <li className={s.bandStat}>
              <span className={s.shopFigure}>2nd</span>
              <span className={s.shopLabel}>Level, next to Ole Red</span>
            </li>
          </ul>
          <p className={s.shopNote}>
            Open every hour of the year at {SHOP_STREET}, inside {SHOP_MALL}.
            Handle the glass, ask what is worth it, walk out with it.
          </p>
          <a className={s.ctaPrimary} href="/pickup">
            Find the shop
          </a>
        </section>

        {/* The one strip that runs. A single chasing divider above the
            delivery band reads as a sign; every divider running would read as
            a fairground. */}
        <Bulbs chase />

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
          {/* Moved down from the hero, where it took the lower half for one
              of the two ways to buy. Here it sits inside the section that
              explains the thing it starts. */}
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
              Typical hotel run: 25–40 min
            </p>
          </div>
          <a className={s.ctaPrimary} href="/delivery">
            Start a delivery
          </a>
        </section>

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
function buildShelf(all: Product[]): Product[] {
  const order = RAIL_ORDER;
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
