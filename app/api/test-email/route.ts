import { NextResponse } from "next/server";
import { resend } from "@/lib/email/resend";

export async function GET() {
  const from = `Bank of Asia Online <${process.env.EMAIL_FROM ?? "onboarding@resend.dev"}>`;
  const to = process.env.EMAIL_SUPPORT ?? "christiammader@gmail.com";

  try {
    const result = await resend.emails.send({
      from,
      to: [to],
      subject: "Test Email — Bank of Asia Online",
      html: `<div style="background:#03050a;padding:36px;font-family:sans-serif;color:#e0f4ff;border-radius:12px;max-width:520px">
        <h2 style="color:#00D4FF;margin-bottom:12px">✓ Resend is working</h2>
        <p style="color:#9ca3af">Test email sent at: ${new Date().toISOString()}</p>
        <p style="color:#9ca3af">From: <strong style="color:#fff">${from}</strong></p>
        <p style="color:#9ca3af">API key present: <strong style="color:#00C896">${!!process.env.RESEND_API_KEY}</strong></p>
      </div>`,
    });

    if (result.error) {
      console.error("[test-email] Resend error:", result.error);
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    console.log("[test-email] Sent successfully. ID:", result.data?.id);
    return NextResponse.json({ success: true, id: result.data?.id, from, to });
  } catch (err) {
    console.error("[test-email] Exception:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
