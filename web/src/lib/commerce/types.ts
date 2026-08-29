/**
 * The commerce domain, expressed in OUR terms.
 *
 * Nothing in here is Ecwid-shaped. Ecwid is one implementation of
 * `CommerceAdapter` and its types must never reach a component — if the
 * platform ever terminates the account, a forced migration should be a
 * one-file adapter rewrite rather than a rebuild.
 */

/**
 * Regulatory class is a first-class field, not a tag.
 *
 * It is the single most consequential attribute on a product here, because
 * four legally different things are being sold from one catalogue and each
 * gets different treatment on the page:
 *
 *  - `ends`       vape, e-liquid, disposables. FDA nicotine warning REQUIRED
 *                 on the listing (21 CFR 1143.3). PACT Act applies.
 *  - `hookah`     shisha / waterpipe tobacco. Warning also REQUIRED — FDA's
 *                 retailer chart names hookah tobacco explicitly.
 *  - `cigar`      cigars and pipe tobacco. Warning VACATED in
 *                 Cigar Ass'n of Am. v. FDA — must NOT be shown.
 *  - `cigarette`  FCLAA Surgeon General warnings, enforced by the FTC, not
 *                 the FDA statement. Different text, handled separately.
 *  - `pouch`      oral nicotine. Warning required.
 *  - `rollYourOwn` RYO and cigarette tobacco, leaf, wraps. 21 CFR 1143.3
 *                 names cigarette tobacco and roll-your-own explicitly, so
 *                 the warning IS required.
 *  - `smokeless`  dipping and chewing tobacco. Governed by the Comprehensive
 *                 Smokeless Tobacco Health Education Act — a DIFFERENT set of
 *                 rotating warnings, not the ENDS statement. 🔴 Needs counsel
 *                 before any of these publish.
 *  - `accessory`  glass, lighters, papers, grinders. No nicotine warning.
 *  - `hemp`       NON-INTOXICATING hemp and CBD: ≤0.3% delta-9 THC by dry
 *                 weight, the 2018 Farm Bill definition. Topicals, tinctures,
 *                 gummies, CBD vape. It is a separate class from `restricted`
 *                 because the legal question is genuinely different — this is
 *                 lawful hemp, not the SB 356 firewall — but it is NOT an
 *                 ordinary retail class either: it publishes ONLY with a
 *                 batch COA on file (see `Product.coa`). No COA, no listing.
 *                 Anything intoxicating stays `restricted` no matter how it
 *                 is labelled: delta-8, delta-9 above trace, THCA, HHC, 7-OH.
 *                 🔴 The class exists so hemp can be modelled honestly; the
 *                 Nevada consumable-hemp rules still need counsel.
 *  - `restricted` THCA, kratom, mushroom and similar. Not a warning question —
 *                 a firewall question. Nevada SB 356 (2025) is reported to have
 *                 moved several of these to CCB-licensed dispensaries only, and
 *                 they carry profile-suspension and payment-processor risk that
 *                 ordinary tobacco retail does not. NEVER published by default.
 *  - `unknown`    could not be classified from source data. NEVER publishable.
 *                 This exists so that an unmapped product fails closed rather
 *                 than silently shipping without a legally required warning.
 */
export type RegulatoryClass =
  | "ends"
  | "hookah"
  | "cigar"
  | "cigarette"
  | "pouch"
  | "rollYourOwn"
  | "smokeless"
  | "accessory"
  | "hemp"
  | "restricted"
  | "unknown";

/**
 * Stock is a confidence claim with provenance, never a boolean.
 *
 * The shop will not have clean inventory data — thousands of flavour SKUs,
 * manual receiving, three shifts, 24-hour operation. Any design that assumes
 * a trustworthy `inStock` flag will systematically lie to customers. The goal
 * is not accuracy; it is that the customer's expectation matches reality.
 */
/**
 * Flavour families, and the reason they are a closed set.
 *
 * Vape shoppers scan by recognition, not reading — "the blue one". Scanning
 * sixty flavours by colour is several times faster than reading sixty names,
 * and a swatch is the only thing that makes a dense grid usable one-handed at
 * 2 a.m. But the palette is deliberately MUTED and adult: candy-bright colour
 * is a youth-appeal compliance problem, not a taste preference. The hues live
 * as CSS tokens (`--flavor-*`) so both themes can tune them.
 */
export type FlavorFamily =
  | "mint"
  | "berry"
  | "tropical"
  | "citrus"
  | "grape"
  | "melon"
  | "orchard"
  | "tobacco"
  | "dessert"
  | "unflavored";

export const FLAVOR_FAMILIES: { id: FlavorFamily; label: string }[] = [
  { id: "mint", label: "Mint & ice" },
  { id: "berry", label: "Berry" },
  { id: "tropical", label: "Tropical" },
  { id: "citrus", label: "Citrus" },
  { id: "grape", label: "Grape" },
  { id: "melon", label: "Melon" },
  { id: "orchard", label: "Apple & cherry" },
  { id: "tobacco", label: "Tobacco" },
  { id: "dessert", label: "Dessert" },
  { id: "unflavored", label: "Unflavoured" },
];

