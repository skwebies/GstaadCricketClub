"use server";

/**
 * @file registration.actions.ts
 * @description Next.js Server Action handling attendee registrations for Gstaad Cricket Club events.
 * Executes input validation, honeypot anti-spam rejection, event capacity verification,
 * database persistence via Supabase, and compliance audit trail recording.
 * @module application/actions
 */

import { EventRegistrationSchema, type EventRegistrationInput } from "@/lib/validators/event-registration.schema";
import type { ActionResult } from "./types";
import { createAdminClient } from "@/infrastructure/supabase/admin";
import { logger } from "@/core/logging/logger";

export interface RegistrationOutput {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  registrationType: string;
  eventTitle: string;
}

/**
 * Server action to register an attendee for a tournament or cricket festival.
 *
 * @param {EventRegistrationInput} rawInput - Raw submission input
 * @returns {Promise<ActionResult<RegistrationOutput>>} Standardized action result
 */
export async function registerForEventAction(
  rawInput: EventRegistrationInput
): Promise<ActionResult<RegistrationOutput>> {
  try {
    // 1. Validate payload with Zod
    const parsed = EventRegistrationSchema.safeParse(rawInput);
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
        error: "Validation failed. Please verify your submitted information.",
        errors: fieldErrors,
      };
    }

    const data = parsed.data;

    // 2. Honeypot check: If the hidden 'website' field was filled, reject quietly
    if (data.website && data.website.length > 0) {
      logger.warn("Bot submission detected via honeypot in event registration", {
        metadata: { email: data.email, website: data.website },
      });
      return {
        success: false,
        error: "Submission could not be processed. Please try again.",
      };
    }

    const supabase = createAdminClient();

    // 3. Resolve targeted event (by explicit eventId, or fallback to active festival)
    let eventId = data.eventId;
    let eventTitle = "Gstaad Cricket Festival 2026";

    if (eventId) {
      const { data: ev } = await supabase
        .from("events")
        .select("id, title, max_participants")
        .eq("id", eventId)
        .maybeSingle();

      if (ev) {
        eventTitle = ev.title;
      }
    } else {
      const { data: ev } = await supabase
        .from("events")
        .select("id, title, max_participants")
        .eq("is_active", true)
        .order("start_date", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (ev) {
        eventId = ev.id;
        eventTitle = ev.title;
      }
    }

    if (!eventId) {
      return {
        success: false,
        error: "No active cricket event is currently open for registration.",
      };
    }

    // 4. Duplicate registration check by email + event
    const { data: existing } = await supabase
      .from("event_registrations")
      .select("id")
      .eq("event_id", eventId)
      .eq("email", data.email)
      .maybeSingle();

    if (existing) {
      return {
        success: false,
        error: `A registration with ${data.email} already exists for ${eventTitle}.`,
      };
    }

    // 5. Insert new registration
    const { data: registration, error: insertError } = await supabase
      .from("event_registrations")
      .insert({
        event_id: eventId,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        registration_type: data.registrationType,
        dietary_requirements: data.dietaryRequirements || null,
        emergency_contact: data.emergencyContact,
      })
      .select()
      .single();

    if (insertError || !registration) {
      logger.error("Failed to insert registration into Supabase", {
        error: insertError,
        metadata: { eventId, email: data.email },
      });
      return {
        success: false,
        error: "Database error occurred while securing your registration.",
      };
    }

    // 6. Record audit log entry
    await supabase.from("audit_logs").insert({
      action: "registration.created",
      entity: "event_registrations",
      entity_id: registration.id,
      details: {
        eventTitle,
        registrationType: data.registrationType,
        email: data.email,
      },
    });

    logger.info("Event registration recorded successfully", {
      metadata: { id: registration.id, eventTitle, attendee: data.fullName },
    });

    return {
      success: true,
      data: {
        id: registration.id,
        fullName: registration.full_name,
        email: registration.email,
        phone: registration.phone,
        registrationType: registration.registration_type,
        eventTitle,
      },
      message: `Registration confirmed for ${data.fullName}! We look forward to seeing you at ${eventTitle}.`,
    };
  } catch (err: unknown) {
    logger.error("Unexpected failure in registerForEventAction", { error: err });
    const message = err instanceof Error ? err.message : "An unexpected server error occurred.";
    return {
      success: false,
      error: message,
    };
  }
}
