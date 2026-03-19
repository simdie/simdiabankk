import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ requiresToken: false });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { transferToken: true, transferTokenExp: true },
    });

    const now = new Date();
    const hasActiveToken = !!(
      user?.transferToken &&
      user?.transferTokenExp &&
      new Date(user.transferTokenExp) > now
    );

    console.log("[TOKEN STATUS]", {
      userId: session.user.id,
      hasToken: !!user?.transferToken,
      expiry: user?.transferTokenExp,
      isActive: hasActiveToken,
    });

    return Response.json({
      requiresToken: hasActiveToken,
      expiresAt: user?.transferTokenExp ?? null,
    });
  } catch (error: any) {
    console.error("Token status error:", error);
    return Response.json({ requiresToken: false });
  }
}
