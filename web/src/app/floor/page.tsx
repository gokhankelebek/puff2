import type { Metadata } from "next";
import { headers } from "next/headers";
import fl from "./Floor.module.css";
import Bulbs from "@/components/Bulbs";
import PageNicotineWarning from "@/components/PageNicotineWarning";
import {
  AgeBanner,
  BottomNav,
  Footer,
  Header,
  UtilityBar,
} from "@/components/Chrome";
import DepartmentIcon from "@/components/DepartmentIcon";
import { AGE_HEADER } from "@/lib/age-shared";
import {
  commerce,
  DEPARTMENTS,
  DEPARTMENT_LABELS,
  type Department,
  type Product,
} from "@/lib/commerce";

export const metadata: Metadata = {
  title: "The floor — everything we stock | Puff Vegas",
  description:
    "Every department on the floor at Puff Vegas, 3649 S Las Vegas Blvd. Vape, nicotine pouches, cigars, cigarettes, hookah, glass and accessories, open 24 hours.",
  alternates: { canonical: "/floor" },
};

/** What each shelf is, in the shop's words rather than the catalogue's. */
const BLURB: Record<Department, string> = {
  vape: "Disposables, pods, juice and hardware",
  cigars: "Walk-in humidor, singles and boxes",
  cigarettes: "Every pack, behind the counter",
  pouch: "Nicotine pouches — ZYN, Velo, Alp, Lucy",
  hookah: "Shisha, bowls, hoses and charcoal",
  glass: "Blown in Vegas, one-offs included",
  hemp: "In the shop, not listed online yet",
  accessories: "Lighters, papers, grinders, parts",
};

/**
 * The floor — the department index.
 *
 * This page exists because "ALL 6 →" on the homepage used to point at /vape,
 * which is one department's product listing. Following a link that promises
 * six departments and landing in a grid of vape products is a broken promise,
 * and it was mine.
 *
 * A department only appears once it has something published, so the count in
 * the homepage link and the number of cards here are the same number by
 * construction rather than by being kept in step by hand.
 */
export default async function FloorPage() {
  const h = await headers();
  const affirmed = h.get(AGE_HEADER) === "1";

  const all = await commerce.getProducts();

  const stocked = DEPARTMENTS.map((department) => {
    const items = all.filter((p) => p.department === department);
    return {
      department,
      total: items.length,
      onShelf: items.filter((p) => p.stock.tier !== "out").length,
    };
  }).filter((d) => d.total > 0);

  /* Departments that exist in the model but have nothing to show yet are
     named rather than hidden. Hemp is the live case: it classifies but does
     not publish without a batch COA, and silently omitting it would make the
     shelf look like it does not exist. */
  const pending = DEPARTMENTS.filter(
    (d) => !stocked.some((s) => s.department === d),
  );

  return (
    <>
      <UtilityBar />
      <AgeBanner affirmed={affirmed} />
      <Header />
      <Bulbs />

      <main className={fl.main}>
        <div className={fl.head}>
          <nav className={fl.crumb} aria-label="Breadcrumb">
            <a href="/">Home</a> <span aria-hidden="true">/</span>{" "}
            <span>The floor</span>
          </nav>
          <h1 className={fl.title}>The floor</h1>
          <p className={fl.count}>
            {stocked.length} departments · {all.length} products on the shelf
            right now
          </p>
        </div>

        {/* An establishing shot of the actual floor — the packed wall, the
            hexagon lights, the glass cases. This page is the "everything we
            stock" index, and a real photo of the room says that faster than
            the count line does. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={fl.establishing}
          src="/shop/floor-1200.webp"
          srcSet="/shop/floor-640.webp 640w, /shop/floor-1200.webp 1200w"
          sizes="(min-width: 1200px) 1120px, 100vw"
          width={1672}
          height={941}
          alt="The floor at Puff Vegas: a full wall of disposables and accessories, glass cases, and a Zippo display under hexagon lights."
          loading="lazy"
          decoding="async"
        />

        <PageNicotineWarning products={all} />

        <Bulbs />

        <ul className={fl.grid}>
          {stocked.map(({ department, total, onShelf }, i) => (
            <li key={department}>
              <a
                className={fl.card}
                href={`/${department}`}
                data-ground={(i % 4) + 1}
              >
                <span className={fl.shot}>
                  <DepartmentIcon department={department} />
                </span>
                <span className={fl.name}>
                  {DEPARTMENT_LABELS[department]}
                </span>
                <span className={fl.blurb}>{BLURB[department]}</span>
                <span className={fl.stock}>
                  {onShelf === total
                    ? `${total} in stock`
                    : `${total} listed · ${onShelf} in stock`}
                </span>
              </a>
            </li>
          ))}
        </ul>

        {pending.length > 0 && (
          <section className={fl.pending}>
            <h2 className={fl.pendingTitle}>Coming to the floor</h2>
            <ul className={fl.pendingList}>
              {pending.map((department) => (
                <li key={department} className={fl.pendingRow}>
                  <span className={fl.pendingName}>
                    {DEPARTMENT_LABELS[department]}
                  </span>
                  <span className={fl.pendingNote}>
                    {department === "hemp"
                      ? "In the shop. Nothing listed online until every batch has its lab report on file."
                      : BLURB[department]}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <Bulbs />
      <Footer />
      <BottomNav />
    </>
  );
}
