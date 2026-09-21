import { describe, expect, it } from "vitest";
import { resolveCommandInput, shortcutSuggestions } from "./canonical-command-resolver";

describe("canonical command resolver", () => {
  it("resolves a human shortcut without changing canonical meaning", () => {
    const result = resolveCommandInput("/gen", "es");
    expect(result.resolutionType).toBe("SHORT_ALIAS");
    expect(result.resolvedCanonical).toBe("/GENERATE DESIGN");
    expect(result.validationStatus).toBe("NEEDS_ARGUMENTS");
  });

  it("resolves a localized alias through the existing resolver", () => {
    const result = resolveCommandInput("/PROYECTO ABRIR UPAO-001", "es");
    expect(result.resolutionType).toBe("LOCALIZED_ALIAS");
    expect(result.resolvedCanonical).toBe("/PROJECT OPEN UPAO-001");
  });

  it("preserves canonical commands", () => {
    const result = resolveCommandInput("/PROJECT OPEN UPAO-001", "es");
    expect(result.resolutionType).toBe("CANONICAL");
    expect(result.resolvedCanonical).toBe("/PROJECT OPEN UPAO-001");
  });

  it("fails closed for unknown inputs", () => {
    const result = resolveCommandInput("/inventar comando", "es");
    expect(result.resolutionType).toBe("UNKNOWN");
    expect(result.resolvedCanonical).toBeNull();
    expect(result.candidates).toEqual([]);
  });

  it("suggests only registered shortcuts", () => {
    expect(shortcutSuggestions("/g").map((item) => item.shortcut)).toContain("/gen");
    expect(shortcutSuggestions("/g").map((item) => item.shortcut)).not.toContain("/invent");
  });
});
