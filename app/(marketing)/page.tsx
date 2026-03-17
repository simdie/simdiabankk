"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

/* ── Icons ─────────────────────────────────────────────────── */
function IconBank() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
      <path d="M15 3L28 11H2L15 3Z" fill="currentColor" />
      <rect x="5" y="13" width="4" height="11" fill="currentColor" opacity="0.85" />
      <rect x="13" y="13" width="4" height="11" fill="currentColor" opacity="0.85" />
      <rect x="21" y="13" width="4" height="11" fill="currentColor" opacity="0.85" />
      <rect x="2" y="24" width="26" height="2.5" rx="1" fill="currentColor" />
    </svg>
  );
}
function IconCard() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
      <rect x="2" y="7" width="26" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
      <rect x="2" y="12" width="26" height="4" fill="currentColor" opacity="0.25" />
      <rect x="6" y="19" width="8" height="2" rx="1" fill="currentColor" />
      <circle cx="23" cy="20" r="2.8" fill="currentColor" opacity="0.55" />
      <circle cx="20" cy="20" r="2.8" fill="currentColor" opacity="0.35" />
    </svg>
  );
}
function IconGlobe() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
      <circle cx="15" cy="15" r="12" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="15" cy="15" rx="5" ry="12" stroke="currentColor" strokeWidth="1.5" />
      <line x1="3" y1="15" x2="27" y2="15" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 9.5C8 11 12 12 15 12C18 12 22 11 25 9.5" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      <path d="M5 20.5C8 19 12 18 15 18C18 18 22 19 25 20.5" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
    </svg>
  );
}
function IconBriefcase() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
      <rect x="3" y="11" width="24" height="16" rx="2.5" stroke="currentColor" strokeWidth="2" />
      <path d="M10 11V9C10 7.9 10.9 7 12 7H18C19.1 7 20 7.9 20 9V11" stroke="currentColor" strokeWidth="2" />
      <line x1="3" y1="19" x2="27" y2="19" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <rect x="13" y="17" width="4" height="4" rx="1" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

