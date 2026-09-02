import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "node:crypto";

// Proxy runs in its own bundle — deliberately no imports from @/lib/auth or
// @/lib/customerAuth (which pull in Prisma, Resend, and next/headers). Only the
// pure HMAC check needed to gate routes is duplicated here.
const SESSION_COOKIE = "at_admin_session";
const CUSTOMER_SESSION_COOKIE = "at_customer_session";
const PORTAL_HOST = "mijn.adventuretravels.nl";

function verifySessionToken(token: string | undefined): string | null {
  if (!token) return null;
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;
  const [encodedEmail, signature] = token.split(".");
  if (!encodedEmail || !signature) return null;
  const email = Buffer.from(encodedEmail, "base64url").toString("utf8");
  const expected = crypto.createHmac("sha256", secret).update(email).digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return email;
}

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

  // Publieke pad (zonder /portal-rewrite) voor hreflang/canonical in de layout.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  if (internalPath !== pathname) {
    const url = request.nextUrl.clone();
    url.pathname = internalPath;
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
