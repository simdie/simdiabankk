"use client";
import { useState } from "react";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "4px 10px", borderRadius: 7,
        fontSize: 11, fontWeight: 600, cursor: "pointer",
        background: copied ? "rgba(0,229,160,0.1)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${copied ? "rgba(0,229,160,0.25)" : "rgba(255,255,255,0.08)"}`,
        color: copied ? "var(--color-success)" : "var(--color-text-muted)",
        transition: "all 0.2s ease",
      }}
    >
      {copied ? "✓ Copied" : `📋 ${label}`}
    </button>
  );
}
