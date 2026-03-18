// ─── Constants ────────────────────────────────────────────────────────────────

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.boasiaonline.com";
const EMAIL_LOGO = "https://i.imgur.com/KKzsZal.png";

// ─── Layout wrapper ───────────────────────────────────────────────────────────

function wrap(content: string, preheader = ""): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bank of Asia Online</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
${preheader ? `<div style="display:none;font-size:1px;line-height:1px;max-height:0;overflow:hidden;mso-hide:all;color:#f4f4f5">${preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>` : ""}
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f5">
<tr><td align="center" style="padding:40px 16px">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;border:1px solid #e4e4e7">
<!-- Header -->
<tr><td align="center" style="background:#0a1628;padding:28px 40px 24px;border-radius:8px 8px 0 0;border-bottom:3px solid #00c896">
<!--[if !mso]><!-->
<img src="${EMAIL_LOGO}" alt="Bank of Asia Online" width="200" height="auto" style="display:block;margin:0 auto;width:200px;max-width:200px;height:auto;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" />
<!--<![endif]-->
<!--[if mso]><div style="font-family:Georgia,serif;font-size:22px;font-weight:700;letter-spacing:0.1em;text-align:center;color:#FFFFFF">BANK OF <span style="color:#00C896">ASIA</span> ONLINE</div><![endif]-->
</td></tr>
<!-- Body -->
<tr><td style="padding:40px 40px 32px">
${content}
</td></tr>
<!-- Footer -->
<tr><td style="background:#fafafa;border-top:1px solid #e4e4e7;padding:24px 40px;text-align:center">
<p style="color:#a1a1aa;font-size:12px;margin:3px 0;font-family:Arial,sans-serif">Bank of Asia Online &middot; 123 Financial District &middot; Singapore 048946</p>
<p style="color:#a1a1aa;font-size:12px;margin:3px 0;font-family:Arial,sans-serif">
<a href="${SITE}" style="color:#a1a1aa;text-decoration:underline">www.boasiaonline.com</a>&nbsp;&middot;&nbsp;<a href="mailto:support@boasiaonline.com" style="color:#a1a1aa;text-decoration:underline">support@boasiaonline.com</a>
</p>
</td></tr>
<!-- Bottom bar -->
<tr><td style="background:#0d1b3e;padding:14px 40px;text-align:center;border-radius:0 0 8px 8px">
<p style="color:#4b5563;font-size:11px;margin:2px 0;font-family:Arial,sans-serif">&copy; 2026 Bank of Asia Online. All rights reserved.</p>
<p style="font-size:11px;margin:2px 0;font-family:Arial,sans-serif">
<a href="${SITE}/privacy" style="color:#4b5563;text-decoration:none">Privacy Policy</a>&nbsp;&middot;&nbsp;<a href="${SITE}/terms" style="color:#4b5563;text-decoration:none">Terms of Service</a>&nbsp;&middot;&nbsp;<a href="${SITE}/security" style="color:#4b5563;text-decoration:none">Security</a>
</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

// ─── Helper components ─────────────────────────────────────────────────────────

/** Two-column data table row */
function row(label: string, value: string, last = false): string {
  const border = last ? "" : "border-bottom:1px solid #f0f0f0;";
  return `<tr>
<td style="padding:11px 0;${border}color:#71717a;font-size:13px;font-family:Arial,sans-serif;width:42%;vertical-align:top">${label}</td>
<td style="padding:11px 0;${border}color:#18181b;font-size:13px;font-family:Arial,sans-serif;text-align:right;font-weight:500;vertical-align:top">${value}</td>
</tr>`;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$", GBP: "£", EUR: "€", AUD: "A$",
  CAD: "C$", CHF: "Fr", JPY: "¥", CNY: "¥",
  AED: "د.إ", SGD: "S$", HKD: "HK$", NZD: "NZ$",
};

