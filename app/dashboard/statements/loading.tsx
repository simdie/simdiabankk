export default function Loading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ height: 32, width: 220, borderRadius: 8, background: "rgba(255,255,255,0.04)", animation: "shimmer 1.5s linear infinite" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {[1, 2, 3, 4].map(i => <div key={i} style={{ height: 44, borderRadius: 10, background: "rgba(255,255,255,0.03)", animation: "shimmer 1.5s linear infinite" }} />)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {[1, 2, 3].map(i => <div key={i} style={{ height: 80, borderRadius: 12, background: "rgba(255,255,255,0.03)", animation: "shimmer 1.5s linear infinite" }} />)}
      </div>
      <div style={{ height: 400, borderRadius: 16, background: "rgba(255,255,255,0.02)", animation: "shimmer 1.5s linear infinite" }} />
    </div>
  );
}
