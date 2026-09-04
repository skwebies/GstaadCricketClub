"use client";

/**
 * @file ScrollSpyNav.tsx
 * @description Sticky glassmorphism header featuring the Gstaad Cricket Club crest
 * with gold embroidery styling, active scroll-spy section tracking, and accessible mobile drawer.
 * @module shared/components/marketing
 */

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Shield, ArrowRight } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  id: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "#hero", id: "hero" },
  { label: "About", href: "#about", id: "about" },
  { label: "Fixtures & Events", href: "#events", id: "events" },
  { label: "Registration", href: "#register", id: "register" },
  { label: "Membership", href: "#membership", id: "membership" },
  { label: "Contact", href: "#contact", id: "contact" },
];

export function ScrollSpyNav() {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      // Scroll-spy observer logic
      const sections = NAV_ITEMS.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section) {
          const top = section.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(NAV_ITEMS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace("#", "");
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", href);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass-header py-3 shadow-lg"
          : "bg-[var(--green-dark)]/90 backdrop-blur-md py-4 border-b border-white/10"
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Crest & Monogram */}
        <a
          href="#hero"
          onClick={(e) => scrollToAnchor(e, "#hero")}
          className="flex items-center gap-3.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] rounded-lg p-1"
          aria-label="Gstaad Cricket Club — Return to Top"
        >
          <div className="relative w-12 h-12 md:w-14 md:h-14 transition-transform duration-300 group-hover:scale-105 gold-embroidery shrink-0">
            <Image
              src="/gstaad-cricket-club-crest.png"
              alt="Gstaad Cricket Club Crest"
              fill
              priority
              className="object-contain"
              sizes="56px"
            />
          </div>
          <div>
            <span className="font-serif text-lg md:text-xl font-bold tracking-wide text-white block leading-none">
              GSTAAD
            </span>
            <span className="text-[var(--gold)] text-[0.62rem] md:text-[0.68rem] tracking-[0.25em] font-extrabold uppercase block mt-1">
              CRICKET CLUB
            </span>
          </div>
        </a>

        {/* Desktop Anchor Navigation */}
        <nav
          className="hidden lg:flex items-center gap-1 bg-black/20 p-1.5 rounded-full border border-white/10"
          aria-label="Main Navigation"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => scrollToAnchor(e, item.href)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-[var(--gold)] text-[var(--green-dark)] shadow-sm font-extrabold"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Header Right Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/admin"
            className="text-white/70 hover:text-[var(--gold)] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 px-3 py-2 rounded-md hover:bg-white/5 transition-colors"
            title="Portal Management"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>

          <a
            href="#register"
            onClick={(e) => scrollToAnchor(e, "#register")}
            className="inline-flex items-center gap-2 bg-[var(--gold)] hover:bg-[var(--gold-hover)] text-[var(--green-dark)] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg"
          >
            <span>Festival 2026</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-white/90 hover:text-white rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[var(--green-dark)] border-b border-white/10 px-6 py-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => scrollToAnchor(e, item.href)}
                  className={`px-4 py-3 text-sm font-bold uppercase tracking-wider rounded-lg transition-colors ${
                    isActive
                      ? "bg-[var(--gold)] text-[var(--green-dark)]"
                      : "text-white/80 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <Link
              href="/admin"
              className="text-xs text-white/70 hover:text-[var(--gold)] flex items-center gap-1.5 font-bold uppercase"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>

            <a
              href="#register"
              onClick={(e) => scrollToAnchor(e, "#register")}
              className="px-4 py-2 bg-[var(--gold)] text-[var(--green-dark)] rounded-full text-xs font-bold uppercase"
            >
              Register Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
