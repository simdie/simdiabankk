"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import FaqAccordion from "@/components/marketing/FaqAccordion";
import type { FaqItem } from "@/components/marketing/FaqAccordion";

/* ── Motion Variants ──────────────────────────────────────────── */
const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};
const heroChild = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ── Icons ────────────────────────────────────────────────────── */
function IconBuilding() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <rect x="9" y="13" width="2" height="4" />
      <rect x="13" y="13" width="2" height="4" />
      <rect x="9" y="8" width="2" height="2" />
      <rect x="13" y="8" width="2" height="2" />
    </svg>
  );
}

function IconPiggyBank() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M19 10c0-3.87-3.13-7-7-7S5 6.13 5 10c0 2.38 1.19 4.47 3 5.74V18h2v2h2v-2h2v-2h2v-2.26c1.81-1.27 3-3.36 3-5.74z" />
      <path d="M19 10h2a1 1 0 010 2h-2" />
      <circle cx="9.5" cy="9.5" r="0.8" fill="currentColor" stroke="none" />
      <path d="M12 4V3" strokeLinecap="round" />
    </svg>
  );
}

function IconCalendarLock() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <rect x="9" y="14" width="6" height="4" rx="1" />
      <path d="M11 14v-1.5a1 1 0 012 0V14" />
    </svg>
  );
}

function IconCardV() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <path d="M6 15h4M14 15h4" />
      <path d="M9 7l1.5 2.5L12 7l1.5 2.5L15 7" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function IconCardGlobe() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="2" y="5" width="13" height="9" rx="2" />
      <path d="M2 10h13" />
      <circle cx="18" cy="17" r="4" />
      <path d="M14 17h8" strokeWidth="1.3" />
      <ellipse cx="18" cy="17" rx="2" ry="4" strokeWidth="1.3" />
    </svg>
  );
}

function IconGlobeArrows() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="3.5" ry="9" strokeWidth="1.4" />
      <path d="M3 12h18" />
      <path
        d="M5 8.5C7.5 9.5 10 10 12 10s4.5-.5 7-1.5"
        strokeWidth="1.2"
        opacity="0.6"
      />
      <path
        d="M5 15.5C7.5 14.5 10 14 12 14s4.5.5 7 1.5"
        strokeWidth="1.2"
        opacity="0.6"
      />
      <path d="M18.5 5l2 2-2 2M5.5 19l-2-2 2-2" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/* ── Product Card ─────────────────────────────────────────────── */
interface Product {
  icon: React.ReactNode;
  title: string;
  desc: string;
  features: string[];
  cta: string;
  href: string;
  accent: string;
}

function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      variants={fadeUp}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "#fff",
        border: `1px solid ${hovered ? "rgba(0,200,150,0.3)" : "var(--boa-gray-200, #E5E7EB)"}`,
        borderRadius: 16,
        padding: 28,
        transition: "all 0.25s",
        boxShadow: hovered
          ? "0 8px 32px rgba(0,0,0,0.08)"
          : "0 1px 4px rgba(0,0,0,0.03)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          backgroundColor: `${product.accent}1A`,
          color: product.accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
          flexShrink: 0,
        }}
      >
        {product.icon}
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontWeight: 600,
          fontSize: 17,
          color: "var(--boa-navy)",
          marginBottom: 8,
          lineHeight: 1.3,
        }}
      >
        {product.title}
      </h3>

      {/* Desc */}
      <p
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: 14,
          color: "var(--boa-muted)",
          lineHeight: 1.65,
          marginBottom: 16,
          flex: 1,
        }}
      >
        {product.desc}
      </p>

      {/* Features */}
      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px 0" }}>
        {product.features.map((f, i) => (
          <li
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              color: "var(--boa-muted)",
              marginBottom: 5,
              fontFamily: "var(--font-dm-sans)",
            }}
          >
            <span style={{ color: "var(--boa-teal)", fontWeight: 700, lineHeight: 1 }}>✓</span>
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href={product.href}
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontWeight: 600,
          fontSize: 13,
          color: "var(--boa-teal)",
          textDecoration: "underline",
          textUnderlineOffset: 3,
        }}
      >
        {product.cta}
      </Link>
    </motion.div>
  );
}

/* ── Rate Row ─────────────────────────────────────────────────── */
interface RateRowData {
  type: string;
  rate: string;
  rateColor: string;
  rateWeight: number;
  freq: string;
  min: string;
  notes: string;
}