/* ── Motion variants ────────────────────────────────────────── */
const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};
const heroChild = {
  hidden:  { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ── Data ───────────────────────────────────────────────────── */
const CURRENCIES = [
  { flag: "🇺🇸", name: "US Dollar",          code: "USD" },
  { flag: "🇦🇺", name: "Australian Dollar",   code: "AUD" },
  { flag: "🇪🇺", name: "Euro",                code: "EUR" },
  { flag: "🇬🇧", name: "British Pound",       code: "GBP" },
  { flag: "🇯🇵", name: "Japanese Yen",        code: "JPY" },
  { flag: "🇸🇬", name: "Singapore Dollar",    code: "SGD" },
  { flag: "🇭🇰", name: "Hong Kong Dollar",    code: "HKD" },
  { flag: "🇨🇦", name: "Canadian Dollar",     code: "CAD" },
  { flag: "🇨🇭", name: "Swiss Franc",         code: "CHF" },
  { flag: "🇳🇿", name: "New Zealand Dollar",  code: "NZD" },
];

const STATS = [
  { value: "$2.4B+",  label: "Total Volume Processed", color: "var(--boa-teal)" },
  { value: "50K+",    label: "Active Customers",        color: "var(--boa-gold)" },
  { value: "10",      label: "Currencies Supported",    color: "var(--boa-teal)" },
  { value: "99.97%",  label: "Platform Uptime",         color: "var(--boa-gold)" },
];

const PRODUCT_CARDS = [
  {
    Icon: IconBank,
    title: "Personal Accounts",
    body: "Current accounts, savings, and term deposits in multiple currencies. No monthly fees.",
    features: ["No monthly fees", "Multi-currency", "Instant access"],
    cta: "Explore accounts →",
    href: "/personal/accounts",
  },
  {
    Icon: IconCard,
    title: "VISA & Mastercard",
    body: "Virtual cards for online payments. Generate instantly, freeze anytime. Full CVV details.",
    features: ["Instant issuance", "Full CVV details", "Free"],
    cta: "See our cards →",
    href: "/personal/cards",
  },
  {
    Icon: IconGlobe,
    title: "International Transfers",
    body: "SWIFT and SEPA wire transfers to 180+ countries. Transparent fees. Full tracking.",
    features: ["180+ countries", "SWIFT/SEPA", "Full tracking"],
    cta: "Transfer money →",
    href: "/international",
  },
  {
    Icon: IconBriefcase,
    title: "Business Banking",
    body: "Business accounts, FX solutions, and payment tools for companies of all sizes.",
    features: ["Business accounts", "FX solutions", "API access"],
    cta: "Business banking →",
    href: "/business",
  },
];

const FEATURES = [
  {
    title: "Multi-Currency Accounts",
    desc: "Hold and transact in 10 currencies with real interbank rates. USD, GBP, EUR, AUD, CAD, CHF, JPY, CNY, AED.",
  },
  {
    title: "Military-Grade Security",
    desc: "256-bit TLS encryption, TOTP 2FA, admin-controlled transfer policies, and full immutable audit logs.",
  },
  {
    title: "Instant Internal Transfers",
    desc: "Send to any Bank of Asia account globally in seconds. Zero fees. Real-time settlement.",
  },
  {
    title: "Official PDF Transaction Receipts",
    desc: "Download or email official receipts for every transaction. Compliance-ready. Professional format.",
  },
];

const RATE_CARDS = [
  {
    rate: "4.75% p.a.",
    title: "High-Interest Savings",
    sub: "Variable rate · No lock-in · No minimum",
    cta: "Open Savings Account",
    href: "/personal/accounts",
  },
  {
    rate: "5.10% p.a.",
    title: "12-Month Term Deposit",
    sub: "Fixed rate · Guaranteed return · From $1,000",
    cta: "Open Term Deposit",
    href: "/personal/accounts",
  },
  {
    rate: "From 8.99% p.a.",
    title: "Personal Loan",
    sub: "Fixed rate · Flexible terms · No hidden fees",
    cta: "Apply for Loan",
    href: "/personal",
  },
];

const SECURITY_ROWS = [
  {
    title: "256-bit SSL Encryption",
    desc: "All data in transit and at rest is protected with bank-grade TLS encryption standards.",
    Icon: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2L4 6V12C4 16.418 7.582 20.418 12 22C16.418 20.418 20 16.418 20 12V6L12 2Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round"/>
        <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "TOTP Two-Factor Authentication",
    desc: "Time-based one-time passwords via any authenticator app. Every login, every time.",
    Icon: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.75"/>
        <circle cx="12" cy="15" r="1.5" fill="currentColor"/>
        <rect x="8" y="7" width="8" height="1.5" rx="0.75" fill="currentColor" opacity="0.5"/>
        <path d="M10 11.5C10 10.395 10.895 9.5 12 9.5C13.105 9.5 14 10.395 14 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "Full Immutable Audit Logs",
    desc: "Every action, transfer, and login is logged with timestamps and IP addresses. Nothing is hidden.",
    Icon: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.75"/>
        <line x1="8" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="8" y1="16" x2="12" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "Admin-Controlled Transfer Policies",
    desc: "Transfer limits, email confirmations, and token gates — configurable by our compliance team.",
    Icon: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75"/>
        <path d="M12 2V4M12 20V22M2 12H4M20 12H22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const NEWS = [
  { category: "Product Update", title: "Bank of Asia expands multi-currency support to 10 currencies", date: "March 2026",   href: "/news" },
  { category: "Security",       title: "How to protect your account: 2FA best practices",              date: "February 2026", href: "/news" },
  { category: "Education",      title: "Understanding SWIFT transfers: a complete guide",              date: "January 2026",  href: "/news" },
];

const MARQUEE_CURRENCIES = [
  { flag: "🇺🇸", name: "US Dollar",          code: "USD" },
  { flag: "🇬🇧", name: "British Pound",       code: "GBP" },
  { flag: "🇪🇺", name: "Euro",                code: "EUR" },
  { flag: "🇦🇺", name: "Australian Dollar",   code: "AUD" },
  { flag: "🇨🇦", name: "Canadian Dollar",     code: "CAD" },
  { flag: "🇨🇭", name: "Swiss Franc",         code: "CHF" },
  { flag: "🇯🇵", name: "Japanese Yen",        code: "JPY" },
  { flag: "🇨🇳", name: "Chinese Yuan",        code: "CNY" },
  { flag: "🇦🇪", name: "UAE Dirham",          code: "AED" },
];

/* ── Stat item with viewport trigger ───────────────────────── */
function StatItem({ value, label, color, isLast }: {
  value: string; label: string; color: string; isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  return (
    <div
      ref={ref}
      className="flex-1 flex flex-col items-center text-center py-8 sm:py-0 px-6"
      style={!isLast ? { borderRight: "1px solid rgba(255,255,255,0.08)" } : undefined}
    >
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          fontSize: "clamp(36px, 4vw, 48px)",
          fontFamily: "var(--font-mono, JetBrains Mono, monospace)",
          color,
          lineHeight: 1,
          marginBottom: 8,
        }}
      >
        {value}
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.45)",
          fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        {label}
      </motion.p>
    </div>
  );
}

/* ── CARD STYLES (reused) ──────────────────────────────────── */
const glassCard: React.CSSProperties = {
  backgroundColor: "rgba(255,255,255,0.07)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 20,
};
const glassCardSmall: React.CSSProperties = {
  backgroundColor: "rgba(255,255,255,0.07)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 14,
};

/* ── RateCard (Section 4) ───────────────────────────────────── */
function RateCard({ card }: { card: typeof RATE_CARDS[0] }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } } }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "rgba(255,255,255,0.05)",
        border: hovered ? "1px solid rgba(0,200,150,0.4)" : "1px solid rgba(255,255,255,0.1)",
        boxShadow: hovered ? "0 0 30px rgba(0,200,150,0.1)" : "none",
        borderRadius: 20,
        padding: "36px 32px",
        display: "flex", flexDirection: "column", gap: 0,
        transition: "all 0.3s",
      }}
    >
      <p style={{
        fontSize: 52, lineHeight: 1, marginBottom: 16,
        fontFamily: "var(--font-mono, JetBrains Mono, monospace)",
        background: "linear-gradient(135deg, #00C896, #00A87E)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        fontWeight: 400,
      }}>{card.rate}</p>
      <p style={{
        fontSize: 16, fontWeight: 500, color: "white", marginBottom: 8,
        fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
      }}>{card.title}</p>
      <p style={{
        fontSize: 14, color: "rgba(255,255,255,0.45)",
        fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)", marginBottom: 28,
        flexGrow: 1,
      }}>{card.sub}</p>
      <Link
        href={card.href}
        className="inline-flex items-center justify-center rounded-lg font-semibold text-white transition-all"
        style={{
          backgroundColor: "var(--boa-teal)",
          padding: "12px 24px", fontSize: 14,
          fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--boa-teal-dim)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--boa-teal)")}
      >{card.cta}</Link>
    </motion.div>
  );
}

