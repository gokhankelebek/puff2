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
  FLAVOR_FAMILIES,
  isDepartment,
  matchesFlavorFamily,
  type FlavorFamily,
  type Product,
} from "@/lib/commerce";

export async function generateStaticParams() {
  const products = await commerce.getProducts();
  const depts = new Set(
    products.filter((p) => p.flavorFamily).map((p) => p.department),
  );
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
    title: `${label} flavours — open 24 hours on the Strip | Puff Vegas`,
    description: `${label} by flavour family at Puff Vegas, Grand Bazaar Shops. Prices posted. Open 24 hours.`,
    alternates: { canonical: `/${department}/flavors` },
  };
}

export default async function FlavorIndexPage({
  params,
}: {
  params: Promise<{ department: string }>;
}) {
  const { department } = await params;
  if (!isDepartment(department)) notFound();

  const products = await commerce.getProducts({ department });
  const families = FLAVOR_FAMILIES.map((f) => ({
    ...f,
    items: products.filter((p) => matchesFlavorFamily(p, f.id)),
  })).filter((f) => f.items.length > 0);

  if (families.length === 0) notFound();

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
          <h1 className={cat.title}>{label} by flavour</h1>
          <span className={cat.count}>
            {families.length} {families.length === 1 ? "family" : "families"}
          </span>
        </div>
        <nav className={cat.hubs} aria-label="Also in this department">
          <a className={cat.hubLink} href={`/${department}`}>
            ← All {label.toLowerCase()}
          </a>
          <a className={cat.hubLink} href={`/${department}/brands`}>
            By brand →
          </a>
        </nav>

        <ul className={h.grid}>
          {families.map((f) => (
            <li key={f.id}>
              <FlavorCard
                department={department}
                family={f.id}
                label={f.label}
                items={f.items}
              />
            </li>
          ))}
        </ul>
      </main>

      <BottomNav />
    </div>
  );
}

function FlavorCard({
  department,
  family,
  label,
  items,
}: {
  department: string;
  family: FlavorFamily;
  label: string;
  items: Product[];
}) {
  const hero = items.find((p) => p.images[0]) ?? items[0];
  const n = items.length;
  return (
    <a
      className={h.card}
      href={`/${department}/flavors/${family}`}
      style={{ "--wash": `var(--flavor-${family})` } as React.CSSProperties}
    >
      <span className={h.shot}>
        {hero?.images[0] && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img className={h.img} src={hero.images[0].src} alt="" />
        )}
      </span>
      <span
        className={h.swatch}
        style={{ background: `var(--flavor-${family})` }}
        aria-hidden="true"
      />
      <span>
        <span className={h.name}>{label}</span>
        <span className={h.count}>
          {n} {n === 1 ? "device" : "devices"}
        </span>
      </span>
    </a>
  );
}
