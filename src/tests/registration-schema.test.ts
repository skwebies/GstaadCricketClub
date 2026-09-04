/**
 * @file registration-schema.test.ts
 * @description Unit tests verifying Zod validation schemas for event registration,
 * telephone regex for Swiss and international formats, and honeypot anti-spam defense.
 */

import { describe, it, expect } from "vitest";
import { EventRegistrationSchema } from "@/lib/validators/event-registration.schema";

describe("EventRegistrationSchema", () => {
  it("should validate a complete, valid Swiss registration submission", () => {
    const validPayload = {
      fullName: "Maximilien von Berne",
      email: "maximilien@gstaad-alp.ch",
      phone: "+41 79 123 45 67",
      registrationType: "playing_member",
      emergencyContact: "Helena von Berne (+41 79 987 65 43)",
      dietaryRequirements: "Vegetarian",
    };

    const result = EventRegistrationSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.fullName).toBe("Maximilien von Berne");
      expect(result.data.email).toBe("maximilien@gstaad-alp.ch");
      expect(result.data.registrationType).toBe("playing_member");
    }
  });

  it("should accept valid Swiss local formats and international phone numbers", () => {
    const numbers = [
      "079 123 45 67",
      "+41 78 555 12 34",
      "+44 20 7946 0958",
      "+1 415 555 2671",
      "0761234567",
    ];

    for (const phone of numbers) {
      const payload = {
        fullName: "Jean Dupont",
        email: "jean@example.ch",
        phone,
        registrationType: "spectator",
        emergencyContact: "Emergency Person",
      };
      const result = EventRegistrationSchema.safeParse(payload);
      expect(result.success, `Failed on phone: ${phone}`).toBe(true);
    }
  });

  it("should reject invalid email addresses", () => {
    const payload = {
      fullName: "Test User",
      email: "not-a-valid-email",
      phone: "+41 79 000 00 00",
      registrationType: "spectator",
      emergencyContact: "Contact Person",
    };

    const result = EventRegistrationSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues || (result.error as any).errors;
      const emailErr = issues.find((e: any) => e.path.includes("email"));
      expect(emailErr).toBeDefined();
    }
  });

  it("should reject submissions with invalid phone strings", () => {
    const payload = {
      fullName: "Test User",
      email: "valid@example.ch",
      phone: "invalid-letters-phone",
      registrationType: "spectator",
      emergencyContact: "Contact Person",
    };

    const result = EventRegistrationSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("should reject invalid registration types", () => {
    const payload = {
      fullName: "Test User",
      email: "valid@example.ch",
      phone: "+41 79 111 22 33",
      registrationType: "alien_invader",
      emergencyContact: "Contact Person",
    };

    const result = EventRegistrationSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("should reject honeypot bot submissions when website field is filled", () => {
    const spamPayload = {
      fullName: "Automated Bot",
      email: "spammer@botnet.ru",
      phone: "+41 79 999 99 99",
      registrationType: "spectator",
      emergencyContact: "Bot Controller",
      website: "http://buy-cheap-watches.fake",
    };

    const result = EventRegistrationSchema.safeParse(spamPayload);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues || (result.error as any).errors;
      const botErr = issues.find((e: any) => e.path.includes("website"));
      expect(botErr?.message).toContain("Spam detection triggered");
    }
  });
});
