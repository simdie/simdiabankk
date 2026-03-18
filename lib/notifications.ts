import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

// ── Telegram ────────────────────────────────────────────────────────────────
async function sendTelegramMessage(message: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  try {
    // Dynamic import to avoid issues if package not available
    const TelegramBot = (await import("node-telegram-bot-api")).default;
    const bot = new TelegramBot(token);
    await bot.sendMessage(chatId, message, { parse_mode: "HTML" });
  } catch (err) {
    console.error("[TELEGRAM]", err);
  }
}

// ── Admin Notification (DB) ──────────────────────────────────────────────────
export async function createAdminNotification(type: string, title: string, message: string, data: Record<string, unknown> = {}) {
  try {
    await prisma.adminNotification.create({
      data: { type, title, message, data: data as any },
    });
  } catch (err) {
    console.error("[ADMIN_NOTIFICATION]", err);
  }
}

// ── User Notification (DB + optional email) ──────────────────────────────────
export async function createUserNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  options?: { sendEmailNotification?: boolean; email?: string; emailSubject?: string }
) {
  try {
    await prisma.userNotification.create({
      data: { userId, type, title, message },
    });

    if (options?.sendEmailNotification && options.email) {
      const html = `
        <div style="background:#03050a;padding:36px;font-family:sans-serif;max-width:520px;margin:0 auto;border-radius:14px;border:1px solid rgba(0,212,255,0.15)">
          <div style="text-align:center;margin-bottom:24px">
            <div style="font-size:20px;font-weight:800;color:#00D4FF;letter-spacing:2px">BANK OF ASIA</div>
          </div>
          <h2 style="color:#f0f4ff;font-size:18px;margin-bottom:8px">${title}</h2>
          <p style="color:#9ca3af;font-size:14px;line-height:1.6">${message}</p>
          <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:24px 0"/>
          <p style="color:#4b5563;font-size:11px">Bank of Asia Online · Secure Digital Banking</p>
        </div>
      `;
      await sendEmail(options.email, options.emailSubject || title, html).catch(console.error);
    }
  } catch (err) {
    console.error("[USER_NOTIFICATION]", err);
  }
}

// ── Transfer notification ─────────────────────────────────────────────────────
export async function notifyTransfer(opts: {
  senderName: string;
  receiverName?: string;
  amount: number;
  currency: string;
  type: string;
  reference: string;
  senderUserId: string;
  status?: string;
}) {
  const { senderName, receiverName, amount, currency, type, reference, senderUserId, status } = opts;
  const txStatus = status || "PENDING";
  const formattedAmount = new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  const msg = `💸 <b>New Payment — ${txStatus}</b>\n👤 Sender: ${senderName}\n💰 Amount: ${formattedAmount}\n📋 Type: ${type.replace(/_/g, " ")}\n🔖 Ref: ${reference}\n⏰ Action required: Review &amp; approve in admin panel`;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminEmailHtml = `
    <div style="background:#fff;padding:40px;font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border-radius:8px;border:1px solid #e5e7eb">
      <div style="text-align:center;margin-bottom:28px">
        <div style="font-size:22px;font-weight:800;color:#0066AA;letter-spacing:1px">BANK OF ASIA</div>
        <div style="font-size:12px;color:#6b7280;margin-top:4px">Admin Notification</div>
      </div>
      <div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;padding:16px;margin-bottom:24px">
        <div style="font-weight:700;color:#92400e;margin-bottom:6px">⚠️ New Payment Requires Review</div>
        <div style="font-size:14px;color:#78350f">A payment has been initiated and is awaiting admin approval.</div>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        ${[["Sender", senderName],["Amount", formattedAmount],["Currency", currency],["Type", type.replace(/_/g," ")],["Reference", reference],["Status", txStatus],["Receiver", receiverName || "External"]].map(([l,v]) => `
        <tr style="border-bottom:1px solid #f3f4f6">
          <td style="padding:10px 14px;font-size:13px;color:#6b7280;font-weight:600;width:140px">${l}</td>
          <td style="padding:10px 14px;font-size:13px;color:#111;font-weight:500">${v}</td>
        </tr>`).join("")}
      </table>
      <div style="text-align:center;margin-bottom:20px">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://www.boasiaonline.com"}/admin/transactions" style="display:inline-block;background:#0066AA;color:#fff;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px">
          Review in Admin Panel →
        </a>
      </div>
      <hr style="border:none;border-top:1px solid #f3f4f6;margin:20px 0"/>
      <p style="color:#9ca3af;font-size:11px;text-align:center">Bank of Asia Online · Admin System · Do not reply to this email</p>
    </div>
  `;

  await Promise.all([
    sendTelegramMessage(msg),
    createAdminNotification(
      "NEW_TRANSFER",
      `New Payment: ${formattedAmount} from ${senderName}`,
      `${senderName} sent ${formattedAmount} (${type.replace(/_/g," ")}) — Ref: ${reference} — Status: ${txStatus}`,
      { senderName, receiverName, amount, currency, type, reference, senderUserId, status: txStatus }
    ),
    adminEmail ? sendEmail(adminEmail, `[ACTION REQUIRED] New Payment — ${formattedAmount} — ${reference}`, adminEmailHtml).catch(() => {}) : Promise.resolve(),
  ]);
}
