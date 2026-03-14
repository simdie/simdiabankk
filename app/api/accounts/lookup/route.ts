import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const number = req.nextUrl.searchParams.get("number");
  if (!number || number.length !== 10) {
    return NextResponse.json({ error: "Invalid account number" }, { status: 400 });
  }

  const account = await prisma.account.findUnique({
    where: { accountNumber: number },
    include: { user: { select: { firstName: true, lastName: true } } },
  });

  if (!account || account.status !== "ACTIVE") {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  // Don't reveal whose own account it is (minor privacy — still shows name)
  return NextResponse.json({
    account: {
      id: account.id,
      name: `${account.user.firstName} ${account.user.lastName}`,
      currency: account.currency,
      accountNumber: account.accountNumber,
    },
  });
}
