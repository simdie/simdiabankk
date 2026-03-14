export default function MarketingLoading() {
  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: "80vh", backgroundColor: "var(--boa-navy)" }}
    >
      <div className="flex flex-col items-center gap-5">
        {/* Logo wordmark */}
        <div className="flex items-baseline gap-1.5">
          <span
            style={{
              fontFamily: "var(--font-dm-sans, sans-serif)",
              fontSize: 18,
              fontWeight: 400,
              color: "rgba(255,255,255,0.4)",
            }}
          >
            Bank of&nbsp;
          </span>
          <span
            style={{
              fontFamily: "var(--font-syne, sans-serif)",
              fontSize: 20,
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            Asia
          </span>
        </div>

        {/* Spinning teal ring */}
        <div style={{ position: "relative", width: 48, height: 48 }}>
          {/* Static ring */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "2px solid rgba(0,200,150,0.15)",
            }}
          />
          {/* Spinning arc */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "2.5px solid transparent",
              borderTopColor: "#00C896",
              borderRightColor: "rgba(0,200,150,0.4)",
              animation: "spin 0.8s linear infinite",
            }}
          />
        </div>

        <p
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.3)",
            fontFamily: "var(--font-dm-sans, sans-serif)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Loading
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
