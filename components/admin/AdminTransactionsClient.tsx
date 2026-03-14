"use client";

import { useState, useEffect, useCallback } from "react";
import { CURRENCY_FLAGS, formatAmount } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import DatePicker from "@/components/ui/DatePicker";
import Select from "@/components/ui/Select";

const G = "#F0B429";

const STATUS_OPTIONS = ["ALL", "COMPLETED", "PENDING", "AWAITING_CONFIRMATION", "FAILED"];
const TYPE_OPTIONS = ["ALL", "INTERNAL_TRANSFER", "WIRE_TRANSFER", "ADMIN_DEPOSIT"];
const CURRENCY_OPTIONS = ["ALL", "USD", "EUR", "GBP", "CHF", "JPY", "CAD", "AUD", "SGD", "HKD", "AED"];

type Tx = {
  id: string; reference: string; type: string; status: string;
  amount: number; currency: string; description: string | null; createdAt: string;
  senderAccount: { accountNumber: string; currency: string; user: { firstName: string; lastName: string; email: string } | null } | null;
  receiverAccount: { accountNumber: string; currency: string; user: { firstName: string; lastName: string; email: string } | null } | null;
};

const TYPE_COLORS: Record<string, string> = {
  INTERNAL_TRANSFER: "var(--color-accent)",
  WIRE_TRANSFER: "#a78bfa",
  ADMIN_DEPOSIT: "#00e5a0",
};

