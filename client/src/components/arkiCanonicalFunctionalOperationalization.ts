import type { TypologyId, TypologyFunctionalProfile } from "./arkiTypologyFunctionalKnowledge";
import { getTypologyFunctionalProfile } from "./arkiTypologyFunctionalKnowledge";
import { assessRegulatoryApplicability, type RegulatoryApplicabilityContext, type RegulatoryRequirementReference, type RegulatorySourceReference } from "./regulatoryApplicabilityFoundation";

export type FunctionalNecessity = "ESSENTIAL" | "CONDITIONAL" | "OPTIONAL" | "NOT_APPLICABLE" | "UNKNOWN";
export type SemanticState = "UNKNOWN" | "PROPOSED" | "OBSERVED" | "VERIFIED" | "CONFLICT";
export type Compatibility = "SHARE" | "SHARE_WITH_CONDITIONS" | "SEPARATE" | "UNKNOWN";
export type FunctionalRole = "PRIMARY" | "SUPPORT" | "CONTROL" | "SERVICE" | "INFRASTRUCTURE" | "INTERFACE";
export type OperationalState = "NORMAL" | "EVENT" | "EMERGENCY" | "MAINTENANCE" | "UNKNOWN";

export type EvidenceRef = { id: string; source: string; locator?: string; evidenceState: "SOURCE_DERIVED_HYPOTHESIS" | "HUMAN_CONFIRMED" | "PROJECT_OBSERVED" | "UNKNOWN" };
export type FunctionalProfile = { id: string; typology: TypologyId; purpose: string; operatingModel: string; actors: string[]; activityPatterns: string[]; serviceCapabilities: string[]; specialization?: string[]; capacityModel?: string[]; temporalPatterns?: string[]; operationalStates: OperationalState[]; contextConditions: string[]; provenance: EvidenceRef[]; epistemicState: "HYPOTHESIS" | "HUMAN_CONFIRMED" | "UNKNOWN"; humanReviewRequired: true };
export type SystemRequirement = { id: string; name: string; role: FunctionalRole; functionalNecessity: FunctionalNecessity; rationale: string; activities: string[]; processes: string[]; compatibleRealizations: string[]; controls: string[]; interfaces: string[]; evidence: EvidenceRef[]; state: SemanticState };
export type Activity = { id: string; actorIds: string[]; resourceIds: string[]; states: string[]; sequence?: number; durationMinutes?: number; frequency?: string; concurrency?: number; operatingWindow?: string; spatialRequirementIds: string[]; evidence: EvidenceRef[] };
export type ResourceObject = { id: string; name: string; capacity?: string; state: string; access?: string; evidence: EvidenceRef[] };
export type StateTransition = { id: string; entityId: string; from: string; to: string; trigger: string; requiredFlows: string[]; controls: string[]; evidence: EvidenceRef[] };
export type Process = { id: string; name: string; actorIds: string[]; activityIds: string[]; transitionIds: string[]; flowIds: string[]; state: SemanticState };
export type Flow = { id: string; kind: "PUBLIC" | "USER" | "STAFF" | "SERVICE" | "GOODS" | "WASTE" | "EMERGENCY" | "VERTICAL" | "INFORMATION"; from: string; to: string; separation: "SPATIAL" | "TEMPORAL" | "CONTROLLED" | "UNKNOWN"; operationalStates: OperationalState[]; evidence: EvidenceRef[] };
export type Relationship = { id: string; from: string; to: string; kind: "ADJACENCY" | "SEPARATION" | "SEQUENCE" | "VISUAL" | "CONTROLLED_ACCESS" | "INTERFACE"; compatibility: Compatibility; reason: string; conditions?: string[]; evidence: EvidenceRef[] };
export type Control = { id: string; kind: "PERMISSION" | "VERIFICATION" | "SUPERVISION" | "SEPARATION" | "MONITORING"; appliesTo: string[]; state: SemanticState; evidence: EvidenceRef[] };
export type Interface = { id: string; fromDomain: string; toDomain: string; boundary: string; accessRequirement: string; evidence: EvidenceRef[] };
export type Capacity = { id: string; kind: "OCCUPANCY" | "SERVICE" | "STORAGE" | "THROUGHPUT" | "VEHICLE" | "BED" | "SEAT"; value?: number; unit?: string; timeBasis?: string; demandBasis?: string; state: SemanticState };
export type FunctionalRequirement = { id: string; statement: string; source: "FUNCTIONAL_PROFILE" | "PROJECT" | "REGULATORY" | "ENVIRONMENT" | "ENGINEERING"; necessity: FunctionalNecessity; evidence: EvidenceRef[] };
export type OperationalProgram = { profile: FunctionalProfile; requirements: SystemRequirement[]; activities: Activity[]; resources: ResourceObject[]; processes: Process[]; transitions: StateTransition[]; flows: Flow[]; relationships: Relationship[]; controls: Control[]; interfaces: Interface[]; capacities: Capacity[]; functionalRequirements: FunctionalRequirement[]; sourceRefs: EvidenceRef[]; noRoomListOntology: true };
export type CompletenessResult = { state: "PRESENT" | "PARTIAL" | "RESOLVED" | "UNKNOWN"; missing: string[]; unresolved: string[]; checked: string[]; stage: string; evidence: EvidenceRef[] };
export type DerivedViews = { organigram: string[]; processView: string[]; flowView: string[]; controlView: string[]; interfaceView: string[]; zoningView: string[]; networkView: string[]; derivedFrom: string[]; noIndependentTruthStore: true };

