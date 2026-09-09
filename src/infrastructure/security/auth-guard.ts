/**
 * @file auth-guard.ts
 * @description Server-side authentication and authorization guard for API routes.
 * Defends against Broken Authentication, BOLA/IDOR, and unauthorized access to administrative data.
 * @module infrastructure/security
 */

import { NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME, SessionPayload } from "./session";
import type { UserRole } from "@/core/domain/entities/Profile";
import type { AuthUser } from "@/core/auth/auth-types";

export type AuthGuardSuccess = {
  user: AuthUser;
  payload: SessionPayload;
};

export type AuthGuardResult = AuthGuardSuccess | NextResponse;

/**
 * Extracts session token from Cookie header or Authorization Bearer header.
 */
export function extractSessionToken(request: Request): string | null {
  // 1. Check Cookie header
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    const cookies = cookieHeader.split(";").map((c) => c.trim());
    for (const cookie of cookies) {
      if (cookie.startsWith(`${SESSION_COOKIE_NAME}=`)) {
        return decodeURIComponent(cookie.slice(SESSION_COOKIE_NAME.length + 1));
      }
    }
  }

  // 2. Check Authorization header: Bearer <token>
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice(7).trim();
  }

  return null;
}

/**
 * Enforces authentication and role-based authorization for API route handlers.
 * @param request The incoming HTTP Request
 * @param allowedRoles Optional list of roles permitted to access this resource
 * @returns AuthGuardSuccess if permitted, or a 401/403 NextResponse if denied.
 */
export async function requireAuth(
  request: Request,
  allowedRoles?: UserRole[]
): Promise<AuthGuardResult> {
  const token = extractSessionToken(request);

  if (!token) {
    return NextResponse.json(
      { error: "Authentication required. Please log in." },
      { status: 401 }
    );
  }

  const payload = await verifySessionToken(token);

  if (!payload) {
    return NextResponse.json(
      { error: "Session invalid or expired. Please re-authenticate." },
      { status: 401 }
    );
  }

  if (allowedRoles && !allowedRoles.includes(payload.role)) {
    return NextResponse.json(
      { error: "Access denied. Insufficient role permissions." },
      { status: 403 }
    );
  }

  const user: AuthUser = {
    id: payload.id,
    email: payload.email,
    fullName: payload.fullName,
    role: payload.role,
    title: payload.title,
  };

  return { user, payload };
}

/**
 * Helper to check if the result is an unauthorized/forbidden response.
 */
export function isAuthError(result: AuthGuardResult): result is NextResponse {
  return result instanceof NextResponse;
}
