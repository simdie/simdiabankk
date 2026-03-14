"use client";

import { useState, useMemo } from "react";
import Select from "@/components/ui/Select";
import { CURRENCY_FLAGS, CURRENCY_NAMES } from "@/lib/utils";

const CURRENCIES = ["USD", "EUR", "GBP", "SGD", "CAD", "AUD", "CHF", "JPY", "CNY", "AED"];

// March 2026 rates (relative to USD)
const BASE_RATES: Record<string, number> = {
  USD: 1, EUR: 1.0812, GBP: 1.2734, SGD: 1 / 0.74, CAD: 1 / 0.73,
  AUD: 1 / 0.63, CHF: 1.1289, JPY: 1 / 0.0067, CNY: 1 / 0.138, AED: 1 / 0.272,
};

// 24h change (March 2026 indicative)
const CHANGE_24H: Record<string, number> = {
  USD: 0, EUR: +0.18, GBP: +0.31, SGD: -0.09, CAD: +0.12,
  AUD: +0.44, CHF: -0.06, JPY: +0.72, CNY: -0.21, AED: 0.00,
};

// Trend direction for indicator arrow
const TREND_7D: Record<string, "up" | "down" | "flat"> = {
  USD: "flat", EUR: "up", GBP: "up", SGD: "flat", CAD: "up",
  AUD: "up", CHF: "down", JPY: "up", CNY: "down", AED: "flat",
};

function getHistory(currency: string, base: string): number[] {
  const r = BASE_RATES[currency] / BASE_RATES[base];
  return [0.97, 0.99, 1.01, 0.98, 1.02, 0.995, 1].map(m => parseFloat((r * m).toFixed(4)));
}

