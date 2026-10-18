import { createHash, randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import PDFDocument from "pdfkit";
import { desc, eq } from "drizzle-orm";
import { auditReportArtifacts } from "../drizzle/schema";
import { appendOperationalEvent } from "./eventStore";
import { getDb } from "./db";
import { storageGetSignedUrl, storagePut } from "./storage";

const REPORT_FILENAME = "MJP_INFORME_UNIFICADO_DETALLES_Y_AUDITORIA.md";
const REPORT_TITLE = "MiLukita — Informe unificado de detalles y auditoría";
const MAX_PREVIEW_CHARS = 1_000_000;

function reportPath() {
  return path.resolve(process.cwd(), REPORT_FILENAME);
}

function sha256(data: Buffer | string) {
  return createHash("sha256").update(data).digest("hex");
}

export async function readUnifiedReport() {
  let markdown: string | undefined;
  for (const candidate of [reportPath(), path.resolve(process.cwd(), "dist", REPORT_FILENAME)]) {
    try {
      markdown = await readFile(candidate, "utf8");
      break;
    } catch {
      // Try the production copy after the development path is unavailable.
    }
  }
  if (!markdown?.trim() || markdown.length > MAX_PREVIEW_CHARS) throw new Error("El informe unificado no está disponible o excede el límite permitido.");
  return markdown;
}

export async function getUnifiedReportPreview() {
  const markdown = await readUnifiedReport();
  return {
    title: REPORT_TITLE,
    filename: REPORT_FILENAME,
    markdown,
    sha256: sha256(markdown),
    lineCount: markdown.split("\n").length,
    byteSize: Buffer.byteLength(markdown, "utf8"),
  };
}

function cleanMarkdownLine(line: string) {
  return line
    .replace(/^#{1,6}\s*/, "")
    .replace(/^[-*]\s+/, "• ")
    .replace(/^\|\s?/, "")
    .replace(/\s?\|\s?$/, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .trim();
}

export async function renderUnifiedReportPdf(markdown: string) {
  const document = new PDFDocument({ size: "A4", margin: 48, info: { Title: REPORT_TITLE, Author: "Manus AI", Subject: "Auditoría administrativa MiLukita" } });
  const chunks: Buffer[] = [];
  document.on("data", (chunk: Buffer) => chunks.push(chunk));
  const done = new Promise<Buffer>((resolve, reject) => {
    document.on("end", () => resolve(Buffer.concat(chunks)));
    document.on("error", reject);
  });

  document.fontSize(18).fillColor("#0b3d2e").text(REPORT_TITLE, { align: "center" });
  document.moveDown(0.5).fontSize(9).fillColor("#555555").text(`Generado desde ${REPORT_FILENAME} · ${new Date().toISOString()}`, { align: "center" });
  document.moveDown(1);

  for (const rawLine of markdown.split("\n")) {
    const line = cleanMarkdownLine(rawLine);
    if (!line) { document.moveDown(0.25); continue; }
    if (rawLine.startsWith("# ")) document.fontSize(16).fillColor("#0b3d2e").text(line, { continued: false });
    else if (rawLine.startsWith("## ")) document.moveDown(0.25).fontSize(12).fillColor("#147d5a").text(line);
    else document.fontSize(8.5).fillColor("#222222").text(line, { lineGap: 1.5 });
  }
  document.end();
  return done;
}

export async function generateUnifiedReportPdf(actorUserId: number) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible para generar el informe.");
  const markdown = await readUnifiedReport();
  const pdf = await renderUnifiedReportPdf(markdown);
  const pdfHash = sha256(pdf);
  const latest = await db.select({ version: auditReportArtifacts.version }).from(auditReportArtifacts).orderBy(desc(auditReportArtifacts.version)).limit(1);
  const version = (latest[0]?.version ?? 0) + 1;
  const publicId = `RPT-${randomBytes(10).toString("hex").toUpperCase()}`;
  const stored = await storagePut(`audit-reports/${publicId}.pdf`, pdf, "application/pdf");
  await db.insert(auditReportArtifacts).values({ publicId, title: REPORT_TITLE, format: "pdf", version, storageKey: stored.key, storageUrl: stored.url, sha256: pdfHash, byteSize: pdf.byteLength, createdByUserId: actorUserId });
  await appendOperationalEvent({ eventType: "audit_report_generated", aggregateType: "audit_report", aggregateId: publicId, actorUserId, source: "control_room", payload: { version, format: "pdf", sha256: pdfHash, byteSize: pdf.byteLength }, idempotencyKey: `audit-report-generated:${pdfHash}` }, db);
  return { publicId, title: REPORT_TITLE, format: "pdf" as const, version, storageUrl: stored.url, sha256: pdfHash, byteSize: pdf.byteLength };
}

export async function listAuditReportArtifacts(limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select({ publicId: auditReportArtifacts.publicId, title: auditReportArtifacts.title, format: auditReportArtifacts.format, version: auditReportArtifacts.version, sha256: auditReportArtifacts.sha256, byteSize: auditReportArtifacts.byteSize, createdAt: auditReportArtifacts.createdAt }).from(auditReportArtifacts).orderBy(desc(auditReportArtifacts.createdAt)).limit(Math.min(Math.max(limit, 1), 100));
}

export async function getAuditReportDownload(publicId: string) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  const rows = await db.select().from(auditReportArtifacts).where(eq(auditReportArtifacts.publicId, publicId)).limit(1);
  const artifact = rows[0];
  if (!artifact) throw new Error("Informe no encontrado.");
  return { publicId: artifact.publicId, title: artifact.title, version: artifact.version, sha256: artifact.sha256, byteSize: artifact.byteSize, url: await storageGetSignedUrl(artifact.storageKey) };
}
