import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import i18n, { I18N_STORAGE_KEY } from "@/i18n";

export const supportedLanguages = [
  { code: "es", label: "Español", nativeLabel: "Español" },
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "pt", label: "Português", nativeLabel: "Português" },
  { code: "it", label: "Italiano", nativeLabel: "Italiano" },
  { code: "fr", label: "Français", nativeLabel: "Français" },
  { code: "de", label: "Deutsch", nativeLabel: "Deutsch" },
  { code: "ru", label: "Русский", nativeLabel: "Русский" },
  { code: "zh", label: "中文", nativeLabel: "中文" },
] as const;

const LANGUAGE_CHOICE_KEY = "sims-dei-lang-user-set";

export type LanguageCode = (typeof supportedLanguages)[number]["code"];
type LanguageContextValue = { language: LanguageCode; setLanguage: (language: LanguageCode) => void; languages: typeof supportedLanguages };
const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function normalizeLanguage(value: string | undefined | null): LanguageCode | undefined {
  const code = value?.toLowerCase().split("-")[0];
  return supportedLanguages.some((item) => item.code === code) ? (code as LanguageCode) : undefined;
}

export function detectLanguage(): LanguageCode {
  if (typeof window === "undefined") return "es";
  if (localStorage.getItem(LANGUAGE_CHOICE_KEY) === "true") {
    return normalizeLanguage(localStorage.getItem(I18N_STORAGE_KEY)) ?? "es";
  }
  return "es";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(detectLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem(I18N_STORAGE_KEY, language);
    void i18n.changeLanguage(language);
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage: (next: LanguageCode) => {
      localStorage.setItem(LANGUAGE_CHOICE_KEY, "true");
      setLanguageState(next);
    },
    languages: supportedLanguages,
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}

export type { LanguageContextValue };
export default LanguageContext;
