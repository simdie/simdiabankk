"use client";

import { useState, useMemo } from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import Select from "@/components/ui/Select";
import { formatAmount } from "@/lib/utils";

interface Tx {
  id: string; reference: string; type: string; status: string;
  amount: number; currency: string; description: string | null;
  createdAt: Date; updatedAt: Date;
  senderAccount: { accountNumber: string; currency: string; userId: string } | null;
  receiverAccount: { accountNumber: string; currency: string; userId: string } | null;
  externalDetails: Record<string, string> | null;
}

const TX_ICONS: Record<string, string> = {
  INTERNAL: "⇄", LOCAL_WIRE: "🏛", INTERNATIONAL_WIRE: "✈", ADMIN_DEPOSIT: "⊕",
};

// ADMIN_DEPOSIT display name — deterministic from tx.id (item 16)
function getDepositLabel(txId: string): string {
  const labels = ["DEPOSIT", "INSTANT DEPOSIT", "WIRE RECEIPT", "CREDIT TRANSFER"];
  const hash = txId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return labels[hash % labels.length];
}

function getDisplayType(tx: Tx): string {
  if (tx.type === "ADMIN_DEPOSIT") return getDepositLabel(tx.id);
  return tx.type.replace(/_/g, " ");
}

const TYPE_OPTIONS = [
  { value: "ALL", label: "All Types" },
  { value: "INTERNAL", label: "Internal" },
  { value: "LOCAL_WIRE", label: "Local Wire" },
  { value: "INTERNATIONAL_WIRE", label: "International Wire" },
  { value: "ADMIN_DEPOSIT", label: "Admin Deposit" },
];

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Statuses" },
  { value: "COMPLETED", label: "Completed" },
  { value: "PENDING", label: "Pending" },
  { value: "AWAITING_CONFIRMATION", label: "Awaiting Confirmation" },
  { value: "FAILED", label: "Failed" },
];

const TIMELINE_STEPS: Record<string, { steps: string[]; active: number }> = {
  PENDING: { steps: ["Initiated", "Processing", "Completed"], active: 1 },
  AWAITING_CONFIRMATION: { steps: ["Initiated", "Awaiting Confirmation", "Processing", "Completed"], active: 1 },
  COMPLETED: { steps: ["Initiated", "Processing", "Completed"], active: 2 },
  FAILED: { steps: ["Initiated", "Processing", "Failed"], active: 2 },
};

