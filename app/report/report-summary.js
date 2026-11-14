// /report on a phone: a designed summary of the real Quill report first, every number from
// app/quill-data.js (and so from the report), then the unchanged file behind "Show the full
// report" (report-view.js). Wider screens see only the file, as before.
import { ADVICE, SERVER_TOP, VERDICT, VERDICT_SIDES, WARM } from "../quill-data.js";

export default function ReportSummary() {
  return (
    <section className="rs" aria-labelledby="rs-h">
      <p className="rs-eyebrow" id="rs-h">Summary of the real report</p>

      <div className="rs-card">
        <p className="rs-total mono">{WARM.total} ms</p>
        <p className="rs-cap">click → first word, the one warm run</p>
        <div className="rs-bar" aria-hidden="true">
          {WARM.segs.map((s) => (
            <span key={s.name} className={`rs-seg ${s.ms > s.limit ? "over" : "ok"}`} style={{ flexGrow: s.ms }}>
              {s.ms > s.limit && <b>OVER</b>}
            </span>
          ))}
        </div>
        <ul className="rs-key">
          {WARM.segs.map((s) => (
            <li key={s.name} className={s.ms > s.limit ? "over" : "ok"}>
              <span className="sw" />
              <span>{s.name}</span>
              <span className="mono">{s.ms} ms {s.ms > s.limit ? <b>over</b> : "within"} its {s.limit} ms limit</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rs-verdict">
        <p className="rs-h">Verdict</p>
        <p className="rs-head">{VERDICT}</p>
        <ul>{VERDICT_SIDES.map((l) => <li key={l}>{l}</li>)}</ul>
      </div>

      <div className="rs-advice">
        <p className="rs-h">Advice · {ADVICE.length} things to look at</p>
        <ul>
          {ADVICE.map((a) => (
            <li key={a.line}>
              <p><b>{a.line}</b></p>
              <details><summary>why</summary><p>{a.why}</p></details>
            </li>
          ))}
        </ul>
      </div>

      <div className="rs-server">
        <p className="rs-h">Inside the server</p>
        <p className="rs-big mono">{SERVER_TOP.name} {SERVER_TOP.ms} ms</p>
        <p><b>{SERVER_TOP.ratio} its {SERVER_TOP.limit} ms limit</b>, in 1 of 1 marked visits; {SERVER_TOP.share}% of the time to the server&apos;s first bytes sent.</p>
      </div>
    </section>
  );
}
