import type { DesignMemory, DesignMemoryDecision } from "./a21DesignMemory";
import type { SpatialZoneProposal } from "./a21SpatialRelationships";

export type A24ArchitectProfile = "JUNIOR" | "ARCHITECT" | "MASTER" | "GENIUS" | "CRAZY";
export type A24ShapeFamily = "ORTHOGONAL_GRID" | "RADIAL" | "CURVILINEAR" | "HYBRID" | "RULED_SURFACE" | "HYPERBOLIC_PROFILE";
export type A24ConstructabilityState = "CONCEPTUAL" | "CONTROLLED_HYPOTHESIS" | "NOT_ASSESSED";
export type A24ValidationState = "SUPPORTED" | "PARTIAL" | "CONFLICTING" | "INSUFFICIENT_EVIDENCE";

export type A24Core = { coreId: string; coreType: "STAIR" | "ELEVATOR" | "STAIR_AND_ELEVATOR" | "SERVICE_CORE"; levelIds: string[]; footprint: { minX: number; minY: number; maxX: number; maxY: number }; continuityState: "CONTINUOUS" | "PARTIALLY_CONTINUOUS" | "UNVERIFIED"; provenance: string[] };
export type A24SpacePlacement = { spaceId: string; programId: string; levelId: string; zoneId: string; footprint: { minX: number; minY: number; maxX: number; maxY: number }; adjacentTo: string[]; separatedFrom: string[]; coreAccess: string[]; provenance: string[] };
export type A24FloorPlanAlternative = { floorPlanAlternativeId: string; projectId: string; alternativeId: string; profile: A24ArchitectProfile; levelIds: string[]; shapeFamilies: A24ShapeFamily[]; shapeParameters: Record<string, number>; spaces: A24SpacePlacement[]; cores: A24Core[]; unresolvedRequirements: string[]; conflicts: string[]; constructabilityState: A24ConstructabilityState; validationState: A24ValidationState; humanReviewRequired: true; noAutomaticDecision: true; noAutomaticWinner: true; provenance: string[] };
export type A24MemoryZoningCrossCheck = { levelId: string; memoryValid: boolean; zoningValid: boolean; decisionRefs: string[]; zoneRefs: string[]; unmatchedDecisionZoneRefs: string[]; unmatchedZoneDecisionRefs: string[]; state: A24ValidationState; humanReviewRequired: true; noAutomaticDecision: true; evidenceRefs: string[] };

const hasFiniteBounds = (box: A24SpacePlacement["footprint"]): boolean => [box.minX, box.minY, box.maxX, box.maxY].every(Number.isFinite) && box.maxX > box.minX && box.maxY > box.minY;
const contains = (outer: A24SpacePlacement["footprint"], inner: A24SpacePlacement["footprint"]): boolean => inner.minX >= outer.minX && inner.minY >= outer.minY && inner.maxX <= outer.maxX && inner.maxY <= outer.maxY;
const overlaps = (a: A24SpacePlacement["footprint"], b: A24SpacePlacement["footprint"]): boolean => a.minX < b.maxX && a.maxX > b.minX && a.minY < b.maxY && a.maxY > b.minY;
const profileShapes: Record<A24ArchitectProfile, A24ShapeFamily[]> = { JUNIOR: ["ORTHOGONAL_GRID"], ARCHITECT: ["ORTHOGONAL_GRID", "CURVILINEAR"], MASTER: ["ORTHOGONAL_GRID", "RADIAL", "HYBRID"], GENIUS: ["RADIAL", "CURVILINEAR", "HYBRID"], CRAZY: ["RULED_SURFACE", "HYPERBOLIC_PROFILE"] };

export function generateFloorPlanAlternative(input: { projectId: string; alternativeId: string; profile: A24ArchitectProfile; levelIds: string[]; site: A24SpacePlacement["footprint"]; zones: SpatialZoneProposal[]; cores: A24Core[]; spaces: Array<Pick<A24SpacePlacement, "spaceId" | "programId" | "levelId" | "zoneId">> }): A24FloorPlanAlternative {
  const shapeFamilies = profileShapes[input.profile];
  const spaces = input.spaces.map((space, index) => {
    const width = Math.max(2, (input.site.maxX - input.site.minX) / Math.max(3, input.spaces.length));
    const x = input.site.minX + 0.5 + (index % 3) * width;
    const y = input.site.minY + 0.5 + Math.floor(index / 3) * 3;
    const coreAccess = input.cores.filter((core) => core.levelIds.includes(space.levelId)).map((core) => core.coreId);
    return { ...space, footprint: { minX: x, minY: y, maxX: Math.min(input.site.maxX - 0.5, x + width - 0.5), maxY: Math.min(input.site.maxY - 0.5, y + 2), }, adjacentTo: [], separatedFrom: [], coreAccess, provenance: [`A24.generateFloorPlanAlternative:${input.profile}`, `zone:${space.zoneId}`] };
  });
  return { floorPlanAlternativeId: `a24-floorplan:${input.alternativeId}:${input.profile.toLowerCase()}`, projectId: input.projectId, alternativeId: input.alternativeId, profile: input.profile, levelIds: [...input.levelIds], shapeFamilies, shapeParameters: input.profile === "CRAZY" ? { ruledSurfaceTwist: 0.22, hyperbolicCurvature: 0.16, amplitude: 0.35 } : { regularity: input.profile === "JUNIOR" ? 1 : 0.7 }, spaces, cores: input.cores, unresolvedRequirements: [], conflicts: [], constructabilityState: input.profile === "CRAZY" ? "CONTROLLED_HYPOTHESIS" : "CONCEPTUAL", validationState: "INSUFFICIENT_EVIDENCE", humanReviewRequired: true, noAutomaticDecision: true, noAutomaticWinner: true, provenance: ["A24.generateFloorPlanAlternative", `profile:${input.profile}`, "A21 zones reused", "A22 vertical core constraints reused"] };
}

