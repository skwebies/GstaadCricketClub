"use client";

/**
 * @file ContactSection.tsx
 * @description Contact section (#contact) featuring an alpine location map card,
 * direct secretariat coordinates, and an interactive message form connected
 * to submitContactMessageAction with Sonner notifications.
 * @module shared/components/marketing
 */

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { MapPin, Mail, Phone, Clock, Send, Loader2, AlertCircle } from "lucide-react";
import { submitContactMessageAction } from "@/application/actions/contact.actions";
import { ContactMessageSchema, type ContactMessageInput } from "@/lib/validators/contact-message.schema";

export function ContactSection() {
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState<ContactMessageInput>({
    name: "",
    email: "",
    subject: "",
    message: "",
    company: "", // Honeypot field
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = ContactMessageSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      const issues = validation.error.issues || (validation.error as any).errors || [];
      issues.forEach((err: any) => {
        const path = (err.path?.[0] || "general") as string;
        fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      toast.error("Please fill in all required contact fields.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await submitContactMessageAction(formData);

        if (!result.success) {
          toast.error(result.error || "Failed to submit message.");
          return;
        }

        toast.success(result.message || "Your inquiry has been sent to the committee!");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          company: "",
        });
      } catch {
        toast.error("Network communication error. Please try again.");
      }
    });
  };

  return (
    <section
      id="contact"
      className="py-24 px-6 md:px-12 bg-white border-t border-[var(--border)]"
      aria-label="Contact Gstaad Cricket Club"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="section-kicker">GET IN TOUCH</span>
          <h2 className="font-serif text-3xl md:text-5xl text-[var(--ink)] font-normal">
            Connect with the{" "}
            <em className="text-[var(--gold)] italic">Club Secretariat.</em>
          </h2>
          <p className="text-[var(--muted)] text-base md:text-lg leading-relaxed font-serif">
            Whether inquiring about fixtures, junior coaching clinics, sponsorship marquee hospitality,
            or membership enrollment, our committee is delighted to assist you.
          </p>
        </div>

        {/* 2-Column Grid: Map & Info Card + Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Swiss Location Card & Details */}
          <div className="lg:col-span-5 space-y-6">
            {/* Map Card */}
            <div className="bg-[#FDFCF7] p-8 rounded-3xl border border-[var(--border)] shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-[var(--border)]">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[var(--green)] flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-normal text-[var(--ink)]">
                    Gstaad, Switzerland
                  </h3>
                  <span className="text-[0.68rem] text-[var(--gold)] uppercase tracking-wider font-bold">
                    Saanenland · Canton of Bern
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-xs text-[var(--muted)]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[var(--gold)] mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-[var(--ink)] block">Match Ground &amp; Venue:</strong>
                    <span>Ebnit School Grounds, Ebnitstrasse 28, 3780 Gstaad</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[var(--gold)] mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-[var(--ink)] block">Official Email:</strong>
                    <a href="mailto:info@gstaadcricketclub.ch" className="text-[var(--green)] hover:underline">
                      info@gstaadcricketclub.ch
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[var(--gold)] mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-[var(--ink)] block">Telephone / WhatsApp:</strong>
                    <a href="tel:+41793616644" className="text-[var(--green)] hover:underline">
                      +41 79 361 66 44
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[var(--gold)] mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-[var(--ink)] block">Secretariat Office Hours:</strong>
                    <span>Monday – Friday, 09:00 – 17:00 CEST</span>
                  </div>
                </div>
              </div>

              {/* Coordinates Badge */}
              <div className="bg-[#f4efdf] p-4 rounded-xl text-center border border-[#e2ddd0]">
                <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[var(--gold)] block">
                  ALPINES GEOLOCATION COORDINATES
                </span>
                <span className="font-mono text-xs text-[var(--ink)] font-semibold mt-0.5 block">
                  46° 28&apos; 28.6&quot; N · 7° 17&apos; 17.5&quot; E
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7 bg-[#FDFCF7] p-8 md:p-10 rounded-3xl border border-[var(--border)] shadow-xs">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Anti-spam honeypot */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="company">Leave blank</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  tabIndex={-1}
                  value={formData.company || ""}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    required
                    placeholder="e.g. Lord Alexander Hamilton"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: "" });
                    }}
                    className={`w-full px-4 py-3 bg-white text-sm border rounded-lg focus:outline-none focus:border-[var(--green)] ${
                      errors.name ? "border-rose-400" : "border-gray-300"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    required
                    placeholder="alexander@domain.ch"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    className={`w-full px-4 py-3 bg-white text-sm border rounded-lg focus:outline-none focus:border-[var(--green)] ${
                      errors.email ? "border-rose-400" : "border-gray-300"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-subject" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Subject *
                </label>
                <input
                  type="text"
                  id="contact-subject"
                  required
                  placeholder="e.g. Inquiring about Youth Academy Clinic or Sponsorship"
                  value={formData.subject}
                  onChange={(e) => {
                    setFormData({ ...formData, subject: e.target.value });
                    if (errors.subject) setErrors({ ...errors, subject: "" });
                  }}
                  className={`w-full px-4 py-3 bg-white text-sm border rounded-lg focus:outline-none focus:border-[var(--green)] ${
                    errors.subject ? "border-rose-400" : "border-gray-300"
                  }`}
                />
                {errors.subject && (
                  <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.subject}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  placeholder="How can our committee assist you?"
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (errors.message) setErrors({ ...errors, message: "" });
                  }}
                  className={`w-full px-4 py-3 bg-white text-sm border rounded-lg focus:outline-none focus:border-[var(--green)] ${
                    errors.message ? "border-rose-400" : "border-gray-300"
                  }`}
                />
                {errors.message && (
                  <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.message}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center justify-center gap-2.5 bg-[var(--gold)] hover:bg-[var(--gold-hover)] text-[var(--green-dark)] font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-lg shadow-md transition-all"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message to Committee</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
