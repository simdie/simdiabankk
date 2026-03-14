import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminTransactionsClient from "@/components/admin/AdminTransactionsClient";

export const dynamic = "force-dynamic";

export default async function AdminTransactionsPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") redirect("/dashboard");
  return <AdminTransactionsClient />;
}
