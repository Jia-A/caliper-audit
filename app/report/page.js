// /report: the real Quill report, as Caliper wrote it, inside the site's frame. The file itself
// (public/report/quill.html) is served unchanged at /report/quill.html, the backend host aside.
// On phones a designed summary of it comes first, and the file is one tap away.
import "./report.css";
import SiteHeader from "../site-header.js";
import ReportSummary from "./report-summary.js";
import ReportView from "./report-view.js";

const FILE = "/report/quill.html";
const FILE_NOTE = "This is the exact HTML file Caliper writes — unchanged, except that Quill's backend address is masked.";

export default function ReportPage() {
  return (
    <>
      <SiteHeader current="report" />
      <main className="rp">
        <div className="rp-head">
          <p className="rp-eyebrow">A real report</p>
          <h1>Quill&apos;s &ldquo;generate a social post&rdquo; button</h1>
          {/* Wide screens show the file right below, so the claim sits here. Phones show the summary
              first, so the claim moves to just above the file (report-view.js). */}
          <p className="rp-note rp-note-wide">{FILE_NOTE}</p>
          <p className="rp-note rp-note-phone">A summary of a real Caliper report, then the exact file it wrote.</p>
          <p className="rp-meta">
            <span>Nov 14, 2026</span>
            <span>caliper-ai 0.6.0</span>
            <code>--runs 2 --server-runs 1 --stop</code>
            <a href={FILE}>Open the file on its own →</a>
          </p>
        </div>
        <ReportSummary />
        <ReportView src={FILE} title="Caliper report of Quill, Nov 14, 2026" note={FILE_NOTE} />
      </main>
    </>
  );
}
