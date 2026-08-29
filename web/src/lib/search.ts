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
  /**
   * Stock tier, abbreviated to one character for index size.
   *
   *   i = in stock (verified/expected)   l = low   o = out
   *
   * Search has to know this. "Stock is the product" is the whole thesis of
   * the design, and a search that ranks a thing we do not have above a thing
   * we do have is actively working against the shop.
   */
  st?: "i" | "l" | "o";
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

/**
 * Words customers use that the catalogue does not.
 *
 * Hand-curated and deliberately small. This is not a thesaurus: every entry
 * below is a term someone typed that returned nothing while the shop had the
 * thing on the shelf. A generic synonym list would blur the AND semantics
 * that make this search feel precise.
 *
 * Keys are normalised; values are additional terms that satisfy the same slot.
 */
const SYNONYMS: Record<string, string[]> = {
  // Glass gets asked for by a dozen names.
  bong: ["glass", "pipe", "water"],
  waterpipe: ["glass", "bong", "pipe"],
  water: ["glass", "bong"],
  rig: ["glass", "bong", "pipe"],
  piece: ["glass", "bong", "pipe"],
  // Vape vocabulary.
  vape: ["disposable", "puff", "pod"],
  ecig: ["vape", "disposable"],
  disposable: ["vape", "puff"],
  juice: ["eliquid", "liquid", "vape"],
  eliquid: ["juice", "liquid"],
  // Flavour words that are not flavour names.
  menthol: ["mint", "ice", "cool"],
  cool: ["ice", "mint"],
  // Pouches.
  pouch: ["pouches", "nicotine"],
  snus: ["pouches", "nicotine"],
  // Rolling.
  papers: ["paper", "rolling"],
  rolling: ["papers", "tobacco"],
  wraps: ["leaf", "blunt", "rolling"],
  blunt: ["wraps", "leaf"],
  // Hookah.
  shisha: ["hookah", "tobacco"],
  coal: ["charcoal", "hookah"],
  charcoal: ["coal", "hookah"],
  // Cigarettes.
  cigs: ["cigarette", "cigarettes"],
  smokes: ["cigarette", "cigarettes"],
  // Cigars.
  stogie: ["cigar"],
};

/**
 * Damerau-Levenshtein, capped.
 *
 * Bails out as soon as the distance exceeds `max`, which turns the usual
 * O(n*m) into something that returns almost immediately for the overwhelming
 * majority of pairs that are nowhere near each other.
 */
function withinDistance(a: string, b: string, max: number): boolean {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > max) return false;

  let prev2: number[] = [];
  let prev: number[] = Array.from({ length: b.length + 1 }, (_, i) => i);
  let curr: number[] = [];

  for (let i = 1; i <= a.length; i++) {
    curr = [i];
    let rowBest = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
      // Transposition — "geekbar"/"geekabr", and the single most common
      // phone-keyboard error.
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        v = Math.min(v, prev2[j - 2] + 1);
      }
      curr[j] = v;
      if (v < rowBest) rowBest = v;
    }
    if (rowBest > max) return false;
    prev2 = prev;
    prev = curr;
  }
  return prev[b.length] <= max;
}

/**
 * How much slack a term gets, by length.
 *
 * Short terms get none: at three characters, one edit reaches a different
 * word entirely ("raz" -> "raw"), and both are real brands here. Slack only
 * starts where a typo is more likely than a distinct product.
 */
