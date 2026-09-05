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

      <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2 text-[#b8b3a5]">
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
        <p className="text-xs text-[#9d9787] max-w-xl">
          {dict.footer.legalNotice}
        </p>
      </div>

      <div className="flex flex-col items-center md:items-end gap-3 text-xs text-[#9d9787]">
        <LanguageSwitcher variant="footer" />
        <span>{dict.footer.affiliated} · {dict.footer.copyright}</span>
      </div>
    </footer>
  );
}
