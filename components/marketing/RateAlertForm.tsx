"use client";

import { useState } from "react";

type State = "idle" | "loading" | "success" | "error";

export default function RateAlertForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    try {
      const res = await fetch("/api/rate-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setState("success");
        setMsg(data.message ?? "You're on the list.");
        setEmail("");
      } else {
        setState("error");
        setMsg(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setState("error");
      setMsg("Network error. Please try again.");
    }
  }

  if (state === "success") {
    return (
      <div
        className="flex items-center gap-3 rounded-xl px-5 py-4 border"
        style={{
          backgroundColor: "rgba(0,168,150,0.06)",
          borderColor: "rgba(0,168,150,0.2)",
        }}
      >
        <span
          className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 text-sm font-bold"
          style={{ backgroundColor: "var(--boa-teal)" }}
        >
          ✓
        </span>
        <p
          className="text-[14px]"
          style={{
            color: "var(--boa-navy)",
            fontFamily: "var(--font-dm-sans, var(--font-inter))",
          }}
        >
          {msg}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          placeholder="your@email.com"
          className="flex-1 px-4 py-3 rounded-lg border text-[14px] outline-none transition-colors"
          style={{
            borderColor: state === "error" ? "#fca5a5" : "var(--boa-border)",
            color: "var(--boa-navy)",
            fontFamily: "var(--font-dm-sans, var(--font-inter))",
            backgroundColor: "#ffffff",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--boa-purple)")}
          onBlur={(e) =>
            (e.currentTarget.style.borderColor =
              state === "error" ? "#fca5a5" : "var(--boa-border)")
          }
          disabled={state === "loading"}
          aria-label="Email address for rate alerts"
        />
        <button
          type="submit"
          disabled={state === "loading" || !email}
          className="px-6 py-3 rounded-lg text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 whitespace-nowrap"
          style={{
            backgroundColor: "var(--boa-purple)",
            fontFamily: "var(--font-dm-sans, var(--font-inter))",
          }}
        >
          {state === "loading" ? "Subscribing…" : "Notify me when rates change"}
        </button>
      </div>

      {state === "error" && (
        <p
          className="mt-2 text-[12px]"
          style={{
            color: "#ef4444",
            fontFamily: "var(--font-dm-sans, var(--font-inter))",
          }}
        >
          {msg}
        </p>
      )}

      <p
        className="mt-3 text-[11px]"
        style={{
          color: "var(--boa-muted)",
          fontFamily: "var(--font-dm-sans, var(--font-inter))",
        }}
      >
        We'll email you when our interest rates change. No spam, unsubscribe at any time.
      </p>
    </form>
  );
}
