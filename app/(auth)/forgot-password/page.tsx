"use client";

import { useState } from "react";
import Link from "next/link";

const lbl: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" };

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/forgot-password/step1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.error || "Something went wrong"); return; }
      if (d.question) {
        setQuestion(d.question);
        setStep(2);
      } else {
        // No security question set — fall back to direct email reset
        await sendDirectReset();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally { setLoading(false); }
  }

  async function sendDirectReset() {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const d = await res.json();
    if (res.ok && d.emailDelivered !== false) {
      setStep(3);
    } else {
      setError(d.emailError || d.error || "Email delivery failed");
    }
  }

  async function handleStep2(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/forgot-password/step2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, answer }),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.error || "Incorrect answer"); return; }
      if (d.emailDelivered === false) {
        setError(`Email delivery failed: ${d.emailError || "SMTP error"}. Contact support.`);
        return;
      }
      setStep(3);
    } catch {
      setError("Network error. Please try again.");
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-nexus-950)", padding: 24 }}>
      <div className="nexus-grid" style={{ position: "fixed", inset: 0 }} />
      <div className="glass-card animate-fade-slide-up" style={{ maxWidth: 420, width: "100%", padding: "44px 40px", position: "relative", zIndex: 1 }}>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <img src="/logo-dark-bg.png" alt="Bank of Asia Online" style={{ width: 180, height: "auto" }} />
        </div>

        {step === 3 ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(0,229,160,0.1)", border: "2px solid rgba(0,229,160,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 20px" }}>
              ✉️
            </div>
            <h2 style={{ fontFamily: "var(--font-syne)", fontSize: 22, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 10 }}>
              Check your email
            </h2>
            <p style={{ color: "var(--color-text-muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
              A password reset link has been sent to <strong style={{ color: "var(--color-text-primary)" }}>{email}</strong>. The link expires in 30 minutes.
            </p>
            <Link href="/login" className="btn-ghost" style={{ textDecoration: "none", display: "block", textAlign: "center" }}>
              ← Back to Login
            </Link>
          </div>
        ) : step === 1 ? (
          <>
            <h2 style={{ fontFamily: "var(--font-syne)", fontSize: 24, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 8, textAlign: "center" }}>
              Forgot Password
            </h2>
            <p style={{ color: "var(--color-text-muted)", fontSize: 14, textAlign: "center", marginBottom: 28 }}>
              Enter your email to begin the reset process
            </p>
            <form onSubmit={handleStep1} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={lbl}>Email Address</label>
                <input type="email" className="input-nexus" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
              </div>
              {error && <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(255,59,92,0.08)", border: "1px solid rgba(255,59,92,0.25)", color: "var(--color-danger)", fontSize: 13 }}>{error}</div>}
              <button type="submit" className="btn-nexus" disabled={loading} style={{ width: "100%", padding: "13px" }}>
                {loading ? "Checking…" : "Continue →"}
              </button>
            </form>
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <Link href="/login" style={{ color: "var(--color-text-muted)", fontSize: 14, textDecoration: "none" }}>← Back to Login</Link>
            </div>
          </>
        ) : (
          <>
            <h2 style={{ fontFamily: "var(--font-syne)", fontSize: 22, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 8, textAlign: "center" }}>
              Security Verification
            </h2>
            <p style={{ color: "var(--color-text-muted)", fontSize: 14, textAlign: "center", marginBottom: 24 }}>
              Answer your security question to continue
            </p>
            <div style={{ padding: "14px 16px", borderRadius: 10, background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.15)", marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-accent)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Security Question</div>
              <div style={{ fontSize: 14, color: "var(--color-text-primary)", lineHeight: 1.5 }}>{question}</div>
            </div>
            <form onSubmit={handleStep2} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={lbl}>Your Answer</label>
                <input type="text" className="input-nexus" placeholder="Your answer (case-insensitive)" value={answer} onChange={(e) => setAnswer(e.target.value)} required autoFocus minLength={3} />
              </div>
              {error && <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(255,59,92,0.08)", border: "1px solid rgba(255,59,92,0.25)", color: "var(--color-danger)", fontSize: 13 }}>{error}</div>}
              <button type="submit" className="btn-nexus" disabled={loading} style={{ width: "100%", padding: "13px" }}>
                {loading ? "Verifying…" : "Verify & Send Reset Link →"}
              </button>
            </form>
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button onClick={() => { setStep(1); setError(""); setAnswer(""); }} style={{ background: "none", border: "none", color: "var(--color-text-muted)", fontSize: 14, cursor: "pointer" }}>← Back</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
