"use client";

import { useState } from "react";

interface User {
  firstName: string; lastName: string; email: string; phone: string | null;
  twoFactorEnabled: boolean; transferToken?: string | null; transferTokenExp?: string | null;
}

export default function SettingsClient({ user }: { user: User }) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [pwError, setPwError] = useState("");

  const [twoFAEnabled, setTwoFAEnabled] = useState(user.twoFactorEnabled);
  const [qrCode, setQrCode] = useState("");
  const [manualKey, setManualKey] = useState("");
  const [setupCode, setSetupCode] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [tfaLoading, setTfaLoading] = useState(false);
  const [tfaMsg, setTfaMsg] = useState("");
  const [tfaError, setTfaError] = useState("");

  async function saveProfile() {
    setProfileSaving(true); setProfileMsg("");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, phone }),
      });
      setProfileMsg(res.ok ? "Profile updated successfully" : "Failed to update profile");
    } finally { setProfileSaving(false); }
  }

  async function changePassword() {
    setPwError(""); setPwMsg("");
    if (newPassword !== confirmPassword) { setPwError("Passwords do not match"); return; }
    if (newPassword.length < 8) { setPwError("Password must be at least 8 characters"); return; }
    setPwSaving(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) { setPwMsg("Password changed successfully"); setOldPassword(""); setNewPassword(""); setConfirmPassword(""); }
      else setPwError(data.error || "Failed to change password");
    } finally { setPwSaving(false); }
  }

  async function setup2FA() {
    setTfaLoading(true); setTfaError(""); setTfaMsg("");
    try {
      const res = await fetch("/api/two-factor/setup", { method: "POST" });
      const data = await res.json();
      if (res.ok) { setQrCode(data.qrCodeDataUrl); setManualKey(data.manualKey); }
      else setTfaError(data.error);
    } finally { setTfaLoading(false); }
  }

  async function verify2FA() {
    setTfaLoading(true); setTfaError(""); setTfaMsg("");
    try {
      const res = await fetch("/api/two-factor/verify", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: setupCode }),
      });
      const data = await res.json();
      if (res.ok) { setTwoFAEnabled(true); setQrCode(""); setManualKey(""); setSetupCode(""); setTfaMsg("2FA enabled successfully!"); }
      else setTfaError(data.error);
    } finally { setTfaLoading(false); }
  }

  async function disable2FA() {
    setTfaLoading(true); setTfaError(""); setTfaMsg("");
    try {
      const res = await fetch("/api/two-factor/disable", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: disableCode }),
      });
      const data = await res.json();
      if (res.ok) { setTwoFAEnabled(false); setDisableCode(""); setTfaMsg("2FA disabled."); }
      else setTfaError(data.error);
    } finally { setTfaLoading(false); }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 640 }}>
      <div>
        <h1 style={{ fontFamily: "var(--font-syne)", fontSize: 24, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 4 }}>Settings</h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>Manage your profile, security, and preferences</p>
      </div>

      {/* ── Profile ── */}
      <Section title="Profile Information" icon="👤">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="First Name"><input className="input-nexus" value={firstName} onChange={(e) => setFirstName(e.target.value)} /></Field>
          <Field label="Last Name"><input className="input-nexus" value={lastName} onChange={(e) => setLastName(e.target.value)} /></Field>
        </div>
        <Field label="Email Address">
          <div style={{ position: "relative" }}>
            <input className="input-nexus" value={user.email} readOnly style={{ paddingRight: 120, opacity: 0.7 }} />
            <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "var(--color-text-muted)", background: "rgba(255,255,255,0.04)", padding: "2px 8px", borderRadius: 6 }}>
              Contact admin
            </span>
          </div>
        </Field>
        <Field label="Phone Number"><input className="input-nexus" placeholder="+1 555 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
        {profileMsg && <Msg text={profileMsg} type="success" />}
        <button onClick={saveProfile} className="btn-nexus" style={{ alignSelf: "flex-start" }} disabled={profileSaving}>
          {profileSaving ? "Saving…" : "Save Changes"}
        </button>
      </Section>

      {/* ── Password ── */}
      <Section title="Change Password" icon="🔑">
        <Field label="Current Password"><input type="password" className="input-nexus" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Enter current password" /></Field>
        <Field label="New Password"><input type="password" className="input-nexus" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 8 characters" /></Field>
        <Field label="Confirm New Password"><input type="password" className="input-nexus" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat new password" /></Field>
        {pwError && <Msg text={pwError} type="error" />}
        {pwMsg && <Msg text={pwMsg} type="success" />}
        <button onClick={changePassword} className="btn-nexus" style={{ alignSelf: "flex-start" }} disabled={pwSaving}>
          {pwSaving ? "Changing…" : "Change Password"}
        </button>
      </Section>

      {/* ── 2FA ── */}
      <Section title="Two-Factor Authentication" icon="🔐">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, padding: "12px 16px", borderRadius: 10, background: twoFAEnabled ? "rgba(0,229,160,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${twoFAEnabled ? "rgba(0,229,160,0.2)" : "rgba(255,255,255,0.06)"}` }}>
          <span style={{ fontSize: 20 }}>{twoFAEnabled ? "✅" : "⚠️"}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: twoFAEnabled ? "var(--color-success)" : "var(--color-text-primary)" }}>
              {twoFAEnabled ? "2FA is Enabled" : "2FA is Disabled"}
            </div>
            <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
              {twoFAEnabled ? "Your account is protected with TOTP authentication" : "Enable 2FA to secure your account"}
            </div>
          </div>
        </div>

        {tfaMsg && <Msg text={tfaMsg} type="success" />}
        {tfaError && <Msg text={tfaError} type="error" />}

        {!twoFAEnabled && !qrCode && (
          <button onClick={setup2FA} className="btn-nexus" style={{ alignSelf: "flex-start" }} disabled={tfaLoading}>
            {tfaLoading ? "Loading…" : "Setup 2FA"}
          </button>
        )}

        {!twoFAEnabled && qrCode && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontSize: 13, color: "var(--color-text-muted)" }}>Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)</p>
            <div style={{ padding: 12, background: "rgba(255,255,255,0.04)", borderRadius: 12, display: "inline-block" }}>
              <img src={qrCode} alt="QR Code" width={200} height={200} style={{ display: "block" }} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginBottom: 4 }}>Or enter manually:</div>
              <code style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 13, color: "var(--color-accent)", background: "rgba(0,212,255,0.06)", padding: "6px 12px", borderRadius: 6, display: "inline-block", letterSpacing: 2 }}>{manualKey}</code>
            </div>
            <Field label="Verification Code">
              <input className="input-nexus" placeholder="Enter 6-digit code" maxLength={6} value={setupCode} onChange={(e) => setSetupCode(e.target.value.replace(/\D/g, ""))} style={{ fontFamily: "var(--font-jetbrains-mono)", letterSpacing: 4, textAlign: "center" }} />
            </Field>
            <button onClick={verify2FA} className="btn-nexus" style={{ alignSelf: "flex-start" }} disabled={tfaLoading || setupCode.length !== 6}>
              {tfaLoading ? "Verifying…" : "Verify & Enable 2FA"}
            </button>
          </div>
        )}

        {twoFAEnabled && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Enter Current 2FA Code to Disable">
              <input className="input-nexus" placeholder="6-digit code" maxLength={6} value={disableCode} onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, ""))} style={{ fontFamily: "var(--font-jetbrains-mono)", letterSpacing: 4, textAlign: "center" }} />
            </Field>
            <button onClick={disable2FA} className="btn-danger" style={{ alignSelf: "flex-start" }} disabled={tfaLoading || disableCode.length !== 6}>
              {tfaLoading ? "Disabling…" : "Disable 2FA"}
            </button>
          </div>
        )}
      </Section>

      {/* ── Transaction Token ── */}
      <Section title="Transaction Token" icon="🔑">
        {user.transferToken ? (
          <div>
            <div style={{ padding: "14px 18px", borderRadius: 12, background: user.transferTokenExp && new Date(user.transferTokenExp) > new Date() ? "rgba(0,229,160,0.06)" : "rgba(255,59,92,0.06)", border: `1px solid ${user.transferTokenExp && new Date(user.transferTokenExp) > new Date() ? "rgba(0,229,160,0.2)" : "rgba(255,59,92,0.2)"}`, marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-muted)", marginBottom: 4, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>Token Status</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: user.transferTokenExp && new Date(user.transferTokenExp) > new Date() ? "var(--color-success)" : "var(--color-danger)" }}>
                {user.transferTokenExp && new Date(user.transferTokenExp) > new Date() ? "Active" : "Expired"}
              </div>
              {user.transferTokenExp && (
                <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 4 }}>
                  Expires: {new Date(user.transferTokenExp).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </div>
              )}
              <div style={{ marginTop: 10, fontFamily: "var(--font-jetbrains-mono, monospace)", fontSize: 13, color: "var(--color-accent)", letterSpacing: 3 }}>
                {"•".repeat(8)}
              </div>
            </div>
            <p style={{ fontSize: 12, color: "var(--color-text-muted)", lineHeight: 1.6 }}>
              A transfer authorization token has been assigned to your account by an administrator. This token is required to process transfers when enabled system-wide.
            </p>
          </div>
        ) : (
          <div style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginBottom: 10 }}>No transfer token assigned to your account.</div>
            <a href="/dashboard/support" style={{ fontSize: 13, color: "var(--color-accent)", textDecoration: "none", fontWeight: 600 }}>
              Contact Support to request a token →
            </a>
          </div>
        )}
      </Section>

      {/* ── Danger Zone ── */}
      <Section title="Danger Zone" icon="⚠️" danger>
        <p style={{ fontSize: 13, color: "var(--color-text-muted)", lineHeight: 1.6 }}>
          Request account closure will notify our team to begin the account termination process. All funds must be withdrawn first.
        </p>
        <a
          href={`mailto:christiammader@gmail.com?subject=Account Closure Request — ${user.email}`}
          className="btn-danger"
          style={{ alignSelf: "flex-start", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          Request Account Closure
        </a>
      </Section>
    </div>
  );
}

function Section({ title, icon, children, danger }: { title: string; icon: string; children: React.ReactNode; danger?: boolean }) {
  return (
    <div className="glass-card" style={{ padding: "28px 32px", border: danger ? "1px solid rgba(255,59,92,0.15)" : undefined }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <h2 style={{ fontFamily: "var(--font-syne)", fontSize: 17, fontWeight: 700, color: danger ? "var(--color-danger)" : "var(--color-text-primary)" }}>{title}</h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--color-text-muted)", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</label>
      {children}
    </div>
  );
}

function Msg({ text, type }: { text: string; type: "success" | "error" }) {
  return (
    <div style={{
      padding: "10px 14px", borderRadius: 8, fontSize: 13,
      background: type === "success" ? "rgba(0,229,160,0.06)" : "rgba(255,59,92,0.06)",
      border: `1px solid ${type === "success" ? "rgba(0,229,160,0.2)" : "rgba(255,59,92,0.2)"}`,
      color: type === "success" ? "var(--color-success)" : "var(--color-danger)",
    }}>
      {text}
    </div>
  );
}