const evidence = (id: string, source: string, evidenceState: EvidenceRef["evidenceState"] = "SOURCE_DERIVED_HYPOTHESIS"): EvidenceRef => ({ id, source, evidenceState });

export function buildFunctionalProfile(typology: TypologyId, overrides: Partial<Pick<FunctionalProfile, "purpose" | "operatingModel" | "actors" | "contextConditions">> = {}): FunctionalProfile {
  const profile = getTypologyFunctionalProfile(typology);
  return { id: `PROFILE-${typology}`, typology, purpose: overrides.purpose ?? profile.name, operatingModel: overrides.operatingModel ?? "FUNCTIONAL_PROFILE_TO_SYSTEMS_AND_PROCESSES", actors: overrides.actors ?? ["USER", "STAFF", "SERVICE"], activityPatterns: profile.programGroups, serviceCapabilities: profile.recurringInterfaces, specialization: profile.flows, capacityModel: ["DEMAND_REQUIRES_TIME_BASIS"], temporalPatterns: ["NORMAL", "EVENT", "EMERGENCY", "MAINTENANCE"], operationalStates: ["NORMAL", "EVENT", "EMERGENCY", "MAINTENANCE", "UNKNOWN"], contextConditions: overrides.contextConditions ?? ["SITE_DATA_REQUIRED", "JURISDICTION_REQUIRED"], provenance: [evidence(`profile:${typology}`, "Neufert/Plazola adapted functional profile")], epistemicState: "HYPOTHESIS", humanReviewRequired: true };
}

export function buildMinimumSystemRequirement(input: { id: string; name: string; role: FunctionalRole; necessity?: FunctionalNecessity; rationale: string; activities?: string[]; compatibleRealizations?: string[]; evidence?: EvidenceRef[] }): SystemRequirement {
  return { id: input.id, name: input.name, role: input.role, functionalNecessity: input.necessity ?? "ESSENTIAL", rationale: input.rationale, activities: input.activities ?? [], processes: [], compatibleRealizations: input.compatibleRealizations ?? [], controls: [], interfaces: [], evidence: input.evidence ?? [evidence(`system:${input.id}`, "functional profile")], state: "PROPOSED" };
}

