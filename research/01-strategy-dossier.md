Research complete across all four streams. Here is the dossier.

---

# PUFF VEGAS — STRATEGY DOSSIER
**Prepared for the puffvegas.us rebuild · 19 August 2026**

---

## 0. THE THREE THINGS THAT MATTER MOST

Before segments, before competitors: three findings from primary research that reframe the whole project.

**1. Your website tells a 2 a.m. customer you are closed.**
The live homepage contact block on [puffvegas.us](https://puffvegas.us/) reads **"Daily 10:00 AM — 7:00 PM."** Six hundred words higher on the same page, your own copy says *"Open 24 hours."* The `<title>` says `Las Vegas Strip Smoke  Shop 24/7` (with a double space). Yelp-derived data on [Roadtrippers](https://maps.roadtrippers.com/us/las-vegas-nv/shopping/puff-vegas-smoke-vape-shop) says *"Open now until 12:00 am."* A customer photo on your own Yelp page is captioned *"Open till 2 am, the cheapest cigars on Vegas Strip."* [CannabisShop's](https://cannabisshop.com/stores/puff-vegas-smoke-vape-shop/) listing has an **empty** Opening Hours section. There is **no `LocalBusiness` JSON-LD and no `openingHoursSpecification` anywhere on the site.** The single fact your entire business is built on is wrong, missing, or contradictory on every surface a customer or crawler can reach.

**2. You are running two disconnected websites, and neither one can take a delivery order.**
- **puffvegas.us** (Ecwid by Lightspeed, store ID `97786789`): 240 URLs, 223 product pages, actively updated — 52 products touched today. Real prices, working cart. But **zero `/delivery` page in the entire sitemap.**
- **puffvegas.square.site** (Square Online, published 9 Aug 2023, never updated since): 128 SKUs, **47% out of stock**, **128/128 with no product image**, 127/128 with no description, catalog frozen since July 2023, still selling a **"JUUL"** category and 5,000-puff Elf Bars two device generations obsolete. Its store config literally reads `"fulfillment_support": {"delivery": false, "pickup": true, "shipping": true}`. It carries a live typo — *"Puff Vegas Smake and Vape Shop"* — and a junk category named **"XXX"**. It is indexed and competing with your main domain in search results.

Overlapping SKUs are priced differently on the two sites. A tourist who finds one pays a different price than one who finds the other.

**3. Your best asset is unbuildable by competitors, and you're not using it.**
DoorDash bans tobacco and nicotine merchant-wide. [Uber Eats bans nicotine outright](https://www.ridester.com/will-uber-deliver-cigarettes/) — including vapes, rolling papers, ZYN and hookahs. USPS bans ENDS shipment; UPS, FedEx and DHL refuse consumer vape shipments. **The aggregators are legally locked out of your category.** Local, own-driver, ID-at-the-door delivery is the *only* legal channel that exists. And every 24/7 delivery competitor in Las Vegas — Smokes Mart (9355 W Flamingo), Metro Smoke (4065 S Maryland Pkwy), Smokers Alley (Sahara & Nellis), INEEDAVAPE — **is off-Strip.** You are the only one at 3649 S Las Vegas Blvd.

---

## 1. CUSTOMER SEGMENTS

Five segments with genuinely distinct jobs. Basket figures are modelled from your **live catalog prices** (pulled from the Ecwid storefront today), not POS data — treat as directional.

### SEGMENT 1 — "The 3 A.M. Refill" (the core, highest-volume)
The Strip tourist whose disposable died mid-night. This is your business.

| | |
|---|---|
| **Trigger** | Device dies between 11 p.m. and 5 a.m. Nightlife context: [Ole Red](https://olered.com/lasvegas/hours/) (next door) runs to **4 a.m.** Thu–Sat; Bottled Blonde's nightclub floor opens 9 p.m.; [Drai's](https://draisclub.com/drais-nightclub-underground-cromwell/) runs to **7 a.m.**; Omnia to 4 a.m. Standard Strip club close is 4 a.m. |
| **Device** | Phone, one-handed, dying battery, hotel or cellular wifi, often impaired |
| **Urgency** | Absolute. Substitution window measured in minutes. Will pay a premium and knows it. |
| **What they search** | `smoke shop open now near me`, `24 hour vape las vegas`, `vape shop near [hotel]`, `disposable vape las vegas strip`. Increasingly Google Maps directly, not the web. |
| **Bounce triggers** | Any hours ambiguity (**you currently fail this outright**); no price shown; a blocking age gate; a cookie wall; a form before an answer; "call us" with no tap-to-call |
| **Basket** | **$33–$45** walk-in (one disposable $29.99–$39.99 + Bic $3.69). **$60–$80** delivered — delivery orders skew to two devices plus an impulse add. |

Your catalog is well-matched here: 51 live disposable SKUs, $23.07–$59.99, clustering at $29.99–$39.99, median $35.99.

### SEGMENT 2 — "The Party Provisioner" (highest basket, most under-served)
One person buying for a bachelor/bachelorette group of 8–12.

Las Vegas is [ranked #1 in the world for bachelor/bachelorette parties](https://www.reviewjournal.com/business/tourism/new-study-ranks-las-vegas-best-for-bachelor-bachelorette-parties-3838687/) — 479,000 monthly Google searches on nightlife terms. Average bachelorette party is [10 attendees](https://go.weddingwire.com/pdf/bachelor-bachelorette.pdf), bachelor ~8, at $1,000–$2,000 per person for the weekend. LVCVA's 2025 Visitor Profile puts **20% of all visitors in Vegas for a personal celebration**. Clark County issued **76,779 marriage licenses in 2024**.

| | |
|---|---|
| **Trigger** | Pre-game, 4–9 p.m., before dinner or a club. Or a group photo moment — cigars are a prop. |
| **Device** | Phone, in a group, screen being passed around. Decisions are social. |
| **Urgency** | Medium — 1–3 hours of planning runway. Tolerant of a short wait, intolerant of ambiguity in front of friends. |
| **What they search** | `cigars for bachelor party las vegas`, `hookah delivery las vegas`, `bachelorette party supplies vegas`. Heavy TikTok/Instagram discovery. |
| **Bounce triggers** | No multi-buy or bundle logic; no way to share a cart; no group-size framing; no idea whether you can supply 10 people at once |
| **Basket** | **$135–$215** (8 cigars at ~$20 + $5.99 cutter + $49.99 butane torch), or **$129–$199** for a hookah kit (Woyu $90 / Empire $160 + Al Fakher 250g $25.99 + Coco Nara $12.99) |

**World Crawl Las Vegas — a bar-crawl operator — is a tenant in your own mall**, per the [Grand Bazaar Shops directory](http://grandbazaarshops.com/retailers/). So are Fat Tuesday and IT'SUGAR. Your party pipeline is physically adjacent and entirely unexploited.

### SEGMENT 3 — "The Aficionado" (highest margin, currently unserved)
The cigar buyer. Small in volume, disproportionate in basket and repeat rate.

**The market just opened up.** [Casa Fuente closed 19 October 2025](https://halfwheel.com/casa-fuente-closing-on-oct-20/454474/) after 20 years in the Forum Shops — the Strip's most famous cigar destination, killed when the landlord banned patio smoking and cut ~65 seats. Remaining Strip options are resort lounges: Montecristo Cigar Bar (Caesars), [Eight Cigar Lounge](https://www.eightloungelv.com/location/eight-cigar-lounge/) at Resorts World (7,000 sq ft, 150+ cigars $14–$5,000), Davidoff at Fashion Show. Their reputation is brutal: [Cigar Aficionado](https://www.cigaraficionado.com/article/smoking-on-the-strip-8706) documents Strip markups of 200–300%, with $10–15 sticks selling for $40–50.

**You carry the real thing** — Montecristo (Classic Tubo Especial, White Series Magnum Especial, White Toro Grande), Romeo y Julieta Reserva Real, Macanudo Vintage 2010, Acid Kuba Kuba / Blondie / Kuba Deluxe, Java by Drew Estate, RJ Reserve. A customer photo on your Yelp calls you *"the cheapest cigars on Vegas Strip."*

**And none of it is purchasable.** I fetched every premium cigar PDP: Montecristo White Toro Grande, Romeo y Julieta, Acid Kuba Kuba, Macanudo Café — **no price, no stock state, no add-to-cart.** Each is ~1,200 words of AI-written essay ending in *"Visit us today at Puff Vegas Smoke and Vape Shop on the Las Vegas Strip"* — written in the third person, as if by an affiliate blog reviewing you. The `/products/CIGARS-c166241842` category page runs **1,144 words before the first price appears.**

| | |
|---|---|
| **Trigger** | Post-dinner, pre-show, or a deliberate "buy a good stick in Vegas" errand. Also: needs a lighter/cutter he forgot. |
| **Device** | Phone or desktop, researched, patient, reads specs |
| **Urgency** | Low. Will travel. Will compare to Neptune/Famous prices. |
| **What they search** | `cigar shop las vegas strip`, brand + vitola names, `montecristo las vegas` |
| **Bounce triggers** | No price (fatal — he assumes gouging); no ring gauge/length/wrapper; no single-stick option; no stock status |
| **Basket** | **$40–$120** (2–4 sticks), higher with accessories. Repeat rate is the prize. |

### SEGMENT 4 — "The Hotel Room Group" (the hidden wedge — see §5)
4–6 people in a room wanting a shared session. **The job they think they have is impossible; the job you can actually do is different and nobody is selling it.**

You cannot smoke a hookah in a Strip hotel room. [Fontainebleau](https://www.fontainebleaulasvegas.com/information/frequently-asked-questions/) explicitly prohibits *"smoking any substance, including hookah, inside a guest room."* Downtown Grand bans hookahs property-wide. The Strip is now near-universally non-smoking in rooms — Wynn, Venetian, Resorts World, Fontainebleau, Sahara, Circus Circus and The Strat sell **no** smoking rooms. Worse: Strip resorts have deployed **Halo smart sensors that detect tobacco vape, not only cannabis**, with cleaning fees of **$250–$500 (Caesars)** and **$500 room / $1,000 suite (MGM)**.

| | |
|---|---|
| **Trigger** | 8 p.m.–2 a.m., group in a room, wants a session without leaving |
| **Urgency** | Medium-high |
| **What they search** | `hookah delivery las vegas`, `hookah rental las vegas hotel`, `can you smoke hookah in a vegas hotel room` |
| **Bounce triggers** | Being sold something that will cost them a $500 fee; existing hookah caterers ([Smoke By Night](https://smokebynight.com/) at $150 flat) need **4 hours notice** and can't serve a hotel room anyway |
| **Basket** | **$50–$160** — and the right product is **not** a hookah |

### SEGMENT 5 — "The Local Regular" (the retention engine)
Off-Strip resident ordering delivery. Low glamour, high lifetime value, and the only segment that makes the delivery fleet economically sane during dead hours.

| | |
|---|---|
| **Trigger** | Ran out, doesn't want to drive, or it's 3 a.m. |
| **Device** | Phone, repeat behaviour, wants reorder not discovery |
| **Urgency** | Medium. Tolerates 45 min if told 45 min. |
| **What they search** | Rarely searches after the first time — goes direct, or texts |
| **Bounce triggers** | **Delivery fee surprise** (the #1 documented failure in this market — see §3), minimum-order walls, no ETA, no reorder |
| **Basket** | **$50–$90**, multi-item, 2–6× per month |

---

## 2. COMPETITIVE TEARDOWN

### 2A. The direct set — audited page by page

**Lali Smokes — [lalismokes.com](https://lalismokes.com/) — WordPress/Elementor/WooCommerce — your most dangerous SEO competitor, and a fraud.**

Their `<title>` is literally `24/7 Smoke Shop Las Vegas Strip:7` — a corrupted string ending in a stray `:7`. Their H1 has a double space. Their testimonial section is **unreplaced theme demo content**: their vape category pages carry reviews reading *"I'm so glad I discovered **AudioPlus**! The range of audio products available is amazing…" — Sarah, Jakarta*, plus "John, Jakarta" and "Mark, Bandung" reviewing **wireless earbuds**. Their "partner" logos are the theme's placeholder files (`jevape-logo-partner-1..6`). WooCommerce is installed with **no prices on any product** and a **`/cart/` page that renders nothing at all** — their funnel dead-ends in a blank page. On Yelp they have **5.0 stars from one review**.

**And they are not on the Strip.** Their contact page lists **710 E Flamingo Rd Suite 6, Las Vegas NV 89119** — roughly ¾ mile east of the Boulevard, past the Westin — while every page claims to be *"in the heart of the world-famous Strip."*

Despite all of that, they **outrank you** on `24 hour smoke shop las vegas`. Why? Because they built ~20 programmatic proximity pages you don't have:

```
/smoke-shop-near-bellagio-las-vegas/     /smoke-shop-near-caesars-palace-las-vegas/
/smoke-shop-near-paris-las-vegas/        /smoke-shop-near-flamingo-las-vegas/
/smoke-shop-near-harrahs-las-vegas/      /smoke-shop-near-mgm-grand-las-vegas/
/smoke-shop-near-luxor-las-vegas/        /smoke-shop-near-sphere-las-vegas-2/
… plus /summerlin/ /spring-valley/ /north-las-vegas/ /east-las-vegas/
```

**Bellagio, Caesars, Paris, Flamingo and Harrah's are all at your intersection.** They are ranking for hotels you can see from your door, from three-quarters of a mile away, with a fake claim and a broken store. *Steal this immediately, and do it honestly with real walk times and real photos.* Their duplicate URLs across post- and page-sitemaps also self-cannibalise — an easy edge.

**One thing they have that you don't:** *"Try it, Taste it, Then decide on, The only smoke shop in Vegas offering samples."* Broken grammar, genuine differentiator. Note that Nevada's [retail tobacco store exemption](https://nevada.public.law/statutes/nrs_202.2483) to the Clean Indoor Air Act may permit in-store sampling — worth counsel review, because it is a defensible in-person moat.

**Smokes Mart — [smokesmartvegas.com](https://smokesmartvegas.com/) — the real strategic competitor.** Off-Strip (9355 W Flamingo), but they have built what you claim. Persistent site-wide bar on every page: *"| Tobacco Delivery in Southern Nevada Only | 21+ Years or Older | Open 24 Hours, Delivery 24 Hours"*. They ship **`Place` + `PostalAddress` + `GeoCoordinates` + `openingHours` JSON-LD** — they win the entity graph against you by default. Merchandising has personality (*"Crowd Favorites," "Just Dropped," "New Roll-Ins 🎲"*). Best alt text in the set. Yelp **4.8 / 309**. They also sell Red Bull, Dr Pepper and gummies — they monetise the *convenience trip*, not just the nicotine trip. *Weakness: mobile pinch-zoom disabled (`user-scalable=0`), no H1, no canonical.*

**Smokers Alley — [smokersalleylv.com](https://smokersalleylv.com/vegas-smoke-shop-delivery)** — on a GoDaddy site builder, and they still beat you on delivery search. Sticky bar: *"NOW DELIVERING ALL OVER LAS VEGAS. CALL (725) 205-3145."* They built the ~1,000-word delivery landing page you don't have, plus intent silos (`/geek-bar-near-me-vegas`, `/foger-near-me-las-vegas`). *Weakness: leaks `filler@godaddy.com` in the account menu.*

**INEEDAVAPE — [ineedavape.com](https://www.ineedavape.com/)** — pure-play LV delivery, free, "within an hour," live per-flavor stock counts. **Fatal flaw: every product says "Sign in for pricing."** Dead on arrival for a tourist. Delivery hours 10 a.m.–midnight — **you beat them on hours, if you fix your hours.**

**Mr. Bill's Pipe & Tobacco — [mr-bills.com](https://mr-bills.com/)** — the best-run local retail site. Real WooCommerce depth: ~30 categories with subcategories (Briar/Corn Cob/Meerschaum/Zippo/Torches/Vector), live prices (Savinelli Alligator Blue $199.99), wishlist, compare, quick view. Trust asset you can't buy: *"Best of Las Vegas 2025, Best Smoke Shop AND Best Cigar Shop,"* est. 1980. *Weaknesses: **six H1s** from slider abuse; **age gate says 18, not 21** — a Nevada compliance problem; pinch-zoom disabled; `blob:http://localhost/` build artifacts leaking into production.*

**Cigar Warehouse — [cigarwarehouseusa.com](https://cigarwarehouseusa.com/)** — best merchandising execution of anyone local. MSRP anchoring on every tile (*Arturo Fuente Chateau (10) Box — MSRP $164.00 → $77.99*), honest out-of-stock labels, faceted browse by brand/country/strength, and a **Cigar of the Month Club** — the only subscription in the set. Tagline *"YOU WANT IT. WE GOT IT."* *Fatal bug: all three hero `Shop Now` CTAs point at the homepage. No hours, address or phone above the fold.*

**Still Smoking — [stillsmokinglv.com](https://www.stillsmokinglv.com/)** — Wix business card. **Six H1 tags, and they are the address.** Two of them contain only a zero-width space. No products, no prices, no cart. Copyright reads **"2019."** Hours 9 a.m.–midnight — you beat them outright. *One genuinely good idea: the "No, I am under 21" button links to sesamestreet.org.*

**The Joint Smoke Shop — [thejointsmoke.com](https://thejointsmoke.com/)** — **HTTP 423 Locked.** *"Store Unavailable — currently unavailable due to maintenance."* Non-competitor. Yelp 5.0 from 6 reviews.

**Strip Smoke Shop (2233 Paradise Rd)** — genuinely 24/7, **4.8 stars / 561 reviews, and no website at all.** Ranks purely on directories. Proof both that the local pack is winnable without a site, and that a real site should beat them.

**StayRunners — [stayrunners.com](https://stayrunners.com/)** — the wildcard. *"Your 24-Hour Global Concierge Desk — Alcohol · Vapes · Cannabis · Food."* Free delivery, pay on arrival. Ranks #4 on `vape delivery las vegas`. An aggregator with a bot funnel is eating the exact query a tourist types at 3 a.m.

### Where you actually rank

*(DuckDuckGo organic — Google's local pack was not fetchable and the shared search budget was exhausted. Directional, not literal.)*

| Query | Your position |
|---|---|
| `disposable vape las vegas strip` | **#1** ✅ your single best asset |
| `smoke shop near me las vegas strip` | #5 (behind Yelp, 3 parasite directories) |
| `vape shop near me las vegas strip` | #4 — **and `puffvegas.square.site` also appears, competing with you** |
| `cigar shop las vegas strip` | #5 |
| `24 hour smoke shop las vegas` | #8 — **behind Lali at #3** |
| `smoke shop delivery las vegas` | **last** |
| `vape delivery las vegas` | **absent entirely** |
| `hookah las vegas delivery` | **no smoke shop ranks at all — wide open** |

Aggregators own the head. Yelp is #1 or #2 on nearly every "near me" query, with thin auto-generated directories (`sativauniversity.com`, `smokeshoplocator.com`, `loc8nearme.com`, `wheree.com`, `vapersmap.com`) filling positions 2–8. Claiming and enriching those is cheap volume you're leaving on the table.

### 2B. BEST-IN-CLASS — what to steal, and from where

**The single most important reference: [7NOW / 7-Eleven](https://www.7-eleven.com/7now).** The closest analogue that exists to your business. Verified live:
- **The entire homepage is one address field.** No products, no carousel, no login wall.
- **POI autocomplete, not street addresses.** Typing `Bellagio Hotel Las Vegas` returns Google Places results as bold POI over grey address. *A tourist knows "Bellagio," not "3600 S Las Vegas Blvd." This is the highest-leverage single pattern in this report.*
- Three-stat trust bar, verbatim: `2 Million+ satisfied customers` | `30 Minutes average delivery time` | **`24/7 Delivery — perfect for 2AM munchies.`** A Fortune 500 brand wrote "2AM munchies" in its hero. Note the honest hedge: *"average"*, footnoted.
- **Tobacco and Cigarettes are categories 6 and 7 in the main rail** — no interstitial, no shame.
- Age verification framed as legitimacy: *"You'll also be required to show your ID to your delivery driver."*

**[Weedmaps](https://weedmaps.com/deliveries/in/united-states/nevada/las-vegas)** — two steals. (1) **Time-bounded open status**: cards read `Accepting orders until 12am`, `until 2am` — not a green dot. Planet 13's card reads **`Open 24 HOURS`**. (2) **Delivery economics before any effort**, in a fixed one-liner: `Free delivery | $50 min`, `$10 fee | $50 min`.

**[Planet 13](https://planet13.com/dispensary-las-vegas-nv/plan-your-visit/)** — sell the visit, not the product. Their page is an *attractions* page: named venues each with their own hours (Robot Show, Bar 13, Cannabition), seven of fifteen nav items are venues inside the building, and they're listed on **TripAdvisor as an Attraction**, not a retailer. Their geo-locator narrates itself back: *"We see you are browsing from Ashburn, Virginia…"*

**[Neptune Cigar](https://www.neptunecigar.com/arturo-fuente-cigar)** — **buy the single from the category page.** Box and single are sibling *table rows*, not a variant dropdown: `Box of 25 | $209.00 | In Stock Ships Today` directly above `Single | $8.36 | In Stock Ships Today`. Availability is a promise string, not a state. Also a Gift Finder faceted by **persona** — `The Rookie`, `The Golfer`, `The Collector`, `Price Conscious`.

**[Cigars International](https://www.cigarsinternational.com/product/001-BYO_Mega_Sampler.html)** — the **fixed-price tiered Build-Your-Own**. Price is set before you choose anything: "20 handmades, yours for just $89.96." A slot tray shows `Selected Items (0 out of 4)`; the CTA reads `Add 4 more` until complete; the total never changes. Kills cart math at 3 a.m.

**[Famous Smoke Shop](https://www.famous-smoke.com/samplers)** — count-first taxonomy (`/3-cigar-samplers`, `/5-`, `/10-`), price-first (`/cigar-samplers-under-25`), intent-first (`/best-cigar-samplers-for-beginners`), plus `sort by % off` and scarcity as a **static date** (`Sale ends on August 28, 2026`) rather than a countdown. Education is a top-level nav item: **`New to cigars?`**

**[Best Cigar Prices](https://www.bestcigarprices.com/)** — dimensional nav with specs pre-bucketed into use cases: `Under 4 Inches / 4-6 / 6-8`. "Under 4 inches" *is* the tourist query — a 30-minute smoke before a dinner reservation.

**[Small Batch Cigar](https://smallbatchcigar.com/)** — a **named human** is the recommendation engine. Every blog entry bylined to "Dave" in the summary text. Clearance is called "Scotty's Corner." *You have night-shift tobacconists with names your reviewers already use — Yener, Frank, Brock, Bertan. "Yener's Pick Tonight" is free and impossible for Famous or CI to copy.*

**[Supreme](https://us.supreme.com/shop/all)** — the live server clock as the site's heartbeat. Observed live: `08/19/2026 10:01am NYC`, ticking. **Invert it.** Supreme's clock says *you're too early*; yours says **`2:14 AM LAS VEGAS · OPEN NOW`**. Also: their [preview grid](https://supreme.com/previews/fallwinter2026/all) is DOM-measured at **four columns on a 375px phone, 2px gutter, zero text on any tile.** For disposables — recognised by package colour, not read — a 4-across contact sheet beats 2-across cards at 2 a.m.

**[END Clothing](https://launches.endclothing.com/)** — the **relative countdown that deletes the timezone problem**: `THIS PRODUCT WILL BE AVAILABLE IN: 09 HOURS : 55 MINUTES : 08 SECONDS`. No date, no clock time, no timezone — correct for every visitor at once. Card anatomy is four strict lines: eyebrow status badge → name → colorway → price. *That eyebrow slot is your live-status channel: `IN STOCK` / `LAST 3` / `DELIVERY 25 MIN`.*

**[Nike SNKRS](https://www.nike.com/launch)** — four-word nav for thousands of SKUs: `Feed · In Stock · Upcoming · Maps`. Release date burned into the top-left of the image tile itself. *Put your ETA there.*

**[Stüssy](https://www.stussy.com)** — `SOLD OUT` stays visible in the grid. *Never delete a sold-out SKU — grey it with "restock tonight" + a text-me button. A full grid reads as a deep shop; a thinned grid reads as a shop that's given up.*

**[Kith](https://kith.com)** — `Hospitality` sits at the same nav altitude as the clothes. *Give `Delivery` a top-level slot equal to Vapes and Cigars.*

**[Palace](https://www.palaceskateboards.com)** — the help section is called **`Advice`**, and legal is exiled to a subdomain named `boring.palaceskateboards.com`. *A 2 a.m. tourist doesn't want "FAQ."*

**[Minibar](https://minibardelivery.com/)** — address gate with an inline **`Why?`** disclosure, and the **age checkbox lives inside the same address form**. One form, one submit.

**[Saucey](https://www.saucey.com/)** — the delivery promise lives in the `<title>` on every page: *"Alcohol Delivery Near You | Beer, Wine & Liquor 30 Minutes | Saucey."* It's in the browser tab and every SERP snippet.

**[Instacart](https://www.instacart.com/store/food-lion-now-convenience/storefront)** — **`Delivery by 10:37-10:47am`**. A 10-minute window with a real clock time. A window reads as a commitment; a countdown reads as a guess. Badge vocabulary worth stealing: `No markups`, **`Good for small orders`**.

**[DoorDash's cash-on-delivery mechanics](https://help.doordash.com/en-us/dashers/article/cash-on-delivery-overview-and-faq)** — drivers keep 100% of cash; customers told to *"have the exact total plus tip ready"*; failure handled by a **structured picker**, not free text: `Customer was short on cash` / `I do not have any change` / `Customer unavailable` / `Customer refused to pay`. Notably, cash is **Drive-only (white-label)** — the pattern exists precisely for merchants running their own storefront. That is exactly your situation.

**Age gates — read from source.** [Leafly](https://leafly.com) is best in class: content renders first and the gate layers on top, the "remember me" checkbox is **pre-checked (opt-out)**, and it's behind a LaunchDarkly flag (`webWeb_newAgeGate_frontend`) — the category leader A/B tests its age gate as a conversion surface. Planet 13 is a close second (client-side overlay, so Googlebot sees the full page). **Anti-patterns to avoid:** Curaleaf's server-side block returned *zero store content* for a Las Vegas store URL; Dutchie's gate is **its own indexed route**; Oasis sets `rechallenge:1` so it re-fires every session.

**Anti-pattern:** [Grubhub](https://www.grubhub.com/) renders as nothing but a full-screen OneTrust consent wall. A 2 a.m. buyer's first screen must never be a cookie modal.

---

## 3. REVIEW MINING — THE HONEST VERSION

### 3A. Your numbers, and the problem with them

| Platform | Rating | Count |
|---|---|---|
| **Google** | 4.9 | **2,791** |
| **Yelp (recommended)** | 4.6 | **38** |
| **Yelp (filtered / suppressed)** | — | **62** + 3 removed for TOS violation |
| **TripAdvisor** (two duplicate listings) | — | **0 on both** |

Google star distribution: **5★ = 2,715 · 4★ = 27 · 3★ = 13 · 2★ = 11 · 1★ = 25.**

**That is 97.3% five-star, with more 1★ than 4★.** That is not a plausible organic distribution for walk-in retail at that volume. Yelp has already acted: **62 reviews suppressed against 38 shown**, overwhelmingly 5-star, overwhelmingly from accounts with zero friends and one review, clustered in bursts — four on 16–17 Sep 2025 (*Jajon K., Vedat G., Kemal K., Denis A.*), roughly forty in Jun–Aug 2023. The recommended 38 are bimodal: **34× 5★, zero 4★, zero 3★, 2× 2★, 2× 1★.**

This is the market norm, not an outlier: **Vape Pirates — the shop Reddit accuses of selling counterfeit Elf Bars — holds Google 5.0 with 2,400 reviews against Yelp 4.0 with 56.** Same signature.

**Strategic consequence: do not build the rebuild on "4.9 stars."** A skeptical tourist discounts it, and a competitor can point at the Yelp filter. Build on things that are *checkable*: posted prices, exact walking directions, real stock counts, a named guarantee.

### 3B. What customers genuinely praise

**Location and hours** — your strongest authentic theme (Google tags "easy access" in 112 reviews, "open 24 hours" in 20):

> *"Love it here easy to find perfect for late night stops for me personally I found this while sitting in my hotel room at 1 am needing some nicotine !!!!"* — Indianna A., 8 Sep 2023

> *"Got to Vegas and lost my vape within 2 minutes. If this sounds like you, this is the place to go."* — Maryam M., 23 Jul 2023

**Selection** (Google tags "cigar selection" 92×, "elfbar" 32×):

> *"Looove this place! Asked for a flavor no one has and he had a whole stack in the back."* — Melanie C., 7 Jul 2023

**Named staff** — recurring: **Yener, Frank, Brock, Bertan, Veda, Brighton.** Yelp auto-extracted *"Great experience shopping at Puff Vegas with Yener!"* as a review highlight.

**Goodwill gestures** recur — free lighters, comped product:
> *"my husband bought Swisher Sweet cigars; accidentally threw 1 away instead of wrapper. I went into store and the 2 gentlemen working graciously gave me a brand new pack without pay."* — Stephanie S., 8 Apr 2023

And, tellingly, customers arrive *expecting* to be robbed:
> *"Great place, best prices, they dint try to rip you off unlike other smoke shops in vegas, 100% recomended"* — Juan R., 24 Aug 2023

### 3C. What they complain about

**Price. Unanimously. Every single negative review.**

> *"their vape are selling **$35 for a flum mello when it s regular price is $25**. Basically it took me an hour to pay $60 to buy a vape, I should have just go to a regular smoke shop in Chinatown."* — Steven P., **2★**, 26 Jul 2025

> *"**$40 for a disposable?** Idk what these guys are smoking but it's not vapes haha they will go under soon"* — Cole H., 13 Jul 2024

> *"Don't go here for kratom. **Selling ONE opm liquid shot for $30-$35!** … go 9mins up the street … **half that price for $15**."* — Stephanie B., **2★**, 29 Jul 2023

**Findability.** *"So hard to find"* (Steven P.). Corroborated structurally: **Grand Bazaar Shops itself is 3.1 / 46 on Yelp**, with *"I wish they had better directional markers so you can find the small shop you're looking for."* And the mall has been physically obscured — [Ole Red](https://www.rymanhp.com/property/ole-red-las-vegas/) (4 storeys, 27,000 sq ft, opened Jan 2024) and [Bottled Blonde](https://www.reviewjournal.com/business/50m-las-vegas-strip-nightlife-venue-sets-opening-date-3387052/) ($50M, 3 storeys, opened Jun 2025) now occupy the Strip frontage. Vital Vegas: *"Grand Bazaar Shops is almost completely obscured."*

**Staff conduct** — two recent incidents, both about the overnight shift:
> *"a young guy workinng around 4 am ! incredibly rude and has a bad attitude"* — Shellby T., **1★**, 4 May 2025

**Your owner replies deflect on the one objection that matters.** To price complaints: *"While prices can vary based on location, we work hard to offer competitive pricing."* Four reviewers have publicly disproved that. Compare Smokes Mart's owner on the same objection: *"We're truly sorry about the $41 delivery fee. We hear you and we're working on better options."* Concession beats hedge.

### 3D. The category's reputation problem — and the one place you're clean

**The Strip premium is real and quantified.** Cigarettes per pack: casino gift shop **$18+**, casino floor **$14**, Strip **$12**, **Puff Vegas $13.84**, downtown **$9**, off-Strip **$7**, Paiute Tribal (tax-free) cartons from **$40** ([8NewsNow](https://www.8newsnow.com/), Mar 2026). Disposables: **Puff Vegas $35–$40** vs Vape City *"$20 Elf bar on Saturdays"* vs Vape Street *"a bin of 3 for $15."* **Your markup runs roughly 1.4×–2× off-Strip, and 2×–3× the best off-Strip deal.**

**"No price tags" is a documented Strip practice** — for convenience and gift shops rather than smoke shops specifically. Per *Las Vegas Then and Now*: Strip convenience stores use *"a 'surge pricing' model… Because prices change frequently, **these shops don't even bother with price tags**."* Per *Las Vegas Jaunt*: *"you only find out the cost when the cashier rings up your purchase."* **That expectation is what every customer carries through your door.** Notably, Las Vegas Paiute Tribal Cigar Shoppe markets *"Transparent Pricing"* as an explicit Yelp bullet — someone has already recognised this as a lever.

**Counterfeits are real, local, and named.** Reddit r/vegaslocals: *"**PSA: Vape Pirates on Sahara sells FAKE elf bars**… They charge $30 for them when normal price… **Their whole store has signs all over the place saying they will not refund disposable vapes.**"* The full trifecta in one post. Independently at Vape Street:

> *"**Buyers beware, this store sells fake vapes, scanned the flum pebble and turned out to be fake. When I asked for a refund they refused** insisting product is real and denied refund even after I showed the worker proof of it being fake."* — Joel H., 1★, 19 Oct 2025

**The tar you risk inheriting: the Strip "fake weed" scandal.** Nevada bars dispensaries within 1,500 ft of a casino, so hemp storefronts fill the gap. r/LasVegas: *"They sell **cheap CBD products disguised as containing THC for outrageous prices**."* r/vegas has a 220-comment thread titled *"Exposing Fake Las Vegas Dispensaries."* **You currently sell THC-A and HHC** — I confirmed live pricing on `tre-house-2g-thca-disposable-vape` ($40.00), `hazy-mary-2g-diamond-preroll` ($20.00) and `polkadot-mushroom-gummies` ($40.00) — placing you squarely in the category tourists have been most loudly warned about. See §5, insight 10.

### 3E. Here is the clean part, and it is worth more than the 4.9

I ran text searches across **all 100 Puff Vegas Yelp reviews** (38 recommended + 62 filtered) for `fake`, `counterfeit`, `refund`, `scam`, `cash`. **Zero matches on any of them.**

In a market where your nearest competitors are publicly accused of selling counterfeit Elf Bars and refusing refunds on signage, **nobody has ever accused you of either.** That is the single most valuable, most defensible, and most completely unused asset you own.

### 3F. Delivery — what actually goes wrong

The field is nearly empty: across Yelp's Vape Delivery and Cigarette Delivery searches for Las Vegas, **only two businesses carry a Delivery badge.**

**The #1 failure mode is fee surprise.** Smokes Mart charges **$30 flat online vs $7 by text** — admitted publicly by the owner:

> *"delivery for a house that was 3 miles away… **cost $30; that's more than the disposable vape itself.** … I received a text that my order should be at my location in approximately 45 minutes. **It took approximately 2 hours.**"* — Michael V., Yelp Elite
> **Owner reply:** *"Unfortunately online has an automated $30 fee… if you text… **Within 5 miles it is $7**. There is no excuse for the 2 hour wait."*

> *"the delivery charges are pretty expensive… I live 12 or so miles from the shop so **it cost me $41 in delivery fees.**"* — Andrea H., in a **5-star** review

**And here is the spec for a perfect delivery, written by a customer:**
> *"After ordering I had my vapes in my hand in **less than 30 minutes. I was kept informed every step of the way**… **He even texted me instead of ringing the doorbell or knocking** when he was outside… **you have 2 ways to tip. 1 cash and 2 they have Zelle.** I didn't have any cash and it was nice to be able to still tip."* — Dana R., 26 Aug 2024

Other documented failures: drivers not carrying change, card readers failing at the door, refund policy stated inconsistently by staff vs owner, and auto-added 20% gratuity (*"This is sneaky and a bit shady - even for Vegas"*).

---

## 4. THE WEDGE

One answer.

> ## Puff Vegas owns the hour, not the product.
> **It is the Strip's 24-hour supply room: the only shop physically on Las Vegas Boulevard that is awake at 3 a.m. and will also bring it to you — in the one retail category the delivery apps are legally forbidden to touch.**
>
> The website has exactly one job: collapse the distance between *"I need this now"* and *"I have it"* — at any hour, from any hotel — **with the price visible before you commit.**

### Why this is defensible and nothing else is

**Not "biggest selection"** — Mr. Bill's has more depth and a Best of Las Vegas award. **Not "best prices"** — you are 1.4×–2× off-Strip and four reviewers have said so publicly; claiming it is the one move that makes you look dishonest. **Not "premium cigars"** — Eight Cigar Lounge has 150 SKUs to $5,000. **Not "delivery"** alone — Smokes Mart, Smokers Alley and INEEDAVAPE all deliver.

**But nobody can be on the Strip AND open at 3 a.m. AND deliver.** Each leg is individually copyable; the combination is not:

- **Location is a hard asset.** [Grand Bazaar Shops](http://grandbazaarshops.com/retailers/) confirms you as a tenant at **Suite 611, 612, 613** — at Las Vegas Blvd & Flamingo, with ~20,000 hotel rooms at that single intersection and 85,612 rooms on the Strip overall. The landlord's leasing collateral claims **110,000 pedestrians a day** (their marketing number — do not publish it as fact without verification). Every 24/7 delivery competitor is 3–10 miles west or east. For a hotel-room order at Caesars, Bellagio, Paris or Planet Hollywood, you are a walk; they are a 20-minute drive.
- **Regulation is a moat, not an obstacle.** DoorDash and Uber Eats ban nicotine platform-wide. USPS/UPS/FedEx/DHL refuse consumer ENDS. **Local own-driver delivery is the only lawful channel that exists** — which is precisely why the aggregators declined to build it.
- **The demand curve is structural.** Clubs close at 4 a.m., Drai's at 7 a.m., Ole Red next door at 4 a.m. Nobody else is open to serve it.
- **Nevada bars *cannabis* delivery to hotels and casinos. No equivalent prohibition exists for tobacco or vape.** Cannabis delivery operators put *"No Delivery to Hotels & Casinos"* in their business names. You are legally permitted where an entire adjacent industry is locked out — and no smoke shop is marketing it.

### The trust layer that makes it work

The wedge is availability. But the category's defining sins are unmarked prices, counterfeits, and no refunds — so availability alone converts nobody. Three claims, each attacking one sin, each one you can actually make:

> **Every price posted. Every product real. ID checked at the door, every time.**

You are the only shop in this set that can make the middle claim honestly — **zero counterfeit or refund complaints across 100 reviews.** And on price: *concede the premium and justify it.* "We're not the cheapest in Las Vegas. We're the only one open at 3 a.m. on the Strip, and the price is on the label before you buy." That converts your biggest liability into proof of the honesty claim. *"We work hard to offer competitive pricing"* does the opposite.

---

## 5. TEN INSIGHTS A DESIGNER CAN BUILD

**1. Make the clock the hero, and make it real.**
Steal Supreme's live server clock and invert its meaning. Masthead renders **`2:14 AM LAS VEGAS · OPEN NOW · DELIVERING`**, ticking, above the fold, on every page. Supreme's clock tells you you're too early; yours proves you're awake. This is the entire positioning in one component, it's impossible to fake, and it fixes the *"Daily 10:00 AM — 7:00 PM"* catastrophe by making the hours a live object rather than a static string someone forgot to update. Ship it with `LocalBusiness` + `openingHoursSpecification` JSON-LD covering all seven days — **only Smokes Mart in the entire competitive set has done this, and they aren't on the Strip.**

**2. The address field is a hotel picker, and the second field is a meeting point — never a room number.**
Over 98% of Strip resorts prohibit in-room delivery. Per Wynn: *"All food-delivery services must coordinate delivery directly with the guest and meet at a main entrance."* MGM and Station properties require key cards to operate elevators — drivers physically cannot reach guest floors. So the flow is **POI autocomplete (7NOW: type "Bellagio," not "3600 S Las Vegas Blvd") → meeting-point picker pre-populated per hotel (`Valet` / `Rideshare pickup` / `North tower entrance`) → phone number.** Store the meeting point as data against each property. No national app has built this. It is the most Strip-specific product decision available to you and it turns a constraint into visible competence.

**3. Nicotine pouches are the hotel-room product. Merchandise them that way.**
Strip resorts have installed **Halo smart sensors that detect tobacco vape, not just cannabis** — MGM charges **$500 per room / $1,000 per suite**, Caesars $250–500. Meanwhile you stock ~20 pouch SKUs (Zyn, On, Rogue, Velo, Lucy, Fre, Alp, Zone, Copenhagen) and merchandise them as a generic category. Build **"Won't set off the sensor"** as a filter and a landing page: no smoke, no smell, no $500 fee. This is a genuine service to the customer, it sells a high-margin category nobody markets in Vegas, and it earns trust by warning people about a fee you have no obligation to mention.

**4. Sell the e-hookah as the hotel-room hookah — a category with zero competition.**
Hookah in a hotel room is prohibited outright on fire-code grounds. Existing hookah delivery operators (Smoke By Night, $150 flat) need **four hours' notice** and can't serve a room anyway. But you already stock **nine-plus "hookah vape" SKUs** nobody merchandises: Geek Bar Burj 80K Hookah Vape ($49.99), Olit Hookahlit Plus ($59.99), Olit Pro 60k ($44.99), Lost Mary E-Hookah 26K ($36.99), Geek Bar Hookah X DTL 25K ($39.99), DKHAAN Hookah 25K ($29.99), Pop Salt Onyx Cloud 25k Hookah ($36.99), Al Fakher Crown Bar 12k ($29.99). And **`hookah las vegas delivery` has no smoke shop ranking on it at all.** Build `/hookah-delivery-las-vegas` around an honest premise: *"You can't smoke a hookah in your hotel room. Here's what actually works."* Free lane, real inventory, genuine customer service.

**5. Put the price on the tile — and price-per-puff next to it.**
Price is the *only* thing in every negative review you have. INEEDAVAPE gates prices behind login; Lali shows none at all; Strip convenience stores famously don't use price tags. **Being the shop that shows the number is a differentiator here, not table stakes.** Then add the thing no cigar or vape retailer surveyed actually displays on the buy box: **price per 1,000 puffs.** Your Geek Bar Burj 80K at $49.99 is **$0.62/1k**; a Flum Pebble at $32.99 is far more. This reframes a $49.99 sticker from "Strip gouging" to "cheapest thing on the wall" — using arithmetic, not adjectives. Cigars International exposes price-per-stick only as a *filter*; nobody puts it on the product.

**6. Build the hotel-proximity pages Lali is stealing from you with a lie.**
They rank for `smoke shop near Bellagio / Caesars / Paris / Flamingo / MGM Grand` from **710 E Flamingo Rd**, three-quarters of a mile off the Boulevard, while claiming to be "in the heart of the Strip." You are actually there. Build the set with what they cannot fake: **real walking time, the real route (including the Flamingo skybridge), and a photograph of the Grand Bazaar entrance at night.** Which solves your second-biggest complaint —

**7. Treat wayfinding as a product feature, not a map pin.**
*"So hard to find"* is in your reviews, and Grand Bazaar Shops itself sits at **3.1 stars with "no directional markers"** as a recurring complaint. Ole Red and Bottled Blonde now physically obscure the mall from the Strip. Build a **"Finding us at 2 a.m."** module: a three-photo sequence shot at night (the Ole Red facade → the entrance you turn at → your storefront), the walk time from each adjacent resort, and one line of orientation copy — *"Next to Ole Red, behind Bottled Blonde, across from the Bellagio fountains."* Nobody in this category has ever built a wayfinding component. Your location is your whole strategy and customers can't find the door.

**8. Tap-to-SMS with a pre-filled message body, sticky on every page.**
Cash on delivery means **there is no payment step to build** — a text thread is a complete transaction channel. No app, no account, no card form, works on a dying phone on hotel wifi, asynchronous so an impaired customer can type badly and a human parses it, and it produces a persistent thread so tomorrow's reorder is one message. Pre-fill the body — *"Hi, I'm at ___ room ___, I need ___"* — which teaches the format without a form. Precedent: Smokes Mart's own owner directs customers to text because the phone fee is $7 against $30 online.

**9. Publish the delivery economics before the menu, and compute the cash.**
Fee surprise is the single documented #1 delivery failure in this market ($30 vs $7; $41 at 12 miles; 45 minutes promised, 2 hours delivered). Steal Weedmaps' one-liner — a fixed header strip reading **`Free delivery to Strip hotels · No minimum · Cash at your door · Open now`** — and Instacart's *window* rather than a countdown (`Delivery by 2:40–2:55 AM` reads as a commitment; a ticking timer reads as a guess). Then steal DoorDash's cash mechanics: checkout computes **"Bring $47 cash"**, drivers carry $10–15 in change, and dispatch ships with the four-option structured failure picker (`short on cash` / `no change` / `unavailable` / `refused`) from day one. Add Zelle as a tip option — a customer explicitly praised that.

**10. Split the catalog by regulatory class in the data model, and decide about the grey inventory now.**
Add a per-SKU `regulatoryClass` field before a single template is designed, because these are four different products legally:
- **ENDS/vapes** → PACT Act applies (2020 amendment), age verification against a government-sourced database before sale plus adult signature and photo ID at delivery.
- **Cigars & pipe tobacco** → **not** covered by PACT. But Nevada's **AB 471 (2025), effective 1 Jan 2026**, created a Remote Retail Seller licence for cigars and pipe tobacco — **$650/yr, triggered at $100,000 or 200 remote transactions a year**, a threshold a busy Strip shop crosses trivially.
- **Nicotine pouches** → different again.
- **Intoxicating hemp** → you are currently live-selling `thca` ($40 THCA disposable), `hazy-mary-2g-diamond-preroll` ($20), Polkadot mushroom gummies ($40), 7-OH products and Space Gas nitrous ($180 for 4.4L). Nevada's **SB 356 (2025)** is reported to have moved delta-8/10, THC-O, HHC and **THCA flower** exclusively to CCB-licensed dispensaries. **Get counsel on this before the rebuild, not after.** It is simultaneously your largest legal exposure and the exact category tourists have been most loudly warned about on Reddit — and a trust-first positioning cannot survive sitting next to it unexamined.

---

## APPENDIX — TECHNICAL DEFECTS FOUND ON THE LIVE SITE

Fix list, evidence-backed:

- **Hours:** homepage reads `Daily 10:00 AM — 7:00 PM`. No `LocalBusiness` or `openingHoursSpecification` schema anywhere.
- **No delivery page** in a 240-URL sitemap, despite three delivery badges on the homepage.
- **Unedited Ecwid template defaults as trust badges:** *"Free Returns"* with tooltip *"We guarantee a free return anywhere in the world with no questions asked."* False, and a liability on nicotine.
- **Return policy is a dropshipper template** referencing *"our warehouse,"* prepaid shipping labels, and a broken contact address — *"**Pu vegas.us@gmail.com**"* (the "ff" is missing from a botched find-and-replace). Directly contradicts the "Free Returns" badge.
- **Raw AI scaffolding shipped to production.** On `/products/geek-bar-pulse-x-25k`: *"What flavors are available? … **(You would insert specific flavor options here, e.g., "…")**"*
- **PDPs are written in the third person about you** — *"we highly recommend visiting Puff Vegas Smoke and Vape Shop. They offer a great selection…"* — as though by an affiliate.
- **Premium cigars have no price, no stock, no add-to-cart.** Montecristo, Romeo y Julieta, Acid, Macanudo, Backwoods all verified.
- **Three of thirteen nav categories contain zero products.** `/products/hookah--shisha-accessories` is 12.9KB of AI FAQ (*"Is hookah a drug or not?"*) with **no product links at all**. Same for `/products/nicotine-pouches` and `/products/hand-pipes`. `/products/CIGARS-c166241842` runs **1,144 words before the first price**; `/products/cigarettes` runs 523.
- **Testimonial avatars are Unsplash stock headshots** attached to real customers' names.
- **Empty homepage sections:** `## Top Categories` and `## Bestseller Vapes` headings render with nothing beneath them. Testimonials render twice each.
- **Broken headline grammar:** *"You Need to Know About Smoking on the Las Vegas"*; *"the largest selection … in Strip!"*; `<title>` has a double space.
- **`Dba address`** left as a literal field label on two pages.
- **NAP inconsistency:** site says *Unit 611-612*; landlord says *Suite 611, 612, 613*; Yelp says *611-612-613*.
- **European decimal separators throughout the catalog** — *"Foger 30.000 Puff"*, *"Nexa Ultra 50.000 Puff"*. To a US reader that is thirty puffs.
- **Un-rounded price artifact:** Spaceman 10K Pro at **$23.07**.
- **Blog contradicts the store:** *"Pillow Talk Ice Control 40,000 Puffs – $35.99"* in the heading; the embedded product widget says **$29.99**. The blog is also titled *"best disposable vapes 2025"* in August 2026.
- **Orphaned content:** `/about-us`, `/blogs`, `/cigars-las-vegas`, `/best-disposable-vapes-2025` and six more exist but appear in **no navigation**. No internal link equity.
- **Blog targets unwinnable national keywords** (`what-is-the-top-selling-vape`, `most-popular-disposable-vape-2025`) instead of local situational intent. Only one local page exists.
- **No category/collection URLs in the sitemap at all** — 223 products with no browsable taxonomy; category pages are faked as products (`/products/cigarettes`, `/products/kratom`).
- **Glass sold by "size":** `glass-bong-size-3` through `size-8`. Nobody buys a bong by "size 5."
- **Duplicate/typo slugs:** `starbuzz-tabacco` **and** `starbuzz-tobacco`; `grabba-leaf` **and** `graba-leaf-crushed`; `hookah-725116287`; `xxx`; `benson--hedges`.
- **Kill `puffvegas.square.site`.** 301 the whole domain. It is indexed, it competes with you in the SERP, its catalog is three years stale with no images and 47% out of stock, and it carries a live typo — *"Puff Vegas Smake and Vape Shop."*

---

### Research caveats, stated plainly

`puffvegas.us` is unreachable by direct fetch from this environment (Zscaler 403 / TLS reset); everything above came through a server-side rendering proxy, so JS-only elements may be under-represented. **SERP positions are DuckDuckGo organic, not Google's local pack** — directional only. The **110,000 pedestrians/day** figure is the landlord's own leasing collateral, not an audited count. **No verbatim Google review text** was obtainable — the 25 one-star Google reviews are unread, and are the highest-value unexamined data about your business. Reddit quotes are Google result snippets, not full threads. **Three items need a Nevada tobacco attorney before anything ships:** whether own-employee local delivery escapes NRS 370.0285's "delivery service" definition; the current status of SB 356 against your live THCA and hemp SKUs; and whether your retail-tobacco-store status supports in-store sampling under NRS 202.2483.agentId: a7557baa78584e15a (use SendMessage with to: 'a7557baa78584e15a', summary: '<5-10 word recap>' to continue this agent)
<usage>subagent_tokens: 249874
tool_uses: 91
duration_ms: 1916981</usage>