function RateRow({ row, even }: { row: RateRowData; even: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered
          ? "rgba(0,200,150,0.04)"
          : even
          ? "#fff"
          : "rgba(248,249,250,0.8)",
        transition: "background-color 0.2s",
      }}
    >
      <td
        style={{
          padding: "14px 20px",
          fontSize: 14,
          color: "var(--boa-navy)",
          fontFamily: "var(--font-dm-sans)",
          fontWeight: 500,
        }}
      >
        {row.type}
      </td>
      <td
        style={{
          padding: "14px 20px",
          fontSize: 14,
          fontFamily: "var(--font-mono)",
          color: row.rateColor,
          fontWeight: row.rateWeight,
        }}
      >
        {row.rate}
      </td>
      <td
        style={{
          padding: "14px 20px",
          fontSize: 14,
          color: "var(--boa-muted)",
          fontFamily: "var(--font-dm-sans)",
        }}
      >
        {row.freq}
      </td>
      <td
        style={{
          padding: "14px 20px",
          fontSize: 14,
          color: "var(--boa-muted)",
          fontFamily: "var(--font-dm-sans)",
        }}
      >
        {row.min}
      </td>
      <td
        style={{
          padding: "14px 20px",
          fontSize: 14,
          color: "var(--boa-muted)",
          fontFamily: "var(--font-dm-sans)",
        }}
      >
        {row.notes}
      </td>
    </tr>
  );
}

/* ── Data ─────────────────────────────────────────────────────── */
const PRODUCTS: Product[] = [
  {
    icon: <IconBuilding />,
    title: "Current Account",
    desc: "Your everyday transaction account. No monthly fees. No minimum balance.",
    features: ["No monthly fees", "Unlimited transactions", "Multi-currency support"],
    cta: "View account details →",
    href: "/personal/accounts",
    accent: "#00C896",
  },
  {
    icon: <IconPiggyBank />,
    title: "Savings Account",
    desc: "Earn 4.75% p.a. on your savings with no lock-in period.",
    features: ["4.75% p.a. variable", "No lock-in period", "No minimum balance"],
    cta: "View savings rates →",
    href: "/interest-rates",
    accent: "#C8972A",
  },
  {
    icon: <IconCalendarLock />,
    title: "Term Deposit",
    desc: "Lock in a fixed rate for 3, 6, or 12 months and earn up to 5.10% p.a.",
    features: ["Up to 5.10% p.a. fixed", "3, 6, or 12-month terms", "Guaranteed return"],
    cta: "View term deposits →",
    href: "/interest-rates",
    accent: "#C8972A",
  },
  {
    icon: <IconCardV />,
    title: "VISA Virtual Card",
    desc: "Instant virtual VISA for secure online payments. Freeze anytime.",
    features: ["Instant issuance", "Freeze anytime", "Zero issuance fee"],
    cta: "Get a virtual card →",
    href: "/personal/cards",
    accent: "#1A1F71",
  },
  {
    icon: <IconCardGlobe />,
    title: "Mastercard Virtual",
    desc: "A global virtual Mastercard with full CVV details and instant generation.",
    features: ["Accepted in 210+ countries", "Full CVV details", "Separate card per account"],
    cta: "Get a virtual card →",
    href: "/personal/cards",
    accent: "#EB001B",
  },
  {
    icon: <IconGlobeArrows />,
    title: "Multi-Currency Wallet",
    desc: "Hold and transact in 10 currencies from a single account at real interbank rates.",
    features: ["10 currencies supported", "Real interbank rates", "Instant FX conversion"],
    cta: "Explore currencies →",
    href: "/international",
    accent: "#00C896",
  },
];

const RATES: RateRowData[] = [
  {
    type: "High-Interest Savings",
    rate: "4.75% p.a.",
    rateColor: "var(--boa-teal)",
    rateWeight: 600,
    freq: "Monthly",
    min: "None",
    notes: "Variable rate, no lock-in",
  },
  {
    type: "Term Deposit 3 months",
    rate: "4.50% p.a.",
    rateColor: "var(--boa-teal)",
    rateWeight: 600,
    freq: "At maturity",
    min: "$1,000",
    notes: "Fixed term",
  },
  {
    type: "Term Deposit 6 months",
    rate: "4.80% p.a.",
    rateColor: "var(--boa-teal)",
    rateWeight: 600,
    freq: "At maturity",
    min: "$1,000",
    notes: "Fixed term",
  },
  {
    type: "Term Deposit 12 months",
    rate: "5.10% p.a.",
    rateColor: "var(--boa-gold)",
    rateWeight: 700,
    freq: "At maturity",
    min: "$1,000",
    notes: "Fixed term, highest rate",
  },
  {
    type: "Current Account",
    rate: "0.00%",
    rateColor: "var(--boa-muted)",
    rateWeight: 400,
    freq: "—",
    min: "None",
    notes: "Transaction account",
  },
];