/** Prominent centered amount display */
function amountBlock(amount: string, currency: string, label = "Amount"): string {
  const s = CURRENCY_SYMBOLS[currency] ?? "";
  const amt = Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `<div style="background:#f0fdf9;border:1px solid #d1fae5;border-radius:8px;padding:28px;text-align:center;margin:24px 0">
<div style="font-size:11px;color:#71717a;letter-spacing:0.1em;margin-bottom:8px;font-family:Arial,sans-serif">${label.toUpperCase()}</div>
<div style="font-size:36px;font-weight:700;color:#064e3b;font-family:'Courier New',Courier,monospace;letter-spacing:-0.5px">${s}${amt} ${currency}</div>
</div>`;
}

/** Inline status badge */
function badge(status: string): string {
  const map: Record<string, { bg: string; color: string; border: string }> = {
    COMPLETED:             { bg: "#f0fdf9", color: "#065f46", border: "#a7f3d0" },
    ACTIVE:                { bg: "#f0fdf9", color: "#065f46", border: "#a7f3d0" },
    PENDING:               { bg: "#fffbeb", color: "#92400e", border: "#fde68a" },
    AWAITING_CONFIRMATION: { bg: "#eff6ff", color: "#1e40af", border: "#bfdbfe" },
    FAILED:                { bg: "#fef2f2", color: "#991b1b", border: "#fecaca" },
    RESTRICTED:            { bg: "#fef2f2", color: "#991b1b", border: "#fecaca" },
    SUSPENDED:             { bg: "#fef2f2", color: "#991b1b", border: "#fecaca" },
    DISABLED:              { bg: "#f9fafb", color: "#374151", border: "#d1d5db" },
  };
  const style = map[status] ?? { bg: "#f9fafb", color: "#374151", border: "#d1d5db" };
  return `<span style="display:inline-block;background:${style.bg};color:${style.color};border:1px solid ${style.border};padding:4px 14px;border-radius:100px;font-size:11px;font-weight:700;letter-spacing:0.06em;font-family:Arial,sans-serif">${status.replace(/_/g, " ")}</span>`;
}

/** Red security warning box */
function securityWarning(msg: string): string {
  return `<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:6px;padding:14px 18px;margin:20px 0">
<p style="color:#991b1b;font-size:13px;margin:0;font-family:Arial,sans-serif">&#9888;&#xFE0E; ${msg}</p>
</div>`;
}

/** Centered CTA button */
function ctaButton(text: string, url: string, color = "#00875a"): string {
  return `<div style="text-align:center;margin:28px 0">
<a href="${url}" style="display:inline-block;background:${color};color:#ffffff;padding:14px 36px;border-radius:6px;font-size:15px;font-weight:600;text-decoration:none;font-family:Arial,sans-serif">${text}</a>
</div>`;
}

// ─── 1. Registration pending ───────────────────────────────────────────────────

export function tmplRegistrationPending(d: {
  firstName: string;
  accountNumber: string;
  currency: string;
}): string {
  return wrap(`
<h2 style="color:#18181b;margin:0 0 8px;font-size:22px;font-weight:700;font-family:Arial,sans-serif">Welcome to Bank of Asia Online</h2>
<p style="color:#71717a;margin:0 0 28px;font-size:14px;line-height:1.7;font-family:Arial,sans-serif">
Hello ${d.firstName}, your application has been received and is currently under review. Our compliance team will verify and activate your account within 24 hours.
</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e4e4e7;border-radius:8px;margin-bottom:24px">
<tr><td style="padding:20px 24px">
<p style="color:#a1a1aa;font-size:11px;letter-spacing:0.1em;margin:0 0 4px;font-family:Arial,sans-serif">ACCOUNT NUMBER</p>
<p style="color:#18181b;font-size:17px;font-weight:700;font-family:'Courier New',Courier,monospace;margin:0 0 16px;letter-spacing:0.05em">${d.accountNumber}</p>
<p style="color:#a1a1aa;font-size:11px;letter-spacing:0.1em;margin:0 0 4px;font-family:Arial,sans-serif">PRIMARY CURRENCY</p>
<p style="color:#18181b;font-size:14px;font-weight:500;margin:0;font-family:Arial,sans-serif">${d.currency}</p>
</td></tr>
</table>
${securityWarning("If you did not create this account, contact <strong>security@boasiaonline.com</strong> immediately.")}`,
    `Your Bank of Asia Online account is pending review, ${d.firstName}.`);
}

