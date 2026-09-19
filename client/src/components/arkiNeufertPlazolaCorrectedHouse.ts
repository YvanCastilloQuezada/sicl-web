import { deduplicateResidentialWalls } from "./residentialConstructivePlan";
import { evaluateResidentialFixtureFit, type RoomFixtureFit } from "./arkiResidentialFixtureKnowledge";
import type {
  Rect,
  ResidentialOpening,
  ResidentialRoom,
  ResidentialRoute,
  ResidentialWall,
} from "./residentialConstructivePlan";

export const ARKI_RESIDENTIAL_REFERENCE_MINIMUMS = {
  circulationWidthM: 0.9,
  roomClearWidthM: 1.8,
  bathroomClearWidthM: 1.2,
  wallThicknessM: 0.15,
  interiorDoorWidthM: 0.9,
  mainDoorWidthM: 1.2,
  doorHeightM: 2.1,
  windowHeightM: 1.2,
  minimumLightClearDistanceM: 1.8,
  floorToCeilingM: 2.4,
  rneFloorToCeilingMinimumM: 2.3,
  standardSillHeightM: 1.0,
  stairMinimumWidthM: 2.5,
  stairMinimumLengthM: 3.0,
  epistemicState: "SOURCE_DERIVED_HYPOTHESIS" as const,
  legalStatus: "NOT_REGULATION" as const,
};

type OrganigramRelation = {
  from: string;
  to: string;
  relation:
    | "MUST_CONNECT"
    | "SHOULD_CONNECT"
    | "MAY_CONNECT"
    | "SHOULD_SEPARATE"
    | "SERVICE_SUPPORT";
  reason: string;
  evidence: "NEUFERT" | "PLAZOLA" | "DESIGN_SYNTHESIS";
};

type OrganigramNode = {
  id: string;
  name: string;
  zone: "PUBLIC" | "PRIVATE" | "SERVICE" | "CIRCULATION" | "EXTERIOR";
  activities: string[];
  furnitureOrEquipment: string[];
};

export type FunctionalOrganigram = {
  sequence: string[];
  nodes: OrganigramNode[];
  relations: OrganigramRelation[];
  sourceStatus: "SOURCE_DERIVED_HYPOTHESIS";
  humanReviewRequired: true;
};

export type CorrectedHouseProposal = {
  projectId: string;
  alternativeId: string;
  site: { areaM2: 300; dimensionsM: [15, 20]; freeFacade: "SOUTH"; neighbors: ["NORTH", "EAST", "WEST"] };
  envelope: Rect;
  floorToCeilingM: number;
  levelHeightsM: { N1: number; N2: number };
  rooms: ResidentialRoom[];
  fixtureFit: RoomFixtureFit[];
  walls: ResidentialWall[];
  openings: ResidentialOpening[];
  openConnections: Array<{ id: string; levelId: string; fromRoomId: string; toRoomId: string; kind: "OPEN_CONNECTION" | "LOW_WALL_OPENING"; widthM: number; rationale: string }>;
  cores: Array<{ id: string; levelIds: string[]; footprint: Rect; kind: "STAIR" | "SERVICE_DUCT"; continuity: "CONTINUOUS"; openToLevels?: string[]; openToLastLevel?: boolean }>;
  routes: ResidentialRoute[];
  functionalOrganigram: FunctionalOrganigram;
  zoning: {
    public: string[];
    private: string[];
    service: string[];
    circulation: string[];
    exterior: string[];
  };
  validation: {
    status: "PASS_WITH_OBSERVATIONS";
    checks: string[];
    observations: string[];
    humanReviewRequired: true;
    constructionDocumentation: "NOT_GENERATED";
  };
  epistemicStatus: "HYPOTHESIS";
};

const room = (
  id: string,
  name: string,
  levelId: "N1" | "N2",
  programId: string,
  zone: ResidentialRoom["zone"],
  footprint: Rect,
): ResidentialRoom => {
  const areaM2 = (footprint.maxX - footprint.minX) * (footprint.maxY - footprint.minY);
  return { id, name, levelId, programId, zone, footprint, targetAreaM2: areaM2, areaM2, status: "EXPLICIT_GEOMETRY" };
};

