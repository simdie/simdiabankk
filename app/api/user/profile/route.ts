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

  const {
    firstName, lastName, phone, dateOfBirth, gender, nationality,
    addressLine1, addressLine2, city, state, zipCode, country,
    idType, idNumber, idExpiry,
  } = body;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      phone: phone || null,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      gender: gender || null,
      nationality: nationality || null,
      addressLine1: addressLine1 || null,
      addressLine2: addressLine2 || null,
      city: city || null,
      state: state || null,
      zipCode: zipCode || null,
      country: country || null,
      idType: idType || null,
      idNumber: idNumber || null,
      idExpiry: idExpiry ? new Date(idExpiry) : null,
    },
  });

  return NextResponse.json({ success: true });
}
