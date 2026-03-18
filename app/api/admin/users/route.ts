import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { sendActivationEmail, sendRestrictionEmail } from "@/lib/email";

// GET — list all users with accounts
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "ALL";
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "50");

  const where: any = {};
  if (search) {
    where.OR = [
      { email: { contains: search, mode: "insensitive" } },
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
    ];
  }
  if (status !== "ALL") where.status = status;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true, email: true, firstName: true, lastName: true, phone: true,
        role: true, status: true, twoFactorEnabled: true,
        restrictionMessage: true, transferToken: true, transferTokenExp: true,
        createdAt: true, displayId: true,
        city: true, country: true, addressLine1: true,
        accounts: { select: { id: true, accountNumber: true, currency: true, balance: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({
    users: users.map((u: any) => ({
      ...u,
      accounts: u.accounts.map((a: any) => ({ ...a, balance: Number(a.balance) })),
    })),
    total,
    page,
    pages: Math.ceil(total / limit),
  });
}

// PATCH — update user status, email, restrictionMessage, or role
const patchSchema = z.object({
  userId: z.string(),
  action: z.enum(["SET_STATUS", "SET_EMAIL", "SET_RESTRICTION_MESSAGE", "SET_ROLE"]),
  status: z.enum(["PENDING_ACTIVATION", "ACTIVE", "RESTRICTED", "DISABLED"]).optional(),
  email: z.string().email().optional(),
  restrictionMessage: z.string().max(500).optional().nullable(),
  role: z.enum(["ADMIN", "USER"]).optional(),
});

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten().fieldErrors }, { status: 422 });

  const { userId, action } = parsed.data;
  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });

  let updateData: any = {};
  let auditAction = "";

  if (action === "SET_STATUS" && parsed.data.status) {
    updateData.status = parsed.data.status;
    if (parsed.data.status === "RESTRICTED" && parsed.data.restrictionMessage) {
      updateData.restrictionMessage = parsed.data.restrictionMessage;
    }
    if (parsed.data.status === "ACTIVE" || parsed.data.status === "PENDING_ACTIVATION") {
      updateData.restrictionMessage = null;
    }
    auditAction = `ADMIN_SET_USER_STATUS_${parsed.data.status}`;
  } else if (action === "SET_EMAIL" && parsed.data.email) {
    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (existing && existing.id !== userId) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }
    updateData.email = parsed.data.email;
    auditAction = "ADMIN_CHANGE_USER_EMAIL";
  } else if (action === "SET_RESTRICTION_MESSAGE") {
    updateData.restrictionMessage = parsed.data.restrictionMessage ?? null;
    auditAction = "ADMIN_SET_RESTRICTION_MESSAGE";
  } else if (action === "SET_ROLE" && parsed.data.role) {
    updateData.role = parsed.data.role;
    auditAction = "ADMIN_SET_USER_ROLE";
  } else {
    return NextResponse.json({ error: "Invalid action parameters" }, { status: 400 });
  }

  const updatedUser = await prisma.user.update({ where: { id: userId }, data: updateData });

  // Send email notifications (non-blocking)
  try {
    if (action === "SET_STATUS") {
      if (parsed.data.status === "ACTIVE" && target.status !== "ACTIVE") {
        const primaryAccount = await prisma.account.findFirst({ where: { userId } });
        sendActivationEmail(
          target.email, target.firstName,
          primaryAccount?.accountNumber ?? "—",
          primaryAccount?.currency ?? "USD"
        ).catch(() => {});
      } else if (parsed.data.status === "RESTRICTED") {
        sendRestrictionEmail(target.email, target.firstName, parsed.data.restrictionMessage ?? undefined).catch(() => {});
      }
    }
  } catch { /* email failures must never block the response */ }

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: auditAction,
      target: userId,
      details: { previous: { status: target.status, email: target.email }, updated: updateData },
      ipAddress: req.headers.get("x-forwarded-for") || null,
    },
  });

  return NextResponse.json({ success: true, user: { ...updatedUser, passwordHash: undefined } });
}

// DELETE — permanently delete a user and all their data
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  // Prevent admin from deleting themselves
  if (userId === session.user.id) {
    return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, firstName: true, lastName: true } });
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });

  await prisma.user.delete({ where: { id: userId } });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "ADMIN_DELETE_USER",
      target: userId,
      details: { deletedUser: { email: target.email, name: `${target.firstName} ${target.lastName}` } },
      ipAddress: req.headers.get("x-forwarded-for") || null,
    },
  });

  return NextResponse.json({ success: true });
}
