import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Business Payments",
  description:
    "Bank of Asia Online business payments — international wires, batch payments, FX solutions, and real-time payment tracking for businesses.",
};

const PAYMENT_SOLUTIONS = [
  {
    icon: "🌐",
    title: "International Wires",
    subtitle: "SWIFT & local rails",
    description:
      "Send international payments to 180+ countries via SWIFT. Transparent fees, live tracking, and same-day settlement for most major corridors.",
    features: [
      "SWIFT MT103 & ISO 20022",
      "180+ destination countries",
      "Real-time payment tracking",
      "Competitive FX rates",
      "Beneficiary management",
      "Payment confirmations via email",
    ],
    color: "var(--boa-teal)",
    colorBg: "rgba(0,200,150,0.08)",
  },
  {
    icon: "📋",
    title: "Batch Payments",
    subtitle: "Automate payroll & supplier payments",
    description:
      "Upload a CSV or use our API to process thousands of payments simultaneously. Ideal for payroll, supplier payments, and dividend distributions.",
    features: [
      "CSV & XLSX file import",
      "REST API integration",
      "Up to 10,000 payments per batch",
      "Maker-checker approval flow",
      "Scheduled batch processing",
      "Full audit trail",
    ],
    color: "var(--boa-purple)",
    colorBg: "rgba(74,31,168,0.08)",
  },
  {
    icon: "💱",
    title: "FX Solutions",
    subtitle: "Multi-currency & hedging",
    description:
      "Hold balances in 10 currencies, convert at competitive rates, and lock in forward rates for up to 90 days to protect against FX volatility.",
    features: [
      "10-currency multi-wallet",
      "Mid-market FX rates",
      "FX forward contracts (90 days)",
      "Automatic currency conversion",
      "FX rate alerts",
      "Business FX desk support",
    ],
    color: "var(--boa-gold)",
    colorBg: "rgba(200,151,42,0.08)",
  },
];

const PRICING = [
  { type: "International wire",    fee: "$8.00 flat + 0.5%",   settlement: "1–3 business days" },
  { type: "Domestic transfer",     fee: "Free",                 settlement: "Same day"           },
  { type: "Batch payment (CSV)",   fee: "$0.50 per payment",   settlement: "Next business day"  },
  { type: "API payment",           fee: "$0.35 per payment",   settlement: "Real-time / next day"},
  { type: "FX conversion",         fee: "0.5% of amount",      settlement: "Immediate"          },
  { type: "FX forward contract",   fee: "Contact us",          settlement: "Up to 90 days"      },
];

const WHY_BOA = [
  { icon: "⚡", title: "Real-time tracking",     body: "Track every payment from initiation to delivery. Receive status updates at each stage." },
  { icon: "🔒", title: "Bank-grade security",    body: "Maker-checker approvals, IP allowlisting, and MFA required for all outbound payments." },
  { icon: "📊", title: "Reporting & statements", body: "Download detailed payment reports in CSV, XLSX, or PDF. Full history retained for 7 years." },
  { icon: "🔗", title: "API-first design",       body: "Full REST API with webhooks. Integrate payments directly into your ERP or accounting software." },
];

