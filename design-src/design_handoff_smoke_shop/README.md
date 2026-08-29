# Handoff: Puff Vegas — "Marquee Neon" website

## Overview
Puff Vegas is a 24-hour smoke/vape shop at 3535 S Las Vegas Blvd (center Strip). The site has two jobs and **no e-commerce checkout**:

1. Show what is on the shelf right now, accurately.
2. Start a **hotel delivery** — $20 flat to any Strip hotel, no minimum, payment collected by the runner at the door.

The shop does **not ship**. Delivery is local (Clark County) only, by the shop's own runners.

Chosen design direction: **Marquee Neon** — midnight ground, neon magenta/cyan signage, gold marquee-bulb dividers, condensed display type. Mobile-first (most traffic is phones).

## About the design files
The files in this bundle are **design references created in HTML** — prototypes of the intended look and behavior, not production code to copy. The task is to **recreate these designs in the target codebase's environment** (Next.js/React recommended if starting fresh) using its established patterns and libraries. Do not lift the prototype markup wholesale: it is a single-file streaming design document with inline styles, drawn inside fake phone bezels.

Every screen is rendered at **390 px content width** inside a 410 px bezel. Build the real thing as a responsive mobile-first layout; 390 px is the reference width, not a fixed one.

## Fidelity
**High-fidelity.** Colors, type, spacing, copy, and states are final-intent. Recreate pixel-close using the codebase's component library. Photography is represented by flat placeholder blocks labeled "Photo" — real product/store photography must be supplied by the client.

## Design tokens

### Color
| Token | Hex | Use |
|---|---|---|
| `bg` | #0A0714 | Page ground |
| `bg-alt` | #0E0619 | Bottom nav, filter bar |
| `surface` | #12091F | Cards, panels, inputs, bulb-strip ground |
| `border` | #2A1B3D | Card borders, dividers |
| `border-strong` | #3A2A52 | Interactive outlines (unselected chips, secondary buttons) |
| `hairline` | #1E1330 | List row separators |
| `text` | #F7F0FF | Primary text |
| `text-status` | #F3EAFB | Status bar |
| `text-muted` | #C6B6DC | Secondary body |
| `text-dim` | #9C8CB8 | Fine print / legal (min contrast-safe value — do not go dimmer for body copy) |
| `text-faint` | #8C7BA6 | Meta, counts |
| `text-disabled` | #6E5F85 | Out-of-stock, future steps |
| `magenta` | #FF2E88 | Primary CTA, active state, "one left" |
| `magenta-tint` | rgba(255,46,136,0.12) | Selected chip fill |
| `magenta-text` | #FFB3D3 / #FF9AC4 | Text on magenta tint |
| `cyan` | #24E0FF | Section labels, selected outlines, links |
| `cyan-text` | #CFF6FF | Text on cyan tint |
| `gold` | #FFC84A | Prices, marquee bulbs, hours, deal headlines |
| `green` | #7FF0C0 | In-stock / completed step |
| Photo placeholder grounds | #1A0E2B (purple), #0E1B2B (blue), #22150E (amber), #1F1524 (mauve) | Rotate per card |

### Typography
- **Display / UI caps:** `Bebas Neue` — 400 only. Sizes used: 74 (tracking ETA), 62 (hero), 46, 42, 40, 38, 34, 30, 26, 24, 22, 21, 20, 19, 18, 17, 15, 14, 13. Letter-spacing 0.06em–0.24em depending on size (tighter as size grows). Line-height 0.88–1.0.
- **Neon script (logo "Puff" only):** `Yellowtail` — 30 px in header, 46 px on age gate.
- **Body:** `Instrument Sans` — 11/12/13/14/15/16 px, weights 400/600/700, line-height 1.45–1.6.
- Never set body copy below 11 px; never set legal copy dimmer than #9C8CB8.

### Neon glow recipes
- Magenta logo text: `text-shadow: 0 0 10px rgba(255,46,136,.85), 0 0 26px rgba(255,46,136,.45)` (14/34 px on the age gate).
- Cyan logo text: `text-shadow: 0 0 10px rgba(36,224,255,.7), 0 0 26px rgba(36,224,255,.35)`.
- Primary CTA: `background:#FF2E88; color:#12061A; box-shadow: 0 0 22–26px rgba(255,46,136,.45)`.
- Live/urgent panel: `border:1px solid #FF2E88; background:rgba(255,46,136,.08); box-shadow:0 0 24px rgba(255,46,136,.18)`.

