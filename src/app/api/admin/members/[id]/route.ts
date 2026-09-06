import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/infrastructure/supabase/admin";
import type { Database } from "@/infrastructure/supabase/database.types";
import { normalizeMemberTier } from "@/core/domain/entities/Member";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = createAdminClient();

    const allowedUpdates: Database["public"]["Tables"]["members"]["Update"] = {};
    if (body.status !== undefined) allowedUpdates.status = body.status;
    if (body.tier !== undefined) allowedUpdates.tier = normalizeMemberTier(body.tier);
    if (body.full_name !== undefined) allowedUpdates.full_name = body.full_name;
    if (body.email !== undefined) allowedUpdates.email = body.email;
    if (body.phone !== undefined) allowedUpdates.phone = body.phone;
    if (body.notes !== undefined) allowedUpdates.notes = body.notes;

    const { data: updated, error } = await supabase
      .from("members")
      .update(allowedUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase.from("audit_logs").insert({
      action: "member.updated",
      entity: "members",
      entity_id: id,
      details: { updates: allowedUpdates as Record<string, string | number | boolean | null>, by: "admin" },
    });

    return NextResponse.json({ member: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update member";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();

    const { error } = await supabase.from("members").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase.from("audit_logs").insert({
      action: "member.deleted",
      entity: "members",
      entity_id: id,
      details: { by: "admin", deleted_at: new Date().toISOString() },
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete member";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
