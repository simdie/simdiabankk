"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

interface Props {
  user: { id: string; firstName: string; lastName: string; email: string; role: string };
  globalNotice: string | null;
  children: React.ReactNode;
}

const NAV_SECTIONS = [
  {
    label: "MAIN",
    items: [
      { href: "/dashboard", icon: "⊞", label: "Overview", exact: true },
      { href: "/dashboard/profile", icon: "👤", label: "Profile" },
    ],
  },
  {
    label: "BANKING",
    items: [
      { href: "/dashboard/accounts", icon: "🏦", label: "Accounts" },
      { href: "/dashboard/cards", icon: "▣", label: "Cards" },
      { href: "/dashboard/transfer", icon: "↗", label: "Transfers" },
      { href: "/dashboard/transactions", icon: "≡", label: "Transactions" },
      { href: "/dashboard/statements", icon: "📄", label: "Statements" },
      { href: "/dashboard/beneficiaries", icon: "👥", label: "Beneficiaries" },
    ],
  },
  {
    label: "SERVICES",
    items: [
      { href: "/dashboard/exchange-rates", icon: "💱", label: "Exchange Rates" },
      { href: "/dashboard/support", icon: "💬", label: "Support" },
    ],
  },
  {
    label: "SECURITY",
    items: [
      { href: "/dashboard/settings", icon: "⚙", label: "Settings" },
      { href: "/dashboard/security", icon: "🛡", label: "Security Center" },
    ],
  },
];

const MOBILE_NAV = [
  { href: "/dashboard", icon: "⊞", label: "Home", exact: true },
  { href: "/dashboard/accounts", icon: "🏦", label: "Accounts" },
  { href: "/dashboard/transfer", icon: "↗", label: "Transfer" },
  { href: "/dashboard/cards", icon: "▣", label: "Cards" },
  { href: "/dashboard/settings", icon: "⚙", label: "More" },
];

