"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";

// ─── SHIELD VISUAL ───────────────────────────────────────────────────────────

function ShieldVisual() {
  const shieldClip = "polygon(50% 0%, 100% 15%, 100% 55%, 50% 100%, 0% 55%, 0% 15%)";

  return (
    <div style={{ position: "relative", width: 400, height: 460 }}>
      {/* Outer border div */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 224,
          height: 264,
          clipPath: shieldClip,
          background: "rgba(0,200,150,0.3)",
        }}
      />
      {/* Inner fill div */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 220,
          height: 260,
          clipPath: shieldClip,
          background: "linear-gradient(145deg, rgba(0,200,150,0.15), rgba(0,200,150,0.05))",
        }}
      />

      {/* Pulsing glow ring */}
      <motion.div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 240,
          height: 280,
          clipPath: shieldClip,
          background: "transparent",
          boxShadow: "0 0 40px rgba(0,200,150,0.4)",
        }}
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" as const }}
      />

      {/* Lock icon */}
      <motion.div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
          color: "var(--boa-teal)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}
      >
        <svg width="40" height="44" viewBox="0 0 40 44" fill="none">
          <rect x="6" y="20" width="28" height="20" rx="4" stroke="currentColor" strokeWidth="2.5" />
          <path d="M12 20v-6a8 8 0 0 1 16 0v6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="20" cy="31" r="3" fill="currentColor" />
        </svg>
      </motion.div>

      {/* Floating badges */}
      {/* TLS 1.3 */}
      <motion.div
        style={{
          position: "absolute",
          top: "10%",
          right: "5%",
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 10,
          padding: "6px 12px",
          fontFamily: "var(--font-dm-sans)",
          fontSize: 12,
          fontWeight: 600,
          color: "var(--boa-teal)",
          whiteSpace: "nowrap",
        }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" as const }}
      >
        TLS 1.3
      </motion.div>

      {/* TOTP 2FA */}
      <motion.div
        style={{
          position: "absolute",
          top: "42%",
          right: "0%",
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 10,
          padding: "6px 12px",
          fontFamily: "var(--font-dm-sans)",
          fontSize: 12,
          fontWeight: 600,
          color: "var(--boa-teal)",
          whiteSpace: "nowrap",
        }}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" as const, delay: 0.5 }}
      >
        TOTP 2FA
      </motion.div>

      {/* Audit Logs */}
      <motion.div
        style={{
          position: "absolute",
          bottom: "20%",
          right: "5%",
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 10,
          padding: "6px 12px",
          fontFamily: "var(--font-dm-sans)",
          fontSize: 12,
          fontWeight: 600,
          color: "var(--boa-teal)",
          whiteSpace: "nowrap",
        }}
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" as const, delay: 0.3 }}
      >
        Audit Logs
      </motion.div>
    </div>
  );
}

// ─── ACCORDION ───────────────────────────────────────────────────────────────

const ACCORDION_ITEMS = [
  {
    title: "TLS 1.3 End-to-End Encryption",
    body: "All data transmitted between your browser or mobile device and Bank of Asia servers is encrypted using TLS 1.3, the latest transport layer security protocol. This prevents interception, tampering, and eavesdropping on all connections — including API calls and dashboard sessions.",
  },
  {
    title: "Two-Factor Authentication (TOTP)",
    body: "Every Bank of Asia account requires time-based one-time password (TOTP) authentication via an authenticator app such as Google Authenticator, Authy, or 1Password. This ensures that even if your password is compromised, no one can access your account without your physical device.",
  },
  {
    title: "Transfer Confirmation System",
    body: "Outgoing transfers above configurable limits trigger an additional confirmation step — either via TOTP code or email OTP. Administrators can set per-user transfer limits and require dual-approval for large transactions, reducing the risk of unauthorised payments.",
  },
  {
    title: "Account Status Controls",
    body: "Account holders and administrators can instantly freeze an account, revoke active sessions, or disable transfer access from the dashboard. These controls take effect immediately and are logged in the audit trail. Our support team can also apply emergency holds on suspected compromised accounts.",
  },
  {
    title: "Immutable Audit Logging",
    body: "Every action within Bank of Asia — login attempts, transfers, settings changes, card generation, and admin actions — is recorded in an immutable audit log with timestamps, IP addresses, and device fingerprints. These logs cannot be deleted or modified, even by administrators, and are available for export at any time.",
  },
];

function SecurityAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      {ACCORDION_ITEMS.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            style={{
              borderBottom: "1px solid var(--boa-border, #E5E9EE)",
            }}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 0",
                cursor: "pointer",
                background: "none",
                border: "none",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                {/* Number circle */}
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    backgroundColor: isOpen ? "var(--boa-teal)" : "rgba(0,200,150,0.1)",
                    color: isOpen ? "#fff" : "var(--boa-teal)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 700,
                    fontSize: 13,
                    flexShrink: 0,
                    marginRight: 16,
                    transition: "background 0.2s, color 0.2s",
                  }}
                >
                  {i + 1}
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 600,
                    fontSize: 16,
                    color: isOpen ? "var(--boa-teal)" : "var(--boa-navy)",
                    transition: "color 0.2s",
                  }}
                >
                  {item.title}
                </span>
              </div>
              {/* Plus / minus icon */}
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isOpen ? "var(--boa-teal)" : "var(--boa-muted)",
                  fontSize: 22,
                  lineHeight: 1,
                  flexShrink: 0,
                  marginLeft: 12,
                  fontWeight: 300,
                }}
              >
                +
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: "hidden" }}
                >
                  <div
                    style={{
                      paddingBottom: 20,
                      paddingLeft: 44,
                      paddingRight: 16,
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontSize: 15,
                        color: "var(--boa-muted)",
                        lineHeight: 1.75,
                        margin: 0,
                      }}
                    >
                      {item.body}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ─── FEATURES GRID ───────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "256-bit AES Encryption",
    body: "All stored data — balances, transactions, personal details — is encrypted with AES-256 at rest across all our infrastructure.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C8.5 2 5.5 4 4 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        <path d="M20 7c-1.5-3-4.5-5-8-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        <path d="M20 12a8 8 0 0 0-8-8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        <path d="M8 12a4 4 0 0 1 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        <path d="M12 12v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    ),
    title: "Biometric Login (Coming Soon)",
    body: "Fingerprint and Face ID login support is in development. Currently supported on select authenticator apps integrated with TOTP.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 3l18 18M10.5 10.5A3 3 0 0 0 13.5 13.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        <path d="M6.5 6.5C4.5 8 3 10 3 12c0 0 3 6 9 6a9.5 9.5 0 0 0 4.5-1.1M9 5.1C9.9 5 10.9 5 12 5c6 0 9 6 9 6a13 13 0 0 1-2.1 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Masked Sensitive Data",
    body: "Card numbers, CVVs, and account numbers are hidden by default. Reveal requires re-authentication with your TOTP code or password.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        <circle cx="18" cy="5" r="3" fill="var(--boa-teal)" opacity="0.7" />
      </svg>
    ),
    title: "Real-Time Alerts",
    body: "Instant push notifications and email alerts for logins, transfers, and any changes to your account. Customisable notification preferences.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="5" rx="2" stroke="currentColor" strokeWidth="1.75" />
        <rect x="3" y="11" width="18" height="5" rx="2" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="7.5" cy="6.5" r="1" fill="currentColor" />
        <circle cx="7.5" cy="13.5" r="1" fill="currentColor" />
      </svg>
    ),
    title: "Geo-Redundant Infrastructure",
    body: "Our servers operate across multiple geographic regions with automatic failover. Zero single point of failure architecture.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
        <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Independent Security Audits",
    body: "Our systems are independently audited annually by third-party security firms. Penetration testing reports and audit outcomes are available to enterprise clients.",
  },
];

// ─── TIPS ─────────────────────────────────────────────────────────────────────

