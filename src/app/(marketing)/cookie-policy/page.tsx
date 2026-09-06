"use client";

/**
 * @file cookie-policy/page.tsx
 * @description Swiss law compliant Cookie Policy (Cookie-Richtlinie)
 * under the Swiss Telecommunications Act (TCA / FMG Art. 45c) and Swiss nFADP.
 * @module app/(marketing)/cookie-policy
 */

import Link from "next/link";
import { ArrowLeft, Cookie, ShieldCheck, Check, Settings, Info } from "lucide-react";
import { useLanguage } from "@/shared/i18n/LanguageContext";

export default function CookiePolicyPage() {
  const { dict } = useLanguage();

  const handleOpenCookieSettings = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("gcc-open-cookie-settings"));
    }
  };

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
            {dict.legal.cookiesKicker}
          </span>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4.2rem)] leading-[1.05] font-normal text-white mb-4">
            {dict.legal.cookiesTitle}
          </h1>
          <p className="text-[#e8e2d2] text-base md:text-lg max-w-3xl leading-relaxed">
            {dict.legal.cookiesSubtitle}
          </p>

          <div className="mt-6 inline-flex items-center gap-2 text-xs text-[var(--gold)] font-mono bg-black/25 px-3 py-1.5 rounded-full border border-[var(--gold)]/30">
            <Cookie className="w-3.5 h-3.5" />
            <span>{dict.legal.lastUpdated} · Swiss TCA Art. 45c &amp; FADP</span>
          </div>
        </div>
      </section>

      {/* 2. COOKIE POLICY CONTENT */}
      <section className="py-16 px-[8vw]">
        <div className="max-w-4xl mx-auto space-y-12 text-[var(--ink)] leading-relaxed">
          {/* Transparency Summary Banner */}
          <div className="p-6 bg-[#F8F7F2] border-l-4 border-[var(--gold)] rounded-r-xl border-t border-r border-b border-[#E2DDD2] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[var(--green-dark)] mb-1 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Privacy-First Architecture
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 leading-normal max-w-2xl">
                We believe in digital dignity. Gstaad Cricket Club uses strictly necessary cookies to remember your language, keep administrative logins secure, and protect against bot attacks. We do <strong>not</strong> track you across other websites.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenCookieSettings}
              className="inline-flex items-center gap-2 bg-[var(--green-dark)] hover:bg-[var(--green)] text-white text-xs uppercase font-extrabold tracking-wider px-4 py-2.5 rounded transition-colors cursor-pointer shrink-0 whitespace-nowrap shadow-xs"
            >
              <Settings className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>Configure Preferences</span>
            </button>
          </div>

          {/* Section 1: What Are Cookies */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2">
              1. What Are Cookies &amp; Local Terminal Storage?
            </h2>
            <p className="text-sm text-gray-700">
              Cookies are small text identifiers placed in your browser when you visit a website. Under <strong>Article 45c of the Swiss Telecommunications Act (TCA / FMG)</strong> and the Swiss Federal Act on Data Protection (nDSG), website operators must inform users about the purpose and scope of any data stored on or accessed from their terminal equipment.
            </p>
          </div>

          {/* Section 2: Complete Cookie Inventory Table */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2">
              2. Inventory of Cookies Used on This Website
            </h2>
            <p className="text-sm text-gray-700">
              Below is the comprehensive list of all cookies and browser storage keys utilized on <span className="font-mono text-xs">gstaadcricketclub.ch</span>:
            </p>

            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-xs bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8F7F2] text-[var(--green-dark)] font-bold border-b border-gray-200">
                    <th className="p-3">Key / Cookie Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Purpose</th>
                    <th className="p-3">Provider</th>
                    <th className="p-3">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr>
                    <td className="p-3 font-mono font-bold text-gray-900">gcc_lang</td>
                    <td className="p-3">
                      <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        Strictly Necessary
                      </span>
                    </td>
                    <td className="p-3">Remembers your selected language (English, German, French) across pages.</td>
                    <td className="p-3 font-mono text-[11px]">gstaadcricketclub.ch</td>
                    <td className="p-3">1 Year</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-gray-900">gcc_cookie_consent</td>
                    <td className="p-3">
                      <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        Strictly Necessary
                      </span>
                    </td>
                    <td className="p-3">Stores your consent preference (&quot;all&quot; or &quot;essential&quot;).</td>
                    <td className="p-3 font-mono text-[11px]">gstaadcricketclub.ch</td>
                    <td className="p-3">1 Year</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-gray-900">sb-*-auth-token</td>
                    <td className="p-3">
                      <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        Authentication
                      </span>
                    </td>
                    <td className="p-3">Maintains encrypted admin session state for authorized committee officers.</td>
                    <td className="p-3 font-mono text-[11px]">Supabase Auth</td>
                    <td className="p-3">Session / 30 Days</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-gray-900">rate_limit / honeypot</td>
                    <td className="p-3">
                      <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        Security
                      </span>
                    </td>
                    <td className="p-3">Protects registration and contact forms against automated spam bots.</td>
                    <td className="p-3 font-mono text-[11px]">Internal Middleware</td>
                    <td className="p-3">Transient / In-Memory</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Third-Party Profiling Guarantee */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2">
              3. Absence of Third-Party Advertising Trackers
            </h2>
            <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-3 text-xs sm:text-sm text-gray-700">
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><strong>No Commercial Advertising Pixels:</strong> We do not load Meta Pixels, Google Ads, TikTok beacons, or marketing retargeting cookies.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><strong>No Cross-Site Profiling:</strong> Your browsing activity on our website is never tied to advertising profiles or shared with data brokers.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><strong>Self-Hosted Assets:</strong> Club crests, fonts, and styles are served directly from our Swiss/European hosting infrastructure.</span>
              </div>
            </div>
          </div>

          {/* Section 4: Browser Management */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[var(--green-dark)] font-normal border-b border-gray-200 pb-2">
              4. Managing &amp; Deleting Cookies in Your Browser
            </h2>
            <p className="text-sm text-gray-700">
              You can configure your browser to block or delete cookies at any time. Consult your browser&apos;s documentation:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <a
                href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white border border-gray-200 rounded text-center hover:border-[var(--gold)] transition-colors"
              >
                Apple Safari
              </a>
              <a
                href="https://support.google.com/chrome/answer/95647"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white border border-gray-200 rounded text-center hover:border-[var(--gold)] transition-colors"
              >
                Google Chrome
              </a>
              <a
                href="https://support.mozilla.org/kb/cookies-information-websites-store-on-your-computer"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white border border-gray-200 rounded text-center hover:border-[var(--gold)] transition-colors"
              >
                Mozilla Firefox
              </a>
              <a
                href="https://support.microsoft.com/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white border border-gray-200 rounded text-center hover:border-[var(--gold)] transition-colors"
              >
                Microsoft Edge
              </a>
            </div>
            <p className="text-xs text-gray-500">
              Please note that disabling strictly necessary cookies may prevent language preferences and administrative logins from functioning correctly.
            </p>
          </div>

          {/* Section 5: Inquiries & Privacy Contact */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm font-bold text-[var(--green-dark)]">
              <Info className="w-4 h-4 text-[var(--gold)]" />
              <span>Questions Regarding Our Cookie Practices</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-700">
              For any questions regarding our cookie implementation or Swiss data protection practices, reach out to the Gstaad Cricket Club Committee at <a href="mailto:info@gstaadcricketclub.ch" className="text-[var(--gold)] font-bold hover:underline">info@gstaadcricketclub.ch</a> or review our <Link href="/privacy" className="text-[var(--green)] hover:underline font-semibold">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
