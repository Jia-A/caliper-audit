// The landing page. It sells; the README teaches. Every claim is from the caliper-ai and
// caliper-timings READMEs (github.com/Jia-A/caliper): Caliper measures and shows where the wait
// goes; it never changes the app. Every number is from the Quill report (app/quill-data.js).
// The HTML here is complete on its own; scroll-fx.js, cursor-fx.js and feature-cards.js add motion.
import "./landing.css";
import CopyButton from "./copy-button.js";
import CursorFX from "./cursor-fx.js";
import FeatureCards from "./feature-cards.js";
import ScrollFX from "./scroll-fx.js";
import SiteHeader from "./site-header.js";
import { WARM } from "./quill-data.js";

const INSTALL = "npm i -g caliper-ai && npx playwright@1.64.1 install chromium";
const README = "https://github.com/Jia-A/caliper/tree/main/packages/cli#readme";
const GITHUB = "https://github.com/Jia-A/caliper";

// Ideas, not promises: nothing here is built, and none of it has a date.
const NEXT = [
  { title: "3D replay", line: "Watch a request travel through your app." },
  { title: "Firefox + Safari", line: "Today Caliper needs CDP, which only Chromium has." },
  { title: "Hosted Caliper", line: "Run it without installing." },
  { title: "History", line: "See if you're getting faster or slower over time." },
  { title: "More backends", line: "Server timings for Go, PHP and Java." },
  { title: "WebSocket apps", line: "Time replies that arrive over a WebSocket, not just HTTP." },
];

function HeroTimeline() {
  return (
    <figure className="tl" aria-label="Quill's warm run: 1514 ms from click to first word, split into three segments">
      <span className="tl-label">Click → first word · Quill, warm run</span>
      <span className="tl-total mono" aria-hidden="true">{WARM.total} ms</span>
      <div className="tl-bar">
        {WARM.segs.map((s) => (
          <span key={s.name} className={`seg ${s.ms > s.limit ? "over" : "ok"}`} style={{ flexGrow: s.ms }} title={`${s.name}: ${s.ms} ms`}>
            {s.ms > s.limit && <span className="seg-label mono">{s.ms} ms <b>OVER</b></span>}
          </span>
        ))}
      </div>
      <ul className="tl-key">
        {WARM.segs.map((s) => (
          <li key={s.name} className={s.ms > s.limit ? "over" : "ok"}>
            <span className="sw" />
            <span className="k-name">{s.name}</span>
            <span className="k-val mono">{s.ms} ms {s.ms > s.limit ? <b>over</b> : "within"} its {s.limit} ms limit</span>
          </li>
        ))}
      </ul>
      <figcaption>
        Real numbers from a Caliper report of Quill, Nov 14, 2026. <a href="/report">See the report →</a>
      </figcaption>
    </figure>
  );
}

