import type { Metadata } from "next";
import { headers } from "next/headers";
import s from "../Home.module.css";
import r from "./Search.module.css";
import PageNicotineWarning from "@/components/PageNicotineWarning";
import { AgeBanner, Header, BottomNav } from "@/components/Chrome";
import { AGE_HEADER } from "@/lib/age-shared";
import {
  commerce,
  DEPARTMENT_LABELS,
  DEPARTMENTS,
  formatMoney,
  stockLabel,
  type Department,
  type Product,
} from "@/lib/commerce";
import { searchDocs, toDoc } from "@/lib/search";

/* A results page is a dead end for crawlers and there are unbounded queries. */
export const metadata: Metadata = {
  title: "Search | Puff Vegas",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const h = await headers();
  const affirmed = h.get(AGE_HEADER) === "1";

  const all = await commerce.getProducts();
  /* The same scorer the typeahead runs, so the dropdown and this page can
     never disagree about what matches. Hits stay in score order — grouping
     below must not re-sort them alphabetically. */
  const bySlug = new Map(all.map((p) => [p.slug, p]));
  const hits = searchDocs(all.map(toDoc), q, 120)
    .map((d) => bySlug.get(d.slug))
    .filter((p): p is Product => Boolean(p));
  const groups = groupByDepartment(hits);

  return (
    <div>
      <AgeBanner affirmed={affirmed} />
      <Header />

      <main className={s.main}>
        <section className={s.shelfHead}>
          <div>
            <span className={s.shelfIndex}>Search</span>
            <h1 className={s.shelfTitle}>
              {q ? `“${q}”` : "Search the shop"}
            </h1>
            <p className={s.shelfNote}>
              {q
                ? `${hits.length} ${hits.length === 1 ? "product" : "products"} on the wall.`
                : "Brand, flavour or device — 175 products behind the counter."}
            </p>
          </div>
        </section>

        {hits.length > 0 && <PageNicotineWarning products={hits} />}

        {q && hits.length === 0 ? (
          <Empty q={q} />
        ) : (
          groups.map((g) => (
            <section key={g.department} className={r.group} aria-label={DEPARTMENT_LABELS[g.department]}>
              <div className={r.groupHead}>
                <h2 className={r.groupTitle}>
                  {DEPARTMENT_LABELS[g.department]}
                  <span className={r.groupCount}> · {g.items.length}</span>
                </h2>
                <a className={r.groupMore} href={`/${g.department}`}>
                  See all in {DEPARTMENT_LABELS[g.department]} →
                </a>
              </div>
              <ul className={s.shelf}>
                {g.items.map((p) => (
                  <Hit key={p.id} product={p} />
                ))}
              </ul>
            </section>
          ))
        )}
      </main>

      <BottomNav />
    </div>
  );
}

/**
 * Never a flat blended list. A cigar shopper wading through disposables is
 * the failure the department system exists to prevent; search has to honour
 * it too. Ranking inside each group is the scorer's; the groups themselves
 * follow the nav order so the page is stable from query to query.
 */
function groupByDepartment(hits: Product[]): { department: Department; items: Product[] }[] {
  return DEPARTMENTS.map((department) => ({
    department,
    items: hits.filter((p) => p.department === department),
  })).filter((g) => g.items.length > 0);
}

/* A dead end is the worst outcome for a shop that answers its phone, so the
   empty state hands over to a person rather than apologising. */
function Empty({ q }: { q: string }) {
  return (
    <div className={r.empty}>
      <p className={r.emptyLine}>
        Nothing on the wall matches <strong>{q}</strong>.
      </p>
      <p className={r.emptyNote}>Text us. We&rsquo;ll look.</p>
      <div className={r.emptyActions}>
        <a className={s.cta} href="sms:+17026137799">
          Text us about it
        </a>
        <a className={r.emptyLink} href="/vape">
          Browse everything →
        </a>
      </div>
    </div>
  );
}

function Hit({ product: p }: { product: Product }) {
  const img = p.images[0];
  return (
    <li className={s.tile}>
      <a className={s.tileLink} href={`/p/${p.slug}`}>
        <div
          className={s.tileShot}
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
