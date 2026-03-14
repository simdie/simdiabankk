"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CopyButton } from "@/components/ui/CopyButton";
import { formatAmount } from "@/lib/utils";
import Select from "@/components/ui/Select";

const G = "#F0B429";

const SCARY_MESSAGES = [
  { label: "Federal Mandate", value: "ERROR: ACCOUNT FROZEN BY FEDERAL MANDATE. CONTACT COMPLIANCE IMMEDIATELY." },
  { label: "Suspicious Activity", value: "ACCOUNT SUSPENDED — SUSPICIOUS ACTIVITY DETECTED. LEGAL HOLD APPLIED. DO NOT ATTEMPT FURTHER ACCESS." },
  { label: "Regulatory Review", value: "ACCESS DENIED: ACCOUNT UNDER REGULATORY REVIEW. ALL TRANSACTIONS FROZEN PENDING INVESTIGATION." },
  { label: "AML Hold", value: "NOTICE: YOUR ACCOUNT HAS BEEN PLACED UNDER AN ANTI-MONEY LAUNDERING HOLD. CONTACT COMPLIANCE OFFICER IMMEDIATELY." },
  { label: "Court Order", value: "ACCOUNT ACCESS RESTRICTED BY COURT ORDER. ALL ASSETS FROZEN. CONTACT YOUR LEGAL REPRESENTATIVE." },
];

const STATUS_OPTS = [
  { value: "PENDING_ACTIVATION", label: "Pending", color: G },
  { value: "ACTIVE", label: "Active", color: "var(--color-success)" },
  { value: "RESTRICTED", label: "Restrict", color: "var(--color-danger)" },
  { value: "DISABLED", label: "Disable", color: "#ff3b5c" },
];

type User = {
  id: string; firstName: string; lastName: string; email: string;
  role: string; status: string; twoFactorEnabled: boolean;
  restrictionMessage: string | null; transferToken: string | null;
  transferTokenExp: string | null; phone: string | null; createdAt: string;
  displayId: string | null;
  city: string | null; country: string | null;
  addressLine1: string | null;
  accounts: { id: string; accountNumber: string; currency: string; balance: number; status: string }[];
};