// ─── 2. Account activated ──────────────────────────────────────────────────────

export function tmplAccountActivated(d: {
  firstName: string;
  accountNumber: string;
  currency: string;
}): string {
  return wrap(`
<div style="background:#f0fdf9;border:1px solid #d1fae5;border-radius:8px;padding:16px 20px;margin-bottom:24px">
<p style="color:#065f46;font-size:13px;font-weight:600;margin:0;font-family:Arial,sans-serif">&#10003; Your account has been verified and activated</p>
</div>
<h2 style="color:#18181b;margin:0 0 8px;font-size:22px;font-weight:700;font-family:Arial,sans-serif">Your Account is Now Active</h2>
<p style="color:#71717a;margin:0 0 28px;font-size:14px;line-height:1.7;font-family:Arial,sans-serif">
Hello ${d.firstName}, welcome to Bank of Asia Online. Your identity has been verified and your account is ready to use.
</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #d1fae5;border-radius:8px;background:#f0fdf9;margin-bottom:28px">
<tr><td style="padding:20px 24px">
<p style="color:#6b7280;font-size:11px;letter-spacing:0.1em;margin:0 0 4px;font-family:Arial,sans-serif">ACCOUNT NUMBER</p>
<p style="color:#064e3b;font-size:20px;font-weight:700;font-family:'Courier New',Courier,monospace;margin:0 0 16px;letter-spacing:0.05em">${d.accountNumber}</p>
<p style="color:#6b7280;font-size:11px;letter-spacing:0.1em;margin:0 0 4px;font-family:Arial,sans-serif">PRIMARY CURRENCY</p>
<p style="color:#065f46;font-size:14px;font-weight:600;margin:0;font-family:Arial,sans-serif">${d.currency}</p>
</td></tr>
</table>
${ctaButton("Log In to Your Account &rarr;", `${SITE}/login`)}
<p style="color:#a1a1aa;font-size:12px;text-align:center;margin:0;font-family:Arial,sans-serif">Recommended first steps: Enable 2FA &middot; Fund your account &middot; Generate a virtual card</p>`,
    `Your Bank of Asia Online account is active, ${d.firstName}.`);
}

// ─── 3. Transaction confirmation ───────────────────────────────────────────────

export function tmplTransaction(d: {
  firstName: string;
  reference: string;
  amount: string;
  currency: string;
  type: string;
  status: string;
  description: string;
  date: string;
}): string {
  const dt = new Date(d.date).toLocaleString("en-SG", { dateStyle: "medium", timeStyle: "short" });
  return wrap(`
<h2 style="color:#18181b;margin:0 0 8px;font-size:22px;font-weight:700;font-family:Arial,sans-serif">Transaction Receipt</h2>
<p style="color:#71717a;margin:0 0 4px;font-size:14px;font-family:Arial,sans-serif">Hello ${d.firstName}, here is your transaction summary.</p>
${amountBlock(d.amount, d.currency)}
<div style="text-align:center;margin:-12px 0 24px">${badge(d.status)}</div>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px">
${row("Reference", `<span style="font-family:'Courier New',Courier,monospace;font-size:12px">${d.reference}</span>`)}
${row("Type", d.type.replace(/_/g, " "))}
${row("Date &amp; Time", dt)}
${d.description ? row("Description", d.description, true) : row("Status", d.status.replace(/_/g, " "), true)}
</table>
${securityWarning("If you did not authorise this transaction, contact <strong>security@boasiaonline.com</strong> immediately.")}
${ctaButton("View in Dashboard", `${SITE}/dashboard`)}`,
    `Transaction ${d.reference} — ${d.status.toLowerCase()}.`);
}

// ─── 4. Transaction status update ─────────────────────────────────────────────

