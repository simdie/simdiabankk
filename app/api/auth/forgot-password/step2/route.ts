import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email, answer } = await req.json();
    if (!email || !answer) return NextResponse.json({ error: "Email and answer required" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, firstName: true, securityAnswer: true },
    });

    if (!user || !user.securityAnswer) {
      return NextResponse.json({ error: "Incorrect answer" }, { status: 400 });
    }

    const correct = await bcrypt.compare(answer.toLowerCase().trim(), user.securityAnswer);
    if (!correct) {
      return NextResponse.json({ error: "Incorrect answer" }, { status: 400 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordResetToken: token, passwordResetExpiry: expiry },
    });

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "https://www.boasiaonline.com";
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    let emailError: string | null = null;
    try {
      await sendPasswordResetEmail(email, user.firstName, resetUrl);
    } catch (err: any) {
      console.error("[FORGOT_PASSWORD_STEP2] Email failed:", err);
      emailError = err?.message || "Email delivery failed";
    }

    return NextResponse.json({
      success: true,
      emailDelivered: !emailError,
      ...(emailError ? { emailError } : {}),
    });
  } catch {
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
