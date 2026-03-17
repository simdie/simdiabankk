"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import FaqAccordion from "@/components/marketing/FaqAccordion";
import type { FaqItem } from "@/components/marketing/FaqAccordion";
import EditorialBanner from "@/components/marketing/EditorialBanner";

// ── FAQ data ──────────────────────────────────────────────

const FAQS: FaqItem[] = [
  {
    q: "How long do SWIFT transfers take?",
    a: "Most SWIFT transfers to major destinations (US, UK, EU, Australia) arrive within 1–3 business days. Transfers to emerging markets or less-common currencies may take 3–7 business days. Settlement times depend on the receiving bank and any intermediary banks in the routing chain.",
  },
  {
    q: "What information do I need to send an international transfer?",
    a: "You'll need the recipient's full name, bank name, SWIFT/BIC code, and either an IBAN (for Europe) or account number and routing code. Some countries require additional details such as branch codes or purpose of payment.",
  },
  {
    q: "Are there limits on how much I can transfer?",
    a: "Standard accounts can transfer up to $50,000 USD equivalent per transaction and $200,000 per month. Higher limits are available for verified business accounts. All large transfers are subject to AML compliance review.",
  },
  {
    q: "What currencies can I send?",
    a: "You can send in USD, GBP, EUR, AUD, CAD, CHF, JPY, CNY, and AED. If the recipient needs a different currency, we apply a transparent FX conversion at the time of the transfer.",
  },
  {
    q: "Can I cancel a transfer once it's sent?",
    a: "Transfers can be cancelled if they have not yet entered the SWIFT network (typically within 30 minutes of submission). Once a transfer has been dispatched, recall is possible but may take 5–10 business days and a recall fee may apply.",
  },
  {
    q: "What is the FX margin?",
    a: "The FX margin is a small percentage added to the interbank exchange rate to cover our currency conversion costs. Our margins range from 0.5% to 1.0% depending on the currency pair — significantly lower than most traditional banks (typically 3–5%).",
  },
  {
    q: "Is my transfer safe?",
    a: "Yes. All transfers are processed through the SWIFT network with full end-to-end encryption and compliance screening. Every transfer generates an official PDF receipt and is fully traceable via your dashboard.",
  },
];

// ── FX Rates ──────────────────────────────────────────────

const FX_RATES: Record<string, number> = {
  USD: 1,
  GBP: 0.792,
  EUR: 0.921,
  AUD: 1.543,
  CAD: 1.361,
  CHF: 0.896,
  JPY: 149.2,
  CNY: 7.241,
  AED: 3.672,
};

const CURRENCIES = [
  { code: "USD", flag: "🇺🇸", name: "US Dollar" },
  { code: "GBP", flag: "🇬🇧", name: "British Pound" },
  { code: "EUR", flag: "🇪🇺", name: "Euro" },
  { code: "AUD", flag: "🇦🇺", name: "Australian Dollar" },
  { code: "CAD", flag: "🇨🇦", name: "Canadian Dollar" },
  { code: "CHF", flag: "🇨🇭", name: "Swiss Franc" },
  { code: "JPY", flag: "🇯🇵", name: "Japanese Yen" },
  { code: "CNY", flag: "🇨🇳", name: "Chinese Yuan" },
  { code: "AED", flag: "🇦🇪", name: "UAE Dirham" },
];

// ── GlobeVisual ───────────────────────────────────────────

