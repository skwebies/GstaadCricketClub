"use server";

/**
 * @file contact.actions.ts
 * @description Next.js Server Action handling public contact inquiries for Gstaad Cricket Club.
 * Enforces Zod validation, honeypot anti-spam defense, persistence to contact_messages,
 * and compliance logging.
 * @module application/actions
 */

import { ContactMessageSchema, type ContactMessageInput } from "@/lib/validators/contact-message.schema";
import type { ActionResult } from "./types";
import { createAdminClient } from "@/infrastructure/supabase/admin";
import { logger } from "@/core/logging/logger";

export interface ContactOutput {
  id: string;
  name: string;
  email: string;
  subject: string;
}

/**
 * Server action to submit a public contact inquiry to the club secretariat.
 *
 * @param {ContactMessageInput} rawInput - Inquiry form inputs
 * @returns {Promise<ActionResult<ContactOutput>>} Typed action result
 */
export async function submitContactMessageAction(
  rawInput: ContactMessageInput
): Promise<ActionResult<ContactOutput>> {
  try {
    const parsed = ContactMessageSchema.safeParse(rawInput);
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
        error: "Validation failed. Please correct the highlighted fields.",
        errors: fieldErrors,
      };
    }

    const data = parsed.data;

    // Honeypot check
    if (data.company && data.company.length > 0) {
      logger.warn("Spam inquiry detected via honeypot", {
        metadata: { email: data.email },
      });
      return {
        success: false,
        error: "Your message could not be sent. Please try again later.",
      };
    }

    const supabase = createAdminClient();

    const { data: message, error } = await supabase
      .from("contact_messages")
      .insert({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        status: "unread",
      })
      .select()
      .single();

    if (error || !message) {
      logger.error("Failed to insert contact message", { error });
      return {
        success: false,
        error: "We could not save your message due to a database error.",
      };
    }

    await supabase.from("audit_logs").insert({
      action: "inquiry.submitted",
      entity: "contact_messages",
      entity_id: message.id,
      details: {
        sender: data.name,
        email: data.email,
        subject: data.subject,
      },
    });

    logger.info("Contact message received", {
      metadata: { id: message.id, sender: data.name, subject: data.subject },
    });

    return {
      success: true,
      data: {
        id: message.id,
        name: message.name,
        email: message.email,
        subject: message.subject,
      },
      message: "Thank you for reaching out! A committee member will review your inquiry shortly.",
    };
  } catch (err: unknown) {
    logger.error("Unexpected failure in submitContactMessageAction", { error: err });
    const msg = err instanceof Error ? err.message : "Internal server error occurred.";
    return {
      success: false,
      error: msg,
    };
  }
}
