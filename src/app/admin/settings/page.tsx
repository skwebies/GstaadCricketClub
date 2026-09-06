import { CLUB_CONFIG } from "@/shared/config/club";
import { EmailDiagnosticsCard } from "@/shared/components/admin/EmailDiagnosticsCard";
import {
  ShieldCheck,
  Server,
  Building,
  Users,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <span className="text-[var(--gold)] uppercase tracking-[0.2em] text-[0.7rem] font-bold block mb-1">
            CONFIGURATION
          </span>
          <h1 className="font-serif text-3xl md:text-4xl text-[var(--ink)] font-normal">
            Club &amp; System Settings
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Official club entity information, committee roster, and cloud infrastructure diagnostics
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Systems Operational</span>
        </div>
      </div>

      {/* Grid: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Club Information */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <Building className="w-5 h-5 text-[var(--gold)]" />
            <h2 className="font-serif text-xl font-normal text-[var(--ink)]">
              Official Club Information
            </h2>
          </div>

          <div className="space-y-3 text-xs text-gray-700">
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="font-bold uppercase tracking-wider text-gray-400">Club Name</span>
              <span className="font-semibold text-gray-900">{CLUB_CONFIG.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="font-bold uppercase tracking-wider text-gray-400">Motto</span>
              <span className="italic text-gray-800">&ldquo;{CLUB_CONFIG.tagline}&rdquo;</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="font-bold uppercase tracking-wider text-gray-400">Affiliation</span>
              <span className="font-semibold text-gray-900">{CLUB_CONFIG.affiliation.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="font-bold uppercase tracking-wider text-gray-400">Primary Venue</span>
              <span className="text-gray-900">{CLUB_CONFIG.festival.venueName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="font-bold uppercase tracking-wider text-gray-400">Email</span>
              <a href={`mailto:${CLUB_CONFIG.contact.email}`} className="text-[var(--green)] hover:underline font-medium">
                {CLUB_CONFIG.contact.email}
              </a>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-bold uppercase tracking-wider text-gray-400">Location</span>
              <span className="text-gray-900">{CLUB_CONFIG.contact.location}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Infrastructure Diagnostics */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <Server className="w-5 h-5 text-[var(--gold)]" />
            <h2 className="font-serif text-xl font-normal text-[var(--ink)]">
              Cloud Infrastructure
            </h2>
          </div>

          <div className="space-y-3 text-xs text-gray-700">
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="font-bold uppercase tracking-wider text-gray-400">Framework</span>
              <span className="font-mono font-medium text-gray-900">Next.js 16 (App Router)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="font-bold uppercase tracking-wider text-gray-400">Styling</span>
              <span className="font-mono font-medium text-gray-900">Tailwind CSS v4 + Swiss Palette Tokens</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="font-bold uppercase tracking-wider text-gray-400">Database Engine</span>
              <span className="font-semibold text-gray-900">Supabase PostgreSQL 15</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="font-bold uppercase tracking-wider text-gray-400">Hosting Region</span>
              <span className="font-semibold text-emerald-700">eu-central-2 (Zurich, Switzerland)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="font-bold uppercase tracking-wider text-gray-400">Security Model</span>
              <span className="font-semibold text-gray-900">Row Level Security (RLS) Active</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-bold uppercase tracking-wider text-gray-400">Audit Logging</span>
              <span className="font-semibold text-emerald-700">PostgreSQL Transaction Log</span>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-lg border border-emerald-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900">
              <span className="font-bold">Compliant Alpine Infrastructure:</span> Database resides locally in Zurich data center respecting Swiss federal data protection principles (nFADP/DSG).
            </div>
          </div>
        </div>
      </div>

      {/* Section 2b: Mail Delivery & Postfix Engine */}
      <EmailDiagnosticsCard />

      {/* Section 3: Committee Leadership Registry */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
          <Users className="w-5 h-5 text-[var(--gold)]" />
          <h2 className="font-serif text-xl font-normal text-[var(--ink)]">
            Active Committee Roster
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CLUB_CONFIG.committee.map((member) => (
            <div
              key={member.name}
              className="p-4 rounded-lg bg-[#fcfaf5] border border-gray-100 flex flex-col justify-between"
            >
              <div>
                <span className="text-[0.68rem] text-[var(--gold)] font-bold uppercase tracking-wider block mb-1">
                  {member.role}
                </span>
                <h4 className="font-serif text-base text-[var(--ink)] font-normal mb-1">
                  {member.name}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
