# Handoff: Puff Vegas — Foundations + Homepage ("The 24")

## Overview

Puff Vegas is a 24-hour smoke and vape shop physically on the Las Vegas Strip (3649 S Las Vegas Blvd, Grand Bazaar Shops, next to Ole Red). The site is **not an e-commerce funnel — it is a dispatcher**. Its job is to route an arriving intent to fulfilment in the fewest taps: *walk here* · *we drive to you* · *we advise you* (cigars).

The art direction is called **"The 24"**: a smoke shop rendered as a Swiss transit timetable, because the product being sold is the **hour**, not the product. The hero is a live clock and the word `OPEN` — the hero image is a fact, and the fact is the sales pitch.

Two designs are in this bundle:

1. **Foundations** — the design system: colour, type, wordmark, icon set, motion, and the governing rules.
2. **Homepage** — the above-the-fold hero plus all four **hour-band** merchandising states.

## About the Design Files

The files in this bundle are **design references created in HTML** — prototypes showing intended look and behaviour, **not production code to copy directly**. They are authored in a streaming component format (`.dc.html`) that pairs an inline-styled template with a small logic class; that format is a design tool, not a target runtime.

The task is to **recreate these designs in the target codebase's existing environment** (React/Next.js is the recommended substrate for this project — see *Build notes* below) using its established patterns, component library and styling approach. Convert the inline styles into that codebase's idiom (CSS variables + modules, Tailwind, styled-components, whatever is already there). If no environment exists yet, Next.js App Router with server rendering is the right choice, for reasons given under *Build notes*.

## Fidelity

**High-fidelity (hifi).** Colours, type scale, spacing, copy, motion durations and easing curves are final and specified exactly below. Recreate pixel-faithfully using the codebase's own libraries.

Two exceptions, both intentional:

- **All product and location photography is placeholder.** Grey blocks labelled `PRODUCT · CHARCOAL SEAMLESS` and `01 OLE RED / 02 THE TURN / 03 THE DOOR` stand in for a shoot that has not happened. Photography is a long-lead item and gates later work (see *Assets*).
- **Copy in product tiles and prices is representative**, not a live catalog. Real data comes from the Ecwid REST API (see *Build notes*).

---

## Screens / Views

### 1 · Foundations (`Puff Vegas Foundations.dc.html`)

A design-system reference page, single column, full-width, `padding: 64px 24px` per section, each section separated by a `1px solid #2A2F35` rule. Every section is headed by a baseline-aligned row: a mono index number (`01`–`07`, 12px, `#575E66`), an `h2`, and a mono uppercase caption.

**Purpose.** The reference every downstream screen is built against.

**Sections:**

| # | Section | Contents |
|---|---|---|
| Top | Age banner + header | 48px age banner, then wordmark, live clock, `OPEN` status, delivery ETA, current hour band |
| 01 | Colour | Four swatch columns — Ground, Ink, Accent, Signal — each swatch a 56×56 chip + token name + hex + usage note. Includes the ember contrast rule callout |
| 02 | Daylight | The two theme states side by side, each a full mini-composition (wordmark, clock, 6-swatch strip, body copy, CTA) |
| 03 | Type | The `--t-mega` clock specimen, then `--t-d1` / `--t-body` / `--t-micro` in the left column and numerals + the Newsreader humidor block in the right |
| 04 | Wordmark | Four lockups in a hairline grid: primary, stacked, standalone mark, reversed |
| 05 | Icons | 12-cell hairline grid, 48px rendered icons (24×24 viewBox), mono uppercase label under each |
| 06 | Motion | Three cards: the duration ladder, an interactive thermal-easing demo, the smoke governance rules |
| 07 | The rules | Six-cell hairline grid of governing constraints, then the doctrine line `Everything we sell is a way of making light.` |

**The header status module** (also used on the homepage, and one of *the constants* — see *Invariants*): four baseline-aligned stacks, each a mono 12px uppercase `#575E66` label above a mono value.

