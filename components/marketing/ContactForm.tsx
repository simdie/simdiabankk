"use client";

import { useState } from "react";

const SUBJECTS = [
  "Account opening enquiry",
  "Transfer & payment help",
  "Card support",
  "Security concern",
  "Business banking",
  "Rates & fees",
  "Technical issue",
  "Other",
];

type State = "idle" | "loading" | "success" | "error";

const inputBase: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid var(--boa-border)",
  fontSize: 14,
  color: "var(--boa-navy)",
  fontFamily: "var(--font-dm-sans, var(--font-inter))",
  backgroundColor: "#fff",
  outline: "none",
  transition: "border-color 0.15s",
};

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [state, setState] = useState<State>("idle");
  const [errMsg, setErrMsg] = useState("");

  function set(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [k]: e.target.value }));
      if (state === "error") setState("idle");
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setState("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setState("error");
        setErrMsg(data.error ?? "Something went wrong.");
      }
    } catch {
      setState("error");
      setErrMsg("Network error. Please try again.");
    }
  }

  if (state === "success") {
    return (
      <div
        className="rounded-2xl p-10 flex flex-col items-center text-center gap-4"
        style={{ backgroundColor: "rgba(0,168,150,0.06)", border: "1px solid rgba(0,168,150,0.2)" }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold"
          style={{ backgroundColor: "var(--boa-teal)" }}
        >
          ✓
        </div>
        <h3
          className="font-bold"
          style={{ fontSize: 20, color: "var(--boa-navy)", fontFamily: "var(--font-syne, var(--font-inter))" }}
        >
          Message received
        </h3>
        <p
          style={{ fontSize: 14, color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))", maxWidth: 340 }}
        >
          Thank you for getting in touch. Our team will respond to your enquiry within 1–2 business days.
        </p>
      </div>
    );
  }

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label
      className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5"
      style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
    >
      {children}
    </label>
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label>Full name *</Label>
          <input
            type="text"
            required
            value={form.name}
            onChange={set("name")}
            placeholder="Jane Smith"
            style={inputBase}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--boa-purple)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--boa-border)")}
          />
        </div>
        <div>
          <Label>Email address *</Label>
          <input
            type="email"
            required
            value={form.email}
            onChange={set("email")}
            placeholder="jane@example.com"
            style={inputBase}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--boa-purple)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--boa-border)")}
          />
        </div>
      </div>

      <div>
        <Label>Subject *</Label>
        <select
          required
          value={form.subject}
          onChange={set("subject")}
          style={{
            ...inputBase,
            appearance: "none",
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 14px center",
            paddingRight: 36,
            color: form.subject ? "var(--boa-navy)" : "var(--boa-muted)",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--boa-purple)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--boa-border)")}
        >
          <option value="" disabled>Select a topic…</option>
          {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <Label>Message *</Label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={set("message")}
          placeholder="Describe your enquiry in detail…"
          style={{ ...inputBase, resize: "vertical", minHeight: 120 }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--boa-purple)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--boa-border)")}
        />
      </div>

      {state === "error" && (
        <p
          className="text-[13px] rounded-lg px-4 py-3 border"
          style={{
            color: "#dc2626",
            backgroundColor: "rgba(220,38,38,0.05)",
            borderColor: "rgba(220,38,38,0.2)",
            fontFamily: "var(--font-dm-sans, var(--font-inter))",
          }}
        >
          {errMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="w-full py-3.5 rounded-lg text-[15px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{
          backgroundColor: "var(--boa-purple)",
          fontFamily: "var(--font-dm-sans, var(--font-inter))",
        }}
      >
        {state === "loading" ? "Sending…" : "Send message"}
      </button>

      <p
        className="text-[12px]"
        style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
      >
        We aim to respond within 1–2 business days. For urgent security matters, email{" "}
        <a href="mailto:security@boasiaonline.com" className="underline underline-offset-2" style={{ color: "var(--boa-purple)" }}>
          security@boasiaonline.com
        </a>
        .
      </p>
    </form>
  );
}
