import type { Metadata } from "next";
import { notFound } from "next/navigation";
import f from "./Filters.module.css";
import Bulbs from "@/components/Bulbs";
import { Wordmark } from "@/components/Chrome";
import {
  commerce,
  isDepartment,
  DEPARTMENT_LABELS,
  FLAVOR_FAMILIES,
  NICOTINE_STRENGTHS,
  type Product,
} from "@/lib/commerce";
import { applyFilters, type CatalogFilters } from "@/lib/filters";

export const metadata: Metadata = {
  title: "Filters | Puff Vegas",
  robots: { index: false, follow: false },
};

type Search = CatalogFilters;

/**
 * 4c — Filter sheet.
 *
 * A ROUTE, not an overlay. The design draws it as a bottom sheet, and on
 * mobile it reads as one, but making it a real page with a real GET form is
 * what keeps the whole filter system working with scripting off — the same
 * rule the rest of the site follows. Submitting navigates to the department
 * with the filters as query parameters, which is also what makes a filtered
 * view shareable.
 *
 * Counts are computed from the catalogue so a filter never offers a
 * combination that leads nowhere.
 */
export default async function FilterSheet({
  params,
  searchParams,
}: {
  params: Promise<{ department: string }>;
  searchParams: Promise<Search>;
}) {
  const { department } = await params;
  if (!isDepartment(department)) notFound();

  const sp = await searchParams;
  const all = await commerce.getProducts({ department });

  const brands = countBy(all, (p) => p.brand).slice(0, 12);
  const families = FLAVOR_FAMILIES.filter((x) =>
    all.some((p) => p.flavorFamily === x.id),
  );
  const strengths = NICOTINE_STRENGTHS.filter((n) =>
    all.some((p) => p.nicotineMg === n),
  );
  const puffs = all
    .map((p) => p.puffCount)
    .filter((n): n is number => typeof n === "number");
  const puffMin = puffs.length ? Math.min(...puffs) : 0;
  const puffMax = puffs.length ? Math.max(...puffs) : 0;

  const matching = applyFilters(all, sp).length;

  return (
    <main className={f.sheet}>
      <header className={f.head}>
        <a className={f.back} href={`/${department}`} aria-label="Close filters">
          ✕
        </a>
        <span className={f.headTitle}>Filters</span>
        {/* Clearing is a link to the bare department — no reset button
            needed, and it works with scripting off. */}
        <a className={f.clear} href={`/${department}/filters`}>
          Clear all
        </a>
      </header>

      <Bulbs />

      <form className={f.form} action={`/${department}`} method="get">
        {brands.length > 0 && (
          <fieldset className={f.group}>
            <legend className={f.legend}>Brand</legend>
            <div className={f.chips}>
              {brands.map(([name, n]) => (
                <label key={name} className={f.chip}>
                  <input
                    className={f.chipInput}
                    type="radio"
                    name="brand"
                    value={name}
                    defaultChecked={sp.brand === name}
                  />
                  <span className={f.chipFace}>
                    {name}
                    <span className={f.chipCount}>{n}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {strengths.length > 0 && (
          <fieldset className={f.group}>
            <legend className={f.legend}>Nicotine</legend>
            <div className={f.chips}>
              {strengths.map((n) => (
                <label key={n} className={f.chip}>
                  <input
                    className={f.chipInput}
                    type="radio"
                    name="nic"
                    value={String(n)}
                    defaultChecked={sp.nic === String(n)}
                  />
                  <span className={f.chipFace}>{n === 0 ? "0%" : `${n} mg`}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {puffMax > 0 && (
          <fieldset className={f.group}>
            <legend className={f.legend}>Puff count</legend>
            {/* Two number inputs rather than a dual-handle slider. The design
                draws a slider; a slider cannot be operated without JavaScript
                and cannot be typed into at all, and this is the one filter
                where people arrive knowing the exact number they want. */}
            <div className={f.range}>
              <label className={f.rangeField}>
                <span className={f.rangeLabel}>Min</span>
                <input
                  className={f.rangeInput}
                  type="number"
                  name="puffMin"
                  inputMode="numeric"
                  min={puffMin}
                  max={puffMax}
                  step={1000}
                  placeholder={String(puffMin)}
                  defaultValue={sp.puffMin}
                />
              </label>
              <span className={f.rangeDash} aria-hidden="true">
                –
              </span>
              <label className={f.rangeField}>
                <span className={f.rangeLabel}>Max</span>
                <input
                  className={f.rangeInput}
                  type="number"
                  name="puffMax"
                  inputMode="numeric"
                  min={puffMin}
                  max={puffMax}
                  step={1000}
                  placeholder={String(puffMax)}
                  defaultValue={sp.puffMax}
                />
              </label>
            </div>
            <p className={f.rangeNote}>
              {puffMin.toLocaleString()} – {puffMax.toLocaleString()} puffs on
              the shelf
            </p>
          </fieldset>
        )}

        {families.length > 0 && (
          <fieldset className={f.group}>
            <legend className={f.legend}>Flavour profile</legend>
            <div className={f.chips}>
              {families.map((x) => (
                <label key={x.id} className={f.chip}>
                  <input
                    className={f.chipInput}
                    type="radio"
                    name="flavor"
                    value={x.id}
                    defaultChecked={sp.flavor === x.id}
                  />
                  <span className={f.chipFace}>
                    <span
                      className={f.swatch}
                      style={{ background: `var(--flavor-${x.id})` }}
                      aria-hidden="true"
                    />
                    {x.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        <label className={f.toggle}>
          <input
            className={f.toggleInput}
            type="checkbox"
            name="inStock"
            value="1"
            defaultChecked={sp.inStock === "1"}
          />
          <span className={f.toggleTrack} aria-hidden="true" />
          <span className={f.toggleLabel}>Only what&rsquo;s on the shelf</span>
        </label>

        <div className={f.footer}>
          <button className={f.show} type="submit">
            Show {matching} {matching === 1 ? "result" : "results"}
          </button>
        </div>
      </form>

      <div className={f.brand} aria-hidden="true">
        <Wordmark />
      </div>
    </main>
  );
}

function countBy(
  items: Product[],
  key: (p: Product) => string | undefined,
): [string, number][] {
  const map = new Map<string, number>();
  for (const p of items) {
    const k = key(p);
    if (!k) continue;
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

