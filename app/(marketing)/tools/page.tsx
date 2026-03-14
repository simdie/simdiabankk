import type { Metadata } from "next";
import SavingsCalculator from "@/components/marketing/SavingsCalculator";
import LoanCalculator from "@/components/marketing/LoanCalculator";
import MultiCurrencyConverter from "@/components/marketing/MultiCurrencyConverter";

export const metadata: Metadata = {
  title: "Calculators & Planning Tools",
  description:
    "Free financial planning tools from Bank of Asia Online — savings calculator, loan repayment calculator, and multi-currency converter.",
};

export default function ToolsPage() {
  return (
    <>
      {/* ══════════════════════════════════════════════════
          PAGE HEADER
      ══════════════════════════════════════════════════ */}
      <section
        className="py-14 border-b"
        style={{ backgroundColor: "var(--boa-light)", borderColor: "var(--boa-border)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p
            className="text-[11px] font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--boa-purple)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
          >
            Planning tools
          </p>
          <h1
            className="font-bold leading-tight mb-3"
            style={{
              fontFamily: "var(--font-syne, var(--font-inter))",
              fontSize: "clamp(28px, 4vw, 46px)",
              color: "var(--boa-navy)",
              letterSpacing: "-0.02em",
            }}
          >
            Calculators & Planning Tools
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "var(--boa-muted)",
              fontFamily: "var(--font-dm-sans, var(--font-inter))",
              maxWidth: 540,
            }}
          >
            Free, interactive tools to help you plan your savings, understand loan costs, and compare exchange rates — all calculated in real time.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SAVINGS CALCULATOR
      ══════════════════════════════════════════════════ */}
      <section className="py-20 bg-white border-b" style={{ borderColor: "var(--boa-border)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(0,168,150,0.1)", color: "var(--boa-teal)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
                </svg>
              </div>
              <h2
                className="font-bold"
                style={{
                  fontFamily: "var(--font-syne, var(--font-inter))",
                  fontSize: "clamp(20px, 2vw, 26px)",
                  color: "var(--boa-navy)",
                  letterSpacing: "-0.01em",
                }}
              >
                Savings Calculator
              </h2>
            </div>
            <p
              className="mb-8"
              style={{
                fontSize: 14,
                color: "var(--boa-muted)",
                fontFamily: "var(--font-dm-sans, var(--font-inter))",
              }}
            >
              See how your savings grow over time with regular deposits and compound interest.
            </p>
            <SavingsCalculator />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          LOAN REPAYMENT CALCULATOR
      ══════════════════════════════════════════════════ */}
      <section
        className="py-20 border-b"
        style={{ backgroundColor: "var(--boa-light)", borderColor: "var(--boa-border)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(74,31,168,0.1)", color: "var(--boa-purple)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <h2
                className="font-bold"
                style={{
                  fontFamily: "var(--font-syne, var(--font-inter))",
                  fontSize: "clamp(20px, 2vw, 26px)",
                  color: "var(--boa-navy)",
                  letterSpacing: "-0.01em",
                }}
              >
                Loan Repayment Calculator
              </h2>
            </div>
            <p
              className="mb-8"
              style={{
                fontSize: 14,
                color: "var(--boa-muted)",
                fontFamily: "var(--font-dm-sans, var(--font-inter))",
              }}
            >
              Calculate your monthly repayments, total interest cost, and total amount paid.
            </p>
            <LoanCalculator />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          MULTI-CURRENCY CONVERTER
      ══════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(200,151,42,0.1)", color: "var(--boa-gold)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <h2
                className="font-bold"
                style={{
                  fontFamily: "var(--font-syne, var(--font-inter))",
                  fontSize: "clamp(20px, 2vw, 26px)",
                  color: "var(--boa-navy)",
                  letterSpacing: "-0.01em",
                }}
              >
                Currency Converter
              </h2>
            </div>
            <p
              className="mb-2"
              style={{
                fontSize: 14,
                color: "var(--boa-muted)",
                fontFamily: "var(--font-dm-sans, var(--font-inter))",
              }}
            >
              Convert any amount to all 10 supported currencies simultaneously.
            </p>
            <p
              className="mb-8 text-[12px] inline-flex items-center gap-1.5"
              style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Rates shown are indicative only. Live rates apply at time of transaction.
            </p>
            <MultiCurrencyConverter />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          DISCLAIMER
      ══════════════════════════════════════════════════ */}
      <section
        className="py-10 border-t"
        style={{ backgroundColor: "var(--boa-light)", borderColor: "var(--boa-border)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p
            className="text-[12px] leading-relaxed max-w-3xl"
            style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
          >
            All calculators are provided for illustrative purposes only and do not constitute financial advice. Results are estimates based on the inputs you provide and do not account for taxes, fees, or changes in interest rates over time. Exchange rates shown are indicative mid-market rates and may differ from the rates applied to actual transactions. Bank of Asia Online is not liable for decisions made based on these tools.
          </p>
        </div>
      </section>
    </>
  );
}
