import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if ((session.user as any).role !== "ADMIN") redirect("/dashboard");

  return (
    <AdminShell admin={{ id: session.user.id, name: session.user.name ?? "Administrator", email: session.user.email ?? "" }}>
      {children}
    </AdminShell>
  );
}
