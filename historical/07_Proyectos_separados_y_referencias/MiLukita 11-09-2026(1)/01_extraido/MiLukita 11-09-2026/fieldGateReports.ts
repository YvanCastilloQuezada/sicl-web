import { createHash } from "node:crypto";
import PDFDocument from "pdfkit";
import { desc, eq } from "drizzle-orm";
import { getDb } from "./db";
import { appendTerritorialAudit, requireTerritorialRole } from "./territorialTrust";
import { territorialFieldReports } from "../drizzle/schema";

export type FieldGateReportInput = {
  publicId?: string;
  protocol: string;
  deviceA: string;
  deviceB: string;
  severity: "PASS" | "BLOCKER" | "CRITICAL" | "MAJOR" | "MINOR" | "OBSERVATION";
  observations: string;
  completedSteps: number[];
  stepResults: Record<string, string>;
};

export function fieldGateReportHash(input: FieldGateReportInput) {
  return createHash("sha256").update(JSON.stringify({ protocol: input.protocol, deviceA: input.deviceA, deviceB: input.deviceB, severity: input.severity, observations: input.observations, completedSteps: input.completedSteps, stepResults: input.stepResults })).digest("hex");
}

export async function syncFieldGateReport(input: { actorUserId: number; report: FieldGateReportInput }) {
  await requireTerritorialRole(input.actorUserId, ["MAPPER_OPERATOR", "EYE_REVIEWER", "HUMAN_AUTHORITY"]);
  const db = await getDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const hash = fieldGateReportHash(input.report);
  const publicId = input.report.publicId ?? `FIELD-${hash.slice(0, 24).toUpperCase()}`;
  const existing = (await db.select({ id: territorialFieldReports.id }).from(territorialFieldReports).where(eq(territorialFieldReports.publicId, publicId)).limit(1))[0];
  const values = { publicId, mapperUserId: input.actorUserId, protocol: input.report.protocol.slice(0, 160), deviceA: input.report.deviceA.slice(0, 255), deviceB: input.report.deviceB.slice(0, 255), severity: input.report.severity, observations: input.report.observations.slice(0, 10000), stepResultsJson: JSON.stringify(input.report.stepResults), completedStepsJson: JSON.stringify(input.report.completedSteps), syncStatus: "SYNCED" as const, reportHash: hash };
  if (existing) await db.update(territorialFieldReports).set(values).where(eq(territorialFieldReports.id, existing.id));
  else await db.insert(territorialFieldReports).values(values);
  await appendTerritorialAudit({ actorUserId: input.actorUserId, eventType: "FIELD_GATE_REPORT_SYNCED", entityType: "FIELD_GATE_REPORT", entityPublicId: publicId, payload: { reportHash: hash, completedSteps: input.report.completedSteps.length, severity: input.report.severity } });
  return { publicId, reportHash: hash, syncStatus: "SYNCED" as const };
}

export async function listFieldGateReports(actorUserId: number) {
  await requireTerritorialRole(actorUserId, ["MAPPER_OPERATOR", "EYE_REVIEWER", "HUMAN_AUTHORITY"]);
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(territorialFieldReports).orderBy(desc(territorialFieldReports.updatedAt)).limit(100);
  return rows.map(row => ({ ...row, stepResults: JSON.parse(row.stepResultsJson), completedSteps: JSON.parse(row.completedStepsJson) }));
}

function csvEscape(value: unknown) { return `"${String(value ?? "").replaceAll('"', '""')}"`; }

async function reportsPdf(rows: Awaited<ReturnType<typeof listFieldGateReports>>) {
  const document = new PDFDocument({ size: "A4", margin: 42, info: { Title: "MiLukita · Resultados del protocolo físico", Author: "Manus AI" } });
  const chunks: Buffer[] = [];
  document.on("data", (chunk: Buffer) => chunks.push(chunk));
  const done = new Promise<Buffer>((resolve, reject) => { document.on("end", () => resolve(Buffer.concat(chunks))); document.on("error", reject); });
  document.fontSize(18).text("MiLukita · Resultados del protocolo físico");
  document.moveDown().fontSize(9).text("Registro operativo. No sustituye certificación de hardware ni auditoría profesional.");
  rows.forEach(row => { document.moveDown().fontSize(11).text(`${row.publicId} · ${row.severity} · ${row.completedSteps.length} pasos PASS`); document.fontSize(9).text(`${row.protocol} · ${row.deviceA} / ${row.deviceB}`); document.text(row.observations || "Sin observaciones"); });
  document.end();
  return done;
}

export type PilotMetricFilters = { from?: string; to?: string; device?: string };
export type FieldGateReportRow = Awaited<ReturnType<typeof listFieldGateReports>>[number];

