"use client";
// Light/dark toggle. Dark is the default; the choice is remembered when storage allows it.
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(null); // unknown until mounted (the server can't see storage)

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("caliper-theme", next);
    } catch {
      // storage blocked: the switch still works for this visit
    }
    setTheme(next);
  }

  const label = theme === "light" ? "Switch to dark theme" : "Switch to light theme";
  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-label={label} title={label}>
      {theme === "light" ? (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
      ) : (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
      )}
    </button>
  );
}
