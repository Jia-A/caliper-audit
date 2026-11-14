"use client";
// The report file and, on phones, the switch in front of it. Under 640 px the summary comes first
// and the file is hidden until "Show the full report"; from 640 px up the CSS ignores the switch,
// so the file shows as before and the summary and button don't.
import { useEffect, useRef, useState } from "react";
import ReportFrame from "./report-frame.js";

export default function ReportView({ src, title }) {
  const [open, setOpen] = useState(false);
  const frame = useRef(null);

  // Once the file is shown, bring its top under the sticky header. The iframe only grows to the
  // report's height after it lays out, and until then the page is too short to scroll that far,
  // so scroll again when it's taller than the screen.
  useEffect(() => {
    const el = frame.current;
    if (!open || !el) return;
    el.scrollIntoView({ block: "start" });
    const grown = new ResizeObserver(() => {
      if (el.offsetHeight <= innerHeight) return;
      el.scrollIntoView({ block: "start" });
      grown.disconnect();
    });
    grown.observe(el);
    return () => grown.disconnect();
  }, [open]);
  const show = () => setOpen(true);

  return (
    <>
      {!open && (
        <div className="rs-more">
          <button type="button" className="rs-btn" onClick={show} aria-controls="rp-frame">Show the full report</button>
          <p>The unchanged file Caliper wrote, every number and detail.</p>
        </div>
      )}
      <div ref={frame} id="rp-frame" className="rp-frame" data-open={open ? "" : undefined}>
        <ReportFrame src={src} title={title} />
      </div>
    </>
  );
}
