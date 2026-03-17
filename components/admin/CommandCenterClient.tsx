"use client";

import Link from "next/link";
import { useState } from "react";
import { formatAmount } from "@/lib/utils";

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
};

interface AuditLog {
  id: string; action: string; target: string | null;
  details: any; ipAddress: string | null; createdAt: Date;
  user: { firstName: string; lastName: string; email: string } | null;
}
interface Stats {
  pendingCount: number; activeCount: number; restrictedDisabled: number;
  todayTxCount: number; todayVolume: number; failedCount: number;
}

export default function CommandCenterClient({ stats, auditLogs }: { stats: Stats; auditLogs: AuditLog[] }) {
  const [maintenanceToggling, setMaintenanceToggling] = useState(false);

  async function toggleMaintenance() {
    setMaintenanceToggling(true);
    try {
      const res = await fetch("/api/admin/settings");
      const { settings } = await res.json();
      await fetch("/api/admin/settings", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maintenanceMode: !settings.maintenanceMode }),
      });
      window.location.reload();
    } finally { setMaintenanceToggling(false); }
  }

  const statCards = [
    { label: "Pending Activation", value: stats.pendingCount, icon: "⏳", color: G, glow: "rgba(240,180,41,0.12)", link: "/admin/users?status=PENDING_ACTIVATION", alert: stats.pendingCount > 0 },
    { label: "Active Users", value: stats.activeCount, icon: "✓", color: "var(--color-success)", glow: "rgba(0,229,160,0.08)", link: "/admin/users?status=ACTIVE" },
    { label: "Restricted / Disabled", value: stats.restrictedDisabled, icon: "⊘", color: "var(--color-danger)", glow: "rgba(255,59,92,0.08)", link: "/admin/users" },
    { label: "Transactions Today", value: stats.todayTxCount, icon: "⇄", color: "var(--color-accent)", glow: "rgba(0,212,255,0.08)", link: "/admin/transactions" },
    { label: "Volume Today (USD)", value: formatAmount(stats.todayVolume, "USD"), icon: "◎", color: "#a78bfa", glow: "rgba(167,139,250,0.08)", link: "/admin/transactions" },
    { label: "Failed (24h)", value: stats.failedCount, icon: "✕", color: "var(--color-danger)", glow: "rgba(255,59,92,0.08)", link: "/admin/transactions?status=FAILED" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 22, filter: `drop-shadow(0 0 8px ${G})` }}>🛡</span>
          <h1 style={{ fontFamily: "var(--font-syne)", fontSize: 26, fontWeight: 800, color: "var(--color-text-primary)" }}>
            Command Center
          </h1>
        </div>
        <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Pending activation alert */}
      {stats.pendingCount > 0 && (
        <Link href="/admin/users?status=PENDING_ACTIVATION" style={{ textDecoration: "none" }}>
          <div style={{
            padding: "14px 20px", borderRadius: 12,
            background: "linear-gradient(90deg, rgba(240,180,41,0.12), rgba(240,180,41,0.06))",
            border: `1px solid rgba(240,180,41,0.3)`,
            display: "flex", alignItems: "center", gap: 12,
            cursor: "pointer", transition: "border-color 0.2s ease",
          }}>
            <span style={{ fontSize: 22 }}>⚠️</span>
            <div>
              <div style={{ fontWeight: 700, color: G, fontSize: 14 }}>
                {stats.pendingCount} user{stats.pendingCount !== 1 ? "s" : ""} awaiting activation
              </div>
              <div style={{ fontSize: 12, color: "rgba(240,180,41,0.6)" }}>Click to review and activate pending accounts →</div>
            </div>
          </div>
        </Link>
      )}

      {/* Stats grid */}
      <div className="cmd-stats-grid">
        {statCards.map((s) => (
          <Link key={s.label} href={s.link} style={{ textDecoration: "none" }}>
            <div style={{
              padding: "20px 22px", borderRadius: 14,
              background: s.glow,
              border: `1px solid ${s.color}22`,
              transition: "border-color 0.2s ease, box-shadow 0.2s ease",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
            }}>
              {s.alert && (
                <span style={{
                  position: "absolute", top: 10, right: 10,
                  width: 8, height: 8, borderRadius: "50%",
                  background: G, boxShadow: `0 0 8px ${G}`,
                  animation: "pulse-slow 2s ease-in-out infinite",
                }} />
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9,
                  background: `${s.color}18`, border: `1px solid ${s.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 15, color: s.color,
                }}>
                  {s.icon}
                </div>
                <span style={{ fontSize: 11, color: "var(--color-text-muted)", fontWeight: 600, letterSpacing: "0.04em", fontFamily: "var(--font-dm-sans)" }}>
                  {s.label}
                </span>
              </div>
              <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: typeof s.value === "string" ? 18 : 28, fontWeight: 600, color: s.color }}>
                {s.value}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Body: Activity feed + Quick Actions */}
      <div className="cmd-body-grid">

        {/* Activity feed */}
        <div>
          <h2 style={{ fontFamily: "var(--font-syne)", fontSize: 16, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 14 }}>
            Recent Activity
          </h2>
          <div style={{ background: "rgba(6,12,24,0.7)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, overflow: "hidden" }}>
            {auditLogs.map((log, i) => {
              const color = ACTION_COLORS[log.action] ?? "#8899b5";
              return (
                <div key={log.id} style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  padding: "12px 16px",
                  borderBottom: i < auditLogs.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  transition: "background 0.15s ease",
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 5px ${color}`, flexShrink: 0, marginTop: 5 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                      <span style={{ fontWeight: 600, color, fontFamily: "var(--font-jetbrains-mono)", fontSize: 11 }}>
                        {log.action}
                      </span>
                      <span style={{ fontSize: 10, color: "var(--color-text-muted)", whiteSpace: "nowrap", flexShrink: 0 }}>
                        {new Date(log.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    {log.user && (
                      <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 2 }}>
                        {log.user.firstName} {log.user.lastName} · {log.user.email}
                      </div>
                    )}
                    {log.ipAddress && (
                      <div style={{ fontSize: 10, color: "var(--color-text-muted)", marginTop: 1, fontFamily: "var(--font-jetbrains-mono)" }}>
                        {log.ipAddress}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {auditLogs.length === 0 && (
              <div style={{ padding: 32, textAlign: "center", color: "var(--color-text-muted)", fontSize: 13 }}>No activity yet</div>
            )}
          </div>
        </div>

        {/* Quick Actions + System Health */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-syne)", fontSize: 16, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 14 }}>
              Quick Actions
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { href: "/admin/users?status=PENDING_ACTIVATION", icon: "✓", label: "Activate Users", color: "var(--color-success)", bg: "rgba(0,229,160,0.08)", border: "rgba(0,229,160,0.2)" },
                { href: "/admin/deposits", icon: "⊕", label: "Deposit Funds", color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.2)" },
                { href: "/admin/settings", icon: "⚙", label: "System Settings", color: G, bg: "rgba(240,180,41,0.08)", border: "rgba(240,180,41,0.2)" },
                { href: "/admin/transactions", icon: "⇄", label: "All Transactions", color: "var(--color-accent)", bg: "rgba(0,212,255,0.08)", border: "rgba(0,212,255,0.2)" },
              ].map((a) => (
                <Link key={a.href} href={a.href} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
                  borderRadius: 10, background: a.bg, border: `1px solid ${a.border}`,
                  textDecoration: "none", transition: "all 0.15s ease",
                }}>
                  <span style={{ fontSize: 16, color: a.color }}>{a.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }}>{a.label}</span>
                  <span style={{ marginLeft: "auto", color: a.color, fontSize: 12 }}>→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* System health */}
          <div style={{ background: "rgba(6,12,24,0.7)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: "18px 16px" }}>
            <h3 style={{ fontFamily: "var(--font-syne)", fontSize: 14, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 14 }}>System Health</h3>
            {[
              { label: "Database", status: "Operational", color: "var(--color-success)" },
              { label: "Email Service", status: "Operational", color: "var(--color-success)" },
              { label: "Authentication", status: "Operational", color: "var(--color-success)" },
            ].map((s) => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{s.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: s.color, display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.color, display: "inline-block" }} />
                  {s.status}
                </span>
              </div>
            ))}
            <button
              onClick={toggleMaintenance}
              disabled={maintenanceToggling}
              style={{
                marginTop: 14, width: "100%", padding: "8px", borderRadius: 8,
                background: "rgba(255,59,92,0.08)", border: "1px solid rgba(255,59,92,0.2)",
                color: "var(--color-danger)", fontSize: 12, fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {maintenanceToggling ? "Updating…" : "⚠ Toggle Maintenance Mode"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
