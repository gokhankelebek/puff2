import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";
import s from "./Category.module.css";
import { AgeBanner, BottomNav, Footer, Header, UtilityBar } from "@/components/Chrome";
import { EmptyResults, ProductTiles } from "@/components/ProductTiles";
import PageNicotineWarning from "@/components/PageNicotineWarning";
import Bulbs from "@/components/Bulbs";
import { activeFilterCount, applyFilters } from "@/lib/filters";
import { AGE_HEADER } from "@/lib/age-shared";
import {
  commerce,
  DEPARTMENTS,
  DEPARTMENT_LABELS,
  FLAVOR_FAMILIES,
  isDepartment,
  NICOTINE_STRENGTHS,
  type Department,
  type Product,
} from "@/lib/commerce";

type Search = { flavor?: string; nic?: string };

export function generateStaticParams() {
  return DEPARTMENTS.map((department) => ({ department }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ department: string }>;
  searchParams: Promise<Search>;
}): Promise<Metadata> {
  const { department } = await params;
  if (!isDepartment(department)) return { title: "Not found | Puff Vegas" };
  const sp = await searchParams;
  const filtered = Boolean(sp.flavor || sp.nic);

  return {
    title: `${DEPARTMENT_LABELS[department]} — open 24 hours on the Strip | Puff Vegas`,
    // Faceted views canonicalise to the clean URL and are noindexed. Blocking
    // them in robots.txt instead would be wrong: a blocked URL cannot pass or
    // consolidate signals, so Google's own guidance warns against using
    // robots.txt for canonicalisation.
    alternates: { canonical: `/${department}` },
    robots: filtered ? { index: false, follow: true } : { index: true, follow: true },
  };
}

/**
 * Real photographs of a department, where one exists. Deliberately partial —
 * see the render site. Cropped from research/photos/.
 */
const DEPARTMENT_PHOTO: Partial<
  Record<Department, { src: string; srcSet: string; alt: string }>
> = {
  vape: {
    src: "/shop/vape-wall-1152.webp",
    srcSet: "/shop/vape-wall-640.webp 640w, /shop/vape-wall-1152.webp 1152w",
    alt: "The vape wall at Puff Vegas: rows of disposables sorted by flavour, every colour of the spectrum, with lighters on the shelf below.",
  },
};

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ department: string }>;
  searchParams: Promise<Search>;
}) {
  const { department } = await params;
  if (!isDepartment(department)) notFound();

  const sp = await searchParams;
  const h = await headers();
  const affirmed = h.get(AGE_HEADER) === "1";

  const all = await commerce.getProducts({ department });
  const hasFlavors = all.some((p) => p.flavorFamily);
  const hasBrands = all.some((p) => p.brand);

  // Filtering happens on the server from the URL, so it works with JS off and
  // every filtered view is shareable.
  const items = applyFilters(all, sp).sort(
    (a, b) => (b.popularity ?? 0) - (a.popularity ?? 0),
  );
  const filterCount = activeFilterCount(sp);

  /* Stock is a claim with provenance. If nothing was counted, say nothing —
     an invented freshness line is worse than an absent one. */
  const counted = items
    .map((p) => p.stock.countedAt)
    .filter((x): x is Date => x instanceof Date)
    .sort((a, b) => a.getTime() - b.getTime())
    .at(-1);
  const syncMins = counted
    ? Math.max(0, Math.round((Date.now() - counted.getTime()) / 60000))
    : null;

  const inStock = items.filter((p) => p.stock.tier !== "out").length;

  return (
    <>
      <UtilityBar />
      <AgeBanner affirmed={affirmed} />
      <Header />
      <Bulbs />

      <main className={s.wrap}>
        <div className={s.head}>
          <nav className={s.crumb} aria-label="Breadcrumb">
            <a href="/">Home</a> <span aria-hidden="true">/</span>{" "}
            <span>{DEPARTMENT_LABELS[department]}</span>
          </nav>
          <h1 className={s.title}>{DEPARTMENT_LABELS[department]}</h1>
          {/* Two numbers, and they are not the same number: the filter sheet
              promises how many MATCH, this page leads with how many are on
              the shelf. When some matches are out of stock those differ, and
              saying only the second makes the sheet's button look like a lie.
              So both are shown whenever they disagree. */}
          <p className={s.count}>
            {items.length !== inStock
              ? `${items.length} ${items.length === 1 ? "result" : "results"} · ${inStock} on the shelf right now`
              : `${inStock} on the shelf right now`}
            {syncMins !== null ? ` · stock updated ${syncMins} min ago` : ""}
          </p>
        </div>

        {/* Only where a real photograph of that department exists. Vape is the
            one so far, and it is also the largest department — the wall IS the
            category, which no icon or copy line conveys. Keyed by department
            rather than rendered blank, because five empty frames would read as
            five failures to load. */}
        {DEPARTMENT_PHOTO[department] && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            className={s.deptShot}
            src={DEPARTMENT_PHOTO[department]!.src}
            srcSet={DEPARTMENT_PHOTO[department]!.srcSet}
            sizes="(min-width: 1200px) 1120px, 100vw"
            width={1152}
            height={620}
            alt={DEPARTMENT_PHOTO[department]!.alt}
            loading="lazy"
            decoding="async"
          />
        )}

        {(hasFlavors || hasBrands) && (
          <nav className={s.hubs} aria-label="Browse this department">
            {hasBrands && (
              <a className={s.hubLink} href={`/${department}/brands`}>
                By brand →
              </a>
            )}
            {hasFlavors && (
              <a className={s.hubLink} href={`/${department}/flavors`}>
                By flavour →
              </a>
            )}
          </nav>
        )}

        {/* A browse grid of priced, pictured products is advertising, and
            21 CFR 1143.3(a) attaches to the advertisement. See
            components/PageNicotineWarning. */}
        <div className={s.warn}>
          <PageNicotineWarning products={items} />
        </div>

        <div className={s.filterBar}>
          <a className={s.filterLink} href={`/${department}/filters`}>
            Filters
            {filterCount > 0 ? (
              <span className={s.filterCount}>{filterCount}</span>
            ) : null}
          </a>
          {hasFlavors && <Facets department={department} search={sp} products={all} />}
        </div>

        <div className={s.results}>
          {items.length === 0 ? (
            <EmptyResults clearHref={`/${department}`} filtered={filterCount > 0} />
          ) : (
            <ProductTiles items={items} />
          )}
        </div>
      </main>

      <Bulbs />
      <Footer />
      <BottomNav />
    </>
  );
}

