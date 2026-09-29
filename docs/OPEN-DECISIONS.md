# Open decisions

Things that are blocked on a human, not on code. Roughly in order of how much
they hold back.

---

## Nothing is deployed

**puffvegas.us still serves the old Ecwid storefront.** Everything in `web/` runs
only on localhost. No hosting, domain cutover, or redirect map has been decided.
The old storefront's URLs should be inventoried before cutover — `research/ingest/`
has crawl output that can seed a redirect table.

## Shop decisions

| Item | Detail |
|---|---|
| **559 products** | One POS "sell online" flag away from publishing. No code change needed — someone has to decide they should be online. Remember: **the flag gets flipped in Lightspeed by the shop; we never edit the POS ourselves.** |
| **27 grey-inventory items** | Need a policy call on whether they are sold online at all. |
| **`rhino`, `xxx`** | Two models a human needs to look at directly. |
| **3 products with no image** | `butane`, `mpb-hookah-bowl`, `vape-juice` — all generic SKUs. Needs a decision on what to even photograph. |
| **Elf Bar** | Absent from both the POS export and the live site. Deliberate, or a gap in the catalogue? |
| **`meet` points in `web/src/lib/hotels.ts`** | Left empty on purpose. Every resort handles outside delivery differently, several change the rule by time of night, and none of it is published anywhere verifiable. Inventing "meet at the north valet" would read as authoritative and strand a driver and a customer at two different doors. The shop should fill these in as it learns each property. |
| **Night-shoot photography** | `/pickup` has three labelled empty placeholders: *Ole Red from the Boulevard · the turn into Grand Bazaar · our door*. Most people arrive in the dark and the Strip looks nothing like its daytime self. Placeholders are labelled as placeholders rather than filled with stock. |

## Ordering has no back end 🔴

The Marquee Neon handoff specifies an order lifecycle: **SEND THE RUNNER**
creates an order, `/delivery/track` shows a live arrival time, a status list
advancing `received → packed → en_route → delivered`, and a named runner with
a tenure and a Text button.

There is no order store, no dispatch system and no runner roster behind this
site. An order is a text message to the shop.

What was built instead, and why:

- **`/delivery/order` (3b)** is real. The draft lives in a cookie, every
  stepper and field is a form POST, and it prices from the catalogue rather
  than the cookie so a tampered draft cannot change what anything costs.
  Sending opens a pre-filled SMS — which is the shop's actual process today.
- **`/delivery/track` (4h)** shows only what is genuinely known: the order that
  was sent, where it is going, and the one step that has actually happened. It
  shows a 25–35 minute *window*, not a clock time, and it does not invent a
  runner. A page rendering "ARRIVING 4:52 AM" and "Marco, 3 years" out of
  nothing would be a convincing lie told to someone standing in a hotel
  corridor.

The layout is the design's and the remaining three steps are already in the
markup. They light up the moment there is a feed.

**Needs a decision:** is the shop getting an order system, or is SMS the real
process? If SMS is the answer, 4h should probably be cut rather than kept as a
receipt — it is the one screen in the bundle that cannot be honest without a
back end.

## Hemp & CBD ⛔ closed

**Decided 2026-09-29: no CBD or THC product is listed online.** The department
is removed and the importer's cannabinoid firewall keeps these off the site
regardless of COA. The questions below only matter if that is ever reopened.