export function buildResidentialOperationalProgram(): OperationalProgram {
  const profile = buildFunctionalProfile("RESIDENTIAL", { purpose: "Domestic life with privacy, social life, food, personal care and maintenance.", actors: ["HOUSEHOLD", "GUEST", "SERVICE"], contextConditions: ["SINGLE_FACADE", "THREE_NEIGHBOR_BOUNDARIES", "SITE_ORIENTATION_UNKNOWN"] });
  const requirements = [
    buildMinimumSystemRequirement({ id: "SYS-REST", name: "Rest and sleep", role: "PRIMARY", rationale: "Domestic rest is essential but may be realized by multiple bedrooms or shared arrangements.", compatibleRealizations: ["BEDROOM", "FLEXIBLE_SLEEPING_SPACE"] }),
    buildMinimumSystemRequirement({ id: "SYS-FOOD", name: "Food preparation and eating", role: "SERVICE", rationale: "Food workflow requires receiving, storage, preparation, cooking and eating relations.", compatibleRealizations: ["OPEN_KITCHEN_DINING", "KITCHEN_WITH_FILTER"] }),
    buildMinimumSystemRequirement({ id: "SYS-PERSONAL-CARE", name: "Personal care", role: "SERVICE", rationale: "Hygiene and personal care require privacy and controlled interfaces.", compatibleRealizations: ["BATHROOM", "SHARED_BATHROOM_WITH_PRIVACY_FILTER"] }),
    buildMinimumSystemRequirement({ id: "SYS-CONNECTIVITY", name: "Transition and connectivity", role: "INTERFACE", rationale: "Arrival, movement and vertical transition must be legible without forcing one universal corridor shape.", compatibleRealizations: ["GALLERY", "HALL", "DIRECT_DISTRIBUTION", "STAIR_CORE"] }),
  ];
  const activities: Activity[] = [
    { id: "ACT-ARRIVE", actorIds: ["HOUSEHOLD", "GUEST"], resourceIds: ["ENTRY"], states: ["ARRIVAL"], sequence: 1, spatialRequirementIds: ["REQ-ENTRY"], evidence: [evidence("act:arrive", "Neufert/Plazola adapted") ] },
    { id: "ACT-COOK-EAT", actorIds: ["HOUSEHOLD"], resourceIds: ["KITCHEN", "DINING"], states: ["PREPARE", "SERVE", "EAT"], sequence: 2, durationMinutes: 90, frequency: "DAILY", concurrency: 2, spatialRequirementIds: ["REQ-FOOD"], evidence: [evidence("act:food", "Neufert/Plazola adapted")] },
    { id: "ACT-REST", actorIds: ["HOUSEHOLD"], resourceIds: ["BED", "CLOSET"], states: ["SLEEP", "DRESS"], sequence: 3, durationMinutes: 480, frequency: "DAILY", concurrency: 3, spatialRequirementIds: ["REQ-PRIVATE"], evidence: [evidence("act:rest", "Neufert/Plazola adapted")] },
  ];
  const relationships: Relationship[] = [
    { id: "REL-FOOD", from: "KITCHEN", to: "DINING", kind: "SEQUENCE", compatibility: "SHARE_WITH_CONDITIONS", reason: "Food preparation and eating should be directly legible; a door is not universally required.", conditions: ["smoke", "privacy", "safety", "project_intent"], evidence: [evidence("rel:food", "Neufert/Plazola adapted")] },
    { id: "REL-PUBLIC-PRIVATE", from: "SOCIAL", to: "BEDROOM", kind: "SEPARATION", compatibility: "SEPARATE", reason: "Public/private visual and access privacy should be protected.", evidence: [evidence("rel:privacy", "Neufert/Plazola adapted")] },
    { id: "REL-ENTRY-STAIR", from: "ENTRY", to: "STAIR", kind: "CONTROLLED_ACCESS", compatibility: "SHARE_WITH_CONDITIONS", reason: "The upper level needs an explicit route reachable from arrival.", evidence: [evidence("rel:stair", "A21 human intent")] },
  ];
  return { profile, requirements, activities, resources: [], processes: [{ id: "PROC-DOMESTIC", name: "Daily domestic cycle", actorIds: ["HOUSEHOLD"], activityIds: activities.map((a) => a.id), transitionIds: [], flowIds: ["FLOW-ARRIVAL", "FLOW-FOOD", "FLOW-VERTICAL"], state: "PROPOSED" }], transitions: [], flows: [{ id: "FLOW-ARRIVAL", kind: "PUBLIC", from: "STREET", to: "ENTRY", separation: "SPATIAL", operationalStates: ["NORMAL", "EMERGENCY"], evidence: [evidence("flow:arrival", "project constraint")] }, { id: "FLOW-FOOD", kind: "USER", from: "KITCHEN", to: "DINING", separation: "UNKNOWN", operationalStates: ["NORMAL"], evidence: [evidence("flow:food", "Neufert/Plazola adapted")] }, { id: "FLOW-VERTICAL", kind: "VERTICAL", from: "ENTRY", to: "N2", separation: "SPATIAL", operationalStates: ["NORMAL", "EMERGENCY"], evidence: [evidence("flow:vertical", "A22/A23")] }], relationships, controls: [{ id: "CTRL-PRIVACY", kind: "SEPARATION", appliesTo: ["SOCIAL", "BEDROOM"], state: "PROPOSED", evidence: [evidence("control:privacy", "Neufert/Plazola adapted")] }], interfaces: [{ id: "IF-ENTRY", fromDomain: "STREET", toDomain: "BUILDING", boundary: "SINGLE_FREE_FACADE", accessRequirement: "FRONT_ACCESS_ONLY", evidence: [evidence("interface:entry", "project constraint")] }], capacities: [{ id: "CAP-HOUSEHOLD", kind: "OCCUPANCY", value: 4, unit: "persons", timeBasis: "normal occupation", demandBasis: "synthetic educational fixture", state: "PROPOSED" }], functionalRequirements: [{ id: "REQ-ENTRY", statement: "Entry must be reachable from the only free facade.", source: "PROJECT", necessity: "ESSENTIAL", evidence: [evidence("req:entry", "project constraint")] }, { id: "REQ-FOOD", statement: "Food activity requires a legible kitchen/eating relation.", source: "FUNCTIONAL_PROFILE", necessity: "ESSENTIAL", evidence: [evidence("req:food", "Neufert/Plazola adapted")] }, { id: "REQ-PRIVATE", statement: "Sleeping spaces require privacy from social arrival.", source: "FUNCTIONAL_PROFILE", necessity: "ESSENTIAL", evidence: [evidence("req:privacy", "Neufert/Plazola adapted")] }], sourceRefs: profile.provenance, noRoomListOntology: true };
}

