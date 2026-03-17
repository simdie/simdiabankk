"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import FaqAccordion from "@/components/marketing/FaqAccordion";
import type { FaqItem } from "@/components/marketing/FaqAccordion";
import EditorialBanner from "@/components/marketing/EditorialBanner";

// ── FAQ data ───────────────────────────────────────────────────────────────

const FAQS: FaqItem[] = [
  {
    q: "Can I open a business account as a sole trader?",
    a: "Yes. Bank of Asia accepts sole traders, partnerships, companies, and trusts. For sole traders, you'll need your ABN/business registration number and personal ID. The application process takes about 10–15 minutes.",
  },
  {
    q: "How do batch payments work?",
    a: "Upload a CSV file with recipient details (name, bank, account number, amount, reference) from your dashboard. Our system validates each payee, flags errors, and processes the batch after your confirmation. Supports up to 500 payees per batch.",
  },
  {
    q: "Is there a minimum balance for business accounts?",
    a: "No. Business current accounts have no minimum balance requirement and no monthly fees. We earn only on transfer fees and FX margins.",
  },
  {
    q: "Can I integrate Bank of Asia with my accounting software?",
    a: "Yes. We offer CSV/OFX statement exports compatible with Xero, MYOB, and QuickBooks. A full REST API is available for custom integrations. API documentation is available in your developer dashboard.",
  },
  {
    q: "What currencies can my business account hold?",
    a: "Your business account supports 9 currencies: USD, GBP, EUR, AUD, CAD, CHF, JPY, CNY, and AED. Each currency operates as a separate wallet within your account.",
  },
  {
    q: "How do I get a dedicated account manager?",
    a: "Business accounts with an average monthly balance of $100,000 AUD equivalent or higher are eligible for a dedicated relationship manager. Contact our business team at business@boasiaonline.com to request assignment.",
  },
];

// ── Inline dashboard card ──────────────────────────────────────────────────

function BusinessDashboardCard() {
  return (
    <div style={{ position: "relative", width: 420, minHeight: 360 }}>
      {/* Background teal grid */}
      <div
        className="hero-grid-bg"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 24,
          pointerEvents: "none",
          zIndex: 0,
        }}
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
        { top: "5%",  left: "4%"   },
        { top: "42%", right: "3%"  },
        { bottom: "8%", left: "18%"},
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
            animation: `blinker-dot ${2 + i * 0.4}s ease-in-out ${i * 0.7}s infinite`,
            boxShadow: "0 0 8px rgba(0,200,150,0.8)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Main card */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: "rgba(255,255,255,0.07)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 24,
          padding: 28,
          boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
        }}
      >
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: 10,
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.1em",
            }}
          >
            BUSINESS ACCOUNT · USD
          </span>
          <motion.span
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#00C896",
              display: "inline-block",
            }}
          />
        </div>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.08)", marginBottom: 12 }} />

        {/* Balance */}
        <div
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: 32,
            color: "#fff",
            marginTop: 12,
            marginBottom: 4,
            letterSpacing: "-0.01em",
          }}
        >
          USD 284,750.00
        </div>
        <div
          style={{
            fontFamily: "var(--font-dm-sans, sans-serif)",
            fontSize: 12,
            color: "rgba(255,255,255,0.4)",
            marginBottom: 16,
          }}
        >
          Available balance
        </div>

        {/* Mini stat rows */}
        {[
          { label: "💳 Monthly spend", value: "USD 48,200.00", mono: true },
          { label: "📤 Outgoing transfers", value: "12 this month", mono: false },
        ].map((row, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 12,
              paddingBottom: 12,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-dm-sans, sans-serif)",
                fontSize: 13,
                color: "rgba(255,255,255,0.55)",
              }}
            >
              {row.label}
            </span>
            <span
              style={{
                fontFamily: row.mono ? "var(--font-mono, monospace)" : "var(--font-dm-sans, sans-serif)",
                fontSize: 14,
                color: "#fff",
              }}
            >
              {row.value}
            </span>
          </div>
        ))}

        {/* Instant transfer */}
        <div
          style={{
            fontFamily: "var(--font-dm-sans, sans-serif)",
            fontSize: 12,
            color: "#00C896",
            marginTop: 12,
          }}
        >
          ⚡ Instant transfer available
        </div>
      </motion.div>

      {/* Floating badge 1 — Batch Payment */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        style={{
          position: "absolute",
          top: -16,
          right: -20,
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 12,
          padding: "10px 12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-dm-sans, sans-serif)",
            fontSize: 11,
            fontWeight: 600,
            color: "#fff",
          }}
        >
          ✓ Batch Payment
        </div>
        <div
          style={{
            fontFamily: "var(--font-dm-sans, sans-serif)",
            fontSize: 10,
            color: "rgba(255,255,255,0.55)",
          }}
        >
          24 recipients
        </div>
      </motion.div>

      {/* Floating badge 2 — FX Rate Locked */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{
          position: "absolute",
          bottom: -16,
          left: -20,
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 12,
          padding: "10px 12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-dm-sans, sans-serif)",
            fontSize: 11,
            fontWeight: 600,
            color: "#fff",
          }}
        >
          🇺🇸→🇬🇧 Rate locked
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: 10,
            color: "#00C896",
          }}
        >
          1 GBP = 1.263 USD
        </div>
      </motion.div>
    </div>
  );
}

