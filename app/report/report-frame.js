"use client";
// The report in an iframe. The file is served unchanged; two things happen only in the browser,
// after it loads (same origin):
// - its own dark rules (@media (prefers-color-scheme: dark)) are switched on or off to follow the
//   site's theme toggle, instead of the computer's setting: the report's own colours, nothing added;
// - the iframe grows to the report's height, so the page scrolls once, also when its Details open.
import { useEffect, useRef } from "react";

const DARK_QUERY = /prefers-color-scheme:\s*dark/;

// The report's dark media rules, found once (their media text changes after the first switch).
function darkRules(doc) {
  const found = [];
  for (const sheet of doc.styleSheets) {
    let rules;
    try {
      rules = sheet.cssRules;
    } catch {
      continue; // not readable (another origin)
    }
    for (const rule of rules) if (rule instanceof doc.defaultView.CSSMediaRule && DARK_QUERY.test(rule.media.mediaText)) found.push(rule);
  }
  return found;
}

export default function ReportFrame({ src, title }) {
  const frame = useRef(null);

  useEffect(() => {
    const iframe = frame.current;
    const html = document.documentElement;
    let rules = [];
    let sizeWatch;

    const applyTheme = () => {
      const dark = html.dataset.theme !== "light";
      iframe.style.colorScheme = dark ? "dark" : "light";
      for (const rule of rules) rule.media.mediaText = dark ? "all" : "not all";
    };
    const themeWatch = new MutationObserver(applyTheme);
    themeWatch.observe(html, { attributes: true, attributeFilter: ["data-theme"] });

    const onLoad = () => {
      const doc = iframe.contentDocument;
      if (!doc?.documentElement) return;
      rules = darkRules(doc);
      applyTheme();
      const size = () => (iframe.style.height = `${doc.documentElement.scrollHeight}px`);
      size();
      sizeWatch?.disconnect();
      sizeWatch = new ResizeObserver(size);
      sizeWatch.observe(doc.documentElement);
      doc.addEventListener("toggle", size, true); // <details> opening or closing
    };
    applyTheme();
    iframe.addEventListener("load", onLoad);
    if (iframe.contentDocument?.readyState === "complete" && iframe.contentDocument.URL !== "about:blank") onLoad();
    return () => {
      themeWatch.disconnect();
      sizeWatch?.disconnect();
      iframe.removeEventListener("load", onLoad);
    };
  }, []);

  return <iframe ref={frame} className="report-frame" src={src} title={title} />;
}
