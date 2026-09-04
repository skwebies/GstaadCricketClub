"use client";

import { useState, useEffect, useTransition } from "react";
import {
  CalendarDays,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  X,
  MapPin,
  Users,
  Calendar,
} from "lucide-react";
import { formatDateCH } from "@/shared/utils/formatters";

type EventItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  max_participants: number;
  is_active: boolean;
  event_registrations?: [{ count: number }] | { count: number }[];
};

export default function EventsAdminPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    location: "Sportzentrum Gstaad, Switzerland",
    start_date: "2026-07-24T09:00",
    end_date: "2026-07-26T18:00",
    max_participants: 250,
    is_active: true,
  });

  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/events");
      if (!res.ok) throw new Error("Failed to load events");
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error loading events";
      setFeedback({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openAddModal = () => {
    setEditingEvent(null);
    setFormData({
      title: "",
      slug: "",
      description: "",
      location: "Sportzentrum Gstaad, Switzerland",
      start_date: "2026-07-24T09:00",
      end_date: "2026-07-26T18:00",
      max_participants: 250,
      is_active: false,
    });
    setShowModal(true);
  };

  const openEditModal = (event: EventItem) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      slug: event.slug,
      description: event.description,
      location: event.location,
      start_date: event.start_date.substring(0, 16),
      end_date: event.end_date.substring(0, 16),
      max_participants: event.max_participants,
      is_active: event.is_active,
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        if (editingEvent) {
          // Update
          const res = await fetch(`/api/admin/events/${editingEvent.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });

          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Failed to update event");
          }

          const { event: updated } = await res.json();
          setEvents((prev) =>
            prev.map((ev) => (ev.id === updated.id ? { ...ev, ...updated } : ev))
          );
          setFeedback({
            type: "success",
            message: `Event "${updated.title}" updated successfully.`,
          });
        } else {
          // Create
          const res = await fetch("/api/admin/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });

          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Failed to create event");
          }

          const { event: created } = await res.json();
          setEvents((prev) => [created, ...prev]);
          setFeedback({
            type: "success",
            message: `Event "${created.title}" successfully created.`,
          });
        }

        setShowModal(false);
        setTimeout(() => setFeedback(null), 4000);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Submission failed";
        setFeedback({ type: "error", message: msg });
      }
    });
  };

  const handleToggleActive = async (event: EventItem) => {
    try {
      const res = await fetch(`/api/admin/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !event.is_active }),
      });

      if (!res.ok) throw new Error("Failed to toggle active status");

      setEvents((prev) =>
        prev.map((e) =>
          e.id === event.id ? { ...e, is_active: !e.is_active } : e
        )
      );
      setFeedback({
        type: "success",
        message: `Event "${event.title}" is now ${
          !event.is_active ? "ACTIVE (Visible on Home)" : "INACTIVE"
        }.`,
      });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Toggle failed";
      setFeedback({ type: "error", message: msg });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete event "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete event");

      setEvents((prev) => prev.filter((e) => e.id !== id));
      setFeedback({
        type: "success",
        message: `Event "${title}" has been deleted.`,
      });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Delete failed";
      setFeedback({ type: "error", message: msg });
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <span className="text-[var(--gold)] uppercase tracking-[0.2em] text-[0.7rem] font-bold block mb-1">
            SCHEDULE &amp; FIXTURES
          </span>
          <h1 className="font-serif text-3xl md:text-4xl text-[var(--ink)] font-normal">
            Events Manager
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage festival dates, fixtures, participant capacities, and public registrations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchEvents}
            disabled={loading}
            className="p-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-[var(--gold)] text-[var(--green-dark)] hover:bg-[var(--gold-hover)] px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Event</span>
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

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 py-16 text-center text-gray-400">
            <RefreshCw className="w-6 h-6 animate-spin text-[var(--gold)] mx-auto mb-2" />
            <span>Loading scheduled events...</span>
          </div>
        ) : events.length > 0 ? (
          events.map((ev) => {
            const regCount = Array.isArray(ev.event_registrations)
              ? ev.event_registrations[0]?.count ?? 0
              : 0;
            const pct = Math.min(
              100,
              Math.round((regCount / (ev.max_participants || 250)) * 100)
            );

            return (
              <div
                key={ev.id}
                className={`bg-white rounded-xl border p-6 shadow-xs flex flex-col justify-between transition-all ${
                  ev.is_active
                    ? "border-[var(--gold)] ring-1 ring-[var(--gold)]/30"
                    : "border-gray-200"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[0.68rem] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold ${
                        ev.is_active
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-gray-100 text-gray-600 border border-gray-200"
                      }`}
                    >
                      {ev.is_active ? "Active on Public Site" : "Draft / Archived"}
                    </span>
                    <button
                      onClick={() => handleToggleActive(ev)}
                      className="text-xs text-[var(--green)] hover:underline font-semibold"
                    >
                      {ev.is_active ? "Deactivate" : "Set Active"}
                    </button>
                  </div>

                  <h3 className="font-serif text-2xl text-[var(--ink)] font-normal mb-2">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-4">
                    {ev.description}
                  </p>

                  <div className="space-y-2 text-xs text-gray-600 bg-[#fcfaf5] p-3.5 rounded-lg border border-gray-100 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[var(--gold)] shrink-0" />
                      <span>{ev.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[var(--gold)] shrink-0" />
                      <span>
                        {formatDateCH(ev.start_date)} – {formatDateCH(ev.end_date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[var(--gold)] shrink-0" />
                      <span>
                        <strong>{regCount}</strong> registered / {ev.max_participants} max capacity ({pct}%)
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden mb-4">
                    <div
                      className="bg-[var(--gold)] h-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs">
                  <span className="text-gray-400 font-mono text-[0.7rem]">
                    slug: /{ev.slug}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(ev)}
                      className="inline-flex items-center gap-1 text-gray-600 hover:text-[var(--ink)] px-2.5 py-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors font-medium"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(ev.id, ev.title)}
                      className="p-1.5 text-gray-400 hover:text-[var(--red)] transition-colors rounded hover:bg-rose-50"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 py-12 text-center text-gray-400">
            No events found. Click &quot;Create Event&quot; to add your first festival fixture.
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <div>
                <span className="text-[var(--gold)] text-[0.68rem] uppercase tracking-widest font-bold block">
                  {editingEvent ? "MODIFY FIXTURE" : "NEW FIXTURE"}
                </span>
                <h3 className="font-serif text-xl font-normal text-[var(--ink)]">
                  {editingEvent ? "Edit Event" : "Create Event"}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)+/g, "");
                    setFormData({
                      ...formData,
                      title,
                      ...(editingEvent ? {} : { slug }),
                    });
                  }}
                  placeholder="e.g. Gstaad Cricket Festival 2026"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[var(--green)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="gstaad-cricket-festival-2026"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[var(--green)] font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Details regarding the match, schedule, hospitality, and rules..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[var(--green)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Sportzentrum Gstaad, Switzerland"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[var(--green)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Start Date &amp; Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[var(--green)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                    End Date &amp; Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.end_date}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[var(--green)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Max Capacity (Guests) *
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={5000}
                    required
                    value={formData.max_participants}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        max_participants: parseInt(e.target.value) || 250,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[var(--green)]"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold uppercase tracking-wider text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData({ ...formData, is_active: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-[var(--gold)] accent-[var(--gold)]"
                    />
                    <span>Set as Active Event</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold uppercase text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 bg-[var(--gold)] text-[var(--green-dark)] hover:bg-[var(--gold-hover)] rounded-md text-xs font-bold uppercase tracking-wider shadow-xs"
                >
                  {isPending ? "Saving..." : editingEvent ? "Save Changes" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
