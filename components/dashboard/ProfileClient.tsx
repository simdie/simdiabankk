"use client";

import { useState, useRef, useEffect } from "react";
import { Lock, FileText, Image as ImageIcon } from "lucide-react";
import Select from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";

interface UserProfile {
  id: string; firstName: string; lastName: string; email: string;
  phone: string | null; role: string; status: string; createdAt: Date;
  dateOfBirth: Date | null; gender: string | null; nationality: string | null;
  addressLine1: string | null; addressLine2: string | null; city: string | null;
  state: string | null; zipCode: string | null; country: string | null;
  idType: string | null; idNumber: string | null; idExpiry: Date | null;
  profilePhoto: string | null; kycStatus: string | null;
  relationshipManager: string | null; twoFactorEnabled: boolean;
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
  textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 6,
};
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", borderRadius: 10,
  background: "rgba(6,12,24,0.7)", border: "1px solid rgba(255,255,255,0.08)",
  color: "#f0f4ff", fontSize: 14, outline: "none", boxSizing: "border-box",
};
const cardStyle: React.CSSProperties = {
  background: "rgba(13,26,48,0.6)", border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 16, padding: "24px 28px", marginBottom: 20,
};

function getInitialsColor(name: string): string {
  const hash = name.split("").reduce((acc, c) => c.charCodeAt(0) + ((acc << 5) - acc), 0);
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 70%, 50%)`;
}

export default function ProfileClient({ user }: { user: UserProfile }) {
  const [form, setForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone || "",
    dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split("T")[0] : "",
    gender: user.gender || "",
    nationality: user.nationality || "",
    addressLine1: user.addressLine1 || "",
    addressLine2: user.addressLine2 || "",
    city: user.city || "",
    state: user.state || "",
    zipCode: user.zipCode || "",
    country: user.country || "",
    idType: user.idType || "",
    idNumber: user.idNumber || "",
    idExpiry: user.idExpiry ? new Date(user.idExpiry).toISOString().split("T")[0] : "",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [idFile, setIdFile] = useState<File | null>(null);
  const [idUploading, setIdUploading] = useState(false);
  const [idSuccess, setIdSuccess] = useState("");
  const [idError, setIdError] = useState("");
  const [previewDoc, setPreviewDoc] = useState<{ url: string; fileType: string; fileName: string } | null>(null);
  const [documents, setDocuments] = useState<Array<{ id: string; fileName: string; fileType: string; fileSize: number; fileUrl: string; documentType: string; uploadedAt: string }>>([]);
  const [docDeleteConfirm, setDocDeleteConfirm] = useState<{ id: string; fileName: string; documentType: string } | null>(null);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/user/documents").then(r => r.json()).then(d => setDocuments(d.documents ?? []));
  }, [idSuccess]);

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  const avatarColor = getInitialsColor(user.firstName + user.lastName);

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  async function handleSave() {
    setSaving(true); setError(""); setSuccess("");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form.phone }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to save"); return; }
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } finally { setSaving(false); }
  }

  async function handleIdUpload() {
    if (!idFile) return;
    setIdUploading(true);
    setIdError("");
    setIdSuccess("");
    try {
      const formData = new FormData();
      formData.append("file", idFile);
      const res = await fetch("/api/user/upload-id", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) { setIdError(data.error || "Upload failed"); return; }
      setIdSuccess("ID document uploaded successfully!");
      setIdFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => setIdSuccess(""), 4000);
    } catch {
      setIdError("Network error. Please try again.");
    } finally {
      setIdUploading(false);
    }
  }

  async function handleDeleteDoc(docId: string) {
    setDeletingDocId(docId);
    try {
      const res = await fetch(`/api/user/documents/${docId}`, { method: "DELETE" });
      if (res.ok) {
        setDocuments(prev => prev.filter(d => d.id !== docId));
      } else {
        alert("Failed to delete document");
      }
    } catch {
      alert("Network error");
    } finally {
      setDeletingDocId(null);
      setDocDeleteConfirm(null);
    }
  }

  // Read-only display with lock icon
  const ReadField = ({ label, value }: { label: string; value: string }) => (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "12px 16px", color: "rgba(255,255,255,0.5)", fontSize: 15, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>{value || "—"}</span>
        <Lock size={13} color="rgba(255,255,255,0.2)" />
      </div>
    </div>
  );

  const F = ({ label, name, type = "text", readOnly }: { label: string; name: keyof typeof form; type?: string; readOnly?: boolean }) => (
    <div>
      <label style={labelStyle}>{label}</label>
      {type === "date" ? (
        <DatePicker
          value={form[name] as string}
          onChange={readOnly ? () => {} : (v) => setForm(p => ({ ...p, [name]: v }))}
          disabled={readOnly}
        />
      ) : (
        <input
          type={type}
          value={form[name]}
          onChange={readOnly ? undefined : (e) => setForm(p => ({ ...p, [name]: e.target.value }))}
          readOnly={readOnly}
          style={{ ...inputStyle, opacity: readOnly ? 0.5 : 1, cursor: readOnly ? "not-allowed" : "auto" }}
        />
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#f0f4ff", marginBottom: 4 }}>My Profile</h1>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 14 }}>Manage your personal information and identity.</p>
      </div>

      {success && (
        <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.2)", color: "#00E5A0", fontSize: 13, marginBottom: 20 }}>
          ✓ {success}
        </div>
      )}
      {error && (
        <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(255,59,92,0.08)", border: "1px solid rgba(255,59,92,0.2)", color: "#FF3B5C", fontSize: 13, marginBottom: 20 }}>
          {error}
        </div>
      )}

      {/* Profile Hero */}
      <div style={{ ...cardStyle, background: "linear-gradient(135deg, rgba(0,212,255,0.06), rgba(13,26,48,0.8))", border: "1px solid rgba(0,212,255,0.12)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: `linear-gradient(135deg, ${avatarColor}, rgba(0,212,255,0.6))`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, fontWeight: 700, color: "#fff", flexShrink: 0,
            boxShadow: `0 0 24px ${avatarColor}40`,
          }}>
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#f0f4ff", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
              {user.firstName} {user.lastName}
              {(user.status === "ACTIVE" || user.kycStatus === "VERIFIED" || user.kycStatus === "APPROVED") && (
                <span title="Verified Bank Customer" style={{ display: "inline-flex", flexShrink: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-label="Verified">
                    {/* Outer glow ring */}
                    <circle cx="12" cy="12" r="11.5" fill="url(#vgrad)" />
                    <circle cx="12" cy="12" r="11" fill="transparent" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5"/>
                    {/* Inner checkmark circle */}
                    <circle cx="12" cy="12" r="9" fill="url(#vgrad)" />
                    {/* Star points for premium feel */}
                    <path d="M12 3L13.2 8H18.2L14.1 10.9L15.4 15.9L12 13L8.6 15.9L9.9 10.9L5.8 8H10.8L12 3Z" fill="rgba(255,255,255,0.15)" />
                    {/* Checkmark */}
                    <path d="M8 12L10.5 14.5L16 9" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                      <linearGradient id="vgrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#1D9BF0"/>
                        <stop offset="100%" stopColor="#0066CC"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              )}
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 10 }}>{user.email}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={{
                padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
                background: user.status === "ACTIVE" ? "rgba(0,229,160,0.1)" : "rgba(255,59,92,0.1)",
                color: user.status === "ACTIVE" ? "#00E5A0" : "#FF3B5C",
                border: `1px solid ${user.status === "ACTIVE" ? "rgba(0,229,160,0.25)" : "rgba(255,59,92,0.25)"}`,
              }}>
                {user.status}
              </span>
              {(user.kycStatus === "VERIFIED" || user.kycStatus === "APPROVED") ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: "rgba(0,212,255,0.08)", color: "#00D4FF", border: "1px solid rgba(0,212,255,0.2)" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" fill="rgba(0,212,255,0.2)" stroke="#00D4FF" strokeWidth="1.5"/>
                    <path d="M9 12l2 2 4-4" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  KYC Verified
                </span>
              ) : (
                <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  KYC {user.kycStatus || "PENDING"}
                </span>
              )}
              {user.twoFactorEnabled && (
                <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: "rgba(240,180,41,0.08)", color: "#F0B429", border: "1px solid rgba(240,180,41,0.2)" }}>
                  2FA Enabled
                </span>
              )}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 2 }}>Member Since</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#f0f4ff" }}>{memberSince}</div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f0f4ff", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
          <span>👤</span> Personal Information
        </h3>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>Personal details are managed by administrators. Contact support to request changes.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          <ReadField label="First Name" value={user.firstName} />
          <ReadField label="Last Name" value={user.lastName} />
          <div>
            <label style={labelStyle}>Email Address</label>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "12px 16px", color: "rgba(255,255,255,0.5)", fontSize: 15, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{user.email}</span>
              <Lock size={13} color="rgba(255,255,255,0.2)" />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Phone Number</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))} style={inputStyle} placeholder="+1 555 000 0000" />
          </div>
          <ReadField label="Date of Birth" value={form.dateOfBirth ? new Date(form.dateOfBirth).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : ""} />
          <ReadField label="Gender" value={form.gender} />
          <ReadField label="Nationality" value={form.nationality} />
        </div>
      </div>

      {/* Home Address */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f0f4ff", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
          <span>🏠</span> Home Address
        </h3>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>Address information is managed by administrators.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <ReadField label="Address Line 1" value={form.addressLine1} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <ReadField label="Address Line 2" value={form.addressLine2} />
          </div>
          <ReadField label="City" value={form.city} />
          <ReadField label="State / Province" value={form.state} />
          <ReadField label="ZIP / Postal Code" value={form.zipCode} />
          <ReadField label="Country" value={form.country} />
        </div>
      </div>

      {/* Identification */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f0f4ff", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
          <span>🪪</span> Identification
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          <div>
            <label style={labelStyle}>ID Type</label>
            <Select
              value={form.idType}
              onChange={v => setForm(p => ({ ...p, idType: v }))}
              options={[
                { value: "", label: "Select type" },
                { value: "Passport", label: "Passport" },
                { value: "Driver License", label: "Driver's License" },
                { value: "National ID", label: "National ID" },
              ]}
            />
          </div>
          <F label="ID Number" name="idNumber" />
          <F label="ID Expiry Date" name="idExpiry" type="date" />
          <div>
            <label style={labelStyle}>KYC Status</label>
            <div style={{
              padding: "10px 14px", borderRadius: 10,
              background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.12)",
              fontSize: 13, fontWeight: 600, color: "#00D4FF",
            }}>
              {user.kycStatus || "PENDING"}
            </div>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f0f4ff", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
          <span>🏦</span> Account Information
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {[
            { label: "Account Role", value: user.role },
            { label: "Account Status", value: user.status },
            { label: "Member Since", value: memberSince },
            { label: "Relationship Manager", value: user.relationshipManager || "Not assigned" },
          ].map(({ label, value }) => (
            <div key={label}>
              <label style={labelStyle}>{label}</label>
              <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", fontSize: 13, color: "#f0f4ff" }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ID Document Upload */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f0f4ff", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
          <span>📎</span> Upload Identity Document
        </h3>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 20, lineHeight: 1.6 }}>
          Accepted documents: Passport, Driver&apos;s License, National ID Card. Max file size: 5MB. Formats: JPG, PNG, PDF.
        </p>

        {idSuccess && (
          <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.2)", color: "#00E5A0", fontSize: 13, marginBottom: 14 }}>
            ✓ {idSuccess}
          </div>
        )}
        {idError && (
          <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(255,59,92,0.08)", border: "1px solid rgba(255,59,92,0.2)", color: "#FF3B5C", fontSize: 13, marginBottom: 14 }}>
            {idError}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              border: `2px dashed ${idFile ? "rgba(0,212,255,0.4)" : "rgba(255,255,255,0.1)"}`,
              borderRadius: 12, padding: "28px 20px", textAlign: "center", cursor: "pointer",
              background: idFile ? "rgba(0,212,255,0.04)" : "rgba(255,255,255,0.01)",
              transition: "all 0.2s ease",
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <div style={{ fontSize: 32, marginBottom: 10 }}>📄</div>
            {idFile ? (
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#00D4FF", marginBottom: 4 }}>{idFile.name}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{(idFile.size / 1024 / 1024).toFixed(2)} MB · Click to change</div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#f0f4ff", marginBottom: 4 }}>Click to select document</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>Passport · Driver&apos;s License · National ID</div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) { setIdFile(f); setIdError(""); }
              }}
            />
          </div>

          {idFile && (
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => { setIdFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                style={{ padding: "10px 18px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 13 }}
              >
                Remove
              </button>
              <button
                onClick={handleIdUpload}
                disabled={idUploading}
                style={{
                  flex: 1, padding: "10px 24px", borderRadius: 10, border: "none", cursor: idUploading ? "not-allowed" : "pointer",
                  background: idUploading ? "rgba(0,212,255,0.3)" : "linear-gradient(135deg, #00D4FF, #0088CC)",
                  color: "#03050a", fontWeight: 700, fontSize: 14,
                }}
              >
                {idUploading ? "Uploading…" : "Upload Document"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Uploaded Documents */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f0f4ff", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
          <span>📋</span> Uploaded Documents
        </h3>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 20, lineHeight: 1.6 }}>
          Documents you have uploaded for identity verification.
        </p>
        {documents.length === 0 ? (
          <div style={{ padding: "24px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 13, background: "rgba(255,255,255,0.02)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.05)" }}>
            No documents uploaded yet.
          </div>
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
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: isPdf ? "rgba(255,59,92,0.1)" : "rgba(0,212,255,0.1)", border: `1px solid ${isPdf ? "rgba(255,59,92,0.2)" : "rgba(0,212,255,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {isPdf ? <FileText size={18} color="#FF3B5C" /> : <ImageIcon size={18} color="#00D4FF" />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#f0f4ff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.documentType}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{doc.fileName} · {fileSizeMB} MB</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>Uploaded {uploadDate} at {uploadTime}</div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", flexShrink: 0 }}>{ext}</span>
                  <button onClick={() => setPreviewDoc({ url: doc.fileUrl, fileType: doc.fileType, fileName: doc.fileName })} style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid rgba(0,212,255,0.25)", background: "rgba(0,212,255,0.06)", color: "#00D4FF", fontSize: 12, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>
                    View
                  </button>
                  <button
                    onClick={() => setDocDeleteConfirm({ id: doc.id, fileName: doc.fileName, documentType: doc.documentType })}
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
      </div>

      {/* Document delete confirm modal */}
      {docDeleteConfirm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#0F2040", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: 32, maxWidth: 380, width: "100%" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 20 }}>🗑️</div>
            <h3 style={{ color: "white", fontSize: 17, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>Delete Document?</h3>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
              <div style={{ color: "#f0f4ff", fontSize: 13, fontWeight: 600 }}>{docDeleteConfirm.documentType}</div>
              <div style={{ color: "#6B7280", fontSize: 12, marginTop: 2 }}>{docDeleteConfirm.fileName}</div>
            </div>
            <p style={{ color: "#EF4444", fontSize: 12, textAlign: "center", marginBottom: 18 }}>⚠️ This cannot be undone.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDocDeleteConfirm(null)} style={{ flex: 1, padding: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Cancel</button>
              <button onClick={() => handleDeleteDoc(docDeleteConfirm.id)} style={{ flex: 2, padding: "10px", background: "#DC2626", border: "none", color: "white", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Document preview modal */}
      {previewDoc && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setPreviewDoc(null)}>
          <div style={{ background: "#0d1a30", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 24, maxWidth: "90vw", maxHeight: "90vh", overflow: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#f0f4ff" }}>{previewDoc.fileName}</span>
              <div style={{ display: "flex", gap: 10 }}>
                <a href={previewDoc.url} target="_blank" rel="noreferrer" style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid rgba(0,212,255,0.25)", background: "rgba(0,212,255,0.06)", color: "#00D4FF", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>Open in new tab</a>
                <button onClick={() => setPreviewDoc(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 20, cursor: "pointer", padding: "0 4px" }}>✕</button>
              </div>
            </div>
            {previewDoc.fileType === "application/pdf" ? (
              <iframe src={previewDoc.url} style={{ width: "min(760px, 80vw)", height: "70vh", borderRadius: 8, border: "none" }} />
            ) : (
              <img src={previewDoc.url} alt={previewDoc.fileName} style={{ maxWidth: "min(760px, 80vw)", maxHeight: "70vh", borderRadius: 8, display: "block" }} />
            )}
          </div>
        </div>
      )}

      {/* Save button */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
        <button onClick={handleSave} disabled={saving} style={{
          padding: "12px 32px", borderRadius: 12, border: "none", cursor: saving ? "not-allowed" : "pointer",
          background: saving ? "rgba(0,212,255,0.3)" : "linear-gradient(135deg, #00D4FF, #0088CC)",
          color: "#03050a", fontWeight: 700, fontSize: 14,
        }}>
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
