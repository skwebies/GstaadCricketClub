import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/infrastructure/supabase/admin";
import { requireAuth, isAuthError } from "@/infrastructure/security/auth-guard";
import { isValidUuid } from "@/application/validators/schemas";
import type { Database } from "@/infrastructure/supabase/database.types";

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
      return NextResponse.json({ error: "Invalid event identifier." }, { status: 400 });
    }

    const body = await request.json();
    const supabase = createAdminClient();

    const allowedUpdates: Database["public"]["Tables"]["events"]["Update"] = {};
    if (typeof body.title === "string") allowedUpdates.title = body.title.slice(0, 200);
    if (typeof body.description === "string") allowedUpdates.description = body.description.slice(0, 5000);
    if (typeof body.location === "string") allowedUpdates.location = body.location.slice(0, 300);
    if (body.start_date !== undefined) allowedUpdates.start_date = body.start_date;
    if (body.end_date !== undefined) allowedUpdates.end_date = body.end_date;
    if (typeof body.max_participants === "number") allowedUpdates.max_participants = Math.min(Math.max(1, body.max_participants), 5000);
    if (typeof body.is_active === "boolean") allowedUpdates.is_active = body.is_active;

    const { data: updated, error } = await supabase
      .from("events")
      .update(allowedUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[API Event PATCH] Database error:", error.message);
      return NextResponse.json({ error: "Failed to update event." }, { status: 500 });
    }

    await supabase.from("audit_logs").insert({
      action: "event.updated",
      entity: "events",
      entity_id: id,
      details: {
        updates: allowedUpdates as Record<string, string | number | boolean | null>,
        by: auth.user.email,
        role: auth.user.role,
      },
    });

    return NextResponse.json({ event: updated });
  } catch (err: unknown) {
    console.error("[API Event PATCH] Exception:", err);
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
      return NextResponse.json({ error: "Invalid event identifier." }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
      console.error("[API Event DELETE] Database error:", error.message);
      return NextResponse.json({ error: "Failed to delete event." }, { status: 500 });
    }

    await supabase.from("audit_logs").insert({
      action: "event.deleted",
      entity: "events",
      entity_id: id,
      details: { by: auth.user.email, role: auth.user.role },
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("[API Event DELETE] Exception:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}

