import { NextResponse } from "next/server";
import { createAdminClient } from "@/infrastructure/supabase/admin";
import { SupabaseMemberRepository } from "@/infrastructure/repositories/SupabaseMemberRepository";
import { SupabaseAuditRepository } from "@/infrastructure/repositories/SupabaseAuditRepository";
import { ManageMembersUseCase } from "@/application/use-cases/ManageMembersUseCase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const supabase = createAdminClient();
    const memberRepo = new SupabaseMemberRepository(supabase);
    const auditRepo = new SupabaseAuditRepository(supabase);

    const useCase = new ManageMembersUseCase(memberRepo, auditRepo);

    const result = await useCase.apply({
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      tier: body.tier,
      handicapOrExperience: body.handicapOrExperience,
      notes: body.notes,
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: "Membership application received successfully.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to submit application";
    console.error("Membership application error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
