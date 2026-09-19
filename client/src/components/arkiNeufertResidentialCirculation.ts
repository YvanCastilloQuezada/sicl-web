export type NeufertCirculationType = "ARRIVAL_PUBLIC" | "SOCIAL" | "PRIVATE" | "SERVICE" | "VERTICAL" | "BATHROOM_TRANSITION";
export type ResidentialRoomType = "ENTRY" | "LIVING" | "DINING" | "KITCHEN" | "BEDROOM" | "BATHROOM" | "GARAGE" | "PATIO" | "PRIVATE_CIRCULATION" | "SERVICE_CIRCULATION";

export type ResidentialLayoutCase = {
  id: string;
  rooms: ResidentialRoomType[];
  circulation: Array<{ from: ResidentialRoomType; to: ResidentialRoomType; type: NeufertCirculationType }>;
  adjacency: Array<{ a: ResidentialRoomType; b: ResidentialRoomType; relation: "DIRECT" | "BUFFERED" | "SEPARATED"; visualExposure?: boolean }>;
};

export const NEUFERT_CIRCULATION_PRINCIPLES = [
  { id: "NC-01", principle: "Arrival/public circulation should reach social rooms without crossing private bedrooms.", status: "SOURCE_DERIVED_HYPOTHESIS" as const },
  { id: "NC-02", principle: "Social circulation links living, dining and exterior space as a legible sequence.", status: "SOURCE_DERIVED_HYPOTHESIS" as const },
  { id: "NC-03", principle: "Private circulation should protect bedrooms from public arrival and service traffic.", status: "SOURCE_DERIVED_HYPOTHESIS" as const },
  { id: "NC-04", principle: "Service circulation should support kitchen and bathrooms without requiring passage through bedrooms.", status: "SOURCE_DERIVED_HYPOTHESIS" as const },
  { id: "NC-05", principle: "A bathroom should not be directly visually exposed to living, dining or kitchen areas.", status: "SOURCE_DERIVED_HYPOTHESIS" as const },
  { id: "NC-06", principle: "Direct adjacency is not the same as direct visual exposure; privacy may require a buffer or transition.", status: "SOURCE_DERIVED_HYPOTHESIS" as const },
  { id: "NC-07", principle: "A multilevel dwelling needs an explicit vertical connection; if absent, upper-floor access remains UNKNOWN.", status: "SOURCE_DERIVED_HYPOTHESIS" as const },
];

export type CirculationFinding = { principleId: string; status: "PASS" | "FAIL" | "UNKNOWN"; finding: string; evidence: string };

function hasRoute(layout: ResidentialLayoutCase, type: NeufertCirculationType, a: ResidentialRoomType, b: ResidentialRoomType) {
  return layout.circulation.some((route) => route.type === type && ((route.from === a && route.to === b) || (route.from === b && route.to === a)));
}
function hasAdjacency(layout: ResidentialLayoutCase, a: ResidentialRoomType, b: ResidentialRoomType, relation?: "DIRECT" | "BUFFERED" | "SEPARATED") {
  return layout.adjacency.find((item) => (((item.a === a && item.b === b) || (item.a === b && item.b === a)) && (!relation || item.relation === relation)));
}

