function Skeleton({ w, h, r = 8 }: { w?: string | number; h?: string | number; r?: number }) {
  return <div style={{ width: w ?? "100%", height: h ?? 14, borderRadius: r, background: "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />;
}
export default function AdminLoading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <Skeleton w={28} h={28} r={14} />
        <Skeleton w={200} h={26} r={6} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {[0,1,2,3,4,5].map(i => (
          <div key={i} style={{ background: "rgba(6,12,24,0.7)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: "20px 22px" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
              <Skeleton w={34} h={34} r={9} />
              <Skeleton w={100} h={11} r={4} />
            </div>
            <Skeleton w={70} h={32} r={6} />
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
        <div style={{ background: "rgba(6,12,24,0.7)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: 20 }}>
          <Skeleton w={140} h={16} r={4} />
          <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 12 }}>
            {[0,1,2,3,4,5].map(i => <Skeleton key={i} h={44} r={8} />)}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "rgba(6,12,24,0.7)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: 20 }}>
            <Skeleton w={120} h={16} r={4} />
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              {[0,1,2,3].map(i => <Skeleton key={i} h={44} r={10} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
