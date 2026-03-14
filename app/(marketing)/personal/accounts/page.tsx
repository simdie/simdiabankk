"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import FaqAccordion from "@/components/marketing/FaqAccordion";
import type { FaqItem } from "@/components/marketing/FaqAccordion";

// ---------------------------------------------------------------------------
// FAQ data
// ---------------------------------------------------------------------------

const FAQS: FaqItem[] = [
  {
    q: "What's the difference between a current and savings account?",
    a: "A current account is your everyday transaction account — use it for spending, paying bills, and receiving salary. A savings account earns interest (4.75% p.a.) and is best for money you're growing over time. Most customers use both together.",
  },
  {
    q: "Is there a minimum deposit to open an account?",
    a: "No. Bank of Asia current and savings accounts have no minimum opening deposit. Term deposits require a minimum of $1,000 to open.",
  },
  {
    q: "How quickly can I access my money?",
    a: "Current and savings accounts offer instant access. Term deposits are locked for the agreed term (3, 6, or 12 months) — early withdrawal may result in a reduced interest rate.",
  },
  {
    q: "Can I have more than one savings account?",
    a: "Yes. You can open multiple savings accounts — for example, one for an emergency fund, one for a holiday, and one for a long-term goal. Each earns interest independently.",
  },
  {
    q: "How do I open a term deposit?",
    a: "From your dashboard, go to Accounts → New Account → Term Deposit. Choose your term, enter the amount, and confirm. The funds are moved from your current account and begin earning the fixed rate immediately.",
  },
];

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const heroContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.13 },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

// ---------------------------------------------------------------------------
// AccountCompareCard
// ---------------------------------------------------------------------------

interface AccountCardProps {
  name: string;
  rate: string;
  rateHighlight?: boolean;
  minBalance: string;
  access: string;
  features: string[];
  cta: string;
  href: string;
  isFeatured?: boolean;
  featuredLabel?: string;
}