/* -------------------------------------------------------------------------
   Facets. Every control is an <a>, so the whole filter system is a set of
   links — no JavaScript, no client state, back button works.
   ------------------------------------------------------------------------- */

function href(department: string, next: Search): string {
  const q = new URLSearchParams();
  if (next.flavor) q.set("flavor", next.flavor);
  if (next.nic) q.set("nic", next.nic);
  const qs = q.toString();
  return qs ? `/${department}?${qs}` : `/${department}`;
}

function Facets({
  department,
  search,
  products,
}: {
  department: string;
  search: Search;
  products: Product[];
}) {
  // Only offer facets that have something behind them. A filter that leads to
  // zero results is a dead end we chose to build.
  const families = FLAVOR_FAMILIES.filter((f) =>
    products.some((p) => p.flavorFamily === f.id),
  );
  const strengths = NICOTINE_STRENGTHS.filter((n) =>
    products.some((p) => p.nicotineMg === n),
  );
  const active = Boolean(search.flavor || search.nic);

  return (
    <div className={s.facets}>
      <div className={s.facetRow}>
        <span className={s.facetLabel}>Flavour</span>
        {families.map((f) => {
          const on = search.flavor === f.id;
          return (
            <a
              key={f.id}
              className={`${s.chip} ${on ? s.chipOn : ""}`}
              href={href(department, { ...search, flavor: on ? undefined : f.id })}
            >
              <span
                className={s.swatch}
                style={{ background: `var(--flavor-${f.id})` }}
                aria-hidden="true"
              />
              {f.label}
            </a>
          );
        })}
      </div>

      {(strengths.length > 0 || active) && (
      <div className={s.facetRow}>
        {strengths.length > 0 && <span className={s.facetLabel}>Nicotine</span>}
        <span className={s.segmented}>
          {strengths.map((n) => {
            const on = search.nic === String(n);
            return (
              <a
                key={n}
                className={`${s.segment} ${on ? s.segmentOn : ""}`}
                href={href(department, {
                  ...search,
                  nic: on ? undefined : String(n),
                })}
              >
                {n}mg
              </a>
            );
          })}
        </span>
        {active && (
          <a className={s.clear} href={`/${department}`}>
            Clear
          </a>
        )}
      </div>
      )}
    </div>
  );
}
