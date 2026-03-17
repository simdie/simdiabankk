interface LogoProps {
  width?: number;
  className?: string;
}

export default function Logo({ width = 140, className }: LogoProps) {
  return (
    <img
      src="/logo.png"
      alt="Bank of Asia Online"
      width={width}
      style={{ height: "auto", display: "block", borderRadius: 6 }}
      className={className}
    />
  );
}
