"use client";

/**
 * @file contact/page.tsx
 * @description Trilingual Contact page with committee inquiry form, category selection
 * (Founding Sponsors, Community Donors, Club Membership, General), package selector,
 * client & server validation, toaster notifications, and ground location.
 * @module app/(marketing)/contact
 */

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  HandHeart,
  Sparkles,
  MessageSquare,
  Building2,
  Phone,
  UserCheck,
} from "lucide-react";
import { CLUB_CONFIG } from "@/shared/config/club";
import { useLanguage } from "@/shared/i18n/LanguageContext";
import { useToast } from "@/shared/components/common/Toast";

type InquiryCategory = "sponsor" | "donor" | "membership" | "general";
type MembershipPackageTier = "adult" | "family" | "junior" | "";

function ContactForm() {
  const { dict } = useLanguage();
  const { showToast } = useToast();
  const searchParams = useSearchParams();

  const [inquiryType, setInquiryType] = useState<InquiryCategory>("general");
  const [membershipPackage, setMembershipPackage] = useState<MembershipPackageTier>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    subject: "",
    message: "",
    botField: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Initialize inquiry type and default subject from URL search params
  useEffect(() => {
    const typeParam = searchParams.get("type");
    const packageParam = searchParams.get("package")?.toLowerCase() as MembershipPackageTier;

    if (packageParam && ["adult", "family", "junior"].includes(packageParam)) {
      setInquiryType("membership");
      setMembershipPackage(packageParam);
      const pkgLabel =
        packageParam === "adult"
          ? "Adult Tier (CHF 100/yr)"
          : packageParam === "family"
          ? "Family Tier (CHF 200/yr)"
          : "Junior Tier (CHF 50/yr)";
      setFormData((prev) => ({
        ...prev,
        subject: `Membership Application - ${pkgLabel}`,
      }));
    } else if (typeParam === "membership") {
      setInquiryType("membership");
      setMembershipPackage("family");
      setFormData((prev) => ({
        ...prev,
        subject: prev.subject || "Membership Application - Family Tier (CHF 200/yr)",
      }));
    } else if (typeParam === "sponsor") {
      setInquiryType("sponsor");
      setFormData((prev) => ({
        ...prev,
        subject: prev.subject || "Founding Sponsorship & Partnership Inquiry",
      }));
    } else if (typeParam === "donor") {
      setInquiryType("donor");
      setFormData((prev) => ({
        ...prev,
        subject: prev.subject || "Community Donation & Patronage Inquiry",
      }));
    } else if (typeParam === "support") {
      setInquiryType("sponsor");
      setFormData((prev) => ({
        ...prev,
        subject: prev.subject || "Club Support & Partnership Inquiry",
      }));
    }
  }, [searchParams]);

  const handleCategorySelect = (type: InquiryCategory) => {
    setInquiryType(type);
    if (type === "sponsor") {
      setFormData((prev) => ({ ...prev, subject: "Founding Sponsorship & Partnership Inquiry" }));
    } else if (type === "donor") {
      setFormData((prev) => ({ ...prev, subject: "Community Donation & Patronage Inquiry" }));
    } else if (type === "membership") {
      const pkg = membershipPackage || "family";
      setMembershipPackage(pkg);
      const pkgLabel =
        pkg === "adult"
          ? "Adult Tier (CHF 100/yr)"
          : pkg === "family"
          ? "Family Tier (CHF 200/yr)"
          : "Junior Tier (CHF 50/yr)";
      setFormData((prev) => ({ ...prev, subject: `Membership Application - ${pkgLabel}` }));
    } else {
      setFormData((prev) => ({ ...prev, subject: "" }));
    }
  };

  const handlePackageSelect = (pkg: MembershipPackageTier) => {
    setMembershipPackage(pkg);
    const pkgLabel =
      pkg === "adult"
        ? "Adult Tier (CHF 100/yr)"
        : pkg === "family"
        ? "Family Tier (CHF 200/yr)"
        : "Junior Tier (CHF 50/yr)";
    setFormData((prev) => ({
      ...prev,
      subject: `Membership Application - ${pkgLabel}`,
    }));
  };

  const validateField = (field: string, value: string): string | null => {
    switch (field) {
      case "name":
        if (!value.trim() || value.trim().length < 2) {
          return dict.contactPage.validationNameRequired;
        }
        return null;

      case "email":
        if (!value.trim()) {
          return dict.contactPage.validationEmailRequired;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return dict.contactPage.validationEmailInvalid;
        }
        return null;

      case "phone":
        if (value.trim() && !/^[+0-9\s\-()]{6,25}$/.test(value.trim())) {
          return "Please enter a valid phone number (e.g. +41 79 123 45 67)";
        }
        return null;

      case "subject":
        if (!value.trim() || value.trim().length < 3) {
          return dict.contactPage.validationSubjectRequired;
        }
        return null;

      case "message":
        if (!value.trim()) {
          return dict.contactPage.validationMessageRequired;
        }
        if (value.trim().length < 10) {
          return dict.contactPage.validationMessageMin;
        }
        return null;

      default:
        return null;
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errorMsg = validateField(field, (formData as any)[field] || "");
    setErrors((prev) => {
      const updated = { ...prev };
      if (errorMsg) {
        updated[field] = errorMsg;
      } else {
        delete updated[field];
      }
      return updated;
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const errorMsg = validateField(field, value);
      setErrors((prev) => {
        const updated = { ...prev };
        if (errorMsg) {
          updated[field] = errorMsg;
        } else {
          delete updated[field];
        }
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    // Full client-side validation
    const validationErrors: Record<string, string> = {};
    const nameErr = validateField("name", formData.name);
    if (nameErr) validationErrors.name = nameErr;

    const emailErr = validateField("email", formData.email);
    if (emailErr) validationErrors.email = emailErr;

    const phoneErr = validateField("phone", formData.phone);
    if (phoneErr) validationErrors.phone = phoneErr;

    const subjectErr = validateField("subject", formData.subject);
    if (subjectErr) validationErrors.subject = subjectErr;

    const messageErr = validateField("message", formData.message);
    if (messageErr) validationErrors.message = messageErr;

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched({
        name: true,
        email: true,
        phone: true,
        subject: true,
        message: true,
      });
      showToast({
        type: "error",
        title: dict.contactPage.toastErrorTitle,
        description: dict.contactPage.toastErrorDesc,
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          inquiryType,
          membershipPackage: inquiryType === "membership" ? membershipPackage : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setSuccess(true);
      showToast({
        type: "success",
        title: dict.contactPage.toastSuccessTitle,
        description: dict.contactPage.toastSuccessDesc,
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        organization: "",
        subject: "",
        message: "",
        botField: "",
      });
      setTouched({});
      setErrors({});
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : dict.common.error;
      setGeneralError(msg);
      showToast({
        type: "error",
        title: dict.contactPage.toastErrorTitle,
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 md:p-10 border-t-4 border-[var(--gold)] shadow-xl">
      {success ? (
        <div className="py-12 text-center space-y-5">
          <div className="w-16 h-16 bg-[var(--green)]/10 text-[var(--green)] rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="font-serif text-3xl text-[var(--green)] font-normal">
            {dict.contactPage.toastSuccessTitle}
          </h3>
          <p className="text-[var(--muted)] max-w-md mx-auto leading-relaxed text-sm">
            {dict.contactPage.successMsg}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="inline-flex items-center gap-2 bg-[var(--paper)] border border-[#dcd4c1] px-5 py-2.5 text-xs uppercase tracking-widest text-[var(--green)] font-extrabold hover:border-[var(--gold)] transition-colors cursor-pointer"
            >
              Send another inquiry
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Anti-spam invisible honeypot trap */}
          <div className="hidden" aria-hidden="true" style={{ display: "none" }}>
            <label htmlFor="contact_bot_field">Leave this field blank</label>
            <input
              id="contact_bot_field"
              type="text"
              name="bot_field"
              tabIndex={-1}
              autoComplete="off"
              value={formData.botField}
              onChange={(e) => setFormData({ ...formData, botField: e.target.value })}
            />
          </div>

          {generalError && (
            <div className="p-4 bg-red-50 border-l-4 border-[var(--red)] text-[var(--red)] text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{generalError}</span>
            </div>
          )}

          {/* 1. Category Selector */}
          <div>
            <label className="block text-[0.74rem] uppercase font-extrabold tracking-[0.14em] text-[#716854] mb-3">
              {dict.contactPage.typeLabel}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              {/* Option: Sponsor */}
              <button
                type="button"
                onClick={() => handleCategorySelect("sponsor")}
                className={`p-4 border text-left rounded-xs transition-all flex items-start gap-3.5 cursor-pointer group ${
                  inquiryType === "sponsor"
                    ? "bg-[var(--green)] text-white border-[var(--gold)] ring-2 ring-[var(--gold)] shadow-sm"
                    : "bg-[#fdfcf8] text-[#2c3531] border-[#dcd4c1] hover:border-[var(--gold)] hover:bg-white"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xs flex items-center justify-center shrink-0 transition-colors ${
                    inquiryType === "sponsor"
                      ? "bg-[var(--gold)]/20 text-[var(--gold)]"
                      : "bg-[#f4f0e6] text-[#716854] group-hover:bg-[#ebe3d2]"
                  }`}
                >
                  <HandHeart className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <strong className="block text-[0.82rem] sm:text-[0.86rem] font-bold uppercase tracking-wider leading-snug">
                    {dict.contactPage.typeSponsor}
                  </strong>
                  <span
                    className={`text-xs block mt-1 leading-normal ${
                      inquiryType === "sponsor" ? "text-[#ded9cb]" : "text-[#716854]"
                    }`}
                  >
                    {dict.contactPage.typeDescSponsor}
                  </span>
                </div>
              </button>

              {/* Option: Donor */}
              <button
                type="button"
                onClick={() => handleCategorySelect("donor")}
                className={`p-4 border text-left rounded-xs transition-all flex items-start gap-3.5 cursor-pointer group ${
                  inquiryType === "donor"
                    ? "bg-[var(--green)] text-white border-[var(--gold)] ring-2 ring-[var(--gold)] shadow-sm"
                    : "bg-[#fdfcf8] text-[#2c3531] border-[#dcd4c1] hover:border-[var(--gold)] hover:bg-white"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xs flex items-center justify-center shrink-0 transition-colors ${
                    inquiryType === "donor"
                      ? "bg-[var(--gold)]/20 text-[var(--gold)]"
                      : "bg-[#f4f0e6] text-[#716854] group-hover:bg-[#ebe3d2]"
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <strong className="block text-[0.82rem] sm:text-[0.86rem] font-bold uppercase tracking-wider leading-snug">
                    {dict.contactPage.typeDonor}
                  </strong>
                  <span
                    className={`text-xs block mt-1 leading-normal ${
                      inquiryType === "donor" ? "text-[#ded9cb]" : "text-[#716854]"
                    }`}
                  >
                    {dict.contactPage.typeDescDonor}
                  </span>
                </div>
              </button>

              {/* Option: Membership */}
              <button
                type="button"
                onClick={() => handleCategorySelect("membership")}
                className={`p-4 border text-left rounded-xs transition-all flex items-start gap-3.5 cursor-pointer group ${
                  inquiryType === "membership"
                    ? "bg-[var(--green)] text-white border-[var(--gold)] ring-2 ring-[var(--gold)] shadow-sm"
                    : "bg-[#fdfcf8] text-[#2c3531] border-[#dcd4c1] hover:border-[var(--gold)] hover:bg-white"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xs flex items-center justify-center shrink-0 transition-colors ${
                    inquiryType === "membership"
                      ? "bg-[var(--gold)]/20 text-[var(--gold)]"
                      : "bg-[#f4f0e6] text-[#716854] group-hover:bg-[#ebe3d2]"
                  }`}
                >
                  <UserCheck className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <strong className="block text-[0.82rem] sm:text-[0.86rem] font-bold uppercase tracking-wider leading-snug">
                    {dict.contactPage.typeMembership}
                  </strong>
                  <span
                    className={`text-xs block mt-1 leading-normal ${
                      inquiryType === "membership" ? "text-[#ded9cb]" : "text-[#716854]"
                    }`}
                  >
                    {dict.contactPage.typeDescMembership}
                  </span>
                </div>
              </button>

              {/* Option: General */}
              <button
                type="button"
                onClick={() => handleCategorySelect("general")}
                className={`p-4 border text-left rounded-xs transition-all flex items-start gap-3.5 cursor-pointer group ${
                  inquiryType === "general"
                    ? "bg-[var(--green)] text-white border-[var(--gold)] ring-2 ring-[var(--gold)] shadow-sm"
                    : "bg-[#fdfcf8] text-[#2c3531] border-[#dcd4c1] hover:border-[var(--gold)] hover:bg-white"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xs flex items-center justify-center shrink-0 transition-colors ${
                    inquiryType === "general"
                      ? "bg-[var(--gold)]/20 text-[var(--gold)]"
                      : "bg-[#f4f0e6] text-[#716854] group-hover:bg-[#ebe3d2]"
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <strong className="block text-[0.82rem] sm:text-[0.86rem] font-bold uppercase tracking-wider leading-snug">
                    {dict.contactPage.typeGeneral}
                  </strong>
                  <span
                    className={`text-xs block mt-1 leading-normal ${
                      inquiryType === "general" ? "text-[#ded9cb]" : "text-[#716854]"
                    }`}
                  >
                    {dict.contactPage.typeDescGeneral}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* 1.5 Membership Package Selector (Only when Membership is selected) */}
          {inquiryType === "membership" && (
            <div className="bg-[#FAF8F3] border border-[#e2dcce] p-4 sm:p-5 rounded-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-[0.74rem] uppercase font-extrabold tracking-[0.12em] text-[var(--green-dark)]">
                  {dict.contactPage.packageLabel}
                </label>
                <span className="text-[0.7rem] text-[#82785f] font-semibold">
                  Click a package to choose
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Adult */}
                <button
                  type="button"
                  onClick={() => handlePackageSelect("adult")}
                  className={`p-3.5 border rounded-xs text-left transition-all cursor-pointer ${
                    membershipPackage === "adult"
                      ? "bg-[var(--green)] text-white border-[var(--gold)] ring-2 ring-[var(--gold)] shadow-sm"
                      : "bg-white text-[var(--ink)] border-[#dcd4c1] hover:border-[var(--gold)]"
                  }`}
                >
                  <div className="flex justify-between items-baseline mb-1">
                    <strong className="text-xs font-bold uppercase tracking-wider">Adult</strong>
                    <span
                      className={`text-xs font-extrabold ${
                        membershipPackage === "adult" ? "text-[var(--gold)]" : "text-[var(--green)]"
                      }`}
                    >
                      CHF 100
                    </span>
                  </div>
                  <p
                    className={`text-[0.7rem] leading-snug ${
                      membershipPackage === "adult" ? "text-[#d8d4c7]" : "text-gray-500"
                    }`}
                  >
                    Full voting rights &amp; playing privileges
                  </p>
                </button>

                {/* Family */}
                <button
                  type="button"
                  onClick={() => handlePackageSelect("family")}
                  className={`p-3.5 border rounded-xs text-left transition-all cursor-pointer ${
                    membershipPackage === "family"
                      ? "bg-[var(--green)] text-white border-[var(--gold)] ring-2 ring-[var(--gold)] shadow-sm"
                      : "bg-white text-[var(--ink)] border-[#dcd4c1] hover:border-[var(--gold)]"
                  }`}
                >
                  <div className="flex justify-between items-baseline mb-1">
                    <strong className="text-xs font-bold uppercase tracking-wider">Family</strong>
                    <span
                      className={`text-xs font-extrabold ${
                        membershipPackage === "family" ? "text-[var(--gold)]" : "text-[var(--green)]"
                      }`}
                    >
                      CHF 200
                    </span>
                  </div>
                  <p
                    className={`text-[0.7rem] leading-snug ${
                      membershipPackage === "family" ? "text-[#d8d4c7]" : "text-gray-500"
                    }`}
                  >
                    Parents &amp; junior members under 18
                  </p>
                </button>

                {/* Junior */}
                <button
                  type="button"
                  onClick={() => handlePackageSelect("junior")}
                  className={`p-3.5 border rounded-xs text-left transition-all cursor-pointer ${
                    membershipPackage === "junior"
                      ? "bg-[var(--green)] text-white border-[var(--gold)] ring-2 ring-[var(--gold)] shadow-sm"
                      : "bg-white text-[var(--ink)] border-[#dcd4c1] hover:border-[var(--gold)]"
                  }`}
                >
                  <div className="flex justify-between items-baseline mb-1">
                    <strong className="text-xs font-bold uppercase tracking-wider">Junior</strong>
                    <span
                      className={`text-xs font-extrabold ${
                        membershipPackage === "junior" ? "text-[var(--gold)]" : "text-[var(--green)]"
                      }`}
                    >
                      CHF 50
                    </span>
                  </div>
                  <p
                    className={`text-[0.7rem] leading-snug ${
                      membershipPackage === "junior" ? "text-[#d8d4c7]" : "text-gray-500"
                    }`}
                  >
                    Coaching clinics, youth fixtures &amp; kit
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* 2. Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]">
                {dict.registration.nameLabel} <span className="text-[var(--red)]">*</span>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  className={`mt-2 w-full bg-[#fdfcf8] border min-h-[48px] px-4 text-base font-normal tracking-normal text-[var(--ink)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--gold)] ${
                    touched.name && errors.name ? "border-[var(--red)] ring-1 ring-[var(--red)]" : "border-[#c9ccc8]"
                  }`}
                />
              </label>
              {touched.name && errors.name && (
                <p className="mt-1.5 text-xs text-[var(--red)] flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]">
                {dict.registration.emailLabel} <span className="text-[var(--red)]">*</span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={`mt-2 w-full bg-[#fdfcf8] border min-h-[48px] px-4 text-base font-normal tracking-normal text-[var(--ink)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--gold)] ${
                    touched.email && errors.email ? "border-[var(--red)] ring-1 ring-[var(--red)]" : "border-[#c9ccc8]"
                  }`}
                />
              </label>
              {touched.email && errors.email && (
                <p className="mt-1.5 text-xs text-[var(--red)] flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>
          </div>

          {/* 3. Organization & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]">
                {inquiryType === "membership" ? "Postal Address / Residence (Optional)" : dict.contactPage.companyLabel}
                <div className="relative mt-2">
                  <Building2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={inquiryType === "membership" ? "e.g. 3780 Gstaad, Switzerland" : "e.g. Acme Sport Group / Foundation"}
                    value={formData.organization}
                    onChange={(e) => handleChange("organization", e.target.value)}
                    className="w-full bg-[#fdfcf8] border border-[#c9ccc8] min-h-[48px] pl-10 pr-4 text-base font-normal tracking-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                  />
                </div>
              </label>
            </div>

            <div>
              <label className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]">
                {dict.contactPage.phoneLabel}
                <div className="relative mt-2">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="+41 79 123 45 67"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    onBlur={() => handleBlur("phone")}
                    className={`w-full bg-[#fdfcf8] border min-h-[48px] pl-10 pr-4 text-base font-normal tracking-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)] ${
                      touched.phone && errors.phone ? "border-[var(--red)] ring-1 ring-[var(--red)]" : "border-[#c9ccc8]"
                    }`}
                  />
                </div>
              </label>
              {touched.phone && errors.phone && (
                <p className="mt-1.5 text-xs text-[var(--red)] flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>
          </div>

          {/* 4. Subject */}
          <div>
            <label className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]">
              Subject <span className="text-[var(--red)]">*</span>
              <input
                type="text"
                placeholder="e.g. Membership Application, sponsorship inquiry, festival question"
                value={formData.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
                onBlur={() => handleBlur("subject")}
                className={`mt-2 w-full bg-[#fdfcf8] border min-h-[48px] px-4 text-base font-normal tracking-normal text-[var(--ink)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--gold)] ${
                  touched.subject && errors.subject ? "border-[var(--red)] ring-1 ring-[var(--red)]" : "border-[#c9ccc8]"
                }`}
              />
            </label>
            {touched.subject && errors.subject && (
              <p className="mt-1.5 text-xs text-[var(--red)] flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.subject}</span>
              </p>
            )}
          </div>

          {/* 5. Message Body */}
          <div>
            <label className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]">
              {dict.registration.notesLabel} <span className="text-[var(--red)]">*</span>
              <textarea
                rows={5}
                placeholder={
                  inquiryType === "membership"
                    ? "Please tell us about your background in cricket, questions regarding fixtures or coaching, or family member details..."
                    : inquiryType === "sponsor"
                    ? "Please let us know how your organization would like to partner with the club (e.g. kit branding, event sponsorship, equipment partnership)..."
                    : inquiryType === "donor"
                    ? "Tell us how you would like to support the club or if you have specific preferences for your community patron contribution..."
                    : "How can our committee assist you?"
                }
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                onBlur={() => handleBlur("message")}
                className={`mt-2 w-full bg-[#fdfcf8] border p-4 text-base font-normal tracking-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)] resize-y ${
                  touched.message && errors.message ? "border-[var(--red)] ring-1 ring-[var(--red)]" : "border-[#c9ccc8]"
                }`}
              />
            </label>
            {touched.message && errors.message && (
              <p className="mt-1.5 text-xs text-[var(--red)] flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.message}</span>
              </p>
            )}
          </div>

          {/* 6. Submit Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-[var(--gold)] text-[var(--green-dark)] hover:bg-[var(--gold-hover)] px-8 py-4 font-extrabold uppercase tracking-wider text-sm inline-flex items-center gap-3 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{dict.contactPage.sendingBtn}</span>
                </>
              ) : (
                <>
                  <span>{inquiryType === "membership" ? "Send Membership Details" : dict.contactPage.sendBtn}</span>
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
  );
}

export default function ContactPage() {
  const { dict } = useLanguage();

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
          {dict.contactPage.kicker}
        </span>
        <h1 className="font-serif text-[clamp(3.5rem,7.5vw,7.5rem)] leading-[0.88] font-normal text-white mb-6">
          {dict.contactPage.title} <em className="text-[var(--gold)] italic">{dict.contactPage.titleEm}</em>
        </h1>
        <p className="text-[#e4dfd1] font-serif text-[1.35rem] leading-[1.55] max-w-2xl mt-8">
          {dict.contactPage.intro}
        </p>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-[6vw] max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[330px_1fr] xl:grid-cols-[360px_1fr] gap-8 lg:gap-12 items-start">
        {/* Left Column: Administration Details */}
        <div className="space-y-8">
          <div>
            <h2 className="font-serif text-3xl text-[var(--ink)] mb-4 font-normal">
              Club Administration
            </h2>
            <p className="text-[#5c6d66] text-sm leading-relaxed">
              Our committee meets regularly in Gstaad and is always delighted to assist prospective members, parents, and community partners.
            </p>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3.5 p-5 bg-white border border-[#e4decf] shadow-2xs">
              <MapPin className="w-5 h-5 text-[var(--gold)] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[var(--ink)] font-serif text-base mb-1">
                  Festival Ground &amp; Pitch
                </strong>
                <span className="text-[#5c6d66] block">
                  OSZ Ebnit Gstaad
                </span>
                <span className="text-[#7d8b84] text-xs">
                  Rumpleregässli 8, 3780 Gstaad, Switzerland
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-5 bg-white border border-[#e4decf] shadow-2xs">
              <Phone className="w-5 h-5 text-[var(--gold)] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[var(--ink)] font-serif text-base mb-1">
                  Telephone Contact
                </strong>
                <a
                  href="tel:+41797862531"
                  className="text-[#5c6d66] hover:text-[var(--gold)] transition-colors font-medium"
                >
                  +41 79 786 25 31
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-5 bg-white border border-[#e4decf] shadow-2xs">
              <Mail className="w-5 h-5 text-[var(--gold)] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[var(--ink)] font-serif text-base mb-1">
                  Email Inquiries
                </strong>
                <span className="text-[#5c6d66]">{CLUB_CONFIG.contact.email}</span>
              </div>
            </div>

            {/* Partnership & Membership Note */}
            <div className="p-5 bg-[var(--paper)] border-l-4 border-[var(--gold)] text-xs text-[#5c6d66] leading-relaxed">
              <strong className="block text-[var(--ink)] uppercase tracking-wider font-extrabold mb-1">
                Memberships &amp; Partnerships
              </strong>
              Whether you wish to join as an Adult, Family, or Junior playing member, or support as a patron or sponsor, our committee handles all applications with personal care.
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Contact Form in Suspense */}
        <Suspense
          fallback={
            <div className="bg-white p-12 text-center text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--gold)]" />
              <p className="text-sm">Loading inquiry form...</p>
            </div>
          }
        >
          <ContactForm />
        </Suspense>
      </section>
    </div>
  );
}
