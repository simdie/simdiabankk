import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log("🌱  Seeding Bank of Asia...\n");

  // ── 1. System settings singleton ─────────────────────────────────────────
  const settings = await prisma.systemSettings.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      requireEmailConfirmForTransfers: false,
      requireTokenForTransfers: false,
      maintenanceMode: false,
      maxDailyTransferUSD: 50000,
      globalNotice: null,
    },
    update: {},
  });
  console.log("✓  SystemSettings singleton ready");

  // ── 2. Admin user ─────────────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL ?? process.env.SMTP_USER ?? "admin@bankofasia.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@BankOfAsia2025!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      passwordHash,
      firstName: "System",
      lastName: "Administrator",
      role: "ADMIN",
      status: "ACTIVE",
    },
    update: {
      role: "ADMIN",
      status: "ACTIVE",
    },
  });
  console.log(`✓  Admin user: ${admin.email}`);

  // ── 3. Admin USD account ──────────────────────────────────────────────────
  const accountNumber = "000000000001";
  const adminAccount = await prisma.account.upsert({
    where: { accountNumber },
    create: {
      userId: admin.id,
      accountNumber,
      currency: "USD",
      balance: 0,
      status: "ACTIVE",
    },
    update: {},
  });
  console.log(`✓  Admin account: ${adminAccount.accountNumber} (${adminAccount.currency})`);

  // ── 4. Seed audit log ─────────────────────────────────────────────────────
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: "SYSTEM_SEED",
      target: "database",
      details: { message: "Database seeded successfully", timestamp: new Date().toISOString() },
      ipAddress: "127.0.0.1",
    },
  });
  console.log("✓  Seed audit log created\n");

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log("═══════════════════════════════════════════════════════");
  console.log("  BANK OF ASIA — SEED COMPLETE");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`  Admin Email:    ${adminEmail}`);
  console.log(`  Admin Password: ${adminPassword}`);
  console.log(`  Admin Account:  ${accountNumber} (USD)`);
  console.log(`  App URL:        http://localhost:3000`);
  console.log(`  Admin Panel:    http://localhost:3000/admin`);
  console.log("═══════════════════════════════════════════════════════\n");
}

main()
  .catch((e) => { console.error("Seed failed:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
