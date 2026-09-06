"use client";

/**
 * @file terms/page.tsx
 * @description Terms & Conditions (Allgemeine Geschäftsbedingungen / AGB & Statuten)
 * based on Swiss Law: Swiss Code of Obligations (CO / OR) and Swiss Civil Code (ZGB Art. 60ff).
 * @module app/(marketing)/terms
 */

import Link from "next/link";
import { ArrowLeft, Scale, ShieldAlert, BookOpen, MapPin, Award } from "lucide-react";
import { useLanguage } from "@/shared/i18n/LanguageContext";

export default function TermsAndConditionsPage() {
  const { dict } = useLanguage();

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
            {dict.legal.termsKicker}
          </span>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4.2rem)] leading-[1.05] font-normal text-white mb-4">
            {dict.legal.termsTitle}
          </h1>
          <p className="text-[#e8e2d2] text-base md:text-lg max-w-3xl leading-relaxed">
            {dict.legal.termsSubtitle}
          </p>

          <div className="mt-6 inline-flex items-center gap-2 text-xs text-[var(--gold)] font-mono bg-black/25 px-3 py-1.5 rounded-full border border-[var(--gold)]/30">
            <Scale className="w-3.5 h-3.5" />
            <span>{dict.legal.lastUpdated} · Swiss Code of Obligations (SR 220) &amp; CC Art. 60ff.</span>
          </div>
        </div>
      </section>

      {/* 2. LEGAL TERMS CONTENT */}
      <section className="py-16 px-[8vw]">
        <div className="max-w-4xl mx-auto space-y-12 text-[var(--ink)] leading-relaxed">
          {/* Association Status Box */}
          <div className="p-6 bg-[#F8F7F2] border-l-4 border-[var(--gold)] rounded-r-xl border-t border-r border-b border-[#E2DDD2] shadow-xs">
            <h3 className="font-serif text-lg font-bold text-[var(--green-dark)] mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[var(--gold)]" />
              Swiss Non-Profit Association (Verein)
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-normal">
              Gstaad Cricket Club (GCC) is constituted as a non-profit association pursuant to <strong>Articles 60 to 79 of the Swiss Civil Code (ZGB)</strong>, domiciled in Saanen/Gstaad, Canton of Bern, Switzerland. The club operates in full accordance with its adopted statutes and Swiss association law.
            </p>
          </div>

          {/* Section 1: Scope */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2">
              1. Scope &amp; Application
            </h2>
            <p className="text-sm text-gray-700">
              These Terms &amp; Conditions govern the use of the official website (<a href="https://gstaadcricketclub.ch" className="text-[var(--green)] hover:underline">gstaadcricketclub.ch</a>), registration and attendance at the annual Gstaad Cricket Festival, membership applications, and all associated sporting engagements organized by the Gstaad Cricket Club.
            </p>
            <p className="text-sm text-gray-700">
              By reserving a place, submitting an inquiry, or applying for membership, you accept these terms unconditionally.
            </p>
          </div>

          {/* Section 2: Festival Reservations & Admission */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2">
              2. Festival Attendance &amp; Venue Guidelines
            </h2>
            <p className="text-sm text-gray-700">
              The Gstaad Cricket Festival 2026 is hosted as a free community celebration at the OSZ Ebnit Grounds (Rumpleregässli 8, 3780 Gstaad). The following rules apply:
            </p>
            <ul className="list-disc pl-5 text-xs sm:text-sm text-gray-700 space-y-2">
              <li>
                <strong>Admission:</strong> General spectator admission is complimentary. Seat reservations and hospitality packages are subject to venue capacity limits set by local Saanen municipal guidelines.
              </li>
              <li>
                <strong>Ground Regulations:</strong> All attendees must observe instructions issued by the GCC committee, match officials, and ground stewards. Spectators must remain outside marked playing boundaries (boundary ropes).
              </li>
              <li>
                <strong>Weather Adjustments:</strong> Alpine cricket is subject to mountain weather conditions. In the event of heavy rain or pitch unsuitability, the committee reserves the right to modify the schedule or relocate exhibition matches.
              </li>
            </ul>
          </div>

          {/* Section 3: Sporting Liability Disclaimer (Art. 100 OR) */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <span>3. Assumption of Sporting Risk &amp; Liability Waiver (Art. 100 OR)</span>
            </h2>
            <div className="p-5 bg-amber-50/70 border border-amber-200 rounded-lg text-xs sm:text-sm text-gray-800 space-y-3">
              <p>
                <strong>Sporting Hazard Notice:</strong> Cricket is an active outdoor sport utilizing solid leather balls travelling at high velocity. Spectators and participants acknowledge that attendance involves inherent sporting risks, including balls hit into spectator areas.
              </p>
              <p>
                <strong>Exclusion of Liability:</strong> To the maximum extent permissible under <strong>Article 100, Paragraph 1 of the Swiss Code of Obligations (CO / OR)</strong>, Gstaad Cricket Club, its committee members, players, and volunteers exclude any liability for bodily injury, property damage, or financial loss resulting from minor or ordinary negligence.
              </p>
              <p>
                <strong>Insurance Obligation:</strong> Every participant and spectator is solely responsible for maintaining adequate personal accident, health, and third-party liability insurance valid in Switzerland (KVG / UVG or travel medical cover).
              </p>
            </div>
          </div>

          {/* Section 4: Membership Regulations */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2">
              4. Association Membership &amp; Dues
            </h2>
            <p className="text-sm text-gray-700">
              Applications for club membership (Adult, Youth, Family, or Patron) are reviewed and approved by the Club Committee in accordance with GCC Statutes:
            </p>
            <ul className="list-disc pl-5 text-xs sm:text-sm text-gray-700 space-y-2">
              <li>Membership is granted upon committee ratification and settlement of annual membership dues.</li>
              <li>Members are entitled to participate in coaching clinics, social fixtures, and annual general meetings.</li>
              <li>Resignation from membership must be communicated in writing prior to the end of the club fiscal year.</li>
            </ul>
          </div>

          {/* Section 5: Intellectual Property */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2">
              5. Intellectual Property &amp; Trademarks
            </h2>
            <p className="text-sm text-gray-700">
              The official Gstaad Cricket Club crest, club name, domain, graphics, photographs, and digital assets are the exclusive intellectual property of Gstaad Cricket Club. Any unauthorized commercial reproduction, modification, or distribution without prior written consent is prohibited.
            </p>
          </div>

          {/* Section 6: Governing Law & Jurisdiction */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2">
              6. Applicable Law &amp; Place of Jurisdiction
            </h2>
            <div className="p-5 bg-white rounded-lg border border-gray-200 space-y-2 text-xs sm:text-sm text-gray-800">
              <p>
                <strong>Swiss Law Governs:</strong> These terms, and all legal relationships between Gstaad Cricket Club and attendees or members, are subject exclusively to <strong>Swiss substantive law</strong> (schweizerisches materielles Recht), excluding conflict-of-law principles (IPRG) and the UN Convention on Contracts for the International Sale of Goods (CISG).
              </p>
              <p>
                <strong>Exclusive Jurisdiction:</strong> The exclusive place of jurisdiction for all disputes arising from or in connection with club activities or this website is <strong>Saanen / Bern, Switzerland</strong> (Gerichtsstand Saanen bzw. Bern).
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
