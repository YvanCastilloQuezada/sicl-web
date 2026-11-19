import { describe, expect, it } from "vitest";
import {
  ARKI_BIM_LIFECYCLE_SCHEMA,
  ARKI_IFC_SCHEMA,
  assertBimRefinement,
  validateBimCandidateLifecycle,
  validateBimRefinement,
  type BimCandidateLifecycle,
} from "./arkiBimLifecycle";

const hash = "a".repeat(64);
const guid = "0123456789ABCDEFGHIJKL";

function element(overrides: Record<string, unknown> = {}) {
  return {
    agkObjectId: "AGK-OBJECT-001",
    archiElementId: hash,
    ifcGlobalId: guid,
    ifcEntity: "IfcBuildingElementProxy",
    role: "MASSING" as const,
    geometryHash: "b".repeat(64),
    geometryVersion: 1,
    ...overrides,
  };
}

function materialized(
  overrides: Partial<BimCandidateLifecycle> = {},
): BimCandidateLifecycle {
  return {
    schemaVersion: ARKI_BIM_LIFECYCLE_SCHEMA,
    ifcSchema: ARKI_IFC_SCHEMA,
    projectId: "PROJECT-001",
    candidateId: "CANDIDATE-001",
    generationId: "GENERATION-001",
    developmentLevel: "L0",
    materializationState: "MATERIALIZED",
    parentCandidateIds: [],
    elements: [element()],
    pendingAgkObjectIds: [],
    modelRef: "CORE-IFC-ARTIFACT-001",
    modelHash: "c".repeat(64),
    ...overrides,
  };
}

describe("ARKI BIM lifecycle contract", () => {
  it("accepts a materialized L0 IFC candidate", () => {
    expect(validateBimCandidateLifecycle(materialized())).toEqual([]);
  });

  it("accepts a pending Core materialization without claiming IFC", () => {
    const pending: BimCandidateLifecycle = {
      ...materialized(),
      materializationState: "PENDING_CORE_MATERIALIZATION",
      elements: [],
      pendingAgkObjectIds: ["AGK-OBJECT-001"],
      modelRef: undefined,
      modelHash: undefined,
    };
    expect(validateBimCandidateLifecycle(pending)).toEqual([]);
  });

  it("rejects a pending candidate with fabricated IFC elements", () => {
    const pending = materialized({
      materializationState: "PENDING_CORE_MATERIALIZATION",
      pendingAgkObjectIds: ["AGK-OBJECT-001"],
    });
    expect(validateBimCandidateLifecycle(pending)).toContain(
      "BIM_PENDING_MUST_NOT_CLAIM_IFC_ELEMENTS",
    );
  });

  it("rejects invalid IFC GlobalIds", () => {
    const candidate = materialized({
      elements: [element({ ifcGlobalId: "ARK-GEOM-PROJECT" })],
    });
    expect(validateBimCandidateLifecycle(candidate)).toContain(
      "BIM_IFC_GLOBAL_ID_INVALID",
    );
  });

  it("rejects duplicate ArchiElementIds", () => {
    const candidate = materialized({
      elements: [element(), element({ agkObjectId: "AGK-OBJECT-002" })],
    });
    expect(validateBimCandidateLifecycle(candidate)).toContain(
      "BIM_DUPLICATE_ARCHI_ELEMENT_ID",
    );
  });

  it("rejects invalid model hashes", () => {
    const candidate = materialized({ modelHash: "not-a-sha256" });
    expect(validateBimCandidateLifecycle(candidate)).toContain(
      "BIM_MODEL_HASH_INVALID",
    );
  });

  it("checks candidate, project and generation binding", () => {
    expect(
      validateBimCandidateLifecycle(materialized(), {
        projectId: "OTHER-PROJECT",
        candidateId: "CANDIDATE-001",
        generationId: "GENERATION-001",
      }),
    ).toContain("BIM_PROJECT_ID_MISMATCH");
  });

  it("accepts sequential refinement while preserving identity", () => {
    const previous = materialized();
    const next = materialized({
      developmentLevel: "L1",
      modelHash: "d".repeat(64),
      elements: [
        element({
          geometryHash: "e".repeat(64),
          geometryVersion: 2,
        }),
      ],
    });
    expect(validateBimRefinement(previous, next)).toEqual([]);
    expect(() => assertBimRefinement(previous, next)).not.toThrow();
  });

  it("rejects skipped development levels", () => {
    const previous = materialized();
    const next = materialized({ developmentLevel: "L2" });
    expect(validateBimRefinement(previous, next)).toContain(
      "BIM_REFINEMENT_LEVEL_NOT_SEQUENTIAL",
    );
  });

  it("rejects loss of an existing ArchiElementId", () => {
    const previous = materialized();
    const next = materialized({
      developmentLevel: "L1",
      elements: [element({ archiElementId: "d".repeat(64) })],
    });
    expect(validateBimRefinement(previous, next).some((error) =>
      error.startsWith("BIM_REFINEMENT_IDENTITY_LOST:"),
    )).toBe(true);
  });

  it("rejects changing GlobalId during refinement", () => {
    const previous = materialized();
    const next = materialized({
      developmentLevel: "L1",
      elements: [element({ ifcGlobalId: "ABCDEFGHIJ0123456789ab" })],
    });
    expect(validateBimRefinement(previous, next).some((error) =>
      error.startsWith("BIM_REFINEMENT_GLOBAL_ID_CHANGED:"),
    )).toBe(true);
  });

  it("requires geometry version increment when geometry changes", () => {
    const previous = materialized();
    const next = materialized({
      developmentLevel: "L1",
      elements: [element({ geometryHash: "f".repeat(64), geometryVersion: 1 })],
    });
    expect(validateBimRefinement(previous, next)).toContain(
      `BIM_GEOMETRY_VERSION_NOT_INCREMENTED:${hash}`,
    );
  });

  it("rejects changing geometry version without changing geometry", () => {
    const previous = materialized();
    const next = materialized({
      developmentLevel: "L1",
      elements: [element({ geometryVersion: 2 })],
    });
    expect(validateBimRefinement(previous, next)).toContain(
      `BIM_GEOMETRY_VERSION_CHANGED_WITHOUT_GEOMETRY_CHANGE:${hash}`,
    );
  });
});
