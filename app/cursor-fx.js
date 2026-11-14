"use client";
// The measuring cursor (a mouse, motion allowed): thin guides from the cursor to the viewport
// edges and a small "x · y" readout. Over a feature card the guides snap to the card's edges and
// the readout shows its width × height. It also drives each card's edge glow (--cx/--cy).
// The real cursor stays. One animation frame per pointer move or scroll; guides and readout move
// by transform and show by opacity only.
import { useEffect, useRef } from "react";

export default function CursorFX() {
  const root = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (hover: hover) and (prefers-reduced-motion: no-preference)");
    if (!mq.matches) return;
    const html = document.documentElement;
    html.classList.add("fx-cursor");
    const el = root.current;
    const [h1, h2, v1, v2] = el.querySelectorAll(".mline");
    const label = el.querySelector(".readout");
    let x = 0, y = 0, inside = false, queued = false, lastText = "";

    const at = (node, tx, ty) => (node.style.transform = `translate3d(${tx}px, ${ty}px, 0)`);
    const show = (node, on) => node.classList.toggle("on", on);
    const text = (t) => {
      if (t !== lastText) label.textContent = lastText = t;
    };

    function frame() {
      queued = false;
      const off = !inside || html.classList.contains("locked");
      el.classList.toggle("hidden", off);
      if (off) return;

      for (const card of document.querySelectorAll(".fcard")) {
        const r = card.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) continue;
        card.style.setProperty("--cx", `${x - r.left}px`);
        card.style.setProperty("--cy", `${y - r.top}px`);
      }

      const card = document.elementFromPoint(x, y)?.closest(".fcard");
      el.classList.toggle("snap", !!card);
      if (card) {
        const r = card.getBoundingClientRect();
        at(h1, 0, Math.round(r.top));
        at(h2, 0, Math.round(r.bottom) - 1);
        at(v1, Math.round(r.left), 0);
        at(v2, Math.round(r.right) - 1, 0);
        show(h2, true);
        show(v2, true);
        text(`${Math.round(r.width)} × ${Math.round(r.height)}`);
        at(label, Math.round(r.left), Math.max(4, Math.round(r.top) - 26));
      } else {
        at(h1, 0, y);
        at(v1, x, 0);
        show(h2, false);
        show(v2, false);
        text(`${x} · ${y}`);
        const lx = x > innerWidth - 120 ? x - 100 : x + 14;
        const ly = y > innerHeight - 40 ? y - 30 : y + 14;
        at(label, lx, ly);
      }
    }
    const queue = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(frame);
      }
    };
    function move(e) {
      if (e.pointerType !== "mouse") return;
      x = Math.round(e.clientX);
      y = Math.round(e.clientY);
      inside = true;
      queue();
    }
    function leave() {
      inside = false;
      queue();
    }
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", queue, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", queue);
      document.documentElement.removeEventListener("pointerleave", leave);
      html.classList.remove("fx-cursor");
    };
  }, []);

  return (
    <div ref={root} className="measure hidden" aria-hidden="true">
      <span className="mline h on" />
      <span className="mline h" />
      <span className="mline v on" />
      <span className="mline v" />
      <span className="readout mono on" />
    </div>
  );
}
