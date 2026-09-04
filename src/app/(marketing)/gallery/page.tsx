import Link from "next/link";
import { ArrowLeft, Camera, Mountain, Image as ImageIcon, Upload } from "lucide-react";

export const metadata = {
  title: "Gallery | Gstaad Cricket Club",
  description: "Photographs and memories from Gstaad Cricket Club.",
};

export default function GalleryPage() {
  return (
    <div className="bg-[var(--paper)]">
      {/* 1. GALLERY HERO */}
      <section
        className="inner-hero gallery-hero text-[var(--cream)] px-[8vw] pt-24 pb-28 relative overflow-hidden"
        style={{
          background: "linear-gradient(120deg, #032b22, #0b503e)",
        }}
      >
        <Link
          href="/"
          className="back-link inline-flex items-center gap-2.5 text-[#d8d3c5] hover:text-[var(--gold)] uppercase tracking-[0.12em] text-[0.78rem] font-bold mb-14 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to home</span>
        </Link>

        <span className="section-kicker text-[var(--gold)] uppercase tracking-[0.23em] text-[0.78rem] font-extrabold mb-4 block">
          CLUB MOMENTS
        </span>
        <h1 className="font-serif text-[clamp(3.5rem,7.5vw,7.5rem)] leading-[0.88] font-normal text-white mb-6">
          Our cricket.
          <br />
          <em className="text-[var(--gold)] italic">Our community.</em>
        </h1>
        <p className="text-[#e4dfd1] font-serif text-[1.35rem] leading-[1.55] max-w-2xl mt-8">
          This is where we will share the people, matches and memorable moments that shape Gstaad Cricket Club.
        </p>
      </section>

      {/* 2. GALLERY COMING SOON */}
      <section className="gallery-coming text-center py-24 md:py-32 px-[8vw]">
        <div className="gallery-mark flex items-center justify-center gap-4 text-[var(--gold)] mb-8">
          <Camera className="w-10 h-10" />
          <Mountain className="w-10 h-10" />
        </div>

        <span className="section-kicker text-[var(--gold)] uppercase tracking-[0.23em] text-[0.78rem] font-extrabold mb-4 inline-block">
          GALLERY OPENING SOON
        </span>
        <h2 className="font-serif text-[clamp(3rem,6vw,5.8rem)] leading-[0.92] font-normal text-[var(--ink)] mb-6">
          The first photographs
          <br />
          are on their way.
        </h2>
        <p className="text-[#607069] text-[1.1rem] leading-[1.7] max-w-xl mx-auto mb-16">
          Images from our community activities and the first Gstaad Cricket Festival will appear here.
        </p>

        {/* Placeholder Slots */}
        <div className="gallery-slots grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[1, 2, 3].map((slot) => (
            <div
              key={slot}
              className="aspect-[4/3] bg-[var(--cream)] border border-[#d9d1bc] flex flex-col items-center justify-center gap-4 p-6 group transition-all duration-300 hover:border-[var(--gold)]"
            >
              <ImageIcon className="w-10 h-10 text-[var(--gold)] transition-transform duration-300 group-hover:scale-110" />
              <span className="uppercase tracking-[0.13em] text-[0.75rem] font-extrabold text-[#8e897a]">
                Club photograph {slot}
              </span>
            </div>
          ))}
        </div>

        <div className="gallery-footnote flex items-center justify-center gap-2.5 text-[#69766f] text-sm mt-12">
          <Upload className="w-4 h-4 text-[var(--gold)]" />
          <span>Real club photographs will replace these clearly marked spaces.</span>
        </div>
      </section>
    </div>
  );
}
