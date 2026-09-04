import { NextResponse } from "next/server";
import { createAdminClient } from "@/infrastructure/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data: registrations, error } = await supabase
      .from("event_registrations")
      .select("*, events(title)")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ registrations });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch registrations";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
