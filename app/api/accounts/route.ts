import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const accounts = await prisma.account.findMany({
    where: { userId: session.user.id },
    include: {
      virtualCards: { where: { status: { not: "CANCELLED" } }, orderBy: { createdAt: "desc" } },
      _count: { select: { sentTransactions: true, receivedTransactions: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ accounts });
}