export function validateFloorPlanAlternative(plan: A24FloorPlanAlternative, site: A24SpacePlacement["footprint"]): A24FloorPlanAlternative {
  const conflicts: string[] = [];
  if (!plan.levelIds.length) conflicts.push("NO_LEVELS");
  if (!plan.cores.length) conflicts.push("NO_VERTICAL_CORE");
  if (plan.cores.some((core) => core.levelIds.some((levelId) => !plan.levelIds.includes(levelId)))) conflicts.push("CORE_LEVEL_OUTSIDE_PLAN");
  if (plan.spaces.some((space) => !hasFiniteBounds(space.footprint) || !contains(site, space.footprint))) conflicts.push("SPACE_OUTSIDE_SITE_OR_INVALID");
  const duplicateOverlap = plan.spaces.some((space, index) => plan.spaces.slice(index + 1).some((other) => space.levelId === other.levelId && overlaps(space.footprint, other.footprint) && space.zoneId !== other.zoneId));
  if (duplicateOverlap) conflicts.push("UNRESOLVED_ZONE_OVERLAP");
  if (plan.spaces.some((space) => space.coreAccess.length === 0)) conflicts.push("SPACE_WITHOUT_CORE_ACCESS");
  if (plan.profile === "CRAZY" && !plan.shapeFamilies.includes("RULED_SURFACE")) conflicts.push("CRAZY_SHAPE_FAMILY_MISSING");
  const state: A24ValidationState = conflicts.length ? "CONFLICTING" : plan.spaces.length && plan.cores.length ? "SUPPORTED" : "INSUFFICIENT_EVIDENCE";
  return { ...plan, conflicts, validationState: state };
}

export function crossValidateN2DesignMemory(memory: DesignMemory, zones: SpatialZoneProposal[], decisions: DesignMemoryDecision[], levelId = "N2"): A24MemoryZoningCrossCheck {
  const n2Zones = zones.filter((zone) => zone.programItemIds.length > 0 && (zone.provenance.some((ref) => ref.includes("N2")) || zone.zoneId.includes("n2")));
  const n2DecisionRefs = decisions.filter((decision) => decision.scope === "ZONE" && (decision.statement.includes(levelId) || decision.reason.includes(levelId))).map((decision) => decision.decisionId);
  const memoryValid = memory.projectId.length > 0 && memory.entries.every((entry) => memory.branches.some((branch) => branch.branchId === entry.branchId));
  const decisionZoneRefs = decisions.filter((decision) => decision.scope === "ZONE").flatMap((decision) => [decision.selectedBranchId, ...decision.rejectedBranchIds].filter((value): value is string => Boolean(value)));
  const zoneRefs = n2Zones.map((zone) => zone.zoneId);
  const unmatchedDecisionZoneRefs = decisionZoneRefs.filter((ref) => !memory.branches.some((branch) => branch.branchId === ref));
  const unmatchedZoneDecisionRefs = n2Zones.filter((zone) => !zone.provenance.some((ref) => decisions.some((decision) => ref.includes(decision.decisionId)))).map((zone) => zone.zoneId);
  const zoningValid = n2Zones.every((zone) => zone.noGeometryMutation && zone.noDecision && zone.provenance.length > 0);
  const state: A24ValidationState = !memoryValid || unmatchedDecisionZoneRefs.length ? "CONFLICTING" : !n2Zones.length || !n2DecisionRefs.length || unmatchedZoneDecisionRefs.length ? "INSUFFICIENT_EVIDENCE" : zoningValid ? "SUPPORTED" : "CONFLICTING";
  return { levelId, memoryValid, zoningValid, decisionRefs: n2DecisionRefs, zoneRefs, unmatchedDecisionZoneRefs, unmatchedZoneDecisionRefs, state, humanReviewRequired: true, noAutomaticDecision: true, evidenceRefs: ["A21.DesignMemory", "A21.SpatialZoneProposal", `level:${levelId}`] };
}
