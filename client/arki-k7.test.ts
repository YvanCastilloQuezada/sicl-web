import { describe, expect, it } from "vitest";
import { buildK4FixtureStore } from "./src/components/arkiKnowledgeStore";
import { executeK6Question } from "./src/components/arkiSpecialistPerspective";
import { classifyK7Relationship, makeK7ControlledFinding, synthesizeK7, validateK7Synthesis } from "./src/components/arkiMultiPerspectiveSynthesis";

describe("ARKI-K7 multi-perspective synthesis", () => {
  const housing = () => executeK6Question("Will this courtyard provide adequate natural ventilation?", "HOUSING_PERSPECTIVE", buildK4FixtureStore(), { projectId: "HOUSE-A21", typology: "HOUSING", spatialScope: "edificacion" });
  const bioclimatic = () => executeK6Question("Will this courtyard provide adequate natural ventilation?", "BIOCLIMATIC_PERSPECTIVE", buildK4FixtureStore(), { projectId: "HOUSE-A21", typology: "HOUSING", spatialScope: "edificacion" });
  it("consumes two valid K6 findings and preserves their identities", () => {
    const result = synthesizeK7("Will this courtyard provide adequate natural ventilation?", [housing(), bioclimatic()], { projectId: "HOUSE-A21" });
    expect(result.findingIds).toHaveLength(2);
    expect(result.perspectivesConsulted).toEqual(["BIOCLIMATIC_PERSPECTIVE", "HOUSING_PERSPECTIVE"]);
    expect(validateK7Synthesis(result)).toBe(true);
  });
  it("classifies Housing and Bioclimatic courtyard findings as complementary", () => {
    const result = synthesizeK7("courtyard", [housing(), bioclimatic()]);
    expect(result.relationshipRecords).toHaveLength(1);
    expect(result.relationshipRecords[0].type).toBe("COMPLEMENTARY");
  });
  it("preserves unknown performance and limitations", () => {
    const result = synthesizeK7("courtyard", [housing(), bioclimatic()]);
    expect(result.unknowns.some((value) => /unknown|not established|simulation/i.test(value))).toBe(true);
    expect(result.missingEvidence.some((value) => /simulation|performance/i.test(value))).toBe(true);
    expect(result.relationshipRecords[0].epistemicDifference).toBe(true);
  });
  it("proves agreement without manufacturing FACT or authority", () => {
    const left = makeK7ControlledFinding({ id: "agree-a", perspectiveId: "HOUSING_PERSPECTIVE", domainIds: ["HOUSING"], statement: "Domestic privacy and circulation should be considered.", epistemicStatus: "INTERPRETATION" });
    const right = makeK7ControlledFinding({ id: "agree-b", perspectiveId: "HOUSING_PERSPECTIVE", domainIds: ["HOUSING"], statement: "Domestic privacy and circulation should guide consideration.", epistemicStatus: "INTERPRETATION" });
    const result = synthesizeK7("privacy", [left, right]);
    expect(result.relationshipRecords[0].type).toBe("AGREEMENT");
    expect(result.supportedPoints.length).toBeGreaterThan(0);
    expect(result.noDecision && result.noWinner && result.noVote).toBe(true);
    expect(result.supportedPoints.join(" ")).not.toContain("FACT");
  });
  it("distinguishes tension from contradiction", () => {
    const open = makeK7ControlledFinding({ id: "open", perspectiveId: "HOUSING_PERSPECTIVE", domainIds: ["HOUSING"], statement: "Openness supports social integration.", epistemicStatus: "INTERPRETATION" });
    const privacy = makeK7ControlledFinding({ id: "privacy", perspectiveId: "HOUSING_PERSPECTIVE", domainIds: ["HOUSING"], statement: "Privacy and separation support domestic retreat.", epistemicStatus: "INTERPRETATION" });
    const contradictory = makeK7ControlledFinding({ id: "closed", perspectiveId: "HOUSING_PERSPECTIVE", domainIds: ["HOUSING"], statement: "The design must be closed and requires separation.", epistemicStatus: "INTERPRETATION" });
    expect(classifyK7Relationship(open, privacy).type).toBe("TENSION");
    expect(classifyK7Relationship(open, contradictory).type).toBe("CONTRADICTION");
    const result = synthesizeK7("openness", [open, contradictory]);
    expect(result.contradictions).toHaveLength(1);
    expect(result.noWinner).toBe(true);
  });
  it("creates a dependency when a strategy remains pending unknown performance", () => {
    const strategy = makeK7ControlledFinding({ id: "strategy", perspectiveId: "HOUSING_PERSPECTIVE", domainIds: ["HOUSING"], statement: "The courtyard strategy may improve domestic organization.", epistemicStatus: "STRATEGY_CANDIDATE" });
    const unknown = makeK7ControlledFinding({ id: "performance", perspectiveId: "BIOCLIMATIC_PERSPECTIVE", domainIds: ["CLIMATE_BIOCLIMATIC"], statement: "Ventilation performance is unknown pending simulation.", epistemicStatus: "UNKNOWN", limitations: ["Missing simulation"] , unknowns: ["Adequate airflow unknown"] });
    const relationship = classifyK7Relationship(strategy, unknown);
    expect(relationship.type).toBe("DEPENDENT");
    expect(synthesizeK7("courtyard", [strategy, unknown]).tradeoffs).toHaveLength(1);
  });
  it("identifies independent findings without fabricating a trade-off", () => {
    const a = makeK7ControlledFinding({ id: "a", perspectiveId: "HOUSING_PERSPECTIVE", domainIds: ["HOUSING"], statement: "Domestic privacy is considered.", epistemicStatus: "INTERPRETATION" });
    const b = makeK7ControlledFinding({ id: "b", perspectiveId: "BIOCLIMATIC_PERSPECTIVE", domainIds: ["CLIMATE_BIOCLIMATIC"], statement: "Solar orientation is considered.", epistemicStatus: "INTERPRETATION" });
    const result = synthesizeK7("separate issues", [a, b]);
    expect(result.relationshipRecords[0].type).toBe("INDEPENDENT");
    expect(result.tradeoffs).toHaveLength(0);
  });
  it("returns insufficient relation when contexts are not comparable", () => {
    const a = makeK7ControlledFinding({ id: "ctx-a", perspectiveId: "HOUSING_PERSPECTIVE", domainIds: ["HOUSING"], statement: "Privacy is considered.", epistemicStatus: "INTERPRETATION", context: { projectId: "HOUSE-A21" } });
    const b = makeK7ControlledFinding({ id: "ctx-b", perspectiveId: "BIOCLIMATIC_PERSPECTIVE", domainIds: ["CLIMATE_BIOCLIMATIC"], statement: "Ventilation is considered.", epistemicStatus: "INTERPRETATION", context: { projectId: "OTHER-PROJECT" } });
    expect(classifyK7Relationship(a, b).type).toBe("INSUFFICIENT_TO_RELATE");
  });
  it("preserves additional perspective needs and produces provisional implication only", () => {
    const out = executeK6Question("Will the structural system resist the design earthquake?", "HOUSING_PERSPECTIVE", buildK4FixtureStore(), { projectId: "HOUSE-A21" });
    const env = bioclimatic();
    const result = synthesizeK7("house", [out, env]);
    expect(result.additionalPerspectivesNeeded).toContain("STRUCTURAL");
    expect(result.provisionalArchitecturalImplications.length).toBeGreaterThan(0);
    expect(result.authorityBoundary).toBe("HUMAN_ARCHITECT_FINAL");
  });
  it("is deterministic, stably ordered and does not execute follow-up work", () => {
    const first = synthesizeK7("courtyard", [housing(), bioclimatic()]);
    const second = synthesizeK7("courtyard", [bioclimatic(), housing()]);
    expect(first).toEqual(second);
    expect(first.noDesignOperation).toBe(true);
    expect(first.noKnowledgePromotion).toBe(true);
  });
});
