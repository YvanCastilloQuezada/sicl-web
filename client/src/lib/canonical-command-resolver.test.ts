import { describe, expect, it } from "vitest";
import { normalizeLocalizedCommand, validateCommand } from "@/components/CommandBar";
import { resolveCommandInput } from "./canonical-command-resolver";

describe("canonical command resolver", () => {
  it("resolves a compact shortcut without changing canonical meaning", () => {
    const result = resolveCommandInput("GEN-DES", "es");
    expect(result.resolutionType).toBe("SHORT_ALIAS");
    expect(result.resolvedCanonical).toBe("/GENERATE DESIGN");
    expect(result.validationStatus).toBe("NEEDS_ARGUMENTS");
  });

  it("resolves a localized alias through the existing resolver", () => {
    const result = resolveCommandInput("/PROYECTO CREAR UPAO-001", "es");
    expect(result.resolutionType).toBe("LOCALIZED_ALIAS");
    expect(result.resolvedCanonical).toBe("/PROJECT CREATE UPAO-001");
  });

  it("preserves canonical commands from the real catalog", () => {
    const result = resolveCommandInput("/PREFEASIBILITY INIT 1000 SALUD", "es");
    expect(result.resolutionType).toBe("CANONICAL");
    expect(result.resolvedCanonical).toBe("/PREFEASIBILITY INIT 1000 SALUD");
  });

  it("resolves another canonical command from the real catalog", () => {
    const result = resolveCommandInput("/FUNNEL START eje-1 fixed-1", "es");
    expect(result.resolutionType).toBe("CANONICAL");
    expect(result.resolvedCanonical).toBe("/FUNNEL START eje-1 fixed-1");
  });

  it("validates canonical commands with required arguments", () => {
    expect(validateCommand("/PREFEASIBILITY INIT 1000 SALUD")).toBeNull();
    expect(validateCommand("/PREFEASIBILITY INIT")).toBe("MISSING_REQUIRED_ARGUMENT");
  });

  it("fails closed for unknown inputs", () => {
    const result = resolveCommandInput("inventar comando", "es");
    expect(result.resolutionType).toBe("UNKNOWN");
    expect(result.resolvedCanonical).toBeNull();
  });
});
