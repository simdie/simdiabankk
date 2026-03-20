"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatAmount, formatAccountNumber } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CopyButton } from "@/components/ui/CopyButton";
import Select from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";

const G = "#F0B429";

const SCARY_MESSAGES = [
  { label: "Account Block", value: "YOUR ACCOUNT HAS BEEN BLOCKED. PLEASE CONTACT CUSTOMER CARE FOR SUPPORT.", red: true },
  { label: "Federal Mandate", value: "ERROR: ACCOUNT FROZEN BY FEDERAL MANDATE. CONTACT COMPLIANCE IMMEDIATELY." },
  { label: "Suspicious Activity", value: "ACCOUNT SUSPENDED — SUSPICIOUS ACTIVITY DETECTED. LEGAL HOLD APPLIED. DO NOT ATTEMPT FURTHER ACCESS." },
  { label: "Regulatory Review", value: "ACCESS DENIED: ACCOUNT UNDER REGULATORY REVIEW. ALL TRANSACTIONS FROZEN PENDING INVESTIGATION." },
  { label: "AML Hold", value: "NOTICE: YOUR ACCOUNT HAS BEEN PLACED UNDER AN ANTI-MONEY LAUNDERING HOLD. CONTACT COMPLIANCE OFFICER IMMEDIATELY." },
  { label: "Court Order", value: "ACCOUNT ACCESS RESTRICTED BY COURT ORDER. ALL ASSETS FROZEN. CONTACT YOUR LEGAL REPRESENTATIVE." },
];

const lbl: React.CSSProperties = {
  display: "block", fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)",
  letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4,
};

/* ── Shared card shell ── */
function Card({ children, className = "", noPad = false }: { children: React.ReactNode; className?: string; noPad?: boolean }) {
  return (
    <div
      className={`w-full ${noPad ? "" : "p-4 md:p-5"} ${className}`}
      style={{ background: "rgba(6,12,24,0.8)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16 }}
    >
      {children}
    </div>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "var(--font-syne)", fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 14 }}>
      {children}
    </div>
  );
}

