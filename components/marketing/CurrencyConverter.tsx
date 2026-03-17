"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ── Hardcoded rates: 1 USD = X currency ──────────────────
export const FX_RATES: Record<string, number> = {
  USD: 1.0000,
  AUD: 1.5432,
  EUR: 0.9234,
  GBP: 0.7891,
  JPY: 149.82,
  SGD: 1.3460,
  HKD: 7.8220,
  CAD: 1.3612,
  CHF: 0.8956,
  NZD: 1.6290,
};

const CURRENCIES = [
  { code: "USD", flag: "🇺🇸", name: "US Dollar" },
  { code: "AUD", flag: "🇦🇺", name: "Australian Dollar" },
  { code: "EUR", flag: "🇪🇺", name: "Euro" },
  { code: "GBP", flag: "🇬🇧", name: "British Pound" },
  { code: "JPY", flag: "🇯🇵", name: "Japanese Yen" },
  { code: "SGD", flag: "🇸🇬", name: "Singapore Dollar" },
  { code: "HKD", flag: "🇭🇰", name: "Hong Kong Dollar" },
  { code: "CAD", flag: "🇨🇦", name: "Canadian Dollar" },
  { code: "CHF", flag: "🇨🇭", name: "Swiss Franc" },
  { code: "NZD", flag: "🇳🇿", name: "New Zealand Dollar" },
];

// Flat fee in USD + percentage
const FLAT_FEE_USD = 8.0;
const PCT_FEE = 0.005; // 0.5%

function fmt(amount: number, code: string): string {
  if (!isFinite(amount) || amount < 0) return "—";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: code === "JPY" ? 0 : 2,
    maximumFractionDigits: code === "JPY" ? 0 : 2,
  }).format(amount);
}

