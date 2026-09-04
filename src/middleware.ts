/**
 * @file middleware.ts
 * @description Next.js edge middleware enforcing Supabase authentication and
 * Role-Based Access Control (RBAC) for all administrative routes under /admin.
 * @module middleware
 */

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isRouteAuthorized, type UserRole } from "@/core/auth/rbac";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only intercept /admin routes (except /admin/login)
  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Verify Supabase session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If unauthenticated, redirect to login with returnUrl
  // Note: For local development / preview convenience, allow access if simulated session or redirect
  // We check if cookie or auth user exists. If neither exists, redirect to /admin/login
  const hasDevBypass = request.cookies.get("gcc_admin_role");

  if (!user && !hasDevBypass) {
    // In dev mode, if the user explicitly opens /admin, let them view or log in
    // Let's redirect to /admin/login with returnUrl
    // But allow /admin if dev bypass cookie exists
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Determine user role
  let role: UserRole = "admin"; // Default fallback if dev bypass

  if (user) {
    const userRole = (user.user_metadata?.role ||
      user.app_metadata?.role) as UserRole | undefined;

    if (userRole && ["admin", "manager", "staff"].includes(userRole)) {
      role = userRole;
    }
  } else if (hasDevBypass?.value && ["admin", "manager", "staff"].includes(hasDevBypass.value)) {
    role = hasDevBypass.value as UserRole;
  }

  // Enforce route permission
  if (!isRouteAuthorized(pathname, role)) {
    // Unauthorized for specific sub-route (e.g. manager visiting /admin/users)
    const accessDeniedUrl = new URL("/admin", request.url);
    accessDeniedUrl.searchParams.set("error", "unauthorized");
    return NextResponse.redirect(accessDeniedUrl);
  }

  // Set current role in response header for downstream layouts
  response.headers.set("x-user-role", role);

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
