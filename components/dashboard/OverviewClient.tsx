"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CURRENCY_FLAGS, formatAmount } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface Account {
  id: string; accountNumber: string; currency: string;
  balance: number; status: string;
  virtualCards: { id: string }[];
}
interface Tx {
  id: string; reference: string; type: string; status: string;
  amount: number; currency: string; description: string | null;
  createdAt: Date;
  senderAccount: { accountNumber: string; currency: string; userId?: string } | null;
  receiverAccount: { accountNumber: string; currency: string; userId?: string } | null;
  externalDetails: Record<string, string> | null;
}
interface Props {
  user: { firstName: string; lastName: string };
  accounts: Account[];
  recentTxs: Tx[];
  stats: {
    totalIn: number;
    totalOut: number;
    pendingCount: number;
    activeCards: number;
    savingsRate: number;
    totalBalance: number;
  };
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const TX_ICONS: Record<string, string> = {
  INTERNAL: "⇄", LOCAL_WIRE: "🏛", INTERNATIONAL_WIRE: "✈", ADMIN_DEPOSIT: "⊕",
};

function getDepositLabel(txId: string): string {
  const labels = ["DEPOSIT", "INSTANT DEPOSIT", "WIRE RECEIPT", "CREDIT TRANSFER"];
  const hash = txId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return labels[hash % labels.length];
}

function getDisplayType(id: string, type: string): string {
  if (type === "ADMIN_DEPOSIT") return getDepositLabel(id);
  return type.replace(/_/g, " ");
}

// Quick transfer widget state
function QuickTransferWidget({ accounts }: { accounts: Account[] }) {
  const [amount, setAmount] = useState("");
  const [accountNum, setAccountNum] = useState("");
  const activeAccounts = accounts.filter((a) => a.status === "ACTIVE");

  return (
    <div className="glass-card" style={{ padding: "24px 26px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
          ↗
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-syne)", fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)" }}>Quick Transfer</div>
          <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>Send to Bank of Asia Online account</div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            inputMode="decimal"
            placeholder="Amount"
            value={amount}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9.]/g, "");
              const parts = val.split(".");
              if (parts.length > 2) return;
              setAmount(val);
            }}
            className="input-nexus"
            style={{ fontSize: 20, fontWeight: 700, paddingRight: 60, height: 52 }}
          />
          <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 13, fontWeight: 600, color: "var(--color-text-muted)" }}>
            {activeAccounts[0]?.currency ?? "USD"}
          </span>
        </div>
        <input
          placeholder="Recipient account number"
          value={accountNum}
          onChange={(e) => setAccountNum(e.target.value.replace(/\D/g, "").slice(0, 10))}
          className="input-nexus"
          style={{ fontFamily: "var(--font-jetbrains-mono)", letterSpacing: 1 }}
          maxLength={10}
        />
        <Link
          href={amount && accountNum.length === 10
            ? `/dashboard/transfer?amount=${amount}&to=${accountNum}`
            : "/dashboard/transfer"}
          className="btn-nexus"
          style={{ textDecoration: "none", textAlign: "center", padding: "11px", fontSize: 14, fontWeight: 700 }}
        >
          Continue to Transfer →
        </Link>
      </div>
    </div>
  );
}

// Hardcoded March 2026 rates to USD (item 17)
const RATES_TO_USD: Record<string, number> = {
  USD: 1, EUR: 1.08, GBP: 1.27, SGD: 0.74, CAD: 0.73,
  AUD: 0.63, CHF: 1.13, JPY: 0.0067, CNY: 0.138, AED: 0.272,
};

