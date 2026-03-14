"use client";

import React, { useState } from "react";

// ─── Inline RateAlertForm ──────────────────────────────────────────────────

function RateAlertForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/rate-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("✓ You're subscribed! We'll notify you when rates change.");
        setEmail("");
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          disabled={loading}
          style={{
            fontFamily: "var(--font-dm-sans, sans-serif)",
            fontSize: "15px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "8px",
            padding: "14px 20px",
            color: "#ffffff",
            minWidth: "280px",
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--boa-teal)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            fontFamily: "var(--font-dm-sans, sans-serif)",
            fontSize: "15px",
            fontWeight: 600,
            background: loading ? "var(--boa-teal-dim)" : "var(--boa-teal)",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            padding: "14px 24px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            transition: "background 0.2s, opacity 0.2s",
            whiteSpace: "nowrap",
          }}
        >
          {loading ? "Subscribing…" : "Notify Me →"}
        </button>
      </form>
      {success && (
        <p
          style={{
            fontFamily: "var(--font-dm-sans, sans-serif)",
            fontSize: "15px",
            fontWeight: 600,
            color: "var(--boa-teal)",
            marginTop: "16px",
            textAlign: "center",
          }}
        >
          {success}
        </p>
      )}
      {error && (
        <p
          style={{
            fontFamily: "var(--font-dm-sans, sans-serif)",
            fontSize: "14px",
            color: "#F59E0B",
            marginTop: "16px",
            textAlign: "center",
          }}
        >
          {error}
        </p>
      )}
      <p
        style={{
          fontFamily: "var(--font-dm-sans, sans-serif)",
          fontSize: "12px",
          color: "rgba(255,255,255,0.35)",
          marginTop: "16px",
          textAlign: "center",
        }}
      >
        We respect your privacy. Unsubscribe anytime.
      </p>
    </div>
  );
}

// ─── Table helpers ──────────────────────────────────────────────────────────

const theadStyle: React.CSSProperties = {
  background: "var(--boa-navy)",
  color: "#ffffff",
  fontFamily: "var(--font-dm-sans, sans-serif)",
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
};

const thStyle: React.CSSProperties = {
  padding: "14px 16px",
  fontWeight: 600,
  textAlign: "left",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "13px 16px",
  fontFamily: "var(--font-dm-sans, sans-serif)",
  fontSize: "14px",
  color: "var(--boa-text)",
  borderBottom: "1px solid var(--boa-border)",
};

const rateStyle = (color: string): React.CSSProperties => ({
  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
  fontSize: "13px",
  fontWeight: 700,
  color,
});

