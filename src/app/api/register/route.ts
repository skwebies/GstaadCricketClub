import { NextResponse } from "next/server";
import { createAdminClient } from "@/infrastructure/supabase/admin";
import { SupabaseRegistrationRepository } from "@/infrastructure/repositories/SupabaseRegistrationRepository";
import { SupabaseEventRepository } from "@/infrastructure/repositories/SupabaseEventRepository";
import { SupabaseAuditRepository } from "@/infrastructure/repositories/SupabaseAuditRepository";
import { RegisterForEventUseCase } from "@/application/use-cases/RegisterForEventUseCase";
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

    // 3. Database Persistence & Domain Logic
    const supabase = createAdminClient();
    const registrationRepo = new SupabaseRegistrationRepository(supabase);
    const eventRepo = new SupabaseEventRepository(supabase);
    const auditRepo = new SupabaseAuditRepository(supabase);

    const useCase = new RegisterForEventUseCase(registrationRepo, eventRepo, auditRepo);

    const result = await useCase.execute({
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      registrationType: body.registrationType,
      partySize: body.partySize || 1,
      dietaryRequirements: body.dietaryRequirements,
      emergencyContact: body.emergencyContact || body.phone || "Self / Attendee",
      notes: body.notes,
    });

    // 4. SMTP Dual-Dispatch (Admin notification + User confirmation)
    await EmailService.sendRegistrationEmails({
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      registrationType: body.registrationType,
      partySize: body.partySize || 1,
      dietaryRequirements: body.dietaryRequirements,
      emergencyContact: body.emergencyContact,
      notes: body.notes,
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
