"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import Select from "@/components/ui/Select";

interface SupportReply {
  id: string;
  body: string;
  fromAdmin: boolean;
  createdAt: string;
}

interface Message {
  id: string;
  ticketId: string | null;
  subject: string;
  category: string;
  priority: string;
  message: string;
  reference: string | null;
  status: string;
  adminReply: string | null;
  repliedAt: string | null;
  isRead: boolean;
  closedAt: string | null;
  closedBy: string | null;
  createdAt: string;
  user: { id: string; firstName: string; lastName: string; email: string };
  replies: SupportReply[];
}

const PRIORITY_COLORS: Record<string, string> = {
  LOW: "rgba(255,255,255,0.3)",
  NORMAL: "var(--color-accent)",
  HIGH: "var(--color-gold)",
  URGENT: "var(--color-danger)",
};

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Statuses" },
  { value: "OPEN", label: "Open" },
  { value: "SENT", label: "New" },
  { value: "IN_REVIEW", label: "In Review" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
];

const fmt = (d: string) => new Date(d).toLocaleString("en-US", {
  month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
});

export default function AdminMessagesClient({ messages: initial }: { messages: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initial);
  const [selected, setSelected] = useState<Message | null>(null);
  const [reply, setReply] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [ticketActionLoading, setTicketActionLoading] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const filtered = messages.filter(m => {
    const matchStatus = statusFilter === "ALL" || m.status === statusFilter;
    const matchSearch = !search ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.user.email.toLowerCase().includes(search.toLowerCase()) ||
      `${m.user.firstName} ${m.user.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      (m.ticketId || "").toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  async function markRead(msg: Message) {
    if (msg.isRead) return;
    const res = await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: msg.id, isRead: true }),
    });
    if (res.ok) {
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isRead: true } : m));
    }
  }

  function openMessage(msg: Message) {
    setSelected(msg);
    setReply("");
    markRead(msg);
  }

  async function sendReply() {
    if (!selected || !reply.trim()) return;
    setReplyLoading(true);
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected.id, adminReply: reply }),
      });
      const data = await res.json();
      if (res.ok) {
        const newReply: SupportReply = data.newReply;
        const updatedSelected: Message = {
          ...selected,
          status: "RESOLVED",
          adminReply: reply,
          repliedAt: newReply.createdAt,
          replies: [...selected.replies, newReply],
        };
        setMessages(prev => prev.map(m => m.id === selected.id ? updatedSelected : m));
        setSelected(updatedSelected);
        setReply("");
        showToast("Reply sent via email + in-app notification");
      } else {
        showToast("Failed to send reply");
      }
    } finally {
      setReplyLoading(false);
    }
  }

  const handleTicketAction = useCallback(async (action: "close" | "reopen") => {
    if (!selected) return;
    setTicketActionLoading(true);
    try {
      const res = await fetch(`/api/admin/messages/${selected.id}/close`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok && data.message) {
        const updated = data.message as Message;
        setMessages(prev => prev.map(m => m.id === updated.id ? updated : m));
        setSelected(updated);
        showToast(action === "close" ? "Ticket closed" : "Ticket reopened");
      } else {
        showToast("Action failed");
      }
    } finally {
      setTicketActionLoading(false);
    }
  }, [selected]);

  const unread = messages.filter(m => !m.isRead).length;
  const isClosed = selected?.status === "CLOSED";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, padding: "12px 18px", borderRadius: 10, background: "rgba(0,229,160,0.15)", border: "1px solid rgba(0,229,160,0.3)", color: "var(--color-success)", fontSize: 13, fontWeight: 600 }}>
          ✓ {toast}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-syne)", fontSize: 22, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 4 }}>Support Messages</h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: 13 }}>
            {messages.length} total · <span style={{ color: "var(--color-danger)" }}>{unread} unread</span>
          </p>
        </div>
      </div>

      <div className="admin-messages-grid">
        {/* Message list */}
        <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: 8 }}>
            <input
              className="input-nexus"
              placeholder="Search by subject, user, or TKT-..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ fontSize: 13 }}
            />
            <Select options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} />
          </div>

          <div style={{ maxHeight: 600, overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <div style={{ padding: 32, textAlign: "center", color: "var(--color-text-muted)", fontSize: 13 }}>No messages</div>
            ) : filtered.map(msg => {
              const isClosed = msg.status === "CLOSED";
              return (
                <div
                  key={msg.id}
                  onClick={() => openMessage(msg)}
                  style={{
                    padding: "13px 16px",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    cursor: "pointer",
                    background: selected?.id === msg.id
                      ? "rgba(0,212,255,0.06)"
                      : !msg.isRead ? "rgba(255,255,255,0.02)" : "transparent",
                    opacity: isClosed ? 0.65 : 1,
                    transition: "background 0.1s ease",
                  }}
                >
                  {/* Ticket ID + subject */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, overflow: "hidden" }}>
                    {!msg.isRead && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-accent)", flexShrink: 0 }} />}
                    {msg.ticketId && (
                      <span style={{
                        fontFamily: "var(--font-jetbrains-mono, monospace)", fontSize: 9, fontWeight: 700,
                        color: isClosed ? "#6B7280" : "#00C896",
                        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: 3, padding: "1px 5px", letterSpacing: "0.04em", flexShrink: 0,
                      }}>{msg.ticketId}</span>
                    )}
                    <span style={{ fontSize: 13, fontWeight: msg.isRead ? 500 : 700, color: "var(--color-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {isClosed ? "🔒 " : ""}{msg.subject}
                    </span>
                    <span style={{ fontSize: 9, color: PRIORITY_COLORS[msg.priority] || "var(--color-text-muted)", fontWeight: 700, flexShrink: 0, marginLeft: "auto" }}>
                      {msg.priority}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginBottom: 3 }}>
                    {msg.user.firstName} {msg.user.lastName} · {msg.user.email}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 4, lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
                    {msg.message}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "var(--color-text-muted)", background: "rgba(255,255,255,0.04)", padding: "1px 7px", borderRadius: 4 }}>
                      {msg.category}
                    </span>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      {msg.replies.length > 0 && (
                        <span style={{ fontSize: 10, color: "var(--color-success)", background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.2)", padding: "1px 6px", borderRadius: 4 }}>
                          {msg.replies.length} {msg.replies.length === 1 ? "reply" : "replies"}
                        </span>
                      )}
                      <StatusBadge value={msg.status} />
                      <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                        {new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Message detail + thread */}
        <div className="glass-card" style={{ padding: "24px 28px" }}>
          {!selected ? (
            <div style={{ textAlign: "center", color: "var(--color-text-muted)", padding: 60 }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>✉</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Select a message to view</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Header */}
              <div>
                <button onClick={() => setSelected(null)} className="btn-ghost msg-back-btn" style={{ marginBottom: 12, padding: "6px 14px", fontSize: 12 }}>
                  ← Back to messages
                </button>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, flexWrap: "wrap", gap: 10 }}>
                  <h2 style={{ fontFamily: "var(--font-syne)", fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)" }}>
                    {isClosed ? "🔒 " : ""}{selected.subject}
                  </h2>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <StatusBadge value={selected.status} />
                    {!isClosed ? (
                      <button
                        onClick={() => handleTicketAction("close")}
                        disabled={ticketActionLoading}
                        style={{
                          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                          color: "#EF4444", borderRadius: 8, padding: "7px 16px", fontSize: 12,
                          fontWeight: 600, cursor: "pointer", opacity: ticketActionLoading ? 0.6 : 1,
                        }}
                      >
                        {ticketActionLoading ? "…" : "✓ Close Ticket"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleTicketAction("reopen")}
                        disabled={ticketActionLoading}
                        style={{
                          background: "rgba(0,200,150,0.1)", border: "1px solid rgba(0,200,150,0.3)",
                          color: "#00C896", borderRadius: 8, padding: "7px 16px", fontSize: 12,
                          fontWeight: 600, cursor: "pointer", opacity: ticketActionLoading ? 0.6 : 1,
                        }}
                      >
                        {ticketActionLoading ? "…" : "↺ Reopen Ticket"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Ticket info row */}
                {selected.ticketId && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
                    padding: "10px 14px", borderRadius: 8,
                    background: "rgba(0,200,150,0.04)", border: "1px solid rgba(0,200,150,0.12)",
                    marginBottom: 10,
                  }}>
                    <div>
                      <div style={{ fontSize: 9, color: "#6B7280", letterSpacing: "0.08em", textTransform: "uppercase" }}>Ticket ID</div>
                      <div style={{ fontFamily: "var(--font-jetbrains-mono, monospace)", color: "#00C896", fontSize: 14, fontWeight: 700 }}>{selected.ticketId}</div>
                    </div>
                    <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.06)" }} />
                    <div style={{ fontSize: 12, color: "var(--color-text-muted)", display: "flex", gap: 16, flexWrap: "wrap" }}>
                      <span>From: <Link href={`/admin/users/${selected.user.id}`} style={{ color: "var(--color-accent)", textDecoration: "none" }}>{selected.user.firstName} {selected.user.lastName}</Link></span>
                      <span>{selected.user.email}</span>
                      <span>Cat: {selected.category}</span>
                      <span>Priority: <span style={{ color: PRIORITY_COLORS[selected.priority] }}>{selected.priority}</span></span>
                      <span>Opened: {new Date(selected.createdAt).toLocaleString()}</span>
                      {selected.reference && <span>Ref: <code style={{ color: "var(--color-accent)" }}>{selected.reference}</code></span>}
                    </div>
                  </div>
                )}
              </div>

              {/* Conversation thread */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "16px 18px", borderRadius: 12, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)", maxHeight: 440, overflowY: "auto" }}>

                {/* Original user message */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>
                    {selected.user.firstName} {selected.user.lastName} · {fmt(selected.createdAt)}
                  </div>
                  <div style={{
                    maxWidth: "85%", padding: "12px 16px",
                    borderRadius: "16px 16px 4px 16px",
                    background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)",
                    color: "#e0f4ff", fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap",
                  }}>{selected.message}</div>
                </div>

                {/* Reply thread */}
                {selected.replies.map(r => {
                  const isSystemMsg = r.body.startsWith("✓ This ticket has been");
                  if (isSystemMsg) {
                    return (
                      <div key={r.id} style={{ textAlign: "center", padding: "10px 16px", background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 12, color: "#6B7280" }}>
                        {r.body}
                        <div style={{ fontSize: 10, marginTop: 4, color: "rgba(255,255,255,0.2)" }}>{fmt(r.createdAt)}</div>
                      </div>
                    );
                  }
                  return (
                    <div key={r.id} style={{ display: "flex", flexDirection: "column", alignItems: r.fromAdmin ? "flex-start" : "flex-end" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: r.fromAdmin ? "var(--color-accent)" : "rgba(255,255,255,0.4)", marginBottom: 4 }}>
                        {r.fromAdmin ? "🏦 Bank of Asia Online" : `${selected.user.firstName} ${selected.user.lastName}`} · {fmt(r.createdAt)}
                      </div>
                      <div style={{
                        maxWidth: "85%", padding: "12px 16px",
                        borderRadius: r.fromAdmin ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
                        background: r.fromAdmin ? "rgba(14,76,110,0.35)" : "rgba(0,212,255,0.1)",
                        border: `1px solid ${r.fromAdmin ? "rgba(0,150,200,0.25)" : "rgba(0,212,255,0.2)"}`,
                        color: r.fromAdmin ? "#c8e8f0" : "#e0f4ff", fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap",
                      }}>{r.body}</div>
                    </div>
                  );
                })}

                {selected.replies.length === 0 && (
                  <div style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 12, padding: "8px 0" }}>No replies yet</div>
                )}
              </div>

              {/* Reply form or closed notice */}
              {isClosed ? (
                <div style={{ padding: "16px 20px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", textAlign: "center", color: "#6B7280", fontSize: 13 }}>
                  🔒 This ticket is closed. Use "↺ Reopen Ticket" to continue the conversation.
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
                    Send Reply
                  </div>
                  <textarea
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    placeholder="Type your reply… (will be sent via email + in-app notification)"
                    rows={4}
                    style={{
                      width: "100%", padding: "12px 14px", borderRadius: 10,
                      background: "rgba(6,12,24,0.7)", border: "1px solid rgba(255,255,255,0.08)",
                      color: "var(--color-text-primary)", fontSize: 14, fontFamily: "inherit",
                      outline: "none", resize: "vertical", marginBottom: 12, lineHeight: 1.6,
                    }}
                  />
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={sendReply}
                      disabled={replyLoading || !reply.trim()}
                      className="btn-nexus"
                      style={{ padding: "10px 24px" }}
                    >
                      {replyLoading ? "Sending…" : "✉ Send Reply"}
                    </button>
                    <button onClick={() => setSelected(null)} className="btn-ghost" style={{ padding: "10px 16px" }}>
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
