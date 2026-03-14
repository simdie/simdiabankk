import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", background: "#03050a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)", padding: "40px 24px" }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{ fontFamily: "var(--font-syne, Syne, sans-serif)", fontSize: 120, fontWeight: 800, background: "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(240,180,41,0.1))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1, marginBottom: 8 }}>404</div>
        <div style={{ fontSize: 11, color: "#00d4ff", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>PAGE NOT FOUND</div>
        <h1 style={{ fontFamily: "var(--font-syne, Syne, sans-serif)", fontSize: 24, fontWeight: 700, color: "#f0f4ff", margin: "0 0 12px" }}>This page doesn&apos;t exist</h1>
        <p style={{ color: "#8899b5", fontSize: 15, lineHeight: 1.7, margin: "0 0 36px" }}>The page you&apos;re looking for may have been moved, deleted, or never existed.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/dashboard" style={{ padding: "12px 28px", borderRadius: 12, background: "linear-gradient(135deg,#00d4ff,#0099b8)", color: "#03050a", fontWeight: 800, fontSize: 14, textDecoration: "none" }}>
            Return to Dashboard
          </Link>
          <Link href="/" style={{ padding: "12px 28px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", color: "#8899b5", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
            Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}
