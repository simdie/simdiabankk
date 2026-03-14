function Skeleton({ w, h, r = 8 }: { w?: string | number; h?: string | number; r?: number }) {
  return <div style={{ width: w ?? "100%", height: h ?? 14, borderRadius: r, background: "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />;
}
export default function CardsLoading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Skeleton w={200} h={26} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px,1fr))", gap: 24 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ background: "rgba(6,12,24,0.7)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: 20 }}>
            <div style={{ height: 180, borderRadius: 12, background: "rgba(255,255,255,0.03)", marginBottom: 16 }} />
            <div style={{ display: "flex", gap: 10 }}>
              <Skeleton h={36} r={10} />
              <Skeleton h={36} r={10} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
