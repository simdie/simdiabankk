import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    // Find user by email or account number
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const account = await prisma.account.findFirst({
        where: { accountNumber: email },
        include: { user: true },
      });
      if (account) user = account.user;
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // For blocked/restricted accounts, return the message directly so the
    // login page can show the blocked modal without relying on NextAuth error wrapping.
    if (user.status === "DISABLED" || user.status === "RESTRICTED") {
      return NextResponse.json({
        blocked: true,
        message: user.restrictionMessage || "YOUR ACCOUNT HAS BEEN BLOCKED. PLEASE CONTACT CUSTOMER CARE FOR SUPPORT.",
      });
    }
    if (user.status === "PENDING_ACTIVATION") {
      return NextResponse.json({
        blocked: true,
        message: "Your account is pending activation. Our team will notify you by email once verified.",
      });
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ requires2fa: user.twoFactorEnabled });
  } catch (err) {
    console.error("[PRE_LOGIN]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
