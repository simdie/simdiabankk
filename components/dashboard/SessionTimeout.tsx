"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { signOut } from "next-auth/react";

const TIMEOUT_DURATION = 5 * 60 * 1000; // 5 minutes
const WARNING_BEFORE = 60 * 1000; // 1 minute warning

export function SessionTimeout() {
  const [showWarning, setShowWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = useCallback(() => {
    setShowWarning(false);
    setSecondsLeft(60);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    warningRef.current = setTimeout(() => {
      setShowWarning(true);
      setSecondsLeft(60);
      countdownRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            if (countdownRef.current) clearInterval(countdownRef.current);
            signOut({ callbackUrl: "https://www.boasiaonline.com/login" });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, TIMEOUT_DURATION - WARNING_BEFORE);

    timeoutRef.current = setTimeout(() => {
      signOut({ callbackUrl: "https://www.boasiaonline.com/login" });
    }, TIMEOUT_DURATION);
  }, []);

  useEffect(() => {
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"];
    events.forEach((e) => document.addEventListener(e, resetTimer));
    resetTimer();
    return () => {
      events.forEach((e) => document.removeEventListener(e, resetTimer));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [resetTimer]);

  if (!showWarning) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.75)",
      backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: "#0F2040",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 20, padding: 40,
        maxWidth: 400, width: "90%",
        textAlign: "center",
        boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "rgba(239,68,68,0.15)",
          border: "2px solid rgba(239,68,68,0.3)",
          display: "flex", alignItems: "center",
          justifyContent: "center", margin: "0 auto 20px",
        }}>
          <span style={{ fontSize: 28 }}>⏱</span>
        </div>

        <h3 style={{ color: "white", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
          Session Expiring Soon
        </h3>
        <p style={{ color: "#9CA3AF", fontSize: 14, lineHeight: 1.6, marginBottom: 8 }}>
          Your session will expire due to inactivity.
        </p>
        <div style={{
          fontSize: 48, fontWeight: 700,
          fontFamily: "var(--font-jetbrains-mono, 'JetBrains Mono', monospace)",
          color: secondsLeft <= 10 ? "#EF4444" : "#00C896",
          margin: "16px 0",
        }}>
          {secondsLeft}s
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button
            onClick={() => signOut({ callbackUrl: "https://www.boasiaonline.com/login" })}
            style={{
              flex: 1, padding: 12,
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#EF4444", borderRadius: 10,
              cursor: "pointer", fontSize: 14, fontWeight: 600,
            }}
          >
            Log Out
          </button>
          <button
            onClick={resetTimer}
            style={{
              flex: 2, padding: 12,
              background: "#00C896",
              border: "none", color: "white",
              borderRadius: 10, cursor: "pointer",
              fontSize: 14, fontWeight: 600,
            }}
          >
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
}
