import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Personal Loans",
  description:
    "Bank of Asia Online personal loans — competitive rates, flexible terms, and fast online approval for personal, home, and vehicle loans.",
};

const LOAN_TYPES = [
  {
    icon: "💳",
    title: "Personal Loan",
    subtitle: "For any purpose",
    rate: "From 7.49% p.a.",
    amount: "Up to $50,000",
    term: "12–60 months",
    features: [
      "No early repayment fees",
      "Funds in 24–48 hours",
      "Fixed or variable rate",
      "Unsecured — no collateral required",
    ],
    available: true,
    cta: "/register",
  },
  {
    icon: "🏠",
    title: "Home Loan",
    subtitle: "Purchase or refinance",
    rate: "From 5.89% p.a.",
    amount: "Up to $2,000,000",
    term: "Up to 30 years",
    features: [
      "Principal & interest or interest-only",
      "Offset account available",
      "Free redraw",
      "Fixed or variable",
    ],
    available: false,
    cta: "/register",
  },
  {
    icon: "🚗",
    title: "Car Loan",
    subtitle: "New or used vehicles",
    rate: "From 6.99% p.a.",
    amount: "Up to $100,000",
    term: "12–84 months",
    features: [
      "New & used vehicles",
      "Secured loan — lower rates",
      "Balloon payment option",
      "Pre-approval available",
    ],
    available: false,
    cta: "/register",
  },
];

const RATES_TABLE = [
  { product: "Personal Loan — Variable",    rate: "7.49% p.a.", comparison: "8.12% p.a.", term: "12–60 months", min: "$1,000",   max: "$50,000"    },
  { product: "Personal Loan — Fixed",       rate: "7.99% p.a.", comparison: "8.63% p.a.", term: "12–60 months", min: "$1,000",   max: "$50,000"    },
  { product: "Home Loan — Variable",        rate: "5.89% p.a.", comparison: "5.92% p.a.", term: "Up to 30 yrs", min: "$50,000",  max: "$2,000,000", comingSoon: true },
  { product: "Home Loan — Fixed (2yr)",     rate: "5.69% p.a.", comparison: "5.98% p.a.", term: "Up to 30 yrs", min: "$50,000",  max: "$2,000,000", comingSoon: true },
  { product: "Car Loan — New Vehicle",      rate: "6.99% p.a.", comparison: "7.45% p.a.", term: "12–84 months", min: "$5,000",   max: "$100,000",   comingSoon: true },
  { product: "Car Loan — Used Vehicle",     rate: "7.49% p.a.", comparison: "7.95% p.a.", term: "12–84 months", min: "$5,000",   max: "$80,000",    comingSoon: true },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Apply online", body: "Complete our 5-minute online application. We need basic personal and financial information — no branch visit required." },
  { step: "02", title: "Get a decision", body: "Most personal loan applications receive a decision within minutes. Our credit team reviews more complex applications same-day." },
  { step: "03", title: "Sign digitally", body: "Review your loan agreement and sign electronically. Everything is handled through our secure online portal." },
  { step: "04", title: "Receive funds",  body: "Funds are transferred to your nominated account within 24–48 hours of approval, often on the same business day." },
];

