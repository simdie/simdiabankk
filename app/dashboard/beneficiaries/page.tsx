import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import BeneficiariesClient from "@/components/dashboard/BeneficiariesClient";

export const metadata = { title: "Beneficiaries" };

export default async function BeneficiariesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const beneficiaries = await prisma.beneficiary.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return <BeneficiariesClient beneficiaries={beneficiaries as any[]} />;
}
