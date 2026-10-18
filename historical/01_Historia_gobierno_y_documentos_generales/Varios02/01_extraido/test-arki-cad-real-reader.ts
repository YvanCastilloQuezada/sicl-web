import { strict as assert } from "node:assert";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  ACIR_SCHEMA_VERSION,
  createAcirEntity,
  createCadDiagnostic,
  createCadProvenance,
  validateAcirDocument,
  type AcirDocument,
  type AcirEntity,
  type CadProvenance,
} from "../shared/arkiCadGateway";

const root = resolve(dirname(new URL(import.meta.url).pathname), "..");
const sourceFile = resolve(
  root,
  "ARKI_ABB001_SOURCE_FREEZE_V1/extracted/EXPEDIENTE COMPLETO/PLANOS AUTOCAD/PROY. FERNANDEZ ROJAS - ARQUITECTURA.dwg"
);
const reader = "/tmp/libredwg-cad001d/programs/.libs/dwg2SVG";
const readerLibraryPath = "/tmp/libredwg-cad001d/src/.libs";
const outputFile = resolve(root, "ARKI_CAD_001D_ACIR.json");

function sha256(value: Uint8Array | string): string {
  return createHash("sha256").update(value).digest("hex");
}

function runReader(): string {
  assert.ok(existsSync(sourceFile), `CAD_SOURCE_NOT_FOUND: ${sourceFile}`);
  assert.ok(existsSync(reader), `CAD_READER_NOT_FOUND: ${reader}`);
  return execFileSync(reader, ["--mspace", sourceFile], {
    encoding: "utf8",
    env: { ...process.env, LD_LIBRARY_PATH: readerLibraryPath },
    maxBuffer: 64 * 1024 * 1024,
  });
}

function extractViewBox(svg: string): readonly number[] | null {
  const match = svg.match(/viewBox="([^"]+)"/);
  if (!match) return null;
  const values = match[1].trim().split(/\s+/).map(Number);
  return values.length === 4 && values.every(Number.isFinite) ? values : null;
}

function extractCoordinates(tag: string): number[] {
  const coordinates: number[] = [];
  for (const match of tag.matchAll(
    /(?:M|L)\s*(-?\d+(?:\.\d+)?)[, ]+(-?\d+(?:\.\d+)?)/g
  )) {
    coordinates.push(Number(match[1]), Number(match[2]));
  }
  return coordinates;
}

function extractEntities(svg: string, provenance: CadProvenance): AcirEntity[] {
  const entities: AcirEntity[] = [];
  const pattern =
    /<(path|circle|line|polyline|polygon)\b[^>]*\bid="([^"]+)"[^>]*>/g;
  for (const match of svg.matchAll(pattern)) {
    const tagName = match[1];
    const sourceHandle = match[2];
    const tag = match[0];
    const kind: "line" | "polyline" | "circle" | "unknown" =
      tagName === "circle"
        ? "circle"
        : tagName === "line"
          ? "line"
          : "polyline";
    entities.push(
      createAcirEntity({
        id: `acir:${sourceHandle}`,
        sourceHandle,
        sourceType: tagName.toUpperCase(),
        layer: "MODELSPACE",
        geometry: { kind, coordinates: extractCoordinates(tag) },
        transform: [1, 0, 0, 1, 0, 0],
        properties: { extractedFrom: "LibreDWG-SVG", svgTag: tagName },
        provenance: { ...provenance, sourceEntityHandle: sourceHandle },
        parseStatus: "PARSED",
        semanticMeaning: "UNKNOWN_CAD_FACT",
      })
    );
  }
  return entities;
}

const source = readFileSync(sourceFile);
const sourceFileHash = sha256(source);
const readerVersion = execFileSync(reader, ["--version"], {
  encoding: "utf8",
  env: { ...process.env, LD_LIBRARY_PATH: readerLibraryPath },
}).trim();
const firstRun = runReader();
const secondRun = runReader();
assert.equal(
  sha256(firstRun),
  sha256(secondRun),
  "CAD_READER_NOT_DETERMINISTIC"
);

const provenance = createCadProvenance({
  sourceFileHash,
  sourceFormat: "DWG",
  sourceVersion: "AC1032 / AutoCAD 2018",
  reader: "LibreDWG dwg2SVG",
  readerVersion,
  transformationHistory: ["DWG → LibreDWG SVG → ACIR ingestion"],
});
const entities = extractEntities(firstRun, provenance);
const diagnostics = [
  createCadDiagnostic({
    severity: "INFO",
    code: "SEMANTIC_PROMOTION_BLOCKED",
    message:
      "CAD entities remain UNKNOWN_CAD_FACT; no BIM semantic promotion was performed",
    conversionLoss: false,
  }),
];
const document: AcirDocument = {
  schema: ACIR_SCHEMA_VERSION,
  sourceFile,
  sourceHash: sourceFileHash,
  sourceFormat: "DWG",
  sourceVersion: "AC1032 / AutoCAD 2018",
  units: "UNKNOWN",
  coordinateSystem: "UNKNOWN",
  extents: extractViewBox(firstRun),
  parser: "LibreDWG dwg2SVG",
  parserVersion: readerVersion,
  layers: [{ id: "layer:MODELSPACE", name: "MODELSPACE", provenance }],
  blockDefinitions: [],
  blockInstances: [],
  entities,
  diagnostics,
  parseStatus: "PARSED",
  semanticPromotion: "PROHIBITED",
};

validateAcirDocument(document);
assert.ok(document.entities.length > 0, "CAD_ENTITIES_NOT_EXTRACTED");
assert.ok(document.extents !== null, "CAD_EXTENTS_NOT_EXTRACTED");
assert.ok(
  document.entities.every(
    entity => entity.provenance.sourceFileHash === sourceFileHash
  ),
  "CAD_PROVENANCE_NOT_PRESERVED"
);
writeFileSync(outputFile, `${JSON.stringify(document, null, 2)}\n`);

console.log(
  JSON.stringify({
    status: "PASS",
    reader: "LibreDWG dwg2SVG",
    readerVersion,
    sourceFormat: document.sourceFormat,
    sourceVersion: document.sourceVersion,
    sourceSha256: sourceFileHash,
    entities: document.entities.length,
    layers: document.layers.length,
    extents: document.extents,
    units: document.units,
    sourceHandles: document.entities.filter(
      entity => entity.sourceHandle !== undefined
    ).length,
    diagnostics: document.diagnostics.length,
    acirGenerated: true,
    provenancePreserved: true,
    reproducible: true,
    fidelity: "NOT_FULLY_VERIFIED",
    cadGeometryReady: "NO",
    semanticPromotion: "PROHIBITED",
    abb001: "REAL_DWG_INGESTED",
  })
);
