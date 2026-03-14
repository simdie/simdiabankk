import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const beneficiaries = await prisma.beneficiary.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ beneficiaries });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.bankName) {
    return NextResponse.json({ error: "Name and bank name are required" }, { status: 400 });
  }

  const beneficiary = await prisma.beneficiary.create({
    data: {
      userId: session.user.id,
      name: body.name,
      bankName: body.bankName,
      accountNumber: body.accountNumber || null,
      iban: body.iban || null,
      swiftCode: body.swiftCode || null,
      routingNumber: body.routingNumber || null,
      country: body.country || "US",
      currency: body.currency || "USD",
      bankAddress: body.bankAddress || null,
      isInternal: body.isInternal || false,
    },
  });

  return NextResponse.json({ beneficiary }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await prisma.beneficiary.deleteMany({
    where: { id, userId: session.user.id },
  });

  return NextResponse.json({ success: true });
}
