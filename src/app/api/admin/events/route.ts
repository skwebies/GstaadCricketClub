import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/infrastructure/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data: events, error } = await supabase
      .from("events")
      .select("*, event_registrations(count)")
      .order("start_date", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ events });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch events";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, description, location, start_date, end_date, max_participants, is_active } = body;

    if (!title || !slug || !description || !location || !start_date || !end_date) {
      return NextResponse.json(
        { error: "Missing required fields for event creation" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: newEvent, error } = await supabase
      .from("events")
      .insert({
        title,
        slug,
        description,
        location,
        start_date,
        end_date,
        max_participants: max_participants ?? 250,
        is_active: is_active ?? false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase.from("audit_logs").insert({
      action: "event.created",
      entity: "events",
      entity_id: newEvent.id,
      details: { title, slug, by: "admin" },
    });

    return NextResponse.json({ event: newEvent }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create event";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
