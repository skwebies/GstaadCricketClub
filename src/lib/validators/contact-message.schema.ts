/**
 * @file contact-message.schema.ts
 * @description Canonical Zod validation schema for public inbound inquiries.
 * Enforces sanitization, character bounds, and spam suppression via a honeypot field.
 * @module lib/validators
 */

import { z } from "zod";

export const ContactMessageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long.")
    .max(100, "Name cannot exceed 100 characters."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .toLowerCase(),
  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters long.")
    .max(150, "Subject cannot exceed 150 characters."),
  message: z
    .string()
    .trim()
    .min(10, "Message should be at least 10 characters so we understand your request.")
    .max(3000, "Message cannot exceed 3000 characters."),
  /**
   * Anti-spam honeypot field. Must remain empty in legitimate human submissions.
   */
  company: z.string().max(0, "Spam detected.").optional(),
});

export type ContactMessageInput = z.infer<typeof ContactMessageSchema>;