### Marquee bulb strip (signature element — reuse everywhere as a section divider)
```css
height: 12px;
background: #12091F;
border-top: 1px solid #2A1B3D;
border-bottom: 1px solid #2A1B3D;
background-image: radial-gradient(circle at 6px 6px, #FFC84A 2.2px, rgba(255,200,74,.18) 3.2px, transparent 3.6px);
background-size: 14px 12px;
```
Optional enhancement not in the mock: a slow bulb-chase animation (translate background-position by 14 px over ~1.2 s, steps) — Fremont-style. Respect `prefers-reduced-motion`.

### Spacing / radii
- Page gutter: 20 px. Card padding: 12–20 px. Vertical section rhythm: 20–24 px.
- Radii: 8 (thumbnails/inputs-small), 10–12 (buttons, chips-square), 14–16 (cards, panels), 999 (chips, pills).
- Grid: 2-up product grid, `gap: 12–14px`. Horizontal rails: `display:flex; gap:12px; overflow-x:auto` with the third card intentionally bleeding off-screen as a scroll affordance.
- Touch targets: never below 44 px.

## Screens

All screens live in the bundled prototype `Smoke Shop Homepage.dc.html`, identified by the badge ids below (open the file and search for `id="3a"` etc.).

### 3a — Home
Purpose: prove the store is open, offer delivery, get into the catalog.
Order: status bar → header (Yellowtail "Puff" magenta + Bebas "VEGAS" cyan, SEARCH pill, hamburger) → **bulb strip** → eyebrow "OPEN 24 HOURS · CENTER STRIP" (gold, 15px/0.22em) → hero "IT'S 4 AM. / WE'RE OPEN." (Bebas 62/0.88) → sub copy → two CTAs (magenta "DELIVER TO MY ROOM" flex 1.3, outlined "BROWSE" flex 1) → **hotel picker panel** ("WHERE ARE YOU STAYING?" + hotel chips, Aria selected, "+ 38 more", ETA/fee line) → "THE FLOOR" 2×2 category grid with "ALL 9 →" → bulb strip → "MOVING TONIGHT" horizontal rail (updated-N-min-ago) → footer (gold "NEVER CLOSED · 3535 S LAS VEGAS BLVD" + legal) → bottom nav FLOOR / BRANDS / DELIVERY / VISIT.

### 3b — Delivery sheet
Purpose: build and send a delivery order. No cart page, no card entry.
Order: sheet header (back / "HOTEL DELIVERY" / close) → bulb strip → live runner ETA panel (magenta glow, "28–35 MIN TO ARIA", "$20 flat · no minimum · cash or card at the door") → step 1 hotel row (selected + "change") → step 2 meet-point segmented (Room door / Valet / Rideshare) + Tower + Room fields → step 3 line items with − / + steppers → totals (Products, Strip hotel delivery $20, **DUE AT THE DOOR** in gold) → magenta "SEND THE RUNNER" → ID fine print.
Math must be live: items + flat $20. Example: $24.99×2 + $3.49×2 + $20 = $76.96.

### 4a — Age gate
Purpose: legal gate before any content. Centered logo lockup, gold eyebrow, bulb strip, "MUST BE 21 OR OLDER", MM / DD / YYYY inputs, magenta ENTER, legal fine print. Persist a pass for 30 days (see State).

### 4b — Category listing
Purpose: browse one department. Header (back / department name / SEARCH) → bulb strip → sticky filter bar (Filters · N in magenta, then In stock now / Price ↑ / 25K+ puffs) → result count + "updated N min ago" → 2-up product grid: photo, brand eyebrow (uppercase, faint), product name, gold price + stock note (cyan "14 flavors" / magenta "2 left"), outlined magenta "Add to delivery" → "LOAD 24 MORE" → bottom nav.