export default function AdminUsersClient() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selected, setSelected] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [saveErr, setSaveErr] = useState("");

  // Detail panel state
  const [newEmail, setNewEmail] = useState("");
  const [restrictMsg, setRestrictMsg] = useState("");
  const [pendingStatus, setPendingStatus] = useState("");
  const [confirmModal, setConfirmModal] = useState<{ action: string; label: string } | null>(null);
  const [tokenExpiry, setTokenExpiry] = useState("24h");
  const [generatedToken, setGeneratedToken] = useState<{ token: string; expiresAt: string } | null>(null);
  const [tokenLoading, setTokenLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ search, status: statusFilter, limit: "100" });
      const res = await fetch(`/api/admin/users?${qs}`);
      const data = await res.json();
      setUsers(data.users ?? []);
      setTotal(data.total ?? 0);
    } finally { setLoading(false); }
  }, [search, statusFilter]);

  useEffect(() => { load(); }, [load]);

  function selectUser(u: User) {
    setSelected(u);
    setNewEmail(u.email);
    setRestrictMsg(u.restrictionMessage ?? "");
    setPendingStatus(u.status);
    setSaveMsg(""); setSaveErr(""); setGeneratedToken(null);
  }

  async function applyStatusChange() {
    if (!selected || !pendingStatus) return;
    setSaving(true); setSaveErr(""); setSaveMsg("");
    try {
      const body: any = { userId: selected.id, action: "SET_STATUS", status: pendingStatus };
      if (pendingStatus === "RESTRICTED") body.restrictionMessage = restrictMsg;
      const res = await fetch("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setSaveErr(data.error); return; }
      setSaveMsg(`Status updated to ${pendingStatus}`);
      setSelected((u) => u ? { ...u, status: pendingStatus, restrictionMessage: pendingStatus === "RESTRICTED" ? restrictMsg : null } : null);
      setUsers((prev) => prev.map((u) => u.id === selected.id ? { ...u, status: pendingStatus } : u));
    } finally { setSaving(false); setConfirmModal(null); }
  }

  async function applyEmailChange() {
    if (!selected) return;
    setSaving(true); setSaveErr(""); setSaveMsg("");
    try {
      const res = await fetch("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: selected.id, action: "SET_EMAIL", email: newEmail }) });
      const data = await res.json();
      if (!res.ok) { setSaveErr(data.error); return; }
      setSaveMsg("Email updated"); setSelected((u) => u ? { ...u, email: newEmail } : null);
      setUsers((prev) => prev.map((u) => u.id === selected.id ? { ...u, email: newEmail } : u));
    } finally { setSaving(false); }
  }

  async function applyRestrictionMessage() {
    if (!selected) return;
    setSaving(true); setSaveErr(""); setSaveMsg("");
    try {
      const res = await fetch("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: selected.id, action: "SET_RESTRICTION_MESSAGE", restrictionMessage: restrictMsg }) });
      if (!res.ok) { setSaveErr("Failed to update message"); return; }
      setSaveMsg("Restriction message saved");
      setSelected((u) => u ? { ...u, restrictionMessage: restrictMsg } : null);
    } finally { setSaving(false); }
  }

  async function reset2FA() {
    if (!selected) return;
    setSaving(true); setSaveErr("");
    try {
      const res = await fetch(`/api/admin/users/${selected.id}/reset-2fa`, { method: "POST" });
      if (!res.ok) { setSaveErr("Failed to reset 2FA"); return; }
      setSaveMsg("2FA reset — user must re-enroll");
      setSelected((u) => u ? { ...u, twoFactorEnabled: false } : null);
    } finally { setSaving(false); }
  }

  async function generateTransferToken() {
    if (!selected) return;
    setTokenLoading(true); setSaveErr("");
    try {
      const res = await fetch(`/api/admin/users/${selected.id}/transfer-token`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expiry: tokenExpiry }),
      });
      const data = await res.json();
      if (!res.ok) { setSaveErr(data.error); return; }
      setGeneratedToken({ token: data.token, expiresAt: data.expiresAt });
      setSelected((u) => u ? { ...u, transferToken: data.token, transferTokenExp: data.expiresAt } : null);
    } finally { setTokenLoading(false); }
  }

  async function revokeTransferToken() {
    if (!selected) return;
    setTokenLoading(true);
    try {
      await fetch(`/api/admin/users/${selected.id}/transfer-token`, { method: "DELETE" });
      setGeneratedToken(null);
      setSelected((u) => u ? { ...u, transferToken: null, transferTokenExp: null } : null);
      setSaveMsg("Transfer token revoked");
    } finally { setTokenLoading(false); }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-syne)", fontSize: 24, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 4 }}>User Management</h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>{total} total users</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <input className="input-nexus" placeholder="Search name or email…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: "1 1 240px" }} />
        <Select
          value={statusFilter}
          onChange={(v) => setStatusFilter(v)}
          options={[
            { value: "ALL", label: "All Statuses" },
            { value: "PENDING_ACTIVATION", label: "Pending Activation" },
            { value: "ACTIVE", label: "Active" },
            { value: "RESTRICTED", label: "Restricted" },
            { value: "DISABLED", label: "Disabled" },
          ]}
          style={{ width: 180 }}
        />
      </div>

      {/* Main layout: table + slide-out panel */}
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        {/* Table */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Desktop table */}
          <div className="admin-table-card hidden md:block" style={{ background: "rgba(6,12,24,0.7)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, overflow: "hidden" }}>
            {loading ? (
              <div style={{ padding: 48, textAlign: "center", color: "var(--color-text-muted)" }}>Loading users…</div>
            ) : (
              <table className="nexus-table admin-users-table" style={{ width: "100%" }}>
                <thead><tr>
                  <th>User</th><th>Customer ID</th><th>Address</th><th>Status</th><th>Role</th><th>2FA</th><th>Accounts</th><th>Joined</th><th></th>
                </tr></thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={{ cursor: "pointer", background: selected?.id === u.id ? "rgba(240,180,41,0.04)" : undefined }} onClick={() => router.push(`/admin/users/${u.id}`)}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                            background: `linear-gradient(135deg, ${G}, #d4991f)`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 12, fontWeight: 800, color: "#03050a",
                          }}>
                            {u.firstName[0]}{u.lastName[0]}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }}>{u.firstName} {u.lastName}</div>
                            <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{
                          fontFamily: "var(--font-jetbrains-mono)", fontSize: 11,
                          color: u.displayId ? "var(--color-accent)" : "var(--color-text-muted)",
                          letterSpacing: "0.05em", fontWeight: u.displayId ? 600 : 400,
                        }}>
                          {u.displayId || `#${u.id.slice(-6).toUpperCase()}`}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: 11, color: "var(--color-text-muted)", maxWidth: 160 }}>
                          {u.city && u.country
                            ? <><span style={{ color: "var(--color-text-secondary)" }}>{u.city}</span>{", "}{u.country}</>
                            : u.addressLine1
                              ? <span style={{ color: "var(--color-text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{u.addressLine1}</span>
                              : <span style={{ color: "var(--color-text-muted)", fontStyle: "italic" }}>Not set</span>
                          }
                        </div>
                      </td>
                      <td><StatusBadge value={u.status} /></td>
                      <td>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: u.role === "ADMIN" ? "rgba(240,180,41,0.1)" : "rgba(255,255,255,0.04)", color: u.role === "ADMIN" ? G : "var(--color-text-muted)", border: `1px solid ${u.role === "ADMIN" ? "rgba(240,180,41,0.2)" : "rgba(255,255,255,0.06)"}` }}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: 11, color: u.twoFactorEnabled ? "var(--color-success)" : "var(--color-text-muted)" }}>
                          {u.twoFactorEnabled ? "✓ ON" : "✕ OFF"}
                        </span>
                      </td>
                      <td style={{ fontSize: 13 }}>{u.accounts.length}</td>
                      <td style={{ fontSize: 11, color: "var(--color-text-muted)", whiteSpace: "nowrap" }}>
                        {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}
                      </td>
                      <td>
                        <button onClick={() => router.push(`/admin/users/${u.id}`)} style={{ background: "rgba(240,180,41,0.08)", border: `1px solid rgba(240,180,41,0.2)`, color: G, padding: "4px 10px", borderRadius: 7, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
                          Manage →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Mobile card list */}
          <div className="flex flex-col md:hidden" style={{ gap: 10 }}>
            {loading ? (
              <div style={{ padding: 32, textAlign: "center", color: "var(--color-text-muted)", fontSize: 13 }}>Loading users…</div>
            ) : users.map((u) => (
              <div key={u.id}
                onClick={() => router.push(`/admin/users/${u.id}`)}
                style={{ background: "rgba(13,25,41,1)", borderRadius: 14, padding: 16, border: "1px solid rgba(255,255,255,0.05)", cursor: "pointer" }}>
                {/* Top row: avatar + name + status */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg, ${G}, #d4991f)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#03050a" }}>
                    {u.firstName[0]}{u.lastName[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text-primary)" }}>{u.firstName} {u.lastName}</div>
                    <div style={{ fontSize: 12, color: "var(--color-text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</div>
                  </div>
                  <StatusBadge value={u.status} />
                </div>
                {/* Middle row: displayId + location */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: u.displayId ? "var(--color-accent)" : "var(--color-text-muted)", fontWeight: 600 }}>
                    {u.displayId || `#${u.id.slice(-6).toUpperCase()}`}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                    {u.city && u.country ? `${u.city}, ${u.country}` : "—"}
                  </span>
                </div>
                {/* Bottom row: joined + view button */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                    Joined: {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <span style={{ fontSize: 13, color: "var(--color-accent)", fontWeight: 600 }}>View →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slide-out detail panel */}
        {selected && (
          <div style={{
            width: 400, flexShrink: 0,
            background: "rgba(8,6,0,0.95)", backdropFilter: "blur(24px)",
            border: `1px solid rgba(240,180,41,0.15)`,
            borderRadius: 16, padding: "24px 22px",
            maxHeight: "85vh", overflowY: "auto",
            position: "sticky", top: 20,
            boxShadow: `0 8px 48px rgba(240,180,41,0.06)`,
          }}>
            {/* Panel header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${G}, #d4991f)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#03050a" }}>
                    {selected.firstName[0]}{selected.lastName[0]}
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 16, color: "var(--color-text-primary)" }}>{selected.firstName} {selected.lastName}</div>
                    <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{selected.email}</div>
                  </div>
                </div>
                <StatusBadge value={selected.status} />
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", fontSize: 18, padding: 4 }}>✕</button>
            </div>

            {saveMsg && <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.2)", color: "var(--color-success)", fontSize: 12, marginBottom: 14 }}>{saveMsg}</div>}
            {saveErr && <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(255,59,92,0.08)", border: "1px solid rgba(255,59,92,0.2)", color: "var(--color-danger)", fontSize: 12, marginBottom: 14 }}>{saveErr}</div>}

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

              {/* Account balances */}
              <PanelSection title="Accounts">
                {selected.accounts.length === 0
                  ? <p style={{ fontSize: 12, color: "var(--color-text-muted)" }}>No accounts</p>
                  : selected.accounts.map((a) => (
                    <div key={a.id} style={{ display: "flex", justifyContent: "space-between", padding: "7px 10px", background: "rgba(255,255,255,0.02)", borderRadius: 8, marginBottom: 6 }}>
                      <div>
                        <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: "var(--color-text-muted)" }}>••••{a.accountNumber.slice(-4)}</span>
                        <span style={{ fontSize: 11, color: "var(--color-text-muted)", marginLeft: 6 }}>{a.currency}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontFamily: "var(--font-syne)", fontSize: 13, fontWeight: 700, color: "var(--color-text-primary)" }}>{formatAmount(a.balance, a.currency)}</span>
                        <StatusBadge value={a.status} />
                      </div>
                    </div>
                  ))
                }
              </PanelSection>

              {/* Status controls */}
              <PanelSection title="Account Status">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                  {STATUS_OPTS.map((opt) => (
                    <button key={opt.value} onClick={() => { setPendingStatus(opt.value); setConfirmModal({ action: opt.value, label: opt.label }); }}
                      style={{
                        padding: "9px 10px", borderRadius: 9, cursor: "pointer",
                        background: selected.status === opt.value ? `${opt.color}18` : "rgba(255,255,255,0.03)",
                        color: selected.status === opt.value ? opt.color : "var(--color-text-muted)",
                        fontWeight: 700, fontSize: 12,
                        border: `1px solid ${selected.status === opt.value ? `${opt.color}40` : "rgba(255,255,255,0.06)"}`,
                        transition: "all 0.15s ease",
                      }}>
                      {selected.status === opt.value ? "● " : ""}{opt.label}
                    </button>
                  ))}
                </div>

                {/* Restriction message */}
                <label style={labelStyle}>Restriction Message</label>
                <Select
                  value=""
                  onChange={(v) => { if (v) setRestrictMsg(v); }}
                  options={SCARY_MESSAGES.map((m) => ({ value: m.value, label: m.label }))}
                  placeholder="— Select preset message —"
                  style={{ marginBottom: 8, fontSize: 12 }}
                />
                <textarea
                  className="input-nexus"
                  rows={4}
                  maxLength={500}
                  placeholder="Custom restriction message…"
                  value={restrictMsg}
                  onChange={(e) => setRestrictMsg(e.target.value)}
                  style={{ resize: "vertical", fontSize: 12, fontFamily: "var(--font-jetbrains-mono)" }}
                />
                <div style={{ fontSize: 10, color: "var(--color-text-muted)", textAlign: "right", marginTop: 3 }}>{restrictMsg.length}/500</div>
                <button onClick={applyRestrictionMessage} className="btn-ghost" style={{ marginTop: 8, fontSize: 12, padding: "6px 14px" }} disabled={saving}>
                  Save Message
                </button>
              </PanelSection>

              {/* Email change */}
              <PanelSection title="Change Email (Admin Only)">
                <input className="input-nexus" style={{ fontSize: 13, marginBottom: 8 }} value={newEmail} onChange={(e) => setNewEmail(e.target.value)} type="email" />
                <button onClick={applyEmailChange} className="btn-ghost" style={{ fontSize: 12, padding: "6px 14px" }} disabled={saving || newEmail === selected.email}>
                  Update Email
                </button>
              </PanelSection>

              {/* 2FA reset */}
              <PanelSection title="Two-Factor Authentication">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 13, color: selected.twoFactorEnabled ? "var(--color-success)" : "var(--color-text-muted)" }}>
                    {selected.twoFactorEnabled ? "✓ Enabled" : "✕ Disabled"}
                  </span>
                  <button onClick={reset2FA} className="btn-danger" style={{ fontSize: 11, padding: "5px 12px" }} disabled={saving || !selected.twoFactorEnabled}>
                    Reset 2FA
                  </button>
                </div>
                <p style={{ fontSize: 11, color: "var(--color-text-muted)" }}>Resetting forces the user to re-enroll with a new authenticator code.</p>
              </PanelSection>

              {/* Transfer token */}
              <PanelSection title="Transfer Token">
                {selected.transferToken && !generatedToken && (
                  <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(240,180,41,0.06)", border: "1px solid rgba(240,180,41,0.15)", marginBottom: 10 }}>
                    <div style={{ fontSize: 10, color: G, marginBottom: 3 }}>ACTIVE TOKEN</div>
                    <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 12, color: "var(--color-text-muted)", letterSpacing: 1 }}>
                      {selected.transferToken.slice(0, 8)}…
                    </div>
                    <div style={{ fontSize: 10, color: "var(--color-text-muted)", marginTop: 3 }}>
                      Expires: {selected.transferTokenExp ? new Date(selected.transferTokenExp).toLocaleString() : "—"}
                    </div>
                  </div>
                )}
                {generatedToken && (
                  <div style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(0,229,160,0.06)", border: "1px solid rgba(0,229,160,0.2)", marginBottom: 10 }}>
                    <div style={{ fontSize: 10, color: "var(--color-success)", marginBottom: 3 }}>NEW TOKEN — COPY NOW</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <code style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: "var(--color-success)", flex: 1, overflowWrap: "break-word" }}>{generatedToken.token}</code>
                      <CopyButton text={generatedToken.token} label="Copy" />
                    </div>
                    <div style={{ fontSize: 10, color: "var(--color-text-muted)", marginTop: 4 }}>Expires: {new Date(generatedToken.expiresAt).toLocaleString()}</div>
                  </div>
                )}
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                  <Select
                    value={tokenExpiry}
                    onChange={(v) => setTokenExpiry(v)}
                    options={[
                      { value: "1h", label: "1 hour" },
                      { value: "6h", label: "6 hours" },
                      { value: "24h", label: "24 hours" },
                      { value: "72h", label: "72 hours" },
                    ]}
                    style={{ flex: 1, fontSize: 12 }}
                  />
                  <button onClick={generateTransferToken} className="btn-nexus" style={{ fontSize: 12, padding: "8px 14px", whiteSpace: "nowrap" }} disabled={tokenLoading}>
                    {tokenLoading ? "…" : "Generate"}
                  </button>
                </div>
                {(selected.transferToken || generatedToken) && (
                  <button onClick={revokeTransferToken} className="btn-danger" style={{ fontSize: 11, padding: "5px 12px", width: "100%" }} disabled={tokenLoading}>
                    Revoke Token
                  </button>
                )}
              </PanelSection>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation modal */}
      {confirmModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#0d1a30", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "32px 28px", maxWidth: 400, width: "100%", margin: "0 16px" }}>
            <h3 style={{ fontFamily: "var(--font-syne)", fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 12 }}>Confirm Action</h3>
            <p style={{ color: "var(--color-text-muted)", fontSize: 14, marginBottom: 8 }}>
              Set status of <strong style={{ color: "var(--color-text-primary)" }}>{selected?.firstName} {selected?.lastName}</strong> to:
            </p>
            <div style={{ padding: "8px 14px", borderRadius: 8, background: "rgba(255,59,92,0.08)", border: "1px solid rgba(255,59,92,0.2)", marginBottom: 20 }}>
              <span style={{ fontWeight: 700, color: "var(--color-danger)", fontSize: 14 }}>{confirmModal.action}</span>
            </div>
            {confirmModal.action === "RESTRICTED" && restrictMsg && (
              <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(0,0,0,0.3)", marginBottom: 16, fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: "rgba(255,150,160,0.9)" }}>
                Message: {restrictMsg}
              </div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmModal(null)} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
              <button onClick={applyStatusChange} className="btn-danger" style={{ flex: 1 }} disabled={saving}>{saving ? "Applying…" : "Confirm"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PanelSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(240,180,41,0.6)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10, paddingBottom: 6, borderBottom: "1px solid rgba(240,180,41,0.08)" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 11, fontWeight: 600,
  color: "var(--color-text-muted)", marginBottom: 6,
  letterSpacing: "0.06em", textTransform: "uppercase",
};
