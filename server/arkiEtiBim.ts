import type { BimRepresentation } from "./arkiProjectLifecycle";
import type { CostModelResult } from "./arkiCostIntelligence";

export type ExpedienteBlock = "STUDIES" | "GENERAL" | "ENGINEERING_AND_DETAIL" | "COSTS_AND_SCHEDULE" | "APPROVAL_AND_HANDOVER";
export type ExpedienteItemStatus = "REQUIRED" | "PRESENT" | "OBSERVED" | "SUBSANATED" | "APPROVED" | "NOT_APPLICABLE" | "UNKNOWN";
export type BimInformationContainer = "OIR" | "AIR" | "PIR" | "EIR" | "BEP" | "CCA" | "RESPONSIBILITY_MATRIX" | "MIDP" | "TIDP" | "PIM" | "AIM" | "CDE" | "FEDERATED_MODEL" | "COORDINATION_REPORT" | "AS_BUILT";

export type ExpedienteItem = {
  id: string;
  block: ExpedienteBlock;
  discipline: string;
  title: string;
  status: ExpedienteItemStatus;
  requiredBy: string[];
  sourceIds: string[];
  responsible?: string;
  version?: string;
  approvalId?: string;
  notes?: string;
};

export type EtiBimInput = {
  projectId: string;
  typology: string;
  jurisdiction: string;
  phase: "FORMULATION" | "DESIGN" | "CONSTRUCTION" | "OPERATION";
  items: ExpedienteItem[];
  bimContainers: Array<{ type: BimInformationContainer; id: string; status: ExpedienteItemStatus; sourceIds: string[] }>;
  bim?: BimRepresentation;
  costModel?: CostModelResult;
};

export type EtiBimPackage = {
  schema: "ARKI-ETI-BIM-1.0";
  projectId: string;
  typology: string;
  jurisdiction: string;
  phase: EtiBimInput["phase"];
  blocks: Record<ExpedienteBlock, { total: number; present: number; approved: number; unknown: number }>;
  requiredBimContainers: BimInformationContainer[];
  presentBimContainers: BimInformationContainer[];
  missingBimContainers: BimInformationContainer[];
  missingItems: string[];
  unknowns: string[];
  warnings: string[];
  linkedModel: boolean;
  linkedCostModel: boolean;
  status: "DRAFT" | "INCOMPLETE" | "READY_FOR_SPECIALIST_REVIEW";
  gates: {
    sourceTraceability: "PASS" | "BLOCKED";
    disciplineCompleteness: "PASS" | "BLOCKED";
    bimInformationRequirements: "PASS" | "BLOCKED";
    costTraceability: "PASS" | "BLOCKED";
    specialistApproval: "PENDING";
  };
  humanAuthority: "FINAL";
};

export const DEFAULT_EXPEDIENTE_BIM_CONTAINERS: BimInformationContainer[] = ["OIR", "AIR", "PIR", "EIR", "BEP", "CCA", "RESPONSIBILITY_MATRIX", "MIDP", "TIDP", "PIM", "CDE", "FEDERATED_MODEL", "COORDINATION_REPORT"];

export const EXPEDIENTE_BLOCK_DESCRIPTIONS: Record<ExpedienteBlock, string> = {
  STUDIES: "Estudios previos, riesgos, predio, topografía, suelos, ambiente, arqueología, servicios y condiciones existentes.",
  GENERAL: "Resumen ejecutivo, ficha, memoria descriptiva, memorias de cálculo, especificaciones y seguridad.",
  ENGINEERING_AND_DETAIL: "Arquitectura, estructuras, instalaciones, equipamiento, planos, detalles, metrados y anexos.",
  COSTS_AND_SCHEDULE: "Metrados, APU, insumos, cotizaciones, gastos generales, utilidad, impuestos, presupuesto y cronogramas.",
  APPROVAL_AND_HANDOVER: "Revisiones, observaciones, subsanaciones, aprobaciones, versiones, cierre y entrega de información.",
};

