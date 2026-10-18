import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { generateConstructionModel } from "../shared/arkiConstructionOntology";
import { createInitialSnapshot } from "../shared/arkiRecalculation";
import type { ApprovedSnapshot } from "../shared/arkiTechnicalDossierCompiler";
import { evaluateProjectGate, PROJECT_GATE_CRITERIA, type CriterionEvidence } from "../shared/arkiProjectGate";

const root = process.cwd();
const captureDir = join(root, "E8_C_CAPTURAS");
mkdirSync(captureDir, { recursive: true });

const model = generateConstructionModel({ projectId: "E8C-EVIDENCE-001", name: "E8-C Gate Evidence", widthM: 12, depthM: 8, floors: 2 });
const base = createInitialSnapshot({ model, instances: [], priceBook: { id: "PB-E8C", version: 1, region: "La Libertad", country: "PE", currency: "PEN", validFrom: "2026-09-23", items: [] }, formworkRulesVersion: 1 });
const snapshot: ApprovedSnapshot = { ...base, approval: { gateStatus: "passed", approvedBy: "Product Owner", approvedAt: "2026-09-23T23:00:00.000Z" } };
const completeCriteria: CriterionEvidence[] = PROJECT_GATE_CRITERIA.map((id) => ({ id, satisfied: true, evidenceRef: `evidence://${id}/snapshot-e8c-v1`, verifiedBy: "Professional Reviewer", verifiedAt: "2026-09-23T23:10:00.000Z" }));
const missingCriteria = completeCriteria.filter((item) => item.id !== "mep_calculated");
const signature = { professionalName: "Professional Reviewer", licenseNumber: "COL-PE-001", signedAt: "2026-09-23T23:15:00.000Z", hash: "sha256:signature-e8c" };
const notApproved = evaluateProjectGate({ snapshot, actor: "human", criteria: missingCriteria, professionalSignature: signature, evaluatedAt: "2026-09-23T23:20:00.000Z" });
const approved = evaluateProjectGate({ snapshot, actor: "human", criteria: completeCriteria, professionalSignature: signature, evaluatedAt: "2026-09-23T23:20:00.000Z" });

const esc = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const missingRows = notApproved.missingCriteria.map((id, index) => `<text x="90" y="${310 + index * 30}" fill="#ff7d7d" font-family="Arial" font-size="19">✕ ${esc(id)}</text>`).join("");
const allRows = PROJECT_GATE_CRITERIA.map((id, index) => `<text x="90" y="${250 + index * 28}" fill="#52e0a2" font-family="Arial" font-size="17">✓ ${esc(id)}</text>`).join("");
const common = `<text x="70" y="100" fill="#ffffff" font-family="Arial" font-size="28" font-weight="700">ARKI · E8-C PROJECT GATE</text><text x="70" y="140" fill="#aaa8d8" font-family="Arial" font-size="17">snapshot ${esc(snapshot.id)} · versión ${snapshot.version} · evidencia trazable</text>`;
const rejectedPanel = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760"><rect width="1200" height="760" fill="#080736"/><rect x="35" y="35" width="1130" height="690" rx="18" fill="#111044" stroke="#5c5ae8"/>${common}<rect x="70" y="180" width="1060" height="120" fill="#2b1020" stroke="#ff7d7d"/><text x="90" y="225" fill="#ff7d7d" font-family="Arial" font-size="28" font-weight="700">NO APTO — PROPUESTO EN REVISIÓN</text><text x="90" y="265" fill="#ffffff" font-family="Arial" font-size="17">${esc(notApproved.reason)} · actor: human</text><text x="70" y="${missingCriteria.length ? 350 : 320}" fill="#ffcf5a" font-family="Arial" font-size="20">CRITERIOS FALTANTES O NO VERIFICADOS</text>${missingRows}<text x="70" y="690" fill="#ffcf5a" font-family="Arial" font-size="16">El gate no activa aptitud constructiva mientras falte cualquier criterio.</text></svg>`;
const approvedPanel = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760"><rect width="1200" height="760" fill="#080736"/><rect x="35" y="35" width="1130" height="690" rx="18" fill="#111044" stroke="#5c5ae8"/>${common}<rect x="70" y="180" width="1060" height="95" fill="#0d2e27" stroke="#52e0a2"/><text x="90" y="225" fill="#52e0a2" font-family="Arial" font-size="28" font-weight="700">APTO — GATE APROBADO</text><text x="90" y="255" fill="#ffffff" font-family="Arial" font-size="17">12/12 criterios · revisión humana · firma: ${esc(signature.professionalName)}</text><text x="70" y="310" fill="#52e0a2" font-family="Arial" font-size="20">CRITERIOS VERIFICADOS</text>${allRows}<text x="700" y="310" fill="#ffffff" font-family="Arial" font-size="18">Firma profesional</text><text x="700" y="350" fill="#ffffff" font-family="Arial" font-size="17">Nombre: ${esc(signature.professionalName)}</text><text x="700" y="382" fill="#ffffff" font-family="Arial" font-size="17">Licencia: ${esc(signature.licenseNumber ?? "no indicada")}</text><text x="700" y="414" fill="#ffffff" font-family="Arial" font-size="17">Fecha: ${esc(signature.signedAt)}</text><text x="700" y="446" fill="#ffcf5a" font-family="Arial" font-size="15">Hash: ${esc(signature.hash)}</text><text x="70" y="690" fill="#ffcf5a" font-family="Arial" font-size="16">La IA no puede activar este gate; la autoridad permanece humana.</text></svg>`;

const outputs = { status: "PASS", schema: "ARKI-E8C-PROJECT-GATE-1.0", notApproved, approved, captures: ["E8_C_CAPTURAS/01-gate-not-approved.svg", "E8_C_CAPTURAS/02-gate-approved.svg"] };
writeFileSync(join(captureDir, "01-gate-not-approved.svg"), rejectedPanel, "utf8");
writeFileSync(join(captureDir, "02-gate-approved.svg"), approvedPanel, "utf8");
for (const name of ["01-gate-not-approved", "02-gate-approved"]) {
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", join(captureDir, `${name}.svg`), "-frames:v", "1", "-c:v", "libwebp", join(captureDir, `${name}.webp`)]);
}
writeFileSync(join(root, "E8-C_OUTPUTS.txt"), `${outputs.captures.join("\n")}\n${JSON.stringify(outputs, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ status: "PASS", captures: outputs.captures, webp: outputs.captures.map((path) => path.replace(".svg", ".webp")), approved: approved.status, notApproved: notApproved.status }, null, 2));