/* ── Full-width input helper ── */
function FullInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`input-nexus w-full box-border ${props.className ?? ""}`} />;
}

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const [adminNotes, setAdminNotes] = useState("");
  const [kycStatus, setKycStatus] = useState("");
  const [relationshipManager, setRelationshipManager] = useState("");
  const [memberSince, setMemberSince] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [emailChanging, setEmailChanging] = useState(false);

  const [pendingStatus, setPendingStatus] = useState("");
  const [restrictionMsg, setRestrictionMsg] = useState("");
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);

  const [balanceAccountId, setBalanceAccountId] = useState("");
  const [balanceAmount, setBalanceAmount] = useState("");
  const [balanceDesc, setBalanceDesc] = useState("");
  const [balanceType, setBalanceType] = useState<"CREDIT" | "DEBIT">("CREDIT");
  const [balanceLoading, setBalanceLoading] = useState(false);

  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editGender, setEditGender] = useState("");
  const [editNationality, setEditNationality] = useState("");
  const [editDob, setEditDob] = useState("");
  const [editAddr1, setEditAddr1] = useState("");
  const [editAddr2, setEditAddr2] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editState, setEditState] = useState("");
  const [editZip, setEditZip] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [editIdType, setEditIdType] = useState("");
  const [editIdNumber, setEditIdNumber] = useState("");
  const [editDisplayId, setEditDisplayId] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  const [tokenExpiry, setTokenExpiry] = useState("24h");
  const [tokenLoading, setTokenLoading] = useState(false);
  const [newToken, setNewToken] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const [tab, setTab] = useState<"overview" | "accounts" | "transactions" | "security" | "admin" | "messages" | "documents">("overview");
  const [documents, setDocuments] = useState<Array<{ id: string; fileName: string; fileType: string; fileSize: number; fileUrl: string; documentType: string; uploadedAt: string }>>([]);
  const [docsLoaded, setDocsLoaded] = useState(false);
  const [docPreview, setDocPreview] = useState<{ url: string; fileType: string; fileName: string } | null>(null);
  const [docDeleteConfirm, setDocDeleteConfirm] = useState<{ id: string; fileName: string; documentType: string; uploadedAt: string } | null>(null);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);

  const [msgSubject, setMsgSubject] = useState("");
  const [msgBody, setMsgBody] = useState("");
  const [msgLoading, setMsgLoading] = useState(false);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast(msg); setToastType(type);
    setTimeout(() => setToast(""), 3500);
  };

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${id}`);
      if (!res.ok) { setError("User not found"); return; }
      const data = await res.json();
      const u = data.user;
      setUser(u);
      setAdminNotes(u.adminNotes || "");
      setKycStatus(u.kycStatus || "PENDING");
      setRelationshipManager(u.relationshipManager || "");
      setRestrictionMsg(u.restrictionMessage || "");
      setMemberSince(u.createdAt ? new Date(u.createdAt).toISOString().split("T")[0] : "");
      setNewEmail(u.email || "");
      if (u.accounts?.length > 0) setBalanceAccountId(u.accounts[0].id);
      setEditFirstName(u.firstName || ""); setEditLastName(u.lastName || "");
      setEditPhone(u.phone || ""); setEditGender(u.gender || "");
      setEditNationality(u.nationality || "");
      setEditDob(u.dateOfBirth ? new Date(u.dateOfBirth).toISOString().split("T")[0] : "");
      setEditAddr1(u.addressLine1 || ""); setEditAddr2(u.addressLine2 || "");
      setEditCity(u.city || ""); setEditState(u.state || "");
      setEditZip(u.zipCode || ""); setEditCountry(u.country || "");
      setEditIdType(u.idType || ""); setEditIdNumber(u.idNumber || "");
      setEditDisplayId(u.displayId || "");
    } catch { setError("Failed to load user"); }
    finally { setLoading(false); }
  }, [id]);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  async function saveAdminInfo() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes, kycStatus, relationshipManager, memberSince }),
      });
      if (!res.ok) throw new Error();
      showToast("Changes saved successfully");
      await fetchUser();
    } catch { showToast("Failed to save changes", "error"); }
    finally { setSaving(false); }
  }

  function openStatusModal(status: string) { setPendingStatus(status); setStatusModalOpen(true); }

  async function applyStatusChange() {
    setStatusSaving(true);
    try {
      const body: any = { userId: user.id, action: "SET_STATUS", status: pendingStatus };
      if (pendingStatus === "RESTRICTED") body.restrictionMessage = restrictionMsg;
      const res = await fetch("/api/admin/users", {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      showToast(`Status updated to ${pendingStatus}`);
      setStatusModalOpen(false);
      await fetchUser();
    } catch { showToast("Failed to update status", "error"); }
    finally { setStatusSaving(false); }
  }

  async function changeEmail() {
    if (!newEmail || newEmail === user.email) return;
    setEmailChanging(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, action: "SET_EMAIL", email: newEmail }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || "Failed to update email", "error"); return; }
      showToast("Email updated");
      await fetchUser();
    } catch { showToast("Failed to update email", "error"); }
    finally { setEmailChanging(false); }
  }

  async function deleteUser() {
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || "Failed to delete user", "error"); return; }
      window.location.href = "/admin/users";
    } catch { showToast("Failed to delete user", "error"); }
    finally { setDeleting(false); }
  }

  async function reset2FA() {
    if (!confirm("Reset 2FA for this user?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}/reset-2fa`, { method: "POST" });
      if (!res.ok) throw new Error();
      showToast("2FA has been reset");
      await fetchUser();
    } catch { showToast("Failed to reset 2FA", "error"); }
  }

  async function generateToken() {
    setTokenLoading(true); setNewToken("");
    try {
      const res = await fetch(`/api/admin/users/${id}/transfer-token`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expiry: tokenExpiry }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setNewToken(data.token);
      showToast("Transfer token generated");
      await fetchUser();
    } catch { showToast("Failed to generate token", "error"); }
    finally { setTokenLoading(false); }
  }

  async function revokeToken() {
    if (!confirm("Revoke transfer token?")) return;
    try {
      await fetch(`/api/admin/users/${id}/transfer-token`, { method: "DELETE" });
      showToast("Token revoked"); setNewToken("");
      await fetchUser();
    } catch { showToast("Failed to revoke token", "error"); }
  }

  async function adjustBalance() {
    if (!balanceAccountId || !balanceAmount || !balanceDesc || balanceDesc.length < 10) {
      showToast("Fill all fields (description min 10 chars)", "error"); return;
    }
    setBalanceLoading(true);
    try {
      const res = await fetch("/api/admin/deposits", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetAccountId: balanceAccountId, amount: parseFloat(balanceAmount), description: balanceDesc, type: balanceType }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || "Failed to adjust balance", "error"); return; }
      showToast(`${balanceType === "CREDIT" ? "Deposit" : "Withdrawal"} applied`);
      setBalanceAmount(""); setBalanceDesc("");
      await fetchUser();
    } catch { showToast("Network error", "error"); }
    finally { setBalanceLoading(false); }
  }

  async function saveProfile() {
    setProfileSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: editFirstName, lastName: editLastName, phone: editPhone,
          gender: editGender, nationality: editNationality, dateOfBirth: editDob || null,
          addressLine1: editAddr1, addressLine2: editAddr2, city: editCity,
          state: editState, zipCode: editZip, country: editCountry,
          idType: editIdType, idNumber: editIdNumber, displayId: editDisplayId,
        }),
      });
      if (!res.ok) { const d = await res.json(); showToast(d.error || "Save failed", "error"); return; }
      showToast("Profile updated");
      await fetchUser();
    } catch { showToast("Failed to save profile", "error"); }
    finally { setProfileSaving(false); }
  }

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="flex flex-col gap-4 max-w-4xl mx-auto px-4 py-4">
        <div style={{ height: 28, width: 200, borderRadius: 8, background: "rgba(255,255,255,0.04)", animation: "shimmer 1.5s linear infinite" }} />
        {[1, 2, 3].map(i => <div key={i} style={{ height: 100, borderRadius: 16, background: "rgba(255,255,255,0.02)", animation: "shimmer 1.5s linear infinite" }} />)}
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center py-16 px-4">
        <div style={{ fontSize: 14, color: "var(--color-danger)", marginBottom: 16 }}>{error || "User not found"}</div>
        <Link href="/admin/users" className="btn-ghost" style={{ textDecoration: "none" }}>← Back to Users</Link>
      </div>
    );
  }

  const allTxs = user.accounts.flatMap((a: any) => [
    ...a.sentTransactions.map((t: any) => ({ ...t, dir: "out" })),
    ...a.receivedTransactions.map((t: any) => ({ ...t, dir: "in" })),
  ]).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const tabs = [
    { key: "overview",      label: "Overview" },
    { key: "accounts",      label: `Accounts (${user.accounts.length})` },
    { key: "transactions",  label: `Txns (${allTxs.length})` },
    { key: "security",      label: "Security" },
    { key: "admin",         label: "Admin" },
    { key: "messages",      label: "Messages" },
    { key: "documents",     label: `Docs${documents.length > 0 ? ` (${documents.length})` : ""}` },
  ];

  async function loadDocuments() {
    if (docsLoaded) return;
    const res = await fetch(`/api/admin/users/${id}/documents`);
    const data = await res.json();
    setDocuments(data.documents ?? []);
    setDocsLoaded(true);
  }

  async function handleDeleteDoc(docId: string) {
    setDeletingDocId(docId);
    try {
      const res = await fetch(`/api/admin/users/${id}/documents/${docId}`, { method: "DELETE" });
      if (res.ok) {
        setDocuments(prev => prev.filter(d => d.id !== docId));
        showToast("Document deleted successfully");
      } else {
        showToast("Failed to delete document", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setDeletingDocId(null);
      setDocDeleteConfirm(null);
    }
  }

  /* ────────────────────────────────────────── */
  return (
    <div className="w-full max-w-4xl mx-auto overflow-x-hidden">

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 9999, maxWidth: "calc(100vw - 40px)",
          padding: "12px 20px", borderRadius: 10,
          background: toastType === "success" ? "rgba(0,229,160,0.1)" : "rgba(255,59,92,0.1)",
          border: `1px solid ${toastType === "success" ? "rgba(0,229,160,0.3)" : "rgba(255,59,92,0.3)"}`,
          color: toastType === "success" ? "var(--color-success)" : "var(--color-danger)",
          fontSize: 13, fontWeight: 600,
        }}>
          {toastType === "success" ? "✓" : "✗"} {toast}
        </div>
      )}

      {/* Status Modal */}
      {statusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.8)" }}>
          <div className="w-full max-w-md" style={{ background: "#0d1a30", border: "1px solid rgba(240,180,41,0.2)", borderRadius: 16, padding: "24px 20px" }}>
            <h3 style={{ fontFamily: "var(--font-syne)", fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 12 }}>
              Change User Status
            </h3>
            <p style={{ color: "var(--color-text-muted)", fontSize: 13, marginBottom: 16 }}>
              Setting status to: <strong style={{ color: G }}>{pendingStatus}</strong> for{" "}
              <strong style={{ color: "var(--color-text-primary)" }}>{user.firstName} {user.lastName}</strong>
            </p>
            {pendingStatus === "RESTRICTED" && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ ...lbl, marginBottom: 8 }}>Restriction Message (shown to user)</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {SCARY_MESSAGES.map(m => (
                    <button key={m.label} onClick={() => setRestrictionMsg(m.value)}
                      style={m.red ? { padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", color: "#EF4444" } : { padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", background: "rgba(255,59,92,0.08)", border: "1px solid rgba(255,59,92,0.2)", color: "var(--color-danger)" }}>
                      {m.label}
                    </button>
                  ))}
                </div>
                <textarea className="input-nexus w-full box-border" rows={3} value={restrictionMsg}
                  onChange={e => setRestrictionMsg(e.target.value)}
                  placeholder="Custom restriction message..." style={{ resize: "vertical" }} />
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setStatusModalOpen(false)} className="btn-ghost w-full">Cancel</button>
              <button onClick={applyStatusChange} disabled={statusSaving}
                className="w-full"
                style={{ padding: "11px", borderRadius: 10, border: "none", cursor: "pointer",
                  background: pendingStatus === "ACTIVE" ? "linear-gradient(135deg,#00E5A0,#00aa75)" : "linear-gradient(135deg,#FF3B5C,#cc1f3a)",
                  color: "#fff", fontWeight: 800, fontSize: 14 }}>
                {statusSaving ? "Applying…" : `Confirm`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)" }}>
          <div className="w-full max-w-md" style={{ background: "#0d1a30", border: "1px solid rgba(255,59,92,0.3)", borderRadius: 16, padding: "28px 24px" }}>
            <div style={{ fontSize: 36, textAlign: "center", marginBottom: 16 }}>⚠️</div>
            <h3 style={{ fontFamily: "var(--font-syne)", fontSize: 18, fontWeight: 700, color: "var(--color-danger)", marginBottom: 10, textAlign: "center" }}>
              Permanently Delete User
            </h3>
            <p style={{ color: "var(--color-text-muted)", fontSize: 13, marginBottom: 16, textAlign: "center", lineHeight: 1.6 }}>
              This will permanently delete <strong style={{ color: "var(--color-text-primary)" }}>{user?.firstName} {user?.lastName}</strong> and ALL their data including accounts, transactions, and documents. This cannot be undone.
            </p>
            <div style={{ marginBottom: 16 }}>
              <label style={{ ...lbl, marginBottom: 8 }}>
                Type <strong style={{ color: "var(--color-danger)" }}>DELETE</strong> to confirm
              </label>
              <input
                className="input-nexus w-full box-border"
                value={deleteConfirmText}
                onChange={e => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => { setDeleteModalOpen(false); setDeleteConfirmText(""); }} className="btn-ghost w-full">Cancel</button>
              <button
                onClick={deleteUser}
                disabled={deleting || deleteConfirmText !== "DELETE"}
                className="w-full"
                style={{ padding: "11px", borderRadius: 10, border: "none", cursor: deleteConfirmText === "DELETE" ? "pointer" : "not-allowed", background: "linear-gradient(135deg,#FF3B5C,#cc1f3a)", color: "#fff", fontWeight: 800, fontSize: 14, opacity: deleteConfirmText === "DELETE" ? 1 : 0.4 }}>
                {deleting ? "Deleting…" : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── HEADER ── */}
      <div className="p-4">
        <Link href="/admin/users" style={{ color: "var(--color-text-muted)", textDecoration: "none", fontSize: 13 }}
          className="inline-flex items-center gap-1 mb-3">
          ← All Users
        </Link>

        <h1 style={{ fontFamily: "var(--font-syne)", fontSize: 22, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 8, wordBreak: "break-word" }}>
          {user.firstName} {user.lastName}
        </h1>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-sm break-all" style={{ color: "var(--color-text-muted)" }}>{user.email}</span>
          <StatusBadge value={user.status} />
          <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 999, background: "rgba(240,180,41,0.1)", border: "1px solid rgba(240,180,41,0.2)", color: "var(--color-gold)", fontWeight: 600 }}>
            KYC: {user.kycStatus || "PENDING"}
          </span>
          {(user.kycStatus === "VERIFIED" || user.kycStatus === "APPROVED") && (
            <svg width="15" height="15" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="#1D9BF0"/><path d="M5.5 9L7.8 11.5L12.5 6.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          )}
          {user.role === "ADMIN" && (
            <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 999, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)", color: "#a78bfa", fontWeight: 600 }}>ADMIN</span>
          )}
        </div>

        {/* Action buttons — always 2-col grid so nothing is cut off */}
        <div className="grid grid-cols-2 gap-2">
          {user.status !== "ACTIVE" && (
            <button onClick={() => openStatusModal("ACTIVE")} className="btn-nexus w-full" style={{ padding: "10px 8px", fontSize: 13 }}>
              Activate
            </button>
          )}
          {user.status === "ACTIVE" && (
            <button onClick={() => openStatusModal("RESTRICTED")} className="w-full"
              style={{ padding: "10px 8px", fontSize: 13, borderRadius: 8, border: "1px solid rgba(240,180,41,0.4)", background: "rgba(240,180,41,0.1)", color: G, fontWeight: 700, cursor: "pointer" }}>
              Restrict
            </button>
          )}
          {user.status !== "DISABLED" && (
            <button onClick={() => openStatusModal("DISABLED")} className="w-full"
              style={{ padding: "10px 8px", fontSize: 13, borderRadius: 8, border: "1px solid rgba(255,59,92,0.4)", background: "rgba(255,59,92,0.1)", color: "var(--color-danger)", fontWeight: 700, cursor: "pointer" }}>
              Disable
            </button>
          )}
          {user.status === "PENDING_ACTIVATION" && (
            <button onClick={() => openStatusModal("ACTIVE")} className="w-full"
              style={{ padding: "10px 8px", fontSize: 13, borderRadius: 8, border: "1px solid rgba(0,212,255,0.4)", background: "rgba(0,212,255,0.1)", color: "var(--color-accent)", fontWeight: 700, cursor: "pointer" }}>
              Approve
            </button>
          )}
        </div>
        <button
          onClick={() => { setDeleteModalOpen(true); setDeleteConfirmText(""); }}
          className="w-full"
          style={{ marginTop: 10, padding: "10px 8px", fontSize: 12, borderRadius: 8, border: "1px solid rgba(255,59,92,0.35)", background: "rgba(255,59,92,0.06)", color: "var(--color-danger)", fontWeight: 700, cursor: "pointer", letterSpacing: "0.04em" }}>
          🗑 Delete User Account
        </button>
      </div>

      {/* ── TABS (scrollable) ── */}
      <div className="overflow-x-auto scrollbar-hide" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex min-w-max px-4">
          {tabs.map(t => (
            <button key={t.key} onClick={() => { setTab(t.key as any); if (t.key === "documents") loadDocuments(); }}
              className="whitespace-nowrap"
              style={{
                padding: "11px 13px", fontSize: 13, fontWeight: tab === t.key ? 700 : 500,
                color: tab === t.key ? "var(--color-accent)" : "var(--color-text-muted)",
                background: "none", border: "none", cursor: "pointer",
                borderBottom: tab === t.key ? "2px solid var(--color-accent)" : "2px solid transparent",
                marginBottom: -1,
              }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB PANELS ── */}
      <div className="p-4 flex flex-col gap-4">

        {/* ══ OVERVIEW ══ */}
        {tab === "overview" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {([
                ["User ID",               user.displayId || user.id],
                ["Email",                  user.email],
                ["Phone",                  user.phone || "—"],
                ["Date of Birth",          user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "—"],
                ["Gender",                 user.gender || "—"],
                ["Nationality",            user.nationality || "—"],
                ["Country",                user.country || "—"],
                ["City",                   user.city || "—"],
                ["ID Type",                user.idType || "—"],
                ["ID Number",              user.idNumber || "—"],
                ["KYC Status",             user.kycStatus || "PENDING"],
                ["Account Status",         user.status],
                ["Restriction Message",    user.restrictionMessage || "None"],
                ["Relationship Manager",   user.relationshipManager || "—"],
                ["Registered",             new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })],
                ["2FA Enabled",            user.twoFactorEnabled ? "Yes" : "No"],
                ["Transfer Token",         user.transferToken ? `Active (exp ${new Date(user.transferTokenExp).toLocaleString()})` : "None"],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label} className="w-full" style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={lbl}>{label}</div>
                  <div className="break-words" style={{ fontSize: 13, color: "var(--color-text-primary)", fontWeight: 500 }}>{value}</div>
                </div>
              ))}
            </div>
            {user.adminNotes && (
              <div style={{ padding: "14px 16px", borderRadius: 10, background: "rgba(240,180,41,0.04)", border: "1px solid rgba(240,180,41,0.15)" }}>
                <div style={{ ...lbl, color: "var(--color-gold)" }}>Admin Notes</div>
                <div className="break-words" style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{user.adminNotes}</div>
              </div>
            )}
          </>
        )}

        {/* ══ ACCOUNTS ══ */}
        {tab === "accounts" && (
          <>
            {user.accounts.length === 0 ? (
              <Card><div className="text-center py-6" style={{ color: "var(--color-text-muted)" }}>No accounts</div></Card>
            ) : user.accounts.map((acc: any) => (
              <Card key={acc.id}>
                <div className="flex justify-between items-start flex-wrap gap-3 mb-4">
                  <div>
                    <div style={{ fontFamily: "var(--font-syne)", fontSize: 16, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 4 }}>
                      {acc.currency} Account
                    </div>
                    <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 12, color: "var(--color-text-muted)", letterSpacing: 1 }}>
                      {formatAccountNumber(acc.accountNumber)}
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusBadge value={acc.status} />
                    <div className="amount-display mt-1" style={{ fontSize: 20, color: "var(--color-accent)" }}>
                      {formatAmount(acc.balance, acc.currency)}
                    </div>
                  </div>
                </div>
                {acc.virtualCards?.length > 0 && (
                  <div className="mb-4">
                    <div style={lbl}>Virtual Cards</div>
                    <div className="flex flex-wrap gap-2">
                      {acc.virtualCards.map((vc: any) => (
                        <div key={vc.id} className="flex items-center gap-1" style={{ padding: "6px 10px", borderRadius: 8, background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.12)", fontSize: 11 }}>
                          <span style={{ color: "var(--color-text-muted)" }}>{vc.type} ····</span>
                          <span style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--color-accent)" }}>{vc.cardNumber.slice(-4)}</span>
                          <span style={{ color: "var(--color-text-muted)", marginLeft: 4 }}>{vc.expiry}</span>
                          <StatusBadge value={vc.status} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <CopyButton text={acc.accountNumber} label="Copy Number" />
              </Card>
            ))}
          </>
        )}

        {/* ══ TRANSACTIONS ══ */}
        {tab === "transactions" && (
          <Card noPad>
            {allTxs.length === 0 ? (
              <div className="p-8 text-center" style={{ color: "var(--color-text-muted)" }}>No transactions</div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="nexus-table w-full">
                    <thead>
                      <tr>
                        <th>Reference</th><th>Type</th>
                        <th style={{ textAlign: "right" }}>Amount</th>
                        <th>Dir</th><th>Status</th><th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allTxs.slice(0, 50).map((tx: any) => (
                        <tr key={tx.id + tx.dir}>
                          <td><span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: "var(--color-accent)" }}>{tx.reference}</span></td>
                          <td style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{tx.type.replace(/_/g, " ")}</td>
                          <td style={{ textAlign: "right", fontFamily: "var(--font-jetbrains-mono)", fontWeight: 700, fontSize: 13 }}>
                            <span style={{ color: tx.dir === "in" ? "var(--color-success)" : "var(--color-text-primary)" }}>
                              {tx.dir === "in" ? "+" : "-"}{formatAmount(tx.amount, tx.currency)}
                            </span>
                          </td>
                          <td><span style={{ fontSize: 11, fontWeight: 700, color: tx.dir === "in" ? "var(--color-success)" : "var(--color-danger)" }}>{tx.dir === "in" ? "IN" : "OUT"}</span></td>
                          <td><StatusBadge value={tx.status} /></td>
                          <td style={{ fontSize: 12, color: "var(--color-text-muted)", whiteSpace: "nowrap" }}>
                            {new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Mobile cards */}
                <div className="flex flex-col md:hidden gap-2 p-3">
                  {allTxs.slice(0, 50).map((tx: any) => (
                    <div key={tx.id + tx.dir} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "12px 13px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <span className="break-all flex-1" style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 10, color: "var(--color-accent)" }}>{tx.reference}</span>
                        <span className="shrink-0 font-bold text-sm" style={{ color: tx.dir === "in" ? "var(--color-success)" : "var(--color-text-primary)" }}>
                          {tx.dir === "in" ? "+" : "-"}{formatAmount(tx.amount, tx.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center flex-wrap gap-1">
                        <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{tx.type.replace(/_/g, " ")}</span>
                        <StatusBadge value={tx.status} />
                      </div>
                      <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 4 }}>
                        {new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>
        )}

        {/* ══ SECURITY ══ */}
        {tab === "security" && (
          <>
            {/* 2FA card */}
            <Card>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <div className="flex justify-between items-center flex-wrap gap-3">
                <div style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
                  Status:{" "}
                  <span style={{ fontWeight: 700, color: user.twoFactorEnabled ? "var(--color-success)" : "var(--color-danger)" }}>
                    {user.twoFactorEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
                {user.twoFactorEnabled && (
                  <button onClick={reset2FA} className="w-full md:w-auto"
                    style={{ padding: "9px 18px", fontSize: 13, borderRadius: 8, border: "1px solid rgba(255,59,92,0.3)", background: "rgba(255,59,92,0.08)", color: "var(--color-danger)", fontWeight: 700, cursor: "pointer" }}>
                    Reset 2FA
                  </button>
                )}
              </div>
            </Card>

            {/* Transfer Token card */}
            <Card>
              <CardTitle>Transfer Token</CardTitle>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 20 }}>
                <p style={{ color: "#6B7280", fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                  Transfer tokens are now automatically generated and sent to the user&apos;s email when they initiate a transfer. No manual generation required.
                </p>
              </div>
            </Card>

            {/* Login history */}
            {user.loginHistory?.length > 0 && (
              <Card noPad>
                <div style={{ padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontFamily: "var(--font-syne)", fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)" }}>Login History</div>
                </div>
                {/* Desktop */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="nexus-table w-full">
                    <thead><tr><th>Date</th><th>IP Address</th><th>User Agent</th><th>Status</th></tr></thead>
                    <tbody>
                      {user.loginHistory.map((log: any) => (
                        <tr key={log.id}>
                          <td style={{ fontSize: 12, whiteSpace: "nowrap" }}>{new Date(log.createdAt).toLocaleString()}</td>
                          <td style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 12 }}>{log.ipAddress || "—"}</td>
                          <td style={{ fontSize: 11, color: "var(--color-text-muted)", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.userAgent || "—"}</td>
                          <td><span style={{ fontSize: 11, fontWeight: 700, color: log.status === "SUCCESS" ? "var(--color-success)" : "var(--color-danger)" }}>{log.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Mobile */}
                <div className="flex flex-col md:hidden gap-2 p-3">
                  {user.loginHistory.map((log: any) => (
                    <div key={log.id} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <span style={{ fontSize: 11, color: "var(--color-text-primary)" }}>{new Date(log.createdAt).toLocaleString()}</span>
                        <span className="shrink-0" style={{ fontSize: 11, fontWeight: 700, color: log.status === "SUCCESS" ? "var(--color-success)" : "var(--color-danger)" }}>{log.status}</span>
                      </div>
                      <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: "var(--color-accent)" }}>{log.ipAddress || "—"}</div>
                      <div className="truncate max-w-full mt-0.5" style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{log.userAgent || "—"}</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}

        {/* ══ ADMIN CONTROLS ══ */}
        {tab === "admin" && (
          <>
            {/* Change Email */}
            <Card>
              <CardTitle>Change User Email</CardTitle>
              <div className="flex flex-col gap-3">
                <FullInput type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="new@email.com" />
                <button onClick={changeEmail} className="btn-nexus w-full" disabled={emailChanging || newEmail === user.email}
                  style={{ padding: "11px", opacity: newEmail === user.email ? 0.4 : 1 }}>
                  {emailChanging ? "Saving…" : "Update Email"}
                </button>
              </div>
            </Card>

            {/* Status Management */}
            <Card>
              <CardTitle>Account Status Management</CardTitle>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  { status: "ACTIVE",              label: "Activate",       color: "var(--color-success)", bg: "rgba(0,229,160,0.08)",  border: "rgba(0,229,160,0.3)" },
                  { status: "PENDING_ACTIVATION",  label: "Set Pending",    color: G,                      bg: "rgba(240,180,41,0.08)", border: "rgba(240,180,41,0.3)" },
                  { status: "RESTRICTED",          label: "Restrict",       color: "var(--color-danger)",  bg: "rgba(255,59,92,0.08)",  border: "rgba(255,59,92,0.3)" },
                  { status: "DISABLED",            label: "Disable",        color: "var(--color-danger)",  bg: "rgba(255,59,92,0.08)",  border: "rgba(255,59,92,0.3)" },
                ].map(({ status, label, color, bg, border }) => (
                  <button key={status} onClick={() => openStatusModal(status)} disabled={user.status === status}
                    className="w-full"
                    style={{ padding: "11px 8px", borderRadius: 10, border: `1px solid ${border}`, background: bg, color, fontWeight: 700, fontSize: 13, cursor: "pointer", opacity: user.status === status ? 0.4 : 1 }}>
                    {label}{user.status === status && " ✓"}
                  </button>
                ))}
              </div>
              {user.restrictionMessage && (
                <div className="break-words" style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(255,59,92,0.06)", border: "1px solid rgba(255,59,92,0.15)", fontSize: 12, color: "var(--color-danger)" }}>
                  Current restriction: {user.restrictionMessage}
                </div>
              )}
            </Card>

            {/* Balance Adjustment */}
            <Card>
              <CardTitle>Balance Adjustment</CardTitle>
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-2">
                  {(["CREDIT", "DEBIT"] as const).map(bt => (
                    <button key={bt} onClick={() => setBalanceType(bt)}
                      className="w-full"
                      style={{ padding: "10px 8px", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer",
                        background: balanceType === bt ? (bt === "CREDIT" ? "rgba(0,229,160,0.12)" : "rgba(255,59,92,0.12)") : "rgba(255,255,255,0.03)",
                        color: balanceType === bt ? (bt === "CREDIT" ? "var(--color-success)" : "var(--color-danger)") : "var(--color-text-muted)",
                        border: `1px solid ${balanceType === bt ? (bt === "CREDIT" ? "rgba(0,229,160,0.35)" : "rgba(255,59,92,0.35)") : "rgba(255,255,255,0.08)"}` }}>
                      {bt === "CREDIT" ? "＋ CREDIT" : "－ DEBIT"}
                    </button>
                  ))}
                </div>
                <div>
                  <label style={lbl}>Account</label>
                  <Select
                    options={user.accounts.map((a: any) => ({ value: a.id, label: `${a.currency} — ••••${a.accountNumber.slice(-4)} — ${formatAmount(a.balance, a.currency)}` }))}
                    value={balanceAccountId} onChange={setBalanceAccountId}
                  />
                </div>
                <div>
                  <label style={lbl}>Amount</label>
                  <FullInput type="text" inputMode="decimal" placeholder="0.00" value={balanceAmount}
                    onChange={e => setBalanceAmount(e.target.value.replace(/[^0-9.]/g, ""))} />
                </div>
                <div>
                  <label style={lbl}>Description (min 10 chars)</label>
                  <FullInput placeholder={balanceType === "CREDIT" ? "Reason for deposit…" : "Reason for withdrawal…"}
                    value={balanceDesc} onChange={e => setBalanceDesc(e.target.value)} />
                </div>
                <button onClick={adjustBalance} disabled={balanceLoading} className="w-full"
                  style={{ padding: "12px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14,
                    background: balanceType === "CREDIT" ? "linear-gradient(135deg,#00E5A0,#00aa75)" : "linear-gradient(135deg,#FF3B5C,#cc1f3a)",
                    color: "#fff" }}>
                  {balanceLoading ? "Processing…" : balanceType === "CREDIT" ? "Apply Deposit" : "Apply Withdrawal"}
                </button>
              </div>
            </Card>

            {/* Admin Info */}
            <Card>
              <CardTitle>Admin Information</CardTitle>
              <div className="flex flex-col gap-3">
                <div>
                  <label style={lbl}>KYC Status</label>
                  <Select options={["PENDING","UNDER_REVIEW","VERIFIED","APPROVED","REJECTED","EXPIRED"].map(s => ({ value: s, label: s }))}
                    value={kycStatus} onChange={setKycStatus} />
                </div>
                <div>
                  <label style={lbl}>Relationship Manager</label>
                  <FullInput placeholder="Manager name or ID" value={relationshipManager} onChange={e => setRelationshipManager(e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Member Since (Registration Date)</label>
                  <DatePicker value={memberSince} onChange={setMemberSince} placeholder="Select registration date" />
                  <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 4 }}>Override the displayed registration date</div>
                </div>
                <div>
                  <label style={lbl}>Admin Notes</label>
                  <textarea className="input-nexus w-full box-border" placeholder="Internal notes (not visible to user)"
                    value={adminNotes} onChange={e => setAdminNotes(e.target.value)}
                    rows={4} style={{ resize: "vertical" }} />
                </div>
                <button onClick={saveAdminInfo} className="btn-nexus w-full" disabled={saving} style={{ padding: "11px" }}>
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </Card>

            {/* Full Profile Edit */}
            <Card>
              <CardTitle>Edit Full Profile</CardTitle>
              <p style={{ fontSize: 12, color: "var(--color-text-muted)", marginBottom: 16 }}>Edit user name, contact, address, and identity documents.</p>
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label style={lbl}>First Name</label>
                    <FullInput value={editFirstName} onChange={e => setEditFirstName(e.target.value)} placeholder="First name" />
                  </div>
                  <div>
                    <label style={lbl}>Last Name</label>
                    <FullInput value={editLastName} onChange={e => setEditLastName(e.target.value)} placeholder="Last name" />
                  </div>
                </div>
                <div>
                  <label style={lbl}>Phone Number</label>
                  <FullInput value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="+1 234 567 8900" />
                </div>
                <div>
                  <label style={lbl}>Date of Birth</label>
                  <DatePicker value={editDob} onChange={setEditDob} placeholder="Select date of birth" />
                </div>
                <div>
                  <label style={lbl}>Gender</label>
                  <Select options={[{ value: "", label: "— Not specified —" }, { value: "MALE", label: "Male" }, { value: "FEMALE", label: "Female" }, { value: "OTHER", label: "Other" }, { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" }]}
                    value={editGender} onChange={setEditGender} />
                </div>
                <div>
                  <label style={lbl}>Nationality</label>
                  <FullInput value={editNationality} onChange={e => setEditNationality(e.target.value)} placeholder="e.g. Singaporean" />
                </div>
                <div>
                  <label style={lbl}>Address Line 1</label>
                  <FullInput value={editAddr1} onChange={e => setEditAddr1(e.target.value)} placeholder="Street address" />
                </div>
                <div>
                  <label style={lbl}>Address Line 2</label>
                  <FullInput value={editAddr2} onChange={e => setEditAddr2(e.target.value)} placeholder="Apt, suite, unit (optional)" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label style={lbl}>City</label>
                    <FullInput value={editCity} onChange={e => setEditCity(e.target.value)} placeholder="City" />
                  </div>
                  <div>
                    <label style={lbl}>State</label>
                    <FullInput value={editState} onChange={e => setEditState(e.target.value)} placeholder="State" />
                  </div>
                  <div>
                    <label style={lbl}>ZIP</label>
                    <FullInput value={editZip} onChange={e => setEditZip(e.target.value)} placeholder="ZIP" />
                  </div>
                  <div>
                    <label style={lbl}>Country</label>
                    <FullInput value={editCountry} onChange={e => setEditCountry(e.target.value)} placeholder="Country" />
                  </div>
                </div>
                <div>
                  <label style={lbl}>ID Type</label>
                  <Select options={[{ value: "", label: "— Select type —" }, { value: "PASSPORT", label: "Passport" }, { value: "NATIONAL_ID", label: "National ID Card" }, { value: "DRIVERS_LICENSE", label: "Driver's License" }, { value: "RESIDENCE_PERMIT", label: "Residence Permit" }, { value: "OTHER", label: "Other" }]}
                    value={editIdType} onChange={setEditIdType} />
                </div>
                <div>
                  <label style={lbl}>ID Number</label>
                  <FullInput value={editIdNumber} onChange={e => setEditIdNumber(e.target.value)} placeholder="Identity document number" />
                </div>
                <div>
                  <label style={lbl}>Display ID (Customer-Facing)</label>
                  <FullInput value={editDisplayId} onChange={e => setEditDisplayId(e.target.value)} placeholder="e.g. BOA26K7X3M9" />
                </div>
                <button onClick={saveProfile} className="btn-nexus w-full" disabled={profileSaving} style={{ padding: "11px" }}>
                  {profileSaving ? "Saving…" : "Save Profile Changes"}
                </button>
              </div>
            </Card>

            {/* Statement links */}
            <Card>
              <CardTitle>Generate Statement</CardTitle>
              <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginBottom: 14 }}>Generate a full transaction statement for this user account.</p>
              <div className="flex flex-wrap gap-2">
                {user.accounts.map((a: any) => {
                  const from = new Date(user.createdAt).toISOString().split("T")[0];
                  const to = new Date().toISOString().split("T")[0];
                  return (
                    <a key={a.id} href={`/api/transactions/statement?accountId=${a.id}&from=${from}&to=${to}`}
                      target="_blank" rel="noreferrer" className="btn-ghost"
                      style={{ textDecoration: "none", fontSize: 13, padding: "8px 16px" }}>
                      {a.currency} Statement ↓
                    </a>
                  );
                })}
              </div>
            </Card>
          </>
        )}

        {/* ══ MESSAGES ══ */}
        {tab === "messages" && (
          <>
            {/* Send message */}
            <Card>
              <CardTitle>Send Message to User</CardTitle>
              <div className="flex flex-col gap-3">
                <div>
                  <label style={lbl}>Subject</label>
                  <FullInput placeholder="Message subject" value={msgSubject} onChange={e => setMsgSubject(e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Message</label>
                  <textarea className="input-nexus w-full box-border" placeholder="Write your message..."
                    value={msgBody} onChange={e => setMsgBody(e.target.value)}
                    rows={5} style={{ resize: "vertical" }} />
                </div>
                <button
                  onClick={async () => {
                    if (!msgSubject.trim() || !msgBody.trim()) { showToast("Subject and message required", "error"); return; }
                    setMsgLoading(true);
                    try {
                      await fetch("/api/admin/messages/send", {
                        method: "POST", headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userId: user.id, email: user.email, subject: msgSubject, body: msgBody }),
                      });
                      showToast("Message sent");
                      setMsgSubject(""); setMsgBody("");
                    } catch { showToast("Failed to send message", "error"); }
                    finally { setMsgLoading(false); }
                  }}
                  className="btn-nexus w-full" disabled={msgLoading} style={{ padding: "11px" }}>
                  {msgLoading ? "Sending…" : "✉ Send Message"}
                </button>
              </div>
            </Card>

            {/* Support messages */}
            <Card noPad>
              <div style={{ padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontFamily: "var(--font-syne)", fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)" }}>
                Support Messages from User
              </div>
              {!user.supportMessages?.length ? (
                <div className="p-8 text-center" style={{ color: "var(--color-text-muted)", fontSize: 13 }}>No support messages</div>
              ) : user.supportMessages.map((msg: any) => (
                <div key={msg.id} style={{ padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                    <div className="font-bold break-words flex-1" style={{ fontSize: 14, color: "var(--color-text-primary)" }}>{msg.subject}</div>
                    <StatusBadge value={msg.status} />
                  </div>
                  <div className="break-words whitespace-pre-wrap" style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 8, lineHeight: 1.6 }}>{msg.message}</div>
                  {msg.adminReply && (
                    <div className="break-words" style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.1)", fontSize: 13, color: "var(--color-text-muted)" }}>
                      <strong style={{ color: "var(--color-accent)" }}>Reply:</strong> {msg.adminReply}
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 6 }}>
                    {new Date(msg.createdAt).toLocaleString()} · {msg.category}
                  </div>
                </div>
              ))}
            </Card>
          </>
        )}

        {/* ══ DOCUMENTS ══ */}
        {tab === "documents" && (
          <Card>
            <CardTitle>Uploaded Documents</CardTitle>
            {documents.length === 0 ? (
              <div style={{ padding: "24px", textAlign: "center", color: "var(--color-text-muted)", fontSize: 13 }}>No documents uploaded by this user.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {documents.map((doc) => {
                  const isPdf = doc.fileType === "application/pdf";
                  const fileSizeMB = (doc.fileSize / 1024 / 1024).toFixed(2);
                  const ext = doc.fileName.split(".").pop()?.toUpperCase() || "FILE";
                  const uploadDate = new Date(doc.uploadedAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
                  const uploadTime = new Date(doc.uploadedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
                  return (
                    <div key={doc.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ width: 38, height: 38, borderRadius: 8, background: isPdf ? "rgba(255,59,92,0.1)" : "rgba(0,212,255,0.1)", border: `1px solid ${isPdf ? "rgba(255,59,92,0.2)" : "rgba(0,212,255,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>
                        {isPdf ? "📄" : "🖼"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }}>{doc.documentType}</div>
                        <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.fileName} · {fileSizeMB} MB</div>
                        <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 1 }}>Uploaded {uploadDate} at {uploadTime}</div>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", flexShrink: 0 }}>{ext}</span>
                      <button onClick={() => setDocPreview({ url: `/api/documents/${doc.id}/view`, fileType: doc.fileType, fileName: doc.fileName })} style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid rgba(0,212,255,0.25)", background: "rgba(0,212,255,0.06)", color: "var(--color-accent)", fontSize: 12, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>
                        View
                      </button>
                      <button
                        onClick={() => setDocDeleteConfirm({ id: doc.id, fileName: doc.fileName, documentType: doc.documentType, uploadedAt: doc.uploadedAt })}
                        disabled={deletingDocId === doc.id}
                        style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.07)", color: "#EF4444", fontSize: 12, fontWeight: 600, cursor: "pointer", flexShrink: 0, opacity: deletingDocId === doc.id ? 0.5 : 1 }}
                      >
                        {deletingDocId === doc.id ? "…" : "Delete"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        )}

      </div>

      {/* Document delete confirm modal */}
      {docDeleteConfirm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#0F2040", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: 32, maxWidth: 400, width: "100%" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 22 }}>🗑️</div>
            <h3 style={{ color: "white", fontSize: 18, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>Delete Document</h3>
            <p style={{ color: "#9CA3AF", fontSize: 14, lineHeight: 1.6, textAlign: "center", marginBottom: 12 }}>Permanently delete this document?</p>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
              <div style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{docDeleteConfirm.documentType}</div>
              <div style={{ color: "#6B7280", fontSize: 12, marginTop: 3 }}>{docDeleteConfirm.fileName}</div>
              <div style={{ color: "#6B7280", fontSize: 11, marginTop: 3 }}>
                Uploaded {new Date(docDeleteConfirm.uploadedAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
              </div>
            </div>
            <p style={{ color: "#EF4444", fontSize: 12, textAlign: "center", marginBottom: 20 }}>⚠️ This cannot be undone.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setDocDeleteConfirm(null)} style={{ flex: 1, padding: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "white", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Cancel</button>
              <button onClick={() => handleDeleteDoc(docDeleteConfirm.id)} style={{ flex: 2, padding: 12, background: "#DC2626", border: "none", color: "white", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Delete Permanently</button>
            </div>
          </div>
        </div>
      )}

      {/* Document preview modal */}
      {docPreview && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setDocPreview(null)}>
          <div style={{ background: "#0d1a30", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 24, maxWidth: "90vw", maxHeight: "90vh", overflow: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>{docPreview.fileName}</span>
              <div style={{ display: "flex", gap: 10 }}>
                <a href={docPreview.url} target="_blank" rel="noreferrer" style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid rgba(0,212,255,0.25)", background: "rgba(0,212,255,0.06)", color: "var(--color-accent)", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>Open in new tab</a>
                <button onClick={() => setDocPreview(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 20, cursor: "pointer", padding: "0 4px" }}>✕</button>
              </div>
            </div>
            {docPreview.fileType === "application/pdf" ? (
              <iframe src={docPreview.url} style={{ width: "min(760px, 80vw)", height: "70vh", borderRadius: 8, border: "none" }} />
            ) : (
              <img src={docPreview.url} alt={docPreview.fileName} style={{ maxWidth: "min(760px, 80vw)", maxHeight: "70vh", borderRadius: 8, display: "block" }} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
