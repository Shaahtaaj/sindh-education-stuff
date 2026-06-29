import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  const pathname = req.nextUrl.pathname;

  // /admin should go to dashboard if logged in, otherwise login
  if (pathname === "/admin") {
    return NextResponse.redirect(
      new URL(token ? "/admin/dashboard" : "/admin/login", req.url)
    );
  }

  // If already logged in, do not show login page
  if (pathname === "/admin/login" && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  // Protect all admin pages except login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};