"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, ChevronDown, Globe } from "lucide-react";
import Logo from "./Logo";

// ── Types ────────────────────────────────────────────────────
interface NavLink      { label: string; href: string }
interface MegaColumn   { heading: string; links: NavLink[] }
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
          { label: "VISA Virtual Card",  href: "/personal/cards" },
          { label: "Mastercard Virtual", href: "/personal/cards" },
          { label: "Debit Cards",        href: "/personal/cards" },
          { label: "Ways to Pay",        href: "/personal/cards" },
          { label: "Mobile Wallet",      href: "/personal/cards" },
        ],
      },
      {
        heading: "TOOLS & RATES",
        links: [
          { label: "Savings Calculator", href: "/tools"          },
          { label: "Loan Calculator",    href: "/tools"          },
          { label: "Currency Converter", href: "/tools"          },
          { label: "Interest Rates",     href: "/interest-rates" },
          { label: "Budget Planner",     href: "/tools"          },
        ],
      },
      {
        heading: "GET STARTED",
        links: [
          { label: "Open an Account",       href: "/register"      },
          { label: "Internet Banking",      href: "/login"         },
          { label: "Mobile App",            href: "/tools"         },
          { label: "Transfer Your Balance", href: "/international" },
        ],
      },
    ],
    featured: {
      title: "Open an account today",
      body:  "Join 50,000+ customers banking with confidence across Asia-Pacific.",
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
      body:  "Powerful tools built for modern businesses of every size.",
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
          { label: "Currency Exchange", href: "/tools"          },
          { label: "FX Rate Alerts",    href: "/interest-rates" },
          { label: "Rate Calculator",   href: "/tools"          },
          { label: "Forward Contracts", href: "/international"  },
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
          { label: "FAQs",            href: "/contact"  },
          { label: "Security Centre", href: "/security" },
          { label: "Accessibility",   href: "/contact"  },
          { label: "Complaints",      href: "/contact"  },
        ],
      },
      {
        heading: "CONTACT US",
        links: [
          { label: "Call Us",        href: "/contact" },
          { label: "Email Support",  href: "/contact" },
          { label: "Live Chat",      href: "/contact" },
          { label: "Find a Branch",  href: "/contact" },
        ],
      },
    ],
    featured: {
      title: "We're here to help",
      body:  "Our team is available 24/7 for urgent security matters.",
      cta:   "Contact Us →",
      href:  "/contact",
    },
  },
};

const NAV_ITEMS = [
  { label: "Personal Banking", href: "/personal",       hasMega: true  },
  { label: "Business",         href: "/business",       hasMega: true  },
  { label: "International",    href: "/international",  hasMega: true  },
  { label: "Interest Rates",   href: "/interest-rates", hasMega: false },
  { label: "Our Story",        href: "/about",          hasMega: false },
  { label: "Help & Contact",   href: "/contact",        hasMega: true  },
] as const;

// ── Featured panel SVG icons ─────────────────────────────────
const FEATURED_ICONS: Record<string, React.ReactNode> = {
  "Personal Banking": (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00C896" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  "Business": (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00C896" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-4 0v2M8 7V5a2 2 0 0 0-4 0v2"/>
    </svg>
  ),
  "International": (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00C896" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  "Help & Contact": (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00C896" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z"/>
    </svg>
  ),
};