/** The second-most-used filter after flavour, so it gets permanent space. */
export const NICOTINE_STRENGTHS = [0, 3, 6, 20, 50] as const;

export type StockTier = "verified" | "expected" | "low" | "unknown" | "out";

export type Stock = {
  tier: StockTier;
  /** When the shelf was last physically counted. Drives the provenance line. */
  countedAt?: Date;
  /** Only ever shown for the `low` tier, and only when we actually know. */
  remaining?: number;
  restockNote?: string;
};

export type Money = {
  /** Minor units. Never a float — this is money. */
  cents: number;
  currency: "USD";
};

export type Product = {
  /** OUR id. Stable across platform migrations. */
  id: string;

  /**
   * The vendor's identifier, if any — a foreign key and nothing more.
   *
   * It exists so an adapter can round-trip to whatever system currently holds
   * the catalogue. It must never appear in a URL, a canonical tag, a sitemap,
   * or any user-visible surface. The day the platform changes, this field
   * changes and nothing else does.
   */
  vendorId?: string;

  /**
   * OUR slug, and the single most migration-critical field in the model.
   *
   * Never derive this from the vendor. If slugs come from the platform, then
   * leaving the platform rewrites every product URL — and for a business whose
   * only acquisition channel is organic search, that is not a migration cost,
   * it is starting the rankings again from zero. The slug is authored once,
   * owned by us, and outlives every vendor.
   */
  slug: string;
  title: string;
  brand?: string;
  department: Department;
  regulatoryClass: RegulatoryClass;
  price: Money;
  /** Manufacturer's list price. Only ever set when it is literally true. */
  compareAt?: Money;
  /**
   * Images referenced by OUR path, not the vendor's CDN.
   *
   * An adapter that returns a platform CDN URL is handing the platform custody
   * of the photography — which is the most expensive, longest-lead asset in
   * this project. Adapters ingest and rewrite; they do not pass through.
   */
  images: {
    src: string;
    alt: string;
    /** Background removed — renders straight onto the page with no plate. */
    cutout?: boolean;
    /** Background could not be removed; which plate to sit it on. */
    plate?: "light" | "dark";
  }[];
  description?: string;
  stock: Stock;
  /** Some SKUs cannot leave the building — cigarettes, fire-code items. */
  deliveryEligible: boolean;
  inStoreOnly?: boolean;
  /** Why it is in-store only, in the customer's language. */
  inStoreReason?: string;
  /** ENDS only. Enables the price-per-1,000-puffs line. */
  puffCount?: number;
  nicotineMg?: number;
  /**
   * ENDS only. A model carries its whole flavour range — Foger has 71 — and
   * the site gives it ONE url with flavour as a variant control, rather than
   * 71 near-duplicate pages. `flavorFamily` is the dominant family, used for
   * the tile band and the facet.
   */
  flavors?: { value: string; family: FlavorFamily | null }[];
  flavor?: string;
  flavorFamily?: FlavorFamily;
  /** All strengths this model is stocked in. */
  nicotineStrengths?: number[];
  /** Rough sales rank. Drives the default "Most popular right now" sort. */
  popularity?: number;
  /**
   * Certificate of analysis. Required for anything in the `hemp` class and
   * meaningless everywhere else.
   *
   * This is the field that makes `hemp` publishable, and the reason it is a
   * structured object rather than a link: "COAs on file" is a claim, and a
   * claim needs a batch it belongs to and a date it was tested. A COA that
   * cannot be tied back to the tin in someone's hand is decoration.
   *
   * `thcDelta9Percent` is the number that decides whether the product is
   * lawful hemp at all — above 0.3 it is not hemp, it is `restricted`, and
   * the importer must reclassify rather than publish it.
   */
  coa?: {
    batch: string;
    /** Our path, not the lab's — same custody rule as images. */
    url: string;
    testedAt: string;
    thcDelta9Percent: number;
    lab?: string;
  };

  /** Cigars only. */
  vitola?: string;
  wrapper?: string;
  ringGauge?: number;
  lengthIn?: number;
};

export type Department =
  | "vape"
  | "cigars"
  | "cigarettes"
  | "hookah"
  | "glass"
  | "hemp"
  | "accessories";

/**
 * Canonical order, and it is a MERCHANDISING order, not alphabetical.
 *
 * Both the homepage floor grid and /floor read this. They used to keep
 * separate lists, so the same six cards appeared in two different orders one
 * click apart and the muscle memory built on the homepage was wrong on the
 * index it led to.
 */
export const DEPARTMENTS: readonly Department[] = [
  "vape",
  "glass",
  "cigars",
  "accessories",
  "cigarettes",
  "hookah",
  "hemp",
];

