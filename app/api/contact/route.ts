import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail } from "@/lib/email/send";
import { tmplContactAdmin, tmplContactConfirm } from "@/lib/email/templates";

const schema = z.object({
  name:    z.string().min(2, "Please enter your full name.").max(100),
  email:   z.string().email("Please enter a valid email address."),
  phone:   z.string().optional(),
  subject: z.string().min(1, "Please select a subject."),
  message: z.string().min(10, "Message must be at least 10 characters.").max(2000),
});

const SUPPORT = process.env.EMAIL_SUPPORT ?? "support@boasiaonline.com";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    const first = result.error.issues[0];
    return NextResponse.json({ error: first?.message ?? "Invalid input." }, { status: 400 });
  }

  const { name, email, phone, subject, message } = result.data;
  const timestamp = new Date().toLocaleString("en-SG", { dateStyle: "full", timeStyle: "short" });

  console.log(`[contact] From: ${name} <${email}> | Subject: ${subject}`);

  // ── Email 1: Notify support team ──────────────────────────────────────────
  await sendEmail({
    to: SUPPORT,
    replyTo: email,
    subject: `New Contact: ${subject} — from ${name}`,
    html: tmplContactAdmin({ name, email, phone, subject, message, timestamp }),
  });

  // ── Email 2: Confirmation to sender ───────────────────────────────────────
  const preview = message.length > 200 ? message.substring(0, 200) + "…" : message;
  try {
    await sendEmail({
      to: email,
      subject: "We received your message — Bank of Asia Online",
      html: tmplContactConfirm({ name, subject, preview }),
    });
  } catch {
    return NextResponse.json({
      success: true,
      message: "Your message has been received. Email confirmation may be delayed.",
      warning: "confirmation_email_failed",
    });
  }

  return NextResponse.json({
    success: true,
    message: "Your message has been received. We will respond within 1–2 business days.",
  });
}
