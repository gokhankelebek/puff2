I checked the working directory (`/Users/gokhankelebek/Puff`) — it's empty, no existing code or assets. So this is a greenfield design deliverable. Here it is.

---

# Puff Vegas — Information Architecture & Experience Specification
**Client:** Puff Vegas Smoke & Vape Shop · puffvegas.us
**Scope:** IA, age verification, three critical flows, mobile system, stock confidence, trust/pricing, instrumentation
**Posture:** Opinionated. Where I've made a call, I've said why, and what I'd give up.

---

## 0. The strategic read (one page, because it determines everything below)

Puff Vegas has exactly two defensible assets, and neither of them is the catalog:

1. **Physical position.** On the Strip, at Grand Bazaar Shops, next to Ole Red. Roughly 40 million visitors a year walk past.
2. **24/7 + 24/7 delivery + cash on delivery.** At 2:14am, when a tourist's disposable dies, there are very few real options, and DoorDash/Uber can't legally carry this category with any reliability.

Everything else — SKU breadth, prices, "great selection" — is undifferentiated. So the site is not a store. **The site is a dispatcher.** Its job is to take an intent that arrives in one of three shapes and route it to a fulfillment channel in the fewest possible taps: *walk here*, *we drive to you*, or *we consult with you* (cigars).

The current Square site (`puffvegas.square.site`) is fatal to all three: it's a generic template on a third-party subdomain, it can't do hotel-aware delivery, it can't express stock confidence, and it leaks all SEO equity off `puffvegas.us`. Recommendation is a headless build on the primary domain with Square retained as POS/inventory source-of-truth via API, not as the storefront. That's a build decision, but it's forced by the UX requirements below — I'll flag the specific places where the platform is the constraint.

**Compliance constraints that are design constraints** (not legal advice — route all of this through counsel licensed in Nevada before launch):
- 21+ minimum, federal and Nevada.
- No health, safety, or cessation claims anywhere in copy. No "safer than," no "quit smoking with."
- No youth-appealing design language: no cartoons, no mascots, no candy/dessert imagery treatments, no "fun" illustration style. This kills a lot of the obvious visual directions for a flavor-driven vape catalog. The design system has to get its energy from typography, photography, and the Vegas-at-night palette instead.
- Age verification is legally load-bearing **at the point of sale and at the point of delivery**, not at the point of page view. That single fact is the entire basis of the age-gate design in §2.
- Delivery sales of ENDS carry additional obligations (ID + adult signature at the door). Assume every delivery is an ID check with no exceptions and design the flow to make that feel normal rather than surprising.

---

## 1. Sitemap & Information Architecture

### 1.1 The core problem, stated precisely

You have three shopper species with incompatible browse grammars:

| | Primary axis | Secondary axes | Browse behavior | Decision time |
|---|---|---|---|---|
| **Vape** | Flavor, Brand | Nicotine strength, puff count, device type, price | Scanning hundreds of near-identical SKUs; recognition over recall; "the blue one" | 20 sec – 2 min |
| **Cigar** | Brand | Wrapper, strength, vitola/size, ring gauge, length, origin, single vs. 5-pack vs. box | Reading specs; comparing; filtering down a tree | 5 – 30 min |
| **Glass / hookah** | Visual form | Price, size, material, style, function | Purely visual grid-scanning; almost no text | 1 – 10 min |

A single unified taxonomy serves none of them. The classic agency failure here is to force everything into one nav tree with one facet rail — you end up with a cigar shopper filtering by "flavor" and a vape shopper filtering by "ring gauge," and both bounce.

### 1.2 The solution: one product graph, four departments, four browse archetypes

**Data layer (shared):** one product model with a common core — `id, title, brand, price, images, stock_state, stock_checked_at, department, delivery_eligible, in_store_only` — plus a **polymorphic attribute block** whose schema is defined per department. Vape products carry `flavor_family, flavor_notes[], nicotine_mg, puff_count, device_type, rechargeable, capacity_ml`. Cigars carry `wrapper, binder, filler, strength, vitola, ring_gauge, length_in, origin, format`. Glass carries `form, material, height_in, joint_size, style_tags[]`.

**Presentation layer (divergent):** each department gets its own facet schema *and* its own PLP archetype. This is the crux of the answer:

- **Vape → "Chip & Swatch" PLP.** Facets rendered as horizontally-scrolling chip rows at the top of the results (not a left rail, not a filter drawer). Flavor family as color swatches. Nicotine strength as a segmented control. Products render as a dense 2-up grid with the flavor name at 17px and a color-coded flavor band. Sort defaults to "Most popular right now."
- **Cigar → "Spec Table" PLP.** Left rail on desktop, a full-screen filter sheet on mobile with grouped, collapsible facets and live result counts. Products render as a list (not a grid) with an inline spec strip: `Maduro · Full · 6×52 · Nicaragua · $14.50 single`. Sortable by ring gauge, length, strength, price. Comparison tray docked at the bottom.
- **Glass / hookah → "Gallery" PLP.** Masonry or tall-cell grid, images at 2× the vape cell size, minimal chrome, price as a small overlay. Filters reduced to four: price, size, style, type. Nothing else. These shoppers are shopping with their eyes.
- **Cigarettes / lighters / accessories → "Utility List" PLP.** Flat, text-dense, alphabetical or by brand. Nobody browses these; they search or they scan for a known name. Optimize for scanning speed, not delight.

**How the user chooses a department:** a persistent **department switcher** as the top-level nav — five items, always visible, bottom tab bar on mobile. Not a hamburger. The mental model is "which store am I in," and switching stores swaps the entire browse grammar. This is the pattern REI uses across activity verticals and B&H uses across product categories, and it is the correct answer when facet schemas genuinely don't overlap.

