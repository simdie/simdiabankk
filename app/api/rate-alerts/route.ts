import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.email("Please enter a valid email address."),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message ?? "Invalid email address." },
        { status: 400 }
      );
    }

    const { email } = result.data;

    // In production this would persist to a database and/or
    // trigger a Mailchimp / SendGrid list subscription.
    // For now we log and return success.
    console.log(`[rate-alerts] New subscription: ${email}`);

    return NextResponse.json(
      {
        success: true,
        message: `You're subscribed. We'll notify ${email} when rates change.`,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to process your request. Please try again." },
      { status: 500 }
    );
  }
}
