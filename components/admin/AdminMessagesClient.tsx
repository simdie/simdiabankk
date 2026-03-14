"use client";

import { useState } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import Select from "@/components/ui/Select";

interface Message {
  id: string;
  subject: string;
  category: string;
  priority: string;
  message: string;
  reference: string | null;
  status: string;
  adminReply: string | null;
  repliedAt: string | null;
  isRead: boolean;
  createdAt: string;
  user: { id: string; firstName: string; lastName: string; email: string };
}

const PRIORITY_COLORS: Record<string, string> = {
  LOW: "rgba(255,255,255,0.3)",
  NORMAL: "var(--color-accent)",
  HIGH: "var(--color-gold)",
  URGENT: "var(--color-danger)",
};

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Statuses" },
  { value: "SENT", label: "New" },
  { value: "IN_REVIEW", label: "In Review" },
  { value: "RESOLVED", label: "Resolved" },
];

export default function AdminMessagesClient({ messages: initial }: { messages: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initial);
  const [selected, setSelected] = useState<Message | null>(null);
  const [reply, setReply] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const filtered = messages.filter((m) => {
    const matchStatus = statusFilter === "ALL" || m.status === statusFilter;
    const matchSearch = !search ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.user.email.toLowerCase().includes(search.toLowerCase()) ||
      `${m.user.firstName} ${m.user.lastName}`.toLowerCase().includes(search.toLowerCase());
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
      setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, isRead: true } : m));
    }
  }

  function openMessage(msg: Message) {
    setSelected(msg);
    setReply(msg.adminReply || "");
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
        const updated = data.message as Message;
        setMessages((prev) => prev.map((m) => m.id === updated.id ? updated : m));
        setSelected(updated);
        showToast("Reply sent via email + in-app notification");
      } else {
        showToast("Failed to send reply");
      }
    } finally {
      setReplyLoading(false);
    }
  }

  const unread = messages.filter((m) => !m.isRead).length;

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
          {/* Filters */}
          <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: 8 }}>
            <input
              className="input-nexus"
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ fontSize: 13 }}
            />
            <Select options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} />
          </div>

          <div style={{ maxHeight: 600, overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <div style={{ padding: 32, textAlign: "center", color: "var(--color-text-muted)", fontSize: 13 }}>No messages</div>
            ) : filtered.map((msg) => (
              <div
                key={msg.id}
                onClick={() => openMessage(msg)}
                style={{
                  padding: "14px 16px",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  cursor: "pointer",
                  background: selected?.id === msg.id
                    ? "rgba(0,212,255,0.06)"
                    : !msg.isRead
                    ? "rgba(255,255,255,0.02)"
                    : "transparent",
                  transition: "background 0.1s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, overflow: "hidden" }}>
                    {!msg.isRead && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-accent)", flexShrink: 0 }} />}
                    <span style={{ fontSize: 13, fontWeight: msg.isRead ? 500 : 700, color: "var(--color-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {msg.subject}
                    </span>
                  </div>
                  <span style={{ fontSize: 9, color: PRIORITY_COLORS[msg.priority] || "var(--color-text-muted)", fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>
                    {msg.priority}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginBottom: 4 }}>
                  {msg.user.firstName} {msg.user.lastName} · {msg.user.email}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "var(--color-text-muted)", background: "rgba(255,255,255,0.04)", padding: "1px 7px", borderRadius: 4 }}>
                    {msg.category}
                  </span>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <StatusBadge value={msg.status} />
                    <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                      {new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message detail + reply */}
        <div className="glass-card" style={{ padding: "24px 28px" }}>
          {!selected ? (
            <div style={{ textAlign: "center", color: "var(--color-text-muted)", padding: 60 }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>✉</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Select a message to view</div>
            </div>
          ) : (<>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Header */}
              <div>
                <button onClick={() => setSelected(null)} className="btn-ghost msg-back-btn" style={{ marginBottom: 12, padding: "6px 14px", fontSize: 12 }}>
                  ← Back to messages
                </button>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <h2 style={{ fontFamily: "var(--font-syne)", fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)" }}>{selected.subject}</h2>
                  <StatusBadge value={selected.status} />
                </div>
                <div style={{ display: "flex", gap: 20, fontSize: 12, color: "var(--color-text-muted)", flexWrap: "wrap" }}>
                  <span>From: <Link href={`/admin/users/${selected.user.id}`} style={{ color: "var(--color-accent)", textDecoration: "none" }}>{selected.user.firstName} {selected.user.lastName}</Link></span>
                  <span>Email: {selected.user.email}</span>
                  <span>Category: {selected.category}</span>
                  <span>Priority: <span style={{ color: PRIORITY_COLORS[selected.priority] }}>{selected.priority}</span></span>
                  <span>Date: {new Date(selected.createdAt).toLocaleString()}</span>
                  {selected.reference && <span>Reference: <code style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--color-accent)" }}>{selected.reference}</code></span>}
                </div>
              </div>

              {/* Message */}
              <div style={{ padding: "16px 18px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Message</div>
                <p style={{ fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{selected.message}</p>
              </div>

              {/* Previous reply if any */}
              {selected.adminReply && (
                <div style={{ padding: "16px 18px", borderRadius: 10, background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.12)" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-accent)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
                    Admin Reply · {selected.repliedAt ? new Date(selected.repliedAt).toLocaleString() : ""}
                  </div>
                  <p style={{ fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{selected.adminReply}</p>
                </div>
              )}

              {/* Reply form */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
                  {selected.adminReply ? "Update Reply" : "Send Reply"}
                </div>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply... (will be sent via email + in-app notification)"
                  rows={5}
                  style={{
                    width: "100%", padding: "12px 14px", borderRadius: 10,
                    background: "rgba(6,12,24,0.7)", border: "1px solid rgba(255,255,255,0.08)",
                    color: "var(--color-text-primary)", fontSize: 14, fontFamily: "inherit",
                    outline: "none", resize: "vertical", marginBottom: 12,
                    lineHeight: 1.6,
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
            </div>
          </>)}
        </div>
      </div>
    </div>
  );
}
