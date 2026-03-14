"use client";

import { useState, useRef, useEffect } from "react";

export interface SelectOption {
  value: string;
  label: string;
  flag?: string;
  sub?: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  searchable?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  style,
  searchable = false,
  size = "md",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const padY = size === "sm" ? "7px" : size === "lg" ? "13px" : "10px";
  const fs = size === "sm" ? 12 : size === "lg" ? 15 : 13;

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") { setOpen(false); setSearch(""); }
    }
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  // Auto-focus search when opened
  useEffect(() => {
    if (open && searchable && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 30);
    }
  }, [open, searchable]);

  const selected = options.find(o => o.value === value);
  const filtered = search
    ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", ...style }}>
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => { if (!disabled) { setOpen(v => !v); setSearch(""); } }}
        style={{
          width: "100%",
          padding: `${padY} 38px ${padY} 13px`,
          borderRadius: 10,
          background: "rgba(9,17,32,0.8)",
          border: open
            ? "1px solid rgba(0,212,255,0.55)"
            : "1px solid rgba(255,255,255,0.10)",
          boxShadow: open ? "0 0 0 3px rgba(0,212,255,0.09)" : "none",
          color: selected ? "var(--color-text-primary, #f0f4ff)" : "rgba(255,255,255,0.32)",
          fontSize: fs,
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
        {selected?.flag && <span style={{ fontSize: 17, flexShrink: 0 }}>{selected.flag}</span>}
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {selected ? selected.label : placeholder}
        </span>
        {/* Chevron */}
        <span style={{
          position: "absolute", right: 12, top: "50%", transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`,
          transition: "transform 0.18s ease",
          color: disabled ? "rgba(255,255,255,0.2)" : "rgba(0,212,255,0.6)",
          display: "flex", alignItems: "center", flexShrink: 0,
          pointerEvents: "none",
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 5px)",
          left: 0, right: 0,
          background: "rgba(7,14,28,0.98)",
          border: "1px solid rgba(0,212,255,0.18)",
          borderRadius: 12,
          boxShadow: "0 12px 40px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)",
          zIndex: 9999,
          maxHeight: 260,
          overflowY: "auto",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          animation: "dropdownFadeIn 0.12s ease",
        }}>
          {searchable && (
            <div style={{ padding: "8px 10px", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, background: "rgba(7,14,28,0.98)" }}>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", fontSize: 12, pointerEvents: "none" }}>
                  🔍
                </span>
                <input
                  ref={searchRef}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search…"
                  style={{
                    width: "100%",
                    paddingLeft: 30, paddingRight: 10, paddingTop: 7, paddingBottom: 7,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 7,
                    color: "#f0f4ff",
                    fontSize: 12,
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                  }}
                />
              </div>
            </div>
          )}

          {filtered.length === 0 ? (
            <div style={{ padding: "14px 16px", color: "rgba(255,255,255,0.3)", fontSize: 12, textAlign: "center" }}>
              No results found
            </div>
          ) : (
            filtered.map((opt, i) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false); setSearch(""); }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "9px 14px",
                    background: isSelected ? "rgba(0,212,255,0.09)" : "transparent",
                    border: "none",
                    borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
                    cursor: "pointer",
                    color: isSelected ? "var(--color-accent, #00D4FF)" : "#e8eeff",
                    fontSize: fs,
                    fontFamily: "inherit",
                    textAlign: "left",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; }}
                  onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                >
                  {opt.flag && <span style={{ fontSize: 17, flexShrink: 0 }}>{opt.flag}</span>}
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {opt.label}
                  </span>
                  {opt.sub && (
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", flexShrink: 0 }}>{opt.sub}</span>
                  )}
                  {isSelected && (
                    <span style={{ color: "var(--color-accent, #00D4FF)", fontSize: 11, flexShrink: 0 }}>✓</span>
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
