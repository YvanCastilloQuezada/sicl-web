import type { FlowKind } from "./arkiTypologyFunctionalKnowledge";
import type { Rect, ResidentialCore, ResidentialRoute } from "./residentialConstructivePlan";
import type { A22Level, A22LevelRole } from "./a22VerticalCoherence";

export type FunctionalUnitRole = "PRIMARY" | "SUPPORT" | "CONTROL" | "SERVICE" | "INFRASTRUCTURE" | "INTERFACE";
export type FunctionalNecessity = "ESSENTIAL" | "CONDITIONAL" | "OPTIONAL" | "NOT_APPLICABLE" | "UNKNOWN";
export type FunctionalUnitMembership = "PRIMARY" | "SHARED";
export type SpatialHierarchyEpistemicState = "HUMAN_CONFIRMED" | "PROJECT_FACT" | "OBSERVED_GEOMETRY" | "DERIVED_RELATION" | "AI_PROPOSED" | "HYPOTHESIS" | "UNKNOWN" | "CONFLICTING";
export type SpatialHierarchyStatus = "SUPPORTED" | "PARTIAL" | "CONFLICTING" | "UNKNOWN";

export type FunctionalUnit = {
  functionalUnitId: string;
  name: string;
  role: FunctionalUnitRole;
  necessity: FunctionalNecessity;
  spaceIds: string[];
  levelIds: string[];
  activityIds: string[];
  flowKinds: FlowKind[];
  memberships: Array<{ spaceId: string; membership: FunctionalUnitMembership }>;
  provenance: string[];
  epistemicState: SpatialHierarchyEpistemicState;
  status: "PROPOSED" | "OBSERVED" | "CONFIRMED" | "UNKNOWN";
  humanReviewRequired: true;
};

export type ArkiLevel = A22Level & {
  spaceIds: string[];
  functionalUnitIds: string[];
  coreIds: string[];
  routeIds: string[];
  footprint?: Rect;
};

export type SpatialHierarchy = {
  projectId: string;
  alternativeId: string;
  scalePath: ["SPACE", "FUNCTIONAL_UNIT", "LEVEL", "FUNCTIONAL_SYSTEM", "BUILDING"];
  levels: ArkiLevel[];
  functionalUnits: FunctionalUnit[];
  provenance: string[];
  epistemicState: SpatialHierarchyEpistemicState;
  status: SpatialHierarchyStatus;
  humanReviewRequired: true;
  noGeometryDuplication: true;
};

type HierarchySpace = { id: string; levelId: string; programId?: string; flow?: FlowKind | string; footprint?: Rect };
type HierarchyLevelInput = Pick<A22Level, "levelId" | "levelIndex" | "levelLabel" | "levelRole" | "projectId" | "alternativeId"> & Partial<Pick<A22Level, "elevationReference" | "heightReference" | "floorToFloorHeight" | "spatialRepresentationId" | "status">> & { footprint?: Rect };
type HierarchyUnitInput = Omit<FunctionalUnit, "levelIds" | "memberships" | "provenance" | "epistemicState" | "status" | "humanReviewRequired" | "flowKinds"> & { flowKinds: readonly FlowKind[]; status?: FunctionalUnit["status"]; epistemicState?: SpatialHierarchyEpistemicState; provenance?: string[]; memberships?: FunctionalUnit["memberships"] };

function unique<T extends string>(values: readonly T[]): T[] { return Array.from(new Set(values)); }
function levelRole(level: HierarchyLevelInput): A22LevelRole { return level.levelRole; }

