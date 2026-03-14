import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import SettingsClient from "@/components/dashboard/SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { firstName: true, lastName: true, email: true, phone: true, twoFactorEnabled: true, transferToken: true, transferTokenExp: true },
  });
  if (!user) redirect("/login");

  return <SettingsClient user={{ ...user, transferToken: user.transferToken, transferTokenExp: user.transferTokenExp?.toISOString() ?? null }} />;
}
