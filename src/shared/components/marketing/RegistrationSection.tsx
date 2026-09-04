"use client";

/**
 * @file RegistrationSection.tsx
 * @description Interactive event registration section (#register) for Gstaad Cricket Club.
 * Executes live Zod schema validation, honeypot anti-spam verification, calls the
 * registerForEventAction server action, and triggers real-time Sonner toast notifications.
 * @module shared/components/marketing
 */

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Calendar,
  User,
  Mail,
  Phone,
  Shield,
  Utensils,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { registerForEventAction } from "@/application/actions/registration.actions";
import { EventRegistrationSchema, type EventRegistrationInput } from "@/lib/validators/event-registration.schema";

interface EventOption {
  id: string;
  title: string;
}

interface RegistrationSectionProps {
  events?: EventOption[];
}

export function RegistrationSection({ events = [] }: RegistrationSectionProps) {
  const [isPending, startTransition] = useTransition();
  const [successData, setSuccessData] = useState<{
    fullName: string;
    eventTitle: string;
    registrationType: string;
  } | null>(null);

  const [formData, setFormData] = useState<EventRegistrationInput>({
    eventId: events.length > 0 ? events[0].id : undefined,
    eventSlug: "gstaad-cricket-festival-2026",
    fullName: "",
    email: "",
    phone: "",
    registrationType: "playing_member",
    emergencyContact: "",
    dietaryRequirements: "",
    website: "", // Honeypot
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side Zod validation
    const validation = EventRegistrationSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      const issues = validation.error.issues || (validation.error as any).errors || [];
      issues.forEach((err: any) => {
        const fieldName = (err.path?.[0] || "general") as string;
        fieldErrors[fieldName] = err.message;
      });
      setErrors(fieldErrors);
      toast.error("Please resolve the highlighted form fields.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await registerForEventAction(formData);

        if (!result.success) {
          toast.error(result.error || "Registration could not be completed.");
          if (result.errors) {
            const mapped: Record<string, string> = {};
            Object.entries(result.errors).forEach(([k, msgs]) => {
              mapped[k] = msgs[0];
            });
            setErrors(mapped);
          }
          return;
        }

        toast.success(result.message || "Registration successfully confirmed!");
        setSuccessData({
          fullName: result.data.fullName,
          eventTitle: result.data.eventTitle,
          registrationType: result.data.registrationType,
        });

        // Reset form
        setFormData({
          eventId: events.length > 0 ? events[0].id : undefined,
          eventSlug: "gstaad-cricket-festival-2026",
          fullName: "",
          email: "",
          phone: "",
          registrationType: "playing_member",
          emergencyContact: "",
          dietaryRequirements: "",
          website: "",
        });
      } catch {
        toast.error("An unexpected network error occurred. Please try again.");
      }
    });
  };

  return (
    <section
      id="register"
      className="py-24 px-6 md:px-12 bg-[#F4EFDF]/40 border-t border-[var(--border)]"
      aria-label="Event Registration Form"
    >
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <span className="section-kicker">ADMISSION &amp; ENTRY</span>
          <h2 className="font-serif text-3xl md:text-5xl text-[var(--ink)] font-normal">
            Register for the{" "}
            <em className="text-[var(--gold)] italic">Gstaad Cricket Festival.</em>
          </h2>
          <p className="text-[var(--muted)] text-base max-w-xl mx-auto leading-relaxed">
            Attendance is free and open to everyone. Register in advance to secure tournament participation,
            complimentary access to youth coaching clinics, and hospitality arrangements.
          </p>
        </div>

        {/* Success Banner */}
        {successData ? (
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-emerald-200 shadow-lg text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--gold)]">
                REGISTRATION CONFIRMED
              </span>
              <h3 className="font-serif text-3xl text-[var(--ink)] font-normal">
                Grüezi, {successData.fullName}!
              </h3>
              <p className="text-sm text-[var(--muted)] max-w-md mx-auto">
                Your registration for <strong>{successData.eventTitle}</strong> as a{" "}
                <span className="capitalize font-semibold text-emerald-800">
                  {successData.registrationType.replace("_", " ")}
                </span>{" "}
                is confirmed in the club register.
              </p>
            </div>

            <button
              onClick={() => setSuccessData(null)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-[var(--gold)] text-[var(--green-dark)] font-bold text-xs uppercase tracking-wider"
            >
              <span>Register Another Attendee</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Registration Form Card */
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-[var(--border)] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--gold)] via-[var(--green)] to-[var(--gold)]" />

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Anti-spam honeypot (hidden from sighted users) */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Leave blank</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website || ""}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>

              {/* Event Selector (If multiple events exist) */}
              {events.length > 0 && (
                <div className="space-y-1.5">
                  <label htmlFor="eventId" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Select Event Fixture *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      id="eventId"
                      value={formData.eventId || ""}
                      onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-[#FDFCF7] text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--green)]"
                    >
                      {events.map((ev) => (
                        <option key={ev.id} value={ev.id}>
                          {ev.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      id="fullName"
                      required
                      placeholder="e.g. Maximilien von Berne"
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value });
                        if (errors.fullName) setErrors({ ...errors, fullName: "" });
                      }}
                      className={`w-full pl-10 pr-4 py-3 bg-[#FDFCF7] text-sm border rounded-lg focus:outline-none focus:border-[var(--green)] ${
                        errors.fullName ? "border-rose-400" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      id="email"
                      required
                      placeholder="name@domain.ch"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: "" });
                      }}
                      className={`w-full pl-10 pr-4 py-3 bg-[#FDFCF7] text-sm border rounded-lg focus:outline-none focus:border-[var(--green)] ${
                        errors.email ? "border-rose-400" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Phone & Registration Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Phone Number (Swiss / International) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      id="phone"
                      required
                      placeholder="+41 79 123 45 67"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (errors.phone) setErrors({ ...errors, phone: "" });
                      }}
                      className={`w-full pl-10 pr-4 py-3 bg-[#FDFCF7] text-sm border rounded-lg focus:outline-none focus:border-[var(--green)] ${
                        errors.phone ? "border-rose-400" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="registrationType" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Participation Type *
                  </label>
                  <select
                    id="registrationType"
                    value={formData.registrationType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        registrationType: e.target.value as "playing_member" | "spectator" | "vip_patron",
                      })
                    }
                    className="w-full px-4 py-3 bg-[#FDFCF7] text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--green)]"
                  >
                    <option value="playing_member">Player (Matches &amp; Clinics)</option>
                    <option value="spectator">Spectator / Community Guest</option>
                    <option value="vip_patron">VIP Patron / Sponsor Guest</option>
                  </select>
                </div>
              </div>

              {/* Emergency Contact & Dietary Requirements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label htmlFor="emergencyContact" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Emergency Contact Name &amp; Phone *
                  </label>
                  <div className="relative">
                    <Shield className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      id="emergencyContact"
                      required
                      placeholder="e.g. Maria von Berne (+41 79 987 65 43)"
                      value={formData.emergencyContact}
                      onChange={(e) => {
                        setFormData({ ...formData, emergencyContact: e.target.value });
                        if (errors.emergencyContact) setErrors({ ...errors, emergencyContact: "" });
                      }}
                      className={`w-full pl-10 pr-4 py-3 bg-[#FDFCF7] text-sm border rounded-lg focus:outline-none focus:border-[var(--green)] ${
                        errors.emergencyContact ? "border-rose-400" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.emergencyContact && (
                    <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.emergencyContact}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="dietaryRequirements" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Dietary Requirements (Optional)
                  </label>
                  <div className="relative">
                    <Utensils className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      id="dietaryRequirements"
                      placeholder="Vegetarian, Gluten-free, etc."
                      value={formData.dietaryRequirements || ""}
                      onChange={(e) => setFormData({ ...formData, dietaryRequirements: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-[#FDFCF7] text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--green)]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-gray-500">
                  🔒 Data processed in Switzerland in compliance with nFADP/DSG.
                </span>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[var(--gold)] hover:bg-[var(--gold-hover)] text-[var(--green-dark)] font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Confirming...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Free Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
