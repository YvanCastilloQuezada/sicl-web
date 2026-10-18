import { stableHash, type ProvenanceRecord } from "./arkiRecalculation";

export const CAD_GATEWAY_SCHEMA_VERSION = "ARKI-CAD-GATEWAY-001C-1.0" as const;
export const ACIR_SCHEMA_VERSION = "ARKI-ACIR-1.0" as const;

export type CadFormat = "DWG" | "DXF";
export type CadParseStatus = "PARSED" | "PARTIALLY_PARSED" | "UNSUPPORTED" | "CORRUPTED" | "UNKNOWN" | "CONVERSION_LOSS_DETECTED";
export type CadDiagnosticSeverity = "INFO" | "WARNING" | "ERROR" | "LOSS";
export type CadSourceGeometry = { kind: "line" | "polyline" | "circle" | "arc" | "spline" | "hatch" | "solid" | "unknown"; coordinates: readonly number[] };
export type CadProvenance = {
  sourceFileHash: string;
  sourceFormat: CadFormat;
  sourceVersion: string;
  sourceEntityHandle?: string;
  reader: string;
  readerVersion: string;
  transformationHistory: readonly string[];
  baseProvenance?: ProvenanceRecord;
};
export type CadDiagnostic = {
  diagnosticId: string;
  severity: CadDiagnosticSeverity;
  code: string;
  message: string;
  sourceEntityHandle?: string;
  conversionLoss: boolean;
};
export type AcirDocument = {
  schema: typeof ACIR_SCHEMA_VERSION;
  sourceFile: string;
  sourceHash: string;
  sourceFormat: CadFormat;
  sourceVersion: string;
  units: string | "UNKNOWN";
  coordinateSystem: string | "UNKNOWN";
  extents: readonly number[] | null;
  parser: string;
  parserVersion: string;
  layers: readonly AcirLayer[];
  blockDefinitions: readonly AcirBlockDefinition[];
  blockInstances: readonly AcirBlockInstance[];
  entities: readonly AcirEntity[];
  diagnostics: readonly CadDiagnostic[];
  parseStatus: CadParseStatus;
  semanticPromotion: "PROHIBITED";
};
export type AcirLayer = { id: string; name: string; provenance: CadProvenance };
export type AcirBlockDefinition = { id: string; name: string; entityIds: readonly string[]; provenance: CadProvenance };
export type AcirBlockInstance = { id: string; definitionId: string; transform: readonly number[]; provenance: CadProvenance };
export type AcirEntity = {
  id: string;
  sourceHandle?: string;
  sourceType: string;
  layer: string;
  geometry: CadSourceGeometry | null;
  transform: readonly number[];
  properties: Readonly<Record<string, string | number | boolean | null>>;
  provenance: CadProvenance;
  parseStatus: CadParseStatus;
  semanticMeaning: "UNKNOWN_CAD_FACT";
};
export type CadInspection = { format: CadFormat; version: string; units: string | "UNKNOWN"; coordinateSystem: string | "UNKNOWN"; diagnostics: readonly CadDiagnostic[] };
export type CadCapabilities = { formats: readonly CadFormat[]; read: boolean; write: boolean; headless: boolean; deterministic: boolean; provider: string; licenseGate: "PASS" | "BLOCKED" | "UNKNOWN" };
export type CadReaderAdapter = {
  adapterId: string;
  adapterVersion: string;
  canRead: (format: CadFormat, sourceVersion: string) => boolean;
  inspect: (source: Uint8Array, sourceFile: string) => CadInspection;
  parse: (source: Uint8Array, sourceFile: string) => AcirDocument;
  diagnostics: (document: AcirDocument) => readonly CadDiagnostic[];
  capabilities: () => CadCapabilities;
};

