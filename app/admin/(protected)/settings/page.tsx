import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSettingsClient from "@/components/admin/AdminSettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") redirect("/dashboard");
  return <AdminSettingsClient />;
}
