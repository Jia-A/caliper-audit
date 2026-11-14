// /report: the real Quill report, as Caliper wrote it, inside the site's frame. The file itself
// (public/report/quill.html) is served unchanged at /report/quill.html, the backend host aside.
import "./report.css";
import SiteHeader from "../site-header.js";
import ReportFrame from "./report-frame.js";

const FILE = "/report/quill.html";

export default function ReportPage() {
  return (
    <>
      <SiteHeader current="report" />
      <main className="rp">
        <div className="rp-head">
          <p className="rp-eyebrow">A real report</p>
          <h1>Quill&apos;s &ldquo;generate a social post&rdquo; button</h1>
          <p className="rp-note">
            This is the exact HTML file Caliper writes — unchanged, except that Quill&apos;s backend address is masked.
          </p>
          <p className="rp-meta">
            <span>Nov 14, 2026</span>
            <span>caliper-ai 0.6.0</span>
            <code>--runs 2 --server-runs 1 --stop</code>
            <a href={FILE}>Open the file on its own →</a>
          </p>
        </div>
        <div className="rp-frame">
          <ReportFrame src={FILE} title="Caliper report of Quill, Nov 14, 2026" />
        </div>
      </main>
    </>
  );
}
