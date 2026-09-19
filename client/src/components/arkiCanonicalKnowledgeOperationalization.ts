import type { A21RelationType, A21EpistemicState } from "./a21SpatialRelationships";

export type CanonicalKnowledgeLevel = "L00" | "L01" | "L02" | "L03" | "L04" | "L05" | "L06" | "L07" | "L08";
export type CanonicalKnowledgeClass = "PRINCIPLE" | "METHOD" | "RELATIONSHIP" | "REFERENCE_DATA" | "TYPOLOGICAL_PATTERN" | "OBSERVATION" | "DESIGN_STRATEGY" | "TECHNICAL_AWARENESS" | "REGULATORY_REQUIREMENT";
export type CanonicalMaturity = "IMPORTED_CURRICULAR_KNOWLEDGE" | "PRACTICED" | "EVALUATED" | "TRANSFERRED" | "HUMAN_REVIEWED" | "MATURE";
export type CanonicalProjectInformationKind = "FACT" | "GOAL" | "NEED" | "REQUIREMENT" | "CONSTRAINT" | "PREFERENCE" | "VALUE" | "ACTIVITY" | "ASSUMPTION" | "HYPOTHESIS" | "UNKNOWN" | "CONFLICT" | "DECISION";
export type CanonicalRelationshipDimension = "PHYSICAL" | "FUNCTIONAL" | "ACCESS" | "CIRCULATION" | "VISUAL" | "ACOUSTIC" | "PRIVACY" | "SERVICE" | "ENVIRONMENTAL" | "SECURITY" | "TEMPORAL" | "SECTIONAL_VERTICAL";
export type CanonicalEvidenceState = "SUPPORTED" | "PARTIALLY_SUPPORTED" | "NOT_SUPPORTED" | "UNKNOWN" | "NOT_APPLICABLE" | "REQUIRES_VERIFICATION";
export type CanonicalPartiRole = "FORM_MASSING" | "VOID_OPEN_SPACE" | "ORGANIZATION" | "CIRCULATION_SPACE" | "SECTIONAL_STRATEGY" | "SUPPORT_SERVICE" | "ACCESS" | "SITE_RESPONSE";

export type CanonicalKnowledgeUnit = {
  id: string;
  level: CanonicalKnowledgeLevel;
  knowledgeClass: CanonicalKnowledgeClass;
  title: string;
  principle: string;
  designConsequence: string;
  epistemicRule: string;
  sourceRefs: string[];
  practiceRequired: true;
  transferRequired: true;
  humanReviewRequired: true;
  maturity: CanonicalMaturity;
  importedKnowledge: true;
};

const sourceByLevel: Record<CanonicalKnowledgeLevel, string[]> = {
  L00: ["SRC-CHING-FSO"], L01: ["SRC-PANERO", "SRC-METRIC"], L02: ["SRC-PENA-PS", "SRC-CHERRY", "SRC-DUERK", "SRC-HERSHBERGER"],
  L03: ["SRC-PANERO", "SRC-METRIC"], L04: ["SRC-CHING-FSO", "SRC-PANERO"], L05: ["SRC-CHING-FSO", "SRC-PENA-PS"],
  L06: ["SRC-CHING-FSO"], L07: ["SRC-PENA-PS", "SRC-CHERRY", "SRC-DUERK", "SRC-HERSHBERGER"], L08: ["SRC-PENA-PS", "SRC-CHING-FSO"],
};