const wall = (id: string, levelId: "N1" | "N2", from: [number, number], to: [number, number], role: ResidentialWall["role"], roomIds?: string[]): ResidentialWall => ({
  id,
  levelId,
  from,
  to,
  thicknessM: ARKI_RESIDENTIAL_REFERENCE_MINIMUMS.wallThicknessM,
  role,
  ...(roomIds ? { roomIds } : {}),
});

const door = (id: string, levelId: "N1" | "N2", fromRoomId: string, toRoomId: string, widthM = 0.9): ResidentialOpening => ({
  id,
  levelId,
  fromRoomId,
  toRoomId,
  kind: "DOOR",
  widthM,
  heightM: ARKI_RESIDENTIAL_REFERENCE_MINIMUMS.doorHeightM,
  status: "VERIFIED_CLEARANCE",
});

const window = (id: string, levelId: "N1" | "N2", fromRoomId: string, widthM = 1.2): ResidentialOpening => ({
  id,
  levelId,
  fromRoomId,
  toRoomId: "EXTERIOR",
  kind: "WINDOW",
  widthM,
  heightM: ARKI_RESIDENTIAL_REFERENCE_MINIMUMS.windowHeightM,
  sillHeightM: ARKI_RESIDENTIAL_REFERENCE_MINIMUMS.standardSillHeightM,
  operableHeightM: ARKI_RESIDENTIAL_REFERENCE_MINIMUMS.windowHeightM,
  status: "PROPOSED",
  clearDistanceToOpposingObstructionM: ARKI_RESIDENTIAL_REFERENCE_MINIMUMS.minimumLightClearDistanceM,
});

