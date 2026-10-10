import { createHash } from "node:crypto";

export type QuantityEvidence = { semanticId: string; agkObjectId: string; ruleId: string; quantity: number; unit: string; provenance: string[] };
export type CostItem = { itemId: string; description: string; unit: string; baselineQuantity: number; unitPrice: number; currency: string; sourceRef: string };
export type CostMapping = { semanticId: string; itemId: string; confidence: number; acceptedBy?: string; evidence: string[] };
export type ProjectCostBaseline = {
  schema: "ARKI-PROJECT-COST-BASELINE-1.0";
  projectId: string;
  baselineId: string;
  effectiveDate: string;
  currency: string;
  location?: string;
  sourceRef: string;
  items: CostItem[];
  immutable: true;
  fingerprint: string;
};
const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");

export function createProjectCostBaseline(input: Omit<ProjectCostBaseline, "schema" | "immutable" | "fingerprint">): ProjectCostBaseline {
  if (!input.projectId.trim() || !input.sourceRef.trim()) throw new Error("COST_BASELINE_PROVENANCE_REQUIRED");
  const ids = new Set<string>();
  for (const item of input.items) {
    if (ids.has(item.itemId)) throw new Error("DUPLICATE_COST_ITEM");
    ids.add(item.itemId);
    if (!Number.isFinite(item.baselineQuantity) || item.baselineQuantity < 0 || !Number.isFinite(item.unitPrice) || item.unitPrice < 0) throw new Error(`INVALID_COST_ITEM:${item.itemId}`);
    if (item.currency !== input.currency) throw new Error(`CURRENCY_MISMATCH:${item.itemId}`);
  }
  const payload = { ...input, schema: "ARKI-PROJECT-COST-BASELINE-1.0" as const, immutable: true as const };
  return { ...payload, fingerprint: hash(payload) };
}

export function evaluateEconomicMutation(input: {
  baseline: ProjectCostBaseline;
  quantitiesBefore: QuantityEvidence[];
  quantitiesAfter: QuantityEvidence[];
  mappings: CostMapping[];
  budgetEnvelope?: number;
}) {
  const before = new Map(input.quantitiesBefore.map(q => [q.semanticId, q]));
  const after = new Map(input.quantitiesAfter.map(q => [q.semanticId, q]));
  const items = new Map(input.baseline.items.map(i => [i.itemId, i]));
  const mappingBySemantic = new Map(input.mappings.map(m => [m.semanticId, m]));
  const semanticIds = new Set([...Array.from(before.keys()), ...Array.from(after.keys())]);
  const deltas: Array<{ semanticId: string; itemId: string; quantityDelta: number; costDelta: number; currency: string; provenance: string[] }> = [];
  const unknowns: string[] = [];
  for (const semanticId of Array.from(semanticIds)) {
    const b = before.get(semanticId); const a = after.get(semanticId);
    const mapping = mappingBySemantic.get(semanticId);
    if (!mapping || mapping.confidence < 1 || !mapping.acceptedBy || !mapping.evidence.length) { unknowns.push(`UNACCEPTED_COST_MAPPING:${semanticId}`); continue; }
    const item = items.get(mapping.itemId);
    if (!item) { unknowns.push(`COST_ITEM_NOT_FOUND:${mapping.itemId}`); continue; }
    if (b && a && (b.unit !== a.unit || a.unit !== item.unit)) { unknowns.push(`QUANTITY_UNIT_MISMATCH:${semanticId}`); continue; }
    const provenance = [...(b?.provenance ?? []), ...(a?.provenance ?? []), ...mapping.evidence, item.sourceRef];
    if (!provenance.length || !(a?.agkObjectId ?? b?.agkObjectId)) { unknowns.push(`QUANTITY_PROVENANCE_REQUIRED:${semanticId}`); continue; }
    const quantityDelta = (a?.quantity ?? 0) - (b?.quantity ?? 0);
    deltas.push({ semanticId, itemId: item.itemId, quantityDelta, costDelta: quantityDelta * item.unitPrice, currency: item.currency, provenance });
  }
  const directCostDelta = deltas.reduce((sum, d) => sum + d.costDelta, 0);
  const baselineTotal = input.baseline.items.reduce((sum, i) => sum + i.baselineQuantity * i.unitPrice, 0);
  const revisedTotal = baselineTotal + directCostDelta;
  const budgetStatus = input.budgetEnvelope === undefined ? "NOT_EVALUATED" : revisedTotal <= input.budgetEnvelope ? "WITHIN_ENVELOPE" : "EXCEEDS_ENVELOPE";
  return {
    schema: "ARKI-ECONOMIC-MUTATION-1.0" as const,
    projectId: input.baseline.projectId,
    baselineFingerprint: input.baseline.fingerprint,
    deltas,
    baselineTotal,
    directCostDelta,
    revisedTotal,
    budgetStatus,
    unknowns,
    status: unknowns.length ? "UNKNOWN" as const : "EVALUATED" as const,
    fingerprint: hash({ baseline: input.baseline.fingerprint, deltas, revisedTotal, unknowns }),
  };
}
