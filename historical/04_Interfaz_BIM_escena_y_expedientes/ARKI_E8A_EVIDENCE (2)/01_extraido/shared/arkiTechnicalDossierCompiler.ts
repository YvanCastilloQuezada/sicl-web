import type { ProjectSnapshot } from "./arkiRecalculation";
import { generateTechnicalDossier, technicalDossierMarkdown } from "./arkiTechnicalDossier";
import { snapshotToConstructionModel } from "./arkiRecalculation";

export const ARKI_E8A_DOSSIER_SCHEMA = "ARKI-E8A-TECHNICAL-DOSSIER-1.0" as const;

export type ApprovedSnapshot = ProjectSnapshot & {
  approval: {
    gateStatus: "passed";
    approvedBy: string;
    approvedAt: string;
  };
};

export type DossierDocumentKind = "memoria" | "especificaciones" | "metrados" | "presupuesto" | "plano";

export type DossierDocument = {
  id: string;
  kind: DossierDocumentKind;
  fileName: string;
  mimeType: string;
  content: string;
  traceability: {
    sourceSnapshotId: string;
    sourceVersion: number;
    elementIds: string[];
  };
};

export type TechnicalDossierCompilation = {
  schema: typeof ARKI_E8A_DOSSIER_SCHEMA;
  status: "COMPILED";
  projectId: string;
  sourceSnapshotId: string;
  sourceVersion: number;
  approval: ApprovedSnapshot["approval"];
  documents: DossierDocument[];
  warnings: string[];
};

type WallDTO = {
  id: string;
  nombre: string;
  geometria: { x_inicio: number; y_inicio: number; x_fin: number; y_fin: number; altura: number; nivel_piso: number };
  metrado: { m2_muro: number; m3_muro: number; peso_total_kg: number; und_puertas: number; und_ventanas: number };
  estado: string;
  version: number;
};

function requireApproved(snapshot: ApprovedSnapshot): void {
  if (snapshot.approval.gateStatus !== "passed") {
    throw new Error("E8A_REQUIRES_APPROVED_SNAPSHOT");
  }
  if (!snapshot.approval.approvedBy || !snapshot.approval.approvedAt) {
    throw new Error("E8A_APPROVAL_PROVENANCE_REQUIRED");
  }
}

function trace(snapshot: ApprovedSnapshot, elementIds: string[]) {
  return {
    sourceSnapshotId: snapshot.id,
    sourceVersion: snapshot.version,
    elementIds: [...elementIds].sort(),
  };
}

function documentId(kind: DossierDocumentKind, snapshot: ApprovedSnapshot): string {
  return `e8a-${kind}-${snapshot.id}-v${snapshot.version}`;
}

function memoryContent(snapshot: ApprovedSnapshot, wallIds: string[], allElementIds: string[]): string {
  const model = snapshotToConstructionModel(snapshot);
  return [
    "# Memoria descriptiva — ARKI E8-A",
    "",
    `Proyecto: ${model.projectId}`,
    `Snapshot fuente: ${snapshot.id}`,
    `Versión: ${snapshot.version}`,
    `Aprobado por: ${snapshot.approval.approvedBy}`,
    `Aprobado en: ${snapshot.approval.approvedAt}`,
    "",
    "## Alcance del modelo",
    `Niveles: ${model.spaces.reduce((max, item) => Math.max(max, item.nivel_piso), 0) + 1}`,
    `Muros: ${model.walls.length}`,
    `Espacios: ${model.spaces.length}`,
    `Puertas: ${model.doors.length}`,
    `Ventanas: ${model.windows.length}`,
    `Elementos trazados: ${allElementIds.length}`,
    "",
    "## Advertencias",
    "Este documento es una compilación técnica derivada. Requiere revisión y firma de especialistas antes de cualquier emisión constructiva.",
    "",
    "## Trazabilidad",
    `Muros fuente: ${wallIds.join(", ") || "ninguno"}`,
    `Provenance del snapshot: ${snapshot.provenance.length} registros`,
  ].join("\n");
}

function specificationsContent(snapshot: ApprovedSnapshot): string {
  const dossier = generateTechnicalDossier(snapshotToConstructionModel(snapshot));
  return [
    technicalDossierMarkdown(dossier),
    "",
    "## E8-A Trazabilidad",
    `Snapshot fuente: ${snapshot.id}`,
    `Versión fuente: ${snapshot.version}`,
    `Aprobación: ${snapshot.approval.approvedBy} · ${snapshot.approval.approvedAt}`,
    "",
    "Estado: PROPUESTO EN REVISIÓN — requiere validación profesional.",
  ].join("\n");
}

