import { strict as assert } from "node:assert";
import { generateConstructionModel, APU_DATABASE } from "../shared/arkiConstructionOntology";
import { fromApuDatabase } from "../shared/arkiPriceBook";
import { createInitialSnapshot, type ProjectSnapshot } from "../shared/arkiRecalculation";
import { compileTechnicalDossier, type ApprovedSnapshot } from "../shared/arkiTechnicalDossierCompiler";

function fixture(): ApprovedSnapshot {
  const model = generateConstructionModel({ projectId: "E8A-PROJECT-001", name: "E8-A Fixture", widthM: 16.5, depthM: 9.75, floors: 4 });
  const priceBook = fromApuDatabase(APU_DATABASE, {
    id: "PB-E8A",
    version: 1,
    region: "La Libertad",
    country: "PE",
    currency: "PEN",
    validFrom: "2026-09-23",
  });
  const snapshot = createInitialSnapshot({ model, instances: [], priceBook, formworkRulesVersion: 1 });
  return {
    ...snapshot,
    approval: { gateStatus: "approved", approvedBy: "Product Owner", approvedAt: "2026-09-23T23:30:00.000Z" },
  };
}

function withoutApproval(snapshot: ApprovedSnapshot): ProjectSnapshot & { approval: { gateStatus: "pending"; approvedBy: string; approvedAt: string } } {
  return {
    ...snapshot,
    approval: { gateStatus: "pending", approvedBy: "", approvedAt: "" },
  };
}

const snapshot = fixture();

// E8A-01 — snapshot aprobado obligatorio.
assert.throws(() => compileTechnicalDossier(withoutApproval(snapshot) as never), /E8A_REQUIRES_APPROVED_SNAPSHOT|E8A_APPROVAL_PROVENANCE_REQUIRED/);
console.log("E8A-01 PASS — unapproved snapshot rejected");

// E8A-02 — compilación mínima end-to-end.
const dossier = compileTechnicalDossier(snapshot);
assert.equal(dossier.status, "COMPILED");
assert.deepEqual(dossier.documents.map((item) => item.kind), ["memoria", "especificaciones", "metrados", "presupuesto", "plano"]);
assert(dossier.documents.every((item) => item.content.length > 0));
console.log("E8A-02 PASS — five technical documents compiled");

// E8A-03 — trazabilidad completa al snapshot y a elementos BIM.
assert(dossier.documents.every((item) => item.traceability.sourceSnapshotId === snapshot.id));
assert(dossier.documents.every((item) => item.traceability.sourceVersion === snapshot.version));
assert(dossier.documents.find((item) => item.kind === "metrados")!.traceability.elementIds.length > 0);
console.log("E8A-03 PASS — snapshot/version/element traceability preserved");

// E8A-04 — contenidos materiales y plano con IDs de elementos.
const budget = dossier.documents.find((item) => item.kind === "presupuesto")!;
const plan = dossier.documents.find((item) => item.kind === "plano")!;
assert(budget.content.includes(`S/ ${snapshot.budget.totalPen.toFixed(2)}`));
assert(plan.content.includes("data-element-id"));
assert(plan.content.includes(snapshot.id));
console.log("E8A-04 PASS — budget and traceable plan emitted");

console.log(JSON.stringify({ status: "PASS", schema: dossier.schema, snapshotId: dossier.sourceSnapshotId, version: dossier.sourceVersion, documents: dossier.documents.map((item) => item.fileName), tracedElements: dossier.documents.reduce((sum, item) => sum + item.traceability.elementIds.length, 0) }, null, 2));
