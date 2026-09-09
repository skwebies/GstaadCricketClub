/**
 * @file middleware.ts
 * @description Enterprise-grade edge security middleware defending against:
 * - Distributed Denial-of-Service (DDoS) / Rate Limiting
 * - Cross-Site Request Forgery (CSRF)
 * - Directory Traversal (LFI / Path Traversal)
 * - XML External Entity (XXE) Injection
 * - Broken Authentication & Access Control on /admin routes
 * - Man-in-the-Middle (MitM) & Clickjacking via Security Headers
 * @module root
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/infrastructure/security/session";
import { checkRateLimit } from "@/infrastructure/security/rate-limiter";
import { getClientIp } from "@/infrastructure/security/anti-spam";

// Whitelisted origins for CSRF defense
const ALLOWED_HOSTS = new Set([
  "gstaadcricketclub.ch",
  "www.gstaadcricketclub.ch",
  "localhost",
  "127.0.0.1",
]);

function isAllowedOrigin(originHeader: string | null, hostHeader: string | null): boolean {
  if (!originHeader) return true; // Direct same-origin browser navigations may omit Origin

  try {
    const originUrl = new URL(originHeader);
    const hostname = originUrl.hostname.toLowerCase();

    if (ALLOWED_HOSTS.has(hostname)) return true;

    // Check host header match
    if (hostHeader) {
      const hostClean = hostHeader.split(":")[0].toLowerCase();
      if (hostname === hostClean) return true;
    }

    // Check NEXT_PUBLIC_SITE_URL if configured
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL);
      if (hostname === siteUrl.hostname.toLowerCase()) return true;
    }

    return false;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const clientIp = getClientIp(request);

  // =========================================================================
  // 1. Directory Traversal & Path Traversal Defense
  // =========================================================================
  const rawUrl = request.url.toLowerCase();
  const traversalPatterns = ["..", "%2e%2e", "\\", "%5c", "%00"];
  const hasTraversal = traversalPatterns.some(
    (pattern) => pathname.includes(pattern) || search.includes(pattern) || rawUrl.includes(pattern)
  );

  if (hasTraversal) {
    console.warn(`[Security Alert] Blocked Directory Traversal attempt from IP ${clientIp} on path: ${pathname}`);
    return new NextResponse(JSON.stringify({ error: "Bad Request: Invalid path characters detected." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // =========================================================================
  // 2. XML External Entity (XXE) Injection Defense
  // =========================================================================
  const contentType = request.headers.get("content-type")?.toLowerCase() || "";
  if (contentType.includes("xml")) {
    console.warn(`[Security Alert] Blocked XXE payload attempt from IP ${clientIp} with Content-Type: ${contentType}`);
    return new NextResponse(JSON.stringify({ error: "Unsupported Media Type: XML is not permitted." }), {
      status: 415,
      headers: { "Content-Type": "application/json" },
    });
  }

  // =========================================================================
  // 3. Cross-Site Request Forgery (CSRF) Defense
  // =========================================================================
  const method = request.method.toUpperCase();
  const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(method);

  if (isMutation) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");

    if (origin && !isAllowedOrigin(origin, host)) {
      console.warn(`[Security Alert] Blocked CSRF attempt from untrusted Origin: ${origin} to ${pathname}`);
      return new NextResponse(JSON.stringify({ error: "Forbidden: Cross-Site Request Forgery attempt blocked." }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // =========================================================================
  // 4. Distributed Denial-of-Service (DDoS) Rate Limiting
  // =========================================================================
  // Skip static assets from in-memory rate limiting
  const isStaticAsset =
    pathname.startsWith("/_next") ||
    pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|woff2|css|js)$/i);

  if (!isStaticAsset) {
    // API routes: 60 requests / minute. General pages: 180 requests / minute.
    const isApi = pathname.startsWith("/api");
    const maxRequests = isApi ? 60 : 180;
    const rateLimit = checkRateLimit(`ddos_guard:${isApi ? "api" : "page"}:${clientIp}`, maxRequests, 60 * 1000);

    if (!rateLimit.allowed) {
      console.warn(`[Security Alert] Throttling excessive requests from IP ${clientIp} on ${pathname}`);
      return new NextResponse(
        JSON.stringify({ error: "Too Many Requests. Please slow down." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": `${rateLimit.resetInSeconds}`,
          },
        }
      );
    }
  }

  // =========================================================================
  // 5. Broken Authentication & Admin Route Guard
  // =========================================================================
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";

  if (isAdminRoute && !isLoginRoute) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySessionToken(sessionCookie);

    if (!session) {
      // Unauthenticated access to admin portal -> redirect to login
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Continue to target handler
  const response = NextResponse.next();

  // =========================================================================
  // 6. Security Misconfiguration & MitM Defense: Security Headers
  // =========================================================================
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self'",
    "connect-src 'self' https://*.supabase.co https://api.web3forms.com",
    "frame-ancestors 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
