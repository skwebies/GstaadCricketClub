"use client";

/**
 * @file privacy/page.tsx
 * @description Swiss law compliant Privacy Policy (Datenschutzerklärung)
 * in strict accordance with the Swiss Federal Act on Data Protection (nDSG / FADP)
 * and EU GDPR alignment for international visitors and participants.
 * @module app/(marketing)/privacy
 */

import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Lock,
  CheckCircle,
  Server,
  Mail,
  FileCheck,
  AlertCircle,
  Info,
  Globe2,
  Camera,
  UsersRound,
} from "lucide-react";
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

          <div className="mt-6 inline-flex items-center gap-2 text-xs text-[var(--gold)] font-mono bg-black/25 px-3.5 py-1.5 rounded-full border border-[var(--gold)]/30">
            <Shield className="w-3.5 h-3.5" />
            <span>Last updated: September 2026 · Swiss nFADP / nDSG (SR 235.1)</span>
          </div>
        </div>
      </section>

      {/* 2. LEGAL CONTENT BODY */}
      <section className="py-16 px-[8vw]">
        <div className="max-w-4xl mx-auto space-y-12 text-[var(--ink)] leading-relaxed">
          {/* Authoritative Language Notice */}
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Language Notice:</strong> This English text constitutes the official and authoritative Privacy Policy of Gstaad Cricket Club. Formal German and French translations are currently being finalized. Incomplete or automated machine translations are not displayed as final legal text.
            </div>
          </div>

          {/* Executive Overview Notice */}
          <div className="p-6 bg-[#F8F7F2] border-l-4 border-[var(--gold)] rounded-r-xl border-t border-r border-b border-[#E2DDD2] shadow-xs">
            <h3 className="font-serif text-lg font-bold text-[var(--green-dark)] mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[var(--gold)]" />
              Swiss Alpine Privacy Commitment
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-normal">
              Gstaad Cricket Club (GCC) is committed to protecting the privacy, personality rights, and fundamental freedoms of all attendees, members, and website visitors. We process personal data exclusively in compliance with the revised <strong>Swiss Federal Act on Data Protection (nDSG / FADP, SR 235.1)</strong> and the Data Protection Ordinance (DPO / VDSG, SR 235.11).
            </p>
          </div>

          {/* Section 1: Controller */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2">
              1. Identity of the Data Controller
            </h2>
            <p className="text-sm text-gray-700">
              The data controller responsible for personal data processing on this website and in connection with club operations is:
            </p>
            <div className="p-5 bg-white rounded-lg border border-gray-200 font-mono text-xs space-y-2 text-gray-800">
              <div>
                <div className="font-bold text-sm text-[var(--green-dark)] font-serif">Gstaad Cricket Club</div>
                <div className="text-gray-600">A Swiss sporting association established pursuant to Articles 60 et seq. of the Swiss Civil Code (ZGB). The club is not operated for profit.</div>
              </div>

              <div className="pt-2 border-t border-gray-100 space-y-0.5">
                <div className="font-bold text-gray-900 mb-0.5">Postal &amp; Official Address:</div>
                <div>Gstaad Cricket Club</div>
                <div>Undere Waldmattenstrasse 11</div>
                <div>3778 Schönried</div>
                <div>Switzerland</div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <div><strong>Legal Domicile:</strong> Municipality of Saanen, Canton of Bern, Switzerland</div>
                <div><strong>President:</strong> Sathya Narayanan</div>
                <div><strong>Treasurer:</strong> Linda Narayanan (Recorded in founding minutes)</div>
              </div>

              <div className="pt-2 border-t border-gray-100 space-y-1">
                <div>Telephone: <a href="tel:+41797862531" className="text-[var(--gold)] font-bold hover:underline">+41 79 786 25 31</a></div>
                <div>Email: <a href="mailto:info@gstaadcricketclub.ch" className="text-[var(--gold)] font-bold hover:underline">info@gstaadcricketclub.ch</a></div>
                <div>Official Website: <a href="https://www.gstaadcricketclub.ch" className="text-[var(--green)] hover:underline">https://www.gstaadcricketclub.ch</a></div>
              </div>

              <div className="pt-2 border-t border-gray-100 text-gray-600">
                <strong>Festival Venue Distinction:</strong> The OSZ Ebnit grounds (Rumpleregässli 8, 3780 Gstaad) serve exclusively as the sporting event venue. It is not the club&apos;s postal or legal domicile.
              </div>
            </div>
          </div>

          {/* Section 2: Categories of Personal Data Collected */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2">
              2. Categories of Personal Data Collected
            </h2>
            <p className="text-sm text-gray-700">
              In accordance with the principle of data minimization (Art. 6 para. 2 nFADP), we collect and process only the data strictly necessary for club sporting operations and safety:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                  <CheckCircle className="w-4 h-4" />
                  Festival Registrations
                </div>
                <p className="text-xs text-gray-600">
                  Full name, email address, telephone number, participation category (Individual, Family, Junior with Guardian, Group, VIP Patron), attending party size, emergency contact details, and optional dietary/accessibility notes.
                </p>
              </div>

              <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                  <UsersRound className="w-4 h-4" />
                  Minor Registrations (&lt; 18)
                </div>
                <p className="text-xs text-gray-600">
                  Parent / legal guardian full name, relationship to the child, explicit parental consent for athletic participation, and optional media consents.
                </p>
              </div>

              <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                  <CheckCircle className="w-4 h-4" />
                  Membership Inquiries
                </div>
                <p className="text-xs text-gray-600">
                  Full name, contact coordinates, selected membership tier (Adult, Junior, Family, Social Patron), cricketing background, and applicant notes.
                </p>
              </div>

              <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                  <Server className="w-4 h-4" />
                  Technical Telemetry &amp; Security Logs
                </div>
                <p className="text-xs text-gray-600">
                  Transient IP address evaluated in-memory for 10-minute sliding rate-limiting (not stored in the database), user-agent string, timestamp, and requested resource for DDoS mitigation and server stability.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Third-Party Service Providers & Technical Processors */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2 flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-[var(--gold)]" />
              <span>3. Disclosed Service Providers &amp; Technical Processors</span>
            </h2>
            <p className="text-sm text-gray-700">
              To operate the website, secure attendee registrations, and communicate with members, Gstaad Cricket Club engages specialized external service providers acting as processors under Art. 9 nFADP:
            </p>

            <div className="space-y-6">
              {/* Provider 1: Supabase */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-2xs space-y-3 text-xs sm:text-sm text-gray-800">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="font-bold font-serif text-base text-[var(--green-dark)]">
                    1. Supabase Inc. (Database &amp; Storage Infrastructure)
                  </div>
                  <span className="text-[0.65rem] uppercase font-mono px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded">
                    Frankfurt, Germany (EU)
                  </span>
                </div>
                <ul className="space-y-1.5 list-disc pl-5 text-xs text-gray-700">
                  <li><strong>Provider Identity:</strong> Supabase Inc., 970 Folsom Street, San Francisco, CA 94107, USA.</li>
                  <li><strong>Personal Data Transferred:</strong> Event attendee registration records (name, email, phone, party size, notes, emergency contact, guardian details), membership inquiry submissions, and administrative audit trails.</li>
                  <li><strong>Processing Purpose:</strong> Structured relational database persistence, attendee capacity counting, member management, and security audit logging.</li>
                  <li><strong>Storage &amp; Processing Location:</strong> Managed AWS cloud infrastructure located in <strong>Frankfurt, Germany (Region eu-central-1)</strong>.</li>
                  <li><strong>Retention Period:</strong> Festival registration data is retained through the event completion and post-event administrative review, after which it is archived or deleted. Active membership records are retained for the duration of membership plus statutory Swiss accounting retention periods (Art. 958f CO / OR).</li>
                  <li><strong>Cross-Border Transfer:</strong> Data is hosted in Germany (EU). Germany is recognized as an adequate jurisdiction under Annex 1 of the Swiss Data Protection Ordinance (DPO / VDSG).</li>
                  <li><strong>Safeguards &amp; Security Measures:</strong> PostgreSQL Row Level Security (RLS) policies isolating administrative access, AES-256 encryption at rest, TLS 1.3 encryption in transit, and EU Standard Contractual Clauses (SCCs).</li>
                </ul>
              </div>

              {/* Provider 2: Web3Forms */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-2xs space-y-3 text-xs sm:text-sm text-gray-800">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="font-bold font-serif text-base text-[var(--green-dark)]">
                    2. Web3Forms (Form Submission &amp; Mail Relay Service)
                  </div>
                  <span className="text-[0.65rem] uppercase font-mono px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded">
                    EU / USA (Encrypted Relay)
                  </span>
                </div>
                <ul className="space-y-1.5 list-disc pl-5 text-xs text-gray-700">
                  <li><strong>Provider Identity:</strong> Web3Forms (Operated by Liram Media).</li>
                  <li><strong>Personal Data Transferred:</strong> Contact message fields (sender name, email address, optional phone number, inquiry subject, message text, and submission timestamp).</li>
                  <li><strong>Processing Purpose:</strong> Form submission routing and spam-filtered email delivery relay dispatching inquiries to the official club inbox (<code>info@gstaadcricketclub.ch</code>).</li>
                  <li><strong>Storage &amp; Processing Location:</strong> Cloud infrastructure situated in the European Union and the United States.</li>
                  <li><strong>Retention Period:</strong> Web3Forms processes form content ephemerally for instant SMTP delivery. Delivery logs are retained temporarily for troubleshooting (maximum 30 days) and then permanently purged. Data is not used for profiling or marketing.</li>
                  <li><strong>Cross-Border Transfer:</strong> Transmission outside Switzerland is safeguarded by strict HTTPS TLS 1.3 transit encryption and Standard Contractual Clauses (SCCs).</li>
                  <li><strong>Safeguards:</strong> End-to-end TLS 1.3 transit encryption, spam filtering, and zero long-term retention.</li>
                </ul>
              </div>

              {/* Provider 3: Vercel Inc. */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-2xs space-y-3 text-xs sm:text-sm text-gray-800">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="font-bold font-serif text-base text-[var(--green-dark)]">
                    3. Vercel Inc. (Web Hosting &amp; Edge Delivery Network)
                  </div>
                  <span className="text-[0.65rem] uppercase font-mono px-2 py-0.5 bg-purple-50 text-purple-800 border border-purple-200 rounded">
                    Global Edge / European Nodes
                  </span>
                </div>
                <ul className="space-y-1.5 list-disc pl-5 text-xs text-gray-700">
                  <li><strong>Provider Identity:</strong> Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA.</li>
                  <li><strong>Personal Data Transferred:</strong> HTTP request metadata, transient IP address, browser user-agent, requested page URLs.</li>
                  <li><strong>Processing Purpose:</strong> Static asset delivery, Next.js serverless execution, and DDoS mitigation.</li>
                  <li><strong>Storage &amp; Processing Location:</strong> Edge server locations with European compute routing (Frankfurt / Zurich / London).</li>
                  <li><strong>Retention Period:</strong> Technical server access logs are retained for up to 30 days strictly for operational reliability and security diagnostics.</li>
                  <li><strong>Cross-Border Transfer:</strong> Covered by Swiss-US Data Privacy Framework certification and Standard Contractual Clauses (SCCs).</li>
                  <li><strong>Safeguards:</strong> TLS 1.3 encryption, automatic DDoS defense, and SOC 2 Type II compliance.</li>
                </ul>
              </div>

              {/* Provider 4: Club Mail Server */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-2xs space-y-3 text-xs sm:text-sm text-gray-800">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="font-bold font-serif text-base text-[var(--green-dark)]">
                    4. Club Mail Server / SMTP Service
                  </div>
                  <span className="text-[0.65rem] uppercase font-mono px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded">
                    Switzerland / Europe
                  </span>
                </div>
                <ul className="space-y-1.5 list-disc pl-5 text-xs text-gray-700">
                  <li><strong>Personal Data Transferred:</strong> Sender and recipient email addresses, participant name, event confirmation text.</li>
                  <li><strong>Processing Purpose:</strong> Direct transactional confirmation email dispatch to attendees and administrative notification alerts to club officers.</li>
                  <li><strong>Retention Period:</strong> Mail server queues retain delivery records for up to 90 days for operational reliability.</li>
                  <li><strong>Safeguards:</strong> Encrypted mail transmission via TLS 1.3 / STARTTLS (Port 465 SSL).</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 4: Technical Security Claims Verification */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[var(--gold)]" />
              <span>4. Technical Privacy Verification &amp; Security Controls</span>
            </h2>
            <p className="text-sm text-gray-700">
              In accordance with the principle of truth in privacy disclosures, we state the exact technical verification of our architecture:
            </p>
            <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-3 text-xs sm:text-sm text-gray-700">
              <div className="flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <strong>Frankfurt (EU) Data Hosting:</strong> Primary relational databases are provisioned in AWS Frankfurt (Region eu-central-1), fully within the European economic area and recognized as an adequate jurisdiction under Swiss law.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <strong>IP Address Handling &amp; Non-Persistence:</strong> Raw client IP addresses are evaluated exclusively in temporary server RAM for sliding-window rate limiting (10-minute duration) to neutralize brute-force attacks and DDoS vectors. IP addresses are <em>never</em> persisted in the relational registration database.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <strong>PostgreSQL Row Level Security (RLS):</strong> Granular RLS policies are enabled on all database tables to prevent unauthorized data access or privilege escalation.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <strong>Transport Layer Security (TLS 1.3):</strong> All network traffic across web clients, edge nodes, and database connections is secured via mandatory HTTPS and TLS 1.3 encryption.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <strong>International Transfers:</strong> We do not transfer personal data to any country lacking adequate data protection safeguards without standard contractual clauses or explicit statutory exemptions under Art. 16 nFADP.
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Minor Protection & Parental Consent */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2 flex items-center gap-2">
              <UsersRound className="w-5 h-5 text-[var(--gold)]" />
              <span>5. Protection of Minors (&lt; 18) &amp; Parental Consent</span>
            </h2>
            <p className="text-sm text-gray-700">
              The safety and privacy of young participants is paramount to Gstaad Cricket Club:
            </p>
            <ul className="list-disc pl-5 text-xs sm:text-sm text-gray-700 space-y-2">
              <li>
                <strong>Mandatory Guardian Consent:</strong> Any registration involving a person under 18 years of age requires the provision of the parent or legal guardian&apos;s name and explicit confirmation of consent for athletic participation.
              </li>
              <li>
                <strong>Unbundled Consent Options:</strong> Consents for child participation, emergency medical information, and media publication are presented as distinct, unbundled choices.
              </li>
              <li>
                <strong>Optional Photography Consent:</strong> Consent for photography, filming, and publication on the website or social media is entirely optional. Withholding photography consent does not restrict a child&apos;s participation in cricket sessions or festival activities in any manner.
              </li>
            </ul>
          </div>

          {/* Section 6: Permissions for Donors, Sponsors, Photos & Cricket Switzerland */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2 flex items-center gap-2">
              <Camera className="w-5 h-5 text-[var(--gold)]" />
              <span>6. Permissions Notice: Donors, Sponsors, Photographs &amp; Federation Branding</span>
            </h2>
            <div className="p-5 bg-white rounded-lg border border-gray-200 space-y-2 text-xs sm:text-sm text-gray-700">
              <p>
                <strong>Prior Permission Required:</strong> Donor names, corporate sponsor logos, club photographs, and Cricket Switzerland federation branding are published on this website exclusively with prior explicit permission and consent from the respective individuals, partner entities, and governing bodies.
              </p>
              <p>
                Any individual or sponsor wishing to update, modify, or revoke permission regarding published names, logos, or photographic likenesses may do so at any time by contacting <a href="mailto:info@gstaadcricketclub.ch" className="text-[var(--gold)] font-bold hover:underline">info@gstaadcricketclub.ch</a>.
              </p>
            </div>
          </div>

          {/* Section 7: Data Retention & Erasure Schedules */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2">
              7. Data Retention &amp; Erasure Schedules
            </h2>
            <p className="text-sm text-gray-700">
              Personal data is retained only for the duration necessary to achieve the stated purpose:
            </p>
            <ul className="list-disc pl-5 text-xs sm:text-sm text-gray-700 space-y-2">
              <li><strong>Festival Reservations:</strong> Retained until the conclusion of the Gstaad Cricket Festival 2026 and subsequent administrative wrap-up, after which they are archived or deleted.</li>
              <li><strong>Membership Records:</strong> Retained for the duration of the member&apos;s active affiliation with GCC, plus statutory retention periods required by Swiss accounting law (Art. 958f CO / OR, 10 years).</li>
              <li><strong>General Inquiries:</strong> Deleted within 12 months of resolution unless ongoing correspondence requires continuation.</li>
            </ul>
          </div>

          {/* Section 8: Your Rights under Swiss Law */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2">
              8. Your Rights under Swiss Law (Art. 25–32 nDSG)
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
              To exercise any of these rights, email our committee at <a href="mailto:info@gstaadcricketclub.ch" className="text-[var(--gold)] font-bold hover:underline">info@gstaadcricketclub.ch</a>. Requests are fulfilled free of charge within 30 days.
            </p>
          </div>

          {/* Section 9: Supervisory Authority */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2">
              9. Swiss Supervisory Authority
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
