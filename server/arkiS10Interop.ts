import { createHash } from "node:crypto";
import { z } from "zod";
import { createProjectCostBaseline, type ProjectCostBaseline } from "./arkiProjectEconomicTwin";

export type S10Resource = {
  resourceId: string;
  code: string;
  description: string;
  unit: string;
  unitPrice: number;
  resourceType: "LABOR" | "MATERIAL" | "EQUIPMENT" | "SUBCONTRACT" | "OTHER";
  sourceRef: string;
};

export type S10ApuComponent = {
  resourceId: string;
  quantity: number;
  wasteFactor?: number;
  sourceRef: string;
};

export type S10Apu = {
  apuId: string;
  itemCode: string;
  components: S10ApuComponent[];
  sourceRef: string;
};

export type S10BudgetNode = {
  nodeId: string;
  code: string;
  description: string;
  parentNodeId?: string;
  itemCodes: string[];
  sourceRef: string;
};

export type S10BudgetTotals = {
  directCost: number;
  generalExpenses?: number;
  utility?: number;
  tax?: number;
  total: number;
  sourceRef: string;
};

export type S10NormalizedItem = {
  itemId: string;
  code: string;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  sourceRef: string;
  apuRef?: string;
};

export type S10NormalizedProject = {
  schema: "ARKI-S10-NORMALIZED-1.0";
  projectId: string;
  sourceId: string;
  sourceFormat: "STRUCTURED_EXPORT" | "EXCEL_EXPORT" | "REPORT_EXTRACTION";
  sourceChecksum: string;
  effectiveDate: string;
  currency: string;
  location?: string;
  items: S10NormalizedItem[];
  resources?: S10Resource[];
  apus?: S10Apu[];
  budgetNodes?: S10BudgetNode[];
  declaredTotals?: S10BudgetTotals;
  evidenceState: "VERIFIED_STRUCTURE" | "PARTIAL" | "UNKNOWN";
  unknowns: string[];
  fingerprint: string;
};

function hash(value: unknown) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}
function required(value: string, code: string) {
  if (!value.trim()) throw new Error(code);
}

const S10ItemInputSchema = z.object({
  itemId: z.string().min(1), code: z.string().min(1), description: z.string(), unit: z.string(),
  quantity: z.number().nonnegative(), unitPrice: z.number().nonnegative(), sourceRef: z.string().min(1), apuRef: z.string().optional(),
}).strict();
const S10ResourceInputSchema = z.object({
  resourceId: z.string().min(1), code: z.string().min(1), description: z.string(), unit: z.string(),
  unitPrice: z.number().nonnegative(), resourceType: z.enum(["LABOR", "MATERIAL", "EQUIPMENT", "SUBCONTRACT", "OTHER"]), sourceRef: z.string().min(1),
}).strict();
const S10ApuInputSchema = z.object({
  apuId: z.string().min(1), itemCode: z.string().min(1), sourceRef: z.string().min(1),
  components: z.array(z.object({ resourceId: z.string().min(1), quantity: z.number().nonnegative(), wasteFactor: z.number().nonnegative().optional(), sourceRef: z.string().min(1) }).strict()),
}).strict();
const S10BudgetNodeInputSchema = z.object({
  nodeId: z.string().min(1), code: z.string().min(1), description: z.string(), parentNodeId: z.string().optional(),
  itemCodes: z.array(z.string()), sourceRef: z.string().min(1),
}).strict();
const S10TotalsInputSchema = z.object({
  directCost: z.number().nonnegative(), generalExpenses: z.number().nonnegative().optional(), utility: z.number().nonnegative().optional(),
  tax: z.number().nonnegative().optional(), total: z.number().nonnegative(), sourceRef: z.string().min(1),
}).strict();
const S10EnvelopeSchema = z.object({
  schema: z.literal("ARKI-S10-NORMALIZED-1.0").optional(),
  projectId: z.string().min(1), sourceId: z.string().min(1),
  sourceFormat: z.enum(["STRUCTURED_EXPORT", "EXCEL_EXPORT", "REPORT_EXTRACTION"]),
  sourceChecksum: z.string().min(1), effectiveDate: z.string().min(1), currency: z.string().min(1), location: z.string().optional(),
  items: z.array(S10ItemInputSchema), resources: z.array(S10ResourceInputSchema).optional(), apus: z.array(S10ApuInputSchema).optional(),
  budgetNodes: z.array(S10BudgetNodeInputSchema).optional(), declaredTotals: S10TotalsInputSchema.optional(),
  evidenceState: z.enum(["VERIFIED_STRUCTURE", "PARTIAL", "UNKNOWN"]), unknowns: z.array(z.string()),
}).strict();

