import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";
import cat from "../../Category.module.css";
import h from "../../Hub.module.css";
import { AgeBanner, Header, StatusModule, BottomNav } from "@/components/Chrome";
import Marquee from "@/components/Marquee";
import PageNicotineWarning from "@/components/PageNicotineWarning";
import { EmptyResults, ProductTiles } from "@/components/ProductTiles";
import { AGE_HEADER } from "@/lib/age-shared";
import { hourBand, pacificHour } from "@/lib/time";
import {
  archetypeFor,
  commerce,
  DEPARTMENT_LABELS,
  DEPARTMENTS,
  isDepartment,
} from "@/lib/commerce";
import { brandNameForSlug, slugifyBrand } from "@/lib/slugs";

export async function generateStaticParams() {
  const products = await commerce.getProducts();
  const seen = new Set<string>();
  const out: { department: string; brand: string }[] = [];
  for (const p of products) {
    if (!p.brand) continue;
    const brand = slugifyBrand(p.brand);
    const key = `${p.department}:${brand}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ department: p.department, brand });
  }
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ department: string; brand: string }>;
}): Promise<Metadata> {
  const { department, brand: slug } = await params;
  if (!isDepartment(department)) return { title: "Not found | Puff Vegas" };
  const products = await commerce.getProducts({ department });
  const name = brandNameForSlug(products, slug);
  if (!name) return { title: "Not found | Puff Vegas" };
  const label = DEPARTMENT_LABELS[department];
  return {
    title: `${name} ${label.toLowerCase()} — open 24 hours on the Strip | Puff Vegas`,
    description: `${name} at Puff Vegas, Grand Bazaar Shops. Prices posted. Open 24 hours.`,
    alternates: { canonical: `/${department}/brands/${slug}` },
  };
}

export default async function BrandHubPage({
  params,
}: {
  params: Promise<{ department: string; brand: string }>;
}) {
  const { department, brand: slug } = await params;
  if (!isDepartment(department)) notFound();

  const inDept = await commerce.getProducts({ department });
  const name = brandNameForSlug(inDept, slug);
  if (!name) notFound();

  const items = inDept
    .filter((p) => p.brand === name)
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
  if (items.length === 0) notFound();

  const all = await commerce.getProducts();
  const elsewhere = DEPARTMENTS.filter((d) => d !== department).filter((d) =>
    all.some((p) => p.department === d && p.brand === name),
  );

  const hds = await headers();
  const affirmed = hds.get(AGE_HEADER) === "1";
  const now = new Date();
  const band = hourBand(pacificHour(now));
  const label = DEPARTMENT_LABELS[department];

  return (
    <div
      data-band={band === "late" ? "late" : undefined}
      data-zone={department === "cigars" ? "humidor" : undefined}
    >
      <AgeBanner affirmed={affirmed} />
      <Header />
      <StatusModule />
      <Marquee />

      <main className={cat.wrap}>
        <div className={cat.head}>
          <h1 className={cat.title}>{name}</h1>
          <span className={cat.count}>
            {items.length} {items.length === 1 ? "item" : "items"} in {label.toLowerCase()}
          </span>
        </div>
        <nav className={cat.hubs} aria-label="Brand navigation">
          <a className={cat.hubLink} href={`/${department}/brands`}>
            ← All {label.toLowerCase()} brands
          </a>
          <a className={cat.hubLink} href={`/${department}`}>
            All {label.toLowerCase()}
          </a>
        </nav>
        {elsewhere.length > 0 && (
          <p className={h.elsewhere}>
            Also in{" "}
            {elsewhere.map((d, i) => (
              <span key={d}>
                {i > 0 && ", "}
                <a href={`/${d}/brands/${slug}`}>{DEPARTMENT_LABELS[d]}</a>
              </span>
            ))}
          </p>
        )}

        <PageNicotineWarning products={items} />

        {items.length === 0 ? (
          <EmptyResults
            clearHref={`/${department}/brands`}
            clearLabel="All brands →"
          />
        ) : (
          <ProductTiles items={items} archetype={archetypeFor(department)} />
        )}
      </main>

      <BottomNav />
    </div>
  );
}
