import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true, firstName: true, lastName: true, email: true, phone: true,
      role: true, status: true, createdAt: true, twoFactorEnabled: true,
      dateOfBirth: true, gender: true, nationality: true,
      addressLine1: true, addressLine2: true, city: true,
      state: true, zipCode: true, country: true,
      idType: true, idNumber: true, idExpiry: true,
      profilePhoto: true, kycStatus: true, relationshipManager: true,
    },
  });

  return NextResponse.json({ user });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const { phone } = body;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      phone: phone || null,
    },
  });

  return NextResponse.json({ success: true });
}
