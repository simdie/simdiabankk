"use client";

import { useState, useMemo } from "react";
import { CURRENCY_FLAGS, formatAmount, formatAccountNumber } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import DatePicker from "@/components/ui/DatePicker";
import Select from "@/components/ui/Select";

interface Account { id: string; accountNumber: string; currency: string; balance: number; status: string }
interface Transaction {
  id: string; reference: string; type: string; status: string;
  amount: number; currency: string; description: string | null;
  createdAt: Date | string; updatedAt: Date | string | null;
  emailConfirmedAt?: Date | string | null;
  senderAccount: { accountNumber: string; currency: string; user: { firstName: string; lastName: string } } | null;
  receiverAccount: { accountNumber: string; currency: string; user: { firstName: string; lastName: string } } | null;
  externalDetails: Record<string, string> | null;
}

const RANGES = [
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "3_months", label: "Last 3 Months" },
  { value: "6_months", label: "Last 6 Months" },
  { value: "1_year", label: "Last Year" },
  { value: "custom_range", label: "Custom Range" },
];

const TX_ICONS: Record<string, string> = {
  INTERNAL: "⇄", LOCAL_WIRE: "🏛", INTERNATIONAL_WIRE: "✈", ADMIN_DEPOSIT: "⊕",
};

function getDepositLabel(txId: string): string {
  const labels = ["DEPOSIT", "INSTANT DEPOSIT", "WIRE RECEIPT", "CREDIT TRANSFER"];
  const hash = txId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return labels[hash % labels.length];
}

function getDisplayType(tx: Transaction): string {
  if (tx.type === "ADMIN_DEPOSIT") return getDepositLabel(tx.id);
  return tx.type.replace(/_/g, " ");
}

function getDateRange(rangeVal: string): { from: Date; to: Date } {
  const now = new Date();
  const to = new Date(now);
  let from = new Date(now);
  switch (rangeVal) {
    case "this_month": from = new Date(now.getFullYear(), now.getMonth(), 1); break;
    case "last_month":
      from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      to.setDate(0);
      break;
    case "3_months": from.setMonth(from.getMonth() - 3); break;
    case "6_months": from.setMonth(from.getMonth() - 6); break;
    case "1_year": from.setFullYear(from.getFullYear() - 1); break;
  }
  return { from, to };
}

