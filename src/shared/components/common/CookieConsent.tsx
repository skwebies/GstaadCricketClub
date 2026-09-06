"use client";

/**
 * @file CookieConsent.tsx
 * @description Swiss law compliant Cookie Consent banner (nDSG / FADP & TCA Art. 45c).
 * Provides clear transparency, essential-only or full acceptance, and allows users
 * to revisit and adjust their preferences via a global custom event.
 * @module shared/components/common
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Cookie, X } from "lucide-react";
import { useLanguage } from "@/shared/i18n/LanguageContext";

const STORAGE_KEY = "gcc_cookie_consent";

export function CookieConsent() {
  const { dict } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
      // Small timeout for smooth entrance animation after page load
      const timer = setTimeout(() => {
        setVisible(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Listen to custom event to re-open settings from the footer anytime
    const handleOpenSettings = () => {
      setVisible(true);
    };

    window.addEventListener("gcc-open-cookie-settings", handleOpenSettings);
    return () => {
      window.removeEventListener("gcc-open-cookie-settings", handleOpenSettings);
    };
  }, []);

  const saveConsent = (level: "all" | "essential") => {
    try {
      localStorage.setItem(STORAGE_KEY, level);
      // Also store lightweight cookie for 1 year
      document.cookie = `${STORAGE_KEY}=${level}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // Fallback if local storage restricted
    }
    setVisible(false);
  };

  if (!mounted || !visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={dict.cookieConsent.title}
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-[#0A1C15] text-[#FAFAF7] border border-[var(--gold)]/40 rounded-xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-md relative">
        {/* Close / Dismiss */}
        <button
          type="button"
          onClick={() => saveConsent("essential")}
          aria-label="Dismiss cookie notice"
          className="absolute top-3 right-3 text-[#9d9787] hover:text-[var(--gold)] p-1 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Gold Shield & Title */}
        <div className="flex items-center gap-2.5 mb-2.5 pr-6">
          <div className="w-7 h-7 rounded-full bg-[var(--gold)]/15 border border-[var(--gold)]/50 flex items-center justify-center shrink-0">
            <Cookie className="w-3.5 h-3.5 text-[var(--gold)]" />
          </div>
          <h3 className="font-serif text-base text-white font-normal tracking-wide">
            {dict.cookieConsent.title}
          </h3>
        </div>

        {/* Description Body */}
        <p className="text-xs text-[#c9c4b5] leading-relaxed mb-4">
          {dict.cookieConsent.description}
        </p>

        {/* Swiss Law Badge */}
        <div className="flex items-center gap-1.5 mb-4 text-[0.68rem] text-[var(--gold)] font-mono">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>Compliant with Swiss FADP / nDSG &amp; TCA Art. 45c</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1 border-t border-white/10">
          <button
            type="button"
            onClick={() => saveConsent("all")}
            className="w-full sm:w-auto flex-1 bg-[var(--gold)] hover:bg-[#b08d48] text-[var(--green-dark)] font-bold uppercase text-[0.72rem] tracking-wider py-2 px-3.5 rounded transition-all cursor-pointer text-center"
          >
            {dict.cookieConsent.acceptAll}
          </button>
          <button
            type="button"
            onClick={() => saveConsent("essential")}
            className="w-full sm:w-auto flex-1 border border-white/20 hover:border-[var(--gold)] text-white hover:text-[var(--gold)] font-medium text-[0.72rem] tracking-wider py-2 px-3 rounded transition-colors cursor-pointer text-center"
          >
            {dict.cookieConsent.essentialOnly}
          </button>
          <Link
            href="/cookie-policy"
            onClick={() => setVisible(false)}
            className="text-[0.72rem] text-[#9d9787] hover:text-[var(--gold)] underline underline-offset-2 py-1 px-1 transition-colors whitespace-nowrap"
          >
            {dict.cookieConsent.learnMore}
          </Link>
        </div>
      </div>
    </div>
  );
}
