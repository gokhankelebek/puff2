# HANDOFF TO CLAUDE DESIGN
### What to send, in what order, and what to leave out

---

## The one-line version

Send **the artifact link** (it renders the actual palette and type system) plus **one screen prompt at a time**, in the order below. Do not paste all of BRIEF.md — two-thirds of it is legal and platform context that will pull the design off-target.

---

## What the designer needs vs. what they don't

| Send | Skip (build-team context) |
|---|---|
| §1 The position · §2 Audience · §3 Art direction · §4 Smoke techniques · §5 Signature elements · §8 Dual-brand mechanism · §9 IA · §10 Trust · §11 Mobile | §12 Search · §13 Substrate · §14 Kill list · §15 Plan · §16 Open decisions |
| §6 Strategic features — but only the one relevant to the screen being designed | §7 in bulk — instead, attach the *specific* constraint to the *specific* screen (see below) |

**The four constraints from §7 that must travel with a screen, not as a preamble:**

| Constraint | Attach to |
|---|---|
| FDA warning: ≥20% of area, upper portion, Helvetica/Arial bold, black-on-white, 3–4mm border | **PDP only** (vape, e-liquid, hookah — cigars are exempt) |
| Age banner: 48px, non-modal, in document flow, never overlays | **Every screen**, as a persistent element |
| No Apple Pay / Google Pay buttons | **Checkout only** |
| Push-permission prompt is a designed moment, not a browser default | **Order confirmation only** |

---

## The sequence

Seven prompts. Each builds on the last. **Do them in this order** — the FDA warning at step 3 is the hardest constraint in the system, and solving it late means reworking every product surface.

---

### 1 · Foundations
*Everything downstream depends on this. Get the tokens and the wordmark right before any screen.*

> Build a design-system foundations page for **Puff Vegas**, a 24-hour smoke and vape shop physically on the Las Vegas Strip. The art direction is called **"The 24"** — a smoke shop rendered as a Swiss transit timetable, because the product being sold is the *hour*, not the product.
>
> **Dark-first, non-negotiable.** Peak traffic is after dark; a white screen at 2:14 a.m. on Las Vegas Boulevard is physically hostile. Black is also the great equalizer of product photography — a $12 disposable and a $45 Padrón on the same black seamless become the same class of object.
>
> Colour tokens:
> ```
> --bg-void #08090A · --bg-base #0E1012 · --surface #14171A · --surface-lift #1C2024 · --hairline #2A2F35
> --ink-max #F4F2ED · --ink #C7CCD1 · --ink-mute #838B93 · --ink-faint #575E66
> --ember #FF5A1F · --ember-lift #FF7A45 · --ember-wash #2A1108
> --live #2BE08C · --alert #FF3B30 · --cedar #C08A4A (humidor only)
> ```
> Plus a **Daylight mode that is not white** — warm bone `#EDE8DE`, ink `#14110D`, ember darkened to `#C4400A`. Toggle or `prefers-color-scheme` only; never auto-switch by time of day.
>
> **Rules:** ember is the only saturated hue above 2% of screen area. Live-green appears exclusively in the status module, never as a button. Cedar is quarantined to cigars.
>
> **Type:** a tight extended grotesque for display (Archivo or Inter Display), a tabular mono for all numerals, clock and prices (JetBrains Mono, `font-variant-numeric: tabular-nums`), and Newsreader reserved for the cigar section. Display tracking `-0.028em`. Micro-labels always mono, uppercase, `+0.14em`. **That pairing — huge tight grotesque against wide mono micro — is the typographic signature.**
>
> **Wordmark:** `PUFF` in extended grotesque caps, followed by a single filled ember circle at 0.22× cap height — the "on air" light. It breathes on a 4s cycle, permanently, because the store is permanently open. That dot is also the standalone mark.
>
> **Icon set,** 24×24, 1.5px stroke: disposables, mods, pods, e-liquid, cigarettes, cigars, hookah, shisha, glass, lighters, accessories, delivery. Every icon is a true side-elevation silhouette of the real object — no metaphor — and **every icon contains exactly one ember-filled element: the hot point.** That's the system's signature.
>
> Deliver: palette swatches, type specimen, wordmark lockups, the icon grid, and both theme states.

