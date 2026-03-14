import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import {
  executeInternalTransfer,
  executeWireTransfer,
} from "@/lib/transactions";
import { sendTransferConfirmEmail } from "@/lib/email";
import { notifyTransfer } from "@/lib/notifications";

const internalSchema = z.object({
  type: z.literal("INTERNAL"),
  senderAccountId: z.string(),
  receiverAccountNumber: z.string().length(10),
  amount: z.number().positive(),
  description: z.string().max(200).optional(),
  transferToken: z.string().optional(),
});

const wireSchema = z.object({
  type: z.enum(["LOCAL_WIRE", "INTERNATIONAL_WIRE"]),
  senderAccountId: z.string(),
  currency: z.string(),
  amount: z.number().positive(),
  description: z.string().max(200).optional(),
  externalDetails: z.record(z.string(), z.string()),
  transferToken: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Parse body once
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

  // Check transfer token if required
  const settings = await prisma.systemSettings.findUnique({ where: { id: "singleton" } });
  if (settings?.requireTokenForTransfers) {
    const { transferToken } = body;
    if (!user.transferToken || !user.transferTokenExp) {
      return NextResponse.json({ error: "Transfer token required. Contact your administrator." }, { status: 403 });
    }
    if (new Date() > user.transferTokenExp) {
      return NextResponse.json({ error: "Transfer token has expired." }, { status: 403 });
    }
    if (user.transferToken !== transferToken) {
      return NextResponse.json({ error: "Invalid transfer token." }, { status: 403 });
    }
  }

  const ip = req.headers.get("x-forwarded-for") || undefined;

  try {
    if (body.type === "INTERNAL") {
      const parsed = internalSchema.safeParse(body);
      if (!parsed.success) return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 422 });

      const result = await executeInternalTransfer({
        ...parsed.data,
        userId: session.user.id,
        ipAddress: ip,
      });

      if (result.requiresEmailConfirm && result.emailConfirmToken) {
        const baseUrl = process.env.NEXTAUTH_URL ?? process.env.APP_URL ?? "http://localhost:3000";
        const confirmUrl = `${baseUrl}/api/transactions/confirm?token=${result.emailConfirmToken}`;
        const cancelUrl = `${baseUrl}/api/transactions/confirm?token=${result.emailConfirmToken}&cancel=true`;
        sendTransferConfirmEmail(user.email, {
          firstName: user.firstName,
          amount: Number(result.transaction.amount).toFixed(2),
          currency: result.transaction.currency,
          reference: result.transaction.reference,
          confirmUrl,
          cancelUrl,
        }).catch(() => {});
      }
      notifyTransfer({
        senderName: `${user.firstName} ${user.lastName}`,
        amount: Number(result.transaction.amount),
        currency: result.transaction.currency,
        type: result.transaction.type,
        reference: result.transaction.reference,
        senderUserId: session.user.id,
      }).catch(() => {});
      return NextResponse.json({ success: true, transaction: result.transaction, requiresEmailConfirm: result.requiresEmailConfirm });
    }

    if (body.type === "LOCAL_WIRE" || body.type === "INTERNATIONAL_WIRE") {
      const parsed = wireSchema.safeParse(body);
      if (!parsed.success) return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 422 });

      const result = await executeWireTransfer({
        ...parsed.data,
        type: parsed.data.type,
        userId: session.user.id,
        ipAddress: ip,
      });

      if (result.requiresEmailConfirm && result.emailConfirmToken) {
        const baseUrl = process.env.NEXTAUTH_URL ?? process.env.APP_URL ?? "http://localhost:3000";
        const confirmUrl = `${baseUrl}/api/transactions/confirm?token=${result.emailConfirmToken}`;
        const cancelUrl = `${baseUrl}/api/transactions/confirm?token=${result.emailConfirmToken}&cancel=true`;
        sendTransferConfirmEmail(user.email, {
          firstName: user.firstName,
          amount: Number(result.transaction.amount).toFixed(2),
          currency: result.transaction.currency,
          reference: result.transaction.reference,
          confirmUrl,
          cancelUrl,
        }).catch(() => {});
      }
      notifyTransfer({
        senderName: `${user.firstName} ${user.lastName}`,
        amount: Number(result.transaction.amount),
        currency: result.transaction.currency,
        type: result.transaction.type,
        reference: result.transaction.reference,
        senderUserId: session.user.id,
      }).catch(() => {});
      return NextResponse.json({ success: true, transaction: result.transaction, requiresEmailConfirm: result.requiresEmailConfirm });
    }

    return NextResponse.json({ error: "Invalid transfer type" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Transfer failed" }, { status: 400 });
  }
}