/* ── WhyFeatureRow (Section 5) ─────────────────────────────── */
function WhyFeatureRow({ feature, delay, isLast }: { feature: typeof FEATURES[0]; delay: number; isLast: boolean }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <motion.div
      whileInView={{ opacity: 1, x: 0 }}
      initial={{ opacity: 0, x: 30 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderLeft: hovered ? "3px solid #00C896" : "3px solid transparent",
        borderBottom: isLast ? "none" : "1px solid var(--boa-gray-200)",
        paddingLeft: 24,
        paddingTop: 28,
        paddingBottom: 28,
        transition: "border-left 0.3s",
      }}
    >
      <h3 style={{
        fontSize: 17, fontWeight: 600, color: "var(--boa-navy)", marginBottom: 8,
        fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
      }}>{feature.title}</h3>
      <p style={{
        fontSize: 15, color: "var(--boa-muted)", lineHeight: 1.65,
        fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
      }}>{feature.desc}</p>
    </motion.div>
  );
}

/* ── CalcCard (Section 8) ───────────────────────────────────── */
function CalcCard({ card }: { card: { emoji: string; title: string; desc: string; href: string } }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <Link
      href={card.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        backgroundColor: hovered ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 16,
        padding: 24,
        transition: "background-color 0.25s",
        textDecoration: "none",
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 14 }}>{card.emoji}</div>
      <h3 style={{
        fontSize: 16, fontWeight: 600, color: "white", marginBottom: 8,
        fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
      }}>{card.title}</h3>
      <p style={{
        fontSize: 14, color: "rgba(255,255,255,0.5)",
        fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)", lineHeight: 1.6,
      }}>{card.desc}</p>
    </Link>
  );
}

