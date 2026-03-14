import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Community Impact",
  description: "Bank of Asia Online community programs — financial literacy, inclusion, and supporting Asia-Pacific communities.",
};

export default function CommunityPage() {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl"
          style={{ backgroundColor: "rgba(0,200,150,0.1)" }}
        >
          🌏
        </div>
        <p
          className="text-[11px] font-semibold uppercase tracking-widest mb-3"
          style={{ color: "var(--boa-teal)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
        >
          Community Impact
        </p>
        <h1
          className="font-bold mb-4"
          style={{
            fontFamily: "var(--font-syne, var(--font-inter))",
            fontSize: "clamp(28px, 4vw, 46px)",
            color: "var(--boa-navy)",
            letterSpacing: "-0.02em",
          }}
        >
          Building better communities
        </h1>
        <p
          className="mb-4 mx-auto"
          style={{
            fontSize: 16,
            color: "var(--boa-muted)",
            fontFamily: "var(--font-dm-sans, var(--font-inter))",
            maxWidth: 520,
          }}
        >
          Coming soon — we&apos;re building this for you.
        </p>
        <p
          className="mb-10 mx-auto text-[14px]"
          style={{
            color: "var(--boa-muted)",
            fontFamily: "var(--font-dm-sans, var(--font-inter))",
            maxWidth: 460,
          }}
        >
          We&apos;re committed to financial literacy, inclusion, and positive impact across Asia-Pacific. Our community programme page is coming soon.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[15px] transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "var(--boa-purple)",
              color: "#fff",
              fontFamily: "var(--font-dm-sans, var(--font-inter))",
            }}
          >
            Our story
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[15px] border transition-opacity hover:opacity-90"
            style={{
              borderColor: "var(--boa-border)",
              color: "var(--boa-navy)",
              fontFamily: "var(--font-dm-sans, var(--font-inter))",
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
