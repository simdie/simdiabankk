import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendEmail, FROM_SUPPORT } from "@/lib/email/send";
import { tmplAdminReply } from "@/lib/email/templates";
import { createUserNotification } from "@/lib/notifications";
import { formatTicketDisplay } from "@/lib/ticket";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const messages = await prisma.supportMessage.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, firstName: true, lastName: true, email: true } },
      replies: { orderBy: { createdAt: "asc" } },
    },
  });

  return NextResponse.json({ messages });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, adminReply, status, isRead } = await req.json();
  if (!id) return NextResponse.json({ error: "Message ID required" }, { status: 400 });

  const updateData: Record<string, unknown> = {};
  if (isRead !== undefined) updateData.isRead = isRead;
  if (status !== undefined) updateData.status = status;

  let newReply = null;
  if (adminReply !== undefined) {
    updateData.adminReply = adminReply;
    updateData.repliedAt = new Date();
    updateData.status = "RESOLVED";
    updateData.isRead = true;
  }

  const message = await prisma.supportMessage.update({
    where: { id },
    data: updateData,
    include: {
      user: { select: { id: true, firstName: true, lastName: true, email: true } },
      replies: { orderBy: { createdAt: "asc" } },
    },
  });

  if (adminReply !== undefined) {
    newReply = await prisma.supportReply.create({
      data: { messageId: id, body: adminReply, fromAdmin: true },
    });
  }

  // If we sent a reply, send in-app notification + email
  if (adminReply) {
    // In-app notification (non-blocking)
    createUserNotification(
      message.user.id,
      "SUPPORT_REPLY",
      `Reply to your support ticket: ${message.subject}`,
      adminReply,
      {}
    ).catch(console.error);

    // Email via tmplAdminReply
    const adminName = `${(session.user as any).firstName ?? "Support"} Team`;
    const ticketDisplay = formatTicketDisplay((message as any).ticketId, id);
    await sendEmail({
      from: FROM_SUPPORT,
      to: message.user.email,
      subject: `Re: ${message.subject} [${ticketDisplay}]`,
      html: tmplAdminReply({
        firstName: message.user.firstName,
        ticketId: ticketDisplay,
        subject: message.subject,
        replyContent: adminReply,
        adminName,
      }),
    });
  }

  return NextResponse.json({ success: true, message, newReply });
}
