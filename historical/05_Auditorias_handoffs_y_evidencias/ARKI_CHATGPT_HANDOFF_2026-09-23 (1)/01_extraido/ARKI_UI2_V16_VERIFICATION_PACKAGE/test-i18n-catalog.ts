import { catalog, t } from "../client/src/i18n/catalog";
import { defaultLanguage, supportedLanguages } from "../client/src/i18n/languages";
import { LANGUAGE_STORAGE_KEY, persistLanguage, readPersistedLanguage } from "../client/src/i18n/useTranslation";

const expected = ["es", "en", "pt", "fr", "de", "it", "zh", "ja"];
if (supportedLanguages.length !== 8) throw new Error(`Expected exactly 8 languages, got ${supportedLanguages.length}`);
if (supportedLanguages.map(({ code }) => code).join(",") !== expected.join(",")) throw new Error("Language codes/order mismatch");
if (new Set(supportedLanguages.map(({ code }) => code)).size !== 8) throw new Error("Language codes are not unique");
if (defaultLanguage !== "es") throw new Error("Default language must be es");
for (const language of supportedLanguages) if (!language.code || !language.label || !language.nativeLabel) throw new Error(`Incomplete language: ${language.code}`);
if (t("generator", "en") !== "Dynamic family generator") throw new Error("Existing translation failed");
if (t("generator", "ja") === "") throw new Error("Non-empty fallback/translation expected");
for (const key of ["dataModule", "budget5d", "expensesModule", "technicalDossier", "operationsManagement", "administrationModule", "unavailableModuleTooltip"] as const) if (!t(key, "es")) throw new Error(`Missing v1.6 catalog key: ${key}`);
const fakeStorage = new Map<string, string>();
const storage = { getItem: (key: string) => fakeStorage.get(key) ?? null, setItem: (key: string, value: string) => { fakeStorage.set(key, value); } };
persistLanguage(storage, "ja");
if (fakeStorage.get(LANGUAGE_STORAGE_KEY) !== "ja" || readPersistedLanguage(storage) !== "ja") throw new Error("Language persistence failed");
console.log(JSON.stringify({ status: "PASS", defaultLanguage, languages: supportedLanguages, catalogLanguages: Object.keys(catalog), checks: ["8 exact languages", "unique codes", "non-empty metadata", "default es", "translation", "fallback", "persistence", "v1.6 module labels and tooltip"] }, null, 2));
