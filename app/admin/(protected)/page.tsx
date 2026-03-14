import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import CommandCenterClient from "@/components/admin/CommandCenterClient";

export const dynamic = "force-dynamic";

export default async function AdminCommandCenter() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") redirect("/dashboard");

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);

  const [
    pendingCount, activeCount, restrictedCount, disabledCount,
    todayTxCount, failedCount, auditLogs, todayVolume,
  ] = await Promise.all([
    prisma.user.count({ where: { status: "PENDING_ACTIVATION" } }),
    prisma.user.count({ where: { status: "ACTIVE" } }),
    prisma.user.count({ where: { status: "RESTRICTED" } }),
    prisma.user.count({ where: { status: "DISABLED" } }),
    prisma.transaction.count({ where: { createdAt: { gte: today } } }),
    prisma.transaction.count({ where: { status: "FAILED", createdAt: { gte: yesterday } } }),
    prisma.auditLog.findMany({
      include: { user: { select: { firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.transaction.aggregate({
      where: { status: "COMPLETED", createdAt: { gte: today } },
      _sum: { amount: true },
    }),
  ]);

  return (
    <CommandCenterClient
      stats={{
        pendingCount, activeCount,
        restrictedDisabled: restrictedCount + disabledCount,
        todayTxCount, todayVolume: Number(todayVolume._sum.amount ?? 0),
        failedCount,
      }}
      auditLogs={auditLogs}
    />
  );
}
