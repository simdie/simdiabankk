import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NEWS_POSTS, getPostBySlug, getRelatedPosts, formatDate } from "@/lib/news-posts";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export function generateStaticParams() {
  return NEWS_POSTS.map((p) => ({ slug: p.slug }));
}

const CATEGORY_COLORS: Record<string, string> = {
  "Banking Update": "var(--boa-teal)",
  "Product News": "var(--boa-purple)",
  "Security Tips": "var(--boa-navy)",
  "Financial Education": "var(--boa-gold)",
  "Company News": "var(--boa-purple)",
};

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post, 3);
  const accentColor = CATEGORY_COLORS[post.category] ?? "var(--boa-purple)";

  return (
    <>
      {/* ══════════════════════════════════════════════════
          ARTICLE HEADER
      ══════════════════════════════════════════════════ */}
      <section
        className="py-14 border-b"
        style={{ backgroundColor: "var(--boa-light)", borderColor: "var(--boa-border)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[12px] mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:underline" style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}>
              Home
            </Link>
            <span style={{ color: "var(--boa-muted)" }}>›</span>
            <Link href="/news" className="hover:underline" style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}>
              News
            </Link>
            <span style={{ color: "var(--boa-muted)" }}>›</span>
            <span style={{ color: "var(--boa-navy)", fontFamily: "var(--font-dm-sans, var(--font-inter))", fontWeight: 500 }}>
              {post.category}
            </span>
          </nav>

          <div className="flex items-center gap-3 mb-5">
            <span
              className="px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider"
              style={{
                backgroundColor: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
                color: accentColor,
                fontFamily: "var(--font-dm-sans, var(--font-inter))",
              }}
            >
              {post.category}
            </span>
            <span className="text-[12px]" style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}>
              {formatDate(post.date)} · {post.readTime} min read
            </span>
          </div>

          <h1
            className="font-bold leading-tight mb-6"
            style={{
              fontFamily: "var(--font-syne, var(--font-inter))",
              fontSize: "clamp(24px, 3.5vw, 42px)",
              color: "var(--boa-navy)",
              letterSpacing: "-0.02em",
              maxWidth: 780,
            }}
          >
            {post.title}
          </h1>

          {/* Author */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-[13px] shrink-0"
              style={{
                backgroundColor: "var(--boa-purple)",
                color: "#fff",
                fontFamily: "var(--font-dm-sans, var(--font-inter))",
              }}
            >
              {post.author.charAt(0)}
            </div>
            <div>
              <p
                className="text-[13px] font-semibold leading-none mb-0.5"
                style={{ color: "var(--boa-navy)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
              >
                {post.author}
              </p>
              <p
                className="text-[12px]"
                style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
              >
                {post.authorRole}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          ARTICLE BODY + SIDEBAR
      ══════════════════════════════════════════════════ */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_320px] gap-14">

            {/* Article body */}
            <article>
              {/* Lead / excerpt */}
              <p
                className="text-[17px] leading-relaxed font-medium mb-8 pb-8 border-b"
                style={{
                  color: "var(--boa-navy)",
                  fontFamily: "var(--font-dm-sans, var(--font-inter))",
                  borderColor: "var(--boa-border)",
                }}
              >
                {post.excerpt}
              </p>

              {/* Body paragraphs */}
              <div className="space-y-5">
                {post.paragraphs.map((para, i) => (
                  <p
                    key={i}
                    className="text-[15px] leading-[1.8]"
                    style={{
                      color: "var(--boa-text)",
                      fontFamily: "var(--font-dm-sans, var(--font-inter))",
                    }}
                  >
                    {para}
                  </p>
                ))}
              </div>

              {/* Article footer */}
              <div
                className="mt-10 pt-8 border-t flex items-center justify-between gap-4 flex-wrap"
                style={{ borderColor: "var(--boa-border)" }}
              >
                <Link
                  href="/news"
                  className="text-[13px] font-medium flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                  style={{ color: "var(--boa-purple)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                  All articles
                </Link>
                <span
                  className="text-[12px]"
                  style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                >
                  Published {formatDate(post.date)}
                </span>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Related articles */}
              {related.length > 0 && (
                <div
                  className="rounded-2xl border p-6"
                  style={{ borderColor: "var(--boa-border)" }}
                >
                  <p
                    className="text-[11px] font-semibold uppercase tracking-wider mb-5"
                    style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                  >
                    Related articles
                  </p>
                  <div className="space-y-4">
                    {related.map((r) => (
                      <Link
                        key={r.slug}
                        href={`/news/${r.slug}`}
                        className="block group"
                      >
                        <p
                          className="text-[13px] font-medium leading-snug group-hover:opacity-70 transition-opacity mb-1"
                          style={{ color: "var(--boa-navy)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                        >
                          {r.title}
                        </p>
                        <p
                          className="text-[11px]"
                          style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                        >
                          {r.category} · {r.readTime} min
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Open an Account CTA */}
              <div
                className="rounded-2xl p-6"
                style={{ backgroundColor: "var(--boa-navy)" }}
              >
                <p
                  className="font-bold mb-2"
                  style={{
                    fontSize: 18,
                    color: "#fff",
                    fontFamily: "var(--font-syne, var(--font-inter))",
                  }}
                >
                  Ready to get started?
                </p>
                <p
                  className="text-[13px] mb-5"
                  style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-dm-sans, var(--font-inter))", lineHeight: 1.6 }}
                >
                  Open a free account in under 3 minutes. No fees, no minimums.
                </p>
                <Link
                  href="/register" target="_blank" rel="noopener noreferrer"
                  className="block text-center py-3 rounded-lg text-[14px] font-medium"
                  style={{
                    backgroundColor: "var(--boa-purple)",
                    color: "#fff",
                    fontFamily: "var(--font-dm-sans, var(--font-inter))",
                  }}
                >
                  Open an account
                </Link>
                <Link
                  href="/interest-rates"
                  className="block text-center py-2.5 mt-2 rounded-lg text-[13px] font-medium"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.07)",
                    color: "rgba(255,255,255,0.7)",
                    fontFamily: "var(--font-dm-sans, var(--font-inter))",
                  }}
                >
                  View current rates
                </Link>
              </div>

              {/* Categories */}
              <div
                className="rounded-2xl border p-6"
                style={{ borderColor: "var(--boa-border)" }}
              >
                <p
                  className="text-[11px] font-semibold uppercase tracking-wider mb-4"
                  style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                >
                  Browse by topic
                </p>
                <div className="flex flex-wrap gap-2">
                  {(["Banking Update", "Product News", "Security Tips", "Financial Education", "Company News"] as const).map((cat) => (
                    <Link
                      key={cat}
                      href="/news"
                      className="px-3 py-1.5 rounded-full text-[12px] font-medium border"
                      style={{
                        borderColor: "var(--boa-border)",
                        color: "var(--boa-navy)",
                        fontFamily: "var(--font-dm-sans, var(--font-inter))",
                        backgroundColor: "#fff",
                      }}
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
