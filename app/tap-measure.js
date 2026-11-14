// The measuring cursor's tap version (touch, motion allowed): on a tap on a feature card, the
// guides flash at the tap point, snap to the card's edges and show its width × height, then the
// card opens. About 400 ms in all: 260 to snap, 140 held. Guides move by transform only, and the
// overlay removes itself after fading out under the opening panel.
const SNAP_MS = 260;
const HOLD_MS = 140;
const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";

/** Resolves when the card should open. */
export function measureTap(card, x, y) {
  const r = card.getBoundingClientRect();
  const root = document.createElement("div");
  root.className = "tapmeasure";
  root.setAttribute("aria-hidden", "true");
  const line = (dir) => {
    const s = document.createElement("span");
    s.className = `mline ${dir}`;
    root.append(s);
    return s;
  };
  const [top, bottom, left, right] = [line("h"), line("h"), line("v"), line("v")];
  const label = document.createElement("span");
  label.className = "readout mono";
  label.textContent = `${Math.round(r.width)} × ${Math.round(r.height)}`;
  label.style.transform = `translate3d(${Math.round(r.left)}px, ${Math.max(4, Math.round(r.top) - 26)}px, 0)`;
  root.append(label);
  (card.closest(".lp") ?? document.body).append(root);

  const ty = (v) => `translate3d(0, ${Math.round(v)}px, 0)`;
  const tx = (v) => `translate3d(${Math.round(v)}px, 0, 0)`;
  // A flash at the tap point, then the snap to the edge.
  const snap = (el, from, to) =>
    el.animate([{ transform: from, opacity: 0 }, { transform: from, opacity: 1, offset: 0.2 }, { transform: to, opacity: 1 }], { duration: SNAP_MS, easing: EASE, fill: "forwards" });
  snap(top, ty(y), ty(r.top));
  snap(bottom, ty(y), ty(r.bottom - 1));
  snap(left, tx(x), tx(r.left));
  snap(right, tx(x), tx(r.right - 1));
  label.animate([{ opacity: 0 }, { opacity: 0.95 }], { duration: 120, delay: SNAP_MS - 100, fill: "forwards" });

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
      root.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: "forwards" }).finished.then(() => root.remove(), () => root.remove());
    }, SNAP_MS + HOLD_MS);
  });
}
