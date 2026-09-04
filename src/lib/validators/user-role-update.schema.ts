/**
 * @file user-role-update.schema.ts
 * @description Canonical Zod validation schema for administrative role reassignments.
 * Restricts roles to authorized UserRole enums with UUID target verification.
 * @module lib/validators
 */

import { z } from "zod";

export const UserRoleUpdateSchema = z.object({
  userId: z.string().uuid("Invalid target user identifier."),
  role: z.enum(["admin", "manager", "staff"], {
    message: "Role must be one of: 'admin', 'manager', or 'staff'.",
  }),
});

export type UserRoleUpdateInput = z.infer<typeof UserRoleUpdateSchema>;
