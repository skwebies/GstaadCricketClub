import { NextResponse } from "next/server";
import { createAdminClient } from "@/infrastructure/supabase/admin";
import { SupabaseRegistrationRepository } from "@/infrastructure/repositories/SupabaseRegistrationRepository";
import { SupabaseEventRepository } from "@/infrastructure/repositories/SupabaseEventRepository";
import { SupabaseAuditRepository } from "@/infrastructure/repositories/SupabaseAuditRepository";
import { RegisterForEventUseCase } from "@/application/use-cases/RegisterForEventUseCase";
import { RegistrationSchema } from "@/application/validators/schemas";
import { isHoneypotTriggered, getClientIp } from "@/infrastructure/security/anti-spam";
import { checkRateLimit } from "@/infrastructure/security/rate-limiter";
import { EmailService } from "@/infrastructure/email/email-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const clientIp = getClientIp(request);

    // 1. Invisible Honeypot Trap: Silent drop if bot filled hidden field
    if (isHoneypotTriggered(body.botField)) {
      console.warn(`[Anti-Spam] Honeypot triggered in registration from IP ${clientIp}`);
      return NextResponse.json({
        success: true,
        message: "Registration successful! We look forward to seeing you in Gstaad.",
      });
    }

    // 2. Sliding Window Rate Limiting (5 requests per 10 minutes)
    const rateLimit = checkRateLimit(`register:${clientIp}`, 5, 10 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many submissions. Please wait ${rateLimit.resetInSeconds} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    // 3. Map participant type to valid domain registrationType
    let domainRegistrationType: "playing_member" | "spectator" | "vip_patron" = "spectator";
    const rawType = body.registrationType || body.participantType || "Individual";
    if (rawType === "VIP Patron" || rawType === "vip_patron") {
      domainRegistrationType = "vip_patron";
    } else if (rawType === "Individual" || rawType === "Group" || rawType === "playing_member") {
      domainRegistrationType = "playing_member";
    } else {
      domainRegistrationType = "spectator";
    }

    // Human-friendly display category for email notifications
    const displayCategory =
      body.participantType ||
      (domainRegistrationType === "vip_patron"
        ? "VIP Patron"
        : domainRegistrationType === "playing_member"
        ? "Playing Member / Individual"
        : "Spectator / Family");

    // 4. Server-Side Custom Validation with Zod
    const validationResult = RegistrationSchema.safeParse({
      fullName: body.fullName || body.name,
      email: body.email,
      phone: body.phone,
      registrationType: domainRegistrationType,
      partySize: body.partySize ?? 1,
      dietaryRequirements: body.dietaryRequirements || body.message || "",
      emergencyContact: body.emergencyContact || body.phone || "Self / Attendee",
      notes: body.notes || body.message || "",
    });

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of validationResult.error.issues) {
        const fieldName = issue.path[0]?.toString() || "form";
        const clientFieldName = fieldName === "fullName" ? "name" : fieldName;
        if (!fieldErrors[clientFieldName]) {
          fieldErrors[clientFieldName] = issue.message;
        }
      }
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed. Please correct the highlighted fields.",
          fieldErrors,
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // 5. Database Persistence & Domain Logic
    const supabase = createAdminClient();
    const registrationRepo = new SupabaseRegistrationRepository(supabase);
    const eventRepo = new SupabaseEventRepository(supabase);
    const auditRepo = new SupabaseAuditRepository(supabase);

    const useCase = new RegisterForEventUseCase(registrationRepo, eventRepo, auditRepo);

    const result = await useCase.execute(validatedData);

    // 6. SMTP Dual-Dispatch (Admin alert to info@gstaadcricketclub.ch + Registrant confirmation)
    await EmailService.sendRegistrationEmails({
      fullName: validatedData.fullName,
      email: validatedData.email,
      phone: validatedData.phone,
      registrationType: displayCategory,
      partySize: validatedData.partySize,
      dietaryRequirements: validatedData.dietaryRequirements,
      emergencyContact: validatedData.emergencyContact,
      notes: validatedData.notes,
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: "Registration successful! We look forward to seeing you in Gstaad.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to process registration";
    console.error("Registration error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}

