import { describe, expect, it } from "vitest";
import { arkiPruning } from "./arkiPruning";
import type { DesignCandidate } from "../../../shared/arkiDesignFunnel";

function candidate(partial: Partial<DesignCandidate> & { id: string }): DesignCandidate {
  return {
    projectId: "TEST",
    generationId: "GEN-001",
    stage: "SURVIVOR",
    status: "ELIGIBLE",
    title: partial.id,
    strategy: "PARAMETRIC",
    preview: "PREVIEW_LOCAL_CONCEPTUAL",
    metrics: {},
    epistemic: {
      facts: [], assumptions: [], preferences: [], requirements: [], objectives: [], constraints: [],
    },
    evidence: [],
    unknowns: [],
    failureReasons: [],
    provenance: [],
    ...partial,
  };
}

describe("arkiPruning — diversidad real", () => {
  it("si survivors <= funnelCount, no poda", () => {
    const survivors = [candidate({ id: "A" }), candidate({ id: "B" })];
    const result = arkiPruning(survivors, 4);
    expect(result.pruned).toHaveLength(2);
    expect(result.prunedOut).toHaveLength(0);
  });

  it("agrupa por variantId cuando existe", () => {
    const survivors = [
      candidate({ id: "A1", variantId: "V1" }),
      candidate({ id: "A2", variantId: "V1" }),
      candidate({ id: "A3", variantId: "V1" }),
      candidate({ id: "B1", variantId: "V2" }),
      candidate({ id: "B2", variantId: "V2" }),
    ];
    const result = arkiPruning(survivors, 2);
    expect(result.pruned).toHaveLength(2);
    // Debe tomar uno de V1 y uno de V2
    expect(result.pruned.map((c) => c.variantId)).toEqual(["V1", "V2"]);
  });

  it("agrupa por shapeType si no hay variantId", () => {
    const survivors = [
      candidate({ id: "A1", shapeType: "COURTYARD" }),
      candidate({ id: "A2", shapeType: "COURTYARD" }),
      candidate({ id: "B1", shapeType: "L_SHAPE" }),
    ];
    const result = arkiPruning(survivors, 2);
    expect(result.pruned.map((c) => c.shapeType)).toEqual(["COURTYARD", "L_SHAPE"]);
  });

  it("agrupa por floors si no hay variantId ni shapeType", () => {
    const survivors = [
      candidate({ id: "A1", floors: 2 }),
      candidate({ id: "A2", floors: 3 }),
      candidate({ id: "B1", floors: 10 }),
    ];
    const result = arkiPruning(survivors, 2);
    expect(result.pruned).toHaveLength(2);
    // A1/A2 son "low", B1 es "high"
    expect(new Set(result.pruned.map((c) => c.floors! <= 3 ? "low" : "high"))).toEqual(new Set(["low", "high"]));
  });

  it("fallback a strategy si no hay variantId ni shapeType ni floors", () => {
    const survivors = [
      candidate({ id: "A1", strategy: "PARAMETRIC" }),
      candidate({ id: "A2", strategy: "PARAMETRIC" }),
      candidate({ id: "B1", strategy: "TIPOLOGIC" }),
    ];
    const result = arkiPruning(survivors, 2);
    expect(result.pruned.map((c) => c.strategy)).toEqual(["PARAMETRIC", "TIPOLOGIC"]);
  });

  it("criteria incluye byStrategy y byDiversityKey", () => {
    const survivors = [
      candidate({ id: "A1", variantId: "V1" }),
      candidate({ id: "A2", variantId: "V1" }),
      candidate({ id: "B1", variantId: "V2" }),
    ];
    const result = arkiPruning(survivors, 2);
    expect(result.criteria.totalBefore).toBe(3);
    expect(result.criteria.totalAfter).toBe(2);
    expect(result.criteria.byStrategy).toBeDefined();
    expect(result.criteria.byDiversityKey).toBeDefined();
    expect(result.criteria.byDiversityKey).toEqual({ "variant:V1": 1, "variant:V2": 1 });
  });
});
