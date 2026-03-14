import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) return null;
  if ((session.user as any).role !== "ADMIN") return null;
  return session.user;
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { action } = body;

    if (action === "CHANGE_PASSWORD") {
      const { currentPassword, newPassword } = body;
      if (!currentPassword || !newPassword || newPassword.length < 8) {
        return NextResponse.json({ error: "Invalid password data" }, { status: 400 });
      }
      const user = await prisma.user.findUnique({ where: { id: admin.id } });
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

      const valid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!valid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });

      const hash = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({ where: { id: admin.id }, data: { passwordHash: hash } });
      return NextResponse.json({ success: true });
    }

    if (action === "CHANGE_EMAIL") {
      const { newEmail } = body;
      if (!newEmail || !newEmail.includes("@")) {
        return NextResponse.json({ error: "Invalid email" }, { status: 400 });
      }
      const existing = await prisma.user.findFirst({ where: { email: newEmail, NOT: { id: admin.id } } });
      if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 409 });
      await prisma.user.update({ where: { id: admin.id }, data: { email: newEmail } });
      return NextResponse.json({ success: true });
    }

    if (action === "CHANGE_NAME") {
      const { firstName, lastName } = body;
      if (!firstName) return NextResponse.json({ error: "First name required" }, { status: 400 });
      await prisma.user.update({ where: { id: admin.id }, data: { firstName, lastName: lastName || "" } });
      return NextResponse.json({ success: true });
    }

    if (action === "CREATE_ADMIN") {
      const { firstName, lastName, email, password } = body;
      if (!email || !password || password.length < 8 || !firstName) {
        return NextResponse.json({ error: "All fields required, password min 8 chars" }, { status: 400 });
      }
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 409 });

      const hash = await bcrypt.hash(password, 12);
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const r6 = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
      const displayId = `BOA${new Date().getFullYear().toString().slice(-2)}${r6}`;

      await prisma.user.create({
        data: {
          email, firstName, lastName: lastName || "", passwordHash: hash,
          role: "ADMIN", status: "ACTIVE", displayId,
        },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("[ADMIN PROFILE]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
