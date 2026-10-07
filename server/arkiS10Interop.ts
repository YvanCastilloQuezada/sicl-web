import { createHash } from "node:crypto";
import { createProjectCostBaseline, type ProjectCostBaseline } from "./arkiProjectEconomicTwin";

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

export type S10ReconciliationChange = {
  itemId: string;
  code: string;
  kind: "ADDED" | "REMOVED" | "QUANTITY_CHANGED" | "PRICE_CHANGED" | "APU_CHANGED";
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
  implemented: ["NORMALIZE", "RECONCILE", "PROJECT_COST_BASELINE_PROJECTION"],
  notClaimed: ["NATIVE_S10_WRITE", "S10_ROUND_TRIP"],
  sourceAuthority: "PROJECT_LOCAL_EVIDENCE",
  canonicalGeometryAuthority: false,
  canonicalSemanticAuthority: false,
} as const);