### 4c — Filter sheet
Purpose: narrow the catalog on the axes that matter here. Sections: BRAND (chips + "+22"), NICOTINE (0% / 2% / 5% / Any), PUFF COUNT (dual-handle range, cyan track, glowing handles, "15,000 – 30,000 puffs"), FLAVOR PROFILE (Fruit / Ice / Dessert / Tobacco), toggle "Only what's on the shelf" (magenta, on), magenta "SHOW 41 RESULTS". Header has "Clear all" in cyan.

### 4d — Product page
Purpose: decide on one item. Breadcrumb header + ♡ → 300 px photo card with 4-dot pager (magenta active is a 22 px bar) → brand eyebrow (cyan) → name (Bebas 40) → gold price + struck comparison price → green dot "On the shelf now · 34 units" → FLAVOR chips with per-flavor stock (out-of-stock flavor is struck through, #6E5F85) → spec table (Puffs / Nicotine / E-liquid / Charging) → "DELIVERY TO ARIA" panel with ETA + fee → magenta "ADD TO DELIVERY" (flex 1.4) + outlined "HOLD IT" (flex 1, = reserve at counter) → legal.

### 4e — Search
Purpose: find a named product fast. Focused cyan-bordered input with caret + Cancel → bulb strip → PRODUCTS result rows (52 px thumb, name, stock line in green/magenta/dim, gold price; out-of-stock shows "Out — restock Thursday") → "SEARCHED A LOT TONIGHT" chips → "Can't find it? Text the shop" line.

### 4f — Brands
Purpose: brand-loyal browsing. Filter chips (All 64 / Vape / Glass / Hemp / Cigars) → A–Z sections with gold letter headers, rows = brand name + count (cyan count when the brand is deep) → right-edge 30 px letter jump rail, available letters cyan → "we order twice a week" note.

### 4g — Delivery, explained
Purpose: answer every delivery question without a phone call. Hero "$20 FLAT. / NO MINIMUM. / ANY HOUR." → sub copy → two stat cards (25–40 minutes typical, 43 Strip hotels served) → HOW IT WORKS 1/2/3 (magenta numerals) → HOTELS WE RUN TO chips + "+35 more" → magenta "START A DELIVERY" → no-shipping legal.

### 4h — Order tracking
Purpose: the 30-minute wait. Order number header → bulb strip → centered gold "ARRIVING" + Bebas 74 "4:52 AM" with cyan glow + hotel/tower/room → 4-step status list (green done dots, glowing magenta current, hollow future) → runner card (initial avatar, name, tenure, cyan "Text" button) → order totals repeat → "cancel free until the runner leaves" fine print.

### 4i — Visit us
Purpose: the walk-in half. Dark-theme map band (210 px) → green pulse "OPEN NOW — AND ALWAYS" → Bebas 38 address → parking/access copy → gold DIRECTIONS + outlined CALL → HOURS card "24 HOURS · 7 DAYS" → WHAT'S INSIDE rows (walk-in humidor, glass gallery, testing bar) → legal.

### 4j — Deals
Purpose: move inventory at 3 AM. Feature panel "GRAVEYARD SHIFT 15% OFF", 2 AM–6 AM only, with a live countdown ("3 h 54 m left tonight") → three deal rows (photo left 112 px, gold deal headline, name, condition) → TEXT LIST signup (phone input + gold JOIN).

### 4k — Legal & compliance
Purpose: protect the license. Boxed FDA-style nicotine warning (2 px white border, Bebas caps) → sections 21+ ONLY / WE DO NOT SHIP / LAB REPORTS (+ "Browse COAs by batch") / NEVADA COMPLIANCE / RETURNS → gold address footer + keep-out-of-reach note.

## Interactions & behavior
- **Age gate** blocks all routes. On valid DOB (21+ at today's date) set a 30-day cookie/localStorage flag and continue to the intended route. Invalid → inline error, no navigation. Under 21 → dead end, no retry loop.
- **Hotel context is global.** Once a hotel is chosen (home picker, delivery sheet, or delivery page) it persists and is echoed on the product page ("DELIVERY TO ARIA") and in ETA copy everywhere.
- **Add to delivery** appends to the delivery draft and shows a toast/badge; it does not navigate. **HOLD IT** creates a 4-hour counter hold instead (name + phone, no payment).
- **SEND THE RUNNER** requires hotel + room + at least one item. It creates an order, then routes to 4h. No payment fields anywhere — payment happens at the door.
- **Stock is the product.** Every listing/search row shows one of: in stock (green), low ("2 left", magenta), out (dim + restock date). Out-of-stock items are filterable out and never quick-addable.
- **Countdowns** on 4j tick client-side; the graveyard deal auto-hides outside 2–6 AM local Vegas time.
- Chips are toggles; the selected state is border + 12% tint + brighter text (never fill-only).
- Rails scroll horizontally with the next card intentionally bleeding — keep it.
- Transitions: 150–200 ms ease-out on chip/button state; sheets slide up 250 ms; glow is static (no pulsing) except the current tracking step, which may breathe at 2 s. Honor `prefers-reduced-motion`.
- Hover (desktop): brighten border `#3A2A52 → #4E3A6B`, lift text one step. Focus: 2 px cyan ring, never removed.

## State
- `ageVerified` (bool + expiry, device-local, 30 days)
- `hotel` { id, name, tower?, room?, meetPoint: 'door'|'valet'|'rideshare' }
- `deliveryDraft` [{ productId, variant (flavor), qty, unitPrice }] + derived subtotal, flat `DELIVERY_FEE = 2000` cents, total
- `catalogFilters` { brands[], nicotine, puffRange[min,max], flavorProfiles[], inStockOnly }
- `order` { id, status: received|packed|en_route|delivered, etaAt, runner { name, tenure } } — poll or subscribe for status/ETA
- Product data needs per-variant stock counts and a `lastStockSyncAt` (the "updated 12 min ago" line). If the shop has a POS, the inventory feed is the integration that makes this site worth building.

## Assets
- Fonts: Google Fonts — Bebas Neue (400), Yellowtail (400), Instrument Sans (400–700). Self-host in production.
- No icons are used except text glyphs (←, ✕, ♡, ☰) — replace with a real icon set (Lucide/Phosphor) at the same optical size.
- All imagery is placeholder. Needed from the client: 4 product shots per SKU on a dark ground, storefront/sign at night, glass gallery, humidor interior, and a dark-theme map tile of the Strip corridor.
- The marquee bulb strip and all neon are pure CSS — no image assets required.


## Day mode (light theme)

Day mode is **not** "the neon palette on white". The conceit: at 2 PM the sign is unlit — neon tubes read as solid pigment with no glow, marquee bulbs are dark ivory with a rim, and the ground is sun-bleached paper. Follow `prefers-color-scheme`, with a manual Night/Day switch in the footer that persists.

| Token | Night | Day |
|---|---|---|
| bg | #0A0714 | #F7F2E8 |
| bg-alt (utility bar) | #0E0619 | #17111F *(stays dark — the top bar is the "sign" band)* |
| surface | #12091F | #FFFFFF |
| border | #2A1B3D | #E2D8C6 |
| border-strong | #3A2A52 | #D9CEB9 |
| text | #F7F0FF | #17111F |
| text-muted | #C6B6DC | #574A63 |
| text-dim (legal) | #9C8CB8 | #6E6178 |
| text-faint | #8C7BA6 | #6E6178 *(day has no separate faint tier — #8B7F96 fails AA on white)* |
| magenta (CTA) | #FF2E88 on #12061A text | #D6156B on #FFFFFF text |
| magenta text-on-tint | #FFB3D3 | #B01158 |
| cyan (labels/selected) | #24E0FF | #0E7C99 (text on tint #0A5E75) |
| gold (prices/hours) | #FFC84A | #8A5D06 *(#A8730B is only AA-safe at ≥24px — use the darker gold everywhere)* |
| green (in stock) | #7FF0C0 | #0E7A55 |
| Photo placeholder grounds | #1A0E2B / #0E1B2B / #22150E / #1F1524 / #101F1A | #EDE4D3 / #E4EAEC / #EFE6D0 / #EDE3E1 / #E4EAE2 |

Rules for day mode:
- **Kill every glow.** No `text-shadow` on the logo, no `box-shadow` on CTAs. Neon returns only inside dark panels.
- **Unlit bulb strip:** `background:#F0E7D4; border-top/bottom:1px solid #D9CEB9; background-image: radial-gradient(circle at 7px 7px, #E4D6B4 2.6px, #D3C39F 3.8px, transparent 4.2px); background-size:16px 14px`.
- **Two islands stay dark in day mode** and keep full neon: the top utility bar, and the hotel-delivery band (`background:#17111F`). They are the "sign lit at all hours."
- Hero copy swaps time of day: night "IT'S 4 AM. / WE'RE OPEN.", day "IT'S 2 PM. / WE'RE OPEN." Rail heading swaps "MOVING TONIGHT" / "MOVING TODAY". Drive both from the same clock that gates the 2–6 AM graveyard deal.
- The FDA warning box border/type flips to #17111F.

## Desktop layouts

Breakpoints: mobile ≤ 767 (the 390 px reference), tablet 768–1199 (3-up grids, filters stay a sheet), desktop ≥ 1200 (reference 1440 with 40 px gutters).

### 5a — Desktop home (1440)
Top to bottom: 40 px browser chrome (prototype only) → **utility bar** (gold "OPEN 24 HOURS", address, phone, left; "Delivering to Aria · change" and "21+ only" right) → **header** (logo left, 7 Bebas nav items center, 210 px search + magenta "DELIVER TO MY ROOM" right) → 14 px bulb strip → **hero split**: 620 px copy column (gold eyebrow / Bebas 108 headline / 19 px body / two 18×30 CTAs / hotel-picker panel with 7 chips) + flexible 560 px photo panel → bulb strip → "THE FLOOR" heading with "ALL 9 DEPARTMENTS →", **5-across** category cards (170 px photo) → "MOVING TONIGHT" + stock timestamp, **5-across** product cards (200 px photo, gold price, stock note, outlined add-to-delivery) → **delivery band**: magenta-outlined glowing panel, 420 px "$20 FLAT. / NO MINIMUM." + three gold stats (25–40 / 43 / 24-7) + magenta CTA → bulb strip → **footer**: 340 px brand column (logo, gold hours, address, Night/Day switch) + 4 link columns (SHOP / DELIVERY / THE SHOP / LEGAL) → boxed FDA warning → 12 px legal line.

### 5b — Desktop category (1440)
Utility bar and header compact (active department in magenta; delivery button shows item count) → bulb strip → title block: breadcrumb, Bebas 56 department name, "148 on the shelf right now · stock updated 12 min ago", sort dropdown right → **two columns**: 260 px sticky filter rail + flexible results.
- Filter rail is the mobile sheet (4c) unpacked into stacked, always-open sections divided by 1 px borders: AVAILABILITY (toggle), BRAND (checkbox rows with counts + "Show 22 more"), NICOTINE (3-up), PUFF COUNT (dual range), FLAVOR PROFILE (chips). Below it, a "DELIVERING TO ARIA" reminder card.
- Results: active-filter chips with ✕ plus a result count, **4-across** grid (210 px photo), out-of-stock card swaps its CTA for "Text me when it's in" in muted styling, then numbered pagination.

### Desktop rules
- Max content width 1360 (1440 − 2×40 gutters); center above 1440, never stretch cards past ~300 px.
- Filter rail is `position: sticky; top: <header height>` and scrolls independently.
- Everything mobile handles as a bottom sheet (filters, delivery) becomes: filters → persistent rail; delivery → right-side drawer (420 px) using the same 3b step content.
- Hover states matter here: card border #2A1B3D → #4E3A6B (night) / #E2D8C6 → #C9BCA2 (day), photo scales 1.02 over 200 ms, CTA gains its glow.
- The bulb strip scales up on desktop: 14 px tall, `background-size: 16px 14px`, bulb radius 2.6 px.
- 4a age gate on desktop: centered 480 px card on the midnight ground, same content, bulb strip above and below.

## Files (updated)
Turn 5 in `Smoke Shop Homepage.dc.html` holds `id="5a"` desktop home night, `5b` desktop category, `5c` desktop home day, `5d` mobile home day.

## Files
- `Smoke Shop Homepage.dc.html` — the design document. Turn 4 (top section pair) holds 4a–4k; turn 3 holds home (3a) and the delivery sheet (3b). Earlier turns (1a–1d, 2a–2b) are rejected directions; ignore them.
- `support.js` — runtime for the prototype format only. Not part of the design.
