import Link from "next/link";

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>Last updated: March 2026 · Effective: January 1, 2026</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 40, color: "var(--color-text-secondary)", lineHeight: 1.8, fontSize: 15 }}>

          <Section title="1. Acceptance of Terms">
            By creating an account and using Bank of Asia Online ("the Service"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not access the Service. These terms apply to all visitors, users, and others who access or use the Service.
          </Section>

          <Section title="2. Account Registration">
            <p>To use our banking services, you must:</p>
            <ul>
              <li>Be at least 18 years of age</li>
              <li>Provide accurate, complete, and current information</li>
              <li>Maintain the security of your password and accept all risks of unauthorized access</li>
              <li>Promptly notify us of any unauthorized use of your account</li>
            </ul>
            <p>You are responsible for all activities that occur under your account. Bank of Asia Online reserves the right to suspend or terminate accounts that violate these terms.</p>
          </Section>

          <Section title="3. Banking Services">
            Bank of Asia Online provides digital banking services including but not limited to: multi-currency accounts, domestic and international wire transfers, virtual card issuance, and account management tools. All services are subject to applicable laws, regulations, and our internal policies. We reserve the right to modify, suspend, or discontinue any service at any time.
          </Section>

          <Section title="4. Transfers and Transactions">
            <p>When initiating transfers:</p>
            <ul>
              <li>You confirm that funds are from legitimate sources</li>
              <li>International wire transfers may be subject to correspondent bank fees</li>
              <li>Transfer limits apply as configured by system administrators</li>
              <li>Transactions may require additional verification for security purposes</li>
              <li>Completed transactions cannot be reversed unless explicitly stated</li>
            </ul>
          </Section>

          <Section title="5. KYC and Compliance">
            Bank of Asia Online is committed to full compliance with applicable Anti-Money Laundering (AML) and Know Your Customer (KYC) regulations. We may require identity verification documents before activating your account or processing certain transactions. Failure to provide requested documentation may result in account restrictions or closure.
          </Section>

          <Section title="6. Privacy and Data">
            Your use of the Service is also governed by our <Link href="/privacy" style={{ color: "var(--color-accent)" }}>Privacy Policy</Link>, which is incorporated into these Terms by reference. We collect, process, and protect your personal data in accordance with applicable data protection laws.
          </Section>

          <Section title="7. Prohibited Activities">
            <p>You may not use Bank of Asia Online to:</p>
            <ul>
              <li>Engage in money laundering or terrorist financing</li>
              <li>Conduct fraudulent transactions or identity theft</li>
              <li>Circumvent security measures or access systems without authorization</li>
              <li>Violate any applicable local, national, or international law or regulation</li>
              <li>Transmit unsolicited commercial communications</li>
            </ul>
          </Section>

          <Section title="8. Limitation of Liability">
            To the maximum extent permitted by applicable law, Bank of Asia Online shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation loss of profits, data, goodwill, or other intangible losses, resulting from your use of or inability to use the Service.
          </Section>

          <Section title="9. Governing Law">
            These Terms shall be governed by and construed in accordance with the laws of Singapore, without regard to its conflict of law provisions. You agree to submit to the personal jurisdiction of the courts located in Singapore for resolution of any disputes.
          </Section>

          <Section title="10. Changes to Terms">
            We reserve the right to modify these terms at any time. We will notify users of significant changes via email or in-app notification. Continued use of the Service after changes constitutes acceptance of the new terms.
          </Section>

          <Section title="11. Contact">
            If you have questions about these Terms, please contact us at <a href="mailto:legal@bankofasia.com" style={{ color: "var(--color-accent)" }}>legal@bankofasia.com</a>.
          </Section>

        </div>

        <div style={{ marginTop: 60, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>© 2026 Bank of Asia Online. All rights reserved.</span>
          <div style={{ display: "flex", gap: 24 }}>
            <Link href="/privacy" style={{ fontSize: 13, color: "var(--color-accent)", textDecoration: "none" }}>Privacy Policy</Link>
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