export function tmplTransactionStatusUpdate(d: {
  firstName: string;
  reference: string;
  amount: string;
  currency: string;
  previousStatus: string;
  newStatus: string;
  description?: string;
  date: string;
}): string {
  const dt = new Date(d.date).toLocaleString("en-SG", { dateStyle: "medium", timeStyle: "short" });
  return wrap(`
<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:14px 18px;margin-bottom:24px">
<p style="color:#92400e;font-size:13px;font-weight:600;margin:0;font-family:Arial,sans-serif">&#8635; Your transaction status has been updated</p>
</div>
<h2 style="color:#18181b;margin:0 0 8px;font-size:22px;font-weight:700;font-family:Arial,sans-serif">Transaction Status Update</h2>
<p style="color:#71717a;margin:0 0 28px;font-size:14px;line-height:1.7;font-family:Arial,sans-serif">
Hello ${d.firstName}, a transaction on your account has had its status updated by our team.
</p>
${amountBlock(d.amount, d.currency, "Transaction Amount")}
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px">
${row("Reference", `<span style="font-family:'Courier New',Courier,monospace;font-size:12px">${d.reference}</span>`)}
${row("Previous Status", badge(d.previousStatus))}
${row("New Status", badge(d.newStatus))}
${row("Date &amp; Time", dt)}
${d.description ? row("Description", d.description, true) : `<!-- no desc -->`}
</table>
<p style="color:#71717a;font-size:13px;margin:0 0 24px;line-height:1.7;font-family:Arial,sans-serif">
If you have questions about this update, please contact our support team with your transaction reference number.
</p>
${ctaButton("View in Dashboard", `${SITE}/dashboard`)}`,
    `Transaction ${d.reference} status updated to ${d.newStatus.toLowerCase()}.`);
}

// ─── 5. Email-confirm transfer ─────────────────────────────────────────────────

export function tmplConfirmTransfer(d: {
  firstName: string;
  amount: string;
  currency: string;
  recipientName?: string;
  reference: string;
  confirmUrl: string;
  cancelUrl: string;
  expiresAt: string;
}): string {
  return wrap(`
<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:14px 18px;margin-bottom:24px">
<p style="color:#92400e;font-size:13px;font-weight:600;margin:0;font-family:Arial,sans-serif">&#9888;&#xFE0E; Action required — confirm or cancel this transfer</p>
</div>
<h2 style="color:#18181b;margin:0 0 8px;font-size:22px;font-weight:700;font-family:Arial,sans-serif">Confirm Your Transfer</h2>
<p style="color:#71717a;margin:0 0 28px;font-size:14px;line-height:1.7;font-family:Arial,sans-serif">
Hello ${d.firstName}, we received a request to initiate a transfer from your Bank of Asia Online account. Please confirm or cancel below.
</p>
${amountBlock(d.amount, d.currency, "Transfer Amount")}
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px">
${d.recipientName ? row("Recipient", d.recipientName) : ""}
${row("Reference", `<span style="font-family:'Courier New',Courier,monospace;font-size:12px">${d.reference}</span>`)}
${row("Link expires", d.expiresAt, true)}
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px">
<tr>
<td style="padding-right:8px">
<a href="${d.confirmUrl}" style="display:block;background:#00875a;color:#ffffff;padding:14px;border-radius:6px;font-size:14px;font-weight:600;text-decoration:none;text-align:center;font-family:Arial,sans-serif">&#10003; Confirm Transfer</a>
</td>
<td style="padding-left:8px">
<a href="${d.cancelUrl}" style="display:block;background:#ffffff;color:#991b1b;border:1px solid #fecaca;padding:14px;border-radius:6px;font-size:14px;font-weight:600;text-decoration:none;text-align:center;font-family:Arial,sans-serif">&#10007; Cancel Transfer</a>
</td>
</tr>
</table>
${securityWarning("If you did not initiate this transfer, cancel immediately and contact <strong>security@boasiaonline.com</strong>.")}`,
    `Action required: confirm your transfer of ${d.amount} ${d.currency}.`);
}

