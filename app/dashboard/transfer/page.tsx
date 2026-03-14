import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import TransferClient from "@/components/dashboard/TransferClient";

export const dynamic = "force-dynamic";

export default async function TransferPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [accounts, settings, user] = await Promise.all([
    prisma.account.findMany({
      where: { userId: session.user.id, status: "ACTIVE" },
      select: { id: true, accountNumber: true, currency: true, balance: true },
    }),
    prisma.systemSettings.findUnique({ where: { id: "singleton" } }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { transferToken: true, transferTokenExp: true },
    }),
  ]);

  const requiresTokenForTransfers = settings?.requireTokenForTransfers ?? false;
  const hasValidToken = !!(
    user?.transferToken &&
    user?.transferTokenExp &&
    new Date() < user.transferTokenExp
  );

  return (
    <TransferClient
      accounts={accounts.map((a) => ({ ...a, balance: Number(a.balance) }))}
      requiresTokenForTransfers={requiresTokenForTransfers}
      hasValidToken={hasValidToken}
    />
  );
}
