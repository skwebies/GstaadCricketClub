import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/infrastructure/supabase/admin";
import { requireAuth, isAuthError } from "@/infrastructure/security/auth-guard";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // 1. Server-side authentication and role check (Admin, Manager, Staff)
  const auth = await requireAuth(request, ["admin", "manager", "staff"]);
  if (isAuthError(auth)) return auth;

  try {
    const supabase = createAdminClient();
    const { data: events, error } = await supabase
      .from("events")
      .select("*, event_registrations(count)")
      .order("start_date", { ascending: false });

    if (error) {
      console.error("[API Events GET] Database error:", error.message);
      return NextResponse.json({ error: "Failed to fetch events." }, { status: 500 });
    }

    return NextResponse.json({ events });
  } catch (err: unknown) {
    console.error("[API Events GET] Exception:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // 1. Server-side authentication and role check (Admin, Manager only)
  const auth = await requireAuth(request, ["admin", "manager"]);
  if (isAuthError(auth)) return auth;

  try {
    const body = await request.json();
    const { title, slug, description, location, start_date, end_date, max_participants, is_active } = body;

    if (!title || !slug || !description || !location || !start_date || !end_date) {
      return NextResponse.json(
        { error: "Missing required fields for event creation." },
        { status: 400 }
      );
    }

    // Slug format check to prevent injection
    if (typeof slug !== "string" || !/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { error: "Slug must contain only lowercase alphanumeric characters and hyphens." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: newEvent, error } = await supabase
      .from("events")
      .insert({
        title: String(title).slice(0, 200),
        slug,
        description: String(description).slice(0, 5000),
        location: String(location).slice(0, 300),
        start_date,
        end_date,
        max_participants: typeof max_participants === "number" ? Math.min(Math.max(1, max_participants), 5000) : 250,
        is_active: Boolean(is_active),
      })
      .select()
      .single();

    if (error) {
      console.error("[API Events POST] Database error:", error.message);
      return NextResponse.json({ error: "Failed to create event." }, { status: 500 });
    }

    await supabase.from("audit_logs").insert({
      action: "event.created",
      entity: "events",
      entity_id: newEvent.id,
      details: { title, slug, by: auth.user.email, role: auth.user.role },
    });

    return NextResponse.json({ event: newEvent }, { status: 201 });
  } catch (err: unknown) {
    console.error("[API Events POST] Exception:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}

