"use client";

import Link from "next/link";
import Logo from "./Logo";

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
  { label: "Business Accounts",    href: "/business" },
  { label: "Merchant Services",    href: "/business" },
  { label: "Business Loans",       href: "/business" },
  { label: "API & Integrations",   href: "/business" },
  { label: "Corporate Solutions",  href: "/business" },
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
  { icon: "🛡", label: "Bank Licensed"      },
  { icon: "🔒", label: "256-bit Encryption" },
  { icon: "✓",  label: "Deposit Insured"    },
  { icon: "🏆", label: "ISO 27001"          },
];

const REG_BADGES = [
  "🛡 Bank Licensed",
  "🔐 256-bit Encryption",
  "✓ Deposit Insured",
  "ISO 27001",
];

// ── Tiny sub-components ───────────────────────────────────────
function FooterCol({ heading, links }: { heading: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4
        className="text-[11px] uppercase tracking-widest font-semibold mb-4"
        style={{ color: "rgba(255,255,255,0.45)" }}
      >
        {heading}
      </h4>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-[13.5px] transition-colors duration-150"
              style={{ color: "rgba(255,255,255,0.65)" }}
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

// VISA SVG wordmark (simplified)
function VisaSVG() {
  return (
    <svg width="42" height="14" viewBox="0 0 42 14" fill="none" aria-label="VISA">
      <rect width="42" height="14" rx="2" fill="#1A1F71" />
      <text x="50%" y="10" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontStyle="italic" fontFamily="Arial, sans-serif">
        VISA
      </text>
    </svg>
  );
}

// PCI DSS badge (simplified)
function PciSVG() {
  return (
    <div
      className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold tracking-wide"
      style={{
        border: "1px solid rgba(200,151,42,0.5)",
        color: "var(--boa-gold)",
        fontSize: 9,
        letterSpacing: "0.06em",
      }}
    >
      PCI&nbsp;DSS
    </div>
  );
}

// ── Main Footer ───────────────────────────────────────────────
export default function Footer() {
  return (
    <footer
      aria-label="Site footer"
      style={{ fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)" }}
    >
      {/* ══════════════════════════════════════════════════════════
          SECTION 1 — MAIN FOOTER
      ══════════════════════════════════════════════════════════ */}
      <div style={{ backgroundColor: "#0A1628" }} className="py-16">
        <div className="boa-container">
          <div
            className="grid gap-10"
            style={{
              gridTemplateColumns:
                "clamp(200px,22%,280px) repeat(5,1fr)",
            }}
          >
            {/* COL 1 — Brand */}
            <div className="space-y-6" style={{ gridColumn: 1 }}>
              {/* Logo */}
              <Logo size="default" />

              {/* Tagline */}
              <div>
                <p
                  className="font-semibold mb-1"
                  style={{ color: "rgba(255,255,255,0.9)", fontSize: 14 }}
                >
                  Modern digital banking for Asia-Pacific.
                </p>
                <p
                  className="text-[13px] leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  Open your account in minutes, send money across borders
                  instantly, and earn competitive rates.
                </p>
              </div>

              {/* Contact block */}
              <div className="space-y-2">
                {[
                  { icon: "📞", text: "+65 6123 4567" },
                  { icon: "✉",  text: "support@bankofasia.com" },
                  { icon: "📍", text: "Singapore · Hong Kong · Tokyo · New York" },
                ].map(({ icon, text }) => (
                  <p
                    key={text}
                    className="flex items-start gap-2 text-[12.5px]"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    <span className="shrink-0 mt-px">{icon}</span>
                    <span>{text}</span>
                  </p>
                ))}
              </div>

              {/* Regulatory badges */}
              <div className="flex flex-wrap gap-2">
                {REG_BADGES.map((badge) => (
                  <span
                    key={badge}
                    className="px-2.5 py-1 rounded text-[10.5px] font-medium"
                    style={{
                      border: "1px solid rgba(255,255,255,0.2)",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* COL 2-6 — Nav columns */}
            <FooterCol heading="About Us"          links={ABOUT_US}         />
            <FooterCol heading="Personal Banking"  links={PERSONAL_BANKING} />
            <FooterCol heading="Business Banking"  links={BUSINESS_BANKING} />
            <FooterCol heading="Help & Support"    links={HELP_SUPPORT}     />
            <FooterCol heading="Legal"             links={LEGAL}            />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SECTION 2 — APP DOWNLOAD BANNER
      ══════════════════════════════════════════════════════════ */}
      <div style={{ backgroundColor: "#0A1628" }} className="pb-10">
        <div className="boa-container">
          <div
            className="flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-6 rounded-xl"
            style={{
              backgroundColor: "#0F2040",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Left */}
            <div className="flex items-center gap-4">
              <div
                className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0"
                style={{ backgroundColor: "rgba(0,200,150,0.15)" }}
              >
                <span style={{ fontSize: 24 }}>📱</span>
              </div>
              <div>
                <p
                  className="font-bold text-white mb-0.5"
                  style={{
                    fontSize: 16,
                    fontFamily: "var(--font-syne, Syne, sans-serif)",
                  }}
                >
                  Bank on the go
                </p>
                <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Download our mobile app for iOS and Android
                </p>
              </div>
            </div>

            {/* Store buttons */}
            <div className="flex items-center gap-3 shrink-0">
              {[
                { icon: "🍎", line1: "Download on the", line2: "App Store" },
                { icon: "▶",  line1: "Get it on",       line2: "Google Play" },
              ].map(({ icon, line1, line2 }) => (
                <button
                  key={line2}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg transition-colors"
                  style={{
                    border: "1px solid rgba(255,255,255,0.2)",
                    backgroundColor: "rgba(255,255,255,0.05)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)")
                  }
                >
                  <span style={{ fontSize: 20 }}>{icon}</span>
                  <div className="text-left">
                    <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                      {line1}
                    </p>
                    <p
                      className="text-[13px] font-semibold text-white leading-tight"
                      style={{ fontFamily: "var(--font-syne, Syne, sans-serif)" }}
                    >
                      {line2}
                    </p>
                  </div>
                </button>
              ))}
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
          <div className="flex flex-wrap items-center justify-center gap-6">
            {TRUST_BADGES.map((badge, i) => (
              <div key={badge.label} className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-[13px]">
                  <span>{badge.icon}</span>
                  <span style={{ color: "rgba(255,255,255,0.7)" }}>{badge.label}</span>
                </div>
                {i < TRUST_BADGES.length - 1 && (
                  <span
                    className="hidden sm:block"
                    style={{ color: "rgba(255,255,255,0.15)", fontSize: 18 }}
                  >
                    |
                  </span>
                )}
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
          {/* Gold divider */}
          <div
            style={{
              height: 1,
              backgroundColor: "rgba(200,151,42,0.35)",
              marginBottom: 16,
            }}
          />

          {/* Top row: copyright + regulatory */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-[12px]">
            <p style={{ color: "rgba(255,255,255,0.4)" }}>
              © 2026 Bank of Asia Online. All rights reserved.
            </p>
            <p className="text-center" style={{ color: "rgba(255,255,255,0.35)" }}>
              Member of the Deposit Insurance Corporation&nbsp;|&nbsp;Licensed and
              regulated by MAS Singapore
            </p>
          </div>

          {/* Bottom row: links + logos */}
          <div
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pt-4 mt-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              {COMPLIANCE_LINKS.map((link, i) => (
                <span key={link.label} className="flex items-center gap-3">
                  <Link
                    href={link.href}
                    className="text-[11.5px] transition-colors"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
                  >
                    {link.label}
                  </Link>
                  {i < COMPLIANCE_LINKS.length - 1 && (
                    <span style={{ color: "rgba(255,255,255,0.12)" }}>·</span>
                  )}
                </span>
              ))}
            </div>

            {/* Payment badges */}
            <div className="flex items-center gap-2.5 shrink-0">
              <VisaSVG />
              <PciSVG />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
