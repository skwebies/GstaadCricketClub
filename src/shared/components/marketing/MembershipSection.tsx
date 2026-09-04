"use client";

/**
 * @file MembershipSection.tsx
 * @description Membership section (#membership) with 4-tier comparison grid and
 * interactive application modal connected to applyForMembershipAction with Sonner toasts.
 * @module shared/components/marketing
 */

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Check, ArrowRight, X, Loader2, Sparkles, UserCheck } from "lucide-react";
import { applyForMembershipAction } from "@/application/actions/member.actions";
import { MemberMutationSchema, type MemberMutationInput } from "@/lib/validators/member-mutation.schema";

interface TierConfig {
  id: string;
  name: string;
  priceCHF: number;
  period: string;
  popular?: boolean;
  desc: string;
  benefits: string[];
}

const MEMBERSHIP_TIERS: TierConfig[] = [
  {
    id: "full-playing",
    name: "Full Playing Member",
    priceCHF: 350,
    period: "per annum",
    popular: true,
    desc: "For active adult cricketers participating in competitive fixtures, regular net practices, and league matches.",
    benefits: [
      "Full eligibility for all Swiss league and friendly fixtures",
      "Weekly summer outdoor training sessions with coaching",
      "Official Gstaad Cricket Club playing cap & embroidered crest",
      "Voting rights at the Annual General Meeting (AGM)",
      "Exclusive invitation to the Annual Alpine Gala Dinner",
    ],
  },
  {
    id: "social",
    name: "Social Member",
    priceCHF: 150,
    period: "per annum",
    desc: "For cricket supporters, local residents, and friends of the club who enjoy the social and festival atmosphere.",
    benefits: [
      "Access to all club social gatherings, BBQs, and matchdays",
      "Invitation to the Annual Alpine Gala Dinner",
      "Club newsletter and match reports subscription",
      "Guest access to the members marquee at the Alpine Trophy",
    ],
  },
  {
    id: "junior",
    name: "Junior Alpine Member",
    priceCHF: 80,
    period: "per annum",
    desc: "Designed for children and youth under 18 wishing to develop cricketing skills and sportsmanship in Saanenland.",
    benefits: [
      "All weekend junior academy training clinics and coaching",
      "Participation in youth festivals and soft-ball matches",
      "Club junior training kit and cricket handbook",
      "Parent spectator pass for all tournament matches",
    ],
  },
  {
    id: "patron",
    name: "Royal / Honorary Patron",
    priceCHF: 1000,
    period: "per annum",
    desc: "For philanthropic patrons supporting youth equipment, pitch maintenance, and the long-term growth of cricket in Gstaad.",
    benefits: [
      "Lifetime recognition on the official Club Heritage Board",
      "VIP Hospitality marquee access for patron and 3 guests",
      "Complimentary tickets to the Annual Alpine Gala Dinner",
      "Direct consultation on club youth development initiatives",
      "Exclusive bespoke gold-embroidered blazer crest",
    ],
  },
];