- `LAS VEGAS` → live clock, 38px, weight 500, `#F4F2ED`, `tabular-nums`, `letter-spacing: -.02em`
- `STATUS` → 7px `#2BE08C` dot pulsing on `steps(2, end)` 2s + `OPEN`, 22px weight 600 `#2BE08C`, `letter-spacing: .04em`
- `DELIVER TO STRIP` → `≈ 14 MIN`, 22px weight 500 `#C7CCD1`, tabular
- `HOUR BAND` → current band name, 22px weight 500 `#FF5A1F`, uppercase

**Interactive elements in Foundations:**

- Icon cells: `background` `#14171A` → `#1C2024` on hover, `transition: background 125ms cubic-bezier(.7,0,.84,0)`.
- Thermal easing demo card: a 56px bar, resting `background:#1C2024; border:1px solid #2A2F35; color:#838B93`. On hover → `background:#2A1108; border-color:#FF5A1F; color:#FF7A45`. **The transitions are asymmetric:** hover-in uses `320ms cubic-bezier(.7,0,.84,0)`, hover-out uses `900ms cubic-bezier(.16,1,.3,1)`. Implement by declaring the slow curve in the base rule and the fast curve inside the hover rule.

---

### 2 · Homepage (`Puff Vegas Homepage.dc.html`)

**Purpose.** Take an intent and route it. Above the fold there is a time, a status, an address and one button — nothing else. No carousel, no promo banner, no smoke.

#### 2a · Age banner (persistent, every page)

- Fixed 48px height, `display:flex; align-items:center; gap:20px; padding:0 24px`
- `background:#14171A`, `border-bottom:1px solid #2A2F35`
- Left: `21+ ONLY` — mono 11px, `+.14em`, uppercase, `#F4F2ED`, `flex:none`
- Middle: *"We check ID in store and at the door, every time."* — 14px `#838B93`, `flex:1`, single-line truncate (`overflow:hidden; text-overflow:ellipsis; white-space:nowrap`)
- Right: affirm button — mono 11px `+.14em` uppercase, `#08090A` on `#F4F2ED`, `padding:9px 16px`, no border, `flex:none`; hover `background:#FF7A45`, `transition: background 250ms cubic-bezier(.16,1,.3,1)`

**This element is legally and architecturally load-bearing — see *Constraints* below. It is in the document flow. It never overlays, never locks scroll, never blurs content, never gates the phone number.**

#### 2b · Header

`display:flex; align-items:center; gap:28px; padding:20px 24px; flex-wrap:wrap; border-bottom:1px solid #2A2F35`

- Wordmark (28px `PUFF` + 7px ember dot), `flex:none`
- Nav, `flex:1`, `display:flex; gap:22px; flex-wrap:wrap` — five departments: Vape · Cigars · Hookah · Glass · Accessories. Mono 11px `+.14em` uppercase `#C7CCD1`; hover `#FF5A1F`, `transition: color 125ms cubic-bezier(.7,0,.84,0)`
- Phone number, mono 13px `#F4F2ED`, `letter-spacing:.06em`, tabular, `flex:none`, `href="tel:…"`, hover `#FF5A1F`

**On mobile the department switcher becomes a persistent bottom tab bar, not a hamburger.** The mental model is *"which store am I in"* — switching departments swaps the whole browse grammar.

#### 2c · Hero

- `min-height: calc(100vh - 118px)` (viewport minus banner + header), `display:flex; flex-direction:column; justify-content:center; padding:56px 24px`, `background:#08090A`
- An absolutely-positioned ambient wash across the top 40vh: `radial-gradient(120% 100% at 20% 0%, #2A1108 0%, rgba(42,17,8,0) 62%)` at `opacity:.55`, `pointer-events:none`. **This is the single ambient effect permitted in this viewport** (see *Motion budget*).
- Content row: `display:flex; flex-wrap:wrap; align-items:flex-end; justify-content:space-between; gap:40px`

Left stack (`gap:18px`):

