import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/infrastructure/supabase/admin";
import { requireAuth, isAuthError } from "@/infrastructure/security/auth-guard";
import { isValidUuid } from "@/application/validators/schemas";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Enforce server-side authentication & authorization (Admin, Manager only)
  const auth = await requireAuth(request, ["admin", "manager"]);
  if (isAuthError(auth)) return auth;

  try {
    const { id } = await params;

    // 2. Strict UUID format validation (SQLi, IDOR, & Path Traversal defense)
    if (!isValidUuid(id)) {
      return NextResponse.json(
        { error: "Invalid registration identifier." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("event_registrations")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[API Registration DELETE] Database error:", error.message);
      return NextResponse.json({ error: "Failed to delete registration record." }, { status: 500 });
    }

    // 3. Security Audit Logging
    await supabase.from("audit_logs").insert({
      action: "registration.deleted",
      entity: "event_registrations",
      entity_id: id,
      details: { deleted_at: new Date().toISOString(), by: auth.user.email, role: auth.user.role },
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("[API Registration DELETE] Exception:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
