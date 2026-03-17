"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const PRIMARY  = "/logo.png";
const FALLBACK = "/logo.png";

const SIZES = {
  small:   { width: 130, height: 44 },
  default: { width: 170, height: 57 },
  large:   { width: 210, height: 70 },
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
