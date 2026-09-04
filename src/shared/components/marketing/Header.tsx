"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Shield } from "lucide-react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="site-header z-30 w-full h-[88px] text-[var(--cream)] flex items-center justify-between px-[5vw] absolute top-0 left-0">
      <Link href="/" className="brand flex items-center gap-3 tracking-[0.08em] group">
        <div className="relative w-[54px] h-[54px] transition-transform duration-300 group-hover:scale-105">
          <Image
            src="/gstaad-cricket-club-crest.png"
            alt="Gstaad Cricket Club Crest"
            fill
            sizes="58px"
            priority
            className="object-contain"
          />
        </div>
        <span className="grid leading-none">
          <strong className="font-serif text-[1.25rem] tracking-wide text-white">GSTAAD</strong>
          <small className="tracking-[0.24em] mt-1 text-[0.68rem] text-[var(--gold)] font-bold">
            CRICKET CLUB
          </small>
        </span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8 text-[0.92rem] font-bold">
        <Link
          href="/#festival"
          className="hover:text-[var(--gold)] transition-colors duration-200"
        >
          Festival
        </Link>
        <Link
          href="/about"
          className={`hover:text-[var(--gold)] transition-colors duration-200 ${
            pathname === "/about" ? "text-[var(--gold)]" : ""
          }`}
        >
          About
        </Link>
        <Link
          href="/committee"
          className={`hover:text-[var(--gold)] transition-colors duration-200 ${
            pathname === "/committee" ? "text-[var(--gold)]" : ""
          }`}
        >
          Committee
        </Link>
        <Link
          href="/gallery"
          className={`hover:text-[var(--gold)] transition-colors duration-200 ${
            pathname === "/gallery" ? "text-[var(--gold)]" : ""
          }`}
        >
          Gallery
        </Link>
        <Link
          href="/membership"
          className={`hover:text-[var(--gold)] transition-colors duration-200 ${
            pathname === "/membership" ? "text-[var(--gold)]" : ""
          }`}
        >
          Membership
        </Link>
        <Link
          href="/#supporters"
          className="hover:text-[var(--gold)] transition-colors duration-200"
        >
          Supporters
        </Link>
        <Link
          href="/admin"
          className="hover:text-[var(--gold)] text-white/70 flex items-center gap-1.5 transition-colors duration-200"
          title="Administrative Portal"
        >
          <Shield className="w-3.5 h-3.5 text-[var(--gold)]" />
          <span>Admin</span>
        </Link>
        <Link
          href="/#register"
          className="border border-[var(--gold)] text-[var(--gold)] px-5 py-3 hover:bg-[var(--gold)] hover:text-[var(--green-dark)] transition-all duration-200 font-bold uppercase tracking-wider text-xs"
        >
          Register free
        </Link>
      </nav>

      {/* Mobile Menu Toggle Button */}
      <button
        onClick={toggleMenu}
        aria-label="Toggle navigation"
        className="md:hidden p-2 text-[var(--cream)] hover:text-[var(--gold)] focus:outline-none"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[var(--green-dark)] bg-opacity-98 flex flex-col pt-24 px-8 pb-10 space-y-6 animate-in fade-in duration-200">
          <div className="flex justify-end mb-4">
            <button
              onClick={closeMenu}
              aria-label="Close menu"
              className="p-2 text-[var(--cream)] hover:text-[var(--gold)]"
            >
              <X className="w-7 h-7" />
            </button>
          </div>
          <Link
            href="/#festival"
            onClick={closeMenu}
            className="text-xl font-bold hover:text-[var(--gold)] py-2 border-b border-white/10"
          >
            Festival
          </Link>
          <Link
            href="/about"
            onClick={closeMenu}
            className="text-xl font-bold hover:text-[var(--gold)] py-2 border-b border-white/10"
          >
            About
          </Link>
          <Link
            href="/committee"
            onClick={closeMenu}
            className="text-xl font-bold hover:text-[var(--gold)] py-2 border-b border-white/10"
          >
            Committee
          </Link>
          <Link
            href="/gallery"
            onClick={closeMenu}
            className="text-xl font-bold hover:text-[var(--gold)] py-2 border-b border-white/10"
          >
            Gallery
          </Link>
          <Link
            href="/membership"
            onClick={closeMenu}
            className="text-xl font-bold hover:text-[var(--gold)] py-2 border-b border-white/10"
          >
            Membership
          </Link>
          <Link
            href="/#supporters"
            onClick={closeMenu}
            className="text-xl font-bold hover:text-[var(--gold)] py-2 border-b border-white/10"
          >
            Supporters
          </Link>
          <Link
            href="/admin"
            onClick={closeMenu}
            className="text-xl font-bold hover:text-[var(--gold)] py-2 border-b border-white/10 flex items-center gap-2"
          >
            <Shield className="w-5 h-5 text-[var(--gold)]" />
            <span>Admin Portal</span>
          </Link>
          <Link
            href="/#register"
            onClick={closeMenu}
            className="mt-6 border border-[var(--gold)] text-center text-[var(--gold)] py-4 font-bold uppercase tracking-wider text-sm hover:bg-[var(--gold)] hover:text-[var(--green-dark)]"
          >
            Register free
          </Link>
        </div>
      )}
    </header>
  );
}
