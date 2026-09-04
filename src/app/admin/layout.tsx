"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  UserCheck,
  Mail,
  ShieldAlert,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // If on login page, render full width without sidebar
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-[var(--green-dark)]">{children}</div>;
  }

  const navLinks = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Festival Registrations", href: "/admin/registrations", icon: Users },
    { label: "Club Members", href: "/admin/members", icon: UserCheck },
    { label: "Events Manager", href: "/admin/events", icon: CalendarDays },
    { label: "Inquiries Inbox", href: "/admin/inquiries", icon: Mail },
    { label: "Security Audit Logs", href: "/admin/audit-logs", icon: ShieldAlert },
    { label: "Club Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f5f6f7] flex flex-col md:flex-row text-[var(--ink)]">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[var(--green-dark)] text-[var(--cream)] px-6 py-4 flex items-center justify-between border-b border-white/10 z-20">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="relative w-8 h-8">
            <Image
              src="/gstaad-cricket-club-crest.png"
              alt="Gstaad Cricket Club Crest"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-serif font-bold text-sm tracking-wide">
            GCC ADMIN
          </span>
        </Link>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-1.5 text-white/80 hover:text-white"
          aria-label="Toggle navigation"
        >
          {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`w-full md:w-72 bg-[var(--green-dark)] text-white flex flex-col justify-between shrink-0 ${
          mobileNavOpen ? "block" : "hidden md:flex"
        } transition-all duration-200`}
      >
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-white/10">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 transition-transform group-hover:scale-105">
                <Image
                  src="/gstaad-cricket-club-crest.png"
                  alt="Gstaad Cricket Club Crest"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <strong className="font-serif text-base block tracking-wide text-white">
                  GSTAAD CRICKET
                </strong>
                <small className="text-[var(--gold)] text-[0.65rem] font-bold tracking-[0.2em] uppercase block">
                  CONTROL PANEL
                </small>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-md text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? "bg-[var(--gold)] text-[var(--green-dark)] font-bold shadow-sm"
                      : "text-white/75 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between text-xs text-white/70 hover:text-[var(--gold)] px-4 py-2 rounded-md hover:bg-white/5 transition-colors"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="bg-white/5 p-3 rounded-md flex items-center justify-between">
            <div className="text-xs">
              <div className="font-semibold text-white">Administrator</div>
              <div className="text-white/50 text-[0.7rem]">Role: Admin</div>
            </div>
            <Link
              href="/admin/login"
              className="p-1.5 text-white/60 hover:text-[var(--gold)]"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