const TIPS = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.75" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    ),
    title: "Use a strong, unique password",
    body: "Use a password manager to generate and store a unique password for your Bank of Asia account. Never reuse passwords from other services.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="7" y="2" width="10" height="20" rx="3" stroke="currentColor" strokeWidth="1.75" />
        <line x1="10" y1="17" x2="14" y2="17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    ),
    title: "Enable TOTP 2FA immediately",
    body: "If you haven't already, go to Settings → Security → Two-Factor Authentication and set up an authenticator app. This is the single most effective protection against account takeover.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 12c0 0 3-6 9-6s9 6 9 6-3 6-9 6-9-6-9-6z" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
      </svg>
    ),
    title: "Review your login history regularly",
    body: "Check the Login History section in your dashboard periodically. If you see a device or location you don't recognise, revoke that session immediately and change your password.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
        <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        <circle cx="12" cy="17" r="1" fill="currentColor" />
      </svg>
    ),
    title: "Never share your OTP or password",
    body: "Bank of Asia staff will never ask for your TOTP code, password, or full card number. If someone claims to be from our team and requests this information, it is a scam.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M5 12.55a11 11 0 0 1 14.08 0" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        <path d="M1.42 9a16 16 0 0 1 21.16 0" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        <circle cx="12" cy="20" r="1.5" fill="currentColor" />
      </svg>
    ),
    title: "Avoid public Wi-Fi for banking",
    body: "When accessing your account on the go, use mobile data or a trusted VPN. Public Wi-Fi networks can be monitored or manipulated by attackers.",
  },
];

// ─── COMPLIANCE BADGES ────────────────────────────────────────────────────────

const COMPLIANCE = [
  {
    emoji: "🏛️",
    label: "Licensed Institution",
    desc: "Operating under a full digital banking licence. Customer funds held in segregated custodian accounts.",
  },
  {
    emoji: "🔒",
    label: "ISO 27001 Aligned",
    desc: "Information security management aligned with ISO 27001 — covering access controls, data handling, and incident response.",
  },
  {
    emoji: "📋",
    label: "AML/KYC Compliant",
    desc: "Every customer verified under our KYC framework. All transactions screened in real-time against AML watchlists.",
  },
];

// ─── HERO VARIANTS ────────────────────────────────────────────────────────────

const heroContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.13,
    },
  },
};

const heroChild = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

// ─── FEATURE CARD ─────────────────────────────────────────────────────────────

