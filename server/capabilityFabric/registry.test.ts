import { describe, expect, it } from "vitest";
import type { CapabilityProviderDescriptor, CapabilityResult } from "./types";
import { selectCapabilityProvider, validateProviderDescriptor } from "./registry";

const provider = (
  providerId: string,
  priority: number,
  overrides: Partial<CapabilityProviderDescriptor> = {},
): CapabilityProviderDescriptor => ({
  providerId,
  capabilities: ["GEOMETRY_TRANSFORM"],
  operations: ["ANALYZE", "PROPOSE", "VERIFY"],
  integrationMode: "WRAP",
  authority: "NON_CANONICAL_PROVIDER",
  priority,
  enabled: true,
  ...overrides,
});

describe("CAPABILITY-FABRIC-001 contract", () => {
  it("selects deterministically by priority then providerId", () => {
    const providers = [provider("zeta", 10), provider("beta", 20), provider("alpha", 20)];
    expect(selectCapabilityProvider(providers, "GEOMETRY_TRANSFORM", "ANALYZE")).toEqual({
      ok: true,
      provider: providers[2],
    });
    expect(selectCapabilityProvider([...providers].reverse(), "GEOMETRY_TRANSFORM", "ANALYZE")).toEqual({
      ok: true,
      provider: providers[2],
    });
  });

  it("fails closed when no provider or operation is available", () => {
    expect(selectCapabilityProvider([], "GEOMETRY_TRANSFORM", "ANALYZE")).toEqual({
      ok: false,
      code: "NO_PROVIDER",
    });
    expect(selectCapabilityProvider([provider("p", 1)], "GEOMETRY_TRANSFORM", "SIMULATE")).toEqual({
      ok: false,
      code: "OPERATION_UNSUPPORTED",
    });
  });

  it("ignores disabled providers instead of silently selecting them", () => {
    expect(selectCapabilityProvider(
      [provider("disabled", 100, { enabled: false }), provider("active", 1)],
      "GEOMETRY_TRANSFORM",
      "VERIFY",
    )).toEqual({ ok: true, provider: provider("active", 1) });
  });

  it("rejects malformed or ambiguous provider descriptors", () => {
    expect(validateProviderDescriptor(provider(" ", 1))).toBe("PROVIDER_DESCRIPTOR_INVALID");
    expect(validateProviderDescriptor(provider("dup", 1, {
      capabilities: ["A", "A"],
    }))).toBe("PROVIDER_DESCRIPTOR_INVALID");
    expect(validateProviderDescriptor(provider("bad-priority", 1.5))).toBe("PROVIDER_DESCRIPTOR_INVALID");
  });

  it("makes provider output structurally non-canonical", () => {
    const result: CapabilityResult<{ value: number }> = {
      requestId: "r-1",
      providerId: "compas",
      capability: "GEOMETRY_TRANSFORM",
      operation: "PROPOSE",
      output: { value: 42 },
      evidence: {
        providerId: "compas",
        capability: "GEOMETRY_TRANSFORM",
        operation: "PROPOSE",
        status: "SIMULATED",
        diagnostics: [],
      },
      canonicalMutation: false,
    };
    expect(result.canonicalMutation).toBe(false);
  });
});
