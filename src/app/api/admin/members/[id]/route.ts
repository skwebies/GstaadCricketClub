import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/infrastructure/supabase/admin";
import type { Database } from "@/infrastructure/supabase/database.types";
import { normalizeMemberTier } from "@/core/domain/entities/Member";
import { requireAuth, isAuthError } from "@/infrastructure/security/auth-guard";
import { isValidUuid } from "@/application/validators/schemas";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Enforce server-side authentication & authorization (Admin, Manager)
  const auth = await requireAuth(request, ["admin", "manager"]);
  if (isAuthError(auth)) return auth;

  try {
    const { id } = await params;

    // 2. Validate UUID format (SQLi & Path Traversal defense)
    if (!isValidUuid(id)) {
      return NextResponse.json({ error: "Invalid member identifier." }, { status: 400 });
    }

    const body = await request.json();
    const supabase = createAdminClient();

    // 3. Strict whitelist of allowed update fields (Mass Assignment defense)
    const allowedUpdates: Database["public"]["Tables"]["members"]["Update"] = {};
    if (body.status !== undefined && ["pending", "active", "suspended", "expired"].includes(body.status)) {
      allowedUpdates.status = body.status;
    }
    if (body.tier !== undefined) allowedUpdates.tier = normalizeMemberTier(body.tier);
    if (typeof body.full_name === "string") allowedUpdates.full_name = body.full_name.trim().slice(0, 100);
    if (typeof body.email === "string") allowedUpdates.email = body.email.toLowerCase().trim().slice(0, 100);
    if (typeof body.phone === "string") allowedUpdates.phone = body.phone.trim().slice(0, 30);
    if (typeof body.notes === "string") allowedUpdates.notes = body.notes.slice(0, 500);

    const { data: updated, error } = await supabase
      .from("members")
      .update(allowedUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[API Member PATCH] Database error:", error.message);
      return NextResponse.json({ error: "Failed to update member record." }, { status: 500 });
    }

    // Security Audit Logging
    await supabase.from("audit_logs").insert({
      action: "member.updated",
      entity: "members",
      entity_id: id,
      details: { updates: allowedUpdates as Record<string, string | number | boolean | null>, by: auth.user.email },
    });

    return NextResponse.json({ member: updated });
  } catch (err: unknown) {
    console.error("[API Member PATCH] Exception:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Enforce server-side authentication & authorization (Admin, Manager)
  const auth = await requireAuth(request, ["admin", "manager"]);
  if (isAuthError(auth)) return auth;

  try {
    const { id } = await params;

    if (!isValidUuid(id)) {
      return NextResponse.json({ error: "Invalid member identifier." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("members").delete().eq("id", id);

    if (error) {
      console.error("[API Member DELETE] Database error:", error.message);
      return NextResponse.json({ error: "Failed to delete member." }, { status: 500 });
    }

    await supabase.from("audit_logs").insert({
      action: "member.deleted",
      entity: "members",
      entity_id: id,
      details: { deleted_at: new Date().toISOString(), by: auth.user.email },
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("[API Member DELETE] Exception:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