export function ingestS10NormalizedEnvelope(value: unknown): S10NormalizedProject {
  const parsed = S10EnvelopeSchema.safeParse(value);
  if (!parsed.success) throw new Error(`S10_ENVELOPE_INVALID:${parsed.error.issues.map(i => i.message).join("|")}`);
  const { schema: _schema, ...input } = parsed.data;
  return normalizeS10Project(input);
}

export function normalizeS10Project(input: Omit<S10NormalizedProject, "schema" | "fingerprint">): S10NormalizedProject {
  required(input.projectId, "S10_PROJECT_REQUIRED");
  required(input.sourceId, "S10_SOURCE_REQUIRED");
  required(input.sourceChecksum, "S10_CHECKSUM_REQUIRED");
  required(input.effectiveDate, "S10_EFFECTIVE_DATE_REQUIRED");
  required(input.currency, "S10_CURRENCY_REQUIRED");
  const ids = new Set<string>();
  const codes = new Set<string>();
  for (const item of input.items) {
    required(item.itemId, "S10_ITEM_ID_REQUIRED");
    required(item.code, `S10_ITEM_CODE_REQUIRED:${item.itemId}`);
    required(item.sourceRef, `S10_ITEM_PROVENANCE_REQUIRED:${item.itemId}`);
    if (ids.has(item.itemId)) throw new Error(`S10_DUPLICATE_ITEM_ID:${item.itemId}`);
    if (codes.has(item.code)) throw new Error(`S10_DUPLICATE_ITEM_CODE:${item.code}`);
    if (!Number.isFinite(item.quantity) || item.quantity < 0) throw new Error(`S10_INVALID_QUANTITY:${item.itemId}`);
    if (!Number.isFinite(item.unitPrice) || item.unitPrice < 0) throw new Error(`S10_INVALID_UNIT_PRICE:${item.itemId}`);
    ids.add(item.itemId); codes.add(item.code);
  }
  const resourceIds = new Set<string>();
  for (const resource of input.resources ?? []) {
    required(resource.resourceId, "S10_RESOURCE_ID_REQUIRED");
    required(resource.code, `S10_RESOURCE_CODE_REQUIRED:${resource.resourceId}`);
    required(resource.sourceRef, `S10_RESOURCE_PROVENANCE_REQUIRED:${resource.resourceId}`);
    if (resourceIds.has(resource.resourceId)) throw new Error(`S10_DUPLICATE_RESOURCE_ID:${resource.resourceId}`);
    if (!Number.isFinite(resource.unitPrice) || resource.unitPrice < 0) throw new Error(`S10_INVALID_RESOURCE_PRICE:${resource.resourceId}`);
    resourceIds.add(resource.resourceId);
  }
  const apuIds = new Set<string>();
  for (const apu of input.apus ?? []) {
    required(apu.apuId, "S10_APU_ID_REQUIRED");
    required(apu.sourceRef, `S10_APU_PROVENANCE_REQUIRED:${apu.apuId}`);
    if (apuIds.has(apu.apuId)) throw new Error(`S10_DUPLICATE_APU_ID:${apu.apuId}`);
    if (!codes.has(apu.itemCode)) throw new Error(`S10_APU_ITEM_NOT_FOUND:${apu.apuId}`);
    for (const component of apu.components) {
      if (!resourceIds.has(component.resourceId)) throw new Error(`S10_APU_RESOURCE_NOT_FOUND:${apu.apuId}:${component.resourceId}`);
      if (!Number.isFinite(component.quantity) || component.quantity < 0) throw new Error(`S10_INVALID_APU_QUANTITY:${apu.apuId}`);
      if (component.wasteFactor !== undefined && (!Number.isFinite(component.wasteFactor) || component.wasteFactor < 0)) throw new Error(`S10_INVALID_WASTE_FACTOR:${apu.apuId}`);
      required(component.sourceRef, `S10_APU_COMPONENT_PROVENANCE_REQUIRED:${apu.apuId}`);
    }
    apuIds.add(apu.apuId);
  }
  for (const item of input.items) {
    if (item.apuRef && !apuIds.has(item.apuRef)) throw new Error(`S10_ITEM_APU_NOT_FOUND:${item.itemId}:${item.apuRef}`);
  }
  const nodeIds = new Set<string>();
  for (const node of input.budgetNodes ?? []) {
    if (nodeIds.has(node.nodeId)) throw new Error(`S10_DUPLICATE_BUDGET_NODE_ID:${node.nodeId}`);
    nodeIds.add(node.nodeId);
  }
  for (const node of input.budgetNodes ?? []) {
    required(node.nodeId, "S10_BUDGET_NODE_ID_REQUIRED");
    required(node.sourceRef, `S10_BUDGET_NODE_PROVENANCE_REQUIRED:${node.nodeId}`);
    if (node.parentNodeId && !nodeIds.has(node.parentNodeId)) throw new Error(`S10_BUDGET_PARENT_NOT_FOUND:${node.nodeId}`);
    if (node.itemCodes.some(code => !codes.has(code))) throw new Error(`S10_BUDGET_ITEM_NOT_FOUND:${node.nodeId}`);
  }
  if (input.declaredTotals) {
    required(input.declaredTotals.sourceRef, "S10_TOTALS_PROVENANCE_REQUIRED");
    for (const [key, value] of Object.entries(input.declaredTotals)) {
      if (key !== "sourceRef" && value !== undefined && (typeof value !== "number" || !Number.isFinite(value) || value < 0)) throw new Error(`S10_INVALID_TOTAL:${key}`);
    }
  }
  const payload = { ...input, schema: "ARKI-S10-NORMALIZED-1.0" as const };
  return { ...payload, fingerprint: hash(payload) };
}

