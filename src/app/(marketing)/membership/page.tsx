"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { CLUB_CONFIG } from "@/shared/config/club";

export default function MembershipPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    tier: "Full Playing",
    handicapOrExperience: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/members/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit application");

      setSuccess(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        tier: "Full Playing",
        handicapOrExperience: "",
        notes: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to submit application");
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
          <span>Back to home</span>
        </Link>

        <span className="section-kicker text-[var(--gold)] uppercase tracking-[0.23em] text-[0.78rem] font-extrabold mb-4 block">
          MEMBERSHIP
        </span>
        <h1 className="font-serif text-[clamp(3.5rem,7.5vw,7.5rem)] leading-[0.88] font-normal text-white mb-6">
          Join <em className="text-[var(--gold)] italic">the club.</em>
        </h1>
        <p className="text-[#e4dfd1] font-serif text-[1.35rem] leading-[1.55] max-w-2xl mt-8">
          Support the development of community cricket in the Bernese Oberland and enjoy club fixtures, coaching sessions, and social events.
        </p>
      </section>

      {/* Membership Tiers Overview */}
      <section className="py-20 px-[8vw] max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {CLUB_CONFIG.membershipTiers.map((tier) => (
            <div
              key={tier.id}
              className={`p-8 flex flex-col justify-between border ${
                tier.featured
                  ? "bg-[var(--green)] text-[var(--cream)] border-[var(--gold)] shadow-xl relative"
                  : "bg-white text-[var(--ink)] border-[#e4decf] shadow-sm"
              }`}
            >
              {tier.featured && (
                <span className="absolute -top-3 right-6 bg-[var(--gold)] text-[var(--green-dark)] text-[0.68rem] font-extrabold tracking-widest uppercase px-3 py-1">
                  Most Popular
                </span>
              )}
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest block mb-2 text-[var(--gold)]">
                  {tier.title}
                </span>
                <strong className="font-serif text-4xl block mb-1">
                  CHF {tier.price}
                  <span className="font-sans text-xs font-normal ml-2 opacity-80">
                    / year
                  </span>
                </strong>
                <p className="text-sm opacity-90 my-4 leading-relaxed">
                  {tier.description}
                </p>
              </div>

              <div className="border-t border-current/15 pt-6 mt-6 space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[var(--gold)] shrink-0" />
                  <span>Annual General Meeting voting rights</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[var(--gold)] shrink-0" />
                  <span>Invitation to Annual Gala Dinner</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[var(--gold)] shrink-0" />
                  <span>Access to all Club festival events</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Application Form */}
        <div className="bg-white p-8 md:p-14 border-t-4 border-[var(--gold)] shadow-xl max-w-3xl mx-auto">
          <span className="section-kicker text-[var(--gold)] uppercase tracking-[0.23em] text-[0.78rem] font-extrabold mb-3 block">
            ONLINE APPLICATION
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-[var(--ink)] mb-4 font-normal">
            Apply for Club Membership
          </h2>
          <p className="text-[var(--muted)] mb-8 text-sm leading-relaxed">
            Please fill in your details below. Once received, the committee will review your application and send membership confirmation and payment details.
          </p>

          {success ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 bg-[var(--green)]/10 text-[var(--green)] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-3xl text-[var(--green)]">
                Application Received
              </h3>
              <p className="text-[var(--muted)] max-w-md mx-auto leading-relaxed text-sm">
                Thank you for applying to join the Gstaad Cricket Club! Our Secretary will contact you with welcome documentation and membership details.
              </p>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--green)] font-extrabold hover:underline"
              >
                Submit another application
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
                  Full Name
                  <input
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="mt-2 w-full bg-[#fdfcf8] border border-[#c9ccc8] min-h-[48px] px-4 text-base font-normal tracking-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                  />
                </label>

                <label className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]">
                  Email Address
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-2 w-full bg-[#fdfcf8] border border-[#c9ccc8] min-h-[48px] px-4 text-base font-normal tracking-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]">
                  Phone Number
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-2 w-full bg-[#fdfcf8] border border-[#c9ccc8] min-h-[48px] px-4 text-base font-normal tracking-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                  />
                </label>

                <label className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]">
                  Membership Tier
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                    className="mt-2 w-full bg-[#fdfcf8] border border-[#c9ccc8] min-h-[48px] px-4 text-base font-normal tracking-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                  >
                    <option value="Full Playing">Full Playing (CHF 100/yr)</option>
                    <option value="Social Member">Social / Family Member (CHF 200/yr)</option>
                    <option value="Junior">Junior under 18 (CHF 50/yr)</option>
                    <option value="Patron">Club Patron / Benefactor</option>
                  </select>
                </label>
              </div>

              <label className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]">
                Cricket Experience or Handicap <span className="font-normal text-[#7d8581] normal-case">(optional)</span>
                <input
                  type="text"
                  placeholder="e.g. beginner, former club batsman, wicket-keeper"
                  value={formData.handicapOrExperience}
                  onChange={(e) => setFormData({ ...formData, handicapOrExperience: e.target.value })}
                  className="mt-2 w-full bg-[#fdfcf8] border border-[#c9ccc8] min-h-[48px] px-4 text-base font-normal tracking-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                />
              </label>

              <label className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]">
                Additional Notes <span className="font-normal text-[#7d8581] normal-case">(optional)</span>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-2 w-full bg-[#fdfcf8] border border-[#c9ccc8] p-4 text-base font-normal tracking-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
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
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <span>Submit Membership Application</span>
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
