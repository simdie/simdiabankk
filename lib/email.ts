import nodemailer from "nodemailer";
import type { ReceiptData } from "./receipt";

// Support both SMTP_PASS and EMAIL_PASSWORD env var names
const SMTP_USER_VAL = process.env.SMTP_USER || process.env.EMAIL_FROM || "";
const SMTP_PASS_VAL = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD || "";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true" || Number(process.env.SMTP_PORT) === 465,
  auth: { user: SMTP_USER_VAL, pass: SMTP_PASS_VAL },
  tls: { rejectUnauthorized: false },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

const FROM = `"Bank of Asia Online" <${SMTP_USER_VAL}>`;
const SUPPORT = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@bankofasia.com";
const BASE_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

// ─── Shared wrapper ───────────────────────────────────────────────────────────
function wrap(accentColor: string, content: string, title: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#03050a;font-family:'DM Sans',Arial,sans-serif;color:#f0f4ff;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 16px;">
      <table width="100%" style="max-width:560px;background:linear-gradient(160deg,#060c18,#0d1a30);border:1px solid rgba(255,255,255,0.07);border-radius:18px;overflow:hidden;">
        <!-- Top accent bar -->
        <tr><td height="5" style="background:${accentColor};font-size:0;">&nbsp;</td></tr>
        <!-- Logo header -->
        <tr><td style="padding:30px 36px 22px;border-bottom:1px solid rgba(255,255,255,0.06);">
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="width:36px;height:36px;background:rgba(240,180,41,0.1);border:1px solid rgba(240,180,41,0.3);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;">◈</div>
            <div>
              <div style="font-size:16px;font-weight:800;letter-spacing:1px;color:#F0B429;">BANK OF ASIA ONLINE</div>
              <div style="font-size:10px;color:#4d6080;letter-spacing:2px;text-transform:uppercase;">Secure Banking System</div>
            </div>
          </div>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px 36px;">${content}</td></tr>
        <!-- Footer -->
        <tr><td style="padding:20px 36px;border-top:1px solid rgba(255,255,255,0.05);">
          <p style="color:#4d6080;font-size:11px;margin:0;line-height:1.7;">
            This is an automated message from Bank of Asia Online. Do not reply to this email.<br/>
            If you did not perform this action, contact us at <a href="mailto:${SUPPORT}" style="color:#00d4ff;">${SUPPORT}</a><br/>
            © ${new Date().getFullYear()} Bank of Asia Online. All rights reserved.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── 1. Registration confirmation (pending) ───────────────────────────────────
export function welcomeEmailHtml(firstName: string): string {
  const content = `
    <h1 style="font-size:22px;font-weight:700;color:#f0f4ff;margin:0 0 10px;">Welcome, ${firstName}!</h1>
    <p style="color:#8899b5;line-height:1.7;margin:0 0 22px;">Your account application has been received and is currently under review. Our compliance team typically activates accounts within 1–2 business days.</p>
    <div style="background:rgba(0,0,0,0.3);border-radius:12px;padding:20px 22px;margin:0 0 22px;">
      ${["Registration Received|Your application is in queue|#00e5a0|✓",
        "Under Review|Our team is verifying your information|#F0B429|2",
        "Account Activated|You will be notified when ready|rgba(255,255,255,0.12)|3",
      ].map((item) => {
        const [t, s, c, n] = item.split("|");
        return `<div style="display:flex;align-items:center;gap:14px;margin-bottom:14px;">
          <div style="width:28px;height:28px;border-radius:50%;background:${c};flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#03050a;">${n}</div>
          <div>
            <div style="font-weight:600;font-size:14px;color:#f0f4ff;">${t}</div>
            <div style="font-size:12px;color:#4d6080;">${s}</div>
          </div>
        </div>`;
      }).join("")}
    </div>
    <p style="color:#8899b5;font-size:13px;line-height:1.6;margin:0;">You will receive another email once your account is activated.</p>`;
  return wrap("#00D4FF", content, "Welcome to Bank of Asia Online");
}

// ─── 2. Account activation ────────────────────────────────────────────────────
export function activationEmailHtml(firstName: string, accountNumber: string, currency: string): string {
  const content = `
    <div style="text-align:center;margin-bottom:26px;">
      <div style="width:64px;height:64px;background:rgba(0,229,160,0.1);border:2px solid rgba(0,229,160,0.3);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:28px;">✓</div>
    </div>
    <h1 style="font-size:22px;font-weight:700;color:#f0f4ff;margin:0 0 8px;text-align:center;">Account Activated, ${firstName}!</h1>
    <p style="color:#8899b5;line-height:1.7;margin:0 0 26px;text-align:center;">Your Bank of Asia Online account has been reviewed and is now fully active. You can log in and start banking immediately.</p>
    <div style="background:rgba(0,229,160,0.06);border:1px solid rgba(0,229,160,0.18);border-radius:12px;padding:18px 22px;margin:0 0 26px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
        <span style="font-size:12px;color:#8899b5;">Account Number</span>
        <span style="font-family:monospace;font-size:13px;font-weight:700;color:#f0f4ff;">${accountNumber}</span>
      </div>
      <div style="display:flex;justify-content:space-between;">
        <span style="font-size:12px;color:#8899b5;">Primary Currency</span>
        <span style="font-size:13px;font-weight:700;color:#00e5a0;">${currency}</span>
      </div>
    </div>
    <div style="text-align:center;margin-bottom:26px;">
      <a href="${BASE_URL}/login" style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#00e5a0,#00b87a);color:#03050a;font-weight:800;font-size:15px;text-decoration:none;border-radius:12px;letter-spacing:0.3px;">Log In Now →</a>
    </div>
    <div style="background:rgba(0,0,0,0.25);border-radius:10px;padding:16px 18px;">
      <div style="font-size:11px;font-weight:700;color:#4d6080;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;">Security Tips</div>
      ${["Never share your password or OTP with anyone",
        "Enable 2FA from Settings for maximum protection",
        "Always verify transfer details before confirming",
        "Log out from shared or public devices",
      ].map(tip => `<div style="font-size:12px;color:#8899b5;margin-bottom:6px;">• ${tip}</div>`).join("")}
    </div>`;
  return wrap("#00E5A0", content, "Your Bank of Asia Online Account is Active");
}

// ─── 3. Transfer email confirmation ──────────────────────────────────────────
export function transferConfirmEmailHtml(opts: {
  firstName: string;
  amount: string;
  currency: string;
  recipientName?: string;
  recipientAccount?: string;
  reference: string;
  confirmUrl: string;
  cancelUrl: string;
}): string {
  const { firstName, amount, currency, recipientName, recipientAccount, reference, confirmUrl, cancelUrl } = opts;
  const content = `
    <div style="background:#F0B429;border-radius:10px;padding:14px 18px;margin-bottom:24px;display:flex;align-items:center;gap:12px;">
      <span style="font-size:22px;">⚠</span>
      <div>
        <div style="font-weight:800;font-size:15px;color:#03050a;">ACTION REQUIRED</div>
        <div style="font-size:12px;color:rgba(3,5,10,0.7);">You must confirm this transfer to proceed</div>
      </div>
    </div>
    <h1 style="font-size:20px;font-weight:700;color:#f0f4ff;margin:0 0 8px;">Confirm Your Transfer, ${firstName}</h1>
    <p style="color:#8899b5;line-height:1.7;margin:0 0 22px;">A transfer has been initiated from your account. Please review the details and click the confirmation button to authorize this transaction.</p>
    <div style="background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:18px 22px;margin-bottom:24px;">
      ${[
        ["Amount", `<strong style="color:#f0f4ff;">${amount} ${currency}</strong>`],
        recipientName ? ["Recipient", recipientName] : null,
        recipientAccount ? ["To Account", `<span style="font-family:monospace;">****${recipientAccount.slice(-4)}</span>`] : null,
        ["Reference", `<span style="font-family:monospace;font-size:12px;color:#00d4ff;">${reference}</span>`],
        ["Link Expires", "30 minutes from when this email was sent"],
      ].filter(Boolean).map(([l, v]: any) =>
        `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
          <span style="font-size:12px;color:#8899b5;">${l}</span>
          <span style="font-size:13px;color:#8899b5;">${v}</span>
        </div>`
      ).join("")}
    </div>
    <div style="text-align:center;margin-bottom:18px;">
      <a href="${confirmUrl}" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#00e5a0,#00b87a);color:#03050a;font-weight:800;font-size:15px;text-decoration:none;border-radius:12px;letter-spacing:0.3px;">✓ CONFIRM TRANSFER</a>
    </div>
    <div style="background:rgba(255,59,92,0.07);border:1px solid rgba(255,59,92,0.2);border-radius:10px;padding:14px 18px;margin-bottom:18px;">
      <div style="font-size:13px;color:#ff3b5c;font-weight:700;margin-bottom:4px;">⚠ DO NOT click if you did not initiate this</div>
      <div style="font-size:12px;color:#8899b5;line-height:1.6;">If you did not request this transfer, your account may be compromised. Cancel it immediately and contact support.</div>
    </div>
    <div style="text-align:center;">
      <a href="${cancelUrl}" style="font-size:12px;color:#ff3b5c;text-decoration:underline;">Cancel this transfer</a>
    </div>`;
  return wrap("#F0B429", content, "Confirm Your Transfer — Bank of Asia Online");
}

// ─── 4. Transaction receipt email ─────────────────────────────────────────────
export function transactionReceiptEmailHtml(data: ReceiptData & {
  recipientName?: string;
  senderName?: string;
}): string {
  const isCredit = !data.sender || (data.receiver && !data.sender);
  const statusColors: Record<string, string> = {
    COMPLETED: "#00e5a0", FAILED: "#ff3b5c", PENDING: "#F0B429",
    AWAITING_CONFIRMATION: "#F0B429",
  };
  const sc = statusColors[data.status] ?? "#8899b5";
  const formattedAmount = new Intl.NumberFormat("en-US", { style: "currency", currency: data.currency, minimumFractionDigits: 2 }).format(data.amount);
  const txDate = new Date(data.createdAt).toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
  const content = `
    <h1 style="font-size:20px;font-weight:700;color:#f0f4ff;margin:0 0 6px;">Transaction ${data.status === "COMPLETED" ? "Completed" : "Receipt"}</h1>
    <p style="color:#8899b5;font-size:13px;margin:0 0 24px;">${txDate}</p>
    <!-- Amount card -->
    <div style="background:linear-gradient(135deg,rgba(240,180,41,0.08),rgba(0,212,255,0.05));border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:24px;text-align:center;margin-bottom:22px;">
      <div style="font-size:11px;color:#8899b5;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Amount</div>
      <div style="font-size:36px;font-weight:800;color:#f0f4ff;">${formattedAmount}</div>
      <div style="font-size:13px;color:${sc};margin-top:8px;font-weight:700;letter-spacing:1px;">● ${data.status.replace(/_/g, " ")}</div>
    </div>
    <!-- Details -->
    <div style="background:rgba(0,0,0,0.25);border-radius:12px;padding:16px 18px;margin-bottom:22px;">
      ${[
        ["Reference", `<span style="font-family:monospace;font-size:12px;color:#00d4ff;">${data.reference}</span>`],
        ["Type", data.type.replace(/_/g, " ")],
        data.sender ? ["From", `${data.sender.name} · ****${data.sender.accountNumber.slice(-4)}`] : null,
        data.receiver ? ["To", `${data.receiver.name} · ****${data.receiver.accountNumber.slice(-4)}`] : null,
        data.description ? ["Description", data.description] : null,
      ].filter(Boolean).map(([l, v]: any) =>
        `<div style="display:flex;justify-content:space-between;align-items:flex-start;padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
          <span style="font-size:12px;color:#8899b5;min-width:100px;">${l}</span>
          <span style="font-size:12px;color:#f0f4ff;text-align:right;max-width:280px;">${v}</span>
        </div>`
      ).join("")}
    </div>
    <div style="text-align:center;margin-bottom:8px;">
      <a href="${BASE_URL}/dashboard/transactions" style="display:inline-block;padding:13px 32px;background:rgba(0,212,255,0.1);border:1px solid rgba(0,212,255,0.3);color:#00d4ff;font-weight:700;font-size:14px;text-decoration:none;border-radius:12px;">View in Dashboard →</a>
    </div>
    <p style="font-size:11px;color:#4d6080;text-align:center;margin:16px 0 0;">A PDF receipt is attached to this email.</p>`;
  return wrap("#00D4FF", content, `Transaction Receipt — ${data.reference}`);
}

// ─── 5. Restriction notification ─────────────────────────────────────────────
export function restrictionEmailHtml(firstName: string, message?: string): string {
  const content = `
    <div style="background:rgba(255,59,92,0.1);border:1px solid rgba(255,59,92,0.3);border-radius:12px;padding:18px 22px;margin-bottom:24px;">
      <div style="display:flex;align-items:center;gap:12px;">
        <span style="font-size:28px;">⊘</span>
        <div>
          <div style="font-size:16px;font-weight:700;color:#ff3b5c;">Account Restricted</div>
          <div style="font-size:12px;color:#8899b5;margin-top:2px;">Action required to restore access</div>
        </div>
      </div>
    </div>
    <h1 style="font-size:20px;font-weight:700;color:#f0f4ff;margin:0 0 12px;">Important Notice, ${firstName}</h1>
    <p style="color:#8899b5;line-height:1.7;margin:0 0 18px;">Your Bank of Asia Online account has been placed under a temporary restriction. You will not be able to perform transactions until this restriction is lifted.</p>
    ${message ? `<div style="background:rgba(0,0,0,0.3);border-left:3px solid #ff3b5c;padding:14px 18px;border-radius:0 8px 8px 0;margin-bottom:18px;"><div style="font-size:13px;color:#f0f4ff;line-height:1.6;">${message}</div></div>` : ""}
    <p style="color:#8899b5;line-height:1.7;margin:0 0 22px;">If you believe this is an error or need assistance, please contact our support team immediately.</p>
    <div style="text-align:center;">
      <a href="mailto:${SUPPORT}" style="display:inline-block;padding:13px 32px;background:rgba(255,59,92,0.1);border:1px solid rgba(255,59,92,0.3);color:#ff3b5c;font-weight:700;font-size:14px;text-decoration:none;border-radius:12px;">Contact Support</a>
    </div>`;
  return wrap("#FF3B5C", content, "Account Restricted — Bank of Asia Online");
}

// ─── Send helpers ─────────────────────────────────────────────────────────────
export async function sendEmail(to: string, subject: string, html: string, attachments?: any[]) {
  await transporter.sendMail({ from: FROM, to, subject, html, attachments });
}

export async function sendReceiptEmail(to: string, data: ReceiptData & { recipientName?: string; senderName?: string }) {
  const html = transactionReceiptEmailHtml(data);
  // Generate PDF
  let attachments: any[] = [];
  try {
    const { generateReceiptPDF } = await import("./receipt");
    const pdfBuffer = await generateReceiptPDF(data);
    attachments = [{
      filename: `receipt-${data.reference}.pdf`,
      content: pdfBuffer,
      contentType: "application/pdf",
    }];
  } catch { /* PDF generation is non-blocking */ }

  await sendEmail(to, `Transaction Receipt — ${data.reference}`, html, attachments);
}

export async function sendActivationEmail(to: string, firstName: string, accountNumber: string, currency: string) {
  await sendEmail(to, "Your Bank of Asia Online Account is Now Active", activationEmailHtml(firstName, accountNumber, currency));
}

export async function sendRestrictionEmail(to: string, firstName: string, message?: string) {
  await sendEmail(to, "Important: Your Bank of Asia Online Account Has Been Restricted", restrictionEmailHtml(firstName, message));
}

export async function sendTransferConfirmEmail(to: string, opts: Parameters<typeof transferConfirmEmailHtml>[0]) {
  await sendEmail(to, "ACTION REQUIRED: Confirm Your Transfer", transferConfirmEmailHtml(opts));
}

// ─── 6. Password reset ────────────────────────────────────────────────────────
export function passwordResetEmailHtml(firstName: string, resetUrl: string): string {
  const content = `
    <div style="text-align:center;margin-bottom:28px;">
      <div style="width:64px;height:64px;background:rgba(0,212,255,0.08);border:2px solid rgba(0,212,255,0.25);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:26px;">🔑</div>
    </div>
    <h1 style="font-size:22px;font-weight:700;color:#f0f4ff;margin:0 0 10px;text-align:center;">Password Reset Request</h1>
    <p style="color:#8899b5;line-height:1.7;margin:0 0 8px;text-align:center;">Hello${firstName ? `, ${firstName}` : ""},</p>
    <p style="color:#8899b5;line-height:1.7;margin:0 0 26px;text-align:center;">
      We received a request to reset the password for your Bank of Asia Online account. Click the secure button below to set a new password. This link is valid for <strong style="color:#f0f4ff;">1 hour</strong>.
    </p>
    <div style="text-align:center;margin-bottom:28px;">
      <a href="${resetUrl}" style="display:inline-block;padding:15px 44px;background:linear-gradient(135deg,#00D4FF,#0088CC);color:#03050a;font-weight:800;font-size:15px;text-decoration:none;border-radius:12px;letter-spacing:0.3px;">
        Reset My Password →
      </a>
    </div>
    <div style="background:rgba(0,0,0,0.25);border-radius:10px;padding:16px 18px;margin-bottom:22px;">
      <div style="font-size:11px;font-weight:700;color:#4d6080;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;">Security Notice</div>
      ${[
        "This link expires in 1 hour for your protection",
        "If you did not request this, ignore this email — your password will not change",
        "Never share this link with anyone, including Bank of Asia Online staff",
        "Contact support immediately if you did not initiate this request",
      ].map(tip => `<div style="font-size:12px;color:#8899b5;margin-bottom:6px;">• ${tip}</div>`).join("")}
    </div>
    <p style="font-size:11px;color:#4d6080;text-align:center;margin:0;">
      Or copy and paste this URL into your browser:<br/>
      <span style="color:#00d4ff;word-break:break-all;font-size:10px;">${resetUrl}</span>
    </p>`;
  return wrap("#00D4FF", content, "Reset Your Bank of Asia Online Password");
}

export async function sendPasswordResetEmail(to: string, firstName: string, resetUrl: string) {
  await sendEmail(to, "Reset Your Bank of Asia Online Password", passwordResetEmailHtml(firstName, resetUrl));
}

// ─── SMTP health check ────────────────────────────────────────────────────────
export async function verifySmtpConnection(): Promise<{ ok: boolean; error?: string }> {
  try {
    await transporter.verify();
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}
