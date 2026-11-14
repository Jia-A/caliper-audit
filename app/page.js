// The landing page. It sells; the README teaches. Every claim here is from the caliper-ai and
// caliper-timings READMEs (github.com/Jia-A/caliper); change them there first, then here.
// Colours are the report's light palette, with its "OVER" rust as the only accent.
import CopyButton from "./copy-button.js";

const INSTALL = "npm i -g caliper-ai && npx playwright@1.64.1 install chromium";
const README = "https://github.com/Jia-A/caliper/tree/main/packages/cli#readme";
const GITHUB = "https://github.com/Jia-A/caliper";

const cards = [
  { title: "Request Map", src: "/shots/request-map.png", w: 1624, h: 1517, line: "What's inside each AI request, in bytes, and who wrote each part." },
  { title: "Advice", src: "/shots/advice.png", w: 1576, h: 352, line: "Next steps, only from numbers the run measured." },
  { title: "Timeline", src: "/shots/timeline.png", w: 1576, h: 1026, line: "Every run, from click to first word, split into steps." },
  { title: "Checks", src: "/shots/checks.png", w: 1640, h: 1076, line: "Optional: does Stop cancel the request or only hide the text? Does a second click pay twice?" },
];

const css = `
.lp { --page: #f9f9f7; --surface: #fcfcfb; --ink: #0b0b0b; --muted: #5e5d59; --border: rgba(11,11,11,0.12); --accent: #b93a0b;
  --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; background: var(--page); color: var(--ink); }
.lp a { color: var(--accent); }
.lp .wrap { max-width: 760px; margin: 0 auto; padding: 0 16px; }
.lp header { border-bottom: 1px solid var(--border); }
.lp header .wrap { display: flex; justify-content: space-between; align-items: center; height: 56px; }
.lp .brand { font-weight: 700; font-size: 18px; color: var(--ink); text-decoration: none; }
.lp header nav a { color: var(--ink); text-decoration: none; font-size: 15px; }
.lp header nav a:hover { text-decoration: underline; }
.lp section { padding: 56px 0; border-bottom: 1px solid var(--border); }
.lp .hero { padding-top: 64px; }
.lp h1 { font-size: 40px; line-height: 1.15; margin: 0 0 12px; letter-spacing: -0.01em; }
.lp h2 { font-size: 24px; margin: 0 0 20px; }
.lp h3 { font-size: 17px; margin: 0 0 6px; }
.lp p { margin: 0; line-height: 1.55; }
.lp .lead { font-size: 19px; color: var(--muted); max-width: 40em; }
.lp .buttons { display: flex; flex-wrap: wrap; gap: 12px; margin: 28px 0; }
.lp .btn { display: inline-block; padding: 10px 18px; border-radius: 6px; font-weight: 600; font-size: 15px; text-decoration: none; border: 1px solid var(--accent); }
.lp .btn.primary { background: var(--accent); color: #fff; }
.lp .btn.secondary { background: var(--surface); color: var(--accent); }
.lp .btn:hover { text-decoration: underline; }
.lp .cmd { display: flex; align-items: center; gap: 8px; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 6px 6px 6px 14px; }
.lp .cmd code { flex: 1; min-width: 0; overflow-x: auto; white-space: nowrap; font-family: var(--mono); font-size: 14px; padding: 6px 0; }
.lp .copy { flex: none; font: 600 13px system-ui, sans-serif; padding: 6px 12px; border: 1px solid var(--border); border-radius: 4px; background: var(--page); color: var(--ink); cursor: pointer; }
.lp .copy:hover { border-color: var(--ink); }
.lp .note { margin-top: 8px; font-size: 14px; color: var(--muted); }
.lp .shot { display: block; border: 1px solid var(--border); border-radius: 6px; overflow: hidden; background: var(--surface); }
.lp .shot img { display: block; width: 100%; height: auto; }
.lp .caption { margin-top: 10px; font-size: 14px; color: var(--muted); }
.lp .cards { display: grid; gap: 20px; }
.lp .card { border: 1px solid var(--border); border-radius: 6px; background: var(--surface); overflow: hidden; }
.lp .card .shot { border: 0; border-bottom: 1px solid var(--border); border-radius: 0; max-height: 300px; }
.lp .card .shot img { object-fit: cover; object-position: top left; max-height: 300px; }
.lp .card .body { padding: 14px 16px 16px; }
.lp .card p { color: var(--muted); }
.lp ol.steps { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; }
.lp ol.steps li { display: grid; grid-template-columns: 32px 1fr; align-items: baseline; line-height: 1.55; }
.lp ol.steps .n { font-family: var(--mono); font-weight: 700; color: var(--accent); }
.lp .halves { display: grid; gap: 16px; grid-template-columns: 1fr 1fr; margin-bottom: 20px; }
.lp .box { border: 1px solid var(--border); border-radius: 6px; background: var(--surface); padding: 18px; }
.lp .tag { display: inline-block; font-family: var(--mono); font-size: 12px; color: var(--muted); border: 1px solid var(--border); border-radius: 4px; padding: 1px 6px; margin-bottom: 10px; }
.lp .box p + p { margin-top: 8px; }
.lp .box p { color: var(--muted); }
.lp code.inline { font-family: var(--mono); font-size: 0.9em; }
.lp .more { font-weight: 600; text-decoration: none; }
.lp .more:hover { text-decoration: underline; }
.lp ul.nots { margin: 0; padding-left: 20px; display: grid; gap: 8px; line-height: 1.55; }
.lp footer { padding: 28px 0 40px; font-size: 14px; color: var(--muted); }
.lp footer .wrap { display: flex; flex-wrap: wrap; gap: 8px 20px; }
.lp footer a { color: var(--ink); }
.lp .mono { font-family: var(--mono); }
@media (max-width: 600px) {
  .lp h1 { font-size: 30px; }
  .lp .lead { font-size: 17px; }
  .lp section { padding: 40px 0; }
  .lp .hero { padding-top: 40px; }
  .lp .halves { grid-template-columns: 1fr; }
  .lp .card .shot, .lp .card .shot img { max-height: 200px; }
}
`;

