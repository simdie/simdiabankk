import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import ScrollToTop from "@/components/marketing/ScrollToTop";
import PageTransition from "@/components/marketing/PageTransition";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bank of Asia Online — Banking for Every Life Stage",
    template: "%s — Bank of Asia Online",
  },
  description:
    "Bank of Asia Online is a full-service international digital bank. Open a free account in minutes. Personal banking, business banking, and international transfers.",
  keywords: [
    "bank of asia",
    "digital bank",
    "online banking",
    "international transfers",
    "savings accounts",
    "business banking",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    siteName: "Bank of Asia Online",
    type: "website",
    locale: "en_AU",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bank of Asia Online — Banking for Every Life Stage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@bankofasia",
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${syne.variable} ${dmSans.variable} marketing-site`}
      style={{ backgroundColor: "var(--boa-white)", color: "var(--boa-text)" }}
    >
      <Navbar />
      {/*
        pt-[100px] = utility bar (36px) + main nav (64px).
        When the utility bar scrolls away, the header translates up
        so the main nav remains at the top; content stays below.
      */}
      <main className="pt-[100px]">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
