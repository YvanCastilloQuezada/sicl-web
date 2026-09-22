import { beforeEach, describe, expect, it } from "vitest";
import i18n, { I18N_STORAGE_KEY } from "@/i18n";
import { detectLanguage, normalizeLanguage } from "@/contexts/LanguageContext";

describe("i18n core", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("es");
  });

  it("initializes with Spanish fallback and all supported languages", () => {
    expect(i18n.isInitialized).toBe(true);
    expect(i18n.options.fallbackLng).toEqual(["es"]);
    expect(i18n.options.supportedLngs).toEqual(expect.arrayContaining(["es", "en", "pt", "it", "fr", "de", "ru", "zh"]));
  });

  it("changes visible translations when the language changes", async () => {
    await i18n.changeLanguage("en");
    expect(i18n.t("nav.project")).toBe("Project");
    await i18n.changeLanguage("zh");
    expect(i18n.t("nav.project")).toBe("项目");
  });

  it("exposes the agreed localStorage persistence key", () => {
    expect(I18N_STORAGE_KEY).toBe("sims-dei-lang");
    expect(i18n.options.detection).toMatchObject({
      lookupLocalStorage: I18N_STORAGE_KEY,
      caches: ["localStorage"],
    });
  });

  it("falls back to Spanish for an unsupported language", async () => {
    await i18n.changeLanguage("xx");
    expect(i18n.language).toBe("es");
    expect(i18n.t("header.title")).toBe("ARKI");
  });

  it("normalizes browser regional language codes", () => {
    expect(normalizeLanguage("pt-BR")).toBe("pt");
    expect(normalizeLanguage("zh-CN")).toBe("zh");
    expect(normalizeLanguage("xx-YY")).toBeUndefined();
  });

  it("uses Spanish when no explicit choice exists, regardless of browser language", () => {
    const storage = new Map<string, string>();
    Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value) },
    });
    Object.defineProperty(globalThis, "navigator", { configurable: true, value: { languages: ["xx-XX", "de-DE"], language: "xx-XX" } });
    expect(detectLanguage()).toBe("es");
  });

  it("prioritizes an explicit saved choice over the browser language", () => {
    const storage = new Map<string, string>([["sims-dei-lang-user-set", "true"], [I18N_STORAGE_KEY, "fr"]]);
    Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value) },
    });
    Object.defineProperty(globalThis, "navigator", { configurable: true, value: { languages: ["de-DE"], language: "de-DE" } });
    expect(detectLanguage()).toBe("fr");
  });
});