export function filterPilotReportRows(rows: FieldGateReportRow[], filters: PilotMetricFilters) {
  const from = filters.from ? new Date(`${filters.from}T00:00:00.000Z`) : undefined;
  const to = filters.to ? new Date(`${filters.to}T23:59:59.999Z`) : undefined;
  const deviceQuery = filters.device?.trim().toLowerCase();
  return rows.filter(row => {
    const created = row.createdAt instanceof Date ? row.createdAt : new Date(row.createdAt);
    const matchesDate = (!from || created >= from) && (!to || created <= to);
    const matchesDevice = !deviceQuery || row.deviceA.toLowerCase().includes(deviceQuery) || row.deviceB.toLowerCase().includes(deviceQuery);
    return matchesDate && matchesDevice;
  });
}

export async function exportPilotMetricsPdf(actorUserId: number, filters: PilotMetricFilters) {
  const rows = await listFieldGateReports(actorUserId);
  const filtered = filterPilotReportRows(rows, filters);
  const document = new PDFDocument({ size: "A4", margin: 42, info: { Title: "MiLukita · Métricas del piloto", Author: "Manus AI" } });
  const chunks: Buffer[] = [];
  document.on("data", (chunk: Buffer) => chunks.push(chunk));
  const done = new Promise<Buffer>((resolve, reject) => { document.on("end", () => resolve(Buffer.concat(chunks))); document.on("error", reject); });
  document.rect(0, 0, 595, 842).fill("#061a16");
  document.fillColor("#9ee6c6").fontSize(10).text("MILUKITA · FIELD OPERATIONS MVP", 42, 46, { characterSpacing: 1.1 });
  document.fillColor("#ffffff").fontSize(24).text("Métricas del piloto", 42, 82);
  document.fillColor("#b8d8cc").fontSize(10).text(`Generado ${new Date().toISOString()} · Filtros: ${filters.from || "inicio"} → ${filters.to || "hoy"}${filters.device ? ` · dispositivo: ${filters.device}` : ""}`, 42, 120, { width: 500 });
  const synced = filtered.filter(row => row.syncStatus === "SYNCED").length;
  const blockers = filtered.filter(row => ["BLOCKER", "CRITICAL"].includes(row.severity)).length;
  const steps = filtered.reduce((sum, row) => sum + row.completedSteps.length, 0);
  document.fillColor("#ffffff").fontSize(13).text(`Reportes: ${filtered.length}    Sincronizados: ${synced}    Bloqueos: ${blockers}    Pasos completados: ${steps}`, 42, 170, { width: 510 });
  let y = 220;
  filtered.slice(0, 40).forEach(row => { document.fillColor("#9ee6c6").fontSize(11).text(`${row.publicId} · ${row.syncStatus} · ${row.severity}`, 42, y); document.fillColor("#d7ebe3").fontSize(9).text(`${row.protocol} · ${row.deviceA} / ${row.deviceB} · ${row.createdAt.toISOString()}`, 42, y + 16, { width: 510 }); y += 42; if (y > 770) { document.addPage(); y = 48; } });
  document.fillColor("#86d7bc").fontSize(8).text("Este reporte refleja datos persistidos del MVP y no certifica hardware ni producción. MJP CORE permanece fuera de este dominio.", 42, 806, { width: 510 });
  document.end();
  const bytes = await done;
  return { filename: `milukita-pilot-metrics-${new Date().toISOString().slice(0, 10)}.pdf`, contentType: "application/pdf", content: bytes.toString("base64"), encoding: "base64" as const };
}

export async function exportFieldGateReports(actorUserId: number, format: "csv" | "pdf") {
  const rows = await listFieldGateReports(actorUserId);
  if (format === "csv") {
    const header = "publicId,protocol,deviceA,deviceB,severity,completedSteps,stepResults,syncStatus,reportHash,createdAt";
    const lines = rows.map(row => [row.publicId, row.protocol, row.deviceA, row.deviceB, row.severity, row.completedSteps.length, JSON.stringify(row.stepResults), row.syncStatus, row.reportHash, row.createdAt.toISOString()].map(csvEscape).join(","));
    return { filename: `milukita-field-gate-${new Date().toISOString().slice(0, 10)}.csv`, contentType: "text/csv;charset=utf-8", content: [header, ...lines].join("\n") };
  }
  const bytes = await reportsPdf(rows);
  return { filename: `milukita-field-gate-${new Date().toISOString().slice(0, 10)}.pdf`, contentType: "application/pdf", content: bytes.toString("base64"), encoding: "base64" as const };
}

