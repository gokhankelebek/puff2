"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import s from "./SearchBox.module.css";
import { search } from "@/lib/search";
import { SEARCH_DOCS } from "@/lib/search-index";

/**
 * The search box, everywhere.
 *
 * It is a real `<form method="get" action="/search">` first. With scripting off
 * — or before hydration, which on a cold mobile connection is most of the time
 * a shopper is looking at it — typing and pressing Enter still works, because
 * the browser does it. Everything below only *adds* a dropdown.
 *
 * Suggestions come from the in-memory index, so there is no debounce and no
 * spinner: the list is already there before the keystroke finishes.
 *
 * ── Two presentations, one state ──────────────────────────────────────────
 *
 * Desktop is an inline field in the header with a dropdown under it. Mobile is
 * a pill that expands into a full-screen panel in place — which is the point:
 * the phone used to navigate to /search to type, losing the page behind it for
 * what is often a two-letter lookup. Same form, same results, same scorer; CSS
 * moves it rather than a second component existing.
 *
 * The no-JS path is untouched. Chrome still renders a plain <a href="/search">
 * and hides it only once the head script has set data-js, so a phone without
 * JavaScript gets the real search page and never sees a dead trigger.
 */
export default function SearchBox() {
  const docs = SEARCH_DOCS;
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  /* Mobile only: whether the panel is expanded over the page. */
  const [expanded, setExpanded] = useState(false);
  const listId = useId();
  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  /* Same two-pass search the results page runs, so the dropdown can never
     disagree with the page it leads to — including when it relaxes. */
  const hits = useMemo(
    () => (q.trim().length < 2 ? [] : search(docs, q, 7).docs),
    [docs, q],
  );

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  /* While the mobile panel is up it owns the screen: the page behind must not
     scroll under it, and Escape must close it from anywhere. */
  useEffect(() => {
    if (!expanded) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    input.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setExpanded(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [expanded]);

  function onKey(e: React.KeyboardEvent) {
    if (!open || !hits.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % hits.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? hits.length - 1 : i - 1));
    } else if (e.key === "Enter" && active >= 0) {
      // Let the form submit normally unless a suggestion is highlighted.
      e.preventDefault();
      window.location.href = `/p/${hits[active].slug}`;
    } else if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  }

  return (
    <>
      {/* The mobile trigger. Desktop hides it and shows the field directly. */}
      <button
        className={s.trigger}
        type="button"
        onClick={() => setExpanded(true)}
        aria-expanded={expanded}
      >
        <svg className={s.icon} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.6-3.6" />
        </svg>
        Search
      </button>

      <div className={s.wrap} ref={box} data-expanded={expanded || undefined}>
        <form className={s.form} action="/search" method="get" role="search">
        <svg className={s.icon} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.6-3.6" />
        </svg>
        <input
          ref={input}
          className={s.input}
          type="search"
          name="q"
          value={q}
          autoComplete="off"
          placeholder={`Search ${docs.length} products`}
          aria-label="Search products"
          aria-expanded={open && hits.length > 0}
          aria-controls={listId}
          role="combobox"
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
        />
        <button
          className={s.cancel}
          type="button"
          onClick={() => {
            setExpanded(false);
            setOpen(false);
          }}
        >
          Cancel
        </button>
      </form>

      {expanded && q.trim().length < 2 && (
        <p className={s.prompt}>
          Two letters is enough — brand, flavour or device.
        </p>
      )}

      {expanded && q.trim().length >= 2 && hits.length === 0 && (
        <p className={s.prompt}>
          Nothing matches “{q}”.{" "}
          <a className={s.promptLink} href={`/search?q=${encodeURIComponent(q)}`}>
            Search the whole shop →
          </a>
        </p>
      )}

      {(open || expanded) && hits.length > 0 && (
        <ul className={s.menu} id={listId} role="listbox">
          {hits.map((h, i) => (
            <li key={h.slug}>
              <a
                className={`${s.hit} ${i === active ? s.hitActive : ""}`}
                href={`/p/${h.slug}`}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
              >
                <span className={s.thumb}>
                  {h.img && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img className={s.thumbImg} src={h.img} alt="" loading="lazy" />
                  )}
                </span>
                <span className={s.hitText}>
                  <span className={s.hitTitle}>{h.title}</span>
                  {h.brand && <span className={s.hitBrand}>{h.brand}</span>}
                </span>
                <span className={s.hitMeta}>
                  <span className={s.hitPrice}>
                    ${(h.price / 100).toFixed(2)}
                  </span>
                  {/* Said in the dropdown, not after the tap. Finding the
                      thing and then discovering it is gone is the worst
                      order to learn it in. */}
                  {h.st === "o" ? (
                    <span className={s.hitOut}>Out</span>
                  ) : h.st === "l" ? (
                    <span className={s.hitLow}>Low</span>
                  ) : null}
                </span>
              </a>
            </li>
          ))}
          <li>
            <a className={s.all} href={`/search?q=${encodeURIComponent(q)}`}>
              See all results for “{q}” →
            </a>
          </li>
        </ul>
      )}
      </div>
    </>
  );
}
