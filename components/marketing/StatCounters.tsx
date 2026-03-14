"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { end: 12000, suffix: "+", label: "Active customers", prefix: "" },
  { end: 180,   suffix: "+", label: "Countries reached", prefix: "" },
  { end: 10,    suffix: "",  label: "Currencies supported", prefix: "" },
  { end: 99.9,  suffix: "%", label: "Platform uptime", prefix: "", decimals: 1 },
];

function useCountUp(end: number, duration: number, active: boolean, decimals = 0) {
  const [value, setValue] = useState(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * end).toFixed(decimals)));
      if (progress < 1) frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
    return () => { if (frame.current) cancelAnimationFrame(frame.current); };
  }, [active, end, duration, decimals]);

  return value;
}

function Counter({ end, suffix, prefix, label, decimals = 0, active }: {
  end: number; suffix: string; prefix: string; label: string; decimals?: number; active: boolean;
}) {
  const value = useCountUp(end, 1800, active, decimals);
  const display = decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toLocaleString();

  return (
    <div className="text-center">
      <p
        className="leading-none mb-2 font-bold"
        style={{
          fontSize: "clamp(36px, 5vw, 56px)",
          color: "var(--boa-teal)",
          fontFamily: "var(--font-syne, var(--font-inter))",
          letterSpacing: "-0.02em",
        }}
      >
        {prefix}{display}{suffix}
      </p>
      <p
        className="text-sm"
        style={{
          color: "rgba(255,255,255,0.55)",
          fontFamily: "var(--font-dm-sans, var(--font-inter))",
        }}
      >
        {label}
      </p>
    </div>
  );
}

export default function StatCounters() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-10">
      {STATS.map((s) => (
        <Counter key={s.label} {...s} active={active} />
      ))}
    </div>
  );
}