export function evaluateSystemCompleteness(program: OperationalProgram, stage = "SCHEMATIC_DESIGN"): CompletenessResult {
  const checks: Array<[string, boolean]> = [["functional profile", Boolean(program.profile.purpose)], ["system requirements", program.requirements.length > 0], ["activities", program.activities.length > 0], ["process", program.processes.length > 0], ["flows", program.flows.length > 0], ["relationships", program.relationships.length > 0], ["controls", program.controls.length > 0], ["interfaces", program.interfaces.length > 0], ["capacity time basis", program.capacities.every((c) => c.timeBasis)], ["spatial realization", false]];
  const missing = checks.filter(([, ok]) => !ok).map(([name]) => name);
  return { state: missing.length === 0 ? "PRESENT" : missing.length <= 2 ? "PARTIAL" : "UNKNOWN", missing, unresolved: ["CanonicalBuildingModel realization must be read back for this stage", "Regulatory applicability and site evidence remain context-dependent"], checked: checks.map(([name]) => name), stage, evidence: program.sourceRefs };
}

export function deriveFunctionalViews(program: OperationalProgram): DerivedViews {
  return { organigram: ["PURPOSE", "FUNCTIONAL_PROFILE", "SYSTEM_REQUIREMENTS", "ACTIVITIES", "PROCESSES"], processView: program.processes.map((p) => p.id), flowView: program.flows.map((f) => `${f.from}->${f.to}:${f.separation}`), controlView: program.controls.map((c) => c.id), interfaceView: program.interfaces.map((i) => `${i.fromDomain}->${i.toDomain}`), zoningView: ["PUBLIC", "TRANSITION", "PRIVATE", "SERVICE", "EXTERIOR"], networkView: program.relationships.map((r) => `${r.from}-${r.kind}-${r.to}`), derivedFrom: [program.profile.id, ...program.requirements.map((r) => r.id)], noIndependentTruthStore: true };
}

export function evaluateRegulatoryCoverage(input: { context: RegulatoryApplicabilityContext; sources: RegulatorySourceReference[]; requirements: RegulatoryRequirementReference[] }): { coverage: "COMPLETE" | "PARTIAL" | "UNKNOWN"; assessments: ReturnType<typeof assessRegulatoryApplicability>[]; checked: number; applicableCandidates: number; unevaluated: number; noAutomaticCompliance: true } {
  const assessments = input.requirements.map((requirement) => { const source = input.sources.find((candidate) => candidate.sourceId === requirement.sourceId); return source ? assessRegulatoryApplicability(source, requirement, input.context) : { sourceId: requirement.sourceId, requirementId: requirement.requirementId, state: "INSUFFICIENT_CONTEXT" as const, reasons: ["SOURCE_NOT_FOUND"], missingContext: ["SOURCE"], sourceRefs: [], evidenceRefs: [], humanReviewState: "NOT_STARTED" as const, complianceStatus: "NOT_ASSESSED" as const, noAutomaticApproval: true as const, noDecision: true as const, noRecommendation: true as const }; });
  const unevaluated = assessments.filter((a) => a.state === "APPLICABLE_CANDIDATE" || a.state === "INSUFFICIENT_CONTEXT" || a.state === "UNKNOWN").length;
  return { coverage: input.requirements.length === 0 ? "UNKNOWN" : unevaluated === 0 ? "COMPLETE" : "PARTIAL", assessments, checked: assessments.length - unevaluated, applicableCandidates: assessments.filter((a) => a.state === "APPLICABLE_CANDIDATE").length, unevaluated, noAutomaticCompliance: true };
}