function quantitiesContent(snapshot: ApprovedSnapshot, walls: WallDTO[]): string {
  const summary = snapshot.constructionModel;
  const lines = [
    "# Metrados — ARKI E8-A",
    "",
    `Snapshot fuente: ${snapshot.id}`,
    `Versión fuente: ${snapshot.version}`,
    "",
    "| Elemento | Nivel | Muro m² | Muro m³ | Peso kg | Puertas | Ventanas |",
    "|---|---:|---:|---:|---:|---:|---:|",
  ];
  for (const wall of walls) {
    lines.push(`| ${wall.id} | ${wall.geometria.nivel_piso} | ${wall.metrado.m2_muro} | ${wall.metrado.m3_muro} | ${wall.metrado.peso_total_kg} | ${wall.metrado.und_puertas} | ${wall.metrado.und_ventanas} |`);
  }
  lines.push("", "## Resumen del modelo", `Área neta de muros: ${summary.summary.totalNetWallAreaM2} m²`, `Volumen total: ${summary.summary.totalVolumeM3} m³`, `Peso total: ${summary.summary.totalWeightKg} kg`, "", "Estado: DERIVADO DEL SNAPSHOT APROBADO.");
  return lines.join("\n");
}

function budgetContent(snapshot: ApprovedSnapshot): string {
  const budget = snapshot.budget;
  return [
    "# Presupuesto base — ARKI E8-A",
    "",
    `Snapshot fuente: ${snapshot.id}`,
    `Versión fuente: ${snapshot.version}`,
    `Moneda: ${budget.currency}`,
    `PriceBook: ${budget.priceBookId} v${budget.priceBookVersion}`,
    "",
    "| Concepto | Importe |",
    "|---|---:|",
    `| Base del modelo | S/ ${budget.basePen.toFixed(2)} |`,
    `| Familias paramétricas | S/ ${budget.mamparasPen.toFixed(2)} |`,
    `| Total | S/ ${budget.totalPen.toFixed(2)} |`,
    "",
    "Estado: DERIVADO DEL SNAPSHOT APROBADO; requiere revisión de costos.",
  ].join("\n");
}

function planContent(snapshot: ApprovedSnapshot, walls: WallDTO[]): string {
  const scale = 20;
  const width = 520;
  const height = 360;
  const wallLines = walls.map((wall) => {
    const x1 = 20 + wall.geometria.x_inicio * scale;
    const y1 = 20 + wall.geometria.y_inicio * scale;
    const x2 = 20 + wall.geometria.x_fin * scale;
    const y2 = 20 + wall.geometria.y_fin * scale;
    return `<line data-element-id="${wall.id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#ffffff" stroke-width="4" />`;
  }).join("\n");
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<title>Planta trazable · ${snapshot.id} · versión ${snapshot.version}</title>`,
    `<rect width="${width}" height="${height}" fill="#080736" />`,
    wallLines,
    `<text x="20" y="340" fill="#ffffff" font-family="Arial" font-size="12">Snapshot ${snapshot.id} · V${snapshot.version} · E8-A</text>`,
    "</svg>",
  ].join("\n");
}

export function compileTechnicalDossier(snapshot: ApprovedSnapshot): TechnicalDossierCompilation {
  requireApproved(snapshot);
  const model = snapshotToConstructionModel(snapshot);
  const walls = snapshot.constructionModel.walls as unknown as WallDTO[];
  const wallIds = walls.map((wall) => wall.id);
  const allElementIds = [
    ...wallIds,
    ...model.spaces.map((item) => item.id),
    ...model.doors.map((item) => item.id),
    ...model.windows.map((item) => item.id),
    ...model.columns.map((item) => item.id),
    ...model.beams.map((item) => item.id),
    ...model.slabs.map((item) => item.id),
  ];
  const documents: DossierDocument[] = [
    { id: documentId("memoria", snapshot), kind: "memoria", fileName: "01-memoria-descriptiva.md", mimeType: "text/markdown;charset=utf-8", content: memoryContent(snapshot, wallIds, allElementIds), traceability: trace(snapshot, allElementIds) },
    { id: documentId("especificaciones", snapshot), kind: "especificaciones", fileName: "02-especificaciones-tecnicas.md", mimeType: "text/markdown;charset=utf-8", content: specificationsContent(snapshot), traceability: trace(snapshot, allElementIds) },
    { id: documentId("metrados", snapshot), kind: "metrados", fileName: "03-metrados.md", mimeType: "text/markdown;charset=utf-8", content: quantitiesContent(snapshot, walls), traceability: trace(snapshot, wallIds) },
    { id: documentId("presupuesto", snapshot), kind: "presupuesto", fileName: "04-presupuesto.md", mimeType: "text/markdown;charset=utf-8", content: budgetContent(snapshot), traceability: trace(snapshot, allElementIds) },
    { id: documentId("plano", snapshot), kind: "plano", fileName: "05-planta.svg", mimeType: "image/svg+xml", content: planContent(snapshot, walls), traceability: trace(snapshot, wallIds) },
  ];
  return {
    schema: ARKI_E8A_DOSSIER_SCHEMA,
    status: "COMPILED",
    projectId: model.projectId,
    sourceSnapshotId: snapshot.id,
    sourceVersion: snapshot.version,
    approval: snapshot.approval,
    documents,
    warnings: ["Requiere revisión y firma de especialistas; no es APTO PARA CONSTRUCCIÓN."],
  };
}
