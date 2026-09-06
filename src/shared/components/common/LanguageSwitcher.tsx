"use client";

/**
 * @file LanguageSwitcher.tsx
 * @description Swiss luxury dropdown language selector for English (EN), German (DE), and French (FR).
 * Features smooth micro-animations, keyboard accessibility, click-outside dismissal,
 * and Alpine Forest Green / Swiss Luxury Gold styling.
 * @module shared/components/common
 */

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/shared/i18n/LanguageContext";
import type { SupportedLanguage } from "@/shared/i18n/types";
import { ChevronDown, Globe, Check } from "lucide-react";

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  native: string;
  country: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "EN", native: "English", country: "GB/Intl" },
  { code: "de", label: "DE", native: "Deutsch", country: "CH/DE" },
  { code: "fr", label: "FR", native: "Français", country: "CH/FR" },
];

export interface LanguageSwitcherProps {
  className?: string;
  variant?: "header" | "footer" | "compact" | "light";
  align?: "left" | "right";
}

export function LanguageSwitcher({
  className = "",
  variant = "header",
  align = "right",
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const activeLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  // Determine drop direction (footer drops up so it is never clipped)
  const isDropUp = variant === "footer";

  // Trigger button styling depending on variant
  const getTriggerStyles = () => {
    switch (variant) {
      case "footer":
        return "bg-white/10 hover:bg-white/15 text-white border border-white/20";
      case "light":
        return "bg-white hover:bg-[#FDFCF7] text-[var(--ink)] border border-[#c9ccc8] hover:border-[var(--gold)] shadow-sm";
      case "compact":
        return "bg-[#0A1C15]/70 hover:bg-[#0A1C15] text-[#FDFCF7] border border-[#C5A059]/40 hover:border-[var(--gold)]";
      case "header":
      default:
        return "bg-[#0A1C15]/60 hover:bg-[#0A1C15]/90 text-white border border-[#C5A059]/40 hover:border-[var(--gold)] backdrop-blur-md shadow-sm";
    }
  };

  // Dropdown menu container styling
  const getMenuStyles = () => {
    if (variant === "light") {
      return "bg-white border border-[#E2DDD2] text-[var(--ink)] shadow-[0_12px_36px_rgba(0,0,0,0.12)]";
    }
    return "bg-[#0A1C15] border border-[#C5A059]/40 text-[#FDFCF7] shadow-[0_16px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl";
  };

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Select language. Current: ${activeLang.label}`}
        className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/60 ${getTriggerStyles()}`}
      >
        <Globe className="w-3.5 h-3.5 text-[var(--gold)] shrink-0 transition-transform duration-200 group-hover:scale-110" />
        <span className="font-semibold uppercase tracking-wider">{activeLang.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[var(--gold)] transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Languages"
          className={`absolute z-50 w-28 rounded-lg p-1.5 transition-all duration-150 animate-in fade-in zoom-in-95 ${
            isDropUp ? "bottom-full mb-2" : "top-full mt-2"
          } ${align === "right" ? "right-0" : "left-0"} ${getMenuStyles()}`}
        >
          <div className="space-y-1">
            {LANGUAGES.map((item) => {
              const isActive = language === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    setLanguage(item.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-md font-bold tracking-wider transition-all duration-150 cursor-pointer text-left ${
                    isActive
                      ? "bg-[#C5A059] text-[#0A1C15] shadow-xs"
                      : variant === "light"
                      ? "text-[var(--ink)] hover:bg-[#C5A059]/15 hover:text-[#0A1C15]"
                      : "text-[#FDFCF7]/85 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="text-xs font-bold tracking-widest">{item.label}</span>
                  {isActive && <Check className="w-3.5 h-3.5 text-[#0A1C15] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
