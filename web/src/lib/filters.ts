import type { Product } from "@/lib/commerce";

/**
 * The catalogue filter set, in one place.
 *
 * Both the filter sheet (4c) and the department listing (4b) run this. If the
 * sheet counted results with its own copy of the predicates, its "Show 41
 * results" button could promise a number the next page disagrees with — and
 * that particular lie is very hard to notice in review, because both halves
 * look correct on their own.
 */
export type CatalogFilters = {
  flavor?: string;
  nic?: string;
  brand?: string;
  puffMin?: string;
  puffMax?: string;
  inStock?: string;
};

export function applyFilters(items: Product[], sp: CatalogFilters): Product[] {
  const min = Number(sp.puffMin);
  const max = Number(sp.puffMax);
  return items
    .filter((p) => (sp.flavor ? p.flavorFamily === sp.flavor : true))
    .filter((p) => (sp.nic ? String(p.nicotineMg ?? "") === sp.nic : true))
    .filter((p) => (sp.brand ? p.brand === sp.brand : true))
    .filter((p) => (sp.inStock === "1" ? p.stock.tier !== "out" : true))
    .filter((p) =>
      Number.isFinite(min) && min > 0 ? (p.puffCount ?? 0) >= min : true,
    )
    .filter((p) =>
      /* An unknown puff count passes a max filter rather than failing it:
         most non-disposables have none, and silently hiding every accessory
         because someone set an upper bound would be the wrong surprise. */
      Number.isFinite(max) && max > 0 ? (p.puffCount ?? Infinity) <= max : true,
    );
}

/** How many filters are actually set — drives the "Filters · N" badge. */
export function activeFilterCount(sp: CatalogFilters): number {
  return [sp.flavor, sp.nic, sp.brand, sp.puffMin, sp.puffMax, sp.inStock].filter(
    (v) => Boolean(v),
  ).length;
}
