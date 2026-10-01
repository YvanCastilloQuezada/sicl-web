import { describe, expect, it } from "vitest";
import { createCompasWorkerTransport } from "./compasWorkerTransport";

describe("COMPAS worker transport", () => {
  it("fails closed when the runtime cannot be started", async () => {
    const transport = createCompasWorkerTransport({
      pythonExecutable: "__arki_missing_python__",
      timeoutMs: 1000,
    });
    await expect(transport.invoke(
      "COMPAS_RUNTIME_IDENTITY",
      "VERIFY",
      {},
    )).rejects.toThrow(/COMPAS_RUNTIME_SPAWN_FAILED/);
  });

  it("does not claim COMPAS observed unless the real runtime is available", async () => {
    const transport = createCompasWorkerTransport({ timeoutMs: 5000 });
    try {
      const result = await transport.invoke<
        Record<string, never>,
        { runtime: string; version: string | null }
      >("COMPAS_RUNTIME_IDENTITY", "VERIFY", {});
      expect(result.runtime.observed).toBe(true);
      expect(result.runtime.name).toBe("compas");
      expect(result.evidenceStatus).toBe("OBSERVED");
    } catch (error) {
      expect(String(error)).toMatch(/COMPAS_RUNTIME_UNAVAILABLE|COMPAS_RUNTIME_SPAWN_FAILED/);
    }
  });
});