// ── Component ────────────────────────────────────────────────
export default function Navbar() {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu]         = useState<string | null>(null);
  const [mobileOpen, setMobileOpen]         = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [currency, setCurrency]             = useState("USD");
  const [currencyOpen, setCurrencyOpen]     = useState(false);
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
      if (e.key === "Escape") { setActiveMenu(null); setMobileOpen(false); setCurrencyOpen(false); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const openMenu      = useCallback((label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMenu(label);
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 120);
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
  const colCount    = currentMega?.columns.length ?? 0;
  const gridCols    =
    colCount === 4 ? "1fr 1fr 1fr 1fr 260px" :
    colCount === 3 ? "1fr 1fr 1fr 260px" :
                    "1fr 1fr 260px";

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{ fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)" }}
      >
        {/* ══ ROW 1: UTILITY BAR ═════════════════════════════ */}
        <div style={{ height: 38, backgroundColor: "#060E1C", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="boa-container flex items-center h-full">
            <div className="hidden md:flex items-center gap-3 text-[12px] shrink-0">
              <span style={{ color: "rgba(255,255,255,0.45)" }}>🌏 Singapore · Hong Kong · Tokyo · New York</span>
              <span style={{ color: "rgba(255,255,255,0.18)" }}>|</span>
              <span style={{ color: "var(--boa-teal)", letterSpacing: "0.05em", fontWeight: 500 }}>
                FDIC Insured · Licensed &amp; Regulated
              </span>
            </div>

            <div className="flex items-center gap-3 ml-auto text-[12px]">
              <Link href="/interest-rates" className="hidden sm:block transition-colors" style={{ color: "rgba(255,255,255,0.6)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
              >Interest Rates</Link>
              <span className="hidden sm:block" style={{ color: "rgba(255,255,255,0.18)" }}>|</span>
              <Link href="/contact" className="hidden sm:block transition-colors" style={{ color: "rgba(255,255,255,0.6)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
              >Help &amp; Contact</Link>
              <span className="hidden sm:block" style={{ color: "rgba(255,255,255,0.18)" }}>|</span>

              {/* Currency selector */}
              <div className="relative">
                <button
                  onClick={() => setCurrencyOpen((v) => !v)}
                  className="flex items-center gap-1 transition-colors"
                  style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}
                >
                  <Globe size={11} />
                  <span style={{ fontFamily: "var(--font-mono, monospace)", fontWeight: 500 }}>{currency}</span>
                  <ChevronDown size={10} style={{ transform: currencyOpen ? "rotate(180deg)" : "none", transition: "transform 0.18s" }} />
                </button>
                <AnimatePresence>
                  {currencyOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.14 }}
                      className="absolute right-0 top-full mt-2 rounded-lg overflow-hidden z-20"
                      style={{ backgroundColor: "#0F2040", border: "1px solid rgba(255,255,255,0.1)", minWidth: 82, boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}
                    >
                      {CURRENCIES.map((c) => (
                        <button key={c} onClick={() => { setCurrency(c); setCurrencyOpen(false); }}
                          className="block w-full text-left px-3 py-1.5 text-[12px] transition-colors"
                          style={{ color: c === currency ? "var(--boa-teal)" : "rgba(255,255,255,0.65)", fontFamily: "var(--font-mono, monospace)", backgroundColor: "transparent" }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.07)")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >{c}</button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <span style={{ color: "rgba(255,255,255,0.18)" }}>|</span>
              <Link href="/login" target="_blank" rel="noopener noreferrer"
                className="px-3 py-0.5 rounded text-[12px] font-medium transition-all"
                style={{ border: "1px solid rgba(0,200,150,0.45)", color: "var(--boa-teal)" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,200,150,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >Log In</Link>
            </div>
          </div>
        </div>

        {/* ══ ROW 2: MAIN NAV ════════════════════════════════ */}
        <div style={{ height: 70, backgroundColor: "#ffffff", borderBottom: "1px solid #E5E9EE", boxShadow: activeMenu ? "none" : "0 1px 0 #E5E9EE" }}>
          <div className="boa-container flex items-center h-full gap-6">
            <Logo size="default" className="shrink-0 mr-4" />

            {/* Desktop nav — single parent handles close on mouse-leave */}
            <nav
              className="hidden lg:flex items-center gap-0.5 flex-1"
              aria-label="Primary navigation"
              onMouseLeave={scheduleClose}
            >
              {NAV_ITEMS.map((item) => {
                const menuActive  = item.hasMega && activeMenu === item.label;
                const pathActive  = item.hasMega ? isMegaActive(item.label) : isActive(item.href);
                const highlighted = menuActive || pathActive;

                if (item.hasMega) {
                  return (
                    <button
                      key={item.label}
                      onMouseEnter={() => openMenu(item.label)}
                      className="relative flex items-center gap-1 px-3.5 py-2 rounded-md text-[14px] font-medium transition-colors"
                      style={{ color: highlighted ? "#0A1628" : "#374151", fontWeight: highlighted ? 600 : 500 }}
                      aria-expanded={menuActive}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronDown size={13} style={{ transform: menuActive ? "rotate(180deg)" : "none", transition: "transform 0.18s", color: menuActive ? "var(--boa-teal)" : "currentColor" }} />
                      {highlighted && (
                        <span style={{ position: "absolute", bottom: -1, left: 10, right: 10, height: 2, backgroundColor: "var(--boa-teal)", borderRadius: 2 }} />
                      )}
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onMouseEnter={() => setActiveMenu(null)}
                    className="relative px-3.5 py-2 rounded-md text-[14px] font-medium transition-colors"
                    style={{ color: pathActive ? "#0A1628" : "#374151", fontWeight: pathActive ? 600 : 500 }}
                  >
                    {item.label}
                    {pathActive && (
                      <span style={{ position: "absolute", bottom: -1, left: 10, right: 10, height: 2, backgroundColor: "var(--boa-teal)", borderRadius: 2 }} />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: search + CTA + hamburger */}
            <div className="flex items-center gap-3 shrink-0 ml-auto">
              <button className="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg transition-colors" aria-label="Search"
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F1F3F5")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <Search size={17} style={{ color: "#374151" }} />
              </button>
              <Link href="/register" target="_blank" rel="noopener noreferrer"
                className="hidden lg:inline-flex items-center px-5 py-2.5 rounded-lg text-[14px] font-semibold text-white transition-all"
                style={{ backgroundColor: "var(--boa-navy)" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--boa-navy-mid)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--boa-navy)")}
              >Open Account</Link>
              <button className="lg:hidden p-2 rounded-lg transition-colors" onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F1F3F5")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                {mobileOpen ? <X size={22} style={{ color: "var(--boa-navy)" }} /> : <Menu size={22} style={{ color: "var(--boa-navy)" }} />}
              </button>
            </div>
          </div>
        </div>

        {/* ══ BRIDGE + MEGA MENU PANEL ════════════════════════ */}
        <AnimatePresence mode="wait">
          {activeMenu && currentMega && (
            <>
              {/* 8px invisible bridge to prevent mouseLeave gap flicker */}
              <div
                style={{ height: 8, position: "relative", zIndex: 51 }}
                onMouseEnter={cancelClose}
                className="hidden lg:block"
              />
              <motion.div
                key={activeMenu}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                onMouseEnter={cancelClose}
                onMouseLeave={scheduleClose}
                className="hidden lg:block"
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  backgroundColor: "#FFFFFF",
                  borderTop: "3px solid #00C896",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                  zIndex: 50,
                }}
              >
                <div className="boa-container" style={{ padding: "32px var(--content-padding)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: 40 }}>
                    {/* Columns */}
                    {currentMega.columns.map((col) => (
                      <div key={col.heading}>
                        <p style={{
                          fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
                          fontSize: 11,
                          fontWeight: 600,
                          textTransform: "uppercase" as const,
                          letterSpacing: "0.1em",
                          color: "#00C896",
                          marginBottom: 12,
                        }}>
                          {col.heading}
                        </p>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                          {col.links.map((link) => (
                            <li key={link.label}>
                              <Link
                                href={link.href}
                                onClick={() => setActiveMenu(null)}
                                style={{
                                  display: "block",
                                  fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
                                  fontSize: 15,
                                  fontWeight: 400,
                                  color: "#1A2332",
                                  textDecoration: "none",
                                  padding: "6px 0",
                                  transition: "color 0.15s, padding-left 0.15s",
                                  paddingLeft: 0,
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = "#00C896";
                                  e.currentTarget.style.paddingLeft = "4px";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color = "#1A2332";
                                  e.currentTarget.style.paddingLeft = "0";
                                }}
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {/* Featured panel */}
                    <div
                      style={{
                        background: "linear-gradient(135deg, #0A1628 0%, #162B52 100%)",
                        borderRadius: 12,
                        padding: 24,
                        minHeight: 180,
                        display: "flex",
                        flexDirection: "column" as const,
                      }}
                    >
                      {/* Icon area */}
                      <div style={{
                        borderRadius: 8,
                        backgroundColor: "rgba(0,200,150,0.1)",
                        height: 100,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 16,
                      }}>
                        {FEATURED_ICONS[activeMenu] ?? FEATURED_ICONS["Personal Banking"]}
                      </div>
                      <p style={{
                        fontFamily: "var(--font-syne, Syne, sans-serif)",
                        fontWeight: 600,
                        fontSize: 16,
                        color: "#fff",
                        marginBottom: 6,
                        lineHeight: 1.3,
                      }}>
                        {currentMega.featured.title}
                      </p>
                      <p style={{
                        fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
                        fontSize: 14,
                        color: "rgba(209,213,219,1)",
                        lineHeight: 1.6,
                        flex: 1,
                        marginBottom: 14,
                      }}>
                        {currentMega.featured.body}
                      </p>
                      <Link
                        href={currentMega.featured.href}
                        onClick={() => setActiveMenu(null)}
                        style={{
                          fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
                          fontWeight: 600,
                          fontSize: 14,
                          color: "#00C896",
                          textDecoration: "none",
                          transition: "opacity 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                      >
                        {currentMega.featured.cta}
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* ══ MOBILE OVERLAY ════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed left-0 top-0 bottom-0 z-50 lg:hidden flex flex-col"
            style={{ width: 320, backgroundColor: "#fff", boxShadow: "4px 0 40px rgba(0,0,0,0.18)" }}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: "1px solid #E5E9EE" }}>
              <Logo size="small" />
              <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg transition-colors" aria-label="Close menu"
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
                        onClick={() => setMobileExpanded((v) => (v === item.label ? null : item.label))}
                        className="w-full flex items-center justify-between px-3 py-3.5 rounded-lg text-[15px] font-medium text-left transition-colors"
                        style={{ color: "var(--boa-navy)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F8F9FA")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        aria-expanded={mobileExpanded === item.label}
                      >
                        {item.label}
                        <ChevronDown size={16} style={{ transform: mobileExpanded === item.label ? "rotate(180deg)" : "none", transition: "transform 0.2s", color: "var(--boa-muted)" }} />
                      </button>
                      <AnimatePresence>
                        {mobileExpanded === item.label && MEGA_MENUS[item.label] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22 }}
                            style={{ overflow: "hidden" }}
                          >
                            <div className="px-4 pb-3 pt-1">
                              {MEGA_MENUS[item.label].columns.map((col) => (
                                <div key={col.heading} className="mb-4">
                                  <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--boa-teal)" }}>
                                    {col.heading}
                                  </p>
                                  <div className="space-y-1.5">
                                    {col.links.map((link) => (
                                      <Link key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
                                        className="block py-1 text-[14px] transition-colors"
                                        style={{ color: "#374151" }}
                                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--boa-teal)")}
                                        onMouseLeave={(e) => (e.currentTarget.style.color = "#374151")}
                                      >{link.label}</Link>
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
                    <Link href={item.href} onClick={() => setMobileOpen(false)}
                      className="block px-3 py-3.5 rounded-lg text-[15px] font-medium transition-colors"
                      style={{ color: "var(--boa-navy)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F8F9FA")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >{item.label}</Link>
                  )}
                </div>
              ))}
            </div>

            {/* Drawer footer */}
            <div className="px-4 py-4 shrink-0 space-y-3" style={{ borderTop: "1px solid #E5E9EE" }}>
              <div className="text-[11px] space-y-0.5 pb-2" style={{ borderBottom: "1px solid #E5E9EE" }}>
                <p style={{ color: "var(--boa-muted)" }}>🌏 Singapore · Hong Kong · Tokyo · New York</p>
                <p style={{ color: "var(--boa-teal)", fontWeight: 500 }}>FDIC Insured · Licensed &amp; Regulated</p>
              </div>
              <Link href="/login" target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)}
                className="block w-full text-center py-3 rounded-lg text-[14px] font-medium border transition-colors"
                style={{ borderColor: "var(--boa-navy)", color: "var(--boa-navy)" }}
              >Log In</Link>
              <Link href="/register" target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)}
                className="block w-full text-center py-3 rounded-lg text-[14px] font-semibold text-white"
                style={{ backgroundColor: "var(--boa-navy)" }}
              >Open Account</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
