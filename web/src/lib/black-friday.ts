import { STORE_TZ } from "./time";

/**
 * Black Friday 2026 — the shop's three deals (Kemal, WhatsApp group,
 * 2026-11-20). Each came as a flyer; the flyer is shown as-is and the words
 * are repeated in text so the deal is readable without the image.
 *
 * Kemal gave no dates. The deals show until the end of Cyber Monday, Vegas
 * time, and then disappear on their own — nobody has to remember to take a
 * sale down. Change BLACK_FRIDAY_ENDS if the shop says otherwise.
 */
export type BlackFridayDeal = {
  id: string;
  headline: string;
  detail: string;
  image: { src: string; w: number; h: number; alt: string };
  /** Sells nicotine, so the page must carry the nicotine statement. */
  nicotine: boolean;
};

/** Last day the deals run, inclusive, as a Vegas calendar date. */
export const BLACK_FRIDAY_ENDS = "2026-11-30";

export const BLACK_FRIDAY_DEALS: BlackFridayDeal[] = [
  {
    id: "vapes-buy-3",
    headline: "All vapes: buy 3, get 1 free",
    detail: "Buy three vapes and the fourth is free. Text us to check what is in.",
    image: {
      src: "/deals/bf-all-vapes.webp",
      w: 599,
      h: 897,
      alt: "Black Friday deal, all vapes: buy 3, get 1 free.",
    },
    nicotine: true,
  },
  {
    id: "vape-basket",
    headline: "Vape basket: $20 each, pickup only",
    // Kemal, 2026-11-21: "20$ vape tanesi ama pick up yapalım".
    detail: "Any disposable from the Black Friday basket, $20 each. In the shop only — come pick yours.",
    image: {
      src: "/deals/bf-vape-basket.webp",
      w: 666,
      h: 890,
      alt: "A wire basket full of boxed disposable vapes, Black Friday deal, $20 each.",
    },
    nicotine: true,
  },
  {
    id: "perfume-2-for",
    headline: "Scent Vegas perfume: 2 for $25.99",
    detail:
      "Thirteen scents, from Apple & Musk to Vanilla Coffee.",
    image: {
      src: "/deals/bf-perfume.webp",
      w: 1098,
      h: 549,
      alt: "Scent Vegas perfume bottles and the list of thirteen scents, Black Friday deal, 2 for $25.99.",
    },
    nicotine: false,
  },
];

/** True through the end of BLACK_FRIDAY_ENDS, Vegas time. */
export function isBlackFriday(now: Date = new Date()): boolean {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: STORE_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  return today <= BLACK_FRIDAY_ENDS;
}
