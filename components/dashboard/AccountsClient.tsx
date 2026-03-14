"use client";

import { useState } from "react";
import { CURRENCY_FLAGS, CURRENCY_NAMES, formatAmount, formatAccountNumber } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CopyButton } from "@/components/ui/CopyButton";
import Link from "next/link";

const CURRENCIES = ["USD", "EUR", "GBP", "SGD", "CAD", "AUD", "CHF", "JPY", "CNY", "AED"];
const MAX_ACCOUNTS = 5;

export default function AccountsClient({ user, accounts: initialAccounts }: {
  user: { firstName: string; lastName: string; email: string };
  accounts: any[];
}) {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [newCurrency, setNewCurrency] = useState("EUR");
  const [opening, setOpening] = useState(false);
  const [openError, setOpenError] = useState("");

  const usedCurrencies = accounts.map((a: any) => a.currency);
  const availableCurrencies = CURRENCIES.filter((c) => !usedCurrencies.includes(c));

  async function handleOpenAccount() {
    setOpening(true);
    setOpenError("");
    try {
      const res = await fetch("/api/accounts/open", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency: newCurrency }),
      });
      const data = await res.json();
      if (!res.ok) { setOpenError(data.error || "Failed to open account"); return; }
      setAccounts((prev) => [...prev, { ...data.account, virtualCards: [], sentTransactions: [], receivedTransactions: [] }]);
      setShowOpenModal(false);
      setNewCurrency(availableCurrencies.filter((c) => c !== newCurrency)[0] ?? "");
    } catch {
      setOpenError("Network error. Please try again.");
    } finally {
      setOpening(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-syne)", fontSize: 24, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 4 }}>Your Accounts</h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>
            {accounts.length} of {MAX_ACCOUNTS} accounts · {availableCurrencies.length} currencies available
          </p>
        </div>
        {accounts.length < MAX_ACCOUNTS && availableCurrencies.length > 0 && (
          <button
            onClick={() => { setOpenError(""); setNewCurrency(availableCurrencies[0]); setShowOpenModal(true); }}
            className="btn-nexus"
            style={{ padding: "9px 20px", fontSize: 13 }}
          >
            + Open New Account
          </button>
        )}
      </div>

      {/* Open Account Modal */}
      {showOpenModal && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 20,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowOpenModal(false); }}
        >
          <div className="glass-card animate-fade-slide-up modal-box" style={{ width: "100%", maxWidth: 480, padding: "32px 36px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontFamily: "var(--font-syne)", fontSize: 20, fontWeight: 700, color: "var(--color-text-primary)" }}>
                Open New Account
              </h3>
              <button onClick={() => setShowOpenModal(false)} style={{ background: "none", border: "none", color: "var(--color-text-muted)", cursor: "pointer", fontSize: 18 }}>✕</button>
            </div>

            <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginBottom: 20 }}>
              Select a currency for your new account. You can hold up to {MAX_ACCOUNTS} accounts.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: 8, marginBottom: 20 }}>
              {availableCurrencies.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNewCurrency(c)}
                  style={{
                    padding: "12px 8px", borderRadius: 10,
                    border: newCurrency === c ? "1.5px solid var(--color-accent)" : "1px solid rgba(255,255,255,0.08)",
                    background: newCurrency === c ? "rgba(0,212,255,0.08)" : "rgba(6,12,24,0.6)",
                    cursor: "pointer",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                    transition: "all 0.15s ease",
                    boxShadow: newCurrency === c ? "0 0 10px rgba(0,212,255,0.15)" : "none",
                  }}
                >
                  <span style={{ fontSize: 22 }}>{CURRENCY_FLAGS[c]}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: "0.04em",
                    color: newCurrency === c ? "var(--color-accent)" : "var(--color-text-muted)",
                  }}>
                    {c}
                  </span>
                </button>
              ))}
            </div>

            {newCurrency && (
              <div style={{
                padding: "12px 16px", borderRadius: 10,
                background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.1)",
                marginBottom: 20, fontSize: 13, color: "var(--color-text-muted)",
              }}>
                Opening a <strong style={{ color: "var(--color-accent)" }}>{CURRENCY_FLAGS[newCurrency]} {newCurrency} — {CURRENCY_NAMES[newCurrency]}</strong> account.
                Your account will be activated immediately with a zero balance.
              </div>
            )}

            {openError && (
              <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(255,59,92,0.06)", border: "1px solid rgba(255,59,92,0.2)", color: "var(--color-danger)", fontSize: 13, marginBottom: 16 }}>
                {openError}
              </div>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowOpenModal(false)} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
              <button
                onClick={handleOpenAccount}
                className="btn-nexus"
                style={{ flex: 1 }}
                disabled={opening || !newCurrency}
              >
                {opening ? "Opening…" : "Open Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {accounts.map((account: any) => {
          const recentTxs = [
            ...account.sentTransactions.map((t: any) => ({ ...t, dir: "out" })),
            ...account.receivedTransactions.map((t: any) => ({ ...t, dir: "in" })),
          ].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

          const wireDetails = [
            ["Bank Name", "Bank of Asia Online"],
            ["Account Name", `${user.firstName} ${user.lastName}`],
            ["Account Number", account.accountNumber],
            ["Formatted", formatAccountNumber(account.accountNumber)],
            ["Currency", account.currency],
            ["SWIFT/BIC", "BOASXXXXX"],
            ["Routing", "021000021"],
            ["IBAN", `GB${account.accountNumber}BOAS`],
          ];

          const allWireText = wireDetails.map(([l, v]) => `${l}: ${v}`).join("\n");

          return (
            <div key={account.id} className="glass-card" style={{ padding: "28px 32px" }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
                  }}>
                    {CURRENCY_FLAGS[account.currency] || "🌍"}
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-syne)", fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)" }}>
                      {CURRENCY_NAMES[account.currency]} Account
                    </div>
                    <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2 }}>
                      Opened {new Date(account.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </div>
                  </div>
                </div>
                <StatusBadge value={account.status} />
              </div>

              {/* Balance + account number */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16, marginBottom: 24 }}>
                <div style={{ padding: "18px 20px", borderRadius: 12, background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.1)" }}>
                  <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Available Balance</div>
                  <div className="amount-hero" style={{ color: "var(--color-text-primary)", fontSize: "clamp(18px, 4vw, 32px)", wordBreak: "break-word" }}>
                    {formatAmount(account.balance, account.currency)}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 4 }}>{account.currency}</div>
                </div>

                <div style={{ padding: "18px 20px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Account Number</div>
                  <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: 2 }}>
                    {formatAccountNumber(account.accountNumber)}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <CopyButton text={account.accountNumber} label="Copy" />
                  </div>
                </div>
              </div>

              {/* Wire receiving details */}
              <div style={{ marginBottom: 24, padding: "18px 20px", borderRadius: 12, background: "rgba(240,180,41,0.03)", border: "1px solid rgba(240,180,41,0.1)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-gold)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Receive Funds — Wire Details
                  </div>
                  <CopyButton text={allWireText} label="Copy All" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
                  {wireDetails.map(([label, val]) => (
                    <div key={label}>
                      <div style={{ fontSize: 10, color: "var(--color-text-muted)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 3 }}>{label}</div>
                      <div style={{
                        fontSize: 13, color: "var(--color-text-primary)",
                        fontFamily: ["Account Number", "Formatted", "Routing", "SWIFT/BIC", "IBAN"].includes(label) ? "var(--font-jetbrains-mono)" : "inherit",
                      }}>
                        {val}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Linked cards preview */}
              {account.virtualCards.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Linked Cards</div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {account.virtualCards.map((card: any) => (
                      <div key={card.id} style={{
                        padding: "8px 14px", borderRadius: 10,
                        background: card.status === "FROZEN" ? "rgba(100,180,255,0.06)" : "rgba(0,212,255,0.06)",
                        border: `1px solid ${card.status === "FROZEN" ? "rgba(100,180,255,0.2)" : "rgba(0,212,255,0.15)"}`,
                        display: "flex", alignItems: "center", gap: 8,
                      }}>
                        <span style={{ fontSize: 13 }}>{card.type === "VISA" ? "VISA" : "MC"}</span>
                        <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 12, color: "var(--color-text-muted)" }}>
                          ••••{card.cardNumber.slice(-4)}
                        </span>
                        <StatusBadge value={card.status} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent transactions */}
              {recentTxs.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Recent Activity</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {recentTxs.map((tx: any) => (
                      <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.02)" }}>
                        <div>
                          <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: "var(--color-accent)", marginRight: 10 }}>{tx.reference}</span>
                          <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{tx.description || tx.type}</span>
                        </div>
                        <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontWeight: 700, fontSize: 13, color: tx.dir === "in" ? "var(--color-success)" : "var(--color-text-primary)" }}>
                          {tx.dir === "in" ? "+" : "-"}{formatAmount(tx.amount, tx.currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <Link href="/dashboard/transfer" className="btn-nexus" style={{ textDecoration: "none", padding: "8px 20px", fontSize: 13 }}>↗ Transfer</Link>
                <Link href="/dashboard/cards" className="btn-ghost" style={{ textDecoration: "none", padding: "8px 20px", fontSize: 13 }}>▣ Cards</Link>
              </div>
            </div>
          );
        })}

        {accounts.length === 0 && (
          <div className="glass-card" style={{ padding: 48, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🏦</div>
            <div style={{ fontFamily: "var(--font-syne)", fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 8 }}>No accounts yet</div>
            <div style={{ color: "var(--color-text-muted)", fontSize: 14, marginBottom: 20 }}>Open your first account to get started.</div>
            <button onClick={() => setShowOpenModal(true)} className="btn-nexus" style={{ padding: "10px 28px" }}>
              + Open Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