type UnitSeed = [string, CanonicalKnowledgeLevel, CanonicalKnowledgeClass, string, string, string, string];
const seeds: UnitSeed[] = [
  ["KU-L00-001", "L00", "PRINCIPLE", "Volume ≠ Space", "A geometric volume is not automatically an architectural space.", "Require spatial definition, relationship and intent beyond volume.", "GEOMETRY ≠ ARCHITECTURAL MEANING"],
  ["KU-L00-002", "L00", "PRINCIPLE", "Boundary ≠ Space", "A boundary participates in defining space but is not the space itself.", "Model boundary role and resulting spatial condition separately.", "NO DRAW WHAT THE MODEL DOES NOT KNOW"],
  ["KU-L00-003", "L00", "PRINCIPLE", "Opening ≠ Void", "An opening is a connection condition; a void is a spatial absence or volume condition.", "Preserve explicit semantic kind and consequences.", "MEANING ≠ GEOMETRIC REALIZATION"],
  ["KU-L01-001", "L01", "PRINCIPLE", "Human ≠ Average Human", "Human populations vary; one body or percentile is not universal.", "Preserve population, source, range, posture and task context.", "REFERENCE DATA REQUIRES PROVENANCE"],
  ["KU-L01-002", "L01", "RELATIONSHIP", "Static dimension ≠ Functional dimension", "Body dimension alone does not establish task-space requirements.", "Require task, posture and movement before spatial consequence.", "ANTHROPOMETRIC DATA ≠ DESIGN DECISION"],
  ["KU-L01-003", "L01", "METHOD", "Activity envelope precursor", "Body, posture, movement, reach, clearance and object interaction create activity conditions.", "Build explicit conditions rather than a magic dimension.", "UNKNOWN REMAINS VALID"],
  ["KU-L02-001", "L02", "PRINCIPLE", "Room name ≠ Activity model", "A room label does not describe actors, actions, sequence, equipment or temporal use.", "Derive an activity system before geometry.", "TYPOLOGY PATTERN ≠ MANDATORY TEMPLATE"],
  ["KU-L02-002", "L02", "RELATIONSHIP", "Activity ≠ Action", "Activities may comprise multiple actions and sequences.", "Represent actions and sequence only when spatially consequential.", "PATTERN ≠ LAW"],
  ["KU-L02-003", "L02", "PRINCIPLE", "Individual fit ≠ Simultaneous fit", "Activities that work separately may conflict when simultaneous.", "Evaluate simultaneity and compatibility.", "OVERLAP ≠ CONFLICT"],
  ["KU-L03-001", "L03", "PRINCIPLE", "Object footprint ≠ Use envelope", "Physical footprint excludes approach, operation, body, movement and clearances.", "Use operational states and use envelopes.", "STATIC GEOMETRY ≠ OPERATIONAL GEOMETRY"],
  ["KU-L03-002", "L03", "METHOD", "Use envelope", "A use envelope composes object states, user position, approach, reach, operation, clearance and exit.", "Generate and compare spatial conditions, not only polygons.", "MEANING FIRST; GEOMETRY WHEN APPLICABLE"],
  ["KU-L03-003", "L03", "PRINCIPLE", "Geometric overlap ≠ Functional conflict", "Overlapping envelopes may be compatible when time and use states differ.", "Combine geometry, time and activity compatibility.", "OBSERVATION/COMPUTATION REQUIRED FOR CLAIM"],
  ["KU-L04-001", "L04", "PRINCIPLE", "Same area ≠ Same habitability", "Equal area can produce different proportion, access, fit, movement and environmental potential.", "Evaluate multidimensional conditions.", "AREA ≠ QUALITY"],
  ["KU-L04-002", "L04", "METHOD", "Habitability profile", "Habitability is evaluated through evidence dimensions rather than a universal scalar.", "Return a state per dimension, including UNKNOWN and verification needs.", "NO UNIVERSAL HABITABILITY SCORE"],
  ["KU-L04-003", "L04", "PRINCIPLE", "Compliance ≠ Habitability ≠ Architectural quality", "Meeting a minimum rule does not prove good use or architecture.", "Keep compliance, habitability and quality evidence channels separate.", "APPLICABLE RULE REQUIRED FOR COMPLIANCE CLAIM"],
  ["KU-L05-001", "L05", "PRINCIPLE", "Relationship ≠ Adjacency", "Spatial relations may be functional, access, visual, acoustic, privacy, service, environmental, temporal or sectional.", "Use multidimensional relationship semantics.", "EDGE WEIGHT ≠ RELATIONSHIP MEANING"],
  ["KU-L05-002", "L05", "PRINCIPLE", "Adjacent ≠ Connected", "Shared boundary does not prove access; connection does not require adjacency.", "Separate physical adjacency from access and connectivity.", "NO INFERENCE WITHOUT EVIDENCE"],
  ["KU-L05-003", "L05", "PRINCIPLE", "Threshold ≠ Door", "A threshold is a transition condition; a door may be one component.", "Model mediation and transition intent separately.", "TERM ≠ SINGLE GEOMETRY"],
  ["KU-L05-004", "L05", "METHOD", "Relational tension", "Competing relationship requirements should be preserved and mediated, not silently collapsed.", "Generate alternatives, buffers or controlled connections as hypotheses.", "CONTRADICTION/TENSION IS KNOWLEDGE"],
  ["KU-L06-001", "L06", "PRINCIPLE", "Form ≠ Organization ≠ Circulation ≠ Section ≠ Void ≠ Support", "Architectural dimensions must not be mixed as equivalent parti tokens.", "Classify semantic role before composition.", "ROLE MUST BE EXPLICIT"],
  ["KU-L06-002", "L06", "PRINCIPLE", "Parti ≠ Token", "Parti is a high-level composition hypothesis across architectural dimensions.", "Store intent, relationships, consequences and epistemic state.", "PARTI = HYPOTHESIS UNTIL REVIEW"],
  ["KU-L06-003", "L06", "PRINCIPLE", "Same form ≠ Same organization", "One envelope or form can support different spatial organizations.", "Generate organizational hypotheses independent of massing.", "FORM DOES NOT DETERMINE ORGANIZATION"],
  ["KU-L06-004", "L06", "PRINCIPLE", "Plan + Section + Massing co-develop", "Sectional and volumetric moves must have consistent representation consequences.", "Propagate realized decisions through the canonical model.", "ONE GEOMETRY / ONE SEMANTICS / MULTIPLE OUTPUTS"],
  ["KU-L07-001", "L07", "PRINCIPLE", "Programming ≠ Room list ≠ Area table ≠ Design", "Programming models the architectural problem before solution.", "Classify goals, facts, needs, constraints, preferences and unknowns.", "PROGRAM ≠ SOLUTION"],
  ["KU-L07-002", "L07", "PRINCIPLE", "Reported information ≠ Verified fact", "Client or user statements may be approximate or unverified.", "Preserve source and verification state.", "NO EVIDENCE → NO FACT"],
  ["KU-L07-003", "L07", "PRINCIPLE", "Need ≠ Room", "An underlying need may admit multiple spatial solutions.", "Ask what activity, relationship or outcome is required.", "NEED ≠ GEOMETRY"],
  ["KU-L07-004", "L07", "PRINCIPLE", "Requested solution ≠ Underlying need", "A requested courtyard or open plan must not silently freeze a solution.", "Store request and underlying need or unknown separately.", "PREFERENCE ≠ REQUIREMENT UNLESS AUTHORIZED"],
  ["KU-L07-005", "L07", "METHOD", "Program item provenance", "Important program items preserve source, authority, applicability, evidence and epistemic state.", "Trace project knowledge into topology and design decisions.", "SOURCE AUTHORITY ≠ APPLICABILITY"],
  ["KU-L07-006", "L07", "PRINCIPLE", "Unknown ≠ Optional", "Missing information is not evidence of irrelevance.", "Track dependencies and blocking unknowns.", "UNKNOWN IS VALID RESULT"],
  ["KU-L08-001", "L08", "PRINCIPLE", "Topology before coordinates", "Relationships and connectivity should be tested before premature geometric placement.", "Generate non-coordinate relationship hypotheses first.", "TOPOLOGY ≠ GEOMETRY"],
  ["KU-L08-002", "L08", "PRINCIPLE", "Program ≠ Topology", "A program can support multiple valid topological hypotheses.", "Maintain multiple hypotheses until evidence or human decision narrows them.", "NO AUTOMATIC SINGLE OPTIMUM"],
  ["KU-L08-003", "L08", "METHOD", "Activity system → relationship graph → clusters", "Transform activities, use envelopes and relationships into functional clusters and topological requirements.", "Trace every topology edge and node to evidence or hypothesis.", "NO BOOK→BUILDING OR PROGRAM→RECTANGLE JUMP"],
  ["KU-L08-004", "L08", "METHOD", "Multiple topological hypotheses", "Produce materially different connectivity, grouping and sequence hypotheses before coordinates.", "Maintain independent design lineage; share knowledge, not solutions.", "SHARE KNOWLEDGE, DO NOT SHARE SOLUTIONS"],
  ["KU-L08-005", "L08", "PRINCIPLE", "Graph ≠ Architecture", "A resolved topology does not prove form, section, light, material, site response or quality.", "Proceed to composition and plan/section/massing without overclaiming.", "GOOD GRAPH ≠ GOOD BUILDING"],
  ["KU-L08-006", "L08", "METHOD", "Topology evaluation without scalar winner", "Evaluate program, relationships, access, privacy, circulation, section and unknowns without a universal rank.", "Return evidence profiles, tradeoffs and unresolved items.", "HUMAN ARCHITECT FINAL AUTHORITY"],
];

