import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { resolve } from "node:path";
import type { EnterpriseDomain, Maturity } from "./arkiEnterpriseArchitecture";

const execFileAsync = promisify(execFile);

export type AdapterKind = "BIM" | "CAD_3D" | "CAD_2D" | "GIS" | "MESH" | "PUBLICATION";
export type AdapterRuntime = "OSS_WORKER_REQUIRED" | "WEB_WASM_OPTIONAL" | "CONTRACT_ONLY";
export type ExchangeFormat = "IFC2X3" | "IFC4" | "IFC4X3" | "STEP" | "IGES" | "DXF" | "DWG" | "GEOPACKAGE" | "GEOJSON" | "GLB" | "OBJ" | "SVG" | "PDF" | "DOCX";

export type NativeAdapter = {
  id: string;
  name: string;
  kind: AdapterKind;
  domain: EnterpriseDomain;
  license: string;
  runtime: AdapterRuntime;
  maturity: Maturity;
  formats: ExchangeFormat[];
  source: string;
  officialDocs: string[];
  canRoundTrip: "NOT_ESTABLISHED" | "CONTROLLED_ONLY";
  limits: string[];
};

/** Registry only: no worker is claimed to be installed or production-ready. */
export const ARKI_NATIVE_ADAPTERS: NativeAdapter[] = [
  { id: "IFC-OPEN-SHELL", name: "IfcOpenShell / IfcConvert", kind: "BIM", domain: "EXTERNAL_ECOSYSTEM", license: "LGPL-3.0-or-later", runtime: "OSS_WORKER_REQUIRED", maturity: "PARTIAL", formats: ["IFC2X3", "IFC4", "IFC4X3", "GLB", "OBJ", "STEP", "IGES", "SVG"], source: "https://github.com/IfcOpenShell/IfcOpenShell", officialDocs: ["https://docs.ifcopenshell.org/introduction.html", "https://docs.ifcopenshell.org/ifcconvert.html"], canRoundTrip: "CONTROLLED_ONLY", limits: ["Requires pinned Python/C++ worker and real IFC fixtures.", "MVD, IDS, GUID, property and geometry loss must be reported per exchange.", "No ARKI runtime worker is installed in this phase."] },
  { id: "OCCT", name: "Open CASCADE Technology", kind: "CAD_3D", domain: "EXTERNAL_ECOSYSTEM", license: "LGPL-2.1-with-OCCT-exception", runtime: "OSS_WORKER_REQUIRED", maturity: "PARTIAL", formats: ["STEP", "IGES", "GLB", "OBJ"], source: "https://github.com/Open-Cascade-SAS/OCCT", officialDocs: ["https://occt3d.com/dev/doc/overview/html/index.html"], canRoundTrip: "CONTROLLED_ONLY", limits: ["C++ toolchain and shape-healing validation are required.", "Advanced proprietary exchange components are outside the OSS baseline.", "No ARKI native OCCT worker is installed in this phase."] },
  { id: "EZDXF", name: "ezdxf", kind: "CAD_2D", domain: "EXTERNAL_ECOSYSTEM", license: "MIT", runtime: "OSS_WORKER_REQUIRED", maturity: "PARTIAL", formats: ["DXF"], source: "https://github.com/mozman/ezdxf", officialDocs: ["https://ezdxf.readthedocs.io/en/stable/introduction.html"], canRoundTrip: "CONTROLLED_ONLY", limits: ["DXF feature coverage is not complete.", "It is not a CAD kernel and does not convert DXF to DWG.", "No ARKI Python worker is installed in this phase."] },
  { id: "GDAL-PROJ-GEOS", name: "GDAL/OGR + PROJ/GEOS", kind: "GIS", domain: "EXTERNAL_ECOSYSTEM", license: "MIT-style plus dependency-specific terms", runtime: "OSS_WORKER_REQUIRED", maturity: "PARTIAL", formats: ["GEOPACKAGE", "GEOJSON", "DXF", "PDF"], source: "https://github.com/OSGeo/gdal", officialDocs: ["https://gdal.org/en/stable/license.html", "https://gdal.org/en/stable/drivers/vector/gpkg.html"], canRoundTrip: "CONTROLLED_ONLY", limits: ["CRS and units must be explicit; DXF/DWG do not silently provide georeferencing.", "Build dependencies can change licensing obligations.", "No ARKI GDAL worker is installed in this phase."] },
  { id: "GLTF-TRANSFORM", name: "glTF Transform", kind: "MESH", domain: "EXTERNAL_ECOSYSTEM", license: "MIT", runtime: "WEB_WASM_OPTIONAL", maturity: "PARTIAL", formats: ["GLB", "OBJ"], source: "https://github.com/donmccurdy/glTF-Transform", officialDocs: ["https://gltf-transform.dev/"], canRoundTrip: "CONTROLLED_ONLY", limits: ["GLB/glTF are visualization projections, not BIM or B-Rep sources.", "Materials, identities and scale require controlled fixtures."] },
  { id: "PUBLICATION-OSS", name: "WeasyPrint + CairoSVG + python-docx", kind: "PUBLICATION", domain: "CAD_DOCUMENTATION", license: "BSD-3-Clause / LGPL-3 / MIT", runtime: "OSS_WORKER_REQUIRED", maturity: "PARTIAL", formats: ["SVG", "PDF", "DOCX"], source: "https://github.com/Kozea/WeasyPrint", officialDocs: ["https://doc.courtbouillon.org/weasyprint/stable/", "https://cairosvg.org/documentation/", "https://python-docx.readthedocs.io/"], canRoundTrip: "NOT_ESTABLISHED", limits: ["Publication outputs are not editable CAD/BIM sources.", "Fonts, pagination and renderer differences require golden fixtures.", "No ARKI publication worker is installed in this phase."] },
];

