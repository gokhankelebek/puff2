I have comprehensive primary-source coverage. Writing the report now.

# Compliance & Risk Assessment — Puff Vegas Smoke & Vape Shop Website Build

**Prepared:** August 19, 2026 · **Client:** Puff Vegas Smoke & Vape Shop, 3649 S Las Vegas Blvd, Las Vegas NV 89109 · **Domain:** puffvegas.us

> **This is a compliance risk assessment by an agency compliance lead, not legal advice.** Items marked 🔴 **NEEDS COUNSEL** must be reviewed by a licensed Nevada attorney with tobacco-regulatory experience before launch. Where I could not verify something, I say so.

**Note on the live site:** I could not load `puffvegas.us` or `puffvegas.square.site` from this environment (connection reset / JS-rendered). Search results confirm a Square Online storefront at `puffvegas.square.site` and a `/products/` page on `puffvegas.us`. **A manual audit of the live site against Sections 5 and 7 below is a required first step.**

---

## 0. The three findings that should reframe the project

1. **FDA publishes a list of every e-cigarette that may legally be sold in the US. There are 45 of them.** None are Elf Bar, Geek Bar, Lost Mary, Breeze, Esco Bar, RAZ, or any comparable disposable brand. FDA's own page says: *"There are 45 e-cigarettes authorized by the FDA. These are the only e-cigarettes that may be lawfully sold in the United States."* ([FDA, current 05/05/2026](https://www.fda.gov/tobacco-products/market-and-distribute-tobacco-product/e-cigarettes-vapes-and-other-electronic-nicotine-delivery-systems-ends-authorized-fda))

2. **Publishing a product catalog online converts a physical-inspection risk into a zero-cost remote-surveillance risk.** FDA issues warning letters based on reading websites. Two current examples I pulled in full: [onlinevapeshop.us, Oct 31 2025](https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/onlinevapeshopus-719025-10312025) — *"FDA recently reviewed the website https://www.onlinevapeshop.us and determined that [ENDS] products listed there are offered for sale"* — and [lowkeydis.com, Nov 14 2025](https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/lowkeydiscom-719647-11142025). No test purchase. The listing was the evidence. **FDA cc'd the letters to Squarespace Domains and Shopify's abuse desk** — a domain- and platform-level takedown vector.

3. **Square's own terms prohibit exactly what the client is doing today.** Square Payment Terms, prohibited activities, item **(24)**: *"internet/mail order/telephone order of age restricted products (e.g., tobacco)."* ([squareup.com/us/en/legal/general/payment](https://squareup.com/us/en/legal/general/payment)) A live Square Online store selling vape and tobacco is a terms violation exposing the client to account termination and a funds hold.

---

## 1. THE PACT ACT

All statutory text below was pulled verbatim from `uscode.house.gov` (current through Aug 18, 2026).

### 1.1 Scope — what is and is not covered

**15 U.S.C. § 375(2)** — *"The term 'cigarette' … includes … (I) roll-your-own tobacco … and (II) an electronic nicotine delivery system. **(B) Exception.** The term 'cigarette' does not include a cigar (as defined in section 5702 of title 26)."*

**15 U.S.C. § 375(7)** — ENDS means *"any electronic device that, through an aerosolized solution, delivers **nicotine, flavor, or any other substance** to the user,"* including e-cigarettes, e-hookahs, e-cigars, vape pens, refillable vaporizers, electronic pipes, *"and **any component, liquid, part, or accessory** of a device described in subparagraph (A), **without regard to whether** the component, liquid, part, or accessory is sold separately from the device."*

| Product | PACT Act? | Basis |
|---|---|---|
| Nicotine vapes, disposables, pods | **YES** | § 375(2)(A)(ii)(II) |
| **Zero-nicotine e-liquid, coils, tanks, batteries, chargers sold separately** | **YES** | § 375(7)(A) covers "flavor, or any other substance"; (B)(vii) covers components/parts/accessories sold separately |
| Cigarettes, RYO | **YES** | § 375(2)(A) |
| Smokeless / dip / snuff | **YES** | § 375(13) |
| **Premium and machine-made cigars** | **NO** | § 375(2)(B) express exception |
| **Hookah / shisha tobacco** | **NO** | Not a "cigarette" under [18 U.S.C. § 2341(1)](https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title18-section2341); not "smokeless tobacco" (§ 375(13) requires consumption *without being combusted*) |
| **Glass, pipes, bongs, grinders, papers** | **NO** (but see § 6.4) | Not tobacco products; separate paraphernalia analysis under 21 U.S.C. § 863 |
| Nicotine pouches (ZYN etc.) | **Likely no** — not combusted, but "smokeless tobacco" definition is arguably broad enough to reach tobacco-derived pouches. 🔴 **NEEDS COUNSEL** |

### 1.2 The USPS ban

**18 U.S.C. § 1716E(a)(1):** all cigarettes and smokeless tobacco (which includes ENDS via the Jenkins Act definition) are **nonmailable**. USPS's final rule implementing this for ENDS took effect **October 21, 2021**.

Two provisions of § 1716E deserve the client's specific attention:

