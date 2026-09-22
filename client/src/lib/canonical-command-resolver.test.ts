import { describe, expect, it } from "vitest";
import { normalizeLocalizedCommand, validateCommand } from "@/components/CommandBar";
import { resolveCommandInput, shortcutSuggestions } from "./canonical-command-resolver";

describe("canonical command resolver", () => {
  it("resolves a compact shortcut without changing canonical meaning", () => {
    const result = resolveCommandInput("GEN-DES", "es");
    expect(result.resolutionType).toBe("SHORT_ALIAS");
    expect(result.resolvedCanonical).toBe("/GENERATE DESIGN");
    expect(result.validationStatus).toBe("NEEDS_ARGUMENTS");
  });

  it("resolves a localized alias through the existing resolver", () => {
    const result = resolveCommandInput("/PROYECTO ABRIR UPAO-001", "es");
    expect(result.resolutionType).toBe("LOCALIZED_ALIAS");
    expect(result.resolvedCanonical).toBe("/PROJECT OPEN UPAO-001");
  });

  it("preserves legacy canonical commands", () => {
    const result = resolveCommandInput("/PROJECT OPEN UPAO-001", "es");
    expect(result.resolutionType).toBe("CANONICAL");
    expect(result.resolvedCanonical).toBe("/PROJECT OPEN UPAO-001");
  });

  it("resolves the compact command to the legacy canonical protocol", () => {
    const result = resolveCommandInput("PRO-OPE UPAO-001", "es");
    expect(result.resolutionType).toBe("SHORT_ALIAS");
    expect(result.resolvedCanonical).toBe("/PROJECT OPEN UPAO-001");
  });

  it("accepts compact commands without a slash and keeps legacy aliases valid", () => {
    expect(validateCommand("SNA-FRE SNAP-001")).toBeNull();
    expect(validateCommand("/SNAPSHOT FREEZE SNAP-001")).toBeNull();
    expect(normalizeLocalizedCommand("SNA-FRE SNAP-001")?.canonical).toBe("/SNAPSHOT FREEZE SNAP-001");
  });

  it("fails closed for unknown inputs", () => {
    const result = resolveCommandInput("inventar comando", "es");
    expect(result.resolutionType).toBe("UNKNOWN");
    expect(result.resolvedCanonical).toBeNull();
    expect(result.candidates).toEqual([]);
  });

  it("suggests only registered compact shortcuts", () => {
    expect(shortcutSuggestions("g").map((item) => item.shortcut)).toContain("GEN-DES");
    expect(shortcutSuggestions("g").map((item) => item.shortcut)).not.toContain("INV-ENT");
  });
});