function SparkLine({ data }: { data: number[] }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 0.001;
  const h = 32; const w = 80;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  const up = data[data.length - 1] >= data[0];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <polyline points={pts} fill="none" stroke={up ? "#00E5A0" : "#FF3B5C"} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

const CURRENCY_OPTIONS = CURRENCIES.map((c) => ({
  value: c, label: `${c} — ${CURRENCY_NAMES[c]}`, flag: CURRENCY_FLAGS[c],
}));

export default function ExchangeRatesClient() {
  const [base, setBase] = useState("USD");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState("1000");

  const converted = useMemo(() => {
    const num = parseFloat(amount) || 0;
    const rate = BASE_RATES[toCurrency] / BASE_RATES[fromCurrency];
    return (num * rate).toFixed(2);
  }, [amount, fromCurrency, toCurrency]);

  const convRate = useMemo(() => {
    return (BASE_RATES[toCurrency] / BASE_RATES[fromCurrency]).toFixed(6);
  }, [fromCurrency, toCurrency]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 900, margin: "0 auto" }}>
      <div className="exchange-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#f0f4ff", marginBottom: 4 }}>Exchange Rates</h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>
            Last updated: March 2026 &nbsp;•&nbsp; <span style={{ color: "#F0B429" }}>Indicative rates for display only</span>
          </p>
        </div>
        <div className="exchange-base-row" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap" }}>Base:</span>
          <div className="exchange-base-selector" style={{ flex: 1, maxWidth: 200 }}>
            <Select options={CURRENCY_OPTIONS} value={base} onChange={setBase} searchable />
          </div>
        </div>
      </div>

      {/* Rates table — desktop */}
      <div className="exchange-rates-wrapper hidden md:block">
        <table style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Currency", "Code", "Rate", "24h Change", "7-Day Trend", "Trend"].map(h => (
                <th key={h} style={{
                  padding: "12px 18px", fontSize: 11, fontWeight: 700,
                  color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em",
                  textTransform: "uppercase", textAlign: "left",
                  background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CURRENCIES.filter(c => c !== base).map((currency) => {
              const rate = BASE_RATES[currency] / BASE_RATES[base];
              const change = CHANGE_24H[currency];
              const history = getHistory(currency, base);
              const up = change > 0;
              const flat = change === 0;
              const trend = TREND_7D[currency];
              return (
                <tr key={currency} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 22 }}>{CURRENCY_FLAGS[currency]}</span>
                      <span style={{ fontSize: 13, color: "#f0f4ff", fontWeight: 500 }}>
                        {CURRENCY_NAMES[currency]}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    <span style={{ fontSize: 13, fontFamily: "monospace", color: "#00D4FF", background: "rgba(0,212,255,0.06)", padding: "2px 8px", borderRadius: 5 }}>
                      {currency}
                    </span>
                  </td>
                  <td style={{ padding: "14px 18px", fontSize: 14, fontWeight: 600, color: "#f0f4ff", fontVariantNumeric: "tabular-nums" }}>
                    {rate.toFixed(4)}
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: flat ? "rgba(255,255,255,0.4)" : up ? "#00E5A0" : "#FF3B5C" }}>
                      {flat ? "0.00%" : `${up ? "+" : ""}${change}%`}
                    </span>
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    <SparkLine data={history} />
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    <span style={{ fontSize: 18, color: trend === "up" ? "#00E5A0" : trend === "down" ? "#FF3B5C" : "rgba(255,255,255,0.3)" }}>
                      {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Rates cards — mobile */}
      <div className="flex flex-col md:hidden" style={{ gap: 10 }}>
        {CURRENCIES.filter(c => c !== base).map((currency) => {
          const rate = BASE_RATES[currency] / BASE_RATES[base];
          const change = CHANGE_24H[currency];
          const history = getHistory(currency, base);
          const up = change > 0;
          const flat = change === 0;
          const trend = TREND_7D[currency];
          return (
            <div key={currency} style={{ background: "rgba(13,25,41,0.9)", borderRadius: 14, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 24 }}>{CURRENCY_FLAGS[currency]}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#f0f4ff" }}>{CURRENCY_NAMES[currency]}</div>
                    <span style={{ fontSize: 12, fontFamily: "monospace", color: "#00D4FF", background: "rgba(0,212,255,0.06)", padding: "1px 6px", borderRadius: 4 }}>{currency}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#f0f4ff", fontVariantNumeric: "tabular-nums" }}>{rate.toFixed(4)}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end", marginTop: 2 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: flat ? "rgba(255,255,255,0.4)" : up ? "#00E5A0" : "#FF3B5C" }}>
                      {flat ? "0.00%" : `${up ? "+" : ""}${change}%`}
                    </span>
                    <span style={{ fontSize: 14, color: trend === "up" ? "#00E5A0" : trend === "down" ? "#FF3B5C" : "rgba(255,255,255,0.3)" }}>
                      {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <SparkLine data={history} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Currency converter */}
      <div style={{ padding: "28px 24px", borderRadius: 16, background: "linear-gradient(135deg, rgba(0,212,255,0.06), rgba(13,26,48,0.8))", border: "1px solid rgba(0,212,255,0.14)" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f0f4ff", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
          💱 Currency Converter
        </h3>
        <div className="exchange-converter-grid">
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>From</label>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ width: 160 }}>
                <Select options={CURRENCY_OPTIONS} value={fromCurrency} onChange={setFromCurrency} />
              </div>
              <input
                type="text"
                value={amount}
                onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                style={{ flex: 1, padding: "10px 14px", borderRadius: 10, background: "rgba(6,12,24,0.7)", border: "1px solid rgba(255,255,255,0.08)", color: "#f0f4ff", fontSize: 14, outline: "none", fontVariantNumeric: "tabular-nums" }}
              />
            </div>
          </div>

          <div className="exchange-converter-swap" style={{ textAlign: "center", paddingBottom: 4 }}>
            <button onClick={() => { setFromCurrency(toCurrency); setToCurrency(fromCurrency); }}
              style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", fontSize: 16, color: "#00D4FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              ⇄
            </button>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>To</label>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ width: 160 }}>
                <Select options={CURRENCY_OPTIONS} value={toCurrency} onChange={setToCurrency} />
              </div>
              <div style={{ flex: 1, padding: "10px 14px", borderRadius: 10, background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)", fontSize: 16, fontWeight: 700, color: "#00D4FF", display: "flex", alignItems: "center", fontVariantNumeric: "tabular-nums" }}>
                {converted}
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 14, fontSize: 12, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>
          1 {fromCurrency} = {convRate} {toCurrency} &nbsp;•&nbsp; Indicative rate, Last updated: March 2026
        </div>
      </div>
    </div>
  );
}