export function evaluateNeufertResidentialCirculation(layout: ResidentialLayoutCase): CirculationFinding[] {
  const bathroomExposed = layout.adjacency.some((item) => item.a === "BATHROOM" && ["LIVING", "DINING", "KITCHEN"].includes(item.b) && item.visualExposure === true || item.b === "BATHROOM" && ["LIVING", "DINING", "KITCHEN"].includes(item.a) && item.visualExposure === true);
  const serviceCrossesBedroom = layout.circulation.some((route) => route.type === "SERVICE" && (route.from === "BEDROOM" || route.to === "BEDROOM"));
  const arrivalCrossesBedroom = layout.circulation.some((route) => route.type === "ARRIVAL_PUBLIC" && (route.from === "BEDROOM" || route.to === "BEDROOM"));
  const verticalUnknown = layout.rooms.includes("BEDROOM") && !layout.circulation.some((route) => route.type === "VERTICAL");
  return [
    { principleId: "NC-01", status: arrivalCrossesBedroom ? "FAIL" : layout.circulation.some((route) => route.type === "ARRIVAL_PUBLIC" && route.to === "LIVING") ? "PASS" : "UNKNOWN", finding: arrivalCrossesBedroom ? "Public arrival crosses a private bedroom." : "Arrival does not require crossing a bedroom in the supplied graph.", evidence: "Arrival circulation graph." },
    { principleId: "NC-02", status: hasRoute(layout, "SOCIAL", "LIVING", "DINING") && hasRoute(layout, "SOCIAL", "DINING", "PATIO") ? "PASS" : "UNKNOWN", finding: "Social sequence requires explicit living–dining–exterior relationships.", evidence: "Social route graph." },
    { principleId: "NC-03", status: arrivalCrossesBedroom ? "FAIL" : layout.circulation.some((route) => route.type === "PRIVATE") ? "PASS" : "UNKNOWN", finding: "Private rooms need a protected route distinct from public arrival.", evidence: "Private circulation graph." },
    { principleId: "NC-04", status: serviceCrossesBedroom ? "FAIL" : layout.circulation.some((route) => route.type === "SERVICE" && (route.from === "KITCHEN" || route.to === "KITCHEN")) ? "PASS" : "UNKNOWN", finding: serviceCrossesBedroom ? "Service movement crosses a bedroom." : "Service movement is not shown crossing a bedroom.", evidence: "Service circulation graph." },
    { principleId: "NC-05", status: bathroomExposed ? "FAIL" : layout.rooms.includes("BATHROOM") ? "PASS" : "UNKNOWN", finding: bathroomExposed ? "Bathroom is visually exposed to a social/service room." : "No direct visual exposure of bathroom is recorded.", evidence: "Adjacency graph with visualExposure." },
    { principleId: "NC-06", status: bathroomExposed ? "FAIL" : hasAdjacency(layout, "BATHROOM", "BEDROOM", "BUFFERED") ? "PASS" : "UNKNOWN", finding: "Privacy requires a buffer or transition where direct exposure would occur.", evidence: "Buffered adjacency graph." },
    { principleId: "NC-07", status: verticalUnknown ? "UNKNOWN" : "PASS", finding: verticalUnknown ? "Upper-floor access is not represented; no stair is invented." : "Vertical connection is represented in the supplied graph.", evidence: "Vertical circulation graph." },
  ];
}

export const NEUFERT_THREE_EVALUATION_CASES: ResidentialLayoutCase[] = [
  { id: "NEUFERT-EVAL-01-SEPARATED", rooms: ["ENTRY", "LIVING", "DINING", "KITCHEN", "BEDROOM", "BATHROOM", "PATIO", "PRIVATE_CIRCULATION", "SERVICE_CIRCULATION"], circulation: [{ from: "ENTRY", to: "LIVING", type: "ARRIVAL_PUBLIC" }, { from: "LIVING", to: "DINING", type: "SOCIAL" }, { from: "DINING", to: "PATIO", type: "SOCIAL" }, { from: "PRIVATE_CIRCULATION", to: "BEDROOM", type: "PRIVATE" }, { from: "SERVICE_CIRCULATION", to: "KITCHEN", type: "SERVICE" }], adjacency: [{ a: "BATHROOM", b: "BEDROOM", relation: "BUFFERED" }, { a: "BATHROOM", b: "LIVING", relation: "SEPARATED", visualExposure: false }] },
  { id: "NEUFERT-EVAL-02-BATHROOM-EXPOSED", rooms: ["ENTRY", "LIVING", "DINING", "KITCHEN", "BEDROOM", "BATHROOM"], circulation: [{ from: "ENTRY", to: "LIVING", type: "ARRIVAL_PUBLIC" }, { from: "LIVING", to: "DINING", type: "SOCIAL" }, { from: "SERVICE_CIRCULATION", to: "KITCHEN", type: "SERVICE" }], adjacency: [{ a: "BATHROOM", b: "LIVING", relation: "DIRECT", visualExposure: true }, { a: "BATHROOM", b: "DINING", relation: "DIRECT", visualExposure: true }] },
  { id: "NEUFERT-EVAL-03-SERVICE-CROSSES-PRIVATE", rooms: ["ENTRY", "LIVING", "DINING", "KITCHEN", "BEDROOM", "BATHROOM", "PATIO"], circulation: [{ from: "ENTRY", to: "BEDROOM", type: "ARRIVAL_PUBLIC" }, { from: "KITCHEN", to: "BEDROOM", type: "SERVICE" }, { from: "LIVING", to: "DINING", type: "SOCIAL" }, { from: "DINING", to: "PATIO", type: "SOCIAL" }], adjacency: [{ a: "BATHROOM", b: "BEDROOM", relation: "DIRECT" }] },
];

export function runNeufertThreeEvaluations() {
  return NEUFERT_THREE_EVALUATION_CASES.map((layout) => ({ layoutId: layout.id, findings: evaluateNeufertResidentialCirculation(layout), humanReviewRequired: true, sourceStatus: "SOURCE_DERIVED_HYPOTHESIS" as const }));
}
