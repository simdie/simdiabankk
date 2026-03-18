"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import EditorialBanner from "@/components/marketing/EditorialBanner";

/* ─────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────── */
interface AnimatedCounterProps {
  target: number;
  suffix: string;
  prefix?: string;
  label: string;
  color: string;
  isDecimal?: boolean;
}

function AnimatedCounter({
  target,
  suffix,
  prefix = "",
  label,
  color,
  isDecimal = false,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(isDecimal ? "0.0" : "0");
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      if (isDecimal) {
        const current = eased * target;
        const stepped = Math.round(current / 0.1) * 0.1;
        setDisplay(stepped.toFixed(1));
      } else {
        const current = Math.round(eased * target);
        setDisplay(current.toLocaleString());
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [inView, target, isDecimal]);

  return (
    <div
      ref={ref}
      style={{ padding: "40px 32px", borderRight: "1px solid rgba(255,255,255,0.1)" }}
      className="last:border-r-0"
    >
      <div
        style={{
          fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
          fontSize: "clamp(36px, 4vw, 52px)",
          lineHeight: 1,
          fontWeight: 400,
          color,
        }}
      >
        {prefix}
        {display}
        {suffix}
      </div>
      <div
        style={{
          fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
          fontSize: 12,
          color: "rgba(255,255,255,0.45)",
          textTransform: "uppercase" as const,
          letterSpacing: "0.1em",
          marginTop: 8,
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   HERO COMPOSITE VISUAL
───────────────────────────────────────────── */
function HeroVisual() {
  const BAR_HEIGHTS = [55, 40, 75, 50, 90, 65, 88];
  const TRANSACTIONS = [
    { icon: "↗", label: "Transfer to HK", amount: "-S$800", positive: false },
    { icon: "↙", label: "Salary Credit", amount: "+S$4,200", positive: true },
    { icon: "↗", label: "Rent Payment", amount: "-S$1,500", positive: false },
  ];

  return (
    <div style={{ position: "relative", width: 460, height: 520 }}>
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, rgba(0,200,150,0.07) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Outer rotating ring */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        <svg width="420" height="420" viewBox="0 0 420 420">
          <circle
            cx="210"
            cy="210"
            r="195"
            fill="none"
            stroke="rgba(0,200,150,0.10)"
            strokeWidth="1"
            strokeDasharray="6 18"
          />
        </svg>
      </motion.div>

      {/* Inner counter-rotating ring */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      >
        <svg width="290" height="290" viewBox="0 0 290 290">
          <circle
            cx="145"
            cy="145"
            r="130"
            fill="none"
            stroke="rgba(200,151,42,0.09)"
            strokeWidth="1"
            strokeDasharray="3 10"
          />
        </svg>
      </motion.div>

      {/* ── Profile card (centre) ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -54%)",
          background: "rgba(255,255,255,0.055)",
          border: "1px solid rgba(255,255,255,0.13)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderRadius: 20,
          padding: "24px 26px",
          width: 248,
          zIndex: 4,
        }}
      >
        {/* Avatar + name row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #00C896, #00A87E)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
              fontWeight: 700,
              fontSize: 16,
              color: "white",
              flexShrink: 0,
            }}
          >
            SC
          </div>
          <div>
            <div
              style={{
                color: "white",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                lineHeight: 1.2,
              }}
            >
              Sarah Chen
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.48)",
                fontSize: 12,
                fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
              }}
            >
              Premium Savings
            </div>
          </div>
        </div>

        {/* Balance */}
        <div
          style={{
            color: "rgba(255,255,255,0.42)",
            fontSize: 10,
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
            fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
            marginBottom: 5,
          }}
        >
          TOTAL BALANCE
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            fontSize: 28,
            fontWeight: 700,
            color: "white",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          S$24,850
          <span style={{ fontSize: 16, color: "rgba(255,255,255,0.42)" }}>
            .00
          </span>
        </div>

        <div
          style={{
            height: 1,
            background: "rgba(255,255,255,0.08)",
            margin: "14px 0",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              color: "#00C896",
              fontSize: 12,
              fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
              fontWeight: 500,
            }}
          >
            ▲ +2.4% this month
          </span>
          <span
            style={{
              background: "rgba(0,200,150,0.14)",
              color: "#00C896",
              fontSize: 10,
              fontWeight: 700,
              borderRadius: 6,
              padding: "3px 8px",
              fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
              letterSpacing: "0.04em",
            }}
          >
            ACTIVE
          </span>
        </div>
      </motion.div>

      {/* ── Stats card (bottom-left, floating) ── */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        style={{
          position: "absolute",
          bottom: "10%",
          left: "0%",
          background: "rgba(10,22,40,0.88)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 16,
          padding: "16px 18px",
          width: 184,
          zIndex: 5,
        }}
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
              marginBottom: 10,
            }}
          >
            THIS MONTH
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <div>
              <div
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: 10,
                  fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                  marginBottom: 2,
                }}
              >
                Sent
              </div>
              <div
                style={{
                  color: "white",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                }}
              >
                S$2,400
              </div>
            </div>
            <div style={{ textAlign: "right" as const }}>
              <div
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: 10,
                  fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                  marginBottom: 2,
                }}
              >
                Received
              </div>
              <div
                style={{
                  color: "#00C896",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                }}
              >
                S$5,200
              </div>
            </div>
          </div>
          {/* Mini bar chart */}
          <div
            style={{
              display: "flex",
              gap: 3,
              alignItems: "flex-end",
              height: 28,
            }}
          >
            {BAR_HEIGHTS.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  background:
                    i === BAR_HEIGHTS.length - 1
                      ? "#00C896"
                      : "rgba(255,255,255,0.14)",
                  borderRadius: 2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* ── Achievement badge (top-right, pulse) ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.9, type: "spring" }}
        style={{
          position: "absolute",
          top: "7%",
          right: "3%",
          background: "rgba(0,200,150,0.11)",
          border: "1px solid rgba(0,200,150,0.28)",
          borderRadius: 12,
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          zIndex: 5,
        }}
      >
        {/* Pulse dot */}
        <div style={{ position: "relative", width: 10, height: 10, flexShrink: 0 }}>
          <motion.div
            animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: "#00C896",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 2,
              borderRadius: "50%",
              background: "#00C896",
            }}
          />
        </div>
        <span
          style={{
            color: "#00C896",
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
            whiteSpace: "nowrap" as const,
          }}
        >
          MAS Verified
        </span>
      </motion.div>

      {/* ── Activity feed (bottom-right, slide up) ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.1 }}
        style={{
          position: "absolute",
          bottom: "2%",
          right: "0%",
          background: "rgba(255,255,255,0.045)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 16,
          padding: "14px 16px",
          width: 210,
          zIndex: 5,
        }}
      >
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <div
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
              marginBottom: 10,
            }}
          >
            RECENT ACTIVITY
          </div>
          {TRANSACTIONS.map((tx, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: i < TRANSACTIONS.length - 1 ? 8 : 0,
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: tx.positive
                    ? "rgba(0,200,150,0.15)"
                    : "rgba(255,107,107,0.13)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  color: tx.positive ? "#00C896" : "#FF6B6B",
                  flexShrink: 0,
                }}
              >
                {tx.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    color: "rgba(255,255,255,0.65)",
                    fontSize: 11,
                    fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap" as const,
                  }}
                >
                  {tx.label}
                </div>
              </div>
              <div
                style={{
                  color: tx.positive ? "#00C896" : "#FF6B6B",
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                  flexShrink: 0,
                }}
              >
                {tx.amount}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function AboutPage() {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);

  const heroContainer = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.13 },
    },
  };

  const heroItem = {
    hidden: { opacity: 0, x: -40 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  const values = [
    {
      emoji: "🛡️",
      title: "Security First",
      body: "We build every product with security as the foundation, not an afterthought. 256-bit encryption, TOTP 2FA, and immutable audit logs protect every account.",
    },
    {
      emoji: "🌏",
      title: "Global Access",
      body: "Banking shouldn't be limited by borders. We support 10 currencies, 180+ destination countries, and SWIFT transfers so your money can go where you do.",
    },
    {
      emoji: "💡",
      title: "Radical Transparency",
      body: "We publish every fee, every rate, and every policy. No hidden charges, no confusing fine print. If you need to understand a cost, we make it easy to find.",
    },
    {
      emoji: "🤝",
      title: "Built with Community",
      body: "Our product roadmap is driven by customer feedback. We hold quarterly open sessions where customers can ask questions, suggest features, and hold us accountable.",
    },
  ];

  const team = [
    {
      initials: "JW",
      name: "James Whitfield",
      title: "CEO & Co-Founder",
      location: "📍 New York",
      bio: "Former Goldman Sachs VP. Founded Bank of Asia to make global banking accessible to everyone, not just the Fortune 500.",
    },
    {
      initials: "PS",
      name: "Priya Sharma",
      title: "Chief Technology Officer",
      location: "📍 Singapore",
      bio: "Ex-Stripe engineering lead. Architected the multi-currency core banking engine and real-time transfer infrastructure.",
    },
    {
      initials: "ML",
      name: "Marcus Li",
      title: "Head of Compliance",
      location: "📍 Singapore",
      bio: "15 years in financial regulation across MAS and HKMA. Ensures every product meets the highest compliance standards.",
    },
  ];

  const badges = [
    {
      icon: "🏛️",
      title: "Licensed Financial Institution",
      body: "Bank of Asia operates under a full digital banking licence. All customer funds are held in segregated accounts with licensed custodian partners.",
    },
    {
      icon: "🔒",
      title: "ISO 27001 Information Security",
      body: "Our information security management system is aligned with ISO 27001 standards, covering data handling, access controls, and incident response.",
    },
    {
      icon: "📋",
      title: "Full AML/KYC Compliance",
      body: "Every customer is identity-verified under our KYC framework. All transactions are screened against AML watchlists in real-time.",
    },
  ];

  return (
    <main>
      {/* ───────────────────────────────────────
          SECTION 1 — HERO
      ─────────────────────────────────────── */}
      <section
        style={{
          background: "#0A1628",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          paddingTop: 96,
          paddingBottom: 96,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dot grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
          }}
        />

        <div
          className="boa-container"
          style={{ position: "relative", zIndex: 1, width: "100%" }}
        >
          <div
            style={{
              display: "grid",
              gap: 48,
              alignItems: "center",
            }}
            className="grid-cols-1 lg:grid-cols-[54%_46%]"
          >
            {/* LEFT */}
            <motion.div variants={heroContainer} initial="hidden" animate="show">
              {/* Eyebrow pill */}
              <motion.div variants={heroItem} style={{ marginBottom: 24 }}>
                <span
                  style={{
                    display: "inline-block",
                    background: "rgba(0,200,150,0.1)",
                    border: "1px solid rgba(0,200,150,0.28)",
                    color: "var(--boa-teal, #00C896)",
                    fontFamily:
                      "var(--font-dm-sans, 'DM Sans', sans-serif)",
                    fontSize: 13,
                    fontWeight: 600,
                    borderRadius: 9999,
                    padding: "8px 16px",
                  }}
                >
                  OUR STORY
                </span>
              </motion.div>

              {/* H1 */}
              <motion.h1
                variants={heroItem}
                style={{
                  fontFamily: "var(--font-syne, 'Syne', sans-serif)",
                  fontSize: "clamp(36px, 5vw, 64px)",
                  color: "white",
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  marginBottom: 24,
                  fontWeight: 700,
                }}
              >
                Banking for and with you.
              </motion.h1>

              {/* Body */}
              <motion.p
                variants={heroItem}
                style={{
                  fontFamily:
                    "var(--font-dm-sans, 'DM Sans', sans-serif)",
                  fontSize: 17,
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.75,
                  marginBottom: 36,
                  maxWidth: 560,
                }}
              >
                Founded with one mission — make global banking accessible,
                transparent, and powerful for everyone. From Singapore to New
                York, we&apos;re building the future of finance.
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={heroItem}
                style={{
                  display: "flex",
                  gap: 16,
                  flexWrap: "wrap" as const,
                }}
              >
                <Link
                  href="/register" target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    background: "var(--boa-teal, #00C896)",
                    color: "white",
                    fontFamily:
                      "var(--font-dm-sans, 'DM Sans', sans-serif)",
                    fontSize: 16,
                    fontWeight: 600,
                    padding: "14px 28px",
                    borderRadius: 8,
                    textDecoration: "none",
                  }}
                >
                  Open an Account
                </Link>
                <a
                  href="#team"
                  style={{
                    display: "inline-block",
                    background: "transparent",
                    color: "white",
                    fontFamily:
                      "var(--font-dm-sans, 'DM Sans', sans-serif)",
                    fontSize: 16,
                    fontWeight: 600,
                    padding: "14px 28px",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.4)",
                    textDecoration: "none",
                  }}
                >
                  Meet the team
                </a>
              </motion.div>
            </motion.div>

            {/* RIGHT — Animated composite visual (hidden on mobile) */}
            <div
              style={{ display: "none" }}
              className="lg:flex lg:justify-center lg:items-center"
            >
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* Banner image */}
      <section data-protected="true" style={{ marginTop: "clamp(48px, 6vw, 80px)", marginBottom: "clamp(48px, 6vw, 80px)", overflow: "hidden", width: "100%" }}>
        <div className="protected-image" onContextMenu={e => e.preventDefault()} style={{ position: "relative", overflow: "hidden", filter: "contrast(1.01) saturate(0.99)" }}>
          <Image
            src="/banner-image5.png"
            alt="Bank of Asia team"
            width={1920}
            height={600}
            draggable={false}
            style={{ width: "100%", height: "clamp(220px, 28vw, 420px)", objectFit: "cover", objectPosition: "center", display: "block", transform: "scaleX(1.001)", userSelect: "none", WebkitUserSelect: "none" }}
            priority={false}
          />
        </div>
      </section>

      {/* ───────────────────────────────────────
          SECTION 2 — MISSION
      ─────────────────────────────────────── */}
      <section className="boa-section" style={{ background: "white" }}>
        <div className="boa-container">
          <div
            style={{
              display: "grid",
              gap: 64,
              alignItems: "start",
            }}
            className="grid-cols-1 lg:grid-cols-2"
          >
            {/* LEFT — pull quote */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <blockquote
                style={{
                  fontFamily: "var(--font-syne, 'Syne', sans-serif)",
                  fontWeight: 700,
                  fontSize: "clamp(24px, 3vw, 36px)",
                  lineHeight: 1.3,
                  letterSpacing: "-0.01em",
                  background: "linear-gradient(135deg, #00C896, #00A87E)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  margin: 0,
                }}
              >
                &ldquo;We believe every person deserves access to world-class
                financial infrastructure.&rdquo;
              </blockquote>
              <div
                style={{
                  marginTop: 24,
                  height: 3,
                  width: 60,
                  background: "var(--boa-teal, #00C896)",
                  borderRadius: 2,
                }}
              />
            </motion.div>

            {/* RIGHT — paragraphs */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              viewport={{ once: true }}
              style={{
                display: "flex",
                flexDirection: "column" as const,
                gap: 20,
              }}
            >
              <p
                style={{
                  fontFamily:
                    "var(--font-dm-sans, 'DM Sans', sans-serif)",
                  fontSize: 16,
                  color: "var(--boa-muted, #64748B)",
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                Bank of Asia was founded in 2020 with a simple but ambitious
                goal: give every individual and business access to the same
                financial infrastructure that was once reserved for large
                corporations. We started in Singapore and have grown to serve
                customers in 40+ countries.
              </p>
              <p
                style={{
                  fontFamily:
                    "var(--font-dm-sans, 'DM Sans', sans-serif)",
                  fontSize: 16,
                  color: "var(--boa-muted, #64748B)",
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                Our mission is rooted in transparency. We don&apos;t believe
                in hidden fees, confusing rate structures, or opaque foreign
                exchange margins. Everything we charge is published and
                explained. If you ever wonder what a fee is for, the answer is
                one click away.
              </p>
              <p
                style={{
                  fontFamily:
                    "var(--font-dm-sans, 'DM Sans', sans-serif)",
                  fontSize: 16,
                  color: "var(--boa-muted, #64748B)",
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                We are committed to continuous improvement — in our technology,
                our compliance posture, and our relationship with our customers.
                Your trust is our most important asset.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────
          SECTION 3 — BY THE NUMBERS
      ─────────────────────────────────────── */}
      <section
        style={{ background: "#0A1628", paddingTop: 80, paddingBottom: 80 }}
      >
        <div className="boa-container">
          <p
            style={{
              fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
              fontSize: 11,
              color: "var(--boa-teal, #00C896)",
              textTransform: "uppercase" as const,
              letterSpacing: "0.2em",
              textAlign: "center" as const,
              marginBottom: 32,
              fontWeight: 600,
            }}
          >
            BY THE NUMBERS
          </p>

          <div
            style={{ display: "grid" }}
            className="grid-cols-2 lg:grid-cols-4"
          >
            <AnimatedCounter
              target={50000}
              suffix="+"
              label="Active Customers"
              color="var(--boa-teal, #00C896)"
            />
            <AnimatedCounter
              target={10}
              suffix=""
              label="Currencies Supported"
              color="var(--boa-gold, #C8972A)"
            />
            <AnimatedCounter
              target={180}
              suffix="+"
              label="Destination Countries"
              color="var(--boa-teal, #00C896)"
            />
            <AnimatedCounter
              target={2.4}
              suffix="B+"
              prefix="$"
              label="Total Volume Processed"
              color="var(--boa-gold, #C8972A)"
              isDecimal={true}
            />
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────
          SECTION 4 — OUR VALUES
      ─────────────────────────────────────── */}
      <section className="boa-section" style={{ background: "white" }}>
        <div className="boa-container">
          <p
            style={{
              fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
              fontSize: 11,
              color: "var(--boa-teal, #00C896)",
              textTransform: "uppercase" as const,
              letterSpacing: "0.2em",
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            OUR VALUES
          </p>
          <h2
            style={{
              fontFamily: "var(--font-syne, 'Syne', sans-serif)",
              fontSize: 36,
              color: "var(--boa-navy, #0A1628)",
              fontWeight: 700,
              marginBottom: 0,
            }}
          >
            What drives everything we do.
          </h2>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              show: { transition: { staggerChildren: 0.08 } },
            }}
            style={{
              display: "grid",
              gap: 20,
              marginTop: 40,
            }}
            className="grid-cols-1 sm:grid-cols-2"
          >
            {values.map((val, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.5,
                      ease: "easeOut" as const,
                    },
                  },
                }}
                onMouseEnter={() => setHoveredValue(i)}
                onMouseLeave={() => setHoveredValue(null)}
                style={{
                  background: "var(--boa-off-white, #F8F9FA)",
                  border: `1px solid ${
                    hoveredValue === i
                      ? "rgba(0,200,150,0.25)"
                      : "var(--boa-gray-200, #E5E9EE)"
                  }`,
                  borderRadius: 16,
                  padding: 28,
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  boxShadow:
                    hoveredValue === i
                      ? "0 4px 20px rgba(0,0,0,0.06)"
                      : "none",
                  cursor: "default",
                }}
              >
                {/* Emoji container */}
                <div
                  style={{
                    background: "rgba(0,200,150,0.1)",
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 56,
                    height: 56,
                    marginBottom: 16,
                    fontSize: 26,
                  }}
                >
                  {val.emoji}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-syne, 'Syne', sans-serif)",
                    fontWeight: 600,
                    fontSize: 18,
                    color: "var(--boa-navy, #0A1628)",
                    marginBottom: 8,
                  }}
                >
                  {val.title}
                </h3>
                <p
                  style={{
                    fontFamily:
                      "var(--font-dm-sans, 'DM Sans', sans-serif)",
                    fontSize: 15,
                    color: "var(--boa-muted, #64748B)",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {val.body}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───────────────────────────────────────
          SECTION 5 — LEADERSHIP TEAM
      ─────────────────────────────────────── */}
      <section
        id="team"
        className="boa-section"
        style={{ background: "var(--boa-off-white, #F8F9FA)" }}
      >
        <div className="boa-container">
          <p
            style={{
              fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
              fontSize: 11,
              color: "var(--boa-teal, #00C896)",
              textTransform: "uppercase" as const,
              letterSpacing: "0.2em",
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            LEADERSHIP
          </p>
          <h2
            style={{
              fontFamily: "var(--font-syne, 'Syne', sans-serif)",
              fontSize: 36,
              color: "var(--boa-navy, #0A1628)",
              fontWeight: 700,
              marginBottom: 0,
            }}
          >
            The team behind Bank of Asia.
          </h2>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              show: { transition: { staggerChildren: 0.1 } },
            }}
            style={{
              display: "grid",
              gap: 24,
              marginTop: 40,
            }}
            className="grid-cols-1 sm:grid-cols-3"
          >
            {team.map((member, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.5,
                      ease: "easeOut" as const,
                    },
                  },
                }}
                onMouseEnter={() => setHoveredMember(i)}
                onMouseLeave={() => setHoveredMember(null)}
                style={{
                  background: "white",
                  border: "1px solid var(--boa-gray-200, #E5E9EE)",
                  borderRadius: 16,
                  padding: 28,
                  textAlign: "center" as const,
                  transition: "box-shadow 0.2s",
                  boxShadow:
                    hoveredMember === i
                      ? "0 8px 30px rgba(0,0,0,0.08)"
                      : "none",
                  cursor: "default",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #0A1628, #162B52)",
                    border: "2px solid rgba(0,200,150,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                  }}
                >
                  <span
                    style={{
                      fontFamily:
                        "var(--font-dm-sans, 'DM Sans', sans-serif)",
                      fontWeight: 700,
                      fontSize: 22,
                      color: "var(--boa-gold, #C8972A)",
                    }}
                  >
                    {member.initials}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: "var(--font-syne, 'Syne', sans-serif)",
                    fontWeight: 600,
                    fontSize: 17,
                    color: "var(--boa-navy, #0A1628)",
                    marginBottom: 4,
                  }}
                >
                  {member.name}
                </h3>
                <p
                  style={{
                    fontFamily:
                      "var(--font-dm-sans, 'DM Sans', sans-serif)",
                    fontWeight: 500,
                    fontSize: 14,
                    color: "var(--boa-teal, #00C896)",
                    margin: 0,
                  }}
                >
                  {member.title}
                </p>
                <p
                  style={{
                    fontFamily:
                      "var(--font-dm-sans, 'DM Sans', sans-serif)",
                    fontSize: 13,
                    color: "var(--boa-muted, #64748B)",
                    marginTop: 4,
                    marginBottom: 0,
                  }}
                >
                  {member.location}
                </p>

                <div
                  style={{
                    height: 1,
                    background: "var(--boa-gray-200, #E5E9EE)",
                    margin: "16px 0",
                  }}
                />

                <p
                  style={{
                    fontFamily:
                      "var(--font-dm-sans, 'DM Sans', sans-serif)",
                    fontSize: 14,
                    color: "var(--boa-muted, #64748B)",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───────────────────────────────────────
          SECTION 6 — COMPLIANCE BADGES
      ─────────────────────────────────────── */}
      <section
        style={{ background: "white", paddingTop: 64, paddingBottom: 64 }}
      >
        <div className="boa-container">
          <h2
            style={{
              fontFamily: "var(--font-syne, 'Syne', sans-serif)",
              fontSize: 30,
              color: "var(--boa-navy, #0A1628)",
              fontWeight: 700,
              textAlign: "center" as const,
              marginBottom: 12,
            }}
          >
            Licensed and regulated.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
              fontSize: 16,
              color: "var(--boa-muted, #64748B)",
              textAlign: "center" as const,
              marginBottom: 40,
            }}
          >
            We operate under the highest regulatory standards.
          </p>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              show: { transition: { staggerChildren: 0.1 } },
            }}
            style={{
              display: "grid",
              gap: 20,
              maxWidth: 860,
              margin: "0 auto",
            }}
            className="grid-cols-1 sm:grid-cols-3"
          >
            {badges.map((badge, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.5,
                      ease: "easeOut" as const,
                    },
                  },
                }}
                style={{
                  background: "var(--boa-off-white, #F8F9FA)",
                  border: "1px solid var(--boa-gray-200, #E5E9EE)",
                  borderRadius: 16,
                  padding: 28,
                  textAlign: "center" as const,
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 12 }}>
                  {badge.icon}
                </div>
                <h3
                  style={{
                    fontFamily:
                      "var(--font-dm-sans, 'DM Sans', sans-serif)",
                    fontWeight: 600,
                    fontSize: 15,
                    color: "var(--boa-navy, #0A1628)",
                    marginBottom: 8,
                  }}
                >
                  {badge.title}
                </h3>
                <p
                  style={{
                    fontFamily:
                      "var(--font-dm-sans, 'DM Sans', sans-serif)",
                    fontSize: 13,
                    color: "var(--boa-muted, #64748B)",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {badge.body}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <EditorialBanner
        headline="Ready to bank with us?"
        subtext="Join 50,000+ customers who trust Bank of Asia with their finances."
        ctaText="Open an Account"
        ctaHref="/register"
        ctaText2="Meet the team →"
        ctaHref2="#team"
      />
    </main>
  );
}
