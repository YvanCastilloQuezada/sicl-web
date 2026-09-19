import type { ResidentialRoom } from "./residentialConstructivePlan";
import { buildSingleFacadeHouseChallenge } from "./arkiSingleFacadeHouseChallenge";

export function buildSingleFacadeHouseProposal() {
  const challenge = buildSingleFacadeHouseChallenge();
  const rooms: ResidentialRoom[] = [
    { id: "GARAGE-N1", name: "Garaje", levelId: "N1", programId: "GARAGE", zone: "SERVICE", footprint: { minX: 0, minY: 0, maxX: 3.5, maxY: 5 }, targetAreaM2: 17.5, areaM2: 17.5, status: "EXPLICIT_GEOMETRY" },
    { id: "LIVING-N1", name: "Sala", levelId: "N1", programId: "LIVING", zone: "PUBLIC", footprint: { minX: 3.5, minY: 0, maxX: 8, maxY: 4 }, targetAreaM2: 18, areaM2: 18, status: "EXPLICIT_GEOMETRY" },
    { id: "DINING-N1", name: "Comedor", levelId: "N1", programId: "DINING", zone: "PUBLIC", footprint: { minX: 8, minY: 0, maxX: 12, maxY: 4 }, targetAreaM2: 16, areaM2: 16, status: "EXPLICIT_GEOMETRY" },
    { id: "BATH-1-N1", name: "Baño 1", levelId: "N1", programId: "BATHROOM", zone: "SERVICE", footprint: { minX: 0, minY: 5, maxX: 2, maxY: 7 }, targetAreaM2: 4, areaM2: 4, status: "EXPLICIT_GEOMETRY" },
    { id: "BATH-2-N1", name: "Baño 2", levelId: "N1", programId: "BATHROOM", zone: "SERVICE", footprint: { minX: 2, minY: 5, maxX: 4, maxY: 7 }, targetAreaM2: 4, areaM2: 4, status: "EXPLICIT_GEOMETRY" },
    { id: "KITCHEN-N1", name: "Cocina", levelId: "N1", programId: "KITCHEN", zone: "SERVICE", footprint: { minX: 8, minY: 4, maxX: 12, maxY: 7 }, targetAreaM2: 12, areaM2: 12, status: "EXPLICIT_GEOMETRY" },
    { id: "COURTYARD-N1", name: "Patio interior propuesto", levelId: "N1", programId: "COURTYARD_VOID", zone: "PUBLIC", footprint: { minX: 5.8, minY: 5, maxX: 8, maxY: 9 }, targetAreaM2: 8.8, areaM2: 8.8, status: "EXPLICIT_GEOMETRY" },
    { id: "BED-1-N2", name: "Dormitorio principal", levelId: "N2", programId: "BEDROOM_WITH_CLOSET", zone: "PRIVATE", footprint: { minX: 0, minY: 0, maxX: 4, maxY: 4 }, targetAreaM2: 16, areaM2: 16, status: "EXPLICIT_GEOMETRY" },
    { id: "CLOSET-1-N2", name: "Closet principal", levelId: "N2", programId: "CLOSET", zone: "PRIVATE", footprint: { minX: 0, minY: 4, maxX: 2, maxY: 5.5 }, targetAreaM2: 3, areaM2: 3, status: "EXPLICIT_GEOMETRY" },
    { id: "MASTER-BATH-N2", name: "Baño principal", levelId: "N2", programId: "MASTER_BATHROOM", zone: "SERVICE", footprint: { minX: 2, minY: 4, maxX: 4, maxY: 5.5 }, targetAreaM2: 3, areaM2: 3, status: "EXPLICIT_GEOMETRY" },
    { id: "TERRACE-N2", name: "Terraza", levelId: "N2", programId: "TERRACE", zone: "PUBLIC", footprint: { minX: 4, minY: 0, maxX: 8, maxY: 4 }, targetAreaM2: 16, areaM2: 16, status: "EXPLICIT_GEOMETRY" },
    { id: "BED-2-N2", name: "Dormitorio 2", levelId: "N2", programId: "BEDROOM_WITH_CLOSET", zone: "PRIVATE", footprint: { minX: 8, minY: 0, maxX: 12, maxY: 4 }, targetAreaM2: 16, areaM2: 16, status: "EXPLICIT_GEOMETRY" },
    { id: "CLOSET-2-N2", name: "Closet 2", levelId: "N2", programId: "CLOSET", zone: "PRIVATE", footprint: { minX: 8, minY: 4, maxX: 10, maxY: 5.5 }, targetAreaM2: 3, areaM2: 3, status: "EXPLICIT_GEOMETRY" },
    { id: "BED-3-N2", name: "Dormitorio 3", levelId: "N2", programId: "BEDROOM_WITH_CLOSET", zone: "PRIVATE", footprint: { minX: 8, minY: 6, maxX: 12, maxY: 10 }, targetAreaM2: 16, areaM2: 16, status: "EXPLICIT_GEOMETRY" },
    { id: "CLOSET-3-N2", name: "Closet 3", levelId: "N2", programId: "CLOSET", zone: "PRIVATE", footprint: { minX: 8, minY: 10, maxX: 10, maxY: 11.5 }, targetAreaM2: 3, areaM2: 3, status: "EXPLICIT_GEOMETRY" },
    { id: "BATH-3-N2", name: "Baño compartido", levelId: "N2", programId: "BATHROOM", zone: "SERVICE", footprint: { minX: 6, minY: 6, maxX: 8, maxY: 8 }, targetAreaM2: 4, areaM2: 4, status: "EXPLICIT_GEOMETRY" },
    { id: "UNRESOLVED-ACCESS-N1", name: "UNKNOWN — acceso a la casa", levelId: "N1", programId: "UNKNOWN_ACCESS", zone: "CIRCULATION", footprint: { minX: 4, minY: 9, maxX: 8, maxY: 12 }, targetAreaM2: 12, areaM2: 12, status: "EXPLICIT_GEOMETRY" },
    { id: "UNRESOLVED-ACCESS-N2", name: "UNKNOWN — acceso al segundo piso", levelId: "N2", programId: "UNKNOWN_ACCESS", zone: "CIRCULATION", footprint: { minX: 4, minY: 4, maxX: 8, maxY: 6 }, targetAreaM2: 8, areaM2: 8, status: "EXPLICIT_GEOMETRY" },
  ];
  return { challenge, alternativeId: "HOUSE-SINGLE-FACADE-A-COURTYARD-UNKNOWN-ACCESS", buildingEnvelopeM2: 144, approximateCoveredAreaM2: 200, rooms, derivedCirculation: [], unknowns: ["HOUSE_ENTRY_NOT_DEFINED", "SECOND_FLOOR_ACCESS_NOT_DEFINED", "NO_STAIR_AUTHORIZED", "NO_CONFIRMED_STREET_ACCESS", "UNPROGRAMMED_BLANK_AREAS_EXPLICITLY_LABELED"], openingsAssumption: "NOT_RESOLVED — DO NOT INFER EXTERNAL_ACCESS", neighbors: challenge.site.neighbors, freeFacade: challenge.site.freeFacade, status: "HYPOTHESIS" as const, humanReviewRequired: true, constructionDocumentation: "NOT_GENERATED" as const };
}
