"use server";

/**
 * @file user.actions.ts
 * @description Administrative Server Action managing user accounts and role assignments.
 * Strictly restricted to users with 'admin' authorization; updates the profiles table
 * and writes to the compliance audit log.
 * @module application/actions
 */

import { UserRoleUpdateSchema, type UserRoleUpdateInput } from "@/lib/validators/user-role-update.schema";
import type { ActionResult } from "./types";
import { createAdminClient } from "@/infrastructure/supabase/admin";
import { logger } from "@/core/logging/logger";

export interface UserRoleOutput {
  userId: string;
  role: "admin" | "manager" | "staff";
  fullName: string;
  email: string;
}

/**
 * Updates the administrative role of a user within the profiles table.
 *
 * @param {UserRoleUpdateInput} input - User UUID and new role
 * @returns {Promise<ActionResult<UserRoleOutput>>} Typed result
 */
export async function updateUserRoleAction(
  input: UserRoleUpdateInput
): Promise<ActionResult<UserRoleOutput>> {
  try {
    const parsed = UserRoleUpdateSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Invalid role assignment request.",
      };
    }

    const { userId, role } = parsed.data;
    const supabase = createAdminClient();

    const { data: updated, error } = await supabase
      .from("profiles")
      .update({ role, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single();

    if (error || !updated) {
      logger.error("Failed to update profile role in Supabase", { error, metadata: { userId, role } });
      return {
        success: false,
        error: "Failed to update role. User might not exist.",
      };
    }

    await supabase.from("audit_logs").insert({
      action: "user.role_reassigned",
      entity: "profiles",
      entity_id: userId,
      details: {
        newRole: role,
        userEmail: updated.email,
        assignedAt: new Date().toISOString(),
      },
    });

    logger.info("User role successfully updated", {
      metadata: { userId, newRole: role, email: updated.email },
    });

    return {
      success: true,
      data: {
        userId: updated.id,
        role: updated.role,
        fullName: updated.full_name,
        email: updated.email,
      },
      message: `Role for ${updated.full_name} updated to ${role.toUpperCase()}.`,
    };
  } catch (err: unknown) {
    logger.error("Unexpected failure in updateUserRoleAction", { error: err });
    const msg = err instanceof Error ? err.message : "Internal error updating role.";
    return { success: false, error: msg };
  }
}