export const ARKI_CANONICAL_KNOWLEDGE_UNITS: CanonicalKnowledgeUnit[] = seeds.map(([id, level, knowledgeClass, title, principle, designConsequence, epistemicRule]) => ({ id, level, knowledgeClass, title, principle, designConsequence, epistemicRule, sourceRefs: sourceByLevel[level], practiceRequired: true, transferRequired: true, humanReviewRequired: true, maturity: "IMPORTED_CURRICULAR_KNOWLEDGE", importedKnowledge: true }));

export const ARKI_CANONICAL_INVARIANTS = [
  "NO EVIDENCE → NO FACT", "UNKNOWN → VALID RESULT", "UNCERTAINTY → PRESERVED", "CONTRADICTION → NOT SILENTLY RESOLVED", "DECISION → HUMAN AUTHORITY", "HUMAN ARCHITECT = FINAL AUTHORITY", "BOOK ≠ STANDARD", "STANDARD ≠ LAW", "FOREIGN STANDARD ≠ APPLICABLE PROJECT REQUIREMENT", "TYPOLOGICAL KNOWLEDGE ≠ APPLICABLE REGULATION", "REFERENCE DIMENSION ≠ PROJECT REQUIREMENT", "ROOM NAME ≠ ACTIVITY MODEL", "NEED ≠ ROOM", "PROGRAM ≠ ROOM LIST ≠ AREA TABLE ≠ DESIGN", "PROGRAM ≠ TOPOLOGY", "TOPOLOGY ≠ GEOMETRY", "RELATIONSHIP GRAPH ≠ ARCHITECTURE", "FORM ≠ ORGANIZATION ≠ CIRCULATION ≠ SECTION ≠ VOID ≠ SUPPORT", "PARTI ≠ TOKEN", "PATH ≠ CIRCULATION SPACE", "THRESHOLD ≠ DOOR", "ADJACENT ≠ CONNECTED", "RELATIONSHIP ≠ ADJACENCY", "OBJECT FOOTPRINT ≠ USE ENVELOPE", "PHYSICAL FIT ≠ OPERATIONAL FIT ≠ FUNCTIONAL FIT ≠ HABITABILITY ≠ ARCHITECTURAL QUALITY", "SAME AREA ≠ SAME HABITABILITY", "COMPLIANCE ≠ HABITABILITY ≠ ARCHITECTURAL QUALITY", "GEOMETRIC OVERLAP ≠ FUNCTIONAL CONFLICT", "PLAN + SECTION + MASSING = CO-DEVELOPED", "ONE GEOMETRY. ONE SEMANTICS. MULTIPLE OUTPUTS.", "NO DRAW WHAT THE MODEL DOES NOT KNOW", "SHARE KNOWLEDGE, DO NOT SHARE SOLUTIONS", "UNUSUAL FORM ≠ ARCHITECTURAL INNOVATION", "SIMPLE FORM ≠ SIMPLE ARCHITECTURE", "IMPORTED KNOWLEDGE ≠ LEARNED KNOWLEDGE", "PRINCIPLE → EXPLANATION → PRACTICE → EVALUATION → TRANSFER", "ONE HUMAN CORRECTION ≠ UNIVERSAL LAW", "REUSE COMPLETED WORK + EXECUTE ONLY THE DELTA", "NO CAPABILITY → NO UI FEATURE",
] as const;

