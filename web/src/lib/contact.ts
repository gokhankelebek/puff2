/**
 * How a delivery order actually reaches the shop: a text or a call.
 *
 * The site has no order store and no checkout, and the online catalogue is a
 * snapshot of the POS rather than a live shelf count. So the honest primary
 * action everywhere is "text us" (or "call us"), pre-filled with whatever the
 * page already knows — the hotel, the item — so the shop can confirm what is
 * really on the shelf before a runner leaves.
 *
 * Person-to-person SMS only. Automated outbound messaging is prohibited for
 * this category; a customer texting the shop's real phone is not A2P.
 */

export const PHONE_E164 = "+17026137799";
export const PHONE_DISPLAY = "(702) 613-7799";
export const PHONE_HREF = `tel:${PHONE_E164}`;

/** `sms:+1…?&body=` — the `?&` form is the one both iOS and Android accept. */
export function smsHref(body?: string): string {
  if (!body) return `sms:${PHONE_E164}`;
  return `sms:${PHONE_E164}?&body=${encodeURIComponent(body)}`;
}

/**
 * The opening line of a delivery text. Written so the customer only has to
 * add what they want — the hotel is already in it when the page knows it.
 */
export function deliveryTextBody(opts: { hotel?: string; item?: string } = {}): string {
  const where = opts.hotel ? `to ${opts.hotel}` : "to my hotel";
  if (opts.item) {
    return `Hi Puff Vegas, do you have ${opts.item}? I'd like it delivered ${where}.`;
  }
  return opts.hotel
    ? `Hi Puff Vegas, delivery ${where} please. I'd like: `
    : "Hi Puff Vegas, delivery please. My hotel is: \nI'd like: ";
}

/** How a product is named in a text: brand first, not repeated if the title leads with it. */
export function productTextName(p: { brand?: string; title: string }): string {
  return p.brand && !p.title.toLowerCase().startsWith(p.brand.toLowerCase())
    ? `${p.brand} ${p.title}`
    : p.title;
}
