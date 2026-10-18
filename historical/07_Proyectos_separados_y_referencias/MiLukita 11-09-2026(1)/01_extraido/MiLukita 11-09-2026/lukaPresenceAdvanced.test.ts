import { describe, expect, it } from "vitest";
import { getLukaContinuity, getLukaPresenceCopy, transitionLukaPresence } from "./lukaPresenceAdvanced";

describe("Fase D · LUKA Presence avanzada", () => {
  it("transiciona de presencia a escucha, pensamiento y respuesta", () => {
    expect(transitionLukaPresence("PRESENCE", "listen-start")).toBe("LISTENING");
    expect(transitionLukaPresence("LISTENING", "intent-detected")).toBe("THINKING");
    expect(transitionLukaPresence("THINKING", "speak-start")).toBe("SPEAKING");
  });

  it("mantiene silencio inteligente y recuperación manual", () => {
    expect(transitionLukaPresence("SPEAKING", "silence")).toBe("SILENT");
    expect(transitionLukaPresence("SILENT", "context-ready")).toBe("PRESENCE");
    expect(getLukaPresenceCopy("SILENT", "entry")).toContain("cuando me necesites");
  });

  it("mantiene la misma identidad entre entrada, AR y TV", () => {
    const entry = getLukaContinuity("entry", "PRESENCE");
    const ar = getLukaContinuity("ar", "SPEAKING");
    const tv = getLukaContinuity("tv", "SPEAKING");
    expect(entry.characterId).toBe(ar.characterId);
    expect(ar.characterId).toBe(tv.characterId);
    expect(entry.identityVersion).toBe(ar.identityVersion);
    expect(getLukaPresenceCopy("SPEAKING", "ar")).toContain("territorio");
    expect(getLukaPresenceCopy("SPEAKING", "tv")).toContain("pantalla");
  });
});
