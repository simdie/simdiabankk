export default function Loading() {
  return (
    <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ height: 32, width: 200, borderRadius: 8, background: "rgba(255,255,255,0.04)", animation: "shimmer 1.5s linear infinite" }} />
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{ height: 80, borderRadius: 14, background: "rgba(255,255,255,0.02)", animation: "shimmer 1.5s linear infinite" }} />
      ))}
    </div>
  );
}
