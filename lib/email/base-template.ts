export function emailBase(content: string, preheader?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>Bank of Asia Online</title>
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>` : ""}
  <style>
    /* Reset + base */
    body { margin:0; padding:0; background:#0A0F1E;
           font-family: -apple-system, 'DM Sans', Arial, sans-serif; }

    /* Wrapper */
    .wrapper { max-width: 600px; margin: 0 auto;
               background: #0A0F1E; }

    /* Header */
    .header { background: linear-gradient(135deg, #0D1B3E 0%, #1A0A3E 100%);
              padding: 32px 40px; text-align: center;
              border-bottom: 2px solid #4A1FA8; }
    .header img { height: 48px; width: auto; }

    /* Body */
    .body { background: #111827; padding: 40px;
            border-left: 1px solid rgba(255,255,255,0.06);
            border-right: 1px solid rgba(255,255,255,0.06); }

    /* Card */
    .card { background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 12px; padding: 24px;
            margin: 24px 0; }

    /* Typography */
    h1 { color: #FFFFFF; font-size: 24px; font-weight: 700;
         margin: 0 0 8px; line-height: 1.3; }
    h2 { color: #FFFFFF; font-size: 18px; font-weight: 600;
         margin: 0 0 16px; }
    p { color: #9CA3AF; font-size: 15px; line-height: 1.7;
        margin: 0 0 16px; }
    .highlight { color: #FFFFFF; }

    /* CTA Button */
    .btn { display: inline-block; background: #00C896;
           color: #FFFFFF; font-size: 15px; font-weight: 600;
           padding: 14px 32px; border-radius: 8px;
           text-decoration: none; margin: 8px 0; }
    .btn-outline { background: transparent;
                   border: 1.5px solid rgba(255,255,255,0.3);
                   color: #FFFFFF; }

    /* Amount display */
    .amount { font-family: 'Courier New', monospace;
              font-size: 36px; font-weight: 700;
              color: #00C896; margin: 8px 0; }

    /* Table */
    .detail-table { width: 100%; border-collapse: collapse; }
    .detail-table td { padding: 10px 0; font-size: 14px;
                       border-bottom: 1px solid rgba(255,255,255,0.06); }
    .detail-table td:first-child { color: #6B7280; }
    .detail-table td:last-child { color: #FFFFFF; text-align: right;
                                   font-weight: 500; }

    /* Status badges */
    .badge-success { background: rgba(0,200,150,0.15);
                     color: #00C896; border: 1px solid rgba(0,200,150,0.3);
                     padding: 4px 12px; border-radius: 100px;
                     font-size: 12px; font-weight: 600;
                     text-transform: uppercase; letter-spacing: 0.05em; }
    .badge-warning { background: rgba(200,151,42,0.15);
                     color: #C8972A; border: 1px solid rgba(200,151,42,0.3); }
    .badge-danger { background: rgba(239,68,68,0.15);
                    color: #EF4444; border: 1px solid rgba(239,68,68,0.3); }

    /* Footer */
    .email-footer { background: #070C18; padding: 24px 40px;
                    text-align: center;
                    border-top: 1px solid rgba(255,255,255,0.06); }
    .email-footer p { font-size: 12px; color: #4B5563; margin: 4px 0; }
    .email-footer a { color: #6B7280; text-decoration: none; }
    .footer-links { margin: 12px 0; }
    .footer-links a { margin: 0 8px; }

    /* Security notice */
    .security-notice { background: rgba(239,68,68,0.08);
                        border: 1px solid rgba(239,68,68,0.2);
                        border-radius: 8px; padding: 14px 18px;
                        margin: 20px 0; }
    .security-notice p { color: #FCA5A5; font-size: 13px; margin: 0; }

    /* Divider */
    .divider { border: none; border-top: 1px solid rgba(255,255,255,0.06);
               margin: 24px 0; }

    @media (max-width: 600px) {
      .body { padding: 24px 20px; }
      .header { padding: 24px 20px; }
      h1 { font-size: 20px; }
      .amount { font-size: 28px; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <img src="https://www.boasiaonline.com/logo-dark-bg.png"
           alt="Bank of Asia Online" />
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="email-footer">
      <p>Bank of Asia Online · 123 Financial District, Singapore 048946</p>
      <p>SWIFT: BOASSGSG · Tel: +65 6000 0000</p>
      <div class="footer-links">
        <a href="https://www.boasiaonline.com/security">Security Centre</a>
        <a href="https://www.boasiaonline.com/contact">Contact Us</a>
        <a href="https://www.boasiaonline.com/about">About</a>
      </div>
      <p style="margin-top:16px">
        &copy; 2026 Bank of Asia Online. All rights reserved.<br/>
        Licensed and regulated by MAS Singapore &middot;
        License No: MAS-BOA-2024-001
      </p>
      <p style="color:#374151;font-size:11px;margin-top:12px">
        This email was sent to you as a Bank of Asia Online account holder.
        If you did not request this, please contact
        security@boasiaonline.com immediately.
      </p>
    </div>
  </div>
</body>
</html>`;
}
