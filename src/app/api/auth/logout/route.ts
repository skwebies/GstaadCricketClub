import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/infrastructure/security/session";

export const dynamic = "force-dynamic";

export async function POST() {
  const isProduction = process.env.NODE_ENV === "production";
  const clearCookieFlags = [
    `${SESSION_COOKIE_NAME}=`,
    "Path=/",
    "Max-Age=0",
    "SameSite=Lax",
    isProduction ? "Secure" : "",
    "HttpOnly",
  ]
    .filter(Boolean)
    .join("; ");

  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  response.headers.set("Set-Cookie", clearCookieFlags);
  return response;
}
