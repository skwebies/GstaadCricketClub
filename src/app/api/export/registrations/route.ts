import { NextResponse } from "next/server";
import { createAdminClient } from "@/infrastructure/supabase/admin";
import { requireAuth, isAuthError } from "@/infrastructure/security/auth-guard";
import { sanitizeCsvField } from "@/application/validators/schemas";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // 1. Enforce authentication and role (Admin, Manager only)
  const auth = await requireAuth(request, ["admin", "manager"]);
  if (isAuthError(auth)) return auth;

  try {
    const supabase = createAdminClient();
    const { data: registrations, error } = await supabase
      .from("event_registrations")
      .select("*, events(title)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[API Export Registrations] Database error:", error.message);
      return NextResponse.json({ error: "Failed to fetch registrations for export." }, { status: 500 });
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

    // Sanitize all cell contents to neutralize CSV Formula Injection (CWE-1236)
    const rows = (registrations || []).map((r) => [
      sanitizeCsvField(r.id),
      sanitizeCsvField(r.full_name || ""),
      sanitizeCsvField(r.email || ""),
      sanitizeCsvField(r.phone || ""),
      sanitizeCsvField(r.registration_type || ""),
      sanitizeCsvField(r.emergency_contact || ""),
      sanitizeCsvField(r.dietary_requirements || ""),
      sanitizeCsvField((r.events as { title?: string } | null)?.title || "Gstaad Cricket Festival"),
      sanitizeCsvField(new Date(r.created_at).toISOString()),
    ]);

    const csvContent = [
      csvHeaders.map((h) => `"${h}"`).join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\r\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="gstaad_cricket_festival_registrations_${new Date().toISOString().split("T")[0]}.csv"`,
        "Cache-Control": "no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err: unknown) {
    console.error("[API Export Registrations] Exception:", err);
    return NextResponse.json({ error: "Export failed." }, { status: 500 });
  }
}

