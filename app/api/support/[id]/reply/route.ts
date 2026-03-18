import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { body: replyBody } = await req.json();
  if (!replyBody?.trim()) return NextResponse.json({ error: "Reply body required" }, { status: 400 });

  const message = await prisma.supportMessage.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true, status: true, subject: true, ticketId: true },
  });

  if (!message) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  if (message.status === "CLOSED") {
    return NextResponse.json(
      { error: "This ticket is closed. Please open a new ticket." },
      { status: 400 }
    );
  }

  const reply = await prisma.supportReply.create({
    data: { messageId: id, body: replyBody.trim(), fromAdmin: false },
  });

  await prisma.supportMessage.update({
    where: { id },
    data: { status: "OPEN", isRead: false },
  });

  // Notify admin by email (fire and forget)
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM || "";
  if (adminEmail) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { firstName: true, lastName: true, email: true },
    });
    const html = `
      <div style="background:#03050a;font-family:Arial,sans-serif;color:#f0f4ff;padding:32px;">
        <h2 style="color:#00D4FF;">New Reply on Support Ticket</h2>
        <p><strong>Ticket:</strong> ${message.ticketId || id}</p>
        <p><strong>Subject:</strong> ${message.subject}</p>
        <p><strong>From:</strong> ${user?.firstName} ${user?.lastName} (${user?.email})</p>
        <hr style="border-color:rgba(255,255,255,0.1)"/>
        <p style="line-height:1.7;">${replyBody}</p>
      </div>
    `;
    sendEmail(adminEmail, `[Support Reply] ${message.subject} — ${message.ticketId || id}`, html).catch(() => {});
  }

  return NextResponse.json({ reply }, { status: 201 });
}
