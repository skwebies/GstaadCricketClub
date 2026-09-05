"use client";

/**
 * @file Header.tsx
 * @description Sticky glassmorphism header featuring the Gstaad Cricket Club crest,
 * localized navigation links, language switcher (EN/DE/FR), and responsive mobile drawer.
 * @module shared/components/marketing
 */

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Shield } from "lucide-react";
import { useLanguage } from "@/shared/i18n/LanguageContext";
import { LanguageSwitcher } from "@/shared/components/common/LanguageSwitcher";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { dict } = useLanguage();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="site-header z-30 w-full h-[88px] text-[var(--cream)] flex items-center justify-between px-[5vw] absolute top-0 left-0">
      <Link href="/" className="brand flex items-center gap-3 tracking-[0.08em] group">
        <div className="relative w-[54px] h-[54px] transition-transform duration-300 group-hover:scale-105">
          <Image
            src="/gstaad-cricket-club-crest.png"
            alt="Gstaad Cricket Club Crest"
            fill
            sizes="58px"
            priority
            className="object-contain"
          />
        </div>
        <span className="grid leading-none">
          <strong className="font-serif text-[1.25rem] tracking-wide text-white">{dict.nav.brandTitle}</strong>
          <small className="tracking-[0.24em] mt-1 text-[0.68rem] text-[var(--gold)] font-bold">
            {dict.nav.brandSubtitle}
          </small>
        </span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[0.92rem] font-bold">
        <Link
          href="/#festival"
          className="hover:text-[var(--gold)] transition-colors duration-200"
        >
          {dict.nav.festival}
        </Link>
        <Link
          href="/about"
          className={`hover:text-[var(--gold)] transition-colors duration-200 ${
            pathname === "/about" ? "text-[var(--gold)]" : ""
          }`}
        >
          {dict.nav.about}
        </Link>
        <Link
          href="/committee"
          className={`hover:text-[var(--gold)] transition-colors duration-200 ${
            pathname === "/committee" ? "text-[var(--gold)]" : ""
          }`}
        >
          {dict.nav.committee}
        </Link>
        <Link
          href="/gallery"
          className={`hover:text-[var(--gold)] transition-colors duration-200 ${
            pathname === "/gallery" ? "text-[var(--gold)]" : ""
          }`}
        >
          {dict.nav.gallery}
        </Link>
        <Link
          href="/membership"
          className={`hover:text-[var(--gold)] transition-colors duration-200 ${
            pathname === "/membership" ? "text-[var(--gold)]" : ""
          }`}
        >
          {dict.nav.membership}
        </Link>
        <Link
          href="/#supporters"
          className="hover:text-[var(--gold)] transition-colors duration-200"
        >
          {dict.nav.supporters}
        </Link>
        <Link
          href="/admin"
          className="hover:text-[var(--gold)] text-white/70 flex items-center gap-1.5 transition-colors duration-200"
          title="Administrative Portal"
        >
          <Shield className="w-3.5 h-3.5 text-[var(--gold)]" />
          <span>{dict.nav.admin}</span>
        </Link>

        {/* Trilingual Switcher */}
        <LanguageSwitcher variant="header" />

        <Link
          href="/#register"
          className="border border-[var(--gold)] text-[var(--gold)] px-4 xl:px-5 py-2.5 hover:bg-[var(--gold)] hover:text-[var(--green-dark)] transition-all duration-200 font-bold uppercase tracking-wider text-xs whitespace-nowrap"
        >
          {dict.nav.registerFree}
        </Link>
      </nav>

      {/* Mobile controls: language switcher + toggle button */}
      <div className="lg:hidden flex items-center gap-3">
        <LanguageSwitcher variant="header" className="scale-90" />
        <button
          onClick={toggleMenu}
          aria-label="Toggle navigation"
          className="p-2 text-[var(--cream)] hover:text-[var(--gold)] focus:outline-none"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-[var(--green-dark)] bg-opacity-98 flex flex-col pt-24 px-8 pb-10 space-y-5 animate-in fade-in duration-200 overflow-y-auto">
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-white/10">
            <LanguageSwitcher variant="header" />
            <button
              onClick={closeMenu}
              aria-label="Close menu"
              className="p-2 text-[var(--cream)] hover:text-[var(--gold)]"
            >
              <X className="w-7 h-7" />
            </button>
          </div>
          <Link
            href="/#festival"
            onClick={closeMenu}
            className="text-xl font-bold hover:text-[var(--gold)] py-2 border-b border-white/10"
          >
            {dict.nav.festival}
          </Link>
          <Link
            href="/about"
            onClick={closeMenu}
            className="text-xl font-bold hover:text-[var(--gold)] py-2 border-b border-white/10"
          >
            {dict.nav.about}
          </Link>
          <Link
            href="/committee"
            onClick={closeMenu}
            className="text-xl font-bold hover:text-[var(--gold)] py-2 border-b border-white/10"
          >
            {dict.nav.committee}
          </Link>
          <Link
            href="/gallery"
            onClick={closeMenu}
            className="text-xl font-bold hover:text-[var(--gold)] py-2 border-b border-white/10"
          >
            {dict.nav.gallery}
          </Link>
          <Link
            href="/membership"
            onClick={closeMenu}
            className="text-xl font-bold hover:text-[var(--gold)] py-2 border-b border-white/10"
          >
            {dict.nav.membership}
          </Link>
          <Link
            href="/#supporters"
            onClick={closeMenu}
            className="text-xl font-bold hover:text-[var(--gold)] py-2 border-b border-white/10"
          >
            {dict.nav.supporters}
          </Link>
          <Link
            href="/admin"
            onClick={closeMenu}
            className="text-xl font-bold hover:text-[var(--gold)] py-2 border-b border-white/10 flex items-center gap-2"
          >
            <Shield className="w-5 h-5 text-[var(--gold)]" />
            <span>{dict.admin.portalTitle}</span>
          </Link>
          <Link
            href="/#register"
            onClick={closeMenu}
            className="mt-6 border border-[var(--gold)] text-center text-[var(--gold)] py-4 font-bold uppercase tracking-wider text-sm hover:bg-[var(--gold)] hover:text-[var(--green-dark)]"
          >
            {dict.nav.registerFree}
          </Link>
        </div>
      )}
    </header>
  );
}
