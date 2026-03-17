"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export interface EditorialBannerProps {
  headline: string;
  subtext: string;
  ctaText: string;
  ctaHref: string;
  /** Optional second CTA */
  ctaText2?: string;
  ctaHref2?: string;
  /** Decorative accent colour (default: #00C896) */
  accentColor?: string;
  /** Dark navy background (default: #0A1628) */
  bgColor?: string;
}

export default function EditorialBanner({
  headline,
  subtext,
  ctaText,
  ctaHref,
  ctaText2,
  ctaHref2,
  accentColor = "#00C896",
  bgColor = "#0A1628",
}: EditorialBannerProps) {
  return (
    <section
      style={{
        backgroundColor: bgColor,
        position: "relative",
        overflow: "hidden",
        paddingTop: "clamp(56px, 8vw, 96px)",
        paddingBottom: "clamp(56px, 8vw, 96px)",
      }}
    >
      {/* Subtle dot grid */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          pointerEvents: "none",
        }}
      />

      {/* Radial glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "70%",
          height: "60%",
          background: `radial-gradient(ellipse at 50% 100%, ${accentColor}18 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <div
        className="boa-container"
        style={{ position: "relative", zIndex: 1, textAlign: "center" }}
      >
        {/* Accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            width: 48,
            height: 3,
            backgroundColor: accentColor,
            borderRadius: 2,
            margin: "0 auto 28px",
            transformOrigin: "left",
          }}
        />

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          style={{
            fontFamily: "var(--font-syne, sans-serif)",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.15,
            letterSpacing: "-0.025em",
            marginBottom: 20,
          }}
        >
          {headline}
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
          style={{
            fontFamily: "var(--font-dm-sans, sans-serif)",
            fontSize: "clamp(15px, 1.8vw, 18px)",
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.7,
            maxWidth: 600,
            margin: "0 auto 40px",
          }}
        >
          {subtext}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}
        >
          <Link
            href={ctaHref}
            style={{
              display: "inline-flex",
              alignItems: "center",
              backgroundColor: accentColor,
              color: "#fff",
              borderRadius: 8,
              padding: "14px 32px",
              fontFamily: "var(--font-dm-sans, sans-serif)",
              fontWeight: 600,
              fontSize: 16,
              textDecoration: "none",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {ctaText}
          </Link>

          {ctaText2 && ctaHref2 && (
            <Link
              href={ctaHref2}
              style={{
                display: "inline-flex",
                alignItems: "center",
                border: "1.5px solid rgba(255,255,255,0.35)",
                color: "#fff",
                borderRadius: 8,
                padding: "14px 32px",
                fontFamily: "var(--font-dm-sans, sans-serif)",
                fontWeight: 600,
                fontSize: 16,
                textDecoration: "none",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.07)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              {ctaText2}
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
