"use client";

/**
 * @file LanguageContext.tsx
 * @description React Context and custom hooks for internationalization (i18n) across English, German, and French.
 * Supports cookie and localStorage persistence, document language synchronization, and fallback resolution.
 * @module shared/i18n
 */

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import type { SupportedLanguage, TranslationSchema } from "./types";
import { en } from "./locales/en";
import { de } from "./locales/de";
import { fr } from "./locales/fr";

const dictionaries: Record<SupportedLanguage, TranslationSchema> = {
  en,
  de,
  fr,
};

interface LanguageContextValue {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  dict: TranslationSchema;
  t: (path: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const COOKIE_NAME = "gcc_lang";
const STORAGE_KEY = "gcc_lang";

/**
 * Retrieves initial language preference from cookies, localStorage, or browser language.
 */
function getInitialLanguage(): SupportedLanguage {
  if (typeof window === "undefined") return "en";

  try {
    // Check cookie first
    const match = document.cookie.match(new RegExp(`(^|;\\s*)${COOKIE_NAME}=([^;]*)`));
    if (match && (match[2] === "en" || match[2] === "de" || match[2] === "fr")) {
      return match[2] as SupportedLanguage;
    }

    // Check localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "de" || saved === "fr") {
      return saved as SupportedLanguage;
    }

    // Check browser navigator language
    const navLang = navigator.language.toLowerCase();
    if (navLang.startsWith("de")) return "de";
    if (navLang.startsWith("fr")) return "fr";
  } catch {
    // Fallback on any access errors
  }

  return "en";
}

/**
 * Helper to traverse nested dictionary paths (e.g., "hero.title", "membership.adultPrice").
 */
function getNestedValue(obj: unknown, path: string): string | undefined {
  const parts = path.split(".");
  let current: unknown = obj;

  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  return typeof current === "string" ? current : undefined;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("en");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const detected = getInitialLanguage();
    setLanguageState(detected);
    setIsMounted(true);
    document.documentElement.lang = detected;
  }, []);

  const setLanguage = (newLang: SupportedLanguage) => {
    setLanguageState(newLang);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, newLang);
        // Persist for 1 year
        document.cookie = `${COOKIE_NAME}=${newLang};path=/;max-age=31536000;SameSite=Lax`;
        document.documentElement.lang = newLang;
      } catch {
        // Safe failover
      }
    }
  };

  const dict = useMemo(() => dictionaries[language] || en, [language]);

  /**
   * Dot notation resolver with English fallback
   */
  const t = (path: string, fallback?: string): string => {
    const value = getNestedValue(dict, path);
    if (value !== undefined) return value;

    // Fallback to English dictionary
    const enValue = getNestedValue(en, path);
    if (enValue !== undefined) return enValue;

    return fallback ?? path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dict, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook to consume current language, translations dictionary, and setter.
 */
export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    // Return safe default if rendered outside provider (e.g. in some isolated unit test)
    return {
      language: "en",
      setLanguage: () => {},
      dict: en,
      t: (path: string, fallback?: string) => getNestedValue(en, path) ?? fallback ?? path,
    };
  }
  return context;
}