- **§ 1716E(b)(1) — Cigars are exempt.** Cigars remain mailable via USPS. Confirmed in [USPS Publication 52 § 471](https://pe.usps.com/text/pub52/pub52c4_026.htm): *"The term cigarette includes roll-your-own tobacco and **excludes cigars**."*
- **§ 1716E(a)(2)(A) — "Reasonable cause" for USPS to refuse a package includes *"a statement on a publicly available website, or an advertisement, by any person that the person will mail matter which is nonmailable under this section in return for payment."*** Publication 52 § 472.3 repeats this. **This means the website copy itself can trigger USPS refusal, seizure and forfeiture (Pub 52 § 472.22–.24) — independent of anything actually mailed.**

Pub 52 § 471 also confirms ENDS *"includes any component, liquid, part, or accessory … regardless of whether they are sold or provided separately **or contains or is used with nicotine**."* Zero-nic is nonmailable.

Narrow exceptions ([Pub 52 § 473](https://pe.usps.com/text/pub52/pub52c4_028.htm)): intra-Alaska and intra-Hawaii; licensed business/regulatory B2B with PS Form 4615 approval; non-commercial individual returns; consumer testing; public-health agencies. **All require face-to-face presentation at a Post Office counter — § 473.1(e) expressly excludes package pickup, lobby drops, collection boxes, and Approved Shipper locations.** None of these help a retailer.

### 1.3 Private carriers — worse than commonly assumed

I pulled the **FedEx Service Guide (2026 edition, updated July 20, 2026)** and extracted the US Terms & Conditions "Prohibited Items" list verbatim:

> *"**Tobacco and tobacco products, including but not limited to cigarettes, cigars, loose tobacco, smokeless tobacco, hookah, or shisha.**"*
>
> *"**Electronic cigarettes and their component parts, any other similar device that vaporizes or aerosolizes any substance for inhalation, and any noncombustible substance, regardless of the presence of nicotine, that can be used with any such device.**" (Effective March 1, 2021)*

**This is the single most-missed fact in this vertical: FedEx prohibits cigars and hookah/shisha too, not just vape.** The common advice that "cigars are fine, just don't ship vape" is wrong as to FedEx.

- **UPS** announced a comparable ban on all vaping products effective **April 5, 2021**, regardless of nicotine content or destination state. ⚠️ **Secondary sources only** — ups.com actively blocks automated retrieval; I could not quote the primary tariff. Verify directly.
- **DHL** — likewise reported to refuse. ⚠️ Unverified; dhl.com blocked.
- Small PACT-registered specialty carriers exist for intra-state and limited regional vape delivery, at materially higher cost. ⚠️ I could not verify any specific carrier's current legitimacy or coverage. Do not build a business case on one without diligence.

**Net: there is no realistic B2C interstate shipping lane for vape, and for cigars the client would need USPS or a regional carrier — not FedEx.**

### 1.4 Registration, reporting, and delivery-sale duties

**⚠️ The trigger is broader than shipping.** **15 U.S.C. § 376(a):** *"Any person who sells, transfers, or ships for profit cigarettes or smokeless tobacco in interstate commerce … **or who advertises or offers cigarettes or smokeless tobacco for such a sale, transfer, or shipment**, shall — (1) first file with the Attorney General of the United States and with the tobacco tax administrators of the State and place into which such shipment is made **or in which such advertisement or offer is disseminated** …"*

**Merely advertising or offering interstate shipment of vape on a public website triggers the federal registration obligation — before a single package moves.** This is a website-design-level finding.

Once registered, § 376(a)(2) requires a filing **by the 10th of each month** with each destination state's tobacco tax administrator, itemizing every shipment: recipient name and address, brand, quantity, and the name/address/phone of the person who delivered it, organized by city, town and ZIP.

**§ 376a delivery-seller duties** (a "delivery sale" under § 375(5) is triggered by an internet order **or** remote delivery — disjunctive):

| Duty | Cite | Detail |
|---|---|---|
| Package label | § 376a(b)(1) | Exact text on the shipping label surface: **"CIGARETTES/NICOTINE/SMOKELESS TOBACCO: FEDERAL LAW REQUIRES THE PAYMENT OF ALL APPLICABLE EXCISE TAXES, AND COMPLIANCE WITH APPLICABLE LICENSING AND TAX-STAMPING OBLIGATIONS"** |
| Weight cap | § 376a(b)(3) | No single sale or delivery over **10 pounds** |
| Age verification at order | § 376a(b)(4)(A)(iii) | Obtain full name, birth date, residential address; verify *"through the use of a **commercially available database or aggregate of databases, consisting primarily of data from government sources**"* |
| Database independence | § 376a(b)(4)(B) | The database *"shall not be in the possession or under the control of the delivery seller, or be subject to any changes or supplementation by the delivery seller"* |
| Adult signature at delivery | § 376a(b)(4)(A)(ii) | Purchaser or an adult 21+ must **sign**, and must show *"a valid, government-issued identification bearing a photograph"* |
| Records | § 376a(c) | Retain **4 full calendar years** past the delivery-sale year; produce to state tax administrators, state AGs, tribal and local officials, and the US AG |
| Taxes prepaid | § 376a(d) | Destination **state and local excise tax must be paid and stamps affixed before** sale, delivery, or tender to a carrier |
| Full state-law parity | § 376a(a)(3) | Comply with all destination-state law *"as if the delivery sales occurred entirely within the specific State"* — including licensing and tax-stamping |
| Blacklist | § 376a(e) | US AG maintains and distributes a list of noncompliant delivery sellers to every state AG, tax administrator, and to carriers and USPS; being listed is itself "reasonable cause" for USPS refusal |

**Penalties — 15 U.S.C. § 377:** knowing violation = **up to 3 years imprisonment** plus Title 18 fines. Civil penalty for a delivery seller = the greater of **$5,000 first violation / $10,000 thereafter, or 2 percent of the delivery seller's gross cigarette/smokeless sales for the preceding year** — the percentage prong can dwarf the flat amounts. State AGs may sue.

### 1.5 What this means for the website, concretely

- **The site cannot offer, advertise, or accept interstate orders for vape/ENDS or e-liquid** — including zero-nicotine e-liquid, coils, tanks, or batteries sold separately.
- **The site must not state or imply that it ships or mails these products** — that statement alone is statutory "reasonable cause" (18 U.S.C. § 1716E(a)(2)(A)) and an "offer" triggering § 376(a) registration.
- 🚩 **The reported "returns within the United States" language is an active liability.** A returns policy implying nationwide inbound/outbound movement of tobacco products signals interstate delivery sales. If a customer mails a vape back, that is itself a § 1716E violation by the customer and evidences the arrangement. **Remove or rewrite it; restrict returns to in-store only for all tobacco/nicotine SKUs.**
- Cigars are outside PACT and outside the USPS ban — but see § 3.4, because Nevada now regulates remote cigar sales directly, and destination states increasingly do too.

---

## 2. LOCAL DELIVERY — is own-driver same-day a way around it?

**Partially, and less than the client will hope. The order channel, not the delivery method, is what triggers most of the law.**

### 2.1 An internet order is a "delivery sale" even with your own driver

- **Federal, 15 U.S.C. § 375(5):** delivery sale means a sale where **(A)** the consumer orders by phone, mail, or internet, *"or the seller is otherwise not in the physical presence of the buyer when the request for purchase or order is made"* — **or** (B) it is delivered remotely. Prong (A) alone is satisfied by a web order.
- **Nevada, NRS 370.0285:** identical disjunctive structure — *"(a) The purchaser submits the order for the sale by means of a telephonic or other method of voice transmission, the mail or any other delivery service, or the Internet or any other on-line service; **or** (b) … delivered by mail or the use of another delivery service."*

**What own-employee delivery *does* buy:**
- Nevada's **NRS 370.029** defines "delivery service" as *"any person engaged in the **commercial** delivery of letters, packages or other containers."* A W-2 employee driver is arguably not one — so prong (b) is avoided (prong (a) still catches you).
- **No common carrier is involved**, so the FedEx/UPS/USPS bans do not apply.
- Clark County's employee exemption (§ 3.6) means individual drivers do not need their own licenses.
- 🔴 **Whether federal § 376a(b)(4) applies is genuinely ambiguous** — its age-verification duties are framed as applying to *"a delivery seller who **mails or ships** tobacco products."* An own-driver hand delivery arguably is neither. But § 376a(a) applies "with respect to delivery sales into a specific State and place" without that qualifier. **NEEDS COUNSEL.** In practice this is moot for Nevada, because state law independently imposes an equivalent duty (below).

### 2.2 What Nevada actually requires — NRS 202.24935 is the binding constraint

**NRS 202.24935** (verified verbatim from [leg.state.nv.us](https://www.leg.state.nv.us/nrs/nrs-202.html)) applies to *every* person who sells tobacco, vapor, or nicotine products to a consumer in Nevada *"through the use of a computer network, telephonic network or electronic network."* No in-state carve-out. No own-driver carve-out.

Requirements:
1. **(2)(a)** Packaging when shipped clearly marked "cigarettes" / "tobacco products" / "vapor products" / "nicotine products" as applicable.
2. **(2)(b)** Obtain **full name, date of birth and residential address**, and perform verification *"through an **independent, third-party age verification service** that compares information available from a **commercially available database, or aggregate of such databases**, that are regularly used by governmental agencies and businesses for the purposes of age and identity verification to the personal information entered by the person **during the ordering process**."*
3. **(3)** **Certify annually to the Nevada Attorney General** that such a service is in use.
4. **(4)** Civil penalty up to **$1,000 per violation** **plus suspension or revocation of the Department of Taxation license**.
5. **(5)** Any violation of subsection 2 is a **deceptive trade practice** under NRS 598.0903–598.0999.

**A self-attested "I am 21" checkbox is not compliant in Nevada for any online order.** This is the highest-probability launch failure and it is cheap to fix.

### 2.3 Age verification at the door — Nevada is stricter than federal

**NRS 370.521(3)**, verbatim: *"a person shall not sell, distribute or offer to sell cigarettes, cigarette paper or other tobacco products to any person **under 40 years of age** without first performing age verification through **enhanced controls that utilize a scanning technology or other automated, software-based system** to verify that the person is 21 years of age or older. A person who violates this subsection is liable for a **civil penalty of $100 for each offense.**"*

The only exemption is a face-to-face transaction inside a casino area where under-21 loitering is already barred (NRS 463.350). **A doorstep handoff is not exempt.** Drivers need an ID-scanning app, not an eyeball check.

Licensee penalties for under-21 sales, **NRS 370.521(7)**, per premises within 24 months: **$2,500 → $5,000 → $7,500 → $10,000.**

### 2.4 The cigarette problem

**NRS 370.585(4)(b)** authorizes a tobacco retail dealer to *"Sell cigarettes **from the premises for which the license was issued** to any consumer in this State"* — while **(4)(d)** authorizes selling other tobacco products *"to any consumer in this State"* with **no premises limitation**. **NRS 370.581** separately bars operating "from any location other than the location listed on the face of the license," and **Clark County Code 6.04.120** says conducting business at an unlicensed location means the board *"shall revoke such license forthwith."*

🔴 **NEEDS COUNSEL / written determination from the Nevada Department of Taxation (866-962-3707): may cigarettes be delivered off-premises at all?** If not, the fallback is clean — deliver cigars, pipe tobacco, smokeless and vapes; keep cigarettes in-store pickup only.

### 2.5 Third-party delivery apps

- **DoorDash** marketplace: *"DoorDash does not currently allow Merchants to directly sell tobacco products. This includes cigarettes, cigars, e-cigarettes, vapes, vape pens, JUUL devices, and other nicotine or tobacco-related products."* **But** merchants with a **tobacco-specific agreement** may use Dashers for **merchant-originated** (white-label / DoorDash Drive) orders, with mandatory 21+ photo-ID verification at every delivery. ⚠️ Whether DoorDash grants these in Nevada is unverified — worth a call, as it would remove the need to own vans and drivers.
- **Uber Eats:** prohibits *"Nicotine and tobacco (including vaping products, chewing tobacco, rolling papers, and hookahs)."* Smoke-free/tobacco-free oral nicotine (ZYN-type) is *restricted*, i.e. allowed with Uber approval.

### 2.6 Recommended local-delivery architecture

1. Third-party database AV at checkout (NRS 202.24935(2)(b)) — order not released to picking until it passes.
2. Every bag marked "TOBACCO PRODUCTS" / "VAPOR PRODUCTS" as applicable — cheap, no downside.
3. Driver ID **scan** (not visual) for anyone appearing under 40, plus signature capture.
4. **No unattended drops. Ever.** No porch, no lockbox, no neighbor.
5. **No handoffs on public right-of-way** — Clark County Code 6.04.130 bars selling or offering merchandise on a public right-of-way. On the Strip this is a live enforcement scenario. Deliver to a door or unit.
6. **W-2 employee drivers, not independent contractors** (see § 3.6).
7. Per-delivery log: order ID, AV result, driver, ID-scan result, timestamp, address. Written driver training program with signed acknowledgments and refusal-logging authority.

---

## 3. NEVADA + CLARK COUNTY

### 3.1 Jurisdiction — this is good news

3649 S Las Vegas Blvd is on the Strip, which is **unincorporated Clark County (Paradise township), not the City of Las Vegas.** This matters: the City has **LVMC Chapter 6.82**, requiring a *privileged* business license, employee **work cards**, and a flat ban on anyone under 21 entering a smoke or vape shop. **Clark County has no equivalent chapter** — Title 6 contains no tobacco/smoke-shop chapter and Title 9 (Public Health) contains no tobacco chapter. ⚠️ Confirm parcel jurisdiction on the county GIS before relying on this.

### 3.2 Licensing

| License | Authority | Cost |
|---|---|---|
| Nevada State Business License | NRS 76.100 | $200 (LLC/sole prop) / $500 (corp), annual |
| Nevada sales tax permit | NRS ch. 372/374 | — |
| **Nevada Tobacco Retail Dealer License** | **NRS 370.567**, fee at **NRS 370.587(2)(d)** | **$50/yr, per location** |
| Clark County business license — **Tobacco Stores, NAICS 453991**, per **CCC 6.12.969** | CCC 6.04.010 | $45 application + % of gross revenue, semiannual. **"Retail Group 2" — a General license, not Regulated or Privileged** |
| Nevada **Remote Retail Seller** (cigars/pipe tobacco) — if applicable | NRS 370.5033, .50333 | **$650/yr** + surety bond |
| Clark County Delivery Service (NAICS 492000, CCC 6.12.415) — possibly | CCC 6.12.415 | $150/yr ⚠️ may be covered by the retail license |

**One state license covers everything.** Per **NRS 370.440(5)** (as amended by AB 471, 2025), "other tobacco product" means *"any tobacco of any description, **any vapor product, any alternative nicotine product** or any product made from tobacco, other than cigarettes."* **There is no separate Nevada vape-shop license.** Licenses are location-specific, must be posted at the premises (NRS 370.583), run on the calendar year, and **auto-cancel if unpaid by January 15** (NRS 370.587(4)).

**Sourcing restriction:** all cigarettes and OTP must be purchased from **Nevada-licensed wholesale dealers** (NRS 370.585(4)(a),(c)).

### 3.3 Flavored vape restrictions — none, and locals are preempted

- **No statewide flavor ban.** I searched the full text of NRS 370 and NRS 202: zero occurrences of "characterizing flavor" or any flavor restriction.
- **No Nevada vape product directory / PMTA registry.** Zero occurrences of "registry" in NRS 370; the only "directory" is the MSA cigarette directory (NRS 370.600–.705). **SB 435 (2025)**, which would have created a vapor directory with a January 1, 2027 sale ban on unlisted products and a $2,500→$10,000 retailer penalty ladder, **died at sine die on June 3, 2025**. ([SB 435 text](https://www.leg.state.nv.us/Session/83rd2025/Bills/SB/SB435.pdf))
- **Locals cannot fill the gap. NRS 202.249(4):** *"an agency, board, commission or **political subdivision** of this state, including … any … **governing body of a local government, shall not impose more stringent restrictions** on the smoking, use, sale, distribution, marketing, display or promotion of tobacco or products made or derived from tobacco"* than the enumerated state statutes. Only school districts are carved out. This is why Clark County has no flavor ordinance.
- ⚠️ **Two limits:** the preemption reaches products *"made or derived from tobacco,"* which arguably leaves **synthetic-nicotine** products open to local regulation (untested, no Nevada case law). And it does not preempt **business licensing** (NRS 370.591 expressly preserves it) or **zoning** — which is how the City of Las Vegas sustains LVMC 6.82.

**⏰ Watch item:** Nevada's Legislature meets in odd years. Expect an SB 435 successor in the **2027 session** — its sponsors included the Senate Majority Leader and the Assembly Speaker. **Build the catalog so it can be filtered by FDA-authorization status on short notice.**

### 3.4 Nevada's new remote cigar regime — the sleeper issue

**AB 471 (2025)** created **NRS 370.5031–370.50341**, effective **January 1, 2026**. Key text:

**NRS 370.50317:** a *"remote retail sale"* is a sale of a cigar or pipe tobacco to a Nevada consumer where the order comes by phone, mail, or internet, *"or the seller is otherwise not in the physical presence of the buyer when the request for purchase or order is made"* — or where delivery is remote.

**NRS 370.50318:** a remote retail seller is *"a person located **within** or outside the borders of this State"* who makes such sales. **No volume threshold in the license definition.**

Obligations: **$650/yr license** (NRS 370.5033, .50333) · **surety bond** (.50334) · **license information must be posted on the seller's website** (.50332(1)) · **third-party database age verification is a licensing precondition** (.50331(3)) · **5-year recordkeeping** with itemized invoices including method of delivery (.50335) · **30% of actual cost tax**, capped at $0.50/premium cigar through June 30, 2027 (.5034) · **monthly reports and tax within 20 days of month-end** (.50341) · **misdemeanor** for selling without paying the tax.

The **$100,000 / 200-sale thresholds apply only to the tax** (NRS 370.5034(3)), **not to the license requirement.**

🔴 **THIS IS THE #1 OPEN QUESTION.** On the face of the statute, a Las Vegas cigar shop taking online cigar orders is a remote retail seller needing the $650 license. But NRS 370.440(9) says "retail dealer" *"does not include a remote retail seller,"* hinting the categories are meant to be mutually exclusive. **Get a written determination from the Nevada Department of Taxation before building the cigar catalog.**

**Strategic implication:** Nevada's statute looks like a model act. Other states are adopting comparable remote-cigar regimes. **Out-of-state cigar shipping requires a 50-state survey, not an assumption.**

### 3.5 Taxes

| Item | Rate | Cite |
|---|---|---|
| Cigarettes | **90 mills/cigarette = $1.80 per 20-pack** (precollected by wholesaler via stamp) | NRS 370.165, .170 |
| OTP incl. cigars, smokeless, **vapor products** | **30% of wholesale price** (paid by the licensed wholesaler) | NRS 370.450(1) |
| Premium cigars | 30% of wholesale, **capped $0.50/cigar, floor $0.30/cigar** (through 6/30/2027; flat 30% thereafter) | NRS 370.450(1)(b) |
| Remote retail cigar/pipe | 30% of actual cost, above $100k/200-sale thresholds | NRS 370.5034 |
| Sales tax, Clark County | **8.375%** combined | tax.nv.gov |

**Destination sourcing:** under **NRS 360B.360**, a delivered sale is sourced to the customer's delivery address, not the store. Rates don't move within Clark County, but **the cart must compute address-based rates** if delivery ever crosses a county line (Nye County is 7.60%).

⚠️ **Nicotine pouch trap:** per the Department of Taxation's [Tobacco Products FAQs](https://tax.nv.gov/wp-content/uploads/2026/02/Tobacco-Products-FAQs.pdf), pouches with **tobacco-derived** nicotine (ZYN, VELO, ROGUE) are **not** OTP-taxed, while **synthetic-nicotine** pouches are. Verify each SKU's nicotine source with the wholesaler.

**MSA / cigarette directory:** only brands on the Nevada AG-certified, Fire-Standard-Compliant directory may be sold. *"All unlisted manufacturers, brand families, and styles are not legal for sale in Nevada."* ([Nevada AG Tobacco Directory](https://ag.nv.gov/Hot_Topics/Issue/Tobacco_Enforcement_Unit_-_Directory) · [current list](https://tax.nv.gov/wp-content/uploads/2025/11/FSC-MSA-Compliant-Tobacco-Directory-APPROVED-03.28.2025-002.pdf)) Covers **cigarettes and RYO only** — not cigars, vapes, or pouches. Screen every cigarette SKU before listing and re-screen annually.

### 3.6 Clark County operational points

- **CCC 6.04.010** makes *"the making of deliveries of goods, wares, and merchandise sold elsewhere"* a licensable activity in its own right.
- **CCC 6.04.020 / 6.04.030:** the license tax does not apply to a person engaged in a licensed occupation *"solely as an employee."* Meanwhile Clark County's [Drivers — Independent Contractors](https://www.clarkcountynv.gov/business/doing_business_with_clark_county/divisions/drivers-independent-contractors) page requires each independent-contractor delivery driver to hold their own license ($45 + $25/yr). **Use W-2 drivers.**
- ⚠️ Whether a separate **Delivery Service** license (CCC 6.12.415, $150/yr) is needed for a retailer's own deliveries is unclear — the fee schedule's "(independent of grocery store)" phrasing suggests no. Get it in writing: (702) 455-3557.
- ⚠️ **Peddler/solicitor licensing (CCC 6.56)** probably does not reach a driver delivering a pre-paid online order, but the definitions are loose enough to warrant written confirmation. These are Regulated licenses with bonds, ID cards, vehicle signage, and hours limits.
- **24-hour operation:** no Clark County Code hours restriction found for tobacco retail.
- 🔴 **Clark County Code Title 30 (zoning) could not be retrieved** — Municode and American Legal both block automated access. **This is the biggest unexamined local risk.** Confirm with Comprehensive Planning: whether "smoke shop"/"tobacco store" is a separately enumerated use, any special use permit, school/park separation standards, hours or signage conditions, and any Strip-corridor overlay.
- **Southern Nevada Health District** does not license tobacco retail; its role is Clean Indoor Air Act enforcement. Note SB 263 (2023) extended the Clean Indoor Air Act to electronic smoking devices — relevant if the client permits in-store vaping or sampling. Not researched here.

### 3.7 FDA PMTA enforcement — is it a real risk in 2026?

**Yes, and the online listing is what makes it real.**

- **Only 45 ENDS products are authorized**, from five manufacturers: Vuse (16), NJOY (10), Logic (8), Glas (6), JUUL (5). Tobacco and menthol only, except four Glas pods (Gold, Sapphire) authorized **May 5, 2026** — FDA's first non-tobacco/non-menthol authorizations, granted only because the device requires government-ID age verification, Bluetooth phone pairing, and biometric check-ins. **Four disposables are authorized: all NJOY Daily / Daily Extra, tobacco and menthol.** No grey-market disposable brand has an authorization.
- **Retailer liability is direct.** Unauthorized new tobacco products are **adulterated** (21 U.S.C. § 387b(6)(A)) and **misbranded** (§ 387c(a)(6)); 21 U.S.C. § 331 makes selling them a prohibited act. "Retailer" is defined at 21 U.S.C. § 387(14) with no carve-out.
- **Enforcement numbers** ([FDA, page current 08/17/2026](https://www.fda.gov/tobacco-products/compliance-enforcement-training/advisory-and-enforcement-actions-against-industry-unauthorized-tobacco-products)): **1,000+ warning letters to retailers**; 800+ to firms; **146 CMP complaints against brick-and-mortar retailers, 46 against online retailers**; maximum CMP **$21,903 per violation**, and FDA *"intends to seek the maximum penalty allowed by law."* Repeat underage-sale violations can trigger a **No-Tobacco-Sale Order** shutting down all tobacco sales at the location.
- **At least four Nevada operations already appear on FDA's manufacturer-CMP list** (Vegas Vapor Emporium, Vape NV, Sin City Vapor, Singing Hawk d/b/a Sin City III). ⚠️ **If Puff Vegas mixes or rebottles e-liquid, it is regulated as a manufacturer as well as a retailer.**
- **The "we didn't know" defense was deliberately foreclosed.** On September 30, 2025, FDA mailed compliance materials to **more than 300,000 retailers**; Commissioner Makary said the purpose was *"removing any excuses for noncompliance,"* citing that *"as much as 54% of vaping products sold nationally are illegal."*
- **Supreme Court, *FDA v. Wages and White Lion Investments*, 604 U.S. ___ (April 2, 2025), 9-0 (Alito, J.):** vacated the Fifth Circuit and upheld FDA's flavored-vape denial orders as consistent with its predecisional guidance on scientific evidence, comparative efficacy, and device type. The Court specifically rejected the argument that FDA's 2020 guidance created a *"safe harbor"* for non-cartridge (disposable) products. **There is no remaining litigation theory that unauthorized flavored disposables are lawful.**
- **2026 pivot — read carefully.** FDA issued final guidance **May 8, 2026**, *"Enforcement Priorities for Certain New Tobacco Products Marketed Without Premarket Authorization"* (Docket FDA-2026-D-5083), withdrawing the April 2020 guidance. Announced seizure operations have gone quiet in 2026 versus four in 2025. **But the guidance states plainly that *"all new tobacco products on the market without authorization are illegally marketed products,"* is expressly nonbinding, excludes products that are "disposable, cartridge-based, and other ENDS" from lower priority, and excludes anything with youth-appealing features. The promised public list of lower-priority products has not been published as of August 19, 2026** — meaning **no distributor's claim that a product is "on FDA's list" can currently be substantiated.** FDA's enforcement page, updated **two days ago**, still says *"The pendency of an application does not create a legal safe harbor."*
- **Import Alert 98-07** (published 01/06/2025) covers detention without physical examination of unauthorized ENDS, **multiple countries** — category-wide, not firm-specific.
- **State PMTA registries:** roughly **14 states** now maintain vapor product directories (reported: NC, VA, WI, MS, UT, IN, LA, AR, GA, TN, SC, AL, KY, WV). ⚠️ Sources conflict; verify each state's own directory. Retailer-side liability is independent of the manufacturer's. **Nevada has none.**

---

## 4. AGE VERIFICATION

### 4.1 What each layer of law requires

| Requirement | Source | Standard |
|---|---|---|
| Minimum age 21 | 21 U.S.C. § 387f(d); **21 CFR 1140.14**; NRS 370.521(1) | — |
| ID check at the counter | 21 CFR 1140.14 (FDA final rule, eff. **Sept 30, 2024**) | Photographic ID for anyone **under 30** ("no such verification is required for any person over the age of 29") |
| **ID scan at the counter** | **NRS 370.521(3)** | **Scanning technology or automated software-based system for anyone under 40.** $100/offense |
| **Database AV for any online order** | **NRS 202.24935(2)(b)** | Independent third-party service, commercially available government-sourced database, run **during the ordering process** |
| Annual AG certification | **NRS 202.24935(3)** | Recurring filing with Nevada AG's Tobacco Enforcement Unit |
| Database AV for interstate delivery sales | 15 U.S.C. § 376a(b)(4)(A)(iii)–(B) | Same standard, plus the database must not be seller-controlled |
| Photo ID + adult signature at delivery | 15 U.S.C. § 376a(b)(4)(A)(ii) | Federal, for mailed/shipped delivery sales |

**Note:** FDA's face-to-face requirement in 21 CFR 1140.14(a) applies to **cigarettes and smokeless tobacco**; "covered tobacco products" (cigars, pipe tobacco, ENDS) fall under 1140.14(b) with no face-to-face mandate. 🔴 The exact text of the mail-order exceptions in 1140.14(a)(3) could not be retrieved (eCFR blocks automated access) — **NEEDS COUNSEL to confirm verbatim.**

### 4.2 The three tiers, and what is sufficient where

| | Method | Proves | Cost | Friction |
|---|---|---|---|---|
| (a) | Self-attested DOB gate / checkbox | Nothing | $0 | ~none |
| (b) | Name + address + DOB matched to a commercial government-sourced database | A real 21+ person of that name/address exists | $0.25–$1.00/check | Low, invisible at checkout |
| (c) | ID document scan + selfie liveness | The live person matches an authentic ID | $0.50–$3.00/check | High (10–30% abandonment) |

| Channel | Legally required | Recommended |
|---|---|---|
| **Online order → in-store pickup** | Only (a) online — the binding check is the counter scan under NRS 370.521(3) and 21 CFR 1140.14. 🔴 *Caveat: if payment is captured online, NRS 202.24935 arguably attaches to the sale. NEEDS COUNSEL.* | (a) + soft (b); **never** let the online step substitute for the counter scan |
| **Online order → local delivery** | **(b) is mandatory** (NRS 202.24935(2)(b)) + **ID scan at the door** (NRS 370.521(3)) | (b) with step-up to (c) on no-match |
| **Interstate shipment of vape** | Not achievable — no carrier | — |
| **Interstate shipment of cigars** | **(b)** per destination-state law + PACT-parallel state regimes | (b) + adult signature |

**Expect 5–15% of legitimate customers to fail a database check** (young adults, recent movers, thin files). ⚠️ Directional industry figure, not a cited statistic. Without a step-up path those sales are simply lost.

### 4.3 Vendors

| Vendor | What it does | Integration | Pricing |
|---|---|---|---|
| **AgeChecker.net** | Database + ID-upload fallback. **Built for vape/tobacco e-commerce — best fit** | Shopify/Woo/Magento/BigCommerce plugins, APIs | **$25/mo + $0.50 per accepted verification.** No setup fee, no contract; declines and abandons are free ([agechecker.net/pricing](https://agechecker.net/pricing)) |
| **Veratad** (AgeMatch) | Government + credit-bureau database match, document verification, biometrics. Explicitly serves tobacco/vape/cannabis; widely used by national cigar retailers | Single API; VX no-code orchestration | Not published |
| **IDScan.net / VeriScan** | ID barcode parsing + forensic UV/IR authentication. **Best fit for the Nevada counter and the delivery van — one vendor, one cloud log** | Mobile + desktop apps, cloud portal, DIVE API | **Published:** VeriScan Cloud $35–$155/mo per device; DIVE API ~$0.40–$0.50/verification ([idscan.net/pricing](https://idscan.net/pricing/)) |
| **Yoti** | Facial age estimation (no ID needed), 10 methods; 99.3% true-positive identifying 13–17-year-olds as under 21 | **Free Shopify app** with 18+/21+ thresholds and state-level geo-restrictions | App free to install; usage billed separately. **Note: facial estimation alone does not satisfy the database requirement** |
| **Veriff** | Document + selfie liveness | API, SDKs, hosted flow | **Published:** $0.80/verification, $49/mo min (Essential) → $1.89, $209/mo min (Premium) |
| **LexisNexis Instant Age Verify** | Database only — 20B+ records from 500 sources. The archetypal statutory "commercially available database" | Real-time XML, batch | Not published; enterprise |
| **Intellicheck** | Forensic DMV-ID validation, not just barcode parsing. Strong fake-ID defense — relevant given Strip tourist/out-of-state ID volume | API, mobile SDK, retail POS | Not published |
| **Persona** | Document, biometric, database, workflow builder | API, SDK, no-code | Not published; third-party data suggests $25K–$100K annual minimums — **over-scaled for a single store** |
| **Bluink** | Canadian digital ID | — | **Not a fit — no US government data sources** |
| IDology / ExpectID Age | Historically a core PACT vendor | — | ⚠️ Product page 404s; may be renamed or discontinued. Verify it still exists |

**Recommended stack — roughly $150–$300/month plus ~$0.50 per delivered order:**

| Channel | Vendor | Cost |
|---|---|---|
| Site front gate | Yoti Shopify app or a simple DOB gate | $0 |
| Online → in-store pickup | DOB gate; verification at counter | $0 |
| Online → local delivery | **AgeChecker.net** database check | $25/mo + $0.50/order |
| Step-up on no-match | AgeChecker.net ID upload, or Veriff Essential | included / $0.80 |
| **Nevada counter (NRS 370.521(3))** | **IDScan.net VeriScan** | $65–$155/mo per device |
| Driver at the door | **IDScan.net VeriScan** mobile | $35–$65/mo per device |

---

## 5. PAYMENTS

### 5.1 The card-present / card-not-present line is the whole game

| Processor | Policy | Verified |
|---|---|---|
| **Square** | Payment Terms prohibited activity **(24): "internet/mail order/telephone order of age restricted products (e.g., tobacco)."** Support: *"Certain age-restricted products, like cigarettes, require that a card be present … Selling certain age-restricted products over telephone, mail-order or the internet is a direct violation of Square's Terms."* **In-store swipe/dip/tap = fine. Square Online, phone orders, and Square Invoices = violation.** | ✅ Primary, verbatim |
| **Stripe** | Restricted Businesses: *"Tobacco products, including e-cigarettes, cigars, and e-liquid sold in accordance with applicable law."* Restricted ≠ prohibited — there is a due-diligence path, but *"Stripe might not be able to grant approval."* No card-present carve-out stated. | ✅ Primary, verbatim |
| **PayPal / Venmo** | AUP **Prohibited Activities** bar transactions involving *"(b) drug paraphernalia, (c) cigarettes."* **Cigars, non-cigarette tobacco and e-cigarettes are in the *pre-approval* table (row 15)** — and using them without written pre-approval is itself a prohibited activity. ⚠️ Venmo unverified. | ✅ Primary, verbatim |
| **Apple Pay (web)** | *"You may not incorporate Apple Pay into a website that: Offers transactions involving: **Tobacco, marijuana, or vaping products**"* — and separately bars sites that *"primarily offer or sell drug paraphernalia."* | ✅ Primary, verbatim |
| **Google Pay APIs** | *"We do not allow the APIs to be used for the transaction or sale of cigars, cigarettes, e-cigarettes, and other tobacco products. Vaping or e-liquid products for use in smoking devices are also prohibited, **regardless of whether they contain nicotine or not**."* Applies *"regardless of whether the restricted products … form your entire inventory or only a part of it."* | ✅ Primary, verbatim |

**Important scoping point on the wallets:** Apple's rule is written against *incorporating Apple Pay into a website*; Google's against *use of the APIs*. **A customer tapping Apple Pay or Google Pay on a Square terminal in-store or at the door is an ordinary card-present contactless transaction** — not the Apple Pay JS or Google Pay API. In-store and doorstep wallet taps should be fine; **web and in-app wallet buttons must be disabled.** ⚠️ This is a reasoned reading, not an explicit statement by either company.

### 5.2 High-risk processors — and a counterintuitive split

- **Soar Payments** accepts **vape/e-cig e-commerce** but **not tobacco/cigar e-commerce**: *"we do not have any processing or sponsor bank relationships that can accept this type of business model… current bank and processor rules prohibit tobacco sales online due to age restrictions."* Vape conditions: FDA compliance, **tobacco and menthol flavors only**, no dry-herb devices, no cannabis imagery.
- **eMerchantBroker** advertises the opposite: *"the #1 provider of merchant accounts for the tobacco industry, getting **online cigar and pipe merchants** approved in as little as 24 hours."* ⚠️ Treat "99% approval" as marketing.
- **Durango Merchant Services** publishes reserve mechanics: rolling reserve *"typically 5-10 percent"*; capped reserve 5–15% up to half-to-a-full month of volume; *"Durango can successfully setup processing without reserves if your business is doing less than $10-15K in volume per month."* Also offers ACH/e-check and crypto rails.
- **Corepay, PaymentCloud, Easy Pay Direct, Instabill** — reported to support vape; pricing undisclosed.
- **Gateways (Authorize.net, NMI, USAePay)** appear category-agnostic; the restriction lives with the **acquirer/sponsor bank**. ⚠️ Strong inference from Soar's integration list, not verified against the gateways' own policies.
- **MCC 5993 — Cigar Stores and Stands** is the retail tobacco code. ⚠️ **MCC 5122 is *not* tobacco** — it is drugs and druggist sundries. MCC data from secondary aggregators only.
- **Visa/Mastercard** do not appear to categorically ban online tobacco; the obligation is compliance-based plus high-risk registration. ⚠️ Card-brand rulebooks could not be retrieved. Visa VAMP dispute thresholds reportedly tighten to **below 0.9% from Jan 1, 2026** — secondary sources.

**Directional expectation for a high-risk tobacco/vape MID:** discount rates materially above Square's ~2.6% flat rate, 5–10% rolling reserve held ~6 months, monthly + gateway fees, per-chargeback fees, and volume caps enforced through the reserve.

### 5.3 The architecture that avoids the problem entirely

**A catalog with no online checkout implicates no acceptable-use policy, because no payment service is being used.** Combine with:

- **In-store pickup, pay at the counter** — card-present, fully within Square's terms.
- **Pay-at-the-door via Square Reader / Terminal / Tap to Pay on iPhone** — a card-present tap, which is exactly what Square's rule requires, *and* it puts the driver face-to-face with the customer to scan ID, which is the regulatory concern the rule exists to address.

🚩 **One trap:** "call to order, give us your card over the phone" is **MOTO / card-not-present** and is squarely inside Square's item (24). The compliant version is *browse or call to reserve, pay in person.*

🔴 **One ambiguity to close in writing with Square:** if the order originates on the website and only the payment is card-present at the door, does Square treat that as "selling over the internet"? The literal text keys on the payment method, which the door tap satisfies — but this is exactly the seam where account terminations and funds holds happen. **Get a written answer from Square before launching, and keep the site strictly catalog/reservation with no checkout in the meantime.**

---

## 6. PLATFORM & MARKETING RESTRICTIONS

### 6.1 E-commerce platforms — the platform and its payments product are separate questions

| Platform | Allows a tobacco/vape store? | Its own payments product? |
|---|---|---|
| **Shopify** | **Yes** — the AUP contains no tobacco/vape/nicotine prohibition | Shopify Payments' US terms now **defer to the processor list** (Stripe + PayPal), so cigarettes are out via PayPal and everything else routes through Stripe's due-diligence path |
| **WooCommerce** | **Yes** — *"WooCommerce is open-source software, and we do not limit how it is used."* But you lose WooPayments, WooCommerce Shipping, WooCommerce Tax, WordPress.com hosting, and active .com extension subscriptions | **No** — WooPayments prohibits *"Tobacco products, including e-cigarettes and vapes"* |
| **Wix** | **Yes** — actively offers a "connect another provider" flow | **No** |
| **BigCommerce** | **Yes** ⚠️ secondary sources | Payment-agnostic, 65+ gateways |
| **Squarespace** | ⚠️ Unverified | ⚠️ Unverified (Stripe-backed) |
| **Square Online** | **No** — see § 5.1 | — |

⚠️ No verifiable purpose-built "vape e-commerce platform" exists. The real pattern is a mainstream platform plus a high-risk gateway.

### 6.2 Paid advertising — there is no path, anywhere

**Google Ads** ([Dangerous products or services](https://support.google.com/adspolicy/answer/6014299) + [Tobacco policy](https://support.google.com/adspolicy/answer/16489929)):
> *"Ads for tobacco or any products containing tobacco are not allowed."*
> *"Ads for products that form a component part of a tobacco product, as well as products and services that directly facilitate or promote tobacco consumption are not allowed."*
> *"Ads for products designed to simulate tobacco smoking are not allowed."*

Enumerated accessories include **"rolling papers, pipes, tobacco filters, hookah lounges, cigar bars."** **Google names physical venues by category — the "I'm advertising the store, not the product" argument is closed by name.** Merchant Center repeats the same three-part structure and adds "e-juice," which blocks **Shopping ads, free listings, Local Inventory Ads, and Performance Max**. Local Services Ads don't cover retail at all. Maps ads run through Google Ads and are equally blocked.

**Meta (Facebook/Instagram)** ([Tobacco and Related Products](https://transparency.meta.com/policies/ad-standards/restricted-goods-services/tobacco-related-products/)): *"Ads must not promote the sale or use of tobacco or nicotine products and related paraphernalia."* Prohibited list expressly includes **"tobacco pipes, rolling papers, hookahs and filters"**, **nicotine-free simulants**, tobacco **brand** promotion, and **"establishments or events in which tobacco products are offered or encouraged."** ⚠️ **I found no evidence Meta relaxed its accessory rules** — the current text is squarely restrictive. Instagram/Facebook Commerce Policy: *"Commerce content may not promote the buying, or selling, or trading of tobacco products or tobacco paraphernalia"* — **no Instagram Shop, no product tagging.**

| Platform | Status |
|---|---|
| TikTok Ads / TikTok Shop | Prohibited — including paraphernalia and "cigar bars, hookah lounges" |
| Snapchat | Prohibited |
| Pinterest | Prohibited — including "hookahs, hookah bars, cigars, or cigar bars" ⚠️ secondary |
| Reddit | Prohibited ⚠️ secondary |
| Microsoft/Bing | Prohibited ⚠️ page exists but unparseable |
| LinkedIn, Amazon Ads | Prohibited ⚠️ secondary |
| **X / Twitter** | **Possibly the only opening.** X reportedly allows "smoking alternative" ads (vapes, oral nicotine) targeting the US for approved advertisers holding *"valid licenses from relevant regulatory authorities,"* no under-21 targeting. ⚠️ **UNVERIFIED — the policy page returned HTTP 402 on every attempt.** Would cover vapes and oral nicotine only, not cigars, cigarettes, or accessories. Confirm with an X Ads rep before budgeting. |

### 6.3 Google Business Profile, organic, email, SMS, apps

**GBP: the listing is allowed and is the single most important owned channel.** Categories "Tobacco Shop," "Vape Shop," and "Cigar Shop" exist. But:
- The **Products tab is unusable**: *"We do not allow content related to regulated products and services, including alcohol, tobacco products…"*
- Restricted-content rules bar **"links to a landing page where it is possible to purchase restricted goods,"** purchase contact info, and **"promotional offers … deals, coupons, pricing information or other promotions."**
- **Safe Posts:** hours, location, events, staff, community. **Not** deals, prices, or shop-now links to product pages.
- Incidental depiction of product in ambiance photos is fine; product hero shots are risk.

**Organic SEO: no category restriction.** Google's spam policies target techniques, not legal product categories. Given Merchant Center free listings are blocked and all paid channels are closed, **local SEO + GBP + Maps is effectively the entire acquisition strategy — and a physical Strip storefront is a real moat against pure-play online vape sellers.** ⚠️ Avoid all health/cessation claims ("safer than smoking," "helps you quit"): that is YMYL for E-E-A-T purposes *and* an unauthorized modified-risk-tobacco-product claim under the FD&C Act.

**Email — viable:**
- **Twilio SendGrid** explicitly permits it with age gating: *"If you are sending emails related to alcohol, firearms, gambling, tobacco, or cannabis… you must verify that a recipient is at least of legal age."* **Clearest written "yes."**
- **Brevo** has a documented vetting pathway naming *"Promotional vaping"* by name. **Apply here first.**
- **Mailchimp's current AUP (updated Sept 26, 2025) contains zero mentions of tobacco, vape, nicotine, or SHAFT** — contradicting years of secondary reporting. A discretionary catch-all remains. ⚠️ **Get written confirmation before migrating.**
- **Klaviyo:** I verified directly that Klaviyo's tobacco/vape prohibition sits in the **SMS/short-code section**, not the email prohibited-content list. **Email-only Klaviyo may be workable** — confirm with their compliance team.

**SMS — largely dead for vape.** Carriers enforce **SHAFT** (Sex, Hate, Alcohol, Firearms, Tobacco). The operative split, per [10dlc.org](https://www.10dlc.org/en/shaft): *"While Tobacco traffic is prohibited on Toll Free, it is allowed on Short Code, or Long Code, as long as proper age gating procedures are in place"* — but *"**Vaping-related traffic is prohibited.**"* T-Mobile's Code of Conduct treats tobacco as **age-gated, not banned**, and requires real **date-of-birth capture at opt-in** — *"Non-acceptable age gating function includes but is not limited to Yes or No responses"* — with **$10,000 pass-through fees** for SHAFT violations. Platform-level: **Postscript** rejects tobacco merchants outright; **Attentive** bans tobacco "including vaping products" with an age-gate carve-out for alcohol only; **Klaviyo SMS**, **Omnisend SMS**, **Constant Contact SMS** all prohibit. **Recommendation: transactional SMS only** (order confirmation, pickup-ready, delivery ETA), or a dedicated campaign registered as **Tobacco** — never "Vape" — with genuine DOB capture. Budget for rejection.

**App stores — both closed.** Apple Guideline 1.4.3: *"**Facilitating the sale of controlled substances (except for licensed pharmacies and licensed or otherwise legal cannabis dispensaries), or tobacco is not allowed.**"* Note Apple carves out cannabis dispensaries and pointedly does not carve out tobacco. Google Play: *"We don't allow apps that facilitate the sale of tobacco or products containing nicotine (such as e-cigarettes, vape pens and nicotine pouches)."* **Build a PWA, not a native app.**

**Affiliate networks:** mainstream networks (ShareASale/Awin, Impact, CJ, Rakuten) decline vape merchants in practice ⚠️ unverified. The real pattern is an in-house program (Refersion, Post Affiliate Pro).

### 6.4 The glass / paraphernalia problem

Glass, pipes, and bongs are outside the PACT Act and outside FDA tobacco jurisdiction — but they carry their own exposure:

**21 U.S.C. § 863(a)** makes it unlawful *"to sell or offer for sale drug paraphernalia"* or *"to use the mails or any other facility of interstate commerce to transport drug paraphernalia"* — 3 years imprisonment, plus seizure and forfeiture. The definition at § 863(d) expressly lists **water pipes, bongs, chillums, ice pipes, glass pipes, and carburetion devices.**

**§ 863(e)** lists what a court may consider — including **"national and local advertising concerning its use," "descriptive materials accompanying the item which explain or depict its use,"** and **"the manner in which the item is displayed for sale."** **Website copy and imagery are literally enumerated evidence.**

**§ 863(f)(2) is the safe harbor:** the section does not apply to *"any item that, in the normal lawful course of business, is imported, exported, transported, or sold through the mail or by any other means, and **traditionally intended for use with tobacco products**, including any pipe, paper, or accessory."*

**Practical rule for the site:** describe glass strictly as tobacco accessories. **No cannabis imagery, no leaf iconography, no slang, no "710"/"420" references, no dab or concentrate terminology, no strain names.** This also happens to be Soar Payments' explicit underwriting condition. Separately, **PayPal flatly prohibits drug paraphernalia**, and Apple Pay bars sites that "primarily offer or sell" it.

---

## 7. THE WEBSITE ITSELF

### 7.1 FDA nicotine warning — exact text and formatting

**21 CFR 1143.3(a)(1)** — exact required text, capitalized and punctuated exactly as written:

> **WARNING: This product contains nicotine. Nicotine is an addictive chemical.**

**21 CFR 1143.3(b)(1)** makes it *"unlawful for any such tobacco product manufacturer, packager, importer, distributor, **or retailer** … to advertise or cause to be advertised within the United States any tobacco product unless each advertisement bears the required warning statement."*

**21 CFR 1143.3(b)(2)** — applies to *"print advertisements and other advertisements with a visual component (**including, for example, advertisements on signs, shelf-talkers, Internet Web pages, and electronic mail correspondence**)."* The warning must appear **in the upper portion of the advertisement within the trim area** and:

| (i) | Occupy **at least 20 percent of the area of the advertisement** |
|---|---|
| (ii) | At least **12-point** font, occupying the greatest possible proportion of the warning area |
| (iii) | **Helvetica bold or Arial bold** (or similar sans serif), **black on white or white on black**, contrasting with all other material |
| (iv) | Capitalized and punctuated exactly as in (a)(1) |
| (v) | Centered in the warning area, same orientation as other text |
| (vi) | Surrounded by a rectangular border, same color as the text, **not less than 3 mm nor more than 4 mm** |

**Retailer scope — 1143.3(b)(3):** *"This paragraph (b) applies to a retailer only if that retailer is responsible for or directs the health warning required under the paragraph. However, this does not relieve a retailer of liability if the retailer displays, in a location open to the public, an advertisement that does not contain a health warning."* **The client's own website is retailer-created advertising displayed in a location open to the public. The warning obligation attaches.** FDA has issued warning letters on exactly this basis.

**Which products need it:**
- **ENDS/vape, e-liquid, cigarette tobacco, RYO — YES.**
- **Hookah/shisha — YES.** FDA's [retailer chart](https://www.fda.gov/tobacco-products/retail-sales-tobacco-products/retailers-chart-required-warning-statements-tobacco-product-packaging-and-advertising) footnote 2: the cigar injunction *"does not enjoin FDA from enforcing the health warning requirements of 21 C.F.R. § 1143.3 for other product categories, **including Electronic Nicotine Delivery Systems (ENDS) products, hookah tobacco**, and cigarette tobacco and roll-your-own tobacco products."*
- **Cigars and pipe tobacco — VACATED.** Same chart: *"The United States District Court for the District of Columbia recently issued an order **vacating the health warning requirements for cigars and pipe tobacco** set forth in 21 CFR §§ 1143.3 and 1143.5 and remanding … See Order, Cigar Ass'n of Am. v. U.S. Food & Drug Admin., No. 1:16-cv-01460 (D.D.C. September 11, 2020)."* Firms *"may choose to voluntarily comply."* Separately, the D.C. Circuit in January 2025 upheld vacatur of the Deeming Rule as applied to **premium cigars**, and the district court reaffirmed. Machine-made and flavored cigars remain deemed.
- **Cigarettes:** FCLAA Surgeon General's warnings, enforced by the FTC, not FDA.

**Design implication:** a 20%-of-area bordered warning block in the upper portion of every vape/e-liquid/hookah product page and every marketing email is a **major layout constraint**, not a footer line. Design for it from the start.

### 7.2 California Prop 65

- Nicotine is listed for **reproductive toxicity**.
- **Rule changes took effect January 1, 2025**; products manufactured and labeled before **January 1, 2028** may use the old format. New short-form warnings must **name the chemical** — e.g. *"Risk of reproductive harm from exposure to nicotine. See www.P65Warnings.ca.gov"* or *"Can expose you to nicotine, a reproductive toxicant. See www.P65Warnings.ca.gov"* — with the yellow-triangle Prop 65 symbol. "CA WARNING:" and "CALIFORNIA WARNING:" are permitted openers.
- **Internet sellers must display the warning on the product display page**, either directly visible, via a clearly marked "WARNING" hyperlink, or otherwise prominently before purchase is completed.
- ⚠️ **Preemption nuance:** *In re Fontem US, Inc.* (C.D. Cal. Nov. 1, 2016) held Prop 65 **labeling** requirements preempted by the FD&C Act, but non-labeling methods such as point-of-sale signage were not. This does not obviously immunize website warnings. 🔴 **NEEDS COUNSEL.**
- **Practical:** if the site never ships to California — which, for vape, it cannot anyway — exposure is limited. If cigars ever ship to CA, implement the warning. Prop 65 is enforced largely by private bounty-hunter plaintiffs, so the cost of omission is real.

### 7.3 Privacy

- **Nevada — NRS 603A.300–603A.360 (SB 220, 2019, eff. Oct 1, 2019).** No revenue or consumer-count threshold: an "operator" is any commercial website operator collecting covered information from Nevada residents. The privacy policy must state the categories of covered information collected, categories of third parties it is shared with, the review/update process, the change-notification process, the effective date, whether information is sold, and — if so — **the designated address for Nevada opt-out-of-sale requests.** Nevada **did not** pass a comprehensive privacy act in 2023 or 2025; it also has a separate **consumer health data law (SB 370)**.
- **CCPA/CPRA:** thresholds for 2026 are **$26,625,000 annual gross revenue**, 100,000 California consumers/households, or 50% of revenue from selling/sharing personal information. **A single Las Vegas shop almost certainly does not meet any of them** — but note the revenue test is *global*, not California-only. Third-party ad/analytics pixels can implicate "sharing," which matters if the business scales.
- **Practical:** publish a privacy policy meeting the Nevada checklist, honor Global Privacy Control, and keep a Nevada opt-out email address live. Cheap insurance.

### 7.4 ADA / accessibility — an underrated, quantifiable risk

- **2025: 3,117 federal website accessibility lawsuits, up 27% over 2024** (Seyfarth Shaw). **E-commerce was roughly 70% of them.** Mid-2026 filings are tracking ~20% higher year over year.
- Multiple federal courts hold that websites of businesses open to the public fall under ADA Title III. **A physical Strip retail store gives a plaintiff a clean "nexus" theory.**
- **Shopify stores were 32.4% of lawsuits by platform in early 2025**, second only to custom-coded sites.
- Six issues account for ~96% of WCAG failures: low-contrast text (79.1%), missing alt text (55.5%), missing form labels (48.2%), empty links (45.4%), empty buttons (29.6%), missing document language (15.8%).
- **Recommendation: build to WCAG 2.1 AA from day one and run an audit before launch.** These defects are cheap to prevent and expensive to litigate. Note that overlay widgets are themselves a frequent litigation trigger — remediate the code, don't bolt on a widget.

### 7.5 Other required site elements

- Terms of sale with governing law, no-resale, age-restriction, and refusal-of-service clauses.
- **Returns policy restricted to in-store only for all tobacco/nicotine SKUs** — no mailed returns (see § 1.5).
- If any remote cigar sales occur: **the Nevada Remote Retail Seller license information must be posted on the website** (NRS 370.50332(1)).
- Nevada in-store notice that cigarette tax is included in the selling price (NRS 370.165); unopened-package-only and no-self-service-display rules (NRS 202.2493).

---

## 8. BOTTOM LINE — decision table

| Capability | Verdict | Reason |
|---|---|---|
| **Browse catalog (non-nicotine: glass, accessories, lighters, apparel)** | ✅ **ALLOWED** | No FDA advertising warning required; no PACT exposure. Condition: describe glass strictly as tobacco accessories — no cannabis imagery or slang (21 U.S.C. § 863(e), (f)(2)) |
| **Browse catalog (cigars, pipe tobacco)** | ✅ **ALLOWED** | Cigars excluded from PACT (15 U.S.C. § 375(2)(B)); FDA cigar warnings vacated (*Cigar Ass'n v. FDA*); premium cigars outside the Deeming Rule |
| **Browse catalog (hookah/shisha)** | ⚠️ **ALLOWED WITH CONDITIONS** | Outside PACT, **but** the 21 CFR 1143.3 nicotine warning **does** apply to hookah tobacco advertising — 20% of area, upper portion, bordered |
| **Browse catalog (vape / e-liquid / disposables)** | 🔴 **NEEDS COUNSEL — highest-risk item on this list** | Only 45 ENDS products are lawfully sellable in the US. Listing unauthorized SKUs publicly is how FDA finds retailers; two Oct–Nov 2025 letters were issued purely on website review and cc'd to the domain registrar and platform. **Recommendation: list only FDA-authorized ENDS online; keep everything else in-store only.** Plus 1143.3 warning compliance on every listed SKU |
| **Show prices** | ✅ **ALLOWED** on-site | ⚠️ But **not** on Google Business Profile — GBP restricted-content rules bar pricing, deals, coupons, and purchase links for regulated goods |
| **Online ordering for in-store pickup, pay at counter** | ⚠️ **ALLOWED WITH CONDITIONS** — *this is the recommended core model* | Card-present at the counter satisfies Square item (24). Binding age check is the counter scan (NRS 370.521(3), under 40) plus 21 CFR 1140.14 (under 30). 🔴 Confirm with counsel whether NRS 202.24935 attaches when payment is captured online |
| **Online ordering + own-driver local delivery in Clark County** | ⚠️ **ALLOWED WITH CONDITIONS** | Requires: third-party database AV at order (NRS 202.24935(2)(b)); **annual certification to the Nevada AG** (202.24935(3)); package marking; ID **scan** at the door for under-40 (NRS 370.521(3)); no unattended drops; no right-of-way handoffs (CCC 6.04.130); W-2 drivers; card-present payment at the door. 🔴 **Cigarettes may need to be excluded** — NRS 370.585(4)(b) "from the premises" |
| **Out-of-state shipping — cigars / pipe tobacco** | 🔴 **NEEDS COUNSEL** | Outside PACT and outside the USPS ban — but **FedEx prohibits cigars and hookah outright** (Service Guide 2026), Nevada now licenses remote cigar sellers ($650/yr, bond, monthly reports), and destination states increasingly do too. Requires a 50-state survey and a high-risk merchant account. Not a launch-week capability |
| **Out-of-state shipping — vape / ENDS / e-liquid / components** | ⛔ **PROHIBITED** | USPS ban (18 U.S.C. § 1716E); FedEx and UPS both refuse; PACT registration with ATF and every destination state, monthly reports, database AV, adult signature, destination excise prepaid, 4-year records; 3 years imprisonment and up to 2% of gross sales in civil penalty. **Even advertising the offer triggers § 376(a) registration** |
| **Out-of-state shipping — cigarettes** | ⛔ **PROHIBITED in practice** | USPS ban, carrier refusal, PACT plus state stamping and directory compliance in every destination |
| **Email marketing** | ⚠️ **ALLOWED WITH CONDITIONS** | Twilio SendGrid explicitly permits with age gating; Brevo has a vetting path naming vaping; Klaviyo's ban is SMS-side only; Mailchimp's AUP no longer mentions tobacco. **21 CFR 1143.3(b)(2) expressly covers "electronic mail correspondence"** — the 20% bordered warning applies to promotional emails featuring nicotine products. Get any ESP's acceptance in writing |
| **SMS marketing** | ⛔ **PROHIBITED for vape** / ⚠️ conditional for tobacco | 10DLC/carrier SHAFT rules: *"Vaping-related traffic is prohibited."* Tobacco is age-gate-able on short/long code with real DOB capture at opt-in, but Postscript, Attentive, Klaviyo, Omnisend and Constant Contact all refuse. **Transactional SMS only** |
| **Paid ads (Google, Meta, TikTok, Snap, Pinterest, Reddit, Microsoft, LinkedIn)** | ⛔ **PROHIBITED** | Every platform bans tobacco, vape, **and accessories**; Google and TikTok name "hookah lounges" and "cigar bars" explicitly. No brick-and-mortar carve-out exists |
| **Paid ads (X / Twitter)** | ❓ **UNVERIFIED — possible narrow opening** | Reported US allowance for "smoking alternative" ads by licensed, pre-approved advertisers. Policy page inaccessible. Confirm with an X rep before budgeting |
| **Google Business Profile listing** | ✅ **ALLOWED** — and it is the single most valuable channel | Listing permitted; **Products tab unusable**; no deals/prices/purchase links in Posts |
| **Organic SEO / local SEO** | ✅ **ALLOWED** — build the whole acquisition strategy here | No category restriction in Google's spam policies. ⚠️ No health or cessation claims — that is both YMYL and an unauthorized MRTP claim |
| **Native mobile app** | ⛔ **PROHIBITED** | Apple Guideline 1.4.3 and Google Play both bar tobacco-sale apps. Build a PWA |
| **Apple Pay / Google Pay buttons on the website** | ⛔ **PROHIBITED** | Both wallets ban tobacco/vaping in their web/API terms independently of the processor. In-store and doorstep taps on Square hardware are fine |
| **Keeping Square as the processor** | ⚠️ **ALLOWED for card-present only** | In-store and at-the-door taps comply. **Square Online checkout, phone orders, and invoices violate item (24).** 🔴 Get Square's written position on web-originated / door-paid orders before launch |

---

## 9. RECOMMENDED BUILD — in priority order

**Phase 1 (launch-safe, ~no legal risk):**
1. Marketing site + **browse-only catalog** with **reservation / "hold for pickup"** — no checkout, no price capture, no card entry.
2. Payment card-present at the counter or at the door via Square hardware.
3. FDA 1143.3 warning blocks on all vape, e-liquid and hookah listings (20% of area, upper portion, 12pt Helvetica/Arial bold, 3–4mm border).
4. **List only the 45 FDA-authorized ENDS online.** Everything else stays in-store.
5. Remove all shipping and "returns within the United States" language for tobacco/nicotine.
6. Nevada-compliant privacy policy with an opt-out address; WCAG 2.1 AA build.
7. IDScan.net VeriScan at the counter (NRS 370.521(3) is already being violated today if there is no scanner).

**Phase 2 (local delivery — after counsel sign-off):**
8. AgeChecker.net database verification at order; annual Nevada AG certification.
9. Driver ID-scan app, signature capture, refusal logging, written training program.
10. Package marking; destination-based sales tax.
11. Clark County delivery-license question resolved in writing.

**Phase 3 (out-of-state cigars only — not before a 50-state survey):**
12. Nevada Remote Retail Seller license, bond, monthly reports.
13. High-risk merchant account (EMB or comparable tobacco-specialist acquirer); Apple Pay / Google Pay web buttons disabled.
14. Carrier that will actually take cigars — **not FedEx**.

---

## 10. 🔴 MUST GO TO COUNSEL

1. **Whether an in-state brick-and-mortar taking online cigar orders needs the Nevada Remote Retail Seller license** (NRS 370.5033 vs. NRS 370.440(9)). Highest-priority; a written Department of Taxation determination may suffice. **(866) 962-3707.**
2. **Whether cigarettes may be delivered off-premises at all** given NRS 370.585(4)(b), NRS 370.581, and CCC 6.04.120.
3. **Whether NRS 202.24935 attaches to an online order paid in-store at pickup.**
4. **Whether own-employee local delivery is a PACT Act "delivery sale"** subject to 15 U.S.C. § 376a(b)(4).
5. **Whether listing unauthorized ENDS SKUs online is an acceptable risk** in light of the May 2026 enforcement-priorities guidance, given that FDA's promised lower-priority product list **still does not exist** as of today.
6. **Prop 65 preemption** for website warnings after *In re Fontem*.
7. **Clark County Title 30 zoning** treatment of the parcel — use classification, special use permit, separation standards, hours conditions, Strip overlay.
8. **Whether the shop mixes or rebottles e-liquid** — that makes it an FDA-regulated *manufacturer*, and four Nevada shops are already on FDA's manufacturer-CMP list.
9. **21 CFR 1140.14(a)(3) mail-order exceptions**, verbatim — eCFR blocked automated retrieval.

---

## 11. WHAT I COULD NOT VERIFY

| Item | Status |
|---|---|
| **The live puffvegas.us and puffvegas.square.site sites** | Unreachable from this environment (connection reset / JS-rendered). **A manual audit is required before acting on Sections 5 and 7.** |
| **UPS and DHL tobacco/vape policies** | Both block automated retrieval. UPS's April 5, 2021 vape ban is well-attested in secondary sources; I could not quote the primary tariff |
| **Clark County Code Title 30 (zoning)** and **CCC 6.12.969 full text** | Municode and American Legal both block automated access |
| **X/Twitter tobacco ad policy** | HTTP 402 on every attempt |
| **Shopify Payments prohibited-business list** | help.shopify.com returned 403 |
| **State vape-directory count and membership** | Trade sources conflict; verify each state's own directory |
| **Visa/Mastercard rulebooks, MCC data, VAMP thresholds** | Secondary aggregators only |
| **Persona, Veratad, Intellicheck, LexisNexis, Jumio pricing** | Not published |
| **Venmo, Squarespace, BigCommerce, Authorize.net, NMI policy text** | Not retrieved |
| **Mailchimp's actual current position on tobacco** | Their AUP no longer mentions it — get it in writing |
| **DoorDash tobacco-agreement availability in Nevada** | Mechanism confirmed; availability unverified |
| **Whether DPBH retailer training is mandatory** | Appears voluntary; no statute found |
| **Nevada Clean Indoor Air Act** treatment of in-store vaping/sampling (NRS 202.2483 as amended by SB 263) | Out of scope, not researched |

**Note on method:** the bulk of the federal analysis above is quoted verbatim from primary sources I retrieved directly — `uscode.house.gov`, `govinfo.gov`, `pe.usps.com`, `fda.gov`, `leg.state.nv.us`, `clarkcountynv.gov`, and the vendors' own policy pages and the FedEx Service Guide PDF — rather than from secondary summaries. Where a claim rests on secondary reporting, I have said so.agentId: ac5366673106ea77e (use SendMessage with to: 'ac5366673106ea77e', summary: '<5-10 word recap>' to continue this agent)
<usage>subagent_tokens: 348274
tool_uses: 131
duration_ms: 1945241</usage>