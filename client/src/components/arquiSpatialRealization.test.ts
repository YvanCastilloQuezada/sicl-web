import { describe, expect, it } from "vitest";
import { deriveSpatialRealizations, a13FinalReport, validateA13 } from "./arquiSpatialRealization";
import { deriveArchitecturalProblem } from "./arquiDesignProblem";
import { synthesizeArchitecturalStrategies } from "./arquiArchitecturalSynthesis";

describe("A13 spatial realization", () => {
  it("derives coherent spatial hypotheses without execution or geometry mutation", () => {
    const problem = deriveArchitecturalProblem({ project_id: "UPAO-001", name: "Educational example", spatial_scope: "edificacion", objectives: { open_site_area: "maximize open space" }, constraints: { privacy: "preserve privacy" }, preferences: { compactness: "compact footprint" }, program: [{ id: "p1", label: "learning spaces" }], site: { context: "urban edge" } } as any, [], []);
    const synthesis = synthesizeArchitecturalStrategies(problem);
    const items = deriveSpatialRealizations(synthesis, { alternatives: 0, photos: 0, pendingReview: 0, locationRegistered: false, hasAnalysis: false, hasSpatialRepresentation: false, hasKnowledge: true });
    expect(items.length).toBe(3);
    expect(items.every(validateA13)).toBe(true);
    expect(a13FinalReport(items)).toMatchObject({ status: "PASS_WITH_OBSERVATIONS", humanAuthority: true, noDecision: true, noGeometryMutation: true, noExecution: true });
  });
});
