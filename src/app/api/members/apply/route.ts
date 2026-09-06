import { NextResponse } from "next/server";
import { createAdminClient } from "@/infrastructure/supabase/admin";
import { SupabaseMemberRepository } from "@/infrastructure/repositories/SupabaseMemberRepository";
import { SupabaseAuditRepository } from "@/infrastructure/repositories/SupabaseAuditRepository";
import { ManageMembersUseCase } from "@/application/use-cases/ManageMembersUseCase";
import { isHoneypotTriggered, getClientIp } from "@/infrastructure/security/anti-spam";
import { checkRateLimit } from "@/infrastructure/security/rate-limiter";
import { EmailService } from "@/infrastructure/email/email-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const clientIp = getClientIp(request);

    // 1. Invisible Honeypot Trap: Silent drop if bot filled hidden field
    if (isHoneypotTriggered(body.botField)) {
      console.warn(`[Anti-Spam] Honeypot triggered in membership from IP ${clientIp}`);
      return NextResponse.json({
        success: true,
        message: "Membership application received successfully.",
      });
    }

    // 2. Sliding Window Rate Limiting (5 requests per 10 minutes)
    const rateLimit = checkRateLimit(`membership:${clientIp}`, 5, 10 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many applications submitted. Please wait ${rateLimit.resetInSeconds} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    // 3. Database Persistence & Domain Logic
    const supabase = createAdminClient();
    const memberRepo = new SupabaseMemberRepository(supabase);
    const auditRepo = new SupabaseAuditRepository(supabase);

    const useCase = new ManageMembersUseCase(memberRepo, auditRepo);

    const packageLabel = body.packageLabel || body.tier || "Adult (CHF 100 / year)";
    const rawTierInput = body.tier || body.packageId || "Full Playing";

    // Preserve the human-readable package label and fee in notes for committee review
    let applicantNotes = body.notes ? String(body.notes).trim() : "";
    if (packageLabel && !applicantNotes.toLowerCase().includes("package:")) {
      applicantNotes = applicantNotes
        ? `Package: ${packageLabel}\n${applicantNotes}`
        : `Package: ${packageLabel}`;
    }

    const result = await useCase.apply({
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      tier: rawTierInput,
      handicapOrExperience: body.handicapOrExperience,
      notes: applicantNotes,
    });

    // 4. SMTP Dual-Dispatch (Admin notification + Applicant confirmation)
    await EmailService.sendMembershipEmails({
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      tier: packageLabel,
      handicapOrExperience: body.handicapOrExperience,
      notes: applicantNotes,
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
