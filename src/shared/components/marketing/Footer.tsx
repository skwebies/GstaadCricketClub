"use client";

/**
 * @file Footer.tsx
 * @description Comprehensive footer for Gstaad Cricket Club.
 * Includes official Swiss association disclaimers (Verein nach Art. 60ff. ZGB),
 * Cricket Switzerland affiliation, founding sponsors showcase, quick links,
 * and a smooth back-to-top button.
 * @module shared/components/marketing
 */

import Image from "next/image";
import Link from "next/link";
import { ArrowUp, ExternalLink, ShieldCheck } from "lucide-react";
import { CLUB_CONFIG } from "@/shared/config/club";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[var(--green-dark)] text-[#d8d4c7] border-t border-white/10" role="contentinfo">
      {/* Founding Sponsors Strip */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 border-b border-white/10">
        <div className="text-center space-y-2 mb-8">
          <span className="text-[0.68rem] text-[var(--gold)] uppercase tracking-[0.25em] font-extrabold block">
            ESTEEMED FOUNDING PARTNERS &amp; SPONSORS
          </span>
          <p className="text-xs text-[#a39e91]">
            With gracious gratitude to our local Bernese Oberland partners and supporters
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {CLUB_CONFIG.foundingSponsors.map((sponsor) => (
            <div
              key={sponsor.name}
              className={`sponsor-logo ${sponsor.theme} relative h-20 w-full p-2 rounded-lg`}
              title={sponsor.name}
            >
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12vw"
                className="object-contain p-2"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-12 gap-10 text-xs">
        {/* Brand & Crest */}
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 gold-embroidery">
              <Image
                src="/gstaad-cricket-club-crest.png"
                alt="Gstaad Cricket Club Crest"
                fill
                sizes="48px"
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-wide text-white block leading-none">
                GSTAAD
              </span>
              <span className="text-[var(--gold)] text-[0.62rem] tracking-[0.25em] font-extrabold uppercase block mt-1">
                CRICKET CLUB
              </span>
            </div>
          </div>

          <p className="text-[#beb9ab] leading-relaxed max-w-sm">
            Fostering the spirit, tradition, and enjoyment of cricket for children, adults,
            and families in the Saanenland and Bernese Oberland region.
          </p>

          <div className="flex items-center gap-2 text-[0.72rem] text-[var(--gold)] pt-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Cricket Switzerland Affiliated Club</span>
          </div>
        </div>

        {/* Quick Anchor Links */}
        <div className="md:col-span-3 space-y-3">
          <span className="text-[0.7rem] font-bold uppercase tracking-widest text-[var(--gold)] block">
            NAVIGATION
          </span>
          <ul className="space-y-2 text-[#d1cbc0]">
            <li>
              <a href="#hero" className="hover:text-[var(--gold)] transition-colors">Overview</a>
            </li>
            <li>
              <a href="#about" className="hover:text-[var(--gold)] transition-colors">Heritage &amp; Altitude</a>
            </li>
            <li>
              <a href="#events" className="hover:text-[var(--gold)] transition-colors">Tournament Fixtures</a>
            </li>
            <li>
              <a href="#register" className="hover:text-[var(--gold)] transition-colors">Event Admission</a>
            </li>
            <li>
              <a href="#membership" className="hover:text-[var(--gold)] transition-colors">Membership Tiers</a>
            </li>
            <li>
              <a href="#contact" className="hover:text-[var(--gold)] transition-colors">Contact &amp; Location</a>
            </li>
          </ul>
        </div>

        {/* Detailed Pages & Governance */}
        <div className="md:col-span-3 space-y-3">
          <span className="text-[0.7rem] font-bold uppercase tracking-widest text-[var(--gold)] block">
            GOVERNANCE &amp; CLUB
          </span>
          <ul className="space-y-2 text-[#d1cbc0]">
            <li>
              <Link href="/about" className="hover:text-[var(--gold)] transition-colors">Founder&apos;s Story</Link>
            </li>
            <li>
              <Link href="/committee" className="hover:text-[var(--gold)] transition-colors">Committee Roster</Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-[var(--gold)] transition-colors">Alpine Photo Gallery</Link>
            </li>
            <li>
              <Link href="/admin" className="text-[var(--gold)] hover:underline flex items-center gap-1">
                <span>Administrative Portal</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Back to Top & Legal */}
        <div className="md:col-span-2 flex flex-col justify-between items-start md:items-end space-y-4">
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors border border-white/10"
            aria-label="Scroll back to top of page"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Disclaimer & Legal Bar */}
      <div className="border-t border-white/10 py-6 px-6 md:px-12 bg-black/20 text-[0.7rem] text-[#8e897c]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p>
            Gstaad Cricket Club (GCC) is an officially established non-profit Swiss sporting association
            (Verein nach Art. 60ff. ZGB), affiliated with Cricket Switzerland. All rights reserved.
          </p>
          <div className="flex items-center gap-4 shrink-0">
            <span>Data Privacy (nFADP/DSG compliant)</span>
            <span>·</span>
            <span>© {new Date().getFullYear()} GCC</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
