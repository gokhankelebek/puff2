/**
 * The homepage headline, chosen by the Vegas hour.
 *
 * Replaces "IT'S 2 PM. WE'RE OPEN." with lines written for what someone is
 * doing at that hour: walking the Strip by day, heading out in the evening,
 * stuck in a hotel room late, or up before dawn.
 *
 * ── SEO ────────────────────────────────────────────────────────────────────
 * This line is the big display text but deliberately NOT the <h1>. Googlebot
 * sees whichever line its crawl happens to land on, so a rotating heading
 * would hand the page's main heading to chance. The <h1> is the stable,
 * keyword-bearing eyebrow above it ("24-hour smoke & vape shop…"), and the
 * <title> and description in layout.tsx do not change with the hour.
 *
 * ── Copy rules ─────────────────────────────────────────────────────────────
 * No line may imply cigarette delivery (pickup-only), and nothing plays to a
 * young or party-for-its-own-sake audience — nicotine advertising rules.
 * "Last one open on the Boulevard" was left out: it is a claim about every
 * other shop on the Strip and nobody has checked it.
 */

export type HeroLine = readonly [string, string];

export type HeroBand = "day" | "evening" | "late" | "dawn";

const BANDS: Record<HeroBand, readonly HeroLine[]> = {
  day: [
    ["Center Strip.", "Upstairs at Grand Bazaar."],
    ["Across from Bellagio.", "Open all day."],
    ["Walk in,", "or we run it to your hotel."],
    ["Forgot your charger?", "We're right here."],
  ],
  evening: [
    ["Before you go out.", "Stock up."],
    ["Pregame at Bellagio?", "We'll bring it."],
    ["The night's starting.", "We're already open."],
    ["Cigars for the table.", "Delivered to the valet."],
  ],
  late: [
    ["Still up?", "So are we."],
    ["Out of nicotine?", "Text us."],
    ["3 AM is", "our rush hour."],
    ["Stay in.", "We'll meet you at the valet."],
  ],
  dawn: [
    ["Still", "here."],
    ["Sunrise shift.", "Same prices."],
  ],
};

/** True at any hour; mixed into every band so they get airtime too. */
const ANY_HOUR: readonly HeroLine[] = [
  ["Never closed.", "Never far."],
  ["The Strip's", "24-hour smoke shop."],
  ["$20 flat. Any hotel.", "Any hour."],
];

/** The brief's four bands, by Vegas wall-clock hour. */
export function heroBand(hour: number): HeroBand {
  if (hour >= 6 && hour < 16) return "day";
  if (hour >= 16 && hour < 23) return "evening";
  if (hour >= 23 || hour < 4) return "late";
  return "dawn";
}

/**
 * One line per hour. Changes on the hour and shifts by a day each day, so a
 * regular sees a different line at the same time tomorrow, while one page view
 * and its reload within the hour still agree. "Still here." always leads the
 * dawn band's first hour — it is the line that band was written around.
 */
export function heroLine(hour: number, now: Date = new Date()): HeroLine {
  const band = heroBand(hour);
  if (band === "dawn" && hour === 4) return BANDS.dawn[0];
  const pool = [...BANDS[band], ...ANY_HOUR];
  const day = Math.floor(now.getTime() / 86_400_000);
  return pool[(hour + day) % pool.length];
}