// ─── 6. Transfer security token ───────────────────────────────────────────────

export function tmplTransferToken(d: {
  firstName: string;
  token: string;
  expiresAt: string;
}): string {
  return wrap(`
<h2 style="color:#18181b;margin:0 0 8px;font-size:22px;font-weight:700;font-family:Arial,sans-serif">Transfer Security Token</h2>
<p style="color:#71717a;margin:0 0 28px;font-size:14px;line-height:1.7;font-family:Arial,sans-serif">
Hello ${d.firstName}, your administrator has issued a one-time transfer authorisation token for your account.
</p>
<div style="background:#f0fdf9;border:1px solid #d1fae5;border-radius:8px;padding:28px;text-align:center;margin-bottom:24px">
<p style="color:#6b7280;font-size:11px;letter-spacing:0.1em;margin:0 0 14px;font-family:Arial,sans-serif">YOUR TRANSFER TOKEN</p>
<div style="font-family:'Courier New',Courier,monospace;font-size:22px;font-weight:700;color:#064e3b;letter-spacing:0.25em;padding:16px 20px;background:#ffffff;border:1px solid #d1fae5;border-radius:6px;display:inline-block;word-break:break-all">${d.token}</div>
<p style="color:#6b7280;font-size:12px;margin:14px 0 0;font-family:Arial,sans-serif">Expires: ${d.expiresAt}</p>
</div>
${securityWarning("This token is strictly confidential. <strong>Never share it</strong> with anyone, including Bank of Asia Online staff.")}`,
    `Your transfer security token is ready.`);
}

// ─── 7. Admin support reply ────────────────────────────────────────────────────

export function tmplAdminReply(d: {
  firstName: string;
  ticketId: string;
  subject: string;
  replyContent: string;
  adminName: string;
}): string {
  return wrap(`
<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:14px 18px;margin-bottom:24px">
<p style="color:#1e40af;font-size:13px;font-weight:600;margin:0;font-family:Arial,sans-serif">&#128233; New reply on your support ticket</p>
</div>
<h2 style="color:#18181b;margin:0 0 8px;font-size:22px;font-weight:700;font-family:Arial,sans-serif">Support Team Reply</h2>
<p style="color:#71717a;margin:0 0 28px;font-size:14px;line-height:1.7;font-family:Arial,sans-serif">
Hello ${d.firstName}, the Bank of Asia Online support team has replied to your ticket.
</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e4e4e7;border-radius:8px;margin-bottom:24px">
<tr><td style="padding:20px 24px">
${row("Ticket Reference", `<span style="font-family:'Courier New',Courier,monospace;font-size:12px;color:#1e40af">${d.ticketId}</span>`)}
${row("Subject", d.subject, true)}
</td></tr>
</table>
<div style="border:1px solid #e4e4e7;border-left:3px solid #0d1b3e;border-radius:0 8px 8px 0;padding:20px 24px;margin-bottom:28px">
<p style="color:#a1a1aa;font-size:11px;letter-spacing:0.1em;margin:0 0 12px;font-family:Arial,sans-serif">REPLY FROM SUPPORT</p>
<div style="color:#18181b;font-size:14px;line-height:1.8;white-space:pre-wrap;font-family:Arial,sans-serif">${d.replyContent}</div>
<p style="color:#71717a;font-size:12px;margin:14px 0 0;font-family:Arial,sans-serif">&mdash; ${d.adminName}, Bank of Asia Online Support</p>
</div>
${ctaButton("View Full Conversation", `${SITE}/dashboard/support`)}`,
    `Support has replied to your ticket ${d.ticketId}.`);
}

// ─── 8. Password reset ────────────────────────────────────────────────────────

