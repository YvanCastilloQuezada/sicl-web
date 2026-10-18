import { useCallback, useState } from "react";
import { defaultLanguage, supportedLanguages, type LanguageCode } from "./languages";
import { t as translate, type TranslationKey } from "./catalog";
export const LANGUAGE_STORAGE_KEY = "arki-ui-language-v1";
type LanguageStorage = { getItem: (key: string) => string | null; setItem: (key: string, value: string) => void };
export function readPersistedLanguage(storage: LanguageStorage): LanguageCode { const saved = storage.getItem(LANGUAGE_STORAGE_KEY); return supportedLanguages.some(({ code }) => code === saved) ? saved as LanguageCode : defaultLanguage; }
export function persistLanguage(storage: LanguageStorage, language: LanguageCode) { storage.setItem(LANGUAGE_STORAGE_KEY, language); }
function browserLanguage(): LanguageCode { return typeof localStorage === "undefined" ? defaultLanguage : readPersistedLanguage(localStorage); }
export function useTranslation() { const [language, setLanguageState] = useState<LanguageCode>(() => browserLanguage()); const setLanguage = useCallback((next: LanguageCode) => { if (typeof localStorage !== "undefined") persistLanguage(localStorage, next); setLanguageState(next); }, []); const t = useCallback((key: TranslationKey) => translate(key, language), [language]); return { language, setLanguage, t, supportedLanguages }; }
