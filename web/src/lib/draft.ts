import { DELIVERY_FEE_CENTS } from "@/lib/hotels";
import type { Product } from "@/lib/commerce";

/**
 * The delivery draft — what the design calls the order in progress.
 *
 * Held in a cookie rather than client state, for the same reason everything
 * else here is server-rendered: the draft has to survive a page navigation
 * with scripting off, because the whole ordering flow is plain form POSTs.
 *
 * It is deliberately NOT signed. There is no money and no authorisation in
 * it — a customer editing their own cookie can only change what they are
 * asking for, which they can do through the UI anyway. Prices are never read
 * from here; they are looked up from the catalogue at render time, so a
 * tampered cookie cannot change what anything costs.
 */

export const DRAFT_COOKIE = "pv_draft";
export const DRAFT_MAX_AGE = 60 * 60 * 24 * 2; // 2 days
/** A runner carries a bag, not a pallet. */
export const DRAFT_MAX_LINES = 20;
export const DRAFT_MAX_QTY = 12;

/**
 * Where the runner hands the order over.
 *
 * There is no "room door". The shop does not deliver to hotel rooms — guests
 * come down and meet the runner at their property's valet stand or rideshare
 * zone. Removing it from the type rather than just hiding the option means a
 * stale cookie carrying `door` cannot resurrect a handover we do not do.
 */
export type MeetPoint = "valet" | "rideshare";

/** Delivered to a Strip hotel, or collected at the counter. */
export type OrderMode = "delivery" | "pickup";

/**
 * One line of the order. `flavor` is part of the line's identity: the same
 * device in two flavours is two lines, because it is two things on the shelf.
 */
export type DraftLine = { slug: string; qty: number; flavor?: string };

export type Draft = {
  lines: DraftLine[];
  hotel?: string;
  meet?: MeetPoint;
  /** Missing means delivery — every draft saved before pickup existed was one. */
  mode?: OrderMode;
};

function sameLine(l: DraftLine, slug: string, flavor?: string): boolean {
  return l.slug === slug && (l.flavor ?? "") === (flavor ?? "");
}

export const EMPTY_DRAFT: Draft = { lines: [] };

export function parseDraft(raw: string | undefined): Draft {
  if (!raw) return EMPTY_DRAFT;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return EMPTY_DRAFT;
    const o = parsed as Partial<Draft>;
    const lines = Array.isArray(o.lines)
      ? o.lines
          .filter(
            (l): l is DraftLine =>
              typeof l?.slug === "string" &&
              typeof l?.qty === "number" &&
              Number.isFinite(l.qty),
          )
          .map((l) => ({
            slug: l.slug.slice(0, 80),
            qty: Math.min(DRAFT_MAX_QTY, Math.max(1, Math.trunc(l.qty))),
            ...(typeof l.flavor === "string" && l.flavor
              ? { flavor: l.flavor.slice(0, 80) }
              : {}),
          }))
          .slice(0, DRAFT_MAX_LINES)
      : [];
    return {
      lines,
      hotel: typeof o.hotel === "string" ? o.hotel.slice(0, 60) : undefined,
      /* A draft saved before room delivery was dropped may still carry
         `meet: "door"`. It falls through to undefined here rather than being
         migrated, which is the safe direction: the sheet then asks again. */
      meet: o.meet === "valet" || o.meet === "rideshare" ? o.meet : undefined,
      mode: o.mode === "pickup" ? "pickup" : "delivery",
    };
  } catch {
    // A malformed cookie is an empty draft, never an error page.
    return EMPTY_DRAFT;
  }
}

export function serializeDraft(draft: Draft): string {
  return JSON.stringify(draft);
}

export function addLine(draft: Draft, slug: string, flavor?: string): Draft {
  const lines = [...draft.lines];
  const at = lines.findIndex((l) => sameLine(l, slug, flavor));
  if (at >= 0) {
    lines[at] = { ...lines[at], qty: Math.min(DRAFT_MAX_QTY, lines[at].qty + 1) };
  } else {
    if (lines.length >= DRAFT_MAX_LINES) return draft;
    lines.push({ slug, qty: 1, ...(flavor ? { flavor } : {}) });
  }
  return { ...draft, lines };
}

