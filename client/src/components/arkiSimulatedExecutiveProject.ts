import { buildIntegratedProductFoundation, type IntegratedProductFoundation } from "./arkiIntegratedProductFoundation";
import { buildPermitDocumentationPackage, type PermitDocumentationPackage } from "./arkiPermitDocumentationOrchestrator";
import { deriveDrawingViews, type CanonicalBuildingModel, type DrawingView } from "./arkiBuildingAuthoring";

export type SimulatedEpistemicState = "SIMULATED" | "HYPOTHESIS" | "UNKNOWN" | "REQUIRES_HUMAN_REVIEW";
export type SimulatedExecutiveStatus = "SIMULATED_NOT_FOR_PERMIT";
export type SimulatedSheetDiscipline = "ARCHITECTURE" | "STRUCTURE" | "MEP" | "FIRE_LIFE_SAFETY" | "SITE";
export type SimulatedSheet = { id: string; number: string; title: string; discipline: SimulatedSheetDiscipline; sourceViewId?: string; state: SimulatedEpistemicState; annotations: string[]; limitations: string[] };
export type SimulatedDiscipline = "ARCHITECTURE" | "STRUCTURE" | "MEP" | "FIRE_LIFE_SAFETY" | "ACCESSIBILITY" | "COST";
export type SimulatedDisciplinePackage = { discipline: SimulatedDiscipline; state: SimulatedEpistemicState; inputs: string[]; outputs: string[]; unknowns: string[]; specialistReviewRequired: true };
export type SimulatedQuantity = { id: string; description: string; quantity: number | null; unit: string; state: "SIMULATED" | "UNKNOWN"; sourceElementIds: string[]; note: string };
export type SimulatedComplianceItem = { id: string; topic: string; requirement: string; result: "NO_COMPLIANCE_CLAIM"; evidence: string[]; professionalVerificationRequired: true };
export type SimulatedExportFormat = "PDF" | "DXF" | "IFC" | "GLB" | "GEOJSON" | "DWG" | "REVIT_NATIVE";
export type SimulatedExport = { format: SimulatedExportFormat; state: "SIMULATED_PACKAGE" | "AVAILABLE_WITH_DATA" | "MASSING_ONLY" | "NOT_IMPLEMENTED"; source: string; limitation: string };
export type SimulatedIssue = { id: string; severity: "INFO" | "WARNING" | "BLOCKER"; discipline: string; description: string; status: "OPEN"; resolutionAuthority: "HUMAN_SPECIALIST" };
export type SimulatedReviewGate = { id: string; name: string; state: "SIMULATED_PASS_WITH_OBSERVATIONS" | "BLOCKED_PENDING_HUMAN"; evidence: string[]; blockingInputs: string[]; humanAuthorityRequired: true };

export type SimulatedExecutiveProject = {
  projectId: string;
  modelVersion: string;
  status: SimulatedExecutiveStatus;
  simulationProfile: "EDUCATIONAL_EXECUTIVE_PROTOTYPE";
  sourceModel: "CANONICAL_BUILDING_MODEL";
  foundation: IntegratedProductFoundation;
  permitPackage: PermitDocumentationPackage;
  model: CanonicalBuildingModel;
  drawingViews: DrawingView[];
  sheets: SimulatedSheet[];
  disciplines: SimulatedDisciplinePackage[];
  quantities: SimulatedQuantity[];
  compliance: SimulatedComplianceItem[];
  exports: SimulatedExport[];
  issues: SimulatedIssue[];
  reviewGates: SimulatedReviewGate[];
  invariants: {
    permitReady: false;
    constructionReady: false;
    professionallySigned: false;
    automaticApproval: false;
    automaticDecision: false;
    winnerSelected: false;
    realWorldPerformanceClaimed: false;
    unknownStatesPreserved: true;
    humanAuthority: "PRESERVED";
  };
  provenance: string[];
};

const SIMULATION_LIMIT = "Synthetic educational value only; not measured, certified, permit-ready or construction-ready.";
const REVIEW_LIMIT = "Final dimensions, annotations, symbols, code references and professional sheets require human review.";

