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
  minimumLightClearDistanceM: 1.8,
  floorToCeilingM: 2.4,
  standardSillHeightM: 0.9,
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
  rooms: ResidentialRoom[];
  walls: ResidentialWall[];
  openings: ResidentialOpening[];
  openConnections: Array<{ id: string; levelId: string; fromRoomId: string; toRoomId: string; kind: "OPEN_CONNECTION" | "LOW_WALL_OPENING"; widthM: number; rationale: string }>;
  cores: Array<{ id: string; levelIds: string[]; footprint: Rect; kind: "STAIR" | "SERVICE_DUCT"; continuity: "CONTINUOUS" }>;
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
    status: "REQUIRES_REPLAN";
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

const wall = (id: string, levelId: "N1" | "N2", from: [number, number], to: [number, number], role: ResidentialWall["role"]): ResidentialWall => ({
  id,
  levelId,
  from,
  to,
  thicknessM: ARKI_RESIDENTIAL_REFERENCE_MINIMUMS.wallThicknessM,
  role,
});

const door = (id: string, levelId: "N1" | "N2", fromRoomId: string, toRoomId: string, widthM = 0.9): ResidentialOpening => ({
  id,
  levelId,
  fromRoomId,
  toRoomId,
  kind: "DOOR",
  widthM,
  status: "VERIFIED_CLEARANCE",
});

const window = (id: string, levelId: "N1" | "N2", fromRoomId: string, widthM = 1.2): ResidentialOpening => ({
  id,
  levelId,
  fromRoomId,
  toRoomId: "EXTERIOR",
  kind: "WINDOW",
  widthM,
  status: "PROPOSED",
  clearDistanceToOpposingObstructionM: ARKI_RESIDENTIAL_REFERENCE_MINIMUMS.minimumLightClearDistanceM,
});

