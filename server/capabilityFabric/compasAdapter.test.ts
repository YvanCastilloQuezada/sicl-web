import { describe, expect, it, vi } from "vitest";
import type { CapabilityProviderDescriptor } from "./types";
import { createCompasProvider } from "./compasAdapter";

const descriptor: CapabilityProviderDescriptor = {
  providerId: "compas",
  capabilities: ["MESH_BOOLEAN"],
  operations: ["ANALYZE", "VERIFY"],
  integrationMode: "WRAP",
  authority: "NON_CANONICAL_PROVIDER",
  priority: 100,
  enabled: true,
};

describe("CAPABILITY-FABRIC-001 COMPAS boundary", () => {
  it("wraps transport output in evidence without canonical mutation authority", async () => {
    const invoke = vi.fn().mockResolvedValue({
      output: { valid: true },
      evidenceStatus: "OBSERVED",
      diagnostics: ["provider-test-double"],
      runtime: { observed: false, name: "test-double", version: null },
    });
    const provider = createCompasProvider(descriptor, { invoke });

    const result = await provider.execute({
      requestId: "req-1",
      capability: "MESH_BOOLEAN",
      operation: "VERIFY",
      input: { a: "left", b: "right" },
    });

    expect(invoke).toHaveBeenCalledWith(
      "MESH_BOOLEAN",
      "VERIFY",
      { a: "left", b: "right" },
    );
    expect(result).toMatchObject({
      requestId: "req-1",
      providerId: "compas",
      canonicalMutation: false,
      evidence: { status: "OBSERVED" },
    });
  });

  it("fails closed for undeclared capabilities and operations", async () => {
    const provider = createCompasProvider(descriptor, {
      invoke: vi.fn(),
    });
    await expect(provider.execute({
      requestId: "req-2",
      capability: "BRep_BOOLEAN",
      operation: "VERIFY",
      input: {},
    })).rejects.toThrow("COMPAS_CAPABILITY_NOT_DECLARED");
    await expect(provider.execute({
      requestId: "req-3",
      capability: "MESH_BOOLEAN",
      operation: "PROPOSE",
      input: {},
    })).rejects.toThrow("COMPAS_OPERATION_NOT_DECLARED");
  });

  it("rejects any attempt to construct COMPAS with canonical authority", () => {
    expect(() => createCompasProvider(
      { ...descriptor, authority: "CANONICAL" as never },
      { invoke: vi.fn() },
    )).toThrow("COMPAS_PROVIDER_MUST_BE_NON_CANONICAL");
  });
});
