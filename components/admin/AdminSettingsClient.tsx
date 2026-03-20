"use client";

import { useState, useEffect } from "react";

const G = "#F0B429";

const THEME_OPTIONS = [
  { value: "dark", label: "Dark (Default)", bg: "#03050a" },
  { value: "darkblue", label: "Dark Blue", bg: "#020d1f" },
  { value: "slate", label: "Deep Slate", bg: "#0a0f1a" },
  { value: "white", label: "Light / White", bg: "#f0f2f5" },
] as const;

function applyAdminTheme(theme: string) {
  if (typeof window === "undefined") return;
  const map: Record<string, string> = {
    dark: "#03050a", darkblue: "#020d1f", slate: "#0a0f1a", white: "#f0f2f5",
  };
  document.documentElement.style.setProperty("--admin-bg", map[theme] || "#03050a");
  localStorage.setItem("adminTheme", theme);
  // Also apply to the body background for admin
  document.body.style.background = map[theme] || "";
}

type Settings = {
  requireEmailConfirmForTransfers: boolean;
  requireTokenForTransfers: boolean;
  maintenanceMode: boolean;
  maxDailyTransferUSD: number;
  globalNotice: string | null;
  updatedAt: string;
};

function Toggle({ value, onChange, disabled }: { value: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      onClick={() => !disabled && onChange(!value)}
      disabled={disabled}
      style={{
        position: "relative", width: 48, height: 26, borderRadius: 13,
        background: value ? G : "rgba(255,255,255,0.1)",
        border: "none", cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.2s ease", flexShrink: 0,
      }}
    >
      <span style={{
        position: "absolute", top: 3, left: value ? 25 : 3,
        width: 20, height: 20, borderRadius: "50%",
        background: value ? "#03050a" : "#8899b5",
        transition: "left 0.2s ease",
        boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
      }} />
    </button>
  );
}

