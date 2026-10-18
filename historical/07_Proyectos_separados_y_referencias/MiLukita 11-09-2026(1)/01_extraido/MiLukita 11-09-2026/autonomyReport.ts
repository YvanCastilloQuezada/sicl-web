import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import PDFDocument from "pdfkit";
import { simulateAutonomyWindow, type AutonomySimulationReport } from "../shared/autonomySimulation";

const REPORT_PATH = path.resolve(process.cwd(), "reports/autonomy-24h-simulation.json");
const REPORT_TITLE = "MiLukita — Simulación de autonomía 24 horas";

type ExportFormat = "csv" | "pdf";

function sha256(value: Buffer | string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function readAutonomySimulationReport(): Promise<AutonomySimulationReport> {
  const raw = await readFile(REPORT_PATH, "utf8");
  const report = JSON.parse(raw) as Partial<AutonomySimulationReport>;
  if (!report.taskUid || !report.passed || !report.startAt || !report.windowHours || !report.intervalMinutes) {
    throw new Error("El informe de autonomía no está disponible o no tiene una estructura válida.");
  }
  if (Array.isArray(report.samples)) return report as AutonomySimulationReport;
  return simulateAutonomyWindow({ taskUid: report.taskUid, startAt: new Date(report.startAt), windowHours: report.windowHours, intervalMinutes: report.intervalMinutes });
}

function csvCell(value: unknown) {
  const text = value == null ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function reportToCsv(report: AutonomySimulationReport) {
  const summary = [
    ["campo", "valor"],
    ["titulo", REPORT_TITLE],
    ["taskUid", report.taskUid],
    ["inicio", report.startAt],
    ["fin", report.endAt],
    ["ventana_horas", report.windowHours],
    ["intervalo_minutos", report.intervalMinutes],
    ["ticks", report.ticks],
    ["intentos_totales", report.totalAttempts],
    ["claims_unicos", report.uniqueClaims],
    ["claims_duplicados", report.duplicateClaims],
    ["tasa_duplicados", report.duplicateRate],
    ["claves_estables", report.stableClaimKeys],
    ["resultado", report.passed ? "PASS" : "FAIL"],
  ];
  const samples = [
    [],
    ["intento", "fecha", "taskUid", "bucket", "claimKey", "ejecucion", "accion_esperada"],
    ...report.samples.map((sample) => [sample.attempt, sample.at, sample.taskUid, sample.bucket, sample.claimKey, sample.execution, sample.expectedAction]),
  ];
  const limitations = [[], ["limitaciones"], ...report.limitations.map((limitation) => [limitation])];
  return [...summary, ...samples, ...limitations].map((row) => row.map(csvCell).join(",")).join("\n") + "\n";
}

function pdfText(value: unknown) {
  return String(value ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, " ");
}

async function reportToPdf(report: AutonomySimulationReport) {
  const document = new PDFDocument({ size: "A4", margin: 48, info: { Title: REPORT_TITLE, Author: "Manus AI", Subject: "Simulación determinista de autonomía" } });
  const chunks: Buffer[] = [];
  document.on("data", (chunk: Buffer) => chunks.push(chunk));
  const done = new Promise<Buffer>((resolve, reject) => {
    document.on("end", () => resolve(Buffer.concat(chunks)));
    document.on("error", reject);
  });
  document.fontSize(18).fillColor("#0b3d2e").text(REPORT_TITLE, { align: "center" });
  document.moveDown(0.5).fontSize(9).fillColor("#555555").text(`Generado: ${new Date().toISOString()} · Fuente: reports/autonomy-24h-simulation.json`, { align: "center" });
  document.moveDown(1);
  document.fontSize(13).fillColor("#147d5a").text("Resumen de validación");
  const summary = [
    `Resultado: ${report.passed ? "PASS" : "FAIL"}`,
    `Ventana: ${report.windowHours} horas · intervalo: ${report.intervalMinutes} minuto(s)`,
    `Ticks: ${report.ticks} · intentos: ${report.totalAttempts}`,
    `Claims únicos: ${report.uniqueClaims} · duplicados esperados: ${report.duplicateClaims}`,
    `Tasa de duplicados: ${report.duplicateRate} · claves estables: ${report.stableClaimKeys ? "sí" : "no"}`,
    `Periodo UTC: ${report.startAt} → ${report.endAt}`,
  ];
  document.moveDown(0.3).fontSize(9).fillColor("#222222");
  for (const line of summary) document.text(pdfText(line), { lineGap: 2 });
  document.moveDown(0.8).fontSize(13).fillColor("#147d5a").text("Evidencia de claims");
  document.moveDown(0.3).fontSize(7.5).fillColor("#222222");
  for (const sample of report.samples.slice(0, 80)) document.text(pdfText(`${sample.attempt} | ${sample.at} | ${sample.claimKey} | ${sample.execution} | ${sample.expectedAction}`), { lineGap: 1 });
  document.moveDown(0.8).fontSize(13).fillColor("#147d5a").text("Limitaciones");
  document.moveDown(0.3).fontSize(8.5).fillColor("#222222");
  for (const limitation of report.limitations) document.text(pdfText(`• ${limitation}`), { lineGap: 2 });
  document.moveDown(0.8).fontSize(7.5).fillColor("#666666").text("El PDF resume las primeras 80 muestras; el CSV contiene todas las muestras generadas.");
  document.end();
  return done;
}

export async function getAutonomySimulationPreview() {
  const report = await readAutonomySimulationReport();
  return {
    title: REPORT_TITLE,
    source: "reports/autonomy-24h-simulation.json",
    generatedAt: new Date().toISOString(),
    summary: { passed: report.passed, windowHours: report.windowHours, intervalMinutes: report.intervalMinutes, ticks: report.ticks, totalAttempts: report.totalAttempts, uniqueClaims: report.uniqueClaims, duplicateClaims: report.duplicateClaims, duplicateRate: report.duplicateRate, stableClaimKeys: report.stableClaimKeys },
    samples: report.samples.slice(0, 12),
    sampleCount: report.samples.length,
    limitations: report.limitations,
  };
}

export async function exportAutonomySimulation(format: ExportFormat) {
  const report = await readAutonomySimulationReport();
  const bytes = format === "csv" ? Buffer.from(reportToCsv(report), "utf8") : await reportToPdf(report);
  const extension = format;
  return {
    filename: `milukita-autonomy-24h-${report.startAt.slice(0, 10)}.${extension}`,
    mimeType: format === "csv" ? "text/csv;charset=utf-8" : "application/pdf",
    sha256: sha256(bytes),
    byteSize: bytes.byteLength,
    base64: bytes.toString("base64"),
    format,
    report: { passed: report.passed, ticks: report.ticks, totalAttempts: report.totalAttempts, uniqueClaims: report.uniqueClaims, duplicateClaims: report.duplicateClaims },
  };
}
