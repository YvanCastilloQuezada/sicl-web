export type LanguageCode = "es" | "en" | "pt" | "fr" | "de" | "it" | "zh" | "ja";
export type SupportedLanguage = { code: LanguageCode; label: string; nativeLabel: string };
export const supportedLanguages: readonly SupportedLanguage[] = [
  { code: "es", label: "Spanish", nativeLabel: "Español" }, { code: "en", label: "English", nativeLabel: "English" },
  { code: "pt", label: "Portuguese", nativeLabel: "Português" }, { code: "fr", label: "French", nativeLabel: "Français" },
  { code: "de", label: "German", nativeLabel: "Deutsch" }, { code: "it", label: "Italian", nativeLabel: "Italiano" },
  { code: "zh", label: "Chinese", nativeLabel: "中文" }, { code: "ja", label: "Japanese", nativeLabel: "日本語" },
];
export const defaultLanguage: LanguageCode = "es";
