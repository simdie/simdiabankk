import { emailBase } from "./base-template";

// ─── 1. Welcome / Pending ────────────────────────────────────────────────────

export function welcomePendingEmail({
  firstName,
  email,
  accountNumber,
}: {
  firstName: string;
  email: string;
  accountNumber: string;
}): { subject: string; html: string } {
  const html = emailBase(
    `
    <h1>Welcome, ${firstName}!</h1>
    <p>Your application has been received and is under review. We're excited to have you join Bank of Asia Online.</p>

    <div class="card">
      <table class="detail-table">
        <tr>
          <td>Account Number</td>
          <td style="font-family:'Courier New',monospace;">${accountNumber}</td>
        </tr>
        <tr>
          <td>Email</td>
          <td>${email}</td>
        </tr>
        <tr>
          <td>Status</td>
          <td><span class="badge-warning" style="background:rgba(200,151,42,0.15);color:#C8972A;border:1px solid rgba(200,151,42,0.3);padding:4px 12px;border-radius:100px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">PENDING</span></td>
        </tr>
      </table>
    </div>

    <p>Our team will review your application within 24 hours. You'll receive an email confirmation once your account is activated.</p>

    <div class="security-notice">
      <p>&#x26A0; If you did not create this account, contact us immediately at security@boasiaonline.com.</p>
    </div>
    `,
    `Your Bank of Asia Online application is under review.`
  );
  return {
    subject: "Welcome to Bank of Asia Online — Application Received",
    html,
  };
}

// ─── 2. Account Activated ────────────────────────────────────────────────────

export function accountActivatedEmail({
  firstName,
  email,
  accountNumber,
  currency,
}: {
  firstName: string;
  email: string;
  accountNumber: string;
  currency: string;
}): { subject: string; html: string } {
  const html = emailBase(
    `
    <h1>Your account is active.</h1>
    <p><span class="badge-success" style="background:rgba(0,200,150,0.15);color:#00C896;border:1px solid rgba(0,200,150,0.3);padding:4px 12px;border-radius:100px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">ACTIVATED</span></p>

    <div class="card">
      <table class="detail-table">
        <tr>
          <td>Account Number</td>
          <td style="font-family:'Courier New',monospace;">${accountNumber}</td>
        </tr>
        <tr>
          <td>Email</td>
          <td>${email}</td>
        </tr>
        <tr>
          <td>Primary Currency</td>
          <td>${currency}</td>
        </tr>
        <tr>
          <td>Account Type</td>
          <td>Individual Savings</td>
        </tr>
      </table>
    </div>

    <p>You can now log in and start banking. Your account is fully verified and ready to use.</p>

    <div style="text-align:center;margin:28px 0;">
      <a href="https://www.boasiaonline.com/login" class="btn">Log In to Your Account &rarr;</a>
    </div>

    <div class="card">
      <h2 style="font-size:14px;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px;">First steps</h2>
      <p style="margin:0 0 8px;">&#x2714; <span class="highlight">Enable 2FA</span> &mdash; Go to Settings &rarr; Security to set up two-factor authentication.</p>
      <p style="margin:0 0 8px;">&#x2714; <span class="highlight">Fund your account</span> &mdash; Make your first deposit to activate full banking features.</p>
      <p style="margin:0;">&#x2714; <span class="highlight">Explore virtual cards</span> &mdash; Create a virtual card for secure online purchases.</p>
    </div>
    `,
    `Your Bank of Asia Online account is now active and ready to use.`
  );
  return {
    subject: "Your Bank of Asia Online account is now active ✓",
    html,
  };
}

// ─── 3. Transaction Receipt ──────────────────────────────────────────────────

