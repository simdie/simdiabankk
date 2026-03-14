function Skeleton({ w, h, r = 8 }: { w?: string | number; h?: string | number; r?: number }) {
  return (
    <div style={{
      width: w ?? "100%", height: h ?? 16, borderRadius: r,
      background: "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
    }} />
  );
}

export default function DashboardLoading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Skeleton w={200} h={28} />
          <Skeleton w={140} h={14} />
        </div>
        <Skeleton w={120} h={36} r={10} />
      </div>
      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ background: "rgba(6,12,24,0.7)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: "20px 22px" }}>
            <Skeleton w={80} h={11} r={4} />
            <div style={{ marginTop: 14 }}><Skeleton w={100} h={28} /></div>
          </div>
        ))}
      </div>
      {/* Account cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px,1fr))", gap: 16 }}>
        {[0, 1].map((i) => (
          <div key={i} style={{ background: "rgba(6,12,24,0.7)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: 20, height: 140 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <Skeleton w={80} h={14} r={4} />
              <Skeleton w={32} h={32} r={8} />
            </div>
            <Skeleton w={130} h={28} r={6} />
            <div style={{ marginTop: 12 }}><Skeleton w="60%" h={12} r={4} /></div>
          </div>
        ))}
      </div>
      {/* Transactions */}
      <div style={{ background: "rgba(6,12,24,0.7)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: 20 }}>
        <Skeleton w={150} h={16} r={4} />
        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 14 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Skeleton w={36} h={36} r={10} />
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <Skeleton w={140} h={12} r={4} />
                  <Skeleton w={90} h={10} r={4} />
                </div>
              </div>
              <Skeleton w={80} h={16} r={4} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