export default function LoansPage() {
  return (
    <>
      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section
        className="py-20 border-b"
        style={{ backgroundColor: "var(--boa-navy)", borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-[12px] mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:opacity-70 transition-opacity" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}>Home</Link>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>›</span>
            <Link href="/personal" className="hover:opacity-70 transition-opacity" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}>Personal</Link>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>›</span>
            <span style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}>Loans</span>
          </nav>

          <p
            className="text-[11px] font-semibold uppercase tracking-widest mb-4"
            style={{ color: "var(--boa-teal)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
          >
            Personal Loans
          </p>
          <h1
            className="font-bold leading-tight mb-4"
            style={{
              fontFamily: "var(--font-syne, var(--font-inter))",
              fontSize: "clamp(30px, 4.5vw, 54px)",
              color: "#ffffff",
              letterSpacing: "-0.02em",
              maxWidth: 700,
            }}
          >
            Borrow with confidence.
            <br />
            <span style={{ color: "var(--boa-teal)" }}>Competitive rates.</span> No surprises.
          </h1>
          <p
            className="mb-8"
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.65)",
              fontFamily: "var(--font-dm-sans, var(--font-inter))",
              maxWidth: 520,
              lineHeight: 1.7,
            }}
          >
            Personal loans from 7.49% p.a. Apply online in minutes. Get a decision fast. No early repayment penalties.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/register" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[15px] transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "var(--boa-teal)",
                color: "var(--boa-navy)",
                fontFamily: "var(--font-dm-sans, var(--font-inter))",
              }}
            >
              Apply now →
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[15px] border transition-opacity hover:opacity-90"
              style={{
                borderColor: "rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.85)",
                fontFamily: "var(--font-dm-sans, var(--font-inter))",
              }}
            >
              Calculate repayments
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          LOAN TYPES
      ══════════════════════════════════════════════════ */}
      <section className="py-20 bg-white border-b" style={{ borderColor: "var(--boa-border)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="font-bold mb-3"
            style={{
              fontFamily: "var(--font-syne, var(--font-inter))",
              fontSize: "clamp(22px, 3vw, 32px)",
              color: "var(--boa-navy)",
              letterSpacing: "-0.02em",
            }}
          >
            Choose your loan type
          </h2>
          <p
            className="mb-12"
            style={{ fontSize: 15, color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))", maxWidth: 520 }}
          >
            Personal loans are available now. Home and car loans are coming soon — register your interest today.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {LOAN_TYPES.map((loan) => (
              <div
                key={loan.title}
                className="rounded-2xl border flex flex-col overflow-hidden"
                style={{
                  borderColor: loan.available ? "var(--boa-purple)" : "var(--boa-border)",
                  boxShadow: loan.available ? "0 0 0 2px rgba(74,31,168,0.15)" : "none",
                }}
              >
                {/* Header */}
                <div
                  className="px-6 py-5 border-b flex items-start justify-between"
                  style={{
                    borderColor: "var(--boa-border)",
                    backgroundColor: loan.available ? "rgba(74,31,168,0.04)" : "var(--boa-light)",
                  }}
                >
                  <div>
                    <span className="text-3xl block mb-2">{loan.icon}</span>
                    <h3
                      className="font-bold leading-none"
                      style={{
                        fontFamily: "var(--font-syne, var(--font-inter))",
                        fontSize: 20,
                        color: "var(--boa-navy)",
                      }}
                    >
                      {loan.title}
                    </h3>
                    <p
                      className="text-[13px] mt-0.5"
                      style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                    >
                      {loan.subtitle}
                    </p>
                  </div>
                  {!loan.available && (
                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider shrink-0"
                      style={{
                        backgroundColor: "rgba(200,151,42,0.12)",
                        color: "var(--boa-gold)",
                        fontFamily: "var(--font-dm-sans, var(--font-inter))",
                      }}
                    >
                      Coming soon
                    </span>
                  )}
                  {loan.available && (
                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider shrink-0"
                      style={{
                        backgroundColor: "rgba(0,200,150,0.12)",
                        color: "var(--boa-teal)",
                        fontFamily: "var(--font-dm-sans, var(--font-inter))",
                      }}
                    >
                      Available now
                    </span>
                  )}
                </div>

                {/* Rate bar */}
                <div
                  className="px-6 py-4 border-b grid grid-cols-3 gap-2"
                  style={{ borderColor: "var(--boa-border)" }}
                >
                  {[
                    { label: "Rate from", value: loan.rate },
                    { label: "Borrow up to", value: loan.amount },
                    { label: "Term", value: loan.term },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p
                        className="text-[10px] uppercase tracking-wider mb-1"
                        style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                      >
                        {label}
                      </p>
                      <p
                        className="font-semibold text-[13px] leading-tight"
                        style={{ color: "var(--boa-navy)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                      >
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div className="px-6 py-5 flex-1">
                  <ul className="space-y-2">
                    {loan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--boa-teal)", flexShrink: 0 }}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span
                          className="text-[13px]"
                          style={{ color: "var(--boa-text)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                        >
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="px-6 pb-6">
                  <Link
                    href={loan.available ? loan.cta : "/contact"}
                    className="block w-full text-center py-3 rounded-xl text-[14px] font-medium transition-opacity hover:opacity-90"
                    style={{
                      backgroundColor: loan.available ? "var(--boa-purple)" : "var(--boa-light)",
                      color: loan.available ? "#ffffff" : "var(--boa-navy)",
                      border: loan.available ? "none" : `1px solid var(--boa-border)`,
                      fontFamily: "var(--font-dm-sans, var(--font-inter))",
                    }}
                  >
                    {loan.available ? "Apply now →" : "Register interest"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          RATES TABLE
      ══════════════════════════════════════════════════ */}
      <section
        className="py-20 border-b"
        style={{ backgroundColor: "var(--boa-light)", borderColor: "var(--boa-border)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="font-bold mb-2"
            style={{
              fontFamily: "var(--font-syne, var(--font-inter))",
              fontSize: "clamp(22px, 3vw, 32px)",
              color: "var(--boa-navy)",
              letterSpacing: "-0.02em",
            }}
          >
            Current loan rates
          </h2>
          <p
            className="mb-8 text-[13px]"
            style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
          >
            Rates effective 1 March 2026. Comparison rates based on $30,000 over 5 years (personal) or applicable loan term.
          </p>

          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--boa-border)" }}>
            {/* Table header */}
            <div
              className="grid grid-cols-6 px-5 py-3"
              style={{ backgroundColor: "var(--boa-navy)" }}
            >
              {["Product", "Interest rate", "Comparison rate", "Term", "Min", "Max"].map((h) => (
                <p
                  key={h}
                  className="text-[11px] uppercase tracking-wider font-semibold"
                  style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                >
                  {h}
                </p>
              ))}
            </div>

            {/* Rows */}
            {RATES_TABLE.map((row, i) => (
              <div
                key={row.product}
                className="grid grid-cols-6 px-5 py-4 border-b items-center"
                style={{
                  borderColor: "var(--boa-border)",
                  backgroundColor: i % 2 === 0 ? "#ffffff" : "rgba(245,245,240,0.6)",
                }}
              >
                <div className="flex items-center gap-2">
                  <p
                    className="text-[13px] font-medium"
                    style={{ color: "var(--boa-navy)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                  >
                    {row.product}
                  </p>
                  {row.comingSoon && (
                    <span
                      className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase"
                      style={{
                        backgroundColor: "rgba(200,151,42,0.12)",
                        color: "var(--boa-gold)",
                        fontFamily: "var(--font-dm-sans, var(--font-inter))",
                      }}
                    >
                      Soon
                    </span>
                  )}
                </div>
                <p
                  className="text-[14px] font-bold"
                  style={{ color: "var(--boa-teal)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                >
                  {row.rate}
                </p>
                <p
                  className="text-[13px]"
                  style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                >
                  {row.comparison}
                </p>
                <p
                  className="text-[13px]"
                  style={{ color: "var(--boa-text)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                >
                  {row.term}
                </p>
                <p
                  className="text-[13px]"
                  style={{ color: "var(--boa-text)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                >
                  {row.min}
                </p>
                <p
                  className="text-[13px]"
                  style={{ color: "var(--boa-text)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                >
                  {row.max}
                </p>
              </div>
            ))}
          </div>

          <p
            className="mt-4 text-[11px]"
            style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
          >
            * Comparison rates are calculated on a secured loan of $150,000 for a 25-year term (home loan) or $30,000 over 5 years (personal/car). WARNING: This comparison rate applies only to the example given. Different amounts and terms will result in different comparison rates. Costs such as redraw fees or early repayment fees and cost savings such as fee waivers are not included in the comparison rate but may influence the cost of the loan.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════ */}
      <section className="py-20 bg-white border-b" style={{ borderColor: "var(--boa-border)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="font-bold mb-12 text-center"
            style={{
              fontFamily: "var(--font-syne, var(--font-inter))",
              fontSize: "clamp(22px, 3vw, 32px)",
              color: "var(--boa-navy)",
              letterSpacing: "-0.02em",
            }}
          >
            How it works
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="relative">
                <p
                  className="font-bold mb-3"
                  style={{
                    fontFamily: "var(--font-syne, var(--font-inter))",
                    fontSize: 42,
                    color: "rgba(74,31,168,0.1)",
                    lineHeight: 1,
                  }}
                >
                  {step.step}
                </p>
                <h3
                  className="font-bold mb-2"
                  style={{
                    fontFamily: "var(--font-syne, var(--font-inter))",
                    fontSize: 17,
                    color: "var(--boa-navy)",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-[13px] leading-relaxed"
                  style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                >
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          APPLICATION CTA
      ══════════════════════════════════════════════════ */}
      <section className="py-20" style={{ backgroundColor: "var(--boa-navy)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="font-bold mb-4"
            style={{
              fontFamily: "var(--font-syne, var(--font-inter))",
              fontSize: "clamp(24px, 3vw, 36px)",
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}
          >
            Ready to apply?
          </h2>
          <p
            className="mb-8"
            style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.6)",
              fontFamily: "var(--font-dm-sans, var(--font-inter))",
              maxWidth: 420,
              margin: "0 auto 32px",
            }}
          >
            Apply in 5 minutes. Decision in minutes. Funds in 24–48 hours.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/register" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[15px] transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "var(--boa-teal)",
                color: "var(--boa-navy)",
                fontFamily: "var(--font-dm-sans, var(--font-inter))",
              }}
            >
              Apply for a personal loan →
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[15px] border transition-opacity hover:opacity-90"
              style={{
                borderColor: "rgba(255,255,255,0.25)",
                color: "rgba(255,255,255,0.85)",
                fontFamily: "var(--font-dm-sans, var(--font-inter))",
              }}
            >
              Use loan calculator
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
