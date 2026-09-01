import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { CUSTOMER_SESSION_COOKIE } from "@/lib/customerAuth";

const PORTAL_HOST = "mijn.adventuretravels.nl";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;
  const isPortalHost = host === PORTAL_HOST || host.startsWith("mijn.");

  // /portal is an internal rewrite target for the mijn.* subdomain; never reachable directly.
  if (pathname.startsWith("/portal") && !isPortalHost) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const internalPath = pathname.startsWith("/portal")
    ? pathname
    : isPortalHost
      ? `/portal${pathname === "/" ? "" : pathname}`
      : pathname;

  // Content CMS on adventuretravels.nl/admin — unchanged behavior.
  if (internalPath.startsWith("/admin") && internalPath !== "/admin/login") {
    const email = verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
    if (!email) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Staff side of the booking portal (mijn.adventuretravels.nl/staff/*).
  if (internalPath.startsWith("/portal/staff") && internalPath !== "/portal/staff/login") {
    const email = verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
    if (!email) {
      const url = request.nextUrl.clone();
      url.pathname = "/staff/login";
      return NextResponse.redirect(url);
    }
  }

  // Customer side of the booking portal (mijn.adventuretravels.nl/boekingen/*).
  if (internalPath.startsWith("/portal/boekingen")) {
    const email = verifySessionToken(request.cookies.get(CUSTOMER_SESSION_COOKIE)?.value);
    if (!email) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  if (internalPath !== pathname) {
    const url = request.nextUrl.clone();
    url.pathname = internalPath;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
