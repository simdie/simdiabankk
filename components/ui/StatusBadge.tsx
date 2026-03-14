"use client";

type BadgeVariant = "active" | "pending" | "danger" | "neutral" | "warning" | "info";

const MAP: Record<string, BadgeVariant> = {
  ACTIVE: "active", COMPLETED: "active",
  PENDING: "pending", PENDING_ACTIVATION: "pending", AWAITING_CONFIRMATION: "warning",
  RESTRICTED: "danger", DISABLED: "danger", FAILED: "danger", CANCELLED: "danger",
  FROZEN: "info", CLOSED: "neutral", EXPIRED: "neutral",
};

const STYLES: Record<BadgeVariant, { bg: string; color: string; border: string; dot: string }> = {
  active:  { bg: "rgba(0,229,160,0.08)",   color: "var(--color-success)",   border: "rgba(0,229,160,0.2)",   dot: "var(--color-success)" },
  pending: { bg: "rgba(240,180,41,0.08)",  color: "var(--color-gold)",      border: "rgba(240,180,41,0.2)",  dot: "var(--color-gold)" },
  warning: { bg: "rgba(240,180,41,0.08)",  color: "#ffa500",                border: "rgba(255,165,0,0.2)",   dot: "#ffa500" },
  danger:  { bg: "rgba(255,59,92,0.08)",   color: "var(--color-danger)",    border: "rgba(255,59,92,0.2)",   dot: "var(--color-danger)" },
  neutral: { bg: "rgba(255,255,255,0.04)", color: "var(--color-text-muted)",border: "rgba(255,255,255,0.08)",dot: "var(--color-text-muted)" },
  info:    { bg: "rgba(0,212,255,0.08)",   color: "var(--color-accent)",    border: "rgba(0,212,255,0.2)",   dot: "var(--color-accent)" },
};

export function StatusBadge({ value, label }: { value: string; label?: string }) {
  const variant: BadgeVariant = MAP[value] ?? "neutral";
  const s = STYLES[variant];
  const display = label ?? value.replace(/_/g, " ");

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 999,
      fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot, boxShadow: variant === "active" ? `0 0 4px ${s.dot}` : "none", flexShrink: 0 }} />
      {display}
    </span>
  );
}
