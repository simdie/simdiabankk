import Link from "next/link";
import type { MegaMenuData } from "@/lib/marketing-nav";

interface MegaMenuProps {
  data: MegaMenuData;
  onClose: () => void;
}

export default function MegaMenu({ data, onClose }: MegaMenuProps) {
  const colCount = data.columns.length + (data.featured ? 1 : 0);
  const gridClass =
    colCount === 3
      ? "grid-cols-3"
      : colCount === 2
      ? "grid-cols-2"
      : "grid-cols-1";

  return (
    <div
      className={`absolute left-0 right-0 bg-white`}
      style={{
        borderBottom: "2px solid var(--boa-purple)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.10)",
        zIndex: 49,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className={`grid ${gridClass} gap-10`}>
          {/* Data columns */}
          {data.columns.map((col) => (
            <div key={col.heading}>
              <h3
                className="text-[11px] uppercase tracking-widest font-semibold mb-5"
                style={{ color: "var(--boa-muted)", fontFamily: "var(--font-dm-sans, var(--font-inter))" }}
              >
                {col.heading}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="boa-mega-link text-[14px] font-medium block leading-snug"
                      style={{
                        color: "var(--boa-text)",
                        fontFamily: "var(--font-dm-sans, var(--font-inter))",
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Featured card */}
          {data.featured && (
            <div
              className="rounded-xl p-7 flex flex-col justify-between"
              style={{ backgroundColor: "rgba(74, 31, 168, 0.06)" }}
            >
              <div>
                <h3
                  className="text-[16px] font-bold mb-2 leading-snug"
                  style={{
                    color: "var(--boa-navy)",
                    fontFamily: "var(--font-syne, var(--font-inter))",
                  }}
                >
                  {data.featured.title}
                </h3>
                <p
                  className="text-sm mb-7 leading-relaxed"
                  style={{
                    color: "var(--boa-muted)",
                    fontFamily: "var(--font-dm-sans, var(--font-inter))",
                  }}
                >
                  {data.featured.subtitle}
                </p>
              </div>
              <Link
                href={data.featured.href}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-white px-5 py-2.5 rounded-md w-fit transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: "var(--boa-purple)",
                  fontFamily: "var(--font-dm-sans, var(--font-inter))",
                }}
              >
                {data.featured.cta} <span aria-hidden>→</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