export default function OverviewClient({ user, accounts, recentTxs, stats }: Props) {
  const totalPortfolio = useMemo(
    () => accounts.reduce((sum, a) => sum + a.balance * (RATES_TO_USD[a.currency] ?? 1), 0),
    [accounts]
  );

  // Sparkline data: last 7 days transaction amounts
  const sparkData = useMemo(() => {
    const days: number[] = Array(7).fill(0);
    const now = new Date();
    recentTxs.forEach((t) => {
      const diff = Math.floor((now.getTime() - new Date(t.createdAt).getTime()) / 86400000);
      if (diff < 7) days[6 - diff] += t.amount;
    });
    return days;
  }, [recentTxs]);

  const sparkMax = Math.max(...sparkData, 1);

  // Spending by type breakdown
  const spendingByType = useMemo(() => {
    const map: Record<string, number> = {};
    recentTxs.forEach((t) => {
      if (!map[t.type]) map[t.type] = 0;
      map[t.type] += t.amount;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 4);
  }, [recentTxs]);

  const totalSpending = spendingByType.reduce((s, [, v]) => s + v, 0);

  const statCards = [
    {
      label: "Total In (30d)",
      value: formatAmount(stats.totalIn, "USD"),
      icon: "↓",
      color: "var(--color-success)",
      bg: "rgba(0,229,160,0.06)",
      border: "rgba(0,229,160,0.15)",
      hint: "Credits received this month",
    },
    {
      label: "Total Out (30d)",
      value: formatAmount(stats.totalOut, "USD"),
      icon: "↑",
      color: "var(--color-danger)",
      bg: "rgba(255,59,92,0.06)",
      border: "rgba(255,59,92,0.15)",
      hint: "Debits sent this month",
    },
    {
      label: "Pending",
      value: stats.pendingCount.toString(),
      icon: "⏳",
      color: "var(--color-gold)",
      bg: "rgba(240,180,41,0.06)",
      border: "rgba(240,180,41,0.15)",
      hint: "Transactions awaiting processing",
    },
    {
      label: "Active Cards",
      value: stats.activeCards.toString(),
      icon: "▣",
      color: "var(--color-accent)",
      bg: "rgba(0,212,255,0.06)",
      border: "rgba(0,212,255,0.15)",
      hint: "Virtual cards in active state",
    },
    {
      label: "Accounts",
      value: accounts.length.toString(),
      icon: "🏦",
      color: "#a78bfa",
      bg: "rgba(167,139,250,0.06)",
      border: "rgba(167,139,250,0.15)",
      hint: "Multi-currency accounts",
    },
    {
      label: "Savings Rate",
      value: `${stats.savingsRate}%`,
      icon: "📈",
      color: "var(--color-success)",
      bg: "rgba(0,229,160,0.06)",
      border: "rgba(0,229,160,0.15)",
      hint: "% of income retained (30d)",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {/* ── Greeting ── */}
      <div className="animate-fade-slide-up">
        <h1 style={{
          fontFamily: "var(--font-syne)", fontSize: 26, fontWeight: 700,
          color: "var(--color-text-primary)", marginBottom: 4,
        }}>
          {getGreeting()}, {user.firstName} 👋
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>
          Here&apos;s your financial overview for today.
        </p>
      </div>

      {/* ── Hero balance card ── */}
      <div
        className="animate-fade-slide-up animate-delay-1 hero-balance-card"
        style={{
          borderRadius: 20,
          padding: "32px 36px",
          background: "linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(13,26,48,0.9) 50%, rgba(18,34,64,0.8) 100%)",
          border: "1px solid rgba(0,212,255,0.2)",
          boxShadow: "0 0 60px rgba(0,212,255,0.05), 0 8px 32px rgba(0,0,0,0.5)",
          position: "relative", overflow: "hidden",
        }}
      >
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.02) 50%, transparent 65%)",
          backgroundSize: "200% 100%", animation: "shimmer 4s linear infinite",
        }} />
        <div style={{
          position: "absolute", top: -60, right: -60, width: 240, height: 240,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)",
          filter: "blur(40px)", pointerEvents: "none",
        }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 24, position: "relative", zIndex: 1 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
              Total Portfolio Value (USD equivalent)
            </div>
            <div className="amount-hero" style={{ color: "var(--color-text-primary)", lineHeight: 1.1, marginBottom: 4, fontSize: "clamp(22px, 5vw, 42px)", wordBreak: "break-word" }}>
              {totalPortfolio.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span style={{ fontSize: 20, color: "var(--color-text-muted)", marginLeft: 8, fontWeight: 400 }}>USD</span>
            </div>
            <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginBottom: 16 }}>
              Across {accounts.length} account{accounts.length !== 1 ? "s" : ""} in {new Set(accounts.map((a) => a.currency)).size} currencies
            </div>
            <div className="hero-btn-group" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
              <Link href="/dashboard/transfer" className="btn-nexus" style={{ padding: "9px 20px", fontSize: 13 }}>
                ↗ Send Money
              </Link>
              <Link href="/dashboard/accounts" className="btn-ghost" style={{ padding: "9px 20px", fontSize: 13 }}>
                + New Account
              </Link>
              <Link href="/dashboard/statements" className="btn-ghost" style={{ padding: "9px 20px", fontSize: 13 }}>
                ↓ Statement
              </Link>
            </div>
          </div>

          {/* Sparkline */}
          <div className="hero-sparkline" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            <div style={{ fontSize: 11, color: "var(--color-text-muted)", letterSpacing: "0.06em" }}>7-DAY ACTIVITY</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 52 }}>
              {sparkData.map((val, i) => {
                const h = Math.max(4, (val / sparkMax) * 52);
                return (
                  <div key={i} style={{
                    width: 10, height: h,
                    borderRadius: 4,
                    background: i === 6
                      ? "var(--color-accent)"
                      : `rgba(0,212,255,${0.2 + (i / 6) * 0.35})`,
                    transition: "height 0.3s ease",
                  }} />
                );
              })}
            </div>
            <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
              {sparkData[6] > 0 ? `Today's volume: ${formatAmount(sparkData[6], "USD")}` : "No activity today"}
            </div>
          </div>
        </div>

        {/* Account mini-chips */}
        {accounts.length > 0 && (
          <div style={{ marginTop: 20, position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
              {accounts.map((a) => (
                <Link key={a.id} href="/dashboard/accounts" style={{
                  padding: "5px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", gap: 6, color: "var(--color-text-secondary)",
                  textDecoration: "none", transition: "border-color 0.15s",
                }}>
                  <span>{CURRENCY_FLAGS[a.currency] || "🌍"}</span>
                  <span>{formatAmount(a.balance, a.currency)}</span>
                </Link>
              ))}
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: "0.06em" }}>
              Exchange rates as of March 2026 · Click account to view details
            </div>
          </div>
        )}
      </div>

      {/* ── 6 Stats Cards ── */}
      <div className="animate-fade-slide-up animate-delay-2 stats-grid">
        {statCards.map((stat) => (
          <div key={stat.label} style={{
            padding: "18px 20px", borderRadius: 14,
            background: stat.bg, border: `1px solid ${stat.border}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: "rgba(255,255,255,0.04)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 15, color: stat.color,
              }}>
                {stat.icon}
              </div>
              <span style={{ fontSize: 11, color: "var(--color-text-muted)", fontWeight: 600, letterSpacing: "0.04em" }}>
                {stat.label}
              </span>
            </div>
            <div className="amount-display" style={{ fontSize: 20, color: stat.color }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 4 }}>{stat.hint}</div>
          </div>
        ))}
      </div>

      {/* ── Account cards + Quick Transfer (2 col) ── */}
      <div className="animate-fade-slide-up animate-delay-3 overview-accounts-grid">
        {/* Account cards */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontFamily: "var(--font-syne)", fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)" }}>
              Your Accounts
            </h2>
            <Link href="/dashboard/accounts" style={{ fontSize: 13, color: "var(--color-accent)", textDecoration: "none", fontWeight: 600 }}>
              Manage →
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {accounts.map((account) => (
              <div key={account.id} className="glass-card" style={{ padding: "20px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 22 }}>{CURRENCY_FLAGS[account.currency] || "🌍"}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-primary)" }}>{account.currency} Account</div>
                      <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: "var(--color-text-muted)", letterSpacing: 1 }}>
                        ••••{account.accountNumber.slice(-4)}
                      </div>
                    </div>
                  </div>
                  <StatusBadge value={account.status} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginBottom: 4 }}>Available Balance</div>
                  <div className="amount-display" style={{ fontSize: 22, color: "var(--color-text-primary)" }}>
                    {formatAmount(account.balance, account.currency)}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link href="/dashboard/accounts" className="btn-ghost" style={{ flex: 1, fontSize: 12, padding: "7px 12px", textDecoration: "none", textAlign: "center" }}>
                    Wire Details
                  </Link>
                  <Link href="/dashboard/transfer" className="btn-nexus" style={{ flex: 1, fontSize: 12, padding: "7px 12px", textDecoration: "none", textAlign: "center" }}>
                    Transfer
                  </Link>
                </div>
              </div>
            ))}
            {accounts.length === 0 && (
              <div className="glass-card" style={{ padding: 32, textAlign: "center", color: "var(--color-text-muted)", fontSize: 14 }}>
                No accounts found.
                <div style={{ marginTop: 12 }}>
                  <Link href="/dashboard/accounts" className="btn-nexus" style={{ textDecoration: "none", padding: "8px 20px", fontSize: 13 }}>
                    Open Account
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Transfer + Promotions */}
        <div className="hidden lg:flex" style={{ flexDirection: "column", gap: 16 }}>
          <QuickTransferWidget accounts={accounts} />

          {/* Financial Insights */}
          {spendingByType.length > 0 && (
            <div className="glass-card" style={{ padding: "22px 24px" }}>
              <div style={{ fontFamily: "var(--font-syne)", fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 16 }}>
                📊 Activity Breakdown
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {spendingByType.map(([type, amount]) => {
                  const pct = totalSpending > 0 ? Math.round((amount / totalSpending) * 100) : 0;
                  const typeLabel = type === "ADMIN_DEPOSIT" ? getDepositLabel(type) : type.replace(/_/g, " ");
                  const typeColor = type === "INTERNAL" ? "var(--color-accent)" : type === "INTERNATIONAL_WIRE" ? "#a78bfa" : type === "LOCAL_WIRE" ? "var(--color-gold)" : "var(--color-success)";
                  return (
                    <div key={type}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: "var(--color-text-muted)", fontWeight: 600 }}>{typeLabel}</span>
                        <span style={{ fontSize: 12, color: "var(--color-text-primary)", fontWeight: 700 }}>{pct}%</span>
                      </div>
                      <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, borderRadius: 2, background: typeColor, transition: "width 0.5s ease" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Promotions / Notices */}
          <div style={{ padding: "20px 22px", borderRadius: 16, background: "linear-gradient(135deg, rgba(240,180,41,0.08), rgba(240,180,41,0.03))", border: "1px solid rgba(240,180,41,0.2)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-gold)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
              💡 Notice
            </div>
            <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: 12 }}>
              Enjoy <strong style={{ color: "var(--color-gold)" }}>zero-fee internal transfers</strong> between all Bank of Asia Online accounts, instantly.
            </div>
            <Link href="/dashboard/transfer" style={{ fontSize: 13, color: "var(--color-gold)", fontWeight: 600, textDecoration: "none" }}>
              Send Money Now →
            </Link>
          </div>

          <div style={{ padding: "20px 22px", borderRadius: 16, background: "linear-gradient(135deg, rgba(0,212,255,0.06), rgba(0,212,255,0.02))", border: "1px solid rgba(0,212,255,0.15)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-accent)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
              🔐 Security
            </div>
            <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: 12 }}>
              Protect your account with <strong style={{ color: "var(--color-accent)" }}>Two-Factor Authentication</strong> for enhanced security.
            </div>
            <Link href="/dashboard/security" style={{ fontSize: 13, color: "var(--color-accent)", fontWeight: 600, textDecoration: "none" }}>
              Enable 2FA →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Recent Transactions ── */}
      <div className="animate-fade-slide-up animate-delay-4">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontFamily: "var(--font-syne)", fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)" }}>
            Recent Transactions
          </h2>
          <Link href="/dashboard/transactions" style={{ fontSize: 13, color: "var(--color-accent)", textDecoration: "none", fontWeight: 600 }}>
            View all →
          </Link>
        </div>
        {/* Desktop table view */}
        <div className="glass-card hidden md:block" style={{ padding: 0, overflow: "hidden" }}>
          {recentTxs.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: "var(--color-text-muted)", fontSize: 14 }}>
              No transactions yet.
            </div>
          ) : (
            <table className="nexus-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Reference</th>
                  <th style={{ textAlign: "right" }}>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTxs.map((tx) => (
                  <tr key={tx.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 8,
                          background: "rgba(0,212,255,0.06)",
                          border: "1px solid rgba(0,212,255,0.12)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 14,
                        }}>
                          {TX_ICONS[tx.type] || "⇄"}
                        </div>
                        <span style={{ fontSize: 12, color: "var(--color-text-muted)", fontWeight: 600 }}>
                          {getDisplayType(tx.id, tx.type)}
                        </span>
                      </div>
                    </td>
                    <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13 }}>
                      {tx.description || "—"}
                    </td>
                    <td>
                      <span style={{
                        fontFamily: "var(--font-jetbrains-mono)", fontSize: 11,
                        color: "var(--color-accent)", background: "rgba(0,212,255,0.06)",
                        padding: "2px 6px", borderRadius: 4,
                      }}>
                        {tx.reference}
                      </span>
                    </td>
                    <td style={{ textAlign: "right", fontFamily: "var(--font-jetbrains-mono)", fontWeight: 700, fontSize: 14 }}>
                      <span style={{ color: tx.receiverAccount ? "var(--color-success)" : "var(--color-text-primary)" }}>
                        {tx.receiverAccount ? "+" : "-"}{formatAmount(tx.amount, tx.currency)}
                      </span>
                    </td>
                    <td><StatusBadge value={tx.status} /></td>
                    <td style={{ fontSize: 12, color: "var(--color-text-muted)", whiteSpace: "nowrap" }}>
                      {new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Mobile card view */}
        <div className="flex flex-col md:hidden" style={{ gap: 8 }}>
          {recentTxs.length === 0 ? (
            <div className="glass-card" style={{ padding: 32, textAlign: "center", color: "var(--color-text-muted)", fontSize: 14 }}>
              No transactions yet.
            </div>
          ) : recentTxs.map((tx) => (
            <div key={tx.id} style={{ background: "rgba(13,25,41,1)", borderRadius: 12, padding: 16, border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>
                    {TX_ICONS[tx.type] || "⇄"}
                  </div>
                  <span style={{ fontSize: 12, color: "var(--color-text-muted)", fontWeight: 600 }}>{getDisplayType(tx.id, tx.type)}</span>
                </div>
                <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontWeight: 700, fontSize: 14, color: tx.receiverAccount ? "var(--color-success)" : "var(--color-danger)" }}>
                  {tx.receiverAccount ? "+" : "-"}{formatAmount(tx.amount, tx.currency)}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tx.description || "—"}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 10, color: "var(--color-accent)", background: "rgba(0,212,255,0.06)", padding: "2px 6px", borderRadius: 4 }}>{tx.reference}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  <StatusBadge value={tx.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
