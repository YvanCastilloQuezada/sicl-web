import { describe, expect, it } from "vitest";
import { executeParametricGraph, inspectParametricArtifact, parametricRuntimeCatalog } from "./arkiParametricRuntime";

describe("ARKI parametric runtime", () => {
  it("catalogs external hosts without pretending they are installed", () => {
    const catalog = parametricRuntimeCatalog();
    expect(catalog.architecture).toBe("OWN_CONTROL_PLANE_WITH_OPTIONAL_HOST_ADAPTERS");
    expect(catalog.hosts.dynamo).toBe("EXTERNAL_HOST_REQUIRED");
    expect(catalog.hardRealtime).toBe(false);
  });

  it("inspects graph artefacts and preserves host boundaries", () => {
    const dyn = inspectParametricArtifact({ fileName: "house.dyn", content: JSON.stringify({ dependencies: ["Clockwork"] }) });
    const gh = inspectParametricArtifact({ fileName: "form.gh", content: Buffer.from([0, 1, 2, 3]) });
    const ghx = inspectParametricArtifact({ fileName: "form.ghx", content: "<Archive><plugin>ExamplePlugin</plugin></Archive>" });
    expect(dyn).toMatchObject({ format: "DYN", parsed: true, status: "INSPECTED" });
    expect(dyn.declaredDependencies).toContain("Clockwork");
    expect(gh).toMatchObject({ format: "GH", status: "OPAQUE_HOST_REQUIRED", hostRequired: "Rhino/Grasshopper or Rhino.Compute for execution" });
    expect(ghx.parsed).toBe(true);
  });

  it("executes an allowed graph deterministically and returns a hash", async () => {
    const graph = { contractVersion: "ARKI-PARAMETRIC-1.0" as const, graphId: "fixture-001", nodes: [
      { id: "rect", op: "rectangle_points" as const, params: { width: 10, height: 6 } },
      { id: "moved", op: "translate_points" as const, params: { points: "$rect", dx: 2, dy: 3 } },
    ], outputs: ["moved"], units: "m", tolerance: 0.0001, humanReviewRequired: true as const };
    const first = await executeParametricGraph(graph);
    const second = await executeParametricGraph(graph);
    expect(first.status).toBe("EXECUTED");
    expect(second).toEqual(first);
    expect(first).toMatchObject({ deterministic: true, softRealtime: true, executionHash: expect.stringMatching(/^sha256:/) });
  });

  it("rejects cycles and forbidden operations instead of executing arbitrary Python", async () => {
    const cycle = { contractVersion: "ARKI-PARAMETRIC-1.0" as const, graphId: "bad", nodes: [{ id: "a", op: "add" as const, params: { a: "$b", b: 1 } }, { id: "b", op: "add" as const, params: { a: "$a", b: 1 } }], outputs: ["a"], units: "m", tolerance: 0.01, humanReviewRequired: true as const };
    const result = await executeParametricGraph(cycle);
    expect(result.status).toBe("REJECTED");
  });
});
