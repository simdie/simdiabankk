function Skeleton({ w, h, r = 6 }: { w?: string | number; h?: string | number; r?: number }) {
  return (
    <div style={{ width: w ?? "100%", height: h ?? 14, borderRadius: r, background: "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
  );
}

export default function TransactionsLoading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Skeleton w={180} h={26} />
        <Skeleton w={110} h={34} r={10} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        {[0,1,2,3].map(i => <Skeleton key={i} h={40} r={10} />)}
      </div>
      <div style={{ background: "rgba(6,12,24,0.7)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", gap: 20 }}>
          {[100, 80, 120, 80, 80, 100, 70, 80].map((w, i) => <Skeleton key={i} w={w} h={12} />)}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", gap: 20, alignItems: "center" }}>
            {[100, 80, 120, 80, 80, 100, 70, 80].map((w, j) => <Skeleton key={j} w={w} h={12} />)}
          </div>
        ))}
      </div>
    </div>
  );
}
