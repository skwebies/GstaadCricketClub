import { NextResponse } from "next/server";
import { createAdminClient } from "@/infrastructure/supabase/admin";
import { SupabaseContactRepository } from "@/infrastructure/repositories/SupabaseContactRepository";
import { SupabaseAuditRepository } from "@/infrastructure/repositories/SupabaseAuditRepository";
import { SubmitContactMessageUseCase } from "@/application/use-cases/SubmitContactMessageUseCase";
import { isHoneypotTriggered, getClientIp } from "@/infrastructure/security/anti-spam";
import { checkRateLimit } from "@/infrastructure/security/rate-limiter";
import { EmailService } from "@/infrastructure/email/email-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data: messages, error } = await supabase
      .from("contact_messages")
      .select()
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ messages });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch inquiries";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const clientIp = getClientIp(request);

    // 1. Invisible Honeypot Trap: Silent drop if bot filled hidden field
    if (isHoneypotTriggered(body.botField)) {
      console.warn(`[Anti-Spam] Honeypot triggered in contact form from IP ${clientIp}`);
      return NextResponse.json({
        success: true,
        message: "Thank you for reaching out. A committee member will respond promptly.",
      });
    }

    // 2. Sliding Window Rate Limiting (5 requests per 10 minutes)
    const rateLimit = checkRateLimit(`contact:${clientIp}`, 5, 10 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many inquiries sent. Please wait ${rateLimit.resetInSeconds} seconds before sending another message.`,
        },
        { status: 429 }
      );
    }

    // 3. Database Persistence & Domain Logic
    const supabase = createAdminClient();
    const contactRepo = new SupabaseContactRepository(supabase);
    const auditRepo = new SupabaseAuditRepository(supabase);

    const useCase = new SubmitContactMessageUseCase(contactRepo, auditRepo);

    const result = await useCase.execute(
      {
        name: body.name,
        email: body.email,
        subject: body.subject,
        message: body.message,
      },
      clientIp
    );

    // 4. SMTP Dual-Dispatch (Admin alert with replyTo + Sender confirmation)
    await EmailService.sendContactEmails({
      name: body.name,
      email: body.email,
      subject: body.subject,
      message: body.message,
      clientIp,
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: "Thank you for reaching out. A committee member will respond promptly.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to submit inquiry";
    console.error("Contact inquiry error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
