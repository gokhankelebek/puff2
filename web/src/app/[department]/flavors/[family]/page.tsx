import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";
import cat from "../../Category.module.css";
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
  FLAVOR_FAMILIES,
  isDepartment,
  isFlavorFamily,
  matchesFlavorFamily,
} from "@/lib/commerce";

/** Inventory notes, not marketing. No health claims, no candy language. */
const FAMILY_NOTE: Record<string, string> = {
  mint: "Mint, ice and menthol.",
  berry: "Blue razz, strawberry, mixed berry.",
  tropical: "Mango, pineapple, coconut.",
  citrus: "Lemon, lime, orange.",
  grape: "Grape.",
  melon: "Watermelon and honeydew.",
  orchard: "Apple, cherry, peach.",
  tobacco: "Tobacco-style. No fruit.",
  dessert: "Vanilla, custard, bakery.",
  unflavored: "No flavouring.",
};

export async function generateStaticParams() {
  const products = await commerce.getProducts();
  const out: { department: string; family: string }[] = [];
  const seen = new Set<string>();
  for (const p of products) {
    const families = [
      p.flavorFamily,
      ...(p.flavors ?? []).map((f) => f.family),
    ].filter((f): f is NonNullable<typeof f> => Boolean(f));
    for (const family of families) {
      const key = `${p.department}:${family}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ department: p.department, family });
    }
  }
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ department: string; family: string }>;
}): Promise<Metadata> {
  const { department, family } = await params;
  if (!isDepartment(department) || !isFlavorFamily(family)) {
    return { title: "Not found | Puff Vegas" };
  }
  const meta = FLAVOR_FAMILIES.find((f) => f.id === family)!;
  const label = DEPARTMENT_LABELS[department];
  return {
    title: `${meta.label} ${label.toLowerCase()} — open 24 hours on the Strip | Puff Vegas`,
    description: `${meta.label} ${label.toLowerCase()} on the wall at Puff Vegas, Grand Bazaar Shops. Prices posted. Open 24 hours.`,
    alternates: { canonical: `/${department}/flavors/${family}` },
  };
}

export default async function FlavorHubPage({
  params,
}: {
  params: Promise<{ department: string; family: string }>;
}) {
  const { department, family } = await params;
  if (!isDepartment(department) || !isFlavorFamily(family)) notFound();

  const all = await commerce.getProducts({ department });
  const items = all
    .filter((p) => matchesFlavorFamily(p, family))
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
  if (items.length === 0) notFound();

  const meta = FLAVOR_FAMILIES.find((f) => f.id === family)!;
  const hds = await headers();
  const affirmed = hds.get(AGE_HEADER) === "1";
  const now = new Date();
  const band = hourBand(pacificHour(now));
  const label = DEPARTMENT_LABELS[department];

  return (
    <div data-band={band === "late" ? "late" : undefined}>
      <AgeBanner affirmed={affirmed} />
      <Header />
      <StatusModule />
      <Marquee />

      <main className={cat.wrap}>
        <div className={cat.head}>
          <h1 className={cat.title}>{meta.label}</h1>
          <span className={cat.count}>
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>
        <p className={cat.note}>{FAMILY_NOTE[family]}</p>
        <nav className={cat.hubs} aria-label="Flavour navigation">
          <a className={cat.hubLink} href={`/${department}/flavors`}>
            ← All flavours
          </a>
          <a className={cat.hubLink} href={`/${department}`}>
            All {label.toLowerCase()}
          </a>
        </nav>

        <PageNicotineWarning products={items} />

        {items.length === 0 ? (
          <EmptyResults
            clearHref={`/${department}/flavors`}
            clearLabel="All flavours →"
          />
        ) : (
          <ProductTiles items={items} archetype={archetypeFor(department)} />
        )}
      </main>

      <BottomNav />
    </div>
  );
}
