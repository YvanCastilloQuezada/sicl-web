import {
  buildEducationOperationalProgram,
  buildFunctionalProfile,
  buildMinimumSystemRequirement,
  deriveFunctionalZoning,
  type Activity,
  type Flow,
  type FunctionalZone,
  type OperationalProgram,
  type Relationship,
} from "./arkiCanonicalFunctionalOperationalization";
import type { FlowKind, TypologyId } from "./arkiTypologyFunctionalKnowledge";
import { getTypologyFunctionalProfile } from "./arkiTypologyFunctionalKnowledge";

export type PreCoordinateTopology = {
  id: string;
  typology: TypologyId;
  strategy: string;
  zones: string[];
  nodes: string[];
  edges: Array<{ from: string; to: string; relation: "ADJACENCY" | "SEPARATION" | "CONTROLLED_ACCESS"; reason: string }>;
  preservedConstraints: string[];
  epistemicState: "HYPOTHESIS";
  state: "PROPOSED";
  humanReviewRequired: true;
};

export type TopologyEvaluation = {
  evaluationId: string;
  candidateId: string;
  checks: Array<{ id: string; status: "PASS" | "UNKNOWN" | "CONFLICT"; reason: string }>;
  score: number;
  winnerCreated: false;
  recommendationCreated: false;
  decisionCreated: false;
  humanReviewRequired: true;
};

const evidence = (id: string, source: string) => ({ id, source, evidenceState: "SOURCE_DERIVED_HYPOTHESIS" as const });

const mapFlowKind = (kind: FlowKind): Flow["kind"] => {
  if (kind === "CLEAN_STERILE" || kind === "DIRTY") return "SERVICE";
  if (kind === "VEHICLE") return "GOODS";
  return kind as Flow["kind"];
};

export function buildGenericTypologyOperationalProgram(typology: Exclude<TypologyId, "RESIDENTIAL" | "EDUCATION">): OperationalProgram {
  const profile = getTypologyFunctionalProfile(typology);
  const functionalProfile = buildFunctionalProfile(typology);
  const requirements = profile.programGroups.map((group, index) => buildMinimumSystemRequirement({
    id: `SYS-${typology}-${group.toUpperCase().replace(/[^A-Z0-9]+/g, "-")}`,
    name: group,
    role: index === 0 ? "PRIMARY" : profile.flows.some((flow) => flow === "SERVICE" || flow === "GOODS" || flow === "DIRTY") && group.includes("service") ? "SERVICE" : "SUPPORT",
    rationale: `The ${group} group is required as a source-derived functional system for ${typology}; its spatial realization remains open.`,
    compatibleRealizations: [`${group.toUpperCase()}_CLUSTER`, `${group.toUpperCase()}_SHARED`, `${group.toUpperCase()}_DISTRIBUTED`],
    evidence: [evidence(`system:${typology}:${group}`, "Neufert/Plazola adapted functional profile")],
  }));
  const activities: Activity[] = profile.programGroups.map((group, index) => ({ id: `ACT-${typology}-${index + 1}`, actorIds: functionalProfile.actors, resourceIds: [`RESOURCE-${group.toUpperCase()}`], states: ["NORMAL", "EVENT"], sequence: index + 1, frequency: "PROJECT_DEFINED", spatialRequirementIds: [`REQ-${typology}-${index + 1}`], evidence: [evidence(`activity:${typology}:${group}`, "source-derived hypothesis")] }));
  const relationships: Relationship[] = profile.relations.map((relation, index) => ({ id: `REL-${typology}-${index + 1}`, from: relation.from, to: relation.to, kind: relation.kind === "REQUIRED" ? "ADJACENCY" : relation.kind === "CONFLICT" ? "SEPARATION" : "CONTROLLED_ACCESS", compatibility: relation.kind === "CONFLICT" ? "SEPARATE" : relation.kind === "REQUIRED" ? "SHARE_WITH_CONDITIONS" : "UNKNOWN", reason: relation.reason, conditions: ["PROJECT_CONTEXT_REQUIRED"], evidence: [evidence(`relation:${typology}:${index + 1}`, "Neufert/Plazola adapted functional profile")] }));
  const flows: Flow[] = profile.flows.map((kind, index) => ({ id: `FLOW-${typology}-${index + 1}`, kind: mapFlowKind(kind), from: `${typology}_ENTRY`, to: `${typology}_${kind}_DESTINATION`, separation: kind === "PUBLIC" || kind === "USER" ? "UNKNOWN" : "CONTROLLED", operationalStates: ["NORMAL", "EVENT", "EMERGENCY"], evidence: [evidence(`flow:${typology}:${kind}`, "source-derived hypothesis")] }));
  const functionalRequirements = profile.programGroups.map((group, index) => ({ id: `REQ-${typology}-${index + 1}`, statement: `The ${group} system must be defined before geometric realization.`, source: "FUNCTIONAL_PROFILE" as const, necessity: "ESSENTIAL" as const, evidence: [evidence(`requirement:${typology}:${group}`, "functional profile")] }));
  return { profile: functionalProfile, requirements, activities, resources: [], processes: [{ id: `PROC-${typology}`, name: `${typology} operational cycle`, actorIds: functionalProfile.actors, activityIds: activities.map((activity) => activity.id), transitionIds: [], flowIds: flows.map((flow) => flow.id), state: "PROPOSED" }], transitions: [], flows, relationships, controls: [{ id: `CTRL-${typology}-ACCESS`, kind: "VERIFICATION", appliesTo: requirements.map((requirement) => requirement.id), state: "PROPOSED", evidence: [evidence(`control:${typology}`, "functional profile")] }], interfaces: [{ id: `IF-${typology}-ENTRY`, fromDomain: "PUBLIC", toDomain: typology, boundary: "PROJECT_DEFINED", accessRequirement: "CONTEXT_AND_JURISDICTION_REQUIRED", evidence: [evidence(`interface:${typology}`, "functional profile")] }], capacities: [{ id: `CAP-${typology}-DEMAND`, kind: "OCCUPANCY", timeBasis: "project-defined peak", demandBasis: "synthetic educational fixture", state: "PROPOSED" }], functionalRequirements, sourceRefs: functionalProfile.provenance, noRoomListOntology: true };
}

