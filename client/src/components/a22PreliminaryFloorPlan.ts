import type { RegulatoryApplicabilityAssessment } from "./regulatoryApplicabilityFoundation";
import { assessRegulatoryApplicability, type RegulatorySourceReference } from "./regulatoryApplicabilityFoundation";
import { buildHouseA21Proof, type A21HouseProof } from "./a21ArchitecturalProgram";

export type A22Rect = { minX: number; minY: number; maxX: number; maxY: number };
export type A22PreliminarySpace = {
  id: string;
  programItemId: string;
  zoneId: string;
  zoneType: string;
  levelId: "N1" | "N2";
  footprint: A22Rect;
  areaM2: number;
  source: "A21_ZONE_TRANSLATION";
  epistemicState: "DERIVED_PRELIMINARY_GEOMETRY";
};
export type A22SpatialConstraint = {
  id: string;
  kind: "CONTAINMENT" | "OVERLAP" | "MINIMUM_DIMENSION" | "VERTICAL_CONTINUITY" | "CIRCULATION_WIDTH" | "UNKNOWN";
  state: "PASS" | "FAIL" | "NOT_ASSESSED";
  evidence: string[];
  humanReviewRequired: true;
};
export type A22PreliminaryPlan = {
  planId: "HOUSE-A22-PRELIMINARY";
  projectId: "HOUSE-001-EXPLICIT";
  site: A22Rect;
  spaces: A22PreliminarySpace[];
  constraints: A22SpatialConstraint[];
  sourceZoneIds: string[];
  geometryState: "PRELIMINARY_DERIVED";
  constructionDocumentation: "NOT_GENERATED";
  humanReviewRequired: true;
  noDecision: true;
};

const area = (r: A22Rect) => Math.max(0, r.maxX - r.minX) * Math.max(0, r.maxY - r.minY);
const overlaps = (a: A22Rect, b: A22Rect) => a.minX < b.maxX && a.maxX > b.minX && a.minY < b.maxY && a.maxY > b.minY;
const contains = (outer: A22Rect, inner: A22Rect) => inner.minX >= outer.minX && inner.minY >= outer.minY && inner.maxX <= outer.maxX && inner.maxY <= outer.maxY;

const SOURCE_CATALOG: RegulatorySourceReference[] = [
  { sourceId: "RNE-A.010", sourceTitle: "RNE A.010 — Condiciones generales de diseño", sourceType: "TECHNICAL_STANDARD", issuingAuthority: "VIVIENDA", jurisdiction: "PE", version: "NOT_SUPPLIED", provenance: ["A20-P3R / regulatory corpus reference"], verificationState: "NO_VERIFIED", humanReviewState: "NOT_STARTED" },
  { sourceId: "RNE-A.120", sourceTitle: "RNE A.120 — Accesibilidad universal", sourceType: "TECHNICAL_STANDARD", issuingAuthority: "VIVIENDA", jurisdiction: "PE", version: "NOT_SUPPLIED", provenance: ["A20-P3R / regulatory corpus reference"], verificationState: "NO_VERIFIED", humanReviewState: "NOT_STARTED" },
  { sourceId: "RNE-A.130", sourceTitle: "RNE A.130 — Seguridad", sourceType: "TECHNICAL_STANDARD", issuingAuthority: "VIVIENDA", jurisdiction: "PE", version: "NOT_SUPPLIED", provenance: ["A20-P3R / regulatory corpus reference"], verificationState: "NO_VERIFIED", humanReviewState: "NOT_STARTED" },
];

export function reviewA21Compliance(): { assessments: RegulatoryApplicabilityAssessment[]; overall: "NOT_ASSESSED"; limitations: string[] } {
  const assessments = SOURCE_CATALOG.map((source) => assessRegulatoryApplicability(source, undefined, { projectUseType: "HOUSING", projectStage: "PRELIMINARY_PROGRAM_TO_GEOMETRY", spatialScope: "EDIFICACION" }, []));
  return { assessments, overall: "NOT_ASSESSED", limitations: ["Jurisdiction was not supplied as a project fact", "Source versions and effective dates were not verified", "No requirement-to-space binding was supplied", "No compliance approval is produced"] };
}

function placement(id: string, programItemId: string, zoneId: string, zoneType: string, levelId: "N1" | "N2", footprint: A22Rect): A22PreliminarySpace {
  return { id, programItemId, zoneId, zoneType, levelId, footprint, areaM2: area(footprint), source: "A21_ZONE_TRANSLATION", epistemicState: "DERIVED_PRELIMINARY_GEOMETRY" };
}