| Element | Spec |
|---|---|
| Clock | JetBrains Mono 500, `font-size: clamp(3.5rem, 11vw, 11rem)`, `#F4F2ED`, `letter-spacing:-.03em`, `line-height:.9`, `font-variant-numeric: tabular-nums`, `white-space:nowrap`. Format `hh:mm:ss AM` |
| Status | 11px `#2BE08C` dot (pulse `livePulse` 2s `steps(2, end)`) + `OPEN` at `clamp(2rem, 6vw, 4.5rem)`, mono 600, `#2BE08C`, `letter-spacing:.02em` |
| Address | `3649 S LAS VEGAS BLVD · GRAND BAZAAR · NEXT TO OLE RED` — mono `clamp(.7rem, 1.5vw, .85rem)`, `+.14em`, uppercase, `#838B93` |

Right stack (`flex:none`, `gap:14px`):

| Element | Spec |
|---|---|
| CTA | `DELIVER TO ME` — `background:#FF5A1F`, `color:#08090A`, no border, `padding:26px 40px`, mono 15px weight 600 `+.14em` uppercase. Hover: `background:#FF7A45; box-shadow:0 0 60px 0 #2A1108`, `transition: 320ms cubic-bezier(.7,0,.84,0)` |
| ETA | `≈ 14 MIN TO STRIP HOTELS` — mono 11px `+.14em` uppercase `#575E66`, centred, tabular |

**Landmark-first addressing is a rule, not a preference:** "Grand Bazaar Shops, next to Ole Red" comes before the street number, every time. And **walking minutes, never driving minutes, never miles** — a Strip block can be a 12-minute walk.

#### 2d · The four hour-bands

The hero never changes. Everything below it does. The band is **computed server-side from Pacific time — never from the device clock**, which lies for a traveller who hasn't changed timezones.

In the prototype all four states are stacked and labelled so they can be compared. **In production one band renders at a time**, selected server-side.

| Band | Window | Ground | Merchandising |
|---|---|---|---|
| **Daytime** | `06:00–16:00` | `#0E1012` | Directions and walk-in lead. Wayfinding card with walking times, the three-photo night sequence, cigars promoted (cedar card) |
| **Evening** | `16:00–23:00` | `#0E1012` | Party packs lead (group buying, price per head shown up front), 4-tile product row, then the honest e-hookah/pouch note |
| **Late night** | `23:00–04:00` | `#0B0C0D` — **page dims 8%** | Delivery outranks directions: hotel picker first, then "what we sell most at 2 a.m." with $/1k puffs, then *text us a photo*. Copy shifts to second person and short sentences |
| **The hours** | `04:00–06:00` | `#08090A` | Stripped, near-monochrome, centred. Clock in `#838B93`, one line — *"Still here."* — the ember dot, and two outline buttons (Call / Deliver to me). This is the screenshot that goes on social |

**Late-night dimming is a whole-palette shift, not an overlay.** The band substitutes a dimmed ramp so contrast ratios stay intact:

| Normal | Late night |
|---|---|
| `#0E1012` ground | `#0B0C0D` |
| `#14171A` surface | `#121517` |
| `#1C2024` lift | `#121517` |
| `#2A2F35` hairline | `#262B30` |
| `#F4F2ED` ink-max | `#E4E2DD` |
| `#C7CCD1` ink | `#9AA2A9` |
| `#838B93` ink-mute | `#6F767D` |

Ember (`#FF5A1F`) does **not** dim — it is the only thing that gets relatively brighter at 2 a.m.

**Daytime wayfinding card.** `background:#14171A`, `padding:28px`, hairline border. Mono kicker `WALK HERE`, then a `clamp(1.5rem, 2.6vw, 2rem)` display line, then a walking-time table: four rows, each `display:flex; justify-content:space-between; padding:11px 0; border-top:1px solid #2A2F35` (last row also `border-bottom`), left label `#C7CCD1`, right value `#F4F2ED`, mono 13px tabular. Bellagio fountains 6 min · Caesars Palace 8 min · Paris/Flamingo 4 min · Harrah's (via skybridge) 9 min.

