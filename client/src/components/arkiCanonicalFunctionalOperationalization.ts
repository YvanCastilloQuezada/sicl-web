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
export type FunctionalZone = { id: string; band: string; systems: string[]; access: "PUBLIC" | "CONTROLLED" | "RESTRICTED" | "SERVICE"; rationale: string; evidence: EvidenceRef[]; state: "PROPOSED" };

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

export function buildEducationOperationalProgram(): OperationalProgram {
  const profile = buildFunctionalProfile("EDUCATION", {
    purpose: "Learning, care, supervision, community use and safe daily movement for students and staff.",
    operatingModel: "COHORT_BASED_LEARNING_WITH_SUPERVISED_SHARED_RESOURCES",
    actors: ["STUDENT", "TEACHER", "ADMINISTRATION", "FAMILY", "FOOD_SERVICE", "MAINTENANCE", "EMERGENCY_RESPONDER"],
    contextConditions: ["EDUCATIONAL_LEVEL_REQUIRED", "ENROLLMENT_REQUIRED", "SITE_AND_CLIMATE_UNKNOWN", "JURISDICTION_REQUIRED"],
  });
  const requirements = [
    buildMinimumSystemRequirement({ id: "SYS-ARRIVAL-SUPERVISION", name: "Arrival and supervision", role: "CONTROL", rationale: "Students and visitors require a legible arrival point with controlled transition to learning areas.", activities: ["ACT-ARRIVE", "ACT-SUPERVISE"], compatibleRealizations: ["RECEPTION", "CONTROLLED_COURTYARD_ENTRY", "SECURITY_THRESHOLD"] }),
    buildMinimumSystemRequirement({ id: "SYS-LEARNING", name: "Learning environments", role: "PRIMARY", rationale: "Learning requires classrooms and shared spaces that support different group sizes and teaching modes.", activities: ["ACT-LEARN", "ACT-COLLABORATE"], compatibleRealizations: ["CLASSROOM_CLUSTER", "LEARNING_STREET", "FLEXIBLE_STUDIO"] }),
    buildMinimumSystemRequirement({ id: "SYS-STAFF", name: "Staff and administration", role: "SUPPORT", rationale: "Staff need proximity for supervision while retaining controlled access from student circulation.", activities: ["ACT-ADMIN", "ACT-SUPERVISE"], compatibleRealizations: ["ADMIN_BLOCK", "CENTRAL_STAFF_HUB", "VISIBLE_SUPERVISION_POINT"] }),
    buildMinimumSystemRequirement({ id: "SYS-FOOD", name: "Food and dining", role: "SERVICE", rationale: "Food delivery, preparation, serving and waste require a controlled sequence separated from learning movement.", activities: ["ACT-EAT", "ACT-SERVICE"], compatibleRealizations: ["KITCHEN_DINING", "CATERING_SERVERY", "SHARED_HALL_DINING"] }),
    buildMinimumSystemRequirement({ id: "SYS-PLAY", name: "Play and outdoor learning", role: "PRIMARY", rationale: "Outdoor activity supports learning and wellbeing but must be visible and safely reachable from supervised zones.", activities: ["ACT-PLAY", "ACT-OUTDOOR_LEARN"], compatibleRealizations: ["COURTYARD", "PLAYGROUND", "SHADED_LEARNING_GARDEN"] }),
    buildMinimumSystemRequirement({ id: "SYS-ESCAPE", name: "Emergency egress", role: "INFRASTRUCTURE", rationale: "Multiple clear exits and protected routes are a design requirement; final compliance remains jurisdiction- and specialist-dependent.", activities: ["ACT-EVACUATE"], compatibleRealizations: ["MULTIPLE_EXIT_NETWORK", "EXTERNAL_ASSEMBLY_ROUTE", "PROTECTED_STAIR"], evidence: [evidence("system:escape", "functional profile; human verification required")] }),
  ];
  const activities: Activity[] = [
    { id: "ACT-ARRIVE", actorIds: ["STUDENT", "FAMILY", "TEACHER"], resourceIds: ["RECEPTION"], states: ["ARRIVAL", "DISMISSAL"], sequence: 1, frequency: "DAILY", concurrency: 30, spatialRequirementIds: ["REQ-SUPERVISED-ENTRY"], evidence: [evidence("act:school-arrival", "Neufert/Plazola adapted")] },
    { id: "ACT-LEARN", actorIds: ["STUDENT", "TEACHER"], resourceIds: ["CLASSROOM", "LEARNING_COMMONS"], states: ["TEACH", "LEARN", "ASSESS"], sequence: 2, durationMinutes: 50, frequency: "WEEKDAY", concurrency: 30, spatialRequirementIds: ["REQ-LEARNING"], evidence: [evidence("act:school-learning", "Neufert/Plazola adapted")] },
    { id: "ACT-SUPERVISE", actorIds: ["TEACHER", "ADMINISTRATION"], resourceIds: ["SUPERVISION_POINT"], states: ["MONITOR", "INTERVENE"], frequency: "CONTINUOUS", spatialRequirementIds: ["REQ-VISIBILITY"], evidence: [evidence("act:school-supervision", "functional profile")] },
    { id: "ACT-EAT", actorIds: ["STUDENT", "FOOD_SERVICE"], resourceIds: ["DINING", "KITCHEN_SERVICE"], states: ["SERVE", "EAT", "CLEAN"], sequence: 3, durationMinutes: 35, frequency: "DAILY", concurrency: 120, spatialRequirementIds: ["REQ-FOOD"], evidence: [evidence("act:school-food", "Neufert/Plazola adapted")] },
    { id: "ACT-PLAY", actorIds: ["STUDENT", "TEACHER"], resourceIds: ["PLAYGROUND", "COURTYARD"], states: ["PLAY", "OUTDOOR_LEARN"], frequency: "DAILY", concurrency: 120, spatialRequirementIds: ["REQ-OUTDOOR"], evidence: [evidence("act:school-play", "Neufert/Plazola adapted")] },
    { id: "ACT-SERVICE", actorIds: ["FOOD_SERVICE", "MAINTENANCE"], resourceIds: ["SERVICE_ENTRY", "WASTE_POINT"], states: ["DELIVER", "STORE", "REMOVE_WASTE"], frequency: "DAILY", spatialRequirementIds: ["REQ-SERVICE-SEPARATION"], evidence: [evidence("act:school-service", "functional profile")] },
    { id: "ACT-EVACUATE", actorIds: ["STUDENT", "TEACHER", "EMERGENCY_RESPONDER"], resourceIds: ["EXIT_NETWORK", "ASSEMBLY_POINT"], states: ["EVACUATE", "ASSEMBLE"], frequency: "EVENT_DRIVEN", spatialRequirementIds: ["REQ-EGRESS"], evidence: [evidence("act:school-egress", "functional profile; specialist review required")] },
  ];
  const relationships: Relationship[] = [
    { id: "REL-RECEPTION-LEARNING", from: "RECEPTION", to: "LEARNING", kind: "CONTROLLED_ACCESS", compatibility: "SHARE_WITH_CONDITIONS", reason: "Arrival must be supervised before students reach learning clusters.", conditions: ["visibility", "controlled_threshold"], evidence: [evidence("rel:school-arrival", "Neufert/Plazola adapted")] },
    { id: "REL-LEARNING-PLAY", from: "LEARNING", to: "PLAY", kind: "ADJACENCY", compatibility: "SHARE_WITH_CONDITIONS", reason: "Outdoor learning and play should be reachable without exposing children to service traffic.", conditions: ["supervision", "safe_threshold"], evidence: [evidence("rel:school-play", "Neufert/Plazola adapted")] },
    { id: "REL-SERVICE-LEARNING", from: "SERVICE", to: "LEARNING", kind: "SEPARATION", compatibility: "SEPARATE", reason: "Food, goods and waste movement must not cross learning areas as an uncontrolled route.", conditions: ["dedicated_service_route", "scheduled_interface"], evidence: [evidence("rel:school-service", "Neufert/Plazola adapted")] },
    { id: "REL-STAFF-STUDENT", from: "STAFF", to: "STUDENT", kind: "CONTROLLED_ACCESS", compatibility: "SHARE_WITH_CONDITIONS", reason: "Staff must supervise students while restricted administration and records remain controlled.", conditions: ["visibility", "access_control"], evidence: [evidence("rel:school-staff", "functional profile")] },
  ];
  const flows: Flow[] = [
    { id: "FLOW-STUDENT", kind: "USER", from: "ENTRY", to: "LEARNING", separation: "SPATIAL", operationalStates: ["NORMAL", "EVENT", "EMERGENCY"], evidence: [evidence("flow:student", "functional profile")] },
    { id: "FLOW-STAFF", kind: "STAFF", from: "STAFF_ENTRY", to: "STAFF", separation: "CONTROLLED", operationalStates: ["NORMAL", "EVENT"], evidence: [evidence("flow:staff", "functional profile")] },
    { id: "FLOW-SERVICE", kind: "SERVICE", from: "SERVICE_ENTRY", to: "KITCHEN_SERVICE", separation: "SPATIAL", operationalStates: ["NORMAL", "MAINTENANCE"], evidence: [evidence("flow:school-service", "Neufert/Plazola adapted")] },
    { id: "FLOW-WASTE", kind: "WASTE", from: "LEARNING", to: "WASTE_POINT", separation: "SPATIAL", operationalStates: ["NORMAL", "MAINTENANCE"], evidence: [evidence("flow:school-waste", "functional profile")] },
    { id: "FLOW-EMERGENCY", kind: "EMERGENCY", from: "LEARNING", to: "ASSEMBLY_POINT", separation: "SPATIAL", operationalStates: ["EMERGENCY"], evidence: [evidence("flow:school-egress", "functional profile; specialist review required")] },
  ];
  const controls: Control[] = [
    { id: "CTRL-SCHOOL-SUPERVISION", kind: "SUPERVISION", appliesTo: ["STUDENT", "LEARNING", "PLAY"], state: "PROPOSED", evidence: [evidence("control:school-supervision", "functional profile")] },
    { id: "CTRL-SCHOOL-SERVICE-SEPARATION", kind: "SEPARATION", appliesTo: ["FLOW-SERVICE", "FLOW-WASTE", "LEARNING"], state: "PROPOSED", evidence: [evidence("control:school-service", "Neufert/Plazola adapted")] },
  ];
  const capacities: Capacity[] = [
    { id: "CAP-STUDENTS", kind: "OCCUPANCY", value: 120, unit: "students", timeBasis: "school day peak", demandBasis: "synthetic educational fixture", state: "PROPOSED" },
    { id: "CAP-CLASSROOM", kind: "SEAT", value: 30, unit: "seats/classroom", timeBasis: "teaching period", demandBasis: "synthetic educational fixture", state: "PROPOSED" },
  ];
  const functionalRequirements: FunctionalRequirement[] = [
    { id: "REQ-SUPERVISED-ENTRY", statement: "The primary entry must provide a supervised transition from public arrival to learning zones.", source: "FUNCTIONAL_PROFILE", necessity: "ESSENTIAL", evidence: [evidence("req:school-entry", "Neufert/Plazola adapted")] },
    { id: "REQ-LEARNING", statement: "Learning spaces must support the declared cohort and teaching mode.", source: "FUNCTIONAL_PROFILE", necessity: "ESSENTIAL", evidence: [evidence("req:learning", "functional profile")] },
    { id: "REQ-VISIBILITY", statement: "Supervision points must have a declared visibility or controlled-access strategy.", source: "FUNCTIONAL_PROFILE", necessity: "ESSENTIAL", evidence: [evidence("req:visibility", "functional profile")] },
    { id: "REQ-FOOD", statement: "Food service must connect receiving, preparation, dining and waste without uncontrolled student crossing.", source: "FUNCTIONAL_PROFILE", necessity: "ESSENTIAL", evidence: [evidence("req:food", "Neufert/Plazola adapted")] },
    { id: "REQ-OUTDOOR", statement: "Outdoor play and learning must be reachable through supervised, safe transitions.", source: "FUNCTIONAL_PROFILE", necessity: "ESSENTIAL", evidence: [evidence("req:outdoor", "Neufert/Plazola adapted")] },
    { id: "REQ-SERVICE-SEPARATION", statement: "Service and waste flows require dedicated or explicitly controlled interfaces.", source: "FUNCTIONAL_PROFILE", necessity: "ESSENTIAL", evidence: [evidence("req:service", "functional profile")] },
    { id: "REQ-EGRESS", statement: "Emergency egress must be developed and reviewed against the applicable jurisdiction and specialist requirements.", source: "REGULATORY", necessity: "ESSENTIAL", evidence: [evidence("req:egress", "functional profile; not a compliance claim")] },
  ];
  return { profile, requirements, activities, resources: [], processes: [{ id: "PROC-SCHOOL-DAY", name: "School day cycle", actorIds: profile.actors, activityIds: activities.map((a) => a.id), transitionIds: [], flowIds: flows.map((f) => f.id), state: "PROPOSED" }], transitions: [], flows, relationships, controls, interfaces: [{ id: "IF-SCHOOL-ENTRY", fromDomain: "PUBLIC", toDomain: "SCHOOL", boundary: "SUPERVISED_ENTRY", accessRequirement: "CONTROLLED_STUDENT_AND_VISITOR_TRANSITION", evidence: [evidence("interface:school-entry", "functional profile")] }, { id: "IF-SCHOOL-SERVICE", fromDomain: "SERVICE", toDomain: "SCHOOL", boundary: "SERVICE_ENTRY", accessRequirement: "NO_UNCONTROLLED_CROSSING_OF_LEARNING_ZONES", evidence: [evidence("interface:school-service", "Neufert/Plazola adapted")] }], capacities, functionalRequirements, sourceRefs: profile.provenance, noRoomListOntology: true };
}

