/**
 * ARKI BIM Lifecycle Contract.
 *
 * IFC4.3 identity and progressive refinement contract.
 * IFC GlobalIds are assigned by SICL Core, never fabricated here.
 */

export const ARKI_BIM_LIFECYCLE_SCHEMA =
  "ARKI-BIM-LIFECYCLE-001" as const;

export const ARKI_IFC_SCHEMA = "IFC4X3_ADD2" as const;

export type BimDevelopmentLevel =
  | "L0"
  | "L1"
  | "L2"
  | "L3"
  | "L4"
  | "L5";

export type BimMaterializationState =
  | "PENDING_CORE_MATERIALIZATION"
  | "MATERIALIZED"
  | "BLOCKED";

export type BimElementRole =
  | "MASSING"
  | "BUILDING"
  | "STOREY"
  | "SPACE"
  | "ELEMENT"
  | "COMPONENT";

export type BimLifecycleElement = {
  agkObjectId: string;
  archiElementId: string;
  ifcGlobalId: string;
  ifcEntity: string;
  role: BimElementRole;
  geometryHash: string;
  geometryVersion: number;
  parentArchiElementId?: string;
};

export type BimCandidateLifecycle = {
  schemaVersion: typeof ARKI_BIM_LIFECYCLE_SCHEMA;
  ifcSchema: typeof ARKI_IFC_SCHEMA;

  projectId: string;
  candidateId: string;
  generationId: string;

  developmentLevel: BimDevelopmentLevel;
  materializationState: BimMaterializationState;

  /**
   * Candidate genealogy. These are candidate IDs, not IFC GlobalIds.
   */
  parentCandidateIds: string[];

  /**
   * Populated only after SICL Core has materialized the IFC model.
   */
  elements: BimLifecycleElement[];

  /**
   * AGK objects awaiting Core identity assignment.
   * A pending candidate cannot advance to the next development level.
   */
  pendingAgkObjectIds: string[];

  modelRef?: string;
  modelHash?: string;
  blockedReason?: string;
};

export type BimCandidateIdentityContext = {
  projectId: string;
  candidateId: string;
  generationId: string;
};

const SHA256 = /^[0-9a-f]{64}$/;
const IFC_GUID = /^[0-9A-Za-z_$]{22}$/;

const LEVEL_INDEX: Record<BimDevelopmentLevel, number> = {
  L0: 0,
  L1: 1,
  L2: 2,
  L3: 3,
  L4: 4,
  L5: 5,
};

function nonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateBimCandidateLifecycle(
  lifecycle: BimCandidateLifecycle,
  expected?: BimCandidateIdentityContext,
): string[] {
  const errors: string[] = [];

  if (lifecycle.schemaVersion !== ARKI_BIM_LIFECYCLE_SCHEMA) {
    errors.push("BIM_LIFECYCLE_SCHEMA_INVALID");
  }

  if (lifecycle.ifcSchema !== ARKI_IFC_SCHEMA) {
    errors.push("BIM_IFC_SCHEMA_INVALID");
  }

  for (const field of ["projectId", "candidateId", "generationId"] as const) {
    if (!nonEmpty(lifecycle[field])) {
      errors.push(`BIM_IDENTITY_FIELD_INVALID:${field}`);
    }
  }

  if (expected) {
    if (lifecycle.projectId !== expected.projectId) {
      errors.push("BIM_PROJECT_ID_MISMATCH");
    }
    if (lifecycle.candidateId !== expected.candidateId) {
      errors.push("BIM_CANDIDATE_ID_MISMATCH");
    }
    if (lifecycle.generationId !== expected.generationId) {
      errors.push("BIM_GENERATION_ID_MISMATCH");
    }
  }

  if (!(lifecycle.developmentLevel in LEVEL_INDEX)) {
    errors.push("BIM_DEVELOPMENT_LEVEL_INVALID");
  }

  if (!Array.isArray(lifecycle.parentCandidateIds)) {
    errors.push("BIM_PARENT_CANDIDATES_INVALID");
  } else {
    if (new Set(lifecycle.parentCandidateIds).size !== lifecycle.parentCandidateIds.length) {
      errors.push("BIM_DUPLICATE_PARENT_CANDIDATES");
    }
    if (lifecycle.parentCandidateIds.includes(lifecycle.candidateId)) {
      errors.push("BIM_CANDIDATE_CANNOT_BE_OWN_PARENT");
    }
  }

  if (!Array.isArray(lifecycle.elements)) {
    errors.push("BIM_ELEMENTS_INVALID");
  }

  if (!Array.isArray(lifecycle.pendingAgkObjectIds)) {
    errors.push("BIM_PENDING_AGK_OBJECTS_INVALID");
  }

  if (lifecycle.materializationState === "PENDING_CORE_MATERIALIZATION") {
    if (lifecycle.elements.length !== 0) {
      errors.push("BIM_PENDING_MUST_NOT_CLAIM_IFC_ELEMENTS");
    }
    if (lifecycle.pendingAgkObjectIds.length === 0) {
      errors.push("BIM_PENDING_REQUIRES_AGK_OBJECTS");
    }
    if (lifecycle.modelHash || lifecycle.modelRef) {
      errors.push("BIM_PENDING_CANNOT_CLAIM_IFC_MODEL");
    }
  }

  if (lifecycle.materializationState === "MATERIALIZED") {
    if (lifecycle.elements.length === 0) {
      errors.push("BIM_MATERIALIZED_REQUIRES_ELEMENTS");
    }

    if (lifecycle.pendingAgkObjectIds.length !== 0) {
      errors.push("BIM_MATERIALIZED_HAS_PENDING_AGK_OBJECTS");
    }

    if (!nonEmpty(lifecycle.modelRef)) {
      errors.push("BIM_MODEL_REFERENCE_MISSING");
    }

    if (!SHA256.test(lifecycle.modelHash ?? "")) {
      errors.push("BIM_MODEL_HASH_INVALID");
    }

    const archiIds = new Set<string>();
    const ifcIds = new Set<string>();
    const agkIds = new Set<string>();

    for (const element of lifecycle.elements) {
      if (!nonEmpty(element.agkObjectId)) {
        errors.push("BIM_AGK_OBJECT_ID_INVALID");
      } else if (agkIds.has(element.agkObjectId)) {
        errors.push("BIM_DUPLICATE_AGK_OBJECT_ID");
      } else {
        agkIds.add(element.agkObjectId);
      }

      if (!SHA256.test(element.archiElementId)) {
        errors.push("BIM_ARCHI_ELEMENT_ID_INVALID");
      } else if (archiIds.has(element.archiElementId)) {
        errors.push("BIM_DUPLICATE_ARCHI_ELEMENT_ID");
      } else {
        archiIds.add(element.archiElementId);
      }

      if (!IFC_GUID.test(element.ifcGlobalId)) {
        errors.push("BIM_IFC_GLOBAL_ID_INVALID");
      } else if (ifcIds.has(element.ifcGlobalId)) {
        errors.push("BIM_DUPLICATE_IFC_GLOBAL_ID");
      } else {
        ifcIds.add(element.ifcGlobalId);
      }

      if (!nonEmpty(element.ifcEntity)) {
        errors.push("BIM_IFC_ENTITY_INVALID");
      }

      if (!SHA256.test(element.geometryHash)) {
        errors.push("BIM_GEOMETRY_HASH_INVALID");
      }

      if (
        !Number.isSafeInteger(element.geometryVersion) ||
        element.geometryVersion < 1
      ) {
        errors.push("BIM_GEOMETRY_VERSION_INVALID");
      }

      if (
        element.parentArchiElementId &&
        !SHA256.test(element.parentArchiElementId)
      ) {
        errors.push("BIM_PARENT_ARCHI_ID_INVALID");
      }
    }

    for (const element of lifecycle.elements) {
      if (
        element.parentArchiElementId &&
        !archiIds.has(element.parentArchiElementId)
      ) {
        errors.push("BIM_ORPHAN_ELEMENT_PARENT");
      }
    }
  }

  if (lifecycle.materializationState === "BLOCKED" && !nonEmpty(lifecycle.blockedReason)) {
    errors.push("BIM_BLOCKED_REASON_REQUIRED");
  }

  return [...new Set(errors)];
}

