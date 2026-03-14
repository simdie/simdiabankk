"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const PRIMARY  = "https://i.imgur.com/BbHaV56.png";
const FALLBACK = "https://i.imgur.com/SQSZD9i.png";

const SIZES = {
  small:   { width: 140, height: 37 },
  default: { width: 180, height: 48 },
  large:   { width: 220, height: 59 },
} as const;

interface LogoProps {
  size?: keyof typeof SIZES;
  className?: string;
}

export default function Logo({ size = "default", className }: LogoProps) {
  const [src, setSrc] = useState(PRIMARY);
  const { width, height } = SIZES[size];

  return (
    <Link href="/" aria-label="Bank of Asia Online — Home" className={className}>
      <Image
        src={src}
        alt="Bank of Asia Online"
        width={width}
        height={height}
        onError={() => setSrc(FALLBACK)}
        priority
        style={{ objectFit: "contain", display: "block" }}
      />
    </Link>
  );
}