function buildSheets(projectId: string, views: DrawingView[]): SimulatedSheet[] {
  const viewOf = (kind: DrawingView["kind"]) => views.find((view) => view.kind === kind);
  const make = (number: string, title: string, discipline: SimulatedSheetDiscipline, view: DrawingView | undefined, annotations: string[]): SimulatedSheet => ({
    id: `${projectId}:SHEET:${number}`,
    number,
    title,
    discipline,
    sourceViewId: view?.viewId,
    state: "SIMULATED",
    annotations,
    limitations: [SIMULATION_LIMIT, REVIEW_LIMIT],
  });
  return [
    make("A-101", "Planta arquitectónica N1", "ARCHITECTURE", viewOf("FLOOR_PLAN"), ["spaces", "walls/openings where modeled", "circulation and labels"]),
    make("A-102", "Planta de sitio conceptual", "SITE", viewOf("SITE_PLAN"), ["orientation", "conceptual site boundary", "access assumptions"]),
    make("A-201", "Sección arquitectónica conceptual", "ARCHITECTURE", viewOf("BUILDING_SECTION"), ["levels", "stair and shaft reservations", "vertical continuity"]),
    make("A-301", "Elevación conceptual", "ARCHITECTURE", viewOf("EXTERIOR_ELEVATION"), ["levels and modeled openings", "facade UNKNOWN states"]),
    make("S-101", "Criterio estructural simulado", "STRUCTURE", undefined, ["structural grid hypothesis", "load path hypothesis"]),
    make("M-101", "Reservas MEP simuladas", "MEP", undefined, ["shafts", "conceptual routes", "maintenance access"]),
    make("F-101", "Evacuación y seguridad simuladas", "FIRE_LIFE_SAFETY", undefined, ["occupancy scenario", "egress hypothesis"]),
    make("D-001", "Notas y estados epistemológicos", "ARCHITECTURE", undefined, ["SIMULATED", "HYPOTHESIS", "UNKNOWN", "REQUIRES_HUMAN_REVIEW"]),
  ];
}

function buildDisciplines(model: CanonicalBuildingModel): SimulatedDisciplinePackage[] {
  const source = `CanonicalBuildingModel elements: ${model.elements.length}`;
  return [
    { discipline: "ARCHITECTURE", state: "SIMULATED", inputs: [source, "DrawingView[]"], outputs: ["plans", "site plan", "section", "elevation", "area schedule"], unknowns: ["verified dimensions", "assemblies", "facade build-up"], specialistReviewRequired: true },
    { discipline: "STRUCTURE", state: "SIMULATED", inputs: [source, "synthetic occupancy"], outputs: ["structural concept", "load-path hypothesis"], unknowns: ["geotechnical data", "loads", "seismic parameters", "member and foundation design"], specialistReviewRequired: true },
    { discipline: "MEP", state: "SIMULATED", inputs: [source, "technical reservations"], outputs: ["route diagrams", "shaft schedule", "equipment reservations"], unknowns: ["capacities", "diameters", "equipment selection", "engineering calculations"], specialistReviewRequired: true },
    { discipline: "FIRE_LIFE_SAFETY", state: "SIMULATED", inputs: [source, "synthetic occupancy scenario"], outputs: ["egress hypothesis", "exit checklist"], unknowns: ["jurisdiction", "occupant load", "fire rating", "authority interpretation"], specialistReviewRequired: true },
    { discipline: "ACCESSIBILITY", state: "SIMULATED", inputs: [source, "route candidates"], outputs: ["accessible route checklist", "clearance questions"], unknowns: ["applicable standard", "verified clearances", "site grades"], specialistReviewRequired: true },
    { discipline: "COST", state: "SIMULATED", inputs: [source, "synthetic assumptions"], outputs: ["illustrative quantity/cost schedule", "uncertainty register"], unknowns: ["market rates", "labor", "taxes", "verified quantities"], specialistReviewRequired: true },
  ];
}

function buildQuantities(model: CanonicalBuildingModel): SimulatedQuantity[] {
  const spaces = model.elements.filter((element) => element.kind === "SPACE");
  const constructive = model.elements.filter((element) => element.kind === "WALL" || element.kind === "PARTITION");
  const area = spaces.reduce((sum, space) => sum + (typeof space.properties.areaM2 === "number" ? space.properties.areaM2 : 0), 0);
  return [
    { id: `${model.projectId}:Q:SPACE_AREA`, description: "Conceptual modeled space area", quantity: area || null, unit: "m²", state: area ? "SIMULATED" : "UNKNOWN", sourceElementIds: spaces.map((element) => element.arkiId), note: SIMULATION_LIMIT },
    { id: `${model.projectId}:Q:CONSTRUCTIVE_COUNT`, description: "Modeled wall and partition element count", quantity: constructive.length || null, unit: "elements", state: constructive.length ? "SIMULATED" : "UNKNOWN", sourceElementIds: constructive.map((element) => element.arkiId), note: "Count only; not a construction takeoff." },
    { id: `${model.projectId}:Q:CONSTRUCTION_COST`, description: "Construction cost", quantity: null, unit: "UNKNOWN", state: "UNKNOWN", sourceElementIds: [], note: "No verified rates or quantities are supplied." },
  ];
}

