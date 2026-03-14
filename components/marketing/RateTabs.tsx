"use client";

import { useState } from "react";

// ── Table primitives ──────────────────────────────────────

function THead({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr style={{ backgroundColor: "var(--boa-navy)" }}>
        {cols.map((c) => (
          <th
            key={c}
            className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-white whitespace-nowrap"
            style={{ fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
          >
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function TSection({ label }: { label: string }) {
  return (
    <tr style={{ backgroundColor: "rgba(74,31,168,0.04)", borderBottom: "1px solid var(--boa-border)" }}>
      <td
        colSpan={10}
        className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest"
        style={{ color: "var(--boa-purple)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
      >
        {label}
      </td>
    </tr>
  );
}

interface TRowProps {
  cells: string[];
  highlight?: boolean;
  isLast?: boolean;
}
function TRow({ cells, highlight, isLast }: TRowProps) {
  return (
    <tr
      style={{
        backgroundColor: highlight ? "rgba(0,168,150,0.04)" : "#ffffff",
        borderBottom: isLast ? undefined : "1px solid var(--boa-border)",
      }}
    >
      {cells.map((cell, i) => {
        const isRate =
          cell.includes("p.a.") ||
          cell === "Free" ||
          cell === "$0" ||
          cell === "0.00%";
        const isMuted = cell === "N/A" || cell === "None";
        return (
          <td
            key={i}
            className="px-5 py-4"
            style={{
              fontSize: i === 0 ? 14 : 13,
              fontWeight: i === 0 ? 500 : 400,
              color: isRate
                ? "var(--boa-teal)"
                : isMuted
                ? "var(--boa-muted)"
                : i === 0
                ? "var(--boa-navy)"
                : "var(--boa-text)",
              fontFamily:
                isRate || cell.includes("%") || cell.includes("$")
                  ? "var(--font-jetbrains-mono, monospace)"
                  : "var(--font-dm-sans, var(--font-inter))",
              whiteSpace: i === 0 ? undefined : "nowrap",
            }}
          >
            {cell}
          </td>
        );
      })}
    </tr>
  );
}

function Table({
  cols,
  sections,
}: {
  cols: string[];
  sections: { label: string; rows: string[][] }[];
}) {
  const allRows = sections.flatMap((s) => s.rows);
  const totalRows = allRows.length;
  let rowIndex = 0;

  return (
    <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--boa-border)" }}>
      <table className="w-full text-left border-collapse">
        <THead cols={cols} />
        <tbody>
          {sections.map((section) => (
            <>
              <TSection key={section.label} label={section.label} />
              {section.rows.map((row) => {
                const idx = rowIndex++;
                return (
                  <TRow
                    key={idx}
                    cells={row}
                    isLast={idx === totalRows - 1}
                  />
                );
              })}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Tab data ──────────────────────────────────────────────

const TABS = ["Savings & Deposits", "Cards", "Transfers & Fees"] as const;
type Tab = (typeof TABS)[number];

// ─────────────────────────────────────────────────────────

export default function RateTabs() {
  const [active, setActive] = useState<Tab>("Savings & Deposits");

  return (
    <div>
      {/* Tab bar */}
      <div
        className="flex gap-1 mb-10 border-b"
        style={{ borderColor: "var(--boa-border)" }}
        role="tablist"
        aria-label="Rate categories"
      >
        {TABS.map((tab) => {
          const isActive = active === tab;
          return (
            <button
              key={tab}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(tab)}
              className="px-5 py-3 text-[14px] font-medium transition-colors relative"
              style={{
                color: isActive ? "var(--boa-purple)" : "var(--boa-muted)",
                fontFamily: "var(--font-dm-sans, var(--font-inter))",
                borderBottom: isActive
                  ? "2px solid var(--boa-purple)"
                  : "2px solid transparent",
                marginBottom: -1,
                backgroundColor: "transparent",
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: Savings & Deposits ─────────────────── */}
      {active === "Savings & Deposits" && (
        <div role="tabpanel">
          <Table
            cols={["Account Type", "Interest Rate", "Frequency", "Min Balance", "Notes"]}
            sections={[
              {
                label: "Savings Accounts",
                rows: [
                  ["Savings Account", "4.75% p.a.", "Monthly", "None", "Variable rate"],
                ],
              },
              {
                label: "Term Deposits",
                rows: [
                  ["3 Month Term Deposit",  "4.50% p.a.", "At maturity", "$1,000", "Fixed rate"],
                  ["6 Month Term Deposit",  "4.80% p.a.", "At maturity", "$1,000", "Fixed rate"],
                  ["12 Month Term Deposit", "5.10% p.a.", "At maturity", "$1,000", "Fixed rate"],
                ],
              },
              {
                label: "Transaction Accounts",
                rows: [
                  ["Current Account", "0.00%", "N/A", "None", "No interest — transaction account"],
                ],
              },
            ]}
          />

          {/* Rate note */}
          <div
            className="mt-6 rounded-xl p-5 border"
            style={{
              backgroundColor: "rgba(74,31,168,0.04)",
              borderColor: "rgba(74,31,168,0.12)",
            }}
          >
            <p
              className="text-[13px] leading-relaxed"
              style={{
                color: "var(--boa-muted)",
                fontFamily: "var(--font-dm-sans, var(--font-inter))",
              }}
            >
              <strong style={{ color: "var(--boa-purple)" }}>Variable rates</strong> can change
              at any time. <strong style={{ color: "var(--boa-purple)" }}>Fixed rates</strong> are
              locked for the full term at the rate applicable on the day of opening.
              Term deposit interest is paid at maturity to your nominated linked account.
            </p>
          </div>
        </div>
      )}

      {/* ── TAB 2: Cards ──────────────────────────────── */}
      {active === "Cards" && (
        <div role="tabpanel">
          <Table
            cols={["Card Type", "Annual Fee", "Purchase Rate", "Cash Advance Rate"]}
            sections={[
              {
                label: "Virtual Cards",
                rows: [
                  ["Virtual VISA Card",   "$0", "N/A", "N/A"],
                  ["Virtual Mastercard",  "$0", "N/A", "N/A"],
                ],
              },
            ]}
          />

          <div
            className="mt-6 rounded-xl p-5 border"
            style={{
              backgroundColor: "rgba(0,168,150,0.04)",
              borderColor: "rgba(0,168,150,0.14)",
            }}
          >
            <p
              className="text-[13px] leading-relaxed"
              style={{
                color: "var(--boa-muted)",
                fontFamily: "var(--font-dm-sans, var(--font-inter))",
              }}
            >
              Bank of Asia virtual cards are debit cards — they draw directly from
              your account balance. There is no credit facility, no purchase interest rate,
              and no cash advance feature. Cards are issued free of charge and can be
              generated instantly from your dashboard.
            </p>
          </div>
        </div>
      )}

      {/* ── TAB 3: Transfers & Fees ────────────────────── */}
      {active === "Transfers & Fees" && (
        <div role="tabpanel">
          <Table
            cols={["Service", "Fee", "Notes"]}
            sections={[
              {
                label: "Transfers",
                rows: [
                  ["Internal Transfer",        "Free",              "Instant settlement — Bank of Asia to Bank of Asia"],
                  ["Local Wire Transfer",       "$2.50 flat",        "1–3 business days — domestic banks"],
                  ["International SWIFT Wire",  "0.5% + $8.00",      "3–5 business days — 180+ countries"],
                  ["Currency Conversion (FX)",  "Mid-rate + 0.5%",   "Real-time — locked on confirmation"],
                ],
              },
              {
                label: "Cards",
                rows: [
                  ["Virtual Card (issuance)",   "Free",   "Up to 3 cards per account"],
                  ["Card replacement",          "Free",   "Instant new card generated"],
                ],
              },
              {
                label: "Account Fees",
                rows: [
                  ["Account opening",           "Free",   "No setup or application fee"],
                  ["Monthly account fee",       "$0",     "Always free — personal and business"],
                  ["Paper statement",           "$5.00",  "Digital statements are always free"],
                  ["Account closure",           "Free",   "No exit or termination fee"],
                ],
              },
            ]}
          />

          <div
            className="mt-6 rounded-xl p-5 border"
            style={{
              backgroundColor: "rgba(200,151,42,0.04)",
              borderColor: "rgba(200,151,42,0.16)",
            }}
          >
            <p
              className="text-[13px] leading-relaxed"
              style={{
                color: "var(--boa-muted)",
                fontFamily: "var(--font-dm-sans, var(--font-inter))",
              }}
            >
              <strong style={{ color: "var(--boa-gold)" }}>Note:</strong> International SWIFT
              transfers may incur additional fees charged by correspondent banks in the
              transfer chain. These fees are outside Bank of Asia&apos;s control and are not
              included in the schedule above. We recommend adding a buffer for precision payments.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
