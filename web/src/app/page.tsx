import { headers } from "next/headers";
import s from "./Home.module.css";
import PageNicotineWarning from "@/components/PageNicotineWarning";
import {
  AgeBanner,
  Grain,
  Header,
  TabBar,
  Wordmark,
  PHONE_DISPLAY,
  PHONE_HREF,
} from "@/components/Chrome";
import { AGE_HEADER } from "@/lib/age-shared";
import { hourBand, pacificHour, type HourBand } from "@/lib/time";
import {
  commerce,
  formatMoney,
  stockLabel,
  type Department,
  type Product,
} from "@/lib/commerce";
import { brandHref } from "@/lib/slugs";

const SHELF_ORDER: Record<HourBand, Department[]> = {
  hours: ["vape", "cigarettes", "accessories", "cigars"],
  daytime: ["cigars", "vape", "accessories", "hookah"],
  evening: ["hookah", "vape", "cigars", "accessories"],
  late: ["vape", "accessories", "hookah", "cigarettes"],
};

const SHELF_SIZE = 18;

const DEPARTMENTS = [
  ["vape", "Vape", "geek-bar-pulse-x-25k"],
  ["cigars", "Cigars", "acid-kuba-deluxe"],
  ["cigarettes", "Cigarettes", "marlboro"],
  ["hookah", "Hookah", "hookah"],
  ["glass", "Glass", "glass-bong-size-5"],
  ["accessories", "Accessories", "zyn-6-nicotine-pouches"],
] as const;

