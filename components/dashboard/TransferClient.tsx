"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CURRENCY_FLAGS, COUNTRIES, formatAmount } from "@/lib/utils";
import Select from "@/components/ui/Select";

type TransferType = "INTERNAL" | "LOCAL_WIRE" | "INTERNATIONAL_WIRE";
interface Account { id: string; accountNumber: string; currency: string; balance: number }

const STEPS = ["Type", "Details", "Amount", "Review"];

const PURPOSE_OPTIONS = [
  { value: "FAMILY_SUPPORT", label: "Family Support" },
  { value: "BUSINESS_PAYMENT", label: "Business Payment" },
  { value: "EDUCATION", label: "Education Fees" },
  { value: "MEDICAL", label: "Medical Expenses" },
  { value: "PROPERTY", label: "Property Purchase" },
  { value: "INVESTMENT", label: "Investment" },
  { value: "PERSONAL_SAVINGS", label: "Personal Savings" },
  { value: "TRAVEL", label: "Travel & Tourism" },
  { value: "GOODS_SERVICES", label: "Goods & Services" },
  { value: "OTHER", label: "Other" },
];

const SOURCE_OPTIONS = [
  { value: "SALARY", label: "Salary / Employment Income" },
  { value: "BUSINESS", label: "Business Income" },
  { value: "INVESTMENT", label: "Investment Returns" },
  { value: "SAVINGS", label: "Personal Savings" },
  { value: "INHERITANCE", label: "Inheritance / Gift" },
  { value: "LOAN", label: "Loan Proceeds" },
  { value: "PENSION", label: "Pension / Retirement" },
  { value: "OTHER", label: "Other" },
];

const RELATIONSHIP_OPTIONS = [
  { value: "SELF", label: "Self" },
  { value: "SPOUSE", label: "Spouse / Partner" },
  { value: "PARENT", label: "Parent" },
  { value: "CHILD", label: "Child" },
  { value: "SIBLING", label: "Sibling" },
  { value: "FRIEND", label: "Friend" },
  { value: "BUSINESS", label: "Business Associate" },
  { value: "EMPLOYER", label: "Employer" },
  { value: "EMPLOYEE", label: "Employee" },
  { value: "OTHER", label: "Other" },
];

const COUNTRY_OPTIONS = COUNTRIES.map((c) => ({ value: c.code, label: c.name, flag: c.flag }));

// Hold-to-confirm button
function HoldButton({ onConfirm, disabled }: { onConfirm: () => void; disabled: boolean }) {
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    if (disabled) return;
    setHolding(true);
    interval.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval.current!);
          setHolding(false);
          onConfirm();
          return 0;
        }
        return p + 5;
      });
    }, 100);
  };

  const stop = () => {
    if (interval.current) clearInterval(interval.current);
    setHolding(false);
    setProgress(0);
  };

  return (
    <button
      onMouseDown={start} onMouseUp={stop} onMouseLeave={stop}
      onTouchStart={start} onTouchEnd={stop}
      disabled={disabled}
      style={{
        width: "100%", padding: "15px", borderRadius: 12,
        position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg, var(--color-accent), #0088cc)",
        border: "none", cursor: disabled ? "not-allowed" : "pointer",
        color: "#03050a", fontWeight: 800, fontSize: 15,
        userSelect: "none", opacity: disabled ? 0.5 : 1,
        transition: "box-shadow 0.2s ease",
        boxShadow: holding ? "0 0 32px rgba(0,212,255,0.5)" : "none",
      }}
    >
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0,
        width: `${progress}%`,
        background: "rgba(255,255,255,0.25)",
        transition: "width 0.1s linear",
        pointerEvents: "none",
      }} />
      <span style={{ position: "relative", zIndex: 1 }}>
        {progress > 0 ? `Hold… ${Math.round(progress)}%` : "🔒 Hold to Confirm Transfer"}
      </span>
    </button>
  );
}

