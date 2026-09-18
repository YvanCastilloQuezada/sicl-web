import type { ResidentialPlan, ResidentialRoom, ResidentialRoute } from "./residentialConstructivePlan";

export type A32FactorSource = "USER_SUPPLIED" | "EDUCATIONAL_PROXY" | "NORMATIVE_SOURCE_REQUIRES_REVIEW";
export type A32CalculationState = "COMPUTED" | "INCOMPLETE" | "CONFLICTING";
export type A32OccupancyRecord = {
  roomId: string;
  levelId: string;
  zone: ResidentialRoom["zone"];
  areaM2: number;
  occupantLoadFactorM2PerPerson: number;
  maximumPersons: number;
  source: A32FactorSource;
  evidenceRefs: string[];
  provenance: string[];
};
export type A32OccupancySummary = {
  alternativeId: string;
  records: A32OccupancyRecord[];
  byLevel: Record<string, number>;
  maximumOccupancyPersons: number;
  state: A32CalculationState;
  occupancyMeaning: "PRELIMINARY_CAPACITY_PROXY";
  regulatoryStatus: "NOT_ASSESSED";
  humanReviewRequired: true;
  noAutomaticApproval: true;
};
export type A32EvacuationProfile = {
  exitNodeId: string;
  flowRatePersonsPerMinPerM: number;
  source: A32FactorSource;
  evidenceRefs: string[];
  provenance: string[];
};
export type A32EvacuationRoute = {
  routeId: string;
  originNodeId: string;
  exitNodeId: string;
  path: string[];
  demandPersons: number;
  routeWidthM: number;
  capacityPersonsPerMin: number;
  estimatedFlowMinutes: number | null;
  bottleneck: boolean;
  reachable: boolean;
  evidenceRefs: string[];
  provenance: string[];
};
export type A32EvacuationSummary = {
  alternativeId: string;
  occupancy: A32OccupancySummary;
  routes: A32EvacuationRoute[];
  maximumEstimatedFlowMinutes: number | null;
  state: A32CalculationState;
  flowMeaning: "CAPACITY_PROXY_NOT_EVACUATION_TIME";
  evacuationCompliance: "NOT_ASSESSED";
  fireSafetyStatus: "NOT_ASSESSED";
  humanReviewRequired: true;
  noAutomaticCorrection: true;
  warnings: string[];
};

const safeFactor = (value: number | undefined) => Number.isFinite(value) && (value as number) > 0 ? value as number : undefined;
const roomArea = (room: ResidentialRoom) => Math.max(0, room.areaM2);

export function calculateA32Occupancy(plan: ResidentialPlan, factorsByZone: Partial<Record<ResidentialRoom["zone"], number>>, source: A32FactorSource = "EDUCATIONAL_PROXY"): A32OccupancySummary {
  const records: A32OccupancyRecord[] = plan.rooms.map((room) => {
    const factor = safeFactor(factorsByZone[room.zone]);
    const areaM2 = roomArea(room);
    const maximumPersons = factor ? Math.floor(areaM2 / factor) : 0;
    return { roomId: room.id, levelId: room.levelId, zone: room.zone, areaM2, occupantLoadFactorM2PerPerson: factor ?? 0, maximumPersons, source, evidenceRefs: factor ? [`ResidentialPlan:${plan.alternativeId}`, `factor:${room.zone}:${factor}m2/person`] : [`ResidentialPlan:${plan.alternativeId}`], provenance: ["A32.calculateA32Occupancy", source === "EDUCATIONAL_PROXY" ? "A32 educational proxy factor" : `A32 factor source:${source}`] };
  });
  const incomplete = records.some((record) => record.occupantLoadFactorM2PerPerson <= 0);
  const byLevel = records.reduce<Record<string, number>>((acc, record) => ({ ...acc, [record.levelId]: (acc[record.levelId] ?? 0) + record.maximumPersons }), {});
  return { alternativeId: plan.alternativeId, records, byLevel, maximumOccupancyPersons: records.reduce((sum, record) => sum + record.maximumPersons, 0), state: incomplete ? "INCOMPLETE" : "COMPUTED", occupancyMeaning: "PRELIMINARY_CAPACITY_PROXY", regulatoryStatus: "NOT_ASSESSED", humanReviewRequired: true, noAutomaticApproval: true };
}

