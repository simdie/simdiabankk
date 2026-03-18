"use client";

import { useState, useRef } from "react";
import Select from "@/components/ui/Select";

interface SupportReply {
  id: string;
  body: string;
  fromAdmin: boolean;
  createdAt: string;
}

interface SupportMessage {
  id: string;
  ticketId: string | null;
  subject: string;
  category: string;
  priority: string;
  message: string;
  reference: string | null;
  status: string;
  createdAt: string;
  adminReply: string | null;
  repliedAt: string | null;
  closedAt: string | null;
  replies: SupportReply[];
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

const fmt = (d: string) => new Date(d).toLocaleString("en-US", {
  month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
});

const statusColors: Record<string, string> = {
  OPEN: "#00E5A0",
  SENT: "#00D4FF",
  REPLIED: "#00D4FF",
  RESOLVED: "#00E5A0",
  CLOSED: "#6B7280",
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
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [replyLoading, setReplyLoading] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

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
      setSuccess("Ticket created successfully! Reference: " + (data.message.ticketId || ""));
      setTimeout(() => setSuccess(""), 6000);
    } finally { setSending(false); }
  }

  async function handleReply(msgId: string) {
    const text = replyTexts[msgId]?.trim();
    if (!text) return;
    setReplyLoading(msgId);
    try {
      const res = await fetch(`/api/support/${msgId}/reply`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: text }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || "Failed to send reply"); return; }
      setMessages(prev => prev.map(m =>
        m.id === msgId
          ? { ...m, replies: [...(m.replies ?? []), data.reply], status: "OPEN" }
          : m
      ));
      setReplyTexts(prev => ({ ...prev, [msgId]: "" }));
    } finally { setReplyLoading(null); }
  }

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
      <div ref={formRef} style={{ padding: "28px 28px", borderRadius: 16, background: "rgba(13,26,48,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f0f4ff", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
          💬 Open New Ticket
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>Subject</label>
            <input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="Brief description of your issue" style={inputStyle} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={labelStyle}>Category</label>
              <Select options={CATEGORY_OPTIONS} value={form.category} onChange={val => setForm(p => ({ ...p, category: val }))} />
            </div>
            <div>
              <label style={labelStyle}>Priority</label>
              <Select options={PRIORITY_OPTIONS} value={form.priority} onChange={val => setForm(p => ({ ...p, priority: val }))} />
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
          }}>
            {sending ? "Sending…" : "🔒 Open Support Ticket"}
          </button>
        </div>
      </div>

      {/* Ticket history */}
      <div>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f0f4ff", marginBottom: 14 }}>My Tickets</h3>
        {messages.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 14, background: "rgba(13,26,48,0.4)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.05)" }}>
            No tickets yet.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map(msg => {
              const isClosed = msg.status === "CLOSED";
              const replies = msg.replies ?? [];
              const lastReply = replies[replies.length - 1];
              const preview = lastReply ? lastReply.body : msg.message;
              const statusColor = statusColors[msg.status] || "#00D4FF";

              return (
                <div key={msg.id} style={{
                  borderRadius: 12, overflow: "hidden",
                  background: "rgba(13,26,48,0.6)",
                  border: `1px solid ${isClosed ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.06)"}`,
                  opacity: isClosed ? 0.75 : 1,
                }}>
                  {/* Card header */}
                  <div
                    onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
                    style={{ padding: "14px 20px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 12 }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Ticket ID badge + subject */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                        {msg.ticketId && (
                          <span style={{
                            fontFamily: "var(--font-jetbrains-mono, monospace)", fontSize: 10, fontWeight: 700,
                            color: isClosed ? "#6B7280" : "#00C896",
                            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: 4, padding: "2px 7px", letterSpacing: "0.06em", flexShrink: 0,
                          }}>{msg.ticketId}</span>
                        )}
                        <span style={{ fontSize: 14, fontWeight: 600, color: isClosed ? "rgba(255,255,255,0.45)" : "#f0f4ff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {isClosed && "🔒 "}{msg.subject}
                        </span>
                      </div>
                      {/* Preview */}
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" as const }}>
                        {preview.slice(0, 80)}{preview.length > 80 ? "…" : ""}
                      </div>
                      {/* Meta */}
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <span>{msg.category}</span>
                        <span>·</span>
                        <span>{msg.priority}</span>
                        <span>·</span>
                        <span>{new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        {replies.length > 0 && (
                          <><span>·</span><span style={{ color: "#00D4FF" }}>{replies.length} {replies.length === 1 ? "reply" : "replies"}</span></>
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <span style={{
                        padding: "3px 10px", borderRadius: 999, fontSize: 10, fontWeight: 700,
                        color: statusColor, background: `${statusColor}18`, border: `1px solid ${statusColor}30`,
                        whiteSpace: "nowrap",
                      }}>
                        {msg.status}
                      </span>
                      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>{expanded === msg.id ? "▲" : "▼"}</span>
                    </div>
                  </div>

                  {/* Expanded thread */}
                  {expanded === msg.id && (
                    <div style={{ padding: "0 20px 20px", background: "rgba(6,10,20,0.5)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>

                      {/* Ticket header block */}
                      <div style={{
                        background: "rgba(0,200,150,0.05)", border: "1px solid rgba(0,200,150,0.13)",
                        borderRadius: 10, padding: "12px 16px", margin: "16px 0",
                        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8,
                      }}>
                        <div>
                          <div style={{ fontSize: 10, color: "#6B7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>Ticket Reference</div>
                          <div style={{ fontFamily: "var(--font-jetbrains-mono, monospace)", color: "#00C896", fontSize: 15, fontWeight: 700, letterSpacing: "0.05em" }}>
                            {msg.ticketId || msg.id.slice(0, 8).toUpperCase()}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 11, color: "#6B7280" }}>Opened {fmt(msg.createdAt)}</div>
                          <div style={{ fontSize: 11, marginTop: 3, fontWeight: 600, color: isClosed ? "#6B7280" : "#00C896" }}>
                            {isClosed ? "🔒 Closed — Read only" : `🟢 Open · ${replies.length} ${replies.length === 1 ? "reply" : "replies"}`}
                          </div>
                        </div>
                      </div>

                      {/* Conversation thread */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                        {/* Original message — user right-aligned */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>You · {fmt(msg.createdAt)}</div>
                          <div style={{
                            maxWidth: "82%", padding: "12px 16px",
                            borderRadius: "16px 16px 4px 16px",
                            background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.2)",
                            color: "#e0f4ff", fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap",
                          }}>{msg.message}</div>
                          {msg.reference && (
                            <div style={{ marginTop: 4, fontSize: 11, color: "rgba(0,212,255,0.6)", background: "rgba(0,212,255,0.07)", border: "1px solid rgba(0,212,255,0.15)", borderRadius: 6, padding: "2px 8px" }}>
                              Ref: {msg.reference}
                            </div>
                          )}
                        </div>

                        {/* Reply thread */}
                        {replies.map(r => {
                          const isSystem = !r.fromAdmin && r.body.startsWith("✓ This ticket has been");
                          if (isSystem) {
                            return (
                              <div key={r.id} style={{ textAlign: "center", padding: "10px 16px", background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 12, color: "#6B7280" }}>
                                {r.body}
                                <div style={{ fontSize: 10, marginTop: 4, color: "rgba(255,255,255,0.2)" }}>{fmt(r.createdAt)}</div>
                              </div>
                            );
                          }
                          return (
                            <div key={r.id} style={{ display: "flex", flexDirection: "column", alignItems: r.fromAdmin ? "flex-start" : "flex-end" }}>
                              <div style={{ fontSize: 10, fontWeight: 700, color: r.fromAdmin ? "#00D4FF" : "rgba(255,255,255,0.35)", marginBottom: 4 }}>
                                {r.fromAdmin ? "🏦 Bank of Asia Online" : "You"} · {fmt(r.createdAt)}
                              </div>
                              <div style={{
                                maxWidth: "82%", padding: "12px 16px",
                                borderRadius: r.fromAdmin ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
                                background: r.fromAdmin ? "rgba(14,76,110,0.35)" : "rgba(0,212,255,0.12)",
                                border: `1px solid ${r.fromAdmin ? "rgba(0,150,200,0.2)" : "rgba(0,212,255,0.2)"}`,
                                color: r.fromAdmin ? "#c8e8f0" : "#e0f4ff", fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap",
                              }}>{r.body}</div>
                            </div>
                          );
                        })}

                        {replies.length === 0 && (
                          <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, textAlign: "center", padding: "8px 0" }}>
                            • • •&nbsp;&nbsp;Awaiting response from support team
                          </div>
                        )}
                      </div>

                      {/* Reply input or closed state */}
                      {isClosed ? (
                        <div style={{ marginTop: 20, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "20px", textAlign: "center" }}>
                          <div style={{ fontSize: 24, marginBottom: 8 }}>🔒</div>
                          <p style={{ color: "#6B7280", fontSize: 14, margin: "0 0 12px" }}>This ticket is closed. Open a new ticket for further help.</p>
                          <button
                            onClick={() => { setExpanded(null); formRef.current?.scrollIntoView({ behavior: "smooth" }); }}
                            style={{ background: "rgba(0,200,150,0.1)", border: "1px solid rgba(0,200,150,0.3)", color: "#00C896", borderRadius: 8, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                          >
                            Open New Ticket
                          </button>
                        </div>
                      ) : (
                        <div style={{ marginTop: 16 }}>
                          <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                            Reply to {msg.ticketId || "Ticket"}
                          </div>
                          <textarea
                            value={replyTexts[msg.id] || ""}
                            onChange={e => setReplyTexts(prev => ({ ...prev, [msg.id]: e.target.value }))}
                            placeholder="Type your reply… (Shift+Enter for new line)"
                            rows={3}
                            style={{
                              width: "100%", minHeight: 90, background: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
                              padding: "12px 14px", color: "#f0f4ff", fontSize: 14,
                              lineHeight: 1.6, resize: "vertical", fontFamily: "inherit",
                              outline: "none", boxSizing: "border-box",
                            }}
                            onKeyDown={e => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleReply(msg.id);
                              }
                            }}
                          />
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                            <span style={{ fontSize: 11, color: "#6B7280" }}>Enter to send · Shift+Enter for new line</span>
                            <button
                              onClick={() => handleReply(msg.id)}
                              disabled={!replyTexts[msg.id]?.trim() || replyLoading === msg.id}
                              style={{
                                background: replyTexts[msg.id]?.trim() ? "#00C896" : "#374151",
                                color: "white", border: "none", borderRadius: 8,
                                padding: "10px 22px", fontSize: 14, fontWeight: 600,
                                cursor: replyTexts[msg.id]?.trim() ? "pointer" : "not-allowed",
                                opacity: replyLoading === msg.id ? 0.6 : 1,
                              }}
                            >
                              {replyLoading === msg.id ? "Sending…" : "Send Reply ↑"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
