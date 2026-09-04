"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Download,
  Trash2,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { formatDateCH } from "@/shared/utils/formatters";

type Registration = {
  id: string;
  event_id: string;
  full_name: string;
  email: string;
  phone: string;
  registration_type: "playing_member" | "spectator" | "vip_patron";
  dietary_requirements: string | null;
  emergency_contact: string;
  created_at: string;
  events?: { title: string } | null;
};

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      // In SSR/Client, we can fetch from an internal endpoint or Supabase directly
      // Let's create an endpoint or fetch from our API
      const res = await fetch("/api/register?admin=true");
      if (!res.ok) {
        // Fallback: fetch via client Supabase or an export
        throw new Error("Failed to load registrations");
      }
      const data = await res.json();
      setRegistrations(data.registrations || []);
    } catch {
      // Direct fetch fallback
      const direct = await fetch("/api/admin/registrations");
      if (direct.ok) {
        const json = await direct.json();
        setRegistrations(json.registrations || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove the registration for "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete registration");
      }

      setRegistrations((prev) => prev.filter((r) => r.id !== id));
      setFeedback({
        type: "success",
        message: `Registration for ${name} removed successfully.`,
      });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error deleting registration";
      setFeedback({ type: "error", message: msg });
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = registrations.filter((r) => {
    const matchSearch =
      r.full_name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.phone.toLowerCase().includes(search.toLowerCase());

    const matchType = typeFilter === "all" || r.registration_type === typeFilter;
    return matchSearch && matchType;
  });

  const typeBadgeStyles = {
    playing_member: "bg-emerald-100 text-emerald-800 border-emerald-200",
    spectator: "bg-blue-100 text-blue-800 border-blue-200",
    vip_patron: "bg-amber-100 text-amber-900 border-amber-300 font-bold",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <span className="text-[var(--gold)] uppercase tracking-[0.2em] text-[0.7rem] font-bold block mb-1">
            ATTENDEE MANAGEMENT
          </span>
          <h1 className="font-serif text-3xl md:text-4xl text-[var(--ink)] font-normal">
            Festival Registrations
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Live attendee list for the Gstaad Cricket Festival
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchRegistrations}
            disabled={loading}
            className="p-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <a
            href="/api/export/registrations"
            download
            className="inline-flex items-center gap-2 bg-[var(--gold)] text-[var(--green-dark)] hover:bg-[var(--gold-hover)] px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 text-sm ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Stats and Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[var(--green)]"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
            <Filter className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span>Type:</span>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs bg-[#fdfcf9] border border-gray-300 rounded-md px-3 py-2 font-medium text-gray-700 focus:outline-none focus:border-[var(--green)]"
          >
            <option value="all">All Registrations ({registrations.length})</option>
            <option value="playing_member">Playing Member</option>
            <option value="spectator">Spectator</option>
            <option value="vip_patron">VIP Patron</option>
          </select>
        </div>
      </div>

      {/* Registrations Data Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#fcfaf5] text-xs uppercase font-bold text-gray-500 border-b border-gray-200">
              <tr>
                <th className="py-3 px-6">Attendee</th>
                <th className="py-3 px-6">Contact Details</th>
                <th className="py-3 px-6">Registration Type</th>
                <th className="py-3 px-6">Emergency Contact</th>
                <th className="py-3 px-6">Dietary / Notes</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[var(--gold)]" />
                      <span>Loading registrations...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((reg) => (
                  <tr key={reg.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="font-semibold text-[var(--ink)]">
                        {reg.full_name}
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-xs text-gray-600">
                      <div>{reg.email}</div>
                      <div className="text-gray-400 mt-0.5">{reg.phone}</div>
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`inline-block border px-2.5 py-1 text-[0.68rem] rounded uppercase tracking-wider font-semibold ${
                          typeBadgeStyles[reg.registration_type] ||
                          "bg-gray-100 text-gray-700 border-gray-200"
                        }`}
                      >
                        {reg.registration_type.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-xs text-gray-600">
                      {reg.emergency_contact || "—"}
                    </td>
                    <td className="py-3.5 px-6 text-xs text-gray-600 max-w-xs truncate">
                      {reg.dietary_requirements || "None"}
                    </td>
                    <td className="py-3.5 px-6 text-xs text-gray-500 whitespace-nowrap">
                      {formatDateCH(reg.created_at)}
                    </td>
                    <td className="py-3.5 px-6 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(reg.id, reg.full_name)}
                        disabled={deletingId === reg.id}
                        className="p-1.5 text-gray-400 hover:text-[var(--red)] transition-colors rounded hover:bg-rose-50"
                        title="Remove Registration"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400 text-sm">
                    {search || typeFilter !== "all"
                      ? "No registrations match your search or filter criteria."
                      : "No registrations yet. Attendees registering on the public website will be listed here."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Summary */}
        <div className="p-4 bg-[#fdfcf9] border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between">
          <span>
            Showing <strong>{filtered.length}</strong> of{" "}
            <strong>{registrations.length}</strong> registrations
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span>Gstaad Cricket Festival 2026</span>
          </span>
        </div>
      </div>
    </div>
  );
}
