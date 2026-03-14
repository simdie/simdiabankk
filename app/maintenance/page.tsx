export default function MaintenancePage() {
  return (
    <div style={{ minHeight: "100vh", background: "#03050a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)", padding: "40px 24px" }}>
      <div style={{ textAlign: "center", maxWidth: 520 }}>
        {/* Animated pulse */}
        <div style={{ position: "relative", width: 100, height: 100, margin: "0 auto 32px" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(240,180,41,0.05)", border: "1px solid rgba(240,180,41,0.15)", animation: "pulse-slow 2s ease-in-out infinite" }} />
          <div style={{ position: "absolute", inset: 12, borderRadius: "50%", background: "rgba(240,180,41,0.08)", border: "1px solid rgba(240,180,41,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>⚙</div>
        </div>

        <div style={{ fontSize: 11, color: "#F0B429", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}>SCHEDULED MAINTENANCE</div>
        <h1 style={{ fontFamily: "var(--font-syne, Syne, sans-serif)", fontSize: 32, fontWeight: 800, color: "#f0f4ff", margin: "0 0 16px", lineHeight: 1.1 }}>We&apos;re upgrading<br/>your bank</h1>
        <p style={{ color: "#8899b5", fontSize: 16, lineHeight: 1.7, margin: "0 0 32px" }}>
          Bank of Asia Online is currently undergoing scheduled maintenance to bring you a better banking experience.
          We&apos;ll be back online shortly.
        </p>

        <div style={{ background: "rgba(6,12,24,0.7)", border: "1px solid rgba(240,180,41,0.1)", borderRadius: 14, padding: "20px 24px", marginBottom: 32 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#4d6080", letterSpacing: "0.08em", marginBottom: 12, textTransform: "uppercase" }}>System Status</div>
          {[
            ["Banking Services", "Maintenance", "#F0B429"],
            ["Database", "Operational", "#00e5a0"],
            ["Security Systems", "Operational", "#00e5a0"],
          ].map(([s, st, c]) => (
            <div key={s as string} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ fontSize: 13, color: "#8899b5" }}>{s}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: c as string, display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: c as string, display: "inline-block" }} />
                {st}
              </span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 13, color: "#4d6080" }}>
          Questions? Contact us at{" "}
          <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@bankofasia.com"}`} style={{ color: "#00d4ff" }}>
            {process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@bankofasia.com"}
          </a>
        </p>
      </div>
    </div>
  );
}
