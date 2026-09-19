import type { ResidentialRoom } from "./residentialConstructivePlan";

export type FixtureKind = "FURNITURE" | "SANITARY_FIXTURE" | "EQUIPMENT";
export type FixtureSource = "NEUFERT" | "PLAZOLA" | "DESIGN_SYNTHESIS";
export type ResidentialFixtureMinimum = { id: string; label: string; kind: FixtureKind; widthM: number; depthM: number; useClearanceM: number; maintenanceClearanceM?: number; source: FixtureSource; epistemicStatus: "SOURCE_DERIVED_HYPOTHESIS" };
export type ResidentialFixtureRequirement = ResidentialFixtureMinimum & { roomProgramIds: string[] };
export type RoomFixtureFit = { roomId: string; roomName: string; programId: string; requiredWidthM: number; requiredDepthM: number; requiredAreaM2: number; availableWidthM: number; availableDepthM: number; availableAreaM2: number; fits: boolean; fixtureIds: string[]; status: "SUPPORTED" | "INSUFFICIENT" | "NO_FIXTURE_PROFILE" };

export const ARKI_RESIDENTIAL_FIXTURE_MINIMUMS: ResidentialFixtureRequirement[] = [
  { id: "BED-DOUBLE", label: "Cama doble", kind: "FURNITURE", widthM: 1.6, depthM: 2, useClearanceM: 0.75, source: "NEUFERT", epistemicStatus: "SOURCE_DERIVED_HYPOTHESIS", roomProgramIds: ["BEDROOM_WITH_CLOSET", "BEDROOM"] },
  { id: "BED-SINGLE", label: "Cama individual", kind: "FURNITURE", widthM: 0.9, depthM: 2, useClearanceM: 0.75, source: "NEUFERT", epistemicStatus: "SOURCE_DERIVED_HYPOTHESIS", roomProgramIds: ["BEDROOM_WITH_CLOSET", "BEDROOM"] },
  { id: "WARDROBE", label: "Closet", kind: "FURNITURE", widthM: 1.8, depthM: 0.6, useClearanceM: 0.75, source: "NEUFERT", epistemicStatus: "SOURCE_DERIVED_HYPOTHESIS", roomProgramIds: ["BEDROOM_WITH_CLOSET", "CLOSET"] },
  { id: "SOFA-3", label: "Sofá de tres plazas", kind: "FURNITURE", widthM: 2.1, depthM: 0.9, useClearanceM: 0.75, source: "NEUFERT", epistemicStatus: "SOURCE_DERIVED_HYPOTHESIS", roomProgramIds: ["LIVING"] },
  { id: "DINING-TABLE-6", label: "Mesa de comedor para seis", kind: "FURNITURE", widthM: 1, depthM: 1.8, useClearanceM: 0.9, source: "NEUFERT", epistemicStatus: "SOURCE_DERIVED_HYPOTHESIS", roomProgramIds: ["DINING", "LIVING"] },
  { id: "KITCHEN-COUNTER", label: "Frente de trabajo de cocina", kind: "EQUIPMENT", widthM: 2.4, depthM: 0.6, useClearanceM: 1.2, source: "PLAZOLA", epistemicStatus: "SOURCE_DERIVED_HYPOTHESIS", roomProgramIds: ["KITCHEN"] },
  { id: "TOILET", label: "Inodoro", kind: "SANITARY_FIXTURE", widthM: 0.7, depthM: 1.2, useClearanceM: 0.6, source: "NEUFERT", epistemicStatus: "SOURCE_DERIVED_HYPOTHESIS", roomProgramIds: ["BATHROOM", "MASTER_BATHROOM"] },
  { id: "LAVATORY", label: "Lavatorio", kind: "SANITARY_FIXTURE", widthM: 0.6, depthM: 0.5, useClearanceM: 0.75, source: "NEUFERT", epistemicStatus: "SOURCE_DERIVED_HYPOTHESIS", roomProgramIds: ["BATHROOM", "MASTER_BATHROOM"] },
  { id: "SHOWER", label: "Ducha", kind: "SANITARY_FIXTURE", widthM: 0.9, depthM: 0.9, useClearanceM: 0.75, source: "NEUFERT", epistemicStatus: "SOURCE_DERIVED_HYPOTHESIS", roomProgramIds: ["BATHROOM", "MASTER_BATHROOM"] },
  { id: "GARAGE-CAR", label: "Vehículo de referencia", kind: "EQUIPMENT", widthM: 2.5, depthM: 5, useClearanceM: 0.6, source: "PLAZOLA", epistemicStatus: "SOURCE_DERIVED_HYPOTHESIS", roomProgramIds: ["GARAGE"] },
];

