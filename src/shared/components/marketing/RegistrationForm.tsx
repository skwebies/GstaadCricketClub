"use client";

/**
 * @file RegistrationForm.tsx
 * @description Localized festival attendee reservation form with validation,
 * instant submission to Supabase, error alerts, and trilingual support.
 * @module shared/components/marketing
 */

import { useState } from "react";
import { ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useLanguage } from "@/shared/i18n/LanguageContext";

export function RegistrationForm() {
  const { dict } = useLanguage();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    participantType: "Individual",
    partySize: 1,
    emergencyContact: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Map participant type to backend registration_type enum
      let registrationType = "spectator";
      if (formData.participantType === "Individual" || formData.participantType === "Group") {
        registrationType = "playing_member";
      } else if (formData.participantType === "VIP Patron") {
        registrationType = "vip_patron";
      }

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone || "+41 00 000 00 00",
          registrationType,
          partySize: Number(formData.partySize) || 1,
          emergencyContact: formData.emergencyContact || formData.phone || "Self / Attendee",
          dietaryRequirements: formData.message || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to register. Please try again.");
      }

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        participantType: "Individual",
        partySize: 1,
        emergencyContact: "",
        message: "",
      });
    } catch (err: any) {
      setError(err.message || dict.common.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 md:p-12 shadow-[0_24px_60px_#14302713] border-t-4 border-[var(--gold)] max-w-2xl w-full"
    >
      {success ? (
        <div className="py-10 text-center space-y-4">
          <div className="w-16 h-16 bg-[var(--green)]/10 text-[var(--green)] rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="font-serif text-3xl text-[var(--green)]">
            {dict.registration.successTitle}
          </h3>
          <p className="text-[var(--muted)] max-w-md mx-auto leading-relaxed">
            {dict.registration.successMsg}
          </p>
          <button
            type="button"
            onClick={() => setSuccess(false)}
            className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--green)] font-extrabold hover:underline"
          >
            {dict.registration.registerAnother}
          </button>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-[var(--red)] text-[var(--red)] text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <label className="block mb-5 text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]">
            {dict.registration.nameLabel}
            <input
              required
              type="text"
              name="name"
              placeholder={dict.registration.namePlaceholder}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-2 w-full bg-[#fdfcf8] border border-[#c9ccc8] min-h-[50px] px-4 text-base font-normal tracking-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <label className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]">
              {dict.registration.emailLabel}
              <input
                required
                type="email"
                name="email"
                placeholder={dict.registration.emailPlaceholder}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-2 w-full bg-[#fdfcf8] border border-[#c9ccc8] min-h-[50px] px-4 text-base font-normal tracking-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
              />
            </label>

            <label className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]">
              {dict.registration.phoneLabel}
              <input
                type="tel"
                name="phone"
                placeholder={dict.registration.phonePlaceholder}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-2 w-full bg-[#fdfcf8] border border-[#c9ccc8] min-h-[50px] px-4 text-base font-normal tracking-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <label className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]">
              {dict.registration.typeLabel}
              <select
                required
                name="participantType"
                value={formData.participantType}
                onChange={(e) => setFormData({ ...formData, participantType: e.target.value })}
                className="mt-2 w-full bg-[#fdfcf8] border border-[#c9ccc8] min-h-[50px] px-4 text-base font-normal tracking-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
              >
                <option value="Individual">{dict.registration.typeIndividual}</option>
                <option value="Family">{dict.registration.typeFamily}</option>
                <option value="Child with guardian">{dict.registration.typeChild}</option>
                <option value="Group">{dict.registration.typeGroup}</option>
              </select>
            </label>

            <label className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]">
              {dict.registration.partySizeLabel}
              <input
                required
                type="number"
                min="1"
                max="20"
                name="partySize"
                value={formData.partySize}
                onChange={(e) => setFormData({ ...formData, partySize: Number(e.target.value) })}
                className="mt-2 w-full bg-[#fdfcf8] border border-[#c9ccc8] min-h-[50px] px-4 text-base font-normal tracking-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
              />
            </label>
          </div>

          <label className="block mb-6 text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]">
            {dict.registration.notesLabel} <span className="font-normal text-[#7d8581] normal-case">{dict.registration.optional}</span>
            <textarea
              name="message"
              rows={3}
              placeholder={dict.registration.notesPlaceholder}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="mt-2 w-full bg-[#fdfcf8] border border-[#c9ccc8] p-4 text-base font-normal tracking-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)] resize-y"
            ></textarea>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-[var(--gold)] text-[var(--green-dark)] hover:bg-[var(--gold-hover)] px-8 py-4 font-extrabold uppercase tracking-wider text-sm flex items-center justify-center gap-3 transition-colors duration-200 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{dict.registration.submittingBtn}</span>
              </>
            ) : (
              <>
                <span>{dict.registration.submitBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </>
      )}
    </form>
  );
}
