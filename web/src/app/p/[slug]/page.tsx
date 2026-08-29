import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";
import s from "./Product.module.css";
import NicotineWarning from "@/components/NicotineWarning";
import { AgeBanner, Header, StatusModule, BottomNav, PHONE_DISPLAY, PHONE_HREF } from "@/components/Chrome";
import Marquee from "@/components/Marquee";
import { AGE_HEADER } from "@/lib/age-shared";
import { hourBand, pacificHour } from "@/lib/time";
import {
  commerce,
  formatMoney,
  pricePerThousandPuffs,
  puffsInHumanUnits,
  stockLabel,
  type Product,
} from "@/lib/commerce";
import {
  TAX_RATE,
  DELIVERY_FEE_CENTS,
  DELIVERY_STRIP_FEE_LABEL,
  DELIVERY_MINIMUM_LABEL,
} from "@/lib/hotels";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await commerce.getProduct(slug);
  if (!product) return { title: "Not found | Puff Vegas" };

  return {
    title: `${product.title} — ${formatMoney(product.price)} | Puff Vegas`,
    description: product.description?.slice(0, 155),
    alternates: { canonical: `/p/${product.slug}` },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await commerce.getProduct(slug);
  if (!product) notFound();

  const h = await headers();
  const affirmed = h.get(AGE_HEADER) === "1";

  const now = new Date();
  const band = hourBand(pacificHour(now));

  const perPuff = pricePerThousandPuffs(product);
  const human = puffsInHumanUnits(product);

  return (
    <div data-band={band === "late" ? "late" : undefined}>
      <AgeBanner affirmed={affirmed} />
      <Header />
      <StatusModule />
      <Marquee />

      <main className={s.wrap}>
        <nav className={s.crumbs} aria-label="Breadcrumb">
          <a href="/">Puff</a>
          <span>/</span>
          <a href={`/${product.department}`}>{product.department}</a>
          <span>/</span>
          <span>{product.title}</span>
        </nav>

        {/* Full-width, above the entire listing.

            It previously sat inside the buy column, where it measured 25% of
            that column but only 12% of the listing as a whole — which passes
            21 CFR 1143.3(b)(2)(i) only if "the advertisement" is read to
            exclude the product photograph. That is an optimistic reading of a
            rule worth being conservative about, so the plate now spans the
            listing and the 20% test is met against the larger denominator. */}
        <NicotineWarning regulatoryClass={product.regulatoryClass} />

        <div className={s.hero}>
          <div
            className={`${s.shot} ${
              !product.images[0] || product.images[0].cutout
                ? ""
                : product.images[0].plate === "dark"
                  ? s.shotPlateDark
                  : product.images[0].plate === "light"
                    ? s.shotPlateLight
                    : ""
            }`}
          >
            {product.images[0] ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                className={`${s.shotImg} ${product.images[0].cutout ? s.shotImgCutout : ""}`}
                src={product.images[0].src}
                alt={product.images[0].alt}
                /* The LCP element on this route — never lazy. */
                fetchPriority="high"
              />
            ) : (
              <span className={s.shotPlaceholder}>
                product
                <br />
                charcoal seamless
              </span>
            )}
          </div>

          <div className={s.buy}>
            {product.brand && <p className={s.brand}>{product.brand}</p>}
            <h1 className={s.title}>{product.title}</h1>

            <div>
              <div className={s.priceRow}>
                <span className={s.price}>{formatMoney(product.price)}</span>
                {product.compareAt && (
                  <span className={s.compareAt}>
                    MSRP {formatMoney(product.compareAt)}
                  </span>
                )}
              </div>
              {perPuff && <p className={s.perPuff}>{perPuff}</p>}
              {product.deliveryEligible && (
                <p className={s.allIn}>
                  about {allInEstimate(product)} delivered ·{" "}
                  {DELIVERY_STRIP_FEE_LABEL} · {DELIVERY_MINIMUM_LABEL}
                </p>
              )}
            </div>

            <StockBlock product={product} />

            <div className={s.actions}>
              {product.inStoreOnly ? (
                <>
                  <p className={s.constraint}>{product.inStoreReason}</p>
                  <a className={s.primary} href="/pickup">
                    Pick-Up
                  </a>
                </>
              ) : (
                <>
                  <a className={s.primary} href="/delivery">
                    Delivery
                  </a>
                  <a className={s.secondary} href="/pickup">
                    Pick-Up
                  </a>
                </>
              )}
              {/* Person-to-person SMS. Automated outbound is prohibited for
                  this category, but a customer texting our real phone is not
                  A2P and stays available. */}
              <a className={s.secondary} href={`sms:+17026137799`}>
                Text us about this
              </a>
            </div>

            {product.regulatoryClass === "cigar" && (
              <p className={s.specs}>
                {[
                  product.wrapper,
                  product.vitola,
                  product.ringGauge && product.lengthIn
                    ? `${product.lengthIn}×${product.ringGauge}`
                    : null,
                  "single",
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}

            {product.description && <p className={s.desc}>{product.description}</p>}
            {human && <p className={s.allIn}>{product.puffCount?.toLocaleString()} puffs — {human}</p>}
          </div>
        </div>

        <div className={s.trust}>
          {product.deliveryEligible ? (
            <>
              <article className={s.trustCard}>
                <span className={s.trustTitle}>Same price</span>
                <p className={s.trustBody}>{`In store and delivered. ${DELIVERY_STRIP_FEE_LABEL} · ${DELIVERY_MINIMUM_LABEL}.`}</p>
              </article>
              <article className={s.trustCard}>
                <span className={s.trustTitle}>21+</span>
                <p className={s.trustBody}>ID at the door. Have it out.</p>
              </article>
              <article className={s.trustCard}>
                <span className={s.trustTitle}>Pay at the door</span>
                <p className={s.trustBody}>Cash or card. Change to $100.</p>
              </article>
            </>
          ) : (
            <>
              <article className={s.trustCard}>
                <span className={s.trustTitle}>Pickup</span>
                <p className={s.trustBody}>Same shelf price. Hold at the counter.</p>
              </article>
              <article className={s.trustCard}>
                <span className={s.trustTitle}>21+</span>
                <p className={s.trustBody}>ID at the door. Have it out.</p>
              </article>
            </>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function StockBlock({ product }: { product: Product }) {
  const { stock } = product;
  const tone =
    stock.tier === "verified"
      ? s.stockVerified
      : stock.tier === "out"
        ? s.stockOut
        : "";

  return (
    <div className={s.stock}>
      <p className={`${s.stockLine} ${tone}`}>{stockLabel(stock)}</p>
      {(stock.tier === "expected" ||
        stock.tier === "low" ||
        stock.tier === "unknown") && (
        <p className={s.stockNote}>
          {stock.tier === "unknown"
            ? "Text us. We'll look."
            : "We'll check the shelf. Text you if it's gone."}
        </p>
      )}
    </div>
  );
}

/**
 * All-in price at the moment of interest rather than at the moment of
 * commitment. Costs a conversion point here, buys back three at checkout, and
 * buys the trust position outright — fee surprise is the single most
 * documented delivery failure in this market.
 *
 * 8.375% Clark County sales tax plus the flat $20 Strip delivery fee.
 *
 * There is no merchandise floor any more, so this figure is now the whole
 * truth for a single item rather than a number the customer still has to
 * clear a minimum to act on.
 */
function allInEstimate(product: Product): string {
  const withTax = Math.round(product.price.cents * (1 + TAX_RATE));
  const delivered = withTax + DELIVERY_FEE_CENTS;
  return `$${(delivered / 100).toFixed(2)}`;
}