function OverrideModal({ tx, onClose, onSuccess }: { tx: Tx; onClose: () => void; onSuccess: () => void }) {
  const [newStatus, setNewStatus] = useState(tx.status);
  const toLocalDatetime = (iso: string) => {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  const [newDate, setNewDate] = useState(toLocalDatetime(tx.createdAt));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const statusChanged = newStatus !== tx.status;
  const dateChanged = newDate !== toLocalDatetime(tx.createdAt);
  const hasChanges = statusChanged || dateChanged;

  async function handleOverride() {
    setSubmitting(true); setError("");
    try {
      const body: any = {};
      if (statusChanged) body.status = newStatus;
      if (dateChanged) body.createdAt = new Date(newDate).toISOString();
      const res = await fetch(`/api/admin/transactions/${tx.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Override failed"); return; }
      onSuccess();
    } finally { setSubmitting(false); }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#0d1a30", border: "1px solid rgba(240,180,41,0.2)", borderRadius: 16, padding: "28px 24px", maxWidth: 480, width: "90%" }}>
        <h3 style={{ fontFamily: "var(--font-syne)", fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 6 }}>Override Transaction</h3>
        <p style={{ color: "var(--color-text-muted)", fontSize: 12, marginBottom: 20 }}>
          Ref: <span style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--color-accent)" }}>{tx.reference}</span>
        </p>
        <div style={{ padding: "14px 16px", borderRadius: 10, background: "rgba(0,0,0,0.3)", marginBottom: 20, display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            ["Type", tx.type.replace(/_/g, " ")],
            ["Amount", formatAmount(tx.amount, tx.currency)],
            ["Current Status", tx.status],
            ["Current Date", new Date(tx.createdAt).toLocaleString()],
          ].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{l}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-primary)" }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", marginBottom: 7, letterSpacing: "0.06em", textTransform: "uppercase" }}>New Status</label>
          <Select
            value={newStatus}
            onChange={(v) => setNewStatus(v)}
            options={["COMPLETED", "FAILED", "PENDING", "AWAITING_CONFIRMATION"].map((s) => ({ value: s, label: s }))}
          />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", marginBottom: 7, letterSpacing: "0.06em", textTransform: "uppercase" }}>Transaction Date &amp; Time</label>
          <input
            type="datetime-local"
            className="input-nexus"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            style={{ colorScheme: "dark" }}
          />
        </div>
        {error && <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(255,59,92,0.08)", border: "1px solid rgba(255,59,92,0.2)", color: "var(--color-danger)", fontSize: 13, marginBottom: 14 }}>{error}</div>}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
          <button onClick={handleOverride} disabled={submitting || !hasChanges}
            style={{ flex: 1, padding: "11px", borderRadius: 10, border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${G}, #d4991f)`, color: "#03050a", fontWeight: 800, fontSize: 14, opacity: !hasChanges ? 0.4 : 1 }}>
            {submitting ? "Applying…" : "Apply Override"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminTransactionsClient() {
  const [txs, setTxs] = useState<Tx[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [type, setType] = useState("ALL");
  const [currency, setCurrency] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState("COMPLETED");
  const [bulkSubmitting, setBulkSubmitting] = useState(false);

  const [overrideTx, setOverrideTx] = useState<Tx | null>(null);
  const [detailTx, setDetailTx] = useState<Tx | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchTxs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "50" });
    if (search) params.set("search", search);
    if (status !== "ALL") params.set("status", status);
    if (type !== "ALL") params.set("type", type);
    if (currency !== "ALL") params.set("currency", currency);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    if (minAmount) params.set("minAmount", minAmount);
    if (maxAmount) params.set("maxAmount", maxAmount);

    const res = await fetch(`/api/admin/transactions?${params}`);
    const data = await res.json();
    setTxs(data.transactions ?? []);
    setTotal(data.total ?? 0);
    setPages(data.pages ?? 1);
    setLoading(false);
    setSelected(new Set());
  }, [page, search, status, type, currency, dateFrom, dateTo, minAmount, maxAmount, refreshKey]);

  useEffect(() => { fetchTxs(); }, [fetchTxs]);

  async function handleBulkAction() {
    if (selected.size === 0) return;
    setBulkSubmitting(true);
    await Promise.all(
      Array.from(selected).map((id) =>
        fetch(`/api/admin/transactions/${id}`, {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: bulkStatus }),
        })
      )
    );
    setBulkSubmitting(false);
    setRefreshKey((k) => k + 1);
  }

  function exportCSV() {
    const header = ["Reference", "Type", "Status", "Amount", "Currency", "Sender", "Receiver", "Description", "Date"];
    const rows = txs.map((t) => [
      t.reference, t.type, t.status, t.amount, t.currency,
      t.senderAccount?.user ? `${t.senderAccount.user.firstName} ${t.senderAccount.user.lastName}` : "—",
      t.receiverAccount?.user ? `${t.receiverAccount.user.firstName} ${t.receiverAccount.user.lastName}` : "—",
      t.description ?? "",
      new Date(t.createdAt).toISOString(),
    ]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "transactions.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  const allSelected = txs.length > 0 && selected.size === txs.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="page-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-syne)", fontSize: 24, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 4 }}>Transactions</h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>{total.toLocaleString()} total records</p>
        </div>
        <button onClick={exportCSV} style={{ padding: "9px 18px", borderRadius: 10, border: "1px solid rgba(0,212,255,0.3)", background: "rgba(0,212,255,0.06)", color: "var(--color-accent)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          ↓ Export CSV
        </button>
      </div>

      {/* Filters */}
      <div style={{ background: "rgba(6,12,24,0.7)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "16px 18px" }}>
        <div className="admin-filter-grid" style={{ marginBottom: 10 }}>
          <input className="input-nexus" placeholder="Search reference…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          <Select
            value={status}
            onChange={(v) => { setStatus(v); setPage(1); }}
            options={STATUS_OPTIONS.map((s) => ({ value: s, label: s === "ALL" ? "All Statuses" : s }))}
          />
          <Select
            value={type}
            onChange={(v) => { setType(v); setPage(1); }}
            options={TYPE_OPTIONS.map((t) => ({ value: t, label: t === "ALL" ? "All Types" : t.replace(/_/g, " ") }))}
          />
          <Select
            value={currency}
            onChange={(v) => { setCurrency(v); setPage(1); }}
            options={CURRENCY_OPTIONS.map((c) => ({ value: c, label: c === "ALL" ? "All Currencies" : c }))}
          />
        </div>
        <div className="admin-filter-grid">
          <DatePicker value={dateFrom} onChange={(v) => { setDateFrom(v); setPage(1); }} placeholder="From date" />
          <DatePicker value={dateTo} onChange={(v) => { setDateTo(v); setPage(1); }} placeholder="To date" />
          <input className="input-nexus" type="number" placeholder="Min amount" value={minAmount} onChange={(e) => { setMinAmount(e.target.value); setPage(1); }} />
          <input className="input-nexus" type="number" placeholder="Max amount" value={maxAmount} onChange={(e) => { setMaxAmount(e.target.value); setPage(1); }} />
        </div>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, background: "rgba(240,180,41,0.08)", border: "1px solid rgba(240,180,41,0.2)" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: G }}>{selected.size} selected</span>
          <Select
            value={bulkStatus}
            onChange={(v) => setBulkStatus(v)}
            options={["COMPLETED", "FAILED", "PENDING", "AWAITING_CONFIRMATION"].map((s) => ({ value: s, label: s }))}
            style={{ width: 220, marginLeft: "auto" }}
          />
          <button onClick={handleBulkAction} disabled={bulkSubmitting}
            style={{ padding: "9px 18px", borderRadius: 9, border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${G}, #d4991f)`, color: "#03050a", fontWeight: 800, fontSize: 13 }}>
            {bulkSubmitting ? "Applying…" : "Apply to Selected"}
          </button>
          <button onClick={() => setSelected(new Set())} className="btn-ghost" style={{ padding: "9px 14px" }}>Clear</button>
        </div>
      )}

      {/* Desktop Table */}
      <div className="admin-table-card hidden md:block" style={{ background: "rgba(6,12,24,0.7)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--color-text-muted)", fontSize: 13 }}>Loading…</div>
        ) : txs.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--color-text-muted)", fontSize: 13 }}>No transactions found</div>
        ) : (
          <table className="nexus-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th style={{ width: 40 }}>
                  <input type="checkbox" checked={allSelected} onChange={(e) => setSelected(e.target.checked ? new Set(txs.map((t) => t.id)) : new Set())} />
                </th>
                <th>Reference</th>
                <th>Type</th>
                <th>Sender</th>
                <th>Receiver</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {txs.map((tx) => (
                <tr key={tx.id} style={{ background: selected.has(tx.id) ? "rgba(240,180,41,0.04)" : undefined }}>
                  <td>
                    <input type="checkbox" checked={selected.has(tx.id)} onChange={(e) => {
                      const next = new Set(selected);
                      if (e.target.checked) next.add(tx.id); else next.delete(tx.id);
                      setSelected(next);
                    }} />
                  </td>
                  <td>
                    <button onClick={() => setDetailTx(tx)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                      <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: "var(--color-accent)", background: "rgba(0,212,255,0.06)", padding: "2px 7px", borderRadius: 4 }}>{tx.reference}</span>
                    </button>
                  </td>
                  <td>
                    <span style={{ fontSize: 11, fontWeight: 700, color: TYPE_COLORS[tx.type] ?? "#8899b5", background: `${TYPE_COLORS[tx.type] ?? "#8899b5"}14`, padding: "2px 8px", borderRadius: 4 }}>
                      {tx.type.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td style={{ fontSize: 12 }}>
                    {tx.senderAccount?.user
                      ? <div><div style={{ fontWeight: 600 }}>{tx.senderAccount.user.firstName} {tx.senderAccount.user.lastName}</div>
                        <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 10, color: "var(--color-text-muted)" }}>••••{tx.senderAccount.accountNumber.slice(-4)}</div></div>
                      : <span style={{ color: "var(--color-text-muted)" }}>—</span>}
                  </td>
                  <td style={{ fontSize: 12 }}>
                    {tx.receiverAccount?.user
                      ? <div><div style={{ fontWeight: 600 }}>{tx.receiverAccount.user.firstName} {tx.receiverAccount.user.lastName}</div>
                        <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 10, color: "var(--color-text-muted)" }}>••••{tx.receiverAccount.accountNumber.slice(-4)}</div></div>
                      : <span style={{ color: "var(--color-text-muted)" }}>—</span>}
                  </td>
                  <td style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 13, color: tx.status === "FAILED" ? "var(--color-danger)" : "var(--color-success)" }}>
                    {CURRENCY_FLAGS[tx.currency]} {formatAmount(tx.amount, tx.currency)}
                  </td>
                  <td><StatusBadge value={tx.status} /></td>
                  <td style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                    {new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td>
                    <button onClick={() => setOverrideTx(tx)} style={{ fontSize: 11, fontWeight: 700, color: G, background: "rgba(240,180,41,0.08)", border: "1px solid rgba(240,180,41,0.2)", padding: "4px 10px", borderRadius: 6, cursor: "pointer" }}>
                      Override
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Mobile card list */}
      <div className="flex flex-col md:hidden" style={{ gap: 8 }}>
        {loading ? (
          <div style={{ padding: 32, textAlign: "center", color: "var(--color-text-muted)", fontSize: 13 }}>Loading…</div>
        ) : txs.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: "var(--color-text-muted)", fontSize: 13 }}>No transactions found</div>
        ) : txs.map((tx) => (
          <div key={tx.id}
            onClick={() => setDetailTx(tx)}
            style={{ background: "rgba(13,25,41,1)", borderRadius: 12, padding: 16, border: "1px solid rgba(255,255,255,0.05)", cursor: "pointer" }}>
            {/* Top row: type + amount */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: TYPE_COLORS[tx.type] ?? "#8899b5", background: `${TYPE_COLORS[tx.type] ?? "#8899b5"}14`, padding: "2px 8px", borderRadius: 4 }}>
                {tx.type.replace(/_/g, " ")}
              </span>
              <span style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 14, color: tx.status === "FAILED" ? "var(--color-danger)" : "var(--color-success)" }}>
                {CURRENCY_FLAGS[tx.currency]} {formatAmount(tx.amount, tx.currency)}
              </span>
            </div>
            {/* Sender / Receiver */}
            <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginBottom: 8 }}>
              {tx.senderAccount?.user
                ? <span>{tx.senderAccount.user.firstName} {tx.senderAccount.user.lastName} → </span>
                : null}
              {tx.receiverAccount?.user
                ? <span>{tx.receiverAccount.user.firstName} {tx.receiverAccount.user.lastName}</span>
                : null}
            </div>
            {/* Bottom row: reference + date + status */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 10, color: "var(--color-accent)", background: "rgba(0,212,255,0.06)", padding: "2px 6px", borderRadius: 4 }}>
                {tx.reference}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
                  {new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
                <StatusBadge value={tx.status} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-ghost" style={{ padding: "7px 16px" }}>← Prev</button>
          {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
            const p = page <= 4 ? i + 1 : page - 3 + i;
            if (p < 1 || p > pages) return null;
            return (
              <button key={p} onClick={() => setPage(p)} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${p === page ? G : "rgba(255,255,255,0.08)"}`, background: p === page ? "rgba(240,180,41,0.12)" : "none", color: p === page ? G : "var(--color-text-muted)", fontWeight: p === page ? 700 : 400, cursor: "pointer", fontSize: 13 }}>
                {p}
              </button>
            );
          })}
          <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages} className="btn-ghost" style={{ padding: "7px 16px" }}>Next →</button>
        </div>
      )}

      {/* Override modal */}
      {overrideTx && <OverrideModal tx={overrideTx} onClose={() => setOverrideTx(null)} onSuccess={() => { setOverrideTx(null); setRefreshKey((k) => k + 1); }} />}

      {/* Detail modal */}
      {detailTx && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setDetailTx(null)}>
          <div style={{ background: "#0d1a30", border: "1px solid rgba(0,212,255,0.15)", borderRadius: 16, padding: "28px 24px", maxWidth: 520, width: "90%", maxHeight: "85vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontFamily: "var(--font-syne)", fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)" }}>Transaction Detail</h3>
                <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: "var(--color-accent)" }}>{detailTx.reference}</span>
              </div>
              <button onClick={() => setDetailTx(null)} style={{ background: "none", border: "none", color: "var(--color-text-muted)", cursor: "pointer", fontSize: 20 }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["Type", detailTx.type.replace(/_/g, " ")],
                ["Amount", formatAmount(detailTx.amount, detailTx.currency)],
                ["Currency", `${CURRENCY_FLAGS[detailTx.currency]} ${detailTx.currency}`],
                ["Status", detailTx.status],
                ["Description", detailTx.description ?? "—"],
                ["Sender", detailTx.senderAccount?.user ? `${detailTx.senderAccount.user.firstName} ${detailTx.senderAccount.user.lastName} (${detailTx.senderAccount.user.email})` : "—"],
                ["Receiver", detailTx.receiverAccount?.user ? `${detailTx.receiverAccount.user.firstName} ${detailTx.receiverAccount.user.lastName} (${detailTx.receiverAccount.user.email})` : "—"],
                ["Date", new Date(detailTx.createdAt).toLocaleString()],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", borderRadius: 8, background: "rgba(0,0,0,0.25)" }}>
                  <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{l}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-primary)", maxWidth: 280, textAlign: "right" }}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => { setOverrideTx(detailTx); setDetailTx(null); }} style={{ marginTop: 16, width: "100%", padding: "11px", borderRadius: 10, border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${G}, #d4991f)`, color: "#03050a", fontWeight: 800, fontSize: 14 }}>
              Override Status
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
