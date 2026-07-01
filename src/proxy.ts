import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  const customerToken = req.cookies.get("customer_session")?.value;
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

  if (pathname === "/portal") {
    return NextResponse.redirect(new URL(customerToken ? "/portal/dashboard" : "/portal/login", req.url));
  }

  const customerAuthPage = pathname === "/portal/login" || pathname === "/portal/register";
  if (customerAuthPage && customerToken) {
    return NextResponse.redirect(new URL("/portal/dashboard", req.url));
  }

  if (pathname.startsWith("/portal/") && !customerAuthPage && !customerToken) {
    const loginUrl = new URL("/portal/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin", "/portal/:path*", "/portal"],
};
