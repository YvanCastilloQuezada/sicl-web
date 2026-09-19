import { describe, expect, it } from "vitest";
import {
  ARKI_CANONICAL_INVARIANTS,
  ARKI_CANONICAL_KNOWLEDGE_UNITS,
  ARKI_CANONICAL_SOURCE_REGISTRY,
  ARKI_PARTI_ROLE_MAP,
  buildL08ControlledFixture,
  buildMultidimensionalRelationship,
  canonicalKnowledgeSummary,
  classifyPartiToken,
  runCanonicalKnowledgeNegativeControls,
  ARKI_L00_L08_PRACTICES,
  validateCanonicalPracticeRegistry,
  validateCanonicalKnowledgeOperationalization,
  validateL08Fixture,
} from "./src/components/arkiCanonicalKnowledgeOperationalization";

describe("ARKI School L00-L08 canonical operationalization", () => {
  it("loads all approved units as provenance-aware curricular knowledge without maturity promotion", () => {
    expect(validateCanonicalKnowledgeOperationalization()).toBe(true);
    expect(ARKI_CANONICAL_KNOWLEDGE_UNITS).toHaveLength(35);
    expect(new Set(ARKI_CANONICAL_KNOWLEDGE_UNITS.map((unit) => unit.level))).toEqual(new Set(["L00", "L01", "L02", "L03", "L04", "L05", "L06", "L07", "L08"]));
    expect(ARKI_CANONICAL_KNOWLEDGE_UNITS.every((unit) => unit.maturity === "IMPORTED_CURRICULAR_KNOWLEDGE" && unit.sourceRefs.length > 0 && unit.humanReviewRequired)).toBe(true);
    expect(ARKI_CANONICAL_INVARIANTS).toHaveLength(39);
    expect(ARKI_CANONICAL_SOURCE_REGISTRY).toHaveLength(9);
  });

  it("extends relationships multidimensionally without turning adjacency into access", () => {
    const relation = buildMultidimensionalRelationship({ id: "R-1", from: "A", to: "B", dimensions: ["PHYSICAL", "FUNCTIONAL", "PRIVACY"], relationType: "REQUIRED_ADJACENCY", strength: "MUST", evidenceRefs: ["fixture"], epistemicState: "HYPOTHESIS", applicability: "UNKNOWN" });
    expect(relation.dimensions).toEqual(["PHYSICAL", "FUNCTIONAL", "PRIVACY"]);
    expect(relation.noAutomaticAccess).toBe(true);
    expect(relation.noAutomaticDecision).toBe(true);
    expect(relation.relationType).not.toBe("DIRECT_ACCESS");
  });

  it("assigns explicit semantic roles to existing parti vocabulary", () => {
    expect(classifyPartiToken("BAR")).toMatchObject({ roles: ["FORM_MASSING"], ambiguous: false, requiresContext: true });
    expect(classifyPartiToken("COURTYARD")).toMatchObject({ roles: ["VOID_OPEN_SPACE"] });
    expect(classifyPartiToken("SPINE").roles).toContain("ORGANIZATION");
    expect(classifyPartiToken("SPINE").roles).toContain("CIRCULATION_SPACE");
    expect(classifyPartiToken("CORE").roles).toContain("SUPPORT_SERVICE");
    expect(Object.keys(ARKI_PARTI_ROLE_MAP)).toEqual(["BAR", "COURTYARD", "SPINE", "CORE", "DOUBLE_HEIGHT", "GALLERY", "SPLIT_MASS"]);
  });

  it("creates three materially different topology hypotheses before coordinates", () => {
    const fixture = buildL08ControlledFixture();
    expect(validateL08Fixture(fixture)).toBe(true);
    expect(fixture.hypotheses.map((item) => item.id)).toEqual(["L08-TOPOLOGY-A", "L08-TOPOLOGY-B", "L08-TOPOLOGY-C"]);
    expect(new Set(fixture.hypotheses.map((item) => item.lineage.independentSeed)).size).toBe(3);
    expect(fixture.hypotheses.every((item) => item.coordinatesAssigned === false && item.geometryCreated === false)).toBe(true);
    expect(fixture.selectedHypothesis).toBeNull();
    expect(fixture.hypotheses.map((item) => item.edges.map((edge) => edge.relation).join(","))).toEqual(["SEQUENCE,SEPARATE,SEPARATE", "SEQUENCE,VISUAL,MEDIATE", "SEQUENCE,SEPARATE,VERTICAL"]);
  });

  it("preserves the negative controls required by the handoff", () => {
    expect(runCanonicalKnowledgeNegativeControls()).toEqual({ unknownNotOptional: true, preferenceNotRequirement: true, adjacencyNotAccess: true, visualNotPhysical: true, topologyNotGeometry: true, noAutomaticWinner: true, importedNotMature: true });
  });

  it("registers application, non-application, transfer and human-gate exercises", () => {
    expect(validateCanonicalPracticeRegistry()).toBe(true);
    expect(ARKI_L00_L08_PRACTICES).toHaveLength(12);
    expect(ARKI_L00_L08_PRACTICES.map((item) => item.id)).toEqual(["P-L00-01", "P-L01-01", "P-L02-01", "P-L03-01", "P-L04-01", "P-L05-01", "P-L06-01", "P-L07-01", "P-L08-01", "P-L08-02", "P-L08-03", "P-L08-04"]);
    expect(ARKI_L00_L08_PRACTICES.filter((item) => item.type === "TRANSFER")).toHaveLength(1);
    expect(ARKI_L00_L08_PRACTICES.filter((item) => item.type === "HUMAN_GATE")).toHaveLength(1);
  });

  it("reports a bounded machine-readable summary without learning claims", () => {
    expect(canonicalKnowledgeSummary()).toMatchObject({ knowledgeUnits: 35, invariants: 39, sources: 9, relationshipDimensions: 12, topologyHypotheses: ["L08-TOPOLOGY-A", "L08-TOPOLOGY-B", "L08-TOPOLOGY-C"], selectedHypothesis: null, maturity: "IMPORTED_CURRICULAR_KNOWLEDGE", humanReviewRequired: true });
  });
});
