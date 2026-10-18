import { randomBytes, randomUUID } from "node:crypto";
import PDFDocument from "pdfkit";
import { storagePut } from "./storage";
import { and, desc, eq, gte, isNull, lte } from "drizzle-orm";
import { lrciReviewCases, lrciReviewNotifications, operationalEvents } from "../drizzle/schema";
import { appendOperationalEvent } from "./eventStore";
import { getDb } from "./db";

export const LRCI_CASE_STATUSES = ["NO_DATA", "TECHNICAL_CONTROL_ONLY", "REQUIRES_PROFESSIONAL_REVIEW", "POLICY_BLOCKED", "SOURCE_EXPIRED", "HUMAN_APPROVED", "REJECTED"] as const;
export type LrciCaseStatus = (typeof LRCI_CASE_STATUSES)[number];
export const LRCI_INITIAL_STATUS: LrciCaseStatus = "REQUIRES_PROFESSIONAL_REVIEW";
export const normalizeLrciJurisdiction = (value: string) => value.trim().toUpperCase();
export const isLrciCaseExpired = (expiresAt: Date | null | undefined, now = new Date()) => Boolean(expiresAt && expiresAt.getTime() <= now.getTime());
export const isHumanDecisionStatus = (status: LrciCaseStatus) => status === "HUMAN_APPROVED" || status === "REJECTED";

export type CreateLrciReviewCaseInput = {
  actorUserId: number;
  title: string;
  domain: string;
  scope: string;
  jurisdiction: string;
  expiresAt?: Date | null;
  responsibleUserId?: number;
  responsibleLabel: string;
  sourceRef?: string;
  evidenceSummary?: string;
};

export async function listLrciReviewCases(filters?: { status?: LrciCaseStatus; jurisdiction?: string }): Promise<(typeof lrciReviewCases.$inferSelect)[]> {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (filters?.status) conditions.push(eq(lrciReviewCases.status, filters.status));
  if (filters?.jurisdiction) conditions.push(eq(lrciReviewCases.jurisdiction, filters.jurisdiction));
  return db.select().from(lrciReviewCases).where(conditions.length ? and(...conditions) : undefined).orderBy(desc(lrciReviewCases.updatedAt));
}

export async function createLrciReviewCase(input: CreateLrciReviewCaseInput) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible para registrar el caso LRCI.");
  const publicId = `LRCI-${randomUUID().replaceAll("-", "").slice(0, 20).toUpperCase()}`;
  await db.transaction(async (tx) => {
    await tx.insert(lrciReviewCases).values({
      publicId,
      title: input.title.trim(),
      domain: input.domain.trim(),
      status: LRCI_INITIAL_STATUS,
      scope: input.scope.trim(),
      jurisdiction: normalizeLrciJurisdiction(input.jurisdiction),
      expiresAt: input.expiresAt,
      responsibleUserId: input.responsibleUserId,
      responsibleLabel: input.responsibleLabel.trim(),
      sourceRef: input.sourceRef?.trim() || null,
      evidenceSummary: input.evidenceSummary?.trim() || null,
      createdByUserId: input.actorUserId,
    });
    await appendOperationalEvent({ eventType: "LRCI_REVIEW_CASE_CREATED", aggregateType: "lrci_review_case", aggregateId: publicId, actorUserId: input.actorUserId, source: "human_authority", payload: { status: LRCI_INITIAL_STATUS, scope: input.scope.trim(), jurisdiction: normalizeLrciJurisdiction(input.jurisdiction), expiresAt: input.expiresAt?.toISOString() ?? null, responsibleLabel: input.responsibleLabel.trim() }, idempotencyKey: `lrci-case-create:${publicId}` }, tx);
  });
  const rows = await db.select().from(lrciReviewCases).where(eq(lrciReviewCases.publicId, publicId)).limit(1);
  return rows[0];
}

export async function syncLrciExpiryNotifications() {
  const db = await getDb();
  if (!db) return 0;
  const now = Date.now();
  const horizon = now + 7 * 24 * 60 * 60 * 1000;
  const cases = await db.select().from(lrciReviewCases);
  let created = 0;
  for (const item of cases) {
    if (!item.expiresAt || item.status === "HUMAN_APPROVED" || item.status === "REJECTED") continue;
    const expiry = item.expiresAt.getTime();
    const kind = expiry <= now ? "EXPIRED" : expiry <= horizon ? "EXPIRING_SOON" : null;
    if (!kind) continue;
    const existing = await db.select().from(lrciReviewNotifications).where(and(eq(lrciReviewNotifications.casePublicId, item.publicId), eq(lrciReviewNotifications.kind, kind))).limit(1);
    if (existing[0]) continue;
    const publicId = `LRCI-N-${randomUUID().replaceAll("-", "").slice(0, 18).toUpperCase()}`;
    await db.insert(lrciReviewNotifications).values({ publicId, casePublicId: item.publicId, kind, severity: kind === "EXPIRED" ? "CRITICAL" : "HIGH", title: kind === "EXPIRED" ? `Caso vencido: ${item.title}` : `Caso próximo a vencer: ${item.title}`, message: kind === "EXPIRED" ? "La evidencia jurídica está vencida. Suspender reutilización y escalar a revisión profesional." : "La evidencia jurídica vencerá pronto. Revisar vigencia y renovar antes de cualquier uso.", dueAt: item.expiresAt });
    await appendOperationalEvent({ eventType: "LRCI_EXPIRY_NOTIFICATION_CREATED", aggregateType: "lrci_review_case", aggregateId: item.publicId, source: "human_authority", payload: { notificationPublicId: publicId, kind, severity: kind === "EXPIRED" ? "CRITICAL" : "HIGH", dueAt: item.expiresAt.toISOString() }, idempotencyKey: `lrci-expiry-notification:${item.publicId}:${kind}` }, db);
    created += 1;
  }
  return created;
}

