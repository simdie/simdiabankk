"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { CURRENCY_FLAGS, CURRENCY_NAMES, COUNTRIES } from "@/lib/utils";
import Select from "@/components/ui/Select";

const CURRENCIES = ["USD", "EUR", "GBP", "SGD", "CAD", "AUD", "CHF", "JPY", "CNY", "AED"];
const STEPS = ["Personal", "Account", "Identity", "Address", "Security", "Review"];
const COUNTRY_OPTIONS = COUNTRIES.map((c) => ({ value: c.code, label: c.name, flag: c.flag }));
const NATIONALITY_OPTIONS = COUNTRIES.map((c) => ({ value: c.name, label: c.name, flag: c.flag }));

interface FormData {
  // Step 0
  firstName: string;
  lastName: string;
  phone: string;
  // Step 1
  email: string;
  currency: string;
  // Step 2
  dateOfBirth: string;
  gender: string;
  nationality: string;
  idType: string;
  idNumber: string;
  // Step 3
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  // Step 4
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase", pass: /[A-Z]/.test(password) },
    { label: "Lowercase", pass: /[a-z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
    { label: "Symbol", pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const colors = ["", "#ff3b5c", "#ff3b5c", "#f0b429", "#f0b429", "#00e5a0"];
  const labels = ["", "Very Weak", "Weak", "Fair", "Good", "Strong"];
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= score ? colors[score] : "rgba(255,255,255,0.08)", transition: "background 0.3s ease" }} />
        ))}
      </div>
      <div style={{ fontSize: 11, color: colors[score] || "var(--color-text-muted)", fontWeight: 600, marginBottom: 10 }}>
        {password ? labels[score] : "Enter password"}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {checks.map((c) => (
          <span key={c.label} style={{
            fontSize: 11, padding: "2px 8px", borderRadius: 999,
            background: c.pass ? "rgba(0,229,160,0.1)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${c.pass ? "rgba(0,229,160,0.3)" : "rgba(255,255,255,0.08)"}`,
            color: c.pass ? "var(--color-success)" : "var(--color-text-muted)", fontWeight: 600,
          }}>
            {c.pass ? "✓ " : ""}{c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function CardPreview({ name, currency }: { name: string; currency: string }) {
  const displayName = name.trim() || "YOUR NAME";
  return (
    <div style={{
      width: 320, height: 200, borderRadius: 18,
      background: "linear-gradient(135deg, #0d1a30 0%, #122240 40%, #1e3a6e 100%)",
      border: "1px solid rgba(0,212,255,0.25)", padding: "24px 26px",
      position: "relative", overflow: "hidden",
      boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 40px rgba(0,212,255,0.1)",
    }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.04) 50%, transparent 65%)", backgroundSize: "200% 100%", animation: "shimmer 3s linear infinite" }} />
      <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.1)" }} />
      <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 11, color: "var(--color-accent)", letterSpacing: 1 }}>BANK OF ASIA ONLINE</div>
        <div style={{ fontSize: 18 }}>{CURRENCY_FLAGS[currency] || "🌍"}</div>
      </div>
      <div style={{ marginTop: 16, position: "relative", zIndex: 1 }}>
        <div style={{ width: 36, height: 28, borderRadius: 5, background: "linear-gradient(135deg, #d4a843, #f0c060, #b8901e)", border: "1px solid rgba(255,255,255,0.15)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, padding: 4 }}>
          {[...Array(4)].map((_, i) => <div key={i} style={{ background: "rgba(160,110,10,0.6)", borderRadius: 1 }} />)}
        </div>
      </div>
      <div style={{ marginTop: 12, fontFamily: "var(--font-jetbrains-mono)", fontSize: 14, color: "rgba(240,244,255,0.6)", letterSpacing: 2, position: "relative", zIndex: 1 }}>
        •••• •••• •••• ••••
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 10, position: "relative", zIndex: 1 }}>
        <div>
          <div style={{ fontSize: 9, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>Cardholder</div>
          <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)", textTransform: "uppercase", letterSpacing: 1, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {displayName.toUpperCase()}
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,0,0,0.6)" }} />
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,160,0,0.6)", marginLeft: -10 }} />
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ current, steps }: { current: number; steps: string[] }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, marginBottom: 14, position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", left: 0, top: 0, height: "100%",
          width: `${(current / (steps.length - 1)) * 100}%`,
          background: "linear-gradient(90deg, var(--color-accent), #0088cc)",
          borderRadius: 2, transition: "width 0.5s ease",
          boxShadow: "0 0 8px rgba(0,212,255,0.4)",
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {steps.map((s, i) => (
          <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: 26, height: 26, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700,
              background: i < current ? "var(--color-success)" : i === current ? "var(--color-accent)" : "rgba(255,255,255,0.06)",
              border: i === current ? "2px solid var(--color-accent)" : "2px solid transparent",
              color: i <= current ? "#03050a" : "var(--color-text-muted)",
              boxShadow: i === current ? "0 0 12px rgba(0,212,255,0.4)" : "none",
              transition: "all 0.3s ease",
            }}>
              {i < current ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: 9, fontWeight: i === current ? 700 : 500, color: i === current ? "var(--color-accent)" : "var(--color-text-muted)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              {s}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FieldError({ msg }: { msg: string }) {
  return <div style={{ marginTop: 6, fontSize: 12, color: "var(--color-danger)", display: "flex", alignItems: "center", gap: 4 }}><span>✗</span> {msg}</div>;
}

function Spinner() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" style={{ animation: "spin 0.8s linear infinite", flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="32" strokeDashoffset="12" strokeLinecap="round" />
    </svg>
  );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: "var(--color-text-muted)", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" };
