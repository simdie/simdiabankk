interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  objectPosition?: string;
}

const ShieldIcon = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path
      d="M24 3 L42 10 L42 26 C42 35 34 43 24 46 C14 43 6 35 6 26 L6 10 Z"
      fill="rgba(6,12,24,0.9)" stroke="#00D4FF" strokeWidth="1.5" strokeOpacity="0.8"
    />
    <text x="24" y="30" fontFamily="Arial" fontWeight="700" fontSize="11"
      fill="#00D4FF" textAnchor="middle" letterSpacing="1">BOA</text>
  </svg>
);

export default function Logo({ className }: LogoProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }} className={className}>
      <ShieldIcon size={26} />
      <div>
        <div style={{ fontWeight: 800, fontSize: 13, color: "#00D4FF", letterSpacing: "0.05em" }}>BANK OF ASIA ONLINE</div>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em" }}>DIGITAL BANKING</div>
      </div>
    </div>
  );
}
