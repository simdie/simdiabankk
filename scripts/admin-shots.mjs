import { chromium } from "playwright";
import { existsSync, mkdirSync } from "fs";

const BASE = "http://localhost:3000";
const OUT = "./screenshots";
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

async function shot(page, name) {
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  console.log(`✓  ${name}`);
}

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

// Login as admin
await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.locator('input[type="email"]').first().fill("admin@bankofasia.com");
await page.locator('input[type="password"]').first().fill("CHANGE_ME_STRONG_PASSWORD_123!");
await page.click('button[type="submit"]');
await page.waitForURL(/\/admin/, { timeout: 15000 }).catch(() => console.log("URL:", page.url()));
await page.waitForTimeout(3000);
await shot(page, "08-admin-command-center");

await page.goto(`${BASE}/admin/users`, { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
await shot(page, "09-admin-users");

// Open user panel
const row = page.locator("tbody tr").first();
if (await row.isVisible({ timeout: 3000 }).catch(() => false)) {
  await row.click(); await page.waitForTimeout(1000);
  await shot(page, "09-admin-users-panel-open");
}

await page.goto(`${BASE}/admin/deposits`, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await shot(page, "10-admin-deposits");

await page.fill('input[placeholder*="Search by name"]', "alice");
await page.waitForTimeout(1200);
await shot(page, "10-admin-deposits-user-search");

await page.goto(`${BASE}/admin/transactions`, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await shot(page, "11-admin-transactions");

await page.goto(`${BASE}/admin/settings`, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await shot(page, "12-admin-settings");

await page.goto(`${BASE}/admin/audit`, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await shot(page, "13-admin-audit");

// Expand first audit log entry
const firstEntry = page.locator('[style*="cursor: pointer"]').first();
if (await firstEntry.isVisible({ timeout: 2000 }).catch(() => false)) {
  await firstEntry.click(); await page.waitForTimeout(600);
  await shot(page, "13-admin-audit-expanded");
}

await browser.close();
console.log("\n✅  Admin screenshots done");
