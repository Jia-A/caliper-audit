"use client";
// The landing page's only client code: copies the install command.
import { useState } from "react";

export default function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked: the command stays selectable
    }
  }

  return (
    <button type="button" className="copy" onClick={copy} aria-label="Copy the install command">
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