**How the user escapes the department system:** cross-cutting entry points that ignore taxonomy entirely, surfaced on the homepage and in search:
- `Deliverable now` (≤ 40 min)
- `Under $20`
- `New this week`
- Brand hub pages (a brand can span departments)
- Flavor hub pages (`/vape/flavors/blue-razz` aggregates across brands — this is how vape shoppers actually think and it's an enormous long-tail SEO asset)
- Staff picks / "What we sell most at 2am"

**Search spans everything** but groups results by department with a header per group and a "see all 47 in Vape" link. Never a flat blended list — a blended list forces the cigar shopper to wade through disposables.

### 1.3 Full page inventory

```
/                                        Home (time-aware; see §8)
/search                                  Universal search, department-grouped results

DEPARTMENT: VAPE  /vape
  /vape                                  Dept landing — device type + flavor family + top brands
  /vape/disposables                      PLP (Chip & Swatch)
  /vape/pods                             PLP
  /vape/mods-kits                        PLP
  /vape/e-liquid                         PLP
  /vape/coils-pods-tanks                 PLP (Utility List)
  /vape/brands                           Brand index (A–Z + logo grid)
  /vape/brands/{brand}                   Brand hub — story, full range, "their best flavor"
  /vape/flavors                          Flavor family index (12–16 families)
  /vape/flavors/{flavor}                 Flavor hub — cross-brand. SEO gold.
  /vape/nicotine/{strength}              0mg / 3 / 6 / 20 / 50 — thin but valuable pages
  /vape/p/{slug}                         PDP
  /vape/guides/{topic}                   "Nicotine strengths explained", "Puff counts, honestly"

DEPARTMENT: CIGARS  /cigars
  /cigars                                Dept landing — the humidor, staff picks, "new to cigars"
  /cigars/brands  /cigars/brands/{brand}
  /cigars/wrapper/{wrapper}              Maduro, Connecticut, Habano, Corojo, Oscuro, Candela…
  /cigars/strength/{strength}            Mild / Medium / Medium-Full / Full
  /cigars/size/{vitola}                  Robusto, Toro, Churchill, Gordo, Corona, Lancero…
  /cigars/origin/{country}
  /cigars/singles                        Format filter as a destination — critical for tourists
  /cigars/boxes
  /cigars/samplers
  /cigars/humidor                        Our humidor: RH/temp readings, care, photos
  /cigars/compare                        Side-by-side spec comparison (up to 3)
  /cigars/p/{slug}                       PDP (spec-heavy variant)
  /cigars/guides/{topic}                 "Where you can legally smoke on the Strip" ← huge
  /cigars/accessories                    Cutters, lighters, travel cases, humidors

DEPARTMENT: GLASS & SMOKE  /glass
  /glass/bongs  /glass/pipes  /glass/dab  /glass/rolling  /glass/grinders
  /glass/artists/{artist}                For heady/local glass — merchandise the maker
  /glass/p/{slug}                        PDP (gallery variant, 6+ images)

DEPARTMENT: HOOKAH  /hookah
  /hookah/hookahs  /hookah/shisha  /hookah/charcoal  /hookah/hoses  /hookah/bowls  /hookah/parts
  /hookah/flavors/{flavor}
  /hookah/p/{slug}
  /hookah/guides/setup

DEPARTMENT: TOBACCO & ESSENTIALS  /shop
  /shop/cigarettes  /shop/rolling-tobacco  /shop/lighters  /shop/zippo  /shop/snacks-drinks
  /shop/p/{slug}

DELIVERY (the money spine)
  /delivery                              How it works, zones, fees, ETA bands, cash on delivery
  /delivery/hotels                       Index of every hotel we serve
  /delivery/hotels/{hotel}               ⭐ Per-hotel page: exact meet point, tower notes,
                                          policy, typical ETA, "order to {Hotel}" CTA
  /delivery/zones                        Map + fee/ETA by zone
  /delivery/24-hour-vape-delivery-las-vegas   SEO landing
  /delivery/track/{token}                Login-free order tracking (SMS magic link)

STORE
  /store                                 The Strip store — hours, photos, phone, staff
  /store/directions                      ⭐ Hand-authored walking routes from 8 nearby hotels,
                                          with photos, bridges, and casino-interior shortcuts
  /store/pickup                          Reserve & pick up: how it works
  /reserve/{token}                       Reservation confirmation + pickup code

TRUST & PRICE
  /prices                                ⭐ Public price list, top ~150 SKUs, crawlable
  /fair-price                            The Strip Fair Price Promise
  /authentic                             Authenticity guarantee + authorized-brand list
  /reviews                               Aggregated, unfiltered, recency-sorted
  /about                                 Real photos, real people, how long we've been here

TRANSACTIONAL
  /cart  /checkout  /checkout/delivery  /checkout/payment  /checkout/review
  /order/{token}                         Confirmation + live status
  /account (optional; guest checkout is default and always available)
  /account/reorder                       ⭐ One-tap reorder for locals

SUPPORT & LEGAL
  /help  /contact  /text-us  /faq
  /shipping-and-delivery-policy  /returns  /privacy  /terms  /accessibility
  /age-policy                            What we verify, when, and why
```

**Justification of key non-obvious calls:**

- **Flavor hubs (`/vape/flavors/blue-razz`) are first-class pages, not filter states.** Vape search demand is overwhelmingly flavor-led with brand as a modifier. These pages rank, and they match the shopper's actual mental model ("I want blue razz, whoever makes it").
- **Per-hotel delivery pages are the highest-ROI content in the entire build.** "Vape delivery Bellagio," "smoke shop delivery to Caesars Palace" — these are transactional-intent queries with almost no competition, and the page doubles as the operational document that removes the biggest failure mode in the delivery flow (see §3.2).
- **`/cigars/singles` is a destination, not a filter.** A tourist will not buy a box. Singles is 90% of Strip cigar revenue and burying it in a facet is malpractice.
- **`/prices` as a public, crawlable page** is a deliberate trust weapon. See §6.
- **`/store/directions` is hand-authored, not a map embed.** Getting to Grand Bazaar Shops from across the Strip involves pedestrian bridges and casino interiors that Google Maps handles badly. Photos of the actual turns.

---

## 2. The Age Gate

### 2.1 The thesis

**The blocking modal is a compliance theater artifact.** It is not what makes you legally defensible, and it costs you enormously:

- It blocks crawlers or serves them empty DOM, gutting organic acquisition in a category where paid acquisition is largely banned. You cannot buy traffic here. Losing organic is losing the business.
- It's the first interaction a 2am user has, on hotel wifi, one-handed. Measured bounce on category-typical full-screen gates runs 15–35%.
- The thing that is actually legally load-bearing is: (a) a verified affirmation record at the point of sale, and (b) a physical ID check at the point of fulfillment. A JS modal on a marketing page contributes nothing to either.

So: **verify progressively, at the moments that matter, and never block content.**

### 2.2 The four tiers

**Tier 0 — Page view. No gate. Ever.**
A persistent, non-modal, non-blocking **top banner**, server-rendered in the initial HTML:

> **21+ only.** We check ID in store and at the door. — *[I'm 21 or older]* · *[Learn why]*

- It sits above the header, ~48px, in the document flow — it does **not** overlay content, does not cause CLS, does not trap focus, does not block scroll.
- Tapping "I'm 21 or older" sets the affirmation and collapses the banner with a 200ms height transition. No page reload.
- The banner is dismissible only by affirming — but because it never blocks anything, an un-affirmed user can browse the entire site indefinitely. That's fine. They can't buy.
- With JS off, the banner's affirm control is a `<form method="POST" action="/age/affirm">` that sets a server cookie and 302s back. It works.
- Google's intrusive-interstitial guidance carves out legally-required age verification, but a banner is unambiguously safe where a full-screen overlay is a judgment call. Take the safe one.

**Tier 1 — Purchase intent. Inline bottom sheet, one tap.**
Fires on the **first** `Add to cart` / `Reserve` / `Start delivery` action if no affirmation exists. Not on page view, not on scroll, not on PDP view.

```
┌─────────────────────────────────┐
│                                 │
│  Quick check — are you 21+?     │
│  Nevada law. We check ID at     │
│  pickup and delivery too.       │
│                                 │
│  ┌───────────────────────────┐  │
│  │   Yes, I'm 21 or older    │  │  ← 56px, primary, thumb zone
│  └───────────────────────────┘  │
│                                 │
│      No — take me out           │  ← text link, not a button
│                                 │
└─────────────────────────────────┘
```

- **Bottom sheet, not centered modal.** Both buttons land in the thumb arc.
- **Asymmetric weight is intentional and defensible.** The negative path is present, labeled, keyboard-reachable, and logged — it is not hidden. But an equal-weight two-button choice for a question with a 97%-yes answer is a tax on every honest user. The affirmation is a legal attestation, not a coin flip, and the real verification happens at the door.
- "No" routes to `/age-policy` with a neutral, non-punitive message and a `noindex` header. Not a scolding dead-end.
- **One tap.** No date of birth here. Asking for DOB at add-to-cart is where conversion goes to die, and a self-reported DOB at this stage is worth no more than a self-reported yes.
- **The action the user took is preserved and completes automatically** on affirm. They tapped "Add to cart"; the item is in the cart when the sheet closes. Never make them repeat the action.

**Tier 2 — Checkout. Date of birth, required, on the record.**
A single masked field, `MM / DD / YYYY`, `inputmode="numeric"`, auto-advancing between segments, with the year segment accepting 4 digits. **Never a date picker. Never a year dropdown with 100 options.** Both are catastrophic one-handed on mobile.

Validated server-side against 21 years. Stored with the order alongside timestamp, IP, user-agent, and the Tier 0/1 affirmation events. **That record is the actual legal artifact.** Optionally layered with a third-party ID/identity check for card orders above a threshold — but keep it off the default path.

**Tier 3 — Fulfillment. Physical ID. Non-negotiable.**
- **Delivery:** driver scans/inspects government ID, records pass/fail and last-4 of the ID number (not the full number), captures adult signature. Told to the customer **three times before it happens** — at delivery-method selection, at review, and in the confirmation SMS — so it is never a surprise at the door.
- **Pickup/reserve:** ID at counter, same as any walk-in.
- Failed check at the door: item returns, order voided, no charge on card orders; the policy is published on `/delivery` so nobody argues on a hotel landing.

### 2.3 What it remembers, and for how long

| Store | Key | TTL | Purpose |
|---|---|---|---|
| `localStorage` | `pv_age_ok` = ts | 365 d | Instant, no-flicker suppression on repeat visits |
| Cookie (`HttpOnly`, `SameSite=Lax`, `Secure`) | `pv_age` = signed ts | 365 d | Server-side render decision — banner state is correct in the **first byte**, no flash |
| Server event log | affirmation events | 3+ yrs | Legal defensibility |
| Order record | DOB + all affirmation events | per retention policy | The real artifact |

**The cookie is what prevents the flash-of-banner.** Read it server-side and render the collapsed state directly. A JS-driven gate that flickers into view after paint is the single most common technical failure in this category.

### 2.4 Degradation matrix

| Condition | Behavior |
|---|---|
| No JS | Banner renders (it's HTML). Affirm = form POST → cookie → 302. Tier 1 sheet becomes a full server-rendered interstitial page at `/age/confirm?next=…` — a real page, back-button-safe. Checkout DOB is a normal form field validated server-side. **Every tier works.** |
| No cookies, no localStorage | Banner shows every visit. Tier 1 sheet fires every add-to-cart. Annoying, functional, still legal. |
| Crawler (verified Googlebot/Bingbot by reverse DNS) | Banner renders in HTML, nothing suppressed, nothing blocked. Nothing to special-case — because nothing was ever blocking. **This is the whole point.** |
| Slow / flaky connection | Banner is in the initial HTML payload. Zero JS dependency for the most legally visible element on the site. |
| Screen reader | Banner is a `<div role="region" aria-label="Age verification">` in normal flow. Sheet is a proper `role="dialog"` with focus management and Escape-to-close. Neither traps focus permanently. |
| Prefetch / speculative navigation | Affirmation events fire only on real user gestures, never on prefetch. |
| Returning user, 366 days later | One tap. Not a re-onboarding. |

### 2.5 What I would explicitly refuse to build

Full-screen blocking overlay · scroll-lock · blurred content behind the gate · DOB required before browsing · "enter your birth year" dropdown · re-prompting on every session · gating the store address, hours, or phone number (those must be reachable by anyone, always — a 2am user needs to be able to call you).

---

## 3. The Three Critical Flows

---

### 3.1 Flow A — "I'm 400 feet away and I need X right now"

**User:** On the Strip, walking, phone in one hand, drink in the other. Arrived via Google Maps, "vape shop near me," or a Google Business Profile tap. Time-to-decision target: **under 45 seconds.**

**The failure mode this flow exists to prevent:** they walk over and the thing isn't there, or they can't find the door.

---

**Screen A1 — Landing (usually `/store`, `/`, or a PDP from Maps)**
Above the fold, before anything else, three facts and two buttons:

```
● OPEN NOW · 24 hours
Grand Bazaar Shops · next to Ole Red
3649 S Las Vegas Blvd, Ste 611

┌──────────────┐  ┌──────────────┐
│  Directions  │  │  Call (702)  │   ← 64px tall, side by side
└──────────────┘  └──────────────┘

🔍 What are you looking for?          ← autofocused? NO. See below.
```

Decisions on this screen:
- **"OPEN NOW" is computed server-side and stated as a live fact**, with a green dot. Not a hours table. The single most valuable word to a 2am tourist is "open."
- **"next to Ole Red"** does more wayfinding work than the street address. Landmark first, address second. Nobody on the Strip navigates by address number.
- **Directions and Call are 64px, side by side, in the bottom third of the fold.** Directions opens the native maps app with **walking mode pre-selected** via the platform URL scheme, not driving.
- **The search field is NOT autofocused.** Autofocus raises the keyboard, eats 45% of the viewport, and hides the two buttons most of these users want. Tap to focus.
- No hero image. No carousel. No newsletter. The fold is four facts and two buttons.

---

**Screen A2 — Search / browse to the item**
- Search runs on keystroke ≥ 2 chars with a 150ms debounce, **but the form also works as a plain GET submit with JS off.**
- Results grouped by department, each row showing **thumbnail · name · price · stock badge**. Price and stock on the *result row* — do not make them tap through to find out.
- Aggressive synonym handling (see §8, item 12). "elf bar", "elfbar", "elf", "ELFBAR" all resolve.
- If zero results: never a dead end. "We probably have it — **[Text us, we answer in minutes]**" plus the three closest guesses.

---

**Screen A3 — PDP, walk-in variant**
The PDP renders a different action module when walk-in intent is detected (referrer = Maps, or geolocation within ~0.5 mi, or the user came from `/store`):

```
RAZ TN9000 · Blue Razz Ice
$24.99          ← same price in store, online, delivery

┌────────────────────────────────────────┐
│ ✓ On the shelf right now               │
│   Counted 22 minutes ago               │  ← provenance, always
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│      Hold it for me — free, 60 min     │  ← PRIMARY
└────────────────────────────────────────┘
┌────────────────────────────────────────┐
│      Walking directions · 6 min        │  ← SECONDARY
└────────────────────────────────────────┘
        Not sure? Text us →
```

Decisions:
- **"Hold it for me" is the primary action, above directions.** It converts an uncertain walk into a promise, it gives you a measurable intent event, and it makes the store staff pull the item — which is the *actual* solution to the stock problem.
- Hold requires **phone number only.** No account, no email, no name (name is optional). One field, `inputmode="tel"`, and a submit. That's the whole form.
- **Stock provenance is always shown.** "Counted 22 minutes ago" is worth more than a green dot. See §5.
- **"6 min walk"** — computed from geolocation if granted, otherwise from the nearest recognized landmark. Walking minutes, never driving minutes, never distance in miles.

---

**Screen A4 — Hold confirmation**
```
        Held for you until 2:47am

              #4471
        Show this at the counter

  Grand Bazaar Shops, Suite 611
  Upper level, next to Ole Red

  ┌──────────────────────────────┐
  │   Walking directions →       │
  └──────────────────────────────┘

  We texted you this. If it's not on the
  shelf when we pull it, we'll text you
  within 5 minutes — before you walk over.
```

- **Pickup code is the largest element on the screen.** They will show this to staff while distracted.
- **SMS is sent immediately** — the browser tab will be closed or lost. The SMS is the durable artifact, and it contains the code, the address, a maps link, and the store phone.
- **The failure promise is stated explicitly.** "If it's not there, we'll text you *before* you walk over." This is the trust mechanism, and it's cheap: staff pull the item, and if it's missing they tap one button.
- Hold expires at 60 minutes with a 15-minute-warning SMS and a one-tap "extend."

---

**Screen A5 — `/store/directions` (reached from any directions link)**
Not a map embed. A hand-authored page:
- **"Coming from Bellagio?"** — 8 accordion sections, one per nearby property (Bellagio, Paris, Planet Hollywood, Horseshoe, Cromwell, Flamingo, Caesars, Linq).
- Each with: 3–5 photos of the actual turns, the pedestrian bridge to use, "go through the casino, not around it," escalator vs. stairs, and a walking-minute estimate.
- A static map image (not an interactive embed) so it renders on garbage wifi, with a tap-to-open-native-maps overlay.
- Below the fold: the interactive map, lazy-loaded, for anyone who scrolls.

---

### 3.2 Flow B — "Deliver to my hotel room at 2am"

**User:** In a hotel room. Possibly impaired. Wants it to arrive and wants to know when. May not have a card they want to use, or may be a cash person. Highest AOV, highest churn-to-repeat potential (locals reorder).

**The failure modes this flow exists to prevent:** (1) address entry failure — hotel addresses are ambiguous and room-number formats are chaotic; (2) the hotel won't let the driver up, and nobody said so; (3) the ETA is a lie; (4) the ID check at the door is a surprise and the order fails.

---

**Screen B1 — Entry**
The delivery path must be reachable in one tap from anywhere. After 10pm, the homepage hero *is* the delivery path:

```
        Delivery, right now
     Most Strip orders in 25–40 min
      Cash or card at the door

┌────────────────────────────────────┐
│   Where are you? (hotel or address)│
└────────────────────────────────────┘
```

Asking "where are you" **before** asking "what do you want" is the correct order here, and it's the opposite of standard e-commerce. Reason: the answer determines the ETA, the fee, the meet point, and whether you serve them at all — and it lets you show a real ETA on every subsequent screen instead of a generic promise. Instacart and DoorDash both establish location before catalog for exactly this reason.

---

**Screen B2 — Hotel picker (the make-or-break screen)**

```
Where should we bring it?

┌────────────────────────────────────┐
│ 🔍 bell                            │
└────────────────────────────────────┘

  📍 Bellagio                 ~28 min
     3600 S Las Vegas Blvd

  📍 Bellagio – Spa Tower     ~28 min

  ─────────────────────────────
  Or enter a street address →
```

Decisions:
- **Type-ahead over a curated list of every Las Vegas hotel, resort, and condo tower — not a raw address autocomplete.** Google Places will happily return "Bellagio Conservatory" and "Bellagio Gallery of Fine Art" and the driver ends up in the wrong place. A curated internal list of ~200 properties, each with a known meet point, is far better and takes a day to build.
- **Towers are separate entries** where they matter (Vdara vs. Aria, Palazzo vs. Venetian, Delano vs. Mandalay Bay, Spa Tower vs. main). This is where deliveries actually go wrong.
- **ETA is shown per-result, before selection.** The user learns the cost of their location immediately.
- **Geolocation offers a one-tap pre-fill** ("You look like you're at Planet Hollywood — is that right? [Yes] [No, change]") but is never required and never blocks. Permission prompts at 2am on hotel wifi fail often.
- Street address is available but demoted, because ~80% of this volume is hotels.

---

**Screen B3 — Room, tower, and the meet-point truth**

```
Bellagio                       Change

Room number
┌────────────┐
│            │    ← inputmode="numeric", no format validation
└────────────┘

Tower (optional)
[ Main ]  [ Spa Tower ]

┌────────────────────────────────────┐
│ ℹ️ How Bellagio works               │
│                                    │
│ Security doesn't let delivery      │
│ drivers past the elevators. Your   │
│ driver will text you and meet you  │
│ at the North Valet entrance —      │
│ about a 3 min walk from the        │
│ elevators.                         │
└────────────────────────────────────┘
```

Decisions:
- **The hotel policy is stated here, before the cart, in plain language.** This is the single highest-value piece of content in the entire build. Most casino resorts will not permit third-party delivery to guest room doors. If the user discovers this when the driver is downstairs, you have an angry customer and a failed delivery. Told upfront, it's just logistics.
- Per-hotel policy content is authored once per property, lives on `/delivery/hotels/{hotel}`, and is injected here. It's also independently rankable content.
- **Room number has no format validation.** Vegas room numbers include `29-114`, `PH4`, `61012`, `Villa 7`. Reject nothing. Accept a string. Length 1–10.
- **Tower is a segmented control, not a dropdown**, and only renders for properties that have towers.

---

**Screen B4 — Catalog (delivery context persists)**
Every PLP and PDP now carries a persistent slim bar:

`🚚 Bellagio · Rm 2914 · ~28 min · $6 delivery      Change`

- Products not deliverable (e.g., anything the client decides is in-store-only) are visibly marked and de-ranked, never silently hidden.
- Stock states are **delivery-specific**: "we have it, driver will confirm" vs. "on the shelf." Different promise.

---

**Screen B5 — Cart, with the substitution question**
```
RAZ TN9000 · Blue Razz Ice      $24.99
Clipper lighter                  $3.49
                       ─────────────────
Subtotal                        $28.48
Delivery                         $6.00
Tax                              $2.55
                       ─────────────────
Total                           $37.03   ← this exact number, at the door

If something's sold out:
( ) Closest match, same brand & strength
(•) Text me first          ← default
( ) Just remove it
```

Decisions:
- **Substitution preference is asked in the cart, not resolved by a phone call at 1am.** This is standard in grocery delivery and almost absent in this category. It saves a meaningful fraction of orders.
- **"Text me first" is the default** because for a flavor-driven purchase, silent substitution is a trust violation. But offering the auto-sub option captures the "I don't care, just bring something" segment.
- **The total is complete here** — item + delivery + tax, no tip line yet, no surprises later. §6.

---

**Screen B6 — Contact & delivery details**
Three fields. Name, mobile, and a free-text "anything the driver should know."
- Mobile is `type="tel" inputmode="tel" autocomplete="tel"`, auto-formatted, with a "we'll text you the tracking link" microcopy.
- **No email required.** No account required. Guest by default; offer "save this for next time" as a post-order checkbox for locals.
- Explicit line, in a bordered box: **"Bring your ID. The driver checks it — 21+, no exceptions."** Second of three mentions.

---

**Screen B7 — Payment**
```
How do you want to pay?

┌────────────────────────────────────┐
│  💵  Cash at the door       $37.03 │  ← FIRST, equal weight
│      Driver carries change         │
└────────────────────────────────────┘
┌────────────────────────────────────┐
│  💳  Card now               $37.03 │
└────────────────────────────────────┘
┌────────────────────────────────────┐
│   Apple Pay                        │
└────────────────────────────────────┘
```

Decisions:
- **Cash is listed first and looks identical in weight to card.** Cash-on-delivery is a genuine differentiator here — a real share of this customer base either has no card they want to use, is on a foreign card that will decline, or simply prefers cash for this category. Treating it as a grudging afterthought is leaving money on the table.
- **"Driver carries change"** is stated, with the ceiling ("change for up to $100"). This is the #1 unspoken cash anxiety.
- **Identical total across all three methods.** No card surcharge, no cash discount. If the client insists on a card fee, it must be shown in the cart, not revealed here.
- Apple Pay / Google Pay render only when actually available. Digital wallet is by far the fastest path for the impaired user — no typing.
- **Card capture must not depend on a third-party JS bundle for the page to be usable.** Payment iframe loads progressively; if it fails, a server-rendered fallback form appears with a "or switch to cash" escape hatch. Hotel captive portals block third-party domains more often than you'd think. §4.

---

**Screen B8 — Review**
One screen, everything on it, one button. Items, address with room number, ETA as a time range not a countdown ("arrives 2:31–2:46am"), total, payment method, and the ID reminder (third mention). Every line has an inline `Edit`. The submit button says `Place order · $37.03` — the amount is on the button.

---

**Screen B9 — Confirmation & tracking**
```
        Order in.

        2:31 – 2:46am
        ↑ largest element on the page

  Marcus is picking it up now
  Bellagio · Rm 2914 · meeting at North Valet
  $37.03 · cash

  ┌────────────────────────────────┐
  │      Text Marcus               │
  └────────────────────────────────┘
        Call the store →

  ⚠️ Have your ID out. 21+.
```

Decisions:
- **ETA is the hero.** Not the order number, not a thank-you.
- **The driver has a name.** Trust, and it makes the door interaction human.
- **A tracking SMS fires immediately** with a login-free magic link (`/delivery/track/{token}`, 24h expiry). The browser session will be lost. Assume it.
- **Status page uses SSE or long-poll with a hard polling fallback**, and degrades to a static server-rendered status on refresh. No websocket dependency.
- Status stages, kept coarse and honest: `Confirmed → Picking → On the way → Arriving → Delivered`. **No fake live map** unless the driver GPS is genuinely wired up. A fake or laggy map destroys more trust than no map.
- On `Arriving`, push/SMS: "Marcus is at North Valet, black Civic. Bring your ID."

---

### 3.3 Flow C — "I want to browse cigars properly"

**User:** Deliberate. Knows some vocabulary or wants to learn it. Wants specs, wants to compare, may spend $15 or $400. Possibly buying a gift. Desktop-viable but still mostly mobile. Session length 5–30 min.

**Failure mode this flow exists to prevent:** treating cigars like vapes — grid of pretty boxes, no specs, no comparison, no singles. Cigar buyers can smell an amateur catalog instantly and will go to a real tobacconist.

---

**Screen C1 — `/cigars` department landing**
Four routes in, because cigar shoppers arrive with wildly different knowledge:
1. **"I know what I want"** → search + brand A–Z grid (logos, because brand recognition is visual)
2. **"Browse by spec"** → wrapper / strength / size entry tiles, each with a photograph that actually shows the difference (a Maduro next to a Connecticut side by side teaches more than the word does)
3. **"New to cigars"** → a genuinely good guide + a $30 sampler
4. **"Staff picks"** → 6 cigars with real, signed, opinionated notes from named staff

Plus: **Singles** as a top-level tile. And a humidor status strip: `Humidor: 70°F / 69% RH · checked 6:00am`.

---

**Screen C2 — Cigar PLP (Spec Table archetype)**

```
Maduro · 247 cigars              [Filter]  [Sort ▾]

☐ Padrón 1964 Anniversary Torpedo
  ████ Maduro · Full · 6.0" × 52 · Nicaragua
  Single $24.50 · Box of 25 $562
  ✓ In humidor · 18 in stock
  [ Compare ]

☐ Oliva Serie V Melanio Robusto
  ████ Sun Grown · Med-Full · 5.0" × 52 · Nicaragua
  Single $12.75 · 5-pack $59
  ✓ In humidor · 40+ in stock
  [ Compare ]
```

Decisions:
- **List, not grid.** Specs need horizontal room. A grid forces truncation, and truncated specs are useless.
- **The spec strip is the row's real content**, in a consistent order: wrapper · strength · size · origin. Once learned, it's scannable at speed. This is the pattern that makes Cigars International and Famous Smoke usable despite ugly UI — the spec strip is load-bearing.
- **Wrapper gets a color chip** (`████`). Wrapper shade is the most visual cigar attribute and a color chip communicates it faster than the word.
- **Singles price is listed first**, box price second. Tourist-first.
- **Filter as a full-screen sheet on mobile**, with grouped collapsible sections, **live result counts per option**, an always-visible sticky `Show 247 results` button at the bottom, and `Clear all`. Never a filter drawer that hides the count.
- **Sort options that matter:** Popularity, Price ↑↓, Ring gauge ↑↓, Length ↑↓, Strength ↑↓, Newest. Ring gauge and length as sorts are not decorative — experienced buyers sort by them.
- **Comparison checkboxes inline** on the row, feeding a docked bottom tray.

---

**Screen C3 — Cigar PDP (spec-heavy variant)**

Structure, top to bottom:
1. **Photograph with a scale reference.** A cigar photographed alone communicates nothing about size. Shoot every cigar against a subtle ruled backdrop or with a consistent reference object. Ring gauge is an abstraction; a photo isn't.
2. **Name, brand link, price by format.** Format selector as a segmented control: `Single $24.50 | 5-pack $118 | Box of 25 $562`. Per-stick price shown under multi-packs — `$22.48/ea` — so the value math is done for them.
3. **The spec table.** A real `<table>`, two columns, every attribute: Wrapper / Binder / Filler / Strength / Body / Vitola / Length / Ring gauge / Origin / Rolled / Est. smoke time. Not prose. Not a bulleted list. A table.
4. **Strength as a 5-segment visual meter** with the label. Mild → Full.
5. **Tasting notes as chips**, not a paragraph: `Cocoa` `Espresso` `Black pepper` `Cedar` `Leather`. Each chip is a link to other cigars with that note. This turns tasting notes into navigation.
6. **Humidor status:** `In our humidor · 70°F / 69% RH · 18 in stock`. Freshness is the #1 anxiety when buying cigars from a non-specialist shop, and publishing hygrometer readings is a two-word answer to it.
7. **`Add to compare`** — persistent.
8. **"Similar cigars"** computed by *spec adjacency* (same wrapper ± one strength step, ring gauge ± 4, price ± 30%), not by "customers also bought." Spec adjacency is what a good tobacconist does.
9. **"Pairs with"** — a genuinely useful, non-gimmicky module.
10. **Where to smoke it** — link to the Strip smoking-areas guide. This is the question every tourist cigar buyer has and nobody answers it.
11. Reviews, with the reviewer's experience level shown.

---

**Screen C4 — Comparison**
Docked tray at the bottom: `2 cigars · Compare →`, persists across pages, max 3 on mobile / 4 on desktop.

Comparison view is a **transposed table** — attributes as rows, cigars as columns, horizontally scrollable with the attribute column frozen. Rows where all values are identical are auto-collapsed under a `Show 6 identical specs` toggle, so the screen shows only the differences. That collapse is the whole trick; a full comparison table on a 390px screen is unreadable otherwise.

Each column footer: format selector + `Add to cart`, so the comparison converts in place.

---

**Screen C5 — Cigar checkout considerations**
- Offer **pickup** prominently — many cigar buyers want to see and smell the stick, and the humidor is a reason to visit.
- Delivery of cigars gets a **"we'll pack it with a humidification pack"** line. Small cost, large perceived care.
- Gift option: a real one — box, note card, no price on the receipt.

---

## 4. Mobile-First System Rules

Assume: **85%+ mobile, 60%+ one-handed, meaningful share on degraded connections, non-trivial share cognitively impaired.** These are engineering constraints, not aspirations.

### 4.1 Layout & thumb zones

- **Reference viewport: 390 × 844.** Design at that size first; everything else is an adaptation.
- **Bottom 35% of viewport = the action zone.** Every primary CTA lives there. Persistent bottom action bar, context-dependent:
  - PDP → `[ Add to cart ]  [ 💬 ]`
  - Store page → `[ Directions ]  [ Call ]`
  - Cart → `[ Checkout · $37.03 ]`
  - PLP → `[ Filter ]  [ Sort ]` (only when filters exist)
- **Top 15% = read-only.** Logo, department name, cart count. Never put a needed control up there. The top-right corner is the worst pixel on a phone for a right-handed one-handed user, and it's where every agency puts the hamburger.
- **Bottom tab bar for department switching**, 5 items, 56px tall, safe-area-inset padded. Not a hamburger.
- **Back is always available in-page**, never relying solely on the browser gesture — iOS Safari's edge-swipe conflicts with horizontal chip scrollers.

### 4.2 Tap targets & type

| Element | Minimum | Notes |
|---|---|---|
| Any interactive element | **48 × 48 px** | Hard floor. Includes filter chips, close buttons, checkboxes. |
| Primary CTA | **56 px tall**, full-width minus 16px gutters | |
| Emergency actions (Call, Directions, Add to cart) | **64 px** | Impairment margin |
| Spacing between adjacent targets | **≥ 8 px** | 12px preferred |
| Body text | **17 px / 1.5** | Not 14. Not 15. |
| Price | **20 px, 600 weight** | Prices are scanned, not read |
| Smallest text on any page | **14 px** | Below that, nothing |
| Contrast | **7:1** body, **4.5:1** minimum for everything including disabled states | Not 4.5 for body. 7. Outdoor Strip sunlight and 2am eyes both need it. |

- **Never rely on hover.** No hover-reveal prices, no hover-reveal specs, no hover-zoom as the only path to detail.
- **200% browser zoom must not break any layout.** Test it.
- **`prefers-reduced-motion` respected** — kill all transitions except opacity.
- **Dark mode is the default after 10pm** (see §8.3) and is a first-class theme, not an inversion filter.

### 4.3 The no-JS baseline (non-negotiable)

This is not accessibility box-ticking — it is the hotel-wifi survival strategy. If the JS bundle fails to load or times out, the following must still work end to end:

| Function | No-JS implementation |
|---|---|
| Store info, hours, phone, address | Static HTML. `tel:` and maps `https://` links. |
| Search | `<form method="GET" action="/search">` |
| Category browse | Server-rendered PLPs |
| **Faceted filtering** | Facets are `<a href>` links carrying query params. Filter sheet becomes a `<form method="GET">` with a submit. Server renders results. **No client-side filtering as the only path.** |
| Pagination | Real `<a>` links with `rel=prev/next`. Infinite scroll is a JS enhancement layered on top, never the only mechanism. |
| PDP | Server-rendered, including specs and stock state |
| Add to cart | `<form method="POST">` → 302 to cart |
| Age gate | §2.4 |
| Checkout | Multi-step server-rendered forms, one POST per step. Payment falls back to a hosted payment page. |
| Order tracking | Server-rendered status; refresh to update. SSE is the enhancement. |

Practically: **server-render everything, hydrate progressively.** Next.js App Router with RSC, Astro, or plain server-rendered templates. Not a client-side SPA.

### 4.4 Performance budget

| Metric | Budget | Enforcement |
|---|---|---|
| HTML (PLP, gzipped) | ≤ 40 KB | CI check |
| CSS (critical, inlined) | ≤ 14 KB | Inline the critical path; defer the rest |
| JS (initial, gzipped) | ≤ 60 KB | CI budget, build fails over |
| JS (total, all routes) | ≤ 180 KB | |
| Images per PLP viewport | ≤ 120 KB | AVIF with WebP fallback, `srcset` at 3 widths, `loading="lazy"` below fold, explicit `width`/`height` on every image |
| Web fonts | **Zero on first paint** | System font stack (`-apple-system, Segoe UI, Roboto…`). If a brand face is mandatory, `font-display: optional`, subset, self-hosted, one weight. |
| Third-party scripts | **≤ 2, both deferred, neither on the critical path** | Analytics and payment only. No tag manager loading twelve pixels. |
| LCP, Slow 4G, p75 | **< 2.0 s** | |
| INP, p75 | **< 200 ms** | |
| CLS | **< 0.05** | |
| Time to interactive, Slow 4G | < 3.5 s | |

Additional: **HTTP/2 or 3, Brotli, immutable asset caching, `<link rel=preconnect>` to nothing but your own origin** (because you have no third-party critical-path origins — that's the point).

### 4.5 The hotel captive-portal problem

Casino wifi portals intercept DNS and HTTP, inject redirects, aggressively block non-allowlisted domains, and frequently throttle to sub-1Mbps with 400ms+ latency. Specific mitigations:

1. **Single-origin architecture.** Zero critical-path dependencies on third-party hostnames. No CDN-hosted fonts, no CDN-hosted JS libraries, no third-party image host. Everything served from `puffvegas.us`. A portal that blocks `cdnjs` breaks a site that depends on it; it can't break one that doesn't.
2. **HSTS preload + HTTPS everywhere.** A portal MITM then fails *visibly* (browser interstitial the user recognizes) rather than silently serving a mangled page. A clear failure is better than a broken page.
3. **Service worker with a cached app shell + last-viewed products.** Second visit renders instantly even on a dead connection. Register it *after* first paint, never blocking.
4. **Connection-quality detection** (`navigator.connection.effectiveType` / `saveData`): on `2g`/`slow-2g`/`saveData`, drop to a text-forward mode — smaller images, no autoplay, no lazy-load-on-scroll (just load them), no non-essential JS.
5. **Explicit escape hatch.** After 8 seconds without a successful fetch, show a persistent slim bar:
   > *Hotel wifi acting up? Turn off wifi and use cellular, or just call us: **(702) 613-7799***

   Naming the actual cause is far more useful than a spinner. This is the single highest-value 8 lines of JS on the site.
6. **`tel:` and `sms:` links work even when the network is dead.** They're OS handoffs, not network requests. So the phone number and the "Text us" link must be present in the *initial HTML* of every page — they are the true fallback for the entire site.
7. **Short, memorable domain.** `puffvegas.us` is fine. Print it and a QR on every bag, receipt, and shelf tag so a user with a broken portal can retype it on cellular.
8. **No IP-geolocation-dependent behavior.** Hotel wifi geolocates to wherever the property's egress is. Never auto-select a hotel purely from IP; always confirm.

### 4.6 Designing for impairment

Not a joke requirement — a meaningful share of 2am Strip traffic is intoxicated. Rules:

- **No timeouts anywhere.** No "your cart expires in 5:00." No session expiry mid-checkout.
- **No CAPTCHA in checkout.** Ever. Use invisible risk scoring or rate limiting.
- **Forgiving inputs.** Trim whitespace, strip formatting characters from phone numbers, accept any room-number format, never reject on the client for anything but truly required fields.
- **Never lose state.** Cart and every partially-completed form field persist to localStorage on blur and restore on return. A dropped connection mid-checkout must not cost them their cart.
- **Confirm nothing routine, confirm everything destructive.** No "are you sure you want to add to cart." Yes to "remove this item?" with an **Undo** toast (undo beats confirm — one fewer decision).
- **One decision per screen** in checkout. Do not put address, payment, and review on one long scroll.
- **A phone escape hatch on every single screen.** A persistent, small, always-present `Call · Text` affordance. When the interface fails them, a human doesn't.
- **Big, unambiguous success states.** The confirmation screen should be readable across a hotel room.

---

## 5. The Stock Problem

### 5.1 Frame it correctly

The client will not have clean inventory data. Square POS on a catalog with thousands of e-liquid flavors, high shrink, manual receiving, 24-hour operation across three shifts — inventory counts will drift, and any design that assumes a trustworthy boolean `in_stock` will systematically lie to customers.

**So: stop modeling stock as a boolean. Model it as a confidence claim with provenance, and design the honest fallback as a first-class state rather than an error.** The goal is not accurate inventory. The goal is that **the customer's expectation always matches reality**, which is achievable even with bad data — by being explicit about what you know and how recently you knew it.

### 5.2 Five confidence tiers

| Tier | Badge (customer-facing) | Trigger logic | Action offered |
|---|---|---|---|
| **A — Verified** | `✓ On the shelf · counted 22 min ago` | POS qty > 0 AND counted within the SKU's confidence window AND no sale since count | Hold it / Order it |
| **B — Expected** | `Usually in stock` | POS qty > 0 but count is stale relative to velocity | Hold it (we'll confirm in 5 min) |
| **C — Low** | `Only 1–2 left · we'll confirm` | POS qty ≤ 2, or high-velocity SKU with a stale count | Hold it / Text to confirm |
| **D — Unknown** | `Not sure — we'll check for you` | No reliable data, new SKU, or known-bad category | **Text us — we answer in minutes, 24/7** |
| **E — Out** | `Out right now` + restock estimate | POS qty = 0 or staff-flagged | Notify me + alternates rail |

**The confidence window is velocity-adjusted, not fixed.** A SKU selling 8 units/day goes stale in ~3 hours; one selling 1 unit/week stays fresh for a week. Formula, roughly: `window_hours = clamp(24 / max(daily_velocity, 0.2), 1, 168)`. Cheap to compute from Square transaction history, and it's the difference between a badge that means something and one that doesn't.

**Provenance is always visible.** "Counted 22 minutes ago" is the mechanism that makes tier A credible and makes tier B honest. Amazon-style silent booleans are not available to you — you don't have the data quality to back them, so don't pretend.

### 5.3 The human-in-the-loop layer (the actual solution)

**You are staffed 24 hours a day. That is an inventory system.** Nobody else in this category can do this.

**"Check for me" button**, present on tiers B, C, and D:
1. Customer taps → phone number field → submit. That's it.
2. A task lands on the staff tablet behind the counter: product image, SKU, shelf location, two buttons — `✓ Got it` / `✗ Out`.
3. Staff answers. Median target: **under 4 minutes.** Hard SLA: 10 minutes, after which it auto-escalates to a manager alert.
4. Customer gets an SMS: *"Yes — we've got 3 RAZ Blue Razz Ice. Want me to hold one? Reply HOLD."*
5. **The answer writes back to the stock record**, tightening confidence for every subsequent visitor. Customer demand becomes your cycle-count signal.

This is the highest-leverage mechanism in the entire document. It costs almost nothing, it works with garbage inventory data, it converts uncertainty into a conversation, and it's a differentiator no chain can replicate.

**Demand-driven cycle counting.** The site tells staff what to count. Every shift, the tablet shows a queue of ~20 SKUs ranked by `pageviews_since_last_count × velocity × confidence_staleness`. Counting the top 20 per shift keeps the SKUs that customers actually look at in tier A, and lets the long tail sit in tier B without harm. Full-catalog accuracy is not the goal; **accuracy where attention is** is the goal.

**Hold / reserve as the conversion of uncertainty into a promise.** A hold isn't an inventory decrement — it's a human pulling the item and putting it behind the counter with a code. That converts "probably in stock" into "definitely yours." Free, 60 minutes, phone number only.

### 5.4 The honest fallback design

**Tier D — "we don't know" — must be designed as beautifully as "in stock."** The instinct is to hide it. Resist.

```
┌────────────────────────────────────────────┐
│  We're not sure this one's on the shelf    │
│  right now                                 │
│                                            │
│  Our count on this is a few days old and   │
│  it moves fast. Rather than guess, let us  │
│  actually go look.                         │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │   Check for me — usually < 5 min     │  │
│  └──────────────────────────────────────┘  │
│           Or call us: (702) 613-7799       │
└────────────────────────────────────────────┘

These are definitely on the shelf right now:
[ Similar flavor, same brand ] [ Same flavor, other brand ] [ ... ]
```

Why this works: it is a **competence signal, not a weakness signal.** "We'd rather check than guess" reads as integrity. A store that says "in stock" about everything and is wrong 15% of the time is far more damaging than one that says "let me look" and is right 100% of the time.

**Out-of-stock (tier E) never dead-ends.** The OOS PDP shows: restock estimate if known, `Notify me` (phone, one field), and — most importantly — an **alternates rail ranked by attribute adjacency**: same flavor family + same nicotine strength first, then same brand, then same device type. For cigars: same wrapper ± one strength step, ring gauge ± 4. Never "you might also like" collaborative-filtering slop.

### 5.5 The trust ledger (what happens when you're wrong)

You will be wrong. Design the apology into the system:

- **Hold fails** → automatic SMS within 5 minutes of the pull attempt, *before they walk over*, plus a $5 store credit issued automatically with no request. Cost of a failed hold: $5. Cost of a tourist who walked 8 minutes for nothing: a 1-star review that sits on your Google profile for years.
- **Delivery substitution rejected** → line refunded instantly, no argument, driver instructed never to negotiate.
- **Publish the number.** On `/fair-price`: *"Last 30 days: 1,247 holds placed, 1,231 were on the shelf. 98.7%."* A published accuracy rate that isn't 100% is more credible than any badge. This is the same move Domino's made with the pizza tracker and Buffer made with public metrics — verifiable imperfection outperforms unverifiable perfection.

---

## 6. Trust & Price Transparency

Strip smoke shops have a genuine, earned reputation for gouging tourists: no prices displayed, prices quoted verbally and varying by customer, $60 disposables, aggressive upsell. The entire opportunity is to be **visibly, verifiably, boringly fair** — and to make that legible in the first 5 seconds.

### 6.1 The Strip Fair Price Promise

Four commitments, stated in four lines on a badge that appears on every PDP, in the cart, and on `/fair-price`:

> **1. Same price in store, online, and delivered.** No tourist pricing.
> **2. Every price is on the website.** No "ask us." No "call for price."
> **3. The number you see in the cart is the number you pay.** Tax and delivery included before you commit.
> **4. Beat our price anywhere in Vegas? We'll match it.**

Each line links to a page that proves it. A promise without a proof mechanism is marketing.

### 6.2 Concrete mechanisms

**Prices, everywhere, always.**
- Price on every PLP row, every search result, every cross-sell tile. No exceptions.
- **"Call for price" is banned from the entire system.** If a SKU has no price, it doesn't publish.
- **`/prices` — a public, crawlable, plain-HTML price list** of the top ~150 SKUs, timestamped, sortable, with a "last updated" date. Radical, and radically effective: it is the single most convincing anti-gouging artifact possible, it's a link magnet, it ranks for `[product] price las vegas` queries, and it makes the store legible to a skeptical tourist in one screen. Publish it. Competitors will hate it. That's the point.

**All-in pricing, disclosed early.**
- The cart shows `Subtotal / Delivery / Tax / Total` fully computed **before** checkout begins.
- On delivery PDPs, show a secondary "all-in" line: `$24.99 · about $31.40 delivered, all in`.
- **No fee invented after the total is shown.** No "service fee," no "small order fee" that appears at step 4, no card surcharge revealed at payment. If any fee exists, it exists in the cart.
- **Tipping: opt-in, default zero, no preset guilt ladder.** A single line: `Add a tip for your driver (optional)` with `$0 / $3 / $5 / Other` and **$0 pre-selected and not styled as the shameful option.** The dark-pattern tip screen is the fastest way to become the thing you're differentiating against. Pay drivers properly and let tips be a genuine bonus.

**Price integrity signals.**
- **Compare-at prices only when literally true**, with the source named (`MSRP $34.99 — manufacturer's list`). No permanent fake strikethrough. If everything is on sale, nothing is.
- **Price history on high-value SKUs:** `This price for 47 days.` Kills the "was it just marked up?" suspicion.
- **Price match:** a form with three fields (product, where you saw it, price) and a stated turnaround. Published policy including the exclusions — an honest policy with exclusions beats a vague one without.

**Authenticity — the second trust axis.**
Counterfeit disposables are rampant and tourists know it.
- `/authentic` page: the authorized-dealer list, photos of what counterfeits look like, and the scan-to-verify process for brands that support it.
- On PDPs of brands with verification codes: `✓ Scan-to-verify code on every unit`.
- **A public "we don't sell" list.** Naming what you refuse to stock is a stronger signal than listing what you do.

**Proof of realness.**
- **Photographs of the actual storefront**, from the actual approach, in daylight and at night. Tourists are pattern-matching against scam risk; a real photo of the real door does more than any badge.
- **Named staff with real photos** on `/about` and attached to cigar staff-picks. A named human who signed a recommendation is accountable.
- **Reviews unfiltered and recency-sorted, including the bad ones**, with owner responses visible. A 4.6 with visible 2-star reviews and thoughtful replies converts better than a suspicious 5.0. Link out to the Google profile so it's independently verifiable — the outbound link *is* the trust signal.
- **Years in business, license number, and physical address in the footer of every page.**

**Receipt & post-purchase clarity.**
- Itemized digital receipt by SMS immediately on delivery/pickup, matching the quoted total to the cent.
- **Cash-specific:** the confirmation and the tracking page both state `Driver carries change for up to $100.` This one sentence removes the biggest friction in the cash flow.
- A plain-language return policy at the top of `/returns`, in one sentence, before the legal text. Most people only read the first sentence — make it the answer.

**Anti-pattern list — things this site will never do:**
Countdown timers · "3 people are viewing this" · fake low-stock urgency · pre-checked add-ons · newsletter modal on entry · hidden fees · subscription auto-enrollment · "only 2 left" when 40 are on the shelf · price varying by device or geography.

---

## 7. Conversion Instrumentation

### 7.1 Top 10 events

| # | Event | Key properties | Why it's in the top 10 |
|---|---|---|---|
| 1 | `age_affirmed` | `tier` (0/1/2), `surface`, `outcome` (yes/no), `ts`, `ip_hash`, `ua` | Dual-purpose: measures gate friction *and* is the legal audit record. The `no` rate and the drop-off between sheet-shown and affirmed is your gate cost. |
| 2 | `store_intent` | `type` (directions_tap / call_tap / hours_view / reserve_start), `hour_of_day`, `entry_source` | The walk-in funnel has no on-site conversion, so these are the only proxy. `directions_tap` is effectively the walk-in "add to cart." |
| 3 | `search_performed` | `query`, `results_count`, `zero_result` (bool), `department`, `clicked_position` | Zero-result queries are a direct, ranked list of catalog and synonym gaps. Highest-value diagnostic on the site. |
| 4 | `product_viewed` | `sku`, `department`, `price`, `stock_tier` (A–E), `stock_age_min`, `context` (walkin/delivery/browse) | Baseline, but the `stock_tier` property is what makes it useful — it lets you measure conversion by confidence tier. |
| 5 | `stock_check_requested` → `stock_check_answered` | `sku`, `response_latency_sec`, `answer` (in/out), `converted` (bool) | Measures the human-in-the-loop layer: is it fast enough, and does it convert? If latency p90 > 10 min, the mechanism is broken. |
| 6 | `reserve_created` → `reserve_fulfilled` / `reserve_expired` / `reserve_failed_oos` | `sku`, `hold_to_pickup_min`, `outcome` | This is the walk-in conversion event and the stock-truth measurement in one. |
| 7 | `delivery_location_resolved` | `hotel_id`, `tower`, `in_zone` (bool), `quoted_eta_min`, `quoted_fee`, `method` (typeahead/geo/manual) | The highest-abandonment screen in flow B. Per-hotel drop-off exposes bad hotel data. Out-of-zone volume tells you where to expand. |
| 8 | `add_to_cart` / `cart_viewed` | `sku`, `stock_tier`, `substitution_pref`, `cart_value`, `fulfillment` (delivery/pickup) | Standard, plus `substitution_pref` distribution which drives ops policy. |
| 9 | `checkout_step_completed` | `step` (contact/address/payment/review), `payment_method` (cash/card/wallet), `time_on_step_sec`, `errors[]` | Step-level abandonment + the cash-vs-card split, which is a genuinely unknown and business-critical number. |
| 10 | `order_delivered` | `order_id`, `quoted_eta`, `actual_delivery_ts`, `eta_delta_min`, `id_check_result`, `substitutions[]`, `driver_id` | Closes the loop on the promise. `eta_delta_min` is the trust metric. `id_check_result` is the compliance record. |

**Supporting events (tracked, not top-10):** `oos_encountered`, `alternate_clicked`, `filter_applied` (facet, value — this is how you validate the §1 taxonomy: if nobody uses a facet, kill it; if wrapper is the top cigar facet, promote it), `compare_added`, `text_us_tapped`, `captive_portal_hint_shown`, `js_bundle_failed`, `price_page_viewed`, `notify_me_submitted`.

**Instrumentation notes:**
- Every event carries `hour_of_day` in Pacific and an `intent_segment` (walkin / delivery / browse / cigar), derived at session start from entry source, geo, and referrer. **Almost every analysis on this site is a segment split**, and doing it at collection time saves enormous pain.
- Server-side event collection for anything conversion-critical. Ad blockers and captive portals eat client-side beacons, and your traffic skews toward exactly the conditions where they fail.
- Offline delivery outcomes (`order_delivered`, `reserve_fulfilled`) come from the driver/staff tablet, not the browser. Wire that in or half the funnel is invisible.

### 7.2 The 5 KPIs that matter

**1. Revenue per session, split by intent segment.**
Not conversion rate. Conversion rate is meaningless here because a walk-in "conversion" happens offline and a delivery conversion is 4× the AOV. Track `RPS` for walkin / delivery / cigar / browse separately. Walk-in RPS requires attribution via reserve codes and a "did you find us online?" prompt at the register — imperfect, worth doing.

**2. Promise accuracy.**
A composite of two numbers, reported weekly:
- **ETA accuracy:** `% of deliveries arriving within the quoted window`, plus p50 and p90 of `eta_delta_min`. Target: 90% within window, p90 delta ≤ +10 min.
- **Hold accuracy:** `reserve_fulfilled / (reserve_fulfilled + reserve_failed_oos)`. Target ≥ 97%.

This is the KPI that determines whether the whole differentiation strategy is real. A 24/7 delivery shop that misses its ETA is just a slow shop.

**3. Stock truth rate.**
`% of "tier A / in stock" claims that were correct at the moment of fulfillment`, measured from reserve and delivery outcomes. Target ≥ 96%. When this drops, tighten confidence windows and increase cycle-count volume. **This is the leading indicator for review scores** — nearly every bad review in this category traces back to a broken stock promise.

**4. 2am performance index.**
Revenue, order count, and conversion rate in the **10pm–6am window**, indexed against the 10am–6pm window. This window is the entire strategic bet. If overnight isn't growing faster than daytime, the positioning isn't landing. Watch the overnight-specific funnel separately — the user is different and the drop-off points are different.

**5. Mobile checkout completion on constrained connections.**
`checkout_step_completed(review) → order_completed` on mobile, segmented by `effectiveType`. Paired with **LCP p75 on Slow 4G**. Target: ≥ 70% completion on mobile, LCP < 2.0s. This is the KPI that keeps the engineering budget honest — it ties §4's performance rules directly to money, so nobody argues about the JS budget.

**Watch-list metrics (not KPIs, but on the dashboard):** zero-result search rate (target < 6%), OOS encounter rate, age-gate no-rate, `stock_check` p90 latency, cash-vs-card mix, repeat-order rate at 30/90 days (the local flywheel), and Google review velocity + average.

---

## 8. Twenty Micro-UX Details

1. **Time-aware homepage.** After 10pm Pacific, the site switches to a dark, low-luminance theme and the hero flips from "Visit us on the Strip" to **"Open right now · delivery in ~30 min."** Computed server-side from Pacific time — never from the device clock, which lies for travelers who haven't changed timezones.

2. **Walking minutes, never driving minutes, never miles.** "6 min walk from the Bellagio fountains." Distance in miles is meaningless to a pedestrian on the Strip; a Strip block can be a 12-minute walk.

3. **Landmark-first addressing.** Every address instance reads "Grand Bazaar Shops, next to Ole Red" *before* the street number. Nobody navigates the Strip by address.

4. **Flavor color swatches.** Every vape flavor carries a hand-assigned color chip from a controlled palette (blue razz = deep blue/purple gradient, mango = orange, mint = pale green). Scanning 60 flavors by color is 5× faster than reading 60 names — and it's the only way a dense flavor grid is usable. **Careful:** keep the palette muted and adult, never candy-bright, to stay clear of youth-appeal concerns.

5. **Nicotine strength as a segmented control.** `0 · 3 · 6 · 20 · 50mg` as five tappable pills, always visible on vape PLPs. Not a dropdown, not buried in a filter sheet. It's the second-most-used filter after flavor and it deserves permanent screen space.

6. **Human units for puff count.** Under `9000 puffs`, a secondary line: `about 5–7 days for a pack-a-day smoker`. Puff counts are marketing numbers nobody can convert into meaning. Do the conversion for them.

7. **`tel:` links dial immediately.** No "are you sure you want to call?" confirmation dialog, no intermediate contact page. One tap, phone rings. The phone number appears in the initial HTML of every page so it survives total JS failure.

8. **Pre-filled nearest hotel with one-tap confirm.** `We think you're at Planet Hollywood — right? [Yes] [Somewhere else]`. Typing an address one-handed at 2am is the highest-friction act in the delivery flow; reduce it to one tap for the common case. Never auto-commit from IP geolocation (§4.5).

9. **Room number accepts anything.** `inputmode="numeric"` for the keyboard, but validation is length 1–10 and nothing else. `29-114`, `PH4`, `Villa 7`, `61012` are all real Vegas room formats. Rejecting valid input is worse than accepting garbage.

10. **Login-free order tracking via SMS magic link.** No account, no password, no email. The link expires in 24 hours. Assume the browser tab is gone the moment they hit confirm — **the SMS is the durable artifact.**

11. **"Text us a photo of what you want."** A prominent SMS/WhatsApp path with an explicit invitation to send a photo of an empty device or a shelf tag. For an intoxicated user, a non-English speaker, or someone who doesn't know the product name, this is the *only* path that works. It's a real conversion channel in this category and almost nobody builds it deliberately.

12. **Hand-curated search synonyms, not just fuzzy matching.** `elfbar / elf bar / elf / ELFBAR`, `geekbar / geek bar`, `raz / RAZ / razz`, `blue razz / blue raspberry / blueraspberry`, `nic / nicotine`, `zyn / pouches`, `disposable / disposeable / dispo / vape pen`. Fuzzy matching alone fails on brand names because the edit distances are small and collide. Seed the list from `zero_result` queries weekly — the search log writes its own synonym file.

13. **Zero-result search never dead-ends.** `We probably have it — we just might call it something else.` Then: `[Text us a photo]`, the three closest category guesses, and `Call (702) 613-7799`. A blank results page is a lost customer; a blank results page with a text link is a conversation.

14. **Recently-viewed persists 30 days on-device**, surfaced on the homepage. The 2am user who closed the tab, got distracted, and came back an hour later resumes exactly where they were.

15. **Cart restoration with a timestamp.** `You left this at 1:47am — still want it?` with `[Yes, keep it]` / `[Start over]`. Naming the time makes the restoration feel like a service rather than a surveillance artifact.

16. **Cigar photography with a scale reference.** Every cigar shot against a consistent subtly-ruled backdrop. Ring gauge (52, 60, 64) is an abstraction that even experienced buyers can't visualize reliably; a photo with scale is instant. Do the same for glass — a 14" bong and a 7" bubbler look identical on a phone without a reference.

17. **Persistent cigar comparison tray**, docked at the bottom, surviving navigation, max 3 on mobile. The comparison table auto-collapses rows where all values are identical, showing only what differs. Without that collapse, a spec comparison on a 390px screen is unusable.

18. **"Singles" as a top-level cigar destination**, not a filter value. Tourists don't buy boxes. Burying the single most important format distinction inside a facet drawer is the difference between a cigar page that works and one that doesn't.

19. **All-in price as a secondary line on every delivery PDP.** `$24.99 · about $31.40 delivered, all in`. Tax and delivery fee stated at the moment of interest rather than at the moment of commitment. Costs a conversion point at the PDP, buys back three at checkout, and buys the trust position outright.

20. **Shelf-edge QR codes → "you're standing right here" mode.** Every shelf tag in the store carries a QR to the PDP with a `?ctx=shelf` param. That mode strips the nav entirely and shows: big price, stock, reviews, specs, and one button — `Ask a staff member about this` (which pings the counter tablet with the SKU and the aisle). It turns the site into in-store signage, converts the physical store into a traffic source for the digital one, and — critically — **works on cellular when the store wifi is congested.**

**Five more, because they're cheap and they matter:**

21. **Language toggle, visible, never automatic.** ES, PT, JA, KO, ZH given Strip tourism demographics. A visible toggle in the footer and header. Auto-redirect by IP or `Accept-Language` is always wrong for travelers.

22. **The confirmation ETA is the largest text on the page** — 48px+, readable across a hotel room, because the phone is going face-up on the nightstand.

23. **No carousels anywhere on the site.** Not on the homepage, not on the PDP gallery (use a swipeable strip with visible dot indicators and a count, `2/6`). Auto-rotating carousels have near-zero engagement past slide 1 and they cost CLS and JS weight you can't afford.

24. **Undo instead of confirm.** Removing a cart item happens immediately with a 6-second `Removed · Undo` toast. One fewer decision for an impaired user, and reversible.

25. **The humidor hygrometer reading, published.** `Humidor: 70°F / 69% RH · checked 6:00am` on `/cigars` and every cigar PDP. It's two numbers. It answers the only real objection to buying cigars from a shop that also sells disposables, and no competitor on the Strip does it.

---

## Appendix: Build sequencing (if you only get three sprints)

**Sprint 1 — the dispatcher.** Domain migration to `puffvegas.us`, server-rendered store page with hours/directions/call, the banner age gate, universal search, PDPs with prices and confidence badges, `tel:`/`sms:` everywhere, `/prices`, `/store/directions`. No cart yet. **This alone beats the current Square site.**

**Sprint 2 — delivery.** Hotel picker + per-hotel policy pages, delivery cart/checkout with cash on delivery, SMS tracking, driver tablet, substitution preferences.

**Sprint 3 — depth.** Cigar department with the full facet schema and comparison, hold/reserve, the human-in-the-loop stock check, cycle-count queue, glass gallery PLPs.

**The two things that must not slip out of scope:** the per-hotel meet-point content, and the human-in-the-loop stock check. They are the two mechanisms that cannot be copied and that fix the two failure modes that generate every bad review in this category.agentId: a1c592b7211210c25 (use SendMessage with to: 'a1c592b7211210c25', summary: '<5-10 word recap>' to continue this agent)
<usage>subagent_tokens: 69300
tool_uses: 1
duration_ms: 540054</usage>