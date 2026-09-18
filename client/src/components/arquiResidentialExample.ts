import { assessMassAlignment, buildVerticalRelationGraph, createMassStack, type A22Level, type A22MassMember, type A22VerticalRelation } from "./a22VerticalCoherence";
import { assessWorldClassArchitectFaculties, type WorldClassArchitectAssessment } from "./worldClassArchitectFaculties";

export type HouseSpace = { id: string; name: string; level: string; areaM2: number; zone: "PUBLIC" | "PRIVATE" | "SERVICE" | "TRANSITION"; status: "CONCEPTUAL_PROPOSAL" | "GEOMETRICALLY_REALIZED" | "NOT_VERIFIED" };
export type HouseExample = { projectId: string; typology: "SINGLE_FAMILY_HOUSE"; site: { widthM: number; depthM: number; north: "NORTH_UP" }; spaces: HouseSpace[]; levels: A22Level[]; members: A22MassMember[]; relations: A22VerticalRelation[]; facultyAssessment: WorldClassArchitectAssessment };

const rect = (x: number, y: number, width: number, depth: number): Array<[number, number]> => [[x, y], [x + width, y], [x + width, y + depth], [x, y + depth], [x, y]];

export function createHouseArchitecturalExample(): HouseExample {
  const projectId = "HOUSE-001-EDUCATIONAL";
  const levels: A22Level[] = [
    { levelId: "HOUSE-N1", projectId, alternativeId: "HOUSE-A", levelIndex: 0, levelLabel: "N1 Ground", levelRole: "GROUND", provenance: ["HOUSE_FIXTURE", "A22"], epistemicState: "HUMAN_CONFIRMED", status: "CONFIRMED" },
    { levelId: "HOUSE-N2", projectId, alternativeId: "HOUSE-A", levelIndex: 1, levelLabel: "N2 Upper", levelRole: "UPPER", provenance: ["HOUSE_FIXTURE", "A22"], epistemicState: "HUMAN_CONFIRMED", status: "CONFIRMED" },
  ];
  const members: A22MassMember[] = [
    { levelId: "HOUSE-N1", massElementId: "HOUSE-MASS-N1", footprint: { coordinates: rect(0, 0, 10, 8), units: "m", coordinateFrame: "LOCAL_ENU", orientation: 0 }, provenance: ["HOUSE_FIXTURE", "A22"] },
    { levelId: "HOUSE-N2", massElementId: "HOUSE-MASS-N2", footprint: { coordinates: rect(0, 0, 10, 8), units: "m", coordinateFrame: "LOCAL_ENU", orientation: 0 }, provenance: ["HOUSE_FIXTURE", "A22"] },
  ];
  const relations: A22VerticalRelation[] = [{ verticalRelationId: "HOUSE-STACK-N1-N2", alternativeId: "HOUSE-A", fromLevelId: "HOUSE-N2", fromElementId: "HOUSE-MASS-N2", toLevelId: "HOUSE-N1", toElementId: "HOUSE-MASS-N1", relationType: "STACKS_ABOVE", alignmentMode: "EXACT", supportMode: "WITHIN_LOWER_MASS", continuityMode: "CONTINUOUS", priority: "MUST", rationale: "Upper floor remains within the ground-floor mass for a coherent educational example.", requiredEvidence: ["footprint geometry", "common units", "common coordinate frame"], provenance: ["HOUSE_FIXTURE", "A22"], epistemicState: "HUMAN_CONFIRMED", status: "CONFIRMED" }];
  const facultyAssessment = assessWorldClassArchitectFaculties({ projectId, evidenceByFaculty: {
    DESIGN_JUDGMENT: { state: "PARTIAL", evidenceRefs: ["HOUSE-BRIEF", "A16", "A26"], strengths: ["Can compare compactness, courtyard potential and proportional clarity."], openQuestions: ["Human architect must select the desired character and budget trade-off."] },
    TYPOLOGICAL_MASTERY: { state: "PARTIAL", evidenceRefs: ["HOUSE-BRIEF", "A24"], strengths: ["Recognizes a single-family house with public, private and service gradients."], openQuestions: ["Household profile and local code remain project inputs."] },
    SPATIAL_REASONING: { state: "PARTIAL", evidenceRefs: ["HOUSE-PROGRAM", "A21"], strengths: ["Proposes zones and adjacency intent."], openQuestions: ["Room boundaries and doors require explicit realization."] },
    MULTILEVEL_COHERENCE: { state: "SUPPORTED", evidenceRefs: ["HOUSE-N1-N2", "A22"], strengths: ["N1 and N2 share units, frame, footprint and vertical stack."], openQuestions: ["Structure and services are not verified."] },
    UNIVERSAL_ACCESS: { state: "REQUIRES_EVIDENCE", evidenceRefs: ["A27"], openQuestions: ["Accessible route, stairs and bathroom clearances are not geometrically verified."] },
    SAFETY_RESILIENCE: { state: "REQUIRES_EVIDENCE", evidenceRefs: ["A27"], openQuestions: ["Fire, seismic and egress evidence is absent from the fixture."] },
    MATERIAL_LIFECYCLE: { state: "REQUIRES_EVIDENCE", evidenceRefs: ["A26"], openQuestions: ["No material specification or verified LCA is attached."] },
    ECONOMIC_JUSTICE: { state: "REQUIRES_EVIDENCE", evidenceRefs: [], openQuestions: ["Budget and life-cycle costs are unknown."] },
    EVIDENCE_NORMATIVE_REASONING: { state: "PARTIAL", evidenceRefs: ["HOUSE-FIXTURE", "A20-P3R"], openQuestions: ["Jurisdiction and current applicable rules must be bound."] },
    CULTURAL_CONTEXT: { state: "REQUIRES_EVIDENCE", evidenceRefs: [], openQuestions: ["Climate, household practices and local identity require evidence." ] },
    CRITICAL_REFLEXIVITY: { state: "PARTIAL", evidenceRefs: ["A16", "A17"], strengths: ["Can preserve alternatives and unknowns instead of claiming a winner."], openQuestions: ["No human review record exists yet for this fixture." ] },
    PROFESSIONAL_COMMUNICATION: { state: "PARTIAL", evidenceRefs: ["A15", "A16"], strengths: ["Can expose the reasoning chain and unresolved questions."], openQuestions: ["Construction documentation is not generated." ] },
  }});
  return { projectId, typology: "SINGLE_FAMILY_HOUSE", site: { widthM: 18, depthM: 24, north: "NORTH_UP" }, spaces: [
    { id: "HOUSE-LIVING", name: "Living / dining", level: "N1", areaM2: 32, zone: "PUBLIC", status: "CONCEPTUAL_PROPOSAL" },
    { id: "HOUSE-KITCHEN", name: "Kitchen", level: "N1", areaM2: 14, zone: "SERVICE", status: "CONCEPTUAL_PROPOSAL" },
    { id: "HOUSE-PATIO", name: "Patio / transition", level: "N1", areaM2: 18, zone: "TRANSITION", status: "CONCEPTUAL_PROPOSAL" },
    { id: "HOUSE-BED-01", name: "Bedroom 1", level: "N2", areaM2: 16, zone: "PRIVATE", status: "CONCEPTUAL_PROPOSAL" },
    { id: "HOUSE-BED-02", name: "Bedroom 2", level: "N2", areaM2: 14, zone: "PRIVATE", status: "CONCEPTUAL_PROPOSAL" },
    { id: "HOUSE-STAIR", name: "Stair core", level: "N1→N2", areaM2: 8, zone: "TRANSITION", status: "NOT_VERIFIED" },
  ], levels, members, relations, facultyAssessment };
}

