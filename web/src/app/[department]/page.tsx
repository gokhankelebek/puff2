import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";
import s from "./Category.module.css";
import {
  AgeBanner,
  Grain,
  Header,
  StatusModule,
  TabBar,
} from "@/components/Chrome";
import Marquee from "@/components/Marquee";
import { EmptyResults, ProductTiles } from "@/components/ProductTiles";
import PageNicotineWarning from "@/components/PageNicotineWarning";
import { AGE_HEADER } from "@/lib/age-shared";
import { hourBand, pacificHour } from "@/lib/time";
import {
  commerce,
  archetypeFor,
  DEPARTMENTS,
  DEPARTMENT_TITLES,
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
    title: `${DEPARTMENT_TITLES[department]} — open 24 hours on the Strip | Puff Vegas`,
    // Faceted views canonicalise to the clean URL and are noindexed. Blocking
    // them in robots.txt instead would be wrong: a blocked URL cannot pass or
    // consolidate signals, so Google's own guidance warns against using
    // robots.txt for canonicalisation.
    alternates: { canonical: `/${department}` },
    robots: filtered ? { index: false, follow: true } : { index: true, follow: true },
  };
}

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

  const now = new Date();
  const band = hourBand(pacificHour(now));

  const all = await commerce.getProducts({ department });
  const archetype = archetypeFor(department);
  const isHumidor = department === "cigars";
  const hasFlavors = all.some((p) => p.flavorFamily);
  const hasBrands = all.some((p) => p.brand);

  // Filtering happens on the server from the URL, so it works with JS off and
  // every filtered view is shareable.
  const items = all
    .filter((p) => (sp.flavor ? p.flavorFamily === sp.flavor : true))
    .filter((p) => (sp.nic ? String(p.nicotineMg ?? "") === sp.nic : true))
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));

  return (
    <div
      data-band={band === "late" ? "late" : undefined}
      data-zone={isHumidor ? "humidor" : undefined}
    >
      <Grain />
      <AgeBanner affirmed={affirmed} />
      <Header />
      <StatusModule band={band} />
      <Marquee />

      <main className={s.wrap}>
        <div className={s.head}>
          <h1 className={s.title}>{DEPARTMENT_TITLES[department]}</h1>
          <span className={s.count}>
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>

        {(hasFlavors || hasBrands) && (
          <nav className={s.hubs} aria-label="Browse this department">
            {hasFlavors && (
              <a className={s.hubLink} href={`/${department}/flavors`}>
                By flavour →
              </a>
            )}
            {hasBrands && (
              <a className={s.hubLink} href={`/${department}/brands`}>
                By brand →
              </a>
            )}
          </nav>
        )}

        {/* A browse grid of priced, pictured products is advertising, and
            21 CFR 1143.3(a) attaches to the advertisement. Until now the
            warning lived only on the product page, so /vape listed 73 ENDS
            products carrying none. See components/PageNicotineWarning. */}
        <PageNicotineWarning products={items} />

        {archetype === "chip-swatch" && (
          <Facets department={department} search={sp} products={all} />
        )}

        {isHumidor && (
          <p className={s.humidorBar}>
            <span>70°F / 69% RH</span>
            <span>Singles from $8.50</span>
          </p>
        )}

        {items.length === 0 ? (
          <EmptyResults clearHref={`/${department}`} />
        ) : (
          <ProductTiles items={items} archetype={archetype} />
        )}
      </main>

      <TabBar />
    </div>
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
