import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { executeAdminDeposit } from "@/lib/transactions";
import prisma from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  targetAccountId: z.string(),
  amount: z.number().positive().max(100_000_000),
  description: z.string().min(10).max(300),
  internalNotes: z.string().max(500).optional(),
  type: z.enum(["CREDIT", "DEBIT"]).default("CREDIT"),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  try {
    if (parsed.data.type === "DEBIT") {
      const { executeAdminDebit } = await import("@/lib/transactions");
      const result = await executeAdminDebit({
        targetAccountId: parsed.data.targetAccountId,
        amount: parsed.data.amount,
        description: parsed.data.description,
        adminUserId: session.user.id,
        ipAddress: req.headers.get("x-forwarded-for") || undefined,
      });
      if (parsed.data.internalNotes) {
        await prisma.auditLog.create({
          data: {
            userId: session.user.id,
            action: "ADMIN_DEBIT_INTERNAL_NOTE",
            target: result.transaction.id,
            details: { note: parsed.data.internalNotes },
            ipAddress: req.headers.get("x-forwarded-for") || null,
          },
        });
      }
      return NextResponse.json({
        success: true,
        transaction: { ...result.transaction, amount: Number(result.transaction.amount) },
      });
    } else {
      // CREDIT — existing deposit logic
      const result = await executeAdminDeposit({
        targetAccountId: parsed.data.targetAccountId,
        amount: parsed.data.amount,
        description: parsed.data.description,
        adminUserId: session.user.id,
        ipAddress: req.headers.get("x-forwarded-for") || undefined,
      });

      // Store internal notes as additional audit log
      if (parsed.data.internalNotes) {
        await prisma.auditLog.create({
          data: {
            userId: session.user.id,
            action: "ADMIN_DEPOSIT_INTERNAL_NOTE",
            target: result.transaction.id,
            details: { note: parsed.data.internalNotes },
            ipAddress: req.headers.get("x-forwarded-for") || null,
          },
        });
      }

      return NextResponse.json({
        success: true,
        transaction: {
          ...result.transaction,
          amount: Number(result.transaction.amount),
        },
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Operation failed" }, { status: 400 });
  }
}

// GET — recent admin deposits and debits
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const deposits = await prisma.transaction.findMany({
    where: { type: { in: ["ADMIN_DEPOSIT", "ADMIN_DEBIT"] as any[] } },
    include: {
      receiverAccount: {
        include: { user: { select: { firstName: true, lastName: true, email: true } } },
      },
      senderAccount: {
        include: { user: { select: { firstName: true, lastName: true, email: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return NextResponse.json({
    deposits: deposits.map((d) => ({ ...d, amount: Number(d.amount) })),
  });
}
