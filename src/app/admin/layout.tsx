"use client";

/**
 * @file admin/layout.tsx
 * @description Role-based layout for the Gstaad Cricket Club Administrative Control Panel.
 * Features unauthenticated visitor login guard, role badges (Admin, Manager, Staff),
 * role-filtered navigation, and session termination.
 * @module app/admin
 */

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
  Shield,
  ShieldCheck,
  Loader2,
  Lock,
} from "lucide-react";
import { AuthProvider, useAuth } from "@/core/auth/AuthContext";
import { canAccessPath } from "@/core/auth/auth-types";
import { AdminLoginForm } from "@/shared/components/admin/AdminLoginForm";
import { useLanguage } from "@/shared/i18n/LanguageContext";
import { LanguageSwitcher } from "@/shared/components/common/LanguageSwitcher";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const { dict } = useLanguage();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // If on explicit login page, just render children
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-[var(--green-dark)]">{children}</div>;
  }

  // Show loading spinner while determining session
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--green-dark)] flex flex-col items-center justify-center text-white gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--gold)]" />
        <span className="font-serif text-sm tracking-wider uppercase text-[var(--cream)]">
          {dict.common.loading}
        </span>
      </div>
    );
  }

  // If unauthenticated visitor accesses /admin, present professional login screen
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--green-dark)] relative overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-[var(--green)] rounded-full blur-3xl opacity-30 -top-40 -right-40 pointer-events-none" />
        <div className="absolute w-[400px] h-[400px] bg-[var(--gold)] rounded-full blur-3xl opacity-10 -bottom-20 -left-20 pointer-events-none" />
        <AdminLoginForm />
      </div>
    );
  }

  // Check role-based permission for current path
  const hasAccess = canAccessPath(user.role, pathname);

  const allNavLinks = [
    { label: dict.admin.dashboard, href: "/admin", icon: LayoutDashboard, requiredRole: ["admin", "manager", "staff"] },
    { label: dict.admin.registrations, href: "/admin/registrations", icon: Users, requiredRole: ["admin", "manager", "staff"] },
    { label: dict.admin.members, href: "/admin/members", icon: UserCheck, requiredRole: ["admin", "manager"] },
    { label: dict.admin.events, href: "/admin/events", icon: CalendarDays, requiredRole: ["admin", "manager"] },
    { label: dict.admin.inquiries, href: "/admin/inquiries", icon: Mail, requiredRole: ["admin", "manager"] },
    { label: dict.admin.auditLogs, href: "/admin/audit-logs", icon: ShieldAlert, requiredRole: ["admin"] },
    { label: dict.admin.settings, href: "/admin/settings", icon: Settings, requiredRole: ["admin"] },
  ];

  // Filter links available for current role
  const visibleNavLinks = allNavLinks.filter((item) => item.requiredRole.includes(user.role));

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-[var(--gold)] text-[var(--green-dark)] border-[var(--gold)]";
      case "manager":
        return "bg-emerald-500 text-white border-emerald-400";
      case "staff":
        return "bg-sky-500 text-white border-sky-400";
      default:
        return "bg-gray-500 text-white";
    }
  };

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
        <div className="flex items-center gap-2">
          <span className={`text-[0.6rem] font-bold uppercase px-2 py-0.5 rounded-full ${getRoleBadgeStyle(user.role)}`}>
            {user.role}
          </span>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-1.5 text-white/80 hover:text-white"
            aria-label="Toggle navigation"
          >
            {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
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
                  {dict.admin.portalSubtitle}
                </small>
              </div>
            </Link>
          </div>

          {/* Active User Badge Card */}
          <div className="mx-4 my-4 p-3.5 bg-white/5 border border-white/10 rounded-md">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[0.65rem] uppercase tracking-widest text-[#a8b5af] font-bold">
                {dict.admin.activeRole}
              </span>
              <span
                className={`text-[0.65rem] font-extrabold uppercase px-2 py-0.5 rounded border tracking-wider ${getRoleBadgeStyle(
                  user.role
                )}`}
              >
                {user.role.toUpperCase()}
              </span>
            </div>
            <div className="text-sm font-serif font-bold text-white truncate">
              {user.fullName}
            </div>
            <div className="text-[0.7rem] text-[#c5a059] truncate">
              {user.title}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {visibleNavLinks.map((link) => {
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

        {/* User Footer & Logout */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-[0.7rem] text-white/50 uppercase font-bold tracking-wider">
              {dict.common.languageName}
            </span>
            <LanguageSwitcher variant="footer" className="scale-80" />
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between text-xs text-white/70 hover:text-[var(--gold)] px-4 py-2 rounded-md hover:bg-white/5 transition-colors"
          >
            <span>{dict.nav.backToFestival}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-md bg-red-950/30 border border-red-800/40 text-red-200 hover:bg-red-900/40 text-xs font-bold transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span>{dict.admin.signOut}</span>
            </span>
            <span className="text-[0.65rem] opacity-60">({user.role})</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto">
          {!hasAccess ? (
            <div className="p-8 bg-white border-t-4 border-red-500 shadow-md text-center max-w-lg mx-auto mt-12 space-y-4">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-2xl text-[var(--ink)]">Access Restricted</h2>
              <p className="text-sm text-gray-600">
                Your current role (<strong>{user.role.toUpperCase()}</strong>) does not have permission to view this section.
              </p>
              <div className="pt-4">
                <Link
                  href="/admin"
                  className="bg-[var(--gold)] text-[var(--green-dark)] px-5 py-2.5 font-bold text-xs uppercase tracking-wider rounded inline-block"
                >
                  Return to Dashboard
                </Link>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AuthProvider>
  );
}
