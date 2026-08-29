# PUFF VEGAS — MASTER DESIGN BRIEF
### For handoff to Claude Design · puffvegas.us · 19 Aug 2026

---

## 0. READ THIS FIRST — the four things that decide everything

**1. This is not an e-commerce site. It is a dispatcher.**
Federal and state law make conventional online checkout for this category a minefield. The site's job is to take an intent arriving in one of three shapes and route it to fulfilment in the fewest taps: **walk here** · **we drive to you** · **we advise you** (cigars). Design for routing, not for a cart funnel.

**2. Paid acquisition does not exist in this category.**
Google, Meta, TikTok, Snap, Pinterest, Reddit, Microsoft and LinkedIn all ban tobacco *and accessories*. There is no brick-and-mortar carve-out. Organic, local, and AI-search are effectively the only channels. **A design decision that costs SEO costs the business.** This is why the age gate must never block content.

**3. No aggregator will ever list you — which is the moat. But you may not have to own the drivers.**
DoorDash and Uber Eats ban nicotine on their consumer **marketplaces**, and USPS, UPS, FedEx and DHL all refuse vape shipment. So the category cannot be commoditized by an app: a tourist will never open DoorDash and find a smoke shop. Every 24/7 delivery competitor in Las Vegas is off-Strip; Puff Vegas is the only one at 3649 S Las Vegas Blvd.

*Corrected from an earlier draft, which said own drivers were the only lawful channel.* Two **white-label** paths exist and are worth pricing: **DoorDash Drive** runs a published tobacco-agreement programme built for exactly this model — customer buys on your site, a Dasher delivers, with pickup ID, mandatory every-customer ID check, app-prompted scan and return-to-merchant on failure *(whether the addendum covers vape as well as tobacco is genuinely ambiguous in their docs — get it in writing)*. And **Nash** exposes `tobacco` and `vapes` as documented API order requirements; one live quote against a Las Vegas lane resolves coverage in an hour. Budget ~$8–12/delivery against an in-house driver.

⚠️ **But note what this does *not* change.** The PACT Act's "delivery sale" test is disjunctive — **an online order triggers it regardless of who delivers.** Own drivers do not exempt you. The courier choice changes your operational risk, not your legal status.

**4. The site tells a 2 a.m. customer that you are closed.**
The homepage contact block reads *"Daily 10:00 AM — 7:00 PM"* while the copy above it says *"Open 24 hours"*, and there is no `LocalBusiness` schema or `openingHoursSpecification` anywhere on the site. *(The Google Business Profile is correct — the contradiction is on the website only, but the website is what Google reconciles the profile against.)*

*Note on reachability: three of this project's research workstreams got `ECONNRESET` fetching `puffvegas.us` directly, while a fourth retrieved the entire site through a reader proxy at the same time — which is where most of the on-page detail in this brief comes from. That pattern points to **category filtering on our research network**, not an outage. Worth a 30-second check from a phone on cellular, but do not treat it as an incident. See §12.*

**5. And the biggest win is not a design win at all.** The Google profile carries **4.9 stars across 2,791 reviews — 5.5× the strongest competitor** — and still doesn't appear in the local pack for delivery queries, because it is filed under the wrong category and has never told Google it delivers. See §12. Fix that before anyone writes a line of code.

---

## 1. THE POSITION

> ## Puff Vegas owns the hour, not the product.
>
> The Strip's 24-hour supply room — the only shop physically on Las Vegas Boulevard that is awake at 3 a.m. and will also bring it to you, in the one retail category the delivery apps are legally forbidden to touch.
>
> **The website has one job: collapse the distance between *"I need this now"* and *"I have it"* — at any hour, from any hotel, with the price visible before you commit.**

### Why every other position fails
| Claim | Why it dies |
|---|---|
| "Biggest selection" | Mr. Bill's has more depth and a *Best of Las Vegas 2025* award |
| "Best prices" | Puff Vegas runs 1.4×–2× off-Strip. Four reviewers have said so publicly. Claiming it is the one move that makes you look dishonest |
| "Premium cigars" | Eight Cigar Lounge at Resorts World has 150 SKUs up to $5,000 |
| "We deliver" | Smokes Mart, Smokers Alley and INEEDAVAPE all deliver too |

**Nobody can be on the Strip AND open at 3 a.m. AND deliver.** Each leg is copyable. The combination is not.

### The trust layer that makes the position convert
The category's defining sins are unmarked prices, counterfeits, and refused refunds. Availability alone converts nobody. Three claims, each attacking one sin:

> **Every price posted. Every product real. ID checked at the door, every time.**

A text search across all 100 Puff Vegas Yelp reviews (38 recommended + 62 filtered) for `fake`, `counterfeit`, `refund`, `scam`, `cash` returns **zero matches**. In a market where the nearest competitors are publicly accused of selling counterfeit Elf Bars and posting "no refunds on disposables" signage, that is the most valuable and least used asset the business owns.

**On price, concede and justify — never hedge.** *"We're not the cheapest in Las Vegas. We're the only one open at 3 a.m. on the Strip, and the price is on the label before you buy."* The current owner reply — *"we work hard to offer competitive pricing"* — has been publicly disproved four times and reads as evasion.

---

## 2. AUDIENCE — five segments, five jobs

| # | Segment | Trigger | State | Basket |
|---|---|---|---|---|
| 1 | **The 3 A.M. Refill** *(core volume)* | Disposable dies 11p–5a. Ole Red next door runs to 4a; Drai's to 7a | Phone, one-handed, dying battery, hotel wifi, often impaired | $33–45 walk-in · $60–80 delivered |
| 2 | **The Party Provisioner** *(highest basket, unserved)* | Pre-game 4–9p, buying for 8–12 people. Vegas is #1 globally for bachelor/bachelorette parties; 20% of visitors are here for a celebration | Phone passed around a group; social decisions | $135–215 cigars · $129–199 hookah |
| 3 | **The Aficionado** *(highest margin, currently unserved)* | Deliberate errand. **Casa Fuente closed Oct 2025** — the Strip's cigar destination is gone | Patient, reads specs, compares to Neptune/Famous | $40–120, high repeat |
| 4 | **The Hotel Room Group** *(the hidden wedge — see §6)* | 8p–2a, group in a room wanting a session | Doesn't know what's actually possible | $50–160 |
| 5 | **The Local Regular** *(retention engine)* | Ran out, 3 a.m., won't drive | Repeat, wants reorder not discovery | $50–90, 2–6×/month |

**Segment 3 is completely blocked today.** Every premium cigar PDP — Montecristo, Romeo y Julieta, Acid Kuba Kuba, Macanudo — has **no price, no stock state, no add-to-cart**, and ~1,200 words of AI essay written in the third person as if by an affiliate reviewing the store. The cigars category page runs **1,144 words before the first price appears.**

---

## 3. ART DIRECTION — "THE 24"

**Dark-first. Non-negotiable.** Peak traffic is after dark; a white screen at 2:14 a.m. on Las Vegas Blvd is physically hostile. Black is also the great equalizer of product photography — a $12 disposable and a $45 Padrón shot on the same black seamless become the same class of object, which directly raises perceived AOV. And it is the only visual environment vape culture and cigar culture share: nightclub and cigar lounge are both low-light rooms.

**The one concession:** a *Daylight* mode that is **not white** — warm bone `#EDE8DE`, ink `#14110D`. Triggered by explicit toggle or `prefers-color-scheme`. **Never auto-switch by time of day** — a site that changes identity at sunset feels broken.

### Colour system

```css
/* Ground */
--bg-void        #08090A   /* page background, the "off" state */
--bg-base        #0E1012   /* default section ground */
--surface        #14171A   /* cards, product tiles */
--surface-lift   #1C2024   /* hover / raised / modal */
--hairline       #2A2F35   /* 1px rules, grid lines, table borders */

/* Ink */
--ink-max        #F4F2ED   /* headlines, prices — warm white, never #FFF */
--ink            #C7CCD1   /* body */
--ink-mute       #838B93   /* labels, metadata */
--ink-faint      #575E66   /* disabled, watermarks */

/* Accent — the only warm thing on the page */
--ember          #FF5A1F   /* primary CTA, active state, the logo dot */
--ember-lift     #FF7A45
--ember-wash     #2A1108

/* Signal */
--live           #2BE08C   /* OPEN NOW, live ETA, in-stock */
--alert          #FF3B30   /* age, out of stock, legal */
--cedar          #C08A4A   /* humidor context ONLY */
--cedar-deep     #3B2A1E
```

**Rules.** Ember is the only saturated hue above 2% of screen area. Live-green appears exclusively in the status module — never as a button. Cedar is quarantined to `/cigars`. Ember-on-void is 5.8:1 — fine for large text, **never for 14px body copy**.

### Type

| Role | Paid | Free (OFL) | Notes |
|---|---|---|---|
| Display + UI | Söhne / Neue Haas Grotesk Display | **Archivo** or Inter Display | Klim licenses by pageview — ~$100–300/yr at this scale |
| Numerals, clock, prices, SKU | Söhne Mono / Berkeley Mono | **JetBrains Mono** or Geist Mono | `font-variant-numeric: tabular-nums` mandatory |
| Humidor editorial | Signifier | **Newsreader** (variable optical size) | `/cigars` only |