export function transactionReceiptEmail({
  firstName,
  amount,
  currency,
  type,
  reference,
  status,
  description,
  recipientName,
  date,
}: {
  firstName: string;
  amount: string;
  currency: string;
  type: string;
  reference: string;
  status: string;
  description?: string;
  recipientName?: string;
  date: string;
}): { subject: string; html: string } {
  const statusBadge =
    status === "COMPLETED"
      ? `<span class="badge-success" style="background:rgba(0,200,150,0.15);color:#00C896;border:1px solid rgba(0,200,150,0.3);padding:4px 12px;border-radius:100px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">COMPLETED</span>`
      : `<span class="badge-warning" style="background:rgba(200,151,42,0.15);color:#C8972A;border:1px solid rgba(200,151,42,0.3);padding:4px 12px;border-radius:100px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">PENDING</span>`;

  const currencySymbols: Record<string, string> = {
    USD: "$", EUR: "€", GBP: "£", SGD: "S$", HKD: "HK$",
    AUD: "A$", JPY: "¥", CAD: "C$", CHF: "Fr", NZD: "NZ$",
  };
  const symbol = currencySymbols[currency] ?? "";

  const html = emailBase(
    `
    <h2>Transaction Confirmed</h2>
    <p>Hello ${firstName}, here is your transaction receipt.</p>

    <div style="text-align:center;margin:24px 0;">
      <div class="amount">${symbol}${amount}</div>
      <div style="margin-top:8px;">${statusBadge}</div>
    </div>

    <div class="card">
      <table class="detail-table">
        <tr><td>Reference</td><td style="font-family:'Courier New',monospace;font-size:13px;">${reference}</td></tr>
        <tr><td>Type</td><td>${type.replace(/_/g, " ")}</td></tr>
        <tr><td>Date</td><td>${date}</td></tr>
        <tr><td>Currency</td><td>${currency}</td></tr>
        ${description ? `<tr><td>Description</td><td>${description}</td></tr>` : ""}
        ${recipientName ? `<tr><td>Recipient</td><td>${recipientName}</td></tr>` : ""}
      </table>
    </div>

    <div style="text-align:center;margin:24px 0;">
      <a href="https://www.boasiaonline.com/dashboard/transactions" class="btn">Download Receipt &rarr;</a>
      &nbsp;&nbsp;
      <a href="https://www.boasiaonline.com/dashboard/transactions" class="btn btn-outline" style="background:transparent;border:1.5px solid rgba(255,255,255,0.3);color:#FFFFFF;display:inline-block;font-size:15px;font-weight:600;padding:14px 32px;border-radius:8px;text-decoration:none;margin:8px 0;">View Transaction</a>
    </div>

    <div class="security-notice">
      <p>&#x26A0; If you did not authorise this transaction, please contact us immediately at security@boasiaonline.com and freeze your account from the dashboard.</p>
    </div>
    `,
    `Transaction ${reference} — ${symbol}${amount} ${status.toLowerCase()}`
  );
  return {
    subject: `Transaction ${reference} — ${amount} ${currency}`,
    html,
  };
}

// ─── 4. Email Confirm Transfer ───────────────────────────────────────────────

export function emailConfirmTransferEmail({
  firstName,
  amount,
  currency,
  recipientName,
  reference,
  confirmUrl,
  cancelUrl,
  expiresAt,
}: {
  firstName: string;
  amount: string;
  currency: string;
  recipientName?: string;
  reference: string;
  confirmUrl: string;
  cancelUrl: string;
  expiresAt: string;
}): { subject: string; html: string } {
  const html = emailBase(
    `
    <div style="text-align:center;margin-bottom:20px;">
      <span class="badge-warning" style="background:rgba(200,151,42,0.15);color:#C8972A;border:1px solid rgba(200,151,42,0.3);padding:6px 16px;border-radius:100px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">&#x26A0; ACTION REQUIRED</span>
    </div>

    <h1>Please confirm your transfer</h1>
    <p>Hello ${firstName}, a transfer from your account requires your confirmation before it can proceed.</p>

    <div class="card" style="border:1px solid rgba(200,151,42,0.3);">
      <table class="detail-table">
        <tr><td>Amount</td><td style="color:#C8972A;font-weight:700;">${amount} ${currency}</td></tr>
        ${recipientName ? `<tr><td>To</td><td>${recipientName}</td></tr>` : ""}
        <tr><td>Reference</td><td style="font-family:'Courier New',monospace;font-size:13px;">${reference}</td></tr>
      </table>
    </div>

    <p>This transfer requires your confirmation. Click the button below to authorise it.</p>

    <div style="text-align:center;margin:28px 0 16px;">
      <a href="${confirmUrl}" class="btn">&#x2713; Confirm Transfer</a>
    </div>

    <div style="text-align:center;margin-bottom:20px;">
      <a href="${cancelUrl}" style="display:inline-block;background:rgba(239,68,68,0.1);border:1.5px solid rgba(239,68,68,0.4);color:#EF4444;font-size:14px;font-weight:600;padding:11px 28px;border-radius:8px;text-decoration:none;">&#x2717; Cancel Transfer</a>
    </div>

    <p style="text-align:center;font-size:13px;color:#6B7280;">Link expires: ${expiresAt}</p>

    <div class="security-notice">
      <p><strong>DO NOT</strong> click confirm if you did not initiate this transfer. Contact us immediately at security@boasiaonline.com — your account may be compromised.</p>
    </div>
    `,
    `Action required: confirm your transfer of ${amount} ${currency}`
  );
  return {
    subject: "⚠️ Action Required — Confirm Your Transfer",
    html,
  };
}