async function downloadBlob(url: string, filename: string, method = "GET", body?: object) {
  const res = await fetch(url, {
    method,
    ...(body ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) throw new Error("Download failed");
  const blob = await res.blob();
  const objUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(objUrl);
}

export default function StatementsClient({
  accounts, transactions, userId,
}: {
  accounts: Account[];
  transactions: Transaction[];
  userId: string;
}) {
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.id || "");
  const [range, setRange] = useState("this_month");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadingTx, setDownloadingTx] = useState<string | null>(null);

  const { from, to } = useMemo(() => {
    if (range === "custom_range" && customFrom && customTo) {
      return {
        from: new Date(customFrom),
        to: new Date(customTo + "T23:59:59"),
      };
    }
    return getDateRange(range);
  }, [range, customFrom, customTo]);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const acct = accounts.find(a => a.id === selectedAccount);
      const isSender = t.senderAccount?.accountNumber === acct?.accountNumber;
      const isReceiver = t.receiverAccount?.accountNumber === acct?.accountNumber;
      if (selectedAccount && !isSender && !isReceiver) return false;
      const date = new Date(t.createdAt);
      if (date < from || date > to) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          t.reference.toLowerCase().includes(q) ||
          (t.description || "").toLowerCase().includes(q) ||
          t.type.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [transactions, selectedAccount, from, to, search, accounts]);

  const account = accounts.find(a => a.id === selectedAccount);
  const totalCredits = filtered.filter(t => t.receiverAccount).reduce((s, t) => s + t.amount, 0);
  const totalDebits = filtered.filter(t => t.senderAccount).reduce((s, t) => s + t.amount, 0);

  async function handleExportStatement() {
    if (filtered.length === 0) return;
    setDownloading(true);
    try {
      await downloadBlob(
        "/api/statements/export",
        `statement-${account?.currency || "USD"}-${range}.pdf`,
        "POST",
        { accountId: selectedAccount, from: from.toISOString(), to: to.toISOString() }
      );
    } catch {
      alert("Statement export temporarily unavailable. Please use individual PDF receipts.");
    } finally {
      setDownloading(false);
    }
  }

  async function handleDownloadReceipt(tx: Transaction, e: React.MouseEvent) {
    e.stopPropagation();
    setDownloadingTx(tx.id);
    try {
      await downloadBlob(
        `/api/transactions/receipt?id=${tx.id}`,
        `receipt-${tx.reference}.pdf`
      );
    } catch {
      alert("Failed to download receipt.");
    } finally {
      setDownloadingTx(null);
    }
  }

  const accountOptions = accounts.map(a => ({
    value: a.id,
    label: `${a.currency} — ${formatAccountNumber(a.accountNumber)}`,
    flag: CURRENCY_FLAGS[a.currency],
  }));

  const thStyle: React.CSSProperties = {
    padding: "10px 14px", fontSize: 11, fontWeight: 700,
    color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em",
    textTransform: "uppercase", textAlign: "left",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    background: "rgba(255,255,255,0.02)",
  };
  const tdStyle: React.CSSProperties = {
    padding: "12px 14px", fontSize: 13, color: "#f0f4ff",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#f0f4ff", marginBottom: 4 }}>Account Statements</h1>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 14 }}>View and download your transaction history.</p>
      </div>

      {/* Filters */}
      <div className="statement-form-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, alignItems: "end" }}>
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Account
          </label>
          <Select options={accountOptions} value={selectedAccount} onChange={setSelectedAccount} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Date Range
          </label>
          <Select options={RANGES} value={range} onChange={setRange} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Search
          </label>
          <input placeholder="Reference, description…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", borderRadius: 10, background: "rgba(6,12,24,0.7)", border: "1px solid rgba(255,255,255,0.08)", color: "#f0f4ff", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <button
            onClick={handleExportStatement}
            disabled={downloading || filtered.length === 0}
            style={{
              width: "100%", padding: "10px 14px", borderRadius: 10,
              background: "linear-gradient(135deg, rgba(0,212,255,0.12), rgba(0,100,180,0.08))",
              border: "1px solid rgba(0,212,255,0.2)", color: "#00D4FF",
              fontWeight: 600, fontSize: 13, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              opacity: filtered.length === 0 ? 0.5 : 1,
            }}>
            {downloading ? (
              <>
                <span style={{ width: 14, height: 14, border: "2px solid rgba(0,212,255,0.3)", borderTopColor: "#00D4FF", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                Generating…
              </>
            ) : "↓ Export Statement"}
          </button>
        </div>
      </div>

      {/* Custom date range pickers */}
      {range === "custom_range" && (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", padding: "16px 20px", borderRadius: 12, background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.12)" }}>
          <div style={{ flex: 1, minWidth: 160 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>From</label>
            <DatePicker value={customFrom} onChange={setCustomFrom} placeholder="Start date" />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>To</label>
            <DatePicker value={customTo} onChange={setCustomTo} placeholder="End date" />
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="stats-grid-3">
        {[
          { label: "Total Credits", value: formatAmount(totalCredits, account?.currency || "USD"), color: "#00E5A0" },
          { label: "Total Debits", value: formatAmount(totalDebits, account?.currency || "USD"), color: "#FF3B5C" },
          { label: "Transactions", value: filtered.length.toString(), color: "#00D4FF" },
        ].map(s => (
          <div key={s.label} style={{ padding: "16px 20px", borderRadius: 12, background: "rgba(13,26,48,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 6, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Transaction table — desktop */}
      <div className="hidden md:block" style={{ background: "rgba(13,26,48,0.6)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>
            No transactions found for this period.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Date", "Description", "Reference", "Type", "Debit", "Credit", "Status", ""].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx) => {
                  const isCredit = !!tx.receiverAccount;
                  return (
                    <tr key={tx.id} onClick={() => setSelectedTx(tx)}
                      style={{ cursor: "pointer", transition: "background 0.1s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <td style={{ ...tdStyle, whiteSpace: "nowrap", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                        {new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td style={{ ...tdStyle, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {tx.description || getDisplayType(tx)}
                      </td>
                      <td style={{ ...tdStyle }}>
                        <span style={{ fontFamily: "var(--font-jetbrains-mono, monospace)", fontSize: 11, color: "#00D4FF", background: "rgba(0,212,255,0.06)", padding: "2px 6px", borderRadius: 4 }}>
                          {tx.reference}
                        </span>
                      </td>
                      <td style={{ ...tdStyle }}>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                          {TX_ICONS[tx.type]} {getDisplayType(tx)}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, color: "#FF3B5C", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
                        {!isCredit ? formatAmount(tx.amount, tx.currency) : "—"}
                      </td>
                      <td style={{ ...tdStyle, color: "#00E5A0", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
                        {isCredit ? formatAmount(tx.amount, tx.currency) : "—"}
                      </td>
                      <td style={tdStyle}><StatusBadge value={tx.status} /></td>
                      <td style={tdStyle}>
                        <button
                          onClick={(e) => handleDownloadReceipt(tx, e)}
                          disabled={downloadingTx === tx.id}
                          style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", cursor: "pointer", padding: "4px 8px", borderRadius: 6, background: "rgba(255,255,255,0.04)", border: "none", minWidth: 36 }}
                        >
                          {downloadingTx === tx.id ? "…" : "PDF"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction cards — mobile */}
      <div className="flex flex-col md:hidden" style={{ gap: 8 }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>
            No transactions found for this period.
          </div>
        ) : filtered.map((tx) => {
          const isCredit = !!tx.receiverAccount;
          return (
            <div key={tx.id} onClick={() => setSelectedTx(tx)}
              style={{ background: "rgba(13,25,41,1)", borderRadius: 12, padding: 16, border: "1px solid rgba(255,255,255,0.05)", cursor: "pointer" }}>
              {/* Top row: date + amount */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                  {new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
                <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontWeight: 700, fontSize: 14, color: isCredit ? "#00E5A0" : "#FF3B5C" }}>
                  {isCredit ? "+" : "-"}{formatAmount(tx.amount, tx.currency)}
                </span>
              </div>
              {/* Description */}
              <div style={{ fontSize: 13, color: "#f0f4ff", marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {tx.description || getDisplayType(tx)}
              </div>
              {/* Bottom row: reference + status */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-jetbrains-mono, monospace)", fontSize: 10, color: "#00D4FF", background: "rgba(0,212,255,0.06)", padding: "2px 6px", borderRadius: 4 }}>
                  {tx.reference}
                </span>
                <StatusBadge value={tx.status} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Transaction detail modal */}
      {selectedTx && (
        <div onClick={() => setSelectedTx(null)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)",
          zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
          padding: 20, backdropFilter: "blur(4px)",
        }}>
          <div onClick={e => e.stopPropagation()} className="modal-box" style={{
            background: "#0d1a30", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20, padding: "32px", maxWidth: 600, width: "100%",
            maxHeight: "90vh", overflowY: "auto",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f0f4ff" }}>Transaction Details</h3>
              <button onClick={() => setSelectedTx(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", fontSize: 20 }}>✕</button>
            </div>

            <div className="modal-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { label: "Reference", value: selectedTx.reference, mono: true },
                { label: "Type", value: `${TX_ICONS[selectedTx.type]} ${getDisplayType(selectedTx)}` },
                { label: "Amount", value: formatAmount(selectedTx.amount, selectedTx.currency), bold: true },
                { label: "Status", value: selectedTx.status },
                { label: "Date", value: new Date(selectedTx.createdAt).toLocaleString() },
                { label: "Currency", value: `${CURRENCY_FLAGS[selectedTx.currency]} ${selectedTx.currency}` },
              ].map(({ label, value, mono, bold }) => (
                <div key={label}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 14, color: "#f0f4ff", fontWeight: bold ? 700 : 400, fontFamily: mono ? "monospace" : "inherit" }}>{value}</div>
                </div>
              ))}
            </div>

            {selectedTx.senderAccount && (
              <div style={{ marginTop: 20, padding: "16px", borderRadius: 12, background: "rgba(255,59,92,0.05)", border: "1px solid rgba(255,59,92,0.12)" }}>
                <div style={{ fontSize: 11, color: "#FF3B5C", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 8 }}>SENDER</div>
                <div style={{ fontSize: 13, color: "#f0f4ff" }}>
                  {selectedTx.senderAccount.user.firstName} {selectedTx.senderAccount.user.lastName}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>
                  {formatAccountNumber(selectedTx.senderAccount.accountNumber)}
                </div>
              </div>
            )}

            {selectedTx.receiverAccount && (
              <div style={{ marginTop: 12, padding: "16px", borderRadius: 12, background: "rgba(0,229,160,0.05)", border: "1px solid rgba(0,229,160,0.12)" }}>
                <div style={{ fontSize: 11, color: "#00E5A0", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 8 }}>RECEIVER</div>
                <div style={{ fontSize: 13, color: "#f0f4ff" }}>
                  {selectedTx.receiverAccount.user.firstName} {selectedTx.receiverAccount.user.lastName}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>
                  {formatAccountNumber(selectedTx.receiverAccount.accountNumber)}
                </div>
              </div>
            )}

            {selectedTx.externalDetails && Object.keys(selectedTx.externalDetails).length > 0 && (
              <div style={{ marginTop: 12, padding: "16px", borderRadius: 12, background: "rgba(240,180,41,0.05)", border: "1px solid rgba(240,180,41,0.12)" }}>
                <div style={{ fontSize: 11, color: "#F0B429", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 8 }}>WIRE DETAILS</div>
                {Object.entries(selectedTx.externalDetails).map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.03)", fontSize: 12 }}>
                    <span style={{ color: "rgba(255,255,255,0.4)", textTransform: "capitalize" }}>{k.replace(/_/g, " ")}</span>
                    <span style={{ color: "#f0f4ff" }}>{v}</span>
                  </div>
                ))}
              </div>
            )}

            {selectedTx.description && (
              <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 10, background: "rgba(255,255,255,0.03)" }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 4, fontWeight: 600, letterSpacing: "0.06em" }}>DESCRIPTION</div>
                <div style={{ fontSize: 13, color: "#f0f4ff" }}>{selectedTx.description}</div>
              </div>
            )}

            <div style={{ marginTop: 24, display: "flex", gap: 10 }}>
              <button
                onClick={(e) => handleDownloadReceipt(selectedTx, e)}
                disabled={downloadingTx === selectedTx.id}
                style={{ flex: 1, padding: "11px", borderRadius: 10, textAlign: "center",
                  background: "linear-gradient(135deg, #00D4FF, #0088CC)",
                  color: "#03050a", fontWeight: 700, fontSize: 13, cursor: "pointer", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                {downloadingTx === selectedTx.id ? "Generating…" : "↓ Download Receipt PDF"}
              </button>
              <button onClick={() => setSelectedTx(null)} style={{
                padding: "11px 20px", borderRadius: 10, background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)",
                cursor: "pointer", fontSize: 13, fontWeight: 500,
              }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
