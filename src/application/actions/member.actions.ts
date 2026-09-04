"use server";

/**
 * @file member.actions.ts
 * @description Next.js Server Action handling membership applications and administrative status changes.
 * Enforces Zod validation, tier verification, and audit trail generation.
 * @module application/actions
 */

import { MemberMutationSchema, type MemberMutationInput } from "@/lib/validators/member-mutation.schema";
import type { ActionResult } from "./types";
import { createAdminClient } from "@/infrastructure/supabase/admin";
import { logger } from "@/core/logging/logger";

export interface MemberOutput {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  tier: string;
  status: "active" | "pending" | "inactive";
}

/**
 * Server action for public applicants submitting a membership inquiry or enrollment.
 *
 * @param {MemberMutationInput} rawInput - Candidate member information
 * @returns {Promise<ActionResult<MemberOutput>>} Action result
 */
export async function applyForMembershipAction(
  rawInput: MemberMutationInput
): Promise<ActionResult<MemberOutput>> {
  try {
    const parsed = MemberMutationSchema.safeParse(rawInput);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      const issues = parsed.error.issues || (parsed.error as any).errors || [];
      issues.forEach((err: any) => {
        const path = (err.path || []).join(".");
        if (!fieldErrors[path]) fieldErrors[path] = [];
        fieldErrors[path].push(err.message);
      });

      return {
        success: false,
        error: "Validation error. Please verify the membership fields.",
        errors: fieldErrors,
      };
    }

    const data = parsed.data;
    const supabase = createAdminClient();

    const { data: member, error } = await supabase
      .from("members")
      .insert({
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        tier: data.tier,
        handicap_or_experience: data.handicapOrExperience || null,
        notes: data.notes || null,
        status: "pending",
      })
      .select()
      .single();

    if (error || !member) {
      logger.error("Failed to enroll member application", { error });
      return {
        success: false,
        error: "Could not complete membership application at this moment.",
      };
    }

    await supabase.from("audit_logs").insert({
      action: "member.application_submitted",
      entity: "members",
      entity_id: member.id,
      details: {
        candidate: data.fullName,
        tier: data.tier,
        email: data.email,
      },
    });

    logger.info("New membership application received", {
      metadata: { id: member.id, tier: data.tier, name: data.fullName },
    });

    return {
      success: true,
      data: {
        id: member.id,
        fullName: member.full_name,
        email: member.email,
        phone: member.phone,
        tier: member.tier,
        status: member.status,
      },
      message: `Thank you, ${data.fullName}! Your application for ${data.tier} has been sent for committee approval.`,
    };
  } catch (err: unknown) {
    logger.error("Unexpected error in applyForMembershipAction", { error: err });
    const msg = err instanceof Error ? err.message : "Internal error occurred.";
    return { success: false, error: msg };
  }
}

/**
 * Administrative action to update a member's lifecycle status.
 *
 * @param {string} memberId - Target member UUID
 * @param {"active" | "pending" | "inactive"} status - New lifecycle status
 * @returns {Promise<ActionResult<{ id: string; status: string }>>} Action result
 */
export async function updateMemberStatusAction(
  memberId: string,
  status: "active" | "pending" | "inactive"
): Promise<ActionResult<{ id: string; status: string }>> {
  try {
    const supabase = createAdminClient();

    const { data: updated, error } = await supabase
      .from("members")
      .update({ status })
      .eq("id", memberId)
      .select()
      .single();

    if (error || !updated) {
      return { success: false, error: "Failed to update member status." };
    }

    await supabase.from("audit_logs").insert({
      action: "member.status_transitioned",
      entity: "members",
      entity_id: memberId,
      details: { newStatus: status },
    });

    return {
      success: true,
      data: { id: updated.id, status: updated.status },
      message: `Member status updated to ${status}.`,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error updating member.";
    return { success: false, error: msg };
  }
}
