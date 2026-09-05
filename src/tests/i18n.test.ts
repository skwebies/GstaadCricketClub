/**
 * @file i18n.test.ts
 * @description Unit tests for trilingual dictionary parity (EN, DE, FR) and translation completeness.
 */

import { describe, it, expect } from "vitest";
import { en } from "../shared/i18n/locales/en";
import { de } from "../shared/i18n/locales/de";
import { fr } from "../shared/i18n/locales/fr";

function getAllKeys(obj: Record<string, any>, prefix = ""): string[] {
  let keys: string[] = [];
  for (const key of Object.keys(obj)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      keys = keys.concat(getAllKeys(obj[key], fullPath));
    } else {
      keys.push(fullPath);
    }
  }
  return keys.sort();
}

describe("Trilingual Internationalization (i18n) Parity Suite", () => {
  const enKeys = getAllKeys(en);
  const deKeys = getAllKeys(de);
  const frKeys = getAllKeys(fr);

  it("should have exact key count match across English, German, and French", () => {
    expect(enKeys.length).toBeGreaterThan(50);
    expect(deKeys.length).toBe(enKeys.length);
    expect(frKeys.length).toBe(enKeys.length);
  });

  it("German dictionary should contain every key present in English", () => {
    expect(deKeys).toEqual(enKeys);
  });

  it("French dictionary should contain every key present in English", () => {
    expect(frKeys).toEqual(enKeys);
  });

  it("all translations should be non-empty strings", () => {
    function assertNoEmptyValues(obj: Record<string, any>, lang: string) {
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === "string") {
          expect(value.trim().length, `Empty value at ${lang}.${key}`).toBeGreaterThan(0);
        } else if (typeof value === "object" && value !== null) {
          assertNoEmptyValues(value, `${lang}.${key}`);
        }
      }
    }

    assertNoEmptyValues(en, "en");
    assertNoEmptyValues(de, "de");
    assertNoEmptyValues(fr, "fr");
  });

  it("should contain correct language names", () => {
    expect(en.common.languageName).toBe("English");
    expect(de.common.languageName).toBe("Deutsch");
    expect(fr.common.languageName).toBe("Français");
  });

  it("should have accurate festival date across languages", () => {
    expect(en.eventStrip.dateValue).toContain("2026");
    expect(de.eventStrip.dateValue).toContain("2026");
    expect(fr.eventStrip.dateValue).toContain("2026");
  });
});
