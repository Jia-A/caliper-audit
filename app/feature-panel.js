"use client";
// The open card: loaded on first use (with Motion), so the page itself doesn't carry Motion.
// It springs from the card's rectangle to the panel's (FLIP) and back on close; inside, bars grow,
// numbers count up and rows come in one by one. Reduced motion: no morph, no build-in.
import { useEffect, useLayoutEffect, useRef } from "react";
import { MotionConfig, animate, motion, useReducedMotion } from "motion/react";
import { ADVICE, PROMPT, RUNS, STOP, VERDICT } from "./quill-data.js";

const SPRING = { type: "spring", stiffness: 420, damping: 38, mass: 0.9 };
const fmt = (n) => String(Math.round(n));

function Count({ to, suffix = "", delay = 0.2 }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce || !ref.current) return;
    const c = animate(0, to, { duration: 0.4, delay, ease: "easeOut", onUpdate: (v) => ref.current && (ref.current.textContent = fmt(v) + suffix) });
    return () => c.stop();
  }, [to, suffix, delay, reduce]);
  return <span ref={ref}>{reduce ? fmt(to) + suffix : "0" + suffix}</span>;
}

const grow = (i, base = 0.2) => ({
  initial: { clipPath: "inset(0 100% 0 0)" },
  animate: { clipPath: "inset(0 0% 0 0)" },
  transition: { duration: 0.35, delay: base + i * 0.08, ease: [0.2, 0.7, 0.2, 1] },
});
const rows = { show: { transition: { staggerChildren: 0.045, delayChildren: 0.18 } } };
const row = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } };
const Dot = ({ c }) => <i className={`dot ${c}`} aria-hidden="true" />;