export default function Landing() {
  return (
    <div className="lp">
      <ScrollFX />
      <CursorFX />

      <SiteHeader />

      <main>
        <section className="hero">
          <div className="hero-stage">
            <div className="intro">
              <p className="wordmark">Caliper</p>
              <p className="intro-line">Measures what your AI interface makes users wait for.</p>
              <span className="scroll-hint mono" aria-hidden="true">scroll ↓</span>
            </div>
            <div className="wrap hero-grid">
              <div className="hero-copy">
                <span className="badge mono h-rv">Lighthouse for AI features</span>
                <h1 className="h-rv">See where your AI feature&apos;s wait goes — and where to look first.</h1>
                <p className="sub h-rv">
                  Caliper times every step from click to first word, then points you to the step furthest over its limit.
                  Every tip is backed by a number it measured.
                </p>
                <div className="buttons h-btns">
                  <a className="btn primary" href="/demo">Try the demo</a>
                  <a className="btn secondary" href="/report">See a real report</a>
                </div>
              </div>
              <HeroTimeline />
            </div>
          </div>
        </section>

        <section className="problem">
          <div className="wrap narrow" data-rv>
            <p className="eyebrow mono">The problem</p>
            <h2>Users click, then stare at a blank box.</h2>
            <p className="big">
              Is it the browser, your server, the model call, or the size of the prompt? From the outside, nobody can
              tell. Caliper times every step in the browser and, with its server half, inside your server.
            </p>
          </div>
        </section>

        <section className="features">
          <div className="wrap">
            <div className="section-head" data-rv>
              <p className="eyebrow mono">What you get</p>
              <h2>One report. Four ways in.</h2>
            </div>
            <FeatureCards />
          </div>
        </section>

        <section className="how">
          <div className="wrap">
            <div className="section-head" data-rv>
              <p className="eyebrow mono">How it works</p>
              <h2>Three steps, one command.</h2>
            </div>
            <ol className="steps">
              <li data-rv>
                <span className="n mono">1</span>
                <h3>Opens and clicks</h3>
                <p>Opens your page in Chromium and clicks your AI button, or types into your chat box.</p>
              </li>
              <li data-rv>
                <span className="n mono">2</span>
                <h3>Times the wait</h3>
                <p>From the click to the first word on screen, on the page&apos;s own clock.</p>
              </li>
              <li data-rv>
                <span className="n mono">3</span>
                <h3>Shows where</h3>
                <p>Splits the wait into steps, flags any step over its limit, and writes one HTML report.</p>
              </li>
            </ol>
          </div>
        </section>

        <section className="band">
          <div className="wrap">
            <div className="section-head" data-rv>
              <p className="eyebrow mono">Use it on your own app</p>
              <h2>Start with the browser. Add the server when you want it.</h2>
            </div>
            <div className="halves">
              <div className="box" data-rv>
                <span className="tag mono">no token</span>
                <h3>Browser half</h3>
                <p>Point the CLI at any page you can open. Pages behind a login: save a session first with <code>caliper login</code>.</p>
              </div>
              <div className="box" data-rv>
                <span className="tag mono">your own token</span>
                <h3>Server half</h3>
                <p>Add <code>caliper-timings</code> to your app and set your own <code>CALIPER_TOKEN</code>. Adds the Request Map and your server&apos;s timings.</p>
              </div>
            </div>
            <div className="cmd" data-rv>
              <code>{INSTALL}</code>
              <CopyButton text={INSTALL} />
            </div>
            <p className="cmd-note">
              Needs Node.js 20 or newer. <a href={README}>Full setup in the README →</a>
            </p>
          </div>
        </section>

        <section className="nots">
          <div className="wrap narrow" data-rv>
            <p className="eyebrow mono">What it doesn&apos;t do</p>
            <ul>
              <li>It sees timings, not your code. Hints are common causes, not a diagnosis.</li>
              <li>It never records your prompt text, only sizes.</li>
              <li>It doesn&apos;t detect prompt injection.</li>
              <li>Chromium and HTTP only. Replies over a WebSocket aren&apos;t timed.</li>
            </ul>
          </div>
        </section>

        <section className="next">
          <div className="wrap">
            <div className="section-head" data-rv>
              <p className="eyebrow mono">What&apos;s next · not built yet</p>
              <h2>Where Caliper goes next.</h2>
            </div>
            <ul className="ncards">
              {NEXT.map((n) => (
                <li key={n.title} className="ncard" data-rv>
                  <span className="ntag mono">Not built yet</span>
                  <h3>{n.title}</h3>
                  <p>{n.line}</p>
                </li>
              ))}
            </ul>
            <p className="next-note" data-rv>
              <a href={GITHUB}>Star on GitHub to follow along →</a>
            </p>
          </div>
        </section>

        <section className="cta">
          <div className="wrap narrow" data-rv>
            <h2>See where your AI feature&apos;s wait goes.</h2>
            <div className="buttons center">
              <a className="btn primary" href="/demo">Try the demo</a>
              <a className="btn secondary" href="/report">See a real report</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap">
          <span className="brand">Caliper</span>
          <a href={GITHUB}>GitHub</a>
          <a href="https://www.npmjs.com/package/caliper-ai">npm caliper-ai</a>
          <a href="https://www.npmjs.com/package/caliper-timings">npm caliper-timings</a>
          <span className="mono">Measured Nov 14, 2026</span>
          <span className="fine">Not affiliated with Google or Lighthouse.</span>
        </div>
      </footer>
    </div>
  );
}