export type CanonicalSourceRecord = { sourceId: string; family: string; title: string; role: string; status: "VERIFIED_PUBLIC_METADATA" | "RESEARCHED_PUBLIC_METADATA"; doNotGeneralize: string; url?: string };
export const ARKI_CANONICAL_SOURCE_REGISTRY: CanonicalSourceRecord[] = [
  { sourceId: "SRC-CHING-FSO", family: "Francis D.K. Ching", title: "Architecture: Form, Space, and Order", role: "Elements, form-space, organization, circulation, proportion and order.", status: "VERIFIED_PUBLIC_METADATA", doNotGeneralize: "Descriptive vocabulary is not a universal project solution.", url: "https://www.wiley.com/en-us/Architecture%3A+Form%2C+Space%2C+and+Order%2C+5th+Edition-p-9781119853374" },
  { sourceId: "SRC-PENA-PS", family: "Peña / Parshall", title: "Problem Seeking", role: "Programming, problem statement, goals, facts, concepts, needs and functional relationships.", status: "VERIFIED_PUBLIC_METADATA", doNotGeneralize: "Method is not a rigid universal workflow and does not decide design.", url: "https://uat.store.wiley.com/en-us/problem-seeking-an-architectural-programming-primer-5th-edition-p-9781118152935" },
  { sourceId: "SRC-PANERO", family: "Panero / Zelnik", title: "Human Dimension and Interior Space", role: "Anthropometry, human-space relations, body, object, clearance and activity conditions.", status: "RESEARCHED_PUBLIC_METADATA", doNotGeneralize: "Reference dimensions require population, source and context." },
  { sourceId: "SRC-METRIC", family: "Metric Handbook", title: "Planning and Design Data", role: "People/space, movement, accessibility and planning reference data.", status: "RESEARCHED_PUBLIC_METADATA", doNotGeneralize: "Reference/design data is not applicable regulation." },
  { sourceId: "SRC-CHERRY", family: "Edith Cherry", title: "Programming for Design", role: "Goals, research, data gathering, analysis, strategies and synthesis.", status: "RESEARCHED_PUBLIC_METADATA", doNotGeneralize: "Programming method does not determine one correct design." },
  { sourceId: "SRC-DUERK", family: "Donna Duerk", title: "Architectural Programming", role: "Goals, requirements, concepts, issues and information management.", status: "RESEARCHED_PUBLIC_METADATA", doNotGeneralize: "Conceptual framework is not project fact." },
  { sourceId: "SRC-HERSHBERGER", family: "Robert Hershberger", title: "Architectural Programming and Predesign Manager", role: "Values, issues, preparation, information, programming and evaluation.", status: "RESEARCHED_PUBLIC_METADATA", doNotGeneralize: "Values do not directly determine form." },
  { sourceId: "SRC-NEUFERT", family: "Ernst Neufert", title: "Architects' Data", role: "Reference data, dimensions, functional/site requirements and building types.", status: "VERIFIED_PUBLIC_METADATA", doNotGeneralize: "Book dimension is not a project requirement; typology is not mandatory program." },
  { sourceId: "SRC-PLAZOLA", family: "Plazola", title: "Enciclopedia de Arquitectura Plazola", role: "Broad typology/program/reference family for later expansion.", status: "RESEARCHED_PUBLIC_METADATA", doNotGeneralize: "Do not copy plans or diagrams; precedent is not regulation." },
];

export type ProjectInformationItem = { id: string; kind: CanonicalProjectInformationKind; statement: string; sourceRefs: string[]; evidenceRefs: string[]; applicability: "YES" | "NO" | "UNKNOWN"; epistemicState: "FACT" | "HUMAN_CONFIRMED" | "HYPOTHESIS" | "UNKNOWN" | "CONFLICTING"; humanAuthorityRequired: true };
export function createProjectInformationItem(input: Omit<ProjectInformationItem, "humanAuthorityRequired">): ProjectInformationItem { return { ...input, humanAuthorityRequired: true }; }

export type MultidimensionalRelationship = { id: string; from: string; to: string; dimensions: CanonicalRelationshipDimension[]; relationType: A21RelationType | "MEDIATED" | "SEPARATED" | "UNKNOWN"; strength: "MUST" | "SHOULD" | "COULD" | "UNKNOWN"; evidenceRefs: string[]; epistemicState: A21EpistemicState; applicability: "YES" | "NO" | "UNKNOWN"; tension?: string; noAutomaticAccess: true; noAutomaticDecision: true };
export function buildMultidimensionalRelationship(input: Omit<MultidimensionalRelationship, "noAutomaticAccess" | "noAutomaticDecision">): MultidimensionalRelationship { return { ...input, noAutomaticAccess: true, noAutomaticDecision: true }; }

