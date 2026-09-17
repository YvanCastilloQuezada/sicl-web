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
});
