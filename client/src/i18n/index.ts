import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import es from "./locales/es.json";
import en from "./locales/en.json";
import pt from "./locales/pt.json";
import it from "./locales/it.json";
import fr from "./locales/fr.json";
import de from "./locales/de.json";
import ru from "./locales/ru.json";
import zh from "./locales/zh.json";

export const I18N_STORAGE_KEY = "sims-dei-lang";

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { es: { translation: es }, en: { translation: en }, pt: { translation: pt }, it: { translation: it }, fr: { translation: fr }, de: { translation: de }, ru: { translation: ru }, zh: { translation: zh } },
    lng: "es",
    fallbackLng: "es",
    supportedLngs: ["es", "en", "pt", "it", "fr", "de", "ru", "zh"],
    detection: { order: ["localStorage"], caches: ["localStorage"], lookupLocalStorage: I18N_STORAGE_KEY },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

export default i18n;
