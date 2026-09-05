"use client";

/**
 * @file LanguageSwitcher.tsx
 * @description Swiss luxury segmented language selector for English (EN), German (DE), and French (FR).
 * Styled with Alpine Forest Green, warm gold highlights, and micro-animations.
 * @module shared/components/common
 */

import React from "react";
import { useLanguage } from "@/shared/i18n/LanguageContext";
import type { SupportedLanguage } from "@/shared/i18n/types";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "header" | "footer" | "compact";
}

const languages: { code: SupportedLanguage; label: string; full: string }[] = [
  { code: "en", label: "EN", full: "English" },
  { code: "de", label: "DE", full: "Deutsch" },
  { code: "fr", label: "FR", full: "Français" },
];

export function LanguageSwitcher({ className = "", variant = "header" }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language selector"
      className={`inline-flex items-center rounded-full p-0.5 transition-all duration-300 ${
        variant === "footer"
          ? "bg-white/10 border border-white/20 text-white"
          : "bg-[#0A1C15]/40 backdrop-blur-md border border-[#C5A059]/30 text-white"
      } ${className}`}
    >
      {languages.map((item) => {
        const isActive = language === item.code;
        return (
          <button
            key={item.code}
            type="button"
            onClick={() => setLanguage(item.code)}
            aria-pressed={isActive}
            title={item.full}
            className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 tracking-wider ${
              isActive
                ? "bg-[#C5A059] text-[#0A1C15] font-bold shadow-sm"
                : "text-[#FDFCF7]/70 hover:text-white hover:bg-white/10"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