/** Builds derived hierarchy references; it never creates or mutates geometry. */
export function buildSpatialHierarchy(input: {
  projectId: string;
  alternativeId: string;
  spaces: HierarchySpace[];
  levels: HierarchyLevelInput[];
  functionalUnits: HierarchyUnitInput[];
  cores?: ResidentialCore[];
  routes?: ResidentialRoute[];
  provenance?: string[];
}): SpatialHierarchy {
  const spaceById = new Map(input.spaces.map((space) => [space.id, space]));
  const levels: ArkiLevel[] = input.levels.map((level) => ({
    ...level,
    levelRole: levelRole(level),
    status: level.status ?? "OBSERVED",
    provenance: [`A22.level:${level.levelId}`, ...(input.provenance ?? [])],
    epistemicState: "OBSERVED_GEOMETRY",
    spaceIds: unique(input.spaces.filter((space) => space.levelId === level.levelId).map((space) => space.id)),
    functionalUnitIds: [],
    coreIds: unique((input.cores ?? []).filter((core) => core.levelIds.includes(level.levelId)).map((core) => core.id)),
    routeIds: unique((input.routes ?? []).filter((route) => route.levelIds.includes(level.levelId)).map((route) => route.id)),
    footprint: level.footprint,
  }));
  const functionalUnits: FunctionalUnit[] = input.functionalUnits.map((unit) => {
    const spaceIds = unique(unit.spaceIds);
    const levelIds = unique(spaceIds.map((spaceId) => spaceById.get(spaceId)?.levelId).filter((levelId): levelId is string => Boolean(levelId)));
    const memberships = unit.memberships ?? spaceIds.map((spaceId) => ({ spaceId, membership: "PRIMARY" as const }));
    return {
      ...unit,
      spaceIds,
      levelIds,
      memberships,
      activityIds: unique(unit.activityIds),
      flowKinds: unique(unit.flowKinds),
      provenance: unit.provenance ?? [`FunctionalUnit:${unit.functionalUnitId}`, "ARKI.multiscale.functional-unit"],
      epistemicState: unit.epistemicState ?? "HYPOTHESIS",
      status: unit.status ?? "PROPOSED",
      humanReviewRequired: true,
    };
  });
  for (const level of levels) level.functionalUnitIds = functionalUnits.filter((unit) => unit.levelIds.includes(level.levelId)).map((unit) => unit.functionalUnitId);
  const hierarchy: SpatialHierarchy = { projectId: input.projectId, alternativeId: input.alternativeId, scalePath: ["SPACE", "FUNCTIONAL_UNIT", "LEVEL", "FUNCTIONAL_SYSTEM", "BUILDING"], levels, functionalUnits, provenance: input.provenance ?? ["ARKI.multiscale.buildSpatialHierarchy"], epistemicState: "DERIVED_RELATION", status: "SUPPORTED", humanReviewRequired: true, noGeometryDuplication: true };
  const issues = validateSpatialHierarchy(hierarchy);
  return issues.length ? { ...hierarchy, status: "CONFLICTING" } : hierarchy;
}

export function validateSpatialHierarchy(hierarchy: SpatialHierarchy): string[] {
  const errors: string[] = [];
  const levelIds = new Set(hierarchy.levels.map((level) => level.levelId));
  const spaceIdsByLevel = new Map(hierarchy.levels.flatMap((level) => level.spaceIds.map((spaceId) => [spaceId, level.levelId] as const)));
  if (hierarchy.scalePath.join("|") !== "SPACE|FUNCTIONAL_UNIT|LEVEL|FUNCTIONAL_SYSTEM|BUILDING") errors.push("SCALE_PATH_INVALID");
  if (!hierarchy.noGeometryDuplication) errors.push("GEOMETRY_DUPLICATION_NOT_ALLOWED");
  if (!hierarchy.levels.every((level) => level.provenance.length > 0 && level.levelIndex >= 0)) errors.push("LEVEL_PROVENANCE_OR_INDEX");
  for (const unit of hierarchy.functionalUnits) {
    if (!unit.spaceIds.length) errors.push(`FUNCTIONAL_UNIT_WITHOUT_SPACES:${unit.functionalUnitId}`);
    if (!unit.provenance.length || !unit.humanReviewRequired) errors.push(`FUNCTIONAL_UNIT_EVIDENCE:${unit.functionalUnitId}`);
    const derivedLevelIds = unique(unit.spaceIds.map((spaceId) => spaceIdsByLevel.get(spaceId)).filter((levelId): levelId is string => Boolean(levelId)));
    if (unit.spaceIds.some((spaceId) => !spaceIdsByLevel.has(spaceId))) errors.push(`FUNCTIONAL_UNIT_UNKNOWN_SPACE:${unit.functionalUnitId}`);
    if (derivedLevelIds.some((levelId) => !levelIds.has(levelId))) errors.push(`FUNCTIONAL_UNIT_UNKNOWN_LEVEL:${unit.functionalUnitId}`);
    if (derivedLevelIds.sort().join("|") !== [...unit.levelIds].sort().join("|")) errors.push(`FUNCTIONAL_UNIT_LEVEL_MEMBERSHIP:${unit.functionalUnitId}`);
    if (unit.memberships.some((membership) => membership.membership === "PRIMARY" && !unit.spaceIds.includes(membership.spaceId))) errors.push(`FUNCTIONAL_UNIT_MEMBERSHIP_REFERENCE:${unit.functionalUnitId}`);
  }
  for (const level of hierarchy.levels) if (level.functionalUnitIds.some((unitId) => !hierarchy.functionalUnits.some((unit) => unit.functionalUnitId === unitId))) errors.push(`LEVEL_UNKNOWN_FUNCTIONAL_UNIT:${level.levelId}`);
  return errors;
}

export function summarizeSpatialHierarchy(hierarchy: SpatialHierarchy) {
  return {
    levels: hierarchy.levels.length,
    functionalUnits: hierarchy.functionalUnits.length,
    spacesReferenced: unique(hierarchy.functionalUnits.flatMap((unit) => unit.spaceIds)).length,
    crossLevelFunctionalUnits: hierarchy.functionalUnits.filter((unit) => unit.levelIds.length > 1).map((unit) => unit.functionalUnitId),
    status: hierarchy.status,
    epistemicState: hierarchy.epistemicState,
    humanReviewRequired: hierarchy.humanReviewRequired,
  };
}