export default function DashboardShell({ user, globalNotice, children }: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch("/api/user/notifications");
        if (res.ok) {
          const d = await res.json();
          setUnreadCount(d.unreadCount ?? 0);
          setNotifications(d.notifications ?? []);
        }
      } catch {}
    }
    fetchNotifications();
    const iv = setInterval(fetchNotifications, 30000);
    return () => clearInterval(iv);
  }, []);

  async function markAllRead() {
    await fetch("/api/user/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const sidebarWidth = collapsed ? 64 : 240;

  const NavContent = ({ inMobile }: { inMobile?: boolean }) => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Logo */}
      <div style={{
        padding: (!inMobile && collapsed) ? "18px 0" : "18px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        display: "flex", alignItems: "center",
        justifyContent: (!inMobile && collapsed) ? "center" : "space-between",
        gap: 8, flexShrink: 0,
      }}>
        {(inMobile || !collapsed) && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
              <path d="M24 3 L42 10 L42 26 C42 35 34 43 24 46 C14 43 6 35 6 26 L6 10 Z"
                fill="rgba(6,12,24,0.9)" stroke="#00D4FF" strokeWidth="1.5" strokeOpacity="0.8"/>
              <text x="24" y="30" fontFamily="Arial" fontWeight="700" fontSize="11"
                fill="#00D4FF" textAnchor="middle" letterSpacing="1">BOA</text>
            </svg>
            <div>
              <div style={{ fontWeight: 800, fontSize: 13, color: "#00D4FF", letterSpacing: "0.05em" }}>BANK OF ASIA ONLINE</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em" }}>DIGITAL BANKING</div>
            </div>
          </div>
        )}
        {!inMobile && collapsed && (
          <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
            <path d="M24 3 L42 10 L42 26 C42 35 34 43 24 46 C14 43 6 35 6 26 L6 10 Z"
              fill="rgba(6,12,24,0.9)" stroke="#00D4FF" strokeWidth="1.5" strokeOpacity="0.8"/>
            <text x="24" y="30" fontFamily="Arial" fontWeight="700" fontSize="11"
              fill="#00D4FF" textAnchor="middle" letterSpacing="1">BOA</text>
          </svg>
        )}
        {!inMobile ? (
          <button onClick={() => setCollapsed(!collapsed)} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.25)", fontSize: 13, padding: 4,
          }}>
            {collapsed ? "→" : "←"}
          </button>
        ) : (
          <button onClick={() => setMobileOpen(false)} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.4)", fontSize: 20, padding: "0 4px",
          }}>✕</button>
        )}
      </div>

      {/* Nav sections */}
      <nav style={{ flex: 1, padding: "10px 8px", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} style={{ marginBottom: 2 }}>
            {(!collapsed || inMobile) && (
              <div style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.2)", padding: "8px 12px 3px",
                textTransform: "uppercase", whiteSpace: "nowrap",
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
                  onClick={() => inMobile && setMobileOpen(false)}
                  style={{
                    display: "flex", alignItems: "center",
                    gap: (collapsed && !inMobile) ? 0 : 9,
                    justifyContent: (collapsed && !inMobile) ? "center" : "flex-start",
                    padding: (collapsed && !inMobile) ? "9px" : "8px 11px",
                    borderRadius: 8, marginBottom: 1,
                    fontSize: 13, fontWeight: active ? 600 : 400,
                    color: active ? "#00D4FF" : "rgba(255,255,255,0.42)",
                    background: active ? "rgba(0,212,255,0.08)" : "transparent",
                    border: active ? "1px solid rgba(0,212,255,0.14)" : "1px solid transparent",
                    textDecoration: "none", position: "relative",
                    transition: "all 0.12s ease",
                  }}>
                  {active && (
                    <span style={{
                      position: "absolute", left: -1, top: "18%", height: "64%",
                      width: 2.5, borderRadius: "0 3px 3px 0",
                      background: "#00D4FF", boxShadow: "0 0 6px #00D4FF",
                    }} />
                  )}
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
                  {(!collapsed || inMobile) && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom user section */}
      <div style={{
        padding: "10px 8px",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        display: "flex", flexDirection: "column", gap: 4, flexShrink: 0,
      }}>
        {(!collapsed || inMobile) && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "9px 10px", borderRadius: 10,
            background: "rgba(255,255,255,0.02)", marginBottom: 4,
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, #00D4FF, #0088CC)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color: "#03050a",
            }}>{initials}</div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#f0f4ff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.firstName} {user.lastName}
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.email}
              </div>
            </div>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00E5A0" }} />
          </div>
        )}

        {/* ADMIN LINK — ONLY for ADMIN role */}
        {user.role === "ADMIN" && (
          <Link href="/admin" title={(collapsed && !inMobile) ? "Admin Panel" : undefined} style={{
            display: "flex", alignItems: "center",
            justifyContent: (collapsed && !inMobile) ? "center" : "flex-start",
            gap: (collapsed && !inMobile) ? 0 : 7,
            padding: (collapsed && !inMobile) ? "8px" : "7px 10px", borderRadius: 8,
            fontSize: 12, fontWeight: 600,
            color: "#F0B429", textDecoration: "none",
            background: "rgba(240,180,41,0.06)", border: "1px solid rgba(240,180,41,0.14)",
          }}>
            <span>⚡</span>
            {(!collapsed || inMobile) && "Admin Panel"}
          </Link>
        )}

        <button onClick={() => signOut({ callbackUrl: "/login" })}
          title={(collapsed && !inMobile) ? "Sign Out" : undefined}
          style={{
            display: "flex", alignItems: "center",
            justifyContent: (collapsed && !inMobile) ? "center" : "flex-start",
            gap: (collapsed && !inMobile) ? 0 : 7,
            padding: (collapsed && !inMobile) ? "8px" : "7px 10px", borderRadius: 8,
            fontSize: 12, color: "rgba(255,255,255,0.28)",
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
      <div className="nexus-grid" />

      {/* Mobile overlay */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 45,
        }} />
      )}

      {/* Desktop sidebar */}
      {!isMobile && (
        <aside style={{
          width: sidebarWidth, minHeight: "100vh",
          background: "rgba(6,12,24,0.88)", backdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(255,255,255,0.05)",
          position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
          transition: "width 0.22s ease", overflow: "hidden",
        }}>
          <NavContent />
        </aside>
      )}

      {/* Mobile sidebar */}
      {isMobile && (
        <aside style={{
          width: 260, height: "100vh",
          background: "rgba(6,12,24,0.97)", backdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s ease", overflowX: "visible", overflowY: "auto",
        }}>
          <NavContent inMobile />
        </aside>
      )}

      {/* Main content */}
      <div style={{
        flex: 1,
        marginLeft: isMobile ? 0 : sidebarWidth,
        minHeight: "100vh", display: "flex", flexDirection: "column",
        position: "relative", zIndex: 1,
        transition: "margin-left 0.22s ease",
      }}>
        {/* Mobile top bar */}
        {isMobile && (
          <div style={{
            padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)",
            background: "rgba(6,12,24,0.9)", backdropFilter: "blur(12px)",
            display: "flex", alignItems: "center", gap: 12,
            position: "sticky", top: 0, zIndex: 30,
          }}>
            <button onClick={() => setMobileOpen(true)} style={{
              background: "none", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, padding: "6px 9px", cursor: "pointer",
              color: "rgba(255,255,255,0.6)", fontSize: 16,
            }}>☰</button>
            <span style={{ fontWeight: 700, fontSize: 13, color: "#00D4FF" }}>BANK OF ASIA ONLINE</span>
            <div style={{ flex: 1 }} />
            <div style={{ position: "relative" }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "linear-gradient(135deg, #00D4FF, #0088CC)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, color: "#03050a",
              }}>{initials}</div>
              {unreadCount > 0 && (
                <div style={{
                  position: "absolute", top: -2, right: -2,
                  width: 10, height: 10, borderRadius: "50%",
                  background: "#FF3B5C", border: "2px solid rgba(6,12,24,0.9)",
                }} />
              )}
            </div>
          </div>
        )}

        {/* Global notice */}
        {globalNotice && (
          <div style={{
            padding: "10px 24px",
            background: "linear-gradient(90deg, rgba(240,180,41,0.12), rgba(240,180,41,0.06))",
            borderBottom: "1px solid rgba(240,180,41,0.2)",
            fontSize: 13, color: "#F0B429",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span>⚠️</span><span>{globalNotice}</span>
          </div>
        )}

        {/* Page content */}
        <main style={{ flex: 1, padding: isMobile ? "16px" : "28px", paddingBottom: isMobile ? 80 : 28, overflowX: "hidden" }}>
          {children}
        </main>
      </div>

      {/* Notification bubble — bottom left (above sidebar on mobile) */}
      {unreadCount > 0 && (
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          style={{
            position: "fixed",
            bottom: isMobile ? 76 : 24,
            left: isMobile ? 16 : (collapsed ? 72 : 248),
            zIndex: 200,
            background: "linear-gradient(135deg, rgba(13,26,48,0.97), rgba(6,12,24,0.99))",
            border: "1px solid rgba(0,212,255,0.25)",
            borderRadius: 999,
            padding: "8px 16px",
            display: "flex", alignItems: "center", gap: 8,
            cursor: "pointer",
            boxShadow: "0 4px 24px rgba(0,212,255,0.15), 0 2px 8px rgba(0,0,0,0.5)",
            transition: "left 0.22s ease",
          }}
        >
          <span style={{
            width: 20, height: 20, borderRadius: "50%",
            background: "#FF3B5C", color: "#fff",
            fontSize: 10, fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#f0f4ff", whiteSpace: "nowrap" }}>
            {unreadCount === 1 ? "1 Notification" : `${unreadCount} Notifications`}
          </span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>▲</span>
        </button>
      )}

      {/* Notification panel */}
      {showNotifications && (
        <>
          <div onClick={() => setShowNotifications(false)} style={{ position: "fixed", inset: 0, zIndex: 198 }} />
          <div className="notification-panel" style={{
            position: "fixed",
            bottom: isMobile ? 140 : 80,
            left: isMobile ? 16 : (collapsed ? 72 : 248),
            zIndex: 199,
            background: "rgba(6,12,24,0.98)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            width: isMobile ? "calc(100vw - 32px)" : 320,
            maxHeight: 400,
            overflowY: "auto",
            boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
          }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f4ff" }}>Notifications</div>
              {unreadCount > 0 && (
                <button onClick={markAllRead} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "rgba(0,212,255,0.8)", fontWeight: 600 }}>
                  Mark all read
                </button>
              )}
            </div>
            {notifications.length === 0 ? (
              <div style={{ padding: 24, textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>No notifications</div>
            ) : (
              notifications.map((n: any) => (
                <div key={n.id} style={{
                  padding: "12px 18px",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  background: n.isRead ? "transparent" : "rgba(0,212,255,0.03)",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    {!n.isRead && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00D4FF", flexShrink: 0, marginTop: 5 }} />}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#f0f4ff", marginBottom: 2 }}>{n.title}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{n.message}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 4 }}>
                        {new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Mobile bottom nav */}
      {isMobile && (
        <nav style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: "rgba(6,12,24,0.96)", backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          padding: "8px 0 12px", zIndex: 100,
          display: "flex", justifyContent: "space-around", alignItems: "center",
        }}>
          {MOBILE_NAV.map((item) => {
            const active = (item as any).exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                padding: "4px 12px",
                color: active ? "#00D4FF" : "rgba(255,255,255,0.35)",
                textDecoration: "none", fontSize: 10, fontWeight: active ? 600 : 400,
              }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
