"use client";

/**
 * @file EventStrip.tsx
 * @description Localized gold banner displaying high-priority festival logistics
 * (Date, Start Time, Venue, and Free Entry status).
 * @module shared/components/marketing
 */

import { CalendarDays, Clock3, MapPin, Users } from "lucide-react";
import { useLanguage } from "@/shared/i18n/LanguageContext";

export function EventStrip() {
  const { dict } = useLanguage();

  return (
    <section
      className="event-strip bg-[var(--gold)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 py-6 px-[6vw] text-[var(--green-dark)] shadow-md"
      id="festival"
    >
      <div className="flex items-center gap-4 lg:border-r border-[#062e2230] pb-3 sm:pb-0">
        <CalendarDays className="w-6 h-6 shrink-0 text-[var(--green-dark)]" aria-hidden="true" />
        <span className="grid font-serif text-[1.05rem] leading-snug">
          <small className="font-sans font-extrabold text-[0.65rem] tracking-[0.18em] uppercase text-[#062e22a0]">
            {dict.eventStrip.dateLabel}
          </small>
          <strong>{dict.eventStrip.dateValue}</strong>
        </span>
      </div>

      <div className="flex items-center gap-4 lg:border-r border-[#062e2230] pb-3 sm:pb-0">
        <Clock3 className="w-6 h-6 shrink-0 text-[var(--green-dark)]" aria-hidden="true" />
        <span className="grid font-serif text-[1.05rem] leading-snug">
          <small className="font-sans font-extrabold text-[0.65rem] tracking-[0.18em] uppercase text-[#062e22a0]">
            {dict.eventStrip.startLabel}
          </small>
          <strong>{dict.eventStrip.startValue}</strong>
        </span>
      </div>

      <div className="flex items-center gap-4 lg:border-r border-[#062e2230] pb-3 sm:pb-0">
        <MapPin className="w-6 h-6 shrink-0 text-[var(--green-dark)]" aria-hidden="true" />
        <span className="grid font-serif text-[1.05rem] leading-snug">
          <small className="font-sans font-extrabold text-[0.65rem] tracking-[0.18em] uppercase text-[#062e22a0]">
            {dict.eventStrip.venueLabel}
          </small>
          <strong>{dict.eventStrip.venueValue}</strong>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Users className="w-6 h-6 shrink-0 text-[var(--green-dark)]" aria-hidden="true" />
        <span className="grid font-serif text-[1.05rem] leading-snug">
          <small className="font-sans font-extrabold text-[0.65rem] tracking-[0.18em] uppercase text-[#062e22a0]">
            {dict.eventStrip.entryLabel}
          </small>
          <strong>{dict.eventStrip.entryValue}</strong>
        </span>
      </div>
    </section>
  );
}
