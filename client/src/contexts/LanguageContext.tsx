import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

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

export type LanguageCode = (typeof supportedLanguages)[number]["code"];

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  languages: typeof supportedLanguages;
};

const STORAGE_KEY = "sims-dei-language";
const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function detectLanguage(): LanguageCode {
  if (typeof window === "undefined") return "es";
  const stored = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
  if (stored && supportedLanguages.some((item) => item.code === stored)) return stored;
  const browserLanguage = navigator.language.toLowerCase().split("-")[0] as LanguageCode;
  return supportedLanguages.some((item) => item.code === browserLanguage) ? browserLanguage : "es";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(detectLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage: (next: LanguageCode) => setLanguageState(next),
      languages: supportedLanguages,
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}

export type { LanguageContextValue };

export default LanguageContext;

// The selector is intentionally independent from the translation catalog so the
// language preference can be introduced before the complete UI copy is localized.
