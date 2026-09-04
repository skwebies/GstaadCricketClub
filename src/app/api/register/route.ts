import { NextResponse } from "next/server";
import { createAdminClient } from "@/infrastructure/supabase/admin";
import { SupabaseRegistrationRepository } from "@/infrastructure/repositories/SupabaseRegistrationRepository";
import { SupabaseEventRepository } from "@/infrastructure/repositories/SupabaseEventRepository";
import { SupabaseAuditRepository } from "@/infrastructure/repositories/SupabaseAuditRepository";
import { RegisterForEventUseCase } from "@/application/use-cases/RegisterForEventUseCase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

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
