import { describe, expect, it } from "vitest";
import { buildA14Plan, deriveA14Coverage, readbackA14, type A14Capabilities } from "./arquiControlledRealization";
import { synthesizeArchitecturalStrategies } from "./arquiArchitecturalSynthesis";
import { deriveSpatialDesignOrganization } from "./arquiSpatialRealization";

type Fixture = { strategy: ReturnType<typeof synthesizeArchitecturalStrategies>["strategies"][number]; organization: ReturnType<typeof deriveSpatialDesignOrganization>; alternative: Record<string, unknown> };

function fixture(family: "COURTYARD" | "LINEAR_BAR" | "COMPACT_VERTICAL"): Fixture {
  const strategy = synthesizeArchitecturalStrategies({
    readiness: "READY_FOR_SYNTHESIS",
    sourceProjectId: "UPAO-001",
    spatialScope: "edificacion",
    known: [], unknown: [], tensions: [], designQuestions: [], intent: undefined,
    site: [{ id: "site-1", text: "site access", basis: "SITE" }],
    users: [], program: [{ id: "program-1", text: "housing program", basis: "PROGRAM" }],
    objectives: [{ id: "objective-1", text: "open space", basis: "OBJECTIVE" }], constraints: [], preferences: [], sourceEvidenceIds: [],
  }).strategies.find((item) => item.family === family)!;
  const organization = deriveSpatialDesignOrganization(strategy, { alternatives: 1, photos: 0, pendingReview: 0, locationRegistered: false, hasAnalysis: false, hasSpatialRepresentation: true, hasKnowledge: true });
  return { strategy, organization, alternative: { alternative_id: "UPAO-001-A", project_id: "UPAO-001", parameters: { strategy: "compact", floors: 5 } } };
}

const capabilities: A14Capabilities = {
  CREATE_COURTYARD: { status: "AVAILABLE" }, SET_GAP: { status: "AVAILABLE" }, SCALE_MASS: { status: "AVAILABLE" }, CHANGE_HEIGHT: { status: "AVAILABLE" },
};

describe("A14 controlled realization", () => {
  it("maps courtyard intent to the existing courtyard operation", () => {
    const item = fixture("COURTYARD");
    const plan = buildA14Plan(item.strategy, item.organization, item.alternative, capabilities);
    expect(plan.status).toBe("SUPPORTED");
    expect(plan.steps[0].operationType).toBe("CREATE_COURTYARD");
    expect(plan.humanAuthorityRequired).toBe(true);
  });

  it("preserves unsupported linear operations instead of silently substituting", () => {
    const item = fixture("LINEAR_BAR");
    const plan = buildA14Plan(item.strategy, item.organization, item.alternative, capabilities);
    expect(plan.status).toBe("UNSUPPORTED");
    expect(plan.executionStatus).toBe("UNSUPPORTED");
    expect(plan.steps).toHaveLength(0);
  });

  it("reports coverage and rejects false success during readback", () => {
    const item = fixture("COURTYARD");
    const coverage = deriveA14Coverage(item.organization, capabilities);
    expect(coverage[0].executable).toBe(true);
    const plan = buildA14Plan(item.strategy, item.organization, item.alternative, capabilities);
    const readback = readbackA14({ status: "EXECUTED", proposed_child: { alternative_id: "UPAO-001-A-GDI-1", parameters: { strategy: "compact" } }, before_representation: { elements: [] }, after_representation: { elements: [] } }, plan, "UPAO-001-A");
    expect(readback.actualGeometryChanged).toBe(false);
    expect(readback.falseSuccess).toBe(true);
    expect(readback.intentPreservation).toBe("NOT_PRESERVED");
  });
});