export function tmplPasswordReset(d: {
  firstName: string;
  resetUrl: string;
}): string {
  return wrap(`
<h2 style="color:#18181b;margin:0 0 8px;font-size:22px;font-weight:700;font-family:Arial,sans-serif">Password Reset Request</h2>
<p style="color:#71717a;margin:0 0 28px;font-size:14px;line-height:1.7;font-family:Arial,sans-serif">
Hello ${d.firstName}, we received a request to reset the password for your Bank of Asia Online account. Click the button below to set a new password.
</p>
${ctaButton("Reset My Password &rarr;", d.resetUrl)}
<p style="color:#a1a1aa;font-size:12px;text-align:center;margin:-16px 0 24px;font-family:Arial,sans-serif">This link expires in 1 hour.</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e4e4e7;border-radius:8px;margin-bottom:20px">
<tr><td style="padding:16px 20px">
<p style="color:#71717a;font-size:13px;margin:0;line-height:1.7;font-family:Arial,sans-serif">If the button doesn't work, paste this URL into your browser:<br><span style="color:#00875a;font-size:12px;word-break:break-all">${d.resetUrl}</span></p>
</td></tr>
</table>
${securityWarning("If you did not request a password reset, you can safely ignore this email. Your account remains secure.")}`,
    `Password reset link for your Bank of Asia Online account.`);
}

// ─── 9. Contact form — admin notification ─────────────────────────────────────

export function tmplContactAdmin(d: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  timestamp: string;
}): string {
  return wrap(`
<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:14px 18px;margin-bottom:24px">
<p style="color:#92400e;font-size:13px;font-weight:600;margin:0;font-family:Arial,sans-serif">&#128236; New contact form submission</p>
</div>
<h2 style="color:#18181b;margin:0 0 8px;font-size:22px;font-weight:700;font-family:Arial,sans-serif">Contact Form Submission</h2>
<p style="color:#71717a;margin:0 0 28px;font-size:14px;font-family:Arial,sans-serif">A visitor has submitted the contact form on boasiaonline.com.</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e4e4e7;border-radius:8px;margin-bottom:24px">
<tr><td style="padding:4px 20px">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
${row("Name", d.name)}
${row("Email", `<a href="mailto:${d.email}" style="color:#00875a;text-decoration:none">${d.email}</a>`)}
${row("Phone", d.phone ?? "Not provided")}
${row("Subject", d.subject)}
${row("Submitted", d.timestamp, true)}
</table>
</td></tr>
</table>
<div style="border:1px solid #e4e4e7;border-radius:8px;padding:20px 24px;margin-bottom:20px">
<p style="color:#a1a1aa;font-size:11px;letter-spacing:0.1em;margin:0 0 12px;font-family:Arial,sans-serif">MESSAGE</p>
<div style="color:#18181b;font-size:14px;line-height:1.8;white-space:pre-wrap;font-family:Arial,sans-serif">${d.message}</div>
</div>
<p style="color:#71717a;font-size:13px;margin:0;font-family:Arial,sans-serif">Reply to this email to respond directly to ${d.name} at ${d.email}.</p>`);
}

// ─── 10. Contact form — sender confirmation ────────────────────────────────────

export function tmplContactConfirm(d: {
  name: string;
  subject: string;
  preview: string;
}): string {
  return wrap(`
<h2 style="color:#18181b;margin:0 0 8px;font-size:22px;font-weight:700;font-family:Arial,sans-serif">We received your message</h2>
<p style="color:#71717a;margin:0 0 28px;font-size:14px;line-height:1.7;font-family:Arial,sans-serif">
Hello ${d.name}, thank you for reaching out to Bank of Asia Online. Your message has been received and a member of our team will respond within 1&ndash;2 business days.
</p>
<div style="border:1px solid #e4e4e7;border-left:3px solid #0d1b3e;border-radius:0 8px 8px 0;padding:20px 24px;margin-bottom:28px">
<p style="color:#a1a1aa;font-size:11px;letter-spacing:0.1em;margin:0 0 8px;font-family:Arial,sans-serif">YOUR MESSAGE</p>
<p style="color:#18181b;font-size:14px;font-weight:600;margin:0 0 10px;font-family:Arial,sans-serif">${d.subject}</p>
<p style="color:#71717a;font-size:13px;line-height:1.8;white-space:pre-wrap;margin:0;font-family:Arial,sans-serif">${d.preview}</p>
</div>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e4e4e7;border-radius:8px;margin-bottom:28px">
<tr><td style="padding:16px 20px">
<p style="color:#71717a;font-size:13px;margin:0 0 8px;font-family:Arial,sans-serif">For urgent matters, contact us directly:</p>
<p style="color:#18181b;font-size:13px;margin:0;font-family:Arial,sans-serif">&#9993; <a href="mailto:support@boasiaonline.com" style="color:#00875a;text-decoration:none">support@boasiaonline.com</a></p>
</td></tr>
</table>
${ctaButton("Visit boasiaonline.com", SITE)}`,
    `Your message has been received — we'll be in touch within 1–2 business days.`);
}

