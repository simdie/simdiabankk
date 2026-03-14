import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  // --- Redirect authenticated users away from auth pages ---
  if (token && (pathname === "/login" || pathname === "/register")) {
    const role = token.role as string;
    return NextResponse.redirect(
      new URL(role === "ADMIN" ? "/admin" : "/dashboard", req.url)
    );
  }

  // --- Protect /dashboard routes ---
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // --- Protect /admin routes ---
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      // Allow unauthenticated access to admin login page
      if (token && (token.role as string) === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.next();
    }
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    if ((token.role as string) !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // --- Protect /api/admin routes ---
  if (pathname.startsWith("/api/admin")) {
    if (!token || (token.role as string) !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
};
