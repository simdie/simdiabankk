import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import AccountsClient from "@/components/dashboard/AccountsClient";

export const dynamic = "force-dynamic";

export default async function AccountsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { firstName: true, lastName: true, email: true },
  });

  const accounts = await prisma.account.findMany({
    where: { userId: session.user.id },
    include: {
      virtualCards: { where: { status: { not: "CANCELLED" } }, orderBy: { createdAt: "desc" }, take: 3 },
      sentTransactions: { orderBy: { createdAt: "desc" }, take: 5, include: { receiverAccount: { select: { accountNumber: true } } } },
      receivedTransactions: { orderBy: { createdAt: "desc" }, take: 5, include: { senderAccount: { select: { accountNumber: true } } } },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <AccountsClient
      user={user!}
      accounts={accounts.map((a) => ({
        ...a,
        balance: Number(a.balance),
        sentTransactions: a.sentTransactions.map((t) => ({ ...t, amount: Number(t.amount) })),
        receivedTransactions: a.receivedTransactions.map((t) => ({ ...t, amount: Number(t.amount) })),
      }))}
    />
  );
}
