export const ARKI_SUPPORTED_LANGUAGES = ["es", "en", "pt", "it", "fr", "de", "ru", "zh"] as const;
export type ArkiDisplayLanguage = (typeof ARKI_SUPPORTED_LANGUAGES)[number];
export const ARKI_DEFAULT_DISPLAY_LANGUAGE: ArkiDisplayLanguage = "es";

export const ARKI_LANGUAGE_NAMES: Record<ArkiDisplayLanguage, string> = {
  es: "Español",
  en: "English",
  pt: "Português",
  it: "Italiano",
  fr: "Français",
  de: "Deutsch",
  ru: "Русский",
  zh: "中文",
};

export function normalizeArkiDisplayLanguage(value: string | null | undefined): ArkiDisplayLanguage {
  const code = value?.toLowerCase().split("-")[0];
  return ARKI_SUPPORTED_LANGUAGES.includes(code as ArkiDisplayLanguage) ? (code as ArkiDisplayLanguage) : ARKI_DEFAULT_DISPLAY_LANGUAGE;
}

export function displayLanguageInstruction(language: ArkiDisplayLanguage): string {
  return `All visible labels, titles, legends, annotations and text on the output sheet must be written in ${ARKI_LANGUAGE_NAMES[language]}. Never mix languages. If no language is explicitly supplied, use ${ARKI_LANGUAGE_NAMES[ARKI_DEFAULT_DISPLAY_LANGUAGE]}.`;
}