function routeForOrigin(route: ResidentialRoute, originId: string, exitNodeId: string): string[] | null {
  const index = route.roomIds.indexOf(originId);
  if (index < 0) return null;
  const path = route.roomIds.slice(index);
  if (!path.includes(exitNodeId)) path.push(exitNodeId);
  return path;
}

export function calculateA32Evacuation(plan: ResidentialPlan, occupancy: A32OccupancySummary, profile: A32EvacuationProfile, routeId = plan.routes[0]?.id): A32EvacuationSummary {
  const route = plan.routes.find((item) => item.id === routeId);
  const warnings: string[] = ["Occupancy factors are not a code determination.", "Flow result is a capacity proxy, not evacuation time.", "Fire, smoke, door swing, stair geometry, travel distance and jurisdiction are not assessed."];
  if (!route || !safeFactor(profile.flowRatePersonsPerMinPerM)) return { alternativeId: plan.alternativeId, occupancy, routes: [], maximumEstimatedFlowMinutes: null, state: "INCOMPLETE", flowMeaning: "CAPACITY_PROXY_NOT_EVACUATION_TIME", evacuationCompliance: "NOT_ASSESSED", fireSafetyStatus: "NOT_ASSESSED", humanReviewRequired: true, noAutomaticCorrection: true, warnings: [...warnings, "A valid route and flow-rate profile are required."] };
  const routes: A32EvacuationRoute[] = occupancy.records.map((record) => {
    const path = routeForOrigin(route, record.roomId, profile.exitNodeId);
    const capacity = route.widthM * profile.flowRatePersonsPerMinPerM;
    const reachable = Boolean(path);
    const demand = record.maximumPersons;
    const estimated = reachable && capacity > 0 ? demand / capacity : null;
    return { routeId: `${route.id}:${record.roomId}`, originNodeId: record.roomId, exitNodeId: profile.exitNodeId, path: path ?? [], demandPersons: demand, routeWidthM: route.widthM, capacityPersonsPerMin: capacity, estimatedFlowMinutes: estimated, bottleneck: Boolean(estimated !== null && estimated > 1), reachable, evidenceRefs: [...record.evidenceRefs, `route:${route.id}`, ...profile.evidenceRefs], provenance: [...record.provenance, "A32.calculateA32Evacuation", ...profile.provenance] };
  });
  const allReachable = routes.length > 0 && routes.every((item) => item.reachable);
  const maximumEstimatedFlowMinutes = allReachable ? Math.max(...routes.map((item) => item.estimatedFlowMinutes ?? 0)) : null;
  return { alternativeId: plan.alternativeId, occupancy, routes, maximumEstimatedFlowMinutes, state: allReachable && occupancy.state === "COMPUTED" ? "COMPUTED" : allReachable ? "INCOMPLETE" : "CONFLICTING", flowMeaning: "CAPACITY_PROXY_NOT_EVACUATION_TIME", evacuationCompliance: "NOT_ASSESSED", fireSafetyStatus: "NOT_ASSESSED", humanReviewRequired: true, noAutomaticCorrection: true, warnings };
}

export function validateA32Result(result: A32EvacuationSummary): boolean {
  return result.occupancy.humanReviewRequired && result.occupancy.noAutomaticApproval && result.humanReviewRequired && result.noAutomaticCorrection && result.evacuationCompliance === "NOT_ASSESSED" && result.fireSafetyStatus === "NOT_ASSESSED" && result.warnings.length > 0;
}