export type ExchangeEnvelope = {
  projectId: string;
  sourceFormat: ExchangeFormat;
  targetFormat: ExchangeFormat;
  sourceFileName: string;
  sourceChecksum?: string;
  schemaVersion: string;
  units?: string;
  crs?: string;
  tolerance?: number;
  profile?: string;
  idsProfile?: string;
  preserveOriginal: true;
  humanReviewRequired: true;
};

export type ExchangeDiagnostic = { status: "CONTRACT_VALID" | "REJECTED"; errors: string[]; warnings: string[]; lossCategories: string[] };
const requiresCrs = new Set<ExchangeFormat>(["GEOPACKAGE", "GEOJSON"]);
const bimFormats = new Set<ExchangeFormat>(["IFC2X3", "IFC4", "IFC4X3"]);
const cadFormats = new Set<ExchangeFormat>(["STEP", "IGES", "DXF", "DWG"]);

export function validateExchangeEnvelope(envelope: ExchangeEnvelope): ExchangeDiagnostic {
  const errors: string[] = [];
  const warnings: string[] = [];
  const lossCategories: string[] = [];
  if (!envelope.projectId.trim()) errors.push("projectId is required");
  if (!envelope.sourceFileName.trim()) errors.push("sourceFileName is required");
  if (!envelope.schemaVersion.trim()) errors.push("schemaVersion is required");
  if (envelope.preserveOriginal !== true) errors.push("preserveOriginal must remain true");
  if (envelope.humanReviewRequired !== true) errors.push("humanReviewRequired must remain true");
  if ((requiresCrs.has(envelope.sourceFormat) || requiresCrs.has(envelope.targetFormat)) && !envelope.crs?.trim()) errors.push("CRS is required for GIS exchanges");
  if ((cadFormats.has(envelope.sourceFormat) || cadFormats.has(envelope.targetFormat)) && !envelope.units?.trim()) warnings.push("CAD units are not declared; scale cannot be trusted");
  if ((bimFormats.has(envelope.sourceFormat) || bimFormats.has(envelope.targetFormat)) && !envelope.profile?.trim()) warnings.push("IFC profile/MVD is not declared");
  if ((bimFormats.has(envelope.sourceFormat) || bimFormats.has(envelope.targetFormat)) && !envelope.idsProfile?.trim()) warnings.push("IDS profile is not declared");
  if (envelope.sourceFormat !== envelope.targetFormat) {
    lossCategories.push("SEMANTICS_OR_ATTRIBUTES");
    if (bimFormats.has(envelope.sourceFormat) || bimFormats.has(envelope.targetFormat)) lossCategories.push("BIM_RELATIONSHIPS_OR_PROPERTIES");
    if (cadFormats.has(envelope.sourceFormat) || cadFormats.has(envelope.targetFormat)) lossCategories.push("TOLERANCE_OR_PARAMETRIC_HISTORY");
    if (requiresCrs.has(envelope.sourceFormat) || requiresCrs.has(envelope.targetFormat)) lossCategories.push("CRS_OR_GEOMETRY_PRECISION");
    if (["GLB", "OBJ", "SVG", "PDF", "DOCX"].includes(envelope.targetFormat)) lossCategories.push("SOURCE_EDITABILITY");
  }
  return { status: errors.length ? "REJECTED" : "CONTRACT_VALID", errors, warnings, lossCategories: Array.from(new Set(lossCategories)) };
}

