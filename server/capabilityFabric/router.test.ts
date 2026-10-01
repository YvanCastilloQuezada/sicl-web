import { describe, expect, it, vi } from "vitest";
import { createCompasProvider } from "./compasAdapter";
import { CapabilityRouter } from "./router";
import type { CapabilityProviderDescriptor } from "./types";

function descriptor(
  providerId: string,
  priority: number,
): CapabilityProviderDescriptor {
  return {
    providerId,
    capabilities: ["COMPAS_RUNTIME_IDENTITY"],
    operations: ["VERIFY"],
    integrationMode: "WRAP",
    authority: "NON_CANONICAL_PROVIDER",
    priority,
    enabled: true,
  };
}

describe("CapabilityRouter", () => {
  it("executes the highest-priority provider without director knowledge of provider identity", async () => {
    const lowInvoke = vi.fn().mockResolvedValue({
      output: { source: "low" },
      evidenceStatus: "SIMULATED",
      diagnostics: [],
      runtime: { observed: false, name: "test-double", version: null },
    });
    const highInvoke = vi.fn().mockResolvedValue({
      output: { source: "high" },
      evidenceStatus: "SIMULATED",
      diagnostics: [],
      runtime: { observed: false, name: "test-double", version: null },
    });
    const router = new CapabilityRouter([
      createCompasProvider(descriptor("low", 10), { invoke: lowInvoke }),
      createCompasProvider(descriptor("high", 20), { invoke: highInvoke }),
    ]);

    const execution = await router.execute({
      requestId: "route-1",
      capability: "COMPAS_RUNTIME_IDENTITY",
      operation: "VERIFY",
      input: {},
    });

    expect(execution.ok).toBe(true);
    if (!execution.ok) return;
    expect(execution.result.providerId).toBe("high");
    expect(highInvoke).toHaveBeenCalledOnce();
    expect(lowInvoke).not.toHaveBeenCalled();
    expect(execution.result.canonicalMutation).toBe(false);
  });

  it("fails closed when no provider can satisfy the capability", async () => {
    const router = new CapabilityRouter([]);
    await expect(router.execute({
      requestId: "route-2",
      capability: "UNKNOWN_CAPABILITY",
      operation: "VERIFY",
      input: {},
    })).resolves.toEqual({ ok: false, code: "NO_PROVIDER" });
  });

  it("rejects duplicate provider identities", () => {
    const provider = createCompasProvider(descriptor("same", 10), {
      invoke: vi.fn(),
    });
    expect(() => new CapabilityRouter([provider, provider]))
      .toThrow("DUPLICATE_PROVIDER_ID");
  });
});
