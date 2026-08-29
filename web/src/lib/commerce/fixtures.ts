import type { CommerceAdapter, Product } from "./types";

/**
 * Fixture adapter.
 *
 * Real SKUs and real prices pulled from the research on the live catalogue, so
 * the page is being designed against believable data rather than "Product 1 —
 * $9.99". The stock tiers are deliberately spread across all five states,
 * because the honest-fallback states are the ones that are easy to leave
 * unbuilt and they are the whole point of the confidence model.
 */

const minutes = (n: number) => new Date(Date.now() - n * 60_000);


type V = [string, string, Product["flavorFamily"], number, number, number, number];

/** Flavour range for one hardware line — this is how a real vape wall looks. */
function vapeRange(): Product[] {
  const rows: V[] = [
    ["Mango Peach", "mango-peach", "tropical", 50, 20000, 3499, 88],
    ["Miami Mint", "miami-mint", "mint", 50, 20000, 3499, 84],
    ["Strawberry Kiwi", "strawberry-kiwi", "berry", 50, 20000, 3499, 76],
    ["Grape Ice", "grape-ice", "grape", 50, 20000, 3499, 71],
    ["Lemon Mint", "lemon-mint", "citrus", 50, 20000, 3499, 63],
    ["Cool Mint", "cool-mint", "mint", 20, 12000, 2699, 58],
    ["Peach Berry", "peach-berry", "berry", 20, 12000, 2699, 52],
    ["Classic Tobacco", "classic-tobacco", "tobacco", 20, 12000, 2699, 47],
    ["Vanilla Custard", "vanilla-custard", "dessert", 6, 9000, 2299, 34],
    ["Honeydew", "honeydew", "melon", 6, 9000, 2299, 29],
    ["Zero Mint", "zero-mint", "mint", 0, 9000, 2299, 22],
    ["Unflavoured", "unflavoured", "unflavored", 3, 9000, 2299, 14],
  ];

  return rows.map(([flavor, slug, family, nic, puffs, cents, pop], i) => ({
    id: `range-${slug}`,
    slug: `raz-tn9000-${slug}`,
    title: "RAZ TN9000",
    brand: "RAZ",
    department: "vape" as const,
    regulatoryClass: "ends" as const,
    price: { cents, currency: "USD" as const },
    images: [{ src: "", alt: `RAZ TN9000 ${flavor} on charcoal seamless` }],
    stock:
      i % 5 === 0
        ? { tier: "verified" as const, countedAt: minutes(22) }
        : i % 5 === 1
          ? { tier: "low" as const, remaining: 2 }
          : i % 5 === 2
            ? { tier: "expected" as const }
            : i % 5 === 3
              ? { tier: "unknown" as const }
              : { tier: "out" as const, restockNote: "back Thursday" },
    deliveryEligible: true,
    puffCount: puffs,
    nicotineMg: nic,
    flavor,
    flavorFamily: family,
    popularity: pop,
  }));
}

type C = [string, string, string, string, number, number, number, number];

function cigarRange(): Product[] {
  const rows: C[] = [
    ["Padrón 1964 Anniversary", "padron-1964-anniversary", "Maduro", "Torpedo", 52, 6, 2400, 90],
    ["Romeo y Julieta Reserva Real", "romeo-y-julieta-reserva-real", "Ecuadorian Connecticut", "Robusto", 50, 5, 1150, 74],
    ["Arturo Fuente Hemingway", "arturo-fuente-hemingway", "Cameroon", "Short Story", 49, 4, 1395, 68],
    ["Acid Kuba Kuba", "acid-kuba-kuba", "Connecticut Broadleaf", "Robusto", 54, 5, 1250, 61],
    ["Macanudo Café", "macanudo-cafe", "Connecticut Shade", "Hyde Park", 49, 5, 995, 43],
  ];

  return rows.map(([title, slug, wrapper, vitola, ring, len, cents, pop], i) => ({
    id: `cigar-${slug}`,
    slug,
    title,
    brand: title.split(" ")[0],
    department: "cigars" as const,
    // Cigars are exempt from the FDA nicotine statement — vacated in
    // Cigar Ass'n of Am. v. FDA. The plate must not render for these.
    regulatoryClass: "cigar" as const,
    price: { cents, currency: "USD" as const },
    images: [{ src: "", alt: `${title} on charcoal seamless` }],
    stock:
      i % 3 === 0
        ? { tier: "verified" as const, countedAt: minutes(180) }
        : i % 3 === 1
          ? { tier: "expected" as const }
          : { tier: "low" as const, remaining: 3 },
    deliveryEligible: true,
    wrapper,
    vitola,
    ringGauge: ring,
    lengthIn: len,
    popularity: pop,
  }));
}

