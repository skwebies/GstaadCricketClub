import { NextResponse } from "next/server";
import { createAdminClient } from "@/infrastructure/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data: users, error } = await supabase
      .from("profiles")
      .select()
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ users: users || [] });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch user profiles";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
