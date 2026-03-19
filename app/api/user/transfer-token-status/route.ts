import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ requiresToken: false });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { transferToken: true, transferTokenExp: true },
  });

  const hasActiveToken =
    user?.transferToken &&
    user?.transferTokenExp &&
    new Date(user.transferTokenExp) > new Date();

  return Response.json({ requiresToken: !!hasActiveToken });
}