export const ARKI_PARTI_ROLE_MAP: Record<string, CanonicalPartiRole[]> = {
  BAR: ["FORM_MASSING"], COURTYARD: ["VOID_OPEN_SPACE"], SPINE: ["ORGANIZATION", "CIRCULATION_SPACE"], CORE: ["SUPPORT_SERVICE", "CIRCULATION_SPACE"], DOUBLE_HEIGHT: ["SECTIONAL_STRATEGY"], GALLERY: ["CIRCULATION_SPACE"], SPLIT_MASS: ["FORM_MASSING"],
};
export type CanonicalPartiHypothesis = { id: string; label: string; roles: CanonicalPartiRole[]; intent: string; consequences: string[]; relationshipRefs: string[]; epistemicState: "HYPOTHESIS"; provenance: string[]; unknowns: string[]; tradeoffs: string[]; humanSelectionRequired: true; noAutomaticWinner: true };
export function classifyPartiToken(token: string): { token: string; roles: CanonicalPartiRole[]; ambiguous: boolean; requiresContext: true } { const roles = ARKI_PARTI_ROLE_MAP[token.toUpperCase()] ?? []; return { token, roles, ambiguous: roles.length !== 1, requiresContext: true }; }

export type TopologyNode = { id: string; kind: "USER" | "ACTIVITY" | "OBJECT" | "CLUSTER" | "SPACE" | "VOID"; sourceRefs: string[]; epistemicState: "HYPOTHESIS" | "HUMAN_CONFIRMED" | "UNKNOWN" };
export type TopologyEdge = { id: string; from: string; to: string; dimensions: CanonicalRelationshipDimension[]; relation: "CONNECT" | "SEPARATE" | "MEDIATE" | "SEQUENCE" | "VERTICAL" | "VISUAL" | "UNKNOWN"; sourceRefs: string[]; epistemicState: "HYPOTHESIS" | "HUMAN_CONFIRMED" | "UNKNOWN"; conflict?: string };
export type TopologyHypothesis = { id: string; label: string; nodes: TopologyNode[]; edges: TopologyEdge[]; clusters: string[][]; coordinatesAssigned: false; geometryCreated: false; lineage: { parentId?: string; independentSeed: string }; programTrace: string[]; conflicts: string[]; unknowns: string[]; tradeoffs: string[]; evaluation: Record<string, CanonicalEvidenceState>; epistemicState: "HYPOTHESIS"; humanSelectionRequired: true; noAutomaticWinner: true };
export type L08Fixture = { projectInformation: ProjectInformationItem[]; activitySystem: TopologyNode[]; relationships: MultidimensionalRelationship[]; hypotheses: TopologyHypothesis[]; selectedHypothesis: null; humanReviewRequired: true };

