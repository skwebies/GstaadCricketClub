/**
 * @file EventsSection.tsx
 * @description Events and fixtures section (#events) detailing tournament fixtures,
 * match schedules, high-altitude playing conditions, and spectator hospitality.
 * @module shared/components/marketing
 */

import { Calendar, Clock, MapPin, Wind, Sun, Trophy, ArrowRight } from "lucide-react";

export function EventsSection() {
  const scheduleItems = [
    {
      time: "10:30 – 11:30",
      title: "Junior Cricket Clinic & Beginners Academy",
      desc: "Basic bowling, batting techniques, and soft-ball mini matches for local Swiss children and youth.",
      badge: "Grassroots",
    },
    {
      time: "11:45 – 13:45",
      title: "Gstaad Invitational T20 Match: GCC vs. Swiss Select XI",
      desc: "Competitive high-altitude match with international and Swiss national players.",
      badge: "Featured Match",
    },
    {
      time: "14:00 – 15:30",
      title: "Alpine BBQ, Refreshments & Swiss Raclette Social",
      desc: "Casual hospitality featuring regional Saanenland cheeses, barbecue, and beverages.",
      badge: "Hospitality",
    },
    {
      time: "15:45 – 17:30",
      title: "Super-Over Knockout Tournament & Awards Ceremony",
      desc: "Fast-paced exhibition cricket concluded with the presentation of the 2026 Alpine Trophy.",
      badge: "Grand Final",
    },
  ];

  return (
    <section
      id="events"
      className="py-24 px-6 md:px-12 bg-white border-t border-[var(--border)]"
      aria-label="Fixtures and Events"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="section-kicker">TOURNAMENT CALENDAR</span>
            <h2 className="font-serif text-3xl md:text-5xl text-[var(--ink)] font-normal">
              Gstaad Alpine Cricket Trophy{" "}
              <em className="text-[var(--gold)] italic">2026 Fixtures.</em>
            </h2>
            <p className="text-[var(--muted)] text-base leading-relaxed">
              Mark your calendar for the centerpiece celebration of cricket in the Bernese Oberland.
            </p>
          </div>

          <a
            href="#register"
            className="self-start md:self-auto inline-flex items-center gap-2 bg-[var(--gold)] hover:bg-[var(--gold-hover)] text-[var(--green-dark)] px-5 py-3 rounded-md text-xs font-bold uppercase tracking-widest transition-all shadow-xs"
          >
            <span>Register Attendance</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Featured Tournament Card */}
        <div className="bg-[var(--green-dark)] text-white rounded-3xl p-8 md:p-12 border border-white/10 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[var(--gold)] text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5" />
              <span>OFFICIAL 2026 FIXTURE</span>
            </div>

            <h3 className="font-serif text-3xl md:text-4xl text-white font-normal">
              Gstaad Cricket Festival &amp; Alpine Trophy
            </h3>

            <p className="text-[#d8d3c7] text-sm md:text-base leading-relaxed max-w-2xl">
              An all-day gathering at the Ebnit Ground. Combining competitive cricket, children’s skill development,
              Swiss regional gastronomy, and international sportsmanship.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[var(--gold)] shrink-0" />
                <div>
                  <span className="text-[#a8a49c] block uppercase text-[0.65rem] font-bold">Date</span>
                  <span className="font-semibold text-white">26 September 2026</span>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-3">
                <Clock className="w-5 h-5 text-[var(--gold)] shrink-0" />
                <div>
                  <span className="text-[#a8a49c] block uppercase text-[0.65rem] font-bold">Timings</span>
                  <span className="font-semibold text-white">10:30 – 18:00 CEST</span>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[var(--gold)] shrink-0" />
                <div>
                  <span className="text-[#a8a49c] block uppercase text-[0.65rem] font-bold">Venue</span>
                  <span className="font-semibold text-white">Ebnit Ground, Gstaad</span>
                </div>
              </div>
            </div>
          </div>

          {/* High Altitude Pitch Advisory Box */}
          <div className="lg:col-span-4 bg-black/30 p-6 rounded-2xl border border-white/10 space-y-4">
            <h4 className="font-serif text-lg text-white font-normal flex items-center gap-2">
              <Wind className="w-4 h-4 text-[var(--gold)]" />
              <span>Pitch &amp; Alpine Conditions</span>
            </h4>

            <ul className="space-y-2.5 text-xs text-[#d1cbc0]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] mt-1 shrink-0" />
                <span><strong>Altitude:</strong> 1,050 meters above sea level. Reduced air resistance enables fast-paced bowling and rapid lofted strokes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] mt-1 shrink-0" />
                <span><strong>Surface:</strong> Natural Swiss turf with artificial matting centre strip for consistent, true bounce.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] mt-1 shrink-0" />
                <span><strong>Footwear:</strong> Rubber studs or turf trainers recommended; metal spikes are strictly prohibited.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Schedule Breakdown Timeline */}
        <div className="space-y-6">
          <h3 className="font-serif text-2xl text-[var(--ink)] font-normal">
            Matchday Programme &amp; Schedule Breakdown
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {scheduleItems.map((item, index) => (
              <div
                key={item.title}
                className="bg-[#FDFCF7] p-6 rounded-2xl border border-[var(--border)] space-y-3 relative hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--gold)] uppercase tracking-wider">
                    {item.time}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[0.65rem] uppercase font-bold tracking-wider bg-white border border-gray-200 text-gray-700">
                    {item.badge}
                  </span>
                </div>

                <h4 className="font-serif text-lg text-[var(--ink)] font-normal leading-snug">
                  {item.title}
                </h4>

                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