function FeatureCard({
  icon,
  title,
  body,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" as const }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "#fff",
        border: `1px solid ${hovered ? "rgba(0,200,150,0.25)" : "var(--boa-gray-200, #E5E9EE)"}`,
        borderRadius: 12,
        padding: 24,
        transition: "border-color 0.2s, box-shadow 0.2s",
        boxShadow: hovered ? "0 4px 20px rgba(0,0,0,0.06)" : "none",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: "rgba(0,200,150,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--boa-teal)",
          marginBottom: 16,
        }}
      >
        {icon}
      </div>
      <p
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontWeight: 600,
          fontSize: 15,
          color: "var(--boa-navy)",
          marginBottom: 8,
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: 14,
          color: "var(--boa-muted)",
          lineHeight: 1.65,
        }}
      >
        {body}
      </p>
    </motion.div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function SecurityPage() {
  return (
    <>
      {/* ══════════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════════════════════════ */}
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
        {/* Grid pattern */}
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

        <div className="boa-container" style={{ position: "relative", width: "100%" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 48,
              alignItems: "center",
            }}
            className="lg:grid-cols-[54%_46%]"
          >
            {/* LEFT */}
            <motion.div
              variants={heroContainer}
              initial="hidden"
              animate="show"
            >
              {/* Eyebrow pill */}
              <motion.div variants={heroChild}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    backgroundColor: "rgba(0,200,150,0.1)",
                    border: "1px solid rgba(0,200,150,0.28)",
                    color: "var(--boa-teal)",
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: 13,
                    fontWeight: 600,
                    borderRadius: 9999,
                    padding: "8px 16px",
                    marginBottom: 24,
                  }}
                >
                  SECURITY
                </span>
              </motion.div>

              {/* H1 */}
              <motion.h1
                variants={heroChild}
                style={{
                  fontFamily: "var(--font-syne)",
                  fontSize: "clamp(32px, 4.5vw, 56px)",
                  color: "#fff",
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                  marginBottom: 24,
                }}
              >
                Your security is our architecture.
              </motion.h1>

              {/* Body */}
              <motion.p
                variants={heroChild}
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: 17,
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.75,
                  marginBottom: 36,
                  maxWidth: 520,
                }}
              >
                Every layer of Bank of Asia is designed with security as the foundation. From TLS 1.3 encryption to immutable audit logs — your money and data are protected at every step.
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={heroChild}
                style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 32 }}
              >
                <a
                  href="#features"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    backgroundColor: "var(--boa-teal)",
                    color: "#fff",
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 600,
                    fontSize: 16,
                    padding: "14px 28px",
                    borderRadius: 8,
                    textDecoration: "none",
                  }}
                >
                  View security features
                </a>
                <a
                  href="#report"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    backgroundColor: "transparent",
                    color: "#fff",
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 600,
                    fontSize: 16,
                    padding: "14px 28px",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.35)",
                    textDecoration: "none",
                  }}
                >
                  Report a concern
                </a>
              </motion.div>

              {/* Trust row */}
              <motion.div
                variants={heroChild}
                style={{ display: "flex", flexWrap: "wrap", gap: 20 }}
              >
                {["✓ TLS 1.3", "✓ TOTP 2FA", "✓ Audit logs"].map((item) => (
                  <span
                    key={item}
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: 14,
                      color: "rgba(255,255,255,0.55)",
                    }}
                  >
                    {item}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* RIGHT — shield visual, hidden on mobile */}
            <div
              className="hidden lg:flex"
              style={{ justifyContent: "center", alignItems: "center" }}
            >
              <ShieldVisual />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2 — SECURITY LAYERS ACCORDION
      ══════════════════════════════════════════════════════════════ */}
      <section className="boa-section" style={{ backgroundColor: "#fff" }}>
        <div className="boa-container" style={{ maxWidth: 860, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "var(--boa-teal)",
              marginBottom: 12,
            }}
          >
            SECURITY LAYERS
          </p>
          <h2
            style={{
              fontFamily: "var(--font-syne)",
              fontSize: 36,
              color: "var(--boa-navy)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: 40,
            }}
          >
            How we protect your account.
          </h2>
          <SecurityAccordion />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3 — SECURITY FEATURES GRID
      ══════════════════════════════════════════════════════════════ */}
      <section
        id="features"
        className="boa-section"
        style={{ backgroundColor: "#F8F9FA" }}
      >
        <div className="boa-container">
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "var(--boa-teal)",
              marginBottom: 12,
            }}
          >
            SECURITY FEATURES
          </p>
          <h2
            style={{
              fontFamily: "var(--font-syne)",
              fontSize: 36,
              color: "var(--boa-navy)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: 0,
            }}
          >
            Six layers of protection.
          </h2>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            style={{ marginTop: 40 }}
          >
            {FEATURES.map((f, i) => (
              <FeatureCard
                key={f.title}
                icon={f.icon}
                title={f.title}
                body={f.body}
                delay={i * 0.08}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4 — CUSTOMER SECURITY TIPS
      ══════════════════════════════════════════════════════════════ */}
      <section className="boa-section" style={{ backgroundColor: "#fff" }}>
        <div className="boa-container" style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-syne)",
              fontSize: 34,
              color: "var(--boa-navy)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: 40,
            }}
          >
            How to keep your account safe.
          </h2>

          <div>
            {TIPS.map((tip, i) => (
              <TipRow key={tip.title} tip={tip} index={i} isLast={i === TIPS.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 5 — COMPLIANCE BADGES
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: "#F8F9FA", padding: "64px 0" }}>
        <div className="boa-container" style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-syne)",
              fontSize: 30,
              color: "var(--boa-navy)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              textAlign: "center",
              marginBottom: 40,
            }}
          >
            Our compliance credentials.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {COMPLIANCE.map((c, i) => (
              <ComplianceCard key={c.label} item={c} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 6 — REPORT A CONCERN
      ══════════════════════════════════════════════════════════════ */}
      <section
        id="report"
        style={{ backgroundColor: "#0A1628", padding: "80px 0", textAlign: "center" }}
      >
        <div className="boa-container" style={{ maxWidth: 580, margin: "0 auto" }}>
          <ReportSection />
        </div>
      </section>
    </>
  );
}