export function buildEtiBimPackage(input: EtiBimInput): EtiBimPackage {
  if (!input.projectId.trim()) throw new Error("PROJECT_ID_REQUIRED");
  if (!input.typology.trim()) throw new Error("TYPOLOGY_REQUIRED");
  if (!input.jurisdiction.trim()) throw new Error("JURISDICTION_REQUIRED");

  const blocks = Object.fromEntries((Object.keys(EXPEDIENTE_BLOCK_DESCRIPTIONS) as ExpedienteBlock[]).map((block) => {
    const items = input.items.filter((item) => item.block === block);
    return [block, {
      total: items.length,
      present: items.filter((item) => ["PRESENT", "SUBSANATED", "APPROVED"].includes(item.status)).length,
      approved: items.filter((item) => item.status === "APPROVED").length,
      unknown: items.filter((item) => item.status === "UNKNOWN").length,
    }];
  })) as EtiBimPackage["blocks"];

  const missingItems = input.items.filter((item) => ["REQUIRED", "UNKNOWN", "OBSERVED"].includes(item.status)).map((item) => item.id);
  const unknowns = input.items.filter((item) => item.status === "UNKNOWN").map((item) => `EXPEDIENTE_UNKNOWN:${item.id}`);
  const warnings: string[] = [];
  if (!input.items.length) warnings.push("NO_EXPEDIENTE_ITEMS");
  if (input.items.some((item) => item.status !== "APPROVED" && item.status !== "NOT_APPLICABLE")) warnings.push("SPECIALIST_DOCUMENT_REVIEW_PENDING");
  if (!input.costModel) warnings.push("COST_MODEL_NOT_LINKED");
  if (input.costModel?.unknowns.length) warnings.push("COST_MODEL_HAS_UNKNOWN_LINES");

  const presentBimContainers = input.bimContainers.filter((container) => ["PRESENT", "SUBSANATED", "APPROVED"].includes(container.status)).map((container) => container.type);
  const missingBimContainers = DEFAULT_EXPEDIENTE_BIM_CONTAINERS.filter((type) => !presentBimContainers.includes(type));
  const sourceTraceability = input.items.every((item) => item.sourceIds.length > 0) && input.bimContainers.every((container) => container.sourceIds.length > 0) ? "PASS" : "BLOCKED";
  const disciplineCompleteness = input.items.length > 0 && missingItems.length === 0 ? "PASS" : "BLOCKED";
  const bimInformationRequirements = missingBimContainers.length === 0 ? "PASS" : "BLOCKED";
  const costTraceability = input.costModel && input.costModel.warnings.length === 0 && input.costModel.unknowns.length === 0 ? "PASS" : "BLOCKED";
  const allPass = [sourceTraceability, disciplineCompleteness, bimInformationRequirements, costTraceability].every((gate) => gate === "PASS");

  return {
    schema: "ARKI-ETI-BIM-1.0",
    projectId: input.projectId,
    typology: input.typology,
    jurisdiction: input.jurisdiction,
    phase: input.phase,
    blocks,
    requiredBimContainers: DEFAULT_EXPEDIENTE_BIM_CONTAINERS,
    presentBimContainers,
    missingBimContainers,
    missingItems,
    unknowns,
    warnings,
    linkedModel: Boolean(input.bim),
    linkedCostModel: Boolean(input.costModel),
    status: allPass ? "READY_FOR_SPECIALIST_REVIEW" : input.items.length ? "INCOMPLETE" : "DRAFT",
    gates: { sourceTraceability, disciplineCompleteness, bimInformationRequirements, costTraceability, specialistApproval: "PENDING" },
    humanAuthority: "FINAL",
  };
}

export function arkiEtiBimContract() {
  return {
    version: "ARKI-ETI-BIM-1.0",
    principle: "BIM is information management, not only a 3D model.",
    expedienteBlocks: EXPEDIENTE_BLOCK_DESCRIPTIONS,
    requiredBimContainers: DEFAULT_EXPEDIENTE_BIM_CONTAINERS,
    productFlow: "REQUIREMENTS → BEP → INFORMATION CONTAINERS → COORDINATION → DRAWINGS/METRICS/COSTS → APPROVAL → HANDOVER",
    professionalBoundary: "No automatic signature, regulatory approval or specialist calculation is claimed.",
    humanAuthority: "FINAL",
  } as const;
}
