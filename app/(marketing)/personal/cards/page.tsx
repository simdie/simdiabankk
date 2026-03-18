"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import FaqAccordion from "@/components/marketing/FaqAccordion";
import type { FaqItem } from "@/components/marketing/FaqAccordion";
import EditorialBanner from "@/components/marketing/EditorialBanner";

// ── FAQ data ──────────────────────────────────────────────

const FAQS: FaqItem[] = [
  {
    q: "How do I get a virtual card?",
    a: "Once your Bank of Asia account is active, go to the Cards section of your dashboard and click 'Request New Card'. Your virtual card is generated instantly with a unique 16-digit number, expiry date, and CVV.",
  },
  {
    q: "Is there a fee for virtual cards?",
    a: "No. Virtual VISA and Mastercard cards are completely free to generate and maintain. You can hold up to 3 virtual cards per account with no issuance or monthly fees.",
  },
  {
    q: "Can I use my virtual card for physical purchases?",
    a: "Virtual cards are designed for online and card-not-present transactions. They cannot be used at physical point-of-sale terminals. For in-person payments, we recommend linking your account to Apple Pay or Google Pay (coming soon).",
  },
  {
    q: "What happens if my card details are compromised?",
    a: "Immediately freeze the card from your dashboard. You can then generate a new card with entirely new details. The compromised card is permanently cancelled and cannot be reactivated.",
  },
  {
    q: "How many virtual cards can I have?",
    a: "Each Bank of Asia account supports up to 3 active virtual cards simultaneously — a mix of VISA and Mastercard. You can delete and regenerate cards at any time.",
  },
];

// ── Animation variants ────────────────────────────────────

const heroStagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.13,
    },
  },
};

const heroChild = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

// ── SVG helpers ───────────────────────────────────────────

const ChipSVG = () => (
  <svg width="28" height="22" viewBox="0 0 28 22">
    <rect x="0" y="0" width="12" height="10" rx="2" fill="#C8972A" opacity="0.9" />
    <rect x="16" y="0" width="12" height="10" rx="2" fill="#C8972A" opacity="0.7" />
    <rect x="0" y="12" width="12" height="10" rx="2" fill="#C8972A" opacity="0.7" />
    <rect x="16" y="12" width="12" height="10" rx="2" fill="#C8972A" opacity="0.9" />
  </svg>
);

const MastercardCirclesSVG = ({
  width = 36,
  height = 22,
}: {
  width?: number;
  height?: number;
}) => (
  <svg width={width} height={height} viewBox="0 0 36 22">
    <circle cx="13" cy="11" r="10" fill="#EB001B" opacity="0.9" />
    <circle cx="23" cy="11" r="10" fill="#F79E1B" opacity="0.85" />
  </svg>
);

const WavySVG = () => (
  <svg width="80" height="16" viewBox="0 0 80 16">
    <path
      d="M0 8 Q10 2 20 8 Q30 14 40 8 Q50 2 60 8 Q70 14 80 8"
      stroke="#aaa"
      strokeWidth="1"
      fill="none"
    />
  </svg>
);

// ── Card face components ──────────────────────────────────

function VisaCardFront() {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0A1628 0%, #162B52 60%, #0F2040 100%)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 16,
        padding: "16px 18px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        width: "100%",
        height: "100%",
        boxSizing: "border-box" as const,
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span
          style={{
            fontSize: 8,
            fontFamily: "var(--font-dm-sans)",
            color: "rgba(255,255,255,0.55)",
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
          }}
        >
          BANK OF ASIA
        </span>
        <ChipSVG />
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          color: "#fff",
          letterSpacing: "0.08em",
        }}
      >
        •••• •••• •••• 4821
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 9,
              fontFamily: "var(--font-dm-sans)",
              color: "rgba(255,255,255,0.7)",
              textTransform: "uppercase" as const,
              letterSpacing: "0.1em",
            }}
          >
            JAMES CHEN
          </div>
          <div
            style={{
              fontSize: 9,
              fontFamily: "var(--font-mono)",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            05/28
          </div>
        </div>
        <span
          style={{
            fontFamily: "var(--font-syne)",
            fontSize: 18,
            fontWeight: 700,
            fontStyle: "italic",
            color: "#fff",
          }}
        >
          VISA
        </span>
      </div>
    </div>
  );
}

