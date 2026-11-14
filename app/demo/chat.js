"use client";
// A small chat: the question goes to /api/chat with the last few messages, and the reply streams
// into #reply. Caliper measures it with --input "#prompt" --prompt "…" --output "#reply", so only
// the reply is ever written into #reply.
// Each answer appears once: in #reply while it's the latest, then in the list above once the next
// question is sent.
import { useState } from "react";

const MAX_CHARS = 500;
const MAX_MESSAGES = 6;

export default function Chat() {
  const [history, setHistory] = useState([]); // completed messages, sent back each time
  const [current, setCurrent] = useState(null); // the latest question, shown above #reply
  const [shownBelow, setShownBelow] = useState(0); // history's last messages that are the latest Q and A
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const [notice, setNotice] = useState(null); // { kind: "busy" | "error", text }
  const [busy, setBusy] = useState(false);

  async function send(event) {
    event.preventDefault();
    const question = prompt.trim();
    if (!question || busy) return;
    const messages = [...history, { role: "user", content: question }].slice(-MAX_MESSAGES);
    setBusy(true);
    setNotice(null);
    setShownBelow(0);
    setCurrent(question);
    setReply("");
    setPrompt("");
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ messages }) });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setNotice({ kind: body?.busy ? "busy" : "error", text: body?.error ?? "Something went wrong." });
        setCurrent(null);
        setPrompt(question); // keep the question, so trying again is one click
        return;
      }
      let text = "";
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        text += value;
        setReply(text);
      }
      setHistory([...messages, { role: "assistant", content: text }].slice(-(MAX_MESSAGES - 1)));
      setShownBelow(2);
    } catch {
      setNotice({ kind: "error", text: "The connection dropped. Try again." });
    } finally {
      setBusy(false);
    }
  }

  const earlier = shownBelow ? history.slice(0, -shownBelow) : history;

  return (
    <div className="chat">
      {earlier.length > 0 && (
        <ol className="turns" aria-label="Earlier messages">
          {earlier.map((m, i) => (
            <li key={i} className={m.role}>
              <span className="who">{m.role === "user" ? "You" : "Demo"}</span>
              <p>{m.content}</p>
            </li>
          ))}
        </ol>
      )}

      {current && (
        <div className="turn-now user">
          <span className="who">You</span>
          <p>{current}</p>
        </div>
      )}
      <div className="turn-now assistant">
        <span className="who">
          Demo{busy && !reply && <span className="waiting"> · waiting for the first word…</span>}
        </span>
        <div id="reply" aria-live="polite">{reply}</div>
      </div>

      {notice && (
        <p className={`notice ${notice.kind}`} role={notice.kind === "busy" ? "status" : "alert"}>
          {notice.text}
        </p>
      )}

      <form onSubmit={send} className="ask">
        <input
          id="prompt"
          value={prompt}
          maxLength={MAX_CHARS}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask about Caliper"
          aria-label="Your question"
          autoComplete="off"
        />
        <button type="submit" disabled={busy}>Send</button>
      </form>
      <p className="fine">Replies are short, and there&apos;s a small limit per visitor. The demo runs on a free model tier — don&apos;t type anything private.</p>
    </div>
  );
}