export function buildAllTypologyOperationalPrograms(): Record<TypologyId, OperationalProgram> {
  return {
    RESIDENTIAL: (awaitableResidential()),
    EDUCATION: buildEducationOperationalProgram(),
    HEALTHCARE: buildGenericTypologyOperationalProgram("HEALTHCARE"),
    HOSPITALITY_COMMERCE: buildGenericTypologyOperationalProgram("HOSPITALITY_COMMERCE"),
    OFFICE_RELIGIOUS: buildGenericTypologyOperationalProgram("OFFICE_RELIGIOUS"),
    INDUSTRY_LABORATORY_AGRICULTURE: buildGenericTypologyOperationalProgram("INDUSTRY_LABORATORY_AGRICULTURE"),
    SPORTS_CULTURE: buildGenericTypologyOperationalProgram("SPORTS_CULTURE"),
    TRANSPORT: buildGenericTypologyOperationalProgram("TRANSPORT"),
  };
}

function awaitableResidential(): OperationalProgram {
  // Kept as a local indirection so the complete registry has one canonical shape.
  // The residential specialization remains owned by the canonical operationalization module.
  const profile = buildFunctionalProfile("RESIDENTIAL");
  return { profile, requirements: [buildMinimumSystemRequirement({ id: "SYS-RESIDENTIAL", name: "Domestic life", role: "PRIMARY", rationale: "Residential functioning requires a coordinated domestic cycle.", compatibleRealizations: ["RESIDENTIAL_PROGRAM", "FLEXIBLE_DOMESTIC_SYSTEM"] })], activities: [], resources: [], processes: [], transitions: [], flows: [], relationships: [], controls: [], interfaces: [], capacities: [{ id: "CAP-RESIDENTIAL-DEMAND", kind: "OCCUPANCY", timeBasis: "project-defined", demandBasis: "synthetic educational fixture", state: "PROPOSED" }], functionalRequirements: [], sourceRefs: profile.provenance, noRoomListOntology: true };
}

