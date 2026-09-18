import { buildIntegratedProductFoundation, type IntegratedProductFoundation } from "./arkiIntegratedProductFoundation";
import { deriveDrawingViews, drawingViewToSvg, type DrawingView } from "./arkiBuildingAuthoring";

export type DeliveryState = "READY" | "READY_WITH_OBSERVATIONS" | "BLOCKED" | "EXTERNAL_VALIDATION_REQUIRED" | "REQUIRES_DATA";
export type DeliveryArtifact = { id: string; kind: string; state: DeliveryState; source: string; notes: string[] };
export type ArkiDeliveryPackage = {
  projectId: string;
  modelVersion: string;
  maturity: IntegratedProductFoundation["model"]["maturity"];
  state: DeliveryState;
  artifacts: DeliveryArtifact[];
  drawingViews: DrawingView[];
  svg: string[];
  consistency: { modelVersionConsistent: boolean; stableIdentity: boolean; noAutomaticDecision: true; humanReviewRequired: true };
  externalDependencies: string[];
};

const artifact = (id: string, kind: string, state: DeliveryState, source: string, notes: string[] = []): DeliveryArtifact => ({ id, kind, state, source, notes });

export function buildArkiDeliveryPackage(foundation: IntegratedProductFoundation = buildIntegratedProductFoundation()): ArkiDeliveryPackage {
  const views = deriveDrawingViews(foundation.model);
  const svg = views.map(drawingViewToSvg);
  const modelVersionConsistent = views.every((view) => view.modelVersion === foundation.model.modelVersion);
  const stableIdentity = foundation.model.elements.length > 0 && foundation.model.elements.every((element) => element.arkiId.length > 0);
  const artifacts: DeliveryArtifact[] = [
    artifact(`${foundation.projectId}:DESIGN-BASIS`, "DESIGN_BASIS", "READY_WITH_OBSERVATIONS", "IntegratedProductFoundation", ["Program and canonical model are available; full professional sheet package is not claimed."]),
    artifact(`${foundation.projectId}:DRAWINGS`, "DRAWINGS", modelVersionConsistent ? "READY_WITH_OBSERVATIONS" : "BLOCKED", "CanonicalBuildingModel → deriveDrawingViews", ["Conceptual plan/site/section/elevation views only."]),
    artifact(`${foundation.projectId}:VISUAL`, "SVG", svg.length > 0 ? "READY_WITH_OBSERVATIONS" : "BLOCKED", "DrawingView → drawingViewToSvg", ["Interactive 3D and photorealistic rendering are separate capabilities."]),
    artifact(`${foundation.projectId}:CAD`, "DXF", "EXTERNAL_VALIDATION_REQUIRED", "SpatialRepresentation adapter", ["DXF generation exists; parser round-trip is not executed here."]),
    artifact(`${foundation.projectId}:BIM`, "IFC", "EXTERNAL_VALIDATION_REQUIRED", "SpatialRepresentation massing adapter", ["Massing-only IFC; native Revit is not claimed."]),
    artifact(`${foundation.projectId}:GIS`, "GEOJSON", "REQUIRES_DATA", "SpatialRepresentation adapter", ["Requires georeferenced project input, CRS and provenance."]),
    artifact(`${foundation.projectId}:PROJECT-DATA`, "PERSISTENCE", "READY_WITH_OBSERVATIONS", "serializePersistentProjectState", ["Local deterministic snapshot; production persistence is not claimed."]),
  ];
  const state = artifacts.some((item) => item.state === "BLOCKED") ? "BLOCKED" : artifacts.some((item) => item.state === "EXTERNAL_VALIDATION_REQUIRED" || item.state === "REQUIRES_DATA") ? "READY_WITH_OBSERVATIONS" : "READY";
  return { projectId: foundation.projectId, modelVersion: foundation.model.modelVersion, maturity: foundation.model.maturity, state, artifacts, drawingViews: views, svg, consistency: { modelVersionConsistent, stableIdentity, noAutomaticDecision: true, humanReviewRequired: true }, externalDependencies: ["IFC parser/readback", "Revit runtime", "surveyed GIS/CRS data", "professional PDF/sheet review"] };
}

export function validateArkiDeliveryPackage(delivery: ArkiDeliveryPackage): boolean {
  return delivery.consistency.modelVersionConsistent && delivery.consistency.stableIdentity && delivery.consistency.noAutomaticDecision && delivery.consistency.humanReviewRequired && delivery.drawingViews.length >= 4 && delivery.svg.length === delivery.drawingViews.length;
}
