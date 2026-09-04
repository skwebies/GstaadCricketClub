"use client";

/**
 * @file SinglePageHero.tsx
 * @description Hero section (#hero) for Gstaad Cricket Club single-page application.
 * Features cinematic alpine styling, official club motto, pure CSS 3D cricket ball,
 * and dual call-to-action buttons.
 * @module shared/components/marketing
 */

import Image from "next/image";
import { ArrowRight, Calendar, Sparkles, Trophy } from "lucide-react";

export function SinglePageHero() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex items-center justify-center pt-32 pb-20 px-6 md:px-12 overflow-hidden text-white"
      style={{
        background: "linear-gradient(135deg, var(--green-dark) 0%, var(--green) 60%, #164E3A 100%)",
      }}
      aria-label="Hero Section"
    >
      {/* Subtle Alpine Mountain Backdrop Overlay */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 30%, rgba(197, 160, 89, 0.25), transparent 70%), linear-gradient(to bottom, transparent 60%, rgba(10, 28, 21, 0.95))",
        }}
      />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        {/* Left Column: Typography & CTAs */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-xs text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--gold)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SWISS ALPS · 1,050M ELEVATION</span>
          </div>

          <h1 className="font-serif text-white font-normal leading-[0.9] text-[clamp(3.2rem,6.5vw,6rem)]">
            Tradition, Sportsmanship, and{" "}
            <em className="text-[var(--gold)] italic">Cricket in the Bernese Oberland.</em>
          </h1>

          <p className="text-[#e2ded2] text-base md:text-xl font-serif max-w-2xl leading-relaxed mx-auto lg:mx-0">
            Founded amidst the majestic peaks of Saanenland, Gstaad Cricket Club unites world-class
            tradition with grassroots passion. Open for children, adults, families, and enthusiasts worldwide.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <button
              onClick={() => scrollTo("register")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[var(--gold)] hover:bg-[var(--gold-hover)] text-[var(--green-dark)] font-bold text-xs uppercase tracking-widest px-7 py-4 rounded-md shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <Trophy className="w-4 h-4" />
              <span>Register for 2026 Alpine Trophy</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => scrollTo("membership")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-widest px-7 py-4 rounded-md backdrop-blur-xs transition-all duration-200"
            >
              <span>Explore Membership</span>
            </button>
          </div>

          {/* Trust strip */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#cfcac0]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[var(--gold)]" />
              <span>Saturday, 26 September 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
              <span>Ebnit Ground, Gstaad</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Free Community Admission</span>
            </div>
          </div>
        </div>

        {/* Right Column: Crest & Pure CSS 3D Cricket Ball */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="crest-halo pointer-events-none" />

          {/* 3D Ball Graphic */}
          <div className="ball-graphic cursor-pointer relative z-10" title="Gstaad Cricket Club Match Ball">
            <span role="img" aria-label="3D Cricket Ball with stitched seam" />
          </div>

          {/* Crest emblem badge */}
          <div className="mt-4 bg-black/40 border border-white/15 backdrop-blur-md px-5 py-3 rounded-full flex items-center gap-3 shadow-lg">
            <div className="relative w-8 h-8">
              <Image
                src="/gstaad-cricket-club-crest.png"
                alt="Gstaad Cricket Club Crest"
                fill
                className="object-contain"
                sizes="32px"
              />
            </div>
            <div className="text-left">
              <span className="font-serif text-xs font-bold text-white block leading-none">
                Gstaad Cricket Club
              </span>
              <span className="text-[var(--gold)] text-[0.62rem] uppercase tracking-wider font-semibold">
                Cricket Switzerland Member
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
