import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";
import cat from "../Category.module.css";
import h from "../Hub.module.css";
import { AgeBanner, Header, StatusModule, BottomNav } from "@/components/Chrome";
import Marquee from "@/components/Marquee";
import { AGE_HEADER } from "@/lib/age-shared";
import { hourBand, pacificHour } from "@/lib/time";
import {
  commerce,
  DEPARTMENT_LABELS,
  isDepartment,
} from "@/lib/commerce";
import { slugifyBrand } from "@/lib/slugs";

export async function generateStaticParams() {
  const products = await commerce.getProducts();
  const depts = new Set(products.filter((p) => p.brand).map((p) => p.department));
  return [...depts].map((department) => ({ department }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ department: string }>;
}): Promise<Metadata> {
  const { department } = await params;
  if (!isDepartment(department)) return { title: "Not found | Puff Vegas" };
  const label = DEPARTMENT_LABELS[department];
  return {
    title: `${label} brands — open 24 hours on the Strip | Puff Vegas`,
    description: `${label} brands on the wall at Puff Vegas, Grand Bazaar Shops. Prices posted. Open 24 hours.`,
    alternates: { canonical: `/${department}/brands` },
  };
}

export default async function BrandIndexPage({
  params,
}: {
  params: Promise<{ department: string }>;
}) {
  const { department } = await params;
  if (!isDepartment(department)) notFound();

  const products = await commerce.getProducts({ department });
  const counts = new Map<string, number>();
  for (const p of products) {
    if (!p.brand) continue;
    counts.set(p.brand, (counts.get(p.brand) ?? 0) + 1);
  }
  const brands = [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  if (brands.length === 0) notFound();

  const letters = new Map<string, typeof brands>();
  for (const row of brands) {
    const letter = row[0].charAt(0).toUpperCase();
    const key = /[A-Z]/.test(letter) ? letter : "#";
    const list = letters.get(key) ?? [];
    list.push(row);
    letters.set(key, list);
  }
  const groups = [...letters.entries()].sort((a, b) => {
    if (a[0] === "#") return 1;
    if (b[0] === "#") return -1;
    return a[0].localeCompare(b[0]);
  });

  const hds = await headers();
  const affirmed = hds.get(AGE_HEADER) === "1";
  const now = new Date();
  const band = hourBand(pacificHour(now));
  const label = DEPARTMENT_LABELS[department];
  const hasFlavors = products.some((p) => p.flavorFamily);

  return (
    <div data-band={band === "late" ? "late" : undefined}>
      <AgeBanner affirmed={affirmed} />
      <Header />
      <StatusModule />
      <Marquee />

      <main className={cat.wrap}>
        <div className={cat.head}>
          <h1 className={cat.title}>{label} brands</h1>
          <span className={cat.count}>
            {brands.length} {brands.length === 1 ? "brand" : "brands"}
          </span>
        </div>
        <nav className={cat.hubs} aria-label="Also in this department">
          <a className={cat.hubLink} href={`/${department}`}>
            ← All {label.toLowerCase()}
          </a>
          {hasFlavors && (
            <a className={cat.hubLink} href={`/${department}/flavors`}>
              By flavour →
            </a>
          )}
        </nav>

        <div className={h.letters}>
          {groups.map(([letter, rows]) => (
            <section key={letter} className={h.letterBlock}>
              <h2 className={h.letter}>{letter}</h2>
              <div className={h.brandRow}>
                {rows.map(([name, n]) => (
                  <a
                    key={name}
                    className={h.brand}
                    href={`/${department}/brands/${slugifyBrand(name)}`}
                  >
                    {name}
                    <span className={h.brandCount}> · {n}</span>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