function RequestMap() {
  return (
    <>
      <motion.table className="ptable" variants={rows} initial="hidden" animate="show">
        <thead><tr><th>message / part</th><th className="r">bytes</th><th>source</th></tr></thead>
        <tbody>
          {PROMPT.messages.flatMap((m) => [
            <motion.tr variants={row} key={m.role} className="msg"><td>{m.role}</td><td className="r mono"><Count to={m.bytes} /></td><td className="muted">{m.share}%</td></motion.tr>,
            ...m.parts.map((p) => (
              <motion.tr variants={row} key={m.role + p.name}>
                <td className="part">{p.name}</td>
                <td className="r mono"><Count to={p.bytes} /></td>
                <td><Dot c={`src-${p.source}`} />{p.source}<span className="muted">{p.source !== "unknown" ? " labelled by app" : " not labelled"}</span></td>
              </motion.tr>
            )),
          ])}
          <motion.tr variants={row} className="msg"><td>total</td><td className="r mono"><Count to={PROMPT.total} /></td><td /></motion.tr>
        </tbody>
      </motion.table>
      <div className="bysrc">
        {PROMPT.bySource.map((s, i) => (
          <div className="bysrc-row" key={s.source}>
            <span><Dot c={`src-${s.source}`} />{s.source}</span>
            <span className="bysrc-track"><motion.span className={`bysrc-fill src-${s.source}-bg`} style={{ width: `${Math.max(s.share, s.bytes ? 1 : 0)}%` }} {...grow(i, 0.35)} /></span>
            <span className="mono bysrc-v"><Count to={s.share} suffix="%" delay={0.35} /></span>
          </div>
        ))}
      </div>
    </>
  );
}
function Advice() {
  return (
    <motion.div variants={rows} initial="hidden" animate="show">
      <motion.p variants={row} className="big-verdict">{VERDICT}</motion.p>
      {ADVICE.map((a) => (
        <motion.div variants={row} className="advice-item" key={a.line}>
          <p className="advice-line">{a.line}</p>
          <p className="advice-why"><span className="muted">why: </span>{a.why}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
function Timeline() {
  const legend = [["click", "click → request sent / fetch() called"], ["preflight", "CORS preflight"], ["ttfb", "browser: response headers received"], ["paint", "headers → first paint"]];
  return (
    <motion.div variants={rows} initial="hidden" animate="show">
      {RUNS.map((r) => (
        <motion.div variants={row} className="big-run" key={r.label}>
          <div className="big-run-head"><span>{r.label}{r.cold && <em className="cold">cold</em>}</span><span className="mono big-run-t"><Count to={r.total} suffix=" ms" /></span></div>
          <div className="runbar">
            {r.segs.map((s, i) => <motion.span key={s.name} className={`rs seg-${s.k}`} style={{ flexGrow: s.ms }} title={`${s.name}: ${s.ms} ms`} {...grow(i)} />)}
          </div>
          <div className="big-run-segs mono">{r.segs.map((s) => <span key={s.name}><Dot c={`seg-${s.k}`} />{s.ms} ms</span>)}</div>
        </motion.div>
      ))}
      <motion.div variants={row} className="legend">{legend.map(([k, n]) => <span key={k}><Dot c={`seg-${k}`} />{n}</span>)}</motion.div>
    </motion.div>
  );
}
function Checks() {
  return (
    <motion.div variants={rows} initial="hidden" animate="show">
      <motion.p variants={row} className="big-verdict">Stop works (browser side)</motion.p>
      {STOP.map((s) => (
        <motion.div variants={row} className="check-row" key={s.k}>
          <span className="tick">✓</span><span className="mono ck">{s.k}</span>
          <span>{s.text}{s.ms !== undefined && <> <span className="mono"><Count to={s.ms} /></span> {s.after}</>}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
const BIG = { "request-map": RequestMap, advice: Advice, timeline: Timeline, checks: Checks };

// FLIP: the transform that puts the panel exactly over the card.
function fromCard(panel, card) {
  const p = panel.getBoundingClientRect(), c = card.getBoundingClientRect();
  return { x: c.left + c.width / 2 - (p.left + p.width / 2), y: c.top + c.height / 2 - (p.top + p.height / 2), scaleX: c.width / p.width, scaleY: c.height / p.height };
}

// Mounted once a card has been opened; stays mounted so closing can animate.
// `feature` is the open one, or null while closed; `closing` plays the way back, then onClosed().
export default function FeaturePanel({ feature, closing, cardEl, onClose, onClosed, closeRef }) {
  const panel = useRef(null);
  const scrim = useRef(null);
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    if (!feature || closing || !panel.current) return;
    if (reduce || !cardEl) return;
    const f = fromCard(panel.current, cardEl);
    const a = animate(panel.current, { x: [f.x, 0], y: [f.y, 0], scaleX: [f.scaleX, 1], scaleY: [f.scaleY, 1], opacity: [0.4, 1] }, SPRING);
    const s = animate(scrim.current, { opacity: [0, 1] }, { duration: 0.2 });
    return () => { a.stop(); s.stop(); };
  }, [feature, closing, cardEl, reduce]);

  useEffect(() => {
    if (!closing) return;
    if (reduce || !cardEl || !panel.current) return onClosed();
    const f = fromCard(panel.current, cardEl);
    animate(scrim.current, { opacity: 0 }, { duration: 0.2 });
    const a = animate(panel.current, { x: f.x, y: f.y, scaleX: f.scaleX, scaleY: f.scaleY, opacity: 0 }, { duration: 0.28, ease: [0.4, 0, 0.2, 1] });
    a.then(onClosed);
    return () => a.stop();
  }, [closing, cardEl, reduce, onClosed]);

  if (!feature) return null;
  const Big = BIG[feature.id];
  return (
    <MotionConfig reducedMotion="user">
      <div ref={scrim} className="scrim" onClick={onClose} />
      <div className="panel-wrap">
        <div ref={panel} className="panel" role="dialog" aria-modal="true" aria-labelledby="panel-title" style={{ transformOrigin: "50% 50%" }}>
          <div className="panel-head">
            <h3 id="panel-title">{feature.title}</h3>
            <button ref={closeRef} type="button" className="close" onClick={onClose} aria-label="Close">✕</button>
          </div>
          <motion.div className="panel-scroll" data-lenis-prevent initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, delay: 0.12 }}>
            <div className="panel-vis"><Big /></div>
            <div className="panel-text">
              {feature.text.map((t) => <p key={t}>{t}</p>)}
              <p className="panel-src">Quill, Nov 14, 2026.</p>
              <a className="panel-link" href="/report/quill.html">View in the real report →</a>
            </div>
          </motion.div>
        </div>
      </div>
    </MotionConfig>
  );
}