function GlobeVisual() {
  return (
    <div style={{ position: "relative", width: 480, height: 480, margin: "0 auto" }}>
      {/* Background teal grid */}
      <div
        className="hero-grid-bg"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      />

      {/* Slow-spinning dashed ring (outer) */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          marginTop: -150,
          marginLeft: -150,
          width: 300,
          height: 300,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            border: "1px dashed rgba(0,200,150,0.2)",
            borderRadius: "50%",
            animation: "spin-slow 20s linear infinite",
          }}
        />
      </div>

      {/* Blinker dots */}
      {[
        { top: "6%",  left: "15%"  },
        { top: "35%", right: "6%"  },
        { bottom: "10%", left: "30%" },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...pos,
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "#00C896",
            animation: `blinker-dot ${2 + i * 0.4}s ease-in-out ${i * 0.5}s infinite`,
            boxShadow: "0 0 8px rgba(0,200,150,0.8)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Outer glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, rgba(0,200,150,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Center circle */}
      <div
        style={{
          width: 300,
          height: 300,
          border: "2px solid rgba(0,200,150,0.3)",
          borderRadius: "50%",
          background: "rgba(0,200,150,0.03)",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Inner circle */}
      <div
        style={{
          width: 180,
          height: 180,
          border: "1px solid rgba(0,200,150,0.15)",
          borderRadius: "50%",
          background: "rgba(0,200,150,0.04)",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Innermost dot */}
      <div
        style={{
          width: 16,
          height: 16,
          background: "rgba(0,200,150,0.6)",
          borderRadius: "50%",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: "0 0 20px rgba(0,200,150,0.5)",
        }}
      />

      {/* SVG transfer lines */}
      <svg
        width="480"
        height="480"
        viewBox="0 0 480 480"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {[
          { x1: 240, y1: 240, x2: 80, y2: 100, duration: 1.5 },
          { x1: 240, y1: 240, x2: 380, y2: 120, duration: 2.0 },
          { x1: 240, y1: 240, x2: 60, y2: 360, duration: 2.2 },
          { x1: 240, y1: 240, x2: 400, y2: 350, duration: 2.5 },
        ].map((line, i) => (
          <motion.line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="rgba(0,200,150,0.35)"
            strokeWidth="1"
            strokeDasharray="6 4"
            animate={{ strokeDashoffset: [0, -20] }}
            transition={{
              duration: line.duration,
              ease: "linear",
              repeat: Infinity,
            }}
          />
        ))}
      </svg>

      {/* Destination dots */}
      {[
        { top: (100 / 480) * 100, left: (80 / 480) * 100 },
        { top: (120 / 480) * 100, left: (380 / 480) * 100 },
        { top: (360 / 480) * 100, left: (60 / 480) * 100 },
        { top: (350 / 480) * 100, left: (400 / 480) * 100 },
      ].map((dot, i) => (
        <div
          key={i}
          style={{
            width: 8,
            height: 8,
            background: "#00C896",
            borderRadius: "50%",
            position: "absolute",
            top: `${dot.top}%`,
            left: `${dot.left}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      {/* Floating transfer badge cards */}
      {[
        { label: "🇺🇸 → 🇬🇧 SWIFT", style: { top: "8%", right: "5%" }, y: [0, -7, 0], duration: 3, delay: 0 },
        { label: "🇸🇬 → 🇺🇸 Wire", style: { top: "40%", right: "2%" }, y: [0, -5, 0], duration: 3.8, delay: 0.5 },
        { label: "🇦🇺 → 🇯🇵 SEPA", style: { bottom: "15%", right: "8%" }, y: [0, -6, 0], duration: 4.2, delay: 1 },
        { label: "🇦🇪 → 🇬🇧 SWIFT", style: { top: "65%", left: "2%" }, y: [0, -8, 0], duration: 3.5, delay: 0.3 },
      ].map((badge, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            ...badge.style,
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 10,
            padding: "6px 12px",
            fontFamily: "var(--font-dm-sans)",
            fontSize: 12,
            fontWeight: 500,
            color: "white",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            whiteSpace: "nowrap",
          }}
          animate={{ y: badge.y }}
          transition={{
            duration: badge.duration,
            ease: "easeInOut",
            repeat: Infinity,
            delay: badge.delay,
          }}
        >
          {badge.label}
        </motion.div>
      ))}
    </div>
  );
}

// ── CurrencyConverter (inline) ────────────────────────────

function CurrencyConverter() {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("GBP");
  const [amount, setAmount] = useState("1000");
  const [swapping, setSwapping] = useState(false);
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  const result =
    (parseFloat(amount) / FX_RATES[fromCurrency]) * FX_RATES[toCurrency];
  const rate = (FX_RATES[toCurrency] / FX_RATES[fromCurrency]).toFixed(4);

  const fromCurr = CURRENCIES.find((c) => c.code === fromCurrency)!;
  const toCurr = CURRENCIES.find((c) => c.code === toCurrency)!;

  function handleSwap() {
    setSwapping((s) => !s);
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }

  const dropdownStyle: React.CSSProperties = {
    position: "absolute",
    top: "calc(100% + 6px)",
    left: 0,
    background: "white",
    border: "1px solid var(--boa-gray-200)",
    borderRadius: 12,
    boxShadow: "0 8px 40px rgba(0,0,0,0.14)",
    zIndex: 50,
    maxHeight: 192,
    overflowY: "auto",
    minWidth: 200,
  };

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          gap: 16,
          alignItems: "start",
        }}
        className="md:grid-cols-[1fr_auto_1fr] grid-cols-1"
      >
        {/* LEFT — You send */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 12,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--boa-muted)",
              marginBottom: 8,
            }}
          >
            You send
          </p>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              width: "100%",
              fontFamily: "var(--font-dm-sans)",
              fontSize: 32,
              fontWeight: 700,
              border: "none",
              outline: "none",
              borderBottom: "2px solid var(--boa-gray-200)",
              paddingBottom: 8,
              paddingTop: 4,
              color: "var(--boa-navy)",
              background: "transparent",
              marginBottom: 12,
            }}
          />
          <div style={{ position: "relative" }}>
            <button
              onClick={() => { setFromOpen((o) => !o); setToOpen(false); }}
              style={{
                background: "var(--boa-off-white)",
                borderRadius: 8,
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                border: "none",
              }}
            >
              <span style={{ fontSize: 18 }}>{fromCurr.flag}</span>
              <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 14, fontWeight: 600, color: "var(--boa-navy)" }}>{fromCurr.code}</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 4l4 4 4-4" stroke="var(--boa-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {fromOpen && (
              <div style={dropdownStyle}>
                {CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => { setFromCurrency(c.code); setFromOpen(false); }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 14px",
                      background: fromCurrency === c.code ? "rgba(0,200,150,0.06)" : "transparent",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{c.flag}</span>
                    <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 13, fontWeight: 600, color: "var(--boa-navy)" }}>{c.code}</span>
                    <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 12, color: "var(--boa-muted)" }}>{c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CENTER — Swap */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, paddingTop: 40 }}>
          <motion.button
            onClick={handleSwap}
            animate={{ rotate: swapping ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "var(--boa-teal)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
            whileHover={{ backgroundColor: "var(--boa-teal-dim)" }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 7h14M13 4l4 3-4 3M17 13H3M7 10l-4 3 4 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
          <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11, color: "var(--boa-muted)", textAlign: "center", lineHeight: 1.5 }}>
            FEE: $8.00<br />+ 0.5%
          </p>
        </div>

        {/* RIGHT — They receive */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 12,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--boa-muted)",
              marginBottom: 8,
            }}
          >
            They receive
          </p>
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 32,
              fontWeight: 700,
              color: "var(--boa-teal)",
              borderBottom: "2px solid var(--boa-teal)",
              paddingBottom: 8,
              paddingTop: 4,
              marginBottom: 12,
            }}
          >
            {isNaN(result) ? "—" : result.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => { setToOpen((o) => !o); setFromOpen(false); }}
              style={{
                background: "var(--boa-off-white)",
                borderRadius: 8,
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                border: "none",
              }}
            >
              <span style={{ fontSize: 18 }}>{toCurr.flag}</span>
              <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 14, fontWeight: 600, color: "var(--boa-navy)" }}>{toCurr.code}</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 4l4 4 4-4" stroke="var(--boa-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {toOpen && (
              <div style={dropdownStyle}>
                {CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => { setToCurrency(c.code); setToOpen(false); }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 14px",
                      background: toCurrency === c.code ? "rgba(0,200,150,0.06)" : "transparent",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{c.flag}</span>
                    <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 13, fontWeight: 600, color: "var(--boa-navy)" }}>{c.code}</span>
                    <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 12, color: "var(--boa-muted)" }}>{c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: 13, color: "var(--boa-muted)", marginTop: 10 }}>
            Rate: 1 {fromCurrency} = {rate} {toCurrency}
          </p>
        </div>
      </div>

      <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
        <Link
          href="/register" target="_blank" rel="noopener noreferrer"
          style={{
            background: "var(--boa-teal)",
            color: "white",
            borderRadius: 8,
            padding: "12px 32px",
            fontFamily: "var(--font-dm-sans)",
            fontSize: 15,
            fontWeight: 600,
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Get Started →
        </Link>
      </div>
    </div>
  );
}

// ── RateTableRow ──────────────────────────────────────────

function RateTableRow({
  type,
  destination,
  fee,
  fxMargin,
  settlement,
  notes,
  bg,
}: {
  type: string;
  destination: string;
  fee: string;
  fxMargin: string;
  settlement: string;
  notes: string;
  bg: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? "rgba(0,200,150,0.03)" : bg,
        transition: "background-color 0.15s",
      }}
    >
      <td style={{ padding: "14px 20px", fontFamily: "var(--font-dm-sans)", fontSize: 14, fontWeight: 500, color: "var(--boa-navy)", borderBottom: "1px solid var(--boa-border)" }}>{type}</td>
      <td style={{ padding: "14px 20px", fontFamily: "var(--font-dm-sans)", fontSize: 13, color: "var(--boa-muted)", borderBottom: "1px solid var(--boa-border)" }}>{destination}</td>
      <td style={{ padding: "14px 20px", fontFamily: "var(--font-mono, monospace)", fontSize: 13, fontWeight: 700, color: fee === "FREE" ? "var(--boa-teal)" : "var(--boa-navy)", borderBottom: "1px solid var(--boa-border)" }}>{fee}</td>
      <td style={{ padding: "14px 20px", fontFamily: "var(--font-dm-sans)", fontSize: 13, color: "var(--boa-muted)", borderBottom: "1px solid var(--boa-border)" }}>{fxMargin}</td>
      <td style={{ padding: "14px 20px", fontFamily: "var(--font-dm-sans)", fontSize: 13, color: "var(--boa-muted)", borderBottom: "1px solid var(--boa-border)" }}>{settlement}</td>
      <td style={{ padding: "14px 20px", fontFamily: "var(--font-dm-sans)", fontSize: 13, color: "var(--boa-muted)", borderBottom: "1px solid var(--boa-border)" }}>{notes}</td>
    </tr>
  );
}

// ── TransferCard ──────────────────────────────────────────

function TransferCard({
  icon,
  title,
  badge,
  body,
  features,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  badge: string;
  body: string;
  features: string[];
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" as const }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "white",
        border: `1px solid ${hovered ? "rgba(0,200,150,0.3)" : "var(--boa-border)"}`,
        borderRadius: 16,
        padding: 28,
        boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.07)" : "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ color: "var(--boa-teal)" }}>{icon}</div>
        <span
          style={{
            background: "rgba(0,200,150,0.1)",
            color: "var(--boa-teal)",
            fontFamily: "var(--font-dm-sans)",
            fontSize: 11,
            fontWeight: 600,
            borderRadius: 9999,
            padding: "2px 10px",
          }}
        >
          {badge}
        </span>
      </div>
      <h3
        style={{
          fontFamily: "var(--font-syne)",
          fontSize: 18,
          fontWeight: 600,
          color: "var(--boa-navy)",
          marginBottom: 10,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: 14,
          color: "var(--boa-muted)",
          lineHeight: 1.7,
          marginBottom: 20,
        }}
      >
        {body}
      </p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        {features.map((f) => (
          <li key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "var(--boa-teal)", fontSize: 14, fontWeight: 700 }}>✓</span>
            <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 13, color: "var(--boa-muted)" }}>{f}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────

export default function InternationalPage() {
  const heroStagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.13 } },
  };
  const heroChild = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  // Section refs for whileInView
  const sec3Ref = useRef(null);
  const sec4Ref = useRef(null);
  const sec5Ref = useRef(null);
  const sec7Ref = useRef(null);

  const sec3InView = useInView(sec3Ref, { once: true, margin: "-80px" });
  const sec4InView = useInView(sec4Ref, { once: true, margin: "-80px" });
  const sec5InView = useInView(sec5Ref, { once: true, margin: "-80px" });
  const sec7InView = useInView(sec7Ref, { once: true, margin: "-80px" });

  return (
    <>
      {/* ════════════════════════════════════════════════════
          SECTION 1 — HERO
      ════════════════════════════════════════════════════ */}
      <section
        style={{
          backgroundColor: "#0A1628",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          paddingTop: 96,
          paddingBottom: 96,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dot-grid overlay */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
          }}
        />

        <div className="boa-container" style={{ width: "100%", position: "relative", zIndex: 1 }}>
          <div
            style={{ display: "grid", gap: 48, alignItems: "center" }}
            className="grid-cols-1 lg:grid-cols-[55fr_45fr]"
          >
            {/* LEFT */}
            <motion.div
              variants={heroStagger}
              initial="hidden"
              animate="visible"
              style={{ display: "flex", flexDirection: "column", gap: 24 }}
            >
              {/* Eyebrow */}
              <motion.div variants={heroChild}>
                <span
                  style={{
                    display: "inline-block",
                    background: "rgba(0,200,150,0.1)",
                    border: "1px solid rgba(0,200,150,0.28)",
                    color: "var(--boa-teal)",
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: 13,
                    fontWeight: 600,
                    borderRadius: 9999,
                    padding: "8px 16px",
                  }}
                >
                  INTERNATIONAL TRANSFERS
                </span>
              </motion.div>

              {/* H1 */}
              <motion.h1
                variants={heroChild}
                style={{
                  fontFamily: "var(--font-syne)",
                  fontSize: "clamp(36px, 5vw, 60px)",
                  fontWeight: 700,
                  color: "white",
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                  margin: 0,
                }}
              >
                Send money anywhere<br />in the world.
              </motion.h1>

              {/* Body */}
              <motion.p
                variants={heroChild}
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: 17,
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.75,
                  margin: 0,
                  maxWidth: 460,
                }}
              >
                International wire transfers via SWIFT to 180+ countries. Transparent fees. Real exchange rates. No hidden charges.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={heroChild} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link
                  href="/register" target="_blank" rel="noopener noreferrer"
                  style={{
                    background: "var(--boa-teal)",
                    color: "white",
                    borderRadius: 8,
                    padding: "14px 28px",
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: 16,
                    fontWeight: 600,
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  Send Money Now
                </Link>
                <Link
                  href="#fees"
                  style={{
                    background: "transparent",
                    color: "white",
                    borderRadius: 8,
                    padding: "14px 28px",
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: 16,
                    fontWeight: 600,
                    textDecoration: "none",
                    display: "inline-block",
                    border: "1px solid rgba(255,255,255,0.4)",
                  }}
                >
                  See fee schedule
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div variants={heroChild} style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                {["✓ 180+ countries", "✓ Transparent fees", "✓ Real exchange rates"].map((badge) => (
                  <span
                    key={badge}
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: 13,
                      color: "rgba(255,255,255,0.55)",
                    }}
                  >
                    {badge}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* RIGHT — Globe */}
            <div className="hidden lg:block">
              <GlobeVisual />
            </div>
          </div>
        </div>
      </section>

      {/* Banner image */}
      <section style={{ marginTop: "clamp(48px, 6vw, 80px)", marginBottom: "clamp(48px, 6vw, 80px)", overflow: "hidden", width: "100%" }}>
        <Image
          key="banner-image3-v2"
          src="/banner-image3.png"
          alt="International wire transfers"
          width={1920}
          height={600}
          style={{ width: "100%", height: "clamp(220px, 28vw, 420px)", objectFit: "cover", objectPosition: "center", display: "block" }}
          priority={false}
        />
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 2 — CURRENCY CONVERTER WIDGET
      ════════════════════════════════════════════════════ */}
      <section style={{ background: "white", paddingTop: 64, paddingBottom: 64 }}>
        <div className="boa-container">
          <div
            style={{
              maxWidth: 900,
              margin: "0 auto",
              background: "white",
              border: "1px solid var(--boa-gray-200)",
              borderRadius: 16,
              padding: "clamp(24px, 4vw, 40px)",
              boxShadow: "0 4px 40px rgba(0,0,0,0.08)",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-syne)",
                fontSize: 28,
                fontWeight: 700,
                color: "var(--boa-navy)",
                marginBottom: 4,
              }}
            >
              Currency Converter
            </h2>
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: 14,
                color: "var(--boa-muted)",
                marginBottom: 32,
              }}
            >
              Live indicative rates. Updated daily.
            </p>
            <CurrencyConverter />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 3 — TRANSFER TYPES
      ════════════════════════════════════════════════════ */}
      <section className="boa-section" style={{ background: "#F8F9FA" }} ref={sec3Ref}>
        <div className="boa-container">
          {/* Eyebrow + H2 */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={sec3InView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "var(--boa-teal)",
              marginBottom: 12,
            }}
          >
            TRANSFER TYPES
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={sec3InView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.07 }}
            style={{
              fontFamily: "var(--font-syne)",
              fontSize: 36,
              fontWeight: 700,
              color: "var(--boa-navy)",
              marginBottom: 48,
              letterSpacing: "-0.02em",
            }}
          >
            Choose your transfer method.
          </motion.h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {/* Card 1 — Internal */}
            <TransferCard
              delay={0}
              icon={
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M16 3L5 16h9l-2 9L23 12h-9l2-9z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                </svg>
              }
              title="Internal Transfer"
              badge="FREE"
              body="Instant transfers between Bank of Asia accounts. Zero fees. Real-time settlement. Available 24/7."
              features={["Instant settlement", "Zero fees", "24/7 availability", "All currencies"]}
            />

            {/* Card 2 — Local Wire */}
            <TransferCard
              delay={0.1}
              icon={
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ color: "var(--boa-gold)" }}>
                  <rect x="2" y="16" width="24" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M5 16V12M9 16V12M13 16V12M17 16V12M21 16V12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                  <path d="M2 12l12-9 12 9" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                </svg>
              }
              title="Local Wire Transfer"
              badge="From $5"
              body="Domestic bank transfers using local payment rails. Typically same-day or next-day settlement."
              features={["Same/next-day", "Low flat fee", "AUD, USD, GBP, EUR", "Bank reference included"]}
            />

            {/* Card 3 — SWIFT */}
            <TransferCard
              delay={0.2}
              icon={
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="2" />
                  <ellipse cx="14" cy="14" rx="4.5" ry="11" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="3" y1="14" x2="25" y2="14" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M6 9c2.5 1.2 5 1.8 8 1.8s5.5-.6 8-1.8" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                  <path d="M6 19c2.5-1.2 5-1.8 8-1.8s5.5.6 8 1.8" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                </svg>
              }
              title="SWIFT Transfer"
              badge="From $15"
              body="International wire transfers to 180+ countries via the SWIFT network. Full compliance and tracking."
              features={["180+ countries", "BIC/SWIFT routing", "Full audit trail", "Official receipts"]}
            />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 4 — HOW IT WORKS
      ════════════════════════════════════════════════════ */}
      <section className="boa-section" style={{ background: "white" }} ref={sec4Ref}>
        <div className="boa-container">
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={sec4InView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              style={{
                fontFamily: "var(--font-syne)",
                fontSize: 36,
                fontWeight: 700,
                color: "var(--boa-navy)",
                textAlign: "center",
                marginBottom: 64,
                letterSpacing: "-0.02em",
              }}
            >
              How international transfers work.
            </motion.h2>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 0,
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              {[
                {
                  n: 1,
                  title: "Create your transfer",
                  body: "Log in to your dashboard and enter the recipient's details: name, bank, SWIFT/BIC code, IBAN or account number, and amount.",
                },
                {
                  n: 2,
                  title: "We verify & process",
                  body: "Our compliance team reviews your transfer against AML/KYC rules. Most transfers are approved instantly.",
                },
                {
                  n: 3,
                  title: "SWIFT routing",
                  body: "Your funds enter the SWIFT network and are routed to the recipient's bank via correspondent banking relationships.",
                },
                {
                  n: 4,
                  title: "Recipient receives funds",
                  body: "Funds arrive within 1–3 business days, depending on the destination country and receiving bank.",
                },
              ].map((step, i) => (
                <div
                  key={step.n}
                  style={{ display: "flex", alignItems: "flex-start", flex: "1 1 0", minWidth: 0 }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={sec4InView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" as const }}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", maxWidth: 180 }}
                  >
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        background: "var(--boa-teal)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontFamily: "var(--font-syne)",
                        fontSize: 20,
                        fontWeight: 700,
                        marginBottom: 16,
                        flexShrink: 0,
                      }}
                    >
                      {step.n}
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--boa-navy)",
                        marginBottom: 8,
                      }}
                    >
                      {step.title}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontSize: 14,
                        color: "var(--boa-muted)",
                        lineHeight: 1.65,
                      }}
                    >
                      {step.body}
                    </p>
                  </motion.div>

                  {/* Dashed connector (not after last) */}
                  {i < 3 && (
                    <div
                      aria-hidden
                      style={{
                        flex: 1,
                        borderTop: "2px dashed rgba(0,200,150,0.3)",
                        marginTop: 28,
                        minWidth: 12,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 5 — SUPPORTED REGIONS
      ════════════════════════════════════════════════════ */}
      <section className="boa-section" style={{ background: "#F8F9FA" }} ref={sec5Ref}>
        <div className="boa-container">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={sec5InView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            style={{
              fontFamily: "var(--font-syne)",
              fontSize: 36,
              fontWeight: 700,
              color: "var(--boa-navy)",
              textAlign: "center",
              marginBottom: 8,
              letterSpacing: "-0.02em",
            }}
          >
            180+ destination countries.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={sec5InView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.07 }}
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 16,
              color: "var(--boa-muted)",
              textAlign: "center",
              marginBottom: 48,
            }}
          >
            Wherever your money needs to go.
          </motion.p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              justifyContent: "center",
            }}
          >
            {[
              { flag: "🌎", name: "Americas", count: "45 countries", bg: "#00C896" },
              { flag: "🌍", name: "Europe", count: "52 countries", bg: "#0A1628" },
              { flag: "🌏", name: "Asia-Pacific", count: "38 countries", bg: "#00A87E" },
              { flag: "🕌", name: "Middle East", count: "22 countries", bg: "#C8972A" },
              { flag: "🌍", name: "Africa & Others", count: "30+ countries", bg: "#64748B" },
            ].map((region, i) => (
              <motion.div
                key={region.name}
                initial={{ opacity: 0, y: 20 }}
                animate={sec5InView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" as const }}
                style={{
                  background: region.bg,
                  borderRadius: 16,
                  padding: "16px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span style={{ fontSize: 24 }}>{region.flag}</span>
                <div>
                  <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: 15, fontWeight: 600, color: "white", margin: 0 }}>
                    {region.name}
                  </p>
                  <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: 13, color: "rgba(255,255,255,0.7)", margin: 0 }}>
                    {region.count}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 12,
              color: "var(--boa-muted)",
              textAlign: "center",
              marginTop: 24,
            }}
          >
            Transfers are subject to compliance review. Some jurisdictions may have restrictions.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 6 — FEE TABLE
      ════════════════════════════════════════════════════ */}
      <section id="fees" className="boa-section" style={{ background: "white" }}>
        <div className="boa-container">
          <h2
            style={{
              fontFamily: "var(--font-syne)",
              fontSize: 36,
              fontWeight: 700,
              color: "var(--boa-navy)",
              marginBottom: 8,
              letterSpacing: "-0.02em",
            }}
          >
            Our fee schedule.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 16,
              color: "var(--boa-muted)",
              marginBottom: 32,
            }}
          >
            No hidden charges. Ever.
          </p>

          <div
            style={{
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid var(--boa-border)",
              boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#0A1628" }}>
                    {["Transfer Type", "Destination", "Fee", "FX Margin", "Settlement", "Notes"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "16px 20px",
                          fontFamily: "var(--font-dm-sans)",
                          fontSize: 11,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "white",
                          textAlign: "left",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <RateTableRow bg="white" type="Internal Transfer" destination="Bank of Asia → Bank of Asia" fee="FREE" fxMargin="None" settlement="Instant" notes="All currencies" />
                  <RateTableRow bg="#F8F9FA" type="Local Wire (AUD)" destination="Australia" fee="$5.00 flat" fxMargin="None" settlement="Same day" notes="BSB/Account" />
                  <RateTableRow bg="white" type="Local Wire (USD)" destination="United States" fee="$8.00 flat" fxMargin="None" settlement="1–2 days" notes="ACH/Wire" />
                  <RateTableRow bg="#F8F9FA" type="SWIFT (Major currencies)" destination="Europe, UK, US, AU" fee="$15.00 flat" fxMargin="0.5%" settlement="1–3 days" notes="SWIFT/BIC required" />
                  <RateTableRow bg="white" type="SWIFT (Other currencies)" destination="Asia, Middle East" fee="$20.00 flat" fxMargin="0.75%" settlement="2–5 days" notes="SWIFT/BIC required" />
                  <RateTableRow bg="#F8F9FA" type="SWIFT (Emerging markets)" destination="Africa, LatAm" fee="$25.00 flat" fxMargin="1.0%" settlement="3–7 days" notes="Compliance review" />
                </tbody>
              </table>
            </div>
          </div>

          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 12,
              color: "var(--boa-muted)",
              marginTop: 16,
            }}
          >
            Fees effective March 2026. Bank of Asia reserves the right to update fees with 30 days' notice.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 7 — FAQ
      ════════════════════════════════════════════════════ */}
      <section className="boa-section" style={{ background: "#F8F9FA" }} ref={sec7Ref}>
        <div className="boa-container">
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={sec7InView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              style={{
                fontFamily: "var(--font-syne)",
                fontSize: 32,
                fontWeight: 700,
                color: "var(--boa-navy)",
                textAlign: "center",
                marginBottom: 48,
                letterSpacing: "-0.02em",
              }}
            >
              Transfer questions answered.
            </motion.h2>
            <FaqAccordion faqs={FAQS} />
          </div>
        </div>
      </section>

      <EditorialBanner
        headline="Send money anywhere. Today."
        subtext="Open a Bank of Asia account in minutes and start sending international transfers with transparent fees and real exchange rates."
        ctaText="Open an Account"
        ctaHref="/register"
        ctaText2="View Fee Schedule"
        ctaHref2="/international#fees"
      />
    </>
  );
}
