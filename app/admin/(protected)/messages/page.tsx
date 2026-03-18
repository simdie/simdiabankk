import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import AdminMessagesClient from "@/components/admin/AdminMessagesClient";

export default async function AdminMessagesPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") redirect("/login");

  const messages = await prisma.supportMessage.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, firstName: true, lastName: true, email: true } },
      replies: { orderBy: { createdAt: "asc" } },
    },
  });

  return <AdminMessagesClient messages={messages as any} />;
}
