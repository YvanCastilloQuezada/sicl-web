import { describe, expect, it } from "vitest";
import { getContextualFallback, getLukaAlternativeCommands, getLukaDisclosure, LUKA_ENTRY_PROMPT, LUKA_NO_RESPONSE_SECONDS, resolveLukaIntent, shouldRequestPermission } from "./lukaOsContract";

describe("LUKA OS contextual contract", () => {
  it("resolves natural-language intentions without exact commands", () => {
    expect(resolveLukaIntent("LUKA, quiero escribir").mode).toBe("keyboard");
    expect(resolveLukaIntent("pon Netflix por favor").id).toBe("open-netflix");
    expect(resolveLukaIntent("quiero volver al mundo").mode).toBe("ar");
    expect(resolveLukaIntent("El Mundo de MiLukita").id).toBe("enter-world");
  });
  it("does not request camera for TV intent", () => {
    expect(resolveLukaIntent("ver TV").requiredPermissions).toEqual([]);
    expect(shouldRequestPermission("camera", "tv-media")).toBe(false);
    expect(shouldRequestPermission("camera", "ar")).toBe(true);
  });
  it("suggests concise alternatives after an unclear command", () => {
    expect(getLukaAlternativeCommands("quiero jugar algo")[0]).toBe("Quiero jugar");
    expect(getLukaAlternativeCommands("").length).toBeGreaterThan(3);
  });
  it("keeps contextual disclosure and safe fallbacks bounded", () => {
    expect(getLukaDisclosure("trackpad").nextActions).toEqual(["ar"]);
    expect(getContextualFallback("gamepad")).toBe("keyboard");
    expect(LUKA_ENTRY_PROMPT).toContain("LUKA");
    expect(LUKA_NO_RESPONSE_SECONDS).toBe(10);
  });
});
