import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import SecurityClient from "@/components/dashboard/SecurityClient";

export const metadata = { title: "Security Center" };

export default async function SecurityPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { twoFactorEnabled: true, transferToken: true, transferTokenExp: true, createdAt: true },
  });

  const loginHistory = await prisma.loginHistory.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <SecurityClient
      twoFactorEnabled={user?.twoFactorEnabled ?? false}
      hasTransferToken={!!user?.transferToken}
      transferTokenExp={user?.transferTokenExp ? user.transferTokenExp.toISOString() : null}
      loginHistory={loginHistory as any[]}
    />
  );
}