The model is in place and deliberately inert. See [COMPLIANCE.md](COMPLIANCE.md#hemp--cbd--hemp-).

Blocked on two human answers:

1. **A COA source.** Nothing publishes without one, and Lightspeed cannot hold
   it. Where do batch certificates come from — a sheet, the lab's portal, PDFs
   in a folder? Whatever it is, it needs a batch key to join on.
2. **Counsel on Nevada consumable-hemp rules**, separately from the COA.

Also unresolved: `Twisted Hemp` and `The Hemp Doctor` classify as `hemp` by
name inference but are plausibly wrap brands. They fail closed, so the cost is
a missing listing rather than a wrong one — but the shop should confirm.

## The homepage hero ✅

Settled. Both halves of this are now closed.

**Weight** — the autoplaying 7.3 MB loop was removed during the redesign.

**Rights** — also resolved, and not by argument. The hero is now the shop's own
storefront (`public/hero/storefront-*.webp`), supplied by the owner. The still
frame from the unlicensed YouTube compilation, `puff-night.webp`, became
orphaned when the hero was rebuilt and has been deleted. Nothing on the site
uses third-party footage any more.

One thing to confirm with the owner: the storefront image reads as a render or
mockup rather than a photograph. It is theirs either way, so there is no rights
question — but `/pickup` still carries labelled placeholders for a real night
shoot, and if that shoot happens the hero should probably use it too.

## Needs counsel 🔴

- **21 CFR 1143.3(b)(2) — the 20 %-of-advertisement area test** applied to a
  scrolling browse grid. See [COMPLIANCE.md](COMPLIANCE.md).
- **Square's written position on web-originated, door-paid orders.** Gates any
  future web checkout.
- **NRS 370.585(4)(b) and delivery.** Currently handled conservatively
  (cigarettes are pickup-only); a definitive read would settle it.

## Engineering, unblocked but not done

- **Republish the walk-times table.** `SHOP` moved 85 m; 9 of 10 figures shift.
  Blocked on surveying `NEAREST` in `research/ingest/walk-times.py`, which is
  hand-estimated and has at least one provably wrong entry. See
  [LOCATION.md](LOCATION.md).
- **459 `unknown`-class models** need classification rules (or a decision that
  they stay off).

## Raised by an outside audit, 2026-08-29

Four findings from that audit were verified against the repo and fixed the
same day: the homepage overstated stock, "at the door" contradicted the
valet/rideshare meet point, "Searched a lot tonight" claimed search data that
does not exist, and `/legal` was orphaned. What follows is what was NOT acted
on, and why.

### Needs Nevada counsel, not an engineer

- **The "testing bar" on `/pickup`.** The page advertises "Try a flavour
  before you commit to a 25,000-puff device." FDA rules bar free sampling of
  e-liquid and its components by tobacco retailers. If the operation is
  structured compliantly this copy may be fine; if it is not, the copy is
  advertising the violation. **Nobody should guess at this.** The wording is
  still live and should be reviewed before launch.
- **Age verification.** `/age` takes a self-entered date of birth. Nevada
  requires electronic-network tobacco sellers to verify age through an
  independent third-party service. A self-declared birthday is a declaration,
  not verification. The site already calls it "the first of two" checks, with
  ID at handoff as the second, so the operational flow may or may not fall
  under that provision — which is exactly why it needs a lawyer.
- **Warning placement.** The nicotine warning renders on category and product
  pages, but FDA has specific size, contrast and placement rules for covered
  tobacco advertising, and `/vape/brands` does not currently carry it.

### Product decisions, for the owner

- **`80–120 days for a pack-a-day smoker`** (`lib/commerce/types.ts`). It is a
  cigarette-equivalence claim the product does not need; `$0.88 / 1k puffs` is
  arithmetic and carries no such implication. Removing it costs nothing.
- **Nicotine pouches have no department.** `pouch` exists as a regulatory
  class and Zyn is in the search chips, but there is no browse path.
- **"Brands" in the nav goes to vape brands only.** Either rename it or build
  the cross-department page.
- **"The Floor" as the shop nav label.** Deliberate branding; the audit's
  point that first-time visitors read "Shop" faster still stands.
- **Delivered-price breakdown.** A product page says "about $57.93 delivered"
  for a $35 item without showing the tax and fee that make it up.

### Before the domain switch

- The redesign must land on the existing production domain with the old URLs
  redirected, not as a separate site. `puffvegas.us` still publishes
  "Daily 10:00 AM — 7:00 PM" while this site says 24/7; hours and suite
  numbers disagree across directories. That is an SEO, Maps and trust problem
  at once.

### Unverified here

Animation quality, real-device responsive behaviour, keyboard and screen
reader paths, HTTP headers and Core Web Vitals. The browser pane used during
the rebuild does not repaint reliably, so nothing motion- or timing-dependent
was ever confirmed by eye.

### Hero photograph resolution — accepted

`public/hero/interior-*.webp` comes from a 1024x768 original; no
higher-resolution version exists. 1x is covered, 2x is soft. Accepted by the
owner on 2026-08-29. If a better original ever turns up, re-run the two webp
derivatives from `research/photos/interior-2023-03-11.jpg`.

## LIVE on production, needs the owner — age cookie secret (verified 2026-08-30)

The site is deployed at puff2-ten.vercel.app (GitHub → Vercel auto-deploy),
and `AGE_COOKIE_SECRET` is NOT set in the Vercel project. Confirmed against
production, not guessed:

- `web/src/lib/age.ts` falls back to the literal `"dev-only-insecure-secret"`
  when the env var is unset. That string is in this public repo.
- Signing a cookie with that secret and sending it to the live site hides the
  age banner: the "Verify my age" prompt is present with no cookie and absent
  with the forged one, which means production accepted the forgery — so the
  env var is unset there.

Impact is bounded: the gate never blocked pages (middleware sets a header, it
does not redirect), so this does not expose anything that was otherwise hidden.
What it defeats is the 21+ affirmation itself — anyone can mint an "affirmed"
cookie without ever seeing the gate.

Fix (needs Vercel dashboard access, i.e. the owner):
1. Vercel → the puff2 project → Settings → Environment Variables.
2. Add `AGE_COOKIE_SECRET` for Production (and Preview) — any long random
   string, e.g. generated with `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`.
3. Redeploy. Every existing affirmation cookie is invalidated by the change,
   which is the point.

Do not commit the secret to the repo — it is public.