const MANUAL_CONTENT = {
  MAPPER: { title: "MiLukita Mapper · Manual del operador de campo", intro: "Captura territorio real como WorldObjects trazables. Trabaja dentro de CaptureSession, conserva evidencia y nunca publiques directamente desde Mapper.", sections: ["Preparar: HTTPS, GPS, cámara, rol Mapper y CaptureSession.", "Capturar: fotografía, coordenadas, precisión, nota y estado CAPTURED.", "Offline: conserva LOCAL_PENDING, sincroniza al recuperar red y revisa conflictos.", "Completar: Claims, Sources, Evidence; guarda versión y envía a The Eye.", "Mapas: dibuja un polígono pequeño, acepta consentimiento y respeta el límite de teselas."] },
  THE_EYE: { title: "The Eye · Manual del auditor de confianza", intro: "Verifica evidencia, coherencia y trazabilidad. Confidence Score es una señal explicable, no una prueba absoluta; la publicación requiere Human Authority.", sections: ["Recepción: filtra UNDER_REVIEW y confirma la versión revisada.", "Evidence Matrix: existencia, ubicación, identidad, contenido, fuente, actualidad, evidencia y consistencia.", "Conflictos: compara local/remota; conserva, combina o marca DISPUTED con razón.", "Decisión: aprobar, rechazar o solicitar evidencia adicional dejando auditoría.", "Publicación: Human Authority autoriza la versión exacta; Runtime solo consume PUBLISHED."] },
} as const;

export async function exportTerritorialManual(actorUserId: number, manual: "MAPPER" | "THE_EYE") {
  await requireTerritorialRole(actorUserId, ["MAPPER_OPERATOR", "EYE_REVIEWER", "HUMAN_AUTHORITY"]);
  const content = MANUAL_CONTENT[manual];
  const document = new PDFDocument({ size: "A4", margin: 48, info: { Title: content.title, Author: "Manus AI" } });
  const chunks: Buffer[] = [];
  document.on("data", (chunk: Buffer) => chunks.push(chunk));
  const done = new Promise<Buffer>((resolve, reject) => { document.on("end", () => resolve(Buffer.concat(chunks))); document.on("error", reject); });
  document.save();
  document.rect(0, 0, 595, 842).fill("#061a16");
  document.circle(84, 92, 34).fill("#9ee6c6");
  document.fillColor("#061a16").fontSize(24).text("L★", 62, 78, { width: 44, align: "center" });
  document.fillColor("#9ee6c6").fontSize(10).text("MILUKITA · TERRITORIAL TRUST", 58, 155, { characterSpacing: 1.2 });
  document.fillColor("#ffffff").fontSize(28).text(content.title, 58, 215, { width: 470 });
  document.fillColor("#b8d8cc").fontSize(11).text("Manual operativo · Versión 1.0 · Sandbox", 58, 320);
  document.fillColor("#86d7bc").fontSize(10).text("CAPTURA  →  VERIFICACIÓN  →  AUTORIDAD HUMANA  →  RUNTIME", 58, 730);
  document.restore();
  document.addPage();
  document.fillColor("#102a23").fontSize(22).text(content.title); document.moveDown().fontSize(10).text("Versión 1.0 · Uso operativo en sandbox"); document.moveDown().fontSize(12).text(content.intro);
  content.sections.forEach((section, index) => { document.moveDown().fontSize(13).text(`${index + 1}. ${section}`); });
  document.moveDown().fontSize(9).text("Descargo: este manual no certifica hardware, GPS, cámara, cartografía ni producción. MJP CORE permanece fuera de este dominio."); document.end();
  const bytes = await done;
  return { filename: `milukita-${manual.toLowerCase().replace("_", "-")}-manual.pdf`, contentType: "application/pdf", content: bytes.toString("base64"), encoding: "base64" as const };
}

export async function exportPilotMetricsCsv(actorUserId: number, filters: PilotMetricFilters) {
  const rows = await listFieldGateReports(actorUserId);
  const filtered = filterPilotReportRows(rows, filters);
  const header = "publicId,protocol,deviceA,deviceB,severity,syncStatus,completedSteps,stepResults,reportHash,createdAt,updatedAt";
  const lines = filtered.map(row => [row.publicId, row.protocol, row.deviceA, row.deviceB, row.severity, row.syncStatus, row.completedSteps.length, JSON.stringify(row.stepResults), row.reportHash, row.createdAt.toISOString(), row.updatedAt.toISOString()].map(csvEscape).join(","));
  return { filename: `milukita-pilot-metrics-${new Date().toISOString().slice(0, 10)}.csv`, contentType: "text/csv;charset=utf-8", content: [header, ...lines].join("\n") };
}