/** A step down from 1 removes the line — the minus button is also the bin. */
export function stepLine(
  draft: Draft,
  slug: string,
  flavor: string | undefined,
  by: number,
): Draft {
  const lines = draft.lines
    .map((l) =>
      sameLine(l, slug, flavor)
        ? { ...l, qty: Math.min(DRAFT_MAX_QTY, l.qty + by) }
        : l,
    )
    .filter((l) => l.qty > 0);
  return { ...draft, lines };
}

export function removeLine(draft: Draft, slug: string, flavor?: string): Draft {
  return { ...draft, lines: draft.lines.filter((l) => !sameLine(l, slug, flavor)) };
}

/** Items in the draft, for the header count. Unpriced on purpose — no catalogue read. */
export function draftItemCount(draft: Draft): number {
  return draft.lines.reduce((n, l) => n + l.qty, 0);
}

export type PricedLine = {
  product: Product;
  qty: number;
  /** Only a flavour the product actually lists; anything else is dropped. */
  flavor?: string;
  lineCents: number;
};

export type Totals = {
  mode: OrderMode;
  lines: PricedLine[];
  /** Pickup-only products (cigarettes) in a delivery order: shown, not priced. */
  pickupOnly: PricedLine[];
  itemCount: number;
  subtotalCents: number;
  feeCents: number;
  totalCents: number;
};

/**
 * Price the draft from the catalogue, not from the cookie.
 *
 * Lines whose product no longer exists or is no longer deliverable are
 * dropped here rather than priced at zero — a silently free item in a total
 * the runner has to collect at the door is the worst possible failure.
 */
export function priceDraft(draft: Draft, catalog: Product[]): Totals {
  const bySlug = new Map(catalog.map((p) => [p.slug, p]));
  const mode: OrderMode = draft.mode ?? "delivery";
  const lines: PricedLine[] = [];
  const pickupOnly: PricedLine[] = [];

  for (const l of draft.lines) {
    const product = bySlug.get(l.slug);
    if (!product) continue;
    // A flavour the product does not list never reaches the text.
    const flavor =
      l.flavor && (product.flavors ?? []).some((f) => f.value === l.flavor)
        ? l.flavor
        : undefined;
    const priced = { product, qty: l.qty, flavor, lineCents: product.price.cents * l.qty };
    // Cigarettes are counter-only (see COMPLIANCE.md). A delivery order keeps
    // them visible so the customer can switch to pickup or drop them.
    if (mode === "delivery" && (product.inStoreOnly || !product.deliveryEligible)) {
      pickupOnly.push(priced);
    } else {
      lines.push(priced);
    }
  }

  const subtotalCents = lines.reduce((sum, l) => sum + l.lineCents, 0);
  /* No fee on an empty draft or a pickup: a $20 total for nothing is not a delivery. */
  const feeCents = mode === "delivery" && lines.length > 0 ? DELIVERY_FEE_CENTS : 0;

  return {
    mode,
    lines,
    pickupOnly,
    itemCount: lines.reduce((n, l) => n + l.qty, 0),
    subtotalCents,
    feeCents,
    totalCents: subtotalCents + feeCents,
  };
}

/** Everything the shop needs, in one text. */
export function draftToSms(totals: Totals, draft: Draft, hotelName?: string): string {
  const items = totals.lines
    .map((l) => `${l.qty}x ${l.product.title}${l.flavor ? ` - ${l.flavor}` : ""}`)
    .join("\n");
  const total = `$${(totals.totalCents / 100).toFixed(2)} + tax`;
  if (totals.mode === "pickup") {
    return `Puff Vegas pickup order\n\n${items}\n\nI'll pick it up at the shop.\nTotal: ${total}`;
  }
  const where = [
    hotelName ?? draft.hotel,
    draft.meet ? `Meet at ${MEET_LABEL[draft.meet].toLowerCase()}` : undefined,
  ]
    .filter(Boolean)
    .join(" · ");
  return `Puff Vegas delivery order\n\n${items}\n\n${where}\n\nDue at the handoff: ${total}`;
}

export const MEET_LABEL: Record<MeetPoint, string> = {
  valet: "Valet",
  rideshare: "Rideshare pickup",
};
