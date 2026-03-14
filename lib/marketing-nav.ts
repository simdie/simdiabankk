// ============================================================
// BANK OF ASIA — MARKETING NAV CONFIGURATION
// ============================================================

export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

export type MegaMenuColumn = {
  heading: string;
  links: NavLink[];
};

export type MegaMenuFeatured = {
  title: string;
  subtitle: string;
  cta: string;
  href: string;
};

export type MegaMenuData = {
  columns: MegaMenuColumn[];
  featured?: MegaMenuFeatured;
};

export type NavItem = {
  label: string;
  href?: string;
  megaMenu?: MegaMenuData;
};

// ── Primary navigation ─────────────────────────────────────
export const mainNav: NavItem[] = [
  {
    label: "Personal Banking",
    megaMenu: {
      columns: [
        {
          heading: "Accounts",
          links: [
            { label: "Current Accounts", href: "/personal/current-accounts" },
            { label: "Savings Accounts", href: "/personal/savings" },
            { label: "Term Deposits", href: "/personal/term-deposits" },
            { label: "Youth Accounts", href: "/personal/youth-accounts" },
          ],
        },
        {
          heading: "Cards & Payments",
          links: [
            { label: "VISA Debit Card", href: "/personal/visa-debit" },
            { label: "Virtual VISA Card", href: "/personal/virtual-visa" },
            { label: "Virtual Mastercard", href: "/personal/virtual-mastercard" },
            { label: "International Transfers", href: "/personal/international-transfers" },
          ],
        },
      ],
      featured: {
        title: "New to Bank of Asia?",
        subtitle: "Open a free account in under 5 minutes.",
        cta: "Open Account",
        href: "/register",
      },
    },
  },
  {
    label: "Business",
    megaMenu: {
      columns: [
        {
          heading: "Business Accounts",
          links: [
            { label: "Business Current Account", href: "/business/current-account" },
            { label: "Business Savings", href: "/business/savings" },
            { label: "Merchant Account", href: "/business/merchant" },
            { label: "Startup Account", href: "/business/startup" },
          ],
        },
        {
          heading: "Payments & FX",
          links: [
            { label: "Business Payments", href: "/business/payments" },
            { label: "FX Solutions", href: "/business/fx" },
            { label: "Business Cards", href: "/business/cards" },
            { label: "Mass Payouts", href: "/business/payouts" },
          ],
        },
      ],
      featured: {
        title: "Grow Your Business",
        subtitle: "Banking built for modern businesses of all sizes.",
        cta: "Open Business Account",
        href: "/register",
      },
    },
  },
  {
    label: "International",
    megaMenu: {
      columns: [
        {
          heading: "Transfer Services",
          links: [
            { label: "Send Money Abroad", href: "/international/send" },
            { label: "Receive International Transfers", href: "/international/receive" },
            { label: "Currency Exchange", href: "/international/exchange" },
            { label: "SWIFT / SEPA Transfers", href: "/international/swift-sepa" },
          ],
        },
        {
          heading: "Supported Currencies",
          links: [
            { label: "US Dollar (USD)",        href: "/international/usd" },
            { label: "British Pound (GBP)",    href: "/international/gbp" },
            { label: "Euro (EUR)",             href: "/international/eur" },
            { label: "Australian Dollar (AUD)",href: "/international/aud" },
            { label: "Canadian Dollar (CAD)",  href: "/international/cad" },
            { label: "Swiss Franc (CHF)",      href: "/international/chf" },
            { label: "Japanese Yen (JPY)",     href: "/international/jpy" },
            { label: "Singapore Dollar (SGD)", href: "/international/sgd" },
            { label: "Hong Kong Dollar (HKD)", href: "/international/hkd" },
            { label: "NZ Dollar (NZD)",        href: "/international/nzd" },
          ],
        },
      ],
    },
  },
  {
    label: "Our Story",
    href: "/about",
  },
  {
    label: "News & Insights",
    href: "/news",
  },
];

// ── Utility bar links ──────────────────────────────────────
export const utilityLinks = [
  { label: "Help & Contact", href: "/contact" },
  { label: "Interest Rates", href: "/rates" },
];

// ── Footer navigation ──────────────────────────────────────
export const footerNav = {
  personal: [
    { label: "Current Accounts", href: "/personal/current-accounts" },
    { label: "Savings Accounts", href: "/personal/savings" },
    { label: "Term Deposits", href: "/personal/term-deposits" },
    { label: "VISA & Virtual Cards", href: "/personal/cards" },
    { label: "International Transfers", href: "/personal/international-transfers" },
    { label: "Interest Rates", href: "/rates" },
  ],
  business: [
    { label: "Business Accounts", href: "/business/current-account" },
    { label: "Business Payments", href: "/business/payments" },
    { label: "FX Solutions", href: "/business/fx" },
    { label: "Business Cards", href: "/business/cards" },
  ],
  company: [
    { label: "Our Story", href: "/about" },
    { label: "News & Insights", href: "/news" },
    { label: "Careers", href: "/careers" },
    { label: "Community Impact", href: "/community" },
    { label: "Security Centre", href: "/security" },
  ],
  help: [
    { label: "Help & Contact", href: "/contact" },
    { label: "FAQs", href: "/faqs" },
    { label: "Find a Branch", href: "/branches" },
    { label: "Calculators & Tools", href: "/tools" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};