export default function CurrencyConverter() {
  const [rawAmount, setRawAmount] = useState("1000");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("GBP");

  const amount = parseFloat(rawAmount.replace(/[^0-9.]/g, "")) || 0;

  const { receiveAmount, feeUSD, feeInFrom, exchangeRate, insufficientFunds } =
    useMemo(() => {
      const fromRate = FX_RATES[from]; // units of `from` per 1 USD
      const toRate = FX_RATES[to];

      // Amount in USD
      const amountUSD = amount / fromRate;

      // Fee in USD
      const feeUSD = FLAT_FEE_USD + amountUSD * PCT_FEE;

      // Fee displayed in `from` currency
      const feeInFrom = feeUSD * fromRate;

      // Remaining after fee
      const netUSD = amountUSD - feeUSD;
      const insufficientFunds = netUSD <= 0 && amount > 0;

      // Receive amount
      const receiveAmount = insufficientFunds ? 0 : Math.max(0, netUSD * toRate);

      // Exchange rate: 1 from = X to
      const exchangeRate = toRate / fromRate;

      return { receiveAmount, feeUSD, feeInFrom, exchangeRate, insufficientFunds };
    }, [amount, from, to]);

  const fromCurrency = CURRENCIES.find((c) => c.code === from)!;
  const toCurrency = CURRENCIES.find((c) => c.code === to)!;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid var(--boa-border)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.07)",
        maxWidth: 560,
        width: "100%",
      }}
    >
      {/* Header */}
      <div
        className="px-7 py-5 border-b"
        style={{ borderColor: "var(--boa-border)", backgroundColor: "var(--boa-light)" }}
      >
        <p
          className="text-[13px] font-semibold uppercase tracking-widest"
          style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
        >
          International Transfer Estimator
        </p>
      </div>

      <div className="p-7 space-y-5">

        {/* You send */}
        <div>
          <label
            className="block text-[11px] font-semibold uppercase tracking-wider mb-2"
            style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
          >
            You send
          </label>
          <div
            className="flex items-center rounded-xl overflow-hidden border focus-within:ring-2"
            style={{
              borderColor: "var(--boa-border)",
              // @ts-expect-error CSS var
              "--tw-ring-color": "var(--boa-purple)",
            }}
          >
            <input
              type="text"
              inputMode="decimal"
              value={rawAmount}
              onChange={(e) => setRawAmount(e.target.value)}
              className="flex-1 px-4 py-3.5 text-[22px] font-medium outline-none bg-white"
              style={{
                color: "var(--boa-navy)",
                fontFamily: "var(--font-jetbrains-mono, monospace)",
              }}
              aria-label="Amount to send"
            />
            <select
              value={from}
              onChange={(e) => {
                const next = e.target.value;
                setFrom(next);
                if (next === to) setTo(next === "USD" ? "GBP" : "USD");
              }}
              className="border-l px-4 py-3.5 bg-white font-semibold text-[15px] cursor-pointer outline-none appearance-none pr-8"
              style={{
                borderColor: "var(--boa-border)",
                color: "var(--boa-navy)",
                fontFamily: "var(--font-dm-sans, var(--font-inter))",
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
              }}
              aria-label="From currency"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Exchange arrow */}
        <div className="flex items-center justify-center">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(74,31,168,0.08)" }}
            aria-hidden
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 3v12M9 15l-4-4M9 15l4-4" stroke="var(--boa-purple)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* They receive */}
        <div>
          <label
            className="block text-[11px] font-semibold uppercase tracking-wider mb-2"
            style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
          >
            They receive
          </label>
          <div
            className="flex items-center rounded-xl border"
            style={{
              borderColor: insufficientFunds ? "#fca5a5" : "var(--boa-border)",
              backgroundColor: "var(--boa-light)",
            }}
          >
            <div
              className="flex-1 px-4 py-3.5 text-[22px] font-medium"
              style={{
                color: insufficientFunds ? "#ef4444" : "var(--boa-navy)",
                fontFamily: "var(--font-jetbrains-mono, monospace)",
              }}
            >
              {insufficientFunds
                ? "Amount too low"
                : `${fmt(receiveAmount, to)}`}
            </div>
            <select
              value={to}
              onChange={(e) => {
                const next = e.target.value;
                setTo(next);
                if (next === from) setFrom(next === "USD" ? "GBP" : "USD");
              }}
              className="border-l px-4 py-3.5 bg-transparent font-semibold text-[15px] cursor-pointer outline-none appearance-none pr-8"
              style={{
                borderColor: "var(--boa-border)",
                color: "var(--boa-navy)",
                fontFamily: "var(--font-dm-sans, var(--font-inter))",
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
              }}
              aria-label="To currency"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Rate + fee details */}
        <div
          className="rounded-xl p-4 space-y-2"
          style={{ backgroundColor: "var(--boa-light)" }}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-[13px]"
              style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
            >
              Exchange rate
            </span>
            <span
              className="text-[13px] font-medium"
              style={{
                color: "var(--boa-navy)",
                fontFamily: "var(--font-jetbrains-mono, monospace)",
              }}
            >
              1 {fromCurrency.code} = {fmt(exchangeRate, to)} {toCurrency.code}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span
              className="text-[13px]"
              style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
            >
              Transfer fee
            </span>
            <span
              className="text-[13px] font-medium"
              style={{
                color: "var(--boa-navy)",
                fontFamily: "var(--font-jetbrains-mono, monospace)",
              }}
            >
              {from === "USD"
                ? `$${fmt(feeUSD, "USD")} USD`
                : `${fmt(feeInFrom, from)} ${from} (~$${fmt(feeUSD, "USD")} USD)`}
            </span>
          </div>
          <div
            className="border-t pt-2 flex items-center justify-between"
            style={{ borderColor: "var(--boa-border)" }}
          >
            <span
              className="text-[12px]"
              style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
            >
              Fee structure
            </span>
            <span
              className="text-[12px] font-medium"
              style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
            >
              $8.00 flat + 0.5%
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <p
          className="text-[11px] leading-relaxed"
          style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
        >
          Indicative only. Actual exchange rates are locked at the time of transfer.
          Additional correspondent bank fees may apply for some destinations.
        </p>

        {/* CTA */}
        <Link
          href="/register" target="_blank" rel="noopener noreferrer"
          className="block w-full text-center py-3.5 rounded-xl text-[15px] font-medium text-white transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "var(--boa-purple)",
            fontFamily: "var(--font-dm-sans, var(--font-inter))",
          }}
        >
          Get started →
        </Link>
      </div>
    </div>
  );
}
