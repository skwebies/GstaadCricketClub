import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/infrastructure/supabase/admin";
import { requireAuth, isAuthError } from "@/infrastructure/security/auth-guard";
import { isValidUuid } from "@/application/validators/schemas";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Enforce server-side authentication & authorization (Admin, Manager only)
  const auth = await requireAuth(request, ["admin", "manager"]);
  if (isAuthError(auth)) return auth;

  try {
    const { id } = await params;

    // 2. Strict UUID validation
    if (!isValidUuid(id)) {
      return NextResponse.json({ error: "Invalid inquiry identifier." }, { status: 400 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !["unread", "read", "responded"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid inquiry status. Must be unread, read, or responded." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: updated, error } = await supabase
      .from("contact_messages")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[API Inquiry PATCH] Database error:", error.message);
      return NextResponse.json({ error: "Failed to update inquiry." }, { status: 500 });
    }

    await supabase.from("audit_logs").insert({
      action: "inquiry.status_updated",
      entity: "contact_messages",
      entity_id: id,
      details: { new_status: status, by: auth.user.email, role: auth.user.role },
    });

    return NextResponse.json({ inquiry: updated });
  } catch (err: unknown) {
    console.error("[API Inquiry PATCH] Exception:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Enforce server-side authentication & authorization (Admin, Manager only)
  const auth = await requireAuth(request, ["admin", "manager"]);
  if (isAuthError(auth)) return auth;

  try {
    const { id } = await params;

    // 2. Strict UUID validation
    if (!isValidUuid(id)) {
      return NextResponse.json({ error: "Invalid inquiry identifier." }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[API Inquiry DELETE] Database error:", error.message);
      return NextResponse.json({ error: "Failed to delete inquiry." }, { status: 500 });
    }

    await supabase.from("audit_logs").insert({
      action: "inquiry.deleted",
      entity: "contact_messages",
      entity_id: id,
      details: { by: auth.user.email, role: auth.user.role },
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("[API Inquiry DELETE] Exception:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}

