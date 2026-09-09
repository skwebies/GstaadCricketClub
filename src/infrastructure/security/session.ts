/**
 * @file session.ts
 * @description Cryptographically signed session management using Web Crypto API HMAC-SHA256.
 * Universally compatible across Edge Middleware and Node.js runtimes.
 * Defends against Broken Authentication, session forgery, privilege escalation, and timing attacks.
 * @module infrastructure/security
 */

import type { UserRole } from "@/core/domain/entities/Profile";
import type { AuthUser } from "@/core/auth/auth-types";

export interface SessionPayload {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  title: string;
  iat: number;
  exp: number;
}

export const SESSION_COOKIE_NAME = "gcc_auth_session";
// 7 days expiration in seconds
export const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60;

function getSessionSecret(): string {
  return (
    process.env.SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "gstaad-cricket-club-enterprise-secret-key-2026-sha256"
  );
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function utf8ToBase64Url(str: string): string {
  const encoder = new TextEncoder();
  return base64UrlEncode(encoder.encode(str));
}

function base64UrlToUtf8(str: string): string {
  const bytes = base64UrlDecode(str);
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}

async function getHmacKey(secret: string, usage: KeyUsage[]): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    usage
  );
}

/**
 * Creates a cryptographically signed HMAC-SHA256 token for an authenticated user.
 */
export async function createSessionToken(user: AuthUser, durationSeconds = SESSION_DURATION_SECONDS): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    id: user.id,
    email: user.email.toLowerCase().trim(),
    role: user.role,
    fullName: user.fullName,
    title: user.title,
    iat: now,
    exp: now + durationSeconds,
  };

  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = utf8ToBase64Url(JSON.stringify(header));
  const encodedPayload = utf8ToBase64Url(JSON.stringify(payload));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const secret = getSessionSecret();
  const key = await getHmacKey(secret, ["sign"]);
  const encoder = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(dataToSign));
  const signature = base64UrlEncode(new Uint8Array(signatureBuffer));

  return `${dataToSign}.${signature}`;
}

/**
 * Verifies and decodes a signed session token.
 * Uses native Web Crypto subtle.verify for timing-safe constant-time validation.
 * Returns the verified SessionPayload, or null if invalid/expired/tampered.
 */
export async function verifySessionToken(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;
  const dataToSign = `${encodedHeader}.${encodedPayload}`;
  const secret = getSessionSecret();

  try {
    const key = await getHmacKey(secret, ["verify"]);
    const encoder = new TextEncoder();
    const sigBytes = base64UrlDecode(signature);

    const isValidSig = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes as unknown as BufferSource,
      encoder.encode(dataToSign)
    );
    if (!isValidSig) return null;

    const payloadJson = base64UrlToUtf8(encodedPayload);
    const payload: SessionPayload = JSON.parse(payloadJson);

    // Validate payload fields
    if (!payload.id || !payload.email || !payload.role || !payload.exp) {
      return null;
    }

    // Check expiration timestamp
    const now = Math.floor(Date.now() / 1000);
    if (now > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
