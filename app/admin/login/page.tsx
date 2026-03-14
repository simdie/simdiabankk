"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

function AdminLoginInner() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email, password, redirect: false,
      ipAddress: "",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    });
    setLoading(false);
    if (!res) { setError("Something went wrong."); return; }
    if (res.error) {
      if (res.error.includes("ACCOUNT_BLOCKED::")) {
        setError(res.error.replace("ACCOUNT_BLOCKED::", ""));
      } else {
        setError("Invalid credentials or insufficient permissions.");
      }
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-nexus-950)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      {/* Background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,212,255,0.06) 0%, transparent 60%)" }} />
        <div className="nexus-grid" />
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420, padding: "0 24px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(0,212,255,0.08)", border: "1.5px solid rgba(0,212,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
              <path d="M24 3 L42 10 L42 26 C42 35 34 43 24 46 C14 43 6 35 6 26 L6 10 Z"
                fill="rgba(6,12,24,0.9)" stroke="#00D4FF" strokeWidth="1.5" strokeOpacity="0.8"/>
              <text x="24" y="30" fontFamily="Arial" fontWeight="700" fontSize="11"
                fill="#00D4FF" textAnchor="middle" letterSpacing="1">BOA</text>
            </svg>
          </div>
          <div style={{ fontFamily: "var(--font-syne)", fontSize: 16, fontWeight: 800, color: "var(--color-accent)", letterSpacing: "0.1em", marginTop: 12 }}>BANK OF ASIA ONLINE</div>
          <div style={{ fontFamily: "var(--font-syne)", fontSize: 13, fontWeight: 700, letterSpacing: "0.15em", color: "var(--color-text-muted)", textTransform: "uppercase", marginTop: 4 }}>Admin Portal</div>
        </div>

        <div className="glass-card" style={{ padding: "36px 32px" }}>
          <h2 style={{ fontFamily: "var(--font-syne)", fontSize: 20, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 6 }}>Administrator Sign In</h2>
          <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginBottom: 28 }}>Restricted access — authorized personnel only</p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--color-text-muted)", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Email or Account Number
              </label>
              <input
                type="text"
                className="input-nexus"
                placeholder="admin@bankofasia.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--color-text-muted)", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-nexus"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", padding: 2, display: "flex", alignItems: "center" }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && (
              <div style={{ padding: "12px 16px", borderRadius: 10, background: "var(--color-danger-glow)", border: "1px solid rgba(255,59,92,0.25)", color: "var(--color-danger)", fontSize: 13, fontWeight: 500 }}>
                {error}
              </div>
            )}
            <button type="submit" className="btn-nexus" disabled={loading} style={{ width: "100%", padding: "13px", fontSize: 15, marginTop: 4 }}>
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" style={{ animation: "spin 0.8s linear infinite" }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="32" strokeDashoffset="12" strokeLinecap="round" />
                  </svg>
                  Signing in…
                </span>
              ) : "Sign In →"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "var(--color-text-muted)" }}>
          Bank of Asia Online · Secure Admin Access
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div style={{ background: "#03050a", minHeight: "100vh" }} />}>
      <AdminLoginInner />
    </Suspense>
  );
}
