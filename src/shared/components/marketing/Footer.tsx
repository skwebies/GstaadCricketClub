import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[var(--green-dark)] text-[#d8d4c7] min-h-[170px] py-10 px-[6vw] flex flex-col md:flex-row items-center justify-between gap-6 text-[0.85rem] border-t border-white/5">
      <Link href="/" className="brand flex items-center gap-3 text-[var(--cream)] group">
        <div className="relative w-12 h-12">
          <Image
            src="/gstaad-cricket-club-crest.png"
            alt="Gstaad Cricket Club Crest"
            fill
            sizes="48px"
            className="object-contain"
          />
        </div>
        <span className="grid leading-none">
          <strong className="font-serif text-[1.15rem] tracking-wide text-white">GSTAAD</strong>
          <small className="tracking-[0.22em] mt-1 text-[0.62rem] text-[var(--gold)] font-bold">
            CRICKET CLUB
          </small>
        </span>
      </Link>

      <p className="text-center md:text-left text-[#b8b3a5]">
        Developing cricket in Gstaad and the surrounding region. ·{" "}
        <Link href="/about" className="text-[var(--gold)] hover:underline">
          About us
        </Link>{" "}
        ·{" "}
        <Link href="/committee" className="text-[var(--gold)] hover:underline">
          Committee
        </Link>{" "}
        ·{" "}
        <Link href="/membership" className="text-[var(--gold)] hover:underline">
          Membership
        </Link>{" "}
        ·{" "}
        <Link href="/admin" className="text-[var(--gold)] hover:underline">
          Admin Portal
        </Link>
      </p>

      <div className="text-right text-xs text-[#9d9787]">
        <span>Affiliated to Cricket Switzerland · © 2026 Gstaad Cricket Club</span>
      </div>
    </footer>
  );
}
