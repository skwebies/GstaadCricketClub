/**
 * @file contact-inquiry.test.ts
 * @description Unit tests for Contact Inquiries, Sponsor & Donor validation,
 * SubmitContactMessageUseCase clean architecture, and HTML email template generation.
 */

import { describe, it, expect, vi } from "vitest";
import { ContactMessageSchema, MemberApplicationSchema } from "../application/validators/schemas";
import { SubmitContactMessageUseCase } from "../application/use-cases/SubmitContactMessageUseCase";
import { ManageMembersUseCase } from "../application/use-cases/ManageMembersUseCase";
import { normalizeMemberTier } from "../core/domain/entities/Member";
import {
  renderContactAdminEmail,
  renderContactUserConfirmation,
  renderMembershipAdminEmail,
  renderMembershipUserConfirmation,
} from "../infrastructure/email/email-templates";
import type { IContactRepository } from "../core/domain/repositories/IContactRepository";
import type { IAuditRepository } from "../core/domain/repositories/IAuditRepository";
import type { IMemberRepository } from "../core/domain/repositories/IMemberRepository";

describe("Contact Message Schema Validation", () => {
  it("should validate a correct general contact inquiry", () => {
    const input = {
      name: "Jean-Pierre Dupont",
      email: "jp.dupont@bluewin.ch",
      subject: "Cricket festival seating",
      message: "Hello, could you please provide details regarding spectator seating at Ebnit?",
      inquiryType: "general" as const,
    };

    const parsed = ContactMessageSchema.parse(input);
    expect(parsed.name).toBe("Jean-Pierre Dupont");
    expect(parsed.email).toBe("jp.dupont@bluewin.ch");
    expect(parsed.inquiryType).toBe("general");
  });

  it("should validate a sponsor inquiry with organisation and phone", () => {
    const input = {
      name: "Marcus Aurelius",
      email: "partner@alpine-luxury.ch",
      phone: "+41 33 748 00 00",
      organization: "Alpine Hospitality Group",
      subject: "Founding Sponsorship Package",
      message: "We would like to support the club as an official Founding Partner for the upcoming season.",
      inquiryType: "sponsor" as const,
    };

    const parsed = ContactMessageSchema.parse(input);
    expect(parsed.organization).toBe("Alpine Hospitality Group");
    expect(parsed.phone).toBe("+41 33 748 00 00");
    expect(parsed.inquiryType).toBe("sponsor");
  });

  it("should validate a community donor inquiry", () => {
    const input = {
      name: "Beatrix von Siebenthal",
      email: "beatrix@gstaadnet.ch",
      subject: "Youth Equipment Patronage",
      message: "I would like to contribute towards the junior cricket bats and training equipment.",
      inquiryType: "donor" as const,
    };

    const parsed = ContactMessageSchema.parse(input);
    expect(parsed.inquiryType).toBe("donor");
  });

  it("should reject invalid inputs (short name, bad email, short message)", () => {
    expect(() =>
      ContactMessageSchema.parse({
        name: "A",
        email: "not-an-email",
        subject: "Hi",
        message: "Too short",
      })
    ).toThrow();
  });
});

describe("SubmitContactMessageUseCase (Clean Architecture)", () => {
  it("should prepend [Sponsorship] tag and format organisation/phone in message", async () => {
    const mockCreatedMessage = {
      id: "msg-123",
      name: "Hansruedi",
      email: "hans@example.com",
      subject: "[Sponsorship] Club Partnership",
      message: "Organisation: Berner Kantonalbank\nPhone: +41 31 123 45 67\n\n---\n\nWe would like to become a sponsor.",
      status: "unread" as const,
      ipHash: "127.0.0.1",
      createdAt: new Date().toISOString(),
    };

    const mockContactRepo: IContactRepository = {
      create: vi.fn().mockResolvedValue(mockCreatedMessage),
      list: vi.fn().mockResolvedValue([]),
      updateStatus: vi.fn(),
      getById: vi.fn(),
      delete: vi.fn(),
    };

    const mockAuditRepo: IAuditRepository = {
      record: vi.fn().mockResolvedValue({ id: "audit-1" }),
    };

    const useCase = new SubmitContactMessageUseCase(mockContactRepo, mockAuditRepo);

    const result = await useCase.execute(
      {
        name: "Hansruedi",
        email: "hans@example.com",
        phone: "+41 31 123 45 67",
        organization: "Berner Kantonalbank",
        inquiryType: "sponsor",
        subject: "Club Partnership",
        message: "We would like to become a sponsor.",
      },
      "127.0.0.1"
    );

    expect(mockContactRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Hansruedi",
        email: "hans@example.com",
        subject: "[Sponsorship] Club Partnership",
        message: expect.stringContaining("Organisation: Berner Kantonalbank"),
      })
    );

    expect(mockAuditRepo.record).toHaveBeenCalledWith(
      "SUBMIT_CONTACT_MESSAGE",
      "contact_messages",
      "msg-123",
      expect.objectContaining({
        inquiryType: "sponsor",
        organization: "Berner Kantonalbank",
        phone: "+41 31 123 45 67",
      })
    );

    expect(result.id).toBe("msg-123");
  });
});