function TransactionTimeline({ status }: { status: string }) {
  const timeline = TIMELINE_STEPS[status] || TIMELINE_STEPS.COMPLETED;
  const colors: Record<string, string> = { COMPLETED: "var(--color-success)", FAILED: "var(--color-danger)", PENDING: "var(--color-gold)", AWAITING_CONFIRMATION: "var(--color-gold)" };
  const activeColor = colors[status] || "var(--color-accent)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginTop: 4 }}>
      {timeline.steps.map((step, i) => {
        const isDone = i < timeline.active;
        const isActive = i === timeline.active;
        const isFail = status === "FAILED" && i === timeline.steps.length - 1;
        const dotColor = isFail ? "var(--color-danger)" : isDone || isActive ? activeColor : "rgba(255,255,255,0.1)";
        return (
          <div key={step} style={{ display: "flex", alignItems: "center", flex: i < timeline.steps.length - 1 ? 1 : 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: dotColor, boxShadow: (isDone || isActive) ? `0 0 8px ${dotColor}` : "none", flexShrink: 0 }} />
              <div style={{ fontSize: 9, color: isActive ? "var(--color-text-primary)" : "var(--color-text-muted)", fontWeight: isActive ? 700 : 400, whiteSpace: "nowrap", textAlign: "center" }}>{step}</div>
            </div>
            {i < timeline.steps.length - 1 && (
              <div style={{ flex: 1, height: 1, background: isDone ? dotColor : "rgba(255,255,255,0.08)", margin: "0 4px", marginBottom: 18, minWidth: 20 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function TransactionsClient({ transactions, userId }: { transactions: Tx[]; userId: string }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [emailLoading, setEmailLoading] = useState<string | null>(null);
  const pageSize = 20;

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch = !search || t.reference.toLowerCase().includes(search.toLowerCase()) || (t.description ?? "").toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "ALL" || t.type === typeFilter;
      const matchStatus = statusFilter === "ALL" || t.status === statusFilter;
      return matchSearch && matchType && matchStatus;
    });
  }, [transactions, search, typeFilter, statusFilter]);

  const totalIn = useMemo(() => filtered.filter(t => t.receiverAccount?.userId === userId && t.status === "COMPLETED").reduce((s, t) => s + t.amount, 0), [filtered, userId]);
  const totalOut = useMemo(() => filtered.filter(t => t.senderAccount?.userId === userId && t.status === "COMPLETED").reduce((s, t) => s + t.amount, 0), [filtered, userId]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  async function handleEmailReceipt(txId: string) {
    setEmailLoading(txId);
    try {
      await fetch(`/api/transactions/receipt/email?id=${txId}`, { method: "POST" });
      alert("Receipt sent to your email.");
    } catch {
      alert("Failed to send email.");
    } finally {
      setEmailLoading(null);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1 style={{ fontFamily: "var(--font-syne)", fontSize: 24, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 4 }}>
          Transaction History
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>{filtered.length} transactions</p>
      </div>

      {/* Stats */}
      <div className="stats-grid-3">
        {[
          { label: "Total Received", val: formatAmount(totalIn, "USD"), color: "var(--color-success)" },
          { label: "Total Sent", val: formatAmount(totalOut, "USD"), color: "var(--color-danger)" },
          { label: "Showing", val: `${filtered.length}`, color: "var(--color-accent)" },
        ].map((s) => (
          <div key={s.label} className="glass-card" style={{ padding: "16px 20px" }}>
            <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 20, fontWeight: 600, color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card filters-row" style={{ padding: "16px 20px" }}>
        <div className="tx-filters-inner" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <input
            className="input-nexus tx-filter-search"
            placeholder="Search reference or description…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ flex: "1 1 200px", minWidth: 0 }}
          />
          <div className="tx-filter-select" style={{ minWidth: 0, flex: "1 1 160px" }}>
            <Select options={TYPE_OPTIONS} value={typeFilter} onChange={(v) => { setTypeFilter(v); setPage(1); }} />
          </div>
          <div className="tx-filter-select" style={{ minWidth: 0, flex: "1 1 180px" }}>
            <Select options={STATUS_OPTIONS} value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(1); }} />
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="glass-card admin-table-card hidden md:block" style={{ overflow: "hidden", padding: 0 }}>
        {paginated.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "var(--color-text-muted)", fontSize: 14 }}>No transactions match your filters.</div>
        ) : (
          <table className="nexus-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Type</th>
                <th>Reference</th>
                <th>Description</th>
                <th style={{ textAlign: "right" }}>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ width: 32 }}></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((tx) => {
                const isOut = tx.senderAccount?.userId === userId;
                const isIn = tx.receiverAccount?.userId === userId;
                const isExpanded = expanded === tx.id;

                return (
                  <>
                    <tr key={tx.id} style={{ cursor: "pointer" }} onClick={() => setExpanded(isExpanded ? null : tx.id)}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                            background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.1)",
                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                          }}>
                            {TX_ICONS[tx.type] || "⇄"}
                          </div>
                          <span style={{ fontSize: 11, color: "var(--color-text-muted)", fontWeight: 600, whiteSpace: "nowrap" }}>
                            {getDisplayType(tx)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: "var(--color-accent)", background: "rgba(0,212,255,0.06)", padding: "2px 7px", borderRadius: 4 }}>
                          {tx.reference}
                        </span>
                      </td>
                      <td style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13 }}>
                        {tx.description || "—"}
                      </td>
                      <td style={{ textAlign: "right", fontFamily: "var(--font-jetbrains-mono)", fontWeight: 700, fontSize: 14, whiteSpace: "nowrap" }}>
                        <span style={{ color: isIn && !isOut ? "var(--color-success)" : "var(--color-text-primary)" }}>
                          {isIn && !isOut ? "+" : isOut ? "-" : ""}{formatAmount(tx.amount, tx.currency)}
                        </span>
                      </td>
                      <td><StatusBadge value={tx.status} /></td>
                      <td style={{ fontSize: 12, color: "var(--color-text-muted)", whiteSpace: "nowrap" }}>
                        {new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td style={{ textAlign: "center", fontSize: 11, color: "var(--color-text-muted)" }}>
                        {isExpanded ? "▲" : "▼"}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${tx.id}-exp`}>
                        <td colSpan={7} style={{ padding: "0 16px 20px" }}>
                          <div style={{
                            padding: "20px 22px", borderRadius: 12,
                            background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.08)",
                          }}>
                            {/* Timeline */}
                            <div style={{ marginBottom: 20 }}>
                              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Transaction Timeline</div>
                              <TransactionTimeline status={tx.status} />
                            </div>

                            {/* Details grid */}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 20 }}>
                              <Field label="Transaction ID" value={tx.reference} mono />
                              <Field label="Type" value={getDisplayType(tx)} />
                              <Field label="Status" value={tx.status} />
                              <Field label="Amount" value={formatAmount(tx.amount, tx.currency)} mono />
                              <Field label="Currency" value={tx.currency} />
                              <Field label="Initiated" value={new Date(tx.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })} />
                              <Field label="Last Updated" value={new Date(tx.updatedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })} />
                              {tx.senderAccount && <Field label="From Account" value={`••••${tx.senderAccount.accountNumber.slice(-4)} (${tx.senderAccount.currency})`} mono />}
                              {tx.receiverAccount && <Field label="To Account" value={`••••${tx.receiverAccount.accountNumber.slice(-4)} (${tx.receiverAccount.currency})`} mono />}
                              {tx.description && <Field label="Description" value={tx.description} />}
                              {tx.externalDetails && Object.entries(tx.externalDetails).map(([k, v]) => (
                                <Field key={k} label={k.replace(/([A-Z])/g, " $1").trim()} value={v} />
                              ))}
                            </div>

                            {/* Action buttons */}
                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                              <a
                                href={`/api/transactions/receipt?id=${tx.id}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="btn-ghost"
                                style={{ fontSize: 13, padding: "8px 16px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
                              >
                                ↓ Download PDF Receipt
                              </a>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleEmailReceipt(tx.id); }}
                                className="btn-ghost"
                                disabled={emailLoading === tx.id}
                                style={{ fontSize: 13, padding: "8px 16px" }}
                              >
                                {emailLoading === tx.id ? "Sending…" : "✉ Email Receipt"}
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="flex flex-col md:hidden" style={{ gap: 8 }}>
        {paginated.length === 0 ? (
          <div className="glass-card" style={{ padding: 32, textAlign: "center", color: "var(--color-text-muted)", fontSize: 14 }}>No transactions match your filters.</div>
        ) : paginated.map((tx) => {
          const isOut = tx.senderAccount?.userId === userId;
          const isIn = tx.receiverAccount?.userId === userId;
          const isExpanded = expanded === tx.id;
          return (
            <div key={tx.id}>
              <div
                onClick={() => setExpanded(isExpanded ? null : tx.id)}
                style={{ background: "rgba(13,25,41,1)", borderRadius: 12, padding: 16, border: "1px solid rgba(255,255,255,0.05)", cursor: "pointer" }}
              >
                {/* Top row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                      {TX_ICONS[tx.type] || "⇄"}
                    </div>
                    <span style={{ fontSize: 12, color: "var(--color-text-muted)", fontWeight: 600 }}>{getDisplayType(tx)}</span>
                  </div>
                  <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontWeight: 700, fontSize: 14, color: isIn && !isOut ? "var(--color-success)" : "var(--color-danger)" }}>
                    {isIn && !isOut ? "+" : isOut ? "-" : ""}{formatAmount(tx.amount, tx.currency)}
                  </span>
                </div>
                {/* Description */}
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tx.description || "—"}</div>
                {/* Bottom row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 10, color: "var(--color-accent)", background: "rgba(0,212,255,0.06)", padding: "2px 6px", borderRadius: 4 }}>{tx.reference}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    <StatusBadge value={tx.status} />
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{isExpanded ? "▲" : "▼"}</span>
                  </div>
                </div>
              </div>
              {/* Accordion detail */}
              {isExpanded && (
                <div style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0 0 12px 12px", padding: "16px" }}>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Timeline</div>
                    <TransactionTimeline status={tx.status} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                    <Field label="Transaction ID" value={tx.reference} mono />
                    <Field label="Type" value={getDisplayType(tx)} />
                    <Field label="Currency" value={tx.currency} />
                    {tx.senderAccount && <Field label="From Account" value={`••••${tx.senderAccount.accountNumber.slice(-4)} (${tx.senderAccount.currency})`} mono />}
                    {tx.receiverAccount && <Field label="To Account" value={`••••${tx.receiverAccount.accountNumber.slice(-4)} (${tx.receiverAccount.currency})`} mono />}
                    {tx.externalDetails && Object.entries(tx.externalDetails).slice(0, 4).map(([k, v]) => (
                      <Field key={k} label={k.replace(/([A-Z])/g, " $1").trim()} value={v} />
                    ))}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <a href={`/api/transactions/receipt?id=${tx.id}`} target="_blank" rel="noreferrer" className="btn-ghost" style={{ fontSize: 13, padding: "8px 16px", textDecoration: "none", textAlign: "center" }}>
                      ↓ Download PDF Receipt
                    </a>
                    <button type="button" onClick={() => handleEmailReceipt(tx.id)} className="btn-ghost" disabled={emailLoading === tx.id} style={{ fontSize: 13, padding: "8px 16px" }}>
                      {emailLoading === tx.id ? "Sending…" : "✉ Email Receipt"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="btn-ghost" disabled={page === 1} style={{ padding: "6px 16px" }}>←</button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            const p = page <= 4 ? i + 1 : page >= totalPages - 3 ? totalPages - 6 + i : page - 3 + i;
            return Math.max(1, Math.min(totalPages, p));
          }).filter((v, i, a) => a.indexOf(v) === i).map((p) => (
            <button key={p} onClick={() => setPage(p)} style={{
              padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer",
              background: p === page ? "var(--color-accent)" : "rgba(255,255,255,0.04)",
              color: p === page ? "#03050a" : "var(--color-text-muted)",
              fontWeight: p === page ? 700 : 400, fontSize: 13,
            }}>{p}</button>
          ))}
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="btn-ghost" disabled={page === totalPages} style={{ padding: "6px 16px" }}>→</button>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 12, color: "var(--color-text-primary)", fontFamily: mono ? "var(--font-jetbrains-mono)" : "inherit", wordBreak: "break-all" }}>{value}</div>
    </div>
  );
}
