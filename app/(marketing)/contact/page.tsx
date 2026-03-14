"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";

// ─── ZOD SCHEMA ────────────────────────────────────────────────────────────────

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your full name.").max(100),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  subject: z.string().min(1, "Please select a subject."),
  message: z.string().min(10, "Message must be at least 10 characters.").max(2000),
});

// ─── DATA ──────────────────────────────────────────────────────────────────────

const HERO_PILLS = [
  { label: "Accounts & Cards", href: "/personal/accounts" },
  { label: "Transfers & Limits", href: "/international" },
  { label: "Security Help", href: "/security" },
];

const QUICK_HELP = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
    title: "Account Help",
    desc: "Update personal details, manage notifications, add accounts, or close an account.",
    href: "/dashboard",
    color: "var(--boa-teal, #00C896)",
    bg: "rgba(0,200,150,0.08)",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    ),
    title: "Transfers",
    desc: "Track a transfer, check limits, or resolve a failed or delayed payment.",
    href: "/international",
    color: "var(--boa-gold, #C8972A)",
    bg: "rgba(200,151,42,0.08)",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
      </svg>
    ),
    title: "Cards",
    desc: "Freeze your card, dispute a transaction, generate a new virtual card, or update your PIN.",
    href: "/personal/cards",
    color: "var(--boa-navy, #0A1628)",
    bg: "rgba(10,22,40,0.06)",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Security",
    desc: "Report suspicious activity, recover your account, or lock access immediately.",
    href: "/security",
    color: "#dc2626",
    bg: "rgba(220,38,38,0.06)",
  },
];

const SUBJECTS = [
  "Account opening enquiry",
  "Transfer & payment help",
  "Card support",
  "Security concern",
  "Business banking",
  "Rates & fees",
  "Technical issue",
  "Other",
];

const OFFICES = [
  {
    city: "Singapore",
    address: "Marina Bay Financial Centre\n12 Marina Boulevard, Tower 3\nSingapore 018982",
    flag: "🇸🇬",
  },
  {
    city: "Hong Kong",
    address: "Two International Finance Centre\n8 Finance Street, Central\nHong Kong SAR",
    flag: "🇭🇰",
  },
  {
    city: "New York",
    address: "1 World Trade Center\nFloor 85, Suite 8500\nNew York, NY 10007",
    flag: "🇺🇸",
  },
];

const HOURS = [
  { day: "Monday – Friday", time: "8:00 am – 8:00 pm" },
  { day: "Saturday", time: "9:00 am – 5:00 pm" },
  { day: "Sunday & public holidays", time: "Closed (email only)" },
];

const FAQS = [
  {
    q: "How do I reset my password?",
    a: "On the login page, click 'Forgot password' and enter your registered email address. You'll receive a reset link valid for 30 minutes. If you don't receive it, check your spam folder or contact support.",
  },
  {
    q: "How long does an international transfer take?",
    a: "Most international transfers arrive within 1–3 business days depending on the destination country and currency. Some corridors (AUD, USD, EUR, GBP) can settle same-day. You'll receive a push notification the moment funds are delivered.",
  },
  {
    q: "What are the daily transfer limits?",
    a: "Standard accounts have a $10,000 AUD daily outbound transfer limit. Business accounts have a $50,000 daily limit. You can request a temporary increase by contacting support with supporting documentation.",
  },
  {
    q: "How do I dispute a transaction?",
    a: "Go to your transaction history, tap the payment in question, and select 'Dispute this transaction'. Our team will investigate and respond within 5 business days. For fraudulent transactions, also freeze your card immediately.",
  },
  {
    q: "Can I have multiple accounts?",
    a: "Yes. You can open up to five savings accounts under a single login. Each account gets its own BSB and account number. Open additional accounts from the dashboard under Accounts → New account.",
  },
  {
    q: "What currencies can I hold in my account?",
    a: "We currently support 10 currencies: AUD, USD, EUR, GBP, JPY, SGD, HKD, CAD, CHF, and NZD. You can hold and convert between all ten within your account at live mid-market rates plus our standard fee.",
  },
  {
    q: "Is my money protected by a deposit guarantee?",
    a: "Yes. Deposits held with Bank of Asia Online are protected up to $250,000 AUD per account holder under the applicable government deposit guarantee scheme.",
  },
  {
    q: "How do I close my account?",
    a: "You can request account closure from Settings → Account → Close account. You'll need to withdraw or transfer any remaining balance first. If there is an active term deposit, it must mature before closure.",
  },
  {
    q: "Why was my payment declined?",
    a: "Payments can be declined for several reasons: insufficient funds, daily limit reached, suspected fraud flag, or the merchant not supporting your card type. Check your notification history in the app for the specific reason.",
  },
  {
    q: "How do I update my phone number or email?",
    a: "Go to Settings → Profile → Contact details. You'll need to verify both the old and new contact methods via OTP before the change takes effect, to protect against unauthorised updates.",
  },
];

