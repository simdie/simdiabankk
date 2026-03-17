import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendContactFormEmail } from "@/lib/email";

const schema = z.object({
  name:    z.string().min(2, "Please enter your full name.").max(100),
  email:   z.string().email("Please enter a valid email address."),
  phone:   z.string().optional(),
  subject: z.string().min(1, "Please select a subject."),
  message: z.string().min(10, "Message must be at least 10 characters.").max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      const first = result.error.issues[0];
      return NextResponse.json({ error: first?.message ?? "Invalid input." }, { status: 400 });
    }

    const { name, email, phone, subject, message } = result.data;

    console.log(`[contact] From: ${name} <${email}> | Subject: ${subject}`);

    // Send to support + confirmation to user (non-blocking)
    sendContactFormEmail({ name, email, phone, subject, message }).catch((err) =>
      console.error("[contact] Email send error:", err)
    );

    return NextResponse.json(
      { success: true, message: "Your message has been received. We will respond within 1–2 business days." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to process your request. Please try again." },
      { status: 500 }
    );
  }
}