function AccountCompareCard({
  name,
  rate,
  rateHighlight,
  minBalance,
  access,
  features,
  cta,
  href,
  isFeatured,
  featuredLabel,
}: AccountCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        border: isFeatured
          ? "2px solid var(--boa-teal)"
          : "1px solid var(--boa-gray-200, #e5e7eb)",
        borderRadius: 16,
        padding: 32,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        boxShadow: isFeatured
          ? hovered
            ? "0 24px 56px rgba(0,200,150,0.18)"
            : "0 16px 48px rgba(0,200,150,0.12)"
          : hovered
          ? "0 12px 32px rgba(10,22,40,0.1)"
          : "0 2px 8px rgba(10,22,40,0.04)",
        transition: "box-shadow 0.25s ease",
      }}
    >
      {/* Featured badge */}
      {isFeatured && featuredLabel && (
        <span
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "var(--boa-gold, #C8972A)",
            color: "#fff",
            fontSize: 11,
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 600,
            borderRadius: 999,
            padding: "4px 12px",
          }}
        >
          {featuredLabel}
        </span>
      )}

      {/* Account name */}
      <h3
        style={{
          fontFamily: "var(--font-syne)",
          fontWeight: 700,
          fontSize: 20,
          color: "var(--boa-navy, #0A1628)",
          marginBottom: 16,
        }}
      >
        {name}
      </h3>

      {/* Monthly fee big display */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 24 }}>
        <span
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 700,
            fontSize: 48,
            color: "var(--boa-teal, #00C896)",
            lineHeight: 1,
          }}
        >
          $0
        </span>
        <span
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: 16,
            color: "var(--boa-muted)",
            paddingBottom: 6,
          }}
        >
          /month
        </span>
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: "var(--boa-gray-200, #e5e7eb)",
          marginBottom: 20,
        }}
      />

      {/* Stat rows */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px 16px",
          marginBottom: 4,
        }}
      >
        {[
          { label: "Interest Rate", value: rate, highlight: rateHighlight },
          { label: "Min Balance", value: minBalance },
          { label: "Access", value: access, fullWidth: true },
        ].map(({ label, value, highlight, fullWidth }) => (
          <div key={label} style={fullWidth ? { gridColumn: "1 / -1" } : {}}>
            <p
              style={{
                fontSize: 11,
                color: "var(--boa-muted)",
                fontFamily: "var(--font-dm-sans)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 2,
              }}
            >
              {label}
            </p>
            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "var(--font-dm-sans)",
                color: highlight ? "var(--boa-teal, #00C896)" : "var(--boa-navy, #0A1628)",
              }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Feature list */}
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "16px 0 24px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          flex: 1,
        }}
      >
        {features.map((f, i) => (
          <li
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              fontSize: 14,
              color: "var(--boa-muted)",
              fontFamily: "var(--font-dm-sans)",
            }}
          >
            <span
              style={{
                color: "var(--boa-teal, #00C896)",
                fontWeight: 700,
                lineHeight: "20px",
                flexShrink: 0,
              }}
            >
              ✓
            </span>
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href={href}
        style={{
          display: "block",
          width: "100%",
          textAlign: "center",
          padding: "14px 24px",
          borderRadius: 10,
          fontFamily: "var(--font-dm-sans)",
          fontWeight: 600,
          fontSize: 15,
          textDecoration: "none",
          transition: "all 0.2s ease",
          boxSizing: "border-box",
          ...(isFeatured
            ? {
                background: "var(--boa-teal, #00C896)",
                color: "#fff",
                border: "2px solid var(--boa-teal, #00C896)",
              }
            : {
                background: "transparent",
                color: "var(--boa-navy, #0A1628)",
                border: "2px solid var(--boa-navy, #0A1628)",
              }),
        }}
      >
        {cta}
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function PersonalAccountsPage() {
  return (
    <main>
      {/* ================================================================
          SECTION 1 — HERO
      ================================================================ */}
      <section
        style={{
          background: "#0A1628",
          minHeight: "85vh",
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

        <div className="boa-container" style={{ position: "relative", zIndex: 1, width: "100%" }}>
          <div
            style={{
              display: "grid",
              gap: 48,
              alignItems: "center",
            }}
            className="grid-cols-1 lg:grid-cols-[55%_45%]"
          >
            {/* LEFT — staggered hero content */}
            <motion.div
              variants={heroContainerVariants}
              initial="hidden"
              animate="visible"
              style={{ display: "flex", flexDirection: "column", gap: 24 }}
            >
              {/* Eyebrow pill */}
              <motion.div variants={heroItemVariants}>
                <span
                  style={{
                    display: "inline-block",
                    background: "rgba(0,200,150,0.1)",
                    border: "1px solid rgba(0,200,150,0.28)",
                    color: "var(--boa-teal, #00C896)",
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: 13,
                    fontWeight: 600,
                    borderRadius: 999,
                    padding: "6px 14px",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  Personal Accounts
                </span>
              </motion.div>

              {/* H1 */}
              <motion.h1
                variants={heroItemVariants}
                style={{
                  fontFamily: "var(--font-syne)",
                  fontSize: "clamp(32px, 4.5vw, 56px)",
                  color: "#fff",
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                  margin: 0,
                }}
              >
                The right account for every stage.
              </motion.h1>

              {/* Body */}
              <motion.p
                variants={heroItemVariants}
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: 17,
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.7,
                  margin: 0,
                  maxWidth: 520,
                }}
              >
                From everyday spending to long-term savings — Bank of Asia has an account designed
                for where you are right now.
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={heroItemVariants}
                style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
              >
                <a
                  href="#compare"
                  style={{
                    display: "inline-block",
                    background: "var(--boa-teal, #00C896)",
                    color: "#fff",
                    padding: "14px 28px",
                    borderRadius: 10,
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 600,
                    fontSize: 15,
                    textDecoration: "none",
                    border: "2px solid var(--boa-teal, #00C896)",
                  }}
                >
                  Compare Accounts
                </a>
                <Link
                  href="/register"
                  style={{
                    display: "inline-block",
                    background: "transparent",
                    color: "#fff",
                    padding: "14px 28px",
                    borderRadius: 10,
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 600,
                    fontSize: 15,
                    textDecoration: "none",
                    border: "2px solid rgba(255,255,255,0.5)",
                  }}
                >
                  Open an Account
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                variants={heroItemVariants}
                style={{ display: "flex", gap: 20, flexWrap: "wrap" }}
              >
                {[
                  "Zero monthly fees",
                  "4.75% p.a. savings",
                  "Open in minutes",
                ].map((badge) => (
                  <span
                    key={badge}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: 13,
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    <span style={{ color: "var(--boa-teal, #00C896)", fontWeight: 700 }}>✓</span>
                    {badge}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* RIGHT — floating balance card (hidden on mobile) */}
            <div className="hidden lg:flex" style={{ justifyContent: "center" }}>
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  width: 400,
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 24,
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
                  padding: 32,
                }}
              >
                {/* Card header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 16,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      color: "rgba(255,255,255,0.4)",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    My Accounts
                  </span>
                  {/* Live indicator */}
                  <motion.span
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      display: "block",
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "var(--boa-teal, #00C896)",
                    }}
                  />
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />

                {/* Row 1 — Current Account */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    paddingTop: 16,
                    paddingBottom: 16,
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span style={{ fontSize: 20 }}>🇺🇸</span>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontSize: 12,
                        color: "rgba(255,255,255,0.6)",
                        margin: 0,
                      }}
                    >
                      Current Account USD
                    </p>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 20,
                      color: "#fff",
                      fontWeight: 500,
                    }}
                  >
                    USD 12,840.00
                  </span>
                </div>

                {/* Row 2 — Savings Account */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    paddingTop: 16,
                    paddingBottom: 16,
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span style={{ fontSize: 20 }}>💰</span>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontSize: 12,
                        color: "rgba(255,255,255,0.6)",
                        margin: 0,
                      }}
                    >
                      Savings Account
                    </p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 20,
                        color: "#fff",
                        fontWeight: 500,
                      }}
                    >
                      AUD 48,250.00
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontSize: 10,
                        color: "var(--boa-teal, #00C896)",
                        background: "rgba(0,200,150,0.12)",
                        border: "1px solid rgba(0,200,150,0.2)",
                        borderRadius: 999,
                        padding: "2px 7px",
                        fontWeight: 600,
                      }}
                    >
                      +4.75% p.a.
                    </span>
                  </div>
                </div>

                {/* Row 3 — Term Deposit */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    paddingTop: 16,
                    paddingBottom: 16,
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span style={{ fontSize: 20 }}>🔒</span>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontSize: 12,
                        color: "rgba(255,255,255,0.6)",
                        margin: 0,
                      }}
                    >
                      Term Deposit 12M
                    </p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 20,
                        color: "#fff",
                        fontWeight: 500,
                      }}
                    >
                      USD 25,000.00
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontSize: 11,
                        color: "var(--boa-gold, #C8972A)",
                      }}
                    >
                      Matures Apr 2026
                    </span>
                  </div>
                </div>

                {/* Total Portfolio */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                    paddingTop: 16,
                    marginTop: 4,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: 13,
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    Total Portfolio
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 18,
                      color: "var(--boa-teal, #00C896)",
                      fontWeight: 600,
                    }}
                  >
                    AUD ~148,320
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 2 — ACCOUNT COMPARISON
      ================================================================ */}
      <section
        id="compare"
        className="boa-section"
        style={{ background: "#fff" }}
      >
        <div className="boa-container">
          {/* Eyebrow */}
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 11,
              fontWeight: 600,
              color: "var(--boa-teal, #00C896)",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              textAlign: "center",
              marginBottom: 16,
              margin: "0 0 16px",
            }}
          >
            Compare Accounts
          </p>

          <h2
            style={{
              fontFamily: "var(--font-syne)",
              fontSize: 40,
              fontWeight: 700,
              color: "var(--boa-navy, #0A1628)",
              textAlign: "center",
              margin: "0 0 12px",
              letterSpacing: "-0.02em",
            }}
          >
            Choose the account that fits.
          </h2>

          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 16,
              color: "#9ca3af",
              textAlign: "center",
              margin: "0 0 56px",
            }}
          >
            All accounts have zero monthly fees and no minimum balance requirement.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
              alignItems: "stretch",
            }}
          >
            <AccountCompareCard
              name="Current Account"
              rate="0.00% p.a."
              minBalance="None"
              access="Instant"
              features={[
                "No monthly fees",
                "Unlimited transactions",
                "Virtual VISA & Mastercard included",
                "Multi-currency support (10 currencies)",
                "Real-time balance & statements",
              ]}
              cta="Open Current Account"
              href="/register"
            />
            <AccountCompareCard
              name="Savings Account"
              rate="4.75% p.a."
              rateHighlight
              minBalance="None"
              access="Instant"
              features={[
                "No monthly fees",
                "4.75% p.a. variable interest",
                "No lock-in period",
                "Interest paid monthly",
                "Linked to current account",
              ]}
              cta="Open Savings Account"
              href="/register"
              isFeatured
              featuredLabel="Most Popular"
            />
            <AccountCompareCard
              name="Term Deposit"
              rate="Up to 5.10% p.a."
              minBalance="$1,000"
              access="At maturity"
              features={[
                "No account fees",
                "Fixed rate — guaranteed return",
                "3, 6, or 12-month terms",
                "Interest paid at maturity",
                "Automatic renewal option",
              ]}
              cta="Open Term Deposit"
              href="/register"
            />
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 3 — FEATURES DEEP DIVE
      ================================================================ */}
      <section
        className="boa-section"
        style={{ background: "var(--boa-off-white, #F8F9FA)" }}
      >
        <div className="boa-container">
          <h2
            style={{
              fontFamily: "var(--font-syne)",
              fontSize: 36,
              fontWeight: 700,
              color: "var(--boa-navy, #0A1628)",
              margin: "0 0 12px",
              letterSpacing: "-0.02em",
            }}
          >
            Why our accounts stand out.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 16,
              color: "var(--boa-muted)",
              margin: "0 0 0",
            }}
          >
            Simple, transparent, and built around you.
          </p>

          {/* ── Row 1: Multi-Currency — text left, icon right ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
              alignItems: "center",
              paddingTop: 48,
              paddingBottom: 48,
              borderBottom: "1px solid var(--boa-gray-200, #e5e7eb)",
            }}
            className="grid-cols-1 lg:grid-cols-2"
          >
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-syne)",
                  fontSize: 28,
                  fontWeight: 700,
                  color: "var(--boa-navy, #0A1628)",
                  margin: "0 0 16px",
                  letterSpacing: "-0.02em",
                }}
              >
                Multi-Currency by Default
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: 16,
                  color: "var(--boa-muted)",
                  lineHeight: 1.75,
                  margin: 0,
                }}
              >
                Every Bank of Asia account supports 10 currencies out of the box. Hold USD, GBP,
                EUR, AUD, CAD, CHF, JPY, CNY, and AED — with no conversion fees for internal
                transfers between your own currency balances.
              </p>
            </div>
            {/* 3×3 currency flag grid */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 56px)",
                  gap: 12,
                  background: "var(--boa-navy, #0A1628)",
                  padding: 28,
                  borderRadius: 20,
                }}
              >
                {["🇺🇸", "🇬🇧", "🇪🇺", "🇦🇺", "🇨🇦", "🇨🇭", "🇯🇵", "🇨🇳", "🇦🇪"].map((flag) => (
                  <div
                    key={flag}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.07)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 26,
                    }}
                  >
                    {flag}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Row 2: Zero Fee — icon left, text right ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
              alignItems: "center",
              paddingTop: 48,
              paddingBottom: 48,
              borderBottom: "1px solid var(--boa-gray-200, #e5e7eb)",
            }}
            className="grid-cols-1 lg:grid-cols-2"
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  background: "var(--boa-navy, #0A1628)",
                  borderRadius: 20,
                  padding: "40px 56px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 80,
                    fontWeight: 700,
                    background: "linear-gradient(135deg, var(--boa-teal, #00C896), #00e0a8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  $0
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: 14,
                    color: "var(--boa-muted)",
                    marginTop: 12,
                    marginBottom: 0,
                  }}
                >
                  per month, forever
                </p>
              </div>
            </div>
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-syne)",
                  fontSize: 28,
                  fontWeight: 700,
                  color: "var(--boa-navy, #0A1628)",
                  margin: "0 0 16px",
                  letterSpacing: "-0.02em",
                }}
              >
                Zero Fee Structure
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: 16,
                  color: "var(--boa-muted)",
                  lineHeight: 1.75,
                  margin: 0,
                }}
              >
                We believe banking shouldn&apos;t cost you money just to exist. No monthly account
                fees, no minimum balance penalties, no transaction fees for everyday activity. Just
                banking that works.
              </p>
            </div>
          </motion.div>

          {/* ── Row 3: Interest — text left, icon right ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
              alignItems: "center",
              paddingTop: 48,
              paddingBottom: 48,
              borderBottom: "1px solid var(--boa-gray-200, #e5e7eb)",
            }}
            className="grid-cols-1 lg:grid-cols-2"
          >
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-syne)",
                  fontSize: 28,
                  fontWeight: 700,
                  color: "var(--boa-navy, #0A1628)",
                  margin: "0 0 16px",
                  letterSpacing: "-0.02em",
                }}
              >
                Interest That Works for You
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: 16,
                  color: "var(--boa-muted)",
                  lineHeight: 1.75,
                  margin: 0,
                }}
              >
                Our Savings Account pays 4.75% p.a. variable — credited monthly with no action
                required. Term Deposits offer up to 5.10% p.a. fixed for 12 months. Your money
                grows while you sleep.
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  background: "var(--boa-navy, #0A1628)",
                  borderRadius: 20,
                  padding: "32px 48px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                  minWidth: 240,
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 52,
                      fontWeight: 700,
                      color: "var(--boa-teal, #00C896)",
                      margin: 0,
                      lineHeight: 1,
                    }}
                  >
                    4.75%
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: 13,
                      color: "rgba(255,255,255,0.5)",
                      marginTop: 6,
                      marginBottom: 0,
                    }}
                  >
                    Savings
                  </p>
                </div>
                <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />
                <div style={{ textAlign: "center" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 52,
                      fontWeight: 700,
                      color: "var(--boa-gold, #C8972A)",
                      margin: 0,
                      lineHeight: 1,
                    }}
                  >
                    5.10%
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: 13,
                      color: "rgba(255,255,255,0.5)",
                      marginTop: 6,
                      marginBottom: 0,
                    }}
                  >
                    Term Deposit 12M
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Row 4: PDF Statements — icon left, text right ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
              alignItems: "center",
              paddingTop: 48,
              paddingBottom: 0,
            }}
            className="grid-cols-1 lg:grid-cols-2"
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  background: "var(--boa-navy, #0A1628)",
                  borderRadius: 20,
                  padding: 32,
                  width: 240,
                  height: 280,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="160"
                  height="200"
                  viewBox="0 0 160 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <rect
                    x="10"
                    y="10"
                    width="140"
                    height="180"
                    rx="10"
                    fill="rgba(255,255,255,0.06)"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="1"
                  />
                  <path
                    d="M110 10 L150 50 L110 50 Z"
                    fill="rgba(0,200,150,0.2)"
                    stroke="rgba(0,200,150,0.4)"
                    strokeWidth="1"
                  />
                  <rect x="24" y="24" width="72" height="8" rx="4" fill="#00C896" opacity="0.8" />
                  <rect x="24" y="68" width="112" height="5" rx="2.5" fill="rgba(255,255,255,0.15)" />
                  <rect x="24" y="82" width="88" height="5" rx="2.5" fill="rgba(255,255,255,0.1)" />
                  <rect x="24" y="96" width="100" height="5" rx="2.5" fill="rgba(255,255,255,0.1)" />
                  <line x1="24" y1="112" x2="136" y2="112" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <rect x="24" y="122" width="112" height="5" rx="2.5" fill="rgba(255,255,255,0.1)" />
                  <rect x="24" y="136" width="64" height="5" rx="2.5" fill="rgba(255,255,255,0.08)" />
                  <rect x="24" y="150" width="80" height="5" rx="2.5" fill="rgba(255,255,255,0.08)" />
                  <rect x="24" y="170" width="112" height="6" rx="3" fill="rgba(0,200,150,0.25)" />
                </svg>
              </div>
            </div>
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-syne)",
                  fontSize: 28,
                  fontWeight: 700,
                  color: "var(--boa-navy, #0A1628)",
                  margin: "0 0 16px",
                  letterSpacing: "-0.02em",
                }}
              >
                Official PDF Statements
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: 16,
                  color: "var(--boa-muted)",
                  lineHeight: 1.75,
                  margin: 0,
                }}
              >
                Every transaction generates a downloadable PDF receipt. Monthly statements are
                automatically available in your dashboard. All documents are compliance-ready and
                accepted by tax authorities and embassies.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================
          SECTION 4 — SWITCH TO BANK OF ASIA
      ================================================================ */}
      <section className="boa-section" style={{ background: "#fff" }}>
        <div className="boa-container" style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-syne)",
              fontSize: 36,
              fontWeight: 700,
              color: "var(--boa-navy, #0A1628)",
              textAlign: "center",
              margin: "0 0 56px",
              letterSpacing: "-0.02em",
            }}
          >
            Switching is easy.
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 0,
              position: "relative",
            }}
          >
            {[
              {
                num: "1",
                title: "Tell us your old bank",
                body: "We'll provide you with a reference letter and help you identify which payments to redirect.",
              },
              {
                num: "2",
                title: "Redirect your transfers",
                body: "Update your salary, direct debits, and standing orders to your new Bank of Asia account details.",
              },
              {
                num: "3",
                title: "Close your old account",
                body: "Once you've confirmed all transfers are running, close your old account and enjoy banking with us.",
              },
            ].map((step, idx, arr) => (
              <div
                key={step.num}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "0 24px",
                  position: "relative",
                }}
              >
                {/* Dashed connector (not on last item) */}
                {idx < arr.length - 1 && (
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      top: 28,
                      left: "calc(50% + 28px)",
                      right: "calc(-50% + 28px)",
                      height: 2,
                      borderTop: "2px dashed rgba(0,200,150,0.3)",
                      zIndex: 0,
                    }}
                  />
                )}

                {/* Number circle */}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "var(--boa-teal, #00C896)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-syne)",
                    fontWeight: 700,
                    fontSize: 20,
                    color: "#fff",
                    marginBottom: 20,
                    position: "relative",
                    zIndex: 1,
                    flexShrink: 0,
                  }}
                >
                  {step.num}
                </div>

                <h3
                  style={{
                    fontFamily: "var(--font-syne)",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "var(--boa-navy, #0A1628)",
                    margin: "0 0 10px",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: 15,
                    color: "var(--boa-muted)",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 5 — COMPLIANCE NOTE
      ================================================================ */}
      <section
        style={{
          background: "var(--boa-off-white, #F8F9FA)",
          paddingTop: 40,
          paddingBottom: 40,
        }}
      >
        <div className="boa-container" style={{ maxWidth: 860, margin: "0 auto" }}>
          <div
            style={{
              background: "#fff",
              border: "1px solid var(--boa-gray-200, #e5e7eb)",
              borderRadius: 16,
              padding: 32,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                marginBottom: 12,
              }}
            >
              <span style={{ fontSize: 20, flexShrink: 0 }}>🔒</span>
              <h3
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontWeight: 600,
                  fontSize: 15,
                  color: "var(--boa-navy, #0A1628)",
                  margin: 0,
                }}
              >
                Deposit Protection &amp; Regulatory Compliance
              </h3>
            </div>
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: 14,
                color: "var(--boa-muted)",
                lineHeight: 1.75,
                margin: 0,
              }}
            >
              Bank of Asia Online is a fully regulated digital financial institution. All customer
              deposits are held in segregated accounts with our licensed custodian partners. We
              operate under full anti-money-laundering (AML) and know-your-customer (KYC) compliance
              frameworks. Our operations are subject to ongoing regulatory review. Interest rates are
              reviewed monthly and may change with 30 days&apos; notice. Past performance is not a
              guarantee of future rates.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 6 — FAQ
      ================================================================ */}
      <section className="boa-section" style={{ background: "#fff" }}>
        <div className="boa-container" style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-syne)",
              fontSize: 32,
              fontWeight: 700,
              color: "var(--boa-navy, #0A1628)",
              textAlign: "center",
              margin: "0 0 48px",
              letterSpacing: "-0.02em",
            }}
          >
            Frequently asked questions.
          </h2>
          <FaqAccordion faqs={FAQS} />
        </div>
      </section>
    </main>
  );
}
