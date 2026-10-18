import { describe, expect, it } from "vitest";
import { CANONICAL_GLOSSARY } from "./canonicalGlossary";

describe("canonical glossary", () => {
  it("contains the public ecosystem vocabulary in the intended hierarchy", () => {
    expect(CANONICAL_GLOSSARY.map((entry) => entry.term)).toEqual([
      "MiLukita",
      "El Mundo de MiLukita",
      "LUKA",
      "LUKA OS",
      "LUKA AR",
      "LUKA TV",
      "Controller Lab",
      "L★ / Lukita Star Trail",
    ]);
  });

  it("explains that experience layers do not control the protected core", () => {
    const lukaOs = CANONICAL_GLOSSARY.find((entry) => entry.term === "LUKA OS");
    const controllerLab = CANONICAL_GLOSSARY.find((entry) => entry.term === "Controller Lab");

    expect(lukaOs?.use).toContain("no gobierna el núcleo protegido");
    expect(controllerLab?.use).toContain("no es una puerta de acceso al núcleo");
  });

  it("keeps every entry complete for the UI", () => {
    expect(CANONICAL_GLOSSARY).toHaveLength(8);
    for (const entry of CANONICAL_GLOSSARY) {
      expect(entry.term.length).toBeGreaterThan(0);
      expect(entry.meaning.length).toBeGreaterThan(20);
      expect(entry.use.length).toBeGreaterThan(10);
    }
  });
});
