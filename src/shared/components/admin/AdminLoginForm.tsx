"use client";

/**
 * @file AdminLoginForm.tsx
 * @description Professional trilingual login form with role selector tabs (Admin, Manager, Staff),
 * one-click demo login, password authentication, and language switcher.
 * @module shared/components/admin
 */

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, AlertCircle, Loader2, Shield, UserCheck, Users, Sparkles } from "lucide-react";
import { useAuth } from "@/core/auth/AuthContext";
import { DEMO_ACCOUNTS } from "@/core/auth/auth-types";
import type { UserRole } from "@/core/domain/entities/Profile";
import { useLanguage } from "@/shared/i18n/LanguageContext";
import { LanguageSwitcher } from "@/shared/components/common/LanguageSwitcher";

interface AdminLoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export function AdminLoginForm({ onSuccess, redirectTo = "/admin" }: AdminLoginFormProps) {
  const router = useRouter();
  const { login, loginAsDemo } = useAuth();
  const { dict } = useLanguage();

  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
  const [email, setEmail] = useState(DEMO_ACCOUNTS.admin.email);
  const [password, setPassword] = useState("SwissCricket2026!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(DEMO_ACCOUNTS[role].email);
    setPassword("SwissCricket2026!");
    setError(null);
  };

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!email || !password) {
        throw new Error("Please enter both email and password.");
      }

      await login(email, password, selectedRole);
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirectTo);
      }
    } catch (err: any) {
      setError(err.message || dict.common.error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: UserRole) => {
    setLoading(true);
    setError(null);
    try {
      await loginAsDemo(role);
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirectTo);
      }
    } catch (err: any) {
      setError(err.message || dict.common.error);
    } finally {
      setLoading(false);
    }
  };

  const rolesConfig: { role: UserRole; title: string; subtitle: string; icon: any; color: string }[] = [
    {
      role: "admin",
      title: dict.admin.roleAdmin.split("/")[0].trim(),
      subtitle: dict.admin.roleAdminDesc,
      icon: Shield,
      color: "border-[var(--gold)] text-[var(--gold)]",
    },
    {
      role: "manager",
      title: dict.admin.roleManager.split("/")[0].trim(),
      subtitle: dict.admin.roleManagerDesc,
      icon: UserCheck,
      color: "border-emerald-600 text-emerald-600",
    },
    {
      role: "staff",
      title: dict.admin.roleStaff.split("/")[0].trim(),
      subtitle: dict.admin.roleStaffDesc,
      icon: Users,
      color: "border-sky-600 text-sky-600",
    },
  ];

  return (
    <div className="w-full max-w-xl mx-auto bg-white p-8 md:p-12 shadow-2xl relative border-t-4 border-[var(--gold)]">
      {/* Top bar with language switcher */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <span className="text-[0.65rem] uppercase tracking-widest text-[#7c857f] font-extrabold">
          {dict.admin.portalSubtitle}
        </span>
        <LanguageSwitcher variant="header" className="scale-90" />
      </div>

      {/* Header crest and title */}
      <div className="text-center mb-8">
        <div className="relative w-16 h-16 mx-auto mb-3">
          <Image
            src="/gstaad-cricket-club-crest.png"
            alt="Gstaad Cricket Club Crest"
            fill
            className="object-contain"
          />
        </div>
        <h1 className="font-serif text-3xl text-[var(--ink)] font-normal">
          {dict.admin.portalTitle}
        </h1>
        <p className="text-xs uppercase tracking-widest text-[#7c857f] font-bold mt-1">
          {dict.nav.brandTitle} {dict.nav.brandSubtitle}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-[var(--red)] text-[var(--red)] text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Role Selection Tabs */}
      <div className="mb-6">
        <label className="block text-[0.7rem] uppercase font-extrabold tracking-[0.1em] text-[var(--ink)] mb-2.5">
          {dict.admin.roleSelector}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {rolesConfig.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedRole === item.role;

            return (
              <button
                key={item.role}
                type="button"
                onClick={() => handleRoleChange(item.role)}
                className={`p-3 rounded border text-left flex flex-col justify-between min-h-[90px] transition-all cursor-pointer ${
                  isSelected
                    ? "border-[var(--green-dark)] bg-[var(--green-dark)] text-white shadow-md ring-2 ring-[var(--gold)]"
                    : "border-gray-200 bg-[#fbfbfa] text-gray-700 hover:border-gray-300 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Icon className={`w-4 h-4 ${isSelected ? "text-[var(--gold)]" : "text-gray-400"}`} />
                  <span
                    className={`text-[0.6rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      isSelected ? "bg-[var(--gold)] text-[var(--green-dark)]" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {item.role}
                  </span>
                </div>
                <div className="mt-2">
                  <strong className="block text-xs font-serif leading-tight">{item.title}</strong>
                </div>
              </button>
            );
          })}
        </div>
        <p className="text-[0.75rem] text-[#6a7771] mt-2 italic">
          {DEMO_ACCOUNTS[selectedRole].description}
        </p>
      </div>

      {/* Quick 1-Click Demo Login Banner */}
      <div className="mb-6 p-3.5 bg-[var(--cream)] border border-[#e4decf] rounded flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-[var(--green-dark)]">
          <Sparkles className="w-4 h-4 text-[var(--gold)] shrink-0" />
          <span>
            {dict.admin.quickDemoLogin} as <strong>{selectedRole.toUpperCase()}</strong>
          </span>
        </div>
        <button
          type="button"
          onClick={() => handleQuickDemo(selectedRole)}
          disabled={loading}
          className="w-full sm:w-auto bg-[var(--green-dark)] hover:bg-[var(--green)] text-white text-xs font-bold px-4 py-2 uppercase tracking-wider transition-colors cursor-pointer"
        >
          {loading ? dict.common.loading : `Instant ${selectedRole.toUpperCase()} Login`}
        </button>
      </div>

      {/* Credentials Form */}
      <form onSubmit={handleCustomLogin} className="space-y-4">
        <label className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]">
          {dict.admin.emailLabel}
          <div className="relative mt-1.5">
            <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#fdfcf8] border border-[#c9ccc8] min-h-[44px] pl-11 pr-4 text-sm font-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
            />
          </div>
        </label>

        <label className="block text-[0.74rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]">
          {dict.admin.passwordLabel}
          <div className="relative mt-1.5">
            <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#fdfcf8] border border-[#c9ccc8] min-h-[44px] pl-11 pr-4 text-sm font-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
            />
          </div>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--gold)] text-[var(--green-dark)] hover:bg-[var(--gold-hover)] py-3.5 font-extrabold uppercase tracking-wider text-sm flex items-center justify-center gap-3 transition-colors cursor-pointer disabled:opacity-50 mt-4 shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{dict.admin.signingInBtn}</span>
            </>
          ) : (
            <>
              <span>{dict.admin.loginBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-5 border-t border-gray-100 text-center text-xs text-gray-500 flex justify-between items-center">
        <Link href="/" className="hover:text-[var(--gold)] underline">
          ← {dict.nav.backToFestival}
        </Link>
        <span className="text-[0.68rem] text-gray-400">
          Gstaad Cricket Club © 2026
        </span>
      </div>
    </div>
  );
}
