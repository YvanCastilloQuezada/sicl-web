import { beforeEach, describe, expect, it } from "vitest";
import i18n, { I18N_STORAGE_KEY } from "@/i18n";

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
    expect(i18n.t("header.title")).toBe("SiMS-DeI Command Center");
  });
});
