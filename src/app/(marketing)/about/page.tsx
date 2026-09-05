"use client";

/**
 * @file about/page.tsx
 * @description Trilingual About Us page presenting Sathya Narayanan's cricketing journey,
 * achievements, and the founding philosophy of the Gstaad Cricket Club.
 * @module app/(marketing)/about
 */

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Award, Trophy, Users, Heart, Mountain } from "lucide-react";
import { useLanguage } from "@/shared/i18n/LanguageContext";

export default function AboutPage() {
  const { dict } = useLanguage();

  return (
    <div className="bg-[var(--paper)]">
      {/* 1. ABOUT HERO */}
      <section
        className="about-hero text-[var(--cream)] min-h-[650px] px-[8vw] py-24 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] items-center gap-[6vw] relative overflow-hidden"
        style={{
          background: "linear-gradient(120deg, var(--green-dark), var(--green))",
        }}
      >
        <div className="about-hero-copy max-w-3xl">
          <Link
            href="/"
            className="back-link inline-flex items-center gap-2.5 text-[#d8d3c5] hover:text-[var(--gold)] uppercase tracking-[0.12em] text-[0.78rem] font-bold mb-12 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{dict.nav.backToFestival}</span>
          </Link>

          <span className="section-kicker text-[var(--gold)] uppercase tracking-[0.23em] text-[0.78rem] font-extrabold mb-4 block">
            {dict.aboutPage.kicker}
          </span>
          <h1 className="font-serif text-[clamp(3.5rem,7vw,7rem)] leading-[0.9] font-normal text-white mb-6">
            {dict.aboutPage.title}
            <br />
            <em className="text-[var(--gold)] italic">{dict.aboutPage.titleEm}</em>
          </h1>
          <p className="text-[#e8e2d2] font-serif text-[1.35rem] leading-[1.55] max-w-2xl mt-8">
            {dict.aboutPage.intro}
          </p>
        </div>

        <div className="about-crest-wrap grid place-items-center gap-6 mt-8 lg:mt-0">
          <div className="relative w-[300px] sm:w-[380px] aspect-square drop-shadow-[0_25px_40px_#001c1680]">
            <Image
              src="/gstaad-cricket-club-crest.png"
              alt="Gstaad Cricket Club crest"
              fill
              priority
              sizes="(max-width: 768px) 300px, 380px"
              className="object-contain"
            />
          </div>
          <span className="text-[var(--gold)] uppercase tracking-[0.14em] text-[0.76rem] font-bold flex items-center gap-2.5">
            <Mountain className="w-4 h-4" />
            <span>{dict.aboutPage.bornInGstaad}</span>
          </span>
        </div>
      </section>

      {/* 2. FOUNDER SECTION */}
      <section className="founder-section py-24 md:py-32 px-[8vw] grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-[10vw] items-start">
        <div className="founder-title">
          <span className="section-kicker text-[var(--gold)] uppercase tracking-[0.23em] text-[0.78rem] font-extrabold mb-4 block">
            {dict.aboutPage.founderHeading}
          </span>
          <h2 className="font-serif text-[clamp(3.4rem,6vw,6rem)] leading-[0.9] font-normal text-[var(--ink)]">
            Sathya
            <br />
            <em className="text-[var(--gold)] italic">Narayanan</em>
          </h2>
        </div>

        <div className="founder-story max-w-2xl space-y-6 text-[var(--ink)]">
          <p className="lead font-serif text-[1.75rem] leading-[1.45]">
            {dict.aboutPage.founderBio}
          </p>
          <p className="text-[#56675f] text-[1.05rem] leading-[1.8]">
            {dict.aboutPage.visionText}
          </p>

          <blockquote className="border-l-4 border-[var(--gold)] bg-[var(--cream)] text-[var(--green)] p-8 sm:p-9 font-serif text-[1.35rem] leading-[1.5] mt-10 shadow-xs">
            “Now it is time to give something back—to bring cricket closer to local families and create opportunities for the next generation.”
          </blockquote>
        </div>
      </section>

      {/* 3. MILESTONES SECTION */}
      <section className="milestones-section bg-[#d7d0bd] grid grid-cols-1 md:grid-cols-3 gap-px px-[8vw] pb-24 md:pb-32">
        <article className="bg-[var(--cream)] p-8 sm:p-12 flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="milestone-number text-[#9e967f] tracking-[0.16em] text-[0.7rem] font-extrabold mb-4">
              01
            </div>
            <Award className="w-8 h-8 text-[var(--gold)] mb-5" />
            <h3 className="font-serif text-[1.5rem] font-normal text-[var(--ink)] mb-3">
              National-level cricket
            </h3>
          </div>
          <p className="text-[#5c6d66] text-[0.98rem] leading-[1.65]">
            Represented Switzerland in international fixtures during a playing journey spanning more than two decades.
          </p>
        </article>

        <article className="bg-[var(--cream)] p-8 sm:p-12 flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="milestone-number text-[#9e967f] tracking-[0.16em] text-[0.7rem] font-extrabold mb-4">
              02
            </div>
            <Trophy className="w-8 h-8 text-[var(--gold)] mb-5" />
            <h3 className="font-serif text-[1.5rem] font-normal text-[var(--ink)] mb-3">
              Club captaincy
            </h3>
          </div>
          <p className="text-[#5c6d66] text-[0.98rem] leading-[1.65]">
            Former captain of Cossonay Cricket Club and Bern Cricket Club.
          </p>
        </article>

        <article className="bg-[var(--cream)] p-8 sm:p-12 flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="milestone-number text-[#9e967f] tracking-[0.16em] text-[0.7rem] font-extrabold mb-4">
              03
            </div>
            <Users className="w-8 h-8 text-[var(--gold)] mb-5" />
            <h3 className="font-serif text-[1.5rem] font-normal text-[var(--ink)] mb-3">
              Swiss T20
            </h3>
          </div>
          <p className="text-[#5c6d66] text-[0.98rem] leading-[1.65]">
            Created and successfully organised one of Switzerland’s first T20 cricket tournaments to offer prize money.
          </p>
        </article>
      </section>

      {/* 4. MISSION BANNER */}
      <section className="mission-banner bg-[var(--green)] text-[var(--cream)] py-24 px-[9vw] grid grid-cols-1 md:grid-cols-[auto_1fr] items-start gap-10">
        <Heart className="w-14 h-14 text-[var(--gold)] shrink-0" />
        <div>
          <span className="section-kicker light text-[var(--gold)] uppercase tracking-[0.23em] text-[0.78rem] font-extrabold mb-3 block">
            {dict.aboutPage.visionHeading}
          </span>
          <h2 className="font-serif text-[clamp(2.8rem,5vw,5rem)] leading-[0.95] font-normal text-white mb-6">
            Passion becomes meaningful
            <br />
            when it is shared.
          </h2>
          <p className="text-[#ded9cb] text-[1.05rem] leading-[1.7] max-w-2xl mb-8">
            The club’s first mission is simple: welcome children, adults, families and beginners, and build a lasting cricket community in Gstaad and the surrounding region.
          </p>
          <Link
            href="/#register"
            className="primary-button bg-[var(--gold)] text-[var(--green-dark)] hover:bg-[var(--gold-hover)] px-8 py-4 font-extrabold text-sm uppercase tracking-wider inline-flex items-center gap-3 transition-colors"
          >
            <span>{dict.nav.registerFree}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