// ─── TIP ROW ──────────────────────────────────────────────────────────────────

function TipRow({
  tip,
  index,
  isLast,
}: {
  tip: (typeof TIPS)[number];
  index: number;
  isLast: boolean;
}) {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" as const }}
      style={{
        display: "flex",
        gap: 20,
        alignItems: "flex-start",
        paddingTop: 24,
        paddingBottom: 24,
        borderBottom: isLast ? "none" : "1px solid var(--boa-border, #E5E9EE)",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: "rgba(0,200,150,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--boa-teal)",
          flexShrink: 0,
        }}
      >
        {tip.icon}
      </div>
      {/* Text */}
      <div>
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 600,
            fontSize: 16,
            color: "var(--boa-navy)",
            marginBottom: 4,
          }}
        >
          {tip.title}
        </p>
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: 14,
            color: "var(--boa-muted)",
            lineHeight: 1.65,
          }}
        >
          {tip.body}
        </p>
      </div>
    </motion.div>
  );
}

// ─── COMPLIANCE CARD ──────────────────────────────────────────────────────────

function ComplianceCard({
  item,
  delay,
}: {
  item: (typeof COMPLIANCE)[number];
  delay: number;
}) {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" as const }}
      style={{
        backgroundColor: "#fff",
        border: "1px solid var(--boa-gray-200, #E5E9EE)",
        borderRadius: 16,
        padding: 28,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 36, marginBottom: 16 }}>{item.emoji}</div>
      <p
        style={{
          fontFamily: "var(--font-syne)",
          fontWeight: 700,
          fontSize: 17,
          color: "var(--boa-navy)",
          marginBottom: 10,
        }}
      >
        {item.label}
      </p>
      <p
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: 14,
          color: "var(--boa-muted)",
          lineHeight: 1.65,
        }}
      >
        {item.desc}
      </p>
    </motion.div>
  );
}

// ─── REPORT SECTION ───────────────────────────────────────────────────────────

function ReportSection() {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" as const }}
    >
      <h2
        style={{
          fontFamily: "var(--font-syne)",
          fontSize: "clamp(26px, 3.5vw, 40px)",
          color: "#fff",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          marginBottom: 16,
        }}
      >
        Found a security issue?
      </h2>
      <p
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: 16,
          color: "rgba(255,255,255,0.6)",
          lineHeight: 1.7,
          marginBottom: 32,
          maxWidth: 480,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        We take all security reports seriously. If you&apos;ve discovered a vulnerability or have a concern about your account, contact our security team immediately.
      </p>

      <a
        href="mailto:security@bankofasia.com"
        style={{
          display: "inline-flex",
          alignItems: "center",
          backgroundColor: "var(--boa-teal)",
          color: "#fff",
          fontFamily: "var(--font-dm-sans)",
          fontWeight: 600,
          fontSize: 16,
          padding: "16px 32px",
          borderRadius: 8,
          textDecoration: "none",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#00A87E";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--boa-teal)";
        }}
      >
        📧 security@bankofasia.com
      </a>

      <p
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: 13,
          color: "rgba(255,255,255,0.4)",
          marginTop: 16,
        }}
      >
        Response time: within 24 hours. Critical issues: within 2 hours.
      </p>
    </motion.div>
  );
}