export function translateA21ZonesToPreliminaryPlan(proof: A21HouseProof = buildHouseA21Proof()): A22PreliminaryPlan {
  const site = { minX: 0, minY: 0, maxX: 10, maxY: 8 };
  const zone = (type: string) => proof.zones.find((item) => item.zoneType === type)?.zoneId ?? `MISSING-${type}`;
  const spaces = [
    placement("A22-LIVING", "LIVING_DINING", zone("PUBLIC"), "PUBLIC", "N1", { minX: 0.5, minY: 0.5, maxX: 5.5, maxY: 4 }),
    placement("A22-KITCHEN", "KITCHEN", zone("SERVICE"), "SERVICE", "N1", { minX: 5.5, minY: 0.5, maxX: 9.5, maxY: 3 }),
    placement("A22-GROUND-CIRCULATION", "GROUND_CIRCULATION", zone("TRANSITION"), "TRANSITION", "N1", { minX: 0.5, minY: 4, maxX: 9.5, maxY: 4.8 }),
    placement("A22-MAIN-BEDROOM", "MAIN_BEDROOM", zone("PRIVATE"), "PRIVATE", "N2", { minX: 0.5, minY: 0.5, maxX: 5, maxY: 3.5 }),
    placement("A22-BEDROOM-2", "BEDROOM_2", zone("PRIVATE"), "PRIVATE", "N2", { minX: 5, minY: 0.5, maxX: 9.5, maxY: 3.5 }),
    placement("A22-PRIVATE-BATH", "PRIVATE_BATH", zone("SERVICE"), "SERVICE", "N2", { minX: 0.5, minY: 3.5, maxX: 3.5, maxY: 5.8 }),
    placement("A22-UPPER-CIRCULATION", "UPPER_CIRCULATION", zone("TRANSITION"), "TRANSITION", "N2", { minX: 3.5, minY: 3.5, maxX: 9.5, maxY: 4.3 }),
  ];
  const constraints: A22SpatialConstraint[] = [];
  for (const space of spaces) constraints.push({ id: `containment:${space.id}`, kind: "CONTAINMENT", state: contains(site, space.footprint) ? "PASS" : "FAIL", evidence: [space.id, "site:HOUSE-A22"], humanReviewRequired: true });
  for (let i = 0; i < spaces.length; i += 1) for (let j = i + 1; j < spaces.length; j += 1) if (spaces[i].levelId === spaces[j].levelId) constraints.push({ id: `overlap:${spaces[i].id}:${spaces[j].id}`, kind: "OVERLAP", state: overlaps(spaces[i].footprint, spaces[j].footprint) ? "FAIL" : "PASS", evidence: [spaces[i].id, spaces[j].id], humanReviewRequired: true });
  for (const space of spaces) {
    const minimumDimension = space.zoneType === "TRANSITION" ? 0.8 : 1.8;
    const tolerance = 1e-9;
    constraints.push({ id: `dimension:${space.id}`, kind: "MINIMUM_DIMENSION", state: space.footprint.maxX - space.footprint.minX + tolerance >= minimumDimension && space.footprint.maxY - space.footprint.minY + tolerance >= minimumDimension ? "PASS" : "FAIL", evidence: [space.id, `preliminary tolerance ${minimumDimension}m; not a regulatory requirement`], humanReviewRequired: true });
  }
  constraints.push({ id: "vertical-core", kind: "VERTICAL_CONTINUITY", state: "NOT_ASSESSED", evidence: ["A21 VERTICAL_RELATION", "No stair geometry generated by A22"], humanReviewRequired: true });
  constraints.push({ id: "circulation-width", kind: "CIRCULATION_WIDTH", state: "NOT_ASSESSED", evidence: ["A21 circulation intent", "No jurisdictional width requirement supplied"], humanReviewRequired: true });
  return { planId: "HOUSE-A22-PRELIMINARY", projectId: "HOUSE-001-EXPLICIT", site, spaces, constraints, sourceZoneIds: proof.zones.map((item) => item.zoneId), geometryState: "PRELIMINARY_DERIVED", constructionDocumentation: "NOT_GENERATED", humanReviewRequired: true, noDecision: true };
}

export function validateA22PreliminaryPlan(plan: A22PreliminaryPlan): boolean {
  return plan.spaces.length > 0 && plan.spaces.every((space) => space.source === "A21_ZONE_TRANSLATION" && space.epistemicState === "DERIVED_PRELIMINARY_GEOMETRY") && plan.constraints.every((constraint) => constraint.humanReviewRequired) && plan.geometryState === "PRELIMINARY_DERIVED" && plan.constructionDocumentation === "NOT_GENERATED" && plan.noDecision;
}
