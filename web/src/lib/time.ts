/**
 * Pacific time is the single source of truth for the clock and the hour band.
 *
 * The band is decided on the SERVER. Never from the device clock — that lies
 * for a traveller who hasn't changed timezones, which is most of this audience.
 */

export const STORE_TZ = "America/Los_Angeles";

export type HourBand = "daytime" | "evening" | "late" | "hours";

export const BAND_LABEL: Record<HourBand, string> = {
  daytime: "Daytime",
  evening: "Evening",
  late: "Late night",
  hours: "The hours",
};

/** Pacific wall-clock hour, 0–23. */
export function pacificHour(now: Date = new Date()): number {
  const h = new Intl.DateTimeFormat("en-US", {
    timeZone: STORE_TZ,
    hour: "2-digit",
    hour12: false,
  }).format(now);
  // Intl renders midnight as "24" in some ICU versions.
  return Number(h) % 24;
}

export function hourBand(hour: number): HourBand {
  if (hour >= 6 && hour < 16) return "daytime";
  if (hour >= 16 && hour < 23) return "evening";
  if (hour >= 23 || hour < 4) return "late";
  return "hours";
}

/**
 * Fixed-width clock string: always exactly 11 characters, `hh:mm:ss AM`.
 *
 * The 2-digit hour is deliberate. A 1-digit hour would change the string's
 * width at 09:59:59 and reflow the header — the clock would fail CLS on its
 * own. Width stability is a correctness requirement here, not a nicety.
 */
export function formatClock(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: STORE_TZ,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).formatToParts(now);

  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  const hh = get("hour").padStart(2, "0");
  const period = (get("dayPeriod") || "AM").toUpperCase().replace(/\./g, "");

  return `${hh}:${get("minute")}:${get("second")} ${period}`;
}
