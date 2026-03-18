import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Returns the security question for an email (never confirms if email exists)
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { email },
      select: { securityQuestion: true },
    });

    // Always return a response — don't reveal whether email exists
    const question = user?.securityQuestion ?? null;

    return NextResponse.json({ question });
  } catch {
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
