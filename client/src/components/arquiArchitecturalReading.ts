import type { ArchitecturalRealizationPlan } from "./arquiControlledRealization";
import type { SpatialDesignOrganization } from "./arquiSpatialRealization";
import type { SpatialElement, SpatialRepresentation } from "./UPAO001SpatialViewer";

export type ReadingEpistemicStatus = "FACT" | "COMPUTED" | "INTERPRETATION" | "HYPOTHESIS" | "UNKNOWN";
export type CorrespondenceStatus = "PRESERVED" | "TRANSFORMED" | "NOT_REALIZED" | "UNVERIFIABLE" | "NOT_APPLICABLE";
export type ArchitecturalDesignReading = {
  alternativeId: string;
  sourceStrategyId: string;
  sourcePartiId: string;
  sourceOrganizationId: string;
  sourceRealizationPlanId: string;
  observedElements: Array<{ id: string; type: string; label?: string; status: ReadingEpistemicStatus; basis: string[] }>;
  observedHierarchy: Array<{ relation: "CONTAINS"; from: string; to: string; status: ReadingEpistemicStatus; basis: string[] }>;
  observedRelationships: Array<{ relation: string; from: string; to?: string; status: ReadingEpistemicStatus; basis: string[] }>;
  observedMassVoid: { massCount: number; footprintType?: string; centralVoid: "OBSERVED" | "NOT_OBSERVED" | "UNKNOWN"; status: ReadingEpistemicStatus; basis: string[] };
  observedAccess: { status: "OBSERVED" | "UNKNOWN"; value?: unknown; basis: string[] };
  observedCirculation: { status: "OBSERVED" | "UNKNOWN"; elementIds: string[]; basis: string[] };
  observedVerticalOrganization: { status: "OBSERVED" | "UNKNOWN"; floorCount?: number; height?: number; basis: string[] };
  observedSiteRelationship: { status: "OBSERVED" | "UNKNOWN"; position: "WITHIN_SITE" | "UNKNOWN"; orientationDegrees?: number; basis: string[] };
  correspondence: Array<{ expected: string; status: CorrespondenceStatus; observed: string; basis: string[] }>;
  transformations: string[];
  missingExpectedElements: string[];
  unverifiableElements: string[];
  contradictions: Array<{ expected: string; observed: string; basis: string[] }>;
  provenance: string[];
  epistemicStatus: "DERIVED";
  noCritique: true;
  noRecommendation: true;
  noMutation: true;
  noDecision: true;
};

function coordinatePairs(value: unknown, output: Array<[number, number]> = []): Array<[number, number]> {
  if (!Array.isArray(value)) return output;
  if (value.length >= 2 && typeof value[0] === "number" && typeof value[1] === "number") { output.push([value[0], value[1]]); return output; }
  value.forEach((item) => coordinatePairs(item, output));
  return output;
}

function bounds(element: SpatialElement) {
  const points = coordinatePairs(element.geometry.coordinates);
  if (!points.length) return undefined;
  return { minX: Math.min(...points.map((p) => p[0])), maxX: Math.max(...points.map((p) => p[0])), minY: Math.min(...points.map((p) => p[1])), maxY: Math.max(...points.map((p) => p[1])) };
}

function overlap(a: ReturnType<typeof bounds>, b: ReturnType<typeof bounds>): boolean {
  if (!a || !b) return false;
  return a.minX < b.maxX && b.minX < a.maxX && a.minY < b.maxY && b.minY < a.maxY;
}

function label(element: SpatialElement): string | undefined { return element.labels?.es ?? element.labels?.en; }

