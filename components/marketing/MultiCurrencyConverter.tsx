"use client";

import { useState, useMemo } from "react";

// Indicative mid-market rates relative to USD
const FX_RATES: Record<string, { rate: number; flag: string; name: string }> = {
  USD: { rate: 1.0000, flag: "🇺🇸", name: "US Dollar" },
  AUD: { rate: 1.5430, flag: "🇦🇺", name: "Australian Dollar" },
  EUR: { rate: 0.9180, flag: "🇪🇺", name: "Euro" },
  GBP: { rate: 0.7870, flag: "🇬🇧", name: "British Pound" },
  JPY: { rate: 149.50, flag: "🇯🇵", name: "Japanese Yen" },
  SGD: { rate: 1.3460, flag: "🇸🇬", name: "Singapore Dollar" },
  HKD: { rate: 7.8220, flag: "🇭🇰", name: "Hong Kong Dollar" },
  CAD: { rate: 1.3580, flag: "🇨🇦", name: "Canadian Dollar" },
  CHF: { rate: 0.9040, flag: "🇨🇭", name: "Swiss Franc" },
  NZD: { rate: 1.6290, flag: "🇳🇿", name: "New Zealand Dollar" },
};

const CURRENCIES = Object.keys(FX_RATES);

const selectStyle: React.CSSProperties = {
  padding: "10px 36px 10px 14px",
  borderRadius: 8,
  border: "1px solid var(--boa-border)",
  fontSize: 14,
  color: "var(--boa-navy)",
  fontFamily: "var(--font-dm-sans, var(--font-inter))",
  backgroundColor: "#fff",
  outline: "none",
  appearance: "none",
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
};

function fmt(n: number, decimals = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export default function MultiCurrencyConverter() {
  const [amount, setAmount] = useState("1000");
  const [fromCurrency, setFromCurrency] = useState("AUD");

  const results = useMemo(() => {
    const val = parseFloat(amount) || 0;
    const fromRate = FX_RATES[fromCurrency].rate;
    const valueInUSD = val / fromRate;

    return CURRENCIES.filter((c) => c !== fromCurrency).map((c) => {
      const { rate, flag, name } = FX_RATES[c];
      const converted = valueInUSD * rate;
      const decimals = c === "JPY" ? 0 : 2;
      return { code: c, flag, name, value: converted, decimals };
    });
  }, [amount, fromCurrency]);

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--boa-border)" }}>
      {/* Input row */}
      <div className="p-6 bg-white flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}>
            Amount
          </label>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid var(--boa-border)",
              fontSize: 14,
              color: "var(--boa-navy)",
              fontFamily: "var(--font-dm-sans, var(--font-inter))",
              backgroundColor: "#fff",
              outline: "none",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--boa-gold)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--boa-border)")}
          />
        </div>
        <div>
          <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}>
            From
          </label>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            style={selectStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--boa-gold)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--boa-border)")}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {FX_RATES[c].flag} {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results grid */}
      <div
        className="border-t grid grid-cols-1 sm:grid-cols-2"
        style={{ borderColor: "var(--boa-border)", backgroundColor: "var(--boa-light)" }}
      >
        {results.map((r, i) => (
          <div
            key={r.code}
            className="p-4 flex items-center justify-between border-b sm:odd:border-r"
            style={{
              borderColor: "var(--boa-border)",
              borderRight: i % 2 === 0 ? `1px solid var(--boa-border)` : undefined,
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl leading-none">{r.flag}</span>
              <div>
                <p className="font-semibold text-[14px]" style={{ color: "var(--boa-navy)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}>
                  {r.code}
                </p>
                <p className="text-[11px]" style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}>
                  {r.name}
                </p>
              </div>
            </div>
            <p
              className="font-bold text-right"
              style={{
                fontFamily: "var(--font-jetbrains-mono, monospace)",
                fontSize: 16,
                color: "var(--boa-navy)",
              }}
            >
              {fmt(r.value, r.decimals)}
            </p>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div
        className="px-6 py-3 border-t"
        style={{ borderColor: "var(--boa-border)", backgroundColor: "#fff" }}
      >
        <p className="text-[11px]" style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}>
          Indicative rates only · Updated periodically · Actual rates may vary at time of transaction
        </p>
      </div>
    </div>
  );
}