export const DEPARTMENT_LABELS: Record<Department, string> = {
  vape: "Vape",
  cigars: "Cigars",
  cigarettes: "Cigarettes",
  hookah: "Hookah",
  glass: "Glass",
  hemp: "Hemp & CBD",
  accessories: "Accessories",
};


export function isDepartment(v: string): v is Department {
  return (DEPARTMENTS as readonly string[]).includes(v);
}

export type CommerceAdapter = {
  getProduct(slug: string): Promise<Product | null>;
  getProducts(opts?: {
    department?: Department;
    limit?: number;
  }): Promise<Product[]>;
};

/*
 * The four PLP archetypes were removed with "The 24".
 *
 * That design gave every department its own tile grammar -- a chip-swatch grid
 * for vape, a spec table for cigars, a gallery for glass, a utility list for
 * cigarettes -- on the argument that one taxonomy serves no shopper. Marquee
 * Neon makes the opposite call: one 2-up product card everywhere, with stock
 * as the thing that varies. Department character comes from the filter set,
 * not from a different card per shelf.
 */

/* ---------------------------------------------------------------------------
   Derived helpers. Pure, so they are trivially testable.
   --------------------------------------------------------------------------- */

export function formatMoney(m: Money): string {
  return `$${(m.cents / 100).toFixed(2)}`;
}

/**
 * Price per 1,000 puffs.
 *
 * No competitor displays this, and it is the single most effective answer to
 * the one complaint that appears in every negative review: price. It reframes
 * a $49.99 sticker from "Strip gouging" into "cheapest thing on the wall"
 * using arithmetic instead of adjectives.
 */
export function pricePerThousandPuffs(p: Product): string | null {
  if (!p.puffCount || p.puffCount <= 0) return null;
  const per = p.price.cents / (p.puffCount / 1000);
  return `$${(per / 100).toFixed(2)} / 1k puffs`;
}

/**
 * Puff counts are marketing numbers nobody can convert into meaning.
 * Do the conversion for them. ~400 puffs/day is a common pack-a-day proxy.
 */
export function puffsInHumanUnits(p: Product): string | null {
  if (!p.puffCount) return null;
  const days = p.puffCount / 400;
  if (days < 1.5) return "about a day for a pack-a-day smoker";
  const lo = Math.max(1, Math.round(days * 0.8));
  const hi = Math.round(days * 1.2);
  return `about ${lo}–${hi} days for a pack-a-day smoker`;
}

/**
 * Does this listing legally require the FDA nicotine warning?
 *
 * Written as an explicit allow-list rather than a deny-list on purpose. A new
 * regulatory class added later fails CLOSED — it will not silently skip a
 * legally required warning just because nobody remembered to update a `!==`.
 */
export function requiresNicotineWarning(p: Product): boolean {
  switch (p.regulatoryClass) {
    case "ends":
    case "hookah":
    case "pouch":
    case "rollYourOwn":
      return true;
    default:
      return false;
  }
}

/**
 * Is this safe to show on the public storefront at all?
 *
 * `restricted` is the grey inventory — firewalled pending counsel.
 * `unknown` means the importer could not classify it, and an unclassified
 * nicotine product is exactly the thing that ships without its warning.
 * `smokeless` needs its own statutory warning text, which is not built yet.
 */
export function isPublishable(p: Product): boolean {
  return (
    p.regulatoryClass !== "restricted" &&
    p.regulatoryClass !== "unknown" &&
    p.regulatoryClass !== "smokeless"
  );
}

/**
 * True if the product is available in this flavour family at all — not only
 * if it is the model's dominant family.
 *
 * A 71-flavour disposable is genuinely in berry, mint and tropical. A flavour
 * hub that only listed models whose *majority* of SKUs were berry would hide
 * the thing a shopper looking for "the blue one" actually wants.
 */
export function matchesFlavorFamily(p: Product, family: FlavorFamily): boolean {
  if (p.flavorFamily === family) return true;
  return (p.flavors ?? []).some((f) => f.family === family);
}

export function isFlavorFamily(v: string): v is FlavorFamily {
  return FLAVOR_FAMILIES.some((f) => f.id === v);
}

export function stockLabel(stock: Stock): string {
  switch (stock.tier) {
    case "verified":
      return stock.countedAt
        ? `On the shelf · ${minutesAgo(stock.countedAt)}`
        : "On the shelf";
    case "expected":
      return "Usually here";
    case "low":
      return stock.remaining ? `${stock.remaining} left` : "Low";
    case "unknown":
      return "Ask us";
    case "out":
      return stock.restockNote ? `Out · ${stock.restockNote}` : "Out";
  }
}

function minutesAgo(d: Date): string {
  const mins = Math.max(1, Math.round((Date.now() - d.getTime()) / 60000));
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.round(hrs / 24)} d ago`;
}
