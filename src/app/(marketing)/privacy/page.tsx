"use client";

/**
 * @file privacy/page.tsx
 * @description Swiss law compliant Privacy Policy (Datenschutzerklärung)
 * in strict accordance with the Swiss Federal Act on Data Protection (nDSG / FADP)
 * and EU GDPR alignment for international visitors and participants.
 * @module app/(marketing)/privacy
 */

import Link from "next/link";
import { ArrowLeft, Shield, Lock, FileText, CheckCircle, HelpCircle } from "lucide-react";
import { useLanguage } from "@/shared/i18n/LanguageContext";

export default function PrivacyPolicyPage() {
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
            {dict.legal.privacyKicker}
          </span>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4.2rem)] leading-[1.05] font-normal text-white mb-4">
            {dict.legal.privacyTitle}
          </h1>
          <p className="text-[#e8e2d2] text-base md:text-lg max-w-3xl leading-relaxed">
            {dict.legal.privacySubtitle}
          </p>

          <div className="mt-6 inline-flex items-center gap-2 text-xs text-[var(--gold)] font-mono bg-black/25 px-3 py-1.5 rounded-full border border-[var(--gold)]/30">
            <Shield className="w-3.5 h-3.5" />
            <span>{dict.legal.lastUpdated} · Swiss nFADP / nDSG (RS 235.1)</span>
          </div>
        </div>
      </section>

      {/* 2. LEGAL CONTENT BODY */}
      <section className="py-16 px-[8vw]">
        <div className="max-w-4xl mx-auto space-y-12 text-[var(--ink)] leading-relaxed">
          {/* Executive Overview Notice */}
          <div className="p-6 bg-[#F8F7F2] border-l-4 border-[var(--gold)] rounded-r-xl border-t border-r border-b border-[#E2DDD2] shadow-xs">
            <h3 className="font-serif text-lg font-bold text-[var(--green-dark)] mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[var(--gold)]" />
              Swiss Alpine Privacy Commitment
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-normal">
              Gstaad Cricket Club (GCC) is committed to protecting the privacy and fundamental rights of all attendees, members, and website visitors. We process personal data exclusively in compliance with the revised <strong>Swiss Federal Act on Data Protection (nDSG / FADP)</strong> and applicable international principles.
            </p>
          </div>

          {/* Section 1: Controller */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2">
              1. Identity of the Data Controller
            </h2>
            <p className="text-sm text-gray-700">
              The data controller responsible for the processing of personal data on this website and in connection with club operations is:
            </p>
            <div className="p-5 bg-white rounded-lg border border-gray-200 font-mono text-xs space-y-1 text-gray-800">
              <div className="font-bold text-sm text-[var(--green-dark)] font-serif">Gstaad Cricket Club (GCC)</div>
              <div>Non-Profit Sporting Association (Verein nach Art. 60ff. ZGB)</div>
              <div>Ebnit School Grounds, Ebnitstrasse 28, 3780 Gstaad, Switzerland</div>
              <div>Affiliation: Cricket Switzerland</div>
              <div>Electronic Contact: <a href="mailto:info@gstaadcricketclub.ch" className="text-[var(--gold)] font-bold hover:underline">info@gstaadcricketclub.ch</a></div>
              <div>Official Website: <a href="https://gstaadcricketclub.ch" className="text-[var(--green)] hover:underline">https://gstaadcricketclub.ch</a></div>
            </div>
          </div>

          {/* Section 2: Categories of Data */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2">
              2. Categories of Personal Data Collected
            </h2>
            <p className="text-sm text-gray-700">
              We collect and process only the minimum personal data strictly necessary to fulfill our sporting and association mission:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                  <CheckCircle className="w-4 h-4" />
                  Festival Reservations
                </div>
                <p className="text-xs text-gray-600">
                  Full name, email address, telephone number, attending party/group size, dietary or accessibility notes, and emergency contact details for attendee safety at Ebnit School Pitch.
                </p>
              </div>

              <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                  <CheckCircle className="w-4 h-4" />
                  Membership Applications
                </div>
                <p className="text-xs text-gray-600">
                  Full name, contact coordinates, selected membership category (Adult, Youth, Family, VIP Patron), cricketing background, and applicant notes.
                </p>
              </div>

              <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                  <CheckCircle className="w-4 h-4" />
                  General Inquiries
                </div>
                <p className="text-xs text-gray-600">
                  Name, email address, inquiry subject, message text, and optional client IP for anti-spam transmission verification.
                </p>
              </div>

              <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                  <CheckCircle className="w-4 h-4" />
                  Technical Telemetry
                </div>
                <p className="text-xs text-gray-600">
                  Anonymized server log entries (IP address truncated, user-agent string, timestamp, requested resource) strictly for DDoS prevention, rate limiting, and server stability.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Legal Basis under Swiss Law */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2">
              3. Legal Basis for Processing (Art. 6 &amp; Art. 31 nFADP)
            </h2>
            <p className="text-sm text-gray-700">
              In accordance with the Swiss Federal Act on Data Protection (nDSG), personal data is processed lawfully and proportionately based on:
            </p>
            <ul className="list-disc pl-5 text-xs sm:text-sm text-gray-700 space-y-2">
              <li>
                <strong>Consent (Art. 6 para. 6 nFADP):</strong> Given voluntarily when submitting festival reservations, membership inquiries, or contact forms.
              </li>
              <li>
                <strong>Contractual &amp; Statutory Execution (Art. 31 para. 2 lit. a nFADP):</strong> Necessary for managing association memberships, issuing admission confirmations, and organizing matches.
              </li>
              <li>
                <strong>Legitimate Club Interests (Art. 31 para. 1 nFADP):</strong> Safeguarding sporting safety, securing website infrastructure against abuse, and maintaining statutory audit logs.
              </li>
            </ul>
          </div>

          {/* Section 4: Data Storage & Hosting Location */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2">
              4. Data Hosting &amp; Storage Architecture
            </h2>
            <p className="text-sm text-gray-700">
              We prioritize data sovereignty and local infrastructure:
            </p>
            <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-3 text-xs sm:text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <strong>Database Infrastructure:</strong> Managed Supabase PostgreSQL provisioned in high-security European data center regions (Zurich, Switzerland / Frankfurt, Germany) enforcing strict Row Level Security (RLS) policies.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <strong>Mail &amp; Web Hosting:</strong> Dedicated VPS located in modern European facilities with encrypted TLS 1.3 transmission for all inbound and outbound email correspondence.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <strong>No Cross-Border Sale:</strong> Personal data is never sold, leased, or transferred to non-adequate jurisdictions without statutory data transfer agreements.
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Data Retention */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2">
              5. Data Retention &amp; Erasure Schedules
            </h2>
            <p className="text-sm text-gray-700">
              Personal data is retained only for the duration necessary to achieve the stated purpose:
            </p>
            <ul className="list-disc pl-5 text-xs sm:text-sm text-gray-700 space-y-2">
              <li><strong>Festival Reservations:</strong> Retained until the conclusion of the Gstaad Cricket Festival 2026 and subsequent administrative wrap-up, after which they are archived or deleted.</li>
              <li><strong>Membership Records:</strong> Retained for the duration of the member&apos;s active affiliation with GCC, plus statutory retention periods required by Swiss accounting law (Art. 958f CO / OR).</li>
              <li><strong>General Inquiries:</strong> Deleted within 12 months of resolution unless ongoing correspondence requires continuation.</li>
            </ul>
          </div>

          {/* Section 6: Data Subject Rights */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2">
              6. Your Rights under Swiss Law (Art. 25–32 nDSG)
            </h2>
            <p className="text-sm text-gray-700">
              Under the Swiss Federal Act on Data Protection, you hold comprehensive rights regarding your personal data:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white border border-gray-200 rounded">
                <strong>Right to Information (Art. 25 nDSG):</strong> You can request confirmation whether we process personal data relating to you and obtain a copy.
              </div>
              <div className="p-3 bg-white border border-gray-200 rounded">
                <strong>Right to Rectification (Art. 32 nDSG):</strong> You may demand correction of any inaccurate or incomplete personal data.
              </div>
              <div className="p-3 bg-white border border-gray-200 rounded">
                <strong>Right to Deletion (Art. 32 nDSG):</strong> You have the right to request erasure of your data when processing is no longer warranted.
              </div>
              <div className="p-3 bg-white border border-gray-200 rounded">
                <strong>Right to Data Portability (Art. 28 nDSG):</strong> You may request your data in a commonly used, machine-readable format.
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              To exercise any of these rights, simply email our committee at <a href="mailto:info@gstaadcricketclub.ch" className="text-[var(--gold)] font-bold hover:underline">info@gstaadcricketclub.ch</a>. Requests are fulfilled free of charge within 30 days.
            </p>
          </div>

          {/* Section 7: Supervisory Authority */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2">
              7. Swiss Supervisory Authority
            </h2>
            <p className="text-sm text-gray-700">
              If you believe our processing of your personal data violates Swiss privacy legislation, you have the right to lodge a complaint with the competent Swiss supervisory authority:
            </p>
            <div className="p-4 bg-white rounded border border-gray-200 font-mono text-xs text-gray-800 space-y-1">
              <div className="font-bold font-serif text-sm text-[var(--green-dark)]">
                Federal Data Protection and Information Commissioner (FDPIC / EDÖB)
              </div>
              <div>Eidgenössischer Datenschutz- und Öffentlichkeitsbeauftragter</div>
              <div>Feldeggweg 1, CH-3003 Bern, Switzerland</div>
              <div>Website: <a href="https://www.edoeb.admin.ch" target="_blank" rel="noopener noreferrer" className="text-[var(--green)] hover:underline">www.edoeb.admin.ch</a></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
