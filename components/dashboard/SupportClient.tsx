"use client";

import { useState } from "react";
import Select from "@/components/ui/Select";

interface SupportMessage {
  id: string; subject: string; category: string; priority: string;
  message: string; reference: string | null; status: string; createdAt: string;
  adminReply: string | null; repliedAt: string | null;
}

const CATEGORIES = [
  "General Inquiry", "Account Issue", "Transaction Dispute",
  "Card Issue", "Technical Problem", "Compliance", "Other",
];

const CATEGORY_OPTIONS = CATEGORIES.map(c => ({ value: c, label: c }));
const PRIORITY_OPTIONS = [
  { value: "NORMAL", label: "Normal" },
  { value: "URGENT", label: "Urgent" },
];

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", borderRadius: 10,
  background: "rgba(6,12,24,0.7)", border: "1px solid rgba(255,255,255,0.08)",
  color: "#f0f4ff", fontSize: 14, outline: "none", boxSizing: "border-box",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
  textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 6,
};

export default function SupportClient({ user, messages: initial }: {
  user: { firstName: string; lastName: string; email: string };
  messages: SupportMessage[];
}) {
  const [messages, setMessages] = useState(initial);
  const [form, setForm] = useState({ subject: "", category: "General Inquiry", priority: "NORMAL", message: "", reference: "" });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  async function handleSend() {
    if (form.message.length < 20) { setError("Message must be at least 20 characters."); return; }
    setSending(true); setError(""); setSuccess("");
    try {
      const res = await fetch("/api/support", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to send"); return; }
      setMessages(p => [data.message, ...p]);
      setForm({ subject: "", category: "General Inquiry", priority: "NORMAL", message: "", reference: "" });
      setSuccess("Message sent successfully! Our team will respond within 24 hours.");
      setTimeout(() => setSuccess(""), 5000);
    } finally { setSending(false); }
  }

  const statusColors: Record<string, string> = {
    SENT: "#00D4FF", READ: "#F0B429", REPLIED: "#00E5A0",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 780, margin: "0 auto" }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#f0f4ff", marginBottom: 4 }}>Contact Support</h1>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 14 }}>Send a secure message to the Bank of Asia Online operations team.</p>
      </div>

      {/* Contact info banner */}
      <div style={{ padding: "16px 20px", borderRadius: 12, background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <span style={{ fontSize: 22 }}>✉</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#f0f4ff", marginBottom: 2 }}>Email our support team directly</div>
          <a href="mailto:support@boasiaonline.com" style={{ fontSize: 14, color: "#00D4FF", fontWeight: 700, textDecoration: "none", fontFamily: "monospace" }}>
            support@boasiaonline.com
          </a>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 12, color: "rgba(255,255,255,0.35)", textAlign: "right" }}>
          Response time: within 24 hours<br />
          <span style={{ color: "#00E5A0", fontWeight: 600 }}>Available 24/7</span>
        </div>
      </div>

      {success && (
        <div style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.2)", color: "#00E5A0", fontSize: 13 }}>
          ✓ {success}
        </div>
      )}

      {/* Compose form */}
      <div style={{ padding: "28px 28px", borderRadius: 16, background: "rgba(13,26,48,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f0f4ff", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
          💬 Compose Message
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>Subject</label>
            <input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="Brief description of your issue" style={inputStyle} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={labelStyle}>Category</label>
              <Select
                options={CATEGORY_OPTIONS}
                value={form.category}
                onChange={val => setForm(p => ({ ...p, category: val }))}
              />
            </div>
            <div>
              <label style={labelStyle}>Priority</label>
              <Select
                options={PRIORITY_OPTIONS}
                value={form.priority}
                onChange={val => setForm(p => ({ ...p, priority: val }))}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Reference Number (Optional)</label>
            <input value={form.reference} onChange={e => setForm(p => ({ ...p, reference: e.target.value }))} placeholder="Transaction reference, account number, etc." style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Message</label>
            <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Please describe your issue in detail (minimum 20 characters)…" rows={6}
              style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit", lineHeight: 1.6 }} />
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>
              {form.message.length} / 20 min characters
            </div>
          </div>

          {error && <div style={{ fontSize: 13, color: "#FF3B5C" }}>{error}</div>}

          <button onClick={handleSend} disabled={sending} style={{
            padding: "12px 28px", borderRadius: 11, border: "none", cursor: sending ? "not-allowed" : "pointer",
            background: sending ? "rgba(0,212,255,0.3)" : "linear-gradient(135deg, #00D4FF, #0088CC)",
            color: "#03050a", fontWeight: 700, fontSize: 14, alignSelf: "flex-start",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            {sending ? "Sending…" : "🔒 Send Secure Message"}
          </button>
        </div>
      </div>

      {/* Message history */}
      <div>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f0f4ff", marginBottom: 14 }}>Message History</h3>
        {messages.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 14, background: "rgba(13,26,48,0.4)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.05)" }}>
            No messages sent yet.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ borderRadius: 12, background: "rgba(13,26,48,0.6)", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
                <div
                  onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
                  style={{ padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#f0f4ff", marginBottom: 4 }}>{msg.subject}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                      {msg.category} &nbsp;•&nbsp; {msg.priority}
                      &nbsp;•&nbsp; {new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                  </div>
                  <span style={{
                    padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
                    color: statusColors[msg.status] || "#00D4FF",
                    background: `${statusColors[msg.status] || "#00D4FF"}15`,
                    border: `1px solid ${statusColors[msg.status] || "#00D4FF"}30`,
                  }}>
                    {msg.status}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>{expanded === msg.id ? "▲" : "▼"}</span>
                </div>

                {expanded === msg.id && (
                  <div style={{ padding: "16px 20px 20px", background: "rgba(6,10,20,0.4)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>

                    {/* User message bubble — right-aligned */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginBottom: 16 }}>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>You</div>
                      <div style={{
                        maxWidth: "80%", padding: "12px 16px",
                        borderRadius: "16px 16px 4px 16px",
                        background: "rgba(0,212,255,0.12)",
                        border: "1px solid rgba(0,212,255,0.2)",
                        color: "#e0f4ff", fontSize: 13, lineHeight: 1.7,
                      }}>
                        {msg.message}
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 6 }}>
                        {new Date(msg.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                      </div>
                      {msg.reference && (
                        <div style={{
                          marginTop: 4, fontSize: 11, color: "rgba(0,212,255,0.6)",
                          background: "rgba(0,212,255,0.07)", border: "1px solid rgba(0,212,255,0.15)",
                          borderRadius: 6, padding: "2px 8px",
                        }}>
                          Ref: {msg.reference}
                        </div>
                      )}
                    </div>

                    {/* Admin reply bubble — left-aligned, or awaiting indicator */}
                    {msg.adminReply ? (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginBottom: 16 }}>
                        <div style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          fontSize: 10, fontWeight: 700, color: "#00D4FF",
                          background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.15)",
                          borderRadius: 4, padding: "2px 7px", marginBottom: 6,
                        }}>
                          🏦 Bank of Asia Online
                        </div>
                        <div style={{
                          maxWidth: "80%", padding: "12px 16px",
                          borderRadius: "16px 16px 16px 4px",
                          background: "rgba(14,76,110,0.35)",
                          border: "1px solid rgba(0,150,200,0.2)",
                          color: "#c8e8f0", fontSize: 13, lineHeight: 1.7,
                        }}>
                          {msg.adminReply}
                        </div>
                        {msg.repliedAt && (
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 6 }}>
                            {new Date(msg.repliedAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
                        • • •&nbsp;&nbsp;&nbsp;Awaiting response from support team
                      </div>
                    )}

                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