**Daytime cigar card** is the only cedar element on the page: `background:#150F0A`, `border:1px solid #3B2A1E`, kicker and links in `#C08A4A`, headline in Newsreader, and the humidor reading `Humidor: 70°F / 69% RH · checked 6:00 am` in mono `#C08A4A`. Its area must stay under the quarantine threshold (see *Invariants*).

**Late-night hotel picker.** A POI autocomplete, **not** a street-address field: the focused input shows `Bellagio` with an ember border (`#FF5A1F`), and two suggestion rows beneath it, each with the venue name left and a mono ETA right. Below: *"Hotels, not street addresses. We'll pick the meet point next — you'll never type a room number."* Then a full-width ember `CONTINUE`.

**Product tiles** (Evening and Late night): a square `aspect-ratio:1/1` image area over a `padding:14–16px` info stack — name (15–17px `#F4F2ED`), price (mono 15–17px `#F4F2ED`, tabular), then one mono 11px metadata line. That third line is where stock confidence, `$/1k puffs`, or a constraint (`in-store only · fire code`) goes. Stock states use `#2BE08C` only for verified (`✓ ON THE SHELF · COUNTED 22 MIN AGO`); everything else is `#838B93`, and `WON'T SET OFF THE SENSOR` is `#FF5A1F`.

#### 2e · Footer strip

Closing hairline grid of four rule cards (the tick · no layout shift · the age banner · above the fold), then the wordmark and the fixed commitment line: `FREE DELIVERY TO STRIP HOTELS · NO MINIMUM · CASH AT YOUR DOOR · OPEN NOW`.

---

## Interactions & Behavior

### The tick — the motion signature

**One second, forever.** The header clock advances with a hard 1s step and **no easing on the seconds digit** — a mechanical snap, `steps(1)`. Every other duration in the system is a subdivision of that beat:

| Duration | Use |
|---|---|
| `1000ms` | the tick, `steps(1)` |
| `500ms` | page transition |
| `250ms` | standard |
| `125ms` | micro — hover, tap |

**Nothing in the system moves at an arbitrary duration.** The interface feels like it runs on the same movement as the clock.

### Thermal easing

Elements **heat fast and cool slow**:

- heating (hover/focus in): `320ms cubic-bezier(.7,0,.84,0)`
- cooling (hover/focus out): `900ms cubic-bezier(.16,1,.3,1)`

The asymmetry is the whole trick — real embers cool slower than they light, and it gives the interface thermal mass. Implement by putting the slow curve on the base selector and the fast curve inside `:hover`.

### The clock implementation

```js
// Pacific time, formatted server-side for first paint, hydrated after.
const parts = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Los_Angeles', hour12: false,
  hour: '2-digit', minute: '2-digit', second: '2-digit'
}).formatToParts(new Date());
```

Tick with a self-correcting timeout, **not** `setInterval(…, 1000)` — schedule the next tick at `1000 - new Date().getMilliseconds()` so it never drifts off the second boundary. Clear on unmount.

Hour band: `h>=6 && h<16` Daytime · `h>=16 && h<23` Evening · `h>=23 || h<4` Late night · else The hours.

### The clock is a CLS risk

A ticking element that reflows the header once a second fails CLS on its own. Fix it **by construction**:

1. Server-render the clock with a **fixed character count** (`hh:mm:ss AM` — always 11 characters).
2. `font-variant-numeric: tabular-nums` on every numeral in the system.
3. `white-space: nowrap`.
4. Hydrate after paint.

### The wordmark dot

`animation: emberBreathe 4s ease-in-out infinite` — `opacity .5 → 1`, `transform: scale(.9) → scale(1)` at the midpoint. **It runs permanently, because the store is permanently open.** It is the only element on the site that animates without being touched; everything else is either the clock's tick or a direct response to the user.

### Motion budget — enforced, not aspirational

Audience is 85%+ mobile on congested Strip cellular and hotel wifi, one-handed, often at 2 a.m.

- **One ambient effect per viewport, maximum.**
- Total motion budget **4ms/frame**.
- Everything degrades to a static gradient under `prefers-reduced-motion: reduce` — including the breathing dot and the status pulse.

