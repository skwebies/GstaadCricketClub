/**
 * @file smtp-security.test.ts
 * @description Unit tests for SMTP configuration, anti-spam honeypot defense,
 * sliding-window rate limiter, and email template generation.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { sanitizeHeader, isHoneypotTriggered, getClientIp } from "../infrastructure/security/anti-spam";
import { checkRateLimit, resetRateLimiter } from "../infrastructure/security/rate-limiter";
import {
  renderRegistrationAdminEmail,
  renderRegistrationUserConfirmation,
  renderMembershipAdminEmail,
  renderMembershipUserConfirmation,
  renderContactAdminEmail,
  renderContactUserConfirmation,
} from "../infrastructure/email/email-templates";
import { getSmtpConfig, dispatchEmail, buildMimeMessage, extractEmailAddress } from "../infrastructure/email/smtp-client";

describe("Anti-Spam & Header Injection Defense", () => {
  it("should strip CRLF characters to prevent SMTP header injection", () => {
    const maliciousInput = "Registration Subject\r\nBcc: victim@example.com\r\nContent-Type: text/html";
    const cleaned = sanitizeHeader(maliciousInput);

    expect(cleaned).not.toContain("\r");
    expect(cleaned).not.toContain("\n");
    expect(cleaned).toBe("Registration Subject Bcc: victim@example.com Content-Type: text/html");
  });

  it("should truncate excessively long subject headers to 250 characters", () => {
    const longString = "A".repeat(300);
    const cleaned = sanitizeHeader(longString);
    expect(cleaned.length).toBe(250);
  });

  it("should handle undefined and null gracefully", () => {
    expect(sanitizeHeader(undefined)).toBe("");
    expect(sanitizeHeader(null)).toBe("");
    expect(sanitizeHeader("")).toBe("");
  });

  it("should detect bot submissions via invisible honeypot trap", () => {
    expect(isHoneypotTriggered("http://spam-link.com")).toBe(true);
    expect(isHoneypotTriggered("bot text")).toBe(true);
    expect(isHoneypotTriggered("   ")).toBe(false); // Whitespace only is treated as empty
    expect(isHoneypotTriggered("")).toBe(false);
    expect(isHoneypotTriggered(undefined)).toBe(false);
    expect(isHoneypotTriggered(null)).toBe(false);
  });

  it("should extract client IP from request headers", () => {
    const mockRequest1 = new Request("http://localhost:3000/api/contact", {
      headers: { "x-forwarded-for": "194.12.34.56, 10.0.0.1" },
    });
    expect(getClientIp(mockRequest1)).toBe("194.12.34.56");

    const mockRequest2 = new Request("http://localhost:3000/api/contact", {
      headers: { "x-real-ip": "85.10.20.30" },
    });
    expect(getClientIp(mockRequest2)).toBe("85.10.20.30");

    const mockRequestFallback = new Request("http://localhost:3000/api/contact");
    expect(getClientIp(mockRequestFallback)).toBe("127.0.0.1");
  });
});

describe("Sliding Window Rate Limiter", () => {
  beforeEach(() => {
    resetRateLimiter();
  });

  it("should allow up to maxRequests within the time window", () => {
    const ip = "192.168.1.100";
    const key = `test:${ip}`;

    for (let i = 0; i < 5; i++) {
      const res = checkRateLimit(key, 5, 60000);
      expect(res.allowed).toBe(true);
      expect(res.remaining).toBe(4 - i);
    }

    // 6th request should be blocked
    const blockedRes = checkRateLimit(key, 5, 60000);
    expect(blockedRes.allowed).toBe(false);
    expect(blockedRes.remaining).toBe(0);
    expect(blockedRes.resetInSeconds).toBeGreaterThan(0);
  });

  it("should track rate limits independently across different IP keys", () => {
    const ipA = "test:10.0.0.1";
    const ipB = "test:10.0.0.2";

    // Exhaust IP A
    for (let i = 0; i < 3; i++) {
      checkRateLimit(ipA, 3, 60000);
    }
    expect(checkRateLimit(ipA, 3, 60000).allowed).toBe(false);

    // IP B should still be allowed
    expect(checkRateLimit(ipB, 3, 60000).allowed).toBe(true);
  });
});

describe("Email Templates Generator", () => {
  it("should render registration admin alert and registrant confirmation", () => {
    const regData = {
      fullName: "Lord Charles Spencer",
      email: "spencer@alps.ch",
      phone: "+41 33 748 00 00",
      registrationType: "VIP Patron",
      partySize: 4,
      dietaryRequirements: "Vegetarian luncheon requested",
    };

    const adminEmail = renderRegistrationAdminEmail(regData);
    expect(adminEmail.subject).toContain("Lord Charles Spencer");
    expect(adminEmail.html).toContain("Gstaad Cricket Festival 2026");
    expect(adminEmail.html).toContain("VIP Patron");
    expect(adminEmail.text).toContain("spencer@alps.ch");

    const userEmail = renderRegistrationUserConfirmation(regData);
    expect(userEmail.subject).toContain("Reservation Confirmation");
    expect(userEmail.html).toContain("Ebnit School Pitch");
    expect(userEmail.text).toContain("DEAR LORD CHARLES SPENCER");
  });

  it("should render membership application templates with proper styling", () => {
    const memberData = {
      fullName: "Dr. Beatrix von Greyerz",
      email: "beatrix@greyerz.ch",
      phone: "+41 33 800 11 22",
      tier: "Full Playing",
      handicapOrExperience: "MCC All-Rounder, 15 years",
      notes: "Looking forward to Saturday fixtures",
    };

    const adminEmail = renderMembershipAdminEmail(memberData);
    expect(adminEmail.subject).toContain("Dr. Beatrix von Greyerz");
    expect(adminEmail.html).toContain("MCC All-Rounder");

    const userEmail = renderMembershipUserConfirmation(memberData);
    expect(userEmail.subject).toContain("Membership Application Received");
    expect(userEmail.html).toContain("Full Playing");
  });

  it("should escape potential HTML injection in contact messages", () => {
    const contactData = {
      name: "Attacker <script>alert(1)</script>",
      email: "test@example.com",
      subject: "Test <img src=x onerror=alert(1)>",
      message: "Hello <b>World</b> & friends",
      clientIp: "127.0.0.1",
    };

    const adminEmail = renderContactAdminEmail(contactData);
    expect(adminEmail.html).not.toContain("<script>");
    expect(adminEmail.html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(adminEmail.html).toContain("&lt;img src=x onerror=alert(1)&gt;");

    const userEmail = renderContactUserConfirmation(contactData);
    expect(userEmail.html).not.toContain("<script>");
    expect(userEmail.text).toContain("Test <img src=x onerror=alert(1)>");
  });
});

describe("SMTP Client Configuration & Safe Dispatch", () => {
  it("should resolve default Plesk mail server parameters", () => {
    const config = getSmtpConfig();
    expect(config.host).toBe("gstaadcricketclub.ch");
    expect(config.port).toBe(465);
    expect(config.secure).toBe(true);
    expect(config.user).toBe("info@gstaadcricketclub.ch");
    expect(config.adminRecipient).toBe("info@gstaadcricketclub.ch");
  });

  it("should correctly extract raw email address from formatted strings", () => {
    expect(extractEmailAddress('"Gstaad Cricket Club" <info@gstaadcricketclub.ch>')).toBe("info@gstaadcricketclub.ch");
    expect(extractEmailAddress("<contact@alps.ch>")).toBe("contact@alps.ch");
    expect(extractEmailAddress("member@gstaad.ch")).toBe("member@gstaad.ch");
  });

  it("should build valid RFC 5322 MIME multipart/alternative messages", () => {
    const config = getSmtpConfig();
    const { raw, messageId } = buildMimeMessage(
      {
        to: "recipient@alps.ch",
        subject: "Gstaad Cricket Club Festival 2026",
        text: "Plain text greeting",
        html: "<p>HTML greeting</p>",
        replyTo: "reply@alps.ch",
      },
      config
    );

    expect(messageId).toContain("@gstaadcricketclub.ch");
    expect(raw).toContain("MIME-Version: 1.0");
    expect(raw).toContain('Content-Type: multipart/alternative; boundary="');
    expect(raw).toContain("Reply-To: reply@alps.ch");
    expect(raw).toContain("Content-Type: text/plain; charset=utf-8");
    expect(raw).toContain("Content-Type: text/html; charset=utf-8");
    expect(raw).toContain("Content-Transfer-Encoding: base64");
  });

  it("should safely mock dispatch in development / test when SMTP_PASS is unset", async () => {
    const res = await dispatchEmail({
      to: "test@example.com",
      subject: "Test Email",
      text: "Hello from test suite",
    });

    expect(res.success).toBe(true);
    expect(res.messageId).toContain("mock-");
  });
});