const PRODUCTS: Product[] = [
  {
    id: "gb-burj-80k",
    slug: "geek-bar-burj-80k",
    title: "Geek Bar Burj 80K",
    brand: "Geek Bar",
    department: "vape",
    regulatoryClass: "ends",
    price: { cents: 4999, currency: "USD" },
    images: [{ src: "", alt: "Geek Bar Burj 80K on charcoal seamless" }],
    description:
      "80,000 puffs, dual mesh, screen readout for battery and e-liquid. The one we sell most of after midnight — it lasts the whole trip, which is why the per-puff price is the lowest on the wall.",
    stock: { tier: "verified", countedAt: minutes(22) },
    deliveryEligible: true,
    puffCount: 80000,
    nicotineMg: 50,
    flavor: "Blue Razz Ice",
    flavorFamily: "berry",
    popularity: 100,
  },
  {
    id: "lost-mary-30k",
    slug: "lost-mary-30k",
    title: "Lost Mary MO20000 Pro",
    brand: "Lost Mary",
    department: "vape",
    regulatoryClass: "ends",
    price: { cents: 3499, currency: "USD" },
    images: [{ src: "", alt: "Lost Mary MO20000 Pro on charcoal seamless" }],
    stock: { tier: "low", remaining: 2 },
    deliveryEligible: true,
    puffCount: 20000,
    nicotineMg: 50,
    flavor: "Watermelon Ice",
    flavorFamily: "melon",
    popularity: 92,
  },
  {
    id: "al-fakher-crown",
    slug: "al-fakher-crown-bar",
    title: "Al Fakher Crown Bar",
    brand: "Al Fakher",
    department: "hookah",
    regulatoryClass: "hookah",
    price: { cents: 4499, currency: "USD" },
    images: [{ src: "", alt: "Al Fakher Crown Bar on charcoal seamless" }],
    description:
      "The hotel-room hookah. You cannot smoke a real one in your room — fire code, and the resorts run sensors that detect tobacco vape at $250–1,000 a room. This is what actually works upstairs.",
    stock: { tier: "verified", countedAt: minutes(22) },
    deliveryEligible: true,
    puffCount: 12000,
  },
  {
    id: "monte-white-toro",
    slug: "montecristo-white-toro-grande",
    title: "Montecristo White Toro Grande",
    brand: "Montecristo",
    department: "cigars",
    // Cigars are exempt: the FDA warning requirement was vacated in
    // Cigar Ass'n of Am. v. FDA. The plate must NOT render on this page.
    regulatoryClass: "cigar",
    price: { cents: 1650, currency: "USD" },
    compareAt: { cents: 2100, currency: "USD" },
    images: [{ src: "", alt: "Montecristo White Toro Grande on charcoal seamless" }],
    description:
      "Ecuadorian Connecticut shade over Nicaraguan and Dominican filler. Mild-to-medium, cedar and cream. Sold as a single, because tourists do not buy boxes.",
    stock: { tier: "verified", countedAt: minutes(180) },
    deliveryEligible: true,
    vitola: "Toro Grande",
    wrapper: "Ecuadorian Connecticut",
    ringGauge: 54,
    lengthIn: 6,
  },
  {
    id: "marlboro-gold",
    slug: "marlboro-gold",
    title: "Marlboro Gold",
    brand: "Marlboro",
    department: "vape",
    // Cigarettes carry FCLAA Surgeon General warnings enforced by the FTC,
    // not the FDA nicotine statement. Different text, so not `ends`.
    regulatoryClass: "cigarette",
    price: { cents: 1375, currency: "USD" },
    images: [{ src: "", alt: "Marlboro Gold pack on charcoal seamless" }],
    stock: { tier: "expected" },
    // NRS 370.585(4)(b) lets a dealer sell cigarettes "from the premises for
    // which the license was issued". Whether that permits off-premises
    // delivery is unresolved and sits with counsel, so we default to no.
    deliveryEligible: false,
    inStoreOnly: true,
    inStoreReason: "Pickup only",
  },
  {
    id: "zyn-6mg",
    slug: "zyn-cool-mint-6mg",
    title: "ZYN Cool Mint 6mg",
    brand: "ZYN",
    department: "accessories",
    regulatoryClass: "pouch",
    price: { cents: 849, currency: "USD" },
    images: [{ src: "", alt: "ZYN Cool Mint 6mg tin on charcoal seamless" }],
    description:
      "No smoke, no smell, no vapour. Will not set off the sensors the resorts have installed — which is the actual reason to buy these on a Vegas trip.",
    stock: { tier: "unknown" },
    deliveryEligible: true,
  },
  {
    id: "bic-lighter",
    slug: "bic-lighter",
    title: "Bic lighter",
    brand: "Bic",
    department: "accessories",
    regulatoryClass: "accessory",
    price: { cents: 250, currency: "USD" },
    images: [{ src: "", alt: "Bic lighter on charcoal seamless" }],
    description: "Nobody remembers one.",
    stock: { tier: "verified", countedAt: minutes(22) },
    deliveryEligible: true,
  },

  /* --- more vape, so the swatch grid and the facets are real ------------- */
  ...vapeRange(),

  /* --- cigars ------------------------------------------------------------ */
  ...cigarRange(),

  /* --- glass + hookah ----------------------------------------------------- */
  {
    id: "beaker-14",
    slug: "beaker-bong-14in",
    title: 'Beaker bong, 14"',
    department: "glass",
    regulatoryClass: "accessory",
    price: { cents: 8900, currency: "USD" },
    images: [{ src: "", alt: '14 inch beaker bong on charcoal seamless' }],
    stock: { tier: "verified", countedAt: minutes(190) },
    deliveryEligible: true,
    popularity: 44,
  },
  {
    id: "bubbler-7",
    slug: "glass-bubbler-7in",
    title: 'Glass bubbler, 7"',
    department: "glass",
    regulatoryClass: "accessory",
    price: { cents: 4200, currency: "USD" },
    images: [{ src: "", alt: "7 inch glass bubbler on charcoal seamless" }],
    stock: { tier: "low", remaining: 1 },
    deliveryEligible: true,
    popularity: 31,
  },
  {
    id: "hookah-full",
    slug: "hookah-full-setup",
    title: "Hookah, full setup",
    department: "hookah",
    regulatoryClass: "hookah",
    price: { cents: 12900, currency: "USD" },
    images: [{ src: "", alt: "Full hookah setup on charcoal seamless" }],
    stock: { tier: "expected" },
    deliveryEligible: false,
    inStoreOnly: true,
    inStoreReason: "In-store only · fire code",
    popularity: 38,
  },
];

export const fixtureAdapter: CommerceAdapter = {
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

export const ALL_FIXTURE_SLUGS = PRODUCTS.map((p) => p.slug);
