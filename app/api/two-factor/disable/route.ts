import { NextRequest, NextResponse } from "next/server";
import * as speakeasy from "speakeasy";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { totpVerifySchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = totpVerifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid code format" }, { status: 422 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !user.twoFactorSecret || !user.twoFactorEnabled) {
    return NextResponse.json({ error: "2FA is not enabled" }, { status: 400 });
  }

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token: parsed.data.code,
    window: 1,
  });

  if (!verified) {
    return NextResponse.json(
      { error: "Invalid code. 2FA was not disabled." },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorEnabled: false, twoFactorSecret: null },
  });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "TWO_FACTOR_DISABLED",
      details: {},
      ipAddress: req.headers.get("x-forwarded-for") || null,
    },
  });

  return NextResponse.json({ success: true, message: "2FA disabled successfully" });
}