export default function TransferClient({
  accounts,
  requiresTokenForTransfers = false,
  hasValidToken = false,
}: {
  accounts: Account[];
  requiresTokenForTransfers?: boolean;
  hasValidToken?: boolean;
}) {
  const [step, setStep] = useState(0);
  const [txType, setTxType] = useState<TransferType>("INTERNAL");
  const [senderAccountId, setSenderAccountId] = useState(accounts[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState(accounts[0]?.currency ?? "USD");
  const [description, setDescription] = useState("");
  const [purpose, setPurpose] = useState("");
  const [sourceOfFunds, setSourceOfFunds] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [transferToken, setTransferToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [tokenError, setTokenError] = useState("");
  const [success, setSuccess] = useState<{ reference: string; amount: number; currency: string; requiresEmailConfirm: boolean } | null>(null);

  // Internal
  const [receiverAccountNumber, setReceiverAccountNumber] = useState("");
  const [receiverPreview, setReceiverPreview] = useState<{ name: string; currency: string } | null>(null);
  const [lookingUp, setLookingUp] = useState(false);

  // Wire fields
  const [wire, setWire] = useState({
    beneficiaryName: "", bankName: "", bankAddress: "", accountNumber: "",
    routingNumber: "", swift: "", iban: "", country: "US",
    correspondentBank: "", memo: "", relationship: "",
  });

  // Pre-fill from saved beneficiary
  const searchParams = useSearchParams();
  const [prefillBeneficiary, setPrefillBeneficiary] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const beneficiaryId = searchParams.get("beneficiary");
    const presetType = searchParams.get("type");
    if (!beneficiaryId) return;
    fetch(`/api/beneficiaries/${beneficiaryId}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!data?.beneficiary) return;
        const ben = data.beneficiary;
        setTxType("INTERNATIONAL_WIRE");
        setStep(1);
        setWire((prev) => ({
          ...prev,
          beneficiaryName: ben.name ?? "",
          bankName: ben.bankName ?? "",
          swift: ben.swiftCode ?? "",
          iban: ben.iban ?? "",
          country: ben.country ?? "US",
          bankAddress: ben.bankAddress ?? "",
        }));
        setPrefillBeneficiary({ name: ben.name });
      })
      .catch(() => null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const senderAccount = accounts.find((a) => a.id === senderAccountId);

  const accountOptions = accounts.map((a) => ({
    value: a.id,
    label: `${CURRENCY_FLAGS[a.currency] || ""} ${a.currency} — ••••${a.accountNumber.slice(-4)} — ${formatAmount(a.balance, a.currency)}`,
    flag: CURRENCY_FLAGS[a.currency],
  }));

  // Live account lookup
  useEffect(() => {
    if (txType !== "INTERNAL" || receiverAccountNumber.length !== 10) {
      setReceiverPreview(null); return;
    }
    setLookingUp(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/accounts/lookup?number=${receiverAccountNumber}`);
        if (res.ok) {
          const d = await res.json();
          setReceiverPreview(d.account);
        } else {
          setReceiverPreview(null);
        }
      } catch { setReceiverPreview(null); }
      finally { setLookingUp(false); }
    }, 500);
    return () => clearTimeout(t);
  }, [receiverAccountNumber, txType]);

  async function handleSubmit() {
    setLoading(true); setError(""); setTokenError("");
    if (requiresTokenForTransfers) {
      if (!transferToken.trim()) {
        setTokenError("Transfer token is required.");
        setLoading(false); return;
      }
      try {
        const validateRes = await fetch("/api/user/validate-transfer-token", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: transferToken.trim() }),
        });
        const validateData = await validateRes.json();
        if (!validateData.valid) {
          setTokenError("Invalid or expired token. Contact your admin.");
          setLoading(false); return;
        }
      } catch {
        setTokenError("Could not validate token. Please try again.");
        setLoading(false); return;
      }
    }
    try {
      const body: Record<string, unknown> = {
        type: txType,
        senderAccountId,
        amount: parseFloat(amount),
        description: description || undefined,
        ...(requiresTokenForTransfers ? { transferToken } : {}),
      };

      if (txType === "INTERNAL") {
        body.receiverAccountNumber = receiverAccountNumber;
      } else {
        body.currency = currency;
        const extDetails: Record<string, string> = {
          beneficiaryName: wire.beneficiaryName,
          bankName: wire.bankName,
          ...(purpose ? { purpose } : {}),
          ...(sourceOfFunds ? { sourceOfFunds } : {}),
        };

        if (txType === "LOCAL_WIRE") {
          extDetails.accountNumber = wire.accountNumber;
          extDetails.routingNumber = wire.routingNumber;
          if (wire.memo) extDetails.memo = wire.memo;
        } else {
          extDetails.swift = wire.swift;
          extDetails.iban = wire.iban;
          extDetails.country = wire.country;
          if (wire.bankAddress) extDetails.bankAddress = wire.bankAddress;
          if (wire.correspondentBank) extDetails.correspondentBank = wire.correspondentBank;
          if (wire.relationship) extDetails.relationship = wire.relationship;
        }
        body.externalDetails = extDetails;
      }

      const res = await fetch("/api/transactions/transfer", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) { setError(data.error || "Transfer failed"); return; }

      setSuccess({
        reference: data.transaction.reference,
        amount: parseFloat(amount),
        currency: senderAccount?.currency ?? currency,
        requiresEmailConfirm: data.requiresEmailConfirm,
      });
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  }

  // ── SUCCESS SCREEN ──
  if (success) {
    return (
      <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
        <div className="glass-card animate-fade-slide-up transfer-success-card" style={{ padding: "48px 40px" }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "rgba(0,229,160,0.1)", border: "2px solid rgba(0,229,160,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 36, margin: "0 auto 20px",
            boxShadow: "0 0 30px rgba(0,229,160,0.2)",
            animation: "float 4s ease-in-out infinite",
          }}>
            ✅
          </div>
          <h2 style={{ fontFamily: "var(--font-syne)", fontSize: 24, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 8 }}>
            {success.requiresEmailConfirm ? "Confirmation Email Sent!" : "Transfer Initiated!"}
          </h2>
          <p style={{ color: "var(--color-text-muted)", fontSize: 14, marginBottom: 20 }}>
            {success.requiresEmailConfirm
              ? "Check your email to confirm this transfer before it is processed."
              : "Your transfer has been processed successfully."}
          </p>
          <div style={{
            padding: "16px 20px", borderRadius: 12,
            background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)",
            marginBottom: 24,
          }}>
            <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginBottom: 6 }}>REFERENCE</div>
            <div style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace", fontSize: 15, fontWeight: 500, color: "#00C896", letterSpacing: "0.03em" }}>
              {success.reference}
            </div>
            <div style={{ marginTop: 12, fontFamily: "'DM Sans', -apple-system, sans-serif", fontSize: "clamp(28px, 3vw, 36px)", fontWeight: 700, letterSpacing: "-0.02em", color: "#FFFFFF" }}>
              {formatAmount(success.amount, success.currency)}
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => { setSuccess(null); setStep(0); setAmount(""); setDescription(""); setReceiverAccountNumber(""); setPurpose(""); setSourceOfFunds(""); }} className="btn-ghost" style={{ flex: 1 }}>
              New Transfer
            </button>
            <a href="/dashboard/transactions" className="btn-nexus" style={{ flex: 1, textDecoration: "none", display: "flex", justifyContent: "center", alignItems: "center" }}>
              View History
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Token-blocked warning
  if (requiresTokenForTransfers && !hasValidToken) {
    return (
      <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
        <div className="glass-card" style={{ padding: "48px 40px" }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "rgba(255,59,92,0.1)", border: "2px solid rgba(255,59,92,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 32, margin: "0 auto 20px",
          }}>
            🔐
          </div>
          <h2 style={{ fontFamily: "var(--font-syne)", fontSize: 20, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 10 }}>
            Transfer Token Required
          </h2>
          <p style={{ color: "var(--color-text-muted)", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
            Your account requires a transfer authorisation token to send money.
            Please contact your relationship manager or{" "}
            <a href="/dashboard/support" style={{ color: "var(--color-accent)", textDecoration: "none" }}>support</a>{" "}
            to request a token.
          </p>
          <a href="/dashboard/support" className="btn-nexus" style={{ textDecoration: "none", display: "inline-block", padding: "10px 28px" }}>
            Contact Support
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "var(--font-syne)", fontSize: 24, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 6 }}>
          Send Money
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
      </div>

      {/* Step indicator */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, marginBottom: 14, position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", left: 0, top: 0, height: "100%",
            width: `${(step / (STEPS.length - 1)) * 100}%`,
            background: "linear-gradient(90deg, var(--color-accent), #0088cc)",
            transition: "width 0.4s ease",
            boxShadow: "0 0 8px rgba(0,212,255,0.4)",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                background: i < step ? "var(--color-success)" : i === step ? "var(--color-accent)" : "rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700,
                color: i <= step ? "#03050a" : "var(--color-text-muted)",
                boxShadow: i === step ? "0 0 12px rgba(0,212,255,0.4)" : "none",
                transition: "all 0.3s ease",
              }}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className="transfer-step-label" style={{ fontSize: 10, fontWeight: i === step ? 700 : 400, color: i === step ? "var(--color-accent)" : "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {s}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card animate-fade-slide-up transfer-wizard-card" key={step} style={{ padding: "32px 36px" }}>

        {/* ── STEP 0: TYPE ── */}
        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <h3 style={{ fontFamily: "var(--font-syne)", fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 8 }}>
              Choose Transfer Type
            </h3>
            {([
              { type: "INTERNAL" as const, icon: "⇄", title: "Internal Transfer", desc: "Send to another Bank of Asia Online account instantly", time: "Instant" },
              { type: "LOCAL_WIRE" as const, icon: "🏛", title: "Local Wire Transfer", desc: "Send to a domestic bank account", time: "1-2 business days" },
              { type: "INTERNATIONAL_WIRE" as const, icon: "✈", title: "International Wire", desc: "Send to any bank worldwide via SWIFT/IBAN", time: "2-5 business days" },
            ]).map((opt) => (
              <button
                key={opt.type}
                onClick={() => { setTxType(opt.type); setStep(1); }}
                style={{
                  padding: "20px 22px", borderRadius: 14, cursor: "pointer",
                  background: txType === opt.type ? "rgba(0,212,255,0.08)" : "rgba(6,12,24,0.5)",
                  border: `1.5px solid ${txType === opt.type ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.07)"}`,
                  textAlign: "left", transition: "all 0.2s ease",
                  boxShadow: txType === opt.type ? "0 0 16px rgba(0,212,255,0.1)" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                  }}>
                    {opt.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "var(--color-text-primary)", marginBottom: 3 }}>{opt.title}</div>
                    <div style={{ fontSize: 13, color: "var(--color-text-muted)" }}>{opt.desc}</div>
                  </div>
                  <div style={{
                    padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600,
                    background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)",
                    color: "var(--color-accent)", whiteSpace: "nowrap",
                  }}>
                    {opt.time}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ── STEP 1: DETAILS ── */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <h3 style={{ fontFamily: "var(--font-syne)", fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 4 }}>
              {txType === "INTERNAL" ? "Recipient Details" : txType === "LOCAL_WIRE" ? "Beneficiary Details" : "International Beneficiary"}
            </h3>

            {/* Pre-fill banner */}
            {prefillBeneficiary && (
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 16px", borderRadius: 10,
                background: "rgba(0,212,255,0.07)", border: "1px solid rgba(0,212,255,0.2)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "var(--color-accent)", fontSize: 14 }}>✦</span>
                  <span style={{ fontSize: 13, color: "var(--color-accent)", fontWeight: 600 }}>
                    Pre-filled from saved beneficiary: {prefillBeneficiary.name}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setPrefillBeneficiary(null);
                    setWire({ beneficiaryName: "", bankName: "", bankAddress: "", accountNumber: "", routingNumber: "", swift: "", iban: "", country: "US", correspondentBank: "", memo: "", relationship: "" });
                  }}
                  style={{ background: "none", border: "none", color: "rgba(0,212,255,0.5)", cursor: "pointer", fontSize: 12, padding: "2px 6px" }}
                >
                  Clear
                </button>
              </div>
            )}

            {/* Sender account selector */}
            <div>
              <label style={labelStyle}>From Account</label>
              <Select
                options={accountOptions}
                value={senderAccountId}
                onChange={(val) => {
                  setSenderAccountId(val);
                  setCurrency(accounts.find((a) => a.id === val)?.currency ?? "USD");
                }}
              />
            </div>

            {txType === "INTERNAL" && (
              <div>
                <label style={labelStyle}>Recipient Account Number</label>
                <input
                  className="input-nexus"
                  placeholder="10-digit account number"
                  maxLength={10}
                  value={receiverAccountNumber}
                  onChange={(e) => setReceiverAccountNumber(e.target.value.replace(/\D/g, ""))}
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                />
                {lookingUp && <div style={{ marginTop: 8, fontSize: 12, color: "var(--color-text-muted)" }}>Looking up account…</div>}
                {receiverPreview && (
                  <div style={{
                    marginTop: 8, padding: "10px 14px", borderRadius: 10,
                    background: "rgba(0,229,160,0.06)", border: "1px solid rgba(0,229,160,0.2)",
                    display: "flex", alignItems: "center", gap: 10,
                  }}>
                    <span style={{ color: "var(--color-success)", fontSize: 16 }}>✓</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-primary)" }}>{receiverPreview.name}</div>
                      <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{receiverPreview.currency} Account</div>
                    </div>
                  </div>
                )}
                {receiverAccountNumber.length === 10 && !lookingUp && !receiverPreview && (
                  <div style={{ marginTop: 8, fontSize: 12, color: "var(--color-danger)" }}>✗ Account not found</div>
                )}
              </div>
            )}

            {txType === "LOCAL_WIRE" && (
              <>
                {[
                  { key: "beneficiaryName", label: "Beneficiary Name", placeholder: "Full legal name" },
                  { key: "bankName", label: "Bank Name", placeholder: "e.g. Chase Bank" },
                  { key: "accountNumber", label: "Account Number", placeholder: "Account number" },
                  { key: "routingNumber", label: "Routing Number", placeholder: "9-digit routing number" },
                  { key: "memo", label: "Memo (optional)", placeholder: "Payment reference" },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    <input
                      className="input-nexus"
                      placeholder={placeholder}
                      value={wire[key as keyof typeof wire]}
                      onChange={(e) => setWire((w) => ({ ...w, [key]: e.target.value }))}
                    />
                  </div>
                ))}
              </>
            )}

            {txType === "INTERNATIONAL_WIRE" && (
              <>
                {[
                  { key: "beneficiaryName", label: "Beneficiary Name", placeholder: "Full legal name" },
                  { key: "bankName", label: "Bank Name", placeholder: "e.g. HSBC" },
                  { key: "bankAddress", label: "Bank Address", placeholder: "Bank street address" },
                  { key: "swift", label: "SWIFT / BIC Code", placeholder: "8-11 character code" },
                  { key: "iban", label: "IBAN", placeholder: "International bank account number" },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    <input
                      className="input-nexus"
                      placeholder={placeholder}
                      value={wire[key as keyof typeof wire]}
                      onChange={(e) => setWire((w) => ({ ...w, [key]: e.target.value }))}
                      style={key === "swift" || key === "iban" ? { fontFamily: "var(--font-jetbrains-mono)", letterSpacing: 1 } : {}}
                    />
                  </div>
                ))}
                <div>
                  <label style={labelStyle}>Recipient Country</label>
                  <Select
                    options={COUNTRY_OPTIONS}
                    value={wire.country}
                    onChange={(val) => setWire((w) => ({ ...w, country: val }))}
                    searchable
                    placeholder="Select country..."
                  />
                </div>
                <div>
                  <label style={labelStyle}>Relationship to Beneficiary</label>
                  <Select
                    options={RELATIONSHIP_OPTIONS}
                    value={wire.relationship}
                    onChange={(val) => setWire((w) => ({ ...w, relationship: val }))}
                    placeholder="Select relationship..."
                  />
                </div>
                <div>
                  <label style={labelStyle}>Correspondent / Intermediary Bank (optional)</label>
                  <input className="input-nexus" placeholder="Intermediary bank if required" value={wire.correspondentBank} onChange={(e) => setWire((w) => ({ ...w, correspondentBank: e.target.value }))} />
                </div>
              </>
            )}
          </div>
        )}

        {/* ── STEP 2: AMOUNT ── */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h3 style={{ fontFamily: "var(--font-syne)", fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 4 }}>
              Transfer Amount
            </h3>

            {senderAccount && (
              <div style={{
                padding: "12px 16px", borderRadius: 10,
                background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.12)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>Available Balance</span>
                <span style={{ fontFamily: "'DM Sans', -apple-system, sans-serif", fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em", color: "#00C896" }}>
                  {formatAmount(senderAccount.balance, senderAccount.currency)}
                </span>
              </div>
            )}

            <div>
              <label style={labelStyle}>Amount</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*\.?[0-9]*"
                  className="input-nexus"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.]/g, "");
                    const parts = val.split(".");
                    if (parts.length > 2) return;
                    setAmount(val);
                  }}
                  style={{ fontFamily: "'DM Sans', -apple-system, sans-serif", fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 600, letterSpacing: "-0.01em", color: "#FFFFFF", paddingRight: 80, height: 64 }}
                />
                <div style={{
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                  fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 500, color: "#9CA3AF",
                }}>
                  {senderAccount?.currency ?? "USD"}
                </div>
              </div>
              {amount && senderAccount && parseFloat(amount) > senderAccount.balance && (
                <div style={{ marginTop: 8, fontSize: 13, color: "var(--color-danger)" }}>
                  ✗ Insufficient balance
                </div>
              )}
            </div>

            <div>
              <label style={labelStyle}>Description (optional)</label>
              <input
                className="input-nexus"
                placeholder="What's this transfer for?"
                maxLength={200}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {txType !== "INTERNAL" && (
              <>
                <div>
                  <label style={labelStyle}>Purpose of Transfer</label>
                  <Select
                    options={PURPOSE_OPTIONS}
                    value={purpose}
                    onChange={setPurpose}
                    placeholder="Select purpose..."
                  />
                </div>
                <div>
                  <label style={labelStyle}>Source of Funds</label>
                  <Select
                    options={SOURCE_OPTIONS}
                    value={sourceOfFunds}
                    onChange={setSourceOfFunds}
                    placeholder="Select source..."
                  />
                </div>
              </>
            )}

            {/* Fee estimate */}
            <div style={{ padding: "16px 18px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              {[
                ["Transfer Amount", amount ? formatAmount(parseFloat(amount), senderAccount?.currency ?? "USD") : "—"],
                ["Processing Fee", txType === "INTERNAL" ? "Free" : txType === "LOCAL_WIRE" ? "$25.00" : "$45.00"],
                ["Estimated Arrival", txType === "INTERNAL" ? "Instant" : txType === "LOCAL_WIRE" ? "1-2 business days" : "2-5 business days"],
              ].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", fontFamily: "'DM Sans', -apple-system, sans-serif" }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 3: REVIEW ── */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h3 style={{ fontFamily: "var(--font-syne)", fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 4 }}>
              Review & Confirm
            </h3>

            <div style={{ padding: "20px 22px", borderRadius: 14, background: "rgba(6,12,24,0.6)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {[
                ["Transfer Type", txType.replace(/_/g, " ")],
                ["From Account", `${senderAccount?.currency} ••••${senderAccount?.accountNumber.slice(-4)}`],
                ...(txType === "INTERNAL"
                  ? [["To Account", `••••${receiverAccountNumber.slice(-4)}`], ["Recipient", receiverPreview?.name ?? "—"]]
                  : [["Beneficiary", wire.beneficiaryName], ["Bank", wire.bankName]]),
                ...(txType === "INTERNATIONAL_WIRE" ? [["Country", COUNTRY_OPTIONS.find((c) => c.value === wire.country)?.label ?? wire.country]] : []),
                ["Amount", amount ? formatAmount(parseFloat(amount), senderAccount?.currency ?? "USD") : "—"],
                ...(purpose ? [["Purpose", PURPOSE_OPTIONS.find((p) => p.value === purpose)?.label ?? purpose]] : []),
                ...(sourceOfFunds ? [["Source of Funds", SOURCE_OPTIONS.find((s) => s.value === sourceOfFunds)?.label ?? sourceOfFunds]] : []),
                ...(description ? [["Description", description]] : []),
              ].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-primary)", textAlign: "right", maxWidth: 240 }}>{val}</span>
                </div>
              ))}
            </div>

            {/* Token field */}
            {requiresTokenForTransfers && (
              <div style={{ background: "rgba(0,200,150,0.06)", border: "1px solid rgba(0,200,150,0.2)", borderRadius: 12, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>🔑</span>
                  <p style={{ color: "#00C896", fontSize: 13, fontWeight: 600, margin: 0, lineHeight: 1.6 }}>
                    Transfer Token Code has been sent to your registered Email / Phone. Enter it below to authorise this transfer.
                  </p>
                </div>
                <label style={{ display: "block", color: "#9CA3AF", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                  Transfer Token
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showToken ? "text" : "password"}
                    value={transferToken}
                    onChange={e => { setTransferToken(e.target.value); setTokenError(""); }}
                    placeholder="Enter your transfer token"
                    style={{
                      width: "100%", background: "rgba(255,255,255,0.05)",
                      border: tokenError ? "1px solid #EF4444" : "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 10, padding: "14px 48px 14px 16px",
                      color: "#FFFFFF", fontSize: 15,
                      fontFamily: "var(--font-jetbrains-mono)", letterSpacing: "0.08em",
                      outline: "none", boxSizing: "border-box",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(p => !p)}
                    style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#6B7280", cursor: "pointer", padding: 4, fontSize: 16 }}
                  >
                    {showToken ? "🙈" : "👁️"}
                  </button>
                </div>
                {tokenError && <p style={{ color: "#EF4444", fontSize: 12, margin: "6px 0 0" }}>{tokenError}</p>}
              </div>
            )}

            <div style={{
              padding: "12px 16px", borderRadius: 10,
              background: "rgba(255,59,92,0.06)", border: "1px solid rgba(255,59,92,0.2)",
              fontSize: 13, color: "rgba(255,150,160,0.9)",
              display: "flex", gap: 8, alignItems: "flex-start",
            }}>
              <span>⚠️</span>
              <span>This action is irreversible. Please verify all details carefully before confirming.</span>
            </div>

            {error && (
              <div style={{ padding: "12px 16px", borderRadius: 10, background: "var(--color-danger-glow)", border: "1px solid rgba(255,59,92,0.25)", color: "var(--color-danger)", fontSize: 13 }}>
                {error}
              </div>
            )}

            <HoldButton
              onConfirm={handleSubmit}
              disabled={loading || (requiresTokenForTransfers && !transferToken)}
            />
          </div>
        )}

        {/* Navigation */}
        {step > 0 && step < 3 && (
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button onClick={() => setStep((s) => s - 1)} className="btn-ghost" style={{ flex: 1 }} disabled={loading}>
              ← Back
            </button>
            <button
              onClick={() => setStep((s) => s + 1)}
              className="btn-nexus"
              style={{ flex: 1 }}
              disabled={
                (step === 1 && txType === "INTERNAL" && receiverAccountNumber.length !== 10) ||
                (step === 1 && txType === "LOCAL_WIRE" && (!wire.beneficiaryName || !wire.bankName || !wire.accountNumber || !wire.routingNumber)) ||
                (step === 1 && txType === "INTERNATIONAL_WIRE" && (!wire.beneficiaryName || !wire.bankName || !wire.swift || !wire.iban)) ||
                (step === 2 && (!amount || parseFloat(amount) <= 0 || (senderAccount && parseFloat(amount) > senderAccount.balance)))
              }
            >
              Continue →
            </button>
          </div>
        )}
        {step === 3 && (
          <button onClick={() => setStep(2)} className="btn-ghost" style={{ width: "100%", marginTop: 12 }} disabled={loading}>
            ← Edit Amount
          </button>
        )}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 12, fontWeight: 600,
  color: "var(--color-text-muted)", marginBottom: 8,
  letterSpacing: "0.06em", textTransform: "uppercase",
};