describe("Contact Email Templates", () => {
  it("should render admin notification with GCC logo crest, badge, and contact details", () => {
    const emailData = {
      name: "Elena Rossi",
      email: "elena@swiss-sport.ch",
      phone: "+41 79 987 65 43",
      organization: "Swiss Mountain Sports",
      inquiryType: "sponsor",
      subject: "Annual Gala & Trophy Sponsorship",
      message: "Please send us the sponsorship dossier for the festival.",
      clientIp: "178.197.234.12",
    };

    const template = renderContactAdminEmail(emailData);

    expect(template.subject).toContain("[GCC Inquiry - Founding Sponsorship]");
    expect(template.subject).toContain("Elena Rossi");
    expect(template.html).toContain("gstaad-cricket-club-crest.png");
    expect(template.html).toContain("Founding Sponsorship");
    expect(template.html).toContain("Swiss Mountain Sports");
    expect(template.html).toContain("+41 79 987 65 43");
    expect(template.html).toContain("178.197.234.12");
    expect(template.text).toContain("Category: Founding Sponsorship");
  });

  it("should render personalized donor confirmation to user with logo and club info", () => {
    const emailData = {
      name: "Peter Meier",
      email: "peter.meier@bluewin.ch",
      inquiryType: "donor",
      subject: "Junior Equipment Donation",
      message: "I would be delighted to sponsor youth match balls.",
    };

    const template = renderContactUserConfirmation(emailData);

    expect(template.subject).toBe("We have received your donation inquiry - Gstaad Cricket Club");
    expect(template.html).toContain("gstaad-cricket-club-crest.png");
    expect(template.html).toContain("Dear Peter Meier");
    expect(template.html).toContain("generous support of <strong>Gstaad Cricket Club</strong>");
    expect(template.text).toContain("DEAR PETER MEIER");
  });

  it("should render membership inquiry with package details in admin email and confirmation", () => {
    const emailData = {
      name: "Thomas Müller",
      email: "thomas@muller.ch",
      phone: "+41 79 111 22 33",
      inquiryType: "membership",
      membershipPackage: "family",
      subject: "Family Membership Application",
      message: "We have two children (8 and 11) eager to participate in the youth program.",
      clientIp: "85.10.20.30",
    };

    const adminTemplate = renderContactAdminEmail(emailData);
    expect(adminTemplate.subject).toContain("[GCC Inquiry - Club Membership]");
    expect(adminTemplate.html).toContain("Family Package (CHF 200 / year)");
    expect(adminTemplate.html).toContain("Thomas Müller");
    expect(adminTemplate.html).toContain("+41 79 111 22 33");
    expect(adminTemplate.text).toContain("Package: family");

    const userTemplate = renderContactUserConfirmation(emailData);
    expect(userTemplate.subject).toBe("We have received your membership inquiry - Gstaad Cricket Club");
    expect(userTemplate.html).toContain("Family Package (CHF 200 / year)");
    expect(userTemplate.html).toContain("Dear Thomas Müller");
    expect(userTemplate.html).toContain("gstaad-cricket-club-crest.png");
  });

  it("should validate and format membership application for Adult, Family, and Junior packages", () => {
    const adultInput = {
      fullName: "Marc Brand",
      email: "marc.brand@gstaad.ch",
      phone: "+41 33 748 11 22",
      tier: "Adult (CHF 100 / year)",
      handicapOrExperience: "Club cricket player for 5 years",
      notes: "Looking forward to Sunday fixtures.",
    };

    const parsed = MemberApplicationSchema.parse(adultInput);
    expect(parsed.fullName).toBe("Marc Brand");
    expect(parsed.tier).toBe("Adult (CHF 100 / year)");

    const adminEmail = renderMembershipAdminEmail(adultInput);
    expect(adminEmail.subject).toContain("[GCC Membership] New Application: Marc Brand");
    expect(adminEmail.html).toContain("Adult (CHF 100 / year)");
    expect(adminEmail.html).toContain("gstaad-cricket-club-crest.png");
    expect(adminEmail.text).toContain("Tier: Adult (CHF 100 / year)");

    const userEmail = renderMembershipUserConfirmation(adultInput);
    expect(userEmail.subject).toBe("Gstaad Cricket Club - Membership Application Received");
    expect(userEmail.html).toContain("Adult (CHF 100 / year)");
    expect(userEmail.html).toContain("Dear Marc Brand");
  });

  it("should normalize all raw tier inputs and package descriptions to canonical DB tiers", () => {
    // Adult variations -> Full Playing
    expect(normalizeMemberTier("Adult")).toBe("Full Playing");
    expect(normalizeMemberTier("adult")).toBe("Full Playing");
    expect(normalizeMemberTier("Adult (CHF 100 / year)")).toBe("Full Playing");
    expect(normalizeMemberTier("Erwachsene (CHF 100 / Jahr)")).toBe("Full Playing");
    expect(normalizeMemberTier("Adulte (CHF 100 / an)")).toBe("Full Playing");
    expect(normalizeMemberTier("Full Playing")).toBe("Full Playing");
    expect(normalizeMemberTier("Full Playing Member")).toBe("Full Playing");

    // Family variations -> Social Member
    expect(normalizeMemberTier("Family")).toBe("Social Member");
    expect(normalizeMemberTier("family")).toBe("Social Member");
    expect(normalizeMemberTier("Family (CHF 200 / year)")).toBe("Social Member");
    expect(normalizeMemberTier("Familie (CHF 200 / Jahr)")).toBe("Social Member");
    expect(normalizeMemberTier("Famille (CHF 200 / an)")).toBe("Social Member");
    expect(normalizeMemberTier("Social Member")).toBe("Social Member");

    // Junior variations -> Junior
    expect(normalizeMemberTier("Junior")).toBe("Junior");
    expect(normalizeMemberTier("junior")).toBe("Junior");
    expect(normalizeMemberTier("Junior (CHF 50 / year)")).toBe("Junior");
    expect(normalizeMemberTier("Junior Member")).toBe("Junior");
    expect(normalizeMemberTier("Youth player")).toBe("Junior");

    // Patron variations -> Patron
    expect(normalizeMemberTier("Patron")).toBe("Patron");
    expect(normalizeMemberTier("Honorary Patron")).toBe("Patron");

    // Fallbacks
    expect(normalizeMemberTier(null)).toBe("Full Playing");
    expect(normalizeMemberTier("")).toBe("Full Playing");
    expect(normalizeMemberTier("unknown-option")).toBe("Full Playing");
  });

  it("should ensure ManageMembersUseCase.apply stores canonical tier in repository", async () => {
    const mockCreatedMember = {
      id: "mem-uuid-123",
      fullName: "Sophie de Saanen",
      email: "sophie@saanen.ch",
      phone: "+41 33 748 00 00",
      tier: "Social Member",
      status: "pending" as const,
      notes: "Selected Package: Family (CHF 200 / year)\ntesting tesing",
      handicapOrExperience: "Beginner",
      createdAt: new Date().toISOString(),
    };

    const mockMemberRepo: IMemberRepository = {
      create: vi.fn().mockResolvedValue(mockCreatedMember),
      findById: vi.fn().mockResolvedValue(null),
      findByEmail: vi.fn().mockResolvedValue(null),
      list: vi.fn().mockResolvedValue([]),
      updateStatus: vi.fn().mockResolvedValue(mockCreatedMember),
      count: vi.fn().mockResolvedValue(1),
      delete: vi.fn().mockResolvedValue(true),
    };

    const mockAuditRepo: IAuditRepository = {
      record: vi.fn().mockResolvedValue({} as any),
      list: vi.fn().mockResolvedValue([]),
    };

    const useCase = new ManageMembersUseCase(mockMemberRepo, mockAuditRepo);

    const created = await useCase.apply({
      fullName: "Sophie de Saanen",
      email: "sophie@saanen.ch",
      phone: "+41 33 748 00 00",
      tier: "Family (CHF 200 / year)",
      handicapOrExperience: "Beginner",
      notes: "Selected Package: Family (CHF 200 / year)\ntesting tesing",
    });

    expect(created.id).toBe("mem-uuid-123");
    // Verify memberRepo.create was invoked with canonical tier 'Social Member', satisfying members_tier_check
    expect(mockMemberRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        tier: "Social Member",
        email: "sophie@saanen.ch",
      })
    );
    expect(mockAuditRepo.record).toHaveBeenCalledWith(
      "MEMBER_APPLICATION",
      "members",
      "mem-uuid-123",
      expect.objectContaining({
        tier: "Social Member",
      })
    );
  });
});

