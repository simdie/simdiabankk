import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [user, settings] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { firstName: true, lastName: true, email: true, role: true, status: true },
    }),
    prisma.systemSettings.findUnique({ where: { id: "singleton" } }),
  ]);

  if (!user) redirect("/login");
  if (user.status === "DISABLED" || user.status === "RESTRICTED") redirect("/login");
  if (settings?.maintenanceMode && (session.user as any).role !== "ADMIN") redirect("/maintenance");

  return (
    <DashboardShell
      user={{ ...user, id: session.user.id }}
      globalNotice={settings?.globalNotice ?? null}
    >
      {children}
    </DashboardShell>
  );
}
