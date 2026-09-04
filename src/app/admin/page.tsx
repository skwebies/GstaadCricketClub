import Link from "next/link";
import { Users, UserCheck, Mail, Calendar, ArrowUpRight, Download, Plus } from "lucide-react";
import { createAdminClient } from "@/infrastructure/supabase/admin";
import { formatDateCH } from "@/shared/utils/formatters";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();

  // Fetch metrics in parallel
  const [
    { count: regCount },
    { count: memberCount },
    { count: inquiryCount },
    { data: activeEvent },
    { data: recentRegistrations },
  ] = await Promise.all([
    supabase.from("event_registrations").select("*", { count: "exact", head: true }),
    supabase.from("members").select("*", { count: "exact", head: true }),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "unread"),
    supabase.from("events").select("*").eq("is_active", true).order("start_date", { ascending: true }).limit(1).maybeSingle(),
    supabase.from("event_registrations").select("*, events(title)").order("created_at", { ascending: false }).limit(6),
  ]);

  const totalRegistrations = regCount ?? 0;
  const totalMembers = memberCount ?? 0;
  const unreadInquiries = inquiryCount ?? 0;
  const maxCapacity = activeEvent?.max_participants ?? 250;
  const capacityPercent = Math.min(100, Math.round((totalRegistrations / maxCapacity) * 100));

  return (
    <div className="space-y-8">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <span className="text-[var(--gold)] uppercase tracking-[0.2em] text-[0.7rem] font-bold block mb-1">
            CONTROL CENTER
          </span>
          <h1 className="font-serif text-3xl md:text-4xl text-[var(--ink)] font-normal">
            Dashboard Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/export/registrations"
            download
            className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span>Export CSV</span>
          </a>
          <Link
            href="/admin/members"
            className="inline-flex items-center gap-2 bg-[var(--gold)] text-[var(--green-dark)] hover:bg-[var(--gold-hover)] px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Member</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Festival Registrations */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Festival Attendees</span>
            <Users className="w-5 h-5 text-[var(--gold)]" />
          </div>
          <div className="font-serif text-3xl font-normal text-[var(--ink)]">
            {totalRegistrations}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Target capacity: {maxCapacity} guests
          </p>
        </div>

        {/* Card 2: Club Members */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Club Members</span>
            <UserCheck className="w-5 h-5 text-[var(--green)]" />
          </div>
          <div className="font-serif text-3xl font-normal text-[var(--ink)]">
            {totalMembers}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Full Playing &amp; Family tiers
          </p>
        </div>

        {/* Card 3: Unread Inquiries */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Messages</span>
            <Mail className="w-5 h-5 text-[var(--red)]" />
          </div>
          <div className="font-serif text-3xl font-normal text-[var(--ink)]">
            {unreadInquiries}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Requires committee reply
          </p>
        </div>

        {/* Card 4: Capacity Fill Rate */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Festival Capacity</span>
            <Calendar className="w-5 h-5 text-[var(--gold)]" />
          </div>
          <div className="font-serif text-3xl font-normal text-[var(--ink)]">
            {capacityPercent}%
          </div>
          {/* Capacity Progress Bar */}
          <div className="w-full bg-gray-100 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-[var(--gold)] h-full transition-all duration-500"
              style={{ width: `${capacityPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Active Event Banner */}
      {activeEvent && (
        <div className="bg-[var(--green)] text-[var(--cream)] p-6 rounded-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[var(--gold)] uppercase text-[0.68rem] tracking-widest font-extrabold block mb-1">
              ACTIVE FEATURED EVENT
            </span>
            <h3 className="font-serif text-2xl text-white font-normal">
              {activeEvent.title}
            </h3>
            <p className="text-sm text-[#e4dfd1] mt-1">
              📍 {activeEvent.location} · 📅 {formatDateCH(activeEvent.start_date)}
            </p>
          </div>
          <Link
            href="/admin/events"
            className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider self-start md:self-auto transition-colors"
          >
            <span>Manage Event</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Recent Registrations Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl text-[var(--ink)] font-normal">
              Recent Festival Registrations
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Live registrations for the Gstaad Cricket Festival
            </p>
          </div>
          <Link
            href="/admin/registrations"
            className="text-xs text-[var(--green)] hover:text-[var(--gold)] font-bold uppercase tracking-wider flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#fcfaf5] text-xs uppercase font-bold text-gray-500 border-b border-gray-200">
              <tr>
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Phone</th>
                <th className="py-3 px-6">Type</th>
                <th className="py-3 px-6">Registered On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentRegistrations && recentRegistrations.length > 0 ? (
                recentRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-gray-50/50">
                    <td className="py-3.5 px-6 font-semibold text-[var(--ink)]">
                      {reg.full_name}
                    </td>
                    <td className="py-3.5 px-6 text-gray-600">{reg.email}</td>
                    <td className="py-3.5 px-6 text-gray-600">{reg.phone}</td>
                    <td className="py-3.5 px-6">
                      <span className="inline-block bg-gray-100 text-gray-700 px-2.5 py-1 text-xs rounded uppercase font-bold tracking-wider">
                        {reg.registration_type.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-gray-500 text-xs">
                      {formatDateCH(reg.created_at)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400 text-sm">
                    No registrations recorded yet. Attendees registering on the public website will appear here in real-time.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
