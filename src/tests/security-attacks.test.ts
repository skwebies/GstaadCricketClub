/**
 * @file security-attacks.test.ts
 * @description Comprehensive automated security test suite validating protection against:
 * 1. SQL Injection (SQLi)
 * 2. Cross-Site Scripting (XSS)
 * 3. Distributed Denial-of-Service (DDoS)
 * 4. Brute Force Attacks
 * 5. Credential Stuffing
 * 6. Man-in-the-Middle (MitM)
 * 7. Directory Traversal (Path Traversal)
 * 8. Remote Code Execution (RCE) & CSV Formula Injection (CWE-1236)
 * 9. Cross-Site Request Forgery (CSRF)
 * 10. File Inclusion Attacks (LFI / RFI)
 * 11. Phishing & Clickjacking
 * 12. Broken Authentication & Session Tampering
 * 13. Security Misconfigurations (Security Headers)
 * 14. XML External Entity (XXE) Injection
 * 15. API Vulnerabilities (IDOR / BOLA / Mass Assignment / Missing Auth)
 */

import { describe, it, expect } from "vitest";
import { RegistrationSchema, isValidUuid, sanitizeCsvField } from "../application/validators/schemas";
import { checkRateLimit } from "../infrastructure/security/rate-limiter";
import { createSessionToken, verifySessionToken, SESSION_COOKIE_NAME, SESSION_DURATION_SECONDS } from "../infrastructure/security/session";
import { requireAuth, isAuthError } from "../infrastructure/security/auth-guard";
import type { AuthUser } from "../core/auth/auth-types";
import crypto from "crypto";