const fixtureInfo: ProjectInformationItem[] = [
  createProjectInformationItem({ id: "L08-FIXTURE:USER", kind: "ACTIVITY", statement: "A small mixed household uses social, work and service activities.", sourceRefs: ["L08-controlled-fixture"], evidenceRefs: [], applicability: "YES", epistemicState: "HUMAN_CONFIRMED" }),
  createProjectInformationItem({ id: "L08-FIXTURE:PRIVACY", kind: "NEED", statement: "Private sleeping activity should be separated from public arrival.", sourceRefs: ["L08-controlled-fixture"], evidenceRefs: [], applicability: "YES", epistemicState: "HUMAN_CONFIRMED" }),
  createProjectInformationItem({ id: "L08-FIXTURE:SERVICE", kind: "CONSTRAINT", statement: "Service movement should not require crossing the main social sequence.", sourceRefs: ["L08-controlled-fixture"], evidenceRefs: [], applicability: "YES", epistemicState: "HUMAN_CONFIRMED" }),
  createProjectInformationItem({ id: "L08-FIXTURE:COURTYARD", kind: "PREFERENCE", statement: "A courtyard is requested, but the underlying need remains to be confirmed.", sourceRefs: ["L08-controlled-fixture"], evidenceRefs: [], applicability: "UNKNOWN", epistemicState: "HYPOTHESIS" }),
  createProjectInformationItem({ id: "L08-FIXTURE:ACCESS", kind: "REQUIREMENT", statement: "Entry must reach the social activity through a legible transition.", sourceRefs: ["L08-controlled-fixture"], evidenceRefs: [], applicability: "YES", epistemicState: "HUMAN_CONFIRMED" }),
  createProjectInformationItem({ id: "L08-FIXTURE:UNKNOWN", kind: "UNKNOWN", statement: "Exact household schedule and verified site orientation are unknown.", sourceRefs: ["L08-controlled-fixture"], evidenceRefs: [], applicability: "UNKNOWN", epistemicState: "UNKNOWN" }),
  createProjectInformationItem({ id: "L08-FIXTURE:TENSION", kind: "CONFLICT", statement: "Openness to the courtyard may conflict with privacy and service separation.", sourceRefs: ["L08-controlled-fixture"], evidenceRefs: [], applicability: "UNKNOWN", epistemicState: "CONFLICTING" }),
];
const fixtureActivities: TopologyNode[] = [
  { id: "ARRIVAL", kind: "ACTIVITY", sourceRefs: ["L08-FIXTURE:ACCESS"], epistemicState: "HUMAN_CONFIRMED" },
  { id: "SOCIAL", kind: "ACTIVITY", sourceRefs: ["L08-FIXTURE:USER"], epistemicState: "HUMAN_CONFIRMED" },
  { id: "PRIVATE", kind: "ACTIVITY", sourceRefs: ["L08-FIXTURE:PRIVACY"], epistemicState: "HUMAN_CONFIRMED" },
  { id: "SERVICE", kind: "ACTIVITY", sourceRefs: ["L08-FIXTURE:SERVICE"], epistemicState: "HUMAN_CONFIRMED" },
  { id: "OUTDOOR", kind: "VOID", sourceRefs: ["L08-FIXTURE:COURTYARD"], epistemicState: "HYPOTHESIS" },
];
const edge = (id: string, from: string, to: string, dimensions: CanonicalRelationshipDimension[], relation: TopologyEdge["relation"], refs: string[], conflict?: string): TopologyEdge => ({ id, from, to, dimensions, relation, sourceRefs: refs, epistemicState: "HYPOTHESIS", conflict });
const baseNodes = fixtureActivities;
export function buildL08ControlledFixture(): L08Fixture {
  const relationships: MultidimensionalRelationship[] = [
    buildMultidimensionalRelationship({ id: "REL-ARRIVAL-SOCIAL", from: "ARRIVAL", to: "SOCIAL", dimensions: ["ACCESS", "CIRCULATION", "FUNCTIONAL"], relationType: "SEQUENTIAL_RELATION", strength: "MUST", evidenceRefs: ["L08-FIXTURE:ACCESS"], epistemicState: "HUMAN_CONFIRMED", applicability: "YES" }),
    buildMultidimensionalRelationship({ id: "REL-SOCIAL-PRIVATE", from: "SOCIAL", to: "PRIVATE", dimensions: ["PRIVACY", "PHYSICAL"], relationType: "SEPARATED", strength: "MUST", evidenceRefs: ["L08-FIXTURE:PRIVACY"], epistemicState: "HUMAN_CONFIRMED", applicability: "YES" }),
    buildMultidimensionalRelationship({ id: "REL-SERVICE-SOCIAL", from: "SERVICE", to: "SOCIAL", dimensions: ["SERVICE", "CIRCULATION", "PRIVACY"], relationType: "SEPARATED", strength: "MUST", evidenceRefs: ["L08-FIXTURE:SERVICE"], epistemicState: "HUMAN_CONFIRMED", applicability: "YES", tension: "Service efficiency versus social continuity" }),
    buildMultidimensionalRelationship({ id: "REL-SOCIAL-OUTDOOR", from: "SOCIAL", to: "OUTDOOR", dimensions: ["VISUAL", "ENVIRONMENTAL", "FUNCTIONAL"], relationType: "VISUAL_CONNECTION", strength: "SHOULD", evidenceRefs: ["L08-FIXTURE:COURTYARD"], epistemicState: "HYPOTHESIS", applicability: "UNKNOWN", tension: "Openness versus privacy" }),
  ];
  const hypotheses: TopologyHypothesis[] = [
    { id: "L08-TOPOLOGY-A", label: "Bar + service edge + protected rear void", nodes: baseNodes, edges: [edge("A1", "ARRIVAL", "SOCIAL", ["ACCESS", "CIRCULATION"], "SEQUENCE", ["REL-ARRIVAL-SOCIAL"]), edge("A2", "SOCIAL", "PRIVATE", ["PRIVACY"], "SEPARATE", ["REL-SOCIAL-PRIVATE"]), edge("A3", "SERVICE", "SOCIAL", ["SERVICE"], "SEPARATE", ["REL-SERVICE-SOCIAL"])], clusters: [["ARRIVAL", "SOCIAL"], ["SERVICE"], ["PRIVATE"], ["OUTDOOR"]], coordinatesAssigned: false, geometryCreated: false, lineage: { independentSeed: "linear-sequence" }, programTrace: ["L08-FIXTURE:ACCESS", "L08-FIXTURE:PRIVACY", "L08-FIXTURE:SERVICE"], conflicts: ["Openness/privacy unresolved"], unknowns: ["Site orientation", "Household schedule"], tradeoffs: ["Clear sequence versus limited alternative access"], evaluation: { program: "SUPPORTED", privacy: "SUPPORTED", site: "UNKNOWN" }, epistemicState: "HYPOTHESIS", humanSelectionRequired: true, noAutomaticWinner: true },
    { id: "L08-TOPOLOGY-B", label: "Courtyard + gallery + mediated privacy", nodes: baseNodes, edges: [edge("B1", "ARRIVAL", "SOCIAL", ["ACCESS", "CIRCULATION"], "SEQUENCE", ["REL-ARRIVAL-SOCIAL"]), edge("B2", "SOCIAL", "OUTDOOR", ["VISUAL", "ENVIRONMENTAL"], "VISUAL", ["REL-SOCIAL-OUTDOOR"]), edge("B3", "OUTDOOR", "PRIVATE", ["PRIVACY", "CIRCULATION"], "MEDIATE", ["REL-SOCIAL-PRIVATE"])], clusters: [["OUTDOOR", "SOCIAL"], ["ARRIVAL"], ["PRIVATE"], ["SERVICE"]], coordinatesAssigned: false, geometryCreated: false, lineage: { independentSeed: "central-void-mediation" }, programTrace: ["L08-FIXTURE:COURTYARD", "L08-FIXTURE:PRIVACY", "L08-FIXTURE:ACCESS"], conflicts: ["Courtyard request may be preference, not requirement"], unknowns: ["Courtyard applicability", "Service route"], tradeoffs: ["Shared void versus privacy mediation"], evaluation: { program: "PARTIALLY_SUPPORTED", privacy: "REQUIRES_VERIFICATION", site: "UNKNOWN" }, epistemicState: "HYPOTHESIS", humanSelectionRequired: true, noAutomaticWinner: true },
    { id: "L08-TOPOLOGY-C", label: "Split social/service masses + vertical mediator", nodes: baseNodes, edges: [edge("C1", "ARRIVAL", "SOCIAL", ["ACCESS", "CIRCULATION"], "SEQUENCE", ["REL-ARRIVAL-SOCIAL"]), edge("C2", "SERVICE", "SOCIAL", ["SERVICE", "PRIVACY"], "SEPARATE", ["REL-SERVICE-SOCIAL"]), edge("C3", "PRIVATE", "SOCIAL", ["SECTIONAL_VERTICAL", "PRIVACY"], "VERTICAL", ["REL-SOCIAL-PRIVATE"])], clusters: [["ARRIVAL", "SOCIAL"], ["SERVICE"], ["PRIVATE"], ["OUTDOOR"]], coordinatesAssigned: false, geometryCreated: false, lineage: { independentSeed: "split-mass-vertical" }, programTrace: ["L08-FIXTURE:SERVICE", "L08-FIXTURE:PRIVACY", "L08-FIXTURE:UNKNOWN"], conflicts: ["Vertical mediation requires evidence not supplied"], unknowns: ["Level strategy", "Structural feasibility", "Site orientation"], tradeoffs: ["Service separation versus vertical complexity"], evaluation: { program: "PARTIALLY_SUPPORTED", privacy: "SUPPORTED", site: "UNKNOWN" }, epistemicState: "HYPOTHESIS", humanSelectionRequired: true, noAutomaticWinner: true },
  ];
  return { projectInformation: fixtureInfo, activitySystem: fixtureActivities, relationships, hypotheses, selectedHypothesis: null, humanReviewRequired: true };
}

