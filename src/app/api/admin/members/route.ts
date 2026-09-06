import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/infrastructure/supabase/admin";
import { normalizeMemberTier } from "@/core/domain/entities/Member";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data: members, error } = await supabase
      .from("members")
      .select()
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ members });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch members";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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
        full_name,
        email: email.toLowerCase().trim(),
        phone,
        tier: canonicalTier,
        handicap_or_experience: handicap_or_experience || null,
        notes: notes || null,
        status: "active",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log action
    await supabase.from("audit_logs").insert({
      action: "member.created",
      entity: "members",
      entity_id: member.id,
      details: { member_name: full_name, tier, by: "admin" },
    });

    return NextResponse.json({ member }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create member";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