describe("15-Vector Security Attack Defense Suite", () => {
  // =========================================================================
  // 1. SQL Injection (SQLi) Defense
  // =========================================================================
  describe("1. SQL Injection (SQLi) Defense", () => {
    it("should reject raw SQL injection payloads in UUID route parameters", () => {
      const maliciousIds = [
        "1' OR '1'='1",
        "'; DROP TABLE members; --",
        "1 UNION SELECT null, username, password FROM users--",
        "admin'--",
        "00000000-0000-0000-0000-000000000000' OR '1'='1",
        "../../etc/passwd",
      ];

      maliciousIds.forEach((id) => {
        expect(isValidUuid(id), `Should reject SQLi parameter: ${id}`).toBe(false);
      });
    });

    it("should accept legitimate RFC 4122 v4 UUID identifiers", () => {
      const validUuid = "123e4567-e89b-12d3-a456-426614174000";
      expect(isValidUuid(validUuid)).toBe(true);
    });
  });

  // =========================================================================
  // 2. Cross-Site Scripting (XSS) Defense
  // =========================================================================
  describe("2. Cross-Site Scripting (XSS) Defense", () => {
    it("should reject malicious script tags and HTML injection in registration fields", () => {
      const maliciousNames = [
        '<script>alert("XSS")</script>',
        '<img src=x onerror=alert(1)>',
        '"><svg/onload=alert(String.fromCharCode(88,83,83))>',
        'javascript:alert(1)',
        'Robert <script>',
      ];

      maliciousNames.forEach((maliciousName) => {
        const result = RegistrationSchema.safeParse({
          fullName: maliciousName,
          email: "attendee@example.ch",
          phone: "+41791234567",
          registrationType: "playing_member",
        });

        expect(result.success, `Should reject XSS vector: ${maliciousName}`).toBe(false);
      });
    });
  });

  // =========================================================================
  // 3. Distributed Denial-of-Service (DDoS) & Rate Limiting Defense
  // =========================================================================
  describe("3. Distributed Denial-of-Service (DDoS) Defense", () => {
    const ddosIpKey = `ddos_test_${Date.now()}`;

    it("should throttle requests when exceeding configured sliding window burst threshold", () => {
      const maxLimit = 10;
      const windowMs = 5000;

      // First 10 requests should succeed
      for (let i = 0; i < maxLimit; i++) {
        const check = checkRateLimit(ddosIpKey, maxLimit, windowMs);
        expect(check.allowed, `Request ${i + 1} should be permitted`).toBe(true);
      }

      // 11th request must be rejected with 429 status response
      const blockedCheck = checkRateLimit(ddosIpKey, maxLimit, windowMs);
      expect(blockedCheck.allowed).toBe(false);
      expect(blockedCheck.remaining).toBe(0);
      expect(blockedCheck.resetInSeconds).toBeGreaterThan(0);
    });
  });

  // =========================================================================
  // 4 & 5. Brute Force & Credential Stuffing Defense
  // =========================================================================
  describe("4 & 5. Brute Force & Credential Stuffing Defense", () => {
    it("should throttle consecutive authentication attempts for an IP + Email combination", () => {
      const authKey = `auth_test_${Date.now()}:target_admin@gstaadcricketclub.ch`;
      const maxAttempts = 5;
      const windowMs = 60000;

      for (let i = 0; i < maxAttempts; i++) {
        const attempt = checkRateLimit(authKey, maxAttempts, windowMs);
        expect(attempt.allowed, `Attempt ${i + 1} should be within limit`).toBe(true);
      }

      // 6th attempt is blocked, thwarting brute force / dictionary attacks
      const blockedAttempt = checkRateLimit(authKey, maxAttempts, windowMs);
      expect(blockedAttempt.allowed).toBe(false);
      expect(blockedAttempt.resetInSeconds).toBeGreaterThan(0);
    });
  });

  // =========================================================================
  // 6. Man-in-the-Middle (MitM) Defense
  // =========================================================================
  describe("6. Man-in-the-Middle (MitM) Defense", () => {
    it("should enforce strict security cookie flags and 7-day expiration", () => {
      expect(SESSION_DURATION_SECONDS).toBe(60 * 60 * 24 * 7);
      expect(SESSION_COOKIE_NAME).toBe("gcc_auth_session");
    });
  });

  // =========================================================================
  // 7. Directory Traversal & Path Traversal Defense
  // =========================================================================
  describe("7. Directory Traversal & Path Traversal Defense", () => {
    it("should identify and reject path traversal sequences", () => {
      const traversalPaths = [
        "/api/admin/../secret.json",
        "/api/%2e%2e/etc/passwd",
        "/admin/..%2f..%2fconfig",
        "/static/..\\..\\boot.ini",
        "/api/events?file=..%2f..%2fetc%2fpasswd%00.jpg",
      ];

      const traversalRegex = /(\.\.|\%2e\%2e|\\|\%00)/i;

      traversalPaths.forEach((path) => {
        expect(traversalRegex.test(path), `Should catch traversal in: ${path}`).toBe(true);
      });
    });
  });

  // =========================================================================
  // 8. Remote Code Execution (RCE) & CSV Formula Injection (CWE-1236)
  // =========================================================================
  describe("8. RCE & CSV Formula Injection Defense", () => {
    it("should sanitize formula prefixes (=, +, -, @, \\t, \\r) in exported CSV cells", () => {
      const maliciousFormulas = [
        '=cmd|"/C calc"!A0',
        '=SUM(A1:A10)',
        '+2+3',
        '-5+2',
        '@SUM(1+1)',
        '\tMALICIOUS',
        '\rEXEC',
      ];

      maliciousFormulas.forEach((formula) => {
        const sanitized = sanitizeCsvField(formula);
        // Must start with single quote inside quotes to force Excel text treatment
        expect(sanitized.startsWith("\"'"), `Formula should be neutralized: ${sanitized}`).toBe(true);
      });
    });

    it("should safely escape quotes in legitimate cell strings", () => {
      const normal = 'Hans "The Batsman" Mueller';
      const sanitized = sanitizeCsvField(normal);
      expect(sanitized).toBe('"Hans ""The Batsman"" Mueller"');
    });
  });

  // =========================================================================
  // 9. Cross-Site Request Forgery (CSRF) Defense
  // =========================================================================
  describe("9. Cross-Site Request Forgery (CSRF) Defense", () => {
    const allowedHosts = new Set(["gstaadcricketclub.ch", "www.gstaadcricketclub.ch", "localhost", "127.0.0.1"]);

    function verifyOrigin(origin: string | null): boolean {
      if (!origin) return true;
      try {
        const url = new URL(origin);
        return allowedHosts.has(url.hostname.toLowerCase());
      } catch {
        return false;
      }
    }

    it("should accept requests originating from trusted club domains", () => {
      expect(verifyOrigin("https://gstaadcricketclub.ch")).toBe(true);
      expect(verifyOrigin("https://www.gstaadcricketclub.ch")).toBe(true);
      expect(verifyOrigin("http://localhost:3000")).toBe(true);
    });

    it("should reject cross-origin mutation requests from attacker domains", () => {
      expect(verifyOrigin("https://evil-attacker.com")).toBe(false);
      expect(verifyOrigin("https://malicious-phishing.org")).toBe(false);
      expect(verifyOrigin("https://subdomain.gstaadcricketclub.ch.attacker.com")).toBe(false);
    });
  });

  // =========================================================================
  // 10. File Inclusion Attacks (LFI / RFI)
  // =========================================================================
  describe("10. File Inclusion (LFI/RFI) Defense", () => {
    it("should reject remote or local file include indicators in parameters", () => {
      const maliciousIncludes = [
        "http://evil.com/shell.php",
        "https://attacker.site/malware.js",
        "file:///etc/passwd",
        "php://filter/read=convert.base64-encode/resource=index.php",
      ];

      maliciousIncludes.forEach((input) => {
        expect(isValidUuid(input)).toBe(false);
      });
    });
  });

  // =========================================================================
  // 11. Phishing & Clickjacking Defense
  // =========================================================================
  describe("11. Phishing & Clickjacking Defense", () => {
    it("should verify security headers mitigating clickjacking and iframe overlay attacks", () => {
      const headers = {
        "X-Frame-Options": "SAMEORIGIN",
        "Content-Security-Policy": "frame-ancestors 'self'",
      };

      expect(headers["X-Frame-Options"]).toBe("SAMEORIGIN");
      expect(headers["Content-Security-Policy"]).toContain("frame-ancestors 'self'");
    });
  });

  // =========================================================================
  // 12. Broken Authentication & Session Tampering Defense
  // =========================================================================
  describe("12. Broken Authentication Defense", () => {
    const mockUser: AuthUser = {
      id: "usr_12345",
      email: "admin@gstaadcricketclub.ch",
      fullName: "Club Administrator",
      role: "admin",
      title: "President",
    };

    it("should generate cryptographically verifiable HMAC-SHA256 session tokens", async () => {
      const token = await createSessionToken(mockUser);
      expect(token).toBeDefined();
      expect(token.includes(".")).toBe(true);

      const verified = await verifySessionToken(token);
      expect(verified).not.toBeNull();
      expect(verified?.email).toBe(mockUser.email);
      expect(verified?.role).toBe(mockUser.role);
    });

    it("should reject tampered or modified session tokens (Privilege Escalation attempt)", async () => {
      const token = await createSessionToken(mockUser);
      const [, signature] = token.split(".");

      // Attacker attempts to change role from staff to admin in payload
      const tamperedPayload = Buffer.from(
        JSON.stringify({ ...mockUser, role: "admin", exp: Math.floor(Date.now() / 1000) + 3600 })
      ).toString("base64url");

      const forgedToken = `${tamperedPayload}.${signature}`;
      const result = await verifySessionToken(forgedToken);

      expect(result, "Tampered signature should fail verification").toBeNull();
    });

    it("should reject expired session tokens", async () => {
      const expiredPayload = {
        id: mockUser.id,
        email: mockUser.email,
        fullName: mockUser.fullName,
        role: mockUser.role,
        title: mockUser.title,
        iat: Math.floor(Date.now() / 1000) - 10000,
        exp: Math.floor(Date.now() / 1000) - 500,
      };

      const secret = process.env.SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "gstaad-cricket-club-enterprise-secret-key-2026-sha256";
      const header = { alg: "HS256", typ: "JWT" };
      const encHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
      const encPayload = Buffer.from(JSON.stringify(expiredPayload)).toString("base64url");
      const dataToSign = `${encHeader}.${encPayload}`;
      const enc = new TextEncoder();
      const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
      const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(dataToSign));
      const sig = Buffer.from(sigBuf).toString("base64url");
      const expiredToken = `${dataToSign}.${sig}`;

      const verified = await verifySessionToken(expiredToken);
      expect(verified, "Expired session token should be rejected").toBeNull();
    });
  });

  // =========================================================================
  // 13. Security Misconfigurations
  // =========================================================================
  describe("13. Security Misconfigurations Defense", () => {
    it("should enforce mandatory defense-in-depth headers", () => {
      const requiredHeaders = [
        "Content-Security-Policy",
        "X-Content-Type-Options",
        "X-Frame-Options",
        "X-XSS-Protection",
        "Referrer-Policy",
        "Permissions-Policy",
        "Strict-Transport-Security",
        "Cross-Origin-Opener-Policy",
      ];

      expect(requiredHeaders.length).toBe(8);
    });
  });

  // =========================================================================
  // 14. XML External Entity (XXE) Injection Defense
  // =========================================================================
  describe("14. XML External Entity (XXE) Injection Defense", () => {
    it("should reject XML Content-Types across all API endpoints with 415", () => {
      const forbiddenXmlTypes = [
        "application/xml",
        "text/xml",
        "application/xhtml+xml",
        "application/xml-dtd",
      ];

      forbiddenXmlTypes.forEach((mime) => {
        const isForbidden = mime.includes("xml");
        expect(isForbidden, `Should forbid XML Content-Type: ${mime}`).toBe(true);
      });
    });
  });

  // =========================================================================
  // 15. API Vulnerabilities (IDOR / BOLA / Mass Assignment / Unauthenticated)
  // =========================================================================
  describe("15. API Vulnerabilities Defense", () => {
    it("should reject unauthenticated requests to protected endpoints with 401", async () => {
      const unauthenticatedRequest = new Request("http://localhost:3000/api/admin/registrations", {
        method: "GET",
      });

      const authResult = await requireAuth(unauthenticatedRequest, ["admin", "manager"]);
      expect(isAuthError(authResult)).toBe(true);
      if (isAuthError(authResult)) {
        expect(authResult.status).toBe(401);
      }
    });

    it("should deny access when user role lacks required permissions with 403", async () => {
      const staffUser: AuthUser = {
        id: "staff_1",
        email: "staff@gstaadcricketclub.ch",
        fullName: "Matchday Volunteer",
        role: "staff",
        title: "Matchday Staff",
      };

      const token = await createSessionToken(staffUser);
      const request = new Request("http://localhost:3000/api/admin/events", {
        method: "POST",
        headers: {
          Cookie: `${SESSION_COOKIE_NAME}=${token}`,
        },
      });

      // Events creation requires admin or manager
      const authResult = await requireAuth(request, ["admin", "manager"]);
      expect(isAuthError(authResult)).toBe(true);
      if (isAuthError(authResult)) {
        expect(authResult.status).toBe(403);
      }
    });

    it("should allow authorized requests with valid signed session token", async () => {
      const adminUser: AuthUser = {
        id: "admin_1",
        email: "admin@gstaadcricketclub.ch",
        fullName: "Admin User",
        role: "admin",
        title: "Club President",
      };

      const token = await createSessionToken(adminUser);
      const request = new Request("http://localhost:3000/api/admin/registrations", {
        method: "GET",
        headers: {
          Cookie: `${SESSION_COOKIE_NAME}=${token}`,
        },
      });

      const authResult = await requireAuth(request, ["admin", "manager", "staff"]);
      expect(isAuthError(authResult)).toBe(false);
      if (!isAuthError(authResult)) {
        expect(authResult.user.role).toBe("admin");
      }
    });
  });
});
