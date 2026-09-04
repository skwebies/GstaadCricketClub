import { NextResponse } from "next/server";
import { createAdminClient } from "@/infrastructure/supabase/admin";
import { SupabaseContactRepository } from "@/infrastructure/repositories/SupabaseContactRepository";
import { SupabaseAuditRepository } from "@/infrastructure/repositories/SupabaseAuditRepository";
import { SubmitContactMessageUseCase } from "@/application/use-cases/SubmitContactMessageUseCase";

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

    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "127.0.0.1";

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
      ip
    );

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
