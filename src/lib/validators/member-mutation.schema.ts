/**
 * @file member-mutation.schema.ts
 * @description Canonical Zod validation schema for creating and updating club members.
 * Supports playing tiers, experience profiles, and lifecycle statuses.
 * @module lib/validators
 */

import { z } from "zod";

export const MemberMutationSchema = z.object({
  id: z.string().uuid().optional(),
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(100, "Full name cannot exceed 100 characters."),
  email: z
    .string()
    .trim()
    .email("Valid email address is required.")
    .toLowerCase(),
  phone: z
    .string()
    .trim()
    .min(7, "Valid contact telephone number is required.")
    .max(30),
  tier: z.enum(
    [
      "Full Playing Member",
      "Social Member",
      "Junior Alpine Member",
      "Honorary Patron",
      "Full Playing",
      "Junior",
      "Patron",
    ],
    {
      message: "Please select a recognized membership tier.",
    }
  ),
  handicapOrExperience: z.string().trim().max(250).optional().nullable(),
  notes: z.string().trim().max(1000).optional().nullable(),
  status: z.enum(["active", "pending", "inactive"]).default("active"),
});

export type MemberMutationInput = z.infer<typeof MemberMutationSchema>;
