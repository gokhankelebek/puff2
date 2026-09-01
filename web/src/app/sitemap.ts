import type { MetadataRoute } from "next";
import { commerce, DEPARTMENTS, type Product } from "@/lib/commerce";
import { slugifyBrand } from "@/lib/slugs";
import { SITE_ORIGIN } from "@/lib/shop";

/**
 * The crawl map. With paid vape/tobacco ads banned, organic crawl coverage IS
 * the acquisition funnel, so every indexable surface is enumerated here.
 *
 * Two rules keep this trustworthy:
 *  - Absolute URLs are built from SITE_ORIGIN, the same env value the canonical
 *    tags use — so the sitemap never disagrees with the page's own canonical.
 *  - ONLY live routes are listed. /about and /guides do not exist yet; a
 *    sitemap that lists 404s erodes crawl trust, so they are added when they
 *    ship, not before. `hemp` is excluded — it is not listed online.
 *
 * getProducts() already exposes only publishable products, so nothing grey or
 * unclassified leaks into the crawl set.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await commerce.getProducts();

  const entry = (
    path: string,
    opts?: Omit<MetadataRoute.Sitemap[number], "url">,
  ): MetadataRoute.Sitemap[number] => ({ url: `${SITE_ORIGIN}${path}`, ...opts });

  // --- Static, live routes ---------------------------------------------------
  const staticEntries: MetadataRoute.Sitemap = [
    entry("/", { changeFrequency: "daily", priority: 1 }),
    entry("/delivery", { changeFrequency: "weekly", priority: 0.9 }),
    entry("/pickup", { changeFrequency: "monthly", priority: 0.8 }),
    entry("/floor", { changeFrequency: "daily", priority: 0.8 }),
    entry("/deals", { changeFrequency: "daily", priority: 0.7 }),
    entry("/legal", { changeFrequency: "yearly", priority: 0.3 }),
  ];

  // --- Departments (with published stock; hemp excluded) ---------------------
  const byDept = new Map<string, Product[]>();
  for (const p of products) {
    const list = byDept.get(p.department);
    if (list) list.push(p);
    else byDept.set(p.department, [p]);
  }
  const liveDepartments = DEPARTMENTS.filter(
    (d) => d !== "hemp" && (byDept.get(d)?.length ?? 0) > 0,
  );

  const deptEntries: MetadataRoute.Sitemap = liveDepartments.map((d) =>
    entry(`/${d}`, { changeFrequency: "daily", priority: 0.8 }),
  );

  // --- Brand & flavour hubs, mirroring each route's generateStaticParams -----
  const hubEntries: MetadataRoute.Sitemap = [];
  for (const d of liveDepartments) {
    const items = byDept.get(d) ?? [];
    if (items.some((p) => p.brand))
      hubEntries.push(entry(`/${d}/brands`, { changeFrequency: "weekly", priority: 0.6 }));
    if (items.some((p) => p.flavorFamily))
      hubEntries.push(entry(`/${d}/flavors`, { changeFrequency: "weekly", priority: 0.6 }));
  }

  const brandSeen = new Set<string>();
  const flavorSeen = new Set<string>();
  const brandEntries: MetadataRoute.Sitemap = [];
  const flavorEntries: MetadataRoute.Sitemap = [];
  for (const p of products) {
    if (p.department === "hemp") continue;
    if (p.brand) {
      const key = `${p.department}:${slugifyBrand(p.brand)}`;
      if (!brandSeen.has(key)) {
        brandSeen.add(key);
        brandEntries.push(
          entry(`/${p.department}/brands/${slugifyBrand(p.brand)}`, { priority: 0.6 }),
        );
      }
    }
    const families = [
      p.flavorFamily,
      ...(p.flavors ?? []).map((f) => f.family),
    ].filter((f): f is NonNullable<typeof f> => Boolean(f));
    for (const family of families) {
      const key = `${p.department}:${family}`;
      if (!flavorSeen.has(key)) {
        flavorSeen.add(key);
        flavorEntries.push(entry(`/${p.department}/flavors/${family}`, { priority: 0.5 }));
      }
    }
  }

  // --- Products --------------------------------------------------------------
  const productEntries: MetadataRoute.Sitemap = products
    .filter((p) => p.department !== "hemp" && p.slug)
    .map((p) =>
      entry(`/p/${p.slug}`, {
        changeFrequency: "weekly",
        priority: 0.6,
        lastModified: p.stock?.countedAt,
      }),
    );

  return [
    ...staticEntries,
    ...deptEntries,
    ...hubEntries,
    ...brandEntries,
    ...flavorEntries,
    ...productEntries,
  ];
}
