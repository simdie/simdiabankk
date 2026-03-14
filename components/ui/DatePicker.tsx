"use client";

import { useState, useRef, useEffect } from "react";

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function formatDisplay(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  disabled,
  style,
  className,
}: DatePickerProps) {
  const now = new Date();
  const [open, setOpen] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const initYear = value ? parseInt(value.split("-")[0]) : now.getFullYear();
  const initMonth = value ? parseInt(value.split("-")[1]) - 1 : now.getMonth();
  const [viewYear, setViewYear] = useState(initYear);
  const [viewMonth, setViewMonth] = useState(initMonth);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync view when value changes externally
  useEffect(() => {
    if (value) {
      const [y, m] = value.split("-").map(Number);
      if (y && m) { setViewYear(y); setViewMonth(m - 1); }
    }
  }, [value]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setShowYearPicker(false);
      }
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function kh(e: KeyboardEvent) {
      if (e.key === "Escape") { setOpen(false); setShowYearPicker(false); }
    }
    if (open) document.addEventListener("keydown", kh);
    return () => document.removeEventListener("keydown", kh);
  }, [open]);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  // Build calendar cells
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  // Pad to complete grid rows
  while (cells.length % 7 !== 0) cells.push(null);

  const selYear = value ? parseInt(value.split("-")[0]) : null;
  const selMonth = value ? parseInt(value.split("-")[1]) - 1 : null;
  const selDay = value ? parseInt(value.split("-")[2]) : null;
  const isSelected = (d: number) =>
    d === selDay && viewMonth === selMonth && viewYear === selYear;

  function selectDay(d: number) {
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    onChange(`${viewYear}-${mm}-${dd}`);
    setOpen(false);
  }

  // Year list: from current+5 down to 1920
  const currentYear = now.getFullYear();
  const years: number[] = [];
  for (let y = currentYear + 5; y >= 1920; y--) years.push(y);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", ...style }} className={className}>
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => { if (!disabled) { setOpen(v => !v); setShowYearPicker(false); } }}
        style={{
          width: "100%",
          padding: "10px 38px 10px 13px",
          borderRadius: 10,
          background: "rgba(9,17,32,0.8)",
          border: open ? "1px solid rgba(0,212,255,0.55)" : "1px solid rgba(255,255,255,0.10)",
          boxShadow: open ? "0 0 0 3px rgba(0,212,255,0.09)" : "none",
          color: value ? "var(--color-text-primary, #f0f4ff)" : "rgba(255,255,255,0.32)",
          fontSize: 13,
          fontFamily: "inherit",
          fontWeight: 500,
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          gap: 8,
          transition: "border-color 0.15s, box-shadow 0.15s",
          outline: "none",
        }}
      >
        <span style={{ fontSize: 13, color: value ? "rgba(0,212,255,0.7)" : "rgba(255,255,255,0.25)", flexShrink: 0 }}>
          📅
        </span>
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        <span style={{
          position: "absolute", right: 12, top: "50%",
          transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`,
          transition: "transform 0.18s ease",
          color: "rgba(0,212,255,0.6)", pointerEvents: "none",
          display: "flex", alignItems: "center",
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {/* Calendar popup */}
      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          left: 0,
          background: "rgba(7,14,28,0.99)",
          border: "1px solid rgba(0,212,255,0.18)",
          borderRadius: 14,
          boxShadow: "0 14px 44px rgba(0,0,0,0.65)",
          zIndex: 9999,
          padding: "14px 12px 10px",
          width: 270,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          animation: "dropdownFadeIn 0.12s ease",
        }}>
          {/* Month/year nav bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <button type="button" onClick={prevMonth}
              style={{ background: "rgba(255,255,255,0.05)", border: "none", cursor: "pointer", color: "#f0f4ff", borderRadius: 6, width: 28, height: 28, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>
              ‹
            </button>
            <button type="button"
              onClick={() => setShowYearPicker(v => !v)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#f0f4ff", fontWeight: 700, fontSize: 13, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4, padding: "2px 6px", borderRadius: 6 }}>
              {MONTHS[viewMonth]} {viewYear}
              <span style={{ fontSize: 9, color: "rgba(0,212,255,0.7)", transition: "transform 0.15s", display: "inline-block", transform: showYearPicker ? "rotate(180deg)" : "none" }}>▼</span>
            </button>
            <button type="button" onClick={nextMonth}
              style={{ background: "rgba(255,255,255,0.05)", border: "none", cursor: "pointer", color: "#f0f4ff", borderRadius: 6, width: 28, height: 28, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>
              ›
            </button>
          </div>

          {/* Year picker dropdown */}
          {showYearPicker && (
            <div style={{
              position: "absolute", top: 50, left: 12, right: 12,
              background: "rgba(4,10,22,0.99)", border: "1px solid rgba(0,212,255,0.15)",
              borderRadius: 10, maxHeight: 200, overflowY: "auto", zIndex: 10,
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            }}>
              {years.map(y => (
                <button key={y} type="button"
                  onClick={() => { setViewYear(y); setShowYearPicker(false); }}
                  style={{
                    display: "block", width: "100%", padding: "7px 14px",
                    background: y === viewYear ? "rgba(0,212,255,0.1)" : "none",
                    border: "none", cursor: "pointer",
                    color: y === viewYear ? "#00D4FF" : "#e8eeff",
                    fontSize: 13, fontFamily: "inherit", textAlign: "left",
                    fontWeight: y === viewYear ? 700 : 400,
                  }}
                  onMouseEnter={e => { if (y !== viewYear) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; }}
                  onMouseLeave={e => { if (y !== viewYear) (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
                >
                  {y} {y === viewYear && "✓"}
                </button>
              ))}
            </div>
          )}

          {/* Day-of-week labels */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1, marginBottom: 4 }}>
            {DAY_LABELS.map(dl => (
              <div key={dl} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.28)", padding: "3px 0" }}>{dl}</div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}>
            {cells.map((d, i) => {
              const sel = d !== null && isSelected(d);
              return (
                <button key={i} type="button"
                  disabled={d === null}
                  onClick={() => d !== null && selectDay(d)}
                  style={{
                    padding: "6px 0",
                    border: "none",
                    borderRadius: 6,
                    cursor: d !== null ? "pointer" : "default",
                    background: sel ? "#00D4FF" : "transparent",
                    color: sel ? "#03050a" : d !== null ? "#e8eeff" : "transparent",
                    fontSize: 12,
                    fontWeight: sel ? 700 : 400,
                    textAlign: "center",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={e => { if (d !== null && !sel) (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,212,255,0.12)"; }}
                  onMouseLeave={e => { if (d !== null && !sel) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                >
                  {d ?? ""}
                </button>
              );
            })}
          </div>

          {/* Footer: clear + today */}
          <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button type="button"
              onClick={() => { const t = new Date(); selectDay(t.getDate()); setViewYear(t.getFullYear()); setViewMonth(t.getMonth()); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(0,212,255,0.6)", fontSize: 11, fontFamily: "inherit" }}>
              Today
            </button>
            {value && (
              <button type="button"
                onClick={() => { onChange(""); setOpen(false); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,59,92,0.55)", fontSize: 11, fontFamily: "inherit" }}>
                ✕ Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