### The smoke rule

Every competitor in this category uses cheesy wisps and neon. The governing rule:

> **Never render smoke as smoke. Smoke is a verb here, never a noun.**

Smoke may only modulate something else: as an alpha mask that clears to reveal type, as heat-haze displacement above a lit object, as ember particles that spawn **only** from elements the user is actually touching. *Smoke that reacts is craft; smoke that ambiently drifts is a screensaver.* Neither of these two screens ships a smoke layer — the hero's radial ember wash is the entire ambient budget here.

### The hairline grid technique

Section grids are separated by 1px rules. **Do not** paint these by putting `#2A2F35` on the grid container behind `gap:1px` — with `auto-fit` tracks, a partly-filled last row leaves large solid grey panels that read as broken cards. Instead give **each cell** `box-shadow: 0 0 0 1px #2A2F35` (or `#262B30` in the late-night band) and leave the container transparent with `gap:1px`.

### Responsive behavior

Every grid in both files is `repeat(auto-fit, minmax(Npx, 1fr))` with `gap` — no media queries. Minimums used: `150px` (icons, dense product tiles), `220px` (product row), `250–260px` (wordmark, swatch columns), `280–300px` (rule cards, band columns), `320–340px` (type columns, delivery column). Header and hero rows use `flex-wrap: wrap` with `gap`.

---

## State Management

Minimal. Both screens are effectively server-rendered documents.

| State | Owner | Notes |
|---|---|---|
| `now` (Date) | client, after hydration | Drives the clock. Self-correcting timeout, cleared on unmount |
| `hourBand` | **server** | Derived from Pacific time at request. Never from the device clock. Determines which band's below-fold content is rendered |
| `ageAffirmed` | **signed cookie, read server-side** | So the collapsed banner state renders in the first byte. See *Constraints* |
| `deliveryZone` / `eta` | server, from detected zone | Displayed under the hero CTA and in the header status module |
| `theme` (dark / daylight) | explicit toggle, else `prefers-color-scheme` | Persisted. **Never auto-switch by time of day** — a site that changes identity at sunset feels broken |

No data fetching on these two screens beyond catalog reads for the band product rows (Ecwid REST API) and the stock-confidence values.

---

## Design Tokens

### Colour — dark (default)

```css
/* Ground */
--bg-void:      #08090A;  /* page background, the "off" state */
--bg-base:      #0E1012;  /* default section ground */
--surface:      #14171A;  /* cards, product tiles */
--surface-lift: #1C2024;  /* hover / raised / modal */
--hairline:     #2A2F35;  /* 1px rules, grid lines, table borders */

/* Ink */
--ink-max:      #F4F2ED;  /* headlines, prices — warm white, never #FFF */
--ink:          #C7CCD1;  /* body */
--ink-mute:     #838B93;  /* labels, metadata */
--ink-faint:    #575E66;  /* disabled, watermarks */

/* Accent — the only warm thing on the page */
--ember:        #FF5A1F;  /* primary CTA, active state, the logo dot */
--ember-lift:   #FF7A45;
--ember-wash:   #2A1108;

/* Signal */
--live:         #2BE08C;  /* OPEN NOW, live ETA, in-stock */
--alert:        #FF3B30;  /* age, out of stock, legal */
--cedar:        #C08A4A;  /* humidor context ONLY */
--cedar-deep:   #3B2A1E;
--humidor-bg:   #150F0A;
```

### Colour — Daylight (the one concession, and it is **not white**)

```css
--bg-base:  #EDE8DE;  /* warm bone */
--surface:  #DED7C8;
--ink-max:  #14110D;
--ink-mute: #6B6559;
--hairline: #C9C1B2;
--ember:    #C4400A;  /* darkened for contrast on bone */
--live:     #0F7A48;
```

Triggered by explicit toggle or `prefers-color-scheme` only.

### Typography

