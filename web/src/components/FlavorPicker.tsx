"use client";

import { useState, useSyncExternalStore, useTransition } from "react";
import { useRouter } from "next/navigation";
import s from "./FlavorPicker.module.css";
import { FLAVOR_FAMILIES, type FlavorFamily } from "@/lib/commerce/types";

type Flavor = { value: string; family: FlavorFamily | null };

/** Long lists read better split by family; short ones are just a row of chips. */
const GROUP_OVER = 12;

/**
 * Choose a flavour, so the text the customer sends names it.
 *
 * Progressive enhancement, per the house rule: underneath this is a GET form
 * of radio buttons. With scripting off, picking one and pressing the button
 * reloads the page as `?flavor=…`, and the server writes that flavour into
 * the order text. With scripting on, the button is hidden and a pick does the
 * same navigation in place — same URL, same server render, no second code
 * path deciding what the text says.
 */
export default function FlavorPicker({
  slug,
  flavors,
  chosen,
  noun,
}: {
  slug: string;
  flavors: Flavor[];
  chosen?: string;
  /** "flavour" for vapes, pouches and shisha; "style" for cigarettes and leaf. */
  noun: "flavour" | "style";
}) {
  const router = useRouter();
  const [selected, setSelected] = useState(chosen);
  const [pending, startTransition] = useTransition();
  // true only once hydrated, so the no-script button stays in the server HTML.
  const enhanced = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  function pick(value: string) {
    setSelected(value);
    startTransition(() => {
      router.replace(`/p/${slug}?flavor=${encodeURIComponent(value)}`, { scroll: false });
    });
  }

  const groups = flavors.length > GROUP_OVER ? byFamily(flavors) : [{ id: "all", label: null, items: flavors }];

  return (
    <form className={s.wrap} method="get" action={`/p/${slug}#flavor`} id="flavor">
      <fieldset className={s.fieldset}>
        <legend className={s.legend}>
          Choose a {noun} <span className={s.count}>{flavors.length}</span>
        </legend>

        {groups.map((g) => (
          <div key={g.id} className={s.group}>
            {g.label && <p className={s.groupLabel}>{g.label}</p>}
            <div className={s.chips}>
              {g.items.map((f) => (
                <label key={f.value} className={s.chip}>
                  <input
                    className={s.radio}
                    type="radio"
                    name="flavor"
                    value={f.value}
                    checked={selected === f.value}
                    onChange={() => pick(f.value)}
                  />
                  <span className={s.face}>
                    <span
                      className={s.swatch}
                      style={{
                        background: f.family ? `var(--flavor-${f.family})` : "var(--border-strong)",
                      }}
                      aria-hidden="true"
                    />
                    {f.value}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </fieldset>

      <p className={s.status} aria-live="polite" data-pending={pending || undefined}>
        {selected ? (
          <>
            Your text will ask for <strong>{selected}</strong>.
          </>
        ) : (
          `Pick one and your text will ask for it.`
        )}
      </p>

      {!enhanced && (
        <button className={s.submit} type="submit">
          Use this {noun}
        </button>
      )}
    </form>
  );
}

function byFamily(flavors: Flavor[]) {
  const groups = FLAVOR_FAMILIES.map((f) => ({
    id: f.id as string,
    label: f.label as string | null,
    items: flavors.filter((x) => x.family === f.id),
  }));
  groups.push({ id: "more", label: "More", items: flavors.filter((x) => !x.family) });
  return groups.filter((g) => g.items.length);
}