export default function Landing() {
  return (
    <div className="lp">
      <style>{css}</style>
      <header>
        <div className="wrap">
          <a className="brand" href="/">Caliper</a>
          <nav><a href={GITHUB}>GitHub</a></nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="wrap">
            <h1>Where does your AI feature&apos;s wait go?</h1>
            <p className="lead">Opens your app in a real browser, clicks the AI button, and times every step.</p>
            <div className="buttons">
              <a className="btn primary" href="/demo">Try the demo</a>
              <a className="btn secondary" href="/report/quill.html">See a real report</a>
            </div>
            <div className="cmd">
              <code>{INSTALL}</code>
              <CopyButton text={INSTALL} />
            </div>
            <p className="note">Needs Node.js 20 or newer.</p>
          </div>
        </section>

        <section>
          <div className="wrap">
            <a className="shot" href="/report/quill.html">
              <img src="/shots/report-top.png" width={1640} height={831} alt="The top of a Caliper report: the verdict, people waited 1514 ms for the first word, and two Advice items" />
            </a>
            <p className="caption">
              A real report: Quill&apos;s &ldquo;generate a social post&rdquo; button, Nov 14, 2026. The backend address is masked.
            </p>
          </div>
        </section>

        <section>
          <div className="wrap cards">
            {cards.map((c) => (
              <div className="card" key={c.title}>
                <a className="shot" href={c.src}>
                  <img src={c.src} width={c.w} height={c.h} alt={`${c.title}, from the Quill report`} loading="lazy" />
                </a>
                <div className="body">
                  <h3>{c.title}</h3>
                  <p>{c.line}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="wrap">
            <h2>How it works</h2>
            <ol className="steps">
              <li><span className="n">1</span><span>Caliper opens your page in Chromium and clicks your AI button, or types into your chat box.</span></li>
              <li><span className="n">2</span><span>It times the wait from the click to the first word on screen.</span></li>
              <li><span className="n">3</span><span>It splits that wait into steps, flags any step over its limit, and writes one HTML report.</span></li>
            </ol>
          </div>
        </section>

        <section>
          <div className="wrap">
            <h2>Use it on your own app</h2>
            <div className="halves">
              <div className="box">
                <span className="tag">no token</span>
                <h3>Browser half</h3>
                <p>Install the CLI and point it at any page you can open.</p>
                <p>Pages behind a login: save a session first with <code className="inline">caliper login</code>.</p>
              </div>
              <div className="box">
                <span className="tag">your own token</span>
                <h3>Server half</h3>
                <p>Add <code className="inline">caliper-timings</code> to your app and set your own <code className="inline">CALIPER_TOKEN</code>.</p>
                <p>Adds the Request Map and your server&apos;s timings: database, model call, any step you mark.</p>
              </div>
            </div>
            <a className="more" href={README}>Full setup in the README →</a>
          </div>
        </section>

        <section>
          <div className="wrap">
            <h2>What it doesn&apos;t do</h2>
            <ul className="nots">
              <li>It sees timings, not your code. Hints are common causes, not a diagnosis.</li>
              <li>It never records your prompt text, only sizes.</li>
              <li>It doesn&apos;t detect prompt injection.</li>
              <li>Chromium and HTTP only. Replies over a WebSocket aren&apos;t timed.</li>
            </ul>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <a href={GITHUB}>GitHub</a>
          <a href="https://www.npmjs.com/package/caliper-ai">npm caliper-ai</a>
          <a href="https://www.npmjs.com/package/caliper-timings">npm caliper-timings</a>
          <span className="mono">Measured Nov 14, 2026</span>
        </div>
      </footer>
    </div>
  );
}