export async function exportLrciCaseHistoryPdf(input: { actorUserId: number; publicId: string }) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible para exportar el historial LRCI.");
  const rows = await listLrciCaseHistory(input.publicId);
  const document = new PDFDocument({ size: "A4", margin: 42, info: { Title: `Historial LRCI ${input.publicId}`, Author: "MiLukita", Subject: "Historial administrativo restringido" } });
  const chunks: Buffer[] = [];
  document.on("data", (chunk: Buffer) => chunks.push(chunk));
  const done = new Promise<Buffer>((resolve, reject) => { document.on("end", () => resolve(Buffer.concat(chunks))); document.on("error", reject); });
  document.fontSize(17).fillColor("#0b3d2e").text(`MiLukita — Historial LRCI`, { align: "center" });
  document.moveDown(0.4).fontSize(9).fillColor("#555555").text(`${input.publicId} · Exportado: ${new Date().toISOString()} · Eventos: ${rows.length}`, { align: "center" });
  document.moveDown(1);
  for (const row of rows) {
    document.fontSize(10).fillColor("#147d5a").text(row.eventType);
    document.fontSize(8.5).fillColor("#222222").text(`Evento: ${row.publicId} · Fecha: ${row.createdAt.toISOString()} · Actor: ${row.actorUserId ?? "N/D"} · Fuente: ${row.source}`);
    document.text(`Correlación: ${row.correlationId}`);
    document.text(`Payload: ${row.payloadJson}`);
    document.moveDown(0.7);
  }
  document.fontSize(8).fillColor("#666666").text("Historial técnico restringido. No constituye asesoría legal ni habilita claims, firma, publicación o acceso a MJP CORE.");
  document.end();
  const pdf = await done;
  const reportId = `LRCI-H-${randomBytes(8).toString("hex").toUpperCase()}`;
  const stored = await storagePut(`lrci-history-reports/${reportId}.pdf`, pdf, "application/pdf");
  await appendOperationalEvent({ eventType: "LRCI_CASE_HISTORY_EXPORTED_PDF", aggregateType: "lrci_review_case", aggregateId: input.publicId, actorUserId: input.actorUserId, source: "human_authority", payload: { reportId, eventCount: rows.length, byteSize: pdf.byteLength }, idempotencyKey: `lrci-case-history-pdf:${input.publicId}:${reportId}` }, db);
  return { reportId, url: stored.url, eventCount: rows.length, byteSize: pdf.byteLength };
}

export async function listLrciCaseHistory(publicId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select({ publicId: operationalEvents.publicId, eventType: operationalEvents.eventType, aggregateId: operationalEvents.aggregateId, actorUserId: operationalEvents.actorUserId, source: operationalEvents.source, payloadJson: operationalEvents.payloadJson, correlationId: operationalEvents.correlationId, createdAt: operationalEvents.createdAt }).from(operationalEvents).where(and(eq(operationalEvents.aggregateType, "lrci_review_case"), eq(operationalEvents.aggregateId, publicId))).orderBy(desc(operationalEvents.createdAt));
}

export async function listLrciExpiryNotifications(input: { includeRead?: boolean; severity?: "HIGH" | "CRITICAL"; from?: Date; to?: Date } = {}) {
  const db = await getDb();
  if (!db) return [];
  await syncLrciExpiryNotifications();
  const filters = [];
  if (!input.includeRead) filters.push(isNull(lrciReviewNotifications.readAt));
  if (input.severity) filters.push(eq(lrciReviewNotifications.severity, input.severity));
  if (input.from) filters.push(gte(lrciReviewNotifications.createdAt, input.from));
  if (input.to) filters.push(lte(lrciReviewNotifications.createdAt, input.to));
  return db.select().from(lrciReviewNotifications).where(filters.length ? and(...filters) : undefined).orderBy(desc(lrciReviewNotifications.createdAt));
}