/**
 * A refinement is the same candidate becoming more detailed.
 * Existing ArchiElementIds and IfcGlobalIds must survive.
 * Geometry changes require a strictly higher geometryVersion.
 */
export function validateBimRefinement(
  previous: BimCandidateLifecycle,
  next: BimCandidateLifecycle,
): string[] {
  const errors = [
    ...validateBimCandidateLifecycle(previous),
    ...validateBimCandidateLifecycle(next),
  ];

  if (
    previous.materializationState !== "MATERIALIZED" ||
    next.materializationState !== "MATERIALIZED"
  ) {
    errors.push("BIM_REFINEMENT_REQUIRES_MATERIALIZED_MODELS");
    return [...new Set(errors)];
  }

  if (previous.projectId !== next.projectId) {
    errors.push("BIM_REFINEMENT_PROJECT_CHANGED");
  }

  if (previous.candidateId !== next.candidateId) {
    errors.push("BIM_REFINEMENT_CANDIDATE_CHANGED");
  }

  if (previous.generationId !== next.generationId) {
    errors.push("BIM_REFINEMENT_GENERATION_CHANGED");
  }

  if (previous.ifcSchema !== next.ifcSchema) {
    errors.push("BIM_REFINEMENT_IFC_SCHEMA_CHANGED");
  }

  if (
    LEVEL_INDEX[next.developmentLevel] !==
    LEVEL_INDEX[previous.developmentLevel] + 1
  ) {
    errors.push("BIM_REFINEMENT_LEVEL_NOT_SEQUENTIAL");
  }

  const nextById = new Map(
    next.elements.map((element) => [element.archiElementId, element]),
  );

  for (const oldElement of previous.elements) {
    const newElement = nextById.get(oldElement.archiElementId);

    if (!newElement) {
      errors.push(`BIM_REFINEMENT_IDENTITY_LOST:${oldElement.archiElementId}`);
      continue;
    }

    if (newElement.ifcGlobalId !== oldElement.ifcGlobalId) {
      errors.push(`BIM_REFINEMENT_GLOBAL_ID_CHANGED:${oldElement.archiElementId}`);
    }

    if (newElement.agkObjectId !== oldElement.agkObjectId) {
      errors.push(`BIM_REFINEMENT_AGK_ID_CHANGED:${oldElement.archiElementId}`);
    }

    if (newElement.geometryHash !== oldElement.geometryHash) {
      if (newElement.geometryVersion <= oldElement.geometryVersion) {
        errors.push(`BIM_GEOMETRY_VERSION_NOT_INCREMENTED:${oldElement.archiElementId}`);
      }
    } else if (newElement.geometryVersion !== oldElement.geometryVersion) {
      errors.push(`BIM_GEOMETRY_VERSION_CHANGED_WITHOUT_GEOMETRY_CHANGE:${oldElement.archiElementId}`);
    }
  }

  return [...new Set(errors)];
}

export function assertBimRefinement(
  previous: BimCandidateLifecycle,
  next: BimCandidateLifecycle,
): void {
  const errors = validateBimRefinement(previous, next);
  if (errors.length > 0) {
    throw new Error(`BIM_REFINEMENT_REJECTED:${errors.join("|")}`);
  }
}