export function validateCanonicalKnowledgeOperationalization(): boolean {
  return ARKI_CANONICAL_KNOWLEDGE_UNITS.length === 35 && ARKI_CANONICAL_KNOWLEDGE_UNITS.every((unit) => unit.importedKnowledge && unit.maturity === "IMPORTED_CURRICULAR_KNOWLEDGE" && unit.sourceRefs.length > 0 && unit.practiceRequired && unit.transferRequired && unit.humanReviewRequired) && ARKI_CANONICAL_INVARIANTS.length === 39 && Object.keys(ARKI_PARTI_ROLE_MAP).length === 7;
}
export function validateL08Fixture(fixture: L08Fixture): boolean {
  const ids = new Set(fixture.hypotheses.map((item) => item.id));
  return fixture.projectInformation.some((item) => item.kind === "UNKNOWN") && fixture.projectInformation.some((item) => item.kind === "CONFLICT") && fixture.hypotheses.length >= 3 && ids.size === fixture.hypotheses.length && fixture.hypotheses.every((item) => !item.coordinatesAssigned && !item.geometryCreated && item.epistemicState === "HYPOTHESIS" && item.humanSelectionRequired && item.noAutomaticWinner && item.lineage.independentSeed && item.programTrace.length > 0) && fixture.selectedHypothesis === null && fixture.humanReviewRequired;
}

export function runCanonicalKnowledgeNegativeControls() {
  const fixture = buildL08ControlledFixture();
  const courtyard = fixture.projectInformation.find((item) => item.id === "L08-FIXTURE:COURTYARD");
  const adjacency = fixture.relationships.find((item) => item.id === "REL-ARRIVAL-SOCIAL");
  const visual = fixture.relationships.find((item) => item.id === "REL-SOCIAL-OUTDOOR");
  const unknown = fixture.projectInformation.find((item) => item.kind === "UNKNOWN");
  return {
    unknownNotOptional: unknown?.applicability === "UNKNOWN" && unknown.epistemicState === "UNKNOWN",
    preferenceNotRequirement: courtyard?.kind === "PREFERENCE" && courtyard.epistemicState === "HYPOTHESIS" && courtyard.applicability === "UNKNOWN",
    adjacencyNotAccess: adjacency?.dimensions.includes("ACCESS") === true && adjacency.relationType !== "DIRECT_ACCESS",
    visualNotPhysical: visual?.dimensions.includes("VISUAL") === true && !visual.dimensions.includes("PHYSICAL"),
    topologyNotGeometry: fixture.hypotheses.every((item) => !item.coordinatesAssigned && !item.geometryCreated),
    noAutomaticWinner: fixture.selectedHypothesis === null && fixture.hypotheses.every((item) => item.noAutomaticWinner),
    importedNotMature: ARKI_CANONICAL_KNOWLEDGE_UNITS.every((unit) => unit.maturity !== "MATURE"),
  };
}

