import type { UnifiedMotorInput, UnifiedMotorResult } from "./arkiUnifiedMotor";
import { executeArkiUnifiedMotor } from "./arkiUnifiedMotor";
import type { CostModelResult } from "./arkiCostIntelligence";
import type { EtiBimPackage } from "./arkiEtiBim";

export const ARKI_LIFECYCLE_PHASES = [
  "CONCEPTION",
  "FEASIBILITY",
  "BRIEF_AND_PROGRAM",
  "SCHEMATIC_DESIGN",
  "DEVELOPED_DESIGN",
  "PERMITS_AND_APPROVALS",
  "PROCUREMENT_AND_CONTRACTING",
  "CONSTRUCTION",
  "COMMISSIONING_AND_HANDOVER",
  "OPERATION",
  "MAINTENANCE_AND_RENEWAL",
  "POST_OCCUPANCY_EVALUATION",
] as const;
export type ArkiLifecyclePhase = typeof ARKI_LIFECYCLE_PHASES[number];

export type LifecycleGate = { phase: ArkiLifecyclePhase; entryCriteria: string[]; outputs: string[]; requiredReview: string; status: "AVAILABLE" | "CONCEPTUAL" | "SPECIALIST_REQUIRED" | "NOT_IMPLEMENTED" };
export const ARKI_LIFECYCLE_GATES: LifecycleGate[] = [
  { phase: "CONCEPTION", entryCriteria: ["project intent", "users and activities"], outputs: ["project identity", "initial problem framing", "parti candidates"], requiredReview: "architect and owner", status: "AVAILABLE" },
  { phase: "FEASIBILITY", entryCriteria: ["site data", "demand", "budget assumptions"], outputs: ["options comparison", "risk and UNKNOWN register", "order-of-magnitude cost"], requiredReview: "architect, client and cost specialist", status: "CONCEPTUAL" },
  { phase: "BRIEF_AND_PROGRAM", entryCriteria: ["validated brief", "typology and capacity"], outputs: ["program", "relationships", "flows", "area schedule"], requiredReview: "architect and user representatives", status: "AVAILABLE" },
  { phase: "SCHEMATIC_DESIGN", entryCriteria: ["approved concept"], outputs: ["alternatives", "topology", "conceptual geometry", "schematic cost"], requiredReview: "architect", status: "CONCEPTUAL" },
  { phase: "DEVELOPED_DESIGN", entryCriteria: ["selected alternative", "discipline inputs"], outputs: ["coordinated design package", "BIM semantic model", "updated budget"], requiredReview: "architect and discipline leads", status: "CONCEPTUAL" },
  { phase: "PERMITS_AND_APPROVALS", entryCriteria: ["jurisdiction", "normative basis", "specialist documents"], outputs: ["permit checklist", "compliance evidence matrix", "submission package map"], requiredReview: "licensed professionals and authority", status: "SPECIALIST_REQUIRED" },
  { phase: "PROCUREMENT_AND_CONTRACTING", entryCriteria: ["scope", "specifications", "quantities"], outputs: ["procurement packages", "bid comparison", "contract risk register"], requiredReview: "client, architect and legal/procurement specialists", status: "CONCEPTUAL" },
  { phase: "CONSTRUCTION", entryCriteria: ["approved construction package", "contract", "site controls"], outputs: ["RFI log", "submittal register", "progress and change tracking"], requiredReview: "construction management and architect", status: "CONCEPTUAL" },
  { phase: "COMMISSIONING_AND_HANDOVER", entryCriteria: ["installed systems", "test plans"], outputs: ["commissioning checklist", "asset register", "handover issues"], requiredReview: "commissioning specialists and owner", status: "CONCEPTUAL" },
  { phase: "OPERATION", entryCriteria: ["handover data", "operator roles"], outputs: ["space/asset data", "operating procedures", "performance dashboard inputs"], requiredReview: "owner and operator", status: "CONCEPTUAL" },
  { phase: "MAINTENANCE_AND_RENEWAL", entryCriteria: ["asset register", "maintenance strategy"], outputs: ["preventive maintenance plan", "renewal forecast", "work orders and history"], requiredReview: "facility manager and specialists", status: "CONCEPTUAL" },
  { phase: "POST_OCCUPANCY_EVALUATION", entryCriteria: ["occupancy data", "user feedback"], outputs: ["performance findings", "lessons learned", "knowledge candidates"], requiredReview: "owner, users and architect", status: "CONCEPTUAL" },
];

