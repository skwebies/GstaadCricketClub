import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/infrastructure/supabase/admin";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !["unread", "read", "responded"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid inquiry status" },
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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase.from("audit_logs").insert({
      action: "inquiry.status_updated",
      entity: "contact_messages",
      entity_id: id,
      details: { new_status: status, by: "admin" },
    });

    return NextResponse.json({ inquiry: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update inquiry";
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

    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase.from("audit_logs").insert({
      action: "inquiry.deleted",
      entity: "contact_messages",
      entity_id: id,
      details: { by: "admin" },
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete inquiry";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
