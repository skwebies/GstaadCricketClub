import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/infrastructure/supabase/admin";
import { normalizeMemberTier } from "@/core/domain/entities/Member";
import { requireAuth, isAuthError } from "@/infrastructure/security/auth-guard";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // 1. Enforce server-side authentication & authorization (Admin, Manager)
  const auth = await requireAuth(request, ["admin", "manager"]);
  if (isAuthError(auth)) return auth;

  try {
    const supabase = createAdminClient();
    const { data: members, error } = await supabase
      .from("members")
      .select()
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[API Members GET] Database error:", error.message);
      return NextResponse.json({ error: "Failed to retrieve member roster." }, { status: 500 });
    }

    return NextResponse.json({ members });
  } catch (err: unknown) {
    console.error("[API Members GET] Exception:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // 1. Enforce server-side authentication & authorization (Admin, Manager)
  const auth = await requireAuth(request, ["admin", "manager"]);
  if (isAuthError(auth)) return auth;

  try {
    const body = await request.json();
    const { full_name, email, phone, tier, handicap_or_experience, notes } = body;

    if (!full_name || !email || !phone || !tier) {
      return NextResponse.json(
        { error: "Full name, email, phone, and membership tier are required." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const canonicalTier = normalizeMemberTier(tier);

    const { data: member, error } = await supabase
      .from("members")
      .insert({
        full_name: String(full_name).trim().slice(0, 100),
        email: String(email).toLowerCase().trim().slice(0, 100),
        phone: String(phone).trim().slice(0, 30),
        tier: canonicalTier,
        handicap_or_experience: handicap_or_experience ? String(handicap_or_experience).slice(0, 200) : null,
        notes: notes ? String(notes).slice(0, 500) : null,
        status: "active",
      })
      .select()
      .single();

    if (error) {
      console.error("[API Members POST] Database error:", error.message);
      return NextResponse.json({ error: "Failed to create member record." }, { status: 500 });
    }

    // Security Audit Logging
    await supabase.from("audit_logs").insert({
      action: "member.created",
      entity: "members",
      entity_id: member.id,
      details: { email: member.email, tier: canonicalTier, by: auth.user.email },
    });

    return NextResponse.json({ member });
  } catch (err: unknown) {
    console.error("[API Members POST] Exception:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
