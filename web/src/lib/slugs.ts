import type { Department, Product } from "@/lib/commerce";

/**
 * Brand slug, owned by us.
 *
 * Brands are not Lightspeed handles. The display name is "Geek Bar"; the URL
 * is `/vape/brands/geek-bar`. If the POS spelling changes, this function is
 * the one place the slug is derived, so existing URLs stay put as long as
 * the name the shop uses stays the same.
 */
export function slugifyBrand(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function brandNameForSlug(
  products: Product[],
  slug: string,
): string | undefined {
  const names = [
    ...new Set(products.map((p) => p.brand).filter((b): b is string => Boolean(b))),
  ];
  return names.find((n) => slugifyBrand(n) === slug);
}

/**
 * Department-scoped brand URL. A brand that spans shelves lands on the
 * department it occupies most — that's the room a shopper looking for the
 * name is already in.
 */
export function brandHref(brand: string, products: Product[]): string {
  const slug = slugifyBrand(brand);
  const counts = new Map<Department, number>();
  for (const p of products) {
    if (p.brand === brand) {
      counts.set(p.department, (counts.get(p.department) ?? 0) + 1);
    }
  }
  let best: Department = "vape";
  let n = 0;
  for (const [dept, count] of counts) {
    if (count > n) {
      best = dept;
      n = count;
    }
  }
  return `/${best}/brands/${slug}`;
}
