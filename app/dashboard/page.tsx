import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import OverviewClient from "@/components/dashboard/OverviewClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [user, accounts, recentTxs] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { firstName: true, lastName: true },
    }),
    prisma.account.findMany({
      where: { userId: session.user.id },
      include: { virtualCards: { where: { status: "ACTIVE" } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.transaction.findMany({
      where: {
        OR: [
          { senderAccount: { userId: session.user.id } },
          { receiverAccount: { userId: session.user.id } },
        ],
      },
      include: {
        senderAccount: { select: { accountNumber: true, currency: true, userId: true } },
        receiverAccount: { select: { accountNumber: true, currency: true, userId: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const accountIds = accounts.map((a) => a.id);

  // Exchange rates to USD (March 2026)
  const RATES_TO_USD: Record<string, number> = {
    USD: 1, EUR: 1.08, GBP: 1.27, SGD: 0.74, CAD: 0.73,
    AUD: 0.63, CHF: 1.13, JPY: 0.0067, CNY: 0.138, AED: 0.272,
  };

  const [receivedTxs, sentTxs, pendingCount, activeCardsCount] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        receiverAccountId: { in: accountIds },
        status: "COMPLETED",
        createdAt: { gte: thirtyDaysAgo },
      },
      select: { amount: true, currency: true },
    }),
    prisma.transaction.findMany({
      where: {
        senderAccountId: { in: accountIds },
        status: "COMPLETED",
        createdAt: { gte: thirtyDaysAgo },
      },
      select: { amount: true, currency: true },
    }),
    prisma.transaction.count({
      where: {
        OR: [
          { senderAccountId: { in: accountIds } },
          { receiverAccountId: { in: accountIds } },
        ],
        status: { in: ["PENDING", "AWAITING_CONFIRMATION"] },
      },
    }),
    prisma.virtualCard.count({
      where: { account: { userId: session.user.id }, status: "ACTIVE" },
    }),
  ]);

  const totalBalance = accounts.reduce((sum, a) => sum + Number(a.balance), 0);
  // Convert all transactions to USD using exchange rates
  const totalInNum = receivedTxs.reduce((sum, tx) => {
    const rate = RATES_TO_USD[tx.currency as string] ?? 1;
    return sum + Number(tx.amount) * rate;
  }, 0);
  const totalOutNum = sentTxs.reduce((sum, tx) => {
    const rate = RATES_TO_USD[tx.currency as string] ?? 1;
    return sum + Number(tx.amount) * rate;
  }, 0);
  const savingsRate = totalInNum > 0 ? Math.max(0, Math.round(((totalInNum - totalOutNum) / totalInNum) * 100)) : 0;

  return (
    <OverviewClient
      user={user!}
      accounts={accounts.map((a) => ({
        ...a,
        balance: Number(a.balance),
      }))}
      recentTxs={recentTxs.map((t) => ({
        ...t,
        amount: Number(t.amount),
        externalDetails: t.externalDetails as Record<string, string> | null,
      }))}
      stats={{
        totalIn: totalInNum,
        totalOut: totalOutNum,
        pendingCount,
        activeCards: activeCardsCount,
        savingsRate,
        totalBalance,
      }}
    />
  );
}