```css
--t-mega  clamp(3.5rem, 11vw, 11rem)   /* the clock, the hero number */
--t-d1    clamp(2.5rem, 6vw, 4.5rem)
--t-body  1.0625rem / 1.55
--t-micro 0.75rem  /* uppercase, tracking +0.14em, mono */
```

Display tracking `-0.028em`. Micro-labels are always mono, uppercase, `+0.14em`. **That pairing — huge tight grotesque against wide mono micro — is the typographic signature.**

### Photography

**The shot:** product dead-centre on charcoal seamless `#101214`. Single hard key at 45° camera-left with ¼ CTO gel. One silver bounce camera-right at 20%. Black flag behind to kill spill. f/8, 100mm macro, product at 60% of frame height. **Every SKU shot on the same setup, same day, same lens** — that consistency is what makes The Shelf (§5) possible.

**Lifestyle:** night, available light only (Strip signage as the source), 35mm, hands and product only, faces cropped or out of focus. Documentary, never staged.

**BANNED:** stock vapour clouds · anyone exhaling · bikini models · neon-tube props · purple/teal gradient backdrops · lens flares · product floating with a drop shadow · Photoshopped flames · anyone who could read as under 25 *(also a compliance issue — see §7)*.

### Motion signature — "the tick"

One second, forever. The header clock advances with a hard 1s step, **no easing on the seconds digit** — a mechanical snap. Every other transition in the system is a subdivision of that beat: 125ms micro, 250ms standard, 500ms page. Nothing moves at an arbitrary duration. The interface feels like it runs on the same movement as the clock — a thing you feel before you notice.

Layer on **thermal easing**: elements heat fast and cool slow. `cubic-bezier(.7,0,.84,0)` at 320ms on the way up; `cubic-bezier(.16,1,.3,1)` at 900ms on the way down. The asymmetry is the whole trick — real embers cool slower than they light, and it gives the interface thermal mass.

### The hero moment — first 2 seconds

Black. Then at 11vw, mono, tabular:

```
4:17:09 AM
OPEN
```

Seconds ticking. Under it one line: `3649 S LAS VEGAS BLVD · GRAND BAZAAR · NEXT TO OLE RED`. To the right, one ember-filled button: **`DELIVER TO ME`**. Nothing else above the fold. No carousel, no promo banner, no smoke.

**The gag is that the hero image is a fact, and the fact is the sales pitch.**

---

## 4. THE SMOKE PROBLEM

Every smoke shop site uses cheesy wisps and neon. The governing rule:

> **Never render smoke as smoke. Smoke is a verb here, never a noun.**

Five sophisticated techniques, all technically specified:

**4.1 Volumetric density field that *reveals*.** Ray-march a curl-noise FBM field in a fullscreen fragment shader and use the density as an **alpha mask for content**, not as a visible cloud — the hero headline paints only where density is low, so smoke "clears" to reveal type. Half-res FBO, temporal reprojection at 0.88, 24 steps. Composite at 8–14% opacity, `mix-blend-mode: screen`, top 40vh only. Tint strictly `--ember-200 → --ember-000`; grey smoke reads as stock footage. Budget ≤2.5ms/frame.

**4.2 Heat haze via SVG turbulence.** Pure SVG + CSS, no WebGL. `feTurbulence` + `feDisplacementMap`, applied to a thin band above any "lit" element. **Animate `feOffset`'s `dy`, never `baseFrequency`** — animating baseFrequency regenerates the whole turbulence tile every frame and *boils* rather than flows. Keep `scale` at 4–6px; above 8 it stops being heat and becomes a Photoshop filter.

**4.3 Ember particles as *feedback*, not wallpaper.** 2,048 instanced GPU sprites, additive. **Particles only spawn from things the user is actually touching** — the CTA, add-to-bag, the hovered product. Emission coupled to scroll and cursor velocity. Each spark cools along `--ember-1000 → --ember-600 → --ember-200` over its life. Hard cap: 3% of viewport pixels, enforced in code. *Smoke that reacts is craft; smoke that ambiently drifts is a screensaver.*

**4.4 Typographic burn-off.** Headlines combust in rather than fade in. `@property --burn` animating a mask threshold on the compositor, blue-noise mask composited with `mask-composite: intersect`, a 6px ember glow on the leading edge, and variable-font weight animating 300→700 across the same 900ms so letterforms thicken as they burn. Reads as heat with not one wisp in it.

**4.5 Real filmed smoke — used only as a matte.** Shoot practical smoke against black at 120fps, then **never show the footage.** Use its luminance as a driver: as an alpha channel for a *different* layer, as a displacement source, or as an exposure modulator on product photos so they appear lit by passing smoke. VP9-alpha WebM with HEVC-alpha fallback, ≤1.4MB, load after LCP, skip on Save-Data.

**Governance:** one ambient effect per viewport, maximum. Total motion budget 4ms/frame. Everything degrades to a static gradient under `prefers-reduced-motion`.

---

## 5. SIGNATURE ELEMENTS

Ownable devices nobody in this category has.

### 1 · THE NEVER-CLOSED CLOCK
Persistent header module: live Las Vegas time, mono, tabular, hard 1s tick, next to a status word that never changes — `OPEN`. Below it, the delivery ETA for the visitor's detected zone.

**The depth is hour-band behaviour.** The site knows what time it is and merchandises accordingly:
- `06:00–16:00` **Daytime** — directions, walk-in, Grand Bazaar wayfinding, cigars promoted
- `16:00–23:00` **Evening** — hookah, party packs, "before you go out"
- `23:00–04:00` **Late Night** — page dims 8%, delivery promoted above directions, grid reorders to late-night bestsellers, copy shifts to second person and short sentences
- `04:00–06:00` **The Hours** — stripped, near-monochrome. One line: *"Still here."* This is the screenshot that goes on social.

Computed **server-side from Pacific time**, never from the device clock, which lies for travellers who haven't changed timezones.

> ⚠️ **Business precondition.** This component is only viable if the store is genuinely staffed 24/7. Lali Smokes is being publicly hammered for *"False advertising they say they're open 24 hours but they are definitely not."* A live clock that says OPEN when the door is locked is worse than no clock. **Verify before building.**

### 2 · THE HEAT CURSOR
The cursor carries thermal mass. Any element it rests on for >500ms begins to warm — an ember rim light on the edge nearest the cursor, plus a directional specular highlight on the product image that tracks cursor angle. Cools over 900ms, slower than it heated. **Touch equivalent:** the element nearest viewport centre is lit, and heat follows scroll.

### 3 · THE STRIP METER
Las Vegas Blvd abstracted to a single vertical line with nodes for the landmarks people actually name — Sahara, Wynn, Venetian, Caesars, Bellagio, Cosmo, **Grand Bazaar (you are here, in ember)**, MGM, Luxor, Mandalay. Drag along it and the ETA updates: `≈ 14 MIN`. Off-Strip zones branch as labelled stubs. A delivery-radius map that is also a toy — and it makes "we deliver anywhere in Vegas" legible in a way a paragraph never will.

### 4 · THE SHELF
A horizontally-panning product wall at true shelf proportions — products butted edge to edge, no cards, no drop shadows, just objects on a surface, because every SKU was shot on the identical setup. **The light source stays fixed in world space while the shelf moves**, so speculars travel across products as they pan, exactly as they would if you walked past a real lit shelf.

**Do not build this in 3D.** Pre-bake a **normal map per product**, generated offline from the product photography, and do Lambert plus a rim term in a **2D fragment shader**. It is an order of magnitude cheaper than 3D models, it loads as a second texture, and it honestly looks better — because it is derived from the real photograph rather than approximating it. On a tight budget, degrade to a 3-frame exposure cross-fade.

**This is why the photography shoot is a long-lead item.** The shelf needs clean cutouts on transparent backgrounds, shot on the identical setup. It cannot be assembled from existing catalog images, and it gates the whole creative phase.

Nobody can copy this without reshooting their entire catalog.

### 5 · THE HUMIDOR DOOR
Entering `/cigars` is not a route change, it is walking into the humidor. See §8.

### 6 · THE THERMAL RECEIPT
Cart and order confirmation rendered as a real thermal receipt — 58mm proportions, dot-matrix type, perforated top edge via CSS `mask` with repeating radial gradients, slight paper curl, `CASH ON DELIVERY` stamped at 12°. It turns cash-on-delivery from a trust liability into the most charming object on the site.

---

## 6. THE FOUR STRATEGIC FEATURES

These are product ideas, not decoration. Each one exists because research found an unserved job.

### 6.1 The hotel picker — and the meet-point, never a room number
**Over 98% of Strip resorts prohibit in-room delivery.** Wynn: *"All food-delivery services must coordinate delivery directly with the guest and meet at a main entrance."* MGM and Station properties require key cards to operate elevators — **drivers physically cannot reach guest floors.**

So the flow is:
1. **POI autocomplete, not street addresses.** Type `Bellagio`, not `3600 S Las Vegas Blvd`. *(Stolen from 7NOW, whose entire homepage is one address field with Google Places POI results. This is the single highest-leverage pattern in the whole report.)*
2. **Meet-point picker, pre-populated per property** — `Valet` / `Rideshare pickup` / `North tower entrance`. Stored as data against each hotel.
3. Phone number. Done.

No national app has built this. It is the most Strip-specific product decision available and it turns a constraint into visible competence.

**And it is necessary, not just nice — this was tested.** Querying open geocoders for Strip resorts:

