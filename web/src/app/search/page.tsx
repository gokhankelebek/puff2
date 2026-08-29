import type { Metadata } from "next";
import { headers } from "next/headers";
/* One stylesheet. This page previously imported `s` from Home.module.css
   while every s.* class it used lived here, so all of them resolved to
   undefined and the page rendered unstyled. */
import s from "./Search.module.css";
import PageNicotineWarning from "@/components/PageNicotineWarning";
import Bulbs from "@/components/Bulbs";
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
import { search, toDoc } from "@/lib/search";

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
  const result = search(all.map(toDoc), q, 120);
  const hits = result.docs
    .map((d) => bySlug.get(d.slug))
    .filter((p): p is Product => Boolean(p));
  const groups = groupByDepartment(hits);

  return (
    <div>
      <AgeBanner affirmed={affirmed} />
      <Header />

      <main className={s.main}>
        <Bulbs />

        <section className={s.searchBar}>
          {/* A real GET form. The header links here, and until now there was
              nothing to type into — you could only search by arriving with a
              ?q= already in the URL. */}
          <form className={s.form} action="/search" method="get" role="search">
            <label className={s.srOnly} htmlFor="q">
              Search the shop
            </label>
            <input
              className={s.input}
              id="q"
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Brand, flavour or device"
              autoComplete="off"
              autoFocus={!q}
              enterKeyHint="search"
            />
            <button className={s.go} type="submit">
              Search
            </button>
          </form>
          {q ? (
            <a className={s.cancel} href="/search">
              Clear
            </a>
          ) : null}
        </section>

        <section className={s.shelfHead}>
          <div>
            <h1 className={s.shelfTitle}>{q ? `“${q}”` : "Search the shop"}</h1>
            <p className={s.shelfNote}>
              {q
                ? `${hits.length} ${hits.length === 1 ? "product" : "products"} on the wall.`
                : `Brand, flavour or device — ${all.length} products behind the counter.`}
            </p>
            {/* Said plainly. Someone who typed a brand we do not carry needs to
                know that is what happened, not be handed lookalikes as if they
                were matches. */}
            {result.relaxed && hits.length > 0 ? (
              <p className={s.approx}>
                <span className={s.approxLead}>Closest on the shelf</span>
                Nothing matched “{q}” exactly, so these are the nearest things
                we stock.
              </p>
            ) : null}
          </div>
        </section>

        {hits.length > 0 && <PageNicotineWarning products={hits} />}

        {q && hits.length === 0 ? (
          <>
            <Empty q={q} />
            <Popular />
          </>
        ) : !q ? (
          <Popular />
        ) : (
          groups.map((g) => (
            <section key={g.department} className={s.group} aria-label={DEPARTMENT_LABELS[g.department]}>
              <div className={s.groupHead}>
                <h2 className={s.groupTitle}>
                  {DEPARTMENT_LABELS[g.department]}
                  <span className={s.groupCount}> · {g.items.length}</span>
                </h2>
                <a className={s.groupMore} href={`/${g.department}`}>
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
/**
 * The empty state, and the popular-search chips the design asks for.
 *
 * Two of these are real, known gaps rather than search failures: the shop
 * does not carry Elf Bar (see docs/OPEN-DECISIONS.md) and has no lighters
 * listed, though the floor page advertises them. Telling someone "nothing
 * matched" when the honest answer is "we don't stock that" wastes their time
 * at 4 a.m., so the copy points at the one thing that always works — asking.
 */
/* Hand-picked, not measured. The heading used to say "Searched a lot
   tonight", which claimed live search behaviour this list has never been
   connected to — invented social proof, the same defect as a generated
   storefront. If search logging lands, the heading can make the claim again. */
const POPULAR = ["Geek Bar", "Lost Mary", "Raz", "Zyn", "Blue Razz", "30k"];

function Empty({ q }: { q: string }) {
  return (
    <div className={s.empty}>
      <p className={s.emptyLine}>
        Nothing on the wall matches <strong>{q}</strong>.
      </p>
      <p className={s.emptyNote}>
        We may still have it behind the counter — the site only lists what we
        can confirm is in stock. Text us and we&rsquo;ll look.
      </p>
      <div className={s.emptyActions}>
        <a className={s.cta} href={`sms:+17026137799?&body=${encodeURIComponent(`Do you have ${q}?`)}`}>
          Text us about it
        </a>
        <a className={s.emptyLink} href="/floor">
          Browse the floor →
        </a>
      </div>
    </div>
  );
}

function Popular() {
  return (
    <section className={s.popular} aria-labelledby="popular-title">
      <h2 className={s.popularTitle} id="popular-title">
        Start here
      </h2>
      <ul className={s.popularRow}>
        {POPULAR.map((term) => (
          <li key={term}>
            <a className={s.popularChip} href={`/search?q=${encodeURIComponent(term)}`}>
              {term}
            </a>
          </li>
        ))}
      </ul>
    </section>
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
        {/* Column 2 is what the thing is; column 3 is what it costs and
            whether you can have it. The price used to sit at the right edge
            of column 2, which is 1fr — so a wide stock label squeezed that
            column and dragged the price left with it. Across 74 results that
            put prices on four different axes, 42px apart. Now the price is
            right-aligned in the LAST column, so its right edge is the row's
            right edge and every row shares it, whatever the stock note says
            — and those run from "Out" to "On the shelf · 12 minutes ago". */}
        <div className={s.tileMeta}>
          <span className={s.tileName}>{p.title}</span>
          {p.brand && <span className={s.tileBrand}>{p.brand}</span>}
          <span className={s.tileCat}>{p.department}</span>
        </div>
        <span className={s.tileFoot}>
          <span className={s.tilePrice}>{formatMoney(p.price)}</span>
          <span className={s.tileStock}>
            {p.inStoreOnly ? p.inStoreReason : stockLabel(p.stock)}
          </span>
        </span>
      </a>
    </li>
  );
}
