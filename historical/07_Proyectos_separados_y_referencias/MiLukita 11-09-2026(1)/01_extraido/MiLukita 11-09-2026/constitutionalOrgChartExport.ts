import { MASTER_ORGANIGRAM } from "@/../../shared/milukitaMasterOrder";

export type OrgLayer = (typeof MASTER_ORGANIGRAM)[number];
export type OrgOffset = { x: number; y: number };

export const ORGANIGRAM_DESCRIPTION: Record<string, string> = {
  "MILUKITA NETWORK": "Capa superior que reúne las tres experiencias oficiales y la identidad transversal Lukita, sin mezclar audiencias ni permisos.",
  "EXPERIENCE OS": "Entrega la experiencia por Web, Mobile, TV, QR, UX, accesibilidad y second screen.",
  "CONTENT OS": "Organiza entretenimiento, educación, arte, cultura, juegos, shows, eventos y la presentación de Lukita.",
  "BUSINESS OS": "Agrupa finanzas, revenue, ventas, publicidad, sponsors, partnerships, distribución e inteligencia fiscal.",
  "AGENT OS": "Coordina agentes por dominio en modo limitado y propositivo; ningún agente gobierna resultados ni MJP CORE.",
  "GOVERNANCE OS": "Define legal, regulación, compliance, política, auditoría, control de autoridad y gobernanza humana.",
  "KPI / OBSERVABILITY": "Mide audiencia, negocio, experiencia, operaciones, gobernanza y seguridad; sin datos no formula claims.",
  "CONTROL ROOM": "Superficie administrativa para observación, evidencia, aprobaciones humanas y trazabilidad exportable.",
  "AUTHORITY BOUNDARY": "Frontera de quality gates, escalamiento humano y enforcement propose-only antes de cualquier ejecución.",
  "MJP CORE": "Núcleo protegido de RNG, reglas, resultados, wallet, créditos, ledger, settlement, integridad y MjpTvManifest.",
};

export const escapeXml = (value: string) => value.replace(/[<>&'\"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[character] ?? character);
export const matchesOrgQuery = (item: OrgLayer, query: string) => { const normalized = query.trim().toLocaleLowerCase(); return !normalized || `${item.layer} ${item.units.join(" ")}`.toLocaleLowerCase().includes(normalized); };
export const getUniqueOrgMatch = (layers: readonly OrgLayer[], query: string): OrgLayer | undefined => { const normalized = query.trim(); if (!normalized) return undefined; const matches = layers.filter((item) => matchesOrgQuery(item, normalized)); return matches.length === 1 ? matches[0] : undefined; };

export function buildConstitutionalOrgSvg(layers: readonly OrgLayer[], selected: OrgLayer, query: string, zoom: number, offset: OrgOffset) {
  const rowHeight = 58;
  const width = 1400;
  const height = Math.max(720, 230 + layers.length * rowHeight);
  const nodes = layers.map((item, index) => { const y = 175 + index * rowHeight; const isSelected = item.layer === selected.layer; return `<g transform="translate(${offset.x},${offset.y}) scale(${zoom})" transform-origin="700 175"><rect x="70" y="${y}" width="700" height="42" rx="10" fill="${isSelected ? "#164e3b" : "#10251e"}" stroke="${isSelected ? "#8be6c1" : "#35564b"}"/><text x="92" y="${y + 26}" fill="#e9fff5" font-family="Arial, sans-serif" font-size="16">${String(index + 1).padStart(2, "0")}  ${escapeXml(item.layer)}</text><text x="740" y="${y + 26}" fill="#9ab4aa" font-family="Arial, sans-serif" font-size="13" text-anchor="end">${item.units.length} módulos</text></g>`; }).join("");
  const units = selected.units.map((unit, index) => `<text x="855" y="${215 + index * 28}" fill="#d8eee5" font-family="Arial, sans-serif" font-size="15">• ${escapeXml(unit)}</text>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#06120e"/><text x="70" y="65" fill="#9ce9c6" font-family="Arial, sans-serif" font-size="14" letter-spacing="3">MILUKITA · GOVERNANCE OS</text><text x="70" y="112" fill="#ffffff" font-family="Georgia, serif" font-size="38">Organigrama constitucional</text><text x="70" y="143" fill="#9eb7ad" font-family="Arial, sans-serif" font-size="14">Vista pública de solo lectura · búsqueda: ${escapeXml(query || "todas las capas")} · zoom ${Math.round(zoom * 100)}% · desplazamiento ${offset.x}, ${offset.y}</text>${nodes}<rect x="825" y="175" width="500" height="${Math.max(300, selected.units.length * 28 + 90)}" rx="12" fill="#0c2119" stroke="#35564b"/><text x="855" y="215" fill="#9ce9c6" font-family="Arial, sans-serif" font-size="13" letter-spacing="2">CAPA SELECCIONADA</text><text x="855" y="255" fill="#ffffff" font-family="Arial, sans-serif" font-size="25" font-weight="700">${escapeXml(selected.layer)}</text>${units}<text x="855" y="${245 + selected.units.length * 28}" fill="#9eb7ad" font-family="Arial, sans-serif" font-size="13">${escapeXml(ORGANIGRAM_DESCRIPTION[selected.layer] ?? "Capa informativa de revisión.")}</text></svg>`;
}

export const buildConstitutionalOrgPrintHtml = (svg: string) => `<!doctype html><html><head><meta charset="utf-8"><title>MiLukita · Organigrama constitucional</title><style>body{margin:0;background:#06120e;color:#fff;font-family:Arial,sans-serif}main{padding:24px}img{width:100%;height:auto}@media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}}</style></head><body><main><img alt="Organigrama constitucional de MiLukita" src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}"></main><script>window.onload=function(){window.print();}</script></body></html>`;
export const getOrgChartPngFilename = () => "milukita-organigrama-constitucional.png";
