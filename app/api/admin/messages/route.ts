import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { createUserNotification } from "@/lib/notifications";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const messages = await prisma.supportMessage.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, firstName: true, lastName: true, email: true } },
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
    },
  });

  // If we sent a reply, notify the user
  if (adminReply) {
    await createUserNotification(
      message.user.id,
      "SUPPORT_REPLY",
      `Reply to your support ticket: ${message.subject}`,
      adminReply,
      {
        sendEmailNotification: true,
        email: message.user.email,
        emailSubject: `Bank of Asia Online Support: ${message.subject}`,
      }
    );

    // Also send direct email with thread context
    const html = `
      <div style="background:#03050a;padding:36px;font-family:sans-serif;max-width:520px;margin:0 auto;border-radius:14px;border:1px solid rgba(0,212,255,0.15)">
        <div style="text-align:center;margin-bottom:24px">
          <div style="font-size:20px;font-weight:800;color:#00D4FF;letter-spacing:2px">BANK OF ASIA</div>
          <div style="font-size:11px;color:#6b7280;margin-top:4px">Support Response</div>
        </div>
        <p style="color:#9ca3af;font-size:14px">Hi ${message.user.firstName},</p>
        <p style="color:#9ca3af;font-size:14px;line-height:1.6">We have responded to your support ticket.</p>
        <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:16px;margin:20px 0">
          <div style="font-size:11px;color:#6b7280;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.08em">Subject</div>
          <div style="color:#f0f4ff;font-size:14px;font-weight:600;margin-bottom:16px">${message.subject}</div>
          <div style="font-size:11px;color:#6b7280;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.08em">Your Message</div>
          <div style="color:#9ca3af;font-size:13px;margin-bottom:16px">${message.message}</div>
          <div style="font-size:11px;color:#00D4FF;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.08em">Our Response</div>
          <div style="color:#f0f4ff;font-size:14px">${adminReply}</div>
        </div>
        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:24px 0"/>
        <p style="color:#4b5563;font-size:11px">Bank of Asia Online · Secure Digital Banking</p>
      </div>
    `;
    await sendEmail(message.user.email, `Support Reply: ${message.subject}`, html).catch(console.error);
  }

  return NextResponse.json({ success: true, message });
}
