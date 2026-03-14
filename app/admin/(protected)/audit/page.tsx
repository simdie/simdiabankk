import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminAuditClient from "@/components/admin/AdminAuditClient";

export const dynamic = "force-dynamic";

export default async function AdminAuditPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") redirect("/dashboard");
  return <AdminAuditClient />;
}