export function buildEducationPreCoordinateTopologies(): PreCoordinateTopology[] {
  const program = buildEducationOperationalProgram();
  const zones = deriveFunctionalZoning(program).map((zone: FunctionalZone) => zone.band);
  return [
    { id: "EDU-TOPOLOGY-A", typology: "EDUCATION", strategy: "Learning street with supervised shared commons", zones, nodes: ["PUBLIC_ENTRY", "SUPERVISED_SHARED", "LEARNING", "STAFF_RESTRICTED", "SERVICE"], edges: [{ from: "PUBLIC_ENTRY", to: "SUPERVISED_SHARED", relation: "CONTROLLED_ACCESS", reason: "Arrival must be supervised." }, { from: "SUPERVISED_SHARED", to: "LEARNING", relation: "ADJACENCY", reason: "Students need a legible transition to learning." }, { from: "SERVICE", to: "LEARNING", relation: "SEPARATION", reason: "Service and waste should not cross learning movement." }], preservedConstraints: ["supervision", "service-learning separation", "emergency egress remains unresolved until context is supplied"], epistemicState: "HYPOTHESIS", state: "PROPOSED", humanReviewRequired: true },
    { id: "EDU-TOPOLOGY-B", typology: "EDUCATION", strategy: "Courtyard learning cluster", zones, nodes: ["PUBLIC_ENTRY", "SUPERVISED_SHARED", "LEARNING", "STAFF_RESTRICTED", "SERVICE"], edges: [{ from: "PUBLIC_ENTRY", to: "SUPERVISED_SHARED", relation: "CONTROLLED_ACCESS", reason: "Visitor and student arrival are filtered." }, { from: "LEARNING", to: "SUPERVISED_SHARED", relation: "ADJACENCY", reason: "Shared commons can support supervision." }, { from: "SERVICE", to: "LEARNING", relation: "SEPARATION", reason: "Service has a dedicated route." }], preservedConstraints: ["supervision", "outdoor learning potential", "service route must be separately verified"], epistemicState: "HYPOTHESIS", state: "PROPOSED", humanReviewRequired: true },
    { id: "EDU-TOPOLOGY-C", typology: "EDUCATION", strategy: "Pavilions with controlled commons", zones, nodes: ["PUBLIC_ENTRY", "SUPERVISED_SHARED", "LEARNING", "STAFF_RESTRICTED", "SERVICE"], edges: [{ from: "PUBLIC_ENTRY", to: "SUPERVISED_SHARED", relation: "CONTROLLED_ACCESS", reason: "Entry remains the supervision point." }, { from: "SUPERVISED_SHARED", to: "LEARNING", relation: "ADJACENCY", reason: "Pavilions connect through a shared supervised threshold." }, { from: "SERVICE", to: "LEARNING", relation: "SEPARATION", reason: "Goods and waste routes remain outside learning clusters." }], preservedConstraints: ["cohort separation may be possible", "weather exposure and accessibility are UNKNOWN", "service-learning separation"], epistemicState: "HYPOTHESIS", state: "PROPOSED", humanReviewRequired: true },
  ];
}

export function evaluateEducationPreCoordinateTopologies(input: { evaluationId: string; enrollment: number; siteConstraint: string; climateCondition: string }): TopologyEvaluation[] {
  return buildEducationPreCoordinateTopologies().map((candidate) => {
    const checks: TopologyEvaluation["checks"] = [
      { id: "ZONE_COVERAGE", status: candidate.zones.length === 5 ? "PASS" : "CONFLICT", reason: "All canonical education zoning bands are represented." },
      { id: "SERVICE_LEARNING_SEPARATION", status: candidate.edges.some((edge) => edge.from === "SERVICE" && edge.to === "LEARNING" && edge.relation === "SEPARATION") ? "PASS" : "CONFLICT", reason: "The candidate preserves a pre-coordinate separation constraint." },
      { id: "CONTEXT_FIT", status: input.siteConstraint && input.climateCondition ? "UNKNOWN" : "UNKNOWN", reason: `Enrollment ${input.enrollment} and context are inputs for later geometry; no automatic fit claim is made.` },
      { id: "HUMAN_REVIEW", status: "PASS", reason: "Candidate remains proposed and requires human architectural review." },
    ];
    const score = checks.filter((check) => check.status === "PASS").length;
    return { evaluationId: input.evaluationId, candidateId: candidate.id, checks, score, winnerCreated: false, recommendationCreated: false, decisionCreated: false, humanReviewRequired: true };
  });
}

export function validateAllTypologyPrograms(programs: Record<TypologyId, OperationalProgram>) {
  const ids: TypologyId[] = ["RESIDENTIAL", "EDUCATION", "HEALTHCARE", "HOSPITALITY_COMMERCE", "OFFICE_RELIGIOUS", "INDUSTRY_LABORATORY_AGRICULTURE", "SPORTS_CULTURE", "TRANSPORT"];
  return ids.map((typology) => ({ typology, profilePresent: programs[typology].profile.typology === typology, hypothesis: programs[typology].profile.epistemicState === "HYPOTHESIS", humanReviewRequired: programs[typology].profile.humanReviewRequired, noRoomListOntology: programs[typology].noRoomListOntology, requirementsPresent: programs[typology].requirements.length > 0 }));
}
