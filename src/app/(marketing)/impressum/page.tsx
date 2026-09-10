"use client";

/**
 * @file impressum/page.tsx
 * @description Swiss law compliant Legal Notice & Impressum (Rechtliche Angaben)
 * specifying website operator, legal form under Art. 60 ff. ZGB, representation,
 * postal address, contact details, venue distinction, and disclaimers.
 * Fully localized across English, German, and French.
 * @module app/(marketing)/impressum
 */

import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  UserCheck,
  Phone,
  Mail,
  Globe,
  MapPin,
  ShieldCheck,
  FileCheck,
  Scale,
  ExternalLink,
  Copyright,
  ShieldAlert,
  Info,
} from "lucide-react";
import { useLanguage } from "@/shared/i18n/LanguageContext";

export default function ImpressumPage() {
  const { dict } = useLanguage();
  const page = dict.impressumPage;

  return (
    <div className="bg-[var(--paper)]">
      {/* 1. HERO HEADER */}
      <section className="inner-hero bg-[var(--green)] text-[var(--cream)] px-[8vw] pt-28 pb-16 relative overflow-hidden">
        <div className="max-w-4xl">
          <Link
            href="/"
            className="back-link inline-flex items-center gap-2 text-[#d8d3c5] hover:text-[var(--gold)] uppercase tracking-[0.14em] text-[0.75rem] font-bold mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{dict.legal.backToHome}</span>
          </Link>

          <span className="text-[var(--gold)] uppercase tracking-[0.22em] text-[0.75rem] font-extrabold mb-3 block">
            {dict.legal.impressumKicker}
          </span>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4.2rem)] leading-[1.05] font-normal text-white mb-4">
            {dict.legal.impressumTitle}
          </h1>
          <p className="text-[#e8e2d2] text-base md:text-lg max-w-3xl leading-relaxed">
            {dict.legal.impressumSubtitle}
          </p>

          <div className="mt-6 inline-flex items-center gap-2 text-xs text-[var(--gold)] font-mono bg-black/25 px-3.5 py-1.5 rounded-full border border-[var(--gold)]/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{dict.legal.lastUpdated} · {page.lawSubtitle}</span>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT BODY */}
      <section className="py-16 px-[8vw]">
        <div className="max-w-4xl mx-auto space-y-12 text-[var(--ink)] leading-relaxed">
          {/* Executive Overview Card */}
          <div className="p-6 bg-[#F8F7F2] border-l-4 border-[var(--gold)] rounded-r-xl border-t border-r border-b border-[#E2DDD2] shadow-xs">
            <h3 className="font-serif text-lg font-bold text-[var(--green-dark)] mb-2 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[var(--gold)]" />
              {page.overviewHeading}
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-normal">
              {page.overviewText}
            </p>
          </div>

          {/* Section: Website Operator & Legal Form */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2 flex items-center gap-2.5">
              <Building2 className="w-5 h-5 text-[var(--gold)]" />
              <span>{page.operatorHeading}</span>
            </h2>
            <div className="p-6 bg-white rounded-lg border border-gray-200 space-y-3 text-sm text-gray-800 shadow-2xs">
              <div>
                <strong className="block text-base font-serif text-[var(--green-dark)]">
                  Gstaad Cricket Club
                </strong>
                <span className="text-gray-700 block mt-1 leading-relaxed">
                  {page.operatorDesc}
                </span>
                <span className="text-xs text-gray-500 block mt-1">
                  {page.operatorTaxNotice}
                </span>
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-1">
                <span className="text-xs uppercase tracking-wider font-bold text-gray-500 block">
                  {page.postalAddressLabel}
                </span>
                <div className="font-mono text-xs text-gray-700 leading-relaxed">
                  Gstaad Cricket Club<br />
                  Undere Waldmattenstrasse 11<br />
                  3778 Schönried<br />
                  Switzerland
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 text-xs text-gray-600 space-y-0.5">
                <div><strong>{page.legalDomicileLabel}:</strong> {page.legalDomicileValue}</div>
              </div>
            </div>
          </div>

          {/* Section: Authorized Representation & Editorial Responsibility */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2 flex items-center gap-2.5">
              <UserCheck className="w-5 h-5 text-[var(--gold)]" />
              <span>{page.representationHeading}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* President */}
              <div className="p-6 bg-white rounded-lg border border-gray-200 space-y-3 shadow-2xs">
                <div className="flex items-center gap-2 text-[var(--gold)] font-bold text-xs uppercase tracking-wider">
                  <UserCheck className="w-4 h-4" />
                  <span>{page.presidentRole}</span>
                </div>
                <div>
                  <strong className="block text-base font-serif text-[var(--ink)]">
                    Sathya Narayanan
                  </strong>
                  <span className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium inline-block mt-1">
                    {page.presidentStatus}
                  </span>
                </div>
                <p className="text-xs text-gray-500 pt-1 leading-relaxed">
                  {page.presidentBio}
                </p>
              </div>

              {/* Treasurer */}
              <div className="p-6 bg-white rounded-lg border border-gray-200 space-y-3 shadow-2xs">
                <div className="flex items-center gap-2 text-[var(--gold)] font-bold text-xs uppercase tracking-wider">
                  <Scale className="w-4 h-4" />
                  <span>{page.treasurerRole}</span>
                </div>
                <div>
                  <strong className="block text-base font-serif text-[var(--ink)]">
                    Linda Narayanan
                  </strong>
                  <span className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium inline-block mt-1">
                    {page.treasurerStatus}
                  </span>
                </div>
                <p className="text-xs text-gray-500 pt-1 leading-relaxed">
                  {page.treasurerBio}
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#fbf9f4] border border-[#e5e0d3] rounded-lg text-xs text-gray-600 space-y-1">
              <strong>{page.statutoryNoticeTitle}</strong>
              <p>{page.statutoryNoticeText}</p>
            </div>
          </div>

          {/* Section: Contact Coordinates */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2 flex items-center gap-2.5">
              <Mail className="w-5 h-5 text-[var(--gold)]" />
              <span>{page.contactHeading}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-5 bg-white rounded-lg border border-gray-200 space-y-1 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                  <Phone className="w-3.5 h-3.5" />
                  {page.phoneLabel}
                </div>
                <a
                  href="tel:+41797862531"
                  className="font-mono text-xs text-gray-800 hover:text-[var(--gold)] font-semibold transition-colors block pt-1"
                >
                  +41 79 786 25 31
                </a>
              </div>

              <div className="p-5 bg-white rounded-lg border border-gray-200 space-y-1 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                  <Mail className="w-3.5 h-3.5" />
                  {page.emailLabel}
                </div>
                <a
                  href="mailto:info@gstaadcricketclub.ch"
                  className="font-mono text-xs text-gray-800 hover:text-[var(--gold)] font-semibold transition-colors block pt-1"
                >
                  info@gstaadcricketclub.ch
                </a>
              </div>

              <div className="p-5 bg-white rounded-lg border border-gray-200 space-y-1 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                  <Globe className="w-3.5 h-3.5" />
                  {page.websiteLabel}
                </div>
                <a
                  href="https://www.gstaadcricketclub.ch"
                  className="font-mono text-xs text-[var(--green)] hover:underline font-semibold transition-colors block pt-1"
                >
                  https://www.gstaadcricketclub.ch
                </a>
              </div>
            </div>
          </div>

          {/* Section: Event Venue (Explicit Distinction) */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2 flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-[var(--gold)]" />
              <span>{page.venueHeading}</span>
            </h2>
            <div className="p-6 bg-white rounded-lg border border-gray-200 space-y-3 text-sm text-gray-800 shadow-2xs">
              <div>
                <strong className="block text-base font-serif text-[var(--ink)]">
                  {page.festivalName}
                </strong>
                <div className="font-mono text-xs text-gray-700 mt-1 leading-relaxed">
                  OSZ Ebnit Gstaad<br />
                  Rumpleregässli 8<br />
                  3780 Gstaad<br />
                  Switzerland
                </div>
              </div>

              <div className="p-3.5 bg-amber-50/70 border-l-4 border-amber-500 rounded-r text-xs text-amber-900 leading-relaxed font-medium">
                <div className="flex items-center gap-1.5 font-bold mb-0.5">
                  <Info className="w-4 h-4 text-amber-600" />
                  {page.venueNoticeLabel}
                </div>
                {page.venueNoticeText}
              </div>
            </div>
          </div>

          {/* Section: Disclaimer */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2 flex items-center gap-2.5">
              <ShieldAlert className="w-5 h-5 text-[var(--gold)]" />
              <span>{page.disclaimerHeading}</span>
            </h2>
            <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
              <p>{page.disclaimerP1}</p>
              <p>{page.disclaimerP2}</p>
            </div>
          </div>

          {/* Section: External Links */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2 flex items-center gap-2.5">
              <ExternalLink className="w-5 h-5 text-[var(--gold)]" />
              <span>{page.linksHeading}</span>
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {page.linksText}
            </p>
          </div>

          {/* Section: Copyright & Permissions */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2 flex items-center gap-2.5">
              <Copyright className="w-5 h-5 text-[var(--gold)]" />
              <span>{page.copyrightHeading}</span>
            </h2>
            <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
              <p>
                <strong>{page.permissionsNotice.split(":")[0]}:</strong>{" "}
                {page.permissionsNotice.includes(":")
                  ? page.permissionsNotice.substring(page.permissionsNotice.indexOf(":") + 1).trim()
                  : page.permissionsNotice}
              </p>
              <p>{page.copyrightP1}</p>
              <p>{page.copyrightP2}</p>
            </div>
          </div>

          {/* Section: Data Protection */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[var(--gold)]" />
              <span>{page.dataProtectionHeading}</span>
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {page.dataProtectionP1}{" "}
              <Link href="/privacy" className="text-[var(--green)] font-semibold underline hover:text-[var(--gold)] transition-colors">
                {page.privacyPolicyLink}
              </Link>
              .{" "}
              <Link href="/cookie-policy" className="text-[var(--green)] font-semibold underline hover:text-[var(--gold)] transition-colors">
                {page.cookiePolicyLink}
              </Link>
              .
            </p>
          </div>

          {/* Section: Applicable Law */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2 flex items-center gap-2.5">
              <Scale className="w-5 h-5 text-[var(--gold)]" />
              <span>{page.applicableLawHeading}</span>
            </h2>
            <div className="p-6 bg-white rounded-lg border border-gray-200 space-y-2 text-sm text-gray-800 shadow-2xs">
              <p>{page.applicableLawText}</p>
              <div className="pt-3 border-t border-gray-100 text-xs text-gray-500 font-mono">
                {page.lastUpdatedText}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
