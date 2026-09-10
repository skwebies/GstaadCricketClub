"use client";

/**
 * @file RegistrationForm.tsx
 * @description Luxury festival attendee reservation form with real-time and on-submit custom validation,
 * SMTP email dispatch, inline error indicators, toaster notifications, and trilingual support.
 * @module shared/components/marketing
 */

import { useState } from "react";
import { ArrowRight, CheckCircle2, AlertCircle, Loader2, ShieldCheck, Camera, Users, HeartHandshake, Info } from "lucide-react";
import { useLanguage } from "@/shared/i18n/LanguageContext";
import { useToast } from "@/shared/components/common/Toast";

export function RegistrationForm() {
  const { dict } = useLanguage();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    participantType: "Individual",
    partySize: 1,
    emergencyContact: "",
    message: "",
    isMinor: false,
    guardianName: "",
    guardianRelationship: "Parent",
    consentChildParticipation: false,
    consentEmergencyContact: true,
    consentMedicalInfo: false,
    consentPhotography: false,
    consentSocialMedia: false,
    botField: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  /**
   * Custom field-level validator with localized error messaging
   */
  const validateField = (field: string, value: string | number | boolean | undefined): string | null => {
    switch (field) {
      case "name": {
        const val = String(value || "").trim();
        if (!val || val.length < 2) {
          return dict.registration.validationNameRequired;
        }
        if (/[<>{}\\]/.test(val)) {
          return "Name contains invalid characters";
        }
        return null;
      }
      case "email": {
        const val = String(value || "").trim();
        if (!val) {
          return dict.registration.validationEmailRequired;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(val)) {
          return dict.registration.validationEmailInvalid;
        }
        return null;
      }
      case "phone": {
        const val = String(value || "").trim();
        if (!val) {
          return dict.registration.validationPhoneRequired;
        }
        const cleaned = val.replace(/[\s()./-]/g, "");
        if (cleaned.length < 7 || !/^[0-9+]+$/.test(cleaned)) {
          return dict.registration.validationPhoneInvalid;
        }
        return null;
      }
      case "partySize": {
        const num = Number(value);
        if (!num || num < 1 || num > 20) {
          return dict.registration.validationPartySize;
        }
        return null;
      }
      default:
        return null;
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errorMsg = validateField(field, formData[field as keyof typeof formData]);
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

  const handleChange = (field: string, value: string | number | boolean) => {
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

    // Run full client-side validation across all fields
    const validationErrors: Record<string, string> = {};
    const nameErr = validateField("name", formData.name);
    if (nameErr) validationErrors.name = nameErr;

    const emailErr = validateField("email", formData.email);
    if (emailErr) validationErrors.email = emailErr;

    const phoneErr = validateField("phone", formData.phone);
    if (phoneErr) validationErrors.phone = phoneErr;

    const partyErr = validateField("partySize", formData.partySize);
    if (partyErr) validationErrors.partySize = partyErr;

    const isMinorActive = formData.isMinor || formData.participantType === "Child with guardian";
    if (isMinorActive) {
      if (!formData.guardianName.trim() || formData.guardianName.trim().length < 2) {
        validationErrors.guardianName = "Parent or legal guardian name is required.";
      }
      if (!formData.consentChildParticipation) {
        validationErrors.consentChildParticipation = "Parental or legal guardian consent is required for a child to participate.";
      }
    }

    if (!formData.consentEmergencyContact) {
      validationErrors.consentEmergencyContact = "Emergency contact consent is required for participant safety.";
    }

    if (formData.message.trim().length > 0 && !formData.consentMedicalInfo) {
      validationErrors.consentMedicalInfo = "Consent to process medical, allergy or accessibility notes is required when providing notes.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched({
        name: true,
        email: true,
        phone: true,
        partySize: true,
        guardianName: isMinorActive,
        consentChildParticipation: isMinorActive,
        consentEmergencyContact: true,
        consentMedicalInfo: formData.message.trim().length > 0,
      });
      showToast({
        type: "error",
        title: dict.registration.toastErrorTitle,
        description: dict.registration.toastErrorDesc,
      });
      return;
    }

    setLoading(true);

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
          fullName: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          participantType: formData.participantType,
          registrationType,
          partySize: Number(formData.partySize) || 1,
          emergencyContact: formData.emergencyContact || formData.phone || "Self / Attendee",
          dietaryRequirements: formData.message.trim() || undefined,
          notes: formData.message.trim() || undefined,
          isMinor: isMinorActive,
          guardianName: isMinorActive ? formData.guardianName.trim() : undefined,
          guardianRelationship: isMinorActive ? formData.guardianRelationship : undefined,
          consentChildParticipation: formData.consentChildParticipation,
          consentEmergencyContact: formData.consentEmergencyContact,
          consentMedicalInfo: formData.consentMedicalInfo,
          consentPhotography: formData.consentPhotography,
          consentSocialMedia: formData.consentSocialMedia,
          botField: formData.botField,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.fieldErrors) {
          setErrors(data.fieldErrors);
          setTouched({ name: true, email: true, phone: true, partySize: true });
        }
        throw new Error(data.error || "Failed to register. Please check the form.");
      }

      setSuccess(true);
      setErrors({});
      setTouched({});
      setFormData({
        name: "",
        email: "",
        phone: "",
        participantType: "Individual",
        partySize: 1,
        emergencyContact: "",
        message: "",
        isMinor: false,
        guardianName: "",
        guardianRelationship: "Parent",
        consentChildParticipation: false,
        consentEmergencyContact: true,
        consentMedicalInfo: false,
        consentPhotography: false,
        consentSocialMedia: false,
        botField: "",
      });

      showToast({
        type: "success",
        title: dict.registration.toastSuccessTitle,
        description: dict.registration.toastSuccessDesc,
        duration: 6500,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : dict.common.error;
      setGeneralError(msg);
      showToast({
        type: "error",
        title: dict.registration.toastErrorTitle,
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white p-8 md:p-12 shadow-[0_24px_60px_#14302713] border-t-4 border-[var(--gold)] max-w-2xl w-full"
    >
      {success ? (
        <div className="py-10 text-center space-y-4 animate-in fade-in duration-300">
          <div className="w-16 h-16 bg-[var(--green)]/10 text-[var(--green)] rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="font-serif text-3xl text-[var(--green)]">
            {dict.registration.successTitle}
          </h3>
          <p className="text-[var(--muted)] max-w-md mx-auto leading-relaxed">
            {dict.registration.successMsg}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--green)] font-extrabold hover:underline cursor-pointer"
            >
              {dict.registration.registerAnother}
            </button>
          </div>
        </div>
      ) : (
        <>
          {generalError && (
            <div
              role="alert"
              className="mb-6 p-4 bg-red-50 border-l-4 border-[#E53E3E] text-[#9B1C1C] text-sm flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#E53E3E]" />
              <span>{generalError}</span>
            </div>
          )}

          {/* Anti-spam invisible honeypot trap */}
          <div className="hidden" aria-hidden="true" style={{ display: "none" }}>
            <label htmlFor="reg_bot_field">Leave this empty</label>
            <input
              id="reg_bot_field"
              type="text"
              name="bot_field"
              tabIndex={-1}
              autoComplete="off"
              value={formData.botField}
              onChange={(e) => setFormData({ ...formData, botField: e.target.value })}
            />
          </div>

          {/* Full Name Field */}
          <div className="mb-5">
            <label
              htmlFor="reg_name"
              className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]"
            >
              {dict.registration.nameLabel}
            </label>
            <input
              id="reg_name"
              required
              type="text"
              name="name"
              placeholder={dict.registration.namePlaceholder}
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              aria-invalid={!!(errors.name && touched.name)}
              aria-describedby={errors.name && touched.name ? "name-error" : undefined}
              className={`mt-2 w-full min-h-[50px] px-4 text-base font-normal tracking-normal text-[var(--ink)] transition-colors focus:outline-none ${
                errors.name && touched.name
                  ? "border-2 border-[#E53E3E] bg-[#FFFBFB] focus:ring-1 focus:ring-[#E53E3E]"
                  : "bg-[#fdfcf8] border border-[#c9ccc8] focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]"
              }`}
            />
            {errors.name && touched.name && (
              <p id="name-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-[#C53030] font-medium tracking-normal">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Email & Phone Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label
                htmlFor="reg_email"
                className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]"
              >
                {dict.registration.emailLabel}
              </label>
              <input
                id="reg_email"
                required
                type="email"
                name="email"
                placeholder={dict.registration.emailPlaceholder}
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                aria-invalid={!!(errors.email && touched.email)}
                aria-describedby={errors.email && touched.email ? "email-error" : undefined}
                className={`mt-2 w-full min-h-[50px] px-4 text-base font-normal tracking-normal text-[var(--ink)] transition-colors focus:outline-none ${
                  errors.email && touched.email
                    ? "border-2 border-[#E53E3E] bg-[#FFFBFB] focus:ring-1 focus:ring-[#E53E3E]"
                    : "bg-[#fdfcf8] border border-[#c9ccc8] focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]"
                }`}
              />
              {errors.email && touched.email && (
                <p id="email-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-[#C53030] font-medium tracking-normal">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="reg_phone"
                className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]"
              >
                {dict.registration.phoneLabel}
              </label>
              <input
                id="reg_phone"
                required
                type="tel"
                name="phone"
                placeholder={dict.registration.phonePlaceholder}
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                onBlur={() => handleBlur("phone")}
                aria-invalid={!!(errors.phone && touched.phone)}
                aria-describedby={errors.phone && touched.phone ? "phone-error" : undefined}
                className={`mt-2 w-full min-h-[50px] px-4 text-base font-normal tracking-normal text-[var(--ink)] transition-colors focus:outline-none ${
                  errors.phone && touched.phone
                    ? "border-2 border-[#E53E3E] bg-[#FFFBFB] focus:ring-1 focus:ring-[#E53E3E]"
                    : "bg-[#fdfcf8] border border-[#c9ccc8] focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]"
                }`}
              />
              {errors.phone && touched.phone && (
                <p id="phone-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-[#C53030] font-medium tracking-normal">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>
          </div>

          {/* Participant Type & Party Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label
                htmlFor="reg_type"
                className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]"
              >
                {dict.registration.typeLabel}
              </label>
              <select
                id="reg_type"
                required
                name="participantType"
                value={formData.participantType}
                onChange={(e) => handleChange("participantType", e.target.value)}
                className="mt-2 w-full bg-[#fdfcf8] border border-[#c9ccc8] min-h-[50px] px-4 text-base font-normal tracking-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-[var(--gold)] cursor-pointer"
              >
                <option value="Individual">{dict.registration.typeIndividual}</option>
                <option value="Family">{dict.registration.typeFamily}</option>
                <option value="Child with guardian">{dict.registration.typeChild}</option>
                <option value="Group">{dict.registration.typeGroup}</option>
                <option value="VIP Patron">VIP Patron</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="reg_party"
                className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]"
              >
                {dict.registration.partySizeLabel}
              </label>
              <input
                id="reg_party"
                required
                type="number"
                min="1"
                max="20"
                name="partySize"
                value={formData.partySize}
                onChange={(e) => handleChange("partySize", Number(e.target.value))}
                onBlur={() => handleBlur("partySize")}
                aria-invalid={!!(errors.partySize && touched.partySize)}
                aria-describedby={errors.partySize && touched.partySize ? "party-error" : undefined}
                className={`mt-2 w-full min-h-[50px] px-4 text-base font-normal tracking-normal text-[var(--ink)] transition-colors focus:outline-none ${
                  errors.partySize && touched.partySize
                    ? "border-2 border-[#E53E3E] bg-[#FFFBFB] focus:ring-1 focus:ring-[#E53E3E]"
                    : "bg-[#fdfcf8] border border-[#c9ccc8] focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]"
                }`}
              />
              {errors.partySize && touched.partySize && (
                <p id="party-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-[#C53030] font-medium tracking-normal">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.partySize}</span>
                </p>
              )}
            </div>
          </div>

          {/* Minor Attendee / Guardian Section */}
          <div className="mb-6 p-4 rounded-lg bg-[#fbf9f4] border border-[#e6e2d8]">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="reg_is_minor" className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  id="reg_is_minor"
                  type="checkbox"
                  checked={formData.isMinor || formData.participantType === "Child with guardian"}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFormData((prev) => ({
                      ...prev,
                      isMinor: checked,
                      participantType: checked ? "Child with guardian" : (prev.participantType === "Child with guardian" ? "Individual" : prev.participantType),
                    }));
                  }}
                  className="w-4 h-4 rounded border-gray-300 text-[var(--gold)] focus:ring-[var(--gold)] cursor-pointer"
                />
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
                  Registration involves a participant under 18
                </span>
              </label>
              {(formData.isMinor || formData.participantType === "Child with guardian") && (
                <span className="text-[0.68rem] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                  Guardian Consent Required
                </span>
              )}
            </div>

            {(formData.isMinor || formData.participantType === "Child with guardian") && (
              <div className="mt-4 pt-3 border-t border-[#e2ddd2] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="reg_guardian_name"
                      className="block text-[0.72rem] uppercase font-bold tracking-wider text-[var(--ink)]"
                    >
                      Parent / Legal Guardian Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="reg_guardian_name"
                      type="text"
                      required
                      placeholder="Guardian full name"
                      value={formData.guardianName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, guardianName: e.target.value }))}
                      className={`mt-1.5 w-full bg-white border min-h-[44px] px-3 text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)] ${
                        errors.guardianName && touched.guardianName ? "border-red-500 bg-red-50/20" : "border-[#c9ccc8]"
                      }`}
                    />
                    {errors.guardianName && touched.guardianName && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.guardianName}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="reg_guardian_rel"
                      className="block text-[0.72rem] uppercase font-bold tracking-wider text-[var(--ink)]"
                    >
                      Relationship to Minor
                    </label>
                    <select
                      id="reg_guardian_rel"
                      value={formData.guardianRelationship}
                      onChange={(e) => setFormData((prev) => ({ ...prev, guardianRelationship: e.target.value }))}
                      className="mt-1.5 w-full bg-white border border-[#c9ccc8] min-h-[44px] px-3 text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)] cursor-pointer"
                    >
                      <option value="Parent">Parent (Mother / Father)</option>
                      <option value="Legal Guardian">Legal Guardian</option>
                      <option value="Authorized Family Member">Authorized Family Member</option>
                    </select>
                  </div>
                </div>

                <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.consentChildParticipation}
                    onChange={(e) => setFormData((prev) => ({ ...prev, consentChildParticipation: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-300 text-[var(--gold)] focus:ring-[var(--gold)] mt-0.5 cursor-pointer shrink-0"
                  />
                  <span className="text-xs text-gray-700 leading-normal">
                    <strong>Participation by a child:</strong> As parent or legal guardian, I give permission for the participant(s) under 18 to attend and participate in Gstaad Cricket Club coaching and matches under adult supervision. <span className="text-red-600">*</span>
                  </span>
                </label>
                {errors.consentChildParticipation && touched.consentChildParticipation && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.consentChildParticipation}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Emergency Contact Detail */}
          <div className="mb-5">
            <label
              htmlFor="reg_emergency"
              className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]"
            >
              Emergency Contact Name &amp; Phone <span className="font-normal text-[#555d59] normal-case">(optional if same as above)</span>
            </label>
            <input
              id="reg_emergency"
              type="text"
              name="emergencyContact"
              placeholder="e.g. Maria Rossi (+41 79 987 65 43)"
              value={formData.emergencyContact}
              onChange={(e) => setFormData((prev) => ({ ...prev, emergencyContact: e.target.value }))}
              className="mt-2 w-full min-h-[46px] px-4 text-sm font-normal text-[var(--ink)] bg-[#fdfcf8] border border-[#c9ccc8] focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]"
            />
          </div>

          {/* Notes / Special Requirements */}
          <div className="mb-6">
            <label
              htmlFor="reg_notes"
              className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]"
            >
              {dict.registration.notesLabel}{" "}
              <span className="font-normal text-[#555d59] normal-case">{dict.registration.optional}</span>
            </label>
            <textarea
              id="reg_notes"
              name="message"
              rows={3}
              maxLength={500}
              placeholder={dict.registration.notesPlaceholder}
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              className="mt-2 w-full bg-[#fdfcf8] border border-[#c9ccc8] p-4 text-base font-normal tracking-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-[var(--gold)] resize-y"
            ></textarea>
          </div>

          {/* Unbundled Consents & Permissions */}
          <div className="mb-8 p-5 rounded-lg bg-[#faf8f4] border border-[#e5e0d3] space-y-4">
            <div>
              <h4 className="font-serif text-base text-[var(--green-dark)] font-normal flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--gold)]" />
                <span>Statutory Consents &amp; Permissions</span>
              </h4>
              <p className="text-xs text-gray-600 mt-1">
                In compliance with the Swiss Federal Act on Data Protection (nDSG / FADP), consents are unbundled and chosen individually.
              </p>
            </div>

            <div className="space-y-3 pt-2 border-t border-gray-200 text-xs text-gray-700">
              {/* Consent: Emergency Contact */}
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.consentEmergencyContact}
                  onChange={(e) => setFormData((prev) => ({ ...prev, consentEmergencyContact: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-[var(--gold)] focus:ring-[var(--gold)] mt-0.5 cursor-pointer shrink-0"
                />
                <div>
                  <strong>Emergency contact information:</strong> I consent to the collection and use of emergency contact information to ensure safety and respond to any medical incident during club activities. <span className="text-red-600">*</span>
                </div>
              </label>
              {errors.consentEmergencyContact && touched.consentEmergencyContact && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.consentEmergencyContact}</span>
                </p>
              )}

              {/* Consent: Medical / Allergy / Accessibility */}
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.consentMedicalInfo}
                  onChange={(e) => setFormData((prev) => ({ ...prev, consentMedicalInfo: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-[var(--gold)] focus:ring-[var(--gold)] mt-0.5 cursor-pointer shrink-0"
                />
                <div>
                  <strong>Medical, allergy or accessibility information:</strong> I consent to designated club officers processing relevant health, allergy, or accessibility notes solely for safety and first-aid preparedness. {formData.message.trim().length > 0 && <span className="text-red-600">* (required when notes are provided)</span>}
                </div>
              </label>
              {errors.consentMedicalInfo && touched.consentMedicalInfo && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.consentMedicalInfo}</span>
                </p>
              )}

              {/* Consent: Photography & Video (OPTIONAL) */}
              <label className="flex items-start gap-2.5 cursor-pointer select-none pt-1">
                <input
                  type="checkbox"
                  checked={formData.consentPhotography}
                  onChange={(e) => setFormData((prev) => ({ ...prev, consentPhotography: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-[var(--gold)] focus:ring-[var(--gold)] mt-0.5 cursor-pointer shrink-0"
                />
                <div>
                  <strong>Photography and video (Optional):</strong> I consent to photographs and video recordings being taken during club activities for club archival and training purposes.
                </div>
              </label>

              {/* Consent: Publication on Website and Social Media (OPTIONAL) */}
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.consentSocialMedia}
                  onChange={(e) => setFormData((prev) => ({ ...prev, consentSocialMedia: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-[var(--gold)] focus:ring-[var(--gold)] mt-0.5 cursor-pointer shrink-0"
                />
                <div>
                  <strong>Publication of images on the website and social media (Optional):</strong> I consent to club photographs or videos featuring me / my child being published on the official club website and verified social media channels.
                </div>
              </label>
            </div>

            <div className="p-3 bg-amber-50/70 border-l-2 border-amber-500 text-[0.72rem] text-amber-900 leading-normal">
              <strong>Optional Consent Notice:</strong> Photography and media publication consent is strictly optional and is not combined with general registration acceptance. You are warmly welcome to participate regardless of your photo consent choice.
            </div>
          </div>

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