| Role | Family | Notes |
|---|---|---|
| Display + UI | **Archivo** (variable, `wdth 62..125`, `wght 400..800`) | Paid alternative: Söhne / Neue Haas Grotesk Display |
| Numerals, clock, prices, SKU, all micro-labels | **JetBrains Mono** (`400..700`) | `font-variant-numeric: tabular-nums` is **mandatory** everywhere |
| Humidor editorial | **Newsreader** (variable `opsz 6..72`) | `/cigars` only — headings and product names, **never** UI chrome |

```css
--t-mega:  clamp(3.5rem, 11vw, 11rem);   /* the clock, the hero number */
--t-d1:    clamp(2.5rem, 6vw, 4.5rem);
--t-h2:    clamp(2rem, 4.4vw, 3.2rem);
--t-body:  1.0625rem/1.55;
--t-micro: 0.75rem;                      /* uppercase, +0.14em, mono */
```

- Display: weight 700–800, `font-stretch: 112%` (headings) / `118%` (wordmark), `letter-spacing: -0.028em`, `line-height: 1` or tighter.
- Mega numerals: mono weight 500, `letter-spacing: -0.03em`, `line-height: .9`.
- Micro-labels: **always** mono, uppercase, `letter-spacing: 0.14em`, `#838B93` or `#575E66`.

> **The typographic signature is the pairing itself** — huge tight grotesque against wide mono micro. If a screen loses that contrast it has stopped being this brand.

### Spacing & geometry

- Section padding `64px 24px` (Foundations) / `56px 24px` (Homepage bands); final section `64px 24px 96px`.
- Card padding `26–32px`; dense tile padding `14–16px`.
- Stack gaps `10 / 12 / 14 / 16 / 18 / 20 / 24 / 28 / 32 / 36 / 40px`.
- Grid `gap: 24px`, or `gap: 1px` for hairline grids.
- **Border radius: `0` everywhere except the ember dot and status dots (`50%`).** Nothing in this system is rounded. That is deliberate — it is the timetable, not an app.
- Borders are always `1px solid` in a hairline token. No shadows anywhere except the CTA's hover glow (`0 0 60px 0 #2A1108`) and the standalone mark's halo (`0 0 40px 8px #2A1108`).

### Easing

```css
--ease-heat: cubic-bezier(.7, 0, .84, 0);    /* 320ms  — heating up   */
--ease-cool: cubic-bezier(.16, 1, .3, 1);    /* 900ms  — cooling down  */
--tick:      steps(1);                        /* 1000ms — the seconds  */
```

### Keyframes

```css
@keyframes emberBreathe {
  0%, 100% { opacity: .5; transform: scale(.9); }
  50%      { opacity:  1; transform: scale(1);  }
}
@keyframes livePulse {
  0%, 100% { opacity: .35; }
  50%      { opacity: 1;   }
}
```

`emberBreathe` runs `4s ease-in-out infinite`; `livePulse` runs `2s steps(2, end) infinite`.

---

## Invariants — the rules that keep this one brand

These are lint-worthy. Several are load-bearing.

1. **Ember is the only saturated hue above 2% of screen area.** If two things on a screen are ember, one of them is wrong.
2. **Live-green appears exclusively in the status module.** Never a button, never a badge, never a price.
3. **Cedar is quarantined to the humidor.** No viewport may contain both a vape accent and cedar above **5% combined area**; cross-links between the two worlds go through neutral monochrome cards only.
4. **Ember-on-void is 5.8:1** — fine for large display type and CTA fills, **never for 14px body copy**. Body ink stays `#C7CCD1`.
5. **Warm white, never `#FFF`.** The whole ink ramp is off-neutral so the ember never looks pasted on.
6. **The constants** — the clock, the delivery/ETA module, the cash-on-delivery badge, the wordmark, and the film grain — are byte-identical on every page, in every band, in both themes. They carry the coherence the way a magazine keeps its folio identical across wildly different feature spreads.
7. **The floor:** hours, address, phone and directions must work with **zero JavaScript**. `tel:` links dial immediately — no confirmation dialog, no intermediate contact page — and the phone number is in the initial HTML of every page so it survives total JS failure.

