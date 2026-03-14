import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let settings = await prisma.systemSettings.findUnique({ where: { id: "singleton" } });
  if (!settings) {
    settings = await prisma.systemSettings.create({
      data: {
        id: "singleton",
        requireEmailConfirmForTransfers: false,
        requireTokenForTransfers: false,
        maintenanceMode: false,
        maxDailyTransferUSD: 10000,
      },
    });
  }

  return NextResponse.json({ settings: { ...settings, maxDailyTransferUSD: Number(settings.maxDailyTransferUSD) } });
}

const patchSchema = z.object({
  requireEmailConfirmForTransfers: z.boolean().optional(),
  requireTokenForTransfers: z.boolean().optional(),
  globalNotice: z.string().max(500).nullable().optional(),
  maintenanceMode: z.boolean().optional(),
  maxDailyTransferUSD: z.number().positive().max(10_000_000).optional(),
});

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 422 });

  const prev = await prisma.systemSettings.findUnique({ where: { id: "singleton" } });

  const settings = await prisma.systemSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...parsed.data, maxDailyTransferUSD: parsed.data.maxDailyTransferUSD ?? 10000 },
    update: parsed.data,
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "ADMIN_UPDATE_SYSTEM_SETTINGS",
      target: "singleton",
      details: { previous: prev, updated: parsed.data },
      ipAddress: req.headers.get("x-forwarded-for") || null,
    },
  });

  return NextResponse.json({ settings: { ...settings, maxDailyTransferUSD: Number(settings.maxDailyTransferUSD) } });
}
