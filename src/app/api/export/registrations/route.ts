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

    const csvHeaders = [
      "ID",
      "Full Name",
      "Email",
      "Phone",
      "Registration Type",
      "Emergency Contact",
      "Dietary Requirements",
      "Event",
      "Registered At",
    ];

    const rows = (registrations || []).map((r) => [
      `"${r.id}"`,
      `"${(r.full_name || "").replace(/"/g, '""')}"`,
      `"${(r.email || "").replace(/"/g, '""')}"`,
      `"${(r.phone || "").replace(/"/g, '""')}"`,
      `"${r.registration_type}"`,
      `"${(r.emergency_contact || "").replace(/"/g, '""')}"`,
      `"${(r.dietary_requirements || "").replace(/"/g, '""')}"`,
      `"${((r.events as { title?: string } | null)?.title || "Gstaad Cricket Festival").replace(/"/g, '""')}"`,
      `"${new Date(r.created_at).toISOString()}"`,
    ]);

    const csvContent = [
      csvHeaders.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\r\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="gstaad_cricket_festival_registrations_${new Date().toISOString().split("T")[0]}.csv"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Export failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
