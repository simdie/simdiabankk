export type NewsCategory =
  | "Banking Update"
  | "Product News"
  | "Security Tips"
  | "Financial Education"
  | "Company News";

export interface NewsPost {
  slug: string;
  title: string;
  category: NewsCategory;
  excerpt: string;
  date: string; // ISO date string
  readTime: number; // minutes
  featured?: boolean;
  author: string;
  authorRole: string;
  paragraphs: string[];
}

export const NEWS_POSTS: NewsPost[] = [
  {
    slug: "bank-of-asia-supports-10-global-currencies",
    title: "Bank of Asia now supports 10 global currencies",
    category: "Product News",
    excerpt:
      "From today, Bank of Asia Online supports 10 global currencies — USD, AUD, EUR, GBP, JPY, SGD, HKD, CAD, CHF, and NZD — with real-time conversion and no hidden margins.",
    date: "2026-03-10",
    readTime: 4,
    featured: true,
    author: "James Whitfield",
    authorRole: "Chief Product Officer",
    paragraphs: [
      "Bank of Asia Online has expanded its multi-currency support to 10 global currencies, effective today. Customers can now hold, send, receive, and convert between USD, AUD, EUR, GBP, JPY, SGD, HKD, CAD, CHF, and NZD — all from a single account dashboard, with no additional account required for each currency.",
      "Each currency wallet operates independently. You can hold balances in multiple currencies simultaneously, convert between them at our published mid-market rates (plus our flat $8.00 + 0.5% fee), and send international transfers directly from the relevant wallet without manual conversion steps.",
      "Our currency infrastructure is built on ISO 20022 messaging standards and connects directly to the SWIFT network, ensuring that transfers settle reliably and that your beneficiary receives the correct amount in the correct currency — with full traceability at every step.",
      "The 10-currency expansion is the culmination of 18 months of engineering work and regulatory approvals across the jurisdictions where our currencies operate. It required building native ledger support for each currency, integrating with local clearing networks where applicable, and extending our compliance framework to cover the specific AML and sanctions requirements of each currency zone.",
      "For existing customers: your new currency wallets are already visible in your dashboard. No action is required to activate them. For customers considering switching to Bank of Asia, this expansion means you no longer need separate accounts with multiple banks to manage a multi-currency financial life.",
      "The next phase of our currency roadmap, planned for Q3 2026, will include CNY for qualified business customers and expanded support for cross-currency standing orders. We will publish detailed timelines as approvals are confirmed.",
    ],
  },
  {
    slug: "how-our-2fa-system-protects-your-account",
    title: "How our 2FA system protects your account",
    category: "Security Tips",
    excerpt:
      "Two-factor authentication is Bank of Asia's primary defence against unauthorised access. Here's exactly how it works and why you should never share your codes.",
    date: "2026-02-20",
    readTime: 5,
    author: "Priya Sharma",
    authorRole: "Head of Security",
    paragraphs: [
      "Two-factor authentication (2FA) requires two independent proofs of identity before granting access to your account: something you know (your password) and something you have (your registered device or authenticator app). Even if an attacker obtains your password — through phishing, data breaches, or credential stuffing — they cannot access your account without also controlling your second factor.",
      "Bank of Asia Online supports three forms of 2FA: SMS one-time codes (OTP), authenticator app TOTP codes (Google Authenticator, Authy, or any RFC 6238-compliant app), and biometric verification via our mobile app. We strongly recommend authenticator app codes over SMS, as SMS is vulnerable to SIM-swapping attacks in which a criminal convinces your carrier to transfer your number to a new SIM they control.",
      "Our 2FA implementation uses time-based one-time passwords (TOTP) that are valid for 30 seconds and are cryptographically linked to your enrolled device. Each code is single-use: once it is accepted, it is immediately invalidated. Our systems also implement rate limiting and progressive lockout — after three consecutive failed 2FA attempts, your account is temporarily locked and you are notified by email.",
      "One of the most common 2FA bypass techniques is social engineering: a criminal calls you pretending to be bank staff and asks you to read out your code 'for verification purposes'. Bank of Asia Online staff will NEVER ask for your 2FA code, your password, or your PIN. If someone calls claiming to be from us and asks for these details, hang up immediately and call our official number: +65 6123 4567.",
      "If you lose access to your 2FA device, we have a secure account recovery process that involves identity verification via government-issued ID and a mandatory 24-hour security hold before access is restored. This delay is intentional: it gives you time to detect and report any unauthorised recovery attempts.",
      "We review our authentication architecture quarterly against NIST 800-63B guidance and update our implementation as new attack patterns emerge. Security is not a feature we ship once — it is a practice we maintain continuously.",
    ],
  },
  {
    slug: "swift-transfers-explained",
    title: "SWIFT transfers explained: what you need to know",
    category: "Financial Education",
    excerpt:
      "SWIFT is the backbone of international banking — but most people have no idea how it works. Here's a plain-language guide to what happens when you send money across borders.",
    date: "2026-02-05",
    readTime: 6,
    author: "Marcus Li",
    authorRole: "Head of International Banking",
    paragraphs: [
      "SWIFT stands for the Society for Worldwide Interbank Financial Telecommunication. It is a cooperative network that enables financial institutions to securely exchange standardised messages about financial transactions. SWIFT does not move money itself — it moves the instructions that tell banks where to send money and how much.",
      "When you initiate an international transfer from Bank of Asia Online, several things happen in sequence. First, our system validates your beneficiary details — IBAN or account number, BIC/SWIFT code, and the receiving bank's address. Then we send a SWIFT MT103 message (or the newer ISO 20022 equivalent) through the SWIFT network to the correspondent banking chain.",
      "Most international transfers do not go directly from your bank to the beneficiary's bank. Instead, they pass through one or more correspondent banks — large institutions that maintain accounts on behalf of smaller banks in different countries. This is why you sometimes see multiple fees or why a transfer to a small bank in a less-common currency can take longer than one to a major institution.",
      "The typical timeline for a SWIFT transfer is 1–3 business days, though transfers within the same currency zone (e.g., GBP to a UK bank) often settle the same day via faster local rails. Delays occur when correspondent banks require additional compliance screening, when beneficiary bank details are incorrect, or when transfers fall outside local banking hours.",
      "Bank of Asia Online publishes our full fee schedule transparently: $8.00 flat fee plus 0.5% of the transfer value. This covers our SWIFT messaging costs and our correspondent banking fees. We do not apply a hidden margin to the exchange rate — the rate you see in our converter is the rate applied to your transfer, with the fee listed separately.",
      "One common source of confusion is that the beneficiary may receive slightly less than the converted amount you sent. This happens when the receiving bank or an intermediary correspondent charges their own fee before the funds arrive. While we absorb our own costs in the stated fee, we cannot control fees charged by third-party banks in the correspondent chain. Transfers to major banks in USD, EUR, GBP, AUD, and SGD typically arrive with no additional deductions.",
    ],
  },
  {
    slug: "introducing-virtual-visa-mastercard-cards",
    title: "Introducing virtual VISA and Mastercard cards",
    category: "Product News",
    excerpt:
      "Bank of Asia Online now issues both virtual VISA and virtual Mastercard — so you can choose the network that works best for your spending, instantly from your dashboard.",
    date: "2026-01-25",
    readTime: 4,
    author: "Sarah Anderson",
    authorRole: "Product Manager, Cards",
    paragraphs: [
      "Effective today, Bank of Asia Online customers can issue both a virtual VISA and a virtual Mastercard from their account dashboard — no waiting for plastic, no additional KYC required. Each card is linked to your primary USD account and can be used for any online or in-person contactless payment worldwide.",
      "Why two networks? VISA and Mastercard are accepted almost universally, but there are edge cases — certain merchants, subscription platforms, and travel providers — where one network may be preferred or where one will process a transaction that the other declines. Having both available gives you maximum acceptance and a backup option when you need one.",
      "Each virtual card has a unique 16-digit card number, CVV, and expiry date that is separate from any other card in your wallet. You can freeze or permanently cancel either card instantly from the app without affecting the other. Cards that are not in active use can be set to a 'paused' state that allows no new transactions while preserving the card details for future reactivation.",
      "For enhanced security, virtual cards support per-transaction spending controls. You can set a maximum spend per transaction, restrict usage to specific merchant category codes (e.g., online-only or travel-only), and enable real-time push notifications for every transaction. These controls are managed from the Cards section of your dashboard.",
      "Physical cards, where available in your region, share the same number as the corresponding virtual card. If you have requested a physical card and it is in transit, you can use the virtual card immediately while waiting for the physical card to arrive — they work interchangeably.",
      "We are also planning to launch premium metal cards for customers who maintain a qualifying balance or transaction volume. Details on the metal card programme will be announced in Q2 2026. In the meantime, both virtual networks are available to all Bank of Asia Online customers at no additional cost.",
    ],
  },
  {
    slug: "understanding-exchange-rates-fx-fees",
    title: "Understanding exchange rates and FX fees",
    category: "Financial Education",
    excerpt:
      "Most banks quietly profit on currency conversion. Here's how exchange rates actually work — and what to look for when comparing FX costs.",
    date: "2026-01-10",
    readTime: 5,
    author: "David Chen",
    authorRole: "Senior FX Analyst",
    paragraphs: [
      "Every time you convert one currency to another, there is a cost — even when a bank advertises 'no fees'. That cost is usually embedded in the exchange rate itself, as a 'spread' between the mid-market rate (the true market rate, available on Google or XE.com) and the rate actually applied to your transaction. A bank might show the mid-market rate on their website but apply a 2–4% margin when you actually convert.",
      "The mid-market rate is the midpoint between the current buy and sell prices for a currency pair on global forex markets. It is not a rate that any individual customer can trade at — it is a benchmark. What matters is how far from that benchmark the rate applied to your transaction sits.",
      "Traditional banks typically embed a 2–4% FX margin, which on a $10,000 transfer amounts to $200–$400 in hidden cost. Add a flat transfer fee of $15–$40, and the total cost of sending money internationally through a traditional bank can easily reach $400–$500 per transaction.",
      "Bank of Asia Online applies the mid-market rate and charges a transparent flat fee of $8.00 plus 0.5% of the transfer value. On a $10,000 transfer, that is $58.00 total — a fraction of what traditional banks charge. Our Currency Converter tool shows you exactly what the recipient will receive before you confirm the transfer.",
      "When comparing FX providers, always ask: (1) what rate do you apply — mid-market or a marked-up rate? (2) are there any additional fees beyond the stated transfer fee? (3) are there correspondent bank fees that will reduce what the recipient receives? Transparent providers answer all three questions clearly before you transact.",
      "For frequent or large FX conversions, Bank of Asia Online also offers FX forward contracts for qualifying business customers — allowing you to lock in a rate today for settlement up to 90 days in the future. This protects against adverse rate movements if you have known future FX obligations. Contact our business banking team for details.",
    ],
  },
  {
    slug: "bank-of-asia-50000-customer-milestone",
    title: "Bank of Asia reaches 50,000 customer milestone",
    category: "Company News",
    excerpt:
      "We've reached 50,000 customers — a milestone that humbles us and motivates us to build even better. Thank you for banking with us.",
    date: "2025-12-15",
    readTime: 3,
    author: "Michael Torres",
    authorRole: "Chief Executive Officer",
    paragraphs: [
      "Bank of Asia Online has reached 50,000 active customers — a milestone we could not have imagined when we launched our beta in early 2024. To every one of you who chose to bank with us: thank you. This is your milestone as much as ours.",
      "Our growth has been almost entirely organic, driven by word of mouth and the referral programme we launched in June 2025. Our average Net Promoter Score over the past 12 months was 72, which places us among the top-rated digital banks globally. That score represents real people recommending Bank of Asia to friends and colleagues — and we don't take it lightly.",
      "What does 50,000 customers tell us? It tells us that people want a bank that is honest about fees, that moves money reliably across borders, and that doesn't require a branch visit to open an account or resolve a problem. It tells us that there is significant demand for a bank built on trust, transparency, and genuine service quality.",
      "Reaching 50,000 also means we are approaching the scale at which we can invest more deeply in the features our customers have been asking for: joint accounts, scheduled FX conversions, business multi-user access, and expanded currency support. Each of these is on our 2026 roadmap with committed delivery dates.",
      "To celebrate this milestone, we are offering a limited-time 5.10% p.a. 12-month term deposit rate for new deposits of $10,000 or more opened before 31 January 2026. This offer is our way of sharing a small part of our success with the people who made it possible. Details are available on our Interest Rates page.",
    ],
  },
];

export function getPostBySlug(slug: string): NewsPost | undefined {
  return NEWS_POSTS.find((p) => p.slug === slug);
}

export function getRelatedPosts(current: NewsPost, count = 3): NewsPost[] {
  return NEWS_POSTS.filter(
    (p) => p.slug !== current.slug && p.category === current.category
  )
    .concat(NEWS_POSTS.filter((p) => p.slug !== current.slug && p.category !== current.category))
    .slice(0, count);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
