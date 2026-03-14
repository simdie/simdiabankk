import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ cardId: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { cardId } = await params;
  const body = await req.json();
  const { action } = body; // "freeze" | "unfreeze" | "cancel"

  const card = await prisma.virtualCard.findFirst({
    where: { id: cardId },
    include: { account: true },
  });
  if (!card) return NextResponse.json({ error: "Card not found" }, { status: 404 });
  if (card.account.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let newStatus: string;
  if (action === "freeze") {
    if (card.status !== "ACTIVE") return NextResponse.json({ error: "Card cannot be frozen" }, { status: 400 });
    newStatus = "FROZEN";
  } else if (action === "unfreeze") {
    if (card.status !== "FROZEN") return NextResponse.json({ error: "Card is not frozen" }, { status: 400 });
    newStatus = "ACTIVE";
  } else if (action === "cancel") {
    if (card.status === "CANCELLED") return NextResponse.json({ error: "Card already cancelled" }, { status: 400 });
    newStatus = "CANCELLED";
  } else {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const updated = await prisma.virtualCard.update({
    where: { id: cardId },
    data: { status: newStatus as any },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: `CARD_${action.toUpperCase()}`,
      target: cardId,
      details: { previousStatus: card.status, newStatus },
      ipAddress: req.headers.get("x-forwarded-for") || null,
    },
  });

  return NextResponse.json({ card: updated });
}
