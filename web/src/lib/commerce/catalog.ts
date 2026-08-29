import generated from "./catalog.generated.json";
import images from "./images.generated.json";
import type {
  CommerceAdapter,
  Department,
  FlavorFamily,
  Product,
  RegulatoryClass,
  Stock,
} from "./types";

/**
 * The real catalogue, read from the importer's output.
 *
 * Everything here is a pure mapping from `catalog.generated.json` onto the
 * domain model. No Lightspeed vocabulary survives this file — that is the
 * whole point of the adapter boundary.
 */

const IMAGES = images as Record<
  string,
  {
    src: string;
    provenance: string;
    bytes: number;
    cutout?: boolean;
    plate?: "light" | "dark";
  }
>;

type GeneratedModel = {
  slug: string;
  vendorHandle: string;
  title: string;
  category: string | null;
  regulatoryClass: RegulatoryClass;
  /** Curated in the importer; absent for generic stock like "Butane". */
  brand?: string;
  publishable: boolean;
  onlineSkus: number;
  skuCount: number;
  stock: number;
  priceCents: number | null;
  puffCount?: number;
  flavors: { value: string; family: FlavorFamily | null }[];
  nicotineMg: number[];
  imageUrl: string | null;
  /** Present only for `hemp`, and only once the shop attaches one. Without it
   *  the importer never marks a hemp model publishable. */
  coa?: Product["coa"];
};

/**
 * Department is a BROWSE decision, not a legal one, so it keys off the source
 * category first and falls back to regulatory class. The two are related but
 * not the same: a hookah bowl and shisha tobacco belong on the same shelf and
 * in different regulatory buckets.
 */
function departmentFor(m: GeneratedModel): Department {
  const c = m.category ?? "";
  if (/glass|bong|pipe/i.test(c)) return "glass";
  if (/hookah|shisha/i.test(c)) return "hookah";
  if (/^cigar$|cigarillo/i.test(c)) return "cigars";
  if (/cigarette/i.test(c)) return "cigarettes";
  if (/vape|juul|vuse|njoy|juice/i.test(c)) return "vape";
  if (/pouch|lighter|torch|papper|paper|leaf|rolling|smoke part|part of wd/i.test(c))
    return "accessories";

  switch (m.regulatoryClass) {
    case "ends":
      return "vape";
    case "cigar":
      return "cigars";
    case "cigarette":
      return "cigarettes";
    case "hookah":
      return "hookah";
    /* The one class whose department is decided by the class rather than the
       category, because Lightspeed has no hemp category to read: these arrive
       classified by name inference and there is nothing else to go on. */
    case "hemp":
      return "hemp";
    default:
      return "accessories";
  }
}

/**
 * Stock, mapped honestly.
 *
 * The export gives a NUMBER but no provenance — nobody counted that shelf at a
 * known time, it is whatever the POS believes. So nothing here is ever allowed
 * to claim `verified`, because `verified` renders as "counted 22 min ago" and
 * we would be inventing the 22 minutes.
 *
 * This is the confidence model doing its job on day one: the best this data
 * supports is "usually in stock", and saying so is the difference between a
 * badge that means something and one that lies.
 */
function stockFor(m: GeneratedModel): Stock {
  if (m.stock <= 0) return { tier: "out" };
  if (m.stock <= 2) return { tier: "low", remaining: Math.round(m.stock) };
  return { tier: "expected" };
}

/** The most common family across a model's range — drives the tile band. */
function dominantFamily(m: GeneratedModel): FlavorFamily | undefined {
  const counts = new Map<FlavorFamily, number>();
  for (const f of m.flavors) {
    if (f.family) counts.set(f.family, (counts.get(f.family) ?? 0) + 1);
  }
  let best: FlavorFamily | undefined;
  let n = 0;
  for (const [k, v] of counts) if (v > n) ((best = k), (n = v));
  return best;
}

function toProduct(m: GeneratedModel): Product {
  const department = departmentFor(m);
  return {
    id: m.slug,
    slug: m.slug,
    title: m.title,
    department,
    brand: m.brand,
    regulatoryClass: m.regulatoryClass,
    ...(m.coa ? { coa: m.coa } : {}),
    price: { cents: m.priceCents ?? 0, currency: "USD" },
    // Images come from the pipeline, referenced by OUR path under /p/ — never
    // hotlinked from a vendor CDN. The photography is the most expensive asset
    // in this project and it should not live on someone else's origin.
    images: IMAGES[m.slug]
      ? [
          {
            src: IMAGES[m.slug].src,
            alt: `${m.title}`,
            cutout: IMAGES[m.slug].cutout,
            plate: IMAGES[m.slug].plate,
          },
        ]
      : [],
    stock: stockFor(m),
    // Cigarettes stay in-store: NRS 370.585(4)(b) lets a dealer sell them
    // "from the premises for which the license was issued", and whether that
    // permits off-premises delivery is unresolved. Defaults to no.
    deliveryEligible: m.regulatoryClass !== "cigarette",
    inStoreOnly: m.regulatoryClass === "cigarette",
    inStoreReason:
      m.regulatoryClass === "cigarette"
        ? "Pickup only"
        : undefined,
    puffCount: m.puffCount,
    flavors: m.flavors.length ? m.flavors : undefined,
    flavorFamily: dominantFamily(m),
    nicotineStrengths: m.nicotineMg.length ? [...m.nicotineMg].sort((a, b) => a - b) : undefined,
    nicotineMg: m.nicotineMg.length === 1 ? m.nicotineMg[0] : undefined,
  };
}

/**
 * Only publishable models are ever exposed.
 *
 * `restricted` (grey inventory), `unknown` (unclassifiable) and `smokeless`
 * (warning text not built) are filtered out HERE, at the adapter, rather than
 * in a page. A page can forget to filter; a data source cannot.
 */
const PRODUCTS: Product[] = (generated as GeneratedModel[])
  .filter((m) => m.publishable)
  .map(toProduct)
  // No sales data exists in the export, so ordering is by stock depth. That is
  // a proxy for what the shop actually carries, not for what sells.
  .sort((a, b) => a.title.localeCompare(b.title));

export const catalogAdapter: CommerceAdapter = {
  async getProduct(slug) {
    return PRODUCTS.find((p) => p.slug === slug) ?? null;
  },
  async getProducts(opts) {
    let out = PRODUCTS;
    if (opts?.department) out = out.filter((p) => p.department === opts.department);
    if (opts?.limit) out = out.slice(0, opts.limit);
    return out;
  },
};

export const CATALOG_SIZE = PRODUCTS.length;
