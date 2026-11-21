import { describe, expect, it } from "vitest";
import { arkiRanking } from "./arkiRanking";
import type { DesignCandidate } from "../../../shared/arkiDesignFunnel";

function candidate(id: string, metrics: Partial<DesignCandidate["metrics"]>): DesignCandidate {
  return {
    id,
    projectId: "TEST",
    generationId: "GEN-001",
    stage: "SURVIVOR",
    status: "ELIGIBLE",
    title: id,
    strategy: "PARAMETRIC",
    variantId: `V-${id}`,
    shapeType: "COMPACT",
    floors: 4,
    preview: "PREVIEW",
    metrics: {
      footprintM2: 1000,
      builtAreaM2: 4000,
      capacity: 200,
      estimatedCostUsdConceptual: 500000,
      efficiencyRatio: 4,
      costPerM2: 125,
      capacityPerM2: 0.05,
      complianceScore: 0.9,
      energyUseIntensity: 100,
      waterUseIntensity: 50,
      carbonFootprint: 80,
      structuralEfficiency: 10,
      ...metrics,
    },
    epistemic: { facts: [], assumptions: [], preferences: [], requirements: [], objectives: [], constraints: [] },
    evidence: [],
    unknowns: [],
    failureReasons: [],
    provenance: [],
  };
}

describe("arkiRanking — ranking por mérito", () => {
  it("rankea candidatos por eficiencia", () => {
    const candidates = [
      candidate("A", { efficiencyRatio: 2 }),
      candidate("B", { efficiencyRatio: 5 }),
      candidate("C", { efficiencyRatio: 3 }),
    ];
    const result = arkiRanking(candidates, { efficiency: 1, cost: 0, capacity: 0, compliance: 0, energy: 0, water: 0, carbon: 0, structural: 0 });
    expect(result.ranked.map((c) => c.id)).toEqual(["B", "C", "A"]);
  });

  it("rankea candidatos por coste (menor es mejor)", () => {
    const candidates = [
      candidate("A", { costPerM2: 200 }),
      candidate("B", { costPerM2: 100 }),
      candidate("C", { costPerM2: 150 }),
    ];
    const result = arkiRanking(candidates, { efficiency: 0, cost: 1, capacity: 0, compliance: 0, energy: 0, water: 0, carbon: 0, structural: 0 });
    expect(result.ranked.map((c) => c.id)).toEqual(["B", "C", "A"]);
  });

  it("respeta topN", () => {
    const candidates = [
      candidate("A", { efficiencyRatio: 2 }),
      candidate("B", { efficiencyRatio: 5 }),
      candidate("C", { efficiencyRatio: 3 }),
    ];
    const result = arkiRanking(candidates, {}, 2);
    expect(result.ranked).toHaveLength(2);
  });

  it("devuelve scores", () => {
    const candidates = [candidate("A", {}), candidate("B", {})];
    const result = arkiRanking(candidates);
    expect(Object.keys(result.scores)).toHaveLength(2);
  });
});