function tableWrap(children: React.ReactNode) {
  return (
    <div
      style={{
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid var(--boa-border)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>{children}</table>
    </div>
  );
}

// ─── Tab 1: Savings & Deposits ──────────────────────────────────────────────

function SavingsTab() {
  const rows = [
    {
      type: "High-Interest Savings",
      rate: "4.75% p.a.",
      rateColor: "var(--boa-teal)",
      frequency: "Monthly",
      minBalance: "None",
      access: "Instant",
      notes: "Variable rate",
    },
    {
      type: "Term Deposit — 3 months",
      rate: "4.50% p.a.",
      rateColor: "var(--boa-navy)",
      frequency: "At maturity",
      minBalance: "$1,000",
      access: "At maturity",
      notes: "Fixed rate",
    },
    {
      type: "Term Deposit — 6 months",
      rate: "4.80% p.a.",
      rateColor: "var(--boa-navy)",
      frequency: "At maturity",
      minBalance: "$1,000",
      access: "At maturity",
      notes: "Fixed rate",
    },
    {
      type: "Term Deposit — 12 months",
      rate: "5.10% p.a.",
      rateColor: "var(--boa-gold)",
      frequency: "At maturity",
      minBalance: "$1,000",
      access: "At maturity",
      notes: "Highest fixed rate",
    },
    {
      type: "Business Savings",
      rate: "4.25% p.a.",
      rateColor: "var(--boa-navy)",
      frequency: "Monthly",
      minBalance: "$5,000",
      access: "Instant",
      notes: "Variable, business accounts only",
    },
    {
      type: "Current Account",
      rate: "0.00%",
      rateColor: "var(--boa-muted)",
      frequency: "—",
      minBalance: "None",
      access: "Instant",
      notes: "Transaction account",
    },
  ];

  return (
    <div
      style={{
        animation: "boaFadeIn 0.25s ease",
      }}
    >
      <h3
        style={{
          fontFamily: "var(--font-syne, sans-serif)",
          fontSize: "24px",
          fontWeight: 700,
          color: "var(--boa-navy)",
          marginBottom: "8px",
        }}
      >
        Savings &amp; Deposit Rates
      </h3>
      <p
        style={{
          fontFamily: "var(--font-dm-sans, sans-serif)",
          fontSize: "14px",
          color: "var(--boa-muted)",
          marginBottom: "24px",
        }}
      >
        All rates variable unless stated. Effective March 2026.
      </p>
      {tableWrap(
        <>
          <thead style={theadStyle}>
            <tr>
              {["Account Type", "Interest Rate", "Frequency", "Min Balance", "Access", "Notes"].map((h) => (
                <th key={h} style={thStyle}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.type}
                style={{
                  backgroundColor: i % 2 === 0 ? "#ffffff" : "var(--boa-off-white)",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLTableRowElement).style.backgroundColor = "rgba(0,200,150,0.03)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                    i % 2 === 0 ? "#ffffff" : "var(--boa-off-white)")
                }
              >
                <td style={{ ...tdStyle, fontWeight: 500 }}>{row.type}</td>
                <td style={tdStyle}>
                  <span style={rateStyle(row.rateColor)}>{row.rate}</span>
                </td>
                <td style={tdStyle}>{row.frequency}</td>
                <td style={tdStyle}>{row.minBalance}</td>
                <td style={tdStyle}>{row.access}</td>
                <td style={{ ...tdStyle, color: "var(--boa-muted)", fontSize: "13px" }}>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </>
      )}
    </div>
  );
}

// ─── Tab 2: Cards & Payments ───────────────────────────────────────────────

function CardsTab() {
  const cardRows = [
    { type: "Virtual VISA", issuance: "FREE", monthly: "FREE", replacement: "FREE", limit: "Up to 3 cards" },
    { type: "Virtual Mastercard", issuance: "FREE", monthly: "FREE", replacement: "FREE", limit: "Up to 3 cards" },
  ];

  const paymentRows = [
    { type: "Internal Transfer (BOA→BOA)", fee: "FREE", feeColor: "var(--boa-teal)", time: "Instant", notes: "All currencies" },
    { type: "Local Wire — AUD", fee: "$5.00 flat", feeColor: "var(--boa-navy)", time: "Same day", notes: "BSB/Account required" },
    { type: "Local Wire — USD", fee: "$8.00 flat", feeColor: "var(--boa-navy)", time: "1–2 days", notes: "ACH/Wire" },
    { type: "Local Wire — EUR/GBP", fee: "$10.00 flat", feeColor: "var(--boa-navy)", time: "1–2 days", notes: "IBAN/Sort Code" },
    { type: "SWIFT (Major currencies)", fee: "$15.00 + 0.5% FX", feeColor: "var(--boa-navy)", time: "1–3 days", notes: "USD, GBP, EUR, AUD, CAD" },
    { type: "SWIFT (Other currencies)", fee: "$20.00 + 0.75% FX", feeColor: "var(--boa-navy)", time: "2–5 days", notes: "CHF, JPY, CNY, AED" },
    { type: "SWIFT (Emerging)", fee: "$25.00 + 1.0% FX", feeColor: "var(--boa-navy)", time: "3–7 days", notes: "Other SWIFT destinations" },
  ];

  return (
    <div style={{ animation: "boaFadeIn 0.25s ease" }}>
      <h3
        style={{
          fontFamily: "var(--font-syne, sans-serif)",
          fontSize: "24px",
          fontWeight: 700,
          color: "var(--boa-navy)",
          marginBottom: "24px",
        }}
      >
        Virtual Card Fees
      </h3>
      {tableWrap(
        <>
          <thead style={theadStyle}>
            <tr>
              {["Card Type", "Issuance Fee", "Monthly Fee", "Replacement", "Limit per Account"].map((h) => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cardRows.map((row, i) => (
              <tr
                key={row.type}
                style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "var(--boa-off-white)", transition: "background 0.15s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.backgroundColor = "rgba(0,200,150,0.03)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.backgroundColor = i % 2 === 0 ? "#ffffff" : "var(--boa-off-white)")}
              >
                <td style={{ ...tdStyle, fontWeight: 500 }}>{row.type}</td>
                <td style={tdStyle}><span style={rateStyle("var(--boa-teal)")}>{row.issuance}</span></td>
                <td style={tdStyle}><span style={rateStyle("var(--boa-teal)")}>{row.monthly}</span></td>
                <td style={tdStyle}><span style={rateStyle("var(--boa-teal)")}>{row.replacement}</span></td>
                <td style={tdStyle}>{row.limit}</td>
              </tr>
            ))}
          </tbody>
        </>
      )}

      <div style={{ marginTop: "48px" }}>
        <h3
          style={{
            fontFamily: "var(--font-syne, sans-serif)",
            fontSize: "22px",
            fontWeight: 700,
            color: "var(--boa-navy)",
            marginBottom: "24px",
          }}
        >
          Transaction &amp; Payment Fees
        </h3>
        {tableWrap(
          <>
            <thead style={theadStyle}>
              <tr>
                {["Payment Type", "Fee", "Processing Time", "Notes"].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paymentRows.map((row, i) => (
                <tr
                  key={row.type}
                  style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "var(--boa-off-white)", transition: "background 0.15s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.backgroundColor = "rgba(0,200,150,0.03)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.backgroundColor = i % 2 === 0 ? "#ffffff" : "var(--boa-off-white)")}
                >
                  <td style={{ ...tdStyle, fontWeight: 500 }}>{row.type}</td>
                  <td style={tdStyle}>
                    <span style={rateStyle(row.feeColor)}>{row.fee}</span>
                  </td>
                  <td style={tdStyle}>{row.time}</td>
                  <td style={{ ...tdStyle, color: "var(--boa-muted)", fontSize: "13px" }}>{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Tab 3: Loans ──────────────────────────────────────────────────────────

function LoansTab() {
  const personalRows = [
    { type: "Personal Loan (Unsecured)", rate: "From 8.99% p.a.", rateColor: "var(--boa-teal)", term: "1–7 years", min: "$5,000", notes: "Fixed rate" },
    { type: "Personal Loan (Secured)", rate: "From 6.99% p.a.", rateColor: "var(--boa-navy)", term: "1–10 years", min: "$10,000", notes: "Asset-backed" },
    { type: "Line of Credit", rate: "From 12.99% p.a.", rateColor: "var(--boa-navy)", term: "Revolving", min: "$2,000", notes: "Variable rate" },
  ];

  const businessRows = [
    { product: "Business Line of Credit", rate: "From 9.99% p.a.", notes: "Subject to credit assessment" },
    { product: "Trade Finance", rate: "From 7.99% p.a.", notes: "For import/export businesses" },
    { product: "Equipment Finance", rate: "From 8.49% p.a.", notes: "Asset-backed" },
  ];

  return (
    <div style={{ animation: "boaFadeIn 0.25s ease" }}>
      <h3
        style={{
          fontFamily: "var(--font-syne, sans-serif)",
          fontSize: "24px",
          fontWeight: 700,
          color: "var(--boa-navy)",
          marginBottom: "24px",
        }}
      >
        Personal Loan Rates
      </h3>
      {tableWrap(
        <>
          <thead style={theadStyle}>
            <tr>
              {["Loan Type", "Rate", "Term", "Min Amount", "Notes"].map((h) => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {personalRows.map((row, i) => (
              <tr
                key={row.type}
                style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "var(--boa-off-white)", transition: "background 0.15s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.backgroundColor = "rgba(0,200,150,0.03)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.backgroundColor = i % 2 === 0 ? "#ffffff" : "var(--boa-off-white)")}
              >
                <td style={{ ...tdStyle, fontWeight: 500 }}>{row.type}</td>
                <td style={tdStyle}><span style={rateStyle(row.rateColor)}>{row.rate}</span></td>
                <td style={tdStyle}>{row.term}</td>
                <td style={tdStyle}>{row.min}</td>
                <td style={{ ...tdStyle, color: "var(--boa-muted)", fontSize: "13px" }}>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </>
      )}

      <div style={{ marginTop: "48px" }}>
        <h3
          style={{
            fontFamily: "var(--font-syne, sans-serif)",
            fontSize: "22px",
            fontWeight: 700,
            color: "var(--boa-navy)",
            marginBottom: "24px",
          }}
        >
          Business Financing
        </h3>
        {tableWrap(
          <>
            <thead style={theadStyle}>
              <tr>
                {["Product", "Rate", "Notes"].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {businessRows.map((row, i) => (
                <tr
                  key={row.product}
                  style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "var(--boa-off-white)", transition: "background 0.15s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.backgroundColor = "rgba(0,200,150,0.03)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.backgroundColor = i % 2 === 0 ? "#ffffff" : "var(--boa-off-white)")}
                >
                  <td style={{ ...tdStyle, fontWeight: 500 }}>{row.product}</td>
                  <td style={tdStyle}><span style={rateStyle("var(--boa-navy)")}>{row.rate}</span></td>
                  <td style={{ ...tdStyle, color: "var(--boa-muted)", fontSize: "13px" }}>{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </>
        )}
      </div>

      <div
        style={{
          marginTop: "32px",
          background: "rgba(0,200,150,0.06)",
          border: "1px solid rgba(0,200,150,0.2)",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-dm-sans, sans-serif)",
            fontSize: "14px",
            color: "var(--boa-text)",
            lineHeight: 1.65,
            margin: 0,
          }}
        >
          ℹ️ Loan rates are indicative and subject to individual credit assessment, loan amount, and term.
          Contact our lending team for a personalised quote.
        </p>
      </div>
    </div>
  );
}

// ─── Tab 4: Fees & Charges ─────────────────────────────────────────────────

function FeesTab() {
  const rows = [
    { service: "Account Opening", fee: "FREE", feeColor: "var(--boa-teal)", frequency: "One-time", notes: "No KYC fees" },
    { service: "Current Account", fee: "FREE", feeColor: "var(--boa-teal)", frequency: "Monthly", notes: "No monthly fee" },
    { service: "Savings Account", fee: "FREE", feeColor: "var(--boa-teal)", frequency: "Monthly", notes: "No monthly fee" },
    { service: "Term Deposit", fee: "FREE", feeColor: "var(--boa-teal)", frequency: "Monthly", notes: "No admin fees" },
    { service: "Virtual Card Issuance", fee: "FREE", feeColor: "var(--boa-teal)", frequency: "Per card", notes: "VISA or Mastercard" },
    { service: "Internal Transfer", fee: "FREE", feeColor: "var(--boa-teal)", frequency: "Per transaction", notes: "—" },
    { service: "Local Wire — AUD", fee: "$5.00 flat", feeColor: "var(--boa-navy)", frequency: "Per transaction", notes: "—" },
    { service: "Local Wire — USD", fee: "$8.00 flat", feeColor: "var(--boa-navy)", frequency: "Per transaction", notes: "—" },
    { service: "Local Wire — EUR", fee: "$10.00 flat", feeColor: "var(--boa-navy)", frequency: "Per transaction", notes: "—" },
    { service: "SWIFT — Major", fee: "$15.00 + 0.5% FX", feeColor: "var(--boa-navy)", frequency: "Per transaction", notes: "—" },
    { service: "SWIFT — Other", fee: "$20.00 + 0.75% FX", feeColor: "var(--boa-navy)", frequency: "Per transaction", notes: "—" },
    { service: "Statement (PDF)", fee: "FREE", feeColor: "var(--boa-teal)", frequency: "Per request", notes: "—" },
    { service: "Account Closure", fee: "FREE", feeColor: "var(--boa-teal)", frequency: "One-time", notes: "—" },
  ];

  return (
    <div style={{ animation: "boaFadeIn 0.25s ease" }}>
      <h3
        style={{
          fontFamily: "var(--font-syne, sans-serif)",
          fontSize: "24px",
          fontWeight: 700,
          color: "var(--boa-navy)",
          marginBottom: "24px",
        }}
      >
        Complete Fee Schedule
      </h3>
      {tableWrap(
        <>
          <thead style={theadStyle}>
            <tr>
              {["Service", "Fee", "Frequency", "Notes"].map((h) => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.service}
                style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "var(--boa-off-white)", transition: "background 0.15s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.backgroundColor = "rgba(0,200,150,0.03)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.backgroundColor = i % 2 === 0 ? "#ffffff" : "var(--boa-off-white)")}
              >
                <td style={{ ...tdStyle, fontWeight: 500 }}>{row.service}</td>
                <td style={tdStyle}><span style={rateStyle(row.feeColor)}>{row.fee}</span></td>
                <td style={tdStyle}>{row.frequency}</td>
                <td style={{ ...tdStyle, color: "var(--boa-muted)", fontSize: "13px" }}>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </>
      )}
    </div>
  );
}

// ─── Tab definitions ────────────────────────────────────────────────────────

const TABS = [
  { id: "savings", label: "Savings & Deposits", component: <SavingsTab /> },
  { id: "cards", label: "Cards & Payments", component: <CardsTab /> },
  { id: "loans", label: "Loans", component: <LoansTab /> },
  { id: "fees", label: "Fees & Charges", component: <FeesTab /> },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─── Rate comparison data ──────────────────────────────────────────────────

const compareRows = [
  { label: "Savings Rate", boa: "4.75% p.a. ⭐", a: "~1.50% p.a.", b: "~1.80% p.a.", c: "~2.10% p.a." },
  { label: "Term Deposit 12M", boa: "5.10% p.a. ⭐", a: "~3.50% p.a.", b: "~3.80% p.a.", c: "~4.00% p.a." },
  { label: "SWIFT Fee", boa: "$15 flat ⭐", a: "$25–$40", b: "$28–$45", c: "$30–$50" },
  { label: "Monthly Account Fee", boa: "$0 ⭐", a: "$5–$15", b: "$0–$10", c: "$10–$20" },
];

// ─── Main page component ────────────────────────────────────────────────────

export default function InterestRatesPage() {
  const [activeTab, setActiveTab] = useState<TabId>("savings");

  const activeComponent = TABS.find((t) => t.id === activeTab)?.component;

  return (
    <>
      {/* ── Fade keyframe injected once ──────────────────────────────── */}
      <style>{`
        @keyframes boaFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "var(--boa-off-white)",
          paddingTop: "80px",
          paddingBottom: "80px",
          position: "relative",
        }}
      >
        <div
          className="boa-container"
          style={{ maxWidth: "860px", margin: "0 auto", textAlign: "center" }}
        >
          {/* Eyebrow */}
          <p
            style={{
              fontFamily: "var(--font-dm-sans, sans-serif)",
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "var(--boa-teal)",
              marginBottom: "16px",
            }}
          >
            INTEREST RATES &amp; FEES
          </p>

          {/* H1 */}
          <h1
            style={{
              fontFamily: "var(--font-syne, sans-serif)",
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 700,
              color: "var(--boa-navy)",
              letterSpacing: "-0.025em",
              marginBottom: "16px",
              lineHeight: 1.1,
            }}
          >
            Current Interest Rates
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "var(--font-dm-sans, sans-serif)",
              fontSize: "17px",
              color: "var(--boa-muted)",
              marginBottom: "40px",
              lineHeight: 1.6,
            }}
          >
            Effective March 2026. Reviewed monthly and always competitive.
          </p>

          {/* Rate pills */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              justifyContent: "center",
            }}
          >
            {/* Pill 1 — Savings */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                borderRadius: "9999px",
                padding: "10px 20px",
                background: "rgba(0,200,150,0.1)",
                border: "1px solid rgba(0,200,150,0.3)",
                color: "var(--boa-teal)",
                fontFamily: "var(--font-dm-sans, sans-serif)",
                fontSize: "15px",
                fontWeight: 600,
              }}
            >
              <span style={{ fontFamily: "var(--font-mono, monospace)" }}>4.75% p.a.</span>
              <span style={{ opacity: 0.75 }}>Savings Account</span>
            </div>

            {/* Pill 2 — Term Deposit */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                borderRadius: "9999px",
                padding: "10px 20px",
                background: "rgba(200,151,42,0.1)",
                border: "1px solid rgba(200,151,42,0.3)",
                color: "var(--boa-gold)",
                fontFamily: "var(--font-dm-sans, sans-serif)",
                fontSize: "15px",
                fontWeight: 600,
              }}
            >
              <span style={{ fontFamily: "var(--font-mono, monospace)" }}>5.10% p.a.</span>
              <span style={{ opacity: 0.75 }}>Term Deposit 12M</span>
            </div>

            {/* Pill 3 — Personal Loan */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                borderRadius: "9999px",
                padding: "10px 20px",
                background: "rgba(10,22,40,0.07)",
                border: "1px solid rgba(10,22,40,0.15)",
                color: "var(--boa-navy)",
                fontFamily: "var(--font-dm-sans, sans-serif)",
                fontSize: "15px",
                fontWeight: 600,
              }}
            >
              <span style={{ fontFamily: "var(--font-mono, monospace)" }}>From 8.99% p.a.</span>
              <span style={{ opacity: 0.65 }}>Personal Loan</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2 — TAB NAVIGATION + CONTENT
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ background: "#ffffff", paddingTop: "0", paddingBottom: "64px" }}>
        {/* Sticky tab nav */}
        <div
          style={{
            position: "sticky",
            top: "64px",
            background: "#ffffff",
            borderBottom: "1px solid var(--boa-border)",
            zIndex: 40,
            marginBottom: "40px",
          }}
        >
          <div className="boa-container">
            <div style={{ display: "flex", gap: "0", overflowX: "auto" }}>
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: "14px 20px",
                      fontFamily: "var(--font-dm-sans, sans-serif)",
                      fontSize: "15px",
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? "var(--boa-teal)" : "var(--boa-muted)",
                      background: "transparent",
                      border: "none",
                      borderBottom: isActive ? "2px solid var(--boa-teal)" : "2px solid transparent",
                      cursor: "pointer",
                      transition: "color 0.2s, border-color 0.2s",
                      whiteSpace: "nowrap",
                      marginBottom: "-1px",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive)
                        (e.currentTarget as HTMLButtonElement).style.color = "var(--boa-navy)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive)
                        (e.currentTarget as HTMLButtonElement).style.color = "var(--boa-muted)";
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab content */}
        <div className="boa-container">
          <div style={{ overflowX: "auto" }}>{activeComponent}</div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3 — RATE COMPARISON WIDGET
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="boa-section"
        style={{ background: "var(--boa-off-white)" }}
      >
        <div
          className="boa-container"
          style={{ maxWidth: "900px", margin: "0 auto" }}
        >
          {/* Eyebrow */}
          <p
            style={{
              fontFamily: "var(--font-dm-sans, sans-serif)",
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "var(--boa-teal)",
              textAlign: "center",
              marginBottom: "12px",
            }}
          >
            HOW WE COMPARE
          </p>

          {/* H2 */}
          <h2
            style={{
              fontFamily: "var(--font-syne, sans-serif)",
              fontSize: "34px",
              fontWeight: 700,
              color: "var(--boa-navy)",
              textAlign: "center",
              marginBottom: "12px",
              letterSpacing: "-0.02em",
            }}
          >
            How do our rates compare?
          </h2>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "var(--font-dm-sans, sans-serif)",
              fontSize: "14px",
              color: "var(--boa-muted)",
              textAlign: "center",
              marginBottom: "40px",
            }}
          >
            Compared to typical major bank rates as of March 2026.
          </p>

          {/* Comparison table */}
          <div
            style={{
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid var(--boa-border)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th
                    style={{
                      ...thStyle,
                      background: "var(--boa-navy)",
                      color: "rgba(255,255,255,0.7)",
                      fontFamily: "var(--font-dm-sans, sans-serif)",
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    &nbsp;
                  </th>
                  <th
                    style={{
                      ...thStyle,
                      background: "var(--boa-teal)",
                      color: "#ffffff",
                      fontFamily: "var(--font-dm-sans, sans-serif)",
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      fontWeight: 700,
                    }}
                  >
                    Bank of Asia
                  </th>
                  {["Major Bank A", "Major Bank B", "Major Bank C"].map((h) => (
                    <th
                      key={h}
                      style={{
                        ...thStyle,
                        background: "var(--boa-navy)",
                        color: "rgba(255,255,255,0.7)",
                        fontFamily: "var(--font-dm-sans, sans-serif)",
                        fontSize: "11px",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row, i) => (
                  <tr
                    key={row.label}
                    style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "var(--boa-off-white)" }}
                  >
                    <td
                      style={{
                        ...tdStyle,
                        fontWeight: 600,
                        color: "var(--boa-navy)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.label}
                    </td>
                    {/* BOA cell */}
                    <td
                      style={{
                        ...tdStyle,
                        background: "rgba(0,200,150,0.06)",
                        fontFamily: "var(--font-dm-sans, sans-serif)",
                        fontWeight: 700,
                        color: "var(--boa-teal)",
                      }}
                    >
                      {row.boa}
                    </td>
                    <td style={{ ...tdStyle, color: "var(--boa-navy)" }}>{row.a}</td>
                    <td style={{ ...tdStyle, color: "var(--boa-navy)" }}>{row.b}</td>
                    <td style={{ ...tdStyle, color: "var(--boa-navy)" }}>{row.c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Disclaimer */}
          <p
            style={{
              fontFamily: "var(--font-dm-sans, sans-serif)",
              fontSize: "12px",
              color: "var(--boa-muted)",
              marginTop: "16px",
              lineHeight: 1.6,
            }}
          >
            ⚠ Competitor rates are indicative estimates based on publicly available data. Always verify with the relevant institution.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4 — DISCLAIMER
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ background: "#ffffff", paddingTop: "40px", paddingBottom: "40px" }}>
        <div
          className="boa-container"
          style={{ maxWidth: "860px", margin: "0 auto" }}
        >
          <div
            style={{
              background: "var(--boa-off-white)",
              border: "1px solid var(--boa-border)",
              borderRadius: "12px",
              padding: "32px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-dm-sans, sans-serif)",
                fontSize: "15px",
                fontWeight: 600,
                color: "var(--boa-navy)",
                marginBottom: "16px",
              }}
            >
              ⚖️ Rate Disclaimer &amp; Legal Information
            </p>
            <p
              style={{
                fontFamily: "var(--font-dm-sans, sans-serif)",
                fontSize: "14px",
                color: "var(--boa-muted)",
                lineHeight: 1.75,
                margin: 0,
              }}
            >
              Interest rates displayed are current as of March 2026 and are subject to change with 30 days&apos; notice.
              Variable rates may change at any time without notice. Bank of Asia Online is a regulated digital financial
              institution. All deposits are held in segregated custodian accounts. Interest is calculated on the daily
              closing balance and credited as stated. Term deposit rates are fixed for the agreed term and cannot be
              changed after the deposit is placed. Loan rates are indicative and subject to credit assessment.
              Bank of Asia is not a member of the Financial Claims Scheme (FCS). Past interest rates are not a guarantee
              of future rates.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 5 — RATE ALERT SIGNUP
      ══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "linear-gradient(135deg, #0A1628, #162B52)",
          paddingTop: "64px",
          paddingBottom: "64px",
        }}
      >
        <div
          className="boa-container"
          style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center" }}
        >
          <h2
            style={{
              fontFamily: "var(--font-syne, sans-serif)",
              fontSize: "30px",
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: "12px",
              letterSpacing: "-0.02em",
            }}
          >
            Get notified when rates change.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-dm-sans, sans-serif)",
              fontSize: "16px",
              color: "rgba(255,255,255,0.6)",
              marginBottom: "32px",
              lineHeight: 1.6,
            }}
          >
            Enter your email and we&apos;ll alert you whenever our savings or deposit rates are updated.
          </p>

          <RateAlertForm />
        </div>
      </section>
    </>
  );
}
