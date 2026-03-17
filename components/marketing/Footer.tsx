"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// ── Column data ───────────────────────────────────────────────
const ABOUT_US = [
  { label: "Our Story",           href: "/about"     },
  { label: "Leadership",          href: "/about"     },
  { label: "Careers",             href: "/careers"   },
  { label: "Press Room",          href: "/about"     },
  { label: "Investor Relations",  href: "/about"     },
  { label: "Community Impact",    href: "/community" },
];

const PERSONAL_BANKING = [
  { label: "Current Accounts",  href: "/personal/accounts" },
  { label: "Savings Accounts",  href: "/personal/accounts" },
  { label: "Cards",             href: "/personal/cards"    },
  { label: "Home Loans",        href: "/personal/accounts" },
  { label: "Personal Loans",    href: "/personal/accounts" },
  { label: "Interest Rates",    href: "/interest-rates"    },
];

const BUSINESS_BANKING = [
  { label: "Business Accounts",    href: "/business"      },
  { label: "Merchant Services",    href: "/business"      },
  { label: "Business Loans",       href: "/business"      },
  { label: "API & Integrations",   href: "/business"      },
  { label: "Corporate Solutions",  href: "/business"      },
  { label: "FX Solutions",         href: "/international" },
];

const HELP_SUPPORT = [
  { label: "Contact Us",       href: "/contact"  },
  { label: "FAQs",             href: "/contact"  },
  { label: "Security Centre",  href: "/security" },
  { label: "Accessibility",    href: "/contact"  },
  { label: "Complaints",       href: "/contact"  },
  { label: "Find a Branch",    href: "/contact"  },
];

const LEGAL = [
  { label: "Privacy Policy",    href: "/privacy" },
  { label: "Terms of Service",  href: "/terms"   },
  { label: "Cookie Policy",     href: "/privacy" },
  { label: "Disclosures",       href: "/terms"   },
  { label: "AML Policy",        href: "/terms"   },
  { label: "Annual Reports",    href: "/about"   },
];

const COMPLIANCE_LINKS = [
  { label: "Privacy Policy",    href: "/privacy" },
  { label: "Terms of Service",  href: "/terms"   },
  { label: "Cookie Policy",     href: "/privacy" },
  { label: "Disclosures",       href: "/terms"   },
  { label: "AML Policy",        href: "/terms"   },
];

const TRUST_BADGES = [
  { icon: "shield", label: "Bank Licensed"      },
  { icon: "lock",   label: "256-bit Encryption" },
  { icon: "check",  label: "Deposit Insured"    },
  { icon: "shield", label: "ISO 27001"          },
];

const NAV_COLUMNS = [
  { heading: "About Us",         links: ABOUT_US         },
  { heading: "Personal Banking", links: PERSONAL_BANKING },
  { heading: "Business Banking", links: BUSINESS_BANKING },
  { heading: "Help & Support",   links: HELP_SUPPORT     },
  { heading: "Legal",            links: LEGAL            },
];

// ── Shield SVG icon (consistent style across all trust badges) ─
function ShieldIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 1L13 3.5V7C13 10.2 10.2 12.8 7 13C3.8 12.8 1 10.2 1 7V3.5L7 1Z"
        fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M4.5 7L6.2 8.7L9.5 5.5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="3" y="6" width="8" height="7" rx="1.5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.3" />
      <path d="M4.5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="rgba(255,255,255,0.6)" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.3" />
      <path d="M4.5 7L6.2 8.7L9.5 5.5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrustIcon({ type }: { type: string }) {
  if (type === "lock") return <LockIcon />;
  if (type === "check") return <CheckIcon />;
  return <ShieldIcon />;
}

// ── VISA / PCI ─────────────────────────────────────────────────
function VisaSVG() {
  return (
    <svg width="42" height="14" viewBox="0 0 42 14" fill="none" aria-label="VISA">
      <rect width="42" height="14" rx="2" fill="#1A1F71" />
      <text x="50%" y="10" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontStyle="italic" fontFamily="Arial, sans-serif">VISA</text>
    </svg>
  );
}

function PciSVG() {
  return (
    <div
      className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold tracking-wide"
      style={{ border: "1px solid rgba(200,151,42,0.5)", color: "var(--boa-gold)", fontSize: 9, letterSpacing: "0.06em" }}
    >
      PCI&nbsp;DSS
    </div>
  );
}

