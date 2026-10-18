import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "src/i18n/locales");
const locales = ["es", "en", "pt", "it", "fr", "de", "ru", "zh"];

type Json = Record<string, unknown>;
function flatten(value: Json, prefix = ""): Record<string, unknown> {
  return Object.entries(value).reduce<Record<string, unknown>>((result, [key, child]) => {
    const full = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === "object" && !Array.isArray(child)) {
      Object.assign(result, flatten(child as Json, full));
    } else {
      result[full] = child;
    }
    return result;
  }, {});
}

describe("i18n consistency gate", () => {
  it("keeps the same translation-key coverage in all supported locales", () => {
    const catalogs = Object.fromEntries(
      locales.map((locale) => [locale, flatten(JSON.parse(fs.readFileSync(path.join(root, `${locale}.json`), "utf8")))]),
    );
    const keys = Object.keys(catalogs.es).sort();
    for (const locale of locales) {
      expect(Object.keys(catalogs[locale]).sort(), `${locale} key coverage`).toEqual(keys);
    }
  });

  it("keeps critical Council/location copy out of hardcoded English", () => {
    const home = fs.readFileSync(path.resolve(import.meta.dirname, "src/pages/Home.tsx"), "utf8");
    for (const phrase of ["Council consumes the project foundation", "No canonical Council finding is available", "Location not yet defined"]) {
      expect(home).not.toContain(phrase);
    }
  });

  it("covers the centralized gate copy in every locale", () => {
    const required = [
      "gate.evaluation_title", "gate.alternative", "gate.objective", "gate.value", "gate.unit", "gate.confidence", "gate.source",
      "gate.sign_in_continue", "gate.auth_required", "gate.sign_in", "gate.toggle_navigation", "gate.navigation", "gate.sign_out",
      "gate.unexpected_error", "gate.reload_page", "gate.command_required", "gate.command_optional", "gate.command_tab",
    ];
    for (const locale of locales) {
      const catalog = flatten(JSON.parse(fs.readFileSync(path.join(root, `${locale}.json`), "utf8")));
      for (const key of required) expect(typeof catalog[key] === "string" && String(catalog[key]).trim(), `${locale}:${key}`).toBeTruthy();
    }
  });

  it("keeps the audited surfaces free of the migrated visible literals", () => {
    const files = ["components/EvaluationForm.tsx", "components/DashboardLayout.tsx", "components/ErrorBoundary.tsx", "components/CommandBar.tsx"];
    const forbidden = ["Crear Evaluation", "An unexpected error occurred.", "Reload Page", "Sign out", "Toggle navigation", "· required", "· optional"];
    for (const file of files) {
      const source = fs.readFileSync(path.resolve(import.meta.dirname, "src", file), "utf8");
      for (const phrase of forbidden) expect(source, `${file}:${phrase}`).not.toContain(phrase);
    }
  });

  it("changes the active catalog through the complete supported-language cycle", async () => {
    const i18n = (await import("./src/i18n")).default;
    for (const locale of ["es", "en", "pt", "it", "fr", "de", "ru", "zh", "es"]) {
      await i18n.changeLanguage(locale);
      expect(i18n.language).toBe(locale);
      expect(i18n.t("gate.evaluation_title")).not.toMatch(/^gate\./);
    }
  });
});
