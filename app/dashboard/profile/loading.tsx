export default function Loading() {
  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      <div style={{ height: 32, width: 200, borderRadius: 8, background: "rgba(255,255,255,0.04)", marginBottom: 28, animation: "shimmer 1.5s linear infinite" }} />
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{ padding: "24px 28px", borderRadius: 16, background: "rgba(13,26,48,0.4)", border: "1px solid rgba(255,255,255,0.04)", marginBottom: 20 }}>
          <div style={{ height: 20, width: 160, borderRadius: 6, background: "rgba(255,255,255,0.04)", marginBottom: 20, animation: "shimmer 1.5s linear infinite" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[1, 2, 3, 4, 5, 6].map(j => (
              <div key={j} style={{ height: 40, borderRadius: 10, background: "rgba(255,255,255,0.03)", animation: "shimmer 1.5s linear infinite" }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
