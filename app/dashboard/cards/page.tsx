import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import CardsClient from "@/components/dashboard/CardsClient";

export const dynamic = "force-dynamic";

export default async function CardsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const accounts = await prisma.account.findMany({
    where: { userId: session.user.id, status: "ACTIVE" },
    include: {
      virtualCards: { where: { status: { not: "CANCELLED" } }, orderBy: { createdAt: "desc" } },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <CardsClient
      accounts={accounts.map((a) => ({
        id: a.id,
        accountNumber: a.accountNumber,
        currency: a.currency,
        cards: a.virtualCards,
      }))}
    />
  );
}
