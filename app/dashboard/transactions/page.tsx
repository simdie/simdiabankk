import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import TransactionsClient from "@/components/dashboard/TransactionsClient";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const accounts = await prisma.account.findMany({
    where: { userId: session.user.id },
    select: { id: true },
  });
  const accountIds = accounts.map((a) => a.id);

  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        { senderAccountId: { in: accountIds } },
        { receiverAccountId: { in: accountIds } },
      ],
    },
    include: {
      senderAccount: { select: { accountNumber: true, currency: true, userId: true } },
      receiverAccount: { select: { accountNumber: true, currency: true, userId: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <TransactionsClient
      transactions={transactions.map((t) => ({
        ...t,
        amount: Number(t.amount),
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt?.toISOString() ?? null,
        emailConfirmedAt: t.emailConfirmedAt?.toISOString() ?? null,
        externalDetails: t.externalDetails as Record<string, string> | null,
      }))}
      userId={session.user.id}
    />
  );
}
