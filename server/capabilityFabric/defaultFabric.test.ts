import { describe, expect, it } from "vitest";
import { COMPAS_CORE_PROVIDER, createDefaultCapabilityRouter } from "./defaultFabric";

describe("default Capability Fabric", () => {
  it("registers COMPAS core as non-canonical horizontal infrastructure", () => {
    expect(COMPAS_CORE_PROVIDER).toMatchObject({
      providerId: "compas-core-2.15.0",
      authority: "NON_CANONICAL_PROVIDER",
      integrationMode: "WRAP",
      enabled: true,
    });
  });

  it.runIf(process.env.ARKI_REQUIRE_COMPAS === "1")(
    "routes a real capability request through the observed COMPAS provider",
    async () => {
      const router = createDefaultCapabilityRouter();
      const execution = await router.execute<
        Record<string, never>,
        { runtime: string; version: string | null }
      >({
        requestId: "compas-observed-router-canary",
        capability: "COMPAS_RUNTIME_IDENTITY",
        operation: "VERIFY",
        input: {},
      });

      expect(execution.ok).toBe(true);
      if (!execution.ok) return;
      expect(execution.result.providerId).toBe("compas-core-2.15.0");
      expect(execution.result.output).toEqual({
        runtime: "compas",
        version: "2.15.0",
      });
      expect(execution.result.evidence.runtime).toEqual({
        observed: true,
        name: "compas",
        version: "2.15.0",
      });
      expect(execution.result.canonicalMutation).toBe(false);
    },
  );
});
