"use client";

/**
 * @file AdminLoginForm.tsx
 * @description Refined administrative login form requiring manual credential entry.
 * Features role selection tabs (Admin, Manager, Staff), password authentication,
 * reasonable typography proportions, and trilingual localization.
 * @module shared/components/admin
 */

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, AlertCircle, Loader2, Shield, UserCheck, Users } from "lucide-react";
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
  const { login } = useAuth();
  const { dict } = useLanguage();

  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
  // Credentials must be entered manually by the visitor
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setError(null);
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Please enter both your email address and password.");
      setLoading(false);
      return;
    }

    try {
      await login(trimmedEmail, trimmedPassword, selectedRole);
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirectTo);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : dict.common.error;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const rolesConfig: { role: UserRole; title: string; subtitle: string; icon: any }[] = [
    {
      role: "admin",
      title: dict.admin.roleAdmin.split("/")[0].trim(),
      subtitle: dict.admin.roleAdminDesc,
      icon: Shield,
    },
    {
      role: "manager",
      title: dict.admin.roleManager.split("/")[0].trim(),
      subtitle: dict.admin.roleManagerDesc,
      icon: UserCheck,
    },
    {
      role: "staff",
      title: dict.admin.roleStaff.split("/")[0].trim(),
      subtitle: dict.admin.roleStaffDesc,
      icon: Users,
    },
  ];

  return (
    <div className="w-full max-w-lg mx-auto bg-white p-6 sm:p-10 shadow-2xl relative border-t-4 border-[var(--gold)]">
      {/* Top bar with language switcher */}
      <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
        <span className="text-[0.65rem] uppercase tracking-widest text-[#7c857f] font-extrabold">
          {dict.admin.portalSubtitle}
        </span>
        <LanguageSwitcher variant="header" className="scale-90" />
      </div>

      {/* Header crest and title with reasonable typography */}
      <div className="text-center mb-6">
        <div className="relative w-14 h-14 mx-auto mb-3">
          <Image
            src="/gstaad-cricket-club-crest.png"
            alt="Gstaad Cricket Club Crest"
            fill
            className="object-contain"
          />
        </div>
        <h2 className="font-serif text-2xl sm:text-[1.65rem] text-[var(--ink)] font-normal tracking-normal leading-snug">
          {dict.admin.portalTitle}
        </h2>
        <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#7c857f] font-bold mt-1">
          {dict.nav.brandTitle} {dict.nav.brandSubtitle}
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 bg-red-50 border-l-4 border-[var(--red)] text-[var(--red)] text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Role Selection Tabs */}
      <div className="mb-5">
        <label className="block text-[0.68rem] uppercase font-extrabold tracking-[0.1em] text-[var(--ink)] mb-2">
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
                className={`p-2.5 rounded border text-left flex flex-col justify-between min-h-[78px] transition-all cursor-pointer ${
                  isSelected
                    ? "border-[var(--green-dark)] bg-[var(--green-dark)] text-white shadow-sm ring-2 ring-[var(--gold)]"
                    : "border-gray-200 bg-[#fbfbfa] text-gray-700 hover:border-gray-300 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-[var(--gold)]" : "text-gray-400"}`} />
                  <span
                    className={`text-[0.58rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      isSelected ? "bg-[var(--gold)] text-[var(--green-dark)]" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {item.role}
                  </span>
                </div>
                <div className="mt-1.5">
                  <strong className="block text-[0.72rem] font-serif leading-tight">{item.title}</strong>
                </div>
              </button>
            );
          })}
        </div>
        <p className="text-[0.7rem] text-[#6a7771] mt-1.5 italic">
          {DEMO_ACCOUNTS[selectedRole].description}
        </p>
      </div>

      {/* Credentials Form — Requires Manual Entry */}
      <form onSubmit={handleManualLogin} autoComplete="off" className="space-y-4">
        <label className="block text-[0.72rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]">
          {dict.admin.emailLabel}
          <div className="relative mt-1.5">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              required
              type="email"
              name="gcc_user_email"
              id="gcc_user_email"
              autoComplete="off"
              placeholder={`e.g. ${DEMO_ACCOUNTS[selectedRole].email}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#fdfcf8] border border-[#c9ccc8] min-h-[42px] pl-10 pr-4 text-sm font-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
            />
          </div>
        </label>

        <label className="block text-[0.72rem] uppercase font-extrabold tracking-[0.09em] text-[var(--ink)]">
          {dict.admin.passwordLabel}
          <div className="relative mt-1.5">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              required
              type="password"
              name="gcc_user_password"
              id="gcc_user_password"
              autoComplete="new-password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#fdfcf8] border border-[#c9ccc8] min-h-[42px] pl-10 pr-4 text-sm font-normal text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
            />
          </div>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--gold)] text-[var(--green-dark)] hover:bg-[var(--gold-hover)] py-3 font-extrabold uppercase tracking-wider text-xs flex items-center justify-center gap-2.5 transition-colors cursor-pointer disabled:opacity-50 mt-4 shadow-sm"
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

      {/* Security notice & public link */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
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
