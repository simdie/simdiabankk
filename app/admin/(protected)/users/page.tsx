import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminUsersClient from "@/components/admin/AdminUsersClient";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") redirect("/dashboard");
  return <AdminUsersClient />;
}