// ─── Legacy exports ────────────────────────────────────────────────────────────

export function welcomePendingEmail(d: { firstName: string; email: string; accountNumber: string }) {
  return { subject: "Welcome to Bank of Asia Online — Application Received", html: tmplRegistrationPending({ firstName: d.firstName, accountNumber: d.accountNumber, currency: "USD" }) };
}

export function accountActivatedEmail(d: { firstName: string; email: string; accountNumber: string; currency: string }) {
  return { subject: "Your Bank of Asia Online Account is Now Active", html: tmplAccountActivated(d) };
}

export function transactionReceiptEmail(d: { firstName: string; amount: string; currency: string; type: string; reference: string; status: string; description?: string; date: string }) {
  return { subject: `Transaction Receipt — ${d.reference}`, html: tmplTransaction({ firstName: d.firstName, reference: d.reference, amount: d.amount, currency: d.currency, type: d.type, status: d.status, description: d.description ?? "", date: d.date }) };
}

export function emailConfirmTransferEmail(d: { firstName: string; amount: string; currency: string; recipientName?: string; reference: string; confirmUrl: string; cancelUrl: string; expiresAt: string }) {
  return { subject: "Action Required — Confirm Your Transfer", html: tmplConfirmTransfer(d) };
}

export function transferTokenEmail(d: { firstName: string; token: string; expiresAt: string }) {
  return { subject: "Your Bank of Asia Transfer Security Token", html: tmplTransferToken(d) };
}

export function accountRestrictedEmail(d: { firstName: string; restrictionMessage: string }) {
  return {
    subject: "Important: Your Bank of Asia Online Account Status",
    html: wrap(`
<h2 style="color:#18181b;margin:0 0 8px;font-size:22px;font-weight:700;font-family:Arial,sans-serif">Account Status Update</h2>
<p style="color:#71717a;margin:0 0 24px;font-size:14px;font-family:Arial,sans-serif">Hello ${d.firstName},</p>
<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:20px 24px;margin-bottom:24px">
<p style="color:#991b1b;font-size:14px;line-height:1.7;margin:0;font-family:Arial,sans-serif">${d.restrictionMessage}</p>
</div>
<p style="color:#71717a;font-size:13px;margin:0;font-family:Arial,sans-serif">If you have questions, contact <a href="mailto:support@boasiaonline.com" style="color:#00875a;text-decoration:none">support@boasiaonline.com</a>.</p>`),
  };
}

export function passwordResetEmail(d: { firstName: string; resetUrl: string; expiresIn?: string }) {
  return { subject: "Reset Your Bank of Asia Online Password", html: tmplPasswordReset(d) };
}

export function contactFormEmail(d: { name: string; email: string; phone?: string; subject: string; message: string }) {
  return {
    subject: `New Contact: ${d.subject} — from ${d.name}`,
    html: tmplContactAdmin({ ...d, timestamp: new Date().toLocaleString("en-SG", { dateStyle: "full", timeStyle: "short" }) }),
  };
}

export function contactConfirmationEmail(d: { name: string; subject: string }) {
  return {
    subject: "We received your message — Bank of Asia Online",
    html: tmplContactConfirm({ name: d.name, subject: d.subject, preview: "" }),
  };
}