export default function BusinessPaymentsPage() {
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
            <Link href="/business" className="hover:opacity-70 transition-opacity" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}>Business</Link>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>›</span>
            <span style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}>Payments</span>
          </nav>

          <p
            className="text-[11px] font-semibold uppercase tracking-widest mb-4"
            style={{ color: "var(--boa-teal)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
          >
            Business Payments
          </p>
          <h1
            className="font-bold leading-tight mb-4"
            style={{
              fontFamily: "var(--font-syne, var(--font-inter))",
              fontSize: "clamp(30px, 4.5vw, 54px)",
              color: "#ffffff",
              letterSpacing: "-0.02em",
              maxWidth: 720,
            }}
          >
            Global payments.
            <br />
            <span style={{ color: "var(--boa-teal)" }}>Transparent costs.</span> Full control.
          </h1>
          <p
            className="mb-8"
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.65)",
              fontFamily: "var(--font-dm-sans, var(--font-inter))",
              maxWidth: 540,
              lineHeight: 1.7,
            }}
          >
            International wires, batch payroll, FX solutions — all in one platform. Built for businesses that move fast and pay globally.
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
              Open a business account →
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[15px] border transition-opacity hover:opacity-90"
              style={{
                borderColor: "rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.85)",
                fontFamily: "var(--font-dm-sans, var(--font-inter))",
              }}
            >
              Talk to our team
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PAYMENT SOLUTIONS
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
            Payment solutions
          </h2>
          <p
            className="mb-12"
            style={{ fontSize: 15, color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))", maxWidth: 520 }}
          >
            Three powerful payment products designed for the way modern businesses actually operate.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {PAYMENT_SOLUTIONS.map((solution) => (
              <div
                key={solution.title}
                className="rounded-2xl border flex flex-col overflow-hidden"
                style={{ borderColor: "var(--boa-border)" }}
              >
                {/* Top accent */}
                <div className="h-1" style={{ backgroundColor: solution.color }} />

                <div className="p-7 flex-1 flex flex-col">
                  {/* Icon + badge */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-2xl"
                    style={{ backgroundColor: solution.colorBg }}
                  >
                    {solution.icon}
                  </div>

                  <h3
                    className="font-bold mb-0.5"
                    style={{
                      fontFamily: "var(--font-syne, var(--font-inter))",
                      fontSize: 20,
                      color: "var(--boa-navy)",
                    }}
                  >
                    {solution.title}
                  </h3>
                  <p
                    className="text-[12px] mb-4"
                    style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                  >
                    {solution.subtitle}
                  </p>

                  <p
                    className="text-[14px] leading-relaxed mb-6 flex-1"
                    style={{ color: "var(--boa-text)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                  >
                    {solution.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {solution.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: solution.color, flexShrink: 0 }}>
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

                  <Link
                    href="/register" target="_blank" rel="noopener noreferrer"
                    className="block text-center py-3 rounded-xl text-[14px] font-medium transition-opacity hover:opacity-90"
                    style={{
                      backgroundColor: solution.color === "var(--boa-teal)" ? "var(--boa-teal)" : solution.color === "var(--boa-purple)" ? "var(--boa-purple)" : "var(--boa-gold)",
                      color: solution.color === "var(--boa-teal)" ? "var(--boa-navy)" : "#ffffff",
                      fontFamily: "var(--font-dm-sans, var(--font-inter))",
                    }}
                  >
                    Get started →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PRICING TABLE
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
            Transparent pricing
          </h2>
          <p
            className="mb-8"
            style={{ fontSize: 15, color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
          >
            No hidden fees. No exchange rate margins. What you see is what you pay.
          </p>

          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--boa-border)" }}>
            {/* Header */}
            <div
              className="grid grid-cols-3 px-6 py-3"
              style={{ backgroundColor: "var(--boa-navy)" }}
            >
              {["Payment type", "Fee", "Settlement"].map((h) => (
                <p
                  key={h}
                  className="text-[11px] uppercase tracking-wider font-semibold"
                  style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                >
                  {h}
                </p>
              ))}
            </div>

            {PRICING.map((row, i) => (
              <div
                key={row.type}
                className="grid grid-cols-3 px-6 py-4 border-b items-center"
                style={{
                  borderColor: "var(--boa-border)",
                  backgroundColor: i % 2 === 0 ? "#ffffff" : "rgba(245,245,240,0.7)",
                }}
              >
                <p
                  className="text-[14px] font-medium"
                  style={{ color: "var(--boa-navy)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                >
                  {row.type}
                </p>
                <p
                  className="text-[14px] font-bold"
                  style={{ color: "var(--boa-teal)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                >
                  {row.fee}
                </p>
                <p
                  className="text-[13px]"
                  style={{ color: "var(--boa-text)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                >
                  {row.settlement}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          WHY BOA
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
            Built for business
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_BOA.map((item) => (
              <div key={item.title}>
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-xl"
                  style={{ backgroundColor: "rgba(74,31,168,0.08)" }}
                >
                  {item.icon}
                </div>
                <h3
                  className="font-bold mb-2"
                  style={{
                    fontFamily: "var(--font-syne, var(--font-inter))",
                    fontSize: 16,
                    color: "var(--boa-navy)",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-[13px] leading-relaxed"
                  style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                >
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA
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
            Ready to streamline your business payments?
          </h2>
          <p
            className="mb-8 mx-auto"
            style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.6)",
              fontFamily: "var(--font-dm-sans, var(--font-inter))",
              maxWidth: 460,
            }}
          >
            Open a business account in minutes. Start sending international payments today.
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
              Open a business account →
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[15px] border transition-opacity hover:opacity-90"
              style={{
                borderColor: "rgba(255,255,255,0.25)",
                color: "rgba(255,255,255,0.85)",
                fontFamily: "var(--font-dm-sans, var(--font-inter))",
              }}
            >
              Speak to our team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