/* ── NewsCard (Section 9) ───────────────────────────────────── */
function NewsCard({ item }: { item: typeof NEWS[0] }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "white",
        border: "1px solid var(--boa-gray-200)",
        borderRadius: 12,
        padding: 28,
        boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.08)" : "none",
        transition: "box-shadow 0.3s",
      }}
    >
      <span style={{
        display: "inline-block", fontSize: 11, fontWeight: 600,
        textTransform: "uppercase", letterSpacing: "0.08em",
        padding: "4px 12px", borderRadius: 999, marginBottom: 16,
        backgroundColor: "rgba(0,200,150,0.08)", color: "var(--boa-teal)",
        fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
      }}>{item.category}</span>
      <h3 style={{
        fontSize: 15, fontWeight: 600, color: "var(--boa-navy)",
        lineHeight: 1.45, marginBottom: 10,
        fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
      }}>{item.title}</h3>
      <p style={{
        fontSize: 12, color: "var(--boa-muted)", marginBottom: 18,
        fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
      }}>{item.date}</p>
      <Link href={item.href} style={{
        fontSize: 13, fontWeight: 600, color: "var(--boa-teal)",
        fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
        textDecoration: "underline", textUnderlineOffset: "3px",
      }}>Read more →</Link>
    </article>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <>
      {/* ══════════════════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════════════════ */}
      <section
        style={{ backgroundColor: "var(--boa-navy)", minHeight: "100vh" }}
        className="flex items-center py-24 overflow-hidden relative"
      >
        {/* Subtle dot-grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Ambient radial gradient, bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: "40%",
            background: "radial-gradient(ellipse at 50% 100%, rgba(0,200,150,0.06) 0%, transparent 70%)",
          }}
        />

        <div className="boa-container w-full relative">
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-8 items-center">

            {/* ── LEFT: Stagger reveal ── */}
            <motion.div
              variants={heroContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-7"
            >
              {/* 1. Badge */}
              <motion.div variants={heroChild}>
                <span
                  className="inline-flex items-center gap-2 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: "rgba(0,200,150,0.1)",
                    border: "1px solid rgba(0,200,150,0.28)",
                    color: "var(--boa-teal)",
                    padding: "7px 16px",
                    fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
                  }}
                >
                  🌏 Trusted across Asia-Pacific · 50,000+ customers
                </span>
              </motion.div>

              {/* 2. H1 */}
              <motion.h1
                variants={heroChild}
                style={{
                  fontFamily: "var(--font-syne, Syne, sans-serif)",
                  fontSize: "clamp(40px, 5.5vw, 72px)",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                  color: "white",
                  margin: 0,
                }}
              >
                Banking that works
                <br />
                for your{" "}
                <span className="text-gradient-teal">whole life.</span>
              </motion.h1>

              {/* 3. Body */}
              <motion.p
                variants={heroChild}
                style={{
                  fontSize: 18,
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
                  lineHeight: 1.75,
                  maxWidth: 500,
                  margin: 0,
                }}
              >
                From everyday accounts to international wire transfers — Bank of Asia gives you
                the security, multi-currency tools, and global reach you need at every stage of life.
              </motion.p>

              {/* 4. CTAs */}
              <motion.div variants={heroChild} className="flex flex-wrap gap-4">
                <Link
                  href="/register" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg font-semibold text-white transition-all"
                  style={{
                    backgroundColor: "var(--boa-teal)",
                    padding: "14px 32px",
                    fontSize: 16,
                    fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--boa-teal-dim)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--boa-teal)")}
                >
                  Open an Account <span aria-hidden>→</span>
                </Link>
                <Link
                  href="/personal"
                  className="inline-flex items-center rounded-lg font-medium text-white transition-all"
                  style={{
                    border: "1.5px solid rgba(255,255,255,0.3)",
                    padding: "14px 32px",
                    fontSize: 16,
                    fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.07)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  Explore products
                </Link>
              </motion.div>

              {/* 5. Trust row */}
              <motion.div variants={heroChild} className="flex flex-col gap-3">
                <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.1)", maxWidth: 420 }} />
                <div className="flex flex-wrap gap-6">
                  {["No monthly fees", "10 currencies", "2FA protected"].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <span style={{ color: "var(--boa-teal)", fontSize: 14, fontWeight: 700 }}>✓</span>
                      <span style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)" }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* ── RIGHT: Floating dashboard ── */}
            <div className="hidden lg:flex justify-end">
              <div className="relative" style={{ width: 480, height: 560 }}>

                {/* Background teal grid */}
                <div
                  className="absolute inset-0 pointer-events-none hero-grid-bg"
                  style={{ borderRadius: 24, zIndex: 0 }}
                />

                {/* Slow-spinning dashed ring */}
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
                      border: "1px dashed rgba(0,200,150,0.15)",
                      borderRadius: "50%",
                      animation: "spin-slow 20s linear infinite",
                    }}
                  />
                </div>

                {/* Blinker dots */}
                {[
                  { top: "8%",  left: "6%"  },
                  { top: "48%", right: "4%" },
                  { bottom: "12%", left: "22%" },
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
                      animation: `blinker-dot ${2 + i * 0.4}s ease-in-out ${i * 0.6}s infinite`,
                      boxShadow: "0 0 8px rgba(0,200,150,0.8)",
                      zIndex: 1,
                      pointerEvents: "none",
                    }}
                  />
                ))}

                {/* Glow 1 — teal */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: "absolute", width: 280, height: 280,
                    top: "28%", left: "12%", borderRadius: "50%",
                    backgroundColor: "rgba(0,200,150,0.1)", filter: "blur(64px)", zIndex: 0,
                    pointerEvents: "none",
                  }}
                />
                {/* Glow 2 — gold */}
                <motion.div
                  animate={{ scale: [1, 1.18, 1] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                  style={{
                    position: "absolute", width: 200, height: 200,
                    top: "5%", right: "5%", borderRadius: "50%",
                    backgroundColor: "rgba(200,151,42,0.09)", filter: "blur(50px)", zIndex: 0,
                    pointerEvents: "none",
                  }}
                />

                {/* Security badge (top-left) */}
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: "absolute", top: 28, left: 8, zIndex: 30,
                    backgroundColor: "var(--boa-teal)",
                    borderRadius: 20, padding: "6px 13px",
                    display: "flex", alignItems: "center", gap: 6,
                    boxShadow: "0 4px 24px rgba(0,200,150,0.45)",
                  }}
                >
                  <span style={{ fontSize: 12 }}>🔒</span>
                  <span style={{
                    fontSize: 11, fontWeight: 600, color: "white",
                    fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)", whiteSpace: "nowrap",
                  }}>
                    Secured by 2FA
                  </span>
                </motion.div>

                {/* Floating card 1 — GBP (top-right, rotate 6deg) */}
                <motion.div
                  animate={{ y: [0, -8, 0], rotate: [6, 8, 6] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: "absolute", top: 10, right: 0, zIndex: 20,
                    width: 176, ...glassCardSmall,
                    padding: "14px 16px",
                    boxShadow: "0 20px 48px rgba(0,0,0,0.45)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{
                      fontSize: 10, color: "rgba(255,255,255,0.5)",
                      fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
                      fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase",
                    }}>GBP Account</span>
                    <span style={{ fontSize: 15 }}>🇬🇧</span>
                  </div>
                  <p style={{
                    fontSize: 23, fontFamily: "var(--font-mono, JetBrains Mono, monospace)",
                    color: "white", fontWeight: 400, margin: 0,
                  }}>£8,420.00</p>
                  <p style={{
                    fontSize: 10, color: "rgba(255,255,255,0.3)",
                    fontFamily: "var(--font-mono, JetBrains Mono, monospace)",
                    letterSpacing: "0.1em", marginTop: 4,
                  }}>•••• •••• 7734</p>
                </motion.div>

                {/* Main dashboard card */}
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: "absolute", top: 88, left: 18, right: 26, zIndex: 10,
                    ...glassCard,
                    padding: 24,
                    boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)",
                  }}
                >
                  {/* Header */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, color: "var(--boa-teal)",
                      fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
                      textTransform: "uppercase", letterSpacing: "0.08em",
                    }}>Current Account</span>
                    <span style={{
                      display: "flex", alignItems: "center", gap: 5,
                      fontSize: 11, color: "var(--boa-teal)",
                      fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
                    }}>
                      <span style={{
                        width: 7, height: 7, borderRadius: "50%",
                        backgroundColor: "var(--boa-teal)",
                        boxShadow: "0 0 8px var(--boa-teal)",
                        display: "inline-block",
                        animation: "pulse-glow 2s ease-in-out infinite",
                      }} />
                      Active
                    </span>
                  </div>

                  {/* Balance */}
                  <p style={{
                    fontSize: 36, fontFamily: "var(--font-mono, JetBrains Mono, monospace)",
                    color: "white", fontWeight: 400, lineHeight: 1,
                    letterSpacing: "-0.02em", marginBottom: 6,
                  }}>USD 24,890.00</p>
                  <p style={{
                    fontSize: 13, fontFamily: "var(--font-mono, JetBrains Mono, monospace)",
                    color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", marginBottom: 20,
                  }}>•••• •••• •••• 4821</p>

                  {/* Action pills */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
                    {["Send", "Receive", "Convert"].map((action) => (
                      <div key={action} style={{
                        textAlign: "center", padding: "8px 0",
                        borderRadius: 10, fontSize: 13, fontWeight: 500, color: "white",
                        backgroundColor: "rgba(255,255,255,0.09)",
                        fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
                      }}>{action}</div>
                    ))}
                  </div>

                  <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.07)", marginBottom: 16 }} />

                  {/* Transactions */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      { label: "Wire Transfer Received",  amount: "+$4,200.00", pos: true  },
                      { label: "International Transfer",  amount: "−$1,800.00", pos: false },
                      { label: "Internal Deposit",        amount: "+$500.00",   pos: true  },
                    ].map((tx) => (
                      <div key={tx.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                          <span style={{ fontSize: 13, color: tx.pos ? "var(--boa-teal)" : "rgba(255,255,255,0.35)", flexShrink: 0 }}>
                            {tx.pos ? "↑" : "↓"}
                          </span>
                          <span style={{
                            fontSize: 12.5, color: "rgba(255,255,255,0.55)",
                            fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          }}>{tx.label}</span>
                        </div>
                        <span style={{
                          fontSize: 12.5, fontWeight: 600,
                          color: tx.pos ? "var(--boa-teal)" : "rgba(255,255,255,0.4)",
                          fontFamily: "var(--font-mono, JetBrains Mono, monospace)",
                          flexShrink: 0, marginLeft: 8,
                        }}>{tx.amount}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Floating card 2 — Transfer (bottom-left, rotate -4deg) */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                  style={{
                    position: "absolute", bottom: 28, left: 0, zIndex: 20,
                    width: 162, ...glassCardSmall,
                    padding: "14px 16px",
                    transform: "rotate(-4deg)",
                    boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                    <span style={{
                      width: 18, height: 18, borderRadius: "50%",
                      backgroundColor: "rgba(0,200,150,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, flexShrink: 0, color: "var(--boa-teal)",
                    }}>✓</span>
                    <span style={{
                      fontSize: 11, color: "var(--boa-teal)", fontWeight: 600,
                      fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
                    }}>Transfer Sent</span>
                  </div>
                  <p style={{
                    fontSize: 21, fontFamily: "var(--font-mono, JetBrains Mono, monospace)",
                    color: "white", margin: 0,
                  }}>−$2,000</p>
                  <p style={{
                    fontSize: 10, color: "rgba(255,255,255,0.3)",
                    fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
                    letterSpacing: "0.1em", marginTop: 4,
                  }}>SWIFT · Completed</p>
                </motion.div>

              </div>
            </div>
            {/* ── End right panel ── */}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 2 — STATS BAR
      ══════════════════════════════════════════════════════ */}
      <section
        style={{
          backgroundColor: "#0F2040",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
        className="py-14"
      >
        <div className="boa-container">
          <div className="flex flex-col sm:flex-row">
            {STATS.map((stat, i) => (
              <StatItem
                key={stat.label}
                value={stat.value}
                label={stat.label}
                color={stat.color}
                isLast={i === STATS.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 3 — PRODUCT CATEGORY CARDS
      ══════════════════════════════════════════════════════ */}
      <section className="boa-section" style={{ backgroundColor: "white" }}>
        <div className="boa-container">
          {/* Header */}
          <div className="text-center mb-14">
            <p style={{
              color: "var(--boa-teal)", fontSize: 11, fontWeight: 600,
              letterSpacing: "0.18em", textTransform: "uppercase",
              fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)", marginBottom: 12,
            }}>OUR PRODUCTS</p>
            <h2 style={{
              fontFamily: "var(--font-syne, Syne, sans-serif)",
              fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700,
              color: "var(--boa-navy)", letterSpacing: "-0.02em", marginBottom: 12,
            }}>What would you like to do today?</h2>
            <p style={{
              fontSize: 16, color: "var(--boa-muted)",
              fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
            }}>Complete banking solutions for every stage of life.</p>
          </div>

          {/* 2×2 grid */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {PRODUCT_CARDS.map((card) => {
              const CardIcon = card.Icon;
              return (
                <motion.div
                  key={card.title}
                  variants={fadeUp}
                  whileHover={{ y: -4, boxShadow: "0 24px 64px rgba(0,0,0,0.09)" }}
                  className="rounded-2xl p-8 bg-white border"
                  style={{ borderColor: "var(--boa-gray-200)", transition: "box-shadow 0.3s" }}
                >
                  <div style={{
                    width: 56, height: 56, borderRadius: 14, marginBottom: 24,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    backgroundColor: "rgba(0,200,150,0.08)", color: "var(--boa-teal)",
                  }}>
                    <CardIcon />
                  </div>
                  <h3 style={{
                    fontFamily: "var(--font-syne, Syne, sans-serif)",
                    fontSize: 20, fontWeight: 600, color: "var(--boa-navy)", marginBottom: 10,
                  }}>{card.title}</h3>
                  <p style={{
                    fontSize: 15, color: "var(--boa-muted)", lineHeight: 1.65, marginBottom: 16,
                    fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
                  }}>{card.body}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                    {card.features.map((feat) => (
                      <span key={feat} style={{
                        backgroundColor: "var(--boa-gray-100)", color: "var(--boa-gray-600)",
                        borderRadius: 999, fontSize: 12, fontWeight: 500, padding: "4px 12px",
                        fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
                      }}>{feat}</span>
                    ))}
                  </div>
                  <Link href={card.href} style={{
                    color: "var(--boa-teal)", fontSize: 14, fontWeight: 600,
                    fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
                  }}>{card.cta}</Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 4 — RATES HIGHLIGHT
      ══════════════════════════════════════════════════════ */}
      <section className="boa-section" style={{ backgroundColor: "#0A1628" }}>
        <div className="boa-container">
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 48 }}>
            <div>
              <p style={{
                fontSize: 11, fontWeight: 600, color: "var(--boa-gold)",
                letterSpacing: "0.18em", textTransform: "uppercase",
                fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)", marginBottom: 12,
              }}>LIVE RATES</p>
              <h2 style={{
                fontFamily: "var(--font-syne, Syne, sans-serif)",
                fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 700,
                color: "white", letterSpacing: "-0.02em", marginBottom: 12, lineHeight: 1.1,
              }}>Competitive rates. Always.</h2>
              <p style={{
                fontSize: 18, color: "rgba(255,255,255,0.55)",
                fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
              }}>Our current rates — reviewed monthly.</p>
            </div>
            <Link href="/interest-rates" style={{
              fontSize: 14, fontWeight: 600, color: "var(--boa-teal)",
              fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
              textDecoration: "underline", textUnderlineOffset: "4px", whiteSpace: "nowrap",
            }}>View all rates →</Link>
          </div>

          {/* Rate cards */}
          <motion.div
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {RATE_CARDS.map((r) => (
              <RateCard key={r.title} card={r} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 4.5 — EDITORIAL IMAGE BANNER
      ══════════════════════════════════════════════════════ */}

      {/* Image section — clean full-width, no overlay */}
      <section
        style={{
          marginTop: "clamp(56px, 7vw, 96px)",
          marginBottom: "clamp(56px, 7vw, 96px)",
          overflow: "hidden",
        }}
      >
        <Image
          src="/homepage-image1.png"
          alt="Bank of Asia customers"
          width={1920}
          height={600}
          style={{
            width: "100%",
            height: "clamp(280px, 35vw, 500px)",
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
          }}
          priority={false}
        />
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 5 — WHY BANK OF ASIA
      ══════════════════════════════════════════════════════ */}
      <section className="boa-section" style={{ backgroundColor: "#F8F9FA" }}>
        <div className="boa-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Sticky left */}
            <div className="lg:sticky" style={{ top: 96 }}>
              <p style={{
                fontSize: 11, fontWeight: 600, color: "var(--boa-teal)",
                letterSpacing: "0.18em", textTransform: "uppercase",
                fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)", marginBottom: 12,
              }}>WHY CHOOSE US</p>
              <h2 style={{
                fontFamily: "var(--font-syne, Syne, sans-serif)",
                fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700,
                color: "var(--boa-navy)", letterSpacing: "-0.02em", marginBottom: 20, lineHeight: 1.15,
              }}>Banking built on trust and transparency.</h2>
              <p style={{
                fontSize: 16, color: "var(--boa-muted)", lineHeight: 1.75,
                fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)", maxWidth: 380, marginBottom: 28,
              }}>
                We combine the technology of modern fintech with the security and reliability of a licensed financial institution.
              </p>
              <Link href="/about" style={{
                fontSize: 14, fontWeight: 600, color: "var(--boa-navy)",
                fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
                textDecoration: "underline", textUnderlineOffset: "4px",
              }}>Learn our story →</Link>
            </div>

            {/* Scrolling right — feature rows */}
            <div className="flex flex-col gap-0">
              {FEATURES.map((f, i) => (
                <WhyFeatureRow key={f.title} feature={f} delay={i * 0.1} isLast={i === FEATURES.length - 1} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 6 — CURRENCY MARQUEE
      ══════════════════════════════════════════════════════ */}
      <section className="py-12 overflow-hidden" style={{ backgroundColor: "white" }}>
        <p style={{
          textAlign: "center", fontSize: 24, fontWeight: 700,
          fontFamily: "var(--font-syne, Syne, sans-serif)",
          color: "var(--boa-navy)", marginBottom: 32,
        }}>Banking in your currency</p>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to right, white, transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to left, white, transparent)" }} />
          <div className="boa-marquee-wrap">
            <div className="boa-marquee-track flex whitespace-nowrap">
              {[...MARQUEE_CURRENCIES, ...MARQUEE_CURRENCIES].map((c, i) => (
                <div key={`${c.code}-${i}`} className="flex items-center shrink-0 min-w-max" style={{ padding: "0 24px" }}>
                  <span className="text-xl mr-2" role="img" aria-label={c.name}>{c.flag}</span>
                  <span style={{ fontSize: 15, color: "var(--boa-text)", fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)", fontWeight: 500 }}>{c.name}</span>
                  <span style={{ fontSize: 15, color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)", marginLeft: 6 }}>({c.code})</span>
                  <span style={{ color: "var(--boa-gold)", margin: "0 20px", fontSize: 16, fontWeight: 700 }} aria-hidden>·</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 7 — SECURITY ASSURANCE
      ══════════════════════════════════════════════════════ */}
      <section className="boa-section" style={{ backgroundColor: "#0A1628" }}>
        <div className="boa-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* LEFT */}
            <div>
              <h2 style={{
                fontFamily: "var(--font-syne, Syne, sans-serif)",
                fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700,
                color: "white", letterSpacing: "-0.025em",
                lineHeight: 1.1, marginBottom: 20,
              }}>Your money is protected.</h2>
              <p style={{
                fontSize: 16, color: "rgba(255,255,255,0.55)", lineHeight: 1.75,
                fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)", maxWidth: 420, marginBottom: 28,
              }}>
                Our security architecture is built to the same standards as the world&apos;s leading
                financial institutions. Every connection is encrypted. Every account is monitored.
                Every action is logged.
              </p>
              <Link href="/security" style={{
                color: "var(--boa-teal)", fontSize: 14, fontWeight: 600,
                fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
                textDecoration: "underline", textUnderlineOffset: "4px",
              }}>Learn about security →</Link>

              {/* 2×2 security stat pills */}
              <div className="grid grid-cols-2 gap-3 mt-10" style={{ maxWidth: 380 }}>
                {["256-bit SSL", "TOTP 2FA", "Audit Logs", "Admin Controls"].map((label) => (
                  <div key={label} style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(0,200,150,0.35)",
                    borderRadius: 10,
                    padding: "10px 16px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--boa-teal)",
                    fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
                    textAlign: "center",
                  }}>{label}</div>
                ))}
              </div>
            </div>

            {/* RIGHT — 4 security rows with inline SVG icons */}
            <div className="flex flex-col gap-6">
              {SECURITY_ROWS.map((row, i) => (
                <motion.div
                  key={row.title}
                  whileInView={{ opacity: 1, x: 0 }}
                  initial={{ opacity: 0, x: 30 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className="flex gap-5"
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                    backgroundColor: "rgba(0,200,150,0.1)",
                    border: "1px solid rgba(0,200,150,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--boa-teal)",
                  }}>
                    <row.Icon />
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: 15, fontWeight: 600, color: "white",
                      marginBottom: 4, fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
                    }}>{row.title}</h3>
                    <p style={{
                      fontSize: 14, color: "rgba(255,255,255,0.5)",
                      lineHeight: 1.65, fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
                    }}>{row.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 8 — CALCULATORS CTA
      ══════════════════════════════════════════════════════ */}
      <section className="py-16" style={{ background: "linear-gradient(135deg, #0F2040, #162B52)" }}>
        <div className="boa-container">
          <div className="text-center mb-12">
            <h2 style={{
              fontFamily: "var(--font-syne, Syne, sans-serif)",
              fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700,
              color: "white", letterSpacing: "-0.02em", marginBottom: 10,
            }}>Plan your finances</h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)" }}>
              Use our free calculators.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { emoji: "💰", title: "Savings Planner",    desc: "Project your savings growth with compounding interest over time.", href: "/tools" },
              { emoji: "🏠", title: "Loan Repayment",     desc: "Calculate monthly repayments and total cost of any loan.", href: "/tools" },
              { emoji: "💱", title: "Currency Converter", desc: "Convert between 10 currencies at real interbank rates.", href: "/tools" },
            ].map((c) => (
              <CalcCard key={c.title} card={c} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 9 — NEWS PREVIEW
      ══════════════════════════════════════════════════════ */}
      <section className="boa-section" style={{ backgroundColor: "#F8F9FA" }}>
        <div className="boa-container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 40 }}>
            <h2 style={{
              fontFamily: "var(--font-syne, Syne, sans-serif)",
              fontSize: "clamp(22px, 2.5vw, 32px)", fontWeight: 700, color: "var(--boa-navy)",
            }}>Latest from Bank of Asia</h2>
            <Link href="/news" style={{
              fontSize: 14, fontWeight: 500, color: "var(--boa-teal)",
              fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
              textDecoration: "underline", textUnderlineOffset: "3px",
            }}>View all news →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {NEWS.map((item) => (
              <NewsCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 10 — FINAL CTA BANNER
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 text-center" style={{ backgroundColor: "#0A1628" }}>
        <div className="boa-container" style={{ maxWidth: 680 }}>
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={{
              fontFamily: "var(--font-syne, Syne, sans-serif)",
              fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 700,
              color: "white", letterSpacing: "-0.03em", marginBottom: 16, lineHeight: 1.05,
            }}>Ready to get started?</h2>
            <p style={{
              fontSize: 18, color: "rgba(255,255,255,0.55)", marginBottom: 40, lineHeight: 1.75,
              fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
            }}>
              Join thousands of customers banking with confidence across Asia-Pacific.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", marginBottom: 32 }}>
              <Link href="/register" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg font-semibold text-white transition-all"
                style={{ backgroundColor: "var(--boa-teal)", padding: "16px 40px", fontSize: 17, fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--boa-teal-dim)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--boa-teal)")}
              >Open an Account</Link>
              <Link href="/contact"
                className="inline-flex items-center rounded-lg font-medium text-white transition-all"
                style={{ border: "1.5px solid rgba(255,255,255,0.3)", padding: "16px 40px", fontSize: 17, fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.07)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >Talk to Us</Link>
            </div>
            <p style={{
              fontSize: 13, color: "rgba(255,255,255,0.35)",
              fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
              letterSpacing: "0.08em",
            }}>No monthly fees · No minimum balance · Open in minutes</p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
