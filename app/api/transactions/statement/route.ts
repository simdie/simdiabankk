import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateStatementPDF } from "@/lib/statement";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = req.nextUrl;
    const accountId = searchParams.get("accountId");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!accountId || !from || !to) {
      return NextResponse.json({ error: "accountId, from, and to are required" }, { status: 400 });
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return NextResponse.json({ error: "Invalid date range" }, { status: 400 });
    }

    // Verify account belongs to user
    const account = await prisma.account.findFirst({
      where: { id: accountId, userId: session.user.id },
      include: { user: { select: { firstName: true, lastName: true, email: true } } },
    });
    if (!account) return NextResponse.json({ error: "Account not found" }, { status: 404 });

    // Fetch transactions in date range
    const [sentTxs, receivedTxs] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          senderAccountId: accountId,
          createdAt: { gte: fromDate, lte: toDate },
        },
        include: {
          receiverAccount: { include: { user: { select: { firstName: true, lastName: true } } } },
        },
        orderBy: { createdAt: "asc" },
      }),
      prisma.transaction.findMany({
        where: {
          receiverAccountId: accountId,
          createdAt: { gte: fromDate, lte: toDate },
        },
        include: {
          senderAccount: { include: { user: { select: { firstName: true, lastName: true } } } },
        },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    // Merge and sort
    const allTxs = [
      ...sentTxs.map(t => ({
        id: t.id,
        reference: t.reference,
        type: t.type,
        status: t.status,
        amount: Number(t.amount),
        currency: t.currency,
        description: t.description,
        createdAt: t.createdAt,
        isCredit: false,
        counterparty: t.receiverAccount
          ? `${t.receiverAccount.user.firstName} ${t.receiverAccount.user.lastName}`
          : undefined,
      })),
      ...receivedTxs.map(t => ({
        id: t.id,
        reference: t.reference,
        type: t.type,
        status: t.status,
        amount: Number(t.amount),
        currency: t.currency,
        description: t.description,
        createdAt: t.createdAt,
        isCredit: true,
        counterparty: t.senderAccount
          ? `${t.senderAccount.user.firstName} ${t.senderAccount.user.lastName}`
          : undefined,
      })),
    ].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const totalCredits = allTxs.filter(t => t.isCredit).reduce((s, t) => s + t.amount, 0);
    const totalDebits = allTxs.filter(t => !t.isCredit).reduce((s, t) => s + t.amount, 0);
    const currentBalance = Number(account.balance);
    const openingBalance = currentBalance - totalCredits + totalDebits;

    const pdfBuffer = await generateStatementPDF({
      accountNumber: account.accountNumber,
      currency: account.currency,
      ownerName: `${account.user.firstName} ${account.user.lastName}`,
      email: account.user.email,
      fromDate,
      toDate,
      openingBalance,
      closingBalance: currentBalance,
      transactions: allTxs,
    });

    const filename = `statement-${account.accountNumber}-${fromDate.toISOString().slice(0, 10)}-to-${toDate.toISOString().slice(0, 10)}.pdf`;

    return new Response(pdfBuffer.buffer as ArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pdfBuffer.byteLength),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[STATEMENT_GET]", err);
    return NextResponse.json({ error: "Failed to generate statement" }, { status: 500 });
  }
}
