"use client";

import { useState } from "react";
import Link from "next/link";
import { COUNTRIES } from "@/lib/utils";
import Select from "@/components/ui/Select";

interface Beneficiary {
  id: string; name: string; bankName: string; accountNumber: string | null;
  iban: string | null; swiftCode: string | null; routingNumber: string | null;
  country: string; currency: string; bankAddress: string | null;
  isInternal: boolean; createdAt: string;
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

const emptyForm = {
  name: "", bankName: "", accountNumber: "", iban: "", swiftCode: "",
  routingNumber: "", country: "US", currency: "USD", bankAddress: "", isInternal: false,
};

export default function BeneficiariesClient({ beneficiaries: initial }: { beneficiaries: Beneficiary[] }) {
  const [beneficiaries, setBeneficiaries] = useState(initial);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const countryFlag = (code: string) => COUNTRIES.find(c => c.code === code)?.flag || "🌍";
  const countryName = (code: string) => COUNTRIES.find(c => c.code === code)?.name || code;

  async function handleAdd() {
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/beneficiaries", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to add"); return; }
      setBeneficiaries(p => [data.beneficiary, ...p]);
      setShowAdd(false); setForm(emptyForm);
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this beneficiary?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/beneficiaries?id=${id}`, { method: "DELETE" });
      setBeneficiaries(p => p.filter(b => b.id !== id));
    } finally { setDeleting(null); }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 860, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#f0f4ff", marginBottom: 4 }}>Beneficiaries</h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 14 }}>Saved recipients for quick transfers.</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} style={{
          padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer",
          background: "linear-gradient(135deg, #00D4FF, #0088CC)",
          color: "#03050a", fontWeight: 700, fontSize: 13,
        }}>
          + Add Beneficiary
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div style={{ padding: "28px 28px", borderRadius: 16, background: "rgba(13,26,48,0.7)", border: "1px solid rgba(0,212,255,0.15)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f0f4ff", marginBottom: 20 }}>New Beneficiary</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
            {([
              ["name", "Full Name"],
              ["bankName", "Bank Name"],
              ["accountNumber", "Account Number"],
              ["iban", "IBAN"],
              ["swiftCode", "SWIFT / BIC"],
              ["routingNumber", "Routing Number"],
              ["bankAddress", "Bank Address"],
              ["currency", "Currency"],
            ] as const).map(([k, l]) => (
              <div key={k}>
                <label style={labelStyle}>{l}</label>
                <input value={(form as any)[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} style={inputStyle} />
              </div>
            ))}
            <div>
              <label style={labelStyle}>Country</label>
              <Select
                value={form.country}
                onChange={(v) => setForm(p => ({ ...p, country: v }))}
                options={COUNTRIES.map(c => ({ value: c.code, label: c.name, flag: c.flag }))}
                placeholder="Select country..."
              />
            </div>
          </div>
          {error && <div style={{ marginTop: 12, fontSize: 13, color: "#FF3B5C" }}>{error}</div>}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button onClick={() => setShowAdd(false)} style={{ padding: "10px 20px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 13 }}>Cancel</button>
            <button onClick={handleAdd} disabled={saving} style={{ padding: "10px 24px", borderRadius: 10, border: "none", cursor: saving ? "not-allowed" : "pointer", background: saving ? "rgba(0,212,255,0.3)" : "linear-gradient(135deg, #00D4FF, #0088CC)", color: "#03050a", fontWeight: 700, fontSize: 13 }}>
              {saving ? "Saving…" : "Save Beneficiary"}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {beneficiaries.length === 0 ? (
        <div style={{ padding: 48, textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 14, background: "rgba(13,26,48,0.4)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)" }}>
          No beneficiaries added yet. Add your first one to speed up transfers.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {beneficiaries.map(b => (
            <div key={b.id} style={{ padding: "20px 24px", borderRadius: 14, background: "rgba(13,26,48,0.6)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                {countryFlag(b.country)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#f0f4ff", marginBottom: 4 }}>{b.name}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                  {b.bankName} &nbsp;•&nbsp; {countryName(b.country)} &nbsp;•&nbsp; {b.currency}
                </div>
                {(b.iban || b.accountNumber) && (
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", marginTop: 2 }}>
                    {b.iban ? `IBAN: ${b.iban}` : `Acct: ${b.accountNumber}`}
                    {b.swiftCode && ` • SWIFT: ${b.swiftCode}`}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <Link href={`/dashboard/transfer?beneficiary=${b.id}`} style={{
                  padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                  background: "linear-gradient(135deg, rgba(0,212,255,0.12), rgba(0,100,180,0.08))",
                  border: "1px solid rgba(0,212,255,0.2)", color: "#00D4FF", textDecoration: "none",
                }}>
                  Transfer
                </Link>
                <button onClick={() => handleDelete(b.id)} disabled={deleting === b.id} style={{
                  padding: "8px 12px", borderRadius: 8, fontSize: 13,
                  background: "rgba(255,59,92,0.06)", border: "1px solid rgba(255,59,92,0.15)",
                  color: "#FF3B5C", cursor: "pointer",
                }}>
                  {deleting === b.id ? "…" : "✕"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
