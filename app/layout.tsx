import type { Metadata, Viewport } from "next";
import { Inter, Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bank of Asia Online",
    template: "%s — Bank of Asia Online",
  },
  description:
    "Bank of Asia Online — Next-generation digital banking. Secure, fast, and borderless.",
  keywords: ["banking", "digital bank", "online banking", "transfers", "Bank of Asia Online"],
  authors: [{ name: "Bank of Asia Online" }],
  robots: { index: false, follow: false },
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    siteName: "Bank of Asia Online",
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    site: "@boasiaonline",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A1628",
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased`}
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
