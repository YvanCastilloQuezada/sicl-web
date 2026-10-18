import { createHash, randomBytes } from "node:crypto";
import PDFDocument from "pdfkit";
import { appendOperationalEvent } from "./eventStore";
import { storagePut } from "./storage";
import { MASTER_ORDER_ID } from "../shared/milukitaMasterOrder";

export type ConstitutionalContractDecision = "HUMAN_APPROVED" | "HUMAN_REJECTED";

export async function exportConstitutionalDecisionPdf(input: {
  actorUserId: number;
  decision: ConstitutionalContractDecision;
  comment?: string;
}) {
  const comment = (input.comment ?? "").trim().slice(0, 1000);
  const reportId = `MLK-CONSTITUTION-${randomBytes(8).toString("hex").toUpperCase()}`;
  const document = new PDFDocument({ size: "A4", margin: 46, info: { Title: `Resumen constitucional ${MASTER_ORDER_ID}`, Author: "MiLukita", Subject: "Resumen de decisión humana restringida" } });
  const chunks: Buffer[] = [];
  document.on("data", (chunk: Buffer) => chunks.push(chunk));
  const done = new Promise<Buffer>((resolve, reject) => { document.on("end", () => resolve(Buffer.concat(chunks))); document.on("error", reject); });
  document.fontSize(18).fillColor("#0b3d2e").text("MiLukita — Resumen de revisión constitucional", { align: "center" });
  document.moveDown(0.5).fontSize(9).fillColor("#555555").text(`Contrato: ${MASTER_ORDER_ID} · Generado: ${new Date().toISOString()}`, { align: "center" });
  document.moveDown(1);
  document.fontSize(12).fillColor(input.decision === "HUMAN_APPROVED" ? "#147d5a" : "#a52a2a").text(`Decisión humana: ${input.decision}`);
  document.moveDown(0.4).fontSize(10).fillColor("#222222").text(`Título: ${MASTER_ORDER_ID}`);
  document.text(`Modo: CONSOLIDATION_FREEZE`);
  document.text("Alcance: revisión documental únicamente.");
  document.text(`Comentario: ${comment || "Sin comentario"}`);
  document.moveDown(0.8).fontSize(10).fillColor("#0b3d2e").text("Límites constitucionales");
  document.fontSize(9).fillColor("#222222").text("Esta decisión no concede autoridad sobre MJP CORE, no activa agentes, no habilita distribución externa, no modifica resultados, RNG, RTP, wallet, ledger, settlement ni dinero real.");
  document.moveDown(0.8).text("El resumen es evidencia administrativa de la decisión registrada; no constituye aprobación regulatoria, legal, comercial o productiva.");
  document.end();
  const pdf = await done;
  const stored = await storagePut(`constitutional-review-reports/${reportId}.pdf`, pdf, "application/pdf");
  await appendOperationalEvent({ eventType: "CONSTITUTIONAL_CONTRACT_SUMMARY_EXPORTED_PDF", aggregateType: "constitutional_contract", aggregateId: MASTER_ORDER_ID, actorUserId: input.actorUserId, source: "control_room", payload: { reportId, decision: input.decision, byteSize: pdf.byteLength, authorityGranted: false, scope: "DOCUMENT_REVIEW_ONLY" }, idempotencyKey: `constitutional-review-pdf:${reportId}` });
  return { reportId, url: stored.url, byteSize: pdf.byteLength };
}

export async function recordConstitutionalContractDecision(input: {
  actorUserId: number;
  decision: ConstitutionalContractDecision;
  comment?: string;
}) {
  const comment = (input.comment ?? "").trim().slice(0, 1000);
  const fingerprint = createHash("sha256").update(`${MASTER_ORDER_ID}|${input.actorUserId}|${input.decision}|${comment}`).digest("hex").slice(0, 24);
  return appendOperationalEvent({
    eventType: "CONSTITUTIONAL_CONTRACT_HUMAN_REVIEWED",
    aggregateType: "constitutional_contract",
    aggregateId: MASTER_ORDER_ID,
    actorUserId: input.actorUserId,
    source: "control_room",
    payload: {
      orderId: MASTER_ORDER_ID,
      decision: input.decision,
      comment: comment || null,
      authorityGranted: false,
      coreAccess: "NONE",
      scope: "DOCUMENT_REVIEW_ONLY",
    },
    correlationId: `constitutional-review:${MASTER_ORDER_ID}`,
    idempotencyKey: `constitutional-review:${fingerprint}`,
  });
}