---

### 2 · Homepage + the four hour-bands
*The hero is a fact, and the fact is the sales pitch.*

> Design the **Puff Vegas homepage** using the established foundations.
>
> **The hero, first two seconds:** black, then at 11vw in tabular mono — the live Las Vegas time and the word `OPEN`, seconds ticking. Beneath it one line: `3649 S LAS VEGAS BLVD · GRAND BAZAAR · NEXT TO OLE RED`. To the right, one ember-filled button: **`DELIVER TO ME`**. Nothing else above the fold. No carousel, no promo banner, no smoke.
>
> **Then design the four hour-band states** — the site knows what time it is and merchandises accordingly:
> - `06:00–16:00` **Daytime** — directions, walk-in, wayfinding, cigars promoted
> - `16:00–23:00` **Evening** — hookah, party packs, "before you go out"
> - `23:00–04:00` **Late Night** — page dims 8%, delivery outranks directions, grid reorders to late-night bestsellers, copy shifts to second person and short sentences
> - `04:00–06:00` **The Hours** — stripped to near-monochrome. One line of copy: *"Still here."*
>
> **Motion signature — "the tick":** the clock advances with a hard 1s step, no easing on the seconds digit. Every other transition is a subdivision of that beat — 125ms micro, 250ms standard, 500ms page. Nothing moves at an arbitrary duration.
>
> **Include the persistent 48px age banner** — non-modal, in the document flow, never overlaying content: *"21+ only. We check ID in store and at the door."* with an affirm control. It must not cause layout shift.
>
> **The clock is a CLS risk** — give it a fixed character count and tabular figures so its width can never change.

---

### 3 · Product page — solve the FDA warning
*The hardest constraint in the system. Solve it here or rework everything later.*

> Design the **Puff Vegas product page** for a disposable vape.
>
> **The defining constraint.** US federal law (21 CFR 1143.3) requires this exact text on every vape, e-liquid and hookah listing:
>
> > **WARNING: This product contains nicotine. Nicotine is an addictive chemical.**
>
> It must occupy **at least 20% of the area**, sit in the **upper portion**, be at least 12pt **Helvetica or Arial bold**, **black-on-white or white-on-black**, and be enclosed in a rectangular border **3–4mm** wide.
>
> This is a permanent, high-contrast block fighting a dark-first design. **Do not treat it as a legal wart to minimise.** Design it as owned typographic furniture — a deliberate white-on-black bordered plate that looks like it belongs to the brand. This is the single most interesting design problem in the project. *(Cigars are exempt — the requirement was vacated in court. Design that variant too.)*
>
> **Everything else on the page:**
> - Price, always visible, never "call for price." Strip smoke shops are notorious for unmarked prices — being the shop that shows the number is a differentiator here, not table stakes.
> - **Price per 1,000 puffs** as a secondary line — an 80K device at $49.99 is $0.62/1k. This reframes a $49.99 sticker from gouging to value using arithmetic, not adjectives. No competitor displays it.
> - **Stock as a confidence claim, not a boolean**, with visible provenance: `✓ On the shelf · counted 22 min ago` / `Usually in stock` / `Only 1–2 left · we'll confirm` / `Not sure — we'll check for you` / `Out right now`. The unknown state offers **`Text us — we answer in minutes, 24/7`**.
> - Human units for puff count: under `9000 puffs`, a secondary line reading *"about 5–7 days for a pack-a-day smoker."*
> - An all-in delivery line: `$24.99 · about $31.40 delivered, all in`.
>
> **Never:** countdown timers, "3 people are viewing this," fake low-stock urgency, pre-checked add-ons.