export type CostLine = { id: string; category: "LAND" | "PRE_DESIGN" | "DESIGN" | "PERMITS" | "CONSTRUCTION" | "EQUIPMENT" | "OPERATIONS" | "MAINTENANCE" | "CONTINGENCY"; description: string; quantity: number; unitCost: number; currency: string; source: string; confidence: "FACT" | "ESTIMATE" | "UNKNOWN" };
export type BudgetResult = { currency: string; directCost: number; contingency: number; totalInitialCost: number; annualOperations: number; annualMaintenance: number; lifecycleHorizonYears: number; lifecycleCost: number; assumptions: string[]; unknowns: string[]; humanReviewRequired: true };

export function calculateLifecycleBudget(lines: CostLine[], contingencyRate = 0.1, horizonYears = 20): BudgetResult {
  const currency = lines[0]?.currency ?? "UNSPECIFIED";
  const directCost = lines.filter((line) => line.category !== "CONTINGENCY" && line.category !== "OPERATIONS" && line.category !== "MAINTENANCE").reduce((sum, line) => sum + line.quantity * line.unitCost, 0);
  const contingency = directCost * contingencyRate;
  const totalInitialCost = directCost + contingency;
  const annualOperations = lines.filter((line) => line.category === "OPERATIONS").reduce((sum, line) => sum + line.quantity * line.unitCost, 0);
  const annualMaintenance = lines.filter((line) => line.category === "MAINTENANCE").reduce((sum, line) => sum + line.quantity * line.unitCost, 0);
  return { currency, directCost, contingency, totalInitialCost, annualOperations, annualMaintenance, lifecycleHorizonYears: horizonYears, lifecycleCost: totalInitialCost + (annualOperations + annualMaintenance) * horizonYears, assumptions: [`contingencyRate=${contingencyRate}`, `horizonYears=${horizonYears}`, "quantities and unit costs are user/specialist inputs"], unknowns: lines.filter((line) => line.confidence === "UNKNOWN").map((line) => line.id), humanReviewRequired: true };
}

export type BimElement = { id: string; category: "SITE" | "SPACE" | "WALL" | "DOOR" | "WINDOW" | "SLAB" | "ROOF" | "STRUCTURE" | "MEP" | "EQUIPMENT"; name: string; level: string; geometryStatus: "CONCEPTUAL" | "COORDINATED" | "NOT_MODELED"; properties: Record<string, string | number | boolean>; sourceIds: string[] };
export type BimRepresentation = { schema: "ARKI-BIM-SEMANTIC-1.0"; elements: BimElement[]; relationships: Array<{ from: string; to: string; relation: string }>; lod: "CONCEPTUAL" | "DEVELOPED_DESIGN" | "CONSTRUCTION_READY"; exportTargets: Array<"IFC" | "RVT" | "DWG" | "GIS" | "JSON">; exportStatus: Record<string, "PREPARED" | "NOT_IMPLEMENTED" | "REQUIRES_ADAPTER">; unknowns: string[]; humanReviewRequired: true };

export function buildSemanticBimRepresentation(elements: BimElement[], relationships: BimRepresentation["relationships"] = []): BimRepresentation {
  return { schema: "ARKI-BIM-SEMANTIC-1.0", elements, relationships, lod: "CONCEPTUAL", exportTargets: ["IFC", "RVT", "DWG", "GIS", "JSON"], exportStatus: { IFC: "REQUIRES_ADAPTER", RVT: "REQUIRES_ADAPTER", DWG: "REQUIRES_ADAPTER", GIS: "REQUIRES_ADAPTER", JSON: "PREPARED" }, unknowns: ["native authoring fidelity", "discipline coordination", "family/system definitions", "jurisdictional deliverable requirements"], humanReviewRequired: true };
}

export type LifecycleRun = { lifecycleVersion: "ARKI-LIFECYCLE-1.0"; currentPhase: ArkiLifecyclePhase; motor: UnifiedMotorResult; gates: LifecycleGate[]; budget?: BudgetResult; bim?: BimRepresentation; costModel?: CostModelResult; etiBim?: EtiBimPackage; humanAuthority: "FINAL"; status: "LIFECYCLE_CONCEPTUAL_PASS" | "PARTIAL" };
export function executeLifecycleCycle(input: UnifiedMotorInput, phase: ArkiLifecyclePhase = "CONCEPTION", budget?: BudgetResult, bim?: BimRepresentation, costModel?: CostModelResult, etiBim?: EtiBimPackage): LifecycleRun { const motor = executeArkiUnifiedMotor(input); return { lifecycleVersion: "ARKI-LIFECYCLE-1.0", currentPhase: phase, motor, gates: ARKI_LIFECYCLE_GATES, budget, bim, costModel, etiBim, humanAuthority: "FINAL", status: motor.status === "PASS_WITH_BOUNDS" ? "LIFECYCLE_CONCEPTUAL_PASS" : "PARTIAL" }; }
