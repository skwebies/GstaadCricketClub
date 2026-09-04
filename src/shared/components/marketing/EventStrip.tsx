import { CalendarDays, Clock3, MapPin, Users } from "lucide-react";

export function EventStrip() {
  return (
    <section className="event-strip bg-[var(--gold)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 py-6 px-[6vw] text-[var(--green-dark)] shadow-md" id="festival">
      <div className="flex items-center gap-4 lg:border-r border-[#062e2230] pb-3 sm:pb-0">
        <CalendarDays className="w-6 h-6 shrink-0 text-[var(--green-dark)]" aria-hidden="true" />
        <span className="grid font-serif text-[1.05rem] leading-snug">
          <small className="font-sans font-extrabold text-[0.65rem] tracking-[0.18em] uppercase text-[#062e22a0]">
            DATE
          </small>
          <strong>26 September 2026</strong>
        </span>
      </div>

      <div className="flex items-center gap-4 lg:border-r border-[#062e2230] pb-3 sm:pb-0">
        <Clock3 className="w-6 h-6 shrink-0 text-[var(--green-dark)]" aria-hidden="true" />
        <span className="grid font-serif text-[1.05rem] leading-snug">
          <small className="font-sans font-extrabold text-[0.65rem] tracking-[0.18em] uppercase text-[#062e22a0]">
            START
          </small>
          <strong>11:00</strong>
        </span>
      </div>

      <div className="flex items-center gap-4 lg:border-r border-[#062e2230] pb-3 sm:pb-0">
        <MapPin className="w-6 h-6 shrink-0 text-[var(--green-dark)]" aria-hidden="true" />
        <span className="grid font-serif text-[1.05rem] leading-snug">
          <small className="font-sans font-extrabold text-[0.65rem] tracking-[0.18em] uppercase text-[#062e22a0]">
            VENUE
          </small>
          <strong>Ebnit School, Gstaad</strong>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Users className="w-6 h-6 shrink-0 text-[var(--green-dark)]" aria-hidden="true" />
        <span className="grid font-serif text-[1.05rem] leading-snug">
          <small className="font-sans font-extrabold text-[0.65rem] tracking-[0.18em] uppercase text-[#062e22a0]">
            ENTRY
          </small>
          <strong>Free for everyone</strong>
        </span>
      </div>
    </section>
  );
}
