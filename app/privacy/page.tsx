import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-nexus-950)", padding: "60px 24px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 48, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 32 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 32 }}>
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <path d="M20 2L4 10V20C4 28.8 11.2 36.4 20 38C28.8 36.4 36 28.8 36 20V10L20 2Z" fill="rgba(0,212,255,0.15)" stroke="rgba(0,212,255,0.5)" strokeWidth="1.5"/>
              <path d="M13 20L18 25L27 15" stroke="#00D4FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontFamily: "var(--font-syne)", fontSize: 16, fontWeight: 800, color: "var(--color-accent)" }}>BANK OF ASIA</span>
          </Link>
          <h1 style={{ fontFamily: "var(--font-syne)", fontSize: 36, fontWeight: 800, color: "var(--color-text-primary)", marginBottom: 8 }}>
            Privacy Policy
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>Last updated: March 2026 · Effective: January 1, 2026</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 40, color: "var(--color-text-secondary)", lineHeight: 1.8, fontSize: 15 }}>

          <Section title="1. Introduction">
            Bank of Asia Online ("we", "us", or "our") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, share, and protect your data when you use our digital banking services. By using our services, you consent to the practices described in this policy.
          </Section>

          <Section title="2. Information We Collect">
            <p><strong style={{ color: "var(--color-text-primary)" }}>Personal Information:</strong></p>
            <ul>
              <li>Full name, email address, phone number</li>
              <li>Date of birth, gender, nationality</li>
              <li>Home address and country of residence</li>
              <li>Government-issued ID documents (for KYC verification)</li>
            </ul>
            <p><strong style={{ color: "var(--color-text-primary)" }}>Financial Information:</strong></p>
            <ul>
              <li>Account balances and transaction history</li>
              <li>Transfer recipients and beneficiary details</li>
              <li>Virtual card usage data</li>
            </ul>
            <p><strong style={{ color: "var(--color-text-primary)" }}>Technical Information:</strong></p>
            <ul>
              <li>IP addresses and device information</li>
              <li>Browser type and operating system</li>
              <li>Login timestamps and session data</li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            <ul>
              <li>To provide, maintain, and improve our banking services</li>
              <li>To process transactions and send related notifications</li>
              <li>To verify your identity and comply with KYC/AML obligations</li>
              <li>To detect, prevent, and respond to fraud or security incidents</li>
              <li>To communicate important account and service updates</li>
              <li>To comply with legal and regulatory requirements</li>
            </ul>
          </Section>

          <Section title="4. Data Sharing">
            <p>We do not sell your personal data. We may share information with:</p>
            <ul>
              <li><strong style={{ color: "var(--color-text-primary)" }}>Service Providers:</strong> Third-party vendors who assist in delivering our services (e.g., email delivery, cloud infrastructure)</li>
              <li><strong style={{ color: "var(--color-text-primary)" }}>Regulatory Authorities:</strong> When required by law, court order, or regulatory mandate</li>
              <li><strong style={{ color: "var(--color-text-primary)" }}>Financial Institutions:</strong> Correspondent banks involved in processing wire transfers</li>
              <li><strong style={{ color: "var(--color-text-primary)" }}>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </Section>

          <Section title="5. Data Security">
            We implement industry-standard security measures including 256-bit SSL/TLS encryption, multi-factor authentication, and regular security audits to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.
          </Section>

          <Section title="6. Data Retention">
            We retain your personal data for as long as your account is active or as needed to provide services, comply with legal obligations, resolve disputes, and enforce our agreements. Transaction records are retained for a minimum of 7 years in accordance with financial regulations.
          </Section>

          <Section title="7. Your Rights">
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul>
              <li>Access and obtain a copy of your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data (subject to legal obligations)</li>
              <li>Object to or restrict processing of your data</li>
              <li>Data portability</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>
            <p>To exercise these rights, contact us at <a href="mailto:privacy@bankofasia.com" style={{ color: "var(--color-accent)" }}>privacy@bankofasia.com</a>.</p>
          </Section>

          <Section title="8. Cookies">
            We use session cookies strictly necessary for authentication and security. We do not use tracking or advertising cookies. You can control cookie settings through your browser, though disabling session cookies will prevent you from using the Service.
          </Section>

          <Section title="9. International Transfers">
            Your data may be processed in countries outside your jurisdiction. We ensure appropriate safeguards are in place for international data transfers, including Standard Contractual Clauses where applicable.
          </Section>

          <Section title="10. Changes to this Policy">
            We may update this Privacy Policy from time to time. We will notify you of any significant changes via email or prominent notice on our platform. Your continued use of the Service after such notice constitutes acceptance of the updated policy.
          </Section>

          <Section title="11. Contact Us">
            For privacy-related questions or requests, contact our Data Protection Officer at <a href="mailto:privacy@bankofasia.com" style={{ color: "var(--color-accent)" }}>privacy@bankofasia.com</a> or write to: Bank of Asia Online, Data Protection, 1 Raffles Place, Singapore 048616.
          </Section>

        </div>

        <div style={{ marginTop: 60, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>© 2026 Bank of Asia Online. All rights reserved.</span>
          <div style={{ display: "flex", gap: 24 }}>
            <Link href="/terms" style={{ fontSize: 13, color: "var(--color-accent)", textDecoration: "none" }}>Terms of Service</Link>
            <Link href="/login" style={{ fontSize: 13, color: "var(--color-text-muted)", textDecoration: "none" }}>Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 style={{ fontFamily: "var(--font-syne)", fontSize: 20, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {title}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {typeof children === "string" ? <p>{children}</p> : children}
      </div>
    </section>
  );
}
