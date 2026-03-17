import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const ben = await prisma.beneficiary.findFirst({ where: { id, userId: session.user.id } });
  if (!ben) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ beneficiary: ben });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  // Verify ownership
  const existing = await prisma.beneficiary.findFirst({ where: { id, userId: session.user.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const updated = await prisma.beneficiary.update({
    where: { id },
    data: {
      ...(body.name !== undefined      && { name:          body.name }),
      ...(body.bankName !== undefined  && { bankName:      body.bankName }),
      ...(body.iban !== undefined      && { iban:          body.iban || null }),
      ...(body.swiftCode !== undefined && { swiftCode:     body.swiftCode || null }),
      ...(body.country !== undefined   && { country:       body.country }),
      ...(body.accountNumber !== undefined && { accountNumber: body.accountNumber || null }),
      ...(body.routingNumber !== undefined && { routingNumber: body.routingNumber || null }),
      ...(body.bankAddress !== undefined   && { bankAddress:   body.bankAddress || null }),
      ...(body.currency !== undefined      && { currency:      body.currency }),
    },
  });

  return NextResponse.json({ beneficiary: updated });
}
