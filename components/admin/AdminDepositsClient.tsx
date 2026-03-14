"use client";

import { useState, useEffect } from "react";
import { CURRENCY_FLAGS, formatAmount } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import Select from "@/components/ui/Select";

const DEBIT_DESC_PRESETS = [
  "Administrative fee — Account maintenance charge",
  "Overdraft recovery — Authorized debit per agreement",
  "Compliance-mandated debit — Regulatory directive",
  "Chargeback debit — Disputed transaction reversal",
  "Balance correction — Error rectification debit",
];

const G = "#F0B429";

const DESC_PRESETS = [
  "Regulatory compliance settlement — Ref: BOA-COMP-AUTO",
  "Client onboarding bonus — Approved by compliance",
  "Account restoration following dispute resolution",
  "Wire receipt — International correspondent transfer",
  "Dividend payment — Portfolio ref: BOA-DIV-AUTO",
  "Promotional credit — Marketing campaign activation",
];

type Account = { id: string; accountNumber: string; currency: string; balance: number; status: string };
type UserResult = { id: string; firstName: string; lastName: string; email: string; accounts: Account[] };

export default function AdminDepositsClient() {
  const [userSearch, setUserSearch] = useState("");
  const [users, setUsers] = useState<UserResult[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserResult | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [opType, setOpType] = useState<'CREDIT' | 'DEBIT'>('CREDIT');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [recentDeposits, setRecentDeposits] = useState<any[]>([]);
  const [successRef, setSuccessRef] = useState("");

  useEffect(() => {
    if (userSearch.length < 2) { setUsers([]); return; }
    const t = setTimeout(async () => {
      const res = await fetch(`/api/admin/users?search=${encodeURIComponent(userSearch)}&limit=10`);
      const data = await res.json();
      setUsers(data.users ?? []);
    }, 300);
    return () => clearTimeout(t);
  }, [userSearch]);

  useEffect(() => {
    fetch("/api/admin/deposits").then((r) => r.json()).then((d) => setRecentDeposits(d.deposits ?? []));
  }, [successRef]);

  async function handleDeposit() {
    if (!selectedAccount || !amount || !description) return;
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/admin/deposits", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetAccountId: selectedAccount.id, amount: parseFloat(amount), description, internalNotes, type: opType }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Deposit failed"); return; }
      setSuccessRef(data.transaction.reference);
      setAmount(""); setDescription(""); setInternalNotes("");
      setConfirmOpen(false);
    } finally { setSubmitting(false); }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1 style={{ fontFamily: "var(--font-syne)", fontSize: 24, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 4 }}>
          Admin Deposits &amp; Debits
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>Credit or debit funds directly on any user account</p>
      </div>

      {successRef && (
        <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.25)", color: "var(--color-success)", fontSize: 13 }}>
          ✓ {opType === 'DEBIT' ? 'Debit' : 'Deposit'} successful — Reference: <strong style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{successRef}</strong>
        </div>
      )}

      <div className="admin-deposits-grid">
        {/* LEFT: User/account selector */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "rgba(6,12,24,0.7)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "22px 20px" }}>
            <h3 style={{ fontFamily: "var(--font-syne)", fontSize: 15, fontWeight: 700, color: G, marginBottom: 14 }}>1. Select User</h3>
            <input
              className="input-nexus"
              placeholder="Search by name or email…"
              value={userSearch}
              onChange={(e) => { setUserSearch(e.target.value); setSelectedUser(null); setSelectedAccount(null); }}
            />
            {users.length > 0 && !selectedUser && (
              <div style={{ marginTop: 8, background: "rgba(3,5,10,0.9)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, overflow: "hidden", maxHeight: 240, overflowY: "auto" }}>
                {users.map((u) => (
                  <button key={u.id} onClick={() => { setSelectedUser(u); setUserSearch(`${u.firstName} ${u.lastName}`); setUsers([]); }}
                    style={{ width: "100%", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }}>{u.firstName} {u.lastName}</div>
                    <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{u.email} · {u.accounts.length} account{u.accounts.length !== 1 ? "s" : ""}</div>
                  </button>
                ))}
              </div>
            )}

            {selectedUser && (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 11, color: G, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 10 }}>SELECT ACCOUNT</div>
                {selectedUser.accounts.map((a) => (
                  <button key={a.id} onClick={() => setSelectedAccount(a)} style={{
                    width: "100%", padding: "12px 14px", borderRadius: 10, cursor: "pointer", textAlign: "left", marginBottom: 8,
                    background: selectedAccount?.id === a.id ? "rgba(240,180,41,0.08)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${selectedAccount?.id === a.id ? "rgba(240,180,41,0.3)" : "rgba(255,255,255,0.06)"}`,
                    transition: "all 0.15s ease",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 18 }}>{CURRENCY_FLAGS[a.currency]}</span>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-primary)" }}>{a.currency} Account</div>
                          <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 10, color: "var(--color-text-muted)" }}>{a.accountNumber}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 14, color: selectedAccount?.id === a.id ? G : "var(--color-text-primary)" }}>
                          {formatAmount(a.balance, a.currency)}
                        </div>
                        <StatusBadge value={a.status} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Deposit/Debit form */}
        <div style={{ background: "rgba(6,12,24,0.7)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "22px 20px" }}>
          <h3 style={{ fontFamily: "var(--font-syne)", fontSize: 15, fontWeight: 700, color: G, marginBottom: 14 }}>2. Operation Details</h3>

          {/* Type Toggle */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {(['CREDIT', 'DEBIT'] as const).map(t => (
              <button key={t} onClick={() => setOpType(t)} style={{
                flex: 1, padding: '9px 14px', borderRadius: 10, border: `1px solid ${opType === t ? (t === 'CREDIT' ? 'rgba(0,229,160,0.4)' : 'rgba(255,59,92,0.4)') : 'rgba(255,255,255,0.08)'}`,
                background: opType === t ? (t === 'CREDIT' ? 'rgba(0,229,160,0.1)' : 'rgba(255,59,92,0.1)') : 'transparent',
                color: opType === t ? (t === 'CREDIT' ? '#00E5A0' : '#FF3B5C') : 'var(--color-text-muted)',
                fontWeight: 700, fontSize: 12, cursor: 'pointer', letterSpacing: '0.06em',
                transition: 'all 0.15s ease',
              }}>
                {t === 'CREDIT' ? '⊕ CREDIT — Add Funds' : '⊖ DEBIT — Withdraw Funds'}
              </button>
            ))}
          </div>

          {!selectedAccount ? (
            <div style={{ padding: "32px 20px", textAlign: "center", color: "var(--color-text-muted)", fontSize: 13 }}>
              Select a user and account first
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {opType === 'DEBIT' && (
                <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(255,59,92,0.08)", border: "1px solid rgba(255,59,92,0.25)", color: "#FF3B5C", fontSize: 12, fontWeight: 600 }}>
                  ⚠ This will REDUCE the user balance. Ensure sufficient funds before proceeding.
                </div>
              )}

              <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(240,180,41,0.06)", border: "1px solid rgba(240,180,41,0.15)", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: G }}>Target Account</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text-primary)", fontFamily: "var(--font-jetbrains-mono)" }}>
                  {CURRENCY_FLAGS[selectedAccount.currency]} {selectedAccount.currency} ••••{selectedAccount.accountNumber.slice(-4)}
                </span>
              </div>

              {/* Amount */}
              <div>
                <label style={labelStyle}>Amount ({selectedAccount.currency})</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text" inputMode="decimal" className="input-nexus"
                    placeholder="0.00" value={amount}
                    onClick={(e) => { if ((e.target as HTMLInputElement).value === "0.00" || (e.target as HTMLInputElement).value === "0") setAmount(""); }}
                    onKeyPress={(e) => { if (!/[\d.]/.test(e.key)) e.preventDefault(); }}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9.]/g, "");
                      const parts = val.split(".");
                      if (parts.length > 2) return;
                      setAmount(val);
                    }}
                    style={{
                      fontFamily: "var(--font-syne)", fontSize: 28, fontWeight: 800, paddingRight: 70, height: 64,
                      ...(opType === 'DEBIT' ? { borderColor: 'rgba(255,59,92,0.4)' } : {}),
                    }}
                  />
                  <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 14, fontWeight: 700, color: opType === 'DEBIT' ? '#FF3B5C' : G }}>
                    {selectedAccount.currency}
                  </span>
                </div>
              </div>

              {/* Description presets */}
              <div>
                <label style={labelStyle}>Description</label>
                <div style={{ marginBottom: 8 }}>
                  <Select
                    value=""
                    onChange={(v) => { if (v) setDescription(v); }}
                    options={[
                      ...(opType === 'DEBIT' ? DEBIT_DESC_PRESETS : DESC_PRESETS).map((p) => ({
                        value: p,
                        label: p.slice(0, 70) + (p.length > 70 ? "…" : ""),
                      })),
                    ]}
                    placeholder="— Select preset description —"
                  />
                </div>
                <textarea
                  className="input-nexus" rows={3} minLength={10} maxLength={300}
                  placeholder={`Enter ${opType === 'DEBIT' ? 'debit' : 'deposit'} description (min 10 characters)`}
                  value={description} onChange={(e) => setDescription(e.target.value)}
                  style={{ resize: "vertical", fontSize: 13 }}
                />
                <div style={{ fontSize: 10, color: "var(--color-text-muted)", textAlign: "right", marginTop: 2 }}>{description.length}/300</div>
              </div>

              {/* Internal notes */}
              <div>
                <label style={labelStyle}>Internal Notes (admin only)</label>
                <textarea
                  className="input-nexus" rows={2}
                  placeholder="Not visible to user"
                  value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)}
                  style={{ resize: "vertical", fontSize: 12 }}
                />
              </div>

              {error && <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(255,59,92,0.08)", border: "1px solid rgba(255,59,92,0.2)", color: "var(--color-danger)", fontSize: 13 }}>{error}</div>}

              <button
                onClick={() => setConfirmOpen(true)}
                disabled={!amount || !description || description.length < 10 || parseFloat(amount) <= 0 || submitting}
                style={{
                  padding: "13px", borderRadius: 12, border: "none", cursor: "pointer",
                  background: opType === 'DEBIT'
                    ? "linear-gradient(135deg, #FF3B5C, #cc2040)"
                    : `linear-gradient(135deg, ${G}, #d4991f)`,
                  color: opType === 'DEBIT' ? "#fff" : "#03050a",
                  fontWeight: 800, fontSize: 15,
                  opacity: (!amount || !description || description.length < 10) ? 0.4 : 1,
                }}
              >
                {opType === 'DEBIT' ? '⊖ Process Debit' : '⊕ Process Deposit'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent deposits and debits */}
      <div>
        <h2 style={{ fontFamily: "var(--font-syne)", fontSize: 16, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 14 }}>Recent Admin Operations</h2>

        {/* Desktop table */}
        <div className="admin-table-card hidden md:block" style={{ background: "rgba(6,12,24,0.7)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, overflow: "hidden" }}>
          {recentDeposits.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: "var(--color-text-muted)", fontSize: 13 }}>No operations yet</div>
          ) : (
            <table className="nexus-table" style={{ width: "100%" }}>
              <thead><tr><th>Reference</th><th>Type</th><th>User</th><th>Account</th><th>Amount</th><th>Description</th><th>Date</th></tr></thead>
              <tbody>
                {recentDeposits.map((d: any) => {
                  const isDebit = d.type === "ADMIN_DEBIT";
                  const account = isDebit ? d.senderAccount : d.receiverAccount;
                  const user = account?.user;
                  return (
                    <tr key={d.id}>
                      <td><span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: "var(--color-accent)", background: "rgba(0,212,255,0.06)", padding: "2px 7px", borderRadius: 4 }}>{d.reference}</span></td>
                      <td>
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, letterSpacing: "0.05em",
                          background: isDebit ? "rgba(255,59,92,0.1)" : "rgba(0,229,160,0.1)",
                          color: isDebit ? "#FF3B5C" : "var(--color-success)",
                          border: `1px solid ${isDebit ? "rgba(255,59,92,0.25)" : "rgba(0,229,160,0.25)"}`,
                        }}>
                          {isDebit ? "DEBIT" : "CREDIT"}
                        </span>
                      </td>
                      <td style={{ fontSize: 12 }}>{user ? `${user.firstName} ${user.lastName}` : "—"}</td>
                      <td style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: "var(--color-text-muted)" }}>
                        {account ? `${account.currency} ••••${account.accountNumber?.slice(-4)}` : "—"}
                      </td>
                      <td style={{ fontFamily: "var(--font-syne)", fontWeight: 700, color: isDebit ? "#FF3B5C" : "var(--color-success)" }}>
                        {isDebit ? "-" : "+"}{formatAmount(d.amount, d.currency)}
                      </td>
                      <td style={{ fontSize: 12, color: "var(--color-text-muted)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.description}</td>
                      <td style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{new Date(d.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile cards */}
        <div className="flex flex-col md:hidden" style={{ gap: 8 }}>
          {recentDeposits.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: "var(--color-text-muted)", fontSize: 13 }}>No operations yet</div>
          ) : recentDeposits.map((d: any) => {
            const isDebit = d.type === "ADMIN_DEBIT";
            const account = isDebit ? d.senderAccount : d.receiverAccount;
            const user = account?.user;
            return (
              <div key={d.id} style={{ background: "rgba(13,25,41,1)", borderRadius: 12, padding: 16, border: "1px solid rgba(255,255,255,0.05)" }}>
                {/* Top row: user + amount */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, letterSpacing: "0.05em",
                      background: isDebit ? "rgba(255,59,92,0.1)" : "rgba(0,229,160,0.1)",
                      color: isDebit ? "#FF3B5C" : "var(--color-success)",
                      border: `1px solid ${isDebit ? "rgba(255,59,92,0.25)" : "rgba(0,229,160,0.25)"}`,
                    }}>
                      {isDebit ? "DEBIT" : "CREDIT"}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }}>
                      {user ? `${user.firstName} ${user.lastName}` : "—"}
                    </span>
                  </div>
                  <span style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 14, color: isDebit ? "#FF3B5C" : "var(--color-success)" }}>
                    {isDebit ? "-" : "+"}{formatAmount(d.amount, d.currency)}
                  </span>
                </div>
                {/* Description */}
                <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {d.description}
                </div>
                {/* Bottom row: reference + date */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 10, color: "var(--color-accent)", background: "rgba(0,212,255,0.06)", padding: "2px 6px", borderRadius: 4 }}>
                    {d.reference}
                  </span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
                    {new Date(d.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirm modal */}
      {confirmOpen && selectedAccount && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            background: "#0d1a30",
            border: `1px solid ${opType === 'DEBIT' ? 'rgba(255,59,92,0.25)' : 'rgba(240,180,41,0.2)'}`,
            borderRadius: 16, padding: "32px 28px", maxWidth: 420, width: "90%",
            boxShadow: opType === 'DEBIT' ? '0 0 60px rgba(255,59,92,0.08)' : `0 0 60px rgba(240,180,41,0.1)`,
          }}>
            <h3 style={{ fontFamily: "var(--font-syne)", fontSize: 20, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 8 }}>
              {opType === 'DEBIT' ? 'Confirm Debit' : 'Confirm Deposit'}
            </h3>
            <p style={{ color: "var(--color-text-muted)", fontSize: 13, marginBottom: 20 }}>
              {opType === 'DEBIT'
                ? 'This action will REDUCE the account balance immediately and cannot be undone.'
                : 'This action will credit the account immediately and cannot be undone.'}
            </p>
            {opType === 'DEBIT' && (
              <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(255,59,92,0.08)", border: "1px solid rgba(255,59,92,0.25)", color: "#FF3B5C", fontSize: 12, fontWeight: 600, marginBottom: 16 }}>
                ⚠ Administrative Debit — funds will be removed from user account
              </div>
            )}
            <div style={{ padding: "16px 18px", borderRadius: 12, background: "rgba(0,0,0,0.3)", marginBottom: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["Operation", opType],
                ["Account", `${CURRENCY_FLAGS[selectedAccount.currency]} ${selectedAccount.currency} ••••${selectedAccount.accountNumber.slice(-4)}`],
                ["Amount", `${opType === 'DEBIT' ? '-' : '+'}${formatAmount(parseFloat(amount), selectedAccount.currency)}`],
                ["Description", description],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{l}</span>
                  <span style={{
                    fontSize: 12, fontWeight: 700, maxWidth: 220, textAlign: "right",
                    color: l === "Amount"
                      ? (opType === 'DEBIT' ? '#FF3B5C' : 'var(--color-success)')
                      : l === "Operation"
                        ? (opType === 'DEBIT' ? '#FF3B5C' : '#00E5A0')
                        : "var(--color-text-primary)",
                  }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmOpen(false)} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
              <button onClick={handleDeposit} disabled={submitting} style={{
                flex: 1, padding: "12px", borderRadius: 10, border: "none", cursor: "pointer",
                background: opType === 'DEBIT'
                  ? "linear-gradient(135deg, #FF3B5C, #cc2040)"
                  : `linear-gradient(135deg, ${G}, #d4991f)`,
                color: opType === 'DEBIT' ? "#fff" : "#03050a",
                fontWeight: 800, fontSize: 14,
              }}>
                {submitting ? "Processing…" : opType === 'DEBIT' ? "Confirm Debit" : "Confirm Deposit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 11, fontWeight: 600,
  color: "var(--color-text-muted)", marginBottom: 7,
  letterSpacing: "0.06em", textTransform: "uppercase",
};
