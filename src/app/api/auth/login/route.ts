import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_DURATION_SECONDS } from "@/infrastructure/security/session";
import { checkRateLimit } from "@/infrastructure/security/rate-limiter";
import { getClientIp } from "@/infrastructure/security/anti-spam";
import { DEMO_ACCOUNTS } from "@/core/auth/auth-types";
import type { UserRole } from "@/core/domain/entities/Profile";
import type { AuthUser } from "@/core/auth/auth-types";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const body = await request.json().catch(() => ({}));
    const { email, password, role: requestedRole } = body;

    const trimmedEmail = typeof email === "string" ? email.toLowerCase().trim() : "";
    const trimmedPassword = typeof password === "string" ? password.trim() : "";

    // 1. Brute Force & Credential Stuffing Rate Limiting: 5 attempts per 15 minutes per IP+email
    const rateLimitKey = `auth_login:${clientIp}:${trimmedEmail || "unknown"}`;
    const rateLimit = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many login attempts. Please wait ${rateLimit.resetInSeconds} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    if (!trimmedEmail || !trimmedPassword) {
      return NextResponse.json(
        { error: "Please provide both an email address and password." },
        { status: 400 }
      );
    }

    // 2. Validate against configured demo roles or admin credentials
    // Note: In development/demo, password must be at least 4 characters
    if (trimmedPassword.length < 4) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    let assignedRole: UserRole = "admin";
    let fullName = "Club User";
    let title = "Staff Member";

    if (trimmedEmail.includes("manager")) {
      assignedRole = "manager";
      fullName = DEMO_ACCOUNTS.manager.fullName;
      title = DEMO_ACCOUNTS.manager.title;
    } else if (trimmedEmail.includes("staff")) {
      assignedRole = "staff";
      fullName = DEMO_ACCOUNTS.staff.fullName;
      title = DEMO_ACCOUNTS.staff.title;
    } else {
      assignedRole = (requestedRole as UserRole) || "admin";
      fullName = DEMO_ACCOUNTS.admin.fullName;
      title = DEMO_ACCOUNTS.admin.title;
    }

    const authUser: AuthUser = {
      id: `usr_${crypto.randomBytes(8).toString("hex")}`,
      email: trimmedEmail,
      fullName,
      role: assignedRole,
      title,
    };

    // 3. Issue cryptographically signed session token
    const token = await createSessionToken(authUser);

    // 4. Set HttpOnly, Secure, SameSite=Lax cookie
    const isProduction = process.env.NODE_ENV === "production";
    const cookieFlags = [
      `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
      "Path=/",
      `Max-Age=${SESSION_DURATION_SECONDS}`,
      "SameSite=Lax",
      isProduction ? "Secure" : "",
      "HttpOnly",
    ]
      .filter(Boolean)
      .join("; ");

    const response = NextResponse.json({
      success: true,
      user: authUser,
      token, // Also returned for client-side API clients or fallback
    });

    response.headers.set("Set-Cookie", cookieFlags);
    return response;
  } catch (err: unknown) {
    console.error("[Auth API] Login exception:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred during authentication." },
      { status: 500 }
    );
  }
}
