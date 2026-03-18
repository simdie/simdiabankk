"use client";

import { useState, useRef, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

type Step = "credentials" | "2fa" | "blocked";

interface OTPInputProps {
  onComplete: (code: string) => void;
  loading: boolean;
}

function OTPInput({ onComplete, loading }: OTPInputProps) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...digits];
    next[i] = val.slice(-1);
    setDigits(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
    if (next.every((d) => d !== "")) onComplete(next.join(""));
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (paste.length === 6) { setDigits(paste.split("")); onComplete(paste); }
  };

  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center" }} onPaste={handlePaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { inputs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          disabled={loading}
          style={{
            width: 46, height: 54, textAlign: "center", fontSize: 20, fontWeight: 700,
            borderRadius: 12, outline: "none", transition: "all 0.2s",
            background: "rgba(6,12,24,0.9)",
            border: d ? "1.5px solid #00D4FF" : "1.5px solid rgba(255,255,255,0.1)",
            color: "#f0f4ff",
            boxShadow: d ? "0 0 12px rgba(0,212,255,0.25)" : "none",
            fontFamily: "var(--font-jetbrains-mono)",
          }}
        />
      ))}
    </div>
  );
}

const BOAShield = ({ size = 56 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <defs>
      <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.9"/>
        <stop offset="100%" stopColor="#0066AA" stopOpacity="0.8"/>
      </linearGradient>
    </defs>
    <circle cx="40" cy="40" r="38" fill="rgba(0,212,255,0.06)" stroke="rgba(0,212,255,0.15)" strokeWidth="1"/>
    <path d="M40 8L10 20V38C10 53.6 23.6 67.8 40 72C56.4 67.8 70 53.6 70 38V20L40 8Z" fill="url(#sg)" fillOpacity="0.15" stroke="url(#sg)" strokeWidth="1.5"/>
    <path d="M27 40L35 48L53 30" stroke="#00D4FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ background: "#03050a", minHeight: "100vh" }} />}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/dashboard";

  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [blockedMessage, setBlockedMessage] = useState("");

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");

    // Pre-check: detect 2FA requirement without going through NextAuth error wrapping
    try {
      const pre = await fetch("/api/auth/pre-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const preData = await pre.json();

      if (pre.status === 401) {
        setLoading(false);
        setError("Invalid credentials. Please check your email/account number and password.");
        return;
      }

      if (pre.ok && preData.requires2fa) {
        setLoading(false);
        setStep("2fa");
        return;
      }
      // pre.ok && !requires2fa → no 2FA, proceed to signIn
      // pre.ok && blocked → fall through to signIn for proper blocked message
    } catch {
      // Network error — fall through to signIn
    }

    const res = await signIn("credentials", {
      email, password, redirect: false,
      ipAddress: "",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    });
    setLoading(false);
    if (!res) { setError("Something went wrong."); return; }
    if (res.error) {
      if (res.error.includes("ACCOUNT_BLOCKED::")) { setBlockedMessage(res.error.replace("ACCOUNT_BLOCKED::", "")); setStep("blocked"); }
      else setError("Invalid credentials. Please check your email/account number and password.");
      return;
    }
    router.push(callbackUrl); router.refresh();
  }

  async function handle2FA(code: string) {
    setLoading(true); setError("");
    const res = await signIn("credentials", {
      email, password, totpCode: code, redirect: false,
      ipAddress: "", userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    });
    setLoading(false);
    if (res?.ok) { router.push(callbackUrl); router.refresh(); }
    else setError("Invalid authenticator code. Please try again.");
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-nexus-950)" }}>
      {/* Background effects */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 80% 60% at 20% 40%, rgba(0,212,255,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 20%, rgba(120,40,200,0.08) 0%, transparent 60%)",
        }} />
        <div className="nexus-grid" />
      </div>

      {/* ═══ DESKTOP LAYOUT ═══ */}
      <div className="hidden lg:flex" style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
        {/* Left panel */}
        <div style={{ width: "58%", padding: "48px 56px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div className="text-gradient" style={{ fontFamily: "var(--font-dm-sans)", fontSize: 28, fontWeight: 700, letterSpacing: "0.04em" }}>BANK OF ASIA ONLINE</div>
          </div>
          <div style={{ maxWidth: 520 }}>
            <h1 style={{ fontFamily: "var(--font-dm-sans)", fontSize: 48, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.02em", color: "var(--color-text-primary)", marginBottom: 20 }}>
              The Future of <span className="text-gradient">Banking</span><br/>Starts Here.
            </h1>
            <p style={{ fontSize: 17, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
              Manage your wealth across borders with military-grade security, instant transfers, and complete transparency.
            </p>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {[
              { icon: "🛡", title: "Bank-Grade Security", desc: "256-bit AES encryption", glow: "rgba(0,229,160,0.15)", border: "rgba(0,229,160,0.2)" },
              { icon: "⚡", title: "Instant Transfers", desc: "Real-time across 10 currencies", glow: "rgba(0,212,255,0.15)", border: "rgba(0,212,255,0.2)" },
              { icon: "🌍", title: "Global Reach", desc: "SWIFT & SEPA wire support", glow: "rgba(240,180,41,0.12)", border: "rgba(240,180,41,0.2)" },
            ].map(card => (
              <div key={card.title} className="glass-card" style={{ flex: 1, padding: "18px 16px", background: card.glow, borderColor: card.border }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{card.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: "var(--color-text-primary)", marginBottom: 3 }}>{card.title}</div>
                <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{card.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {["256-bit Encryption", "FDIC Protected", "ISO 27001", "SOC 2 Type II"].map(b => (
              <div key={b} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 999, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", fontSize: 11, color: "var(--color-text-muted)", fontWeight: 600 }}>
                <span style={{ color: "var(--color-success)", fontSize: 10 }}>●</span>{b}
              </div>
            ))}
          </div>
        </div>
        {/* Right panel */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 32px", background: "rgba(3,5,10,0.5)", borderLeft: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ width: "100%", maxWidth: 400 }}>
            <DesktopFormContent step={step} email={email} setEmail={setEmail} password={password} setPassword={setPassword} showPassword={showPassword} setShowPassword={setShowPassword} loading={loading} error={error} blockedMessage={blockedMessage} handleCredentials={handleCredentials} handle2FA={handle2FA} setStep={setStep} setError={setError} setBlockedMessage={setBlockedMessage} />
          </div>
        </div>
      </div>

      {/* ═══ MOBILE LAYOUT ═══ */}
      <div className="flex flex-col lg:hidden" style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
        {/* Top hero — logo + tagline + trust pills */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          paddingTop: 48, paddingBottom: 32, gap: 0,
          background: "linear-gradient(180deg, rgba(0,212,255,0.06) 0%, transparent 100%)",
        }}>
          {/* Logo */}
          <Image
            src="/logo-dark-bg.png"
            alt="Bank of Asia Online"
            width={180}
            height={56}
            style={{ objectFit: "contain", marginBottom: 20 }}
            priority
          />
          {/* Tagline */}
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 20px" }}>
            Secure Digital Banking
          </p>
          {/* Trust pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {["🔒 SSL Secured", "⚡ Instant", "🌏 Global"].map(b => (
              <span key={b} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", borderRadius: 100, padding: "5px 14px", fontSize: 12 }}>{b}</span>
            ))}
          </div>
        </div>

        {/* Bottom 65%: sliding card */}
        <div style={{
          flex: 1,
          background: "rgba(6,12,24,0.97)",
          borderTopLeftRadius: 28, borderTopRightRadius: 28,
          border: "1px solid rgba(255,255,255,0.07)",
          borderBottom: "none",
          padding: "32px 24px 40px",
          boxShadow: "0 -12px 60px rgba(0,0,0,0.6)",
          overflowY: "auto",
          animation: "fadeSlideUp 0.4s ease forwards",
        }}>
          {/* Drag handle */}
          <div style={{ width: 36, height: 4, background: "rgba(255,255,255,0.12)", borderRadius: 999, margin: "0 auto 28px" }} />

          <MobileFormContent step={step} email={email} setEmail={setEmail} password={password} setPassword={setPassword} showPassword={showPassword} setShowPassword={setShowPassword} loading={loading} error={error} blockedMessage={blockedMessage} handleCredentials={handleCredentials} handle2FA={handle2FA} setStep={setStep} setError={setError} setBlockedMessage={setBlockedMessage} />
        </div>
      </div>
    </div>
  );
}

// Shared form props
interface FormProps {
  step: Step;
  email: string; setEmail: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  showPassword: boolean; setShowPassword: (v: boolean) => void;
  loading: boolean; error: string; blockedMessage: string;
  handleCredentials: (e: React.FormEvent) => void;
  handle2FA: (code: string) => void;
  setStep: (s: Step) => void;
  setError: (s: string) => void;
  setBlockedMessage: (s: string) => void;
}

function DesktopFormContent(props: FormProps) {
  const { step, email, setEmail, password, setPassword, showPassword, setShowPassword,
          loading, error, blockedMessage, handleCredentials, handle2FA,
          setStep, setError, setBlockedMessage } = props;
  return (
    <>
      {step === "credentials" && (
        <div className="animate-fade-slide-up">
          {/* Bank Logo — desktop only */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <img src="/logo-dark-bg.png" alt="Bank of Asia Online" style={{ width: 180, height: "auto", margin: "0 auto", display: "block" }} />
          </div>
          <div style={{ marginBottom: 28, textAlign: "center" }}>
            <h2 style={{ fontFamily: "var(--font-dm-sans)", fontSize: 26, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 6 }}>Welcome back</h2>
            <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>Sign in to access your account</p>
          </div>
          <CredentialsForm email={email} setEmail={setEmail} password={password} setPassword={setPassword} showPassword={showPassword} setShowPassword={setShowPassword} loading={loading} error={error} handleCredentials={handleCredentials} />
        </div>
      )}
      {step === "2fa" && <TwoFAStep error={error} loading={loading} handle2FA={handle2FA} setStep={setStep} setError={setError} />}
      {step === "blocked" && <BlockedStep blockedMessage={blockedMessage} setStep={setStep} setError={setError} setBlockedMessage={setBlockedMessage} />}
    </>
  );
}

function MobileFormContent(props: FormProps) {
  const { step, email, setEmail, password, setPassword, showPassword, setShowPassword,
          loading, error, blockedMessage, handleCredentials, handle2FA,
          setStep, setError, setBlockedMessage } = props;
  return (
    <>
      {step === "credentials" && (
        <>
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: "var(--font-dm-sans)", fontSize: 24, fontWeight: 700, color: "#f0f4ff", marginBottom: 6 }}>Welcome back</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Sign in to your account</p>
          </div>
          <CredentialsForm email={email} setEmail={setEmail} password={password} setPassword={setPassword} showPassword={showPassword} setShowPassword={setShowPassword} loading={loading} error={error} handleCredentials={handleCredentials} />
        </>
      )}
      {step === "2fa" && <TwoFAStep error={error} loading={loading} handle2FA={handle2FA} setStep={setStep} setError={setError} />}
      {step === "blocked" && <BlockedStep blockedMessage={blockedMessage} setStep={setStep} setError={setError} setBlockedMessage={setBlockedMessage} />}
    </>
  );
}

function CredentialsForm({ email, setEmail, password, setPassword, showPassword, setShowPassword, loading, error, handleCredentials }: {
  email: string; setEmail: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  showPassword: boolean; setShowPassword: (v: boolean) => void;
  loading: boolean; error: string;
  handleCredentials: (e: React.FormEvent) => void;
}) {
  return (
    <form onSubmit={handleCredentials} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--color-text-muted)", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Email or Account Number
        </label>
        <input type="text" className="input-nexus" placeholder="Email or account number" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
      </div>
      <div>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--color-text-muted)", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Password
        </label>
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            className="input-nexus"
            placeholder="Enter your password"
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
        {loading ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><Spinner /> Signing in…</span> : "Continue →"}
      </button>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
        <Link href="/forgot-password" style={{ color: "var(--color-text-muted)", fontWeight: 500, fontSize: 13, textDecoration: "none" }}>Forgot password?</Link>
        <span style={{ fontSize: 13 }}>
          <span style={{ color: "var(--color-text-muted)" }}>No account? </span>
          <Link href="/register" style={{ color: "var(--color-accent)", fontWeight: 600, textDecoration: "none" }}>Register</Link>
        </span>
      </div>
    </form>
  );
}

function TwoFAStep({ error, loading, handle2FA, setStep, setError }: {
  error: string; loading: boolean;
  handle2FA: (c: string) => void;
  setStep: (s: Step) => void; setError: (s: string) => void;
}) {
  return (
    <div className="animate-fade-slide-up" style={{ textAlign: "center" }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(0,212,255,0.1)", border: "2px solid rgba(0,212,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 24px", boxShadow: "0 0 24px rgba(0,212,255,0.2)" }}>🔐</div>
      <h2 style={{ fontFamily: "var(--font-dm-sans)", fontSize: 24, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 8 }}>Two-Factor Verification</h2>
      <p style={{ color: "var(--color-text-muted)", fontSize: 14, marginBottom: 24 }}>Enter the 6-digit code from your authenticator app to continue</p>

      {/* 6-box OTP */}
      <OTPInput onComplete={handle2FA} loading={loading} />

      {error && <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 10, background: "var(--color-danger-glow)", border: "1px solid rgba(255,59,92,0.25)", color: "var(--color-danger)", fontSize: 13 }}>{error}</div>}
      {loading && <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}><Spinner /></div>}
      <button onClick={() => { setStep("credentials"); setError(""); }} style={{ marginTop: 24, background: "none", border: "none", color: "var(--color-text-muted)", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>
        ← Back to login
      </button>
    </div>
  );
}

function BlockedStep({ blockedMessage, setStep, setError, setBlockedMessage }: {
  blockedMessage: string;
  setStep: (s: Step) => void; setError: (s: string) => void; setBlockedMessage: (s: string) => void;
}) {
  return (
    <div className="animate-fade-slide-up">
      <div style={{ borderRadius: 16, padding: "32px 28px", background: "linear-gradient(135deg, rgba(255,59,92,0.08), rgba(13,26,48,0.9))", border: "1px solid rgba(255,59,92,0.3)", boxShadow: "0 0 40px rgba(255,59,92,0.1)", textAlign: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(255,59,92,0.1)", border: "2px solid rgba(255,59,92,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 20px", boxShadow: "0 0 30px rgba(255,59,92,0.2)" }}>🔒</div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-danger)", marginBottom: 8 }}>Access Restricted</div>
        <h2 style={{ fontFamily: "var(--font-dm-sans)", fontSize: 22, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 20 }}>Account Access Denied</h2>
        <div style={{ padding: "16px", borderRadius: 10, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,59,92,0.15)", fontFamily: "var(--font-jetbrains-mono)", fontSize: 12.5, lineHeight: 1.7, color: "rgba(255,150,160,0.9)", textAlign: "left", marginBottom: 24 }}>
          {blockedMessage}
        </div>
        <a href="mailto:support@boasiaonline.com?subject=Account Access Issue" className="btn-danger" style={{ width: "100%", display: "flex", justifyContent: "center", textDecoration: "none", marginBottom: 14 }}>
          Contact Support
        </a>
        <button onClick={() => { setStep("credentials"); setError(""); setBlockedMessage(""); }} style={{ background: "none", border: "none", color: "var(--color-text-muted)", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>
          ← Back
        </button>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" style={{ animation: "spin 0.8s linear infinite", flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="32" strokeDashoffset="12" strokeLinecap="round" />
    </svg>
  );
}