export function toProjectCostBaseline(project: S10NormalizedProject): ProjectCostBaseline {
  return createProjectCostBaseline({
    projectId: project.projectId,
    baselineId: `S10:${project.sourceId}`,
    effectiveDate: project.effectiveDate,
    currency: project.currency,
    location: project.location,
    sourceRef: `S10:${project.sourceId}:${project.sourceChecksum}`,
    items: project.items.map(item => ({
      itemId: item.itemId,
      description: item.description,
      unit: item.unit,
      baselineQuantity: item.quantity,
      unitPrice: item.unitPrice,
      currency: project.currency,
      sourceRef: item.sourceRef,
    })),
  });
}

export function verifyS10Totals(project: S10NormalizedProject, tolerance = 0.01) {
  if (!Number.isFinite(tolerance) || tolerance < 0) throw new Error("S10_INVALID_TOLERANCE");
  const calculatedDirectCost = project.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  if (!project.declaredTotals) return {
    status: "UNKNOWN" as const,
    calculatedDirectCost,
    declaredDirectCost: undefined,
    delta: undefined,
    tolerance,
    unknowns: ["S10_DECLARED_TOTALS_NOT_AVAILABLE"],
  };
  const delta = calculatedDirectCost - project.declaredTotals.directCost;
  const calculatedDeclaredFootTotal =
    project.declaredTotals.directCost
    + (project.declaredTotals.generalExpenses ?? 0)
    + (project.declaredTotals.utility ?? 0)
    + (project.declaredTotals.tax ?? 0);
  const footDelta = calculatedDeclaredFootTotal - project.declaredTotals.total;
  const reconciled = Math.abs(delta) <= tolerance && Math.abs(footDelta) <= tolerance;
  return {
    status: reconciled ? "RECONCILED" as const : "MISMATCH" as const,
    calculatedDirectCost,
    declaredDirectCost: project.declaredTotals.directCost,
    delta,
    calculatedDeclaredFootTotal,
    declaredTotal: project.declaredTotals.total,
    footDelta,
    tolerance,
    unknowns: [] as string[],
  };
}

export function verifyS10Apus(project: S10NormalizedProject, tolerance = 0.01) {
  if (!Number.isFinite(tolerance) || tolerance < 0) throw new Error("S10_INVALID_TOLERANCE");
  const resources = new Map((project.resources ?? []).map(r => [r.resourceId, r]));
  const items = new Map(project.items.map(i => [i.code, i]));
  const results = (project.apus ?? []).map(apu => {
    const item = items.get(apu.itemCode)!;
    const calculatedUnitPrice = apu.components.reduce((sum, component) => {
      const resource = resources.get(component.resourceId)!;
      return sum + component.quantity * (1 + (component.wasteFactor ?? 0)) * resource.unitPrice;
    }, 0);
    const delta = calculatedUnitPrice - item.unitPrice;
    return {
      apuId: apu.apuId,
      itemCode: apu.itemCode,
      calculatedUnitPrice,
      declaredUnitPrice: item.unitPrice,
      delta,
      status: Math.abs(delta) <= tolerance ? "RECONCILED" as const : "MISMATCH" as const,
      provenance: [apu.sourceRef, item.sourceRef, ...apu.components.map(x => x.sourceRef)],
    };
  });
  return {
    status: results.some(r => r.status === "MISMATCH") ? "MISMATCH" as const : results.length ? "RECONCILED" as const : "UNKNOWN" as const,
    tolerance,
    results,
    unknowns: results.length ? [] : ["S10_APU_NOT_AVAILABLE"],
  };
}

