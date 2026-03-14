import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "50");
  const status = searchParams.get("status");
  const type = searchParams.get("type");
  const search = searchParams.get("search") ?? "";
  const currency = searchParams.get("currency");
  const minAmount = searchParams.get("minAmount");
  const maxAmount = searchParams.get("maxAmount");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  const where: any = {};
  if (status && status !== "ALL") where.status = status;
  if (type && type !== "ALL") where.type = type;
  if (currency && currency !== "ALL") where.currency = currency;
  if (search) where.reference = { contains: search, mode: "insensitive" };
  if (minAmount || maxAmount) {
    where.amount = {};
    if (minAmount) where.amount.gte = parseFloat(minAmount);
    if (maxAmount) where.amount.lte = parseFloat(maxAmount);
  }
  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) where.createdAt.gte = new Date(dateFrom);
    if (dateTo) where.createdAt.lte = new Date(dateTo + "T23:59:59Z");
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: {
        senderAccount: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
        receiverAccount: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return NextResponse.json({
    transactions: transactions.map((t) => ({ ...t, amount: Number(t.amount) })),
    total,
    page,
    pages: Math.ceil(total / limit),
  });
}
