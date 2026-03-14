import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { to } = await req.json();
  if (!to) return NextResponse.json({ error: "Missing recipient" }, { status: 400 });

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  await transporter.sendMail({
    from: `"Bank of Asia Online" <${process.env.SMTP_USER}>`,
    to,
    subject: "Bank of Asia Online — SMTP Test",
    html: `<div style="font-family:sans-serif;padding:24px;background:#0d1a30;color:#e8edf5;border-radius:8px;">
      <h2 style="color:#F0B429;">Bank of Asia Online — Test Email</h2>
      <p>This is a test email sent from the Admin Settings panel to verify SMTP configuration.</p>
      <p style="color:#8899b5;font-size:12px;">Sent at: ${new Date().toISOString()}</p>
    </div>`,
  });

  return NextResponse.json({ ok: true });
}
