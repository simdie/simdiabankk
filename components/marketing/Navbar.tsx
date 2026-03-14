"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, ChevronDown, Globe, ChevronRight } from "lucide-react";
import Logo from "./Logo";

// ── Types ────────────────────────────────────────────────────
interface NavLink     { label: string; href: string }
interface MegaColumn  { heading: string; links: NavLink[] }
interface MegaFeatured { title: string; body: string; cta: string; href: string }
interface MegaMenuData { columns: MegaColumn[]; featured: MegaFeatured }

// ── Constants ────────────────────────────────────────────────
const CURRENCIES = ["USD", "AUD", "EUR", "GBP", "JPY", "SGD", "HKD", "CAD", "CHF", "NZD"];

const MEGA_MENUS: Record<string, MegaMenuData> = {
  "Personal Banking": {
    columns: [
      {
        heading: "ACCOUNTS",
        links: [
          { label: "Current Accounts",    href: "/personal/accounts" },
          { label: "Savings Accounts",    href: "/personal/accounts" },
          { label: "Term Deposits",       href: "/interest-rates"    },
          { label: "Youth Accounts",      href: "/personal/accounts" },
          { label: "Retirement Accounts", href: "/personal/accounts" },
        ],
      },
      {
        heading: "CARDS & PAYMENTS",
        links: [
          { label: "VISA Virtual Card",   href: "/personal/cards" },
          { label: "Mastercard Virtual",  href: "/personal/cards" },
          { label: "Debit Cards",         href: "/personal/cards" },
          { label: "Ways to Pay",         href: "/personal/cards" },
          { label: "Mobile Wallet",       href: "/personal/cards" },
        ],
      },
      {
        heading: "TOOLS & RATES",
        links: [
          { label: "Savings Calculator",  href: "/tools"          },
          { label: "Loan Calculator",     href: "/tools"          },
          { label: "Currency Converter",  href: "/tools"          },
          { label: "Interest Rates",      href: "/interest-rates" },
          { label: "Budget Planner",      href: "/tools"          },
        ],
      },
      {
        heading: "SWITCH TO US",
        links: [
          { label: "Open an Account",     href: "/register"      },
          { label: "Internet Banking",    href: "/login"         },
          { label: "Mobile App",          href: "/tools"         },
          { label: "Transfer Your Balance", href: "/international" },
        ],
      },
    ],
    featured: {
      title: "Open an account today",
      body:  "Join thousands banking with confidence.",
      cta:   "Get Started →",
      href:  "/register",
    },
  },

  "Business": {
    columns: [
      {
        heading: "BUSINESS ACCOUNTS",
        links: [
          { label: "Business Current Account",  href: "/business"       },
          { label: "Business Savings",          href: "/business"       },
          { label: "Term Deposits",             href: "/interest-rates" },
          { label: "Foreign Currency Accounts", href: "/business"       },
        ],
      },
      {
        heading: "PAYMENTS & FX",
        links: [
          { label: "International Wires", href: "/international" },
          { label: "Batch Payments",      href: "/business"      },
          { label: "FX Solutions",        href: "/international" },
          { label: "Payment Links",       href: "/business"      },
        ],
      },
      {
        heading: "SERVICES",
        links: [
          { label: "Business Loans",      href: "/business" },
          { label: "Merchant Services",   href: "/business" },
          { label: "API & Integrations",  href: "/business" },
          { label: "Corporate Solutions", href: "/business" },
        ],
      },
    ],
    featured: {
      title: "Banking for your business",
      body:  "Powerful tools built for modern businesses.",
      cta:   "Explore Business →",
      href:  "/business",
    },
  },

  "International": {
    columns: [
      {
        heading: "TRANSFER SERVICES",
        links: [
          { label: "International Wire (SWIFT)", href: "/international" },
          { label: "SEPA Transfers",             href: "/international" },
          { label: "Local Wire Transfers",       href: "/international" },
          { label: "Internal Transfers",         href: "/international" },
        ],
      },
      {
        heading: "CURRENCY SERVICES",
        links: [
          { label: "Currency Exchange",  href: "/tools"          },
          { label: "FX Rate Alerts",     href: "/interest-rates" },
          { label: "Rate Calculator",    href: "/tools"          },
          { label: "Forward Contracts",  href: "/international"  },
        ],
      },
      {
        heading: "TRAVEL BANKING",
        links: [
          { label: "Card Access Overseas",   href: "/personal/cards" },
          { label: "Travel Notifications",   href: "/personal/cards" },
          { label: "Emergency Card Support", href: "/contact"        },
          { label: "24/7 Global Support",    href: "/contact"        },
        ],
      },
    ],
    featured: {
      title: "Send money worldwide",
      body:  "Fast, low-cost international transfers to 180+ countries.",
      cta:   "Send Money →",
      href:  "/international",
    },
  },

  "Help & Contact": {
    columns: [
      {
        heading: "GET HELP",
        links: [
          { label: "FAQs",             href: "/contact"  },
          { label: "Security Centre",  href: "/security" },
          { label: "Accessibility",    href: "/contact"  },
          { label: "Complaints",       href: "/contact"  },
        ],
      },
      {
        heading: "CONTACT US",
        links: [
          { label: "Call Us",      href: "/contact" },
          { label: "Email Support", href: "/contact" },
          { label: "Live Chat",    href: "/contact" },
          { label: "Find a Branch", href: "/contact" },
        ],
      },
    ],
    featured: {
      title: "We're here to help",
      body:  "Our team is available 24/7 for urgent matters.",
      cta:   "Contact Us →",
      href:  "/contact",
    },
  },
};

