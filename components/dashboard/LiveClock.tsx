"use client";

import { useState, useEffect } from "react";

interface LiveClockProps {
  compact?: boolean;
}

export function LiveClock({ compact = false }: LiveClockProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!now) return null;

  const dateStr = now.toLocaleDateString("en-SG", {
    weekday: "long", day: "numeric",
    month: "long", year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-SG", {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: true,
  });

  if (compact) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{
          fontSize: 12,
          fontFamily: "var(--font-jetbrains-mono, 'JetBrains Mono', monospace)",
          color: "#FBBF24",
          fontWeight: 600,
          letterSpacing: "0.02em",
        }}>
          {timeStr}
        </span>
        <span style={{ fontSize: 11, color: "#6B7280" }}>{now.toLocaleDateString("en-SG", { month: "short", day: "numeric" })}</span>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "right" }}>
      <div style={{
        fontSize: 14, fontWeight: 600,
        fontFamily: "var(--font-jetbrains-mono, 'JetBrains Mono', monospace)",
        color: "#FBBF24", letterSpacing: "0.02em",
      }}>
        {timeStr}
      </div>
      <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
        {dateStr}
      </div>
    </div>
  );
}
