# Compliance — what is implemented

Deep research lives in [`research/04-compliance-risk.md`](../research/04-compliance-risk.md).
This file records what the **code** actually does, so a change doesn't quietly
remove a legal requirement.

> Nothing here is legal advice. Items marked 🔴 need counsel.

---

## Nicotine warning — 21 CFR 1143.3

`src/components/NicotineWarning.tsx` carries the exact statutory text, which the
rule requires "capitalized and punctuated" as written:

> WARNING: This product contains nicotine. Nicotine is an addictive chemical.

`PageNicotineWarning.tsx` exists because **1143.3(a) attaches to the
*advertisement***, and a category grid showing priced ENDS listings is one. That
gap was live: category pages advertised priced ENDS with no warning at all.

🔴 **Unsettled: the 20 %-of-advertisement area test in 1143.3(b)(2).** It is
well-defined for a single ad unit and not obviously well-defined for a scrolling
browse grid. The current component is a good-faith reading; it needs counsel.

## Cigarettes — FCLAA / FTC

The Surgeon General's warning is required, and one of the four rotating warnings
is used:

> SURGEON GENERAL'S WARNING: Smoking Causes Lung Cancer, Heart Disease, Emphysema, And May Complicate Pregnancy.

**The cigar warning is not used** — it was vacated in *Cigar Ass'n of Am. v. FDA*.

## Cigarettes are pickup-only

`catalog.ts` sets `inStoreOnly: m.regulatoryClass === "cigarette"`.

NRS 370.585(4)(b) licenses a dealer to sell cigarettes "from the premises for
which the license was issued." Whether that covers delivery is unsettled, so the
site holds them for pickup and says so on `/delivery` **before** an order is
built — finding out at the door is the failure that page exists to prevent.

## No shipping, and no cart

Under the PACT Act, USPS will not carry ENDS at all, and UPS, FedEx and DHL have
each stopped accepting them. Shipping this catalogue is closed off to a small
retailer.

So the model is local delivery, paid at the door — cash or card on the driver's
reader. That needs no checkout and works today. Orders are placed by SMS with the
message pre-filled from the hotel picker (`sms:+17026137799?&body=…`; the `?&`
form is the one both iOS and Android accept).

🔴 **Open:** Square's written position on web-originated, door-paid orders. A web
checkout waits on that.

## Age gate

Cookie `pv_age`, 365 days, surfaced to pages as the `x-pv-age` header by
`src/middleware.ts`. It is a **form POST**, not a JS modal — see the progressive
enhancement rule in [ARCHITECTURE.md](ARCHITECTURE.md).

21+ at the door, every order, no exceptions. Nevada requires a scan for anyone
who looks under 40, and `/delivery` says so up front rather than surprising
someone on a hotel landing at 2 a.m.

## Fail-closed classification

`RegulatoryClass` defaults to `unknown`, and `unknown` is not publishable. 459 of
1,415 models currently sit there. That is the system working: a product reaches
customers only once something has affirmatively classified it.