function VisaCardBack() {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0A1628, #0F2040)",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        width: "100%",
        height: "100%",
        boxSizing: "border-box" as const,
        position: "relative" as const,
      }}
    >
      <div
        style={{
          width: "100%",
          height: 32,
          background: "#111",
          marginTop: 20,
        }}
      />
      <div
        style={{
          margin: "8px 12px 0",
          height: 28,
          background: "rgba(255,255,255,0.9)",
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          paddingLeft: 8,
          paddingRight: 8,
        }}
      >
        <WavySVG />
        <span
          style={{
            fontSize: 8,
            fontFamily: "var(--font-mono)",
            color: "#555",
            marginLeft: "auto",
          }}
        >
          CVV: ***
        </span>
      </div>
      <span
        style={{
          position: "absolute",
          bottom: 12,
          right: 12,
          fontFamily: "var(--font-syne)",
          fontSize: 8,
          fontStyle: "italic",
          color: "rgba(255,255,255,0.4)",
        }}
      >
        VISA
      </span>
    </div>
  );
}

function MastercardFront() {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1a0a0a 0%, #2d0f0f 50%, #1a1010 100%)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 16,
        padding: "16px 18px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        width: "100%",
        height: "100%",
        boxSizing: "border-box" as const,
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span
          style={{
            fontSize: 8,
            fontFamily: "var(--font-dm-sans)",
            color: "rgba(255,255,255,0.55)",
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
          }}
        >
          BANK OF ASIA
        </span>
        <MastercardCirclesSVG />
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          color: "#fff",
          letterSpacing: "0.08em",
        }}
      >
        •••• •••• •••• 9203
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 9,
              fontFamily: "var(--font-dm-sans)",
              color: "rgba(255,255,255,0.7)",
              textTransform: "uppercase" as const,
              letterSpacing: "0.08em",
            }}
          >
            SARAH WONG
          </div>
          <div
            style={{
              fontSize: 9,
              fontFamily: "var(--font-mono)",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            09/27
          </div>
        </div>
        <span
          style={{
            fontSize: 9,
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 500,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          mastercard
        </span>
      </div>
    </div>
  );
}

function MastercardBack() {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1a0a0a, #2d0f0f)",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        width: "100%",
        height: "100%",
        boxSizing: "border-box" as const,
        position: "relative" as const,
      }}
    >
      <div
        style={{
          width: "100%",
          height: 32,
          background: "#111",
          marginTop: 20,
        }}
      />
      <div
        style={{
          margin: "8px 12px 0",
          height: 28,
          background: "rgba(255,255,255,0.9)",
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          paddingLeft: 8,
          paddingRight: 8,
        }}
      >
        <WavySVG />
        <span
          style={{
            fontSize: 8,
            fontFamily: "var(--font-mono)",
            color: "#555",
            marginLeft: "auto",
          }}
        >
          CVV: ***
        </span>
      </div>
      <div style={{ position: "absolute", bottom: 12, right: 12 }}>
        <MastercardCirclesSVG width={24} height={15} />
      </div>
    </div>
  );
}

// ── Spinning card wrapper ─────────────────────────────────

function SpinningCard({
  front,
  back,
  duration,
}: {
  front: React.ReactNode;
  back: React.ReactNode;
  duration: number;
}) {
  return (
    <div style={{ width: 210, height: 130, perspective: "1000px" }}>
      <motion.div
        animate={{ rotateY: 360 }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
        style={{
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
          }}
        >
          {front}
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}

// ── Security icons ────────────────────────────────────────

function IconCard() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: "var(--boa-teal)" }}>
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M7 12l3 3 7-6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconFreeze() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: "var(--boa-teal)" }}>
      <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <line x1="5" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: "var(--boa-teal)" }}>
      <path
        d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6L12 2z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <rect x="10" y="10" width="4" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 10V8.5a2 2 0 014 0V10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconEye() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: "var(--boa-teal)" }}>
      <path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

// ── Page component ────────────────────────────────────────