export function selectTemporalRegulatoryVersion(projectDate: string | undefined, sources: RegulatorySourceReference[]): { source?: RegulatorySourceReference; state: "SELECTED" | "UNKNOWN"; reason: string } {
  if (!projectDate || sources.length === 0) return { state: "UNKNOWN", reason: "PROJECT_DATE_OR_SOURCES_MISSING" };
  const candidates = sources.filter((source) => !source.effectiveDate || source.effectiveDate <= projectDate).sort((a, b) => (b.effectiveDate ?? "") .localeCompare(a.effectiveDate ?? ""));
  const source = candidates[0];
  return source ? { source, state: "SELECTED", reason: `Selected by effective date <= ${projectDate}; human applicability review remains required.` } : { state: "UNKNOWN", reason: "NO_SOURCE_EFFECTIVE_ON_PROJECT_DATE" };
}

export function evaluateLearningTransfer(input: { fromTypology: TypologyId; toTypology: TypologyId; preservedPrinciples: string[]; changedConditions: string[]; nonApplicationCases: string[]; copiedSolution: boolean }): { outcome: "PASS" | "NOT_PROVEN"; preservedPrinciples: string[]; humanReviewRequired: true; reason: string } {
  const outcome = input.fromTypology !== input.toTypology && input.preservedPrinciples.length > 0 && input.changedConditions.length > 0 && input.nonApplicationCases.length > 0 && !input.copiedSolution ? "PASS" : "NOT_PROVEN";
  return { outcome, preservedPrinciples: input.preservedPrinciples, humanReviewRequired: true, reason: outcome === "PASS" ? "Principle transferred across changed typology and conditions without copying a solution." : "Transfer lacks changed context, non-applicability or evidence of independent reasoning." };
}

export function validateHandoffOperationalization(program: OperationalProgram): boolean {
  return program.noRoomListOntology && program.profile.humanReviewRequired && program.profile.epistemicState === "HYPOTHESIS" && program.requirements.every((r) => r.functionalNecessity !== ("SUPPORT" as FunctionalNecessity)) && program.relationships.every((r) => r.evidence.length > 0) && program.flows.every((f) => f.evidence.length > 0);
}

export function buildHandoffAcceptanceFixture() {
  const program = buildResidentialOperationalProgram();
  const views = deriveFunctionalViews(program);
  const completeness = evaluateSystemCompleteness(program);
  const transfer = evaluateLearningTransfer({ fromTypology: "HEALTHCARE", toTypology: "HOSPITALITY_COMMERCE", preservedPrinciples: ["separate public/service flows"], changedConditions: ["customer/service model", "food service"], nonApplicationCases: ["sterile clean/dirty separation is not copied as a hospital layout"], copiedSolution: false });
  return { program, views, completeness, transfer, validated: validateHandoffOperationalization(program), noAutomaticDecision: true, humanAuthority: "PRESERVED" as const };
}

export const ARKI_HANDOFF_DISPOSITION = {
  REUSE_AS_IS: ["CanonicalBuildingModel", "A21/S1/S2/GDI", "source ledger", "engineering awareness", "permit gates"],
  EXTEND: ["functional profile", "system necessity", "program completeness", "learning transfer", "regulatory coverage"],
  ADAPT: ["Neufert/Plazola source-derived knowledge", "RNE temporal applicability"],
  MAP_TO_EXISTING: ["actor", "activity", "resource", "process", "flow", "relationship", "issue"],
  DATA_ONLY: ["professional source metadata", "typology knowledge", "hypotheses and unknowns"],
  DERIVED_VIEW: ["organigram", "process view", "flow view", "zoning", "network"],
  DO_NOT_ADD: ["second canonical model", "second typology engine", "second regulatory engine", "room-list ontology", "universal beauty score", "automatic winner"],
} as const;

export const ARKI_HANDOFF_ACCEPTANCE_IDS = ["minimum-system", "activity-clustering", "process-first", "state-based-flow", "operational-topology", "multiscale", "site-unknown", "environment", "regulatory-coverage", "temporal-regulation", "reference-vs-law", "transfer", "non-applicability", "false-precision", "aesthetic-no-winner", "unfamiliar-valid", "documentation-resolution", "human-authority"] as const;
