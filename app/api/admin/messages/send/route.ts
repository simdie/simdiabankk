import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createUserNotification } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId, email, subject, body } = await req.json();
  if (!userId || !subject || !body) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await createUserNotification(
    userId,
    "ADMIN_MESSAGE",
    subject,
    body,
    {
      sendEmailNotification: true,
      email,
      emailSubject: `Bank of Asia Online: ${subject}`,
    }
  );

  return NextResponse.json({ success: true });
}
