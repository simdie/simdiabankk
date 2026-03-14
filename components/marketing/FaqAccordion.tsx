"use client";

import { useState } from "react";

export type FaqItem = { q: string; a: string };

export default function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y" style={{ borderColor: "var(--boa-border)" }}>
      {faqs.map((item, i) => (
        <div key={i}>
          <button
            className="w-full text-left flex items-center justify-between py-5 gap-4"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span
              className="font-medium text-[15px]"
              style={{
                color: open === i ? "var(--boa-purple)" : "var(--boa-navy)",
                fontFamily: "var(--font-dm-sans, var(--font-inter))",
              }}
            >
              {item.q}
            </span>
            <span
              className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200"
              style={{
                backgroundColor: open === i ? "var(--boa-purple)" : "rgba(74,31,168,0.08)",
                color: open === i ? "#fff" : "var(--boa-purple)",
                transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
              }}
              aria-hidden
            >
              +
            </span>
          </button>

          {open === i && (
            <div className="pb-5">
              <p
                className="leading-relaxed"
                style={{
                  fontSize: 15,
                  color: "var(--boa-muted)",
                  fontFamily: "var(--font-dm-sans, var(--font-inter))",
                  maxWidth: 720,
                }}
              >
                {item.a}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