---

### 4 · Vape category page — "Chip & Swatch"
> Design the **vape category page**. Vape shoppers scan hundreds of near-identical SKUs by recognition, not reading — they're looking for "the blue one." Decision time is 20 seconds to 2 minutes, one-handed, often at 2am.
>
> - Facets as **horizontally-scrolling chip rows at the top** — not a left rail, not a filter drawer.
> - **Flavour family as colour swatches.** Scanning 60 flavours by colour is 5× faster than reading 60 names. **Keep the palette muted and adult, never candy-bright** — youth-appeal imagery is a compliance problem, not just a taste one.
> - **Nicotine strength as a permanent segmented control:** `0 · 3 · 6 · 20 · 50mg`. It's the second-most-used filter and deserves permanent screen space.
> - Dense 2-up grid, flavour name at 17px, colour-coded flavour band, price on every tile.
> - Sort defaults to "Most popular right now."
>
> Also design the **empty-search state**, which must never dead-end: *"We probably have it — we just might call it something else."* then `[Text us a photo]`, three category guesses, and a tap-to-call number.

---

### 5 · Delivery flow
*The differentiator. Three screens.*

> Design the **Puff Vegas delivery flow** — three screens. Context: over 98% of Strip resorts prohibit in-room delivery, and at MGM and Station properties drivers physically cannot reach guest floors without a key card. So the flow must never ask for a room number as the delivery target.
>
> **Screen 1 — Where.** A **hotel picker, not an address field.** The user types `Bellagio`, not `3600 S Las Vegas Blvd`. Then a **meet-point picker pre-populated per property** — `Valet` / `Rideshare pickup` / `North tower entrance`. Then a phone number. That's the whole form. No national app has built this, and it turns a constraint into visible competence.
>
> Include **The Strip Meter**: Las Vegas Boulevard abstracted to a single vertical line with nodes for the landmarks people actually name — Sahara, Wynn, Venetian, Caesars, Bellagio, Cosmopolitan, **Grand Bazaar (you are here, in ember)**, MGM, Luxor, Mandalay Bay. Drag along it and the ETA updates. Off-Strip zones branch as labelled stubs.
>
> **Screen 2 — Cart, as a thermal receipt.** 58mm proportions, dot-matrix type, perforated top edge, slight paper curl, `CASH ON DELIVERY` stamped at 12°. It turns cash-on-delivery from a trust liability into the most charming object on the site.
> - Show `Subtotal / Delivery / Tax / Total` **fully computed before checkout begins**. No fee may appear later.
> - Compute the cash: **"Bring $47 cash."**
> - **Tipping is opt-in, default zero, no guilt ladder:** `$0 / $3 / $5 / Other`, with $0 pre-selected and *not* styled as the shameful option.
> - **No Apple Pay or Google Pay buttons** — both wallets prohibit tobacco on the web.
>
> **Screen 3 — Confirmation and tracking.** Assume the browser tab is gone the moment they hit confirm, **and that we legally cannot send them an SMS** (carrier rules prohibit automated messaging for this category). So this screen carries the entire post-purchase relationship.
> - **The ETA is the largest text on the page** — 48px+, readable across a hotel room, because the phone is going face-up on the nightstand. Use a **window** (`Delivery by 2:40–2:55 AM`), never a countdown — a window reads as a commitment, a timer reads as a guess.
> - `Driver carries change for up to $100.`
> - "We'll check ID at the door" — stated here for the third time, so it is never a surprise.
> - **Design the push-permission prompt as a deliberate moment** with a stated reason: *"So we can tell you when the driver's outside."* This is not a browser default; it's the only notification channel that exists.

---

### 6 · The Humidor Door + cigar section
*Solves the dual-brand problem.*

