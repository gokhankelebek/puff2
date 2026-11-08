/**
 * The shop clock. Vegas wall time, decided on the SERVER.
 *
 * Never from the device clock — that lies for a traveller who has not changed
 * timezones, which is most of this audience.
 *
 * This replaces the old four-band merchandising system ("daytime / evening /
 * late / hours"). That was the heart of the previous art direction, where the
 * thing being sold was the hour and the whole shelf re-ordered itself four
 * times a day. Marquee Neon does not work that way: it needs exactly two
 * things from the clock, and nothing else.
 */

export const STORE_TZ = "America/Los_Angeles";

/** Vegas wall-clock hour, 0–23. */
export function vegasHour(now: Date = new Date()): number {
  const h = new Intl.DateTimeFormat("en-US", {
    timeZone: STORE_TZ,
    hour: "2-digit",
    hour12: false,
  }).format(now);
  // Intl renders midnight as "24" in some ICU versions.
  return Number(h) % 24;
}

/**
 * Is it night in the shop's sense — the hours the sign is the whole pitch?
 *
 * Drives the rail heading's "MOVING TONIGHT" / "MOVING TODAY". The hero
 * headline has its own hour bands in lib/hero-lines.ts.
 */
export function isNight(hour: number = vegasHour()): boolean {
  return hour >= 20 || hour < 8;
}

/**
 * The graveyard window, 2–6 AM local. The deal on /deals exists only inside
 * it, and auto-hides outside it rather than being switched off by hand.
 */
export const GRAVEYARD_FROM = 2;
export const GRAVEYARD_TO = 6;

export function isGraveyard(hour: number = vegasHour()): boolean {
  return hour >= GRAVEYARD_FROM && hour < GRAVEYARD_TO;
}

/** Minutes left in the graveyard window, for the countdown. 0 when outside. */
export function graveyardMinutesLeft(now: Date = new Date()): number {
  const hour = vegasHour(now);
  if (!isGraveyard(hour)) return 0;
  const mins = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: STORE_TZ,
      minute: "2-digit",
    }).format(now),
  );
  return (GRAVEYARD_TO - hour) * 60 - mins;
}
