import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email address. Please check and try again." },
        { status: 404 }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordResetToken: token, passwordResetExpiry: expiry },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${token}`;

    let emailError: string | null = null;
    try {
      await sendPasswordResetEmail(email, user.firstName, resetUrl);
    } catch (emailErr: any) {
      console.error("[FORGOT_PASSWORD] Email send failed:", emailErr);
      emailError = emailErr?.message || "Email delivery failed";
    }

    return NextResponse.json({
      success: true,
      emailDelivered: !emailError,
      ...(emailError ? { emailError } : {}),
    });
  } catch (err) {
    console.error("[FORGOT_PASSWORD]", err);
    return NextResponse.json({ error: "Failed to process your request. Please try again." }, { status: 500 });
  }
}
