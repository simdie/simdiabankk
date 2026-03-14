import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileClient from "@/components/dashboard/ProfileClient";

export const metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true, firstName: true, lastName: true, email: true,
      phone: true, role: true, status: true, createdAt: true,
      dateOfBirth: true, gender: true, nationality: true,
      addressLine1: true, addressLine2: true, city: true,
      state: true, zipCode: true, country: true,
      idType: true, idNumber: true, idExpiry: true,
      profilePhoto: true, kycStatus: true, relationshipManager: true,
      twoFactorEnabled: true,
    },
  });

  if (!user) redirect("/login");

  return <ProfileClient user={user as any} />;
}
