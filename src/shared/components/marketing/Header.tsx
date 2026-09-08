"use client";

/**
 * @file Header.tsx
 * @description Sticky glassmorphism header featuring the Gstaad Cricket Club crest,
 * localized navigation links, language switcher (EN/DE/FR), and animated full-screen mobile drawer.
 * @module shared/components/marketing
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { useLanguage } from "@/shared/i18n/LanguageContext";
import { LanguageSwitcher } from "@/shared/components/common/LanguageSwitcher";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { dict } = useLanguage();

  // Scroll detection for sticky header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { href: "/#festival", label: dict.nav.festival },
    { href: "/about", label: dict.nav.about },
    { href: "/committee", label: dict.nav.committee },
    { href: "/gallery", label: dict.nav.gallery },
    { href: "/membership", label: dict.nav.membership },
    { href: "/#supporters", label: dict.nav.supporters },
  ];

  return (
    <>
      <header
        className={`site-header fixed top-0 left-0 w-full h-[76px] sm:h-[88px] text-[var(--cream)] flex items-center justify-between px-4 sm:px-6 lg:px-[5vw] z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#0A1C15]/95 backdrop-blur-md shadow-[0_4px_25px_rgba(0,0,0,0.4)] border-b border-[var(--gold)]/20"
            : "bg-[#0A1C15]/80 md:bg-transparent backdrop-blur-xs md:backdrop-blur-none border-b border-white/5"
        }`}
      >
        <Link href="/" className="brand flex items-center gap-2.5 sm:gap-3 tracking-[0.08em] group shrink min-w-0">
          <div className="relative w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] lg:w-[54px] lg:h-[54px] shrink-0 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/gstaad-cricket-club-crest.png"
              alt="Gstaad Cricket Club Crest"
              fill
              sizes="54px"
              priority
              className="object-contain"
            />
          </div>
          <span className="grid leading-none shrink min-w-0">
            <strong className="font-serif text-[1.05rem] sm:text-lg lg:text-[1.25rem] tracking-wide text-white truncate">
              {dict.nav.brandTitle}
            </strong>
            <small className="tracking-[0.18em] sm:tracking-[0.24em] mt-0.5 sm:mt-1 text-[0.58rem] sm:text-[0.68rem] text-[var(--gold)] font-bold truncate">
              {dict.nav.brandSubtitle}
            </small>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[0.92rem] font-bold">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-[var(--gold)] transition-colors duration-200 ${
                pathname === link.href ? "text-[var(--gold)]" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          {/* Trilingual Switcher */}
          <LanguageSwitcher variant="header" />

          <Link
            href="/#register"
            className="border border-[var(--gold)] text-[var(--gold)] px-4 xl:px-5 py-2.5 hover:bg-[var(--gold)] hover:text-[var(--green-dark)] transition-all duration-200 font-bold uppercase tracking-wider text-xs whitespace-nowrap"
          >
            {dict.nav.registerFree}
          </Link>
        </nav>

        {/* Mobile controls: language switcher + burger toggle */}
        <div className="lg:hidden flex items-center gap-2 shrink-0">
          <LanguageSwitcher variant="header" />
          <button
            onClick={toggleMenu}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            className="p-2 sm:p-2.5 rounded-md text-[var(--cream)] hover:text-[var(--gold)] hover:bg-white/10 active:bg-white/20 transition-colors focus:outline-none shrink-0"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Full-Screen Overlay & Drawer */}
      {/* Placed outside <header> to prevent backdrop-filter containing block trap */}
      {isOpen && (
        <div
          id="mobile-nav-dialog"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="lg:hidden fixed inset-0 z-[100] flex flex-col bg-[#032b22] text-[var(--cream)] h-[100dvh] w-full animate-mobile-drawer overflow-hidden"
        >
          {/* Top Bar matching header height */}
          <div className="flex items-center justify-between px-5 sm:px-6 h-[88px] border-b border-white/10 shrink-0 bg-[#0A1C15]/95">
            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center gap-3 tracking-[0.08em]"
            >
              <div className="relative w-[44px] h-[44px]">
                <Image
                  src="/gstaad-cricket-club-crest.png"
                  alt="Gstaad Cricket Club Crest"
                  fill
                  sizes="44px"
                  className="object-contain"
                />
              </div>
              <span className="grid leading-none">
                <strong className="font-serif text-[1.1rem] tracking-wide text-white">
                  {dict.nav.brandTitle}
                </strong>
                <small className="tracking-[0.2em] mt-1 text-[0.62rem] text-[var(--gold)] font-bold">
                  {dict.nav.brandSubtitle}
                </small>
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <LanguageSwitcher variant="header" />
              <button
                onClick={closeMenu}
                aria-label="Close navigation menu"
                className="p-2.5 rounded-md text-[var(--cream)] hover:text-[var(--gold)] hover:bg-white/10 active:bg-white/20 transition-colors focus:outline-none"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Scrollable Navigation Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col justify-between">
            <nav className="flex flex-col space-y-1.5" aria-label="Mobile Menu Links">
              {navLinks.map((link, index) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    style={{ animationDelay: `${index * 45}ms` }}
                    className={`animate-mobile-item flex items-center justify-between py-3.5 px-4 rounded-md text-xl font-serif tracking-wide border-b border-white/5 transition-all duration-200 group ${
                      isActive
                        ? "text-[var(--gold)] bg-white/5 font-semibold"
                        : "text-[var(--cream)] hover:text-[var(--gold)] hover:bg-white/5"
                    }`}
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 text-[var(--gold)] opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                );
              })}

            </nav>

            {/* Bottom Actions */}
            <div
              style={{ animationDelay: `${(navLinks.length + 1) * 45}ms` }}
              className="animate-mobile-item pt-8 pb-4 shrink-0"
            >
              <Link
                href="/#register"
                onClick={closeMenu}
                className="w-full block text-center bg-[var(--gold)] text-[var(--green-dark)] hover:bg-[var(--gold-hover)] py-4 px-6 font-extrabold uppercase tracking-widest text-xs rounded-xs shadow-lg transition-all active:scale-[0.99]"
              >
                {dict.nav.registerFree}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
