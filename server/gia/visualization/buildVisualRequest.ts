import type { RenderData, RenderMaterial } from "./types";
import { renderSolidSvg } from "./renderSolidSvg";
import type { VisualGenerationRequest, VisualPurpose } from "../../arkiVisualIntelligence";

/**
 * Construye un VisualGenerationRequest desde un RenderData del Funnel 9-4-1.
 *
 * El prompt se deriva del cálculo (flowStrategy, organizingIdea, materiales,
 * orientación solar), no de una descripción libre. La geometría de referencia
 * es el SVG isométrico generado por renderSolidSvg.
 *
 * No convierte el SVG a PNG aquí (eso lo hace el endpoint con sharp).
 * Esta función solo prepara el contrato de datos.
 */
export function buildVisualRequestFromRenderData(
  renderData: RenderData,
  options: {
    quality?: "HD" | "2K" | "FULL_HD" | "4K" | "8K" | "16K";
    purpose?: VisualPurpose;
    language?: "es" | "en";
  } = {},
): VisualGenerationRequest & { referenceSvg: string } {
  const quality = options.quality ?? "2K";
  const purpose = options.purpose ?? "EXTERIOR_RENDER";
  const language = options.language ?? "es";

  // Prompt estructurado desde el cálculo
  const materialNames = renderData.materials.map((m) => m.id).join(", ");
  const flowDesc = flowStrategyDescription(renderData.flowStrategy);

  const prompt = [
    `Tipología: ${renderData.typology}.`,
    `PARTI ${renderData.partiId}: ${renderData.organizingIdea}.`,
    `Estrategia de flujo: ${flowDesc}.`,
    `Materiales del motor de sostenibilidad: ${materialNames}.`,
    `Iluminación: ${renderData.lighting.hdri}, sol a ${renderData.lighting.sunAzimuthDeg}° azimut, ${renderData.lighting.sunElevationDeg}° elevación.`,
    `Cámara: ${renderData.cameras[0]?.id ?? "perspectiva"} con fov ${renderData.cameras[0]?.fov ?? 45}.`,
    "La geometría de referencia es el SVG isométrico del sólido calculado por ARKI. Preserva exactamente esa geometría.",
  ].join(" ");

  // El SVG isométrico como referencia (el endpoint lo convertirá a PNG)
  const referenceSvg = renderSolidSvg(renderData);

  return {
    prompt,
    quality,
    purpose,
    language,
    preserveGeometry: true,
    projectId: renderData.projectId,
    referenceSvg,
  };
}

function flowStrategyDescription(flowStrategy: string): string {
  switch (flowStrategy) {
    case "linear-separation": return "torre esbelta con secuencia lineal y giro progresivo";
    case "central-hub": return "patio central con nodo de distribución";
    case "nested-rings": return "anillos concéntricos con copa ramificada";
    default: return "geometría paramétrica personalizada";
  }
}
