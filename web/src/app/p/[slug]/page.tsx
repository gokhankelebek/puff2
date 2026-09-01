import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";
import s from "./Product.module.css";
import NicotineWarning from "@/components/NicotineWarning";
import Bulbs from "@/components/Bulbs";
import { AgeBanner, Header, BottomNav, PHONE_DISPLAY, PHONE_HREF } from "@/components/Chrome";
import { AGE_HEADER } from "@/lib/age-shared";
import {
  commerce,
  formatMoney,
  pricePerThousandPuffs,
  puffsInHumanUnits,
  stockLabel,
  DEPARTMENT_LABELS,
  type Product,
} from "@/lib/commerce";
import { SITE_ORIGIN } from "@/lib/shop";
import { jsonLd, breadcrumbLd } from "@/lib/jsonld";
import {
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

  const perPuff = pricePerThousandPuffs(product);
  const human = puffsInHumanUnits(product);

  /* Product + Offer, shipped for correctness. Google suppresses shopping /
     merchant rich results for tobacco & nicotine, so this is unlikely to earn
     price/availability stars — but the markup is valid, honest, and matches the
     visible page exactly (price and availability drift is what triggers
     "spammy structured data"). Description is intentionally omitted until real
     product copy lands (Phase 4); a fabricated one would be thin. */
  const availability =
    product.stock.tier === "out"
      ? "https://schema.org/OutOfStock"
      : product.stock.tier === "low"
        ? "https://schema.org/LimitedAvailability"
        : "https://schema.org/InStock";
  const productLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: product.title,
        ...(product.brand
          ? { brand: { "@type": "Brand", name: product.brand } }
          : {}),
        ...(product.images[0]
          ? { image: `${SITE_ORIGIN}${product.images[0].src}` }
          : {}),
        category: DEPARTMENT_LABELS[product.department],
        offers: {
          "@type": "Offer",
          price: (product.price.cents / 100).toFixed(2),
          priceCurrency: product.price.currency,
          availability,
          url: `${SITE_ORIGIN}/p/${product.slug}`,
          seller: { "@id": `${SITE_ORIGIN}/#store` },
        },
      },
      breadcrumbLd(SITE_ORIGIN, [
        { name: "Puff Vegas", path: "/" },
        {
          name: DEPARTMENT_LABELS[product.department],
          path: `/${product.department}`,
        },
        { name: product.title, path: `/p/${product.slug}` },
      ]),
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(productLd)} />
      <AgeBanner affirmed={affirmed} />
      <Header />

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

        {/* Frames the shot as a lit display case — the signature divider was
            absent from this template entirely. */}
        <Bulbs />

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
              {/* Not an all-in figure for this one item. The fee is charged
                  once per order (lib/draft.ts), so quoting price + tax + $20
                  on every product told anyone buying two things that delivery
                  costs $40. Stating the rule instead of a total is both true
                  and the better offer: adding more does not cost more. */}
              {product.deliveryEligible && (
                <p className={s.allIn}>
                  {DELIVERY_STRIP_FEE_LABEL} flat delivery, once per order
                  however much you add · {DELIVERY_MINIMUM_LABEL}
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

        <Bulbs />

        <div className={s.trust}>
          {product.deliveryEligible ? (
            <>
              <article className={s.trustCard}>
                <span className={s.trustTitle}>Same price</span>
                <p className={s.trustBody}>{`In store and delivered. ${DELIVERY_STRIP_FEE_LABEL} · ${DELIVERY_MINIMUM_LABEL}.`}</p>
              </article>
              <article className={s.trustCard}>
                <span className={s.trustTitle}>21+</span>
                <p className={s.trustBody}>ID at handoff. Have it out.</p>
              </article>
              <article className={s.trustCard}>
                <span className={s.trustTitle}>Pay at handoff</span>
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
                <p className={s.trustBody}>ID at handoff. Have it out.</p>
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

