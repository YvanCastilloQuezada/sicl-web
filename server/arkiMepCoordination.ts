import { detectBimInterferences, type BimViewerModel, type BimViewerElement } from "./arkiBimViewer";

export type MepCoordinationStatus = "BLOCKED" | "REVIEW_REQUIRED" | "READY_FOR_SPECIALIST_REVIEW";

type MepUnknown = {
  elementId: string;
  discipline: string;
  reason: string;
  requiredEvidence: string;
};

function isFiniteBox(value: unknown): value is { min: [number, number, number]; max: [number, number, number] } {
  if (!value || typeof value !== "object") return false;
  const box = value as { min?: unknown; max?: unknown };
  return [box.min, box.max].every((point) => Array.isArray(point) && point.length === 3 && point.every((coordinate) => typeof coordinate === "number" && Number.isFinite(coordinate)));
}

function isModel(value: unknown): value is BimViewerModel {
  if (!value || typeof value !== "object") return false;
  const model = value as Partial<BimViewerModel>;
  return typeof model.modelId === "string" && typeof model.name === "string" && typeof model.format === "string" && typeof model.units === "string" && typeof model.coordinateSystem === "string" && Array.isArray(model.elements) && model.elements.every((element) => {
    if (!element || typeof element !== "object") return false;
    const candidate = element as Partial<BimViewerElement>;
    return typeof candidate.id === "string" && typeof candidate.kind === "string" && typeof candidate.discipline === "string" && typeof candidate.sourceId === "string" && isFiniteBox(candidate.box);
  });
}

function missingMetadata(element: BimViewerElement): MepUnknown[] {
  if (!["DUCT", "PIPE", "CABLE_TRAY", "EQUIPMENT"].includes(element.kind)) return [];
  const properties = element.properties ?? {};
  const unknowns: MepUnknown[] = [];
  if (typeof properties.system !== "string" && typeof properties.systemType !== "string") unknowns.push({ elementId: element.id, discipline: element.discipline, reason: "Sistema MEP no identificado", requiredEvidence: "system o systemType" });
  if (typeof properties.elevationM !== "number") unknowns.push({ elementId: element.id, discipline: element.discipline, reason: "Cota de instalación ausente", requiredEvidence: "elevationM" });
  if (element.kind === "EQUIPMENT" && typeof properties.maintenanceClearanceM !== "number") unknowns.push({ elementId: element.id, discipline: element.discipline, reason: "Área de mantenimiento no documentada", requiredEvidence: "maintenanceClearanceM" });
  return unknowns;
}

export function mepCoordinationContract() {
  return {
    schema: "ARKI-MEP-COORDINATION-1.0",
    scope: ["UNIT_AND_COORDINATE_CHECK", "AABB_CLASH_CANDIDATES", "MEP_METADATA_COMPLETENESS", "ISSUE_REGISTER"],
    statusPolicy: "No engineering approval is inferred; specialist review remains mandatory.",
    requiredEvidence: ["discipline ownership", "units", "coordinate system", "system identity", "installation elevation", "maintenance clearance where applicable"],
    limitations: ["AABB candidates are not a substitute for swept-volume, clearance, fire, acoustic, hydraulic, electrical or structural calculations.", "Definitive project status requires signed discipline packages and verified code sources."],
    humanReviewRequired: true as const,
  } as const;
}

export function coordinateMepModels(input: { models: unknown[]; tolerance?: number }) {
  const tolerance = input.tolerance ?? 0.001;
  if (!Number.isFinite(tolerance) || tolerance <= 0 || tolerance > 1) throw new Error("INVALID_MEP_COORDINATION_TOLERANCE");
  if (input.models.length === 0 || input.models.length > 100 || !input.models.every(isModel)) {
    return { schema: "ARKI-MEP-COORDINATION-1.0" as const, status: "BLOCKED" as const, reason: "INVALID_MODEL_CONTRACT", modelCount: input.models.length, humanReviewRequired: true as const };
  }
  const models = input.models as BimViewerModel[];
  const units = Array.from(new Set(models.map((model) => model.units)));
  const coordinateSystems = Array.from(new Set(models.map((model) => model.coordinateSystem)));
  if (units.length !== 1 || coordinateSystems.length !== 1) {
    return { schema: "ARKI-MEP-COORDINATION-1.0" as const, status: "BLOCKED" as const, reason: "INCONSISTENT_UNITS_OR_COORDINATE_SYSTEM", units, coordinateSystems, modelCount: models.length, humanReviewRequired: true as const };
  }
  const clashes = detectBimInterferences(models, tolerance);
  const unknowns = models.flatMap((model) => model.elements.flatMap(missingMetadata));
  const pairMatrix = clashes.interferences.reduce<Record<string, number>>((accumulator, issue) => {
    const key = [...issue.disciplines].sort().join(" ↔ ");
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});
  const status: MepCoordinationStatus = clashes.interferences.length > 0 || unknowns.length > 0 ? "REVIEW_REQUIRED" : "READY_FOR_SPECIALIST_REVIEW";
  return {
    schema: "ARKI-MEP-COORDINATION-1.0" as const,
    status,
    modelCount: models.length,
    units: units[0],
    coordinateSystem: coordinateSystems[0],
    checkedPairs: clashes.checkedPairs,
    interferences: clashes.interferences,
    pairMatrix,
    unknowns,
    gates: ["HUMAN_SPECIALIST_REVIEW", "DISCIPLINE_SIGNOFF", "CODE_SOURCE_VERIFICATION", "FINAL_COORDINATION_FREEZE"],
    downstreamGate: "PROFESSIONAL_REVIEW_REQUIRED",
    humanReviewRequired: true as const,
    limitations: mepCoordinationContract().limitations,
  };
}
