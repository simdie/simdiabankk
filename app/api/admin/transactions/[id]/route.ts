import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  status: z.enum(["COMPLETED", "FAILED", "PENDING", "AWAITING_CONFIRMATION"]).optional(),
  reason: z.string().optional(),
  createdAt: z.string().optional(),
});

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
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 422 });

  const tx = await prisma.transaction.findUnique({ where: { id } });
  if (!tx) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });

  const updateData: any = {};
  if (parsed.data.status) updateData.status = parsed.data.status;
  if (parsed.data.createdAt) {
    const d = new Date(parsed.data.createdAt);
    if (!isNaN(d.getTime())) updateData.createdAt = d;
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const updated = await prisma.transaction.update({
    where: { id },
    data: updateData,
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: `ADMIN_OVERRIDE_TRANSACTION`,
      target: id,
      details: {
        reference: tx.reference,
        previousStatus: tx.status,
        newStatus: parsed.data.status ?? tx.status,
        previousDate: tx.createdAt,
        newDate: updateData.createdAt ?? tx.createdAt,
        reason: parsed.data.reason,
      },
      ipAddress: req.headers.get("x-forwarded-for") || null,
    },
  });

  return NextResponse.json({ success: true, transaction: { ...updated, amount: Number(updated.amount) } });
}
