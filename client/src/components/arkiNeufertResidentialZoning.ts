import { buildSingleFacadeHouseProposal } from "./arkiSingleFacadeHouseProposal";

export type NeufertZoningRule = {
  id: string;
  principle: string;
  sourceStatus: "SOURCE_DERIVED_HYPOTHESIS";
  appliesWhen: string;
  doNotInfer: string;
};

export const NEUFERT_RESIDENTIAL_ZONING_RULES: NeufertZoningRule[] = [
  { id: "NZ-01", principle: "Separate public/social, private and service zones before fixing room coordinates.", sourceStatus: "SOURCE_DERIVED_HYPOTHESIS", appliesWhen: "Residential programming is being organized.", doNotInfer: "Do not treat the three zones as universal fixed dimensions or as code compliance." },
  { id: "NZ-02", principle: "Place living/dining as a social group with intentional relationship to entry and exterior space.", sourceStatus: "SOURCE_DERIVED_HYPOTHESIS", appliesWhen: "A dwelling contains public rooms and a site edge or garden/patio opportunity.", doNotInfer: "Do not assume the entry location or exterior access without site evidence." },
  { id: "NZ-03", principle: "Place kitchen in functional relationship with dining and service routes.", sourceStatus: "SOURCE_DERIVED_HYPOTHESIS", appliesWhen: "Kitchen and dining are both in the program.", doNotInfer: "Do not infer a direct door or a specific workflow without a circulation/opening model." },
  { id: "NZ-04", principle: "Keep bedrooms/private rooms distinct from public arrival and noisy service paths.", sourceStatus: "SOURCE_DERIVED_HYPOTHESIS", appliesWhen: "Private rooms coexist with social/service rooms.", doNotInfer: "Do not infer privacy performance from zone labels alone." },
  { id: "NZ-05", principle: "Group bathrooms and service spaces with maintainable plumbing logic.", sourceStatus: "SOURCE_DERIVED_HYPOTHESIS", appliesWhen: "A dwelling has multiple bathrooms or wet rooms.", doNotInfer: "Do not fabricate a shaft, drainage route or engineering compliance." },
  { id: "NZ-06", principle: "Treat access and circulation as a separate planning problem that must connect the zones.", sourceStatus: "SOURCE_DERIVED_HYPOTHESIS", appliesWhen: "The program has multiple rooms or levels.", doNotInfer: "Do not invent a stair, corridor or public entry when the brief does not define it." },
  { id: "NZ-07", principle: "For constrained sites, distinguish street-facing openings from party-wall conditions and study interior daylight/ventilation opportunities.", sourceStatus: "SOURCE_DERIVED_HYPOTHESIS", appliesWhen: "The site has neighbors on three sides or another boundary constraint.", doNotInfer: "Do not assume windows, street doors, courtyards or skylights are permitted without a site and code review." },
];

export type ZoningFinding = { ruleId: string; status: "SUPPORTED" | "PARTIAL" | "UNKNOWN" | "CONFLICT"; finding: string; requiredEvidence: string };

export type ResidentialAreaRelation = { from: string; to: string; relation: "DIRECT_FUNCTIONAL" | "BUFFERED" | "SERVICE_SUPPORT" | "SEPARATED" | "UNKNOWN_ACCESS"; rationale: string; evidenceStatus: "HYPOTHESIS" | "UNKNOWN" };

export const NEUFERT_RESIDENTIAL_AREA_RELATIONS: ResidentialAreaRelation[] = [
  { from: "SOCIAL", to: "ENTRY", relation: "DIRECT_FUNCTIONAL", rationale: "Visitors should reach the social zone without crossing private bedrooms.", evidenceStatus: "UNKNOWN" },
  { from: "SOCIAL", to: "EXTERIOR", relation: "DIRECT_FUNCTIONAL", rationale: "Living/dining benefit from an intentional relationship with patio, terrace or garden.", evidenceStatus: "HYPOTHESIS" },
  { from: "KITCHEN", to: "DINING", relation: "SERVICE_SUPPORT", rationale: "Food preparation and serving should have a short, legible functional relationship.", evidenceStatus: "HYPOTHESIS" },
  { from: "PRIVATE", to: "SOCIAL", relation: "BUFFERED", rationale: "Bedrooms should not be the first space encountered from public arrival.", evidenceStatus: "HYPOTHESIS" },
  { from: "BATHROOMS", to: "PRIVATE", relation: "SERVICE_SUPPORT", rationale: "Bathrooms support bedrooms but require privacy and maintainable service logic.", evidenceStatus: "HYPOTHESIS" },
  { from: "SERVICE", to: "PRIVATE", relation: "SEPARATED", rationale: "Service movement should not unnecessarily cross bedrooms.", evidenceStatus: "HYPOTHESIS" },
  { from: "N1", to: "N2", relation: "UNKNOWN_ACCESS", rationale: "The brief does not define a stair, external access or independent upper-floor entry.", evidenceStatus: "UNKNOWN" },
];

export function evaluateNeufertResidentialZoning() {
  const proposal = buildSingleFacadeHouseProposal();
  const byProgram = (programId: string) => proposal.rooms.filter((r) => r.programId === programId);
  const findings: ZoningFinding[] = [
    { ruleId: "NZ-01", status: byProgram("LIVING").length && byProgram("BEDROOM_WITH_CLOSET").length && byProgram("KITCHEN").length ? "SUPPORTED" : "CONFLICT", finding: "The program distinguishes social, private and service room groups.", requiredEvidence: "Review zone boundaries and use-fit." },
    { ruleId: "NZ-02", status: "UNKNOWN", finding: "Living/dining are grouped, but entry from the street and connection to exterior space are not known.", requiredEvidence: "Human definition of house entry and external-space access." },
    { ruleId: "NZ-03", status: byProgram("KITCHEN").length && byProgram("DINING").length ? "PARTIAL" : "CONFLICT", finding: "Kitchen and dining exist but no supported route or opening connects them.", requiredEvidence: "Door, route and service-flow evidence." },
    { ruleId: "NZ-04", status: byProgram("BEDROOM_WITH_CLOSET").length ? "PARTIAL" : "CONFLICT", finding: "Private rooms are labeled, but access and acoustic/privacy separation are unresolved.", requiredEvidence: "Entry route, thresholds and privacy review." },
    { ruleId: "NZ-05", status: byProgram("BATHROOM").length && byProgram("MASTER_BATHROOM").length ? "PARTIAL" : "CONFLICT", finding: "Wet rooms are identified, but no plumbing grouping or shaft is authorized.", requiredEvidence: "Service shaft and maintenance route, without fabricating engineering." },
    { ruleId: "NZ-06", status: "UNKNOWN", finding: "The proposal does not know how one enters the house or the second floor; no stair is claimed.", requiredEvidence: "Architect decision on access and vertical connection." },
    { ruleId: "NZ-07", status: "PARTIAL", finding: "The single free facade and three neighbors are recorded; openings and daylight strategy remain unresolved.", requiredEvidence: "Site survey, local code and daylight/ventilation study." },
  ];
  return { knowledge: "NEUFERT_ARCHITECTS_DATA", knowledgeStatus: "SOURCE_DERIVED_HYPOTHESIS" as const, rules: NEUFERT_RESIDENTIAL_ZONING_RULES, areaRelations: NEUFERT_RESIDENTIAL_AREA_RELATIONS, proposal, findings, humanReviewRequired: true, noAutomaticDecision: true };
}
