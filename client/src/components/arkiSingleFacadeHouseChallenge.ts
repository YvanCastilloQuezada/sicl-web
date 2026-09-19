import { generateResolvedCustomHouseDesign } from "./arkiCustomHouseDesign";

export type SingleFacadeHouseChallenge = {
  projectId: "HOUSE-300M2-SINGLE-FACADE";
  site: { areaM2: 300; dimensionsM: [number, number]; freeFacade: "SOUTH"; neighbors: ["NORTH", "EAST", "WEST"] };
  requestedProgram: Array<{ id: string; quantity: number; levelPreference: "N1" | "N2" | "FLEXIBLE" }>;
  explicitCirculationRequirements: [];
  explicitVerticalRequirements: [];
  epistemicStatus: "HYPOTHESIS";
};

export function buildSingleFacadeHouseChallenge(): SingleFacadeHouseChallenge {
  return {
    projectId: "HOUSE-300M2-SINGLE-FACADE",
    site: { areaM2: 300, dimensionsM: [15, 20], freeFacade: "SOUTH", neighbors: ["NORTH", "EAST", "WEST"] },
    requestedProgram: [
      { id: "BEDROOM_WITH_CLOSET", quantity: 3, levelPreference: "N2" },
      { id: "MASTER_BATHROOM", quantity: 1, levelPreference: "N2" },
      { id: "BATHROOM", quantity: 2, levelPreference: "FLEXIBLE" },
      { id: "KITCHEN", quantity: 1, levelPreference: "N1" },
      { id: "LIVING", quantity: 1, levelPreference: "N1" },
      { id: "DINING", quantity: 1, levelPreference: "N1" },
      { id: "GARAGE", quantity: 1, levelPreference: "N1" },
      { id: "TERRACE", quantity: 1, levelPreference: "N2" },
    ],
    explicitCirculationRequirements: [],
    explicitVerticalRequirements: [],
    epistemicStatus: "HYPOTHESIS",
  };
}

export function deriveSingleFacadeHouseProposal() {
  const challenge = buildSingleFacadeHouseChallenge();
  const design = generateResolvedCustomHouseDesign();
  return {
    challenge,
    design,
    derivedElements: {
      circulation: ["HALL-N1", "HALL-N2"],
      verticalConnection: ["STAIR-CORE-CONTINUOUS"],
      reason: "Derived because rooms on N1/N2 require access and the two-level program requires vertical continuity.",
      notUserSpecified: true,
    },
    facadeStrategy: {
      freeFacade: "SOUTH",
      openingsAllowed: "SOUTH_ONLY_IN_CONCEPTUAL_PROPOSAL",
      northEastWest: "NEIGHBORING_PARTY_WALLS / NO_EXTERNAL_OPENINGS_ASSUMED",
      daylightAndVentilation: "REQUIRES_COURTYARD_OR_SKYLIGHT_STUDY",
    },
  };
}
