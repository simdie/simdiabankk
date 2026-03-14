"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const d = await res.json();
      if (res.ok) {
        if (d.emailDelivered === false) {
          setError(`Email delivery failed: ${d.emailError || "SMTP error"}. Please check server email configuration or contact support.`);
        } else {
          setSent(true);
        }
      } else {
        setError(d.error || "Something went wrong");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-nexus-950)", padding: 24 }}>
      <div className="nexus-grid" style={{ position: "fixed", inset: 0 }} />
      <div className="glass-card animate-fade-slide-up" style={{ maxWidth: 420, width: "100%", padding: "44px 40px", position: "relative", zIndex: 1 }}>

        {/* Logo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32 }}>
          <svg width="56" height="56" viewBox="0 0 80 80" fill="none" style={{ marginBottom: 12 }}>
            <circle cx="40" cy="40" r="38" fill="rgba(0,212,255,0.06)" stroke="rgba(0,212,255,0.15)" strokeWidth="1"/>
            <path d="M40 8L10 20V38C10 53.6 23.6 67.8 40 72C56.4 67.8 70 53.6 70 38V20L40 8Z" fill="rgba(0,212,255,0.15)" stroke="rgba(0,212,255,0.5)" strokeWidth="1.5"/>
            <path d="M27 40L35 48L53 30" stroke="#00D4FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div style={{ fontFamily: "var(--font-syne)", fontSize: 16, fontWeight: 800, color: "var(--color-accent)", letterSpacing: "0.1em" }}>BANK OF ASIA ONLINE</div>
        </div>

        {sent ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(0,229,160,0.1)", border: "2px solid rgba(0,229,160,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 20px" }}>
              ✉️
            </div>
            <h2 style={{ fontFamily: "var(--font-syne)", fontSize: 22, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 10 }}>
              Check your email
            </h2>
            <p style={{ color: "var(--color-text-muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
              A password reset link has been sent to <strong style={{ color: "var(--color-text-primary)" }}>{email}</strong>. Check your inbox.
            </p>
            <Link href="/login" className="btn-ghost" style={{ textDecoration: "none", display: "block", textAlign: "center" }}>
              ← Back to Login
            </Link>
          </div>
        ) : (
          <>
            <h2 style={{ fontFamily: "var(--font-syne)", fontSize: 24, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 8, textAlign: "center" }}>
              Forgot Password
            </h2>
            <p style={{ color: "var(--color-text-muted)", fontSize: 14, textAlign: "center", marginBottom: 28 }}>
              Enter your email and we'll send you a reset link
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--color-text-muted)", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  className="input-nexus"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              {error && (
                <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(255,59,92,0.08)", border: "1px solid rgba(255,59,92,0.25)", color: "var(--color-danger)", fontSize: 13 }}>
                  {error}
                </div>
              )}

              <button type="submit" className="btn-nexus" disabled={loading} style={{ width: "100%", padding: "13px" }}>
                {loading ? "Sending..." : "Send Reset Link →"}
              </button>
            </form>

            <div style={{ textAlign: "center", marginTop: 20 }}>
              <Link href="/login" style={{ color: "var(--color-text-muted)", fontSize: 14, textDecoration: "none" }}>
                ← Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
