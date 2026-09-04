import Link from "next/link";
import { ArrowLeft, Shield, UserRoundCog, WalletCards, Megaphone, UsersRound } from "lucide-react";
import { CLUB_CONFIG } from "@/shared/config/club";

export const metadata = {
  title: "Committee | Gstaad Cricket Club",
  description: "Meet the committee of Gstaad Cricket Club.",
};

export default function CommitteePage() {
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
          <span>Back to home</span>
        </Link>

        <span className="section-kicker text-[var(--gold)] uppercase tracking-[0.23em] text-[0.78rem] font-extrabold mb-4 block">
          CLUB LEADERSHIP
        </span>
        <h1 className="font-serif text-[clamp(3.5rem,7.5vw,7.5rem)] leading-[0.88] font-normal text-white mb-6">
          Our <em className="text-[var(--gold)] italic">committee.</em>
        </h1>
        <p className="text-[#e4dfd1] font-serif text-[1.35rem] leading-[1.55] max-w-2xl mt-8">
          A committed local team working together to establish cricket in Gstaad and create welcoming opportunities for the whole community.
        </p>
      </section>

      {/* 2. COMMITTEE GRID */}
      <section className="committee-grid py-24 px-[8vw] grid grid-cols-1 lg:grid-cols-2 gap-8">
        {CLUB_CONFIG.committee.map((member) => (
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
              <span className="member-role text-[var(--gold)] uppercase tracking-[0.18em] text-[0.7rem] font-extrabold block mb-2">
                {member.role}
              </span>
              <h2 className="font-serif text-[1.85rem] leading-tight text-[var(--ink)] mb-3 font-normal">
                {member.name}
              </h2>
              <p className="text-[#6a7771] text-sm leading-relaxed mb-2">
                {member.bio}
              </p>
              <small className="text-xs text-[#9d9787] mt-auto">
                Committee member of Gstaad Cricket Club.
              </small>
            </div>
          </article>
        ))}
      </section>

      {/* 3. PHOTO NOTE */}
      <section className="photo-note text-center text-[#6a7771] pb-24 px-[6vw] text-sm">
        <p>Official committee portraits will be added soon.</p>
      </section>
    </div>
  );
}
