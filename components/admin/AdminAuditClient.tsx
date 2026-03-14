"use client";

import { useState, useEffect, useCallback } from "react";
import Select from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";

const G = "#F0B429";

const ACTION_COLORS: Record<string, string> = {
  USER_LOGIN: "#8899b5",
  USER_REGISTERED: "#00d4ff",
  ADMIN_SET_USER_STATUS_ACTIVE: "#00e5a0",
  ADMIN_SET_USER_STATUS_RESTRICTED: "#f0b429",
  ADMIN_SET_USER_STATUS_DISABLED: "#ff3b5c",
  ADMIN_SET_USER_STATUS_PENDING_ACTIVATION: "#8899b5",
  TRANSFER_COMPLETED: "#00e5a0",
  TRANSFER_AWAITING_CONFIRMATION: "#f0b429",
  WIRE_TRANSFER_INITIATED: "#00d4ff",
  ADMIN_DEPOSIT: "#a78bfa",
  ADMIN_UPDATE_SYSTEM_SETTINGS: "#f0b429",
  ADMIN_GENERATE_TRANSFER_TOKEN: "#00d4ff",
  ADMIN_REVOKE_TRANSFER_TOKEN: "#ff3b5c",
  ADMIN_RESET_USER_2FA: "#ff3b5c",
  TWO_FACTOR_ENABLED: "#00e5a0",
  CARD_CREATED: "#00d4ff",
  CARD_FREEZE: "#64b4ff",
  CARD_CANCEL: "#ff3b5c",
  PASSWORD_CHANGED: "#f0b429",
  ADMIN_OVERRIDE_TRANSACTION: "#a78bfa",
};

type AuditLog = {
  id: string; action: string; target: string | null;
  details: any; ipAddress: string | null; createdAt: string;
  user: { firstName: string; lastName: string; email: string; role: string } | null;
};

export default function AdminAuditClient() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionTypes, setActionTypes] = useState<string[]>([]);

  const [action, setAction] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "50" });
    if (action !== "ALL") params.set("action", action);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);

    const res = await fetch(`/api/admin/audit?${params}`);
    const data = await res.json();
    setLogs(data.logs ?? []);
    setTotal(data.total ?? 0);
    setPages(data.pages ?? 1);
    if (data.actionTypes?.length) setActionTypes(data.actionTypes);
    setLoading(false);
  }, [page, action, dateFrom, dateTo]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  function exportCSV() {
    const header = ["ID", "Action", "Admin", "Email", "Target", "IP Address", "Date"];
    const rows = logs.map((l) => [
      l.id, l.action,
      l.user ? `${l.user.firstName} ${l.user.lastName}` : "System",
      l.user?.email ?? "—",
      l.target ?? "—",
      l.ipAddress ?? "—",
      new Date(l.createdAt).toISOString(),
    ]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "audit_log.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-syne)", fontSize: 24, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 4 }}>Audit Log</h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>
            {total.toLocaleString()} immutable records — read-only
          </p>
        </div>
        <button onClick={exportCSV} style={{ padding: "9px 18px", borderRadius: 10, border: "1px solid rgba(0,212,255,0.3)", background: "rgba(0,212,255,0.06)", color: "var(--color-accent)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          ↓ Export CSV
        </button>
      </div>

      {/* Filters */}
      <div style={{ background: "rgba(6,12,24,0.7)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "16px 18px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>Action Type</label>
            <Select
              value={action}
              onChange={(v) => { setAction(v); setPage(1); }}
              options={[
                { value: "ALL", label: "All Actions" },
                ...actionTypes.map((a) => ({ value: a, label: a })),
              ]}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>From Date</label>
            <DatePicker value={dateFrom} onChange={(v) => { setDateFrom(v); setPage(1); }} placeholder="From date" />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>To Date</label>
            <DatePicker value={dateTo} onChange={(v) => { setDateTo(v); setPage(1); }} placeholder="To date" />
          </div>
        </div>
      </div>

      {/* Log entries */}
      <div style={{ background: "rgba(6,12,24,0.7)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--color-text-muted)", fontSize: 13 }}>Loading…</div>
        ) : logs.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--color-text-muted)", fontSize: 13 }}>No audit records found</div>
        ) : (
          <div>
            {logs.map((log, i) => {
              const color = ACTION_COLORS[log.action] ?? "#8899b5";
              const isExpanded = expandedId === log.id;
              return (
                <div key={log.id}>
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : log.id)}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 14, padding: "13px 18px",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      cursor: "pointer", transition: "background 0.15s",
                      background: isExpanded ? "rgba(255,255,255,0.02)" : "transparent",
                    }}
                  >
                    {/* Color dot */}
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}`, flexShrink: 0, marginTop: 4 }} />

                    {/* Action */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, fontWeight: 700, color, background: `${color}14`, padding: "2px 7px", borderRadius: 4 }}>
                          {log.action}
                        </span>
                        <span style={{ fontSize: 10, color: "var(--color-text-muted)", whiteSpace: "nowrap", flexShrink: 0, fontFamily: "var(--font-jetbrains-mono)" }}>
                          {new Date(log.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                        {log.user && (
                          <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                            <span style={{ color: log.user.role === "ADMIN" ? G : "var(--color-accent)" }}>
                              {log.user.firstName} {log.user.lastName}
                            </span>
                            {" · "}{log.user.email}
                          </span>
                        )}
                        {log.target && (
                          <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 10, color: "rgba(136,153,181,0.6)", padding: "1px 6px", background: "rgba(255,255,255,0.03)", borderRadius: 3 }}>
                            target: {log.target.length > 20 ? `${log.target.slice(0, 20)}…` : log.target}
                          </span>
                        )}
                        {log.ipAddress && (
                          <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 10, color: "rgba(136,153,181,0.5)" }}>
                            {log.ipAddress}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expand arrow */}
                    <span style={{ fontSize: 11, color: "var(--color-text-muted)", flexShrink: 0, transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "none" }}>▾</span>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div style={{ padding: "14px 40px", borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(0,0,0,0.2)" }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Details Payload</div>
                      <pre style={{
                        fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: "#a0b0c8",
                        background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: "12px 14px",
                        overflowX: "auto", margin: 0, lineHeight: 1.6,
                        border: "1px solid rgba(255,255,255,0.04)",
                      }}>
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                      <div style={{ marginTop: 8, display: "flex", gap: 16 }}>
                        <span style={{ fontSize: 10, color: "var(--color-text-muted)", fontFamily: "var(--font-jetbrains-mono)" }}>ID: {log.id}</span>
                        {log.target && <span style={{ fontSize: 10, color: "var(--color-text-muted)", fontFamily: "var(--font-jetbrains-mono)" }}>Target: {log.target}</span>}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
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
    </div>
  );
}
