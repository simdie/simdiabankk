import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email/send";
import { tmplAccountActivated, accountRestrictedEmail, tmplAccountBlocked } from "@/lib/email/templates";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      accounts: {
        include: {
          virtualCards: { where: { status: { not: "CANCELLED" } } },
          sentTransactions: {
            orderBy: { createdAt: "desc" },
            take: 10,
            include: {
              senderAccount: { select: { accountNumber: true, currency: true } },
              receiverAccount: { select: { accountNumber: true, currency: true } },
            },
          },
          receivedTransactions: {
            orderBy: { createdAt: "desc" },
            take: 10,
            include: {
              senderAccount: { select: { accountNumber: true, currency: true } },
              receiverAccount: { select: { accountNumber: true, currency: true } },
            },
          },
        },
      },
      loginHistory: { orderBy: { createdAt: "desc" }, take: 20 },
      supportMessages: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({
    user: {
      ...user,
      accounts: user.accounts.map((a: any) => ({
        ...a,
        balance: Number(a.balance),
        sentTransactions: a.sentTransactions.map((t: any) => ({ ...t, amount: Number(t.amount) })),
        receivedTransactions: a.receivedTransactions.map((t: any) => ({ ...t, amount: Number(t.amount) })),
      })),
    },
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();

  const allowedFields: Record<string, unknown> = {};
  const auditDetails: Record<string, unknown> = {};

  // Core profile fields
  if (body.status !== undefined) { allowedFields.status = body.status; auditDetails.status = body.status; }
  if (body.adminNotes !== undefined) { allowedFields.adminNotes = body.adminNotes; auditDetails.adminNotes = "updated"; }
  if (body.kycStatus !== undefined) { allowedFields.kycStatus = body.kycStatus; auditDetails.kycStatus = body.kycStatus; }
  if (body.relationshipManager !== undefined) { allowedFields.relationshipManager = body.relationshipManager; auditDetails.relationshipManager = body.relationshipManager; }
  if (body.memberSince !== undefined) {
    const d = new Date(body.memberSince);
    if (!isNaN(d.getTime())) { allowedFields.createdAt = d; auditDetails.memberSince = body.memberSince; }
  }

  // Personal info
  if (body.firstName !== undefined) { allowedFields.firstName = body.firstName; auditDetails.firstName = body.firstName; }
  if (body.lastName !== undefined) { allowedFields.lastName = body.lastName; auditDetails.lastName = body.lastName; }
  if (body.phone !== undefined) { allowedFields.phone = body.phone || null; auditDetails.phone = "updated"; }
  if (body.gender !== undefined) { allowedFields.gender = body.gender || null; auditDetails.gender = body.gender; }
  if (body.nationality !== undefined) { allowedFields.nationality = body.nationality || null; auditDetails.nationality = body.nationality; }
  if (body.dateOfBirth !== undefined) {
    if (body.dateOfBirth) {
      const d = new Date(body.dateOfBirth);
      if (!isNaN(d.getTime())) { allowedFields.dateOfBirth = d; auditDetails.dateOfBirth = "updated"; }
    } else {
      allowedFields.dateOfBirth = null;
    }
  }

  // Address
  if (body.addressLine1 !== undefined) { allowedFields.addressLine1 = body.addressLine1 || null; auditDetails.address = "updated"; }
  if (body.addressLine2 !== undefined) { allowedFields.addressLine2 = body.addressLine2 || null; }
  if (body.city !== undefined) { allowedFields.city = body.city || null; }
  if (body.state !== undefined) { allowedFields.state = body.state || null; }
  if (body.zipCode !== undefined) { allowedFields.zipCode = body.zipCode || null; }
  if (body.country !== undefined) { allowedFields.country = body.country || null; auditDetails.country = body.country; }

  // ID / KYC documents
  if (body.idType !== undefined) { allowedFields.idType = body.idType || null; auditDetails.idType = body.idType; }
  if (body.idNumber !== undefined) { allowedFields.idNumber = body.idNumber || null; auditDetails.idNumber = "updated"; }
  if (body.displayId !== undefined) { allowedFields.displayId = body.displayId || null; auditDetails.displayId = body.displayId; }

  if (Object.keys(allowedFields).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id },
    data: allowedFields,
    select: {
      id: true, status: true, adminNotes: true, kycStatus: true, relationshipManager: true,
      firstName: true, lastName: true, phone: true, gender: true, nationality: true,
      dateOfBirth: true, addressLine1: true, addressLine2: true, city: true, state: true,
      zipCode: true, country: true, idType: true, idNumber: true, displayId: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "ADMIN_UPDATE_USER",
      target: id,
      details: auditDetails as any,
      ipAddress: req.headers.get("x-forwarded-for") || null,
    },
  });

  // Send status-change emails
  if (body.status === "ACTIVE" || body.status === "RESTRICTED" || body.status === "DISABLED" || body.status === "SUSPENDED") {
    const u = await prisma.user.findUnique({
      where: { id },
      select: { email: true, firstName: true, accounts: { select: { accountNumber: true, currency: true }, take: 1 } },
    });
    if (u) {
      if (body.status === "ACTIVE") {
        const acc = u.accounts[0];
        await sendEmail({
          to: u.email,
          subject: "✓ Your Bank of Asia Online Account is Now Active",
          html: tmplAccountActivated({ firstName: u.firstName, accountNumber: acc?.accountNumber ?? "N/A", currency: acc?.currency ?? "USD" }),
        });
      } else {
        const restrictionMessage = body.adminNotes ?? "Your account status has been updated. Please contact support for more information.";
        const isBlocked = restrictionMessage.toUpperCase().includes("BLOCKED");
        if (isBlocked) {
          await sendEmail({
            to: u.email,
            subject: "⚠️ Important Notice — Bank of Asia Online Account",
            html: tmplAccountBlocked({ firstName: u.firstName, message: restrictionMessage }),
          });
        } else {
          const { html, subject } = accountRestrictedEmail({ firstName: u.firstName, restrictionMessage });
          await sendEmail({ to: u.email, subject, html });
        }
      }
    }
  }

  return NextResponse.json({ success: true, user: updated });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (id === session.user.id) {
    return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
  }

  try {
    await prisma.auditLog.deleteMany({ where: { userId: id } });
    await prisma.transaction.deleteMany({
      where: {
        OR: [
          { senderAccount: { userId: id } },
          { receiverAccount: { userId: id } },
        ],
      },
    });
    await prisma.virtualCard.deleteMany({ where: { account: { userId: id } } });
    await prisma.account.deleteMany({ where: { userId: id } });
    await prisma.user.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "USER_DELETED",
        target: id,
        details: { deletedBy: session.user.id } as any,
        ipAddress: req.headers.get("x-forwarded-for") || null,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE_USER]", err);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
