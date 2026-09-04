/**
 * @file contact-action.test.ts
 * @description Unit tests for submitContactMessageAction server action.
 * Verifies validation, anti-spam honeypot defense, Supabase database insertion,
 * and compliance audit trail emission using Vitest mocks.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { submitContactMessageAction } from "@/application/actions/contact.actions";

// Mock Supabase admin client
const mockInsertMessage = vi.fn();
const mockInsertAudit = vi.fn();

vi.mock("@/infrastructure/supabase/admin", () => ({
  createAdminClient: () => ({
    from: (table: string) => {
      if (table === "contact_messages") {
        return {
          insert: (data: any) => ({
            select: () => ({
              single: async () => {
                mockInsertMessage(data);
                return {
                  data: {
                    id: "msg-uuid-12345",
                    name: data.name,
                    email: data.email,
                    subject: data.subject,
                    message: data.message,
                    status: "unread",
                  },
                  error: null,
                };
              },
            }),
          }),
        };
      }
      if (table === "audit_logs") {
        return {
          insert: async (data: any) => {
            mockInsertAudit(data);
            return { data: null, error: null };
          },
        };
      }
      return { insert: vi.fn() };
    },
  }),
}));

describe("submitContactMessageAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully insert message and record audit log on valid input", async () => {
    const input = {
      name: "Lord Alexander Hamilton",
      email: "alexander@gstaad-luxury.com",
      subject: "Tournament Sponsorship Inquiries 2026",
      message: "We would like to reserve a corporate marquee for our family and clients.",
    };

    const result = await submitContactMessageAction(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe(input.name);
      expect(result.data.email).toBe(input.email);
      expect(result.data.id).toBe("msg-uuid-12345");
    }

    // Verify database call
    expect(mockInsertMessage).toHaveBeenCalledTimes(1);
    expect(mockInsertMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        name: input.name,
        email: input.email,
        subject: input.subject,
        status: "unread",
      })
    );

    // Verify audit log call
    expect(mockInsertAudit).toHaveBeenCalledTimes(1);
    expect(mockInsertAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "inquiry.submitted",
        entity: "contact_messages",
        entity_id: "msg-uuid-12345",
      })
    );
  });

  it("should reject input when required fields fail Zod validation", async () => {
    const invalidInput = {
      name: "A", // too short (min 2)
      email: "invalid-email-string",
      subject: "Hi", // too short (min 3)
      message: "Short", // too short (min 10)
    };

    const result = await submitContactMessageAction(invalidInput);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Validation failed");
      expect(result.errors).toBeDefined();
    }

    expect(mockInsertMessage).not.toHaveBeenCalled();
    expect(mockInsertAudit).not.toHaveBeenCalled();
  });

  it("should silently reject honeypot bot submissions without database insert", async () => {
    const botInput = {
      name: "Spam Bot",
      email: "bot@spammer.org",
      subject: "SEO Rankings Increase Fast",
      message: "Click here to buy backlinks for your domain name now.",
      company: "Bot Spammer Corp", // Honeypot filled!
    };

    const result = await submitContactMessageAction(botInput);

    expect(result.success).toBe(false);
    expect(mockInsertMessage).not.toHaveBeenCalled();
    expect(mockInsertAudit).not.toHaveBeenCalled();
  });
});
