import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  accountId: z.string(),
  type: z.enum(["VISA", "MASTERCARD"]),
});

function generateCardNumber(): string {
  return Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join("");
}
function generateExpiry(): string {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yy = String(now.getFullYear() + 3).slice(-2);
  return `${mm}/${yy}`;
}
function generateCVV(): string {
  return String(Math.floor(Math.random() * 900) + 100);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 422 });

  const { accountId, type } = parsed.data;

  const account = await prisma.account.findFirst({
    where: { id: accountId, userId: session.user.id },
    include: { user: true },
  });
  if (!account) return NextResponse.json({ error: "Account not found" }, { status: 404 });
  if (account.status !== "ACTIVE") return NextResponse.json({ error: "Account is not active" }, { status: 400 });

  const activeCards = await prisma.virtualCard.count({
    where: { accountId, status: { in: ["ACTIVE", "FROZEN"] } },
  });
  if (activeCards >= 3) {
    return NextResponse.json({ error: "Maximum 3 active cards per account" }, { status: 400 });
  }

  const card = await prisma.virtualCard.create({
    data: {
      accountId,
      cardNumber: generateCardNumber(),
      expiry: generateExpiry(),
      cvv: generateCVV(),
      cardholderName: `${account.user.firstName} ${account.user.lastName}`.toUpperCase(),
      type: type as any,
      status: "ACTIVE",
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "CARD_CREATED",
      target: card.id,
      details: { accountId, type },
      ipAddress: req.headers.get("x-forwarded-for") || null,
    },
  });

  return NextResponse.json({ card }, { status: 201 });
}
