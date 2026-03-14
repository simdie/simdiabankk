"use client";

import { useState } from "react";
import Link from "next/link";

interface LoginRecord {
  id: string; ipAddress: string | null; userAgent: string | null;
  status: string; createdAt: string;
}

export default function SecurityClient({
  twoFactorEnabled, hasTransferToken, transferTokenExp, loginHistory,
}: {
  twoFactorEnabled: boolean;
  hasTransferToken: boolean;
  transferTokenExp: string | null;
  loginHistory: LoginRecord[];
}) {
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [pwError, setPwError] = useState("");

  const tokenExpired = transferTokenExp ? new Date(transferTokenExp) < new Date() : true;

  async function handlePasswordChange() {
    if (passwords.newPass !== passwords.confirm) { setPwError("Passwords don't match"); return; }
    if (passwords.newPass.length < 8) { setPwError("New password must be at least 8 characters"); return; }
    setPwLoading(true); setPwError(""); setPwMsg("");
    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword: passwords.current, newPassword: passwords.newPass }),
      });
      const data = await res.json();
      if (!res.ok) { setPwError(data.error || "Failed to update password"); return; }
      setPwMsg("Password changed successfully!");
      setPasswords({ current: "", newPass: "", confirm: "" });
      setTimeout(() => setPwMsg(""), 4000);
    } finally { setPwLoading(false); }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    background: "rgba(6,12,24,0.7)", border: "1px solid rgba(255,255,255,0.08)",
    color: "#f0f4ff", fontSize: 14, outline: "none", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
    textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 6,
  };
  const cardStyle: React.CSSProperties = {
    padding: "24px 28px", borderRadius: 16, background: "rgba(13,26,48,0.6)",
    border: "1px solid rgba(255,255,255,0.06)", marginBottom: 20,
  };

  return (
    <div style={{ maxWidth: 780, margin: "0 auto" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#f0f4ff", marginBottom: 4 }}>Security Center</h1>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 14 }}>Manage your account security settings and review login activity.</p>
      </div>

      {/* 2FA Status */}
      <div style={{ ...cardStyle, background: twoFactorEnabled ? "rgba(0,229,160,0.04)" : "rgba(255,59,92,0.04)", border: `1px solid ${twoFactorEnabled ? "rgba(0,229,160,0.15)" : "rgba(255,59,92,0.15)"}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: 32 }}>🛡</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#f0f4ff", marginBottom: 4 }}>Two-Factor Authentication</div>
              <div style={{ fontSize: 13, color: twoFactorEnabled ? "#00E5A0" : "#FF3B5C", fontWeight: 600 }}>
                {twoFactorEnabled ? "✓ Enabled — Your account is protected" : "✗ Disabled — Recommended to enable"}
              </div>
            </div>
          </div>
          <Link href="/dashboard/settings" style={{
            padding: "9px 18px", borderRadius: 9, fontSize: 13, fontWeight: 600,
            background: twoFactorEnabled ? "rgba(0,229,160,0.08)" : "rgba(0,212,255,0.1)",
            border: `1px solid ${twoFactorEnabled ? "rgba(0,229,160,0.2)" : "rgba(0,212,255,0.2)"}`,
            color: twoFactorEnabled ? "#00E5A0" : "#00D4FF", textDecoration: "none",
          }}>
            {twoFactorEnabled ? "Manage 2FA" : "Enable 2FA"}
          </Link>
        </div>
      </div>

      {/* Transfer token status */}
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#f0f4ff", marginBottom: 4 }}>🔑 Transfer Token</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
              {!hasTransferToken ? "No token assigned" :
                tokenExpired ? "Token expired — request a new one from Settings" :
                  `Active until ${new Date(transferTokenExp!).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}`
              }
            </div>
          </div>
          <Link href="/dashboard/settings" style={{
            padding: "9px 18px", borderRadius: 9, fontSize: 13, fontWeight: 600,
            background: "rgba(240,180,41,0.08)", border: "1px solid rgba(240,180,41,0.2)",
            color: "#F0B429", textDecoration: "none",
          }}>
            Manage Token
          </Link>
        </div>
      </div>

      {/* Change password */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f0f4ff", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
          🔐 Change Password
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 400 }}>
          <div>
            <label style={labelStyle}>Current Password</label>
            <input type="password" value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>New Password</label>
            <input type="password" value={passwords.newPass} onChange={e => setPasswords(p => ({ ...p, newPass: e.target.value }))} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Confirm New Password</label>
            <input type="password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} style={inputStyle} />
          </div>
          {pwError && <div style={{ fontSize: 13, color: "#FF3B5C" }}>{pwError}</div>}
          {pwMsg && <div style={{ fontSize: 13, color: "#00E5A0" }}>✓ {pwMsg}</div>}
          <button onClick={handlePasswordChange} disabled={pwLoading} style={{
            padding: "11px 24px", borderRadius: 10, border: "none", cursor: pwLoading ? "not-allowed" : "pointer",
            background: pwLoading ? "rgba(0,212,255,0.3)" : "linear-gradient(135deg, #00D4FF, #0088CC)",
            color: "#03050a", fontWeight: 700, fontSize: 13, alignSelf: "flex-start",
          }}>
            {pwLoading ? "Updating…" : "Update Password"}
          </button>
        </div>
      </div>

      {/* Login history */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f0f4ff", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
          📋 Login History
        </h3>
        {loginHistory.length === 0 ? (
          <div style={{ padding: "20px 0", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
            No login records found.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="login-history-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Date & Time", "IP Address", "Device / Browser", "Status"].map(h => (
                    <th key={h} style={{ padding: "8px 12px", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loginHistory.map(r => (
                  <tr key={r.id}>
                    <td style={{ padding: "10px 12px", fontSize: 12, color: "rgba(255,255,255,0.6)", whiteSpace: "nowrap" }}>
                      {new Date(r.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: 12, color: "#f0f4ff", fontFamily: "monospace" }}>
                      {r.ipAddress || "Unknown"}
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: 11, color: "rgba(255,255,255,0.4)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {r.userAgent?.substring(0, 60) || "Unknown"}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{
                        padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 700,
                        color: r.status === "SUCCESS" ? "#00E5A0" : "#FF3B5C",
                        background: r.status === "SUCCESS" ? "rgba(0,229,160,0.1)" : "rgba(255,59,92,0.1)",
                        border: `1px solid ${r.status === "SUCCESS" ? "rgba(0,229,160,0.25)" : "rgba(255,59,92,0.25)"}`,
                      }}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