### Never build

Countdown timers · carousels anywhere · "3 people are viewing this" · fake low-stock urgency · pre-checked add-ons · newsletter modal on entry · hidden fees · a full-screen blocking age overlay · scroll lock · blurred content behind a gate · DOB before browsing · a birth-year dropdown · gating the address, hours or phone number.

---

## Constraints the implementation must absorb

### The age gate never blocks content

Paid acquisition does not exist in this category — Google, Meta, TikTok, Snap, Pinterest, Reddit, Microsoft and LinkedIn all ban tobacco *and accessories*, with no brick-and-mortar carve-out. Organic, local and AI search are effectively the only channels, so **a design decision that costs SEO costs the business**.

The homepage banner is therefore non-negotiable in shape:

- Server-rendered in the first byte, **in the document flow**, 48px, no overlay, no CLS, no focus trap, no scroll lock.
- Works with JavaScript disabled, as a form POST.
- The cookie is read **server-side** so the collapsed state renders in the first byte. *A JS gate that flickers in after paint is the most common technical failure in this category.*

**How it caches — the part that makes it shippable.** Varying HTML by cookie normally destroys edge caching, which would be fatal here. Edge middleware reads the signed cookie and **does not redirect** — it passes through, normalising the cookie to a single bit and injecting a request header. The response varies on that one normalised value, so you get **exactly two cached static variants per URL** rather than one per user. Both serve from edge cache, LCP is untouched, hit rate stays high, middleware cost is 1–5ms.

Escalation happens later in the funnel, not here: a one-tap bottom sheet at purchase intent (both controls in the thumb arc, no DOB, and the action the user took completes automatically on affirm), a masked `MM/DD/YYYY` field plus third-party database verification at order, and a physical ID scan at fulfilment — told to the customer three times before it happens so it is never a surprise.

### The FDA warning (not on these two screens, but design around it)

