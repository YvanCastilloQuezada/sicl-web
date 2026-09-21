import { createHash } from "node:crypto";

export type BimViewerFormat = "ARK" | "IFC" | "RVT" | "DGN" | "DWG";
export type BimViewerAdapterStatus = "NATIVE_CANONICAL" | "INSPECTABLE_WITH_ADAPTER" | "HOST_REQUIRED" | "NOT_IMPLEMENTED";
export type BimViewerElementKind = "SPACE" | "WALL" | "SLAB" | "COLUMN" | "BEAM" | "DUCT" | "PIPE" | "CABLE_TRAY" | "EQUIPMENT" | "SITE" | "UNKNOWN";

export type BimBox = { min: [number, number, number]; max: [number, number, number] };
export type BimViewerElement = { id: string; kind: BimViewerElementKind; name: string; discipline: string; level?: string; box: BimBox; sourceId: string; properties?: Record<string, string | number | boolean> };
export type BimViewerModel = { modelId: string; name: string; format: BimViewerFormat; version: string; units: string; coordinateSystem: string; elements: BimViewerElement[]; sourceIds: string[]; humanReviewRequired: true };

export type BimInterference = { id: string; severity: "CRITICAL" | "MAJOR" | "MINOR"; leftElementId: string; rightElementId: string; disciplines: [string, string]; overlapVolume: number; location: [number, number, number]; status: "OPEN" | "REVIEWED" | "RESOLVED"; reason: string };

const ADAPTERS: Record<BimViewerFormat, { status: BimViewerAdapterStatus; input: string; output: string; boundary: string }> = {
  ARK: { status: "NATIVE_CANONICAL", input: "ARKI-ARK-1.0 or normalized ARK BIM model", output: "ARK canonical model and viewer scene", boundary: "Canonical ARK model is inspectable; design approval is not implied." },
  IFC: { status: "INSPECTABLE_WITH_ADAPTER", input: "IFC2x3/IFC4 file through approved parser", output: "Normalized elements and properties", boundary: "Parser fidelity and schema coverage require adapter validation." },
  RVT: { status: "HOST_REQUIRED", input: "Revit model through authorized Revit/Dynamo host", output: "Normalized export or live host view", boundary: "No direct proprietary RVT parsing is claimed in the browser." },
  DGN: { status: "HOST_REQUIRED", input: "MicroStation/ProjectWise or authorized converter", output: "Normalized geometry and references", boundary: "No direct proprietary DGN parsing is claimed in the browser." },
  DWG: { status: "INSPECTABLE_WITH_ADAPTER", input: "Approved CAD/DWG parser or host", output: "Normalized geometry and layers", boundary: "Layer semantics and units require adapter validation." },
};

function volume(box: BimBox) { return Math.max(0, box.max[0] - box.min[0]) * Math.max(0, box.max[1] - box.min[1]) * Math.max(0, box.max[2] - box.min[2]); }
function overlap(boxA: BimBox, boxB: BimBox): BimBox | null {
  const min: [number, number, number] = [Math.max(boxA.min[0], boxB.min[0]), Math.max(boxA.min[1], boxB.min[1]), Math.max(boxA.min[2], boxB.min[2])];
  const max: [number, number, number] = [Math.min(boxA.max[0], boxB.max[0]), Math.min(boxA.max[1], boxB.max[1]), Math.min(boxA.max[2], boxB.max[2])];
  return min.every((value, index) => value < max[index]) ? { min, max } : null;
}
function center(box: BimBox): [number, number, number] { return [(box.min[0] + box.max[0]) / 2, (box.min[1] + box.max[1]) / 2, (box.min[2] + box.max[2]) / 2]; }
function severity(a: BimViewerElement, b: BimViewerElement, overlapVolume: number): BimInterference["severity"] { if (a.discipline !== b.discipline && overlapVolume > 0.5) return "CRITICAL"; if (overlapVolume > 0.05) return "MAJOR"; return "MINOR"; }

export function bimViewerAdapterCatalog() {
  return { version: "ARKI-BIM-VISOR-1.0", canonicalFormat: "ARK", formats: ADAPTERS, supportedReview: ["MODEL_INTAKE", "ELEMENT_PROPERTIES", "SPATIAL_QUERY", "AABB_CLASH_DETECTION", "ISSUE_REGISTER"], humanReviewRequired: true, nativeApproval: false } as const;
}

export function inspectBimArtifact(fileName: string, content: string | Buffer) {
  const extension = fileName.toLowerCase().split(".").pop();
  const format = extension === "ark" ? "ARK" : extension === "ifc" ? "IFC" : extension === "rvt" ? "RVT" : extension === "dgn" ? "DGN" : extension === "dwg" ? "DWG" : null;
  const checksum = `sha256:${createHash("sha256").update(content).digest("hex")}`;
  if (!format) return { status: "REJECTED" as const, fileName, checksum, reason: "UNSUPPORTED_BIM_FORMAT" };
  const adapter = ADAPTERS[format];
  return { status: adapter.status, fileName, format, checksum, sizeBytes: Buffer.byteLength(content), adapter, humanReviewRequired: true as const };
}

export function detectBimInterferences(models: BimViewerModel[], tolerance = 0.001): { schema: "ARKI-BIM-CLASH-1.0"; interferences: BimInterference[]; checkedPairs: number; unknowns: string[]; status: "PASS_WITH_OPEN_ISSUES" | "NO_CLASHES" | "BLOCKED"; humanReviewRequired: true } {
  if (!Number.isFinite(tolerance) || tolerance <= 0 || tolerance > 1) throw new Error("INVALID_CLASH_TOLERANCE");
  const elements = models.flatMap((model) => model.elements.map((element) => ({ ...element, modelId: model.modelId })));
  const issues: BimInterference[] = [];
  let checkedPairs = 0;
  for (let i = 0; i < elements.length; i += 1) {
    for (let j = i + 1; j < elements.length; j += 1) {
      const left = elements[i];
      const right = elements[j];
      if (left.modelId === right.modelId && left.discipline === right.discipline) continue;
      checkedPairs += 1;
      const box = overlap(left.box, right.box);
      if (!box || volume(box) <= tolerance) continue;
      const overlapVolume = volume(box);
      issues.push({ id: `CLASH-${issues.length + 1}`.padStart(11, "0"), severity: severity(left, right, overlapVolume), leftElementId: left.id, rightElementId: right.id, disciplines: [left.discipline, right.discipline], overlapVolume, location: center(box), status: "OPEN", reason: "Axis-aligned bounding boxes overlap; geometry and discipline responsibility require review." });
    }
  }
  return { schema: "ARKI-BIM-CLASH-1.0", interferences: issues, checkedPairs, unknowns: models.some((model) => model.format !== "ARK") ? ["Native parser fidelity and semantic mapping require adapter validation."] : [], status: issues.length ? "PASS_WITH_OPEN_ISSUES" : "NO_CLASHES", humanReviewRequired: true };
}

export function arkiBimViewerContract() {
  return { ...bimViewerAdapterCatalog(), flow: "IMPORT → NORMALIZE → VIEW → CLASH CHECK → ISSUE REGISTER → HUMAN REVIEW → RESOLUTION", oneMotor: true, usesParametricRuntime: true, formatPolicy: "ARK canonical; IFC/RVT/DGN/DWG adapter governed", boundary: "Clash candidates are not engineering conclusions, code compliance or approval." } as const;
}
