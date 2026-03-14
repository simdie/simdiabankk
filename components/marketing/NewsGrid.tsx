"use client";

import Link from "next/link";
import { useState } from "react";
import type { NewsPost, NewsCategory } from "@/lib/news-posts";
import { formatDate } from "@/lib/news-posts";

const CATEGORIES: ("All" | NewsCategory)[] = [
  "All",
  "Banking Update",
  "Product News",
  "Security Tips",
  "Financial Education",
  "Company News",
];

const CATEGORY_COLORS: Record<NewsCategory, { bg: string; text: string }> = {
  "Banking Update": { bg: "rgba(0,168,150,0.1)", text: "var(--boa-teal)" },
  "Product News": { bg: "rgba(74,31,168,0.1)", text: "var(--boa-purple)" },
  "Security Tips": { bg: "rgba(11,28,61,0.08)", text: "var(--boa-navy)" },
  "Financial Education": { bg: "rgba(200,151,42,0.1)", text: "var(--boa-gold)" },
  "Company News": { bg: "rgba(74,31,168,0.07)", text: "var(--boa-purple)" },
};

export default function NewsGrid({ posts }: { posts: NewsPost[] }) {
  const [active, setActive] = useState<"All" | NewsCategory>("All");

  const filtered = active === "All" ? posts : posts.filter((p) => p.category === active);

  return (
    <>
      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className="px-4 py-1.5 rounded-full text-[13px] font-medium transition-all"
            style={{
              backgroundColor: active === cat ? "var(--boa-purple)" : "var(--boa-light)",
              color: active === cat ? "#ffffff" : "var(--boa-navy)",
              border: `1px solid ${active === cat ? "var(--boa-purple)" : "var(--boa-border)"}`,
              fontFamily: "var(--font-dm-sans, var(--font-inter))",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Card grid */}
      {filtered.length === 0 ? (
        <p style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}>
          No articles in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => {
            const colors = CATEGORY_COLORS[post.category];
            return (
              <Link
                key={post.slug}
                href={`/news/${post.slug}`}
                className="group rounded-2xl border flex flex-col hover:shadow-md transition-shadow"
                style={{ borderColor: "var(--boa-border)", backgroundColor: "#fff" }}
              >
                {/* Category bar */}
                <div
                  className="h-1 rounded-t-2xl"
                  style={{ backgroundColor: colors.text, opacity: 0.6 }}
                />

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider"
                      style={{
                        backgroundColor: colors.bg,
                        color: colors.text,
                        fontFamily: "var(--font-dm-sans, var(--font-inter))",
                      }}
                    >
                      {post.category}
                    </span>
                  </div>

                  <h3
                    className="font-bold mb-2 group-hover:opacity-80 transition-opacity leading-snug"
                    style={{
                      fontSize: 16,
                      color: "var(--boa-navy)",
                      fontFamily: "var(--font-syne, var(--font-inter))",
                    }}
                  >
                    {post.title}
                  </h3>

                  <p
                    className="text-[13px] leading-relaxed flex-1"
                    style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                  >
                    {post.excerpt}
                  </p>

                  <div
                    className="flex items-center justify-between mt-5 pt-4 border-t"
                    style={{ borderColor: "var(--boa-border)" }}
                  >
                    <span
                      className="text-[12px]"
                      style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                    >
                      {formatDate(post.date)} · {post.readTime} min
                    </span>
                    <span
                      className="text-[12px] font-medium flex items-center gap-1"
                      style={{ color: "var(--boa-purple)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
                    >
                      Read
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
