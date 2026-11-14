// /demo: a small streaming chat about Caliper, built to be measured by Caliper (see the README for
// the audit command). The chat itself is in chat.js.
import "./demo.css";
import SiteHeader from "../site-header.js";
import Chat from "./chat.js";

export default function DemoPage() {
  return (
    <>
      <SiteHeader current="demo" />
      <main className="dm">
        <p className="dm-eyebrow">Demo</p>
        <h1>Ask about Caliper</h1>
        <p className="dm-sub">
          A small streaming chat, built to be measured. Point Caliper at this page and it times the wait from Send to
          the first word.
        </p>
        <Chat />
      </main>
    </>
  );
}
