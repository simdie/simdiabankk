import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sendEmail } from "@/lib/email/send";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { to } = await req.json();
  if (!to) return NextResponse.json({ error: "Missing recipient" }, { status: 400 });

  await sendEmail({
    to,
    subject: "Bank of Asia Online — Email Test",
    html: `<div style="font-family:sans-serif;padding:24px;background:#0d1a30;color:#e8edf5;border-radius:8px;">
      <h2 style="color:#00C896;">Bank of Asia Online — Test Email</h2>
      <p>This is a test email sent from the Admin Settings panel to verify Resend configuration.</p>
      <p style="color:#8899b5;font-size:12px;">Sent at: ${new Date().toISOString()}</p>
    </div>`,
  });

  return NextResponse.json({ ok: true });
}