| Query | What came back |
|---|---|
| `Bellagio, 3600 S Las Vegas Blvd` | **Two competing results 180 m apart**, both interior polygon centroids in the middle of a 77-acre resort. Neither is a porte-cochère, a rideshare zone, or a dock |
| `Caesars Palace, 3570 S Las Vegas Blvd` | Top result: **"Nobu Hotel at Caesars Palace"** — a boutique hotel *inside* the resort. Not a coordinate error, a disambiguation failure |
| `8925 W Russell Rd` (ordinary suburban address) | Exact house-number match |

**Open geocoding is fine for the valley and unreliable for the Strip.** That is precisely the failure that generates "the driver couldn't find me" tickets.

**Implementation, and it's cheaper than expected:**
- **Google Places exposes `entrances` and `navigationPoints`** — purpose-built fields for multi-entrance venues, each navigation point carrying a token you can hand to navigation. Nobody else has structured entrance data for these properties.
- **Seed the override table once** from those fields — a few hundred one-off calls, inside the free tier, so **$0** — then correct it from driver feedback. Key each row on the Google **place ID**, which is exempt from caching restrictions and can be stored indefinitely. Cache coordinates ≤30 days.
- ⚠️ **Fetch those fields separately, by place ID, outside the autocomplete session.** They are Pro-tier; requesting them at session close rebills the whole call at $25/1,000 with a 1,000/month cap instead of $5/1,000 with a 10,000 cap. Same trap applies to `displayName` — read the venue name off the autocomplete suggestion text client-side instead.
- **Do not build turn-by-turn.** Deep-link to Google Maps or Waze with the place ID. Free, zero maintenance, and drivers already know the interface.

**Total mapping cost at this volume: $0/month**, with roughly 3× growth headroom before the first dollar. Do not buy a Maps subscription plan — it's pure waste here.

### 6.2 Nicotine pouches are the hotel-room product
Strip resorts have deployed **Halo smart sensors that detect tobacco vape, not just cannabis.** MGM charges **$500 per room / $1,000 per suite**; Caesars $250–500. The shop already stocks ~20 pouch SKUs and merchandises them as a generic category.

Build **"Won't set off the sensor"** as a filter and a landing page. It is a genuine service, it sells a high-margin category nobody markets in Vegas, and it earns trust by warning people about a fee you have no obligation to mention.

### 6.3 The e-hookah is the hotel-room hookah
Hookah in a room is prohibited outright on fire-code grounds. Existing hookah caterers need **four hours' notice** and can't serve a room anyway. But the shop already stocks 9+ "hookah vape" SKUs nobody merchandises — Geek Bar Burj 80K, Olit Hookahlit Plus, Lost Mary E-Hookah 26K, Al Fakher Crown Bar.

**And `hookah las vegas delivery` has no smoke shop ranking on it at all.** Build `/hookah-delivery-las-vegas` on an honest premise: *"You can't smoke a hookah in your hotel room. Here's what actually works."*

### 6.4 Price-per-1,000-puffs on the buy box
Price is the *only* thing in every negative review. Competitors gate prices behind login (INEEDAVAPE) or show none at all (Lali), and Strip convenience stores famously don't use price tags at all. **Being the shop that shows the number is a differentiator here, not table stakes.**

Then add what no vape or cigar retailer displays: **price per 1,000 puffs.** A Geek Bar Burj 80K at $49.99 is **$0.62/1k**; a Flum Pebble at $32.99 is far more. This reframes a $49.99 sticker from "Strip gouging" to "cheapest thing on the wall" — using arithmetic, not adjectives.

### 6.5 Wayfinding as a product feature
*"So hard to find"* is in the reviews. Grand Bazaar Shops itself sits at **3.1 stars** with *"no directional markers"* as a recurring complaint, and Ole Red (4 storeys, opened Jan 2024) plus Bottled Blonde ($50M, opened Jun 2025) now physically obscure the mall from the Strip.

Build a **"Finding us at 2 a.m."** module: a three-photo night sequence (Ole Red facade → the turn → the storefront), walk time from each adjacent resort, and one line of orientation copy — *"Next to Ole Red, behind Bottled Blonde, across from the Bellagio fountains."* Nobody in this category has built a wayfinding component. The location is the whole strategy and customers can't find the door.

### 6.6 The hotel-proximity pages Lali is stealing with a lie
Lali Smokes ranks for `smoke shop near Bellagio / Caesars / Paris / Flamingo / MGM Grand` **from 710 E Flamingo Rd** — three-quarters of a mile off the Boulevard — while every page claims to be *"in the heart of the world-famous Strip."* Their site is otherwise a wreck: unreplaced theme demo testimonials reviewing **wireless earbuds** from *"Sarah, Jakarta"*, no prices on any product, and a `/cart/` page that renders nothing.

**Bellagio, Caesars, Paris, Flamingo and Harrah's are all at Puff Vegas's intersection.** Build the set with what Lali cannot fake: **real walking times, the real route including the Flamingo skybridge, and a night photograph of the actual entrance.**

---

## 7. HARD CONSTRAINTS THE DESIGN MUST ABSORB

These are not suggestions. Several are layout-defining.

### 7.1 The FDA warning is a 20%-of-area block, not a footer line
**21 CFR 1143.3(b)(2)** applies to *"Internet Web pages"* explicitly. On every **vape, e-liquid and hookah** listing the warning must:

> **WARNING: This product contains nicotine. Nicotine is an addictive chemical.**

- occupy **≥20% of the area of the advertisement**
- sit in the **upper portion** of it
- be **≥12pt**, **Helvetica or Arial bold**, **black-on-white or white-on-black**
- be enclosed in a rectangular border **3–4mm** wide, same colour as the text

**Cigars and pipe tobacco are exempt** — the requirement was vacated in *Cigar Ass'n of Am. v. FDA*. Cigarettes carry FCLAA Surgeon General warnings instead.

**Design implication:** this is a major, permanent, high-contrast block on the majority of PDPs. It fights the dark-first art direction directly. **Design it as an owned element from the start** — a white-on-black bordered plate in the upper zone that reads as deliberate typographic furniture rather than a legal wart. Do not let it be retrofitted.

### 7.2 The age gate must never block content
Paid acquisition is banned; losing organic is losing the business. Four tiers:

| Tier | Trigger | Mechanism |
|---|---|---|
| **0 · Page view** | Never gates | Persistent **non-modal 48px banner**, server-rendered in the first byte, *in the document flow* — no overlay, no CLS, no focus trap, no scroll lock. Works with JS off as a form POST |
| **1 · Purchase intent** | First add-to-cart / reserve / start-delivery | Bottom sheet, one tap, both controls in the thumb arc. **No DOB here.** The action the user took completes automatically on affirm — never make them repeat it |
| **2 · Checkout** | Order placement | DOB as a masked `MM/DD/YYYY` field, `inputmode="numeric"`, auto-advancing. **Never a date picker. Never a 100-option year dropdown.** Plus §7.3 |
| **3 · Fulfilment** | At the door / at the counter | Physical ID scan. Told to the customer **three times before it happens** so it is never a surprise |

**Explicitly refuse to build:** full-screen blocking overlay · scroll lock · blurred content behind the gate · DOB before browsing · birth-year dropdown · re-prompting every session · **gating the address, hours, or phone number** (a 2 a.m. user must always be able to call).

The cookie is read **server-side** so the collapsed state renders in the first byte. A JS gate that flickers in after paint is the most common technical failure in this category.

**How it caches — the part that makes this shippable.** Varying HTML by cookie normally destroys edge caching, which would be fatal on a site whose only channel is organic. The fix: **edge middleware reads the signed cookie and does not redirect** — it passes through, normalising the cookie to a single bit and injecting a request header. The response varies on that one normalised value, so you get **exactly two cached static variants per URL** rather than one per user. Both serve from edge cache, LCP is untouched, and hit rate stays high. Middleware cost is 1–5ms.

**Two specialists disagreed here, and the resolution matters.** The engineering recommendation was a server-rendered full-viewport overlay collecting date of birth — more defensible, and safe from cloaking risk because the content stays in the DOM for bots and humans alike. The UX recommendation was the non-blocking banner. **The banner wins**, for one reason: the homepage gate is *not* the legally load-bearing control. Nevada's NRS 202.24935 database check at order and the ID scan at the door are (§7.3). Given that, and given that organic search is the only acquisition channel that exists, there is no justification for paying a 15–35% bounce cost for a control that carries no legal weight.

**But the engineering mechanism wins on every implementation detail:** server-rendered so it paints with the first byte, a form POST so it works with JavaScript disabled, cookie normalised to one bit so the CDN still caches, content in the DOM for everyone, `inert` applied beneath any sheet that does overlay, and every affirmation logged server-side with timestamp, hashed IP, user agent and cookie ID.

> **Say this plainly to the client:** anyone who tells them a homepage overlay *is* compliance is selling them something.

### 7.3 Nevada requires third-party database age verification at order
**NRS 202.24935** applies to *every* sale of tobacco, vapor or nicotine products to a Nevada consumer *"through the use of a computer network."* No in-state carve-out, no own-driver carve-out. It requires full name, DOB and residential address verified *"through an independent, third-party age verification service"* against commercially available databases **during the ordering process**, plus **annual certification to the Nevada Attorney General**.

**A self-attested "I am 21" checkbox is not compliant in Nevada.** Penalty is up to $1,000 per violation plus licence suspension, and a violation is a deceptive trade practice.