// ── Persona card ───────────────────────────────────────────────────────────

type PersonaCardProps = {
  emoji: string;
  title: string;
  body: string;
  pills: string[];
  delay: number;
};

function PersonaCard({ emoji, title, body, pills, delay }: PersonaCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "#fff",
        border: `1px solid ${hovered ? "rgba(0,200,150,0.3)" : "var(--boa-gray-200, #E5E9EE)"}`,
        borderRadius: 16,
        padding: 28,
        boxShadow: hovered ? "0 8px 28px rgba(0,0,0,0.07)" : "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          backgroundColor: "rgba(0,200,150,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          marginBottom: 20,
        }}
        aria-hidden
      >
        {emoji}
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "var(--font-syne, sans-serif)",
          fontWeight: 600,
          fontSize: 18,
          color: "#0A1628",
          marginBottom: 10,
        }}
      >
        {title}
      </h3>

      {/* Body */}
      <p
        style={{
          fontFamily: "var(--font-dm-sans, sans-serif)",
          fontSize: 15,
          color: "#64748B",
          lineHeight: 1.65,
          marginBottom: 16,
        }}
      >
        {body}
      </p>

      {/* Feature pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
        {pills.map((pill) => (
          <span
            key={pill}
            style={{
              display: "inline-flex",
              alignItems: "center",
              backgroundColor: "rgba(0,200,150,0.07)",
              border: "1px solid rgba(0,200,150,0.2)",
              borderRadius: 9999,
              padding: "4px 12px",
              fontFamily: "var(--font-dm-sans, sans-serif)",
              fontSize: 12,
              fontWeight: 500,
              color: "#00C896",
            }}
          >
            {pill}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ── Product card ───────────────────────────────────────────────────────────

type ProductCardProps = {
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  body: string;
  features: string[];
  delay: number;
};

function ProductCard({ icon, iconColor, title, body, features, delay }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "#fff",
        border: `1px solid ${hovered ? "rgba(0,200,150,0.3)" : "var(--boa-gray-200, #E5E9EE)"}`,
        borderRadius: 16,
        padding: 28,
        boxShadow: hovered ? "0 8px 28px rgba(0,0,0,0.07)" : "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
    >
      {/* Icon container */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          backgroundColor: iconColor === "#C8972A" ? "rgba(200,151,42,0.1)" : "rgba(0,200,150,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: iconColor,
          marginBottom: 20,
        }}
      >
        {icon}
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "var(--font-syne, sans-serif)",
          fontWeight: 600,
          fontSize: 18,
          color: "#0A1628",
          marginBottom: 10,
        }}
      >
        {title}
      </h3>

      {/* Body */}
      <p
        style={{
          fontFamily: "var(--font-dm-sans, sans-serif)",
          fontSize: 14,
          color: "#64748B",
          lineHeight: 1.7,
          marginBottom: 20,
        }}
      >
        {body}
      </p>

      {/* Features */}
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
        {features.map((f) => (
          <li key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                color: "#00C896",
                fontFamily: "var(--font-dm-sans, sans-serif)",
                fontSize: 14,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              ✓
            </span>
            <span
              style={{
                fontFamily: "var(--font-dm-sans, sans-serif)",
                fontSize: 14,
                color: "#1A2332",
              }}
            >
              {f}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// ── Pillar card ────────────────────────────────────────────────────────────

type PillarCardProps = {
  icon: React.ReactNode;
  title: string;
  desc: string;
  stat: string;
  delay: number;
};

function PillarCard({ icon, title, desc, stat, delay }: PillarCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "#fff",
        border: `1px solid ${hovered ? "rgba(0,200,150,0.25)" : "var(--boa-gray-200, #E5E9EE)"}`,
        borderRadius: 12,
        padding: 24,
        transition: "border-color 0.2s",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: "rgba(0,200,150,0.08)",
          color: "#00C896",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        {icon}
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "var(--font-dm-sans, sans-serif)",
          fontWeight: 600,
          fontSize: 16,
          color: "#0A1628",
          marginBottom: 8,
        }}
      >
        {title}
      </h3>

      {/* Desc */}
      <p
        style={{
          fontFamily: "var(--font-dm-sans, sans-serif)",
          fontSize: 14,
          color: "#64748B",
          lineHeight: 1.65,
          marginBottom: 0,
        }}
      >
        {desc}
      </p>

      {/* Stat badge */}
      <div style={{ marginTop: 12 }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            fontFamily: "var(--font-dm-sans, sans-serif)",
            fontWeight: 600,
            fontSize: 13,
            color: "#00C896",
            backgroundColor: "rgba(0,200,150,0.08)",
            borderRadius: 9999,
            padding: "4px 12px",
          }}
        >
          {stat}
        </span>
      </div>
    </motion.div>
  );
}

