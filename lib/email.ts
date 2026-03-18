import { resend } from "./email/resend";
import {
  welcomePendingEmail,
  accountActivatedEmail,
  transactionReceiptEmail,
  emailConfirmTransferEmail,
  transferTokenEmail,
  accountRestrictedEmail,
  passwordResetEmail,
  contactFormEmail,
  contactConfirmationEmail,
} from "./email/templates";
import type { ReceiptData } from "./receipt";

const FROM = `Bank of Asia Online <${process.env.EMAIL_FROM ?? "onboarding@resend.dev"}>`;
const SUPPORT = process.env.EMAIL_SUPPORT ?? "christiammader@gmail.com";
const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXTAUTH_URL ??
  "https://www.boasiaonline.com";

// ─── Core send helper ─────────────────────────────────────────────────────────

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  // attachments not supported by Resend in the same way — silently ignore
  _attachments?: unknown
): Promise<void> {
  const { error } = await resend.emails.send({ from: FROM, to: [to], subject, html });
  if (error) console.error("[sendEmail] Resend error:", error);
}

// ─── 1. Welcome / Pending ─────────────────────────────────────────────────────

export function welcomeEmailHtml(firstName: string): string {
  // Legacy: called with just firstName — construct a minimal version
  const { html } = welcomePendingEmail({
    firstName,
    email: "",
    accountNumber: "",
  });
  return html;
}

export async function sendWelcomeEmail(
  to: string,
  firstName: string,
  accountNumber: string
): Promise<void> {
  const { subject, html } = welcomePendingEmail({ firstName, email: to, accountNumber });
  const { error } = await resend.emails.send({ from: FROM, to: [to], subject, html });
  if (error) console.error("[sendWelcomeEmail] Resend error:", error);
}

// ─── 2. Account Activated ─────────────────────────────────────────────────────

export function activationEmailHtml(
  firstName: string,
  accountNumber: string,
  currency: string
): string {
  const { html } = accountActivatedEmail({
    firstName,
    email: "",
    accountNumber,
    currency,
  });
  return html;
}

export async function sendActivationEmail(
  to: string,
  firstName: string,
  accountNumber: string,
  currency: string
): Promise<void> {
  const { subject, html } = accountActivatedEmail({
    firstName,
    email: to,
    accountNumber,
    currency,
  });
  const { error } = await resend.emails.send({ from: FROM, to: [to], subject, html });
  if (error) console.error("[sendActivationEmail] Resend error:", error);
}

// ─── 3. Transaction Receipt ───────────────────────────────────────────────────

export function transactionReceiptEmailHtml(
  data: ReceiptData & { recipientName?: string; senderName?: string }
): string {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(data.amount);
  const formattedDate = new Date(data.createdAt).toLocaleString("en-US", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const { html } = transactionReceiptEmail({
    firstName: data.sender?.name?.split(" ")[0] ?? "Customer",
    amount: formattedAmount,
    currency: data.currency,
    type: data.type,
    reference: data.reference,
    status: data.status,
    description: data.description ?? undefined,
    date: formattedDate,
  });
  return html;
}

export async function sendReceiptEmail(
  to: string,
  data: ReceiptData & { recipientName?: string; senderName?: string }
): Promise<void> {
  const html = transactionReceiptEmailHtml(data);
  const subject = `Transaction Receipt — ${data.reference}`;
  const { error } = await resend.emails.send({ from: FROM, to: [to], subject, html });
  if (error) console.error("[sendReceiptEmail] Resend error:", error);
}

// ─── 4. Transfer Confirmation ─────────────────────────────────────────────────

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
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toLocaleString("en-US", {
    hour: "2-digit", minute: "2-digit", month: "short", day: "numeric",
  });
  const { html } = emailConfirmTransferEmail({
    firstName: opts.firstName,
    amount: opts.amount,
    currency: opts.currency,
    recipientName: opts.recipientName,
    reference: opts.reference,
    confirmUrl: opts.confirmUrl,
    cancelUrl: opts.cancelUrl,
    expiresAt,
  });
  return html;
}

