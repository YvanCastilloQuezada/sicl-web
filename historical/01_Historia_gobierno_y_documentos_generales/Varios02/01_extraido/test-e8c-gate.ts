import { strict as assert } from "node:assert";
import { generateConstructionModel } from "../shared/arkiConstructionOntology";
import { createInitialSnapshot } from "../shared/arkiRecalculation";
import type { ApprovedSnapshot } from "../shared/arkiTechnicalDossierCompiler";
import { evaluateProjectGate, PROJECT_GATE_CRITERIA, type CriterionEvidence } from "../shared/arkiProjectGate";

const baseSnapshot = (): ApprovedSnapshot => {
  const model = generateConstructionModel({ projectId: "E8C-PROJECT-001", name: "E8-C Gate Fixture", widthM: 12, depthM: 8, floors: 2 });
  const base = createInitialSnapshot({ model, instances: [], priceBook: { id: "PB-E8C", version: 1, region: "La Libertad", country: "PE", currency: "PEN", validFrom: "2026-09-23", items: [] }, formworkRulesVersion: 1 });
  return { ...base, approval: { gateStatus: "passed", approvedBy: "Product Owner", approvedAt: "2026-09-23T23:00:00.000Z" } };
};

const criteria = (): CriterionEvidence[] => PROJECT_GATE_CRITERIA.map((id) => ({
  id,
  satisfied: true,
  evidenceRef: `evidence://${id}/snapshot-e8c-v1`,
  verifiedBy: "Professional Reviewer",
  verifiedAt: "2026-09-23T23:10:00.000Z",
}));

const signature = { professionalName: "Professional Reviewer", licenseNumber: "COL-PE-001", signedAt: "2026-09-23T23:15:00.000Z", hash: "sha256:signature-e8c" };
const fixedTime = "2026-09-23T23:20:00.000Z";

const complete = { snapshot: baseSnapshot(), actor: "human" as const, criteria: criteria(), professionalSignature: signature, evaluatedAt: fixedTime };

const ai = evaluateProjectGate({ ...complete, actor: "ai" });
assert.equal(ai.status, "not_approved");
assert.equal(ai.reason, "GATE_NEVER_APPROVED_BY_AI");
console.log("E8C-01 PASS — actor ai is never approved");

const unapproved = evaluateProjectGate({ ...complete, snapshot: { ...complete.snapshot, approval: { ...complete.snapshot.approval, gateStatus: "pending" } } as never });
assert.equal(unapproved.status, "not_approved");
assert.equal(unapproved.reason, "E8C_REQUIRES_APPROVED_SNAPSHOT");
console.log("E8C-02 PASS — unapproved snapshot rejected");

const incompleteCriteria = criteria().filter((item) => item.id !== "mep_calculated");
const missing = evaluateProjectGate({ ...complete, criteria: incompleteCriteria });
assert.equal(missing.status, "not_approved");
assert.deepEqual(missing.missingCriteria, ["mep_calculated"]);
console.log("E8C-03 PASS — missing criterion is reported");

const approved = evaluateProjectGate(complete);
assert.equal(approved.status, "approved");
assert.deepEqual(approved.missingCriteria, []);
assert.equal(approved.actor, "human");
console.log("E8C-04 PASS — twelve human-verified criteria plus signature approved");

console.log(JSON.stringify({ status: "PASS", schema: "ARKI-E8C-PROJECT-GATE-1.0", criteria: PROJECT_GATE_CRITERIA.length, ai: ai.reason, missing: missing.missingCriteria, approved: approved.status }, null, 2));