> **This modifies Tier 2 above.** A DOB field alone is insufficient for any order placed online. Budget for an AgeChecker.net/Veratad-class integration in the order flow, and design the state where verification *fails* — it must be graceful, non-accusatory, and route to in-store pickup.

**At the door, Nevada is stricter than federal:** NRS 370.521(3) requires **scanning technology** — not an eyeball check — for anyone appearing **under 40**. (Federal law raised its own ID-check threshold from under-27 to **under-30** effective 30 Sep 2024; any SOP still saying 27 is stale. Nevada's 40 governs regardless.)

**One piece of good news.** NRS 202.249(4) **preempts local tobacco regulation** — no Nevada city or county may impose age-verification rules stricter than the state's. Clark County and the City of Las Vegas cannot add a layer. *(An ordinary local business licence is still required, and note the Strip is unincorporated Clark County, not the City of Las Vegas — a detail that catches operators out.)*

**The verification stack, priced:**

| Layer | Recommendation | Cost |
|---|---|---|
| **At checkout** *(third party legally mandatory — you may not build this)* | **AgeChecker.net**, $25/mo + $0.50 per *accepted* verification. Only vendor here with a small fixed floor, charges nothing for declines, and is built as a vape-ecommerce plugin rather than a general KYC platform. Veriff is $0.80/verification on a $49/mo minimum; IDScan's DIVE starts at $200/mo | ~$75–275/mo |
| **At the door** | Either **VeriScan Basic** at $380/yr, or a **DIY scan** — Google ML Kit or Apple Vision decode PDF417 on-device for free, and there are several MIT-licensed AAMVA parsers. This satisfies the literal text of NRS 370.521(3), which asks for *"a scanning technology or other automated, software-based system"*, not a certified vendor | $0–380/yr **per driver** |
| **Licence** | Nevada tobacco retail dealer licence | $50/yr |

⚠️ **Two traps.** VeriScan is priced **per device, not per location** — five drivers on Premium is $3,500/yr, not $700. And **BlueCheck appears to be out of business**; its domain now redirects to a parking page with no captures since late 2024. Do not put it in a vendor shortlist.

**What DIY does not buy you is fake-ID detection.** A cloned licence with a well-formed barcode parses cleanly and passes. Given NRS 370.521(7) escalates licensee penalties to **$2,500 → $5,000 → $7,500 → $10,000** when an *employee* makes an underage sale, and the Attorney General runs random unannounced inspections, the pragmatic stack is: DIY scan + physical card inspection in driver training + an immutable scan log you can produce in a sting.

🔴 **Before signing with AgeChecker:** their marketing describes *"public records, credit information, and other sources"* — which is not the statutory phrase. Get written confirmation that their database satisfies 15 U.S.C. § 376a(b)(4)(A)(iii)(II)'s *"primarily from government sources"* standard. They market FDA and state-law compliance and do not mention the PACT Act anywhere.

### 7.4 🔴 Automated outbound SMS does not exist for this business

**This corrects an earlier assumption in this brief and kills several otherwise-good UX ideas.**

Twilio's US SMS guidelines list **SHAFT** violations as prohibited — Sex, Hate, Alcohol, Firearms, **Tobacco** — and separately name **"Vape" as a restricted use case across long codes, short codes and toll-free.** Twilio's guidance draws **no transactional-versus-promotional distinction.** Klaviyo's AUP independently restricts *"vaping/e-cigarettes, THC, and related paraphernalia products"* on SMS.

Translation: a *"your driver is 5 minutes away"* text is, as far as US carrier A2P filtering is concerned, prohibited content. Build on it and it will be silently filtered, then terminated.

**The line to draw — and it matters, because one half survives:**

| Channel | Status | Why |
|---|---|---|
| **Customer texts the shop's real phone** | ✅ **Keep** | Person-to-person, not A2P. Carrier filtering doesn't apply. *"Text us a photo of what you want"* remains one of the best ideas in this brief |
| **`sms:` links that pre-fill a message in the customer's own app** | ✅ **Keep** | The customer sends it from their own device. No platform involved |
| **Voice calls, inbound or outbound** | ✅ **Keep** | Voice is not subject to A2P content filtering. This is the failed-handoff fallback |
| **Automated outbound: order confirmations, ETA updates, tracking magic links, receipts, marketing** | ⛔ **Prohibited** | A2P. This is the part that must be rebuilt |

**The replacement stack — which is genuinely better anyway:**

1. **Web Push (VAPID)** as the primary channel. Free, no carrier involvement, no vendor policy exposure, instant. The site is a PWA already; *"your driver is close"* is the highest-value message and web push delivers it natively.
2. **The live tracking page itself** as the main experience — a URL the customer keeps open. On a 25-minute delivery that is realistic behaviour, and it is exactly where the live-clock and live-ETA work pays off.
3. **Transactional email via Amazon SES** ($0.10/1,000) for confirmation and receipt.
4. **Voice call** for a failed handoff — the driver just calls.

**Three things that close the remaining loopholes:**

- **WhatsApp Business API is out too.** Tobacco is a named forbidden vertical in Meta's commerce policy and in Twilio's WhatsApp vertical list. *(A customer messaging your ordinary WhatsApp number is a different thing — that's still person-to-person.)*
- **The rejection is permanent, not a retry.** Twilio has a dedicated error code for this — **30958, "SHAFT — Tobacco or vape products"** on 10DLC, **30458** on toll-free — and both are classed **ineligible for resubmission**. Vendors don't build granular taxonomies for failure modes that don't happen at volume. Rejection criteria explicitly include *"campaign descriptions, sample messages, website content, and any linked URLs"* — so neutral copy doesn't help, because the tracking link points at a vape site.
- ⚠️ **Do not register a separate "delivery logistics" brand to route around it.** That is exactly what T-Mobile's **$1,000 Program Evasion** fine and Twilio's excessive-EIN check exist to catch, and it edges into misrepresentation to the carrier. For context on the stakes: T-Mobile's SHAFT content violation fine is **$10,000**, passed straight through to the merchant, on a business that would be sending about $30/month of traffic.

> **Design consequence.** The confirmation screen and the tracking page have to carry the entire post-purchase experience, because there is no text message backstopping them. That raises the stakes on §11's *"the ETA is the largest text on the page"* considerably — and it means the **push-permission prompt is a designed moment**, not a browser default. Ask for it on the confirmation screen, after the order is placed, with a reason: *"So we can tell you when the driver's outside."*

### 7.4b No native app. No Apple Pay or Google Pay buttons on the web.
Apple Guideline 1.4.3 and Google Play both bar tobacco-sale apps → **build a PWA.** Apple Pay's web terms and the Google Pay APIs independently ban tobacco and vaping products regardless of processor. **Design no wallet buttons.** (In-store and doorstep taps on Square hardware are ordinary card-present transactions and are fine.)

### 7.5 Google Business Profile cannot show prices
GBP restricted-content rules bar pricing, deals, coupons and purchase links for regulated goods. The Products tab is unusable. Plan the GBP surface accordingly.

### 7.6 Imagery must not read as youth-appealing
No cartoons, characters, candy motifs. All models visibly 30+. Keep flavour imagery product-literal. **This directly constrains the flavour-swatch palette in §9** — keep it muted and adult, never candy-bright.

---

## 8. THE DUAL-BRAND PROBLEM

Vape culture (loud, neon, young) and cigar culture (quiet, aged, luxurious) repel each other visually. The failure mode is treating this as two brands sharing a logo.

**The correct model: one room with a humidor in the back.**

### 8.1 The bridge is physical, not stylistic
A lit cigar cherry and a vape coil at temperature glow at roughly the same colour temperature. **Combustion is the shared ancestor of both cultures.** The unifying element is the ember — not a font, not a layout, not a vibe. Doctrine line: *"Everything we sell is a way of making light."*

### 8.2 Structure is invariant; exactly three variables move
The grid, type scale, photography setup, icon system, nav, cart and delivery module are **byte-identical** across both worlds. Three things change, all from one token:

```css
:root { --temp: 0; }                    /* 0 = floor (vape) · 1 = humidor */
[data-zone="humidor"] { --temp: 1; }

:root {
  /* 1. Accent rotates ember → cedar */
  --accent: color-mix(in oklch, #FF5A1F calc(100% - var(--temp)*100%), #C08A4A);
  --ground: color-mix(in oklch, #0E1012 calc(100% - var(--temp)*100%), #150F0A);
  /* 2. Pace: everything slows in the humidor */
  --dur-1: calc(125ms + var(--temp) * 115ms);
  --dur-2: calc(250ms + var(--temp) * 230ms);
  /* 3. Density: columns and gutter breathe */
  --cols:   calc(6 - var(--temp) * 4);      /* 6-up floor → 2-up humidor */
  --gutter: calc(16px + var(--temp) * 32px);
}
```

Plus one typographic swap: display grotesque → Newsreader/Signifier **inside `[data-zone="humidor"]` only**, on headings and product names, never on UI chrome.

Same skeleton, different metabolism. Nothing structural changes, so the eye reads it as *the same place, later at night*.

### 8.3 The threshold is a designed event — "The Humidor Door"
700ms transition: `--temp` animates 0→1, film grain coarsens 2.5%→4.5%, the ambient layer switches from ember-tinted smoke to still air. A quiet persistent affordance top-left reads `← BACK TO THE FLOOR`.

**Making the shift explicit and spatial is the entire trick.** Users enjoy a change they walked through. They are disoriented by a change that happens to them.

### 8.4 The quarantine rule
**No viewport may contain both a vape-neon accent and a cedar accent above 5% combined area.** Cross-links between worlds go through neutral monochrome cards only. Lint it if possible.

### 8.5 The constants
Five modules are identical everywhere and carry the coherence: **the clock**, the **delivery/ETA module**, the **cash-on-delivery badge**, the **wordmark**, and the **grain**. Always present, never changing — the way a magazine keeps its folio identical across wildly different feature spreads.

---

## 9. INFORMATION ARCHITECTURE

### 9.1 Three shopper species, three incompatible browse grammars

| | Primary axis | Behaviour | Decision time |
|---|---|---|---|
| **Vape** | Flavour, brand | Scanning hundreds of near-identical SKUs; recognition over recall; *"the blue one"* | 20 sec – 2 min |
| **Cigar** | Brand | Reading specs, comparing, filtering a tree | 5 – 30 min |
| **Glass / hookah** | Visual form | Pure visual grid-scanning, almost no text | 1 – 10 min |

One taxonomy serves none of them. The classic failure is forcing everything into one nav tree with one facet rail — you end up with a cigar shopper filtering by "flavour" and a vape shopper filtering by "ring gauge," and both bounce.

### 9.2 One product graph, four departments, four PLP archetypes

**Data layer (shared):** common core — `id, title, brand, price, images, stock_state, stock_checked_at, department, delivery_eligible, in_store_only, regulatoryClass` — plus a **polymorphic attribute block** defined per department.

**Presentation layer (divergent):**

| Department | PLP archetype | Detail |
|---|---|---|
| **Vape** | **Chip & Swatch** | Horizontally-scrolling facet chips at the top, *not* a left rail. Flavour family as colour swatches. Nicotine strength as a permanent segmented control — `0 · 3 · 6 · 20 · 50mg`. Dense 2-up grid, flavour name at 17px, colour-coded flavour band |
| **Cigar** | **Spec Table** | Left rail on desktop, full-screen filter sheet on mobile with live counts. **List, not grid**, with an inline spec strip: `Maduro · Full · 6×52 · Nicaragua · $14.50 single`. Comparison tray docked at the bottom |
| **Glass / hookah** | **Gallery** | Masonry, images at 2× the vape cell size, minimal chrome, price as a small overlay. Exactly four filters: price, size, style, type. Nothing else |
| **Cigarettes / lighters / accessories** | **Utility List** | Flat, text-dense, by brand. Nobody browses these. Optimise for scanning speed, not delight |

**Navigation:** a persistent **department switcher** as top-level nav — five items, always visible, **bottom tab bar on mobile. Not a hamburger.** The mental model is *"which store am I in,"* and switching stores swaps the entire browse grammar.

**Escape hatches** that ignore taxonomy: `Deliverable now (≤40 min)` · `Under $20` · `New this week` · brand hubs · **flavour hubs** (`/vape/flavors/blue-razz` aggregates across brands — how vape shoppers actually think, and an enormous long-tail SEO asset) · `What we sell most at 2am`.

**Search spans everything but groups by department** with a header per group. Never a flat blended list — that forces the cigar shopper to wade through disposables.

### 9.3 Stock is a confidence claim, not a boolean
The client will not have clean inventory data — thousands of flavour SKUs, manual receiving, three shifts, 24-hour operation. Any design assuming a trustworthy `in_stock` boolean will systematically lie.

| Tier | Badge | Action |
|---|---|---|
| **A · Verified** | `✓ On the shelf · counted 22 min ago` | Hold it / Order it |
| **B · Expected** | `Usually in stock` | Hold it — we'll confirm in 5 min |
| **C · Low** | `Only 1–2 left · we'll confirm` | Hold it / Text to confirm |
| **D · Unknown** | `Not sure — we'll check for you` | **Text us — we answer in minutes, 24/7** |
| **E · Out** | `Out right now` + restock estimate | Notify me + alternates rail |

**Provenance is always visible.** *"Counted 22 minutes ago"* is what makes tier A credible and tier B honest. The confidence window is velocity-adjusted: `window_hours = clamp(24 / max(daily_velocity, 0.2), 1, 168)`.

**The human-in-the-loop layer is the actual solution — and it is uncopyable.** The store is staffed 24 hours a day. *That is an inventory system.* A `Check for me` button on tiers B/C/D drops a task on the counter tablet with product image, SKU and shelf location, and two buttons: `✓ Got it` / `✗ Out`.

---

## 10. THE TRUST SYSTEM

### The Strip Fair Price Promise — four lines, on every PDP and in the cart

> 1. **Same price in store, online, and delivered.** No tourist pricing.
> 2. **Every price is on the website.** No "ask us." No "call for price."
> 3. **The number you see in the cart is the number you pay.** Tax and delivery included before you commit.
> 4. **Beat our price anywhere in Vegas? We'll match it.**

Each line links to a page that proves it. *A promise without a proof mechanism is marketing.*

**`/prices` — a public, crawlable, plain-HTML price list** of the top ~150 SKUs, timestamped and sortable. Radical, and radically effective: the most convincing anti-gouging artifact possible, a link magnet, it ranks for `[product] price las vegas`, and it makes the store legible to a skeptical tourist in one screen. **Competitors will hate it. That's the point.**

**Delivery economics before the menu.** Fee surprise is the documented #1 delivery failure in this market — Smokes Mart charges **$30 online vs $7 by text**, admitted publicly by their own owner; another customer paid **$41 in fees at 12 miles**; a 45-minute promise took 2 hours. Fixed header strip: `Free delivery to Strip hotels · No minimum · Cash at your door · Open now`.

**Use a window, not a countdown.** `Delivery by 2:40–2:55 AM` reads as a commitment; a ticking timer reads as a guess.

**Cash mechanics, stated.** Checkout computes **"Bring $47 cash"**. Confirmation and tracking both state `Driver carries change for up to $100.` One sentence, biggest friction in the cash flow removed.

**On Zelle for tips — keep the idea, but draw the line precisely.** A competitor's customer explicitly praised being able to tip by Zelle when they had no cash, and it is a genuinely good touch. But it works **only as a customer-to-driver transfer on the driver's own account** — structurally identical to handing over cash. It must never become the rail for the order itself, and it must not run through a business account. Consumer P2P rails (Zelle, Venmo, Cash App) prohibit business use for restricted goods, and **Cash App Pay specifically prohibits MCC 5993 — Cigar Stores and Stands**, which is this merchant's code. Surface it as *"your driver can take a tip in cash or by Zelle"*, never as a payment method at checkout.

**Tipping: opt-in, default zero, no guilt ladder.** `$0 / $3 / $5 / Other` with **$0 pre-selected and not styled as the shameful option.** The dark-pattern tip screen is the fastest way to become the thing you're differentiating against.

**Authenticity.** `/authentic` page with the authorized-dealer list, photos of what counterfeits look like, and scan-to-verify. Plus **a public "we don't sell" list** — naming what you refuse to stock is a stronger signal than listing what you do.

**Reviews unfiltered and recency-sorted, including the bad ones**, with owner responses visible, linking out to the Google profile. A 4.6 with visible 2-star reviews and thoughtful replies converts better than a suspicious 5.0 — and the current Google profile is **97.3% five-star with more 1★ than 4★ across 2,791 reviews**, while Yelp has suppressed 62 reviews against 38 shown. **Do not build the rebuild on "4.9 stars."** Build on things that are checkable.

### Anti-pattern list — things this site will never do
Countdown timers · "3 people are viewing this" · fake low-stock urgency · pre-checked add-ons · newsletter modal on entry · hidden fees · subscription auto-enrollment · "only 2 left" when 40 are on the shelf · price varying by device or geography · carousels anywhere.

---

## 11. MOBILE & PERFORMANCE

85%+ mobile, one-handed, on congested Strip cell or hotel wifi, sometimes impaired.

- **`tel:` links dial immediately.** No confirmation dialog, no intermediate contact page. The phone number is in the initial HTML of every page so it survives total JS failure.
- **Walking minutes, never driving minutes, never miles.** *"6 min walk from the Bellagio fountains."* A Strip block can be a 12-minute walk.
- **Landmark-first addressing.** *"Grand Bazaar Shops, next to Ole Red"* before the street number, every time.
- **Room number accepts anything** — `29-114`, `PH4`, `Villa 7` are all real Vegas formats. `inputmode="numeric"` for the keyboard, validation length 1–10 and nothing else.
- **Login-free order tracking, no account, no password.** Assume the tab may be gone the moment they hit confirm, and that **you cannot text them a link** (§7.4). So the durable artifact is a **web-push subscription plus an emailed link**, and the tracking URL must be long-lived, guessable-proof and openable from history. Prompt for push on the confirmation screen with a stated reason.
- **The confirmation ETA is the largest text on the page** — 48px+, readable across a hotel room, because the phone is going face-up on the nightstand.
- **"Text us a photo of what you want."** For an impaired user, a non-English speaker, or someone who doesn't know the product name, this is the *only* path that works.
- **Zero-result search never dead-ends.** *"We probably have it — we just might call it something else."* Then `[Text us a photo]`, three category guesses, and the phone number.
- **Undo instead of confirm.** Removing a cart item happens immediately with a 6-second `Removed · Undo` toast.
- **Language toggle visible, never automatic.** ES, PT, JA, KO, ZH. Auto-redirect by IP or `Accept-Language` is always wrong for travellers.
- **Human units for puff count.** Under `9000 puffs`: *"about 5–7 days for a pack-a-day smoker."*
- **Cigar and glass photography with a scale reference.** Ring gauge is an abstraction nobody can visualise; a 14" bong and a 7" bubbler look identical on a phone.
- **"Singles" as a top-level cigar destination**, not a filter value. Tourists don't buy boxes.
- **Shelf-edge QR codes → `?ctx=shelf` mode.** Strips the nav, shows big price / stock / specs and one button: `Ask a staff member about this`, which pings the counter tablet with the SKU and aisle. Turns the store into a traffic source for the site — and works on cellular when store wifi is congested.

### The performance budget, enforced

Measured on a **mid-tier Android on throttled Slow 4G** — not on a MacBook. Enforced by Lighthouse CI plus `size-limit` as a **blocking** check on every PR. *A budget that doesn't fail the build is a wish.*

| Metric | Target | Hard ceiling |
|---|---|---|
| LCP | ≤ 2.0s | 2.5s |
| INP | ≤ 150ms | 200ms |
| CLS | ≤ 0.02 | 0.05 |
| Critical-path JS, gzipped | ≤ 100KB | 120KB |
| Total initial transfer | ≤ 350KB | 400KB |
| WebGL bundle (lazy, post-LCP) | ≤ 150KB | 200KB |

**Three tiers.** *Tier 0*, everyone: server-rendered HTML, static AVIF hero, CSS-only motion — browse, search, order and track all work before a line of JS executes. *Tier 1*, most phones: CSS/SVG motion and scroll-driven animation via native `animation-timeline: view()`, zero JS, compositor-threaded. *Tier 2*, capable devices only: the WebGL layer mounts after LCP settles, inside `requestIdleCallback`.

**The adaptive governor — the part most teams skip.** Static capability detection is unreliable; a flagship phone in a hot car throttles like a budget one. Run the shader for ~500ms, measure real frame times, and if the median frame exceeds 20ms, **downgrade the tier and persist that decision** so the next visit starts correctly. Re-probe weekly. This is what makes shipping the WebGL layer safe at all.

**Shader economics:** render at 0.5–0.75 DPR and upscale via CSS (undetectable on an ambient noise field, 2–4× cheaper); cap the ambient layer at **30fps, not 60**; pause on `IntersectionObserver` and `visibilitychange`; single fullscreen quad, no geometry.

**The LCP element must never be the canvas.** It is a preloaded AVIF hero or a text headline, with the WebGL layer behind it arriving late. Zero third-party scripts before first paint.

**The live clock is a CLS risk.** A ticking element that reflows the header once a second fails CLS on its own. Fix it by construction: server-render with a fixed-width placeholder, `font-variant-numeric: tabular-nums`, and a **fixed character count** so the element's width can never change. Hydrate after paint.

**And the floor:** the entire critical path — hours, address, phone, directions — must work with **zero JavaScript**.

---

## 12. SEARCH & DISCOVERY

Organic, local and AI search are the *only* acquisition channels this business has. So this is not a marketing appendix — it is a design constraint and a P0 operations list.

### On the "site is unreachable" finding — corrected

An earlier draft of this brief led with a P0 outage. **That was wrong, and here is the evidence against it.**

Three research workstreams got `ECONNRESET` fetching `puffvegas.us` directly. But a fourth **successfully retrieved the entire site through a third-party reader proxy at the same time** — 641KB of raw HTML, working product pages, live prices. Almost every specific on-page detail in this brief came from that fetch. One of those workstreams also logged the actual error as a **Zscaler 403**, i.e. an egress web filter, and a smoke shop is exactly the category such a filter blocks.

**A proxy succeeding while three datacenter IPs get reset is the signature of IP/category-level filtering on the research network — not an origin outage.** The site is very likely fine for real users and for Googlebot.

**Resolved — confirmed first-hand.** On a non-school connection the site returns **HTTP 200, 624KB**. It was never down. Close the item.

### Verified first-hand against the live homepage

Everything below was checked directly against the served HTML, not through a proxy or an agent:

| Claim | Status |
|---|---|
| `<title>` carries a double space — `Las Vegas Strip Smoke  Shop 24/7` | ✅ confirmed |
| **Zero JSON-LD on the page.** No `LocalBusiness`, no `openingHoursSpecification` | ✅ confirmed — `0` blocks |
| `Daily 10:00 AM — 7:00 PM` in the contact block | ✅ confirmed verbatim |
| …while the body copy says the shop is open 24 hours | ✅ confirmed in **four** places — *"Open 24 hours, this shop offers…"*, *"Open 24/7, offering trusted vape…"*, *"open 24 hours as well."*, *"open 24 hours to accommodate the…"* — plus `24/7` in the `<title>`. **Both halves of the contradiction verified first-hand** |
| "Free Returns" badge | ✅ appears twice |
| Unsplash stock headshots on testimonials | ✅ four of them |
| Empty "Top Categories" and "Bestseller Vapes" headings | ✅ both present |
| Own site says suite `611-612-613` | ✅ confirmed — the third NAP variant |
| Broken brand name `Pu vegas.us` | ✅ confirmed — but **on the returns page, not the homepage.** The homepage contact block reads `puffvegas.us@gmail.com` correctly. `/products/pages/returns` returns HTTP 200 and contains *"the responsibility of the customer until they are received by **Pu vegas.us**"* — the "ff" dropped by a botched find-and-replace |
| Returns policy is a dropshipper template | ✅ confirmed — the page twice promises to ship items *"back to **our warehouse**"* and makes the buyer *"responsible for shipping charges"*. **This is a live invitation to mail nicotine products interstate**, which under 18 U.S.C. § 1716E is exactly the language that constitutes statutory "reasonable cause" (§7). Highest-priority copy deletion on the site |

**And two findings that came out of reading the live source, not from any research pass:**

1. **The hours are not a typo — the whole contact block is an unedited platform demo default.** Its internal `sourceId` is literally `demo_default_location`. Nobody entered the wrong hours; nobody ever opened that block. That reframes the fix: it isn't a copy correction, it's an untouched template that has been shipping to customers since launch.
2. **Every social link is a placeholder.** The Facebook link points to `http://facebook.com` and Instagram to `https://www.instagram.com` — the bare root domains, not the store's profiles. Both social icons on the site are dead ends, which also costs the `sameAs` entity signals the schema work in §12 depends on.

### The single highest-leverage fix takes 90 seconds

**The Google Business Profile's primary category is "Smoke shop." All three winners in the delivery local pack use "Tobacco shop."** Primary category is the top-weighted local ranking factor. Change it.

Because here is the thing that reframes the whole picture:

| | Google rating | Reviews | Primary category |
|---|---|---|---|
| **Puff Vegas** | **4.9** | **2,791** | Smoke shop |
| Metro Smoke & Vape 24/7 | 4.9 | 507 | Tobacco shop |
| Gold Rush | 4.8 | 428 | Tobacco shop |
| Smokes Mart | 4.8 | 412 | Tobacco shop |

**Puff Vegas has 5.5× the review volume of its strongest competitor and the best rating — and it does not appear in the local pack for `cigarette delivery las vegas hotel` at all.** That is a configuration problem, not a content problem, which is very good news: the highest-ROI work here is nearly free.

Three causes, in order: wrong primary category · **the profile advertises "In-store pickup" and nothing else**, with no Delivery attribute and no service area, so on a delivery query Google has no signal that this business delivers · no delivery page anywhere on the site to corroborate it.

**And the review-topic chips prove it.** Google auto-generates them by mining review text. Puff Vegas's chips are `easy access (112)`, `cigar selection (92)`, `elfbar (32)`. Across **2,791 reviews there is no "delivery" chip and no "24 hours" chip.** Google is looking for topical association with the two things this business most wants to rank for, and finding nothing.

### Corrections to earlier sections of this brief

- **§0.4 overstated the hours problem.** The **GBP is correct** — it says "Open 24 hours," and Maps even shows a live "a little busy" reading at 3am. The `10:00 AM — 7:00 PM` contradiction lives on the **website only**. That's still serious, because the website is what Google reconciles the profile against, but the profile itself doesn't need fixing.
- **§7.4's SMS ban catches the review-generation plan.** A post-delivery "please review us" text is A2P marketing and is prohibited. Use the in-person QR at handoff, a printed card in the bag, and the emailed receipt instead.

### Rules that constrain the page design

- **Never build a `/smoke-shop-near-me` page.** "Near me" is resolved to the user's coordinates and served from the local index. A page targeting it is a textbook doorway. Win near-me with the GBP.
- **Do not use the GBP Products module.** Google's policy bars *"content related to regulated products and services, including alcohol, tobacco products."* Violations risk **suspension of the entire profile** — and with 2,791 reviews at stake that is an extinction-level event. Communicate inventory through Posts and Photos instead.
- **Do not stuff the business name.** A competitor has jammed "24/7 DELIVERY" into theirs and it is working — but it violates guidelines and is not worth the risk here. File redressal reports against them instead; it's legitimate and underused.
- **There is no `TobaccoShop` schema type.** Verified — it 404s, and it is absent from the full 32-type `Store` subtype list. Use `["Store", "LocalBusiness"]`. **Do not use `LiquorStore`** — it's the nearest-looking option and it is factually wrong.
- **Do not mark up your own `AggregateRating`** on your own LocalBusiness. Google's guidance restricts that to sites reviewing *other* businesses. Render reviews as visible text — which helps AI extraction anyway — without the markup.
- **Implement `FAQPage` even though the rich result won't show** (Google restricted it to government and health sites). LLMs parse it heavily.
- **One indexable URL per product *model*, not per flavour.** There are currently **66 `elfbar-bc5000-*` URLs** for a single product line, plus naming chaos — `elfbar`/`elf-bar`/`bc5000` as three prefixes, `backwood` vs `backwoods`, `airbar` vs `air-bar`, and a live misspelling in two URLs (`american-sprit`). Consolidate to `/p/elf-bar-bc5000/` with flavour as a variant control, expressed as `AggregateOffer` with `offerCount`.

### The hotel pages — the anti-doorway design

This is where programmatic page sets die. Google defines doorway abuse as pages *"created to rank for specific, similar search queries."* A template that swaps a hotel name into three sentences is exactly that.

**The unique-content engine is delivery logistics, and there's proof it's needed.** A Reddit thread ranking on the target SERP says of Strip hotel delivery: *"They cannot deliver to your room. You have to meet them at the…"* That is the single most common friction point for this exact customer, and **nobody has documented it per property.**

Every hotel page carries eight non-templatable data points, sourced from the drivers: the **actual handoff point** at that property · realistic ETA from dispatch history, peak and off-peak · walking route with landmarks and a real minute count · whether that property sells tobacco on-site and at what markup · that property's smoking policy · the nearest self-service alternative · **what guests at that property actually order**, from real data · and a **driver-shot photo of the handoff point**.

**Governance: build 8, not 40.** Ship the walkable tier, measure for 45 days, expand only where demand shows. Every page hand-reviewed. **If a page cannot honestly carry all eight points, do not publish it.** And never claim proximity you don't have — pages for Mandalay Bay or Resorts World lead with *delivery*, not walking. A tourist detects "steps away from Mandalay Bay" as a lie in five seconds, and that is precisely what turns a programmatic set into spam.

### Domain: buy the `.com`, but migrate second

`puffvegas.com` sits on an Afternic brokered listing — negotiable, not a ransom. **Buy it.** The tourist who saw the storefront types `puffvegas.com` at 1am, hits a GoDaddy lander, concludes the business has no website, and goes to a competitor. That loss is silent, permanent, and appears in no analytics. Every offline touchpoint — bags, receipts, signage, the driver's car — leaks it. Anchor low; hard walk-away around $15k.

**But do not migrate at the same time as the rebuild.** Changing platform, URL structure and domain at once means that when traffic drops you cannot tell which variable caused it and you have no clean rollback. Rebuild on `.us` first, let metrics recover to baseline, *then* execute the domain move as a pure 1:1 host swap — every path identical, only the hostname changing. That is the lowest-risk migration that exists.

### Skip hreflang

It maps alternate language versions of the same page; there are none, and maintaining 40 hotel pages × N languages is enormous content debt for pages whose entire value is hyper-local operational detail that doesn't vary by passport. The international tourist searching for a smoke shop *in Las Vegas* is usually searching in English, is physically in the US, and is served by a geotargeted local result.

Invest instead in **plain, unambiguous English** — short sentences, no idiom — which serves international readers, machine translation and LLM extraction simultaneously. Then check Search Console at 90 days; if Spanish demand is real, translate the top five pages *only*, and add hreflang for just those.

### The compliance firewall
Move THCA and kratom to `/alt/` with their own navigation and disclaimers, and **no cross-linking to the core commercial architecture.** These categories carry GBP-suspension and payment-processor risk that ordinary vape retail does not. **2,791 reviews is worth far more than the margin on kratom.**

### The three metrics that matter
The phone is the conversion, not the cart. Track **clicks-to-call**, **direction requests**, and **delivery orders attributed to organic**. Explicitly de-prioritise sessions, keyword counts and domain authority. *A 2am delivery call from a Bellagio guest is worth more than a thousand sessions.*

---

## 13. THE BUILD SUBSTRATE

Not a design section, but it constrains what the design can assume.

### Stay on Ecwid. Go headless over it.

The decisive fact: **Lightspeed/Ecwid's Acceptable Use Policy prohibits exactly one product category — firearms.** Tobacco, vape, nicotine and paraphernalia are not mentioned anywhere in the prohibited list. Puff Vegas is already on a compliant platform with 223 actively-maintained products. **Do not migrate the commerce backend** — catalog migration is where these projects die.

| Option | Verdict |
|---|---|
| Ecwid + a custom theme | Fails the creative brief — themes cannot deliver The Shelf or the motion system |
| **Headless Next.js over the Ecwid REST API** | ✅ **Recommended.** Total design freedom, owner keeps the admin they already know, ~$200/mo |
| Shopify with vapes excluded | Rejected. Excluding vapes guts the catalog — that *is* the business. Shopify's *platform* AUP allows tobacco; Shopify *Payments* defers to Stripe, which doesn't. That gap is a trap |
| BigCommerce | **Policy is fine** — its AUP has no product list, and it carries a "Highly Regulated Products" section that explicitly disclaims liability for *"third-party service provider policies affecting regulated products."* Rejected only because migrating a working 223-product catalog buys nothing here |
| Square Online | Rejected. Square's Payment Terms item **(24)** bars *"internet/mail order/telephone order of age restricted products (e.g., tobacco)"*, and Square Online has no independent payment layer — there is no third-party-gateway escape hatch |
| WooCommerce self-hosted · fully custom CMS | Policy is fine (WooCommerce core is self-hosted GPL; only **WooPayments** bans tobacco explicitly). Rejected on maintainability — a non-technical owner should not inherit patching, or maintain 500 SKUs in a CMS in parallel with the POS |

**Ownership boundaries, strictly:** the POS owns *stock quantity*. Ecwid owns *catalog and merchandising*. Sanity owns *editorial only* — homepage narrative, delivery copy, landing pages, brand content. No product data in the CMS, ever.

**Do not use Ecwid's checkout.** Order *capture* is custom, because that is where age verification, delivery-zone validation, hotel/meet-point logic and cash-on-delivery live. Completed orders write back via the Orders API.

**The API supports this properly** — this was verified, not assumed. `app.ecwid.com/api/v3/`, **600 requests/minute per token**, full CRUD on products, categories and orders plus stock adjustment and abandoned carts. **Paid plan required for API access** (any tier). A *custom app* — private, single-store — skips the OAuth dance entirely and just carries a token. And Lightspeed ships an official typed headless client, `@lightspeed/ecom-headless`, wrapping both the REST API and the storefront cart/checkout JS. **Headless is a first-class supported path here, not a hack.**

**On Square, precisely.** Its Payment Terms bar item **(24)**, *"internet/mail order/telephone order of age restricted products (e.g., tobacco)"* — that is scoped to **card-not-present**, and tobacco appears nowhere else in the prohibited list. So **in-person tobacco acceptance is permitted; the same merchant selling it online is not.** That is exactly why so many smoke shops run Square at the counter and cannot use Square Online for the same SKUs — and it is why the pay-at-the-door architecture works. 🔴 The remaining seam is an order that *originates* online and is paid card-present at the door. Get Square's written position on that before building checkout.

**Build for portability from day one.** A `CommerceAdapter` interface — `getProducts`, `getInventory`, `createOrder` — with Ecwid as one implementation and **zero Ecwid types leaking into the UI layer**, enforced by lint rule. Nightly full export of catalog and orders to the client's own storage. **Customers live in the client's own Postgres, not only in Ecwid** — the customer list is the most valuable asset and must never sit exclusively inside a vendor. With that, a forced migration is a 1–2 week adapter rewrite rather than a rebuild.

### Confirm in week one
Domain, DNS and all product photography must be registered to the client. Agencies routinely discover in week 12 that the domain belongs to a former web developer.

### Rough monthly cost
Vercel $20 · Neon Postgres $19 · Sanity $0–30 · Ecwid ~$35 · Shipday $39 · age verification ~$125 · Sentry $26 · Plausible $9 · SES ~$1 — **≈ $275/mo**, dropping to **≈ $180** if age verification is persisted per customer rather than per session. Build that way from the start.

*Dispatch note: Shipday Professional at $39/mo covers this volume with unlimited drivers, API and webhooks. Onfleet — the reflexive choice in this category — starts at $619/mo and puts ID scanning behind a $1,349 tier. It is the wrong answer here by a factor of sixteen.*

### If online card payment is ever revisited

The v1 recommendation is no online card payment at all — browse and reserve, pay card-present at the counter or the door. That sidesteps this entire section. But when it comes back up, four things are worth knowing, because they are counter-intuitive:

- **The gateway question is the wrong question.** Authorize.Net, NMI and USAePay all publish **no prohibited-business list whatsoever** — NMI's terms pass the obligation through to *"any prohibited activities list promulgated by any Third Party Service Provider,"* and Authorize.Net has no acceptable-use policy on its public site at all. They are vertical-neutral by design because they don't underwrite merchants. **What determines survival is the acquirer and sponsor bank behind the gateway.** Every "Authorize.Net shut down my vape store" story is really the acquirer, usually after the merchant was boarded through a self-serve aggregator that skipped underwriting. Note Authorize.Net being Visa-owned changes nothing here.
- ⚠️ **Vendor lists in this category rot fast.** Of the specialists commonly recommended, **SMB Global** now serves a parked domain (since Feb 2025), **National Processing** has no DNS A record at all — the site is gone — and **Painless Processing** has been parked since 2023. Published review articles still rank for all three. Verify a vendor exists before contacting it.
- 🔴 **"Vape" and "smoke shop" are different underwriting animals**, and this store is the second one. A shop selling glass, kratom and Delta-8 alongside vape does not fit a vape-only processor's box — most publish a vape page and nothing else. This is a second, independent argument for the §12 compliance firewall: the grey inventory doesn't just risk the Google profile, it narrows the set of processors that will touch the business at all.
- **Nobody publishes a reserve or an early-termination fee.** The only usable anchors are 5–10% held with review every 60–90 days, or 5–15% held 6–12 months. Treat both as ranges to negotiate against, and **read the reserve and ETF clauses before the rate card** — the rate is rarely what hurts.

---

## 14. WHAT TO KILL

- **`puffvegas.square.site`.** 301 the whole domain. It is indexed and competing in the SERP, its catalog has been frozen since July 2023, **47% out of stock, 128/128 products with no image**, it still sells a "JUUL" category, and it carries a live typo — *"Puff Vegas Smake and Vape Shop"* — and a junk category named **"XXX"**. Overlapping SKUs are priced differently on the two sites.
- **The "Free Returns" badge** — an unedited Ecwid template default whose tooltip promises *"a free return anywhere in the world with no questions asked."* False, and a liability on nicotine.
- **The dropshipper return-policy template** referencing *"our warehouse"* and prepaid shipping labels, with the contact address broken by a botched find-and-replace: **`Pu vegas.us@gmail.com`**.
- **All shipping and "returns within the United States" language** for tobacco/nicotine — under 18 U.S.C. § 1716E that language alone is statutory "reasonable cause."
- **Raw AI scaffolding shipped to production** — e.g. *"(You would insert specific flavor options here, e.g., "…")"* on the Geek Bar Pulse X PDP.
- **PDPs written in the third person about the store**, as though by an affiliate: *"we highly recommend visiting Puff Vegas… They offer a great selection."*
- **Testimonial avatars that are Unsplash stock headshots** attached to real customers' names.
- **European decimal separators** throughout the catalog — *"Foger 30.000 Puff"* reads as thirty puffs to an American.
- **Three of thirteen nav categories with zero products**, including a hookah accessories page that is 12.9KB of AI FAQ (*"Is hookah a drug or not?"*) with no product links at all.
- **Glass sold by "size 3" through "size 8."** Nobody buys a bong by "size 5."
- **Duplicate/typo slugs:** `starbuzz-tabacco` *and* `starbuzz-tobacco`; `grabba-leaf` *and* `graba-leaf-crushed`; `xxx`; `benson--hedges`.

---

## 15. THE PLAN

### Phase 0 — Before any design work (blocking)
| # | Item | Owner |
|---|---|---|
| 0 | **Sanity-check the site loads** on a phone over cellular, and check Search Console Crawl Stats. Our research network appears to have filtered it (§12); if both are clean, close this item | Client — **2 minutes** |
| 0b | **Change the GBP primary category from "Smoke shop" to "Tobacco shop"** and add the Delivery attribute + service area. 90 seconds, highest-leverage action in the entire programme | Client — **today** |
| 0c | Set GBP special hours for every major holiday 12 months out. "Open at search time" is a top-five ranking factor, and a gap silently drops you out of the pack on NYE, CES, EDC and fight weekends | Client |
| 1 | **Confirm the store is genuinely staffed 24/7.** The entire concept rests on it | Client |
| 2 | **Pull the lease and settle the suite number.** Three variants are live in the wild — 611-612, 611-613, 611-612-613 — plus a wrong ZIP (89102) and a duplicate listing on MapQuest. Fix this *before* the citation cleanup, or the cleanup propagates a fourth variant | Client |
| 2b | Fix hours on the **website** — the GBP is already correct | Dev |
| 3 | **Nevada tobacco attorney engagement.** See the counsel list below | Client |
| 4 | Get **Square's written position** on web-originated / door-paid orders before any checkout is built | Client |
| 5 | Decide the **ENDS listing question** — see the open decision below | Client + counsel |
| 6 | Photography shoot: one setup, one day, whole catalog + the night wayfinding sequence + real staff portraits | Agency |

### Phase 1 — The dispatcher *(this alone beats the current site)*
Server-rendered store page with hours/directions/call · the banner age gate · `LocalBusiness` + `openingHoursSpecification` JSON-LD · the Never-Closed Clock · universal search · PDPs with prices and confidence badges · `tel:`/`sms:` everywhere · `/prices` · `/store/directions` and the wayfinding module · the hotel-proximity page set · 301 the Square site. **No cart yet.**

### Phase 2 — Delivery
Hotel POI picker + per-property meet-point data · the Strip Meter · delivery cart with cash-on-delivery and the thermal receipt · third-party database age verification at order + Nevada AG certification · branded live tracking page + web push + SES email (no SMS — §7.4) · driver tablet with ID scan, signature capture and refusal logging · package marking.

### Phase 3 — Depth
The Humidor Door and the full cigar department with spec facets and comparison · The Shelf with per-product relighting · hold/reserve · human-in-the-loop stock check · glass gallery PLPs · pouches and e-hookah landing pages.

**The two things that must not slip out of scope:** the **per-hotel meet-point content** and the **human-in-the-loop stock check**. They cannot be copied, and they fix the two failure modes that generate every bad review in this category.

---

## 16. OPEN DECISIONS — these need the client, not the designer

### 🔴 The big one: how much of the vape catalog goes online?
FDA publishes the list of every e-cigarette that may lawfully be sold in the US. **There are 45 of them.** None are Elf Bar, Geek Bar, Lost Mary, Breeze, Esco Bar or RAZ. FDA issues warning letters **purely on the basis of reading websites** — two October–November 2025 letters were issued with no test purchase, and were **cc'd to the domain registrar and the platform's abuse desk.**

Publishing the catalog converts a physical-inspection risk into a zero-cost remote-surveillance risk. The compliance recommendation is to list only FDA-authorized ENDS online and keep everything else in-store. **That is in direct tension with the entire commercial strategy, which is built on disposables.** This is a business risk decision, not a design decision — but the design cannot be finalised until it is made, because it determines whether the vape department is a shoppable catalog or a "we have it, come in or text us" surface.

### Also requiring counsel
- Whether cigarettes may be delivered off-premises at all (NRS 370.585(4)(b) says a dealer may sell cigarettes *"from the premises for which the license was issued"*)
- Whether NRS 202.24935 attaches to an online order paid in-store at pickup
- Whether an in-state brick-and-mortar taking online cigar orders needs Nevada's new Remote Retail Seller licence — **$650/yr, triggered at $100k or 200 remote transactions**, a threshold a busy Strip shop crosses trivially
- **The grey inventory.** The store is currently live-selling THCA disposables ($40), a diamond preroll ($20), Polkadot mushroom gummies ($40), 7-OH products and nitrous. Nevada's SB 356 (2025) is reported to have moved delta-8/10, THC-O, HHC and THCA flower exclusively to CCB-licensed dispensaries. This is simultaneously the largest legal exposure and the exact category Vegas tourists have been most loudly warned about on Reddit — **a trust-first positioning cannot survive sitting next to it unexamined.**

### 🔴 The enforcement vector that actually kills businesses in 2026
Federal criminal prosecution of a small online vape seller is a low-probability event — DOJ formally redirected ATF's tobacco enforcement resources in February 2025. **The real threat is the payment rail.** In April 2026 a coalition of **13 state Attorneys General wrote to Visa, Mastercard, Amex and Discover** demanding they *"deny access to their services and take affirmative steps to identify, investigate, and remove merchants engaged in the unlawful sale of illicit e-cigarettes"* — asserting illicit product is over **$11 billion in annual retail sales, more than 80% of the US e-cigarette market.**

State AG suits are the second vector: 15 U.S.C. § 378(c) gives AGs a direct federal cause of action with civil penalties and damages, and New York's February 2025 suit against 13 vape distributors — which survived dismissal around April 2026 — pleads PACT Act violations directly.

**Design consequence:** this is a further, independent argument for the *browse-and-reserve, pay card-present* architecture. A site with no online card checkout has no merchant account to lose.

### Carriers, for Phase 3 planning
Out-of-state cigar shipping is narrower than it looks, and the carrier choice is the constraint:
- **USPS still mails cigars** — 18 U.S.C. § 1716E(b)(1) exempts them explicitly, and USPS says so in plain language. (Not in international or APO/FPO mail.)
- **FedEx bans all tobacco outright**, cigars and hookah included.
- **UPS** will carry cigars, pipe and smokeless to consumers **only under a signed tobacco contract** with licences on file, a written compliance programme, and **21+ adult signature on every delivery**. It bans *"any Vaping Products of any type… regardless of nicotine content."*
- **There is no verified nationwide adult-signature carrier for vape products in 2026.** USPS, UPS, FedEx and DHL all refuse. Regional operators exist but coverage is fragmentary and most are unverifiable.

---

*Sources: primary research across the live sites, Yelp and Google review corpora, competitor teardowns, FDA/ATF/USPS primary documents, Nevada Revised Statutes, Clark County Code, and platform acceptable-use policies. Full dossiers in `/research`.*
