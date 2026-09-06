"use client";

/**
 * @file membership/page.tsx
 * @description Trilingual Membership page with interactive package selection,
 * real-time form synchronization, client validation, toaster notifications,
 * database persistence to Admin Dashboard, and SMTP email confirmation.
 * @module app/(marketing)/membership
 */

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Users,
  User,
  GraduationCap,
  Send,
} from "lucide-react";
import { useLanguage } from "@/shared/i18n/LanguageContext";
import { useToast } from "@/shared/components/common/Toast";

type PackageId = "adult" | "family" | "junior";

function MembershipContent() {
  const { dict } = useLanguage();
  const { showToast } = useToast();
  const searchParams = useSearchParams();

  const [selectedPackage, setSelectedPackage] = useState<PackageId>("family");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    tier: "Family (CHF 200 / year)",
    handicapOrExperience: "",
    notes: "",
    botField: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const getPackageTierLabel = (pkgId: PackageId): string => {
    switch (pkgId) {
      case "adult":
        return `${dict.membership.adult} (${dict.membership.adultPrice} / ${dict.membership.perYear})`;
      case "family":
        return `${dict.membership.family} (${dict.membership.familyPrice} / ${dict.membership.perYear})`;
      case "junior":
        return `${dict.membership.junior} (${dict.membership.juniorPrice} / ${dict.membership.perYear})`;
    }
  };

  // Sync initial tier label on load or language switch
  useEffect(() => {
    const pkgParam = searchParams.get("package")?.toLowerCase() as PackageId;
    if (pkgParam && ["adult", "family", "junior"].includes(pkgParam)) {
      setSelectedPackage(pkgParam);
      setFormData((prev) => ({ ...prev, tier: getPackageTierLabel(pkgParam) }));
    } else {
      setFormData((prev) => ({ ...prev, tier: getPackageTierLabel(selectedPackage) }));
    }
  }, [searchParams, dict]);

  const handleSelectPackage = (pkgId: PackageId, shouldScroll = true) => {
    setSelectedPackage(pkgId);
    const label = getPackageTierLabel(pkgId);
    setFormData((prev) => ({ ...prev, tier: label }));

    if (shouldScroll) {
      const el = document.getElementById("application-form");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const validateField = (field: string, value: string): string | null => {
    switch (field) {
      case "fullName":
        if (!value.trim() || value.trim().length < 2) {
          return dict.contactPage.validationNameRequired || "Please enter your name (min 2 characters)";
        }
        return null;

      case "email":
        if (!value.trim()) {
          return dict.contactPage.validationEmailRequired || "Email address is required";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return dict.contactPage.validationEmailInvalid || "Please enter a valid email address";
        }
        return null;

      case "phone":
        if (!value.trim()) {
          return "Please enter your contact phone number";
        }
        if (value.trim().length < 6 || !/^[+0-9\s\-()]{6,25}$/.test(value.trim())) {
          return "Please enter a valid phone number (e.g. +41 79 123 45 67)";
        }
        return null;

      default:
        return null;
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, (formData as any)[field] || "");
    setErrors((prev) => {
      const updated = { ...prev };
      if (err) updated[field] = err;
      else delete updated[field];
      return updated;
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const err = validateField(field, value);
      setErrors((prev) => {
        const updated = { ...prev };
        if (err) updated[field] = err;
        else delete updated[field];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Full client-side validation
    const validationErrors: Record<string, string> = {};
    const nameErr = validateField("fullName", formData.fullName);
    if (nameErr) validationErrors.fullName = nameErr;

    const emailErr = validateField("email", formData.email);
    if (emailErr) validationErrors.email = emailErr;

    const phoneErr = validateField("phone", formData.phone);
    if (phoneErr) validationErrors.phone = phoneErr;

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched({ fullName: true, email: true, phone: true });
      showToast({
        type: "error",
        title: dict.contactPage.toastErrorTitle || "Validation Error",
        description: "Please check the highlighted fields and try submitting again.",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/members/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          packageId: selectedPackage,
          packageLabel: getPackageTierLabel(selectedPackage),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      setSuccess(true);
      showToast({
        type: "success",
        title: "Application Received",
        description: "Your membership application has been submitted to the club committee. A confirmation email has been sent to your address.",
      });

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        tier: getPackageTierLabel(selectedPackage),
        handicapOrExperience: "",
        notes: "",
        botField: "",
      });
      setTouched({});
      setErrors({});
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : dict.common.error;
      setServerError(msg);
      showToast({
        type: "error",
        title: "Submission Error",
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  const membershipTiers = [
    {
      id: "adult" as PackageId,
      title: dict.membership.adult,
      price: dict.membership.adultPrice,
      period: dict.membership.perYear,
      description: "Full voting rights and playing privileges.",
      icon: User,
      featured: false,
    },
    {
      id: "family" as PackageId,
      title: dict.membership.family,
      price: dict.membership.familyPrice,
      period: dict.membership.perYear,
      description: "Includes parents and all junior members under 18.",
      icon: Users,
      featured: true,
    },
    {
      id: "junior" as PackageId,
      title: dict.membership.junior,
      price: dict.membership.juniorPrice,
      period: dict.membership.perYear,
      description: "Coaching clinics, youth fixtures and match ball access.",
      icon: GraduationCap,
      featured: false,
    },
  ];

  return (
    <div className="bg-[var(--paper)]">
      {/* Inner Hero */}
      <section className="inner-hero bg-[var(--green)] text-[var(--cream)] px-[8vw] pt-24 pb-28">
        <Link
          href="/"
          className="back-link inline-flex items-center gap-2.5 text-[#d8d3c5] hover:text-[var(--gold)] uppercase tracking-[0.12em] text-[0.78rem] font-bold mb-14 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{dict.nav.backToFestival}</span>
        </Link>

        <span className="section-kicker text-[var(--gold)] uppercase tracking-[0.23em] text-[0.78rem] font-extrabold mb-4 block">
          {dict.membership.kicker}
        </span>
        <h1 className="font-serif text-[clamp(3.5rem,7.5vw,7.5rem)] leading-[0.88] font-normal text-white mb-6">
          {dict.membership.title} <em className="text-[var(--gold)] italic">{dict.membership.titleEm}</em>
        </h1>
        <p className="text-[#e4dfd1] font-serif text-[1.35rem] leading-[1.55] max-w-2xl mt-8">
          {dict.membership.intro}
        </p>
      </section>

      {/* Membership Tiers Overview (Clickable & Selectable) */}
      <section className="py-20 px-[6vw] max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16 items-stretch">
          {membershipTiers.map((tier) => {
            const isSelected = selectedPackage === tier.id;
            return (
              <div
                key={tier.id}
                onClick={() => handleSelectPackage(tier.id)}
                className={`p-7 lg:p-8 flex flex-col justify-between border transition-all cursor-pointer relative rounded-xs ${
                  isSelected
                    ? "bg-[var(--green)] text-white border-[var(--gold)] ring-2 ring-[var(--gold)] shadow-xl -translate-y-1.5"
                    : "bg-white text-[var(--ink)] border-[#e4decf] shadow-sm hover:border-[var(--gold)] hover:shadow-md"
                }`}
              >
                {isSelected ? (
                  <span className="absolute -top-3 right-6 bg-[var(--gold)] text-[var(--green-dark)] text-[0.68rem] font-extrabold tracking-widest uppercase px-3 py-1 shadow-sm flex items-center gap-1.5 rounded-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" /> Selected Package
                  </span>
                ) : tier.featured ? (
                  <span className="absolute -top-3 right-6 bg-[#FAF7F0] text-[#716854] border border-[#dcd4c1] text-[0.65rem] font-bold tracking-widest uppercase px-2.5 py-0.5 shadow-2xs rounded-xs">
                    Popular Tier
                  </span>
                ) : null}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs uppercase font-extrabold tracking-widest block ${
                        isSelected ? "text-[var(--gold)]" : "text-[#716854]"
                      }`}
                    >
                      {tier.title}
                    </span>
                    <tier.icon
                      className={`w-5 h-5 ${
                        isSelected ? "text-[var(--gold)]" : "text-[#82785f]"
                      }`}
                    />
                  </div>

                  <strong className="font-serif text-4xl block mb-1">
                    <span className={isSelected ? "text-white" : "text-[var(--ink)]"}>
                      {tier.price}
                    </span>
                    <span
                      className={`font-sans text-xs font-normal ml-2 ${
                        isSelected ? "text-[#d8d4c7]" : "text-gray-500"
                      }`}
                    >
                      / {tier.period}
                    </span>
                  </strong>
                  <p
                    className={`text-sm my-4 leading-relaxed min-h-[44px] ${
                      isSelected ? "text-[#d8d4c7]" : "text-gray-600"
                    }`}
                  >
                    {tier.description}
                  </p>
                </div>

                <div
                  className={`border-t pt-5 mt-4 space-y-2.5 text-sm ${
                    isSelected ? "border-white/20 text-[#e4dfd1]" : "border-gray-200 text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Check
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? "text-[var(--gold)]" : "text-[var(--green)]"
                      }`}
                    />
                    <span>{dict.membership.benefit1}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? "text-[var(--gold)]" : "text-[var(--green)]"
                      }`}
                    />
                    <span>{dict.membership.benefit2}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? "text-[var(--gold)]" : "text-[var(--green)]"
                      }`}
                    />
                    <span>{dict.membership.benefit3}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPackage(tier.id);
                  }}
                  className={`mt-7 w-full py-3.5 px-4 text-center text-xs uppercase tracking-widest font-extrabold block transition-colors cursor-pointer rounded-xs ${
                    isSelected
                      ? "bg-[var(--gold)] text-[var(--green-dark)] shadow-sm"
                      : "bg-[#FAF7F0] text-[var(--green)] hover:bg-[var(--gold)] hover:text-[var(--green-dark)] border border-[#dcd4c1]"
                  }`}
                >
                  {isSelected ? "Selected — Complete Details Below ↓" : `Choose ${tier.title} ↓`}
                </button>
              </div>
            );
          })}
        </div>

        {/* Application Form Section */}
        <div
          id="application-form"
          className="bg-white p-7 sm:p-10 md:p-14 border-t-4 border-[var(--gold)] shadow-xl max-w-4xl mx-auto scroll-mt-24"
        >
          <span className="section-kicker text-[var(--gold)] uppercase tracking-[0.23em] text-[0.78rem] font-extrabold mb-2 block">
            {dict.membership.kicker}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-[var(--ink)] mb-3 font-normal">
            {dict.membership.applyButton}
          </h2>
          <p className="text-[var(--muted)] mb-8 text-sm leading-relaxed">
            {dict.membership.contactNote} Applications are submitted directly to the committee, recorded in our dashboard, and confirmed by email.
          </p>

          {success ? (
            <div className="py-12 text-center space-y-5">
              <div className="w-16 h-16 bg-[var(--green)]/10 text-[var(--green)] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-3xl text-[var(--green)] font-normal">
                Application Received Successfully
              </h3>
              <p className="text-[var(--muted)] max-w-md mx-auto leading-relaxed text-sm">
                Thank you for applying to join Gstaad Cricket Club. A confirmation receipt has been sent to your email, and our membership committee will review your application shortly.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="inline-flex items-center gap-2 bg-[var(--paper)] border border-[#dcd4c1] px-5 py-2.5 text-xs uppercase tracking-widest text-[var(--green)] font-extrabold hover:border-[var(--gold)] transition-colors cursor-pointer"
                >
                  Submit another application
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Anti-spam invisible honeypot trap */}
              <div className="hidden" aria-hidden="true" style={{ display: "none" }}>
                <label htmlFor="member_bot_field">Leave this empty</label>
                <input
                  id="member_bot_field"
                  type="text"
                  name="bot_field"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.botField}
                  onChange={(e) => setFormData({ ...formData, botField: e.target.value })}
                />
              </div>

              {serverError && (
                <div className="p-4 bg-red-50 border-l-4 border-[var(--red)] text-[var(--red)] text-sm flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{serverError}</span>
                </div>
              )}

              {/* 1. Interactive Package Selector */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="block text-[0.74rem] uppercase font-extrabold tracking-[0.14em] text-[#716854]">
                    Select Membership Package <span className="text-[var(--red)]">*</span>
                  </label>
                  <span className="text-[0.72rem] text-[#82785f] font-semibold">
                    Click a tier to choose
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Adult */}
                  <button
                    type="button"
                    onClick={() => handleSelectPackage("adult", false)}
                    className={`p-4 border text-left rounded-xs transition-all cursor-pointer ${
                      selectedPackage === "adult"
                        ? "bg-[var(--green)] text-white border-[var(--gold)] ring-2 ring-[var(--gold)] shadow-sm"
                        : "bg-[#fdfcf8] text-[var(--ink)] border-[#dcd4c1] hover:border-[var(--gold)] hover:bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-baseline mb-1">
                      <strong className="text-xs font-bold uppercase tracking-wider">
                        {dict.membership.adult}
                      </strong>
                      <span
                        className={`text-xs font-extrabold ${
                          selectedPackage === "adult" ? "text-[var(--gold)]" : "text-[var(--green)]"
                        }`}
                      >
                        {dict.membership.adultPrice}
                      </span>
                    </div>
                    <p
                      className={`text-[0.72rem] leading-snug ${
                        selectedPackage === "adult" ? "text-[#d8d4c7]" : "text-[#716854]"
                      }`}
                    >
                      Full voting rights &amp; playing privileges
                    </p>
                  </button>

                  {/* Family */}
                  <button
                    type="button"
                    onClick={() => handleSelectPackage("family", false)}
                    className={`p-4 border text-left rounded-xs transition-all cursor-pointer ${
                      selectedPackage === "family"
                        ? "bg-[var(--green)] text-white border-[var(--gold)] ring-2 ring-[var(--gold)] shadow-sm"
                        : "bg-[#fdfcf8] text-[var(--ink)] border-[#dcd4c1] hover:border-[var(--gold)] hover:bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-baseline mb-1">
                      <strong className="text-xs font-bold uppercase tracking-wider">
                        {dict.membership.family}
                      </strong>
                      <span
                        className={`text-xs font-extrabold ${
                          selectedPackage === "family" ? "text-[var(--gold)]" : "text-[var(--green)]"
                        }`}
                      >
                        {dict.membership.familyPrice}
                      </span>
                    </div>
                    <p
                      className={`text-[0.72rem] leading-snug ${
                        selectedPackage === "family" ? "text-[#d8d4c7]" : "text-[#716854]"
                      }`}
                    >
                      Parents &amp; all junior members under 18
                    </p>
                  </button>

                  {/* Junior */}
                  <button
                    type="button"
                    onClick={() => handleSelectPackage("junior", false)}
                    className={`p-4 border text-left rounded-xs transition-all cursor-pointer ${
                      selectedPackage === "junior"
                        ? "bg-[var(--green)] text-white border-[var(--gold)] ring-2 ring-[var(--gold)] shadow-sm"
                        : "bg-[#fdfcf8] text-[var(--ink)] border-[#dcd4c1] hover:border-[var(--gold)] hover:bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-baseline mb-1">
                      <strong className="text-xs font-bold uppercase tracking-wider">
                        {dict.membership.junior}
                      </strong>
                      <span
                        className={`text-xs font-extrabold ${
                          selectedPackage === "junior" ? "text-[var(--gold)]" : "text-[var(--green)]"
                        }`}
                      >
                        {dict.membership.juniorPrice}
                      </span>
                    </div>
                    <p
                      className={`text-[0.72rem] leading-snug ${
                        selectedPackage === "junior" ? "text-[#d8d4c7]" : "text-[#716854]"
                      }`}
                    >
                      Coaching clinics, youth fixtures &amp; kit
                    </p>
                  </button>
                </div>
              </div>

              {/* 2. Applicant Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]">
                    {dict.registration.nameLabel} <span className="text-[var(--red)]">*</span>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Alexander von Siebenthal"
                      value={formData.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      onBlur={() => handleBlur("fullName")}
                      className={`mt-2 w-full bg-[#fdfcf8] border min-h-[48px] px-4 text-base font-normal tracking-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)] ${
                        touched.fullName && errors.fullName
                          ? "border-[var(--red)] ring-1 ring-[var(--red)]"
                          : "border-[#c9ccc8]"
                      }`}
                    />
                  </label>
                  {touched.fullName && errors.fullName && (
                    <p className="mt-1 text-xs text-[var(--red)] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]">
                    {dict.registration.emailLabel} <span className="text-[var(--red)]">*</span>
                    <input
                      required
                      type="email"
                      placeholder="e.g. alexander@gstaad.ch"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      className={`mt-2 w-full bg-[#fdfcf8] border min-h-[48px] px-4 text-base font-normal tracking-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)] ${
                        touched.email && errors.email
                          ? "border-[var(--red)] ring-1 ring-[var(--red)]"
                          : "border-[#c9ccc8]"
                      }`}
                    />
                  </label>
                  {touched.email && errors.email && (
                    <p className="mt-1 text-xs text-[var(--red)] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* 3. Phone & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]">
                    {dict.registration.phoneLabel} <span className="text-[var(--red)]">*</span>
                    <input
                      required
                      type="tel"
                      placeholder="e.g. +41 79 123 45 67"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      onBlur={() => handleBlur("phone")}
                      className={`mt-2 w-full bg-[#fdfcf8] border min-h-[48px] px-4 text-base font-normal tracking-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)] ${
                        touched.phone && errors.phone
                          ? "border-[var(--red)] ring-1 ring-[var(--red)]"
                          : "border-[#c9ccc8]"
                      }`}
                    />
                  </label>
                  {touched.phone && errors.phone && (
                    <p className="mt-1 text-xs text-[var(--red)] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]">
                    Cricket Experience / Playing Level <span className="text-gray-400 font-normal lowercase">(optional)</span>
                    <input
                      type="text"
                      placeholder="e.g. Beginner, Club player, Youth training"
                      value={formData.handicapOrExperience}
                      onChange={(e) => handleChange("handicapOrExperience", e.target.value)}
                      className="mt-2 w-full bg-[#fdfcf8] border border-[#c9ccc8] min-h-[48px] px-4 text-base font-normal tracking-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                    />
                  </label>
                </div>
              </div>

              {/* 4. Notes & Family details */}
              <div>
                <label className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]">
                  {dict.registration.notesLabel} <span className="font-normal text-[#7d8581] normal-case">{dict.registration.optional}</span>
                  <textarea
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    placeholder="If applying for a Family membership, please list spouse and children names/ages, or add any notes for the committee..."
                    className="mt-2 w-full bg-[#fdfcf8] border border-[#c9ccc8] p-4 text-base font-normal tracking-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)] resize-y"
                  />
                </label>
              </div>

              {/* 5. Submit Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[var(--gold)] text-[var(--green-dark)] hover:bg-[var(--gold-hover)] px-8 py-4 font-extrabold uppercase tracking-wider text-sm inline-flex items-center gap-3 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{dict.common.loading}</span>
                    </>
                  ) : (
                    <>
                      <span>{dict.membership.applyButton}</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                <span className="text-xs text-gray-500 italic">
                  All inquiries are kept confidential and answered by committee members.
                </span>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

export default function MembershipPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[var(--paper)] min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--gold)]" />
        </div>
      }
    >
      <MembershipContent />
    </Suspense>
  );
}
