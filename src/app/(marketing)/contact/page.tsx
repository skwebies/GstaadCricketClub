"use client";

/**
 * @file contact/page.tsx
 * @description Trilingual Contact page with committee inquiry form and ground location.
 * @module app/(marketing)/contact
 */

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { CLUB_CONFIG } from "@/shared/config/club";
import { useLanguage } from "@/shared/i18n/LanguageContext";

export default function ContactPage() {
  const { dict } = useLanguage();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");

      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setError(err.message || dict.common.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--paper)]">
      <section className="inner-hero bg-[var(--green)] text-[var(--cream)] px-[8vw] pt-24 pb-28">
        <Link
          href="/"
          className="back-link inline-flex items-center gap-2.5 text-[#d8d3c5] hover:text-[var(--gold)] uppercase tracking-[0.12em] text-[0.78rem] font-bold mb-14 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{dict.nav.backToFestival}</span>
        </Link>

        <span className="section-kicker text-[var(--gold)] uppercase tracking-[0.23em] text-[0.78rem] font-extrabold mb-4 block">
          {dict.contactPage.kicker}
        </span>
        <h1 className="font-serif text-[clamp(3.5rem,7.5vw,7.5rem)] leading-[0.88] font-normal text-white mb-6">
          {dict.contactPage.title} <em className="text-[var(--gold)] italic">{dict.contactPage.titleEm}</em>
        </h1>
        <p className="text-[#e4dfd1] font-serif text-[1.35rem] leading-[1.55] max-w-2xl mt-8">
          {dict.contactPage.intro}
        </p>
      </section>

      <section className="py-24 px-[8vw] max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-16">
        <div className="space-y-8">
          <div>
            <h2 className="font-serif text-3xl text-[var(--ink)] mb-4">
              Club Administration
            </h2>
            <p className="text-[#5c6d66] text-sm leading-relaxed">
              Our committee meets regularly in Gstaad and is always delighted to assist prospective members, parents, and community partners.
            </p>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3.5 p-5 bg-white border border-[#e4decf]">
              <MapPin className="w-5 h-5 text-[var(--gold)] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[var(--ink)] font-serif text-base mb-1">
                  Home Ground &amp; Pitch
                </strong>
                <span className="text-[#5c6d66]">
                  Ebnit School Pitch, 3780 Gstaad, Switzerland
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-5 bg-white border border-[#e4decf]">
              <Mail className="w-5 h-5 text-[var(--gold)] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[var(--ink)] font-serif text-base mb-1">
                  Email Inquiries
                </strong>
                <span className="text-[#5c6d66]">{CLUB_CONFIG.contact.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 md:p-12 border-t-4 border-[var(--gold)] shadow-xl">
          {success ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 bg-[var(--green)]/10 text-[var(--green)] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-3xl text-[var(--green)]">
                {dict.contactPage.successMsg.split(".")[0]}
              </h3>
              <p className="text-[var(--muted)] max-w-md mx-auto leading-relaxed text-sm">
                {dict.contactPage.successMsg}
              </p>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--green)] font-extrabold hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-[var(--red)] text-[var(--red)] text-sm flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]">
                  {dict.registration.nameLabel}
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2 w-full bg-[#fdfcf8] border border-[#c9ccc8] min-h-[48px] px-4 text-base font-normal tracking-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                  />
                </label>

                <label className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]">
                  {dict.registration.emailLabel}
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-2 w-full bg-[#fdfcf8] border border-[#c9ccc8] min-h-[48px] px-4 text-base font-normal tracking-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                  />
                </label>
              </div>

              <label className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]">
                Subject
                <input
                  required
                  type="text"
                  placeholder="e.g. Festival inquiries, sponsorship, equipment donation"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="mt-2 w-full bg-[#fdfcf8] border border-[#c9ccc8] min-h-[48px] px-4 text-base font-normal tracking-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                />
              </label>

              <label className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]">
                {dict.registration.notesLabel}
                <textarea
                  required
                  rows={4}
                  placeholder="How can we help?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="mt-2 w-full bg-[#fdfcf8] border border-[#c9ccc8] p-4 text-base font-normal tracking-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)] resize-y"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="bg-[var(--gold)] text-[var(--green-dark)] hover:bg-[var(--gold-hover)] px-8 py-4 font-extrabold uppercase tracking-wider text-sm inline-flex items-center gap-3 transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{dict.contactPage.sendingBtn}</span>
                  </>
                ) : (
                  <>
                    <span>{dict.contactPage.sendBtn}</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