// ── Mobile accordion column ────────────────────────────────────
function AccordionCol({ heading, links }: { heading: string; links: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase" as const,
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          {heading}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ color: "rgba(255,255,255,0.35)", fontSize: 20, lineHeight: 1, fontWeight: 300 }}
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden", paddingBottom: open ? 12 : 0 }}
          >
            {links.map((l) => (
              <li key={l.label} style={{ paddingBottom: 10 }}>
                <Link
                  href={l.href}
                  style={{
                    fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
                    fontSize: 14,
                    color: "rgba(255,255,255,0.6)",
                    textDecoration: "none",
                  }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Desktop column ─────────────────────────────────────────────
function FooterCol({ heading, links }: { heading: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4
        style={{
          fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase" as const,
          letterSpacing: "0.12em",
          color: "rgba(255,255,255,0.45)",
          marginBottom: 16,
        }}
      >
        {heading}
      </h4>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column" as const, gap: 10 }}>
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              style={{
                fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
                fontSize: 13.5,
                color: "rgba(255,255,255,0.65)",
                textDecoration: "none",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Main Footer ────────────────────────────────────────────────
export default function Footer() {
  return (
    <footer
      aria-label="Site footer"
      style={{ fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)" }}
    >
      {/* ══════════════════════════════════════════════════════════
          SECTION 1 — MAIN FOOTER GRID
      ══════════════════════════════════════════════════════════ */}
      <div style={{ backgroundColor: "#0A1628" }} className="py-16">
        <div className="boa-container">

          {/* ── DESKTOP & TABLET GRID (hidden on mobile) ── */}
          <div
            className="hidden md:grid gap-10"
            style={{
              gridTemplateColumns: "clamp(180px,20%,260px) repeat(5,1fr)",
            }}
          >
            {/* COL 1 — Brand */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <img src="/logo-dark-bg.png" alt="Bank of Asia Online" style={{ width: 170, height: "auto", display: "block" }} />
              <div>
                <p style={{ fontWeight: 600, fontSize: 14, color: "rgba(255,255,255,0.9)", marginBottom: 4 }}>
                  Modern digital banking for Asia-Pacific.
                </p>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(255,255,255,0.5)" }}>
                  Open your account in minutes, send money across borders instantly, and earn competitive rates.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { icon: "📞", text: "+65 6123 4567" },
                  { icon: "✉",  text: "support@boasiaonline.com" },
                  { icon: "📍", text: "Singapore · Hong Kong · New York" },
                ].map(({ icon, text }) => (
                  <p key={text} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12.5, color: "rgba(255,255,255,0.55)", margin: 0 }}>
                    <span style={{ flexShrink: 0 }}>{icon}</span>
                    <span>{text}</span>
                  </p>
                ))}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["🛡 Bank Licensed", "🔐 Encrypted", "✓ Deposit Insured", "ISO 27001"].map((badge) => (
                  <span
                    key={badge}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 4,
                      border: "1px solid rgba(255,255,255,0.2)",
                      color: "rgba(255,255,255,0.6)",
                      fontSize: 10.5,
                      fontWeight: 500,
                    }}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* COL 2-6 — Nav */}
            {NAV_COLUMNS.map((col) => (
              <FooterCol key={col.heading} heading={col.heading} links={col.links} />
            ))}
          </div>

          {/* ── MOBILE LAYOUT (visible only <md) ── */}
          <div className="md:hidden">
            {/* Brand — always visible, centered */}
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <img
                src="/logo-dark-bg.png"
                alt="Bank of Asia Online"
                style={{ width: 180, height: "auto", display: "block", margin: "0 auto 16px" }}
              />
              <p style={{ fontWeight: 600, fontSize: 14, color: "rgba(255,255,255,0.9)", marginBottom: 6 }}>
                Modern digital banking for Asia-Pacific.
              </p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>
                Open your account in minutes, send money across borders instantly.
              </p>
              {/* Contact */}
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
                {[
                  { icon: "📞", text: "+65 6123 4567" },
                  { icon: "✉",  text: "support@boasiaonline.com" },
                  { icon: "📍", text: "Singapore · Hong Kong · New York" },
                ].map(({ icon, text }) => (
                  <p key={text} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "rgba(255,255,255,0.55)", margin: 0 }}>
                    <span>{icon}</span><span>{text}</span>
                  </p>
                ))}
              </div>
              {/* Reg badges 2×2 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 16 }}>
                {["🛡 Bank Licensed", "🔐 Encrypted", "✓ Deposit Insured", "ISO 27001"].map((badge) => (
                  <span
                    key={badge}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 6,
                      border: "1px solid rgba(255,255,255,0.2)",
                      color: "rgba(255,255,255,0.6)",
                      fontSize: 11,
                      fontWeight: 500,
                      textAlign: "center",
                    }}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Accordion columns */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              {NAV_COLUMNS.map((col) => (
                <AccordionCol key={col.heading} heading={col.heading} links={col.links} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SECTION 2 — LICENSED & REGULATED TRUST STRIP
      ══════════════════════════════════════════════════════════ */}
      <div style={{ backgroundColor: "#0A1628" }} className="pb-10">
        <div className="boa-container px-3 sm:px-0">
          {/* A) Regulated Banking card — responsive 2-col / stacked */}
          <div
            style={{
              backgroundColor: "#0F2040",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              padding: "clamp(20px, 3vw, 28px) clamp(20px, 3vw, 32px)",
            }}
          >
            <div
              style={{
                display: "grid",
                gap: 24,
                gridTemplateColumns: "1fr",
                alignItems: "center",
              }}
              className="md:grid-cols-[1fr_auto]"
            >
              {/* LEFT */}
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-syne, Syne, sans-serif)",
                    fontWeight: 600,
                    fontSize: "clamp(18px, 4vw, 24px)",
                    color: "#fff",
                    marginBottom: 8,
                    lineHeight: 1.3,
                  }}
                >
                  Regulated Banking. Guaranteed Security.
                </p>
                <p style={{ fontSize: 14, color: "rgba(209,213,219,1)", lineHeight: 1.65, maxWidth: 480, margin: 0 }}>
                  Bank of Asia Online operates under the supervision of MAS Singapore and holds full banking licenses across all operating jurisdictions.
                </p>
              </div>

              {/* RIGHT — 2×2 trust badges */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                }}
                className="w-full md:w-[300px]"
              >
                {[
                  { icon: "🛡",  label: "MAS Licensed",          sub: "Singapore"  },
                  { icon: "🔐",  label: "ISO 27001 Certified",   sub: ""           },
                  { icon: "✓",   label: "Deposit Insured",       sub: "FDIC"       },
                  { icon: "📋",  label: "PCI DSS Level 1",       sub: "Compliant"  },
                ].map((b) => (
                  <div
                    key={b.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 14px",
                      minHeight: 60,
                      borderRadius: 8,
                      border: "1px solid rgba(255,255,255,0.15)",
                      backgroundColor: "rgba(255,255,255,0.04)",
                    }}
                  >
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{b.icon}</span>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.85)", margin: 0, lineHeight: 1.3 }}>{b.label}</p>
                      {b.sub && <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", margin: 0 }}>{b.sub}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SECTION 3 — TRUST BAR
      ══════════════════════════════════════════════════════════ */}
      <div
        style={{ backgroundColor: "#060E1C", borderTop: "1px solid rgba(255,255,255,0.06)" }}
        className="py-6"
      >
        <div className="boa-container">
          {/* Mobile: 2×2 grid. Desktop: single row */}
          <div
            className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-4 sm:gap-6"
            style={{ textAlign: "center" }}
          >
            {TRUST_BADGES.map((badge) => (
              <div key={badge.label} className="flex items-center justify-center gap-2">
                <TrustIcon type={badge.icon} />
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SECTION 4 — COMPLIANCE BAR
      ══════════════════════════════════════════════════════════ */}
      <div style={{ backgroundColor: "#040A12" }} className="py-4">
        <div className="boa-container">
          <div style={{ height: 1, backgroundColor: "rgba(200,151,42,0.35)", marginBottom: 16 }} />

          {/* C) Copyright + compliance text — stacked on mobile */}
          <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-2">
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, textAlign: "center" }}>
              © 2026 Bank of Asia Online. All rights reserved.
            </p>
            {/* Split at pipe for mobile line break */}
            <p style={{ color: "rgba(255,255,255,0.35)", textAlign: "center" }}>
              <span style={{ fontSize: "clamp(11px, 1.5vw, 12px)", display: "inline" }}>
                Member of the Deposit Insurance Corporation
              </span>
              <span className="hidden sm:inline" style={{ color: "rgba(255,255,255,0.2)", margin: "0 6px" }}>|</span>
              <br className="sm:hidden" />
              <span style={{ fontSize: "clamp(11px, 1.5vw, 12px)", display: "inline" }}>
                Licensed and regulated by MAS Singapore
              </span>
            </p>
          </div>

          {/* D+E) Legal links + VISA/PCI — stacked on mobile */}
          <div
            className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3 pt-4 mt-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            {/* D) Legal links */}
            <div
              className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
            >
              {COMPLIANCE_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, textDecoration: "none", transition: "color 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* E) VISA + PCI DSS — centered on mobile, right-aligned on desktop */}
            <div className="flex items-center gap-2.5 shrink-0 mt-3 sm:mt-0">
              <VisaSVG />
              <PciSVG />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