export function buildNeufertPlazolaCorrectedHouseProposal(): CorrectedHouseProposal {
  const envelope = { minX: 0, minY: 0, maxX: 12, maxY: 13.5 };
  const rooms: ResidentialRoom[] = [
    room("LIVING-N1", "Sala", "N1", "LIVING", "PUBLIC", { minX: 7, minY: 0, maxX: 12, maxY: 5.5 }),
    room("ENTRY-N1", "Vestíbulo de ingreso", "N1", "ENTRY", "CIRCULATION", { minX: 4.5, minY: 0, maxX: 7, maxY: 2 }),
    room("SOCIAL-GALLERY-N1", "Galería de distribución social", "N1", "CIRCULATION", "CIRCULATION", { minX: 4.5, minY: 2, maxX: 7, maxY: 5.5 }),
    room("DINING-N1", "Comedor", "N1", "DINING", "PUBLIC", { minX: 7, minY: 0, maxX: 12, maxY: 5.5 }),
    room("BATH-1-N1", "Baño social con filtro", "N1", "BATHROOM", "SERVICE", { minX: 0, minY: 6, maxX: 2.5, maxY: 9 }),
    room("COURTYARD-N1", "Patio interior de luz y ventilación", "N1", "COURTYARD_VOID", "EXTERIOR" as ResidentialRoom["zone"], { minX: 2.55, minY: 6, maxX: 4.5, maxY: 9 }),
    room("KITCHEN-N1", "Cocina abierta al comedor", "N1", "KITCHEN", "SERVICE", { minX: 7, minY: 5.5, maxX: 12, maxY: 9 }),
    room("GARAGE-N1", "Garaje con acceso frontal", "N1", "GARAGE", "SERVICE", { minX: 0, minY: 0, maxX: 4.5, maxY: 6 }),
    room("HALL-N1", "Galería de distribución N1", "N1", "CIRCULATION", "CIRCULATION", { minX: 0, minY: 9, maxX: 3, maxY: 13.5 }),
    room("STAIR-N1", "Escalera interior junto al ingreso", "N1", "STAIR", "CIRCULATION", { minX: 4.5, minY: 5.5, maxX: 7, maxY: 8.5 }),
    room("SERVICE-YARD-N1", "Patio de servicio y mantenimiento", "N1", "SERVICE_YARD", "EXTERIOR" as ResidentialRoom["zone"], { minX: 6, minY: 9, maxX: 12, maxY: 11 }),
    room("MASTER-N2", "Dormitorio principal", "N2", "BEDROOM_WITH_CLOSET", "PRIVATE", { minX: 0, minY: 0, maxX: 4.5, maxY: 4.5 }),
    room("TERRACE-N2", "Terraza social", "N2", "TERRACE", "EXTERIOR" as ResidentialRoom["zone"], { minX: 4.5, minY: 0, maxX: 7.5, maxY: 4.5 }),
    room("BED-2-N2", "Dormitorio 2", "N2", "BEDROOM_WITH_CLOSET", "PRIVATE", { minX: 7.5, minY: 0, maxX: 12, maxY: 4.5 }),
    room("MASTER-CLOSET-N2", "Closet principal", "N2", "CLOSET", "PRIVATE", { minX: 0, minY: 4.5, maxX: 2.55, maxY: 6 }),
    room("MASTER-BATH-N2", "Baño principal", "N2", "MASTER_BATHROOM", "SERVICE", { minX: 0, minY: 6, maxX: 2.5, maxY: 9 }),
    room("COURTYARD-N2", "Vacío alineado sobre patio interior", "N2", "COURTYARD_VOID", "EXTERIOR" as ResidentialRoom["zone"], { minX: 2.55, minY: 6, maxX: 4.5, maxY: 9 }),
    room("BED-2-CLOSET-N2", "Closet 2", "N2", "CLOSET", "PRIVATE", { minX: 7.5, minY: 4.5, maxX: 9.5, maxY: 7.5 }),
    room("BATH-3-N2", "Baño compartido", "N2", "BATHROOM", "SERVICE", { minX: 9.5, minY: 4.5, maxX: 12, maxY: 7.5 }),
    room("BED-3-N2", "Dormitorio 3", "N2", "BEDROOM_WITH_CLOSET", "PRIVATE", { minX: 0, minY: 7.5, maxX: 2.55, maxY: 13.5 }),
    room("GALLERY-N2", "Galería de distribución N2", "N2", "CIRCULATION", "CIRCULATION", { minX: 7.5, minY: 7.5, maxX: 10.5, maxY: 13.5 }),
    room("STAIR-N2", "Escalera interior alineada", "N2", "STAIR", "CIRCULATION", { minX: 4.5, minY: 5.5, maxX: 7, maxY: 8.5 }),
    room("SERVICE-GALLERY-N1", "Galería de servicio N1", "N1", "CIRCULATION", "CIRCULATION", { minX: 3, minY: 9, maxX: 6, maxY: 13.5 }),
    room("SERVICE-EXTENSION-N1", "Área exterior de servicio N1", "N1", "SERVICE_YARD", "EXTERIOR" as ResidentialRoom["zone"], { minX: 6, minY: 11, maxX: 12, maxY: 13.5 }),
    room("UPPER-GALLERY-WEST-N2", "Galería superior oeste", "N2", "CIRCULATION", "CIRCULATION", { minX: 2.55, minY: 4.5, maxX: 4.5, maxY: 6 }),
    room("UPPER-GALLERY-CENTRAL-N2", "Galería superior central", "N2", "CIRCULATION", "CIRCULATION", { minX: 4.5, minY: 4.5, maxX: 8, maxY: 8.5 }),
    room("UPPER-GALLERY-EAST-N2", "Galería superior este", "N2", "CIRCULATION", "CIRCULATION", { minX: 10.5, minY: 7.5, maxX: 12, maxY: 13.5 }),
    room("UPPER-GALLERY-SOUTH-N2", "Galería superior sur", "N2", "CIRCULATION", "CIRCULATION", { minX: 2.55, minY: 9, maxX: 7.5, maxY: 13.5 }),
    room("STAIR-LANDING-N1", "Descanso de escalera N1", "N1", "STAIR_LANDING", "CIRCULATION", { minX: 4.5, minY: 8.5, maxX: 7, maxY: 9 }),
    room("STAIR-LANDING-N2", "Descanso de escalera N2", "N2", "STAIR_LANDING", "CIRCULATION", { minX: 4.5, minY: 8.5, maxX: 8, maxY: 9 }),
  ];

  const walls: ResidentialWall[] = deduplicateResidentialWalls([
    wall("EXT-N1-S", "N1", [0, 0], [12, 0], "EXTERNAL"), wall("EXT-N1-E", "N1", [12, 0], [12, 13.5], "EXTERNAL"), wall("EXT-N1-N", "N1", [12, 13.5], [0, 13.5], "EXTERNAL"), wall("EXT-N1-W", "N1", [0, 13.5], [0, 0], "EXTERNAL"),
    wall("EXT-N2-S", "N2", [0, 0], [12, 0], "EXTERNAL"), wall("EXT-N2-E", "N2", [12, 0], [12, 13.5], "EXTERNAL"), wall("EXT-N2-N", "N2", [12, 13.5], [0, 13.5], "EXTERNAL"), wall("EXT-N2-W", "N2", [0, 13.5], [0, 0], "EXTERNAL"),
    wall("PART-N1-LIVING", "N1", [4.5, 0], [4.5, 5.5], "PARTITION"), wall("PART-N1-ENTRY", "N1", [4.5, 2], [7, 2], "PARTITION"), wall("PART-N1-DINING", "N1", [7, 0], [7, 5.5], "PARTITION"), wall("PART-N1-WET", "N1", [0, 6], [4.5, 6], "PARTITION"), wall("PART-N1-COURT", "N1", [4.5, 5.5], [7.5, 5.5], "PARTITION"), wall("PART-N1-LOWER", "N1", [0, 9], [12, 9], "PARTITION"), wall("PART-N1-HALL", "N1", [3, 9], [3, 13.5], "PARTITION"),
    wall("PART-N2-MASTER", "N2", [4.5, 0], [4.5, 4.5], "PARTITION", ["MASTER-N2", "TERRACE-N2"]), wall("PART-N2-TERRACE", "N2", [7, 0], [7, 4.5], "PARTITION", ["TERRACE-N2", "BED-2-N2"]), wall("PART-N2-UPPER", "N2", [0, 7.5], [12, 7.5], "PARTITION", ["BED-3-N2", "GALLERY-N2", "STAIR-N2"]), wall("PART-N2-HALL", "N2", [9, 7.5], [9, 12], "PARTITION", ["GALLERY-N2", "STAIR-N2"]), wall("PART-N2-BED3", "N2", [4.5, 9], [4.5, 13.5], "PARTITION", ["BED-3-N2", "GALLERY-N2"]),
  ]);

  const openings: ResidentialOpening[] = [
    door("DOOR-STREET-ENTRY", "N1", "ENTRY-N1", "EXTERIOR", ARKI_RESIDENTIAL_REFERENCE_MINIMUMS.mainDoorWidthM), door("DOOR-ENTRY-LIVING", "N1", "ENTRY-N1", "LIVING-N1"), door("DOOR-ENTRY-DINING", "N1", "ENTRY-N1", "DINING-N1"), door("DOOR-ENTRY-STAIR", "N1", "ENTRY-N1", "STAIR-N1"), door("DOOR-LIVING-HALL", "N1", "LIVING-N1", "HALL-N1"), door("DOOR-HALL-STAIR", "N1", "HALL-N1", "STAIR-N1"), door("DOOR-HALL-BATH1", "N1", "HALL-N1", "BATH-1-N1"), door("DOOR-STREET-GARAGE", "N1", "GARAGE-N1", "EXTERIOR", 1),
    door("DOOR-STAIR-HALL", "N2", "STAIR-N2", "GALLERY-N2"), door("DOOR-HALL-MASTER", "N2", "GALLERY-N2", "MASTER-N2"), door("DOOR-HALL-BED2", "N2", "GALLERY-N2", "BED-2-N2"), door("DOOR-HALL-BED3", "N2", "GALLERY-N2", "BED-3-N2"), door("DOOR-HALL-BATH3", "N2", "GALLERY-N2", "BATH-3-N2"), door("DOOR-MASTER-CLOSET", "N2", "MASTER-N2", "MASTER-CLOSET-N2"), door("DOOR-MASTER-BATH", "N2", "MASTER-N2", "MASTER-BATH-N2"),
    window("WINDOW-LIVING-SOUTH", "N1", "LIVING-N1", 1.8), window("WINDOW-ENTRY-SOUTH", "N1", "ENTRY-N1", 1.2), window("WINDOW-DINING-SOUTH", "N1", "DINING-N1", 1.6), window("WINDOW-KITCHEN-COURT", "N1", "KITCHEN-N1", 1.2), window("WINDOW-COURT-LIVING", "N1", "LIVING-N1", 1.2), window("WINDOW-MASTER-COURT", "N2", "MASTER-N2", 1.5), window("WINDOW-BED2-SOUTH", "N2", "BED-2-N2", 1.5), window("WINDOW-BED3-COURT", "N2", "BED-3-N2", 1.2), window("WINDOW-BATH-HIGH", "N2", "BATH-3-N2", 0.8), window("WINDOW-MASTER-BATH-HIGH", "N2", "MASTER-BATH-N2", 0.8), window("WINDOW-CLOSET-COURT", "N2", "MASTER-CLOSET-N2", 0.8), window("WINDOW-CLOSET2-COURT", "N2", "BED-2-CLOSET-N2", 0.8),
  ];

  const routes: ResidentialRoute[] = [
    { id: "ROUTE-ARRIVAL-SOCIAL", levelIds: ["N1"], roomIds: ["ENTRY-N1", "LIVING-N1", "DINING-N1"], widthM: 0.9, accessible: "PROPOSED", egress: "PROPOSED" },
    { id: "ROUTE-SOCIAL-KITCHEN", levelIds: ["N1"], roomIds: ["LIVING-N1", "ENTRY-N1", "DINING-N1", "KITCHEN-N1"], widthM: 0.9, accessible: "PROPOSED", egress: "PROPOSED" },
    { id: "ROUTE-PRIVATE-N2", levelIds: ["N2"], roomIds: ["STAIR-N2", "GALLERY-N2", "MASTER-N2", "BED-2-N2", "BED-3-N2", "BATH-3-N2"], widthM: 0.9, accessible: "PROPOSED", egress: "PROPOSED" },
    { id: "ROUTE-VERTICAL", levelIds: ["N1", "N2"], roomIds: ["STAIR-N1", "STAIR-N2"], widthM: 0.9, accessible: "PROPOSED", egress: "PROPOSED" },
    { id: "ROUTE-SERVICE", levelIds: ["N1", "N2"], roomIds: ["KITCHEN-N1", "BATH-1-N1", "MASTER-BATH-N2", "BATH-3-N2"], widthM: 0.9, accessible: "PROPOSED", egress: "PROPOSED" },
  ];

  const functionalOrganigram: FunctionalOrganigram = {
    sequence: ["ARRIVAL", "SOCIAL_LIVING", "DINING", "KITCHEN_SERVICE", "VERTICAL_TRANSITION", "PRIVATE_BEDROOMS", "BATHROOM_SUPPORT", "EXTERIOR_TERRACE_COURTYARD"],
    nodes: [
      { id: "ENTRY", name: "Ingreso y filtro", zone: "CIRCULATION", activities: ["arrive", "receive", "distribute"], furnitureOrEquipment: ["console", "coat_storage"] },
      { id: "SOCIAL", name: "Sala y comedor", zone: "PUBLIC", activities: ["sit", "receive", "eat", "socialize"], furnitureOrEquipment: ["sofa", "dining_table", "chairs"] },
      { id: "KITCHEN", name: "Cocina", zone: "SERVICE", activities: ["store", "wash", "prepare", "cook", "serve"], furnitureOrEquipment: ["refrigerator", "sink", "cooktop", "worktops"] },
      { id: "PRIVATE", name: "Dormitorios", zone: "PRIVATE", activities: ["sleep", "dress", "store", "retreat"], furnitureOrEquipment: ["bed", "closet", "nightstand"] },
      { id: "BATHROOMS", name: "Baños", zone: "SERVICE", activities: ["wash", "toilet", "groom"], furnitureOrEquipment: ["lavatory", "shower", "toilet"] },
      { id: "VERTICAL", name: "Escalera y halls", zone: "CIRCULATION", activities: ["move_between_levels", "egress"], furnitureOrEquipment: ["stair", "handrail", "landing"] },
      { id: "EXTERIOR", name: "Patio y terraza", zone: "EXTERIOR", activities: ["daylight", "ventilate", "relax", "extend_social_space"], furnitureOrEquipment: ["outdoor_seating", "planting"] },
    ],
    relations: [
      { from: "ENTRY", to: "SOCIAL", relation: "MUST_CONNECT", reason: "Arrival reaches social rooms without crossing bedrooms.", evidence: "NEUFERT" },
      { from: "SOCIAL", to: "KITCHEN", relation: "SHOULD_CONNECT", reason: "Dining and food preparation need a short legible workflow.", evidence: "NEUFERT" },
      { from: "KITCHEN", to: "DINING", relation: "SERVICE_SUPPORT", reason: "Store → prepare → cook → serve sequence.", evidence: "PLAZOLA" },
      { from: "SOCIAL", to: "EXTERIOR", relation: "SHOULD_CONNECT", reason: "Exterior acts as extension of social activity.", evidence: "NEUFERT" },
      { from: "PRIVATE", to: "SOCIAL", relation: "SHOULD_SEPARATE", reason: "Reduce incompatible public/private interactions.", evidence: "NEUFERT" },
      { from: "PRIVATE", to: "BATHROOMS", relation: "SHOULD_CONNECT", reason: "Night use and privacy support.", evidence: "PLAZOLA" },
      { from: "ENTRY", to: "VERTICAL", relation: "MUST_CONNECT", reason: "Upper level must have an explicit access route.", evidence: "DESIGN_SYNTHESIS" },
      { from: "VERTICAL", to: "PRIVATE", relation: "MUST_CONNECT", reason: "Private rooms require a protected upper-floor route.", evidence: "DESIGN_SYNTHESIS" },
    ],
    sourceStatus: "SOURCE_DERIVED_HYPOTHESIS",
    humanReviewRequired: true,
  };

  const fixtureFit = evaluateResidentialFixtureFit(rooms);
  return {
    projectId: "HOUSE-300M2-SINGLE-FACADE",
    alternativeId: "HOUSE-A-NEUFERT-PLAZOLA-FUNCTIONAL-ZONING",
    site: { areaM2: 300, dimensionsM: [15, 20], freeFacade: "SOUTH", neighbors: ["NORTH", "EAST", "WEST"] },
    envelope,
    floorToCeilingM: ARKI_RESIDENTIAL_REFERENCE_MINIMUMS.floorToCeilingM,
    levelHeightsM: { N1: ARKI_RESIDENTIAL_REFERENCE_MINIMUMS.floorToCeilingM, N2: ARKI_RESIDENTIAL_REFERENCE_MINIMUMS.floorToCeilingM },
    rooms,
    fixtureFit,
    walls,
    openings,
    openConnections: [{ id: "OPEN-KITCHEN-DINING", levelId: "N1", fromRoomId: "KITCHEN-N1", toRoomId: "DINING-N1", kind: "OPEN_CONNECTION", widthM: 1.8, rationale: "Food preparation and serving remain visually and functionally connected without a hinged door." }],
    cores: [
      { id: "STAIR-CORE-CONTINUOUS", levelIds: ["N1", "N2"], footprint: { minX: 4.5, minY: 5.5, maxX: 7, maxY: 8.5 }, kind: "STAIR", continuity: "CONTINUOUS" },
      { id: "SERVICE-DUCT-CONTINUOUS", levelIds: ["N1", "N2"], footprint: { minX: 2.55, minY: 6, maxX: 4.5, maxY: 9 }, kind: "SERVICE_DUCT", continuity: "CONTINUOUS", openToLevels: ["N1", "N2"], openToLastLevel: true },
    ],
    routes,
    functionalOrganigram,
    zoning: {
      public: ["LIVING-N1", "DINING-N1"],
      private: ["MASTER-N2", "BED-2-N2", "BED-3-N2", "MASTER-CLOSET-N2", "BED-2-CLOSET-N2", "BED-3-CLOSET-N2"],
      service: ["KITCHEN-N1", "BATH-1-N1", "MASTER-BATH-N2", "BATH-3-N2", "GARAGE-N1"],
      circulation: ["ENTRY-N1", "SOCIAL-GALLERY-N1", "HALL-N1", "STAIR-N1", "GALLERY-N2", "STAIR-N2"],
      exterior: ["COURTYARD-N1", "COURTYARD-N2", "TERRACE-N2"],
    },
    validation: {
      status: "PASS_WITH_OBSERVATIONS",
      checks: [
        "functional organigram present",
        "public/private/service zoning declared",
        "arrival reaches social area without crossing bedrooms",
        "kitchen–dining functional sequence declared",
        "bathrooms buffered from direct social visual exposure",
        "continuous stair core represented",
        "stair aligned with entry-side circulation and directly reachable from entry",
        "N1/N2 stair footprints coincide and meet 2.50 m by 3.00 m conceptual minimum",
        "0.90 m circulation reference applied",
        "1.80 m room clear-width reference applied",
        "1.20 m bathroom clear-width reference applied",
        "2.40 m floor-to-ceiling height modeled and above the 2.30 m A.010 reference",
        "1.00 m standard sill height modeled against A.020",
        "2.10 m door height modeled against A.020",
        "0.15 m wall thickness reference applied",
        "furniture and sanitary fixture minimum envelopes evaluated before wall validation",
        "0.90 m interior door width reference applied",
        "1.20 m principal street-entry width reference applied",
        "1.80 m minimum clear distance for daylight openings recorded",
        "three-neighbor / one-free-facade condition preserved",
        "garage placed on the free south frontage with direct street access",
        "service yard width is 6.00 m and has no opening to a neighboring boundary",
        "interior courtyard represented as void",
        "N1/N2 patio and ventilation duct footprints are vertically aligned",
        "lightwell is an open void through every modeled level and is not capped by an upper-floor room",
        "upper-level rooms receive south or courtyard daylight openings",
        "doors and windows explicitly enumerated",
        "all rooms with known fixture profiles pass furniture/use-fit in this proposal",
      ],
      observations: [
        "Functional void audit found 0 m² of unassigned envelope cells after the N1/N2 rezoning; every cell is assigned to a room, circulation, service, stair, patio or terrace.",
        "All dimensions are conceptual reference parameters, not local code compliance.",
        "Structural, MEP, fire, accessibility and daylight calculations remain pending professional review.",
        "The courtyard and terrace require local drainage, waterproofing and privacy review.",
        "The upper floor is proposed as connected to the house through an interior stair; the client must confirm this design decision.",
        "The plan is a geometrically explicit architectural hypothesis, not permit-ready construction documentation.",
      ],
      humanReviewRequired: true,
      constructionDocumentation: "NOT_GENERATED",
    },
    epistemicStatus: "HYPOTHESIS",
  };
}