export function buildNeufertPlazolaCorrectedHouseProposal(): CorrectedHouseProposal {
  const envelope = { minX: 0, minY: 0, maxX: 12, maxY: 13.5 };
  const rooms: ResidentialRoom[] = [
    room("ENTRY-N1", "Vestíbulo de ingreso", "N1", "ENTRY", "CIRCULATION", { minX: 4.5, minY: 0, maxX: 7, maxY: 2 }),
    room("LIVING-N1", "Sala", "N1", "LIVING", "PUBLIC", { minX: 0, minY: 0, maxX: 4.5, maxY: 4.5 }),
    room("DINING-N1", "Comedor", "N1", "DINING", "PUBLIC", { minX: 7, minY: 0, maxX: 12, maxY: 3.5 }),
    room("KITCHEN-N1", "Cocina", "N1", "KITCHEN", "SERVICE", { minX: 7, minY: 3.5, maxX: 12, maxY: 6.5 }),
    room("BATH-1-N1", "Baño social", "N1", "BATHROOM", "SERVICE", { minX: 0, minY: 4.5, maxX: 2.5, maxY: 7 }),
    room("COURTYARD-N1", "Patio interior de luz y ventilación", "N1", "COURTYARD_VOID", "EXTERIOR" as ResidentialRoom["zone"], { minX: 4.5, minY: 4.5, maxX: 7, maxY: 7.5 }),
    room("GARAGE-N1", "Garaje", "N1", "GARAGE", "SERVICE", { minX: 0, minY: 7.5, maxX: 4.5, maxY: 12 }),
    room("HALL-N1", "Circulación N1", "N1", "CIRCULATION", "CIRCULATION", { minX: 4.5, minY: 7.5, maxX: 9, maxY: 12 }),
    room("STAIR-N1", "Escalera interior", "N1", "STAIR", "CIRCULATION", { minX: 9, minY: 7.5, maxX: 12, maxY: 12 }),
    room("MASTER-N2", "Dormitorio principal", "N2", "BEDROOM_WITH_CLOSET", "PRIVATE", { minX: 0, minY: 0, maxX: 4.5, maxY: 4 }),
    room("MASTER-CLOSET-N2", "Closet principal", "N2", "CLOSET", "PRIVATE", { minX: 0, minY: 4, maxX: 2, maxY: 5.3 }),
    room("MASTER-BATH-N2", "Baño principal", "N2", "MASTER_BATHROOM", "SERVICE", { minX: 2, minY: 4, maxX: 4.5, maxY: 5.3 }),
    room("TERRACE-N2", "Terraza", "N2", "TERRACE", "EXTERIOR" as ResidentialRoom["zone"], { minX: 4.5, minY: 0, maxX: 7, maxY: 4 }),
    room("BED-2-N2", "Dormitorio 2", "N2", "BEDROOM_WITH_CLOSET", "PRIVATE", { minX: 7, minY: 0, maxX: 12, maxY: 4 }),
    room("BED-2-CLOSET-N2", "Closet 2", "N2", "CLOSET", "PRIVATE", { minX: 7, minY: 4, maxX: 9, maxY: 5.3 }),
    room("HALL-N2", "Circulación N2", "N2", "CIRCULATION", "CIRCULATION", { minX: 4.5, minY: 7.5, maxX: 9, maxY: 9 }),
    room("BED-3-N2", "Dormitorio 3", "N2", "BEDROOM_WITH_CLOSET", "PRIVATE", { minX: 0, minY: 9, maxX: 4.5, maxY: 12 }),
    room("BED-3-CLOSET-N2", "Closet 3", "N2", "CLOSET", "PRIVATE", { minX: 0, minY: 12, maxX: 2, maxY: 13.3 }),
    room("BATH-3-N2", "Baño compartido", "N2", "BATHROOM", "SERVICE", { minX: 7, minY: 9, maxX: 9.5, maxY: 11.5 }),
    room("STAIR-N2", "Escalera interior", "N2", "STAIR", "CIRCULATION", { minX: 9, minY: 7.5, maxX: 12, maxY: 12 }),
    room("COURTYARD-N2", "Vacío sobre patio interior", "N2", "COURTYARD_VOID", "EXTERIOR" as ResidentialRoom["zone"], { minX: 4.5, minY: 4.5, maxX: 7, maxY: 7.5 }),
  ];

  const walls: ResidentialWall[] = [
    wall("EXT-N1-S", "N1", [0, 0], [12, 0], "EXTERNAL"), wall("EXT-N1-E", "N1", [12, 0], [12, 13.5], "EXTERNAL"), wall("EXT-N1-N", "N1", [12, 13.5], [0, 13.5], "EXTERNAL"), wall("EXT-N1-W", "N1", [0, 13.5], [0, 0], "EXTERNAL"),
    wall("EXT-N2-S", "N2", [0, 0], [12, 0], "EXTERNAL"), wall("EXT-N2-E", "N2", [12, 0], [12, 13.5], "EXTERNAL"), wall("EXT-N2-N", "N2", [12, 13.5], [0, 13.5], "EXTERNAL"), wall("EXT-N2-W", "N2", [0, 13.5], [0, 0], "EXTERNAL"),
    wall("PART-N1-LIVING", "N1", [4.5, 0], [4.5, 4.5], "PARTITION"), wall("PART-N1-ENTRY", "N1", [4.5, 2], [7, 2], "PARTITION"), wall("PART-N1-DINING", "N1", [7, 0], [7, 6.5], "PARTITION"), wall("PART-N1-WET", "N1", [0, 4.5], [4.5, 4.5], "PARTITION"), wall("PART-N1-COURT", "N1", [4.5, 4.5], [7, 4.5], "PARTITION"), wall("PART-N1-LOWER", "N1", [0, 7.5], [12, 7.5], "PARTITION"), wall("PART-N1-HALL", "N1", [9, 7.5], [9, 12], "PARTITION"),
    wall("PART-N2-MASTER", "N2", [4.5, 0], [4.5, 5.3], "PARTITION"), wall("PART-N2-TERRACE", "N2", [7, 0], [7, 5.3], "PARTITION"), wall("PART-N2-UPPER", "N2", [0, 7.5], [12, 7.5], "PARTITION"), wall("PART-N2-HALL", "N2", [9, 7.5], [9, 12], "PARTITION"), wall("PART-N2-BED3", "N2", [4.5, 9], [4.5, 13.5], "PARTITION"),
  ];

  const openings: ResidentialOpening[] = [
    door("DOOR-STREET-ENTRY", "N1", "ENTRY-N1", "EXTERIOR", ARKI_RESIDENTIAL_REFERENCE_MINIMUMS.mainDoorWidthM), door("DOOR-ENTRY-LIVING", "N1", "ENTRY-N1", "LIVING-N1"), door("DOOR-ENTRY-DINING", "N1", "ENTRY-N1", "DINING-N1"), door("DOOR-LIVING-HALL", "N1", "LIVING-N1", "HALL-N1"), door("DOOR-HALL-STAIR", "N1", "HALL-N1", "STAIR-N1"), door("DOOR-HALL-BATH1", "N1", "HALL-N1", "BATH-1-N1"), door("DOOR-GARAGE", "N1", "GARAGE-N1", "EXTERIOR", 1),
    door("DOOR-STAIR-HALL", "N2", "STAIR-N2", "HALL-N2"), door("DOOR-HALL-MASTER", "N2", "HALL-N2", "MASTER-N2"), door("DOOR-HALL-BED2", "N2", "HALL-N2", "BED-2-N2"), door("DOOR-HALL-BED3", "N2", "HALL-N2", "BED-3-N2"), door("DOOR-HALL-BATH3", "N2", "HALL-N2", "BATH-3-N2"), door("DOOR-MASTER-CLOSET", "N2", "MASTER-N2", "MASTER-CLOSET-N2"), door("DOOR-MASTER-BATH", "N2", "MASTER-N2", "MASTER-BATH-N2"),
    window("WINDOW-LIVING-SOUTH", "N1", "LIVING-N1", 1.8), window("WINDOW-ENTRY-SOUTH", "N1", "ENTRY-N1", 1.2), window("WINDOW-DINING-SOUTH", "N1", "DINING-N1", 1.6), window("WINDOW-KITCHEN-COURT", "N1", "KITCHEN-N1", 1.2), window("WINDOW-COURT-LIVING", "N1", "LIVING-N1", 1.2), window("WINDOW-MASTER-COURT", "N2", "MASTER-N2", 1.5), window("WINDOW-BED2-SOUTH", "N2", "BED-2-N2", 1.5), window("WINDOW-BED3-COURT", "N2", "BED-3-N2", 1.2), window("WINDOW-BATH-HIGH", "N2", "BATH-3-N2", 0.8),
  ];

  const routes: ResidentialRoute[] = [
    { id: "ROUTE-ARRIVAL-SOCIAL", levelIds: ["N1"], roomIds: ["ENTRY-N1", "LIVING-N1", "DINING-N1"], widthM: 0.9, accessible: "PROPOSED", egress: "PROPOSED" },
    { id: "ROUTE-SOCIAL-KITCHEN", levelIds: ["N1"], roomIds: ["LIVING-N1", "ENTRY-N1", "DINING-N1", "KITCHEN-N1"], widthM: 0.9, accessible: "PROPOSED", egress: "PROPOSED" },
    { id: "ROUTE-PRIVATE-N2", levelIds: ["N2"], roomIds: ["STAIR-N2", "HALL-N2", "MASTER-N2", "BED-2-N2", "BED-3-N2", "BATH-3-N2"], widthM: 0.9, accessible: "PROPOSED", egress: "PROPOSED" },
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

  return {
    projectId: "HOUSE-300M2-SINGLE-FACADE",
    alternativeId: "HOUSE-A-NEUFERT-PLAZOLA-FUNCTIONAL-ZONING",
    site: { areaM2: 300, dimensionsM: [15, 20], freeFacade: "SOUTH", neighbors: ["NORTH", "EAST", "WEST"] },
    envelope,
    rooms,
    walls,
    openings,
    openConnections: [{ id: "OPEN-KITCHEN-DINING", levelId: "N1", fromRoomId: "KITCHEN-N1", toRoomId: "DINING-N1", kind: "OPEN_CONNECTION", widthM: 1.8, rationale: "Food preparation and serving remain visually and functionally connected without a hinged door." }],
    cores: [
      { id: "STAIR-CORE-CONTINUOUS", levelIds: ["N1", "N2"], footprint: { minX: 9, minY: 7.5, maxX: 12, maxY: 12 }, kind: "STAIR", continuity: "CONTINUOUS" },
      { id: "SERVICE-DUCT-CONTINUOUS", levelIds: ["N1", "N2"], footprint: { minX: 7, minY: 5.3, maxX: 7.6, maxY: 6.5 }, kind: "SERVICE_DUCT", continuity: "CONTINUOUS" },
    ],
    routes,
    functionalOrganigram,
    zoning: {
      public: ["LIVING-N1", "DINING-N1"],
      private: ["MASTER-N2", "BED-2-N2", "BED-3-N2", "MASTER-CLOSET-N2", "BED-2-CLOSET-N2", "BED-3-CLOSET-N2"],
      service: ["KITCHEN-N1", "BATH-1-N1", "MASTER-BATH-N2", "BATH-3-N2", "GARAGE-N1"],
      circulation: ["ENTRY-N1", "HALL-N1", "STAIR-N1", "HALL-N2", "STAIR-N2"],
      exterior: ["COURTYARD-N1", "COURTYARD-N2", "TERRACE-N2"],
    },
    validation: {
      status: "REQUIRES_REPLAN",
      checks: [
        "functional organigram present",
        "public/private/service zoning declared",
        "arrival reaches social area without crossing bedrooms",
        "kitchen–dining functional sequence declared",
        "bathrooms buffered from direct social visual exposure",
        "continuous stair core represented",
        "0.90 m circulation reference applied",
        "1.80 m room clear-width reference applied",
        "1.20 m bathroom clear-width reference applied",
        "2.40 m floor-to-ceiling reference recorded",
        "0.90 m standard sill reference recorded",
        "0.15 m wall thickness reference applied",
        "0.90 m interior door width reference applied",
        "1.20 m principal street-entry width reference applied",
        "1.80 m minimum clear distance for daylight openings recorded",
        "three-neighbor / one-free-facade condition preserved",
        "interior courtyard represented as void",
        "doors and windows explicitly enumerated",
      ],
      observations: [
        "Functional void audit found 91.5 m² of unassigned envelope cells across N1 and N2; these are residual until assigned to a program, circulation, service or intentional exterior void.",
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
  return { roomWidthPass, bathWidthPass, routesPass, doorPass, mainDoorPass, wallsPass, daylightPass, allReferenceChecksPass: roomWidthPass && bathWidthPass && routesPass && doorPass && mainDoorPass && wallsPass && daylightPass };
}