const NAV_ITEMS = [
  { label: "Personal Banking", href: "/personal",      hasMega: true  },
  { label: "Business",         href: "/business",      hasMega: true  },
  { label: "International",    href: "/international", hasMega: true  },
  { label: "Interest Rates",   href: "/interest-rates", hasMega: false },
  { label: "Our Story",        href: "/about",         hasMega: false },
  { label: "Help & Contact",   href: "/contact",       hasMega: true  },
] as const;

// ── Featured panel colours per menu ─────────────────────────
const FEATURED_GRADIENTS: Record<string, string> = {
  "Personal Banking": "linear-gradient(135deg, #0A1628 0%, #162B52 50%, #00C896 100%)",
  "Business":         "linear-gradient(135deg, #0A1628 0%, #0F2040 50%, #C8972A 100%)",
  "International":    "linear-gradient(135deg, #0A1628 0%, #162B52 50%, #00A8FF 100%)",
  "Help & Contact":   "linear-gradient(135deg, #0A1628 0%, #0F2040 50%, #00C896 100%)",
};

// ── Component ────────────────────────────────────────────────
export default function Navbar() {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu]       = useState<string | null>(null);
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [currency, setCurrency]           = useState("USD");
  const [currencyOpen, setCurrencyOpen]   = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close on route change
  useEffect(() => {
    setActiveMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Escape to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMenu(null);
        setMobileOpen(false);
        setCurrencyOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const openMenu      = useCallback((label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMenu(label);
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 150);
  }, []);

  const cancelClose   = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const isActive = useCallback((href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }, [pathname]);

  const isMegaActive = useCallback((label: string) => {
    const menu = MEGA_MENUS[label];
    if (!menu) return false;
    return menu.columns.some((col) => col.links.some((l) => isActive(l.href)));
  }, [isActive]);

  const currentMega = activeMenu ? MEGA_MENUS[activeMenu] : null;

  const colCount = currentMega?.columns.length ?? 0;
  const gridCols =
    colCount === 4 ? "2fr 2fr 2fr 2fr 280px" :
    colCount === 3 ? "2fr 2fr 2fr 280px" :
                    "2fr 2fr 280px";

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{ fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)" }}
      >
        {/* ══ ROW 1: UTILITY BAR ═════════════════════════════ */}
        <div
          style={{
            height: 38,
            backgroundColor: "#060E1C",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="boa-container flex items-center h-full">
            {/* LEFT — offices + regulatory badge */}
            <div className="hidden md:flex items-center gap-3 text-[12px] shrink-0">
              <span style={{ color: "rgba(255,255,255,0.45)" }}>
                🌏 Singapore · Hong Kong · Tokyo · New York
              </span>
              <span style={{ color: "rgba(255,255,255,0.18)" }}>|</span>
              <span
                style={{
                  color: "var(--boa-teal)",
                  letterSpacing: "0.05em",
                  fontWeight: 500,
                }}
              >
                FDIC Insured · Licensed &amp; Regulated
              </span>
            </div>

            {/* RIGHT — utility links + currency + login */}
            <div className="flex items-center gap-3 ml-auto text-[12px]">
              <Link
                href="/interest-rates"
                className="hidden sm:block transition-colors"
                style={{ color: "rgba(255,255,255,0.6)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
              >
                Interest Rates
              </Link>
              <span className="hidden sm:block" style={{ color: "rgba(255,255,255,0.18)" }}>|</span>
              <Link
                href="/contact"
                className="hidden sm:block transition-colors"
                style={{ color: "rgba(255,255,255,0.6)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
              >
                Help &amp; Contact
              </Link>
              <span className="hidden sm:block" style={{ color: "rgba(255,255,255,0.18)" }}>|</span>

              {/* Currency selector */}
              <div className="relative">
                <button
                  onClick={() => setCurrencyOpen((v) => !v)}
                  className="flex items-center gap-1 transition-colors"
                  style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}
                >
                  <Globe size={11} />
                  <span style={{ fontFamily: "var(--font-mono, monospace)", fontWeight: 500 }}>
                    {currency}
                  </span>
                  <ChevronDown
                    size={10}
                    style={{
                      transform: currencyOpen ? "rotate(180deg)" : "none",
                      transition: "transform 0.18s",
                    }}
                  />
                </button>
                <AnimatePresence>
                  {currencyOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.14 }}
                      className="absolute right-0 top-full mt-2 rounded-lg overflow-hidden z-20"
                      style={{
                        backgroundColor: "#0F2040",
                        border: "1px solid rgba(255,255,255,0.1)",
                        minWidth: 82,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                      }}
                    >
                      {CURRENCIES.map((c) => (
                        <button
                          key={c}
                          onClick={() => { setCurrency(c); setCurrencyOpen(false); }}
                          className="block w-full text-left px-3 py-1.5 text-[12px] transition-colors"
                          style={{
                            color: c === currency ? "var(--boa-teal)" : "rgba(255,255,255,0.65)",
                            fontFamily: "var(--font-mono, monospace)",
                            backgroundColor: "transparent",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.07)")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                          {c}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <span style={{ color: "rgba(255,255,255,0.18)" }}>|</span>

              <Link
                href="/login"
                className="px-3 py-0.5 rounded text-[12px] font-medium transition-all"
                style={{
                  border: "1px solid rgba(0,200,150,0.45)",
                  color: "var(--boa-teal)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,200,150,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                Log In
              </Link>
            </div>
          </div>
        </div>

        {/* ══ ROW 2: MAIN NAV ════════════════════════════════ */}
        <div
          style={{
            height: 70,
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #E5E9EE",
            boxShadow: activeMenu ? "none" : "0 1px 0 #E5E9EE",
          }}
        >
          <div className="boa-container flex items-center h-full gap-6">
            {/* Logo */}
            <Logo size="default" className="shrink-0 mr-4" />

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5 flex-1" aria-label="Primary navigation">
              {NAV_ITEMS.map((item) => {
                const menuActive = item.hasMega && activeMenu === item.label;
                const pathActive = item.hasMega ? isMegaActive(item.label) : isActive(item.href);
                const highlighted = menuActive || pathActive;

                if (item.hasMega) {
                  return (
                    <button
                      key={item.label}
                      onMouseEnter={() => openMenu(item.label)}
                      onMouseLeave={scheduleClose}
                      className="relative flex items-center gap-1 px-3.5 py-2 rounded-md text-[14px] font-medium transition-colors"
                      style={{
                        color: highlighted ? "#0A1628" : "#374151",
                        fontWeight: highlighted ? 600 : 500,
                      }}
                      aria-expanded={menuActive}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronDown
                        size={13}
                        style={{
                          transform: menuActive ? "rotate(180deg)" : "none",
                          transition: "transform 0.18s",
                          color: menuActive ? "var(--boa-teal)" : "currentColor",
                        }}
                      />
                      {highlighted && (
                        <span
                          style={{
                            position: "absolute",
                            bottom: -1,
                            left: 10,
                            right: 10,
                            height: 2,
                            backgroundColor: "var(--boa-teal)",
                            borderRadius: 2,
                          }}
                        />
                      )}
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onMouseEnter={scheduleClose}
                    className="relative px-3.5 py-2 rounded-md text-[14px] font-medium transition-colors"
                    style={{
                      color: pathActive ? "#0A1628" : "#374151",
                      fontWeight: pathActive ? 600 : 500,
                    }}
                  >
                    {item.label}
                    {pathActive && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: -1,
                          left: 10,
                          right: 10,
                          height: 2,
                          backgroundColor: "var(--boa-teal)",
                          borderRadius: 2,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: search + CTA + hamburger */}
            <div className="flex items-center gap-3 shrink-0 ml-auto">
              <button
                className="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
                aria-label="Search"
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F1F3F5")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <Search size={17} style={{ color: "#374151" }} />
              </button>

              <Link
                href="/register"
                className="hidden lg:inline-flex items-center px-5 py-2.5 rounded-lg text-[14px] font-semibold text-white transition-all"
                style={{ backgroundColor: "var(--boa-navy)" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--boa-navy-mid)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--boa-navy)")}
              >
                Open Account
              </Link>

              <button
                className="lg:hidden p-2 rounded-lg transition-colors"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F1F3F5")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                {mobileOpen ? (
                  <X size={22} style={{ color: "var(--boa-navy)" }} />
                ) : (
                  <Menu size={22} style={{ color: "var(--boa-navy)" }} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ══ ROW 3: MEGA MENU PANEL ══════════════════════════ */}
        <AnimatePresence>
          {activeMenu && currentMega && (
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
              className="hidden lg:block"
              style={{
                backgroundColor: "#fff",
                borderTop: "2px solid var(--boa-teal)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
              }}
            >
              <div className="boa-container py-8">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: gridCols,
                    gap: 32,
                  }}
                >
                  {/* Columns */}
                  {currentMega.columns.map((col) => (
                    <div key={col.heading}>
                      <p
                        className="text-[10px] font-semibold uppercase tracking-widest mb-3"
                        style={{ color: "var(--boa-muted)" }}
                      >
                        {col.heading}
                      </p>
                      <ul className="space-y-2.5">
                        {col.links.map((link) => (
                          <li key={link.label}>
                            <Link
                              href={link.href}
                              onClick={() => setActiveMenu(null)}
                              className="group flex items-center gap-1.5 text-[14px] transition-colors"
                              style={{ color: "#374151" }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--boa-teal)")}
                              onMouseLeave={(e) => (e.currentTarget.style.color = "#374151")}
                            >
                              <ChevronRight
                                size={10}
                                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ color: "var(--boa-teal)" }}
                              />
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {/* Featured panel */}
                  <div
                    className="rounded-xl p-5 flex flex-col"
                    style={{ backgroundColor: "#F0F4FF" }}
                  >
                    {/* Visual placeholder */}
                    <div
                      className="rounded-lg mb-4 flex items-center justify-center overflow-hidden"
                      style={{
                        height: 130,
                        background: FEATURED_GRADIENTS[activeMenu] ?? FEATURED_GRADIENTS["Personal Banking"],
                      }}
                    >
                      <div className="flex gap-2 px-4">
                        {[0.08, 0.14, 0.22].map((opacity, i) => (
                          <div
                            key={i}
                            className="rounded-lg flex-1"
                            style={{
                              height: 48 + i * 12,
                              backgroundColor: `rgba(255,255,255,${opacity})`,
                              border: "1px solid rgba(255,255,255,0.18)",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <p
                      className="font-bold mb-1 leading-snug"
                      style={{
                        fontSize: 15,
                        color: "var(--boa-navy)",
                        fontFamily: "var(--font-syne, Syne, sans-serif)",
                      }}
                    >
                      {currentMega.featured.title}
                    </p>
                    <p
                      className="text-[13px] mb-4 flex-1 leading-relaxed"
                      style={{ color: "var(--boa-muted)" }}
                    >
                      {currentMega.featured.body}
                    </p>
                    <Link
                      href={currentMega.featured.href}
                      onClick={() => setActiveMenu(null)}
                      className="inline-flex items-center gap-1 text-[13px] font-semibold transition-colors"
                      style={{ color: "var(--boa-teal)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--boa-teal-dim)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--boa-teal)")}
                    >
                      {currentMega.featured.cta}
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ══ MOBILE OVERLAY ════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* ══ MOBILE DRAWER ═════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed left-0 top-0 bottom-0 z-50 lg:hidden flex flex-col"
            style={{
              width: 320,
              backgroundColor: "#fff",
              boxShadow: "4px 0 40px rgba(0,0,0,0.18)",
            }}
          >
            {/* Drawer header */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{ borderBottom: "1px solid #E5E9EE" }}
            >
              <Logo size="small" />
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg transition-colors"
                aria-label="Close menu"
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F1F3F5")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <X size={20} style={{ color: "var(--boa-navy)" }} />
              </button>
            </div>

            {/* Drawer nav items */}
            <div className="flex-1 overflow-y-auto px-3 py-3">
              {NAV_ITEMS.map((item) => (
                <div key={item.label} className="mb-0.5">
                  {item.hasMega ? (
                    <>
                      <button
                        onClick={() =>
                          setMobileExpanded((v) => (v === item.label ? null : item.label))
                        }
                        className="w-full flex items-center justify-between px-3 py-3.5 rounded-lg text-[15px] font-medium text-left transition-colors"
                        style={{ color: "var(--boa-navy)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F8F9FA")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        aria-expanded={mobileExpanded === item.label}
                      >
                        {item.label}
                        <ChevronDown
                          size={16}
                          style={{
                            transform: mobileExpanded === item.label ? "rotate(180deg)" : "none",
                            transition: "transform 0.2s",
                            color: "var(--boa-muted)",
                          }}
                        />
                      </button>

                      <AnimatePresence>
                        {mobileExpanded === item.label && MEGA_MENUS[item.label] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22 }}
                            style={{ overflow: "hidden" }}
                          >
                            <div className="px-4 pb-3 pt-1">
                              {MEGA_MENUS[item.label].columns.map((col) => (
                                <div key={col.heading} className="mb-4">
                                  <p
                                    className="text-[10px] font-semibold uppercase tracking-widest mb-2"
                                    style={{ color: "var(--boa-muted)" }}
                                  >
                                    {col.heading}
                                  </p>
                                  <div className="space-y-1.5">
                                    {col.links.map((link) => (
                                      <Link
                                        key={link.label}
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="block py-1 text-[14px] transition-colors"
                                        style={{ color: "#374151" }}
                                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--boa-teal)")}
                                        onMouseLeave={(e) => (e.currentTarget.style.color = "#374151")}
                                      >
                                        {link.label}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-3.5 rounded-lg text-[15px] font-medium transition-colors"
                      style={{ color: "var(--boa-navy)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F8F9FA")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Drawer footer — utility info + CTAs */}
            <div
              className="px-4 py-4 shrink-0 space-y-3"
              style={{ borderTop: "1px solid #E5E9EE" }}
            >
              {/* Utility bar content stacked */}
              <div
                className="text-[11px] space-y-0.5 pb-2"
                style={{ borderBottom: "1px solid #E5E9EE" }}
              >
                <p style={{ color: "var(--boa-muted)" }}>
                  🌏 Singapore · Hong Kong · Tokyo · New York
                </p>
                <p style={{ color: "var(--boa-teal)", fontWeight: 500 }}>
                  FDIC Insured · Licensed &amp; Regulated
                </p>
              </div>

              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center py-3 rounded-lg text-[14px] font-medium border transition-colors"
                style={{
                  borderColor: "var(--boa-navy)",
                  color: "var(--boa-navy)",
                }}
              >
                Log In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center py-3 rounded-lg text-[14px] font-semibold text-white"
                style={{ backgroundColor: "var(--boa-navy)" }}
              >
                Open Account
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
