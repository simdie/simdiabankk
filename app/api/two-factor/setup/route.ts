import { NextRequest, NextResponse } from "next/server";
import * as speakeasy from "speakeasy";
import QRCode from "qrcode";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (user.twoFactorEnabled) {
    return NextResponse.json({ error: "2FA is already enabled" }, { status: 400 });
  }

  // Generate TOTP secret
  const secret = speakeasy.generateSecret({
    name: `Bank of Asia (${user.email})`,
    issuer: "Bank of Asia",
    length: 20,
  });

  // Store secret (not yet enabled — confirmed after verification)
  await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorSecret: secret.base32 },
  });

  // Generate QR code data URL
  const otpauthUrl = secret.otpauth_url!;
  const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl, {
    width: 256,
    margin: 2,
    color: { dark: "#f0f4ff", light: "#060c18" },
  });

  return NextResponse.json({
    qrCodeDataUrl,
    manualKey: secret.base32,
  });
}