function buildCompliance(projectId: string): SimulatedComplianceItem[] {
  return [
    { id: `${projectId}:COMPLIANCE:ACCESS`, topic: "Accessibility", requirement: "Verify continuous accessible route and clearances", result: "NO_COMPLIANCE_CLAIM", evidence: ["canonical route geometry", "synthetic clearance checklist"], professionalVerificationRequired: true },
    { id: `${projectId}:COMPLIANCE:EGRESS`, topic: "Evacuation", requirement: "Verify occupant load, travel distance and exits", result: "NO_COMPLIANCE_CLAIM", evidence: ["conceptual circulation graph"], professionalVerificationRequired: true },
    { id: `${projectId}:COMPLIANCE:STRUCTURE`, topic: "Structure", requirement: "Verify structural system and seismic requirements", result: "NO_COMPLIANCE_CLAIM", evidence: [], professionalVerificationRequired: true },
    { id: `${projectId}:COMPLIANCE:ZONING`, topic: "Planning", requirement: "Verify setbacks, height, coverage and use", result: "NO_COMPLIANCE_CLAIM", evidence: ["survey and jurisdiction required"], professionalVerificationRequired: true },
  ];
}

function buildExports(): SimulatedExport[] {
  return [
    { format: "PDF", state: "SIMULATED_PACKAGE", source: "simulated sheet manifest", limitation: "Not an issued professional drawing set." },
    { format: "DXF", state: "SIMULATED_PACKAGE", source: "canonical spatial representation", limitation: "Requires CAD round-trip validation." },
    { format: "IFC", state: "MASSING_ONLY", source: "canonical spatial representation", limitation: "massing-only exchange; not a native Revit model." },
    { format: "GLB", state: "SIMULATED_PACKAGE", source: "existing canonical 3D path", limitation: "Visualization and diagnosis only." },
    { format: "GEOJSON", state: "AVAILABLE_WITH_DATA", source: "canonical spatial representation", limitation: "Requires verified CRS and georeferenced site data." },
    { format: "DWG", state: "NOT_IMPLEMENTED", source: "no native DWG writer", limitation: "DXF is not equivalent to native DWG." },
    { format: "REVIT_NATIVE", state: "NOT_IMPLEMENTED", source: "external Revit runtime required", limitation: "IFC is not equivalent to a native Revit model." },
  ];
}

function buildIssues(projectId: string): SimulatedIssue[] {
  return [
    { id: `${projectId}:ISSUE:001`, severity: "BLOCKER", discipline: "SITE", description: "Survey, parcel, topography and jurisdiction are not verified.", status: "OPEN", resolutionAuthority: "HUMAN_SPECIALIST" },
    { id: `${projectId}:ISSUE:002`, severity: "BLOCKER", discipline: "STRUCTURE", description: "No structural calculation or geotechnical evidence exists.", status: "OPEN", resolutionAuthority: "HUMAN_SPECIALIST" },
    { id: `${projectId}:ISSUE:003`, severity: "BLOCKER", discipline: "MEP", description: "No sized systems, equipment schedule or coordinated routes exist.", status: "OPEN", resolutionAuthority: "HUMAN_SPECIALIST" },
    { id: `${projectId}:ISSUE:004`, severity: "WARNING", discipline: "DOCUMENTATION", description: "Annotations, dimensions, symbols and sheet standards are simulated.", status: "OPEN", resolutionAuthority: "HUMAN_SPECIALIST" },
  ];
}

function buildReviewGates(projectId: string): SimulatedReviewGate[] {
  return [
    { id: `${projectId}:GATE:MODEL`, name: "Canonical model identity", state: "SIMULATED_PASS_WITH_OBSERVATIONS", evidence: ["shared modelVersion", "stable element IDs", "drawing derivation"], blockingInputs: ["verified survey", "constructive assemblies"], humanAuthorityRequired: true },
    { id: `${projectId}:GATE:DISCIPLINES`, name: "Multidisciplinary coordination", state: "BLOCKED_PENDING_HUMAN", evidence: ["simulated discipline packages", "engineering reservations"], blockingInputs: ["signed structural review", "signed MEP/fire review"], humanAuthorityRequired: true },
    { id: `${projectId}:GATE:REGULATORY`, name: "Regulatory applicability", state: "BLOCKED_PENDING_HUMAN", evidence: ["regulatory chain", "simulated compliance matrix"], blockingInputs: ["jurisdiction", "verified source versions", "professional applicability review"], humanAuthorityRequired: true },
    { id: `${projectId}:GATE:ISSUANCE`, name: "Professional issuance", state: "BLOCKED_PENDING_HUMAN", evidence: ["sheet manifest", "issue register"], blockingInputs: ["architect and engineer signatures", "revision approval", "authority submission"], humanAuthorityRequired: true },
  ];
}