export function readArchitecturalResult(representation: SpatialRepresentation, organization: SpatialDesignOrganization, plan: ArchitecturalRealizationPlan): ArchitecturalDesignReading {
  const elements = representation.elements;
  const site = elements.find((item) => item.element_type === "SiteBoundary");
  const footprint = elements.find((item) => item.element_type === "BuildingFootprint");
  const masses = elements.filter((item) => item.element_type === "BuildingMass");
  const zones = elements.filter((item) => item.element_type === "SpatialZone" || item.element_type === "SPATIAL_ZONE");
  const circulation = elements.filter((item) => item.element_type === "CirculationElement");
  const provenance = ["actual SpatialRepresentation", "actual element metadata", "A13 expected organization", "A14 realization plan", "A15 derived architectural reading"];
  const observedElements = elements.map((item) => ({ id: item.id, type: item.element_type, label: label(item), status: "FACT" as const, basis: [`SpatialRepresentation.elements[${item.id}]`] }));
  const observedHierarchy = elements.filter((item) => item.parent_id).map((item) => ({ relation: "CONTAINS" as const, from: String(item.parent_id), to: item.id, status: "FACT" as const, basis: ["SpatialElement.parent_id"] }));
  const observedRelationships = [...observedHierarchy.map((item) => ({ relation: item.relation, from: item.from, to: item.to, status: item.status, basis: item.basis }))];
  const footprintType = String(footprint?.geometry.type ?? "");
  const centralVoid = masses.length >= 4 && footprintType === "multipolygon" ? "OBSERVED" : footprint ? "NOT_OBSERVED" : "UNKNOWN";
  const accessPoint = circulation.find((item) => item.metadata?.access_point !== undefined)?.metadata?.access_point;
  const maxHeight = masses.map((item) => Number(item.metadata?.height)).filter(Number.isFinite);
  const maxFloors = masses.map((item) => Number(item.metadata?.floor_count)).filter(Number.isFinite);
  const observedStrategy = String(footprint?.metadata?.strategy ?? "");
  const correspondence: ArchitecturalDesignReading["correspondence"] = [];
  if (organization.strategyFamily === "COURTYARD") correspondence.push({ expected: "CENTRAL_VOID", status: centralVoid === "OBSERVED" ? "PRESERVED" : centralVoid === "NOT_OBSERVED" ? "NOT_REALIZED" : "UNVERIFIABLE", observed: centralVoid === "OBSERVED" ? "four masses around a multipolygon footprint" : "central void not determinable from actual state", basis: ["actual BuildingMass count", "actual BuildingFootprint geometry.type"] });
  if (organization.strategyFamily === "LINEAR_BAR") correspondence.push({ expected: "LINEAR_SPINE", status: "NOT_REALIZED", observed: circulation.length ? "a circulation element exists, but no canonical spine operation was realized" : "no circulation element", basis: ["A13 circulationStructure", "A14 unsupported operation mapping", "actual element types"] });
  if (organization.strategyFamily === "COMPACT_VERTICAL") correspondence.push({ expected: "VERTICAL_CONCENTRATION", status: observedStrategy === "compact" ? "PRESERVED" : observedStrategy ? "TRANSFORMED" : "UNVERIFIABLE", observed: observedStrategy ? `${observedStrategy} mass strategy` : "strategy not represented", basis: ["BuildingFootprint.metadata.strategy", "BuildingMass metadata"] });
  if (organization.strategyFamily === "COURTYARD") correspondence.push({ expected: "CIRCULATION_LOOP", status: "UNVERIFIABLE", observed: circulation.length ? "primary circulation line is present; loop semantics are not represented" : "circulation not represented", basis: ["actual CirculationElement", "A13 circulation hypothesis"] });
  correspondence.push({ expected: "PROGRAM_ZONES", status: zones.some((item) => item.metadata?.program) ? "TRANSFORMED" : "UNVERIFIABLE", observed: zones.some((item) => item.metadata?.program) ? "program-labelled spatial zones" : "no validated program assignment in actual geometry", basis: ["actual SpatialZone metadata.program", "absence of validated program attachment"] });
  const transformations = correspondence.filter((item) => item.status === "TRANSFORMED").map((item) => `${item.expected}: ${item.observed}`);
  const missingExpectedElements = correspondence.filter((item) => item.status === "NOT_REALIZED").map((item) => item.expected);
  const unverifiableElements = correspondence.filter((item) => item.status === "UNVERIFIABLE").map((item) => item.expected);
  const contradictions: ArchitecturalDesignReading["contradictions"] = [];
  for (let index = 0; index < masses.length; index += 1) for (let next = index + 1; next < masses.length; next += 1) if (overlap(bounds(masses[index]), bounds(masses[next]))) contradictions.push({ expected: "SEPARATED_MASSES", observed: `${masses[index].id} overlaps ${masses[next].id}`, basis: ["actual BuildingMass geometry bounds", "A13 SEPARATED relation"] });
  return {
    alternativeId: representation.alternative_id, sourceStrategyId: organization.strategyId, sourcePartiId: organization.partiId, sourceOrganizationId: organization.id, sourceRealizationPlanId: `${plan.strategyId}-realization-plan`, observedElements, observedHierarchy, observedRelationships,
    observedMassVoid: { massCount: masses.length, footprintType: footprintType || undefined, centralVoid, status: centralVoid === "UNKNOWN" ? "UNKNOWN" : "COMPUTED", basis: ["actual BuildingMass count", "actual BuildingFootprint geometry"] },
    observedAccess: accessPoint !== undefined ? { status: "OBSERVED", value: accessPoint, basis: ["CirculationElement.metadata.access_point"] } : { status: "UNKNOWN", basis: ["no explicit access point in actual state"] },
    observedCirculation: circulation.length ? { status: "OBSERVED", elementIds: circulation.map((item) => item.id), basis: ["actual CirculationElement elements"] } : { status: "UNKNOWN", elementIds: [], basis: ["no actual CirculationElement"] },
    observedVerticalOrganization: maxHeight.length ? { status: "OBSERVED", floorCount: Math.max(...maxFloors), height: Math.max(...maxHeight), basis: ["BuildingMass.metadata.floor_count", "BuildingMass.metadata.height"] } : { status: "UNKNOWN", basis: ["no actual vertical metadata"] },
    observedSiteRelationship: site && footprint ? { status: "OBSERVED", position: "WITHIN_SITE", orientationDegrees: representation.north_degrees, basis: ["actual SiteBoundary", "actual BuildingFootprint.parent_id", "SpatialRepresentation.north_degrees"] } : { status: "UNKNOWN", position: "UNKNOWN", basis: ["site relationship unavailable"] },
    correspondence, transformations, missingExpectedElements, unverifiableElements, contradictions, provenance, epistemicStatus: "DERIVED", noCritique: true, noRecommendation: true, noMutation: true, noDecision: true,
  };
}

export function summarizeArchitecturalReading(reading: ArchitecturalDesignReading): { preserved: number; transformed: number; notRealized: number; unverifiable: number; contradictionCount: number } {
  return { preserved: reading.correspondence.filter((item) => item.status === "PRESERVED").length, transformed: reading.correspondence.filter((item) => item.status === "TRANSFORMED").length, notRealized: reading.correspondence.filter((item) => item.status === "NOT_REALIZED").length, unverifiable: reading.correspondence.filter((item) => item.status === "UNVERIFIABLE").length, contradictionCount: reading.contradictions.length };
}