export type CanonicalPracticeType = "DISTINCTION" | "NON_APPLICATION" | "APPLICATION" | "EVALUATION" | "CLASSIFICATION" | "PROGRAMMING" | "DIVERGENCE" | "TRANSFER" | "HUMAN_GATE";
export type CanonicalPractice = { id: string; level: CanonicalKnowledgeLevel; type: CanonicalPracticeType; exercise: string; passEvidence: string; trap: string; transferTarget: string; humanReviewRequired: true };
export const ARKI_L00_L08_PRACTICES: CanonicalPractice[] = [
  { id: "P-L00-01", level: "L00", type: "DISTINCTION", exercise: "Classify volume, space, boundary, opening and void in unfamiliar diagrams.", passEvidence: "Semantic distinctions and unknowns are preserved.", trap: "Equates every extrusion with space or every opening with void.", transferTarget: "New spatial configuration", humanReviewRequired: true },
  { id: "P-L01-01", level: "L01", type: "NON_APPLICATION", exercise: "Change user population after anthropometric reference data is supplied.", passEvidence: "Requests revalidation and does not reuse a value blindly.", trap: "Treats source value as universal.", transferTarget: "Different population/task", humanReviewRequired: true },
  { id: "P-L02-01", level: "L02", type: "APPLICATION", exercise: "Program a bedroom without using the room label initially.", passEvidence: "Builds actors, activities, actions, objects, privacy, environment and unknowns.", trap: "Draws a bed rectangle and room immediately.", transferTarget: "Kitchen, clinic or library", humanReviewRequired: true },
  { id: "P-L03-01", level: "L03", type: "APPLICATION", exercise: "Table and chairs fit test.", passEvidence: "Checks operational states and use envelopes; returns insufficient data when dimensions are absent.", trap: "Checks footprints only.", transferTarget: "Equipment, vehicle or kiosk", humanReviewRequired: true },
  { id: "P-L04-01", level: "L04", type: "EVALUATION", exercise: "Compare three equal-area spaces.", passEvidence: "Produces a multidimensional evidence profile without a universal winner.", trap: "Area becomes quality or an arbitrary score.", transferTarget: "Office, shop or waiting space", humanReviewRequired: true },
  { id: "P-L05-01", level: "L05", type: "NON_APPLICATION", exercise: "Public and service flows cross.", passEvidence: "Checks simultaneity, privacy, safety and operation before judging.", trap: "Automatic failure because paths cross.", transferTarget: "Clinic, school or market", humanReviewRequired: true },
  { id: "P-L06-01", level: "L06", type: "CLASSIFICATION", exercise: "Classify BAR, COURTYARD, SPINE, CORE, DOUBLE_HEIGHT, GALLERY and SPLIT_MASS by role.", passEvidence: "Role is explicit and ambiguity is preserved.", trap: "All are equivalent parti tokens.", transferTarget: "Unfamiliar strategy terms", humanReviewRequired: true },
  { id: "P-L07-01", level: "L07", type: "PROGRAMMING", exercise: "Client says: I need a courtyard.", passEvidence: "Preserves request and investigates underlying need without freezing the parti.", trap: "Courtyard becomes mandatory geometry.", transferTarget: "Other solution-disguised requests", humanReviewRequired: true },
  { id: "P-L08-01", level: "L08", type: "DIVERGENCE", exercise: "Same program produces at least three materially different topological hypotheses.", passEvidence: "Connectivity, grouping or sequence differs with traceable rationale.", trap: "Same topology with cosmetic geometry changes.", transferTarget: "Different typology", humanReviewRequired: true },
  { id: "P-L08-02", level: "L08", type: "NON_APPLICATION", exercise: "A strong adjacency pattern conflicts with privacy or service constraint.", passEvidence: "Preserves conflict and generates mediation alternatives.", trap: "Silently drops one requirement.", transferTarget: "School, clinic or office", humanReviewRequired: true },
  { id: "P-L08-03", level: "L08", type: "TRANSFER", exercise: "Teach topology with dwelling and test it on a small non-residential case.", passEvidence: "Transfers graph, clustering and topology method rather than residential pattern.", trap: "Reuses house design DNA.", transferTarget: "Clinic, market or studio", humanReviewRequired: true },
  { id: "P-L08-04", level: "L08", type: "HUMAN_GATE", exercise: "Compare topology alternatives.", passEvidence: "Reports evidence, tradeoffs and unknowns; human selects, retains or rejects.", trap: "Automatic best-topology winner.", transferTarget: "Any project", humanReviewRequired: true },
];
export function validateCanonicalPracticeRegistry(): boolean { return ARKI_L00_L08_PRACTICES.length === 12 && ARKI_L00_L08_PRACTICES.some((item) => item.type === "TRANSFER") && ARKI_L00_L08_PRACTICES.some((item) => item.type === "HUMAN_GATE") && ARKI_L00_L08_PRACTICES.some((item) => item.type === "NON_APPLICATION") && ARKI_L00_L08_PRACTICES.every((item) => item.humanReviewRequired && item.passEvidence.length > 0 && item.trap.length > 0 && item.transferTarget.length > 0); }

export function canonicalKnowledgeSummary() { const fixture = buildL08ControlledFixture(); return { knowledgeUnits: ARKI_CANONICAL_KNOWLEDGE_UNITS.length, levels: Array.from(new Set(ARKI_CANONICAL_KNOWLEDGE_UNITS.map((unit) => unit.level))), invariants: ARKI_CANONICAL_INVARIANTS.length, sources: ARKI_CANONICAL_SOURCE_REGISTRY.length, relationshipDimensions: 12, partiTokens: Object.keys(ARKI_PARTI_ROLE_MAP), topologyHypotheses: fixture.hypotheses.map((item) => item.id), selectedHypothesis: fixture.selectedHypothesis, maturity: "IMPORTED_CURRICULAR_KNOWLEDGE" as const, humanReviewRequired: true as const }; }
