import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
export type OcrInputKind = "IMAGE" | "PDF" | "SCANNED_PDF" | "PLAN" | "BOOK_PAGE" | "TABLE" | "PHOTO_OF_DOCUMENT";
export type OcrExtraction = { sourceId: string; page: number | null; region: string | null; boundingBox: null; rawText: string; normalizedText: string; ocrConfidence: number | null; language: string; provider: "tesseract" | "pdftotext"; modelOrEngine: string; timestamp: string; provenance: string[]; humanVerificationStatus: "UNVERIFIED" };

function decodeDataUrl(value: string): { bytes: Buffer; mimeType: string } {
  const match = value.match(/^data:([^;,]+);base64,([\s\S]+)$/);
  if (!match) throw new Error("Expected a base64 data URL");
  return { mimeType: match[1], bytes: Buffer.from(match[2], "base64") };
}
function normalize(text: string): string { return text.replace(/\r/g, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim(); }
async function tesseract(file: string, language: string, sourceId: string, page: number | null, provenance: string[]): Promise<OcrExtraction> {
  const { stdout } = await execFileAsync("tesseract", [file, "stdout", "-l", language, "tsv"], { maxBuffer: 10 * 1024 * 1024 });
  const rows = stdout.split("\n").slice(1).filter(Boolean);
  const confidences = rows.map((row) => Number(row.split("\t")[10])).filter(Number.isFinite).filter((value) => value >= 0);
  const rawText = rows.map((row) => row.split("\t")[11] ?? "").filter(Boolean).join(" ").trim();
  return { sourceId, page, region: null, boundingBox: null, rawText, normalizedText: normalize(rawText), ocrConfidence: confidences.length ? Number((confidences.reduce((sum, value) => sum + value, 0) / confidences.length / 100).toFixed(3)) : null, language, provider: "tesseract", modelOrEngine: "tesseract-5", timestamp: new Date().toISOString(), provenance, humanVerificationStatus: "UNVERIFIED" };
}

export async function extractOcr(input: { sourceId: string; dataUrl: string; kind: OcrInputKind; language?: string }): Promise<OcrExtraction[]> {
  const { bytes, mimeType } = decodeDataUrl(input.dataUrl);
  const language = input.language ?? "eng";
  const directory = await mkdtemp(join(tmpdir(), "arki-ocr-"));
  try {
    if (input.kind === "PDF" || input.kind === "SCANNED_PDF" || mimeType === "application/pdf") {
      const pdf = join(directory, "source.pdf"); await writeFile(pdf, bytes);
      const { stdout } = await execFileAsync("pdftotext", ["-layout", pdf, "-"], { maxBuffer: 20 * 1024 * 1024 });
      if (normalize(stdout)) return [{ sourceId: input.sourceId, page: null, region: null, boundingBox: null, rawText: stdout, normalizedText: normalize(stdout), ocrConfidence: null, language, provider: "pdftotext", modelOrEngine: "poppler-pdftotext", timestamp: new Date().toISOString(), provenance: [`SOURCE:${input.sourceId}`, "PDF_TEXT_LAYER"], humanVerificationStatus: "UNVERIFIED" }];
      await execFileAsync("pdftoppm", ["-png", "-r", "200", pdf, join(directory, "page")], { maxBuffer: 2 * 1024 * 1024 });
      const { stdout: pages } = await execFileAsync("find", [directory, "-maxdepth", "1", "-name", "page-*.png", "-print"]);
      const files = pages.trim().split("\n").filter(Boolean).sort();
      return Promise.all(files.map((file, index) => tesseract(file, language, input.sourceId, index + 1, [`SOURCE:${input.sourceId}`, `PAGE:${index + 1}`, "PDF_RENDERED_PAGE"]))).then((items) => items.filter((item) => item.normalizedText));
    }
    const extension = mimeType.includes("png") ? ".png" : mimeType.includes("jpeg") || mimeType.includes("jpg") ? ".jpg" : ".bin";
    const file = join(directory, `source${extension}`); await writeFile(file, bytes);
    return [await tesseract(file, language, input.sourceId, null, [`SOURCE:${input.sourceId}`, "IMAGE_REGION:FULL_FRAME"])];
  } finally { await rm(directory, { recursive: true, force: true }); }
}

export function classifyDocumentStructure(text: string) {
  const normalized = normalize(text);
  return { title: normalized.split("\n")[0] || null, headings: normalized.split("\n").filter((line) => /^[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ0-9 _-]{5,}$/.test(line)).slice(0, 20), tableStructure: text.includes("\t") ? "DETECTED" : "UNKNOWN", metadataStatus: normalized ? "PROVISIONAL" : "UNKNOWN" } as const;
}
