import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminDepositsClient from "@/components/admin/AdminDepositsClient";

export const dynamic = "force-dynamic";

export default async function AdminDepositsPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") redirect("/dashboard");
  return <AdminDepositsClient />;
}
