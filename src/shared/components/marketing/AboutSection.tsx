/**
 * @file AboutSection.tsx
 * @description About section (#about) detailing the club history, altitude pitch conditions,
 * founder's patron statement, and alpine sportsmanship ethos.
 * @module shared/components/marketing
 */

import { Mountain, Compass, Award, Users, ShieldCheck } from "lucide-react";

export function AboutSection() {
  return (
    <section
      id="about"
      className="py-24 px-6 md:px-12 bg-[#FDFCF7] border-t border-[var(--border)]"
      aria-label="About Gstaad Cricket Club"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="section-kicker">HERITAGE &amp; ALTITUDE</span>
          <h2 className="font-serif text-3xl md:text-5xl text-[var(--ink)] font-normal">
            Where Alpine Splendour Meets{" "}
            <em className="text-[var(--gold)] italic">Centuries of Cricket.</em>
          </h2>
          <p className="text-[var(--muted)] text-base md:text-lg leading-relaxed font-serif">
            Rooted in the Bernese Oberland, Gstaad Cricket Club was created to introduce the gentleman&apos;s game
            to Swiss mountain valleys, inspiring youth and gathering international enthusiasts beneath the Diablerets massif.
          </p>
        </div>

        {/* Feature Grid: Pitch at High Altitude & Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: High Altitude Pitch */}
          <div className="bg-white p-8 rounded-2xl border border-[var(--border)] shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[var(--green)] flex items-center justify-center border border-emerald-100">
                <Mountain className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-[var(--ink)] font-normal">
                Cricket at 1,050m Elevation
              </h3>
              <p className="text-xs md:text-sm text-[var(--muted)] leading-relaxed">
                Playing at altitude in the Saanenland valley introduces a unique dimension to the game:
                thinner alpine air promotes swing movement and swifter boundary carries, framed by crisp mountain breezes.
              </p>
            </div>
            <div className="text-[0.72rem] font-bold uppercase tracking-wider text-[var(--gold)] pt-4 border-t border-gray-100">
              Unique Alpine Pitch Conditions
            </div>
          </div>

          {/* Card 2: Founder & Patron Statement */}
          <div className="bg-[var(--green)] text-white p-8 rounded-2xl border border-[var(--green-dark)] shadow-md space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 text-[var(--gold)] flex items-center justify-center border border-white/10">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-white font-normal">
                President&apos;s Vision
              </h3>
              <p className="text-xs md:text-sm text-[#e2ded2] leading-relaxed italic">
                &ldquo;Cricket taught me perseverance, teamwork, and humility across two decades representing Switzerland.
                Bringing cricket to the children and families of Gstaad is the fulfillment of a lifelong dream.&rdquo;
              </p>
            </div>
            <div className="pt-4 border-t border-white/15 text-xs text-[#d1cbbe]">
              <strong>Sathya Narayanan</strong> — Club Founder &amp; President
            </div>
          </div>

          {/* Card 3: Values of Swiss Alpine Sport */}
          <div className="bg-white p-8 rounded-2xl border border-[var(--border)] shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-[var(--gold)] flex items-center justify-center border border-amber-100">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-[var(--ink)] font-normal">
                Values of the Game
              </h3>
              <p className="text-xs md:text-sm text-[var(--muted)] leading-relaxed">
                We champion the spirit of fair play, respect for opponents and umpires, camaraderie across languages,
                and inclusivity for local schools and community youth.
              </p>
            </div>
            <div className="text-[0.72rem] font-bold uppercase tracking-wider text-[var(--gold)] pt-4 border-t border-gray-100">
              Integrity &amp; Community Inclusivity
            </div>
          </div>
        </div>

        {/* Milestone Bar */}
        <div className="bg-[#f4efdf]/60 p-8 rounded-2xl border border-[#e5decb] grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div>
            <span className="font-serif text-4xl text-[var(--ink)] font-normal block">2026</span>
            <span className="text-[0.7rem] uppercase tracking-widest font-bold text-[var(--gold)]">Inaugural Festival</span>
          </div>
          <div>
            <span className="font-serif text-4xl text-[var(--ink)] font-normal block">1,050m</span>
            <span className="text-[0.7rem] uppercase tracking-widest font-bold text-[var(--gold)]">Pitch Altitude</span>
          </div>
          <div>
            <span className="font-serif text-4xl text-[var(--ink)] font-normal block">20+ Yrs</span>
            <span className="text-[0.7rem] uppercase tracking-widest font-bold text-[var(--gold)]">Leadership Experience</span>
          </div>
          <div>
            <span className="font-serif text-4xl text-[var(--ink)] font-normal block">100% Free</span>
            <span className="text-[0.7rem] uppercase tracking-widest font-bold text-[var(--gold)]">Community Access</span>
          </div>
        </div>
      </div>
    </section>
  );
}
