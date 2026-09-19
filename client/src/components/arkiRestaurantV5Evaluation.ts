import { buildRestaurantWasteRepair, type RestaurantWasteRepair } from "./arkiWasteGeometryRepair";
import { compareRestaurantV3V4, evaluateRestaurantV4 } from "./arkiRestaurantV4Evaluation";
import { evaluateRestaurantV3 } from "./arkiRestaurantV3Evaluation";

export type RestaurantV5Evaluation = {
  repair: RestaurantWasteRepair;
  baselineV4: ReturnType<typeof evaluateRestaurantV4>;
  candidateV3Read: ReturnType<typeof evaluateRestaurantV3>;
  comparison: {
    originalAlternativeId: string;
    candidateAlternativeId: string;
    originalWasteSpaces: number;
    candidateWasteSpaces: number;
    originalWasteStatus: string;
    candidateGeometricStatus: string;
    routeCountBefore: number;
    routeCountAfter: number;
    openingCountBefore: number;
    openingCountAfter: number;
    preservedClaims: string[];
    unknownClaims: string[];
  };
  status: "GEOMETRICALLY_RESOLVED_WITH_OPERATIONAL_UNKNOWN" | "CONFLICTING";
  humanReviewRequired: true;
  epistemicState: "HYPOTHESIS";
  noPermitClaim: true;
};

export function evaluateRestaurantV5WasteRepair(): RestaurantV5Evaluation {
  const baselineV4 = evaluateRestaurantV4();
  const repair = buildRestaurantWasteRepair(baselineV4.design);
  const candidateV3Read = evaluateRestaurantV3(repair.candidate);
  return {
    repair,
    baselineV4,
    candidateV3Read,
    comparison: {
      originalAlternativeId: baselineV4.design.alternativeId,
      candidateAlternativeId: repair.candidate.alternativeId,
      originalWasteSpaces: baselineV4.design.spaces.filter((space) => space.programId === "WASTE_RETURN").length,
      candidateWasteSpaces: repair.candidate.spaces.filter((space) => space.programId === "WASTE_RETURN").length,
      originalWasteStatus: baselineV4.coverage.find((item) => item.subjectId === "REST-MAINTENANCE")?.state ?? "NOT_EVALUATED",
      candidateGeometricStatus: repair.validation.status,
      routeCountBefore: baselineV4.design.routes.length,
      routeCountAfter: repair.candidate.routes.length,
      openingCountBefore: baselineV4.design.openings.length,
      openingCountAfter: repair.candidate.openings.length,
      preservedClaims: repair.reassessment.preservedClaimIds,
      unknownClaims: repair.reassessment.unknownClaimIds,
    },
    status: repair.validation.status === "GEOMETRICALLY_RESOLVED" ? "GEOMETRICALLY_RESOLVED_WITH_OPERATIONAL_UNKNOWN" : "CONFLICTING",
    humanReviewRequired: true,
    epistemicState: "HYPOTHESIS",
    noPermitClaim: true,
  };
}

export function validateRestaurantV5WasteRepair(evaluation = evaluateRestaurantV5WasteRepair()) {
  const v4Comparison = compareRestaurantV3V4(evaluation.baselineV4);
  return {
    sameCanonicalSite: evaluation.repair.original.site === evaluation.repair.candidate.site,
    alternativeForkCreated: evaluation.comparison.originalAlternativeId !== evaluation.comparison.candidateAlternativeId,
    geometricRepairPass: evaluation.repair.validation.status === "GEOMETRICALLY_RESOLVED",
    wasteSpaceAdded: evaluation.comparison.candidateWasteSpaces === 1,
    wasteRouteAdded: evaluation.comparison.routeCountAfter === evaluation.comparison.routeCountBefore + 1,
    wasteOpeningsAdded: evaluation.repair.candidate.openings.filter((opening) => opening.id.includes("WASTE")).length === 3,
    originalV4GeometryStillComparable: v4Comparison.geometryPreserved,
    operationalUnknownPreserved: evaluation.repair.validation.checks.OPERATIONAL_CAPACITY === "UNKNOWN",
    rneUnknownPreserved: evaluation.repair.validation.checks.RNE_WASTE_COMPLIANCE === "UNKNOWN",
    humanReviewRequired: evaluation.humanReviewRequired,
    noPermitClaim: evaluation.noPermitClaim,
    status: evaluation.status,
  };
}
