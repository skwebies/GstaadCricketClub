import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/infrastructure/supabase/admin";
import type { Database } from "@/infrastructure/supabase/database.types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = createAdminClient();

    const allowedUpdates: Database["public"]["Tables"]["events"]["Update"] = {};
    if (body.title !== undefined) allowedUpdates.title = body.title;
    if (body.description !== undefined) allowedUpdates.description = body.description;
    if (body.location !== undefined) allowedUpdates.location = body.location;
    if (body.start_date !== undefined) allowedUpdates.start_date = body.start_date;
    if (body.end_date !== undefined) allowedUpdates.end_date = body.end_date;
    if (body.max_participants !== undefined) allowedUpdates.max_participants = body.max_participants;
    if (body.is_active !== undefined) allowedUpdates.is_active = body.is_active;

    const { data: updated, error } = await supabase
      .from("events")
      .update(allowedUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase.from("audit_logs").insert({
      action: "event.updated",
      entity: "events",
      entity_id: id,
      details: { updates: allowedUpdates as Record<string, string | number | boolean | null>, by: "admin" },
    });

    return NextResponse.json({ event: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update event";
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

    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase.from("audit_logs").insert({
      action: "event.deleted",
      entity: "events",
      entity_id: id,
      details: { by: "admin" },
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete event";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
