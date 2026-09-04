/**
 * @file event-registration.schema.ts
 * @description Canonical Zod validation schema for Gstaad Cricket Club event registrations.
 * Validates attendee personal details, international/Swiss phone formatting, and includes
 * honeypot anti-spam verification.
 * @module lib/validators
 */

import { z } from "zod";

/**
 * Regex matching Swiss phone numbers (+41 or 07X) and E.164 international phone formats.
 * Accepts formats: +41 79 123 45 67, 079 123 45 67, +44 20 7946 0958, etc.
 */
const PHONE_REGEX = /^(\+?[1-9]\d{1,14}|(0[1-9]\d{1,8}))$/;

export const EventRegistrationSchema = z.object({
  eventId: z.string().uuid("Please select a valid event fixture.").optional(),
  eventSlug: z.string().min(1).default("gstaad-cricket-festival-2026"),
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters long.")
    .max(100, "Full name cannot exceed 100 characters."),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address.")
    .toLowerCase(),
  phone: z
    .string()
    .trim()
    .min(7, "Phone number is too short.")
    .max(25, "Phone number is too long.")
    .refine(
      (val) => PHONE_REGEX.test(val.replace(/[\s\-()]/g, "")),
      "Please enter a valid Swiss (+41) or international phone number."
    ),
  registrationType: z.enum(["playing_member", "spectator", "vip_patron"], {
    message: "Please choose a valid participation type (Player, Spectator, or VIP Patron).",
  }),
  emergencyContact: z
    .string()
    .trim()
    .min(3, "Emergency contact name and phone number is required.")
    .max(120, "Emergency contact details are too long."),
  dietaryRequirements: z
    .string()
    .trim()
    .max(250, "Dietary requirements cannot exceed 250 characters.")
    .optional()
    .nullable(),
  /**
   * Anti-spam honeypot field. Must remain empty in legitimate human submissions.
   */
  website: z.string().max(0, "Spam detection triggered.").optional(),
});

export type EventRegistrationInput = z.infer<typeof EventRegistrationSchema>;
