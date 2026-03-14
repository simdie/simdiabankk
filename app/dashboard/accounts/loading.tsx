function Skeleton({ w, h, r = 8 }: { w?: string | number; h?: string | number; r?: number }) {
  return <div style={{ width: w ?? "100%", height: h ?? 14, borderRadius: r, background: "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />;
}
export default function AccountsLoading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Skeleton w={180} h={26} />
      {[0, 1].map((i) => (
        <div key={i} style={{ background: "rgba(6,12,24,0.7)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Skeleton w={40} h={40} r={12} />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Skeleton w={100} h={16} />
                <Skeleton w={140} h={12} />
              </div>
            </div>
            <Skeleton w={120} h={32} r={10} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {[0,1,2].map(j => <div key={j}><Skeleton h={60} r={10} /></div>)}
          </div>
        </div>
      ))}
    </div>
  );
}
