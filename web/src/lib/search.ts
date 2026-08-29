import type { Product } from "@/lib/commerce";

/**
 * Catalogue search.
 *
 * One scoring function, run on the server for the results page and in the
 * browser for the typeahead, so the dropdown can never disagree with the page
 * it leads to.
 *
 * ── Why the whole index ships to the client ────────────────────────────────
 *
 * 175 products is small enough that the index is a few KB gzipped. Shipping it
 * means suggestions appear on the keystroke with no round trip, no debounce and
 * no loading state, which is the entire difference between a search box that
 * feels instant and one that does not. Revisit if the catalogue passes a few
 * thousand — the 559 products the shop has not put online yet would still be
 * comfortably inside that.
 *
 * ── Normalisation is catalogue-specific, not generic ───────────────────────
 *
 * These names come out of a POS where the same number is written three ways.
 * "Flum 30.000", "Foger 30000" and "MNKE 25k" all coexist, and a shopper types
 * whichever they saw on the box. Reconciling the storefront harvest taught this
 * the hard way — a third of it failed to match on exact strings — so the same
 * rules apply here: thousands separators collapse, and a `k` suffix expands.
 * Without that, searching "30000" misses every product written "30.000".
 */

export type SearchDoc = {
  slug: string;
  title: string;
  brand?: string;
  department: string;
  /** Flavour values and family labels, flattened — capped, for index size. */
  flavors: string[];
  /** The TRUE flavour count, which the capped list above cannot carry. The
      specificity weighting below depends on it: without it every product looks
      like it has twelve flavours and the ranking flattens. */
  nf?: number;
  price: number;
  img?: string;
};

export function normalise(s: string): string {
  return s
    .toLowerCase()
    // "20,000" and "30.000" are one number, not two.
    .replace(/(\d)[.,](\d{3})\b/g, "$1$2")
    // "50k" -> "50000", so the box and the keyboard agree.
    .replace(/\b(\d{1,3})\s?k\b/g, (_, n) => String(Number(n) * 1000))
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function toDoc(p: Product): SearchDoc {
  const flavors = [
    ...(p.flavors ?? []).map((f) => f.value),
    ...(p.flavorFamily ? [p.flavorFamily] : []),
  ];
  return {
    slug: p.slug,
    title: p.title,
    brand: p.brand,
    department: p.department,
    flavors: [...new Set(flavors)].slice(0, 12),
    nf: new Set(flavors).size,
    price: p.price.cents,
    img: p.images[0]?.src,
  };
}

/**
 * Score one document against a query. 0 means "do not show".
 *
 * Every term must hit something — an AND, not an OR. "geek bar mint" should
 * return Geek Bars in mint, not every Geek Bar plus every mint product, which
 * is what a sum-of-scores OR gives you and is the usual way catalogue search
 * feels broken.
 */
export function score(doc: SearchDoc, query: string): number {
  const q = normalise(query);
  if (!q) return 0;

  const title = normalise(doc.title);
  const brand = doc.brand ? normalise(doc.brand) : "";
  const dept = normalise(doc.department);
  const flavors = doc.flavors.map(normalise).join(" ");

  // Whole-query matches on the title are worth more than the sum of their
  // words: "lost mary" should beat a product that merely contains both.
  let total = 0;
  if (title === q) total += 1000;
  else if (title.startsWith(q)) total += 500;
  else if (title.includes(q)) total += 250;
  if (brand && brand === q) total += 300;

  for (const term of q.split(" ").filter(Boolean)) {
    let best = 0;
    if (title.startsWith(term)) best = 100;
    else if (new RegExp(`\\b${escape_(term)}`).test(title)) best = 80;
    else if (title.includes(term)) best = 40;
    else if (brand.includes(term)) best = 60;
    else if (flavors.includes(term)) {
      /* A flavour hit is weighted by how specific it is. "Mint" matches 90 of
         175 products, because a 55-flavour disposable is genuinely available
         in mint — but a product whose whole identity is mint is a far better
         answer than one where it is the fortieth option in a dropdown. Without
         this the results come back in alphabetical order and read as noise. */
      best = 30 + Math.round(30 / Math.max(1, doc.nf ?? doc.flavors.length));
    }
    else if (dept.includes(term)) best = 20;
    if (!best) return 0; // a term matched nothing: this is not a result
    total += best;
  }
  return total;
}

function escape_(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function searchDocs(docs: SearchDoc[], query: string, limit = 60): SearchDoc[] {
  return docs
    .map((d) => ({ d, s: score(d, query) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s || a.d.title.localeCompare(b.d.title))
    .slice(0, limit)
    .map((r) => r.d);
}
