"use client";

/**
 * @file committee/page.tsx
 * @description Trilingual Committee page displaying GCC leadership, roles, and governance values.
 * @module app/(marketing)/committee
 */

import Link from "next/link";
import { ArrowLeft, Shield, UserRoundCog, WalletCards, Megaphone, UsersRound } from "lucide-react";
import { CLUB_CONFIG } from "@/shared/config/club";
import { useLanguage } from "@/shared/i18n/LanguageContext";

export default function CommitteePage() {
  const { dict } = useLanguage();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "shield":
        return <Shield className="w-7 h-7 text-[var(--gold)] mb-5" />;
      case "user-round-cog":
        return <UserRoundCog className="w-7 h-7 text-[var(--gold)] mb-5" />;
      case "wallet-cards":
        return <WalletCards className="w-7 h-7 text-[var(--gold)] mb-5" />;
      case "megaphone":
        return <Megaphone className="w-7 h-7 text-[var(--gold)] mb-5" />;
      case "users-round":
        return <UsersRound className="w-7 h-7 text-[var(--gold)] mb-5" />;
      default:
        return <Shield className="w-7 h-7 text-[var(--gold)] mb-5" />;
    }
  };

  return (
    <div className="bg-[var(--paper)]">
      {/* 1. INNER HERO */}
      <section className="inner-hero bg-[var(--green)] text-[var(--cream)] px-[8vw] pt-24 pb-28">
        <Link
          href="/"
          className="back-link inline-flex items-center gap-2.5 text-[#d8d3c5] hover:text-[var(--gold)] uppercase tracking-[0.12em] text-[0.78rem] font-bold mb-14 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{dict.nav.backToFestival}</span>
        </Link>

        <span className="section-kicker text-[var(--gold)] uppercase tracking-[0.23em] text-[0.78rem] font-extrabold mb-4 block">
          {dict.committeePage.kicker}
        </span>
        <h1 className="font-serif text-[clamp(3.5rem,7.5vw,7.5rem)] leading-[0.88] font-normal text-white mb-6">
          {dict.committeePage.title} <em className="text-[var(--gold)] italic">{dict.committeePage.titleEm}</em>
        </h1>
        <p className="text-[#e4dfd1] font-serif text-[1.35rem] leading-[1.55] max-w-2xl mt-8">
          {dict.committeePage.intro}
        </p>
      </section>

      {/* 2. EXECUTIVE BOARD SECTION */}
      <section className="py-20 px-[8vw]">
        <div className="mb-12">
          <span className="text-[var(--gold)] uppercase tracking-[0.22em] text-[0.75rem] font-extrabold block mb-2">
            Swiss Association Governance (Art. 60 ff. ZGB)
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-[var(--green-dark)] font-normal mb-3">
            Executive Board
          </h2>
          <p className="text-gray-600 text-sm max-w-2xl leading-relaxed">
            The legally elected board members currently recorded in the founding minutes of Gstaad Cricket Club pursuant to Articles 60 et seq. of the Swiss Civil Code.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {CLUB_CONFIG.executiveBoard.map((member) => (
            <article
              key={member.name}
              className="bg-white grid grid-cols-1 sm:grid-cols-[0.8fr_1.2fr] min-h-[320px] shadow-[0_20px_45px_#1430270d] border border-[#f0ece1] overflow-hidden"
            >
              <div className="member-photo-placeholder bg-gradient-to-br from-[var(--green-dark)] to-[#0a5944] min-h-[260px] sm:min-h-[320px] grid place-items-center relative overflow-hidden">
                <div className="absolute w-[220px] h-[220px] border border-[var(--gold)]/20 rounded-full" />
                <span className="font-serif text-6xl text-[var(--gold)] font-bold relative z-10 select-none">
                  {member.initials}
                </span>
              </div>

              <div className="member-info p-8 sm:p-10 flex flex-col justify-center">
                {getIcon(member.icon)}
                <span className="member-role text-[var(--gold)] uppercase tracking-[0.18em] text-[0.7rem] font-extrabold block mb-1">
                  {member.role}
                </span>
                <span className="text-[0.65rem] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium inline-block w-fit mb-3">
                  {member.statusLabel}
                </span>
                <h3 className="font-serif text-[1.85rem] leading-tight text-[var(--ink)] mb-3 font-normal">
                  {member.name}
                </h3>
                <p className="text-[#6a7771] text-sm leading-relaxed mb-2">
                  {member.bio}
                </p>
                <small className="text-xs text-[#9d9787] mt-auto">
                  Gstaad Cricket Club · Verein nach Art. 60ff. ZGB
                </small>
              </div>
            </article>
          ))}
        </div>

        {/* 3. CLUB OFFICERS SECTION */}
        <div className="mb-12 pt-8 border-t border-gray-200">
          <span className="text-[var(--gold)] uppercase tracking-[0.22em] text-[0.75rem] font-extrabold block mb-2">
            Operations &amp; Community Development
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-[var(--green-dark)] font-normal mb-3">
            Club Officers
          </h2>
          <p className="text-gray-600 text-sm max-w-2xl leading-relaxed">
            Appointed club officers directing youth development pathways, regional cricket outreach, communications, and fixture management.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {CLUB_CONFIG.officers.map((member) => (
            <article
              key={member.name}
              className="bg-white grid grid-cols-1 sm:grid-cols-[0.8fr_1.2fr] min-h-[320px] shadow-[0_20px_45px_#1430270d] border border-[#f0ece1] overflow-hidden"
            >
              <div className="member-photo-placeholder bg-gradient-to-br from-[#1a3a30] to-[#244b3f] min-h-[260px] sm:min-h-[320px] grid place-items-center relative overflow-hidden">
                <div className="absolute w-[220px] h-[220px] border border-[var(--gold)]/20 rounded-full" />
                <span className="font-serif text-6xl text-[var(--gold)] font-bold relative z-10 select-none">
                  {member.initials}
                </span>
              </div>

              <div className="member-info p-8 sm:p-10 flex flex-col justify-center">
                {getIcon(member.icon)}
                <span className="member-role text-[var(--gold)] uppercase tracking-[0.18em] text-[0.7rem] font-extrabold block mb-1">
                  {member.role}
                </span>
                <span className="text-[0.65rem] text-gray-600 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded font-medium inline-block w-fit mb-3">
                  {member.statusLabel}
                </span>
                <h3 className="font-serif text-[1.85rem] leading-tight text-[var(--ink)] mb-3 font-normal">
                  {member.name}
                </h3>
                <p className="text-[#6a7771] text-sm leading-relaxed mb-2">
                  {member.bio}
                </p>
                <small className="text-xs text-[#9d9787] mt-auto">
                  Club Officer · Operational Delivery
                </small>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. STATUTORY GOVERNANCE NOTE */}
      <section className="text-center text-[#6a7771] pb-20 px-[6vw] text-xs max-w-3xl mx-auto space-y-2">
        <p className="font-medium text-gray-700">
          Statutory Governance Notice:
        </p>
        <p className="leading-relaxed">
          In accordance with Swiss association law (Articles 60 et seq. of the Swiss Civil Code) and the founding minutes of Gstaad Cricket Club, the legally elected executive board consists of Sathya Narayanan (President) and Linda Narayanan (Treasurer). Club officers support specialized administrative and sporting operations.
        </p>
      </section>
    </div>
  );
}
