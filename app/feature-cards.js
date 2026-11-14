"use client";
// The four feature cards: plain HTML mini visuals from the Quill report's numbers. Click or tap
// opens a panel; the panel and Motion load on first use (fetched early when a card is pointed at,
// touched or focused). X, Esc or the back button close it. On a tap (touch, motion allowed) the
// measuring guides snap to the card first (tap-measure.js), then it opens.
import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { PROMPT, RUNS, STOP } from "./quill-data.js";
import { startScroll, stopScroll } from "./smooth.js";
import { measureTap } from "./tap-measure.js";

const loadPanel = () => import("./feature-panel.js");
const FeaturePanel = lazy(loadPanel);
let prefetched = false;
const prefetch = () => {
  if (!prefetched) {
    prefetched = true;
    loadPanel();
  }
};

const Dot = ({ c }) => <i className={`dot ${c}`} aria-hidden="true" />;

function RunBar({ run }) {
  return (
    <div className="runbar">
      {run.segs.map((s) => <span key={s.name} className={`rs seg-${s.k}`} style={{ flexGrow: s.ms }} title={`${s.name}: ${s.ms} ms`} />)}
    </div>
  );
}
function MiniRequestMap() {
  const [app, user] = PROMPT.bySource;
  return (
    <div className="mini">
      <div className="stack">
        <span className="src-app-bg" style={{ flexGrow: app.bytes }} />
        <span className="src-user-bg" style={{ flexGrow: user.bytes }} />
        <span className="src-unknown-bg" style={{ flexGrow: 6, minWidth: 2 }} />
      </div>
      <div className="mini-legend"><span><Dot c="src-app" />app {app.share}%</span><span><Dot c="src-user" />user {user.share}%</span><span><Dot c="src-outside" />outside 0%</span></div>
      <div className="mini-row"><span>article</span><span className="mono">3207 B</span></div>
      <div className="mini-row"><span>instructions</span><span className="mono">2499 B</span></div>
    </div>
  );
}
function MiniAdvice() {
  return (
    <div className="mini">
      <p className="mini-verdict"><span className="mono">1514 ms</span> to the first word</p>
      <div className="mini-item"><span className="mono">+132 ms</span><span>first run (fresh browser)</span></div>
      <div className="mini-item"><span className="mono">55%</span><span>of the prompt is article</span></div>
    </div>
  );
}
function MiniTimeline() {
  return (
    <div className="mini">
      {RUNS.map((r) => (
        <div className="mini-run" key={r.label}>
          <span>{r.label}{r.cold && <em>cold</em>}</span>
          <RunBar run={r} />
          <span className="mono mini-run-t">{r.total}</span>
        </div>
      ))}
    </div>
  );
}
function MiniChecks() {
  return (
    <div className="mini">
      {STOP.map((s) => <div className="mini-check" key={s.k}><span className="tick">✓</span><span className="mono">{s.k}</span><span>pass</span></div>)}
      <p className="mini-verdict">Stop works (browser side)</p>
    </div>
  );
}

const FEATURES = [
  { id: "request-map", title: "Request Map", line: "What's inside each AI request, in bytes, and who wrote each part.", Mini: MiniRequestMap,
    text: ["Your server reports each message, and the parts you name, with caliper-timings. Caliper shows their sizes and who wrote each one.", "Sizes only. The text is never recorded or shown."] },
  { id: "advice", title: "Advice", line: "Next steps, only from numbers the run measured.", Mini: MiniAdvice,
    text: ["Right under the verdict. Each item fires only from a number this run measured, quotes it, and says the basis of its threshold.", "No data, no advice about it."] },
  { id: "timeline", title: "Timeline", line: "Every run, from click to first word, split into steps.", Mini: MiniTimeline,
    text: ["Each run's wait, split into segments that add up to it.", "Run 1 is a fresh browser. The warm runs come after it."] },
  { id: "checks", title: "Checks", line: "Does Stop cancel the request or only hide the text? Does a second click pay twice?", Mini: MiniChecks,
    text: ["Optional extra runs on a fresh page: Stop, and double-send.", "They see the browser only. Whether your server stopped the model call needs your server's logs."] },
];

export default function FeatureCards() {
  const [open, setOpen] = useState(null); // the open card's id
  const [shown, setShown] = useState(null); // what the panel shows: stays set while it animates closed
  const [closing, setClosing] = useState(false);
  const cards = useRef({});
  const closeRef = useRef(null);

  const close = useCallback(() => history.back(), []);
  function openCard(id) {
    history.pushState({ card: id }, "", `#${id}`);
    setOpen(id);
  }
  // The last press on a card, so a click knows whether it was a tap and where.
  const press = useRef(null);
  const measuring = useRef(false);
  async function onCard(id) {
    const p = press.current;
    press.current = null;
    const tap = p && p.type !== "mouse" && matchMedia("(prefers-reduced-motion: no-preference)").matches;
    if (!tap) return openCard(id);
    if (measuring.current) return; // a second tap while it measures
    measuring.current = true;
    try {
      await measureTap(cards.current[id], p.x, p.y);
      openCard(id);
    } finally {
      measuring.current = false;
    }
  }

  // open and close follow the URL, so the back button closes
  useEffect(() => {
    const fromHash = () => {
      const id = location.hash.slice(1);
      return FEATURES.some((f) => f.id === id) ? id : null;
    };
    const onPop = () => setOpen(fromHash());
    window.addEventListener("popstate", onPop);
    if (fromHash()) setOpen(fromHash());
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (open) {
      setShown(open);
      setClosing(false);
    } else if (shown) {
      setClosing(true);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const onClosed = useCallback(() => {
    const id = shown;
    setShown(null);
    setClosing(false);
    if (id) cards.current[id]?.focus({ preventScroll: true });
  }, [shown]);

  useEffect(() => {
    if (!shown || closing) return;
    const t = setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 0);
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.add("locked");
    stopScroll();
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("locked");
      startScroll();
    };
  }, [shown, closing, close]);

  const f = FEATURES.find((x) => x.id === shown);

  return (
    <>
      <div className="cards">
        {FEATURES.map((c) => (
          <div className="card-slot" data-rv key={c.id}>
            <button
              ref={(el) => (cards.current[c.id] = el)}
              type="button"
              className={`fcard${shown === c.id ? " away" : ""}`}
              onPointerDown={(e) => (press.current = { type: e.pointerType, x: e.clientX, y: e.clientY })}
              onPointerCancel={() => (press.current = null)}
              onClick={() => onCard(c.id)}
              onPointerEnter={prefetch}
              onTouchStart={prefetch}
              onFocus={prefetch}
              aria-haspopup="dialog"
            >
              <span className="fcard-vis"><c.Mini /></span>
              <span className="fcard-body">
                <span className="fcard-title">{c.title}</span>
                <span className="fcard-line">{c.line}</span>
                <span className="fcard-more">Open →</span>
              </span>
            </button>
          </div>
        ))}
      </div>
      {shown && (
        <Suspense fallback={null}>
          <FeaturePanel feature={f} closing={closing} cardEl={cards.current[shown]} onClose={close} onClosed={onClosed} closeRef={closeRef} />
        </Suspense>
      )}
    </>
  );
}