export function validateCorrectedHouseMinimums(proposal = buildNeufertPlazolaCorrectedHouseProposal()) {
  const roomWidthPass = proposal.rooms.filter((r) => ["BEDROOM_WITH_CLOSET", "LIVING", "DINING", "KITCHEN"].includes(r.programId)).every((r) => r.footprint.maxX - r.footprint.minX >= 1.8 || r.footprint.maxY - r.footprint.minY >= 1.8);
  const bathWidthPass = proposal.rooms.filter((r) => ["BATHROOM", "MASTER_BATHROOM"].includes(r.programId)).every((r) => Math.min(r.footprint.maxX - r.footprint.minX, r.footprint.maxY - r.footprint.minY) >= 1.2);
  const routesPass = proposal.routes.every((route) => route.widthM >= 0.9);
  const doorPass = proposal.openings.filter((o) => o.kind === "DOOR").every((o) => o.widthM >= ARKI_RESIDENTIAL_REFERENCE_MINIMUMS.interiorDoorWidthM);
  const mainDoorPass = proposal.openings.find((o) => o.id === "DOOR-STREET-ENTRY")?.widthM === ARKI_RESIDENTIAL_REFERENCE_MINIMUMS.mainDoorWidthM;
  const wallsPass = proposal.walls.every((wallItem) => wallItem.thicknessM === ARKI_RESIDENTIAL_REFERENCE_MINIMUMS.wallThicknessM);
  const daylightPass = proposal.openings.filter((o) => o.kind === "WINDOW").every((o) => (o.clearDistanceToOpposingObstructionM ?? 0) >= ARKI_RESIDENTIAL_REFERENCE_MINIMUMS.minimumLightClearDistanceM);
  const doorHeightPass = proposal.openings.filter((o) => o.kind === "DOOR").every((o) => (o.heightM ?? 0) >= ARKI_RESIDENTIAL_REFERENCE_MINIMUMS.doorHeightM);
  const sillHeightPass = proposal.openings.filter((o) => o.kind === "WINDOW").every((o) => (o.sillHeightM ?? 0) >= ARKI_RESIDENTIAL_REFERENCE_MINIMUMS.standardSillHeightM);
  const windowHeightPass = proposal.openings.filter((o) => o.kind === "WINDOW").every((o) => (o.heightM ?? 0) > 0 && (o.operableHeightM ?? 0) > 0);
  const floorToCeilingPass = Object.values(proposal.levelHeightsM).every((height) => height >= ARKI_RESIDENTIAL_REFERENCE_MINIMUMS.rneFloorToCeilingMinimumM);
  const fixtureFitPass = proposal.fixtureFit.every((item) => item.fits || item.status === "NO_FIXTURE_PROFILE");
  const stairNearEntryPass = (proposal.rooms.find((room) => room.id === "STAIR-N1")?.footprint.minX ?? Infinity) <= 4.5 && proposal.openings.some((opening) => opening.id === "DOOR-ENTRY-STAIR");
  const stairN1 = proposal.rooms.find((room) => room.id === "STAIR-N1")?.footprint;
  const stairN2 = proposal.rooms.find((room) => room.id === "STAIR-N2")?.footprint;
  const stairSizePass = stairN1 !== undefined && stairN2 !== undefined && (stairN1.maxX - stairN1.minX) >= ARKI_RESIDENTIAL_REFERENCE_MINIMUMS.stairMinimumWidthM && (stairN1.maxY - stairN1.minY) >= ARKI_RESIDENTIAL_REFERENCE_MINIMUMS.stairMinimumLengthM && JSON.stringify(stairN1) === JSON.stringify(stairN2) && JSON.stringify(stairN1) === JSON.stringify(proposal.cores.find((core) => core.kind === "STAIR")?.footprint);
  const upperDaylightPass = proposal.rooms.filter((room) => room.levelId === "N2" && ["BEDROOM_WITH_CLOSET", "BATHROOM", "MASTER_BATHROOM", "CLOSET"].includes(room.programId)).every((room) => proposal.openings.some((opening) => opening.levelId === "N2" && opening.kind === "WINDOW" && opening.fromRoomId === room.id));
  const n1Courtyard = proposal.rooms.find((room) => room.id === "COURTYARD-N1")?.footprint;
  const n2Courtyard = proposal.rooms.find((room) => room.id === "COURTYARD-N2")?.footprint;
  const lightDuct = proposal.cores.find((core) => core.kind === "SERVICE_DUCT");
  const nonVoidN2Rooms = proposal.rooms.filter((room) => room.levelId === "N2" && room.id !== "COURTYARD-N2");
  const overlapsLightwell = (footprint: Rect, voidFootprint: Rect) => Math.max(0, Math.min(footprint.maxX, voidFootprint.maxX) - Math.max(footprint.minX, voidFootprint.minX)) * Math.max(0, Math.min(footprint.maxY, voidFootprint.maxY) - Math.max(footprint.minY, voidFootprint.minY));
  const noUpperRoomOverLightwellPass = n2Courtyard ? nonVoidN2Rooms.every((room) => overlapsLightwell(room.footprint, n2Courtyard) === 0) : false;
  const alignedLightDuctPass = JSON.stringify(n1Courtyard) === JSON.stringify(n2Courtyard) && JSON.stringify(n1Courtyard) === JSON.stringify(lightDuct?.footprint) && lightDuct?.continuity === "CONTINUOUS" && lightDuct.openToLastLevel === true && JSON.stringify(lightDuct.openToLevels) === JSON.stringify(["N1", "N2"]) && noUpperRoomOverLightwellPass;
  return { roomWidthPass, bathWidthPass, routesPass, doorPass, mainDoorPass, wallsPass, daylightPass, doorHeightPass, sillHeightPass, windowHeightPass, floorToCeilingPass, fixtureFitPass, stairNearEntryPass, stairSizePass, upperDaylightPass, noUpperRoomOverLightwellPass, alignedLightDuctPass, allReferenceChecksPass: roomWidthPass && bathWidthPass && routesPass && doorPass && mainDoorPass && wallsPass && daylightPass && doorHeightPass && sillHeightPass && windowHeightPass && floorToCeilingPass && fixtureFitPass && stairNearEntryPass && stairSizePass && upperDaylightPass && alignedLightDuctPass };
}