export function MembershipSection() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState<MemberMutationInput>({
    fullName: "",
    email: "",
    phone: "",
    tier: "Full Playing Member",
    handicapOrExperience: "",
    notes: "",
    status: "pending",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOpenModal = (tierName: string) => {
    setSelectedTier(tierName);
    setFormData((prev) => ({ ...prev, tier: tierName as any }));
    setErrors({});
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = MemberMutationSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      const issues = validation.error.issues || (validation.error as any).errors || [];
      issues.forEach((err: any) => {
        const path = (err.path?.[0] || "general") as string;
        fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      toast.error("Please fill in all required membership fields.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await applyForMembershipAction(formData);

        if (!result.success) {
          toast.error(result.error || "Could not submit application.");
          return;
        }

        toast.success(result.message || "Membership application submitted!");
        setSelectedTier(null);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          tier: "Full Playing Member",
          handicapOrExperience: "",
          notes: "",
          status: "pending",
        });
      } catch {
        toast.error("An unexpected error occurred. Please try again.");
      }
    });
  };

  const fieldName = (path: string) => path;

  return (
    <section
      id="membership"
      className="py-24 px-6 md:px-12 bg-[#FDFCF7] border-t border-[var(--border)]"
      aria-label="Membership Tiers"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="section-kicker">JOIN OUR TRADITION</span>
          <h2 className="font-serif text-3xl md:text-5xl text-[var(--ink)] font-normal">
            Club Membership{" "}
            <em className="text-[var(--gold)] italic">Tiers &amp; Patrons.</em>
          </h2>
          <p className="text-[var(--muted)] text-base md:text-lg leading-relaxed font-serif">
            Become a part of Switzerland&apos;s most distinguished alpine cricket family.
            From competitive players to social supporters and philanthropic patrons.
          </p>
        </div>

        {/* 4-Tier Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {MEMBERSHIP_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-200 ${
                tier.popular
                  ? "bg-[var(--green)] text-white shadow-xl ring-2 ring-[var(--gold)]"
                  : "bg-white text-[var(--ink)] border border-[var(--border)] shadow-xs hover:shadow-md"
              }`}
            >
              <div className="space-y-6">
                {/* Header info */}
                <div className="space-y-2">
                  {tier.popular && (
                    <span className="inline-flex items-center gap-1 text-[0.65rem] font-extrabold uppercase tracking-widest text-[var(--gold)] bg-white/10 px-2.5 py-0.5 rounded-full">
                      <Sparkles className="w-3 h-3" />
                      <span>Most Popular</span>
                    </span>
                  )}
                  <h3 className={`font-serif text-2xl font-normal ${tier.popular ? "text-white" : "text-[var(--ink)]"}`}>
                    {tier.name}
                  </h3>
                  <p className={`text-xs leading-relaxed ${tier.popular ? "text-[#cfcac0]" : "text-[var(--muted)]"}`}>
                    {tier.desc}
                  </p>
                </div>

                {/* Pricing */}
                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--gold)]">CHF</span>
                    <span className="font-serif text-4xl font-normal">{tier.priceCHF}</span>
                  </div>
                  <span className={`text-[0.7rem] uppercase font-bold tracking-wider ${tier.popular ? "text-[#a8a49a]" : "text-gray-400"}`}>
                    {tier.period}
                  </span>
                </div>

                {/* Benefits list */}
                <div className="pt-4 border-t border-current/10 space-y-3">
                  <span className="text-[0.68rem] font-bold uppercase tracking-wider text-[var(--gold)] block">
                    Included Privileges:
                  </span>
                  <ul className="space-y-2.5 text-xs">
                    {tier.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[var(--gold)] shrink-0 mt-0.5" />
                        <span className={tier.popular ? "text-[#e5e0d5]" : "text-[var(--muted)]"}>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <button
                  onClick={() => handleOpenModal(tier.name)}
                  className={`w-full py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    tier.popular
                      ? "bg-[var(--gold)] text-[var(--green-dark)] hover:bg-[var(--gold-hover)] shadow-md"
                      : "bg-[#0F382A] text-white hover:bg-[#164E3A]"
                  }`}
                >
                  <span>Apply for Membership</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Application Modal */}
      {selectedTier && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-gray-200 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div>
                <span className="text-[var(--gold)] text-xs font-bold uppercase tracking-widest block">
                  MEMBERSHIP APPLICATION
                </span>
                <h3 className="font-serif text-2xl font-normal text-[var(--ink)]">
                  {selectedTier}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTier(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md"
                aria-label="Close application dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitApplication} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Beatrix von Graffenried"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FDFCF7] text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--green)]"
                />
                {errors.fullName && <p className="text-xs text-rose-600 mt-1">{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.ch"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FDFCF7] text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--green)]"
                  />
                  {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+41 79 123 45 67"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FDFCF7] text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--green)]"
                  />
                  {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Cricket Background / Handicap (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Former club batsman, social player, junior beginner"
                  value={formData.handicapOrExperience || ""}
                  onChange={(e) => setFormData({ ...formData, handicapOrExperience: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FDFCF7] text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--green)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Message or Notes for the Committee
                </label>
                <textarea
                  rows={2}
                  placeholder="Any particular interests, availability, or questions..."
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FDFCF7] text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--green)]"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedTier(null)}
                  className="px-4 py-2.5 text-xs font-bold uppercase text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--gold)] text-[var(--green-dark)] hover:bg-[var(--gold-hover)] font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
