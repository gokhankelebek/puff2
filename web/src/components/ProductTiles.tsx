import { DepartmentGlyph } from "@/components/Icons";
import s from "@/app/[department]/Category.module.css";
import {
  formatMoney,
  pricePerThousandPuffs,
  stockLabel,
  type PlpArchetype,
  type Product,
} from "@/lib/commerce";

/**
 * The four PLP archetypes, shared by department pages, flavour hubs and
 * brand hubs. One tile grammar per browse decision — vape is a chip-swatch
 * grid, cigars a spec table, glass a gallery, cigarettes a utility list.
 */

function plateClass(img?: Product["images"][number]): string {
  if (!img || img.cutout) return "";
  if (img.plate === "light") return s.tilePlateLight;
  if (img.plate === "dark") return s.tilePlateDark;
  return "";
}

/**
 * A model's flavour range as a single band.
 *
 * One family renders solid; several render as hard stops, so a 71-flavour
 * disposable is visibly a range and a single-flavour cigar is visibly not.
 * Hard stops rather than a gradient — a blur would imply flavours in between
 * that the shop does not stock.
 */
function bandFor(p: Product): string | null {
  const fams = [
    ...new Set((p.flavors ?? []).map((f) => f.family).filter(Boolean)),
  ] as string[];
  if (!fams.length) return p.flavorFamily ? `var(--flavor-${p.flavorFamily})` : null;
  if (fams.length === 1) return `var(--flavor-${fams[0]})`;
  const step = 100 / fams.length;
  return `linear-gradient(90deg, ${fams
    .map((f, i) => `var(--flavor-${f}) ${i * step}% ${(i + 1) * step}%`)
    .join(", ")})`;
}

function ChipSwatch({ items }: { items: Product[] }) {
  return (
    <div className={s.grid}>
      {items.map((p) => {
        const out = p.stock.tier === "out";
        const perPuff = pricePerThousandPuffs(p);
        return (
          <a
            key={p.id}
            className={`${s.tile} ${out ? s.tileOut : ""}`}
            href={`/p/${p.slug}`}
          >
            <div
              className={`${s.tileShot} ${plateClass(p.images[0])}`}
              style={
                p.flavorFamily
                  ? ({
                      "--wash": `color-mix(in oklab, var(--flavor-${p.flavorFamily}) 26%, transparent)`,
                    } as React.CSSProperties)
                  : undefined
              }
            >
              {p.images[0] ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  className={`${s.tileImg} ${p.images[0].cutout ? s.tileImgCutout : ""}`}
                  src={p.images[0].src}
                  alt={p.images[0].alt}
                  loading="lazy"
                />
              ) : (
                <>
                  <DepartmentGlyph department={p.department} size={44} className={s.tileGlyph} />
                  {p.brand && <span className={s.tileBrand}>{p.brand}</span>}
                </>
              )}
              {bandFor(p) && (
                <span className={s.band} style={{ background: bandFor(p)! }} aria-hidden="true" />
              )}
            </div>
            <div className={s.tileBody}>
              <span className={s.tileFlavor}>{p.title}</span>
              <span className={s.tileModel}>
                {[
                  p.flavors && p.flavors.length > 1
                    ? `${p.flavors.length} flavours`
                    : p.flavors?.[0]?.value,
                  p.nicotineStrengths?.length
                    ? `${p.nicotineStrengths.join("/")}mg`
                    : p.nicotineMg !== undefined
                      ? `${p.nicotineMg}mg`
                      : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
              <div className={s.tileFoot}>
                <span className={s.tilePrice}>{formatMoney(p.price)}</span>
                {perPuff && <span className={s.tilePerPuff}>{perPuff}</span>}
              </div>
              <span
                className={`${s.tileStock} ${
                  p.stock.tier === "verified" ? s.stockVerified : ""
                }`}
              >
                {stockLabel(p.stock)}
              </span>
            </div>
          </a>
        );
      })}
    </div>
  );
}

function Thumb({ product: p, size = 64 }: { product: Product; size?: number }) {
  const img = p.images[0];
  return (
    <span className={`${s.thumb} ${plateClass(img)}`} aria-hidden="true">
      {img ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          className={`${s.thumbImg} ${img.cutout ? s.thumbImgCutout : ""}`}
          src={img.src}
          alt=""
          loading="lazy"
        />
      ) : (
        <DepartmentGlyph
          department={p.department}
          size={Math.round(size * 0.55)}
          className={s.tileGlyph}
        />
      )}
    </span>
  );
}

function SpecTable({ items }: { items: Product[] }) {
  return (
    <div className={s.list}>
      {items.map((p) => (
        <a key={p.id} className={s.row} href={`/p/${p.slug}`}>
          <Thumb product={p} size={80} />
          <span className={s.rowBody}>
            <span className={s.rowName}>{p.title}</span>
            <span className={s.rowSpecs}>
              {[
                p.wrapper,
                p.vitola,
                p.ringGauge && p.lengthIn ? `${p.lengthIn}×${p.ringGauge}` : null,
                stockLabel(p.stock),
              ]
                .filter(Boolean)
                .join(" · ")}
            </span>
          </span>
          <span className={s.rowPrice}>
            {formatMoney(p.price)} <span className={s.rowSingle}>single</span>
          </span>
        </a>
      ))}
    </div>
  );
}

function Gallery({ items }: { items: Product[] }) {
  return (
    <div className={s.gallery}>
      {items.map((p) => (
        <a key={p.id} className={s.galleryCell} href={`/p/${p.slug}`}>
          <div className={`${s.galleryShot} ${plateClass(p.images[0])}`}>
            {p.images[0] ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                className={`${s.tileImg} ${p.images[0].cutout ? s.tileImgCutout : ""}`}
                src={p.images[0].src}
                alt={p.images[0].alt}
                loading="lazy"
              />
            ) : (
              <DepartmentGlyph department={p.department} size={64} className={s.tileGlyph} />
            )}
          </div>
          <div className={s.galleryMeta}>
            <span className={s.tileFlavor}>{p.title}</span>
            <span className={s.tilePrice}>{formatMoney(p.price)}</span>
          </div>
          <span className={s.tileStock}>
            {p.inStoreOnly ? p.inStoreReason : stockLabel(p.stock)}
          </span>
        </a>
      ))}
    </div>
  );
}

function UtilityList({ items }: { items: Product[] }) {
  return (
    <div className={s.utility}>
      {items.map((p) => (
        <a key={p.id} className={s.utilityRow} href={`/p/${p.slug}`}>
          <Thumb product={p} size={64} />
          <span className={s.utilityName}>{p.title}</span>
          <span className={s.tilePrice}>{formatMoney(p.price)}</span>
        </a>
      ))}
    </div>
  );
}

export function ProductTiles({
  items,
  archetype,
}: {
  items: Product[];
  archetype: PlpArchetype;
}) {
  if (archetype === "chip-swatch") return <ChipSwatch items={items} />;
  if (archetype === "spec-table") return <SpecTable items={items} />;
  if (archetype === "gallery") return <Gallery items={items} />;
  return <UtilityList items={items} />;
}

export function EmptyResults({
  clearHref,
  clearLabel = "Clear the filters →",
}: {
  clearHref: string;
  clearLabel?: string;
}) {
  return (
    <div className={s.empty}>
      <p className={s.emptyLine}>
        Nothing matches. Text a photo — we probably have it.
      </p>
      <a className={s.emptyLink} href="sms:+17026137799">
        Text us a photo →
      </a>
      <a className={s.emptyLink} href={clearHref}>
        {clearLabel}
      </a>
    </div>
  );
}