export function evaluateResidentialFixtureFit(rooms: ResidentialRoom[], requirements = ARKI_RESIDENTIAL_FIXTURE_MINIMUMS): RoomFixtureFit[] {
  return rooms.map((room) => {
    const fixtures = requirements.filter((fixture) => fixture.roomProgramIds.includes(room.programId));
    const availableWidthM = room.footprint.maxX - room.footprint.minX;
    const availableDepthM = room.footprint.maxY - room.footprint.minY;
    if (!fixtures.length) return { roomId: room.id, roomName: room.name, programId: room.programId, requiredWidthM: 0, requiredDepthM: 0, requiredAreaM2: 0, availableWidthM, availableDepthM, availableAreaM2: room.areaM2, fits: true, fixtureIds: [], status: "NO_FIXTURE_PROFILE" };
    const requiredWidthM = Math.max(...fixtures.map((fixture) => fixture.widthM + fixture.useClearanceM));
    const requiredDepthM = Math.max(...fixtures.map((fixture) => fixture.depthM + (fixture.maintenanceClearanceM ?? fixture.useClearanceM)));
    const requiredAreaM2 = requiredWidthM * requiredDepthM;
    const fits = (availableWidthM >= requiredWidthM && availableDepthM >= requiredDepthM) || (availableDepthM >= requiredWidthM && availableWidthM >= requiredDepthM);
    return { roomId: room.id, roomName: room.name, programId: room.programId, requiredWidthM, requiredDepthM, requiredAreaM2, availableWidthM, availableDepthM, availableAreaM2: room.areaM2, fits, fixtureIds: fixtures.map((fixture) => fixture.id), status: fits ? "SUPPORTED" : "INSUFFICIENT" };
  });
}

export function fixtureMinimumFor(programId: string) { return ARKI_RESIDENTIAL_FIXTURE_MINIMUMS.filter((fixture) => fixture.roomProgramIds.includes(programId)); }
export function summarizeFixtureFit(fit: RoomFixtureFit[]) { return { totalRooms: fit.length, supported: fit.filter((item) => item.status === "SUPPORTED").length, insufficient: fit.filter((item) => item.status === "INSUFFICIENT").length, noProfile: fit.filter((item) => item.status === "NO_FIXTURE_PROFILE").length, allSupported: fit.every((item) => item.fits) }; }
export const ARKI_FIXTURE_KNOWLEDGE_LIMITS = { status: "SOURCE_DERIVED_HYPOTHESIS" as const, dimensionsAreMinimumReferences: true, dimensionsAreNotUniversalCode: true, humanReviewRequired: true, furnitureDoesNotAutomaticallyCreateConstructionDocumentation: true };
export function buildResidentialFixtureLesson() { return { principle: "ROOM_DIMENSION_FOLLOWS_USE_FIT", statement: "El ambiente debe alojar sus muebles o aparatos, permitir uso, circulación y mantenimiento; el muro se dimensiona después de resolver esa envolvente funcional.", epistemicStatus: "HYPOTHESIS" as const, humanReviewRequired: true }; }
export function validateFixtureKnowledge() { return ARKI_RESIDENTIAL_FIXTURE_MINIMUMS.length >= 10 && ARKI_RESIDENTIAL_FIXTURE_MINIMUMS.every((fixture) => fixture.widthM > 0 && fixture.depthM > 0 && fixture.useClearanceM > 0 && fixture.epistemicStatus === "SOURCE_DERIVED_HYPOTHESIS"); }
