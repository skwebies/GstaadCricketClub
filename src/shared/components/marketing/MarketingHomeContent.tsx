"use client";

/**
 * @file MarketingHomeContent.tsx
 * @description Trilingual homepage content rendering Hero, EventStrip, Festival,
 * Purpose, Membership, Supporters, and Free Registration sections.
 * @module shared/components/marketing
 */

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, HandHeart, Sparkles, Building2, Users } from "lucide-react";
import { EventStrip } from "@/shared/components/marketing/EventStrip";
import { RegistrationForm } from "@/shared/components/marketing/RegistrationForm";
import { CLUB_CONFIG } from "@/shared/config/club";
import { useLanguage } from "@/shared/i18n/LanguageContext";

export function MarketingHomeContent() {
  const { dict } = useLanguage();

  const audienceItems = [
    { id: "01", label: dict.festival.audiences.children },
    { id: "02", label: dict.festival.audiences.adults },
    { id: "03", label: dict.festival.audiences.families },
    { id: "04", label: dict.festival.audiences.beginners },
  ];

  const membershipCards = [
    {
      id: "adult",
      title: dict.membership.adult,
      price: dict.membership.adultPrice,
      period: dict.membership.perYear,
      description: "Full voting rights and playing privileges.",
      featured: false,
    },
    {
      id: "family",
      title: dict.membership.family,
      price: dict.membership.familyPrice,
      period: dict.membership.perYear,
      description: "Includes parents and all junior members under 18.",
      featured: true,
    },
    {
      id: "junior",
      title: dict.membership.junior,
      price: dict.membership.juniorPrice,
      period: dict.membership.perYear,
      description: "Coaching clinics, youth fixtures and match ball access.",
      featured: false,
    },
  ];

  const memberBenefits = [
    dict.membership.benefit1,
    dict.membership.benefit2,
    dict.membership.benefit3,
    dict.membership.benefit4,
  ];

  return (
    <div className="bg-[var(--paper)]">
      {/* 1. HERO SECTION */}
      <section
        className="hero relative min-h-[760px] text-[var(--cream)] px-[8vw] pt-[150px] pb-[100px] overflow-hidden grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] items-center"
        id="top"
        style={{
          background:
            "radial-gradient(circle at 72% 38%, #17604d 0, transparent 28%), linear-gradient(115deg, var(--green-dark), var(--green) 65%, #0b4939)",
        }}
      >
        {/* Subtle geometric line decoration */}
        <div
          className="pointer-events-none absolute h-[55%] border border-white/10 -rotate-6"
          style={{ inset: "auto -7% -25% 30%" }}
        />

        <div className="hero-copy z-10 max-w-2xl">
          <span className="eyebrow text-[var(--gold)] uppercase tracking-[0.23em] text-[0.78rem] font-extrabold mb-6 block">
            {dict.hero.eyebrow}
          </span>
          <h1 className="font-serif text-[clamp(3.8rem,7.5vw,7.8rem)] leading-[0.85] font-normal text-white mb-6">
            {dict.hero.title}
            <br />
            {dict.hero.titleTo} <em className="text-[var(--gold)] italic">{dict.hero.titleEm}</em>
          </h1>
          <p className="hero-intro text-[#eee8d8] text-lg sm:text-[1.2rem] leading-[1.65] my-8 max-w-[620px]">
            {dict.hero.intro}
          </p>

          <div className="hero-actions flex flex-wrap items-center gap-6">
            <Link
              href="#register"
              className="primary-button bg-[var(--gold)] text-[var(--green-dark)] hover:bg-[var(--gold-hover)] px-7 py-4 font-extrabold text-sm uppercase tracking-wider inline-flex items-center gap-3.5 transition-colors duration-200"
            >
              <span>{dict.hero.reserveCta}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="free-note text-[#d9d3c2] text-[0.92rem] font-medium">
              {dict.hero.freeNote}
            </span>
          </div>
        </div>

        {/* Hero Crest & Affiliation */}
        <div className="hero-crest z-10 grid place-items-center mt-12 lg:mt-0 relative">
          <div className="crest-halo" />
          <div className="relative w-[320px] sm:w-[420px] aspect-square drop-shadow-[0_26px_45px_#001c1690]">
            <Image
              src="/gstaad-cricket-club-crest.png"
              alt="Gstaad Cricket Club crest"
              fill
              priority
              sizes="(max-width: 768px) 320px, 450px"
              className="object-contain"
            />
          </div>

          <div className="affiliation flex items-center gap-3.5 mt-5 text-[var(--gold)] uppercase tracking-[0.12em] text-[0.74rem] leading-snug">
            <div className="relative w-[50px] h-[64px]">
              <Image
                src="/cricket-switzerland-logo.png"
                alt="Cricket Switzerland logo"
                fill
                sizes="50px"
                className="object-contain"
              />
            </div>
            <span>
              {dict.hero.affiliatedTo}
              <br />
              <strong className="text-[var(--cream)] text-[0.88rem] normal-case tracking-normal">
                {dict.hero.cricketSwitzerland}
              </strong>
            </span>
          </div>
        </div>
      </section>

      {/* 2. EVENT STRIP */}
      <EventStrip />

      {/* 3. FESTIVAL SECTION */}
      <section className="festival-section py-24 md:py-32 px-[8vw]">
        <span className="section-kicker text-[var(--gold)] uppercase tracking-[0.23em] text-[0.78rem] font-extrabold mb-6 block">
          {dict.festival.dateKicker}
        </span>
        <div className="festival-grid grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-[9vw] items-start">
          <div>
            <h2 className="font-serif text-[clamp(3.2rem,6vw,6rem)] leading-[0.93] font-normal text-[var(--ink)]">
              {dict.festival.title}
              <br />
              {dict.festival.subtitle}
              <br />
              <em className="text-[var(--gold)] italic">{dict.festival.titleEm}</em>
            </h2>
          </div>

          <div className="festival-copy space-y-6">
            <p className="lead font-serif text-[1.65rem] leading-[1.45] text-[var(--ink)]">
              {dict.festival.lead}
            </p>
            <p className="text-[#5c6d66] text-[1.02rem] leading-[1.75]">
              {dict.festival.body}
            </p>

            <div className="audience-list grid grid-cols-1 sm:grid-cols-2 border-t border-[#bcb8aa] mt-10">
              {audienceItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center border-b border-[#bcb8aa] py-4 font-bold text-[var(--ink)]"
                >
                  <b className="text-[var(--gold)] mr-3 text-sm">{item.id}</b>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. CLUB PURPOSE & RED CRICKET BALL */}
      <section className="club-section bg-[var(--cream)] grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] min-h-[580px] overflow-hidden" id="club">
        <div className="club-card bg-[var(--green)] text-[var(--cream)] my-12 lg:my-16 mx-[6vw] lg:ml-[8vw] lg:mr-0 p-8 sm:p-14 lg:p-16 relative z-10 shadow-xl">
          <span className="section-kicker light text-[var(--gold)] uppercase tracking-[0.23em] text-[0.78rem] font-extrabold mb-4 block">
            {dict.purpose.kicker}
          </span>
          <h2 className="font-serif text-[clamp(2.8rem,5vw,5rem)] leading-[0.96] font-normal text-white mb-6">
            {dict.purpose.title}
          </h2>
          <p className="text-[#dfdbcf] text-[1.1rem] leading-[1.7] max-w-[600px] mb-8">
            {dict.purpose.body}
          </p>

          <div className="values flex flex-wrap gap-3">
            <span className="text-[var(--gold)] uppercase tracking-[0.13em] border border-[#d2ae5260] px-4 py-2 text-[0.72rem] font-bold">
              {dict.purpose.values.community}
            </span>
            <span className="text-[var(--gold)] uppercase tracking-[0.13em] border border-[#d2ae5260] px-4 py-2 text-[0.72rem] font-bold">
              {dict.purpose.values.development}
            </span>
            <span className="text-[var(--gold)] uppercase tracking-[0.13em] border border-[#d2ae5260] px-4 py-2 text-[0.72rem] font-bold">
              {dict.purpose.values.belonging}
            </span>
          </div>
        </div>

        <div className="ball-graphic flex items-center justify-center p-8">
          <span aria-label="Alpine Cricket Ball" />
        </div>
      </section>

      {/* 5. MEMBERSHIP TIERS */}
      <section className="membership-section bg-[var(--cream)] py-24 md:py-32 px-[8vw]" id="membership">
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-[8vw] items-start">
          <div className="membership-intro">
            <span className="section-kicker text-[var(--gold)] uppercase tracking-[0.23em] text-[0.78rem] font-extrabold mb-4 block">
              {dict.membership.kicker}
            </span>
            <h2 className="font-serif text-[clamp(3rem,5vw,5.2rem)] leading-[0.94] font-normal text-[var(--ink)] mb-6">
              {dict.membership.title}
              <br />
              <em className="text-[var(--gold)] italic">{dict.membership.titleEm}</em>
            </h2>
            <p className="text-[#5c6d66] text-[1.05rem] leading-[1.7] max-w-md mb-8">
              {dict.membership.intro}
            </p>
            <Link
              href="/contact?type=membership"
              className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-widest text-[var(--green)] hover:text-[var(--gold-hover)]"
            >
              <span>{dict.membership.applyButton}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="membership-content space-y-8">
            <div className="membership-plans grid grid-cols-1 sm:grid-cols-3 gap-4">
              {membershipCards.map((plan) => (
                <Link
                  key={plan.id}
                  href={`/contact?type=membership&package=${plan.id}`}
                  className={`p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 group cursor-pointer rounded-xs shadow-xs ${
                    plan.featured
                      ? "bg-[var(--green)] text-[var(--cream)] border-t-4 border-[var(--gold)] shadow-lg hover:shadow-xl hover:border-[var(--gold)]"
                      : "bg-white text-[var(--ink)] border-t-4 border-[var(--green)] hover:border-[var(--gold)] hover:shadow-md"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-[0.72rem] font-extrabold tracking-[0.16em] uppercase block ${
                          plan.featured ? "text-[var(--gold)]" : "text-[#7c857f]"
                        }`}
                      >
                        {plan.title}
                      </span>
                      <span
                        className={`text-[0.68rem] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ${
                          plan.featured ? "text-[var(--gold)]" : "text-[var(--green)]"
                        }`}
                      >
                        Select &rarr;
                      </span>
                    </div>
                    <strong className="font-serif text-[2.1rem] font-normal block leading-none mb-1">
                      {plan.price}
                    </strong>
                    <small
                      className={`text-xs block ${
                        plan.featured ? "text-[#d8d4c7]" : "text-[#7c857f]"
                      }`}
                    >
                      {plan.period}
                    </small>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/5 flex flex-col justify-between">
                    <p
                      className={`text-xs leading-relaxed ${
                        plan.featured ? "text-[#d8d4c7]" : "text-[#6c7973]"
                      }`}
                    >
                      {plan.description}
                    </p>
                    <span
                      className={`mt-3 text-[0.72rem] font-extrabold uppercase tracking-wider inline-flex items-center gap-1 ${
                        plan.featured ? "text-[var(--gold)]" : "text-[var(--green)]"
                      }`}
                    >
                      <span>Choose {plan.title}</span>
                      <span>&rarr;</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="member-benefits bg-white p-8 border border-[#e4decf]">
              <h3 className="font-serif text-[1.35rem] font-normal text-[var(--ink)] mb-5">
                {dict.membership.benefitsHeading}
              </h3>
              <ul className="space-y-3.5 mb-6">
                {memberBenefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3 text-[0.95rem] text-[var(--ink)]">
                    <Check className="w-5 h-5 text-[var(--gold)] shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-[#e4decf] pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-[#5c6d66]">
                <p>{dict.membership.contactNote}</p>
                <Link
                  href="/contact?type=membership"
                  className="inline-flex items-center gap-1 text-[var(--gold)] hover:underline font-bold text-xs uppercase tracking-wider whitespace-nowrap shrink-0"
                >
                  <span>Contact to Join</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SUPPORTERS & DONORS */}
      <section className="supporters-section bg-[var(--paper)] py-20 md:py-28 px-[8vw]" id="supporters">
        <div className="max-w-7xl mx-auto">
          {/* Section Header: Title & Lead in Balanced 2-Column Row */}
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-16 items-start pb-10 border-b border-[#c7bea7]/60 mb-12">
            <div className="supporters-heading">
              <span className="section-kicker text-[var(--gold)] uppercase tracking-[0.23em] text-[0.78rem] font-extrabold mb-3 block">
                {dict.supporters.kicker}
              </span>
              <h2 className="font-serif text-[clamp(2.8rem,5vw,4.8rem)] leading-[0.94] font-normal text-[var(--ink)]">
                {dict.supporters.title}
                <br />
                <em className="text-[var(--gold)] italic">{dict.supporters.titleEm}</em>
              </h2>
            </div>

            <div className="supporters-intro space-y-4 pt-1">
              <p className="lead font-serif text-[1.35rem] sm:text-[1.5rem] leading-[1.4] text-[var(--ink)]">
                {dict.supporters.lead}
              </p>
              <p className="text-[#5c6d66] text-[0.98rem] leading-[1.75]">
                {dict.supporters.body}
              </p>
            </div>
          </div>

          {/* 2-Column Content Grid: Left = Founding Sponsors, Right = Community Donors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-14 items-start">
            {/* COLUMN 1: FOUNDING SPONSORS */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#c7bea7] pb-3">
                <span className="supporters-label text-[#82785f] tracking-[0.19em] uppercase text-[0.72rem] font-extrabold flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[var(--gold)]" />
                  {dict.supporters.foundingSponsors}
                </span>
                <span className="text-[0.68rem] text-[#82785f] uppercase tracking-wider font-semibold">
                  Official Partners
                </span>
              </div>

              <div className="supporter-logos grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3.5">
                {CLUB_CONFIG.foundingSponsors.map((sponsor) => (
                  <div
                    key={sponsor.name}
                    className={`sponsor-logo ${sponsor.theme}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>

              {/* Sponsor Callout Card */}
              <Link
                href="/contact?type=sponsor"
                className="bg-[var(--green)] hover:bg-[#0c2f23] text-[var(--cream)] p-7 space-y-2 rounded-xs shadow-sm block transition-all group border border-transparent hover:border-[var(--gold)]/50 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <HandHeart className="w-8 h-8 text-[var(--gold)] mb-1" />
                  <span className="text-[var(--gold)] font-bold text-xs uppercase tracking-wider group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Inquire &rarr;
                  </span>
                </div>
                <strong className="font-serif text-[1.35rem] block text-white group-hover:text-[var(--gold)] transition-colors">
                  {dict.supporters.becomeSponsor}
                </strong>
                <span className="text-[#d7d3c6] text-[0.92rem] leading-normal block">
                  {dict.supporters.becomeSponsorDesc}
                </span>
              </Link>
            </div>

            {/* COLUMN 2: COMMUNITY DONORS */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#c7bea7] pb-3">
                <span className="supporters-label text-[#82785f] tracking-[0.19em] uppercase text-[0.72rem] font-extrabold flex items-center gap-2">
                  <Users className="w-4 h-4 text-[var(--gold)]" />
                  {dict.supporters.communityDonors}
                </span>
                <span className="text-[0.68rem] text-[#82785f] uppercase tracking-wider font-semibold">
                  Founding Patrons
                </span>
              </div>

              <div className="donor-names grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CLUB_CONFIG.communityDonors.map((donor) => (
                  <div
                    key={donor}
                    className="bg-white text-[var(--green)] border border-[#dcd4c1] px-4 py-3 font-serif text-[0.96rem] shadow-xs rounded-xs flex items-center gap-2.5 transition-all hover:border-[var(--gold)] hover:shadow-sm"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] shrink-0" />
                    <span>{donor}</span>
                  </div>
                ))}
              </div>

              {/* Donation Callout Card */}
              <Link
                href="/contact?type=donor"
                className="bg-[var(--green)] hover:bg-[#0c2f23] text-[var(--cream)] p-7 space-y-2 rounded-xs shadow-sm block transition-all group border border-transparent hover:border-[var(--gold)]/50 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <Sparkles className="w-8 h-8 text-[var(--gold)] mb-1" />
                  <span className="text-[var(--gold)] font-bold text-xs uppercase tracking-wider group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Donate &rarr;
                  </span>
                </div>
                <strong className="font-serif text-[1.35rem] block text-white group-hover:text-[var(--gold)] transition-colors">
                  {dict.supporters.makeDonation}
                </strong>
                <span className="text-[#d7d3c6] text-[0.92rem] leading-normal block">
                  {dict.supporters.makeDonationDesc}
                </span>
              </Link>

              {/* Contact Note Strip */}
              <div className="support-contact border-l-4 border-[var(--gold)] bg-white/70 border border-[#e4decf] p-4 text-xs sm:text-sm text-[var(--green-dark)] flex items-center justify-between gap-4 rounded-xs shadow-2xs">
                <p className="font-semibold text-gray-800">{dict.supporters.contactNote}</p>
                <Link
                  href="/contact?type=support"
                  className="inline-flex items-center gap-1 text-[var(--gold)] hover:underline font-bold text-xs uppercase tracking-wider whitespace-nowrap shrink-0"
                >
                  <span>Contact</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. REGISTRATION SECTION */}
      <section className="registration-section bg-[var(--cream)] py-24 md:py-32 px-[8vw]" id="register">
        <div className="grid grid-cols-1 lg:grid-cols-[0.82fr_1.18fr] gap-12 lg:gap-[9vw] items-start">
          <div className="registration-copy">
            <span className="section-kicker text-[var(--gold)] uppercase tracking-[0.23em] text-[0.78rem] font-extrabold mb-4 block">
              {dict.registration.kicker}
            </span>
            <h2 className="font-serif text-[clamp(3.2rem,6vw,6rem)] leading-[0.93] font-normal text-[var(--ink)] mb-6">
              {dict.registration.title}
              <br />
              {dict.registration.titleEm}
            </h2>
            <p className="text-[#5c6d66] text-[1.05rem] leading-[1.7] max-w-md mb-6">
              {dict.registration.subtitle}
            </p>
            <div className="mini-details space-y-1.5 text-[var(--ink)] font-bold text-[0.95rem]">
              <div className="text-[var(--ink)] font-extrabold">
                {dict.registration.eventDate}
              </div>
              <div className="text-[#3c4a44]">
                {dict.registration.eventTimeVenue}
              </div>
              <div className="text-[#5c6d66] font-medium text-sm">
                {dict.registration.eventAddress}
              </div>
              <div className="pt-0.5 text-sm font-semibold">
                <a
                  href={`tel:${dict.registration.eventPhone.replace(/\s+/g, "")}`}
                  className="text-[var(--green-dark)] hover:text-[var(--gold)] transition-colors"
                >
                  {dict.registration.eventPhone}
                </a>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center lg:justify-start">
            <RegistrationForm />
          </div>
        </div>
      </section>
    </div>
  );
}
