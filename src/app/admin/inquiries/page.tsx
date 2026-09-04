"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Search,
  Trash2,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  CheckCheck,
  Eye,
  X,
} from "lucide-react";
import { formatDateCH } from "@/shared/utils/formatters";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "responded";
  created_at: string;
};

export default function InquiriesAdminPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeMessage, setActiveMessage] = useState<Inquiry | null>(null);

  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact");
      if (!res.ok) throw new Error("Failed to load inquiries");
      const data = await res.json();
      setInquiries(data.messages || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error loading inquiries";
      setFeedback({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (
    id: string,
    newStatus: "unread" | "read" | "responded"
  ) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update inquiry status");

      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
      );
      if (activeMessage && activeMessage.id === id) {
        setActiveMessage({ ...activeMessage, status: newStatus });
      }
      setFeedback({
        type: "success",
        message: `Inquiry marked as "${newStatus}".`,
      });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Update failed";
      setFeedback({ type: "error", message: msg });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete inquiry message from "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete message");

      setInquiries((prev) => prev.filter((inq) => inq.id !== id));
      if (activeMessage?.id === id) setActiveMessage(null);
      setFeedback({
        type: "success",
        message: `Message from ${name} has been deleted.`,
      });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Delete failed";
      setFeedback({ type: "error", message: msg });
    }
  };

  const filtered = inquiries.filter((inq) => {
    const matchSearch =
      inq.name.toLowerCase().includes(search.toLowerCase()) ||
      inq.email.toLowerCase().includes(search.toLowerCase()) ||
      inq.subject.toLowerCase().includes(search.toLowerCase()) ||
      inq.message.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === "all" || inq.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const unreadCount = inquiries.filter((inq) => inq.status === "unread").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <span className="text-[var(--gold)] uppercase tracking-[0.2em] text-[0.7rem] font-bold block mb-1">
            COMMUNICATIONS
          </span>
          <h1 className="font-serif text-3xl md:text-4xl text-[var(--ink)] font-normal">
            Inquiries Inbox
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Inbound inquiries and messages from the website contact forms
          </p>
        </div>

        <button
          onClick={fetchInquiries}
          disabled={loading}
          className="p-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-colors self-start sm:self-auto"
          title="Refresh Inbox"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
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

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[var(--green)]"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
            <Filter className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-[#fdfcf9] border border-gray-300 rounded-md px-3 py-2 font-medium text-gray-700 focus:outline-none focus:border-[var(--green)]"
          >
            <option value="all">All Inquiries ({inquiries.length})</option>
            <option value="unread">Unread ({unreadCount})</option>
            <option value="read">Read</option>
            <option value="responded">Responded</option>
          </select>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#fcfaf5] text-xs uppercase font-bold text-gray-500 border-b border-gray-200">
              <tr>
                <th className="py-3 px-6">Sender</th>
                <th className="py-3 px-6">Subject</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[var(--gold)]" />
                      <span>Loading messages...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((inq) => (
                  <tr
                    key={inq.id}
                    className={`hover:bg-gray-50/60 transition-colors ${
                      inq.status === "unread" ? "bg-amber-50/20 font-medium" : ""
                    }`}
                  >
                    <td className="py-3.5 px-6">
                      <div className="font-semibold text-[var(--ink)]">
                        {inq.name}
                      </div>
                      <div className="text-xs text-gray-500">{inq.email}</div>
                    </td>
                    <td className="py-3.5 px-6 max-w-sm">
                      <div className="text-sm text-[var(--ink)] font-medium">
                        {inq.subject}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">
                        {inq.message}
                      </div>
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-[0.68rem] rounded-full uppercase tracking-wider font-bold ${
                          inq.status === "unread"
                            ? "bg-rose-100 text-rose-800"
                            : inq.status === "responded"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {inq.status === "unread" && <Clock className="w-3 h-3" />}
                        {inq.status === "responded" && <CheckCheck className="w-3 h-3" />}
                        <span>{inq.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-xs text-gray-500 whitespace-nowrap">
                      {formatDateCH(inq.created_at)}
                    </td>
                    <td className="py-3.5 px-6 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => {
                          setActiveMessage(inq);
                          if (inq.status === "unread") {
                            handleUpdateStatus(inq.id, "read");
                          }
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 rounded font-medium transition-colors"
                        title="View Full Message"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handleDelete(inq.id, inq.name)}
                        className="p-1.5 text-gray-400 hover:text-[var(--red)] transition-colors rounded hover:bg-rose-50"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 text-sm">
                    No inquiries match your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-[#fdfcf9] border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between">
          <span>
            Showing <strong>{filtered.length}</strong> of <strong>{inquiries.length}</strong> inquiries
          </span>
          <span className="flex items-center gap-1">
            <Mail className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span>Club Secretariat</span>
          </span>
        </div>
      </div>

      {/* Message View Modal */}
      {activeMessage && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 relative">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <div>
                <span className="text-[var(--gold)] text-[0.68rem] uppercase tracking-widest font-bold block">
                  INQUIRY DETAILS
                </span>
                <h3 className="font-serif text-xl font-normal text-[var(--ink)]">
                  {activeMessage.subject}
                </h3>
              </div>
              <button
                onClick={() => setActiveMessage(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-[#fcfaf5] p-3.5 rounded-lg border border-gray-100">
                <div>
                  <div className="font-bold uppercase text-gray-400 text-[0.65rem]">From</div>
                  <div className="font-medium text-sm text-[var(--ink)]">{activeMessage.name}</div>
                </div>
                <div>
                  <div className="font-bold uppercase text-gray-400 text-[0.65rem]">Email</div>
                  <a
                    href={`mailto:${activeMessage.email}`}
                    className="text-[var(--green)] hover:underline font-medium text-sm"
                  >
                    {activeMessage.email}
                  </a>
                </div>
                <div>
                  <div className="font-bold uppercase text-gray-400 text-[0.65rem]">Sent On</div>
                  <div className="text-gray-600">{formatDateCH(activeMessage.created_at)}</div>
                </div>
                <div>
                  <div className="font-bold uppercase text-gray-400 text-[0.65rem]">Status</div>
                  <span className="font-semibold text-gray-700 capitalize">{activeMessage.status}</span>
                </div>
              </div>

              <div>
                <div className="font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Message Content:
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-gray-800 text-sm whitespace-pre-wrap leading-relaxed border border-gray-200">
                  {activeMessage.message}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus(activeMessage.id, "responded")}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Mark as Responded
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(activeMessage.id, "unread")}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium transition-colors"
                  >
                    Mark Unread
                  </button>
                </div>

                <a
                  href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(
                    activeMessage.subject
                  )}`}
                  className="px-4 py-1.5 bg-[var(--gold)] text-[var(--green-dark)] hover:bg-[var(--gold-hover)] rounded text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