function ConfirmModal({ title, message, onConfirm, onCancel }: { title: string; message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#0d1a30", border: "1px solid rgba(240,180,41,0.25)", borderRadius: 16, padding: "28px 24px", maxWidth: 400, width: "90%" }}>
        <h3 style={{ fontFamily: "var(--font-syne)", fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 10 }}>{title}</h3>
        <p style={{ color: "var(--color-text-muted)", fontSize: 13, marginBottom: 22, lineHeight: 1.5 }}>{message}</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${G}, #d4991f)`, color: "#03050a", fontWeight: 800, fontSize: 14 }}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminSettingsClient() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [noticeInput, setNoticeInput] = useState("");
  const [maxTransfer, setMaxTransfer] = useState("");

  const [confirm, setConfirm] = useState<{ field: string; value: any; title: string; message: string } | null>(null);

  const [testEmail, setTestEmail] = useState("");
  const [testEmailSending, setTestEmailSending] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState("");

  // Admin profile state
  const [profileTab, setProfileTab] = useState<"password" | "email" | "name" | "2fa" | "create">("password");
  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  // Password change
  const [curPwd, setCurPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confPwd, setConfPwd] = useState("");
  // Email change
  const [newAdminEmail, setNewAdminEmail] = useState("");
  // Name change
  const [adminFirst, setAdminFirst] = useState("");
  const [adminLast, setAdminLast] = useState("");
  // Create admin
  const [caFirst, setCaFirst] = useState("");
  const [caLast, setCaLast] = useState("");
  const [caEmail, setCaEmail] = useState("");
  const [caPwd, setCaPwd] = useState("");
  // Color mode
  const [adminTheme, setAdminTheme] = useState("dark");
  // 2FA state
  const [tfa2Enabled, setTfa2Enabled] = useState<boolean | null>(null);
  const [tfaQr, setTfaQr] = useState("");
  const [tfaManualKey, setTfaManualKey] = useState("");
  const [tfaCode, setTfaCode] = useState("");
  const [tfaLoading, setTfaLoading] = useState(false);
  const [tfaMsg, setTfaMsg] = useState("");
  const [tfaErr, setTfaErr] = useState("");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("adminTheme") || "dark" : "dark";
    setAdminTheme(saved);
    // Fetch current 2FA status
    fetch("/api/user/profile").then(r => r.json()).then(d => {
      if (d.user) setTfa2Enabled(!!d.user.twoFactorEnabled);
    }).catch(() => {});
  }, []);

  async function startSetup2FA() {
    setTfaLoading(true); setTfaErr(""); setTfaMsg("");
    try {
      const res = await fetch("/api/two-factor/setup", { method: "POST" });
      const d = await res.json();
      if (!res.ok) { setTfaErr(d.error || "Failed to start 2FA setup"); return; }
      setTfaQr(d.qrCodeDataUrl);
      setTfaManualKey(d.manualKey);
    } catch { setTfaErr("Network error"); }
    finally { setTfaLoading(false); }
  }

  async function verify2FA() {
    if (tfaCode.length < 6) { setTfaErr("Enter the 6-digit code"); return; }
    setTfaLoading(true); setTfaErr("");
    try {
      const res = await fetch("/api/two-factor/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: tfaCode }),
      });
      const d = await res.json();
      if (!res.ok) { setTfaErr(d.error || "Invalid code"); return; }
      setTfa2Enabled(true); setTfaQr(""); setTfaManualKey(""); setTfaCode("");
      setTfaMsg("✓ 2FA enabled successfully — your admin account is now protected");
    } catch { setTfaErr("Network error"); }
    finally { setTfaLoading(false); }
  }

  async function disable2FA() {
    if (tfaCode.length < 6) { setTfaErr("Enter your 6-digit 2FA code to confirm"); return; }
    setTfaLoading(true); setTfaErr("");
    try {
      const res = await fetch("/api/two-factor/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: tfaCode }),
      });
      const d = await res.json();
      if (!res.ok) { setTfaErr(d.error || "Invalid code"); return; }
      setTfa2Enabled(false); setTfaCode("");
      setTfaMsg("2FA has been disabled on your admin account");
    } catch { setTfaErr("Network error"); }
    finally { setTfaLoading(false); }
  }

  async function profileAction(action: string, data: Record<string, string>) {
    setProfileLoading(true); setProfileMsg(""); setProfileErr("");
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...data }),
      });
      const d = await res.json();
      if (!res.ok) { setProfileErr(d.error || "Failed"); return; }
      setProfileMsg("Saved successfully");
      setCurPwd(""); setNewPwd(""); setConfPwd("");
      setNewAdminEmail(""); setAdminFirst(""); setAdminLast("");
      setCaFirst(""); setCaLast(""); setCaEmail(""); setCaPwd("");
      setTimeout(() => setProfileMsg(""), 3000);
    } catch { setProfileErr("Network error"); }
    finally { setProfileLoading(false); }
  }

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        setSettings(d.settings);
        setNoticeInput(d.settings.globalNotice ?? "");
        setMaxTransfer(String(d.settings.maxDailyTransferUSD));
        setLoading(false);
      });
  }, []);

  async function patch(data: Partial<Settings>) {
    setSaving(true); setError(""); setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.error || "Save failed"); return; }
      setSettings(d.settings);
      setNoticeInput(d.settings.globalNotice ?? "");
      setMaxTransfer(String(d.settings.maxDailyTransferUSD));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  }

  function requestToggle(field: keyof Settings, value: boolean, title: string, message: string) {
    setConfirm({ field, value, title, message });
  }

  async function sendTestEmail() {
    if (!testEmail) return;
    setTestEmailSending(true); setTestEmailResult("");
    const res = await fetch("/api/admin/test-email", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: testEmail }),
    });
    if (res.ok) setTestEmailResult("✓ Test email sent successfully");
    else setTestEmailResult("✕ Failed to send test email");
    setTestEmailSending(false);
  }

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "var(--color-text-muted)" }}>Loading settings…</div>;
  if (!settings) return null;

  const labelStyle = { display: "block" as const, fontSize: 11, fontWeight: 600 as const, color: "var(--color-text-muted)" as const, marginBottom: 6, letterSpacing: "0.06em" as const, textTransform: "uppercase" as const };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 720 }}>
      <div>
        <h1 style={{ fontFamily: "var(--font-syne)", fontSize: 24, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 4 }}>System Settings</h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>
          Last updated: {new Date(settings.updatedAt).toLocaleString()}
        </p>
      </div>

      {saved && (
        <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.25)", color: "var(--color-success)", fontSize: 13 }}>
          ✓ Settings saved successfully
        </div>
      )}
      {error && (
        <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(255,59,92,0.08)", border: "1px solid rgba(255,59,92,0.2)", color: "var(--color-danger)", fontSize: 13 }}>{error}</div>
      )}

      {/* Security toggles */}
      <div style={{ background: "rgba(6,12,24,0.7)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "22px 20px" }}>
        <h3 style={{ fontFamily: "var(--font-syne)", fontSize: 15, fontWeight: 700, color: G, marginBottom: 18 }}>Security Controls</h3>

        {[
          {
            field: "requireTokenForTransfers" as keyof Settings,
            value: settings.requireTokenForTransfers,
            label: "Transfer Token Requirement",
            desc: "Users must have a valid admin-issued transfer token to initiate any transaction. Used for restricted accounts.",
            confirmTitle: settings.requireTokenForTransfers ? "Disable Token Requirement" : "Enable Token Requirement",
            confirmMsg: settings.requireTokenForTransfers
              ? "Users will no longer need an admin token to transfer funds globally."
              : "All users will need an admin-issued transfer token. Existing transfers in progress may be affected.",
          },
          {
            field: "maintenanceMode" as keyof Settings,
            value: settings.maintenanceMode,
            label: "Maintenance Mode",
            desc: "All users are redirected to a maintenance page. Admins retain access. Use during schema migrations or critical fixes.",
            confirmTitle: settings.maintenanceMode ? "Disable Maintenance Mode" : "Enable Maintenance Mode",
            confirmMsg: settings.maintenanceMode
              ? "The platform will be accessible to all users immediately."
              : "⚠ All non-admin users will be locked out immediately and redirected to the maintenance page.",
          },
        ].map((item) => (
          <div key={item.field} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ flex: 1, marginRight: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)", marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: "var(--color-text-muted)", lineHeight: 1.5 }}>{item.desc}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              <span style={{ fontSize: 12, color: item.value ? (item.field === "maintenanceMode" ? "var(--color-danger)" : G) : "var(--color-text-muted)" }}>
                {item.value ? "ON" : "OFF"}
              </span>
              <Toggle
                value={item.value as boolean}
                onChange={() => requestToggle(item.field, !item.value, item.confirmTitle, item.confirmMsg)}
                disabled={saving}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Transfer limits */}
      <div style={{ background: "rgba(6,12,24,0.7)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "22px 20px" }}>
        <h3 style={{ fontFamily: "var(--font-syne)", fontSize: 15, fontWeight: 700, color: G, marginBottom: 18 }}>Transfer Limits</h3>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Max Daily Transfer (USD equivalent)</label>
            <input
              className="input-nexus" type="number" min="100" max="10000000" step="100"
              value={maxTransfer} onChange={(e) => setMaxTransfer(e.target.value)}
            />
            <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 4 }}>
              Current: ${Number(settings.maxDailyTransferUSD).toLocaleString()} USD per day per user
            </div>
          </div>
          <button
            onClick={() => patch({ maxDailyTransferUSD: parseFloat(maxTransfer) })}
            disabled={saving || !maxTransfer || parseFloat(maxTransfer) === settings.maxDailyTransferUSD}
            style={{ padding: "11px 22px", borderRadius: 10, border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${G}, #d4991f)`, color: "#03050a", fontWeight: 800, fontSize: 14, opacity: parseFloat(maxTransfer) === settings.maxDailyTransferUSD ? 0.4 : 1 }}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {/* Global notice */}
      <div style={{ background: "rgba(6,12,24,0.7)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "22px 20px" }}>
        <h3 style={{ fontFamily: "var(--font-syne)", fontSize: 15, fontWeight: 700, color: G, marginBottom: 6 }}>Global Notice Banner</h3>
        <p style={{ fontSize: 12, color: "var(--color-text-muted)", marginBottom: 16 }}>Displayed at the top of every page for all logged-in users. Leave empty to hide.</p>
        <textarea
          className="input-nexus" rows={3} maxLength={500} style={{ resize: "vertical", fontSize: 13 }}
          placeholder="Enter a notice for all users… (e.g. 'Scheduled maintenance on Dec 15 at 02:00 UTC')"
          value={noticeInput} onChange={(e) => setNoticeInput(e.target.value)}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{noticeInput.length}/500</span>
          <div style={{ display: "flex", gap: 8 }}>
            {settings.globalNotice && (
              <button onClick={() => { setNoticeInput(""); patch({ globalNotice: null }); }} className="btn-ghost" style={{ padding: "8px 14px", fontSize: 13 }}>
                Clear Notice
              </button>
            )}
            <button
              onClick={() => patch({ globalNotice: noticeInput || null })}
              disabled={saving || noticeInput === (settings.globalNotice ?? "")}
              style={{ padding: "9px 20px", borderRadius: 9, border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${G}, #d4991f)`, color: "#03050a", fontWeight: 800, fontSize: 13, opacity: noticeInput === (settings.globalNotice ?? "") ? 0.4 : 1 }}>
              {saving ? "Saving…" : "Publish Notice"}
            </button>
          </div>
        </div>
        {noticeInput && (
          <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: "rgba(240,180,41,0.08)", border: "1px solid rgba(240,180,41,0.2)", fontSize: 13, color: G }}>
            Preview: {noticeInput}
          </div>
        )}
      </div>

      {/* Email test */}
      <div style={{ background: "rgba(6,12,24,0.7)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "22px 20px" }}>
        <h3 style={{ fontFamily: "var(--font-syne)", fontSize: 15, fontWeight: 700, color: G, marginBottom: 6 }}>Email Service Test</h3>
        <p style={{ fontSize: 12, color: "var(--color-text-muted)", marginBottom: 16 }}>Send a test email to verify SMTP configuration is working correctly.</p>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Recipient Email</label>
            <input className="input-nexus" type="email" placeholder="test@example.com" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} />
          </div>
          <button onClick={sendTestEmail} disabled={testEmailSending || !testEmail}
            style={{ padding: "11px 20px", borderRadius: 10, border: "1px solid rgba(0,212,255,0.3)", background: "rgba(0,212,255,0.06)", color: "var(--color-accent)", fontWeight: 700, fontSize: 13, cursor: "pointer", opacity: !testEmail ? 0.4 : 1 }}>
            {testEmailSending ? "Sending…" : "Send Test"}
          </button>
        </div>
        {testEmailResult && (
          <div style={{ marginTop: 10, fontSize: 13, color: testEmailResult.startsWith("✓") ? "var(--color-success)" : "var(--color-danger)" }}>
            {testEmailResult}
          </div>
        )}
      </div>

      {/* ── Admin Profile ── */}
      <div style={{ background: "rgba(6,12,24,0.7)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "22px 20px" }}>
        <h3 style={{ fontFamily: "var(--font-syne)", fontSize: 15, fontWeight: 700, color: G, marginBottom: 18 }}>Admin Profile</h3>

        {/* Sub-tabs */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 0, overflowX: "auto" }}>
          {(["password", "email", "name", "2fa", "create"] as const).map(t => (
            <button key={t} type="button" onClick={() => { setProfileTab(t as any); setProfileMsg(""); setProfileErr(""); setTfaErr(""); setTfaMsg(""); }}
              style={{
                padding: "8px 14px", fontSize: 12, fontWeight: profileTab === t ? 700 : 500, background: "none", border: "none",
                cursor: "pointer", borderBottom: profileTab === t ? `2px solid ${G}` : "2px solid transparent",
                color: profileTab === t ? G : "rgba(255,255,255,0.4)", marginBottom: -1,
                flexShrink: 0, whiteSpace: "nowrap",
              }}>
              {t === "password" ? "Change Password" : t === "email" ? "Change Email" : t === "name" ? "Change Name" : t === "2fa" ? "🛡 2FA Security" : "Create Admin"}
            </button>
          ))}
        </div>

        {profileMsg && <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.2)", color: "var(--color-success)", fontSize: 13, marginBottom: 14 }}>✓ {profileMsg}</div>}
        {profileErr && <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(255,59,92,0.08)", border: "1px solid rgba(255,59,92,0.2)", color: "var(--color-danger)", fontSize: 13, marginBottom: 14 }}>✗ {profileErr}</div>}

        {profileTab === "password" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={labelStyle}>Current Password</label>
              <input className="input-nexus" type="password" value={curPwd} onChange={e => setCurPwd(e.target.value)} placeholder="Your current password" />
            </div>
            <div>
              <label style={labelStyle}>New Password</label>
              <input className="input-nexus" type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="Min 8 characters" />
            </div>
            <div>
              <label style={labelStyle}>Confirm New Password</label>
              <input className="input-nexus" type="password" value={confPwd} onChange={e => setConfPwd(e.target.value)} placeholder="Repeat new password" />
            </div>
            <button onClick={() => {
              if (newPwd !== confPwd) { setProfileErr("Passwords do not match"); return; }
              if (newPwd.length < 8) { setProfileErr("Password must be at least 8 characters"); return; }
              profileAction("CHANGE_PASSWORD", { currentPassword: curPwd, newPassword: newPwd });
            }} disabled={profileLoading}
              style={{ padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${G}, #d4991f)`, color: "#03050a", fontWeight: 800, fontSize: 13 }}>
              {profileLoading ? "Saving…" : "Update Password"}
            </button>
          </div>
        )}

        {profileTab === "email" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={labelStyle}>New Email Address</label>
              <input className="input-nexus" type="email" value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} placeholder="new@email.com" />
            </div>
            <button onClick={() => profileAction("CHANGE_EMAIL", { newEmail: newAdminEmail })} disabled={profileLoading}
              style={{ padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${G}, #d4991f)`, color: "#03050a", fontWeight: 800, fontSize: 13 }}>
              {profileLoading ? "Saving…" : "Update Email"}
            </button>
          </div>
        )}

        {profileTab === "name" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>First Name</label>
                <input className="input-nexus" value={adminFirst} onChange={e => setAdminFirst(e.target.value)} placeholder="First name" />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input className="input-nexus" value={adminLast} onChange={e => setAdminLast(e.target.value)} placeholder="Last name" />
              </div>
            </div>
            <button onClick={() => profileAction("CHANGE_NAME", { firstName: adminFirst, lastName: adminLast })} disabled={profileLoading}
              style={{ padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${G}, #d4991f)`, color: "#03050a", fontWeight: 800, fontSize: 13 }}>
              {profileLoading ? "Saving…" : "Update Name"}
            </button>
          </div>
        )}

        {profileTab === "create" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(240,180,41,0.06)", border: "1px solid rgba(240,180,41,0.15)", fontSize: 12, color: G }}>
              ⚠ This creates a new administrator account with full admin privileges.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>First Name</label>
                <input className="input-nexus" value={caFirst} onChange={e => setCaFirst(e.target.value)} placeholder="First name" />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input className="input-nexus" value={caLast} onChange={e => setCaLast(e.target.value)} placeholder="Last name" />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input className="input-nexus" type="email" value={caEmail} onChange={e => setCaEmail(e.target.value)} placeholder="admin@example.com" />
            </div>
            <div>
              <label style={labelStyle}>Password (min 8 chars)</label>
              <input className="input-nexus" type="password" value={caPwd} onChange={e => setCaPwd(e.target.value)} placeholder="Strong password" />
            </div>
            <button onClick={() => profileAction("CREATE_ADMIN", { firstName: caFirst, lastName: caLast, email: caEmail, password: caPwd })} disabled={profileLoading}
              style={{ padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer", background: "linear-gradient(135deg, #FF3B5C, #cc1f3a)", color: "#fff", fontWeight: 800, fontSize: 13 }}>
              {profileLoading ? "Creating…" : "Create Admin Account"}
            </button>
          </div>
        )}

        {profileTab === "2fa" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {tfaMsg && <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.2)", color: "var(--color-success)", fontSize: 13 }}>{tfaMsg}</div>}
            {tfaErr && <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(255,59,92,0.08)", border: "1px solid rgba(255,59,92,0.2)", color: "var(--color-danger)", fontSize: 13 }}>{tfaErr}</div>}

            {/* 2FA status card */}
            <div style={{ padding: "16px 18px", borderRadius: 12, background: tfa2Enabled ? "rgba(0,229,160,0.05)" : "rgba(255,59,92,0.05)", border: `1px solid ${tfa2Enabled ? "rgba(0,229,160,0.2)" : "rgba(255,59,92,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 28 }}>🛡</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text-primary)" }}>Two-Factor Authentication</div>
                  <div style={{ fontSize: 12, color: tfa2Enabled ? "var(--color-success)" : "var(--color-danger)", fontWeight: 600, marginTop: 2 }}>
                    {tfa2Enabled === null ? "Loading…" : tfa2Enabled ? "✓ Enabled — Admin account is protected" : "✗ Disabled — Recommended to enable"}
                  </div>
                </div>
              </div>
              {tfa2Enabled === false && !tfaQr && (
                <button onClick={startSetup2FA} disabled={tfaLoading} className="btn-nexus" style={{ padding: "9px 18px", fontSize: 13 }}>
                  {tfaLoading ? "Setting up…" : "Enable 2FA"}
                </button>
              )}
            </div>

            {/* Setup flow: QR + manual key */}
            {!tfa2Enabled && tfaQr && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "18px", borderRadius: 12, background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.15)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }}>1. Scan this QR code with your authenticator app</div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <img src={tfaQr} alt="2FA QR Code" width={200} height={200} style={{ borderRadius: 10, border: "2px solid rgba(0,212,255,0.2)" }} />
                </div>
                <div style={{ fontSize: 13, color: "var(--color-text-muted)" }}>Or enter this key manually:</div>
                <code style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 13, color: "var(--color-accent)", background: "rgba(0,212,255,0.06)", padding: "8px 12px", borderRadius: 8, letterSpacing: 2, wordBreak: "break-all" }}>{tfaManualKey}</code>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)", marginTop: 4 }}>2. Enter the 6-digit code from your app to confirm</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <input className="input-nexus" value={tfaCode} onChange={e => setTfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000" maxLength={6} style={{ flex: 1, letterSpacing: 6, fontSize: 18, textAlign: "center" }} />
                  <button onClick={verify2FA} disabled={tfaLoading} className="btn-nexus" style={{ padding: "10px 20px" }}>
                    {tfaLoading ? "Verifying…" : "Confirm"}
                  </button>
                </div>
              </div>
            )}

            {/* Disable flow */}
            {tfa2Enabled && (
              <div style={{ padding: "16px 18px", borderRadius: 12, background: "rgba(255,59,92,0.04)", border: "1px solid rgba(255,59,92,0.15)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)", marginBottom: 10 }}>Disable Two-Factor Authentication</div>
                <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginBottom: 14 }}>Enter your current 6-digit 2FA code to disable. This will remove 2FA protection from your admin account.</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <input className="input-nexus" value={tfaCode} onChange={e => setTfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="6-digit code" maxLength={6} style={{ flex: 1, letterSpacing: 6, fontSize: 18, textAlign: "center" }} />
                  <button onClick={disable2FA} disabled={tfaLoading}
                    style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid rgba(255,59,92,0.3)", background: "rgba(255,59,92,0.08)", color: "var(--color-danger)", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
                    {tfaLoading ? "Disabling…" : "Disable 2FA"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Color Mode ── */}
      <div style={{ background: "rgba(6,12,24,0.7)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "22px 20px" }}>
        <h3 style={{ fontFamily: "var(--font-syne)", fontSize: 15, fontWeight: 700, color: G, marginBottom: 6 }}>Admin Dashboard Theme</h3>
        <p style={{ fontSize: 12, color: "var(--color-text-muted)", marginBottom: 16 }}>Change the background colour mode of the admin dashboard.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
          {THEME_OPTIONS.map(opt => (
            <button key={opt.value} type="button"
              onClick={() => { setAdminTheme(opt.value); applyAdminTheme(opt.value); }}
              style={{
                padding: "12px 14px", borderRadius: 10, cursor: "pointer", textAlign: "left",
                border: adminTheme === opt.value ? `1px solid ${G}` : "1px solid rgba(255,255,255,0.08)",
                background: adminTheme === opt.value ? "rgba(240,180,41,0.08)" : "rgba(255,255,255,0.02)",
              }}>
              <div style={{ width: "100%", height: 28, borderRadius: 6, background: opt.bg, border: "1px solid rgba(255,255,255,0.1)", marginBottom: 8 }} />
              <div style={{ fontSize: 12, fontWeight: adminTheme === opt.value ? 700 : 400, color: adminTheme === opt.value ? G : "rgba(255,255,255,0.6)" }}>
                {adminTheme === opt.value ? "✓ " : ""}{opt.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Confirm modal */}
      {confirm && (
        <ConfirmModal
          title={confirm.title}
          message={confirm.message}
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            patch({ [confirm.field]: confirm.value });
            setConfirm(null);
          }}
        />
      )}
    </div>
  );
}