const STEPS = [
  {
    n: 1,
    title: "Create your account",
    desc: "Fill in your personal details and verify your identity. Takes about 5 minutes.",
  },
  {
    n: 2,
    title: "Fund your account",
    desc: "Transfer funds from any bank. Supports SWIFT, SEPA, and local bank transfers.",
  },
  {
    n: 3,
    title: "Start banking",
    desc: "Access your account instantly. Order virtual cards, set up transfers, earn interest.",
  },
];

const FAQS: FaqItem[] = [
  {
    q: "Is Bank of Asia a licensed bank?",
    a: "Yes. Bank of Asia Online is a fully licensed and regulated digital financial institution. All deposits are held securely and accounts are subject to our full regulatory compliance framework.",
  },
  {
    q: "Are there any monthly account fees?",
    a: "No. All Bank of Asia personal accounts — including current accounts and savings accounts — have zero monthly fees. There are no minimum balance requirements either.",
  },
  {
    q: "How long does it take to open an account?",
    a: "Most accounts are opened within 5–10 minutes. You'll need to provide your name, email address, date of birth, and residential address. Identity verification is completed digitally.",
  },
  {
    q: "Can I hold multiple currencies?",
    a: "Yes. Bank of Asia supports 10 currencies: USD, GBP, EUR, AUD, CAD, CHF, JPY, CNY, and AED. You can hold balances in any or all of these currencies simultaneously.",
  },
  {
    q: "How do I earn interest on my savings?",
    a: "Simply open a Savings Account or Term Deposit. Interest is calculated daily on your closing balance and credited monthly (Savings) or at maturity (Term Deposit). No action required — it's automatic.",
  },
  {
    q: "What if I need to close my account?",
    a: "You can close your account at any time from your dashboard settings. Any remaining balance will be transferred to a nominated external account within 2 business days.",
  },
];