// ── Rate row ───────────────────────────────────────────────────────────────

type RateRowProps = {
  service: string;
  fee: React.ReactNode;
  feeIsFree: boolean;
  notes: string;
  bg: string;
};

function RateRow({ service, fee, feeIsFree, notes, bg }: RateRowProps) {
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
      <td
        style={{
          padding: "14px 20px",
          fontFamily: "var(--font-dm-sans, sans-serif)",
          fontSize: 14,
          color: "#0A1628",
          borderBottom: "1px solid #E5E9EE",
        }}
      >
        {service}
      </td>
      <td
        style={{
          padding: "14px 20px",
          fontFamily: feeIsFree ? "var(--font-mono, monospace)" : "var(--font-mono, monospace)",
          fontWeight: 600,
          fontSize: 14,
          color: feeIsFree ? "#00C896" : "#0A1628",
          borderBottom: "1px solid #E5E9EE",
        }}
      >
        {fee}
      </td>
      <td
        style={{
          padding: "14px 20px",
          fontFamily: "var(--font-dm-sans, sans-serif)",
          fontSize: 13,
          color: "#64748B",
          borderBottom: "1px solid #E5E9EE",
        }}
      >
        {notes}
      </td>
    </tr>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function BusinessPage() {
  const heroStagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.13 } },
  };

  const heroChild = {
    hidden: { opacity: 0, x: -40 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          SECTION 1 — HERO
      ═══════════════════════════════════════════════════════ */}
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

        {/* Bottom ambient glow */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "35%",
            background:
              "radial-gradient(ellipse 50% 100% at 50% 100%, rgba(0,200,150,0.05), transparent)",
            pointerEvents: "none",
          }}
        />

        <div className="boa-container" style={{ position: "relative", zIndex: 1, width: "100%" }}>
          <div
            style={{ display: "grid", gap: 48, alignItems: "center" }}
            className="grid-cols-1 lg:grid-cols-[54fr_46fr]"
          >
            {/* LEFT — text */}
            <motion.div
              variants={heroStagger}
              initial="hidden"
              animate="show"
              style={{ display: "flex", flexDirection: "column", gap: 0 }}
            >
              {/* Eyebrow pill */}
              <motion.div variants={heroChild} style={{ marginBottom: 24 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    backgroundColor: "rgba(0,200,150,0.1)",
                    border: "1px solid rgba(0,200,150,0.28)",
                    color: "#00C896",
                    fontFamily: "var(--font-dm-sans, sans-serif)",
                    fontSize: 13,
                    fontWeight: 600,
                    borderRadius: 9999,
                    padding: "8px 16px",
                  }}
                >
                  BUSINESS BANKING
                </span>
              </motion.div>

              {/* H1 */}
              <motion.h1
                variants={heroChild}
                style={{
                  fontFamily: "var(--font-syne, sans-serif)",
                  fontSize: "clamp(36px, 5vw, 60px)",
                  color: "#fff",
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                  marginBottom: 24,
                  fontWeight: 700,
                }}
              >
                Banking for businesses that move fast.
              </motion.h1>

              {/* Body */}
              <motion.p
                variants={heroChild}
                style={{
                  fontFamily: "var(--font-dm-sans, sans-serif)",
                  fontSize: 17,
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.75,
                  marginBottom: 36,
                }}
              >
                Business accounts with multi-currency wallets, batch payments, FX solutions, and dedicated support — built for companies that operate globally.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={heroChild} style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 32 }}>
                <Link
                  href="/register" target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    backgroundColor: "#00C896",
                    color: "#fff",
                    borderRadius: 8,
                    padding: "14px 28px",
                    fontFamily: "var(--font-dm-sans, sans-serif)",
                    fontWeight: 600,
                    fontSize: 16,
                    textDecoration: "none",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#00A87E")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#00C896")}
                >
                  Open Business Account
                </Link>
                <Link
                  href="/contact"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    border: "1.5px solid rgba(255,255,255,0.35)",
                    color: "#fff",
                    borderRadius: 8,
                    padding: "14px 28px",
                    fontFamily: "var(--font-dm-sans, sans-serif)",
                    fontWeight: 600,
                    fontSize: 16,
                    textDecoration: "none",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.07)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  Talk to Sales
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div variants={heroChild} style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                {["✓ No monthly fees", "✓ Multi-currency", "✓ API access"].map((badge) => (
                  <span
                    key={badge}
                    style={{
                      fontFamily: "var(--font-dm-sans, sans-serif)",
                      fontSize: 13,
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    {badge}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* RIGHT — Dashboard card (hidden on mobile) */}
            <div className="hidden lg:flex" style={{ justifyContent: "center", alignItems: "flex-start", paddingTop: 32 }}>
              <BusinessDashboardCard />
            </div>
          </div>
        </div>
      </section>

      {/* Banner image */}
      <section style={{ marginTop: "clamp(48px, 6vw, 80px)", marginBottom: "clamp(48px, 6vw, 80px)", overflow: "hidden", width: "100%" }}>
        <Image
          src="/banner-image2.png"
          alt="Bank of Asia business banking"
          width={1920}
          height={600}
          style={{ width: "100%", height: "clamp(220px, 28vw, 420px)", objectFit: "cover", objectPosition: "center", display: "block" }}
          priority={false}
        />
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2 — PERSONA CARDS
      ═══════════════════════════════════════════════════════ */}
      <section className="boa-section" style={{ backgroundColor: "#F8F9FA" }}>
        <div className="boa-container">
          {/* Eyebrow */}
          <p
            style={{
              fontFamily: "var(--font-dm-sans, sans-serif)",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#00C896",
              marginBottom: 12,
            }}
          >
            WHO IT'S FOR
          </p>

          <h2
            style={{
              fontFamily: "var(--font-syne, sans-serif)",
              fontSize: 36,
              fontWeight: 700,
              color: "#0A1628",
              marginBottom: 48,
              letterSpacing: "-0.02em",
            }}
          >
            Built for every type of business.
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(1, 1fr)",
              gap: 24,
            }}
            className="md:!grid-cols-3"
          >
            <PersonaCard
              emoji="🚀"
              title="SMEs & Startups"
              body="Launch with a business account that scales. No setup fees, instant virtual cards, and multi-currency support from day one."
              pills={["Multi-currency", "Virtual cards", "No setup fee"]}
              delay={0}
            />
            <PersonaCard
              emoji="🌐"
              title="Import & Export"
              body="Manage FX risk, pay suppliers in their local currency, and receive international payments with transparent rates."
              pills={["FX management", "SWIFT transfers", "Supplier payments"]}
              delay={0.1}
            />
            <PersonaCard
              emoji="💼"
              title="Freelancers & Contractors"
              body="Invoice global clients, receive payments in 9 currencies, and manage your finances with zero monthly fees."
              pills={["Multi-currency", "Zero fees", "Instant receipts"]}
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 3 — PRODUCTS GRID
      ═══════════════════════════════════════════════════════ */}
      <section className="boa-section" style={{ backgroundColor: "#fff" }}>
        <div className="boa-container">
          {/* Eyebrow */}
          <p
            style={{
              fontFamily: "var(--font-dm-sans, sans-serif)",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#00C896",
              marginBottom: 12,
            }}
          >
            BUSINESS PRODUCTS
          </p>

          <h2
            style={{
              fontFamily: "var(--font-syne, sans-serif)",
              fontSize: 36,
              fontWeight: 700,
              color: "#0A1628",
              marginBottom: 48,
              letterSpacing: "-0.02em",
            }}
          >
            Everything your business needs.
          </h2>

          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(1, 1fr)", gap: 24 }}
            className="sm:!grid-cols-2"
          >
            <ProductCard
              iconColor="#00C896"
              icon={
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
                  <path d="M13 3L24 9H2L13 3Z" fill="currentColor" />
                  <rect x="4" y="11" width="3.5" height="9" fill="currentColor" opacity="0.8" />
                  <rect x="11.25" y="11" width="3.5" height="9" fill="currentColor" opacity="0.8" />
                  <rect x="18.5" y="11" width="3.5" height="9" fill="currentColor" opacity="0.8" />
                  <rect x="2" y="20" width="22" height="2" rx="1" fill="currentColor" />
                </svg>
              }
              title="Business Current Account"
              body="A full-featured business transaction account with multi-currency support and no monthly fees."
              features={["No monthly fees", "10 currency wallets", "Unlimited transactions", "Virtual VISA & Mastercard"]}
              delay={0}
            />
            <ProductCard
              iconColor="#00C896"
              icon={
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
                  <rect x="3" y="5" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.75" />
                  <line x1="7" y1="10" x2="15" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="7" y1="14" x2="15" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="7" y1="18" x2="11" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <rect x="15" y="3" width="9" height="11" rx="2" fill="currentColor" opacity="0.25" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              }
              title="Batch Payments"
              body="Process up to 500 payees in a single upload. CSV format, instant verification, bulk SWIFT support."
              features={["Up to 500 payees", "CSV upload", "SWIFT & local", "Auto reconciliation"]}
              delay={0.1}
            />
            <ProductCard
              iconColor="#C8972A"
              icon={
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
                  <path d="M4 9h18M18 5l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 17H4M8 13l-4 4 4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
              title="FX Solutions"
              body="Convert between 9 currencies at real interbank rates. Lock in rates for forward contracts (coming soon)."
              features={["9 currency pairs", "Real interbank rates", "Transparent margin 0.5–1%", "Instant conversion"]}
              delay={0.2}
            />
            <ProductCard
              iconColor="#00C896"
              icon={
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
                  <path d="M9 7L4 13L9 19" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M17 7L22 13L17 19" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="15" y1="5" x2="11" y2="21" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
              }
              title="API Banking"
              body="Integrate Bank of Asia directly into your ERP, accounting software, or custom application via REST API."
              features={["REST API", "Webhook support", "Sandbox environment", "Full documentation"]}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 4 — WHY CHOOSE US
      ═══════════════════════════════════════════════════════ */}
      <section className="boa-section" style={{ backgroundColor: "#F8F9FA" }}>
        <div className="boa-container">
          {/* Eyebrow */}
          <p
            style={{
              fontFamily: "var(--font-dm-sans, sans-serif)",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#00C896",
              marginBottom: 12,
            }}
          >
            WHY BANK OF ASIA
          </p>

          <h2
            style={{
              fontFamily: "var(--font-syne, sans-serif)",
              fontSize: 36,
              fontWeight: 700,
              color: "#0A1628",
              marginBottom: 48,
              letterSpacing: "-0.02em",
            }}
          >
            Why businesses choose us.
          </h2>

          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(1, 1fr)", gap: 20 }}
            className="sm:!grid-cols-2"
          >
            <PillarCard
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
                  <path d="M12 7v10M9.5 9.5C9.5 8.5 10.5 8 12 8s2.5.672 2.5 1.75c0 2.5-5 2-5 4.5C9.5 15.5 10.5 16 12 16s2.5-.5 2.5-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              }
              title="Zero Fee Structure"
              desc="No monthly account fees, no maintenance charges, no minimum balance. We make money on FX margins and transfer fees only — transparently."
              stat="$0/month always"
              delay={0}
            />
            <PillarCard
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
                  <ellipse cx="12" cy="12" rx="4" ry="9" stroke="currentColor" strokeWidth="1.25" />
                  <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.25" opacity="0.6" />
                </svg>
              }
              title="True Multi-Currency"
              desc="9 currencies in one account. Pay suppliers in their local currency. Receive from global clients without conversion delays."
              stat="9 currencies"
              delay={0.08}
            />
            <PillarCard
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.75" />
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 4h6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
              }
              title="Compliance-Ready"
              desc="Full AML/KYC compliance, immutable audit logs, official PDF receipts for every transaction. Accepted by accountants and tax authorities globally."
              stat="100% audit trail"
              delay={0.16}
            />
            <PillarCard
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 11a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                  <rect x="4" y="11" width="3" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
                  <rect x="17" y="11" width="3" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
                  <path d="M20 16v1a3 3 0 0 1-3 3h-2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
              }
              title="Dedicated Support"
              desc="Business clients receive priority support with a dedicated account manager for accounts over $100K AUD equivalent."
              stat="Priority support"
              delay={0.24}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 5 — RATES TABLE
      ═══════════════════════════════════════════════════════ */}
      <section className="boa-section" style={{ backgroundColor: "#fff" }}>
        <div className="boa-container">
          <h2
            style={{
              fontFamily: "var(--font-syne, sans-serif)",
              fontSize: 34,
              fontWeight: 700,
              color: "#0A1628",
              marginBottom: 8,
              letterSpacing: "-0.02em",
            }}
          >
            Business account rates &amp; fees.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-dm-sans, sans-serif)",
              fontSize: 16,
              color: "#64748B",
              marginBottom: 40,
            }}
          >
            Transparent. Always.
          </p>

          <div
            style={{
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid #E5E9EE",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#0A1628" }}>
                    {["Service", "Fee", "Notes"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "14px 20px",
                          textAlign: "left",
                          fontFamily: "var(--font-dm-sans, sans-serif)",
                          fontSize: 11,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "#fff",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { service: "Business Current Account", fee: "FREE", isFree: true, notes: "No monthly fees, unlimited transactions" },
                    { service: "Multi-Currency Wallet", fee: "FREE", isFree: true, notes: "Hold 9 currencies, no conversion on internal transfers" },
                    { service: "Virtual VISA Card", fee: "FREE", isFree: true, notes: "Up to 5 cards per account" },
                    { service: "Virtual Mastercard", fee: "FREE", isFree: true, notes: "Up to 5 cards per account" },
                    { service: "Internal Transfer", fee: "FREE", isFree: true, notes: "Instant, 24/7" },
                    { service: "Local Wire (AUD)", fee: "$5.00 flat", isFree: false, notes: "Same-day settlement" },
                    { service: "SWIFT Transfer (major)", fee: "$15.00 + 0.5% FX", isFree: false, notes: "1–3 business days" },
                    { service: "SWIFT Transfer (other)", fee: "$20.00 + 0.75% FX", isFree: false, notes: "2–5 business days" },
                    { service: "Batch Payment (per batch)", fee: "$2.00 per batch", isFree: false, notes: "Up to 500 payees per batch" },
                    { service: "API Access", fee: "FREE", isFree: true, notes: "Sandbox + production" },
                  ].map((row, i) => (
                    <RateRow
                      key={row.service}
                      service={row.service}
                      fee={row.fee}
                      feeIsFree={row.isFree}
                      notes={row.notes}
                      bg={i % 2 === 0 ? "#fff" : "#F8F9FA"}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p
            style={{
              fontFamily: "var(--font-dm-sans, sans-serif)",
              fontSize: 12,
              color: "#64748B",
              marginTop: 16,
            }}
          >
            Business rates effective March 2026. Volume discounts available for accounts over $1M AUD monthly throughput — contact us.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 6 — FAQ
      ═══════════════════════════════════════════════════════ */}
      <section className="boa-section" style={{ backgroundColor: "#F8F9FA" }}>
        <div className="boa-container">
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "var(--font-syne, sans-serif)",
                fontSize: 32,
                fontWeight: 700,
                color: "#0A1628",
                marginBottom: 48,
                textAlign: "center",
                letterSpacing: "-0.02em",
              }}
            >
              Business banking questions.
            </h2>
            <FaqAccordion faqs={FAQS} />
          </div>
        </div>
      </section>

      <EditorialBanner
        headline="Open a business account today."
        subtext="Join hundreds of businesses banking smarter with Bank of Asia. No setup fees. No lock-in."
        ctaText="Open Business Account"
        ctaHref="/register"
        ctaText2="Talk to Sales"
        ctaHref2="/contact"
      />
    </>
  );
}