export function buildSimulatedExecutiveProject(foundation: IntegratedProductFoundation = buildIntegratedProductFoundation()): SimulatedExecutiveProject {
  const model = foundation.model;
  const drawingViews = deriveDrawingViews(model);
  return {
    projectId: foundation.projectId,
    modelVersion: model.modelVersion,
    status: "SIMULATED_NOT_FOR_PERMIT",
    simulationProfile: "EDUCATIONAL_EXECUTIVE_PROTOTYPE",
    sourceModel: "CANONICAL_BUILDING_MODEL",
    foundation,
    permitPackage: buildPermitDocumentationPackage(foundation),
    model,
    drawingViews,
    sheets: buildSheets(foundation.projectId, drawingViews),
    disciplines: buildDisciplines(model),
    quantities: buildQuantities(model),
    compliance: buildCompliance(foundation.projectId),
    exports: buildExports(),
    issues: buildIssues(foundation.projectId),
    reviewGates: buildReviewGates(foundation.projectId),
    invariants: { permitReady: false, constructionReady: false, professionallySigned: false, automaticApproval: false, automaticDecision: false, winnerSelected: false, realWorldPerformanceClaimed: false, unknownStatesPreserved: true, humanAuthority: "PRESERVED" },
    provenance: ["IntegratedProductFoundation", "CanonicalBuildingModel", "derived DrawingViews", "deterministic simulated executive profile"],
  };
}

export function validateSimulatedExecutiveProject(project: SimulatedExecutiveProject): boolean {
  return project.status === "SIMULATED_NOT_FOR_PERMIT" && project.sourceModel === "CANONICAL_BUILDING_MODEL" && project.sheets.length >= 8 && project.disciplines.length === 6 && project.exports.some((item) => item.format === "DWG" && item.state === "NOT_IMPLEMENTED") && project.exports.some((item) => item.format === "REVIT_NATIVE" && item.state === "NOT_IMPLEMENTED") && project.issues.some((item) => item.severity === "BLOCKER") && project.reviewGates.every((gate) => gate.humanAuthorityRequired) && !project.invariants.permitReady && !project.invariants.constructionReady && !project.invariants.automaticApproval && !project.invariants.automaticDecision && project.invariants.unknownStatesPreserved;
}

export function simulatedExecutiveSummary(project: SimulatedExecutiveProject) {
  return { projectId: project.projectId, status: project.status, sheets: project.sheets.length, disciplines: project.disciplines.length, quantities: project.quantities.length, complianceItems: project.compliance.length, exports: project.exports.map((item) => `${item.format}:${item.state}`), openIssues: project.issues.length, blockers: project.issues.filter((item) => item.severity === "BLOCKER").length, permitReady: false, constructionReady: false, humanReviewRequired: true };
}

export function assertNotForPermit(project: SimulatedExecutiveProject): true {
  if (project.invariants.permitReady || project.invariants.constructionReady || project.invariants.professionallySigned) throw new Error("Simulated ARKI package cannot be promoted automatically");
  return true;
}

export const SIMULATED_EXECUTIVE_LIMITS = [
  "SIMULATED does not mean MEASURED, CALCULATED, VERIFIED or PROFESSIONALLY_SIGNED.",
  "The package is not valid for permit submission or construction.",
  "Synthetic costs, loads, capacities and compliance checks are not real-world claims.",
  "Unknown states remain explicit and block professional issuance.",
] as const;

void assertNotForPermit;
void simulatedExecutiveSummary;
void SIMULATED_EXECUTIVE_LIMITS;
void buildSimulatedExecutiveProject;
void validateSimulatedExecutiveProject;
void buildReviewGates;
void buildIssues;
void buildExports;
void buildCompliance;
void buildQuantities;
void buildDisciplines;
void buildSheets;
void SIMULATION_LIMIT;
void REVIEW_LIMIT;
void buildPermitDocumentationPackage;
void deriveDrawingViews;
void buildIntegratedProductFoundation;
