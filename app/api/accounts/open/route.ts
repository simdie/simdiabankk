import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateAccountNumber } from "@/lib/utils";

const ALLOWED_CURRENCIES = ["USD", "EUR", "GBP", "NGN", "CAD", "AUD", "CHF", "JPY", "CNY", "AED"];
const MAX_ACCOUNTS = 5;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { currency } = body;

  if (!currency || !ALLOWED_CURRENCIES.includes(currency)) {
    return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
  }

  // Check max accounts
  const count = await prisma.account.count({ where: { userId: session.user.id } });
  if (count >= MAX_ACCOUNTS) {
    return NextResponse.json({ error: `Maximum of ${MAX_ACCOUNTS} accounts allowed` }, { status: 400 });
  }

  // Check no duplicate currency
  const existing = await prisma.account.findFirst({
    where: { userId: session.user.id, currency },
  });
  if (existing) {
    return NextResponse.json({ error: `You already have a ${currency} account` }, { status: 400 });
  }

  const accountNumber = await generateAccountNumber(
    async (num) => !(await prisma.account.findUnique({ where: { accountNumber: num } }))
  );

  const account = await prisma.account.create({
    data: {
      userId: session.user.id,
      accountNumber,
      currency,
      balance: 0,
      status: "ACTIVE",
    },
  });

  return NextResponse.json({ success: true, account: { ...account, balance: 0 } }, { status: 201 });
}