export async function markLrciNotificationRead(publicId: string, actorUserId: number) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible para actualizar la notificación LRCI.");
  await db.update(lrciReviewNotifications).set({ readAt: new Date() }).where(eq(lrciReviewNotifications.publicId, publicId));
  await appendOperationalEvent({ eventType: "LRCI_EXPIRY_NOTIFICATION_READ", aggregateType: "lrci_notification", aggregateId: publicId, actorUserId, source: "human_authority", payload: { readAt: new Date().toISOString() }, idempotencyKey: `lrci-notification-read:${publicId}:${Date.now()}` }, db);
  return { publicId, read: true };
}

export async function exportLrciReviewCasesPdf(input: { actorUserId: number; status?: LrciCaseStatus; jurisdiction?: string }) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible para exportar los casos LRCI.");
  const cases = await listLrciReviewCases(input);
  const document = new PDFDocument({ size: "A4", margin: 42, info: { Title: "Casos LRCI — revisión humana", Author: "MiLukita", Subject: "Registro administrativo restringido" } });
  const chunks: Buffer[] = [];
  document.on("data", (chunk: Buffer) => chunks.push(chunk));
  const done = new Promise<Buffer>((resolve, reject) => { document.on("end", () => resolve(Buffer.concat(chunks))); document.on("error", reject); });
  document.fontSize(18).fillColor("#0b3d2e").text("MiLukita — Casos LRCI", { align: "center" });
  document.moveDown(0.4).fontSize(9).fillColor("#555555").text(`Exportado: ${new Date().toISOString()} · Casos: ${cases.length}`, { align: "center" });
  document.moveDown(1);
  if (!cases.length) document.fontSize(10).fillColor("#222222").text("No hay casos que coincidan con los filtros seleccionados.");
  for (const item of cases) {
    document.fontSize(11).fillColor("#147d5a").text(`${item.publicId} · ${item.status}`);
    document.fontSize(9).fillColor("#222222").text(`Título: ${item.title}`);
    document.text(`Dominio: ${item.domain} · Jurisdicción: ${item.jurisdiction}`);
    document.text(`Alcance: ${item.scope}`);
    document.text(`Responsable: ${item.responsibleLabel} · Vencimiento: ${item.expiresAt ? item.expiresAt.toISOString() : "Sin fecha"}`);
    if (item.sourceRef) document.text(`Fuente: ${item.sourceRef}`);
    if (item.evidenceSummary) document.text(`Evidencia: ${item.evidenceSummary}`);
    if (item.reviewerComment) document.text(`Comentario: ${item.reviewerComment}`);
    document.moveDown(0.8);
  }
  document.fontSize(8).fillColor("#666666").text("Registro técnico restringido. No constituye asesoría legal ni habilita claims, firma, publicación o acceso a MJP CORE.");
  document.end();
  const pdf = await done;
  const publicId = `LRCI-RPT-${randomBytes(8).toString("hex").toUpperCase()}`;
  const stored = await storagePut(`lrci-reports/${publicId}.pdf`, pdf, "application/pdf");
  await appendOperationalEvent({ eventType: "LRCI_REVIEW_CASES_EXPORTED_PDF", aggregateType: "lrci_review_cases", aggregateId: publicId, actorUserId: input.actorUserId, source: "human_authority", payload: { count: cases.length, status: input.status ?? null, jurisdiction: input.jurisdiction ?? null, byteSize: pdf.byteLength }, idempotencyKey: `lrci-export-pdf:${publicId}` }, db);
  return { publicId, url: stored.url, count: cases.length, byteSize: pdf.byteLength };
}

export async function updateLrciReviewCase(input: { actorUserId: number; publicId: string; status: LrciCaseStatus; reviewerComment?: string; expiresAt?: Date | null; responsibleUserId?: number | null; responsibleLabel?: string }) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible para actualizar el caso LRCI.");
  const target = await db.select().from(lrciReviewCases).where(eq(lrciReviewCases.publicId, input.publicId)).limit(1);
  if (!target[0]) throw new Error("El caso LRCI no existe.");
  const reviewed = isHumanDecisionStatus(input.status);
  await db.transaction(async (tx) => {
    await tx.update(lrciReviewCases).set({ status: input.status, reviewerComment: input.reviewerComment?.trim() || null, expiresAt: input.expiresAt, responsibleUserId: input.responsibleUserId, responsibleLabel: input.responsibleLabel?.trim() || target[0].responsibleLabel, reviewedAt: reviewed ? new Date() : null }).where(eq(lrciReviewCases.publicId, input.publicId));
    await appendOperationalEvent({ eventType: "LRCI_REVIEW_CASE_UPDATED", aggregateType: "lrci_review_case", aggregateId: input.publicId, actorUserId: input.actorUserId, source: "human_authority", payload: { status: input.status, reviewerComment: input.reviewerComment?.trim() || null, expiresAt: input.expiresAt?.toISOString() ?? null, responsibleLabel: input.responsibleLabel?.trim() || target[0].responsibleLabel }, idempotencyKey: `lrci-case-update:${input.publicId}:${input.status}:${Date.now()}` }, tx);
  });
  const rows = await db.select().from(lrciReviewCases).where(eq(lrciReviewCases.publicId, input.publicId)).limit(1);
  return rows[0];
}