// ─── 5. Transfer Token ───────────────────────────────────────────────────────

export function transferTokenEmail({
  firstName,
  token,
  expiresAt,
  issuedBy,
}: {
  firstName: string;
  token: string;
  expiresAt: string;
  issuedBy?: string;
}): { subject: string; html: string } {
  const now = new Date().toLocaleString("en-US", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit", timeZone: "Asia/Singapore",
  });

  const html = emailBase(
    `
    <h2>Transfer Security Token</h2>
    <p>Hello ${firstName}, your administrator has issued a one-time transfer token for your account.</p>

    <div style="text-align:center;margin:28px 0;">
      <div style="font-family:'Courier New',monospace;font-size:28px;font-weight:700;color:#00C896;letter-spacing:0.18em;background:rgba(0,200,150,0.07);border:1px solid rgba(0,200,150,0.25);border-radius:10px;padding:20px 28px;display:inline-block;word-break:break-all;">${token}</div>
    </div>

    <div class="card">
      <table class="detail-table">
        <tr><td>Expires</td><td>${expiresAt}</td></tr>
        <tr><td>Issued</td><td>${now} SGT</td></tr>
        ${issuedBy ? `<tr><td>Issued by</td><td>${issuedBy}</td></tr>` : ""}
      </table>
    </div>

    <p>Enter this token when prompted during your next transfer. It can only be used once.</p>

    <div class="security-notice">
      <p>&#x1F512; This token is strictly confidential. <strong>Never share it with anyone</strong>, including Bank of Asia Online staff. If you did not request this token, contact security@boasiaonline.com immediately.</p>
    </div>
    `,
    `Your Bank of Asia transfer security token is ready.`
  );
  return {
    subject: "Your Bank of Asia Transfer Security Token",
    html,
  };
}

// ─── 6. Account Restricted ───────────────────────────────────────────────────

export function accountRestrictedEmail({
  firstName,
  restrictionMessage,
}: {
  firstName: string;
  restrictionMessage: string;
}): { subject: string; html: string } {
  const html = emailBase(
    `
    <div style="text-align:center;margin-bottom:20px;">
      <span class="badge-warning" style="background:rgba(200,151,42,0.15);color:#C8972A;border:1px solid rgba(200,151,42,0.3);padding:6px 16px;border-radius:100px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">ACCOUNT NOTICE</span>
    </div>

    <h2>Account Status Update</h2>
    <p>Hello ${firstName}, we're writing to inform you of an important update regarding your Bank of Asia Online account.</p>

    <div class="card" style="border:1px solid rgba(239,68,68,0.3);">
      <p style="color:#FCA5A5;margin:0;">${restrictionMessage}</p>
    </div>

    <p>Please contact our compliance team for assistance. We're here to help resolve this as quickly as possible.</p>

    <div style="text-align:center;margin:24px 0;">
      <a href="https://www.boasiaonline.com/contact" class="btn">Contact Support &rarr;</a>
    </div>

    <p style="font-size:13px;">You can also reach our compliance team directly at <a href="mailto:compliance@boasiaonline.com" style="color:#00C896;">compliance@boasiaonline.com</a></p>
    `,
    `Important notice regarding your Bank of Asia Online account.`
  );
  return {
    subject: "Important Notice Regarding Your Bank of Asia Account",
    html,
  };
}