> Design the **cigar section** and the transition into it. The problem: vape culture (loud, neon, young) and cigar culture (quiet, aged, luxurious) repel each other visually, and treating this as two brands sharing a logo fails.
>
> **The model is one room with a humidor in the back.** The bridge is physical, not stylistic — a lit cigar cherry and a vape coil at temperature glow at the same colour temperature. Combustion is the shared ancestor. Doctrine line: *"Everything we sell is a way of making light."*
>
> **Structure stays invariant. Exactly three things change,** all from one `--temp` token: the accent rotates ember → cedar, the pace roughly doubles (125ms → 240ms), and density drops from a 6-up grid to 2-up with a wider gutter. Plus one typographic swap: Newsreader replaces the grotesque on headings and product names only — never on UI chrome.
>
> **The Humidor Door:** a 700ms designed threshold. `--temp` animates 0→1, film grain coarsens, the ambient layer switches from ember-tinted to still air. A quiet persistent `← BACK TO THE FLOOR`. Making the shift explicit and spatial is the whole trick — people enjoy a change they walked through and are disoriented by one that happens to them.
>
> **The cigar PLP is a spec table, not a grid.** A list with an inline spec strip: `Maduro · Full · 6×52 · Nicaragua · $14.50 single`. Left rail on desktop, full-screen filter sheet on mobile. A comparison tray docked at the bottom, max 3 on mobile, auto-collapsing rows where all values match.
> - **"Singles" is a top-level destination, not a filter value.** Tourists don't buy boxes.
> - Photograph every cigar against a subtly-ruled backdrop — ring gauge is an abstraction nobody can visualise.
> - Publish the humidor reading: `Humidor: 70°F / 69% RH · checked 6:00am`. Two numbers, and it answers the only real objection to buying cigars from a shop that also sells disposables.
>
> **Quarantine rule:** no viewport may contain both a vape-neon accent and cedar above 5% combined area.

---

### 7 · Wayfinding — "Finding us at 2 a.m."
*Small module, disproportionate value.*

> Design a **wayfinding module**. "So hard to find" is a recurring complaint in this store's reviews, the mall it sits in scores 3.1 stars with "no directional markers" as a theme, and two large venues built since 2024 now physically obscure it from the Strip.
>
> Three photographs shot at night in sequence — the Ole Red facade, the turn, the storefront — plus **walking time from each adjacent resort** and one line of orientation copy: *"Next to Ole Red, behind Bottled Blonde, across from the Bellagio fountains."*
>
> **Walking minutes, never driving minutes, never miles** — a Strip block can be a 12-minute walk. And **landmark-first addressing**: "Grand Bazaar Shops, next to Ole Red" comes *before* the street number, every time.
>
> Nobody in this category has built a wayfinding component. The location is the entire strategy and customers can't find the door.

---

## Two things to tell the designer up front

**1. Motion has a hard budget.** The audience is 85%+ mobile on congested Strip cellular and hotel wifi. One ambient effect per viewport, maximum. Total motion ≤4ms/frame. Everything must degrade to static under `prefers-reduced-motion`. If a motion idea can't survive that, it doesn't ship.

**2. The smoke rule.** Every competitor uses cheesy wisps and neon. **Never render smoke as smoke — smoke is a verb here, never a noun.** Use it to modulate something else: as an alpha mask that clears to reveal type, as heat-haze displacement above a lit object, as ember particles that spawn *only* from elements the user is touching. Smoke that reacts is craft; smoke that ambiently drifts is a screensaver.

---

## What still blocks final design

Two decisions belong to the client, not the designer, and both change what gets built:

1. **How much of the vape catalog goes online** — this determines whether the vape department is a shoppable catalog or a "come in, or text us" surface. Steps 3 and 4 above assume shoppable; if that flips, they get substantially simpler.
2. **What happens to the grey inventory** (THCA, kratom, Delta-8) — it needs to be firewalled into its own section with no cross-linking, which is a nav decision.

Steps 1, 2, 5, 6 and 7 are unaffected and can start immediately.