`21 CFR 1143.3(b)(2)` applies to *"Internet Web pages"* explicitly. Every **vape, e-liquid and hookah** listing must carry `WARNING: This product contains nicotine. Nicotine is an addictive chemical.` occupying **≥20% of the area of the advertisement**, in its **upper portion**, at **≥12pt Helvetica or Arial bold**, black-on-white or white-on-black, enclosed in a rectangular border **3–4mm** wide. **Cigars and pipe tobacco are exempt** (vacated in *Cigar Ass'n of Am. v. FDA*).

Design it as **owned typographic furniture** from the start — a deliberate plate that belongs to the brand — not a retrofitted legal wart. It is a permanent, high-contrast block on the majority of product pages and it fights the dark-first direction directly.

### No wallets, no native app, no automated SMS

- **No Apple Pay or Google Pay buttons** — both wallets prohibit tobacco and vaping on the web regardless of processor. (In-store and doorstep taps on card-present hardware are ordinary transactions and are fine.)
- **No native app** — Apple Guideline 1.4.3 and Google Play both bar tobacco-sale apps. Build a **PWA**.
- **No automated outbound SMS.** Carrier A2P filtering classes this category as prohibited content with no transactional-versus-promotional distinction, and the rejection is permanent rather than a retry. So **Web Push (VAPID) plus the live tracking page plus transactional email** carry the entire post-purchase experience, and the push-permission prompt is a **designed moment** with a stated reason — not a browser default.

### Performance budget — enforced, blocking

Measured on a **mid-tier Android on throttled Slow 4G** — not on a laptop. Wire it to Lighthouse CI plus `size-limit` as a **blocking** check on every PR. *A budget that doesn't fail the build is a wish.*

| Metric | Target | Hard ceiling |
|---|---|---|
| LCP | ≤ 2.0s | 2.5s |
| INP | ≤ 150ms | 200ms |
| CLS | ≤ 0.02 | 0.05 |
| Critical-path JS, gzipped | ≤ 100KB | 120KB |
| Total initial transfer | ≤ 350KB | 400KB |

**The LCP element must never be a canvas.** It is a preloaded AVIF hero or a text headline. Zero third-party scripts before first paint. Browse, search, order and track must all work before a line of JS executes.

### Also required on the homepage, server-side

`LocalBusiness` JSON-LD with `openingHoursSpecification` — the current live site has **zero** JSON-LD and a contact block claiming `10:00 AM — 7:00 PM` while the body copy says open 24 hours. Use `@type: ["Store", "LocalBusiness"]`; there is no `TobaccoShop` type, and `LiquorStore` is factually wrong. Do **not** mark up your own `AggregateRating`.

---

## Assets

**No production assets exist yet. Everything visual in this bundle is either type, colour, or a placeholder.**

| Asset | Status |
|---|---|
| Icon set (12 icons) | **Delivered** — inline SVG in `Puff Vegas Foundations.dc.html`, section 05. 24×24 viewBox, `stroke #C7CCD1`, `stroke-width 1.5`, `fill none`, `stroke-linejoin round`. Extract these into the codebase's icon component |
| Wordmark | **Delivered** — pure type (Archivo 800, `font-stretch:118%`, `-.028em`) plus a `border-radius:50%` ember dot at **0.22× cap height**. No image file needed; the dot is also the standalone mark |
| Film grain | **Delivered** — inline SVG `feTurbulence` (`fractalNoise`, `baseFrequency 0.8`, `numOctaves 3`) as a fixed full-viewport layer, `opacity .035`, `mix-blend-mode: screen`, `pointer-events:none`. One of *the constants* |
| Fonts | Google Fonts: `Archivo`, `JetBrains Mono`, `Newsreader`. Self-host in production and preload the two used above the fold |
| **Product photography** | **Blocking long-lead item.** Placeholder blocks labelled `PRODUCT · CHARCOAL SEAMLESS`. The shoot spec: product dead-centre on charcoal seamless `#101214`, single hard key at 45° camera-left with ¼ CTO gel, one silver bounce camera-right at 20%, black flag behind to kill spill, f/8, 100mm macro, product at 60% of frame height. **Every SKU on the same setup, same day, same lens** — that consistency is what later makes a shelf of edge-to-edge products readable as objects on a surface rather than cards |
| **Wayfinding photography** | Three night shots in sequence — Ole Red facade → the turn → the storefront. Available light only (Strip signage as the source), 35mm, documentary |

**Banned imagery, permanently:** stock vapour clouds · anyone exhaling · bikini models · neon-tube props · purple/teal gradient backdrops · lens flares · product floating with a drop shadow · Photoshopped flames · cartoons, characters or candy motifs · anyone who could read as under 25. The last several are compliance issues, not taste ones — all models must read visibly 30+, and flavour imagery stays product-literal and **muted, never candy-bright**.

---

## Build notes

Recommended substrate, for context on the two constraints that actually shape the code:

- **Next.js App Router, server-rendered.** The hour band, the age-banner cookie bit, the clock's first paint, and the JSON-LD all need to be decided on the server. The edge-middleware cookie-normalisation trick above is what keeps that cacheable.
- **Commerce stays where it is.** The catalog lives in Ecwid (600 req/min per token, full CRUD, official typed headless client) — go **headless over it** rather than migrating. Order *capture* is custom, because age verification, delivery-zone validation, hotel/meet-point logic and cash-on-delivery all live there.
- Put a `CommerceAdapter` interface (`getProducts`, `getInventory`, `createOrder`) between the UI and Ecwid, with **zero vendor types leaking into the UI layer**, enforced by lint rule.

---

## Files

| File | What it is |
|---|---|
| `Puff Vegas Foundations.dc.html` | The design system: colour, Daylight state, type specimen, wordmark lockups, 12-icon set, motion ladder + thermal-easing demo, the rules |
| `Puff Vegas Homepage.dc.html` | Age banner, header, hero, all four hour-band states, footer rule cards |
| `support.js` | Runtime for the `.dc.html` prototype format. **Not part of the design** — do not port it |

Open either HTML file directly in a browser to see it live, including the ticking clock and the hover behaviours. Both are single files with no build step.