export default function CardsPage() {
  const visaFeatures = [
    "Instant generation — no waiting period",
    "Full CVV + expiry visible in dashboard",
    "Freeze or unfreeze in one tap",
    "Up to 3 cards per account",
    "Zero issuance or maintenance fee",
    "Accepted for online payments worldwide",
  ];

  const mcFeatures = [
    "Instant generation — available immediately",
    "Full 16-digit number, CVV + expiry",
    "Freeze or cancel from your dashboard",
    "Separate card for each account",
    "Zero issuance or maintenance fee",
    "Global acceptance in 210+ countries",
  ];

  const securityCards = [
    {
      icon: <IconCard />,
      title: "Use a separate card per merchant",
      body: "Generate a dedicated virtual card for subscriptions or high-risk vendors. Cancel it instantly if needed.",
    },
    {
      icon: <IconFreeze />,
      title: "Freeze immediately if compromised",
      body: "Suspect fraud? Freeze your card in seconds from the dashboard — no phone call required.",
    },
    {
      icon: <IconShield />,
      title: "Never expose your primary card",
      body: "Virtual cards keep your primary account number hidden from online merchants entirely.",
    },
    {
      icon: <IconEye />,
      title: "CVV masked by default",
      body: "Your CVV and full card number are hidden until you choose to reveal them, with 2FA confirmation.",
    },
  ];

  return (
    <>
      {/* ══════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════ */}
      <section
        style={{
          background: "#0A1628",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          paddingTop: 96,
          paddingBottom: 96,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dot-grid overlay */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
          }}
        />
        {/* Ambient bottom glow */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "35%",
            background:
              "radial-gradient(ellipse at 50% 100%, rgba(0,200,150,0.06), transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="boa-container" style={{ position: "relative", zIndex: 1, width: "100%" }}>
          <div
            style={{ display: "grid", gap: 48, alignItems: "center" }}
            className="grid-cols-1 lg:grid-cols-[50%_50%]"
          >
            {/* LEFT — text stack */}
            <motion.div
              variants={heroStagger}
              initial="hidden"
              animate="show"
              style={{ display: "flex", flexDirection: "column", gap: 24 }}
            >
              {/* Eyebrow pill */}
              <motion.div variants={heroChild}>
                <span
                  style={{
                    display: "inline-block",
                    background: "rgba(0,200,150,0.1)",
                    border: "1px solid rgba(0,200,150,0.28)",
                    color: "var(--boa-teal)",
                    borderRadius: 9999,
                    padding: "6px 16px",
                    fontSize: 12,
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  VIRTUAL CARDS
                </span>
              </motion.div>

              {/* H1 */}
              <motion.h1
                variants={heroChild}
                style={{
                  fontFamily: "var(--font-syne)",
                  fontSize: "clamp(36px, 5vw, 60px)",
                  color: "#fff",
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                Cards for every type of spend.
              </motion.h1>

              {/* Body */}
              <motion.p
                variants={heroChild}
                style={{
                  fontSize: 17,
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: "var(--font-dm-sans)",
                  lineHeight: 1.75,
                  margin: 0,
                }}
              >
                Instant virtual VISA and Mastercard cards. Generate in seconds, freeze anytime,
                use everywhere.
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={heroChild}
                style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
              >
                <Link
                  href="/register" target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    background: "var(--boa-teal)",
                    color: "#0A1628",
                    borderRadius: 8,
                    padding: "12px 28px",
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 700,
                    fontSize: 15,
                    textDecoration: "none",
                  }}
                >
                  Get My Card
                </Link>
                <Link
                  href="#security"
                  style={{
                    display: "inline-block",
                    background: "transparent",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.4)",
                    borderRadius: 8,
                    padding: "12px 28px",
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 600,
                    fontSize: 15,
                    textDecoration: "none",
                  }}
                >
                  View Security
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                variants={heroChild}
                style={{ display: "flex", gap: 20, flexWrap: "wrap" }}
              >
                {["Zero issuance fee", "Instant generation", "Freeze anytime"].map((badge) => (
                  <span
                    key={badge}
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.55)",
                      fontFamily: "var(--font-dm-sans)",
                    }}
                  >
                    <span style={{ color: "var(--boa-teal)", marginRight: 4 }}>✓</span>
                    {badge}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* RIGHT — Globe with floating cards (hidden on mobile) */}
            <div
              className="hidden lg:flex"
              style={{
                position: "relative",
                width: "100%",
                minHeight: "520px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Background glow */}
              <div
                style={{
                  position: "absolute",
                  width: 300,
                  height: 300,
                  borderRadius: "50%",
                  background: "rgba(0,200,150,0.06)",
                  filter: "blur(60px)",
                  zIndex: 0,
                }}
              />

              {/* Globe — slowly rotating */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                style={{
                  position: "absolute",
                  width: 420,
                  height: 420,
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 35% 35%, #1E3A5F, #0A1628 70%)",
                  border: "1px solid rgba(0,200,150,0.15)",
                  overflow: "hidden",
                  boxShadow: "0 0 60px rgba(0,200,150,0.08), inset 0 0 60px rgba(0,0,0,0.4)",
                }}
              >
                <svg width="420" height="420" style={{ opacity: 0.6 }}>
                  {/* North America */}
                  {[
                    [65,90],[75,95],[85,92],[95,100],[70,108],[80,112],[90,108],
                    [100,115],[110,110],[75,120],[85,118],[95,122],[105,125],
                    [115,120],[80,130],[90,128],[100,132],[110,135],[120,128],
                    [85,142],[95,138],[105,142],[115,138],[125,142],[130,135],
                    [70,98],[60,105],[65,115],
                  ].map(([cx,cy], i) => (
                    <circle key={`na${i}`} cx={cx} cy={cy} r="2" fill="#00C896" opacity="0.7"/>
                  ))}
                  {/* South America */}
                  {[
                    [105,188],[115,185],[110,195],[120,192],[108,205],[118,202],
                    [112,215],[122,212],[116,225],[124,222],[118,235],[126,232],
                    [120,245],[128,242],[122,255],[125,265],[128,272],
                  ].map(([cx,cy], i) => (
                    <circle key={`sa${i}`} cx={cx} cy={cy} r="2" fill="#00C896" opacity="0.7"/>
                  ))}
                  {/* Europe */}
                  {[
                    [188,82],[198,80],[208,82],[218,80],[192,92],[202,90],
                    [212,88],[222,90],[188,100],[198,98],[208,96],[218,98],
                    [228,95],[192,108],[202,106],[212,108],[220,106],
                  ].map(([cx,cy], i) => (
                    <circle key={`eu${i}`} cx={cx} cy={cy} r="2" fill="#00C896" opacity="0.7"/>
                  ))}
                  {/* Africa */}
                  {[
                    [192,142],[202,140],[212,142],[222,140],[188,152],[198,150],
                    [208,152],[218,150],[228,148],[192,162],[202,160],[212,162],
                    [222,160],[196,172],[206,170],[216,172],[200,182],[210,180],
                    [204,192],[212,190],[206,202],[212,210],[208,220],[210,230],
                    [208,238],[209,245],
                  ].map(([cx,cy], i) => (
                    <circle key={`af${i}`} cx={cx} cy={cy} r="2" fill="#00C896" opacity="0.7"/>
                  ))}
                  {/* Asia */}
                  {[
                    [235,75],[245,72],[255,75],[265,72],[275,75],[285,72],[295,75],
                    [238,85],[248,82],[258,85],[268,82],[278,85],[288,82],[298,85],[308,82],
                    [240,95],[250,92],[260,95],[270,92],[280,95],[290,92],[300,95],[310,92],[320,90],
                    [245,105],[255,102],[265,105],[275,102],[285,105],[295,102],[305,105],[315,102],[325,100],
                    [248,115],[258,112],[268,115],[278,112],[288,115],[298,112],[308,115],[318,112],
                    [250,125],[260,122],[270,125],[280,122],[290,125],[300,122],[310,125],
                    [255,135],[265,132],[275,135],[285,132],[295,135],
                    [260,145],[270,142],[280,145],[265,155],[275,152],[268,162],[275,168],[270,175],
                  ].map(([cx,cy], i) => (
                    <circle key={`as${i}`} cx={cx} cy={cy} r="2" fill="#00C896" opacity="0.7"/>
                  ))}
                  {/* Australia */}
                  {[
                    [305,228],[315,225],[325,228],[335,225],[345,228],[308,238],
                    [318,235],[328,238],[338,235],[348,232],[312,248],[322,245],
                    [332,248],[342,245],[318,258],[328,255],[335,258],[322,265],[330,262],
                  ].map(([cx,cy], i) => (
                    <circle key={`au${i}`} cx={cx} cy={cy} r="2" fill="#00C896" opacity="0.7"/>
                  ))}
                </svg>
              </motion.div>

              {/* Orbital ring 1 */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                style={{
                  position: "absolute",
                  width: 500,
                  height: 140,
                  borderRadius: "50%",
                  border: "1px solid rgba(0,200,150,0.25)",
                  transform: "rotateX(75deg)",
                }}
              />
              {/* Orbital ring 2 */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                style={{
                  position: "absolute",
                  width: 480,
                  height: 120,
                  borderRadius: "50%",
                  border: "1px dashed rgba(200,151,42,0.2)",
                  transform: "rotateX(75deg) rotateZ(45deg)",
                }}
              />

              {/* VISA card floating top-left */}
              <motion.div
                animate={{ y: [0, -14, 0], x: [0, 5, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  top: "12%",
                  left: "2%",
                  width: 240,
                  height: 148,
                  borderRadius: 14,
                  background: "linear-gradient(135deg, #0D2144 0%, #1A3A6E 60%, #0A2855 100%)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  padding: 20,
                  boxShadow: "0 20px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
                  zIndex: 10,
                  backdropFilter: "blur(10px)",
                  boxSizing: "border-box" as const,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase" as const }}>
                    Bank of Asia
                  </span>
                  <svg width="28" height="22" viewBox="0 0 28 22">
                    <rect x="0" y="0" width="28" height="22" rx="4" fill="#C8972A" opacity="0.9"/>
                    <rect x="10" y="0" width="8" height="22" fill="#A07820" opacity="0.5"/>
                    <rect x="0" y="7" width="28" height="8" fill="#A07820" opacity="0.5"/>
                    <rect x="11" y="8" width="6" height="6" rx="1" fill="#C8972A"/>
                  </svg>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono','Courier New',monospace", fontSize: 13, color: "#fff", letterSpacing: "0.2em", marginBottom: 14 }}>
                  •••• •••• •••• 4821
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 7, letterSpacing: "0.1em", marginBottom: 2, textTransform: "uppercase" as const }}>Cardholder</div>
                    <div style={{ color: "#fff", fontSize: 10, letterSpacing: "0.08em" }}>JAMES CHEN</div>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 8, marginTop: 2 }}>VALID 08/28</div>
                  </div>
                  <span style={{ fontFamily: "Georgia,serif", fontStyle: "italic", fontWeight: 700, fontSize: 18, color: "#fff" }}>
                    VISA
                  </span>
                </div>
              </motion.div>

              {/* Mastercard floating bottom-right */}
              <motion.div
                animate={{ y: [0, -10, 0], x: [0, -4, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                style={{
                  position: "absolute",
                  bottom: "10%",
                  right: "0%",
                  width: 230,
                  height: 142,
                  borderRadius: 14,
                  background: "linear-gradient(135deg, #1A0808 0%, #3D1515 60%, #1A0808 100%)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  padding: 18,
                  boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
                  zIndex: 10,
                  boxSizing: "border-box" as const,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 8, letterSpacing: "0.15em", textTransform: "uppercase" as const }}>
                    Bank of Asia
                  </span>
                  <svg width="36" height="24" viewBox="0 0 36 24">
                    <circle cx="13" cy="12" r="11" fill="#EB001B" opacity="0.95"/>
                    <circle cx="23" cy="12" r="11" fill="#F79E1B" opacity="0.95"/>
                    <ellipse cx="18" cy="12" rx="4" ry="11" fill="#FF5F00" opacity="0.95"/>
                  </svg>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono','Courier New',monospace", fontSize: 12, color: "#fff", letterSpacing: "0.18em", marginBottom: 14 }}>
                  •••• •••• •••• 9203
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 7, letterSpacing: "0.1em", marginBottom: 2, textTransform: "uppercase" as const }}>Cardholder</div>
                    <div style={{ color: "#fff", fontSize: 10, letterSpacing: "0.08em" }}>SARAH WONG</div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 8, marginTop: 2 }}>09/27</div>
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, letterSpacing: "0.05em" }}>mastercard</span>
                </div>
              </motion.div>

              {/* Instant issuance badge */}
              <motion.div
                animate={{ scale: [1, 1.06, 1], opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  bottom: "28%",
                  left: "8%",
                  background: "#00C896",
                  color: "#fff",
                  borderRadius: 9999,
                  padding: "8px 18px",
                  fontSize: 12,
                  fontFamily: "var(--font-dm-sans)",
                  fontWeight: 600,
                  boxShadow: "0 8px 24px rgba(0,200,150,0.4)",
                  zIndex: 11,
                  whiteSpace: "nowrap" as const,
                }}
              >
                ✓ Instant issuance
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner image */}
      <section data-protected="true" style={{ marginTop: "clamp(48px, 6vw, 80px)", marginBottom: "clamp(48px, 6vw, 80px)", overflow: "hidden", width: "100%" }}>
        <div className="protected-image" onContextMenu={e => e.preventDefault()} style={{ position: "relative", overflow: "hidden", filter: "contrast(1.01) saturate(0.99)" }}>
          <Image
            key="banner-image6-v2"
            src="/banner-image6.png"
            alt="Bank of Asia virtual cards"
            width={1920}
            height={600}
            draggable={false}
            style={{ width: "100%", height: "clamp(220px, 28vw, 420px)", objectFit: "cover", objectPosition: "center", display: "block", transform: "scaleX(1.001)", userSelect: "none", WebkitUserSelect: "none" }}
            priority={false}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — CARD DETAILS SIDE BY SIDE
      ══════════════════════════════════════════ */}
      <section className="boa-section" style={{ background: "#fff" }}>
        <div className="boa-container">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            style={{
              fontFamily: "var(--font-syne)",
              fontSize: 36,
              fontWeight: 700,
              color: "var(--boa-navy)",
              textAlign: "center",
              marginBottom: 48,
            }}
          >
            Two cards. One account.
          </motion.h2>

          <div
            style={{
              display: "grid",
              gap: 32,
              gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
            }}
            className="lg:grid-cols-2"
          >
            {/* LEFT — VISA details */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <div style={{ marginBottom: 20 }}>
                <span
                  style={{
                    display: "inline-block",
                    background: "rgba(0,200,150,0.08)",
                    border: "1px solid rgba(0,200,150,0.22)",
                    color: "var(--boa-teal)",
                    borderRadius: 9999,
                    padding: "4px 12px",
                    fontSize: 11,
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 600,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  VISA Virtual Card
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-syne)",
                    fontSize: 22,
                    fontWeight: 700,
                    color: "var(--boa-navy)",
                    margin: 0,
                  }}
                >
                  Virtual VISA
                </h3>
              </div>

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {visaFeatures.map((feat, i) => (
                  <motion.li
                    key={feat}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      fontSize: 15,
                      fontFamily: "var(--font-dm-sans)",
                      color: "var(--boa-text)",
                      lineHeight: 1.6,
                    }}
                  >
                    <span
                      style={{
                        color: "var(--boa-teal)",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </span>
                    {feat}
                  </motion.li>
                ))}
              </ul>

              {/* Use cases */}
              <div
                style={{
                  background: "#F8F9FA",
                  borderRadius: 16,
                  padding: 20,
                  marginTop: 24,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--boa-teal)",
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 600,
                    marginBottom: 12,
                  }}
                >
                  Common use cases
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["Online shopping", "Subscriptions", "Travel bookings"].map((uc) => (
                    <span
                      key={uc}
                      style={{
                        background: "rgba(0,200,150,0.07)",
                        border: "1px solid rgba(0,200,150,0.2)",
                        borderRadius: 9999,
                        padding: "6px 12px",
                        fontSize: 13,
                        fontFamily: "var(--font-dm-sans)",
                        color: "var(--boa-teal)",
                      }}
                    >
                      {uc}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* RIGHT — Mastercard details */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              <div style={{ marginBottom: 20 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "rgba(235,0,27,0.07)",
                    border: "1px solid rgba(235,0,27,0.18)",
                    color: "#c0392b",
                    borderRadius: 9999,
                    padding: "4px 12px",
                    fontSize: 11,
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 600,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  <MastercardCirclesSVG width={20} height={13} />
                  Mastercard Virtual
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-syne)",
                    fontSize: 22,
                    fontWeight: 700,
                    color: "var(--boa-navy)",
                    margin: 0,
                  }}
                >
                  Virtual Mastercard
                </h3>
              </div>

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {mcFeatures.map((feat, i) => (
                  <motion.li
                    key={feat}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      fontSize: 15,
                      fontFamily: "var(--font-dm-sans)",
                      color: "var(--boa-text)",
                      lineHeight: 1.6,
                    }}
                  >
                    <span
                      style={{
                        color: "var(--boa-teal)",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </span>
                    {feat}
                  </motion.li>
                ))}
              </ul>

              {/* Use cases */}
              <div
                style={{
                  background: "#F8F9FA",
                  borderRadius: 16,
                  padding: 20,
                  marginTop: 24,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--boa-teal)",
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 600,
                    marginBottom: 12,
                  }}
                >
                  Common use cases
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["Global payments", "Business expenses", "International use"].map((uc) => (
                    <span
                      key={uc}
                      style={{
                        background: "rgba(0,200,150,0.07)",
                        border: "1px solid rgba(0,200,150,0.2)",
                        borderRadius: 9999,
                        padding: "6px 12px",
                        fontSize: 13,
                        fontFamily: "var(--font-dm-sans)",
                        color: "var(--boa-teal)",
                      }}
                    >
                      {uc}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3 — HOW TO GET A CARD
      ══════════════════════════════════════════ */}
      <section className="boa-section" style={{ background: "#F8F9FA" }}>
        <div className="boa-container" style={{ maxWidth: 860, margin: "0 auto" }}>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            style={{
              fontFamily: "var(--font-syne)",
              fontSize: 34,
              fontWeight: 700,
              color: "var(--boa-navy)",
              textAlign: "center",
              marginBottom: 56,
            }}
          >
            Get your card in 3 steps.
          </motion.h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 0,
              position: "relative",
            }}
            className="grid-cols-1 sm:grid-cols-3"
          >
            {/* Dashed connector line — visible on sm+ */}
            <div
              aria-hidden
              className="hidden sm:block"
              style={{
                position: "absolute",
                top: 28,
                left: "calc(16.66% + 20px)",
                right: "calc(16.66% + 20px)",
                height: 2,
                borderTop: "2px dashed rgba(0,200,150,0.25)",
                zIndex: 0,
              }}
            />

            {[
              {
                num: 1,
                title: "Open your account",
                body: "Create your Bank of Asia account in under 10 minutes. Identity verification included.",
              },
              {
                num: 2,
                title: "Go to Cards",
                body: "In your dashboard, navigate to the Cards section and click 'Request New Card'.",
              },
              {
                num: 3,
                title: "Generate instantly",
                body: "Choose VISA or Mastercard, assign it to an account, and your card details appear immediately.",
              },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "0 20px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "var(--boa-teal)",
                    color: "#0A1628",
                    fontFamily: "var(--font-syne)",
                    fontWeight: 700,
                    fontSize: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                    flexShrink: 0,
                    boxShadow: "0 4px 20px rgba(0,200,150,0.25)",
                  }}
                >
                  {step.num}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-syne)",
                    fontSize: 17,
                    fontWeight: 700,
                    color: "var(--boa-navy)",
                    margin: "0 0 10px",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    fontFamily: "var(--font-dm-sans)",
                    color: "var(--boa-muted)",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {step.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 4 — SECURITY
      ══════════════════════════════════════════ */}
      <section id="security" className="boa-section" style={{ background: "#fff" }}>
        <div className="boa-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: 48 }}
          >
            <div
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "var(--boa-teal)",
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              CARD SECURITY
            </div>
            <h2
              style={{
                fontFamily: "var(--font-syne)",
                fontSize: 36,
                fontWeight: 700,
                color: "var(--boa-navy)",
                margin: 0,
              }}
            >
              Built for safe online spending.
            </h2>
          </motion.div>

          <div
            style={{
              display: "grid",
              gap: 20,
              gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
            }}
            className="sm:grid-cols-2"
          >
            {securityCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                style={{
                  background: "#F8F9FA",
                  border: "1px solid rgba(0,200,150,0.15)",
                  borderRadius: 16,
                  padding: 24,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "rgba(0,200,150,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  {card.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-syne)",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "var(--boa-navy)",
                    margin: "0 0 8px",
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    fontFamily: "var(--font-dm-sans)",
                    color: "var(--boa-muted)",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {card.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 5 — FAQ
      ══════════════════════════════════════════ */}
      <section className="boa-section" style={{ background: "#F8F9FA" }}>
        <div className="boa-container" style={{ maxWidth: 800, margin: "0 auto" }}>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            style={{
              fontFamily: "var(--font-syne)",
              fontSize: 32,
              fontWeight: 700,
              color: "var(--boa-navy)",
              textAlign: "center",
              marginBottom: 48,
            }}
          >
            Card questions answered.
          </motion.h2>
          <FaqAccordion faqs={FAQS} />
        </div>
      </section>

      <EditorialBanner
        headline="Your card, ready in seconds."
        subtext="Generate a virtual VISA or Mastercard instantly from your dashboard. No waiting, no paperwork, no fees."
        ctaText="Get My Card"
        ctaHref="/register"
        ctaText2="Learn about security"
        ctaHref2="/security"
      />
    </>
  );
}
