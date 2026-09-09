import { NextResponse } from "next/server";
import { createAdminClient } from "@/infrastructure/supabase/admin";
import { requireAuth, isAuthError } from "@/infrastructure/security/auth-guard";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // 1. Enforce server-side authentication & authorization (Admin, Manager, Staff)
  const auth = await requireAuth(request, ["admin", "manager", "staff"]);
  if (isAuthError(auth)) return auth;

  try {
    const supabase = createAdminClient();
    const { data: registrations, error } = await supabase
      .from("event_registrations")
      .select("*, events(title)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[API Registrations] Database error:", error.message);
      return NextResponse.json({ error: "Failed to retrieve registration records." }, { status: 500 });
    }

    return NextResponse.json({ registrations });
  } catch (err: unknown) {
    console.error("[API Registrations] Exception:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
