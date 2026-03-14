"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div style={{ minHeight: "100vh", background: "#03050a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)", padding: "40px 24px" }}>
      <div style={{ textAlign: "center", maxWidth: 500 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,59,92,0.1)", border: "2px solid rgba(255,59,92,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 24px" }}>⚠</div>
        <div style={{ fontSize: 11, color: "#ff3b5c", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}>SYSTEM ERROR</div>
        <h1 style={{ fontFamily: "var(--font-syne, Syne, sans-serif)", fontSize: 26, fontWeight: 700, color: "#f0f4ff", margin: "0 0 12px" }}>Something went wrong</h1>
        <p style={{ color: "#8899b5", fontSize: 15, lineHeight: 1.7, margin: "0 0 8px" }}>An unexpected error occurred. Our team has been notified.</p>
        {error.digest && (
          <p style={{ fontFamily: "var(--font-jetbrains-mono, monospace)", fontSize: 11, color: "#4d6080", margin: "0 0 32px" }}>Error ID: {error.digest}</p>
        )}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={reset} style={{ padding: "12px 28px", borderRadius: 12, background: "linear-gradient(135deg,#ff3b5c,#cc2240)", color: "#fff", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer" }}>
            Try Again
          </button>
          <Link href="/dashboard" style={{ padding: "12px 28px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", color: "#8899b5", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
