"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

function ResetInner() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const d = await res.json();
      if (res.ok) {
        setDone(true);
      } else {
        setError(d.error || "Failed to reset password");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
        <h2 style={{ fontFamily: "var(--font-syne)", fontSize: 22, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 10 }}>Invalid Link</h2>
        <p style={{ color: "var(--color-text-muted)", fontSize: 14, marginBottom: 24 }}>This password reset link is invalid or has expired.</p>
        <Link href="/forgot-password" className="btn-nexus" style={{ textDecoration: "none" }}>Request New Link</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(0,229,160,0.1)", border: "2px solid rgba(0,229,160,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 20px" }}>✓</div>
        <h2 style={{ fontFamily: "var(--font-syne)", fontSize: 22, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 10 }}>Password Reset!</h2>
        <p style={{ color: "var(--color-text-muted)", fontSize: 14, marginBottom: 24 }}>Your password has been updated successfully. You can now sign in.</p>
        <Link href="/login" className="btn-nexus" style={{ textDecoration: "none" }}>Sign In →</Link>
      </div>
    );
  }

  return (
    <>
      <h2 style={{ fontFamily: "var(--font-syne)", fontSize: 24, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 8, textAlign: "center" }}>
        Reset Password
      </h2>
      <p style={{ color: "var(--color-text-muted)", fontSize: 14, textAlign: "center", marginBottom: 28 }}>
        Enter your new password below
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--color-text-muted)", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            New Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPw ? "text" : "password"}
              className="input-nexus"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ paddingRight: 44 }}
            />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", padding: 2, display: "flex", alignItems: "center" }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--color-text-muted)", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Confirm Password
          </label>
          <input
            type="password"
            className="input-nexus"
            placeholder="Repeat password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>

        {error && (
          <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(255,59,92,0.08)", border: "1px solid rgba(255,59,92,0.25)", color: "var(--color-danger)", fontSize: 13 }}>
            {error}
          </div>
        )}

        <button type="submit" className="btn-nexus" disabled={loading} style={{ width: "100%", padding: "13px" }}>
          {loading ? "Resetting..." : "Set New Password →"}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-nexus-950)", padding: 24 }}>
      <div className="nexus-grid" style={{ position: "fixed", inset: 0 }} />
      <div className="glass-card animate-fade-slide-up" style={{ maxWidth: 420, width: "100%", padding: "44px 40px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <svg width="56" height="56" viewBox="0 0 80 80" fill="none" style={{ marginBottom: 12 }}>
            <circle cx="40" cy="40" r="38" fill="rgba(0,212,255,0.06)" stroke="rgba(0,212,255,0.15)" strokeWidth="1"/>
            <path d="M40 8L10 20V38C10 53.6 23.6 67.8 40 72C56.4 67.8 70 53.6 70 38V20L40 8Z" fill="rgba(0,212,255,0.15)" stroke="rgba(0,212,255,0.5)" strokeWidth="1.5"/>
            <path d="M27 40L35 48L53 30" stroke="#00D4FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div style={{ fontFamily: "var(--font-syne)", fontSize: 16, fontWeight: 800, color: "var(--color-accent)", letterSpacing: "0.1em" }}>BANK OF ASIA ONLINE</div>
        </div>
        <Suspense fallback={<div style={{ textAlign: "center", color: "var(--color-text-muted)" }}>Loading…</div>}>
          <ResetInner />
        </Suspense>
      </div>
    </div>
  );
}
