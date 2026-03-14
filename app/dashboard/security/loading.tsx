export default function Loading() {
  return (
    <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ height: 32, width: 220, borderRadius: 8, background: "rgba(255,255,255,0.04)", animation: "shimmer 1.5s linear infinite" }} />
      {[1, 2, 3].map(i => (
        <div key={i} style={{ height: 120, borderRadius: 16, background: "rgba(255,255,255,0.02)", animation: "shimmer 1.5s linear infinite" }} />
      ))}
      <div style={{ height: 300, borderRadius: 16, background: "rgba(255,255,255,0.02)", animation: "shimmer 1.5s linear infinite" }} />
    </div>
  );
}
