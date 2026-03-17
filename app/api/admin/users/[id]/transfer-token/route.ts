import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateToken } from "@/lib/utils";
import { z } from "zod";
import { sendTransferTokenEmail } from "@/lib/email";

const EXPIRY_HOURS: Record<string, number> = { "1h": 1, "6h": 6, "24h": 24, "72h": 72 };

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const expiry = body.expiry ?? "24h";
  const hours = EXPIRY_HOURS[expiry] ?? 24;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const token = generateToken(16); // 32-char hex
  const exp = new Date(Date.now() + hours * 3600 * 1000);

  await prisma.user.update({
    where: { id },
    data: { transferToken: token, transferTokenExp: exp },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "ADMIN_GENERATE_TRANSFER_TOKEN",
      target: id,
      details: { expiry, expiresAt: exp.toISOString() },
      ipAddress: req.headers.get("x-forwarded-for") || null,
    },
  });

  // Send token email (non-blocking)
  const expiresDisplay = exp.toLocaleString("en-US", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit", timeZone: "Asia/Singapore",
  }) + " SGT";
  sendTransferTokenEmail(user.email, {
    firstName: user.firstName,
    token,
    expiresAt: expiresDisplay,
    issuedBy: (session.user as any).email ?? undefined,
  }).catch(console.error);

  return NextResponse.json({ token, expiresAt: exp.toISOString() });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.user.update({
    where: { id },
    data: { transferToken: null, transferTokenExp: null },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "ADMIN_REVOKE_TRANSFER_TOKEN",
      target: id,
      details: {},
      ipAddress: req.headers.get("x-forwarded-for") || null,
    },
  });

  return NextResponse.json({ success: true });
}