export type S10ReconciliationChange = {
  itemId: string;
  code: string;
  kind: "ADDED" | "REMOVED" | "QUANTITY_CHANGED" | "PRICE_CHANGED" | "APU_CHANGED" | "RESOURCE_PRICE_CHANGED" | "TOTAL_CHANGED";
  before?: number | string;
  after?: number | string;
};

export function reconcileS10Projects(before: S10NormalizedProject, after: S10NormalizedProject) {
  if (before.projectId !== after.projectId) throw new Error("S10_RECONCILIATION_PROJECT_MISMATCH");
  if (before.currency !== after.currency) throw new Error("S10_RECONCILIATION_CURRENCY_MISMATCH");
  const beforeByCode = new Map(before.items.map(i => [i.code, i]));
  const afterByCode = new Map(after.items.map(i => [i.code, i]));
  const changes: S10ReconciliationChange[] = [];
  for (const [code, oldItem] of beforeByCode) {
    const next = afterByCode.get(code);
    if (!next) { changes.push({ itemId: oldItem.itemId, code, kind: "REMOVED" }); continue; }
    if (oldItem.quantity !== next.quantity) changes.push({ itemId: next.itemId, code, kind: "QUANTITY_CHANGED", before: oldItem.quantity, after: next.quantity });
    if (oldItem.unitPrice !== next.unitPrice) changes.push({ itemId: next.itemId, code, kind: "PRICE_CHANGED", before: oldItem.unitPrice, after: next.unitPrice });
    if ((oldItem.apuRef ?? "") !== (next.apuRef ?? "")) changes.push({ itemId: next.itemId, code, kind: "APU_CHANGED", before: oldItem.apuRef ?? "", after: next.apuRef ?? "" });
  }
  for (const [code, item] of afterByCode) if (!beforeByCode.has(code)) changes.push({ itemId: item.itemId, code, kind: "ADDED" });
  const beforeResources = new Map((before.resources ?? []).map(r => [r.code, r]));
  const afterResources = new Map((after.resources ?? []).map(r => [r.code, r]));
  for (const [code, oldResource] of beforeResources) {
    const next = afterResources.get(code);
    if (next && oldResource.unitPrice !== next.unitPrice) changes.push({ itemId: next.resourceId, code, kind: "RESOURCE_PRICE_CHANGED", before: oldResource.unitPrice, after: next.unitPrice });
  }
  if (before.declaredTotals && after.declaredTotals && before.declaredTotals.total !== after.declaredTotals.total) {
    changes.push({ itemId: "BUDGET_TOTAL", code: "TOTAL", kind: "TOTAL_CHANGED", before: before.declaredTotals.total, after: after.declaredTotals.total });
  }
  const direct = (p: S10NormalizedProject) => p.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  return {
    schema: "ARKI-S10-RECONCILIATION-1.0" as const,
    projectId: before.projectId,
    beforeFingerprint: before.fingerprint,
    afterFingerprint: after.fingerprint,
    changes,
    directCostBefore: direct(before),
    directCostAfter: direct(after),
    directCostDelta: direct(after) - direct(before),
    status: before.evidenceState === "VERIFIED_STRUCTURE" && after.evidenceState === "VERIFIED_STRUCTURE" ? "RECONCILED" as const : "PARTIAL" as const,
    unknowns: [...before.unknowns.map(x => `BEFORE:${x}`), ...after.unknowns.map(x => `AFTER:${x}`)],
    writeBackClaim: false as const,
  };
}

export const S10_INTEROP_BOUNDARY = Object.freeze({
  implemented: ["NORMALIZE", "BUDGET_HIERARCHY", "APU_RESOURCES", "TOTAL_RECONCILIATION", "RECONCILE", "PROJECT_COST_BASELINE_PROJECTION"],
  notClaimed: ["NATIVE_S10_WRITE", "S10_ROUND_TRIP"],
  sourceAuthority: "PROJECT_LOCAL_EVIDENCE",
  canonicalGeometryAuthority: false,
  canonicalSemanticAuthority: false,
} as const);
