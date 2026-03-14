"use client";

import { useState, useMemo } from "react";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid var(--boa-border)",
  fontSize: 14,
  color: "var(--boa-navy)",
  fontFamily: "var(--font-dm-sans, var(--font-inter))",
  backgroundColor: "#fff",
  outline: "none",
};

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function LoanCalculator() {
  const [amount, setAmount] = useState("25000");
  const [rate, setRate] = useState("6.99");
  const [termMonths, setTermMonths] = useState("60");

  const result = useMemo(() => {
    const P = parseFloat(amount) || 0;
    const annualRate = parseFloat(rate) || 0;
    const n = parseInt(termMonths) || 1;
    const r = annualRate / 100 / 12;

    if (P <= 0 || n <= 0) return null;

    let monthly: number;
    if (r === 0) {
      monthly = P / n;
    } else {
      monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const totalPaid = monthly * n;
    const totalInterest = totalPaid - P;
    const interestPercent = (totalInterest / totalPaid) * 100;

    return { monthly, totalPaid, totalInterest, interestPercent };
  }, [amount, rate, termMonths]);

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--boa-border)" }}>
      {/* Inputs */}
      <div className="p-6 bg-white grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}>
            Loan amount ($)
          </label>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--boa-purple)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--boa-border)")}
          />
        </div>
        <div>
          <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}>
            Interest rate (% p.a.)
          </label>
          <input
            type="number"
            min="0"
            max="30"
            step="0.01"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--boa-purple)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--boa-border)")}
          />
        </div>
        <div>
          <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}>
            Loan term (months)
          </label>
          <input
            type="number"
            min="1"
            max="360"
            value={termMonths}
            onChange={(e) => setTermMonths(e.target.value)}
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--boa-purple)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--boa-border)")}
          />
        </div>
      </div>

      {/* Results */}
      {result ? (
        <>
          <div
            className="grid grid-cols-3 border-t"
            style={{ borderColor: "var(--boa-border)", backgroundColor: "var(--boa-light)" }}
          >
            {[
              { label: "Monthly repayment", value: `$${fmt(result.monthly)}`, color: "var(--boa-purple)" },
              { label: "Total interest", value: `$${fmt(result.totalInterest)}`, color: "#dc2626" },
              { label: "Total paid", value: `$${fmt(result.totalPaid)}`, color: "var(--boa-navy)" },
            ].map((s) => (
              <div key={s.label} className="p-5 text-center border-r last:border-r-0" style={{ borderColor: "var(--boa-border)" }}>
                <p className="font-bold leading-none mb-1" style={{ fontSize: "clamp(14px, 1.8vw, 20px)", color: s.color, fontFamily: "var(--font-jetbrains-mono, monospace)" }}>
                  {s.value}
                </p>
                <p className="text-[11px] uppercase tracking-wider mt-1" style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Principal vs Interest breakdown bar */}
          <div className="p-6 border-t bg-white" style={{ borderColor: "var(--boa-border)" }}>
            <p className="text-[11px] uppercase tracking-wider mb-3 font-semibold" style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}>
              Principal vs interest breakdown
            </p>
            <div className="rounded-full overflow-hidden h-3 flex" style={{ backgroundColor: "var(--boa-light)" }}>
              <div
                style={{
                  width: `${100 - result.interestPercent}%`,
                  backgroundColor: "var(--boa-purple)",
                  transition: "width 0.4s ease",
                }}
              />
              <div
                style={{
                  width: `${result.interestPercent}%`,
                  backgroundColor: "#dc2626",
                  opacity: 0.7,
                  transition: "width 0.4s ease",
                }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "var(--boa-purple)" }} />
                <span className="text-[11px]" style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}>
                  Principal ({(100 - result.interestPercent).toFixed(1)}%)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#dc2626", opacity: 0.7 }} />
                <span className="text-[11px]" style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}>
                  Interest ({result.interestPercent.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="p-6 border-t text-center" style={{ borderColor: "var(--boa-border)", backgroundColor: "var(--boa-light)" }}>
          <p style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))", fontSize: 14 }}>
            Enter loan details above to see results.
          </p>
        </div>
      )}
    </div>
  );
}
