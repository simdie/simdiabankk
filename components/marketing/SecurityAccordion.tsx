"use client";

import { useState } from "react";

type Item = { q: string; a: string };

export default function SecurityAccordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y" style={{ borderTop: "1px solid var(--boa-border)", borderBottom: "1px solid var(--boa-border)" }}>
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 py-5 text-left"
          >
            <span
              className="font-semibold text-[15px]"
              style={{
                color: open === i ? "var(--boa-teal)" : "var(--boa-navy)",
                fontFamily: "var(--font-dm-sans, var(--font-inter))",
                transition: "color 0.15s",
              }}
            >
              {item.q}
            </span>
            <span
              className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[18px] font-light leading-none"
              style={{
                backgroundColor: open === i ? "rgba(0,168,150,0.1)" : "var(--boa-light)",
                color: open === i ? "var(--boa-teal)" : "var(--boa-muted)",
                transform: open === i ? "rotate(45deg)" : "none",
                transition: "transform 0.2s ease, background-color 0.15s, color 0.15s",
              }}
            >
              +
            </span>
          </button>
          {open === i && (
            <p
              className="pb-5 text-[14px] leading-relaxed"
              style={{
                color: "var(--boa-muted)",
                fontFamily: "var(--font-dm-sans, var(--font-inter))",
              }}
            >
              {item.a}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
