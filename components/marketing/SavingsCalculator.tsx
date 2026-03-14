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

export default function SavingsCalculator() {
  const [start, setStart] = useState("5000");
  const [monthly, setMonthly] = useState("200");
  const [rate, setRate] = useState("4.75");
  const [years, setYears] = useState(5);

  const yearlyData = useMemo(() => {
    const p = parseFloat(start) || 0;
    const m = parseFloat(monthly) || 0;
    const r = (parseFloat(rate) || 0) / 100 / 12;
    const data: { year: number; balance: number; principal: number }[] = [];

    let balance = p;
    let totalPrincipal = p;

    for (let y = 1; y <= years; y++) {
      for (let mo = 0; mo < 12; mo++) {
        balance = balance * (1 + r) + m;
        totalPrincipal += m;
      }
      data.push({ year: y, balance, principal: totalPrincipal });
    }
    return data;
  }, [start, monthly, rate, years]);

  const final = yearlyData[yearlyData.length - 1];
  const totalDeposited = final ? final.principal : parseFloat(start) || 0;
  const interestEarned = final ? final.balance - final.principal : 0;
  const maxBalance = Math.max(...yearlyData.map((d) => d.balance), 1);

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: "var(--boa-border)" }}
    >
      {/* Inputs */}
      <div className="p-6 bg-white grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}>
            Starting amount ($)
          </label>
          <input
            type="number"
            min="0"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--boa-teal)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--boa-border)")}
          />
        </div>
        <div>
          <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}>
            Monthly deposit ($)
          </label>
          <input
            type="number"
            min="0"
            value={monthly}
            onChange={(e) => setMonthly(e.target.value)}
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--boa-teal)")}
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
            step="0.05"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--boa-teal)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--boa-border)")}
          />
        </div>
        <div>
          <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}>
            Term: {years} {years === 1 ? "year" : "years"}
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: "var(--boa-teal)" }}
          />
          <div className="flex justify-between text-[11px] mt-0.5" style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}>
            <span>1yr</span><span>10yr</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      {final && (
        <div
          className="grid grid-cols-3 border-t"
          style={{ borderColor: "var(--boa-border)", backgroundColor: "var(--boa-light)" }}
        >
          {[
            { label: "Final balance", value: `$${fmt(final.balance)}`, color: "var(--boa-teal)" },
            { label: "Total deposited", value: `$${fmt(totalDeposited)}`, color: "var(--boa-navy)" },
            { label: "Interest earned", value: `$${fmt(interestEarned)}`, color: "var(--boa-purple)" },
          ].map((s) => (
            <div key={s.label} className="p-5 text-center border-r last:border-r-0" style={{ borderColor: "var(--boa-border)" }}>
              <p className="font-bold leading-none mb-1" style={{ fontSize: "clamp(15px, 2vw, 22px)", color: s.color, fontFamily: "var(--font-jetbrains-mono, monospace)" }}>
                {s.value}
              </p>
              <p className="text-[11px] uppercase tracking-wider mt-1" style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Bar chart */}
      {yearlyData.length > 0 && (
        <div
          className="p-6 border-t"
          style={{ borderColor: "var(--boa-border)", backgroundColor: "#fff" }}
        >
          <p className="text-[11px] uppercase tracking-wider mb-4 font-semibold" style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}>
            Year-by-year growth
          </p>
          <div className="flex items-end gap-1.5 h-32">
            {yearlyData.map((d) => {
              const principalH = (d.principal / maxBalance) * 100;
              const totalH = (d.balance / maxBalance) * 100;
              return (
                <div key={d.year} className="flex-1 flex flex-col items-center gap-0.5 h-full justify-end group relative">
                  {/* Tooltip */}
                  <div
                    className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-lg px-3 py-1.5 text-[11px] whitespace-nowrap z-10"
                    style={{ backgroundColor: "var(--boa-navy)", color: "#fff", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                  >
                    Yr {d.year}: ${Math.round(d.balance).toLocaleString()}
                  </div>
                  {/* Total bar (interest portion on top) */}
                  <div
                    className="w-full rounded-t"
                    style={{
                      height: `${totalH}%`,
                      background: `linear-gradient(to top, var(--boa-teal) ${principalH / totalH * 100}%, rgba(0,168,150,0.35))`,
                      minHeight: 4,
                    }}
                  />
                  <span className="text-[10px]" style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}>
                    {d.year}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "var(--boa-teal)" }} />
              <span className="text-[11px]" style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}>Principal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "rgba(0,168,150,0.35)" }} />
              <span className="text-[11px]" style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}>Interest</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
