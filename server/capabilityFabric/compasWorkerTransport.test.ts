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

  it.runIf(process.env.ARKI_REQUIRE_COMPAS === "1")(
    "observes the required COMPAS runtime in configured environments",
    async () => {
      const transport = createCompasWorkerTransport({ timeoutMs: 5000 });
      const result = await transport.invoke<
        Record<string, never>,
        { runtime: string; version: string | null }
      >("COMPAS_RUNTIME_IDENTITY", "VERIFY", {});
      expect(result.runtime.observed).toBe(true);
      expect(result.runtime.name).toBe("compas");
      expect(result.runtime.version).toBe("2.15.0");
      expect(result.evidenceStatus).toBe("OBSERVED");
    },
  );
  it("RED_TEST_01 never promotes an unobserved runtime to OBSERVED", async () => {
    const transport = createCompasWorkerTransport({
      pythonExecutable: process.env.ARKI_PYTHON_EXECUTABLE ?? "python3",
      workerPath: "tools/test_fixtures/arki_fake_compas_unobserved.py",
      timeoutMs: 5000,
    });
    const result = await transport.invoke<
      { points: number[][]; matrix: number[][] },
      { points: number[][] }
    >("TRANSFORM_POINTS_3D", "VERIFY", {
      points: [[1000, 2000, 0]],
      matrix: [
        [1, 0, 0, 600],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ],
    });

    expect(result.runtime).toEqual({
      observed: false,
      name: "fake-runtime",
      version: null,
    });
    expect(result.evidenceStatus).toBe("UNKNOWN");
  });

});