export default async function HomePage() {
  const h = await headers();
  const affirmed = h.get(AGE_HEADER) === "1";

  const now = new Date();
  const band = hourBand(pacificHour(now));

  const all = await commerce.getProducts();
  const shelf = buildShelf(all, band);
  const brands = buildBrandWall(all);
  const total = all.length;
  const counts = all.reduce<Record<string, number>>((acc, p) => {
    acc[p.department] = (acc[p.department] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div data-band={band === "late" ? "late" : undefined}>
      <Grain />
      <AgeBanner affirmed={affirmed} />
      <Header />

      <section className={s.stage} aria-label="Puff Vegas">
        {/* Poster is LCP. The loop is a local cut of the night Strip
            (scripts/cut-hero-video.py) — muted, no controls, pointer-events
            none so the two doors stay real links with scripting off. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={s.stageMedia}
          src="/hero/puff-night.webp"
          alt=""
          width={1536}
          height={864}
          fetchPriority="high"
        />
        <video
          className={s.stageVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/hero/puff-night.webp"
          aria-hidden="true"
        >
          <source src="/hero/puff-night.mp4" type="video/mp4" />
        </video>
        <div className={s.stageVeil} aria-hidden="true" />
        <div className={s.stageInner}>
          <div className={s.stageCopy}>
            <p className={s.stageKicker}>Open 24 hours</p>
            <p className={s.stagePlace}>Grand Bazaar</p>
            <p className={s.stageWhere}>Next to Ole Red</p>
          </div>
          <div className={s.doors}>
            <a className={`${s.door} ${s.doorPickup}`} href="/pickup">
              Pick-Up
            </a>
            <a className={`${s.door} ${s.doorDelivery}`} href="/delivery">
              Delivery
            </a>
          </div>
        </div>
      </section>

      <main className={s.main}>
        <section className={s.shelfHead}>
          <div>
            <span className={s.shelfIndex}>On the wall</span>
            <h1 className={s.shelfTitle}>The shop</h1>
          </div>
        </section>

        <PageNicotineWarning products={shelf} />

        <ul className={s.shelf}>
          {shelf.map((p) => (
            <ShelfTile key={p.id} product={p} />
          ))}
        </ul>

        <section className={s.cats} aria-label="Shop by category">
          <span className={s.sectionLabel}>Shop by category</span>
          <nav className={s.deptRow}>
            {DEPARTMENTS.map(([href, label, pick]) => {
              const hero = heroFor(all, href, pick);
              return (
                <a key={href} className={s.deptLink} href={`/${href}`}>
                  <span
                    className={s.deptShot}
                    style={
                      hero?.flavorFamily
                        ? ({
                            "--wash": `var(--flavor-${hero.flavorFamily})`,
                          } as React.CSSProperties)
                        : undefined
                    }
                  >
                    {hero?.images[0] && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        className={s.deptImg}
                        src={hero.images[0].src}
                        alt=""
                        loading="lazy"
                      />
                    )}
                  </span>
                  <span className={s.deptText}>
                    <span className={s.deptName}>{label}</span>
                    <span className={s.deptCount}>
                      {counts[href] ?? 0} {counts[href] === 1 ? "item" : "items"}
                    </span>
                  </span>
                </a>
              );
            })}
          </nav>
        </section>

        <section className={s.stats} aria-label="At a glance">
          <div className={s.stat}>
            <span className={s.statFigure}>24/7</span>
            <span className={s.statLabel}>Never closed</span>
          </div>
          <div className={s.stat}>
            <span className={s.statFigure}>{total}</span>
            <span className={s.statLabel}>On the wall</span>
          </div>
        </section>

        {brands.length > 0 && (
          <section className={s.brands} aria-label="Brands we carry">
            <span className={s.brandsLabel}>On the wall</span>
            <ul className={s.brandList}>
              {brands.map((b) => (
                <li key={b}>
                  <a className={s.brand} href={brandHref(b, all)}>
                    {b}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <SiteFooter />
      <TabBar />
    </div>
  );
}

function buildShelf(all: Product[], band: HourBand): Product[] {
  const order = SHELF_ORDER[band];
  const queues = order.map((dept) =>
    all
      .filter((p) => p.department === dept && p.images.length > 0)
      .sort((a, b) => a.title.localeCompare(b.title)),
  );

  const out: Product[] = [];
  for (let round = 0; out.length < SHELF_SIZE; round++) {
    let placed = false;
    for (const q of queues) {
      const next = q[round];
      if (!next) continue;
      out.push(next);
      placed = true;
      if (out.length === SHELF_SIZE) break;
    }
    if (!placed) break;
  }
  return out;
}

function heroFor(all: Product[], dept: string, pick: string): Product | undefined {
  const chosen = all.find((p) => p.slug === pick && p.images.length > 0);
  if (chosen) return chosen;
  return all.find((p) => p.department === dept && p.images[0]?.cutout);
}

function buildBrandWall(all: Product[], limit = 16): string[] {
  const counts = new Map<string, number>();
  for (const p of all) {
    if (!p.brand) continue;
    counts.set(p.brand, (counts.get(p.brand) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, n]) => n > 1)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([brand]) => brand);
}

function ShelfTile({ product: p }: { product: Product }) {
  const img = p.images[0];
  return (
    <li className={s.tile}>
      <a className={s.tileLink} href={`/p/${p.slug}`}>
        <div
          className={`${s.tileShot} ${plateClass(img)}`}
          style={
            p.flavorFamily
              ? ({ "--wash": `var(--flavor-${p.flavorFamily})` } as React.CSSProperties)
              : undefined
          }
        >
          {img && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              className={`${s.tileImg} ${img.cutout ? s.tileImgCutout : ""}`}
              src={img.src}
              alt={img.alt}
              loading="lazy"
            />
          )}
        </div>
        <div className={s.tileMeta}>
          <span className={s.tileName}>{p.title}</span>
          {p.brand && <span className={s.tileBrand}>{p.brand}</span>}
          <span className={s.tileFoot}>
            <span className={s.tilePrice}>{formatMoney(p.price)}</span>
            <span className={s.tileCat}>{p.department}</span>
          </span>
        </div>
        <span className={s.tileStock}>
          {p.inStoreOnly ? p.inStoreReason : stockLabel(p.stock)}
        </span>
      </a>
    </li>
  );
}

function plateClass(img?: Product["images"][number]): string {
  if (!img || img.cutout) return "";
  if (img.plate === "light") return s.tilePlateLight;
  if (img.plate === "dark") return s.tilePlateDark;
  return "";
}

function SiteFooter() {
  return (
    <footer className={s.footer}>
      <div className={s.footerCols}>
        <section className={s.footerCol}>
          <span className={s.footerLabel}>The shop</span>
          <p className={s.footerLine}>3649 S Las Vegas Blvd</p>
          <p className={s.footerLine}>Grand Bazaar Shops · next to Ole Red</p>
          <p className={s.footerLine}>Las Vegas, NV 89109</p>
        </section>

        <section className={s.footerCol}>
          <span className={s.footerLabel}>Hours</span>
          <p className={s.footerLine}>Open 24 hours.</p>
          <a className={s.footerLink} href={PHONE_HREF}>
            {PHONE_DISPLAY} →
          </a>
        </section>

        <section className={s.footerCol}>
          <span className={s.footerLabel}>Get it</span>
          <a className={s.footerLink} href="/pickup">
            Pick-Up →
          </a>
          <a className={s.footerLink} href="/delivery">
            Delivery →
          </a>
        </section>

        <section className={s.footerCol}>
          <span className={s.footerLabel}>ID</span>
          <p className={s.footerLine}>21+. ID at the door.</p>
        </section>
      </div>

      <p className={s.commitment}>
        Same price in store, online and delivered · No tourist pricing
      </p>

      <div className={s.footerRow}>
        <Wordmark size={44} variant="full" />
        <a className={s.commitment} href={PHONE_HREF}>
          {PHONE_DISPLAY}
        </a>
      </div>
    </footer>
  );
}
