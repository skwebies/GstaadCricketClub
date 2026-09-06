"use client";

import { useState, useEffect, useTransition } from "react";
import {
  UserCheck,
  Search,
  Plus,
  Trash2,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  X,
  Check,
  Clock,
} from "lucide-react";
import { formatDateCH } from "@/shared/utils/formatters";

type Member = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  tier: string;
  handicap_or_experience: string | null;
  notes: string | null;
  status: "active" | "pending" | "inactive";
  created_at: string;
};

export default function MembersAdminPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  // New member form state
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    tier: "Full Playing",
    handicap_or_experience: "",
    notes: "",
  });

  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/members");
      if (!res.ok) throw new Error("Failed to load members");
      const data = await res.json();
      setMembers(data.members || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error loading members";
      setFeedback({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to create member");
        }

        const data = await res.json();
        setMembers((prev) => [data.member, ...prev]);
        setShowAddModal(false);
        setFormData({
          full_name: "",
          email: "",
          phone: "",
          tier: "Full Playing",
          handicap_or_experience: "",
          notes: "",
        });
        setFeedback({
          type: "success",
          message: `Member ${data.member.full_name} successfully enrolled.`,
        });
        setTimeout(() => setFeedback(null), 4000);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Error creating member";
        setFeedback({ type: "error", message: msg });
      }
    });
  };

  const handleUpdateStatus = async (
    id: string,
    newStatus: "active" | "pending" | "inactive"
  ) => {
    try {
      const res = await fetch(`/api/admin/members/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update member status");
      }

      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
      );
      setFeedback({
        type: "success",
        message: `Member status updated to "${newStatus}".`,
      });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Update failed";
      setFeedback({ type: "error", message: msg });
    }
  };

  const handleDeleteMember = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete member "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/members/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete member");
      }

      setMembers((prev) => prev.filter((m) => m.id !== id));
      setFeedback({
        type: "success",
        message: `Member "${name}" removed from club roster.`,
      });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Delete failed";
      setFeedback({ type: "error", message: msg });
    }
  };

  const filtered = members.filter((m) => {
    const matchSearch =
      m.full_name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === "all" || m.status === statusFilter;
    const matchTier =
      tierFilter === "all" ||
      m.tier === tierFilter ||
      (tierFilter === "Full Playing" && (m.tier === "Full Playing" || m.tier === "Full Playing Member" || m.tier === "Adult")) ||
      (tierFilter === "Social Member" && (m.tier === "Social Member" || m.tier === "Family")) ||
      (tierFilter === "Junior" && (m.tier === "Junior" || m.tier === "Junior Member")) ||
      (tierFilter === "Patron" && (m.tier === "Patron" || m.tier === "Honorary Patron"));
    return matchSearch && matchStatus && matchTier;
  });

  const activeCount = members.filter((m) => m.status === "active").length;
  const pendingCount = members.filter((m) => m.status === "pending").length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <span className="text-[var(--gold)] uppercase tracking-[0.2em] text-[0.7rem] font-bold block mb-1">
            MEMBERSHIP REGISTRY
          </span>
          <h1 className="font-serif text-3xl md:text-4xl text-[var(--ink)] font-normal">
            Club Members
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Active playing members, social patrons, and pending club applications
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMembers}
            disabled={loading}
            className="p-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-[var(--gold)] text-[var(--green-dark)] hover:bg-[var(--gold-hover)] px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
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

      {/* KPI mini strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Active Members
            </div>
            <div className="font-serif text-2xl text-[var(--ink)] mt-1 font-normal">
              {activeCount}
            </div>
          </div>
          <UserCheck className="w-6 h-6 text-emerald-600" />
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Pending Review
            </div>
            <div className="font-serif text-2xl text-[var(--ink)] mt-1 font-normal">
              {pendingCount}
            </div>
          </div>
          <Clock className="w-6 h-6 text-amber-500" />
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Total Recorded
            </div>
            <div className="font-serif text-2xl text-[var(--ink)] mt-1 font-normal">
              {members.length}
            </div>
          </div>
          <div className="text-xs font-bold text-gray-400">All Tiers</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search members by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[var(--green)]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
            <Filter className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-[#fdfcf9] border border-gray-300 rounded-md px-3 py-2 font-medium text-gray-700 focus:outline-none focus:border-[var(--green)]"
          >
            <option value="all">All Statuses ({members.length})</option>
            <option value="active">Active ({activeCount})</option>
            <option value="pending">Pending ({pendingCount})</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="text-xs bg-[#fdfcf9] border border-gray-300 rounded-md px-3 py-2 font-medium text-gray-700 focus:outline-none focus:border-[var(--green)]"
          >
            <option value="all">All Membership Tiers</option>
            <option value="Full Playing">Full Playing (Adult)</option>
            <option value="Social Member">Social Member (Family)</option>
            <option value="Junior">Junior</option>
            <option value="Patron">Honorary Patron</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#fcfaf5] text-xs uppercase font-bold text-gray-500 border-b border-gray-200">
              <tr>
                <th className="py-3 px-6">Member Name</th>
                <th className="py-3 px-6">Contact Info</th>
                <th className="py-3 px-6">Tier</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Enrolled Date</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[var(--gold)]" />
                      <span>Loading club members...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="font-semibold text-[var(--ink)]">
                        {m.full_name}
                      </div>
                      {m.handicap_or_experience && (
                        <div className="text-[0.72rem] text-gray-500">
                          {m.handicap_or_experience}
                        </div>
                      )}
                      {m.notes && (
                        <div className="text-[0.72rem] text-amber-900/80 bg-amber-50/70 border border-amber-200/50 rounded px-1.5 py-0.5 mt-1 max-w-xs line-clamp-2" title={m.notes}>
                          {m.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-xs text-gray-600">
                      <div>{m.email}</div>
                      <div className="text-gray-400 mt-0.5">{m.phone}</div>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="inline-block bg-gray-100 text-gray-700 px-2.5 py-1 text-xs rounded font-medium">
                        {m.tier}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-[0.68rem] rounded-full uppercase tracking-wider font-bold ${
                          m.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : m.status === "pending"
                            ? "bg-amber-100 text-amber-900"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {m.status === "active" && <Check className="w-3 h-3" />}
                        {m.status === "pending" && <Clock className="w-3 h-3" />}
                        <span>{m.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-xs text-gray-500 whitespace-nowrap">
                      {formatDateCH(m.created_at)}
                    </td>
                    <td className="py-3.5 px-6 text-right whitespace-nowrap space-x-2">
                      {m.status === "pending" && (
                        <button
                          onClick={() => handleUpdateStatus(m.id, "active")}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium transition-colors"
                          title="Approve Member"
                        >
                          Approve
                        </button>
                      )}
                      {m.status === "active" && (
                        <button
                          onClick={() => handleUpdateStatus(m.id, "inactive")}
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs transition-colors"
                          title="Set Inactive"
                        >
                          Deactivate
                        </button>
                      )}
                      {m.status === "inactive" && (
                        <button
                          onClick={() => handleUpdateStatus(m.id, "active")}
                          className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded text-xs transition-colors"
                          title="Reactivate"
                        >
                          Activate
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteMember(m.id, m.full_name)}
                        className="p-1.5 text-gray-400 hover:text-[var(--red)] transition-colors rounded hover:bg-rose-50"
                        title="Delete Member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                    {search || statusFilter !== "all" || tierFilter !== "all"
                      ? "No club members match your filter criteria."
                      : "No members found in registry. Add a new member using the button above."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-[#fdfcf9] border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between">
          <span>
            Showing <strong>{filtered.length}</strong> of <strong>{members.length}</strong> members
          </span>
          <span>Gstaad Cricket Club Registry</span>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 relative">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <div>
                <span className="text-[var(--gold)] text-[0.68rem] uppercase tracking-widest font-bold block">
                  NEW REGISTRATION
                </span>
                <h3 className="font-serif text-xl font-normal text-[var(--ink)]">
                  Add Club Member
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  placeholder="e.g. Maximilian von Berne"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[var(--green)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="name@domain.ch"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[var(--green)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+41 79 000 00 00"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[var(--green)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Membership Tier *
                </label>
                <select
                  value={formData.tier}
                  onChange={(e) =>
                    setFormData({ ...formData, tier: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:border-[var(--green)]"
                >
                  <option value="Full Playing">Full Playing (Adult - CHF 100/yr)</option>
                  <option value="Social Member">Social Member (Family - CHF 200/yr)</option>
                  <option value="Junior">Junior (CHF 50/yr)</option>
                  <option value="Patron">Honorary Patron (CHF 1,000/yr)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Experience / Role (Optional)
                </label>
                <input
                  type="text"
                  value={formData.handicap_or_experience}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      handicap_or_experience: e.target.value,
                    })
                  }
                  placeholder="e.g. All-rounder, Fast bowler, Swiss League player"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[var(--green)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Administrative Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Notes on committee approval, equipment sizes, etc."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[var(--green)]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold uppercase text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 bg-[var(--gold)] text-[var(--green-dark)] hover:bg-[var(--gold-hover)] rounded-md text-xs font-bold uppercase tracking-wider shadow-xs"
                >
                  {isPending ? "Saving..." : "Save Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
