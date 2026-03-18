import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { action } = await req.json(); // 'close' | 'reopen'

  const isClosing = action === "close";

  const updated = await prisma.supportMessage.update({
    where: { id },
    data: {
      status: isClosing ? "CLOSED" : "OPEN",
      closedAt: isClosing ? new Date() : null,
      closedBy: isClosing ? session.user.id : null,
    },
    include: {
      user: { select: { id: true, firstName: true, lastName: true, email: true } },
      replies: { orderBy: { createdAt: "asc" } },
    },
  });

  if (isClosing) {
    await prisma.supportReply.create({
      data: {
        messageId: id,
        body: "✓ This ticket has been marked as resolved and closed by our support team. If you have further questions, please open a new support ticket.",
        fromAdmin: true,
      },
    });
  }

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: isClosing ? "ADMIN_CLOSE_TICKET" : "ADMIN_REOPEN_TICKET",
      target: id,
      details: { ticketId: updated.ticketId },
      ipAddress: req.headers.get("x-forwarded-for") || null,
    },
  });

  // Re-fetch with fresh replies after possible system reply
  const fresh = await prisma.supportMessage.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, firstName: true, lastName: true, email: true } },
      replies: { orderBy: { createdAt: "asc" } },
    },
  });

  return NextResponse.json({ success: true, message: fresh });
}
