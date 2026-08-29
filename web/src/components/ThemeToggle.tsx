"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import s from "./ThemeToggle.module.css";
import {
  SOURCE_ATTR,
  THEME_KEY,
  currentTheme,
  setTheme,
  syncThemeColor,
  systemTheme,
  type Theme,
} from "@/lib/theme";

/* Sun and moon, drawn here rather than imported. Two 14px glyphs do not
   justify an icon set, and the handoff asks for text glyphs anyway. They
   stroke in currentColor so each half of the control paints itself. */
function Sun() {
  return (
    <svg className={s.glyph} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4.4" />
      <path d="M12 2.4v2.6M12 19v2.6M4.6 4.6l1.9 1.9M17.5 17.5l1.9 1.9M2.4 12h2.6M19 12h2.6M4.6 19.4l1.9-1.9M17.5 6.5l1.9-1.9" />
    </svg>
  );
}

function Moon() {
  return (
    <svg className={s.glyph} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 14.2A8.4 8.4 0 1 1 9.8 4a6.8 6.8 0 0 0 10.2 10.2z" />
    </svg>
  );
}

const OPTIONS: { value: Theme; label: string; Icon: () => React.ReactElement }[] = [
  { value: "light", label: "Day", Icon: Sun },
  { value: "dark", label: "Night", Icon: Moon },
];

export default function ThemeToggle() {
  /* Starts dark to match the server HTML, then corrects before paint below.
     Reading localStorage in a lazy initialiser would disagree with the server
     render and trip a hydration error. */
  const [theme, setLocal] = useState<Theme>("dark");
  /* Whether a choice is pinned, or the site is still following the device.
     Surfacing this is the whole job a third "System" button usually does —
     see the note in lib/theme.ts on why there isn't one. */
  const [pinned, setPinned] = useState(false);

  useLayoutEffect(() => {
    /* Two jobs. Adopt whatever the head script resolved so the control shows
       the right state — and re-apply it, because React's Strict Mode remount
       in development resets `<html>` to the attributes it manages from JSX and
       drops the ones the script set. A no-op in production. */
    let resolved = currentTheme();
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === "light" || stored === "dark") resolved = stored;
      else resolved = systemTheme();
      document.documentElement.setAttribute("data-theme", resolved);
      document.documentElement.setAttribute(
        SOURCE_ATTR,
        stored === "light" || stored === "dark" ? "user" : "system",
      );
      /* Re-applied for the same reason: the dev remount clears it, and this
         control hides itself until it is present. */
      document.documentElement.setAttribute("data-js", "1");
    } catch {
      /* storage unavailable — whatever the script resolved still stands */
    }
    setLocal(resolved);
    setPinned(document.documentElement.getAttribute(SOURCE_ATTR) === "user");
    syncThemeColor(
      resolved,
      document.documentElement.getAttribute(SOURCE_ATTR) === "user",
    );
  }, []);

  /* While no choice is pinned, follow the OS live rather than only at load. */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      if (document.documentElement.getAttribute(SOURCE_ATTR) !== "system") return;
      const next = mq.matches ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      setLocal(next);
      setPinned(false);
      syncThemeColor(next, false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function choose(next: Theme) {
    if (next === theme) return;
    /* Repaint the whole palette as one deliberate move. Without this only the
       handful of elements that already declare a transition would animate and
       the rest would snap, which reads as a rendering fault rather than a
       change of state. Skipped for anyone who asked for less motion. */
    const root = document.documentElement;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!still) {
      root.setAttribute("data-theme-anim", "");
      window.setTimeout(() => root.removeAttribute("data-theme-anim"), 320);
    }
    setTheme(next);
    setLocal(next);
    /* setTheme clears the override when the choice matches the device, so
       picking "the one you already had" is how you get back to following it. */
    setPinned(next !== systemTheme());
  }

  return (
    <div className={s.field}>
      <div className={s.wrap} role="group" aria-label="Day or night appearance">
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            className={s.opt}
            data-on={theme === o.value ? "" : undefined}
            aria-pressed={theme === o.value}
            onClick={() => choose(o.value)}
          >
            <o.Icon />
            {o.label}
          </button>
        ))}
      </div>
      <p className={s.hint}>
        {pinned ? (
          <>
            Pinned to {theme === "dark" ? "night" : "day"}.{" "}
            <button
              type="button"
              className={s.reset}
              onClick={() => choose(systemTheme())}
            >
              Follow my device
            </button>
          </>
        ) : (
          "Following your device."
        )}
      </p>
    </div>
  );
}