// ─── INPUT STYLE ───────────────────────────────────────────────────────────────

const inputBase: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: 8,
  border: "1px solid var(--boa-border, #E5E9EE)",
  fontSize: 14,
  color: "var(--boa-navy, #0A1628)",
  fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
  backgroundColor: "#fff",
  outline: "none",
  transition: "border-color 0.15s",
  boxSizing: "border-box" as const,
};

// ─── CONTACT FORM ──────────────────────────────────────────────────────────────

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [k]: e.target.value }));
      if (errors[k]) setErrors((prev) => ({ ...prev, [k]: "" }));
      if (state === "error") setState("idle");
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = String(issue.path[0]);
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setState("success");
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setState("error");
        setErrMsg(data.error ?? "Something went wrong.");
      }
    } catch {
      setState("error");
      setErrMsg("Network error. Please try again.");
    }
  }

  if (state === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          borderRadius: 16,
          padding: "48px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 16,
          background: "rgba(0,200,150,0.05)",
          border: "1px solid rgba(0,200,150,0.2)",
        }}
      >
        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "var(--boa-teal, #00C896)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
          >
            <motion.path
              d="M7 16l6 6 12-12"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
            />
          </motion.svg>
        </motion.div>

        <h3
          style={{
            fontFamily: "var(--font-syne, 'Syne', sans-serif)",
            fontWeight: 700,
            fontSize: 22,
            color: "var(--boa-navy, #0A1628)",
            margin: 0,
          }}
        >
          Message sent!
        </h3>
        <p
          style={{
            fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
            fontSize: 15,
            color: "var(--boa-muted, #64748B)",
            lineHeight: 1.65,
            maxWidth: 360,
            margin: 0,
          }}
        >
          Thank you for reaching out. We&apos;ll reply within 24 hours. For urgent matters, call us or email{" "}
          <a href="mailto:security@bankofasia.com" style={{ color: "var(--boa-teal)" }}>security@bankofasia.com</a>.
        </p>
      </motion.div>
    );
  }

  const Label = ({ children, error }: { children: React.ReactNode; error?: string }) => (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          display: "block",
          fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
          fontSize: 12,
          fontWeight: 600,
          textTransform: "uppercase" as const,
          letterSpacing: "0.08em",
          color: "var(--boa-muted, #64748B)",
          marginBottom: 6,
        }}
      >
        {children}
      </label>
      {error && (
        <p style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: 12,
          color: "#dc2626",
          marginTop: 4,
        }}>
          {error}
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Name + Email */}
      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "1fr 1fr",
          marginBottom: 0,
        }}
        className="grid-cols-1 sm:grid-cols-2"
      >
        <div>
          <Label error={errors.name}>Full Name *</Label>
          <input
            type="text"
            required
            value={form.name}
            onChange={set("name")}
            placeholder="Jane Smith"
            style={{
              ...inputBase,
              borderColor: errors.name ? "#dc2626" : "var(--boa-border, #E5E9EE)",
            }}
            onFocus={(e) => { if (!errors.name) e.currentTarget.style.borderColor = "var(--boa-teal, #00C896)"; }}
            onBlur={(e) => { if (!errors.name) e.currentTarget.style.borderColor = "var(--boa-border, #E5E9EE)"; }}
          />
        </div>
        <div>
          <Label error={errors.email}>Email Address *</Label>
          <input
            type="email"
            required
            value={form.email}
            onChange={set("email")}
            placeholder="jane@example.com"
            style={{
              ...inputBase,
              borderColor: errors.email ? "#dc2626" : "var(--boa-border, #E5E9EE)",
            }}
            onFocus={(e) => { if (!errors.email) e.currentTarget.style.borderColor = "var(--boa-teal, #00C896)"; }}
            onBlur={(e) => { if (!errors.email) e.currentTarget.style.borderColor = "var(--boa-border, #E5E9EE)"; }}
          />
        </div>
      </div>

      {/* Phone */}
      <div style={{ marginTop: 16 }}>
        <Label>Phone Number</Label>
        <input
          type="tel"
          value={form.phone}
          onChange={set("phone")}
          placeholder="+65 9123 4567"
          style={inputBase}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--boa-teal, #00C896)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--boa-border, #E5E9EE)"; }}
        />
      </div>

      {/* Subject */}
      <div style={{ marginTop: 16 }}>
        <Label error={errors.subject}>Subject *</Label>
        <select
          required
          value={form.subject}
          onChange={set("subject")}
          style={{
            ...inputBase,
            appearance: "none" as const,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 14px center",
            paddingRight: 36,
            color: form.subject ? "var(--boa-navy)" : "var(--boa-muted)",
            borderColor: errors.subject ? "#dc2626" : "var(--boa-border, #E5E9EE)",
          }}
          onFocus={(e) => { if (!errors.subject) e.currentTarget.style.borderColor = "var(--boa-teal, #00C896)"; }}
          onBlur={(e) => { if (!errors.subject) e.currentTarget.style.borderColor = "var(--boa-border, #E5E9EE)"; }}
        >
          <option value="" disabled>Select a topic…</option>
          {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Message */}
      <div style={{ marginTop: 16 }}>
        <Label error={errors.message}>Message *</Label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={set("message")}
          placeholder="Describe your enquiry in detail…"
          style={{
            ...inputBase,
            resize: "vertical",
            minHeight: 120,
            borderColor: errors.message ? "#dc2626" : "var(--boa-border, #E5E9EE)",
          }}
          onFocus={(e) => { if (!errors.message) e.currentTarget.style.borderColor = "var(--boa-teal, #00C896)"; }}
          onBlur={(e) => { if (!errors.message) e.currentTarget.style.borderColor = "var(--boa-border, #E5E9EE)"; }}
        />
      </div>

      {state === "error" && (
        <div
          style={{
            marginTop: 12,
            padding: "12px 16px",
            borderRadius: 8,
            background: "rgba(220,38,38,0.05)",
            border: "1px solid rgba(220,38,38,0.2)",
            fontFamily: "var(--font-dm-sans)",
            fontSize: 13,
            color: "#dc2626",
          }}
        >
          {errMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        style={{
          marginTop: 20,
          width: "100%",
          padding: "14px 24px",
          background: state === "loading" ? "rgba(0,200,150,0.6)" : "var(--boa-teal, #00C896)",
          color: "#fff",
          fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
          fontSize: 15,
          fontWeight: 600,
          borderRadius: 8,
          border: "none",
          cursor: state === "loading" ? "not-allowed" : "pointer",
          transition: "background 0.2s, opacity 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
        onMouseEnter={(e) => { if (state !== "loading") e.currentTarget.style.background = "#00A87E"; }}
        onMouseLeave={(e) => { if (state !== "loading") e.currentTarget.style.background = "var(--boa-teal, #00C896)"; }}
      >
        {state === "loading" ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
                <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
              </path>
            </svg>
            Sending…
          </>
        ) : (
          "Send Message"
        )}
      </button>

      <p
        style={{
          marginTop: 12,
          fontFamily: "var(--font-dm-sans)",
          fontSize: 12,
          color: "var(--boa-muted)",
          lineHeight: 1.5,
        }}
      >
        We aim to respond within 24 hours. For urgent security matters, email{" "}
        <a
          href="mailto:security@bankofasia.com"
          style={{ color: "var(--boa-teal)", textDecoration: "underline" }}
        >
          security@bankofasia.com
        </a>
        .
      </p>
    </form>
  );
}

// ─── FAQ ACCORDION (Framer Motion AnimatePresence) ─────────────────────────────

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ borderTop: "1px solid var(--boa-border, #E5E9EE)" }}>
      {FAQS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            style={{ borderBottom: "1px solid var(--boa-border, #E5E9EE)" }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 0",
                cursor: "pointer",
                background: "none",
                border: "none",
                textAlign: "left" as const,
                gap: 16,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                  fontWeight: 500,
                  fontSize: 15,
                  color: isOpen ? "var(--boa-teal, #00C896)" : "var(--boa-navy, #0A1628)",
                  transition: "color 0.2s",
                  lineHeight: 1.5,
                }}
              >
                {item.q}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{
                  flexShrink: 0,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: isOpen ? "var(--boa-teal, #00C896)" : "rgba(0,200,150,0.1)",
                  color: isOpen ? "#fff" : "var(--boa-teal, #00C896)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 400,
                  fontSize: 20,
                  lineHeight: 1,
                  transition: "background 0.2s, color 0.2s",
                }}
                aria-hidden
              >
                +
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                      fontSize: 14,
                      color: "var(--boa-muted, #64748B)",
                      lineHeight: 1.75,
                      paddingBottom: 20,
                      margin: 0,
                      maxWidth: 680,
                    }}
                  >
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ─── PAGE ──────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <main>
      {/* ══════════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "var(--boa-off-white, #F8F9FA)",
          paddingTop: 96,
          paddingBottom: 64,
          borderBottom: "1px solid var(--boa-border, #E5E9EE)",
        }}
      >
        <div className="boa-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Eyebrow */}
            <p
              style={{
                fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase" as const,
                letterSpacing: "0.18em",
                color: "var(--boa-teal, #00C896)",
                marginBottom: 16,
              }}
            >
              SUPPORT
            </p>

            {/* H1 */}
            <h1
              style={{
                fontFamily: "var(--font-syne, 'Syne', sans-serif)",
                fontSize: "clamp(32px, 4.5vw, 52px)",
                fontWeight: 700,
                color: "var(--boa-navy, #0A1628)",
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
                marginBottom: 16,
              }}
            >
              Help & Contact
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                fontSize: 17,
                color: "var(--boa-muted, #64748B)",
                lineHeight: 1.65,
                marginBottom: 28,
                maxWidth: 540,
              }}
            >
              Our support team is ready to help. Find your answer below, or send us a message and we&apos;ll get back to you within 24 hours.
            </p>

            {/* Quick-help pills */}
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 10 }}>
              {HERO_PILLS.map((pill) => (
                <Link
                  key={pill.label}
                  href={pill.href}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "white",
                    border: "1px solid var(--boa-border, #E5E9EE)",
                    borderRadius: 9999,
                    padding: "8px 16px",
                    fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--boa-navy, #0A1628)",
                    textDecoration: "none",
                    transition: "border-color 0.15s, color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--boa-teal, #00C896)";
                    e.currentTarget.style.color = "var(--boa-teal, #00C896)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--boa-border, #E5E9EE)";
                    e.currentTarget.style.color = "var(--boa-navy, #0A1628)";
                  }}
                >
                  {pill.label}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2 — QUICK HELP GRID (2×2)
      ══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "white",
          paddingTop: 64,
          paddingBottom: 64,
          borderBottom: "1px solid var(--boa-border, #E5E9EE)",
        }}
      >
        <div className="boa-container">
          <p
            style={{
              fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase" as const,
              letterSpacing: "0.18em",
              color: "var(--boa-muted, #64748B)",
              marginBottom: 24,
            }}
          >
            QUICK HELP
          </p>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            style={{
              display: "grid",
              gap: 16,
            }}
            className="grid-cols-1 sm:grid-cols-2"
          >
            {QUICK_HELP.map((card, i) => (
              <motion.div
                key={card.title}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
                }}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Link
                  href={card.href}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 16,
                    padding: 24,
                    borderRadius: 16,
                    border: `1px solid ${hoveredCard === i ? "rgba(0,200,150,0.25)" : "var(--boa-border, #E5E9EE)"}`,
                    background: "white",
                    textDecoration: "none",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    boxShadow: hoveredCard === i ? "0 4px 20px rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: card.bg,
                      color: card.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {card.icon}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontFamily: "var(--font-syne, 'Syne', sans-serif)",
                        fontWeight: 600,
                        fontSize: 16,
                        color: "var(--boa-navy, #0A1628)",
                        marginBottom: 4,
                      }}
                    >
                      {card.title}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                        fontSize: 13,
                        color: "var(--boa-muted, #64748B)",
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {card.desc}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div style={{ color: "var(--boa-muted)", flexShrink: 0, marginTop: 2 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3 — CONTACT FORM + INFO (2-col)
      ══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "var(--boa-off-white, #F8F9FA)",
          paddingTop: 80,
          paddingBottom: 80,
          borderBottom: "1px solid var(--boa-border, #E5E9EE)",
        }}
      >
        <div className="boa-container">
          <div
            style={{ display: "grid", gap: 56, alignItems: "start" }}
            className="grid-cols-1 lg:grid-cols-[1fr_380px]"
          >
            {/* LEFT — FORM */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <p
                style={{
                  fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.18em",
                  color: "var(--boa-teal, #00C896)",
                  marginBottom: 12,
                }}
              >
                SEND A MESSAGE
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-syne, 'Syne', sans-serif)",
                  fontSize: "clamp(22px, 2.5vw, 30px)",
                  fontWeight: 700,
                  color: "var(--boa-navy, #0A1628)",
                  letterSpacing: "-0.02em",
                  marginBottom: 8,
                }}
              >
                Get in touch
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                  fontSize: 14,
                  color: "var(--boa-muted, #64748B)",
                  marginBottom: 28,
                  lineHeight: 1.6,
                }}
              >
                Fill in the form and our team will respond within 24 hours.
              </p>

              <div
                style={{
                  background: "white",
                  borderRadius: 16,
                  border: "1px solid var(--boa-border, #E5E9EE)",
                  padding: 32,
                }}
              >
                <ContactForm />
              </div>
            </motion.div>

            {/* RIGHT — CONTACT INFO */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
              viewport={{ once: true }}
              style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}
            >
              {/* Phone */}
              <a
                href="tel:+18002652742"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  padding: 16,
                  borderRadius: 12,
                  background: "white",
                  border: "1px solid var(--boa-border, #E5E9EE)",
                  textDecoration: "none",
                  transition: "box-shadow 0.15s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "rgba(0,200,150,0.1)",
                    color: "var(--boa-teal)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z" />
                  </svg>
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "var(--boa-muted)", marginBottom: 2 }}>Phone</p>
                  <p style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 600, fontSize: 14, color: "var(--boa-navy)", marginBottom: 2 }}>+1 800 265 2742</p>
                  <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: 12, color: "var(--boa-muted)" }}>Mon–Fri 8 am–8 pm SGT</p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:support@bankofasia.com"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  padding: 16,
                  borderRadius: 12,
                  background: "white",
                  border: "1px solid var(--boa-border, #E5E9EE)",
                  textDecoration: "none",
                  transition: "box-shadow 0.15s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "rgba(0,200,150,0.1)",
                    color: "var(--boa-teal)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "var(--boa-muted)", marginBottom: 2 }}>Email Support</p>
                  <p style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 600, fontSize: 14, color: "var(--boa-navy)", marginBottom: 2 }}>support@bankofasia.com</p>
                  <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: 12, color: "var(--boa-muted)" }}>Response within 1–2 business days</p>
                </div>
              </a>

              {/* Emergency security line — GOLD highlight */}
              <a
                href="mailto:security@bankofasia.com"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  padding: 16,
                  borderRadius: 12,
                  background: "rgba(200,151,42,0.05)",
                  border: "1px solid rgba(200,151,42,0.35)",
                  textDecoration: "none",
                  transition: "box-shadow 0.15s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 16px rgba(200,151,42,0.1)"}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "rgba(200,151,42,0.12)",
                    color: "var(--boa-gold, #C8972A)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "var(--boa-gold, #C8972A)", marginBottom: 2 }}>Emergency Security Line</p>
                  <p style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 600, fontSize: 14, color: "var(--boa-navy)", marginBottom: 2 }}>security@bankofasia.com</p>
                  <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: 12, color: "var(--boa-muted)" }}>24/7 — urgent matters only</p>
                </div>
              </a>

              {/* Business hours */}
              <div
                style={{
                  padding: "16px 20px",
                  borderRadius: 12,
                  background: "white",
                  border: "1px solid var(--boa-border, #E5E9EE)",
                }}
              >
                <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "var(--boa-muted)", marginBottom: 12 }}>Business Hours (SGT)</p>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                  {HOURS.map((h) => (
                    <div key={h.day} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 13, color: "var(--boa-navy)" }}>{h.day}</span>
                      <span style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)", fontSize: 12, color: "var(--boa-muted)" }}>{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Office locations */}
              <div
                style={{
                  padding: "16px 20px",
                  borderRadius: 12,
                  background: "white",
                  border: "1px solid var(--boa-border, #E5E9EE)",
                }}
              >
                <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "var(--boa-muted)", marginBottom: 14 }}>Office Locations</p>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
                  {OFFICES.map((office) => (
                    <div key={office.city} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1.3 }}>{office.flag}</span>
                      <div>
                        <p style={{ fontFamily: "var(--font-syne, 'Syne', sans-serif)", fontWeight: 600, fontSize: 13, color: "var(--boa-navy)", marginBottom: 2 }}>{office.city}</p>
                        <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: 12, color: "var(--boa-muted)", lineHeight: 1.5, whiteSpace: "pre-line" as const }}>
                          {office.address}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4 — FAQ ACCORDION (10 questions)
      ══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "white",
          paddingTop: 80,
          paddingBottom: 80,
        }}
      >
        <div className="boa-container" style={{ maxWidth: 820, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <p
              style={{
                fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase" as const,
                letterSpacing: "0.18em",
                color: "var(--boa-teal, #00C896)",
                marginBottom: 12,
              }}
            >
              COMMON QUESTIONS
            </p>
            <h2
              style={{
                fontFamily: "var(--font-syne, 'Syne', sans-serif)",
                fontSize: "clamp(24px, 3vw, 36px)",
                fontWeight: 700,
                color: "var(--boa-navy, #0A1628)",
                letterSpacing: "-0.02em",
                marginBottom: 8,
              }}
            >
              Frequently asked questions
            </h2>
            <p
              style={{
                fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                fontSize: 15,
                color: "var(--boa-muted, #64748B)",
                marginBottom: 40,
              }}
            >
              Can&apos;t find what you&apos;re looking for? Use the form above to reach our team directly.
            </p>

            <FaqAccordion />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 5 — CTA STRIP
      ══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "#0A1628",
          paddingTop: 64,
          paddingBottom: 64,
          textAlign: "center" as const,
        }}
      >
        <div className="boa-container" style={{ maxWidth: 560, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h2
              style={{
                fontFamily: "var(--font-syne, 'Syne', sans-serif)",
                fontSize: "clamp(24px, 3vw, 36px)",
                fontWeight: 700,
                color: "white",
                letterSpacing: "-0.02em",
                marginBottom: 12,
              }}
            >
              Ready to open an account?
            </h2>
            <p
              style={{
                fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                fontSize: 15,
                color: "rgba(255,255,255,0.55)",
                marginBottom: 28,
              }}
            >
              Join 50,000+ customers who bank smarter with Bank of Asia.
            </p>
            <Link
              href="/register"
              style={{
                display: "inline-block",
                background: "var(--boa-teal, #00C896)",
                color: "white",
                fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                fontWeight: 600,
                fontSize: 15,
                padding: "14px 28px",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              Open an Account — it&apos;s free
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
