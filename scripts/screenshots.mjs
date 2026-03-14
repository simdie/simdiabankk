import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import { existsSync } from "fs";

const BASE = "http://localhost:3000";
const OUT = "./screenshots";

async function shot(page, name) {
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  console.log(`✓  ${name}`);
}

async function main() {
  if (!existsSync(OUT)) await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  // ── 1. Landing page ──────────────────────────────────────────────────────
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1800);
  await shot(page, "01-landing");

  // ── 2. Login page ─────────────────────────────────────────────────────────
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await shot(page, "02-login");

  // ── 3. Register – Step 0: Personal Info ──────────────────────────────────
  await page.goto(`${BASE}/register`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await shot(page, "03-register-step0-personal");

  await page.fill('input[placeholder="John"]', "Alice");
  await page.fill('input[placeholder="Doe"]', "Chen");
  await page.fill('input[placeholder="+1 555 000 0000"]', "+1 555 123 4567");
  await page.waitForTimeout(500);
  await shot(page, "03-register-step0-filled");

  // ── 4. Step 1: Account Setup (email + currency) ───────────────────────────
  await page.click('button:has-text("Continue")');
  await page.waitForTimeout(1000);
  await shot(page, "04-register-step1-account");

  await page.fill('input[placeholder="you@example.com"]', "alice@example.com");
  // Pick USD currency
  const usdBtn = page.locator('button').filter({ hasText: 'USD' }).first();
  if (await usdBtn.isVisible({ timeout: 2000 }).catch(() => false)) await usdBtn.click();
  await page.waitForTimeout(500);
  await shot(page, "04-register-step1-filled");

  // ── 5. Step 2: Security (password) ────────────────────────────────────────
  await page.click('button:has-text("Continue")');
  await page.waitForTimeout(1000);
  await shot(page, "05-register-step2-security");

  const pwFields = await page.locator('input[type="password"]').all();
  for (const f of pwFields) await f.fill("SecurePass123!");
  await page.waitForTimeout(700);
  await shot(page, "05-register-step2-filled");

  // ── 6. Step 3: Review ─────────────────────────────────────────────────────
  await page.click('button:has-text("Continue")');
  await page.waitForTimeout(800);
  await shot(page, "06-register-step3-review");

  // ── 7. Admin login ────────────────────────────────────────────────────────
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const emailInput = page.locator('input[type="email"]').first();
  await emailInput.fill("admin@bankofasia.com");
  await page.locator('input[type="password"]').first().fill("CHANGE_ME_STRONG_PASSWORD_123!");
  await shot(page, "07-login-admin-credentials");

  await page.click('button[type="submit"]');
  await page.waitForURL(/\/admin/, { timeout: 15000 }).catch(async () => {
    console.log("  (checking current URL):", page.url());
  });
  await page.waitForTimeout(3000);
  await shot(page, "08-admin-command-center");

  // ── 8. Admin users ────────────────────────────────────────────────────────
  await page.goto(`${BASE}/admin/users`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  await shot(page, "09-admin-users");

  // Open first user panel
  const firstRow = page.locator("tbody tr").first();
  if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
    await firstRow.click();
    await page.waitForTimeout(1000);
    await shot(page, "09-admin-users-panel-open");
  }

  // ── 9. Admin deposits ─────────────────────────────────────────────────────
  await page.goto(`${BASE}/admin/deposits`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await shot(page, "10-admin-deposits");

  // Fill search and select user
  await page.fill('input[placeholder*="Search"]', "Alice");
  await page.waitForTimeout(1200);
  await shot(page, "10-admin-deposits-searched");

  // ── 10. Admin transactions ────────────────────────────────────────────────
  await page.goto(`${BASE}/admin/transactions`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await shot(page, "11-admin-transactions");

  // ── 11. Admin settings ────────────────────────────────────────────────────
  await page.goto(`${BASE}/admin/settings`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await shot(page, "12-admin-settings");

  // ── 12. Admin audit log ───────────────────────────────────────────────────
  await page.goto(`${BASE}/admin/audit`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await shot(page, "13-admin-audit");

  // ── 13. Create & activate demo user ───────────────────────────────────────
  const demoEmail = `demo${Date.now()}@bankofasia.com`;
  const regResult = await page.evaluate(async ({ base, email }) => {
    const r = await fetch(`${base}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: "Alice", lastName: "Chen", email,
        password: "DemoPass123!", confirmPassword: "DemoPass123!", currency: "USD",
      }),
    });
    return r.json();
  }, { base: BASE, email: demoEmail });
  console.log("  Register demo user:", regResult.success ? "OK" : regResult.error ?? JSON.stringify(regResult));

  if (regResult.userId) {
    await page.evaluate(async ({ base, id }) => {
      await fetch(`${base}/api/admin/users`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id, action: "SET_STATUS", status: "ACTIVE" }),
      });
    }, { base: BASE, id: regResult.userId });
    console.log("  Activated demo user");

    const userCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const uPage = await userCtx.newPage();

    await uPage.goto(`${BASE}/login`, { waitUntil: "networkidle" });
    await uPage.waitForTimeout(800);
    await uPage.locator('input[type="email"]').first().fill(demoEmail);
    await uPage.locator('input[type="password"]').first().fill("DemoPass123!");
    await uPage.click('button[type="submit"]');
    await uPage.waitForURL(/\/dashboard/, { timeout: 15000 }).catch(() => {});
    await uPage.waitForTimeout(3000);
    await uPage.screenshot({ path: `${OUT}/14-user-dashboard.png`, fullPage: true });
    console.log("✓  14-user-dashboard");

    await uPage.goto(`${BASE}/dashboard/accounts`, { waitUntil: "networkidle" });
    await uPage.waitForTimeout(2000);
    await uPage.screenshot({ path: `${OUT}/15-dashboard-accounts.png`, fullPage: true });
    console.log("✓  15-dashboard-accounts");

    await uPage.goto(`${BASE}/dashboard/transfer`, { waitUntil: "networkidle" });
    await uPage.waitForTimeout(1500);
    await uPage.screenshot({ path: `${OUT}/16-transfer-step1.png`, fullPage: true });
    // Try to click Internal Transfer
    const intBtn = uPage.locator('[data-type="INTERNAL"], button:has-text("Internal Transfer")').first();
    if (await intBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await intBtn.click();
      await uPage.waitForTimeout(800);
      await uPage.screenshot({ path: `${OUT}/16-transfer-step2.png`, fullPage: true });
    }
    console.log("✓  16-transfer-wizard");

    await uPage.goto(`${BASE}/dashboard/cards`, { waitUntil: "networkidle" });
    await uPage.waitForTimeout(2000);
    await uPage.screenshot({ path: `${OUT}/17-virtual-cards.png`, fullPage: true });
    console.log("✓  17-virtual-cards");

    await uPage.goto(`${BASE}/dashboard/transactions`, { waitUntil: "networkidle" });
    await uPage.waitForTimeout(1500);
    await uPage.screenshot({ path: `${OUT}/18-transactions.png`, fullPage: true });
    console.log("✓  18-transactions");

    await uPage.goto(`${BASE}/dashboard/settings`, { waitUntil: "networkidle" });
    await uPage.waitForTimeout(1500);
    await uPage.screenshot({ path: `${OUT}/19-settings.png`, fullPage: true });
    console.log("✓  19-settings");

    await userCtx.close();
  }

  // ── 14. Utility pages ─────────────────────────────────────────────────────
  await page.goto(`${BASE}/maintenance`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await shot(page, "20-maintenance");

  await page.goto(`${BASE}/xyz-not-found-page`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await shot(page, "21-not-found");

  await browser.close();
  console.log("\n✅  All done!");

  const { readdirSync } = await import("fs");
  const files = readdirSync(OUT).filter(f => f.endsWith(".png")).sort();
  console.log(`\n${files.length} files in ./screenshots/:`);
  files.forEach(f => console.log(`  ${f}`));
}

main().catch((e) => { console.error(e); process.exit(1); });
