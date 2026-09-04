import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Heart, HandHeart, Sparkles } from "lucide-react";
import { EventStrip } from "@/shared/components/marketing/EventStrip";
import { RegistrationForm } from "@/shared/components/marketing/RegistrationForm";
import { CLUB_CONFIG } from "@/shared/config/club";
import { formatCHF } from "@/shared/utils/formatters";

export const metadata = {
  title: "Gstaad Cricket Club | Cricket for Our Community",
  description:
    "Gstaad Cricket Club welcomes children, adults, families and beginners. Join our free Cricket Festival at Ebnit School on 26 September 2026.",
};

export default function HomePage() {
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
            Gstaad’s first community cricket festival
          </span>
          <h1 className="font-serif text-[clamp(3.8rem,7.5vw,7.8rem)] leading-[0.85] font-normal text-white mb-6">
            Cricket comes
            <br />
            to <em className="text-[var(--gold)] italic">Gstaad.</em>
          </h1>
          <p className="hero-intro text-[#eee8d8] text-lg sm:text-[1.2rem] leading-[1.65] my-8 max-w-[620px]">
            A free day of cricket for children, adults, families and complete
            beginners. Come play, learn and help us grow the game in our region.
          </p>

          <div className="hero-actions flex flex-wrap items-center gap-6">
            <Link
              href="#register"
              className="primary-button bg-[var(--gold)] text-[var(--green-dark)] hover:bg-[var(--gold-hover)] px-7 py-4 font-extrabold text-sm uppercase tracking-wider inline-flex items-center gap-3.5 transition-colors duration-200"
            >
              <span>Reserve your place</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="free-note text-[#d9d3c2] text-[0.92rem] font-medium">
              Free entry · Everyone welcome
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
              Affiliated to
              <br />
              <strong className="text-[var(--cream)] text-[0.88rem] normal-case tracking-normal">
                Cricket Switzerland
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
          26 · 09 · 2026
        </span>
        <div className="festival-grid grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-[9vw] items-start">
          <div>
            <h2 className="font-serif text-[clamp(3.2rem,6vw,6rem)] leading-[0.93] font-normal text-[var(--ink)]">
              One day.
              <br />
              One pitch.
              <br />
              <em className="text-[var(--gold)] italic">A new tradition.</em>
            </h2>
          </div>

          <div className="festival-copy space-y-6">
            <p className="lead font-serif text-[1.65rem] leading-[1.45] text-[var(--ink)]">
              Whether you already love cricket or have never held a bat, this festival is your invitation to join in.
            </p>
            <p className="text-[#5c6d66] text-[1.02rem] leading-[1.75]">
              Meet local players, learn the basics, try batting and bowling, and enjoy a welcoming community atmosphere in the heart of Gstaad.
            </p>

            <div className="audience-list grid grid-cols-1 sm:grid-cols-2 border-t border-[#bcb8aa] mt-10">
              {CLUB_CONFIG.festival.audience.map((item) => (
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
            OUR PURPOSE
          </span>
          <h2 className="font-serif text-[clamp(2.8rem,5vw,5rem)] leading-[0.96] font-normal text-white mb-6">
            Building cricket
            <br />
            from the ground up.
          </h2>
          <p className="text-[#dfdbcf] text-[1.1rem] leading-[1.7] max-w-[600px] mb-8">
            Gstaad Cricket Club exists to make cricket accessible to the local community—creating opportunities to play, learn, belong and compete.
          </p>

          <div className="values flex flex-wrap gap-3">
            <span className="text-[var(--gold)] uppercase tracking-[0.13em] border border-[#d2ae5260] px-4 py-2 text-[0.72rem] font-bold">
              Community
            </span>
            <span className="text-[var(--gold)] uppercase tracking-[0.13em] border border-[#d2ae5260] px-4 py-2 text-[0.72rem] font-bold">
              Development
            </span>
            <span className="text-[var(--gold)] uppercase tracking-[0.13em] border border-[#d2ae5260] px-4 py-2 text-[0.72rem] font-bold">
              Belonging
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
              JOIN THE CLUB
            </span>
            <h2 className="font-serif text-[clamp(3rem,5vw,5.2rem)] leading-[0.94] font-normal text-[var(--ink)] mb-6">
              Membership for
              <br />
              <em className="text-[var(--gold)] italic">every household.</em>
            </h2>
            <p className="text-[#5c6d66] text-[1.05rem] leading-[1.7] max-w-md mb-8">
              Become part of Gstaad Cricket Club and support the development of cricket for our local community and young people.
            </p>
            <Link
              href="/membership"
              className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-widest text-[var(--green)] hover:text-[var(--gold-hover)]"
            >
              <span>Explore membership details</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="membership-content space-y-8">
            <div className="membership-plans grid grid-cols-1 sm:grid-cols-3 gap-4">
              {CLUB_CONFIG.membershipTiers.map((plan) => (
                <article
                  key={plan.id}
                  className={`p-6 sm:p-7 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1 ${
                    plan.featured
                      ? "bg-[var(--green)] text-[var(--cream)] border-t-4 border-[var(--gold)] shadow-lg"
                      : "bg-white text-[var(--ink)] border-t-4 border-[var(--green)]"
                  }`}
                >
                  <div>
                    <span
                      className={`text-[0.72rem] font-extrabold tracking-[0.16em] uppercase block mb-3 ${
                        plan.featured ? "text-[var(--gold)]" : "text-[#7c857f]"
                      }`}
                    >
                      {plan.title}
                    </span>
                    <strong className="font-serif text-[2.1rem] font-normal block leading-none mb-1">
                      <b className="font-sans text-[0.7rem] tracking-wider mr-1">CHF</b>
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

                  <p
                    className={`text-xs mt-4 leading-relaxed ${
                      plan.featured ? "text-[#d8d4c7]" : "text-[#6c7973]"
                    }`}
                  >
                    {plan.description}
                  </p>
                </article>
              ))}
            </div>

            <div className="member-benefits bg-white p-8 border border-[#e4decf]">
              <h3 className="font-serif text-[1.35rem] font-normal text-[var(--ink)] mb-5">
                Members are invited to
              </h3>
              <ul className="space-y-3.5 mb-6">
                {CLUB_CONFIG.memberBenefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3 text-[0.95rem] text-[var(--ink)]">
                    <Check className="w-5 h-5 text-[var(--gold)] shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[#5c6d66] text-sm border-t border-[#e4decf] pt-4">
                To become a member, please speak with a committee member or submit an application online.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SUPPORTERS & DONORS */}
      <section className="supporters-section bg-[var(--paper)] py-24 md:py-32 px-[8vw]" id="supporters">
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-[9vw]">
          <div className="supporters-heading">
            <span className="section-kicker text-[var(--gold)] uppercase tracking-[0.23em] text-[0.78rem] font-extrabold mb-4 block">
              SPONSORS &amp; DONORS
            </span>
            <h2 className="font-serif text-[clamp(3.2rem,6vw,6rem)] leading-[0.92] font-normal text-[var(--ink)]">
              Help cricket
              <br />
              <em className="text-[var(--gold)] italic">take root.</em>
            </h2>
          </div>

          <div className="supporters-content max-w-3xl space-y-6">
            <p className="lead font-serif text-[1.6rem] leading-[1.45] text-[var(--ink)]">
              Every contribution helps us create safe, welcoming cricket opportunities for children, families and beginners in the Gstaad region.
            </p>
            <p className="text-[#5c6d66] text-[1.02rem] leading-[1.75]">
              Support can help provide equipment, coaching, playing facilities and free community events. We warmly welcome local businesses, organisations and individuals who would like to become part of the club’s story.
            </p>

            {/* Founding Sponsors */}
            <div className="named-supporters border-t border-[#c7bea7] pt-7 mt-8">
              <span className="supporters-label text-[#82785f] tracking-[0.19em] uppercase text-[0.7rem] font-extrabold block mb-4">
                FOUNDING SPONSORS
              </span>
              <div className="supporter-logos grid grid-cols-2 sm:grid-cols-4 gap-3.5">
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
            </div>

            {/* Community Donors */}
            <div className="community-donors border-t border-[#c7bea7] pt-7 mt-8">
              <span className="supporters-label text-[#82785f] tracking-[0.19em] uppercase text-[0.7rem] font-extrabold block mb-4">
                COMMUNITY DONORS
              </span>
              <div className="donor-names flex flex-wrap gap-2.5">
                {CLUB_CONFIG.communityDonors.map((donor) => (
                  <span
                    key={donor}
                    className="bg-white text-[var(--green)] border border-[#dcd4c1] px-4 py-2.5 font-serif text-[0.96rem] shadow-xs"
                  >
                    {donor}
                  </span>
                ))}
              </div>
            </div>

            {/* Support Options */}
            <div className="support-options grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="bg-[var(--green)] text-[var(--cream)] p-7 space-y-2">
                <HandHeart className="w-8 h-8 text-[var(--gold)] mb-2" />
                <strong className="font-serif text-[1.35rem] block text-white">
                  Become a sponsor
                </strong>
                <span className="text-[#d7d3c6] text-[0.92rem] leading-normal block">
                  Support the club through a business partnership.
                </span>
              </div>

              <div className="bg-[var(--green)] text-[var(--cream)] p-7 space-y-2">
                <Sparkles className="w-8 h-8 text-[var(--gold)] mb-2" />
                <strong className="font-serif text-[1.35rem] block text-white">
                  Make a donation
                </strong>
                <span className="text-[#d7d3c6] text-[0.92rem] leading-normal block">
                  Contribute to youth and community cricket development.
                </span>
              </div>
            </div>

            <p className="support-contact border-l-4 border-[var(--gold)] pl-4 font-bold text-[var(--green)] mt-6">
              To support the club, please speak with a committee member.
            </p>
          </div>
        </div>
      </section>

      {/* 7. REGISTRATION SECTION */}
      <section className="registration-section bg-[var(--cream)] py-24 md:py-32 px-[8vw]" id="register">
        <div className="grid grid-cols-1 lg:grid-cols-[0.82fr_1.18fr] gap-12 lg:gap-[9vw] items-start">
          <div className="registration-copy">
            <span className="section-kicker text-[var(--gold)] uppercase tracking-[0.23em] text-[0.78rem] font-extrabold mb-4 block">
              FREE REGISTRATION
            </span>
            <h2 className="font-serif text-[clamp(3.2rem,6vw,6rem)] leading-[0.93] font-normal text-[var(--ink)] mb-6">
              Be part of
              <br />
              the first one.
            </h2>
            <p className="text-[#5c6d66] text-[1.05rem] leading-[1.7] max-w-md mb-6">
              Register your interest for the Gstaad Cricket Festival. Bring your family, your friends—or simply your curiosity.
            </p>
            <div className="mini-details space-y-1.5 font-extrabold text-[var(--ink)]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--gold)]" />
                <span>Saturday, 26 September 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--gold)]" />
                <span>11:00 · Ebnit School, Gstaad</span>
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