/* ── Page ─────────────────────────────────────────────────────── */
export default function PersonalPage() {
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
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Dot-grid overlay */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div
          className="boa-container"
          style={{ position: "relative", zIndex: 1, width: "100%" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 48,
              alignItems: "center",
            }}
            className="lg:grid-personal-hero"
          >
            {/* ── LEFT ── */}
            <motion.div
              variants={heroContainer}
              initial="hidden"
              animate="visible"
              style={{ display: "flex", flexDirection: "column", gap: 24 }}
            >
              {/* Eyebrow pill */}
              <motion.div variants={heroChild}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "6px 14px",
                    borderRadius: 999,
                    backgroundColor: "rgba(0,200,150,0.1)",
                    border: "1px solid rgba(0,200,150,0.28)",
                    fontSize: 11,
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    color: "var(--boa-teal)",
                    textTransform: "uppercase",
                  }}
                >
                  Personal Banking
                </span>
              </motion.div>

              {/* H1 */}
              <motion.h1
                variants={heroChild}
                style={{
                  fontFamily: "var(--font-syne)",
                  fontSize: "clamp(40px, 5.5vw, 64px)",
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.08,
                  margin: 0,
                }}
              >
                Banking built for real life.
              </motion.h1>

              {/* Body */}
              <motion.p
                variants={heroChild}
                style={{
                  fontSize: 18,
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: "var(--font-dm-sans)",
                  lineHeight: 1.65,
                  maxWidth: 520,
                  margin: 0,
                }}
              >
                Flexible accounts, great rates, multi-currency wallets, and virtual cards —
                everything in one place.
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={heroChild}
                style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
              >
                <Link
                  href="/register"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "14px 28px",
                    borderRadius: 10,
                    backgroundColor: "var(--boa-teal)",
                    color: "#0A1628",
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 700,
                    fontSize: 15,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  Open an Account
                </Link>
                <a
                  href="#products"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "14px 28px",
                    borderRadius: 10,
                    backgroundColor: "transparent",
                    color: "#fff",
                    border: "1.5px solid rgba(255,255,255,0.35)",
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 600,
                    fontSize: 15,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  Explore Products
                </a>
              </motion.div>

              {/* Trust row */}
              <motion.div
                variants={heroChild}
                style={{ display: "flex", gap: 24, flexWrap: "wrap" }}
              >
                {["No monthly fees", "10 currencies", "Instant cards"].map((item) => (
                  <span
                    key={item}
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.55)",
                      fontFamily: "var(--font-dm-sans)",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span style={{ color: "var(--boa-teal)", fontWeight: 700 }}>✓</span>
                    {item}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* ── RIGHT — Account Cards ── */}
            <div
              style={{
                display: "none",
                justifyContent: "flex-end",
              }}
              className="lg:flex"
            >
              <div
                style={{
                  position: "relative",
                  width: 460,
                  height: 520,
                }}
              >
                {/* Ambient glow */}
                <motion.div
                  aria-hidden="true"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 320,
                    height: 320,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(0,200,150,0.18) 0%, transparent 70%)",
                    filter: "blur(64px)",
                    pointerEvents: "none",
                    zIndex: 0,
                  }}
                />

                {/* Card 3 — Term Deposit (BACK) */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: "absolute",
                    top: 60,
                    right: 60,
                    zIndex: 10,
                    width: 220,
                    rotate: -3,
                    backgroundColor: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 16,
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    boxShadow: "0 20px 48px rgba(0,0,0,0.4)",
                    padding: 20,
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      fontFamily: "var(--font-mono)",
                      color: "rgba(255,255,255,0.45)",
                      letterSpacing: "0.1em",
                      marginBottom: 8,
                      textTransform: "uppercase",
                    }}
                  >
                    Term Deposit
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 28,
                      fontWeight: 700,
                      color: "var(--boa-gold)",
                      marginBottom: 4,
                      lineHeight: 1.1,
                    }}
                  >
                    5.10% p.a.
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.4)",
                      fontFamily: "var(--font-dm-sans)",
                    }}
                  >
                    12-month locked
                  </p>
                </motion.div>

                {/* Card 2 — Savings (MIDDLE) */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: "absolute",
                    top: 40,
                    right: 20,
                    zIndex: 20,
                    width: 230,
                    rotate: 5,
                    backgroundColor: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 16,
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    boxShadow: "0 20px 48px rgba(0,0,0,0.4)",
                    padding: 20,
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      fontFamily: "var(--font-mono)",
                      color: "rgba(255,255,255,0.45)",
                      letterSpacing: "0.1em",
                      marginBottom: 8,
                      textTransform: "uppercase",
                    }}
                  >
                    Savings Account
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 28,
                      fontWeight: 700,
                      background: "linear-gradient(90deg, var(--boa-teal), #00E5AD)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      marginBottom: 8,
                      lineHeight: 1.1,
                    }}
                  >
                    4.75% p.a.
                  </p>
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: 10,
                      fontFamily: "var(--font-mono)",
                      color: "var(--boa-teal)",
                      backgroundColor: "rgba(0,200,150,0.15)",
                      padding: "2px 8px",
                      borderRadius: 4,
                      letterSpacing: "0.08em",
                      fontWeight: 600,
                    }}
                  >
                    EARNING
                  </span>
                </motion.div>

                {/* Card 1 — Current Account (FRONT) */}
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 0,
                    zIndex: 30,
                    width: 240,
                    backgroundColor: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 16,
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    boxShadow: "0 20px 48px rgba(0,0,0,0.4)",
                    padding: 20,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: "var(--font-mono)",
                        color: "rgba(255,255,255,0.5)",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      Current Account
                    </span>
                    <span style={{ fontSize: 16 }}>🇺🇸</span>
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 26,
                      fontWeight: 700,
                      color: "#fff",
                      marginBottom: 6,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.1,
                    }}
                  >
                    USD 12,840.00
                  </p>
                  <p
                    style={{
                      fontSize: 10,
                      fontFamily: "var(--font-mono)",
                      color: "rgba(255,255,255,0.3)",
                      letterSpacing: "0.12em",
                      marginBottom: 14,
                    }}
                  >
                    •••• •••• 7734
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <motion.div
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "var(--boa-teal)",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: "var(--font-dm-sans)",
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      Account Active
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 2 — PRODUCTS GRID
      ════════════════════════════════════════════════════ */}
      <section id="products" className="boa-section" style={{ backgroundColor: "#fff" }}>
        <div className="boa-container">
          {/* Header */}
          <div style={{ marginBottom: 48 }}>
            <p
              style={{
                fontSize: 11,
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 600,
                color: "var(--boa-teal)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Our Products
            </p>
            <h2
              style={{
                fontFamily: "var(--font-syne)",
                fontSize: 40,
                fontWeight: 700,
                color: "var(--boa-navy)",
                letterSpacing: "-0.02em",
                margin: 0,
                lineHeight: 1.15,
              }}
            >
              Everything you need.
            </h2>
          </div>

          {/* Grid */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 24,
            }}
            className="sm:grid-cols-2 lg:grid-cols-3"
          >
            {PRODUCTS.map((p) => (
              <ProductCard key={p.title} product={p} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 3 — RATES TABLE
      ════════════════════════════════════════════════════ */}
      <section className="boa-section" style={{ backgroundColor: "#F8F9FA" }}>
        <div className="boa-container">
          {/* Header */}
          <div style={{ marginBottom: 40 }}>
            <h2
              style={{
                fontFamily: "var(--font-syne)",
                fontSize: 36,
                fontWeight: 700,
                color: "var(--boa-navy)",
                letterSpacing: "-0.02em",
                marginBottom: 8,
                lineHeight: 1.15,
              }}
            >
              Current interest rates.
            </h2>
            <p
              style={{
                fontSize: 16,
                color: "#9CA3AF",
                fontFamily: "var(--font-dm-sans)",
                margin: 0,
              }}
            >
              Reviewed monthly. Always competitive.
            </p>
          </div>

          {/* Table */}
          <div
            style={{
              width: "100%",
              backgroundColor: "#fff",
              borderRadius: 16,
              border: "1px solid var(--boa-border, #E5E7EB)",
              overflow: "hidden",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#0A1628" }}>
                    {[
                      "Account Type",
                      "Interest Rate",
                      "Frequency",
                      "Min Balance",
                      "Notes",
                    ].map((col) => (
                      <th
                        key={col}
                        style={{
                          padding: "14px 20px",
                          textAlign: "left",
                          fontSize: 11,
                          fontFamily: "var(--font-dm-sans)",
                          fontWeight: 600,
                          color: "#fff",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RATES.map((row, i) => (
                    <RateRow key={row.type} row={row} even={i % 2 === 0} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p
            style={{
              fontSize: 12,
              color: "var(--boa-muted)",
              fontFamily: "var(--font-dm-sans)",
              marginTop: 12,
            }}
          >
            Rates effective March 2026. Subject to change.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 4 — HOW TO OPEN
      ════════════════════════════════════════════════════ */}
      <section className="boa-section" style={{ backgroundColor: "#fff" }}>
        <div className="boa-container">
          <h2
            style={{
              fontFamily: "var(--font-syne)",
              fontSize: 36,
              fontWeight: 700,
              color: "var(--boa-navy)",
              letterSpacing: "-0.02em",
              textAlign: "center",
              marginBottom: 64,
              lineHeight: 1.15,
            }}
          >
            Open an account in minutes.
          </h2>

          {/* Steps wrapper */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 40,
              alignItems: "center",
            }}
            className="md:flex-row md:items-start md:gap-0"
          >
            {STEPS.map((step, i) => (
              <React.Fragment key={step.n}>
                {/* Step */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15, ease: "easeOut" }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    flex: "0 0 auto",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      backgroundColor: "var(--boa-teal)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-dm-sans)",
                      fontWeight: 700,
                      fontSize: 18,
                      marginBottom: 16,
                      flexShrink: 0,
                    }}
                  >
                    {step.n}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      fontWeight: 600,
                      fontSize: 16,
                      color: "var(--boa-navy)",
                      marginBottom: 8,
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: 14,
                      color: "var(--boa-muted)",
                      lineHeight: 1.65,
                      maxWidth: 200,
                      margin: 0,
                    }}
                  >
                    {step.desc}
                  </p>
                </motion.div>

                {/* Connector (between steps, desktop only) */}
                {i < STEPS.length - 1 && (
                  <div
                    aria-hidden="true"
                    style={{
                      flex: 1,
                      borderTop: "2px dashed rgba(0,200,150,0.3)",
                      alignSelf: "flex-start",
                      marginTop: 24,
                      display: "none",
                      minWidth: 32,
                    }}
                    className="md:block"
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 5 — FAQ
      ════════════════════════════════════════════════════ */}
      <section className="boa-section" style={{ backgroundColor: "#F8F9FA" }}>
        <div className="boa-container">
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "var(--font-syne)",
                fontSize: 32,
                fontWeight: 700,
                color: "var(--boa-navy)",
                letterSpacing: "-0.02em",
                textAlign: "center",
                marginBottom: 48,
                lineHeight: 1.2,
              }}
            >
              Frequently asked questions.
            </h2>
            <FaqAccordion faqs={FAQS} />
          </div>
        </div>
      </section>
    </>
  );
}
