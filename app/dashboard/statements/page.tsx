import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import StatementsClient from "@/components/dashboard/StatementsClient";

export const metadata = { title: "Statements" };

export default async function StatementsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const accounts = await prisma.account.findMany({
    where: { userId: session.user.id },
    select: { id: true, accountNumber: true, currency: true, balance: true, status: true },
  });

  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        { senderAccount: { userId: session.user.id } },
        { receiverAccount: { userId: session.user.id } },
      ],
    },
    include: {
      senderAccount: { include: { user: { select: { firstName: true, lastName: true } } } },
      receiverAccount: { include: { user: { select: { firstName: true, lastName: true } } } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <StatementsClient
      accounts={accounts.map(a => ({ ...a, balance: Number(a.balance) }))}
      transactions={transactions.map(t => ({
        ...t,
        amount: Number(t.amount),
        externalDetails: t.externalDetails as Record<string, string> | null,
      }))}
      userId={session.user.id}
    />
  );
}
