"use client";

/**
 * @file Footer.tsx
 * @description Swiss luxury footer with localized navigation links, language selector,
 * non-profit legal status acknowledgment, and Swiss sports federation affiliation.
 * @module shared/components/marketing
 */

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/shared/i18n/LanguageContext";
import { LanguageSwitcher } from "@/shared/components/common/LanguageSwitcher";

export function Footer() {
  const { dict } = useLanguage();

  return (
    <footer className="bg-[var(--green-dark)] text-[#d8d4c7] min-h-[170px] py-12 px-[6vw] flex flex-col md:flex-row items-center justify-between gap-8 text-[0.85rem] border-t border-white/5">
      <Link href="/" className="brand flex items-center gap-3 text-[var(--cream)] group">
        <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-105">
          <Image
            src="/gstaad-cricket-club-crest.png"
            alt="Gstaad Cricket Club Crest"
            fill
            sizes="48px"
            className="object-contain"
          />
        </div>
        <span className="grid leading-none">
          <strong className="font-serif text-[1.15rem] tracking-wide text-white">GSTAAD</strong>
          <small className="tracking-[0.22em] mt-1 text-[0.62rem] text-[var(--gold)] font-bold">
            CRICKET CLUB
          </small>
        </span>
      </Link>

      <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2.5 text-[#b8b3a5]">
        <p>
          {dict.footer.brandTagline} ·{" "}
          <Link href="/about" className="text-[var(--gold)] hover:underline">
            {dict.footer.aboutUs}
          </Link>{" "}
          ·{" "}
          <Link href="/committee" className="text-[var(--gold)] hover:underline">
            {dict.footer.committee}
          </Link>{" "}
          ·{" "}
          <Link href="/membership" className="text-[var(--gold)] hover:underline">
            {dict.footer.membership}
          </Link>{" "}
          ·{" "}
          <Link href="/admin" className="text-[var(--gold)] hover:underline">
            {dict.footer.adminPortal}
          </Link>
        </p>

        {/* Legal Links Bar */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-2.5 gap-y-1 text-xs text-[#9d9787]">
          <Link href="/privacy" className="hover:text-[var(--gold)] transition-colors">
            {dict.footer.privacyPolicy}
          </Link>
          <span>·</span>
          <Link href="/terms" className="hover:text-[var(--gold)] transition-colors">
            {dict.footer.termsConditions}
          </Link>
          <span>·</span>
          <Link href="/cookie-policy" className="hover:text-[var(--gold)] transition-colors">
            {dict.footer.cookiePolicy}
          </Link>
          <span>·</span>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("gcc-open-cookie-settings"));
              }
            }}
            className="hover:text-[var(--gold)] transition-colors cursor-pointer underline-offset-2 hover:underline"
          >
            {dict.footer.cookieSettings}
          </button>
        </div>

        <p className="text-xs text-[#8c8676] max-w-xl">
          {dict.footer.legalNotice}
        </p>
      </div>

      <div className="flex flex-col items-center md:items-end gap-2.5 text-xs text-[#9d9787]">
        <LanguageSwitcher variant="footer" />
        <span>{dict.footer.affiliated} · {dict.footer.copyright}</span>
        <div className="flex items-center gap-1.5 text-[0.8rem] pt-0.5">
          <span>{dict.footer.poweredBy}</span>
          <a
            href="https://popcorndigital.ch"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--gold)] hover:underline font-bold transition-colors inline-flex items-center gap-0.5"
            title="Popcorn Digital (opens in new tab)"
          >
            Popcorn Digital
            <span className="text-[10px] opacity-80 ml-0.5">↗</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