export async function sendTransferConfirmEmail(
  to: string,
  opts: Parameters<typeof transferConfirmEmailHtml>[0]
): Promise<void> {
  const html = transferConfirmEmailHtml(opts);
  const { error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: "⚠️ Action Required — Confirm Your Transfer",
    html,
  });
  if (error) console.error("[sendTransferConfirmEmail] Resend error:", error);
}

// ─── 5. Transfer Token ────────────────────────────────────────────────────────

export async function sendTransferTokenEmail(
  to: string,
  opts: { firstName: string; token: string; expiresAt: string; issuedBy?: string }
): Promise<void> {
  const { subject, html } = transferTokenEmail(opts);
  const { error } = await resend.emails.send({ from: FROM, to: [to], subject, html });
  if (error) console.error("[sendTransferTokenEmail] Resend error:", error);
}

// ─── 6. Account Restricted ───────────────────────────────────────────────────

export function restrictionEmailHtml(firstName: string, message?: string): string {
  const { html } = accountRestrictedEmail({
    firstName,
    restrictionMessage: message ?? "Your account has been temporarily restricted pending review.",
  });
  return html;
}

export async function sendRestrictionEmail(
  to: string,
  firstName: string,
  message?: string
): Promise<void> {
  const { subject, html } = accountRestrictedEmail({
    firstName,
    restrictionMessage: message ?? "Your account has been temporarily restricted pending review.",
  });
  const { error } = await resend.emails.send({ from: FROM, to: [to], subject, html });
  if (error) console.error("[sendRestrictionEmail] Resend error:", error);
}

// ─── 7. Password Reset ────────────────────────────────────────────────────────

export function passwordResetEmailHtml(firstName: string, resetUrl: string): string {
  const { html } = passwordResetEmail({ firstName, resetUrl, expiresIn: "1 hour" });
  return html;
}

export async function sendPasswordResetEmail(
  to: string,
  firstName: string,
  resetUrl: string
): Promise<void> {
  const { subject, html } = passwordResetEmail({ firstName, resetUrl, expiresIn: "1 hour" });
  const { error } = await resend.emails.send({ from: FROM, to: [to], subject, html });
  if (error) console.error("[sendPasswordResetEmail] Resend error:", error);
}

// ─── 8. Contact Form ─────────────────────────────────────────────────────────

export async function sendContactFormEmail(opts: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): Promise<void> {
  // Notify support team
  const adminEmail = contactFormEmail(opts);
  const { error: adminErr } = await resend.emails.send({
    from: FROM,
    to: [SUPPORT],
    subject: adminEmail.subject,
    html: adminEmail.html,
  });
  if (adminErr) console.error("[sendContactFormEmail] admin send error:", adminErr);

  // Confirmation to submitter
  const confirmEmail = contactConfirmationEmail({ name: opts.name, subject: opts.subject });
  const { error: userErr } = await resend.emails.send({
    from: FROM,
    to: [opts.email],
    subject: confirmEmail.subject,
    html: confirmEmail.html,
  });
  if (userErr) console.error("[sendContactFormEmail] user confirm error:", userErr);
}

// ─── Health check stub ────────────────────────────────────────────────────────
// Kept for backwards compat with any admin test route that calls verifySmtpConnection

export async function verifySmtpConnection(): Promise<{ ok: boolean; error?: string }> {
  // With Resend there is no persistent connection to verify
  return { ok: !!process.env.RESEND_API_KEY, error: process.env.RESEND_API_KEY ? undefined : "RESEND_API_KEY not set" };
}

// Re-export template builders for any code that imports them directly
export {
  welcomePendingEmail,
  accountActivatedEmail,
  transactionReceiptEmail,
  emailConfirmTransferEmail,
  transferTokenEmail,
  accountRestrictedEmail,
  passwordResetEmail,
  contactFormEmail,
  contactConfirmationEmail,
  BASE_URL,
};
