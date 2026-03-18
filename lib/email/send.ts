import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_NOREPLY = "Bank of Asia Online <noreply@boasiaonline.com>";
export const FROM_SUPPORT = "Bank of Asia Online <support@boasiaonline.com>";

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}): Promise<void> {
  const from = opts.from ?? FROM_NOREPLY;

  console.log(`[EMAIL] Sending to ${opts.to} | Subject: ${opts.subject}`);

  const { data, error } = await resend.emails.send({
    from,
    to: [opts.to],
    subject: opts.subject,
    html: opts.html,
    ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
  });

  if (error) {
    console.error("[EMAIL] FAILED:", JSON.stringify(error, null, 2));
  } else {
    console.log("[EMAIL] Sent OK. ID:", data?.id);
  }
}
