import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email/send";
import { tmplTransferToken } from "@/lib/email/templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate 8-digit numeric token
    const token = Math.floor(10000000 + Math.random() * 90000000).toString();

    // Token expires in 15 minutes
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Save token to user record
    await prisma.user.update({
      where: { id: session.user.id },
      data: { transferToken: token, transferTokenExp: expiresAt },
    });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, firstName: true },
    });

    if (!user?.email) {
      return Response.json({ error: "User email not found" }, { status: 400 });
    }

    const expiresDisplay =
      expiresAt.toLocaleString("en-SG", { dateStyle: "medium", timeStyle: "short" }) + " SGT";

    await sendEmail({
      to: user.email,
      subject: "Your Transfer Verification Token — Bank of Asia Online",
      html: tmplTransferToken({ firstName: user.firstName, token, expiresAt: expiresDisplay }),
    });

    console.log(`[TOKEN] Generated and sent to ${user.email}`);

    return Response.json({ success: true, message: "Token sent to registered email" });
  } catch (error: any) {
    console.error("Generate token error:", error);
    return Response.json({ error: "Failed to generate token" }, { status: 500 });
  }
}
