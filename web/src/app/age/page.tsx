import type { Metadata } from "next";
import a from "./Age.module.css";
import Bulbs from "@/components/Bulbs";
import { Wordmark } from "@/components/Chrome";
import { LEGAL_AGE } from "@/lib/age";
import { SHOP_STREET } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Verify your age | Puff Vegas",
  // The gate itself must never be indexed — it has no content and would
  // otherwise compete with the pages that do.
  robots: { index: false, follow: false },
};

type Search = { next?: string; error?: string; denied?: string };

/**
 * 4a — Age gate.
 *
 * Centred lockup, gold eyebrow, bulb strip, MM / DD / YYYY, magenta ENTER.
 *
 * The three numeric fields are `inputMode="numeric"` rather than
 * `type="number"`: a spinner on a birth year is nonsense, and number inputs
 * silently discard leading zeros, which is exactly what a two-digit month
 * field is made of.
 */
export default async function AgeGate({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const denied = sp.denied === "1";
  const invalid = sp.error === "invalid";
  const next = sp.next && sp.next.startsWith("/") ? sp.next : "/";

  return (
    <main className={a.wrap}>
      <div className={a.card}>
        <div className={a.lockup}>
          <Wordmark size="lg" />
        </div>
        <p className={a.eyebrow}>Open 24 hours · {SHOP_STREET}</p>

        {/* The shop's own bulb sign. Every marquee device on this site — the
            wordmark's VEGAS, the divider strips — is drawn from this object,
            so the gate is the right place to show the real one: it says a
            room exists behind the form.

            Cropped to the sign. The full frame is a counter wall of Marlboro,
            Camel and Newport packs, and this page is seen BEFORE anyone has
            affirmed they are 21. Framing on the subject is better composition
            anyway; keeping cigarette branding off the pre-verification page is
            the second reason. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={a.shot}
          src="/shop/neon-1152.webp"
          srcSet="/shop/neon-640.webp 640w, /shop/neon-1152.webp 1152w"
          sizes="(min-width: 720px) 560px, 100vw"
          width={1152}
          height={530}
          alt="The bulb-lit SMOKE SHOP sign hanging inside Puff Vegas, hookahs on the glass shelf beside it."
          /* Eager, not lazy: on this page the sign is above the fold in the
             initial viewport, so deferring it only delays the one image the
             gate has. */
          loading="eager"
          decoding="async"
        />

        <Bulbs />

        {denied ? (
          <>
            <h1 className={a.title}>Sorry — not yet</h1>
            <p className={a.body}>
              You have to be {LEGAL_AGE} to buy anything we sell, in the shop or
              on delivery. Come back when you are.
            </p>
          </>
        ) : (
          <>
            <h1 className={a.title}>Must be {LEGAL_AGE} or older</h1>
            <p className={a.body}>
              Enter your date of birth. We check ID at the counter and again
              when a runner hands an order over — this is the first of two.
            </p>

            <form className={a.form} action="/api/age" method="POST">
              <input type="hidden" name="next" value={next} />
              <div className={a.fields}>
                <label className={a.field}>
                  <span className={a.fieldLabel}>MM</span>
                  <input
                    className={a.input}
                    name="month"
                    inputMode="numeric"
                    autoComplete="bday-month"
                    maxLength={2}
                    placeholder="04"
                    required
                    aria-invalid={invalid || undefined}
                  />
                </label>
                <span className={a.slash} aria-hidden="true">
                  /
                </span>
                <label className={a.field}>
                  <span className={a.fieldLabel}>DD</span>
                  <input
                    className={a.input}
                    name="day"
                    inputMode="numeric"
                    autoComplete="bday-day"
                    maxLength={2}
                    placeholder="18"
                    required
                    aria-invalid={invalid || undefined}
                  />
                </label>
                <span className={a.slash} aria-hidden="true">
                  /
                </span>
                <label className={`${a.field} ${a.fieldYear}`}>
                  <span className={a.fieldLabel}>YYYY</span>
                  <input
                    className={a.input}
                    name="year"
                    inputMode="numeric"
                    autoComplete="bday-year"
                    maxLength={4}
                    placeholder="1996"
                    required
                    aria-invalid={invalid || undefined}
                  />
                </label>
              </div>

              {invalid ? (
                <p className={a.error} role="alert">
                  That date doesn&rsquo;t exist. Check the day and month.
                </p>
              ) : null}

              <button className={a.enter} type="submit">
                Enter
              </button>
            </form>
          </>
        )}

        <Bulbs />

        <p className={a.legal}>
          {LEGAL_AGE}+ only. Nicotine is an addictive chemical. We do not ship —
          local delivery only, and ID is checked at handoff. Hemp products sold
          in compliance with Nevada law.
        </p>
      </div>
    </main>
  );
}
