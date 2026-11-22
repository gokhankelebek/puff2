/**
 * Products the shop sells that the POS export never had.
 *
 * The shop is leaving Lightspeed, so new stock gets defined here rather than
 * waiting for a POS row to exist. applyShop() appends any of these whose slug
 * is not already in the catalogue, so both the importer and
 * apply-shop-catalog.ts pick them up and re-running is harmless.
 *
 * Everything here is an accessory. A product that needs a nicotine or tobacco
 * class does NOT belong in this list: it goes through the POS and the
 * classifier, so the warnings logic sees it.
 *
 * Prices are the shop's pre-tax prices — the odd cents land on round totals at
 * Las Vegas's 8.375% (see SHOP_EDITS). Do not round them.
 */
export type ShopProduct = {
  slug: string;
  title: string;
  priceCents: number;
  /** POS-style category; it decides the shelf (lib/commerce/department.ts). */
  category: string;
  brand?: string;
  /** Colours or styles to pick from, if any. */
  styles?: string[];
};

// --- Kemal, WhatsApp group, 2026-11-20 ("aksesuarların resimlerini yollarım").
//     Each line is one photo he posted with its price.
export const SHOP_PRODUCTS: ShopProduct[] = [
  { slug: "small-torch-lighter", title: "Small Torch Lighter", priceCents: 999, category: "Torch",
    styles: ["Purple", "Orange", "Smoke"] },
  { slug: "designer-torch-lighter", title: "Designer Torch Lighter", priceCents: 2768, category: "Torch",
    styles: ["Gold Marble", "Blue & White", "Black Leaf"] },
  { slug: "carbon-fiber-long-torch", title: "Carbon Fiber Long Torch", priceCents: 5998, category: "Torch" },
  { slug: "double-flame-torch-lighter", title: "Double Flame Torch Lighter", priceCents: 2307, category: "Torch" },
  { slug: "torch-gun-lighter", title: "Torch Gun Lighter", priceCents: 2768, category: "Torch" },
  { slug: "pro-torch-gun", title: "Pro Torch Gun", priceCents: 3691, category: "Torch",
    styles: ["Red", "White", "Black"] },
  { slug: "scorch-gold-torch", title: "Scorch Gold Torch", priceCents: 3691, category: "Torch", brand: "Scorch" },
  { slug: "scorch-gold-mini-torch", title: "Scorch Gold Mini Torch", priceCents: 3691, category: "Torch",
    brand: "Scorch", styles: ["Black", "Red", "Green"] },
  { slug: "zippo-flints", title: "Zippo Flints (6 Pack)", priceCents: 399, category: "Lighter", brand: "Zippo" },
  { slug: "zippo-lighter-fluid", title: "Zippo Lighter Fluid", priceCents: 999, category: "Lighter", brand: "Zippo" },
  { slug: "phone-charger-usb-c", title: "Phone Charger & USB-C Cable", priceCents: 1999, category: "Smoke Part",
    styles: ["Wall charger", "USB-C cable"] },
  { slug: "weighmax-j-1000-scale", title: "WeighMax J-1000 Digital Scale", priceCents: 2799, category: "Smoke Part",
    brand: "WeighMax" },
  { slug: "novelty-grinders", title: "Novelty Grinders", priceCents: 2499, category: "Smoke Part" },
  // "pipe yada bong lara ekleyelim" — the glass shelf.
  { slug: "micro-nectar-collector", title: "Micro Nectar Collector", priceCents: 1845,
    category: "Glass Pipe & Bong" },
];
