import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import SupportClient from "@/components/dashboard/SupportClient";

export const metadata = { title: "Support" };

export default async function SupportPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { firstName: true, lastName: true, email: true },
  });

  const messages = await prisma.supportMessage.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { replies: { orderBy: { createdAt: "asc" } } },
  });

  return (
    <SupportClient
      user={user!}
      messages={messages as any[]}
    />
  );
}
