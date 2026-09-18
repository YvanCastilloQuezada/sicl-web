import { describe, expect, it } from "vitest";
import { buildK4FixtureStore, buildK4QueryFromK2, createK4Store, k4Traceback, queryK4, validateK4Query } from "./src/components/arkiKnowledgeStore";

describe("ARKI-K4 deterministic knowledge store and retrieval", () => {
  it("stores source, project and human-feedback origins without merging identity", () => {
    const store = buildK4FixtureStore();
    expect(store.records.map((record) => record.origin)).toEqual(expect.arrayContaining(["SOURCE_DERIVED", "PROJECT_EXPERIENCE", "HUMAN_FEEDBACK"]));
    expect(new Set(store.records.map((record) => record.knowledgeId)).size).toBe(store.records.length);
  });
  it("indexes one multi-domain record once", () => {
    const store = buildK4FixtureStore();
    const results = queryK4(store, { domainIds: ["HOUSING", "SPATIAL_COMPOSITION"], spatialScope: "edificacion", typology: "HOUSING", designStage: "CONCEPT", validationRequirement: "VALIDATED" });
    expect(results.filter((result) => result.knowledgeId === "K3-KU-A")).toHaveLength(1);
  });
  it("returns deterministic order and exact context classification", () => {
    const store = buildK4FixtureStore();
    const query = { domainIds: ["HOUSING"], spatialScope: "edificacion", typology: "HOUSING", designStage: "CONCEPT", validationRequirement: "VALIDATED" as const };
    const first = queryK4(store, query);
    const second = queryK4(store, query);
    expect(first.map((result) => result.knowledgeId)).toEqual(second.map((result) => result.knowledgeId));
    expect(first[0].match).toBe("EXACT_CONTEXT_MATCH");
  });
  it("excludes candidates and rejected or superseded records from default reusable retrieval", () => {
    const store = buildK4FixtureStore();
    const defaultResults = queryK4(store, { domainIds: ["HOUSING"], validationRequirement: "VALIDATED", includeUnknownContext: true });
    expect(defaultResults.some((result) => result.record.validation === "CANDIDATE" || result.record.validation === "REJECTED" || result.record.validation === "SUPERSEDED")).toBe(false);
  });
  it("preserves provenance traceback for source and project records", () => {
    const store = buildK4FixtureStore();
    const source = queryK4(store, { sourceId: "K3-FIXTURE-HOUSING-001", validationRequirement: "VALIDATED", includeUnknownContext: true })[0];
    const project = queryK4(store, { origin: "PROJECT_EXPERIENCE", projectId: "HOUSE-A21", validationRequirement: "VALIDATED", includeUnknownContext: true }).find((result) => result.record.projectTrace);
    expect(k4Traceback(source)?.sourceId).toBe("K3-FIXTURE-HOUSING-001");
    expect(project?.record.projectTrace?.projectId).toBe("HOUSE-A21");
  });
  it("keeps contradictions available without winner selection", () => {
    const store = buildK4FixtureStore();
    const results = queryK4(store, { domainIds: ["SPATIAL_COMPOSITION"], spatialScope: "edificacion", typology: "HOUSING", designStage: "CONCEPT", validationRequirement: "VALIDATED" });
    expect(results.map((result) => result.knowledgeId)).toEqual(expect.arrayContaining(["K3-KU-A"]));
    expect(results.every((result) => result.record.noAutomaticWinner)).toBe(true);
  });
  it("distinguishes wrong typology, stage, scope and unknown context", () => {
    const store = buildK4FixtureStore();
    expect(queryK4(store, { domainIds: ["HOUSING"], typology: "HOSPITAL", validationRequirement: "VALIDATED" })).toHaveLength(0);
    expect(queryK4(store, { domainIds: ["HOUSING"], designStage: "CONSTRUCTION", validationRequirement: "VALIDATED" })).toHaveLength(0);
    expect(queryK4(store, { domainIds: ["HOUSING"], spatialScope: "pais", validationRequirement: "VALIDATED" })).toHaveLength(0);
    expect(queryK4(store, { domainIds: ["HOUSING"], validationRequirement: "VALIDATED", includeUnknownContext: true }).some((result) => result.match === "UNKNOWN_CONTEXT" || result.match === "PARTIAL_CONTEXT")).toBe(true);
  });
  it("rejects unsupported K2 domains and scopes without inventing matches", () => {
    expect(validateK4Query({ domainIds: ["NOT_A_DOMAIN"] })).toBe(false);
    expect(validateK4Query({ spatialScope: "not_a_scope" })).toBe(false);
    expect(queryK4(createK4Store(), { domainIds: ["NOT_A_DOMAIN"], validationRequirement: "VALIDATED" })).toHaveLength(0);
  });
  it("consumes K2 classification and keeps the design boundary intact", () => {
    const store = buildK4FixtureStore();
    const query = buildK4QueryFromK2({ domains: ["HOUSING", "SPATIAL_COMPOSITION"], context: { spatialScope: "edificacion", typology: "HOUSING", designStage: "CONCEPT" } });
    const results = queryK4(store, query);
    expect(results.length).toBeGreaterThan(0);
    expect(store.retrievalReadOnly).toBe(true);
    expect(results.every((result) => result.record.noAutomaticDecision && result.record.noAutomaticWinner)).toBe(true);
  });
  it("does not activate infrastructure", () => {
    const store = buildK4FixtureStore();
    expect(store.retrieval).toBe("DETERMINISTIC_STRUCTURED");
    expect(store.federation).toBe("FROZEN_NOT_ACTIVATED");
    expect(store.noRankingAuthority).toBe(true);
  });
});