const eyeBtn: React.CSSProperties = { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", padding: 2, display: "flex", alignItems: "center" };

// 3-dropdown Date of Birth picker
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
function DOBPicker({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: string }) {
  const parts = value ? value.split("-") : ["", "", ""];
  const year = parts[0] || "";
  const month = parts[1] || "";
  const day = parts[2] || "";

  const daysInMonth = month && year ? new Date(parseInt(year), parseInt(month), 0).getDate() : 31;
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100;
  const maxYear = currentYear - 18;

  function update(y: string, m: string, d: string) {
    if (y && m && d) {
      const maxD = new Date(parseInt(y), parseInt(m), 0).getDate();
      const safeD = Math.min(parseInt(d), maxD).toString().padStart(2, "0");
      onChange(`${y}-${m.padStart(2, "0")}-${safeD}`);
    } else {
      onChange("");
    }
  }

  const selectStyle: React.CSSProperties = {
    flex: 1, padding: "10px 12px", borderRadius: 10,
    background: "rgba(6,12,24,0.7)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "var(--color-text-primary)",
    fontSize: 14, fontFamily: "inherit", outline: "none",
    cursor: "pointer", appearance: "none" as const,
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8 }}>
        {/* Day */}
        <Select
          value={day}
          onChange={(v) => update(year, month, v)}
          options={Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => ({
            value: String(d).padStart(2, "0"),
            label: String(d),
          }))}
          placeholder="Day"
          style={selectStyle}
        />
        {/* Month */}
        <Select
          value={month}
          onChange={(v) => update(year, v, day)}
          options={MONTHS.map((m, i) => ({
            value: String(i + 1).padStart(2, "0"),
            label: m,
          }))}
          placeholder="Month"
          style={{ ...selectStyle, flex: 2 }}
        />
        {/* Year */}
        <Select
          value={year}
          onChange={(v) => update(v, month, day)}
          options={Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i).map((y) => ({
            value: String(y),
            label: String(y),
          }))}
          placeholder="Year"
          style={selectStyle}
        />
      </div>
      {error && <div style={{ marginTop: 6, fontSize: 12, color: "var(--color-danger)" }}>✗ {error}</div>}
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState<FormData>({
    firstName: "", lastName: "", phone: "",
    email: "", currency: "USD",
    dateOfBirth: "", gender: "", nationality: "", idType: "", idNumber: "",
    addressLine1: "", addressLine2: "", city: "", state: "", zipCode: "", country: "US",
    password: "", confirmPassword: "", agreeTerms: false,
  });

  const set = (key: keyof FormData, val: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  function validateStep(): boolean {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!form.firstName.trim()) e.firstName = "Required";
      if (!form.lastName.trim()) e.lastName = "Required";
    }
    if (step === 1) {
      if (!form.email) e.email = "Required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    }
    if (step === 2) {
      // Identity — all optional but validate format if filled
      if (form.dateOfBirth) {
        const dob = new Date(form.dateOfBirth);
        const age = (new Date().getTime() - dob.getTime()) / (365.25 * 24 * 3600 * 1000);
        if (age < 18) e.dateOfBirth = "Must be at least 18 years old";
      }
    }
    if (step === 4) {
      if (form.password.length < 8) e.password = "Min 8 characters";
      else if (!/[A-Z]/.test(form.password)) e.password = "Must have uppercase";
      else if (!/[0-9]/.test(form.password)) e.password = "Must have number";
      else if (!/[^A-Za-z0-9]/.test(form.password)) e.password = "Must have symbol";
      if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    }
    if (step === 5 && !form.agreeTerms) e.agreeTerms = "You must agree to the terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function nextStep() {
    if (validateStep()) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  async function handleSubmit() {
    if (!validateStep()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone || undefined,
          email: form.email,
          password: form.password,
          currency: form.currency,
          dateOfBirth: form.dateOfBirth || undefined,
          gender: form.gender || undefined,
          nationality: form.nationality || undefined,
          addressLine1: form.addressLine1 || undefined,
          addressLine2: form.addressLine2 || undefined,
          city: form.city || undefined,
          state: form.state || undefined,
          zipCode: form.zipCode || undefined,
          country: form.country || undefined,
          idType: form.idType || undefined,
          idNumber: form.idNumber || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.issues) {
          const mapped: Record<string, string> = {};
          Object.entries(data.issues).forEach(([k, v]) => { mapped[k] = (v as string[])[0]; });
          setErrors(mapped);
          if (mapped.email) setStep(1);
          else if (mapped.password) setStep(4);
        } else {
          setErrors({ submit: data.error || "Registration failed" });
        }
        return;
      }
      setSubmitted(true);
    } catch {
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  const fullName = `${form.firstName} ${form.lastName}`.trim();

  // ── POST-SUBMIT ──
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-nexus-950)", padding: 32 }}>
        <div className="nexus-grid" />
        <div className="glass-card animate-fade-slide-up" style={{ maxWidth: 500, width: "100%", padding: "44px 40px", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(0,229,160,0.1)", border: "2px solid rgba(0,229,160,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 24px", boxShadow: "0 0 30px rgba(0,229,160,0.2)", animation: "float 4s ease-in-out infinite" }}>
            ✅
          </div>
          <h2 style={{ fontFamily: "var(--font-syne)", fontSize: 26, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 10 }}>
            Registration Submitted!
          </h2>
          <p style={{ color: "var(--color-text-muted)", fontSize: 14, marginBottom: 36 }}>
            Welcome, <strong style={{ color: "var(--color-accent)" }}>{form.firstName}</strong>. Your account is now under review.
          </p>
          <div style={{ textAlign: "left" }}>
            {[
              { icon: "✓", label: "Registration Received", desc: "Your application is in our system", done: true, active: false },
              { icon: "⏳", label: "Under Review", desc: "Administrator is verifying your details", done: false, active: true },
              { icon: "3", label: "Account Activated", desc: "You'll receive an email when ready", done: false, active: false },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 16, marginBottom: i < 2 ? 0 : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, background: item.done ? "var(--color-success)" : item.active ? "rgba(240,180,41,0.15)" : "rgba(255,255,255,0.06)", border: item.active ? "2px solid rgba(240,180,41,0.5)" : "2px solid transparent", color: item.done ? "#03050a" : item.active ? "var(--color-gold)" : "var(--color-text-muted)", boxShadow: item.active ? "0 0 12px rgba(240,180,41,0.2)" : "none" }}>
                    {item.icon}
                  </div>
                  {i < 2 && <div style={{ width: 1, flex: 1, minHeight: 28, background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />}
                </div>
                <div style={{ paddingTop: 6, paddingBottom: i < 2 ? 20 : 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: item.active ? "var(--color-text-primary)" : item.done ? "var(--color-success)" : "var(--color-text-muted)" }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/login" className="btn-ghost" style={{ marginTop: 32, width: "100%", display: "flex", justifyContent: "center", textDecoration: "none" }}>
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: "var(--color-nexus-950)" }}>
      <div className="fixed inset-0 z-0">
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 30% 50%, rgba(0,212,255,0.07) 0%, transparent 60%), radial-gradient(ellipse 50% 70% at 80% 30%, rgba(100,40,180,0.07) 0%, transparent 60%)" }} />
        <div className="nexus-grid" />
      </div>

      {/* Left — Card Preview */}
      <div className="hidden lg:flex flex-col items-center justify-center relative z-10" style={{ width: "45%", padding: "60px 48px", gap: 40 }}>
        <div style={{ textAlign: "center" }}>
          <img src="/logo-dark-bg.png" alt="Bank of Asia Online" style={{ width: 200, height: "auto", display: "block", margin: "0 auto" }} />
          <div style={{ fontSize: 12, color: "var(--color-text-muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 8 }}>Open Your Account</div>
        </div>
        <div style={{ animation: "float 6s ease-in-out infinite" }}>
          <CardPreview name={fullName} currency={form.currency} />
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "var(--color-text-muted)", lineHeight: 1.7, maxWidth: 280 }}>
            Your personalised virtual card will be issued once your account is activated.
          </p>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {[["10", "Currencies"], ["256-bit", "Encryption"], ["24/7", "Support"]].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-syne)", fontSize: 20, fontWeight: 800, color: "var(--color-accent)" }}>{val}</div>
              <div style={{ fontSize: 11, color: "var(--color-text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Form */}
      <div className="relative z-10 flex items-center justify-center" style={{ flex: 1, padding: "40px 32px", background: "rgba(3,5,10,0.5)", borderLeft: "1px solid rgba(255,255,255,0.04)", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: 480, padding: "20px 0" }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontFamily: "var(--font-syne)", fontSize: 26, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 6 }}>
              Create Account
            </h2>
            <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>
              Step {step + 1} of {STEPS.length} — {STEPS[step]}
            </p>
          </div>

          <StepIndicator current={step} steps={STEPS} />

          <div className="animate-fade-slide-up" key={step}>

            {/* ── STEP 0: Personal ── */}
            {step === 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>First Name *</label>
                    <input className="input-nexus" placeholder="John" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
                    {errors.firstName && <FieldError msg={errors.firstName} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Last Name *</label>
                    <input className="input-nexus" placeholder="Doe" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
                    {errors.lastName && <FieldError msg={errors.lastName} />}
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Phone Number (optional)</label>
                  <input className="input-nexus" placeholder="+1 555 000 0000" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                </div>
              </div>
            )}

            {/* ── STEP 1: Account Setup ── */}
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input type="email" className="input-nexus" placeholder="you@example.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
                  {errors.email && <FieldError msg={errors.email} />}
                </div>
                <div>
                  <label style={labelStyle}>Primary Currency *</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginTop: 4 }}>
                    {CURRENCIES.map((c) => (
                      <button key={c} type="button" onClick={() => set("currency", c)} style={{ padding: "10px 6px", borderRadius: 10, border: form.currency === c ? "1.5px solid var(--color-accent)" : "1px solid rgba(255,255,255,0.08)", background: form.currency === c ? "rgba(0,212,255,0.08)" : "rgba(6,12,24,0.6)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, transition: "all 0.15s ease", boxShadow: form.currency === c ? "0 0 10px rgba(0,212,255,0.15)" : "none" }}>
                        <span style={{ fontSize: 18 }}>{CURRENCY_FLAGS[c]}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.04em", color: form.currency === c ? "var(--color-accent)" : "var(--color-text-muted)" }}>{c}</span>
                      </button>
                    ))}
                  </div>
                  <div style={{ marginTop: 8, fontSize: 12, color: "var(--color-text-muted)" }}>
                    Selected: <strong style={{ color: "var(--color-accent)" }}>{CURRENCY_FLAGS[form.currency]} {CURRENCY_NAMES[form.currency]}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2: Identity ── */}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.1)", fontSize: 12, color: "var(--color-text-muted)" }}>
                  Identity information is optional but helps speed up KYC verification.
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Date of Birth</label>
                    <DOBPicker value={form.dateOfBirth} onChange={(v) => set("dateOfBirth", v)} error={errors.dateOfBirth} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Gender</label>
                    <Select
                      options={[
                        { value: "Male", label: "Male" },
                        { value: "Female", label: "Female" },
                        { value: "Non-binary", label: "Non-binary" },
                        { value: "Prefer not to say", label: "Prefer not to say" },
                      ]}
                      value={form.gender}
                      onChange={(v) => set("gender", v)}
                      placeholder="Select..."
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Nationality</label>
                  <Select
                    options={NATIONALITY_OPTIONS}
                    value={form.nationality}
                    onChange={(v) => set("nationality", v)}
                    placeholder="Select nationality..."
                    searchable
                  />
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>ID Type</label>
                    <Select
                      options={[
                        { value: "PASSPORT", label: "Passport" },
                        { value: "NATIONAL_ID", label: "National ID" },
                        { value: "DRIVERS_LICENSE", label: "Driver's License" },
                        { value: "RESIDENCE_PERMIT", label: "Residence Permit" },
                        { value: "OTHER", label: "Other" },
                      ]}
                      value={form.idType}
                      onChange={(v) => set("idType", v)}
                      placeholder="Select type..."
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>ID Number</label>
                    <input className="input-nexus" placeholder="Document number" value={form.idNumber} onChange={(e) => set("idNumber", e.target.value)} style={{ fontFamily: "var(--font-jetbrains-mono)" }} />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 3: Address ── */}
            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.1)", fontSize: 12, color: "var(--color-text-muted)" }}>
                  Home address is optional. You can add or update it later in your profile.
                </div>
                <div>
                  <label style={labelStyle}>Address Line 1</label>
                  <input className="input-nexus" placeholder="Street address" value={form.addressLine1} onChange={(e) => set("addressLine1", e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Address Line 2 (optional)</label>
                  <input className="input-nexus" placeholder="Apt, suite, unit" value={form.addressLine2} onChange={(e) => set("addressLine2", e.target.value)} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={labelStyle}>City</label>
                    <input className="input-nexus" placeholder="City" value={form.city} onChange={(e) => set("city", e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>State / Province</label>
                    <input className="input-nexus" placeholder="State" value={form.state} onChange={(e) => set("state", e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>ZIP / Postal Code</label>
                    <input className="input-nexus" placeholder="ZIP code" value={form.zipCode} onChange={(e) => set("zipCode", e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Country</label>
                    <Select
                      options={COUNTRY_OPTIONS}
                      value={form.country}
                      onChange={(v) => set("country", v)}
                      placeholder="Country..."
                      searchable
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 4: Security ── */}
            {step === 4 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={labelStyle}>Password *</label>
                  <div style={{ position: "relative" }}>
                    <input type={showPassword ? "text" : "password"} className="input-nexus" placeholder="Create a strong password" value={form.password} onChange={(e) => set("password", e.target.value)} style={{ paddingRight: 44 }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeBtn}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                  </div>
                  <PasswordStrength password={form.password} />
                  {errors.password && <FieldError msg={errors.password} />}
                </div>
                <div>
                  <label style={labelStyle}>Confirm Password *</label>
                  <div style={{ position: "relative" }}>
                    <input type={showConfirm ? "text" : "password"} className="input-nexus" placeholder="Repeat your password" value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} style={{ paddingRight: 44 }} />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={eyeBtn}>{showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                  </div>
                  {form.confirmPassword && form.password !== form.confirmPassword && (
                    <div style={{ marginTop: 6, fontSize: 12, color: "var(--color-danger)" }}>✗ Passwords do not match</div>
                  )}
                  {form.confirmPassword && form.password === form.confirmPassword && form.confirmPassword.length > 0 && (
                    <div style={{ marginTop: 6, fontSize: 12, color: "var(--color-success)" }}>✓ Passwords match</div>
                  )}
                  {errors.confirmPassword && <FieldError msg={errors.confirmPassword} />}
                </div>
              </div>
            )}

            {/* ── STEP 5: Review ── */}
            {step === 5 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="glass-card" style={{ padding: "18px 20px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: 12 }}>Account Summary</div>
                  {[
                    ["Name", `${form.firstName} ${form.lastName}`],
                    ["Email", form.email],
                    ["Phone", form.phone || "—"],
                    ["Currency", `${CURRENCY_FLAGS[form.currency]} ${form.currency} — ${CURRENCY_NAMES[form.currency]}`],
                    ...(form.dateOfBirth ? [["Date of Birth", new Date(form.dateOfBirth).toLocaleDateString()]] : []),
                    ...(form.gender ? [["Gender", form.gender]] : []),
                    ...(form.nationality ? [["Nationality", form.nationality]] : []),
                    ...(form.city ? [["City", form.city]] : []),
                    ...(form.country ? [["Country", COUNTRY_OPTIONS.find((c) => c.value === form.country)?.label ?? form.country]] : []),
                    ...(form.idType ? [["ID Type", form.idType.replace(/_/g, " ")]] : []),
                    ["Password", "✓ Set"],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 8, marginBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{label}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: label === "Password" ? "var(--color-success)" : "var(--color-text-primary)", textAlign: "right", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis" }}>{value}</span>
                    </div>
                  ))}
                </div>

                <label style={{ display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}>
                  <input type="checkbox" checked={form.agreeTerms} onChange={(e) => set("agreeTerms", e.target.checked)} style={{ marginTop: 2, accentColor: "var(--color-accent)", width: 16, height: 16 }} />
                  <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                    I agree to Bank of Asia Online's <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-accent)" }}>Terms of Service</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-accent)" }}>Privacy Policy</a>
                  </span>
                </label>
                {errors.agreeTerms && <FieldError msg={errors.agreeTerms} />}

                {errors.submit && (
                  <div style={{ padding: "12px 16px", borderRadius: 10, background: "var(--color-danger-glow)", border: "1px solid rgba(255,59,92,0.25)", color: "var(--color-danger)", fontSize: 13 }}>
                    {errors.submit}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            {step > 0 && (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="btn-ghost" style={{ flex: 1 }} disabled={loading}>
                ← Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={nextStep} className="btn-nexus" style={{ flex: 1 }}>
                Continue →
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} className="btn-nexus" style={{ flex: 1 }} disabled={loading}>
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                    <Spinner /> Creating account…
                  </span>
                ) : "Create Account ✓"}
              </button>
            )}
          </div>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <span style={{ color: "var(--color-text-muted)", fontSize: 14 }}>Already have an account? </span>
            <Link href="/login" style={{ color: "var(--color-accent)", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