function slackFor(term: string): number {
  if (term.length >= 8) return 2;
  if (term.length >= 5) return 1;
  return 0;
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
    st: p.stock.tier === "out" ? "o" : p.stock.tier === "low" ? "l" : "i",
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
export function score(doc: SearchDoc, query: string, relax = false): number {
  const q = normalise(query);
  if (!q) return 0;

  const title = normalise(doc.title);
  const brand = doc.brand ? normalise(doc.brand) : "";
  const dept = normalise(doc.department);
  const flavors = doc.flavors.map(normalise).join(" ");

  /* Space-collapsed forms, so "geekbar" finds "Geek Bar" and "lostmary" finds
     "Lost Mary". Brand names get typed as one word constantly and the shop
     has no control over which form is on the box. */
  const titleTight = title.replace(/ /g, "");
  const brandTight = brand.replace(/ /g, "");
  const qTight = q.replace(/ /g, "");

  // Whole-query matches on the title are worth more than the sum of their
  // words: "lost mary" should beat a product that merely contains both.
  let total = 0;
  if (title === q) total += 1000;
  else if (title.startsWith(q)) total += 500;
  else if (title.includes(q)) total += 250;
  else if (titleTight.startsWith(qTight)) total += 400;
  else if (titleTight.includes(qTight)) total += 200;
  if (brand && brand === q) total += 300;
  else if (brandTight && brandTight === qTight) total += 260;

  for (const term of q.split(" ").filter(Boolean)) {
    let best = termScore(term, { title, titleTight, brand, brandTight, dept, flavors, doc });

    /* Synonyms and typo tolerance are a SECOND PASS over the whole query, not
       a per-document fallback. Run per-document they leak: "bong" matched six
       real bongs and then quietly pulled in every pipe, every glass item and a
       tail of unrelated stock, because the synonym fired for each of the 169
       documents where the literal term happened to miss. */
    if (!best && relax) {
      for (const alt of SYNONYMS[term] ?? []) {
        const alue = termScore(alt, { title, titleTight, brand, brandTight, dept, flavors, doc });
        // Capped: a synonym hit is a weaker signal than the word they typed.
        if (alue) best = Math.max(best, Math.min(alue, 45));
      }
    }

    /* Typo tolerance, last and cheapest-to-skip. Only fires when nothing else
       matched, only on terms long enough that an edit is more likely to be a
       slip than a different product, and only against title and brand words —
       fuzzy-matching flavour text turns every query into a fishing net. */
    if (!best && relax) {
      /* Never fuzzy-match a number. "30000" and "40000" are one edit apart and
         are different products; letting them match turned a 5-result search
         for "30k" into 39 results spanning every puff count in the shop. */
      const slack = /\d/.test(term) ? 0 : slackFor(term);
      if (slack > 0) {
        const words = new Set([...title.split(" "), ...brand.split(" "), titleTight, brandTight]);
        for (const w of words) {
          if (!w || Math.abs(w.length - term.length) > slack) continue;
          if (withinDistance(term, w, slack)) {
            // Below every exact signal: a corrected term is a guess.
            best = 25;
            break;
          }
        }
      }
    }

    if (!best) return 0; // a term matched nothing: this is not a result
    total += best;
  }

  /* Stock as a RANKING signal, never a filter.
     A perfect title match that is out of stock still has to appear — the
     customer searched for it by name and deserves to be told we are out,
     with a restock note, rather than shown an empty page. But between two
     comparable answers, the one on the shelf wins. Multiplicative so it
     re-orders near-ties without ever overturning a decisive match. */
  const stock = doc.st === "o" ? 0.55 : doc.st === "l" ? 0.92 : 1;
  return total * stock;
}

type Fields = {
  title: string;
  titleTight: string;
  brand: string;
  brandTight: string;
  dept: string;
  flavors: string;
  doc: SearchDoc;
};

function termScore(term: string, f: Fields): number {
  if (f.title.startsWith(term)) return 100;
  if (new RegExp(`\\b${escape_(term)}`).test(f.title)) return 80;
  if (f.title.includes(term)) return 40;
  if (f.brand.includes(term)) return 60;
  if (f.brandTight.includes(term) || f.titleTight.includes(term)) return 55;
  if (f.flavors.includes(term)) {
    /* A flavour hit is weighted by how specific it is. "Mint" matches 90 of
       175 products, because a 55-flavour disposable is genuinely available in
       mint — but a product whose whole identity is mint is a far better answer
       than one where it is the fortieth option in a dropdown. Without this the
       results come back in alphabetical order and read as noise. */
    return 30 + Math.round(30 / Math.max(1, f.doc.nf ?? f.doc.flavors.length));
  }
  if (f.dept.includes(term)) return 20;
  return 0;
}

function escape_(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Below this many strict hits, it is worth widening the net. */
const RELAX_BELOW = 3;

export type SearchResult = {
  docs: SearchDoc[];
  /**
   * True when the strict pass came up short and synonyms/typo tolerance were
   * used to fill in. The UI says so rather than pretending these are exact —
   * a customer who typed a brand we do not carry needs to know that is what
   * happened, not be handed lookalikes as though they were matches.
   */
  relaxed: boolean;
};

function run(docs: SearchDoc[], query: string, relax: boolean, limit: number): SearchDoc[] {
  return docs
    .map((d) => ({ d, s: score(d, query, relax) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s || a.d.title.localeCompare(b.d.title))
    .slice(0, limit)
    .map((r) => r.d);
}

/**
 * Two passes, and the order matters.
 *
 * Strict first: exact words only, so a query that already works is never
 * diluted. Only when that comes up short do synonyms and typo tolerance run.
 * That keeps "30k" at five precise results while still finding "vaporeso" and
 * "water pipe", which a single relaxed pass could not do without wrecking the
 * precise cases.
 */
export function search(docs: SearchDoc[], query: string, limit = 60): SearchResult {
  const strict = run(docs, query, false, limit);
  if (strict.length >= RELAX_BELOW) return { docs: strict, relaxed: false };

  const relaxed = run(docs, query, true, limit);
  if (relaxed.length <= strict.length) return { docs: strict, relaxed: false };
  return { docs: relaxed, relaxed: strict.length === 0 };
}

/** Back-compat: just the documents. */
export function searchDocs(docs: SearchDoc[], query: string, limit = 60): SearchDoc[] {
  return search(docs, query, limit).docs;
}
