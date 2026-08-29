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

const OPTIONS: { value: Theme; label: string }[] = [
  { value: "light", label: "Day" },
  { value: "dark", label: "Night" },
];

export default function ThemeToggle() {
  /* Starts dark to match the server HTML, then corrects before paint below.
     Reading localStorage in a lazy initialiser would disagree with the server
     render and trip a hydration error. */
  const [theme, setLocal] = useState<Theme>("dark");

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
  }

  return (
    <div className={s.wrap} role="group" aria-label="Day or night appearance">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          className={s.opt}
          aria-pressed={theme === o.value}
          onClick={() => choose(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
