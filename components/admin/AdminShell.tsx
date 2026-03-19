"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const G = "#F0B429";

const NAV_SECTIONS = [
  {
    label: "MAIN",
    items: [
      { href: "/admin", icon: "⊛", label: "Command Center", exact: true },
    ],
  },
  {
    label: "USER MANAGEMENT",
    items: [
      { href: "/admin/users", icon: "👥", label: "All Users" },
    ],
  },
  {
    label: "FINANCIAL",
    items: [
      { href: "/admin/transactions", icon: "⇄", label: "All Transactions" },
      { href: "/admin/deposits", icon: "⊕", label: "Deposits" },
    ],
  },
  {
    label: "SUPPORT",
    items: [
      { href: "/admin/messages", icon: "✉", label: "Messages" },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { href: "/admin/settings", icon: "⚙", label: "System Settings" },
      { href: "/admin/audit", icon: "≡", label: "Audit Log" },
    ],
  },
];

export default function AdminShell({
  admin,
  children,
}: {
  admin: { id: string; name: string; email: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const w = collapsed ? 64 : 240;

  // Poll unread message count
  useEffect(() => {
    async function fetchUnread() {
      try {
        const res = await fetch("/api/admin/messages/unread-count");
        if (res.ok) {
          const d = await res.json();
          setUnreadMessages(d.count ?? 0);
        }
      } catch {}
    }
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isActive = (href: string, exact?: boolean) => {
    const base = href.split("?")[0];
    return exact ? pathname === base : pathname.startsWith(base);
  };

  const NavContent = ({ inMobile }: { inMobile?: boolean }) => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Logo */}
      <div style={{
        padding: (!inMobile && collapsed) ? "18px 0" : "18px 14px",
        borderBottom: `1px solid rgba(240,180,41,0.1)`,
        display: "flex", alignItems: "center",
        justifyContent: (!inMobile && collapsed) ? "center" : "space-between",
        gap: 8,
      }}>
        {(inMobile || !collapsed) && (
          <div>
            <img
              src="/logo-dark-bg.png"
              alt="Bank of Asia Online"
              style={{ width: 130, height: "auto", borderRadius: 6, display: "block" }}
            />
            <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(240,180,41,0.35)", marginTop: 4, textTransform: "uppercase" as const }}>ADMIN PANEL</div>
          </div>
        )}
        {!inMobile && collapsed && (
          <img
            src="/logo-dark-bg.png"
            alt="Bank of Asia Online"
            style={{ width: 40, height: 40, borderRadius: 6, objectFit: "cover", objectPosition: "left center", display: "block" }}
          />
        )}
        {!inMobile ? (
          <button onClick={() => setCollapsed(!collapsed)} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(240,180,41,0.35)", fontSize: 13, padding: 4,
          }}>
            {collapsed ? "→" : "←"}
          </button>
        ) : (
          <button onClick={() => setMobileOpen(false)} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.4)", fontSize: 20,
          }}>✕</button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "10px 8px", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} style={{ marginBottom: 2 }}>
            {(!collapsed || inMobile) && (
              <div style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.15em",
                color: "rgba(240,180,41,0.25)", padding: "8px 12px 3px",
                textTransform: "uppercase" as const,
              }}>
                {section.label}
              </div>
            )}
            {collapsed && !inMobile && <div style={{ height: 6 }} />}
            {section.items.map((item) => {
              const active = isActive(item.href, (item as any).exact);
              return (
                <Link key={item.href} href={item.href}
                  title={(collapsed && !inMobile) ? item.label : undefined}
                  style={{
                    display: "flex", alignItems: "center",
                    gap: (collapsed && !inMobile) ? 0 : 9,
                    justifyContent: (collapsed && !inMobile) ? "center" : "flex-start",
                    padding: (collapsed && !inMobile) ? "9px" : "8px 11px",
                    borderRadius: 8, marginBottom: 1,
                    fontSize: 12, fontWeight: active ? 700 : 400,
                    color: active ? G : "rgba(240,180,41,0.38)",
                    background: active ? "rgba(240,180,41,0.07)" : "transparent",
                    border: active ? `1px solid rgba(240,180,41,0.16)` : "1px solid transparent",
                    textDecoration: "none", position: "relative",
                    transition: "all 0.12s ease",
                  }}>
                  {active && (
                    <span style={{
                      position: "absolute", left: -1, top: "18%", height: "64%",
                      width: 2.5, borderRadius: "0 3px 3px 0",
                      background: G, boxShadow: `0 0 6px ${G}`,
                    }} />
                  )}
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
                  {(!collapsed || inMobile) && <span style={{ flex: 1 }}>{item.label}</span>}
                  {(!collapsed || inMobile) && item.href === "/admin/messages" && unreadMessages > 0 && (
                    <span style={{ background: "#FF3B5C", color: "#fff", fontSize: 9, fontWeight: 800, borderRadius: 999, padding: "1px 5px", minWidth: 16, textAlign: "center" }}>
                      {unreadMessages > 99 ? "99+" : unreadMessages}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* System status */}
      {(!collapsed || inMobile) && (
        <div style={{ padding: "0 8px 10px" }}>
          <div style={{
            padding: "9px 11px", borderRadius: 9,
            background: "rgba(0,229,160,0.04)", border: "1px solid rgba(0,229,160,0.12)",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00E5A0", boxShadow: "0 0 5px #00E5A0", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#00E5A0" }}>System Healthy</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>All services operational</div>
            </div>
          </div>
        </div>
      )}

      {/* Admin bottom */}
      <div style={{
        padding: "10px 8px", borderTop: `1px solid rgba(240,180,41,0.1)`,
        display: "flex", flexDirection: "column", gap: 4,
      }}>
        {(!collapsed || inMobile) && (
          <div style={{
            padding: "9px 10px", borderRadius: 9,
            background: "rgba(240,180,41,0.04)", border: `1px solid rgba(240,180,41,0.1)`,
            marginBottom: 4,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#f0f4ff", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {admin.name}
            </div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              fontSize: 9, fontWeight: 800, letterSpacing: "0.1em",
              color: G, background: "rgba(240,180,41,0.1)",
              border: `1px solid rgba(240,180,41,0.2)`,
              padding: "2px 7px", borderRadius: 999, textTransform: "uppercase" as const,
            }}>
              ⚡ ADMINISTRATOR
            </div>
          </div>
        )}

        <Link href="/dashboard" title={(collapsed && !inMobile) ? "User Portal" : undefined} style={{
          display: "flex", alignItems: "center",
          justifyContent: (collapsed && !inMobile) ? "center" : "flex-start",
          gap: (collapsed && !inMobile) ? 0 : 7,
          padding: (collapsed && !inMobile) ? "8px" : "7px 10px", borderRadius: 8,
          fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.28)",
          background: "none", border: "none", textDecoration: "none",
        }}>
          <span>←</span>
          {(!collapsed || inMobile) && "User Portal"}
        </Link>

        <button onClick={() => signOut({ callbackUrl: "https://www.boasiaonline.com/login" })}
          title={(collapsed && !inMobile) ? "Sign Out" : undefined}
          style={{
            display: "flex", alignItems: "center",
            justifyContent: (collapsed && !inMobile) ? "center" : "flex-start",
            gap: (collapsed && !inMobile) ? 0 : 7,
            padding: (collapsed && !inMobile) ? "8px" : "7px 10px", borderRadius: 8,
            fontSize: 12, fontWeight: 500, color: "rgba(255,59,92,0.45)",
            background: "none", border: "none", cursor: "pointer", width: "100%",
          }}>
          <span>↩</span>
          {(!collapsed || inMobile) && "Sign Out"}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#03050a" }}>
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: `linear-gradient(rgba(240,180,41,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(240,180,41,0.02) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 45,
        }} />
      )}

      {!isMobile && (
        <aside style={{
          width: w, minHeight: "100vh",
          background: "linear-gradient(180deg, rgba(12,8,0,0.95) 0%, rgba(8,6,0,0.98) 100%)",
          backdropFilter: "blur(20px)", borderRight: `1px solid rgba(240,180,41,0.1)`,
          position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
          transition: "width 0.22s ease", overflow: "hidden",
        }}>
          <NavContent />
        </aside>
      )}

      {isMobile && (
        <aside style={{
          width: 260, height: "100vh",
          background: "linear-gradient(180deg, rgba(12,8,0,0.97) 0%, rgba(8,6,0,0.99) 100%)",
          backdropFilter: "blur(20px)", borderRight: `1px solid rgba(240,180,41,0.12)`,
          position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s ease", overflow: "hidden",
        }}>
          <NavContent inMobile />
        </aside>
      )}

      <div style={{
        flex: 1, marginLeft: isMobile ? 0 : w,
        minHeight: "100vh", display: "flex", flexDirection: "column",
        transition: "margin-left 0.22s ease", position: "relative", zIndex: 1,
      }}>
        {isMobile && (
          <div style={{
            padding: "12px 16px", borderBottom: `1px solid rgba(240,180,41,0.08)`,
            background: "rgba(8,5,0,0.9)", backdropFilter: "blur(12px)",
            display: "flex", alignItems: "center", gap: 12,
            position: "sticky", top: 0, zIndex: 30,
          }}>
            <button onClick={() => setMobileOpen(true)} style={{
              background: "none", border: `1px solid rgba(240,180,41,0.15)`,
              borderRadius: 8, padding: "6px 9px", cursor: "pointer", color: G, fontSize: 16,
            }}>☰</button>
            <span style={{ fontWeight: 700, fontSize: 13, color: G }}>ADMIN PANEL</span>
          </div>
        )}
        <main style={{ flex: 1, padding: isMobile ? "16px" : "28px 28px" }}>{children}</main>
      </div>
    </div>
  );
}
