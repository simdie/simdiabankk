"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const BLINKERS = [
  { top: "12%", left: "8%",  delay: 0 },
  { top: "25%", right: "10%", delay: 0.7 },
  { top: "55%", left: "5%",  delay: 1.2 },
  { bottom: "20%", right: "8%", delay: 0.4 },
  { bottom: "35%", left: "18%", delay: 1.6 },
  { top: "70%", right: "22%", delay: 0.9 },
];

function CountUp({ target }: { target: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 900;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return <>{count}</>;
}

export default function MarketingNotFound() {
  return (
    <div
      className="relative flex flex-col items-center justify-center overflow-hidden px-6"
      style={{ minHeight: "80vh", backgroundColor: "var(--boa-navy)" }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none hero-grid-bg"
        style={{ opacity: 0.7 }}
      />

      {/* Pulsing blinker dots */}
      {BLINKERS.map((pos, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            ...pos,
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "#00C896",
            animation: `blinker-dot ${2 + (i % 3) * 0.4}s ease-in-out ${pos.delay}s infinite`,
            boxShadow: "0 0 8px rgba(0,200,150,0.8)",
          }}
        />
      ))}

      {/* Content */}
      <div className="relative text-center max-w-xl z-10">
        {/* Big 404 */}
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-bold leading-none select-none"
          style={{
            fontFamily: "var(--font-syne, var(--font-inter))",
            fontSize: "clamp(100px, 20vw, 160px)",
            fontWeight: 800,
            letterSpacing: "-0.05em",
            background: "linear-gradient(135deg, #00C896, #00A8FF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1,
            marginBottom: 4,
          }}
        >
          <CountUp target={404} />
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.3, ease: "easeOut" }}
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-widest mb-4"
            style={{ color: "var(--boa-teal)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
          >
            Page not found
          </p>
          <h1
            className="font-bold mb-3"
            style={{
              fontFamily: "var(--font-syne, var(--font-inter))",
              fontSize: "clamp(20px, 3vw, 28px)",
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}
          >
            We couldn&apos;t find that page.
          </h1>
          <p
            className="mb-8 mx-auto"
            style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.55)",
              fontFamily: "var(--font-dm-sans, var(--font-inter))",
              lineHeight: 1.7,
              maxWidth: 400,
            }}
          >
            The page you&apos;re looking for may have been moved, deleted, or the link may be incorrect.
          </p>

          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <Link
              href="/"
              className="px-6 py-3 rounded-xl text-[14px] font-semibold transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "var(--boa-teal)",
                color: "var(--boa-navy)",
                fontFamily: "var(--font-dm-sans, var(--font-inter))",
              }}
            >
              Go Home
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl text-[14px] font-semibold border transition-opacity hover:opacity-80"
              style={{
                borderColor: "rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.85)",
                fontFamily: "var(--font-dm-sans, var(--font-inter))",
              }}
            >
              Contact Support
            </Link>
          </div>

          <div className="flex flex-wrap gap-5 justify-center">
            {[
              { label: "Personal Banking", href: "/personal" },
              { label: "Business Banking", href: "/business" },
              { label: "Interest Rates", href: "/interest-rates" },
              { label: "International", href: "/international" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[12px] transition-opacity hover:opacity-100"
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "var(--font-dm-sans, var(--font-inter))",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
