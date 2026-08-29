import type { Metadata } from "next";
import { headers } from "next/headers";
import k from "./Legal.module.css";
import Bulbs from "@/components/Bulbs";
import NicotineWarning from "@/components/NicotineWarning";
import {
  AgeBanner,
  BottomNav,
  Footer,
  Header,
  UtilityBar,
  PHONE_DISPLAY,
  PHONE_HREF,
} from "@/components/Chrome";
import { AGE_HEADER } from "@/lib/age-shared";
import { LEGAL_AGE } from "@/lib/age";
import { SHOP_ADDRESS_FULL } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Legal & compliance | Puff Vegas",
  description:
    "Age policy, shipping policy, lab reports and Nevada compliance for Puff Vegas, 3649 S Las Vegas Blvd, Las Vegas.",
  alternates: { canonical: "/legal" },
};

/**
 * 4k — Legal & compliance. Protect the licence.
 *
 * One deviation from the handoff, and it is deliberate. The design draws the
 * warning box as a 2px white border in Bebas caps. 21 CFR 1143.3(b)(2) is
 * prescriptive about this element in a way almost nothing else in web design
 * is: Helvetica or Arial BOLD, black-on-white or white-on-black, a rectangular
 * border of 3–4 mm, capitalised and punctuated exactly as written. So the
 * real component is used here rather than a styled facsimile of it. It is a
 * regulatory object the brand has placed, like a shipping label on a crate —
 * and that is precisely why it reads as applied rather than broken.
 */
export default async function LegalPage() {
  const h = await headers();
  const affirmed = h.get(AGE_HEADER) === "1";

  return (
    <>
      <UtilityBar />
      <AgeBanner affirmed={affirmed} />
      <Header />
      <Bulbs />

      <main className={k.main}>
        <h1 className={k.title}>Legal &amp; compliance</h1>

        <div className={k.warningSlot}>
          {/* `ends` because this page is not about one product: the ENDS
              statement is the one 21 CFR 1143.3 requires here, and cigars are
              excluded from it anyway (vacated in Cigar Ass'n of Am. v. FDA). */}
          <NicotineWarning regulatoryClass="ends" />
        </div>

        <section className={k.section}>
          <h2 className={k.h2}>{LEGAL_AGE}+ only</h2>
          <p className={k.body}>
            Nothing we sell may be bought by anyone under {LEGAL_AGE}. We check
            photo ID at the counter, and the runner checks it again at your
            handoff — a delivery is refused and returned if the ID does not match
            the order or is not produced. The date of birth this site asks for
            is a first filter, not a substitute for either check.
          </p>
        </section>

        <section className={k.section}>
          <h2 className={k.h2}>We do not ship</h2>
          <p className={k.body}>
            No mail, no courier, no freight — not to any address, in Nevada or
            out of it. Delivery means one of our own runners bringing an order
            to a local address, inside Clark County, and taking payment at the
            handoff. The PACT Act makes remote sale and shipment of tobacco and
            vapor products a materially different business, and we are not in
            it.
          </p>
        </section>

        <section className={k.section}>
          <h2 className={k.h2}>Lab reports</h2>
          <p className={k.body}>
            Every hemp product we list carries a batch certificate of analysis
            showing delta-9 THC at or below 0.3% by dry weight. If a batch has
            no COA on file, it does not appear on this site — that is enforced
            in the catalogue itself, not by hand.
          </p>
          <p className={k.note}>
            COA lookup by batch is not published yet. Ask at the counter or call{" "}
            <a className={k.link} href={PHONE_HREF}>
              {PHONE_DISPLAY}
            </a>{" "}
            and we will send the report for the batch you are holding.
          </p>
        </section>

        <section className={k.section}>
          <h2 className={k.h2}>Nevada compliance</h2>
          <p className={k.body}>
            We are a licensed Clark County tobacco retailer and collect Nevada
            excise and sales tax on every transaction. Products restricted to
            CCB-licensed dispensaries under Nevada law are not sold here and do
            not appear in this catalogue.
          </p>
        </section>

        <section className={k.section}>
          <h2 className={k.h2}>Returns</h2>
          <p className={k.body}>
            Sealed, unopened and unused goods can come back within 14 days with
            the receipt. Opened nicotine, hemp and consumable products cannot —
            that is a health rule, not a preference. Hardware that fails inside
            the manufacturer&rsquo;s warranty is handled at the counter; bring
            the device and the box.
          </p>
        </section>

        <Bulbs />

        <p className={k.address}>{SHOP_ADDRESS_FULL}</p>
        <p className={k.keepOut}>
          Keep all nicotine and hemp products out of reach of children and pets.
        </p>
      </main>

      <Bulbs />
      <Footer />
      <BottomNav />
    </>
  );
}