export function deriveFunctionalZoning(program: OperationalProgram): FunctionalZone[] {
  const profileZones = getTypologyFunctionalProfile(program.profile.typology).zoningGradient;
  return profileZones.map((band, index) => {
    const matching = program.requirements.filter((requirement) => requirement.role !== "INFRASTRUCTURE" || band.includes("SERVICE") || band.includes("RESTRICTED"));
    const access = band.includes("PUBLIC") || band.includes("ARRIVAL") || band.includes("FRONT") ? "PUBLIC" : band.includes("SERVICE") || band.includes("TECHNICAL") ? "SERVICE" : band.includes("RESTRICTED") || band.includes("PRIVATE") ? "RESTRICTED" : "CONTROLLED";
    return { id: `ZONE-${program.profile.typology}-${index + 1}`, band, systems: matching.map((requirement) => requirement.id), access, rationale: `Derived from the ${program.profile.typology} zoning gradient; geometry remains a later realization and human review is required.`, evidence: program.profile.provenance, state: "PROPOSED" };
  });
}

export function buildHospitalSeparationTransferCases() {
  return {
    hotel: evaluateLearningTransfer({ fromTypology: "HEALTHCARE", toTypology: "HOSPITALITY_COMMERCE", preservedPrinciples: ["separate public/service flows", "controlled interface at shared thresholds"], changedConditions: ["guest arrival and housekeeping operations", "goods receipt, kitchen and waste service", "no sterile clinical workflow"], nonApplicationCases: ["do not copy clean/dirty hospital zoning", "do not copy operating-room or bed logistics layout"], copiedSolution: false }),
    laboratory: evaluateLearningTransfer({ fromTypology: "HEALTHCARE", toTypology: "INDUSTRY_LABORATORY_AGRICULTURE", preservedPrinciples: ["separate clean/contaminated or public/process flows", "controlled access to restricted work"], changedConditions: ["sample chain and equipment workflow", "hazard, maintenance and waste conditions", "laboratory process replaces patient-care process"], nonApplicationCases: ["do not copy hospital departments", "do not assume clinical sterile criteria apply without laboratory evidence"], copiedSolution: false }),
  };
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
