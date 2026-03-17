import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { generateAccountNumber } from "@/lib/utils";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const {
      firstName, lastName, email, phone, password, currency,
      dateOfBirth, gender, nationality,
      addressLine1, addressLine2, city, state, zipCode, country,
      idType, idNumber,
    } = parsed.data;

    // Check email uniqueness
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Generate unique account number
    const accountNumber = await generateAccountNumber(
      async (num) => !(await prisma.account.findUnique({ where: { accountNumber: num } }))
    );

    const _chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const _random6 = Array.from({length: 6}, () => _chars[Math.floor(Math.random() * _chars.length)]).join('');
    const displayId = `BOA${new Date().getFullYear().toString().slice(-2)}${_random6}`;

    // Create user + account in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          passwordHash,
          firstName,
          lastName,
          phone: phone || null,
          role: "USER",
          status: "PENDING_ACTIVATION",
          displayId,
          // Extended profile fields
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
        },
      });

      await tx.account.create({
        data: {
          userId: newUser.id,
          accountNumber,
          currency: currency as any,
          balance: 0,
          status: "ACTIVE",
        },
      });

      await tx.auditLog.create({
        data: {
          userId: newUser.id,
          action: "USER_REGISTERED",
          details: { email, currency, ip: req.headers.get("x-forwarded-for") || "unknown" },
          ipAddress: req.headers.get("x-forwarded-for") || null,
        },
      });

      return newUser;
    });

    // Send welcome email (non-blocking)
    sendWelcomeEmail(email, firstName, accountNumber).catch(console.error);

    return NextResponse.json(
      {
        success: true,
        message:
          "Registration successful. Your account is under review and will be activated within 1-2 business days.",
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[REGISTER]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