function assertNonEmpty(value: string, label: string): void {
  if (value.trim().length === 0) throw new Error(`${label}_REQUIRED`);
}
function assertFiniteNumbers(values: readonly number[], label: string): void {
  if (values.some((value) => !Number.isFinite(value))) throw new Error(`${label}_INVALID_NUMBER`);
}
function assertHash(value: string): void {
  if (!/^ARKI-[0-9a-f]{8}$/i.test(value) && !/^[0-9a-f]{64}$/i.test(value)) throw new Error("SOURCE_HASH_INVALID");
}
export function sourceHash(source: Uint8Array): string { return stableHash(Array.from(source)); }
export function createCadProvenance(input: Omit<CadProvenance, "sourceFileHash"> & { sourceFileHash: string }): CadProvenance {
  assertHash(input.sourceFileHash);
  assertNonEmpty(input.sourceFormat, "SOURCE_FORMAT");
  assertNonEmpty(input.sourceVersion, "SOURCE_VERSION");
  assertNonEmpty(input.reader, "READER");
  assertNonEmpty(input.readerVersion, "READER_VERSION");
  return { ...input, transformationHistory: [...input.transformationHistory] };
}
export function createCadDiagnostic(input: Omit<CadDiagnostic, "diagnosticId"> & { diagnosticId?: string }): CadDiagnostic {
  assertNonEmpty(input.code, "DIAGNOSTIC_CODE");
  assertNonEmpty(input.message, "DIAGNOSTIC_MESSAGE");
  return { ...input, diagnosticId: input.diagnosticId ?? `diag:${stableHash(`${input.code}|${input.message}|${input.sourceEntityHandle ?? ""}`)}` };
}
export function createAcirEntity(input: AcirEntity): AcirEntity {
  assertNonEmpty(input.id, "ACIR_ENTITY_ID");
  assertNonEmpty(input.sourceType, "SOURCE_TYPE");
  assertNonEmpty(input.layer, "LAYER");
  assertFiniteNumbers(input.transform, "TRANSFORM");
  if (input.parseStatus === "PARSED" && input.geometry === null) throw new Error("PARSED_ENTITY_GEOMETRY_REQUIRED");
  if (input.semanticMeaning !== "UNKNOWN_CAD_FACT") throw new Error("ACIR_SEMANTIC_PROMOTION_PROHIBITED");
  return { ...input, transform: [...input.transform], properties: { ...input.properties } };
}
export function validateAcirDocument(document: AcirDocument): void {
  if (document.schema !== ACIR_SCHEMA_VERSION) throw new Error("ACIR_SCHEMA_UNSUPPORTED");
  assertNonEmpty(document.sourceFile, "SOURCE_FILE");
  assertHash(document.sourceHash);
  assertNonEmpty(document.sourceVersion, "SOURCE_VERSION");
  assertNonEmpty(document.parser, "PARSER");
  assertNonEmpty(document.parserVersion, "PARSER_VERSION");
  if (document.semanticPromotion !== "PROHIBITED") throw new Error("ACIR_PROMOTION_GATE_INVALID");
  if (document.parseStatus === "PARSED" && document.diagnostics.some((item) => item.severity === "ERROR" || item.conversionLoss)) throw new Error("PARSED_WITH_UNRESOLVED_DIAGNOSTICS");
  document.entities.forEach((entity) => createAcirEntity(entity));
}
export function serializeAcir(document: AcirDocument): string { validateAcirDocument(document); return JSON.stringify(document); }
export function createMockCadReaderAdapter(): CadReaderAdapter {
  return {
    adapterId: "ARKI-SYNTHETIC-CAD-READER",
    adapterVersion: "0.1.0",
    canRead: (format, sourceVersion) => (format === "DWG" || format === "DXF") && sourceVersion.length > 0,
    inspect: (source, sourceFile) => ({ format: sourceFile.toLowerCase().endsWith(".dxf") ? "DXF" : "DWG", version: "SYNTHETIC-1", units: "UNKNOWN", coordinateSystem: "UNKNOWN", diagnostics: source.length === 0 ? [createCadDiagnostic({ severity: "ERROR", code: "EMPTY_SOURCE", message: "CAD source is empty", conversionLoss: false })] : [] }),
    parse: (source, sourceFile) => {
      const format: CadFormat = sourceFile.toLowerCase().endsWith(".dxf") ? "DXF" : "DWG";
      const hash = sourceHash(source);
      const provenance = createCadProvenance({ sourceFileHash: hash, sourceFormat: format, sourceVersion: "SYNTHETIC-1", sourceEntityHandle: "SYNTH-1", reader: "ARKI-SYNTHETIC-CAD-READER", readerVersion: "0.1.0", transformationHistory: ["synthetic-fixture"] });
      const diagnostics = source.length === 0 ? [createCadDiagnostic({ severity: "ERROR", code: "EMPTY_SOURCE", message: "CAD source is empty", conversionLoss: false })] : [];
      const entity: AcirEntity = createAcirEntity({ id: `acir:${hash}`, sourceHandle: "SYNTH-1", sourceType: "LINE", layer: "SYNTHETIC", geometry: source.length === 0 ? null : { kind: "line", coordinates: [0, 0, 1, 1] }, transform: [1, 0, 0, 1, 0, 0], properties: { fixture: true }, provenance, parseStatus: source.length === 0 ? "CORRUPTED" : "PARSED", semanticMeaning: "UNKNOWN_CAD_FACT" });
      const document: AcirDocument = { schema: ACIR_SCHEMA_VERSION, sourceFile, sourceHash: hash, sourceFormat: format, sourceVersion: "SYNTHETIC-1", units: "UNKNOWN", coordinateSystem: "UNKNOWN", extents: source.length === 0 ? null : [0, 0, 1, 1], parser: "ARKI-SYNTHETIC-CAD-READER", parserVersion: "0.1.0", layers: [{ id: "layer:SYNTHETIC", name: "SYNTHETIC", provenance }], blockDefinitions: [], blockInstances: [], entities: [entity], diagnostics, parseStatus: source.length === 0 ? "CORRUPTED" : "PARSED", semanticPromotion: "PROHIBITED" };
      validateAcirDocument(document);
      return document;
    },
    diagnostics: (document) => document.diagnostics,
    capabilities: () => ({ formats: ["DWG", "DXF"], read: true, write: false, headless: true, deterministic: true, provider: "SYNTHETIC_ONLY", licenseGate: "PASS" }),
  };
}
export function assertNoCommercialProviderLoaded(adapter: CadReaderAdapter): void { if (adapter.adapterId !== "ARKI-SYNTHETIC-CAD-READER") throw new Error("COMMERCIAL_PROVIDER_RUNTIME_NOT_AUTHORIZED"); }
