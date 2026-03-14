import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.subject || !body?.message) {
    return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
  }
  if (body.message.length < 20) {
    return NextResponse.json({ error: "Message must be at least 20 characters" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { firstName: true, lastName: true, email: true },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const supportMsg = await prisma.supportMessage.create({
    data: {
      userId: session.user.id,
      subject: body.subject,
      category: body.category || "General Inquiry",
      priority: body.priority || "NORMAL",
      message: body.message,
      reference: body.reference || null,
      status: "SENT",
    },
  });

  // Send email to admin (fire and forget)
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM || "";
  if (adminEmail) {
    const html = `
      <div style="background:#03050a;font-family:Arial,sans-serif;color:#f0f4ff;padding:32px;">
        <h2 style="color:#F0B429;">Support Message — Bank of Asia Online</h2>
        <p><strong>From:</strong> ${user.firstName} ${user.lastName} (${user.email})</p>
        <p><strong>Subject:</strong> ${body.subject}</p>
        <p><strong>Category:</strong> ${body.category}</p>
        <p><strong>Priority:</strong> <span style="color:${body.priority === "URGENT" ? "#FF3B5C" : "#00D4FF"}">${body.priority}</span></p>
        ${body.reference ? `<p><strong>Reference:</strong> ${body.reference}</p>` : ""}
        <hr style="border-color:rgba(255,255,255,0.1)"/>
        <p style="line-height:1.7;">${body.message}</p>
        <hr style="border-color:rgba(255,255,255,0.1)"/>
        <p style="font-size:12px;color:rgba(255,255,255,0.4);">Sent: ${new Date().toISOString()}</p>
      </div>
    `;
    sendEmail(adminEmail, `[Support] ${body.subject} — ${user.firstName} ${user.lastName}`, html).catch(() => {});
  }

  return NextResponse.json({ message: supportMsg }, { status: 201 });
}