// ─── 7. Password Reset ───────────────────────────────────────────────────────

export function passwordResetEmail({
  firstName,
  resetUrl,
  expiresIn,
}: {
  firstName: string;
  resetUrl: string;
  expiresIn: string;
}): { subject: string; html: string } {
  const html = emailBase(
    `
    <h2>Password Reset Request</h2>
    <p>Hello ${firstName}, we received a request to reset the password for your Bank of Asia Online account.</p>

    <div style="text-align:center;margin:28px 0;">
      <a href="${resetUrl}" class="btn">Reset My Password &rarr;</a>
    </div>

    <p style="text-align:center;font-size:13px;color:#6B7280;">This link expires in ${expiresIn}.</p>

    <div class="security-notice">
      <p>If you didn&apos;t request a password reset, you can safely ignore this email &mdash; your account is safe and your password will not change.</p>
    </div>

    <p style="font-size:12px;color:#4B5563;word-break:break-all;">
      If the button above doesn&apos;t work, copy and paste this URL into your browser:<br/>
      <span style="color:#6B7280;">${resetUrl}</span>
    </p>
    `,
    `Reset your Bank of Asia Online password.`
  );
  return {
    subject: "Reset your Bank of Asia Online password",
    html,
  };
}

// ─── 8. Contact Form (admin notification) ────────────────────────────────────

export function contactFormEmail({
  name,
  email,
  phone,
  subject,
  message,
}: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): { subject: string; html: string } {
  const submitted = new Date().toLocaleString("en-US", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit", timeZone: "Asia/Singapore",
  });

  const html = emailBase(
    `
    <h2>New Contact Submission</h2>
    <p>A new message has been submitted via the Bank of Asia Online contact form.</p>

    <div class="card">
      <table class="detail-table">
        <tr><td>Name</td><td>${name}</td></tr>
        <tr><td>Email</td><td>${email}</td></tr>
        ${phone ? `<tr><td>Phone</td><td>${phone}</td></tr>` : ""}
        <tr><td>Subject</td><td>${subject}</td></tr>
        <tr><td>Submitted</td><td>${submitted} SGT</td></tr>
      </table>
    </div>

    <div class="card">
      <p style="color:#E5E7EB;white-space:pre-wrap;margin:0;">${message}</p>
    </div>

    <div style="text-align:center;margin:24px 0;">
      <a href="mailto:${email}" class="btn">Reply to ${name} &rarr;</a>
    </div>
    `,
    `New contact form submission from ${name} — ${subject}`
  );
  return {
    subject: `New Contact Form Submission — ${subject}`,
    html,
  };
}

// ─── 8b. Contact Form (user confirmation) ────────────────────────────────────

export function contactConfirmationEmail({
  name,
  subject,
}: {
  name: string;
  subject: string;
}): { subject: string; html: string } {
  const html = emailBase(
    `
    <h1>We received your message.</h1>
    <p>Hi ${name}, thank you for reaching out to Bank of Asia Online.</p>

    <div class="card">
      <p style="margin:0;"><span style="color:#9CA3AF;">Your enquiry about:</span> <span class="highlight">${subject}</span><br/>
      <span style="color:#9CA3AF;">Status:</span> <span class="badge-success" style="background:rgba(0,200,150,0.15);color:#00C896;border:1px solid rgba(0,200,150,0.3);padding:3px 10px;border-radius:100px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">RECEIVED</span></p>
    </div>

    <p>Our support team will review your message and respond within 24 hours during business hours (Mon–Fri, 8 am–8 pm SGT).</p>

    <p>For urgent matters, call us at <span class="highlight">+65 6000 0000</span> or email <a href="mailto:security@boasiaonline.com" style="color:#00C896;">security@boasiaonline.com</a> for security emergencies.</p>
    `,
    `We received your message — Bank of Asia Online will respond within 24 hours.`
  );
  return {
    subject: "We received your message — Bank of Asia Online",
    html,
  };
}
