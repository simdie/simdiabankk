import type { Metadata } from "next";
import Link from "next/link";
import NewsGrid from "@/components/marketing/NewsGrid";
import { NEWS_POSTS, formatDate } from "@/lib/news-posts";

export const metadata: Metadata = {
  title: "News & Insights",
  description:
    "Latest updates from Bank of Asia Online — product announcements, rate changes, security tips, financial education, and company news.",
};

const featured = NEWS_POSTS.find((p) => p.featured)!;

export default function NewsPage() {
  return (
    <>
      {/* ══════════════════════════════════════════════════
          PAGE HEADER
      ══════════════════════════════════════════════════ */}
      <section
        className="py-14 border-b"
        style={{ backgroundColor: "var(--boa-light)", borderColor: "var(--boa-border)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p
            className="text-[11px] font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--boa-purple)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
          >
            News & Insights
          </p>
          <h1
            className="font-bold leading-tight mb-3"
            style={{
              fontFamily: "var(--font-syne, var(--font-inter))",
              fontSize: "clamp(28px, 4vw, 46px)",
              color: "var(--boa-navy)",
              letterSpacing: "-0.02em",
            }}
          >
            News &amp; Insights
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "var(--boa-muted)",
              fontFamily: "var(--font-dm-sans, var(--font-inter))",
            }}
          >
            Product updates, rate changes, security guidance, and financial education — straight from our team.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FEATURED POST — full width
      ══════════════════════════════════════════════════ */}
      <section className="py-10 bg-white border-b" style={{ borderColor: "var(--boa-border)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={`/news/${featured.slug}`}
            className="group grid lg:grid-cols-[1fr_420px] gap-8 rounded-2xl border overflow-hidden hover:shadow-lg transition-shadow"
            style={{ borderColor: "var(--boa-border)" }}
          >
            {/* Text side */}
            <div
              className="p-8 lg:p-10 flex flex-col justify-between"
              style={{ backgroundColor: "var(--boa-navy)" }}
            >
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider"
                    style={{
                      backgroundColor: "rgba(74,31,168,0.35)",
                      color: "rgba(255,255,255,0.85)",
                      fontFamily: "var(--font-dm-sans, var(--font-inter))",
                    }}
                  >
                    {featured.category}
                  </span>
                  <span
                    className="text-[12px]"
                    style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                  >
                    Featured
                  </span>
                </div>

                <h2
                  className="font-bold leading-snug mb-4 group-hover:opacity-90 transition-opacity"
                  style={{
                    fontFamily: "var(--font-syne, var(--font-inter))",
                    fontSize: "clamp(20px, 2.5vw, 30px)",
                    color: "#ffffff",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {featured.title}
                </h2>

                <p
                  style={{
                    fontSize: 15,
                    color: "rgba(255,255,255,0.6)",
                    fontFamily: "var(--font-dm-sans, var(--font-inter))",
                    lineHeight: 1.7,
                  }}
                >
                  {featured.excerpt}
                </p>
              </div>

              <div className="flex items-center gap-3 mt-8">
                <span
                  className="text-[13px]"
                  style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                >
                  {formatDate(featured.date)} · {featured.readTime} min read
                </span>
                <span
                  className="ml-auto text-[13px] font-medium flex items-center gap-1.5"
                  style={{ color: "var(--boa-teal)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                >
                  Read article
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </span>
              </div>
            </div>

            {/* Visual side */}
            <div
              className="hidden lg:flex items-center justify-center p-10"
              style={{
                background: "linear-gradient(135deg, rgba(74,31,168,0.12) 0%, rgba(0,168,150,0.08) 100%)",
                borderLeft: "1px solid var(--boa-border)",
              }}
            >
              <div
                className="rounded-2xl p-6 w-full max-w-[280px]"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <p
                  className="text-[11px] font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                >
                  Savings Rate
                </p>
                <p
                  className="font-bold leading-none mb-1"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono, monospace)",
                    fontSize: 48,
                    color: "var(--boa-teal)",
                  }}
                >
                  4.75%
                </p>
                <p
                  className="text-[13px]"
                  style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                >
                  p.a. variable · No lock-in
                </p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CATEGORY FILTER + CARD GRID (client component)
      ══════════════════════════════════════════════════ */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsGrid posts={NEWS_POSTS} />
        </div>
      </section>
    </>
  );
}