export function selectAdapter(source: ExchangeFormat, target: ExchangeFormat) {
  if (bimFormats.has(source) || bimFormats.has(target)) return "IFC-OPEN-SHELL";
  if (["STEP", "IGES"].includes(source) || ["STEP", "IGES"].includes(target)) return "OCCT";
  if (source === "DXF" || target === "DXF") return "EZDXF";
  if (requiresCrs.has(source) || requiresCrs.has(target)) return "GDAL-PROJ-GEOS";
  if (["GLB", "OBJ"].includes(source) || ["GLB", "OBJ"].includes(target)) return "GLTF-TRANSFORM";
  return "PUBLICATION-OSS";
}

export function buildLossManifest(envelope: ExchangeEnvelope, diagnostic: ExchangeDiagnostic) {
  return {
    manifestVersion: "ARKI-EXCHANGE-LOSS-1.0",
    projectId: envelope.projectId,
    source: { format: envelope.sourceFormat, fileName: envelope.sourceFileName, checksum: envelope.sourceChecksum ?? "UNKNOWN" },
    target: { format: envelope.targetFormat },
    schemaVersion: envelope.schemaVersion,
    adapterSelection: selectAdapter(envelope.sourceFormat, envelope.targetFormat),
    diagnostic,
    originalPreserved: envelope.preserveOriginal,
    humanReviewRequired: envelope.humanReviewRequired,
    status: diagnostic.status === "CONTRACT_VALID" ? "AI_PROPOSED_EXCHANGE" : "REJECTED_BEFORE_EXECUTION",
  } as const;
}

export function nativeAdapterCapabilityMatrix() {
  return ARKI_NATIVE_ADAPTERS.map(({ id, name, kind, license, runtime, maturity, formats, canRoundTrip }) => ({ id, name, kind, license, runtime, maturity, formats, canRoundTrip }));
}

export function planProfessionalExport(input: ExchangeEnvelope) {
  const diagnostic = validateExchangeEnvelope(input);
  return { adapterId: selectAdapter(input.sourceFormat, input.targetFormat), diagnostic, lossManifest: buildLossManifest(input, diagnostic), execution: "NOT_EXECUTED_WORKER_NOT_INSTALLED" as const };
}

export async function executeOssWorker(operation: "dxf" | "geojson" | "gpkg" | "ifc" | "step" | "iges", outputPath: string) {
  const python = process.env.ARKI_OSS_PYTHON ?? "python3";
  const worker = resolve(process.cwd(), "tools/arki_exchange_worker.py");
  try {
    const result = await execFileAsync(python, [worker, operation, outputPath], { timeout: 120_000, maxBuffer: 1_000_000 });
    return { status: "EXECUTED" as const, operation, outputPath, stdout: result.stdout.trim(), stderr: result.stderr.trim(), worker };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { status: "WORKER_FAILED" as const, operation, outputPath, stdout: "", stderr: message, worker };
  }
}