export function assessHouseVerticalCoherence(example = createHouseArchitecturalExample()) {
  const graph = buildVerticalRelationGraph(example.levels, example.relations);
  const stack = createMassStack("HOUSE-A", "HOUSE-MAIN", example.members);
  return { graph, assessment: assessMassAlignment(stack, example.levels, graph), stack };
}

export function createHospitalVerticalValidationFixture() {
  const base = createHouseArchitecturalExample();
  const projectId = "HOSPITAL-001-VALIDATION";
  const levels = base.levels.map((level, index) => ({ ...level, projectId, alternativeId: "HOSPITAL-A", levelId: `HOSPITAL-N${index + 1}`, levelLabel: index === 0 ? "Emergency / public base" : "ICU / surgery upper", provenance: ["HOSPITAL_FIXTURE", "A22"] }));
  const members = base.members.map((member, index) => ({ ...member, levelId: `HOSPITAL-N${index + 1}`, massElementId: `HOSPITAL-MASS-N${index + 1}`, footprint: { ...member.footprint, coordinates: rect(0, 0, 36, 24) } }));
  const relations = [{ ...base.relations[0], alternativeId: "HOSPITAL-A", verticalRelationId: "HOSPITAL-STACK-N1-N2", fromLevelId: "HOSPITAL-N2", toLevelId: "HOSPITAL-N1", fromElementId: "HOSPITAL-MASS-N2", toElementId: "HOSPITAL-MASS-N1", rationale: "Clinical upper level stays within the lower mass; separate clinical and public circulation must be checked independently.", provenance: ["HOSPITAL_FIXTURE", "A22"] }];
  return { projectId, levels, members, relations, expectedChecks: ["mass alignment", "vertical core continuity", "patient/staff/public route separation", "accessible route", "fire egress", "structural support", "infection-control zoning"], prohibitedClaims: ["code compliance", "structural safety", "fire certification", "hospital operational approval"] };
}
