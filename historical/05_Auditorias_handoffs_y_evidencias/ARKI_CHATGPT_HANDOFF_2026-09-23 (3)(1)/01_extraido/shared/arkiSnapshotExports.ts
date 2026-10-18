// ARKI — Snapshot Exports
// Entrega 1C — exportaciones desde snapshot.
// IFC: post-procesado controlado del string de exportConstructionIfc.
// Markdown: documento propio desde snapshot, no desde TechnicalDossier.

import { exportConstructionIfc } from "./arkiConstructionOntology";
import type { ProjectSnapshot } from "./arkiRecalculation";
import { snapshotToConstructionModel } from "./arkiRecalculation";
import { MAMPARA_FAMILY_ID, MAMPARA_MATERIALS } from "./arkiMamparaFamily";

// ---------------------------------------------------------------------------
// IFC — post-procesado del string de exportConstructionIfc.
// No modifica exportConstructionIfc ni arkiConstructionOntology.ts.
// Inserta entidades de FamilyInstance antes de ENDSEC;END-ISO-10303-21;.
// IDs deterministas derivados del snapshot.id y de instance.id.
// ---------------------------------------------------------------------------

function ifcSafeId(raw: string): string {
  return raw.replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(0, 22);
}

function step(value: unknown): string {
  return `'${String(value ?? "").replace(/'/g, "''")}'`;
}

export function exportSnapshotToIfc(snapshot: ProjectSnapshot): {
  fileName: string;
  mimeType: string;
  content: string;
  metadata: {
    schema: string;
    baseExport: string;
    familyInstanceCount: number;
    mamparaCount: number;
    conceptualGeometryOnly: boolean;
    nativeRvt: boolean;
  };
} {
  const model = snapshotToConstructionModel(snapshot);
  const base = exportConstructionIfc(model, {
    name: `Snapshot ${snapshot.id}`,
    familyId: "ARKI-SNAPSHOT",
    city: undefined,
    country: "PE",
  });

  const lines: string[] = [];
  let nextId = 100000; // IDs altos para evitar colisión con el exportador base.
  const insertedRefs: number[] = [];

  const mamparas = snapshot.familyInstances.filter((i) => i.familyId === MAMPARA_FAMILY_ID);

  for (const instance of mamparas) {
    const geometry = snapshot.mamparaGeometry[instance.id];
    if (!geometry) continue;

    const proxyId = nextId++;
    insertedRefs.push(proxyId);

    const guid = ifcSafeId(`${snapshot.id}-${instance.id}-PROXY`);
    lines.push(
      `#${proxyId}=IFCBUILDINGELEMENTPROXY('${guid}',${step(
        `Mampara ${instance.id}`,
      )},'FamilyInstance','${instance.familyId}','${instance.typeId}',${geometry.positionM.x},${geometry.positionM.y},${geometry.positionM.z},${geometry.widthM},${geometry.heightM},${geometry.depthM},${geometry.rotationDeg});`,
    );

    // Materiales de la mampara
    const materialRefs: number[] = [];
    for (const mat of MAMPARA_MATERIALS) {
      const matId = nextId++;
      lines.push(
        `#${matId}=IFCMATERIAL('${mat.name}');`,
      );
      materialRefs.push(matId);
    }

    // PropertySet con parámetros y geometría
    const paramProps = instance.parameters;
    const propEntries: string[] = [];
    for (const [key, value] of Object.entries(paramProps)) {
      const v = typeof value === "number" ? value : `'${String(value)}'`;
      propEntries.push(`'${key}'`, `${v}`);
    }
    propEntries.push("'widthM'", `${geometry.widthM}`);
    propEntries.push("'heightM'", `${geometry.heightM}`);
    propEntries.push("'depthM'", `${geometry.depthM}`);
    propEntries.push("'panelCount'", `${geometry.panelCount}`);
    propEntries.push("'glassAreaM2'", `${geometry.glassAreaM2}`);
    if (instance.hostId) {
      propEntries.push("'hostId'", `'${instance.hostId}'`);
    }

    const propId = nextId++;
    const propGuid = ifcSafeId(`${snapshot.id}-${instance.id}-PSET`);
    lines.push(
      `#${propId}=IFCPROPERTYSET('${propGuid}',${step(
        `Mampara ${instance.id}`,
      )},'ARKI_ParametricFamily',(${propEntries.join(",")}));`,
    );

    // Relación de propiedades
    const relId = nextId++;
    const relGuid = ifcSafeId(`${snapshot.id}-${instance.id}-REL`);
    lines.push(
      `#${relId}=IFCRELDEFINESBYPROPERTIES('${relGuid}',${step(
        `Props for ${instance.id}`,
      )},(#${proxyId}),#${propId});`,
    );
  }

  if (insertedRefs.length > 0) {
    // Relación de contención: una relación simple por mampara con hostId.
    // No se usan entidades IFC complejas para mantener compatibilidad.
    const containmentId = nextId++;
    lines.push(
      `#${containmentId}=IFCRELCONTAINEDINSPATIALSTRUCTURE(${step(
        `Containment ${snapshot.id}`,
      )},'Mamparas del snapshot',(${insertedRefs.map((r) => `#${r}`).join(",")}));`,
    );
  }

  const marker = "ENDSEC;END-ISO-10303-21;";
  const idx = base.content.lastIndexOf(marker);
  if (idx < 0) {
    throw new Error("IFC_INSERTION_POINT_NOT_FOUND");
  }

  const before = base.content.slice(0, idx);
  const after = base.content.slice(idx);
  const injected = insertedRefs.length > 0 ? `${lines.join("\n")}\n` : "";
  const content = `${before}${injected}${after}`;

  return {
    fileName: `snapshot-${snapshot.id}.ifc`,
    mimeType: "application/x-step",
    content,
    metadata: {
      schema: "ARKI-IFC4-SNAPSHOT-1.0",
      baseExport: base.metadata.schema,
      familyInstanceCount: snapshot.familyInstances.length,
      mamparaCount: mamparas.length,
      conceptualGeometryOnly: true,
      nativeRvt: false,
    },
  };
}

// ---------------------------------------------------------------------------
// Markdown — documento desde snapshot.
// Incluye ID, versión, familia, instancias, parámetros, materiales, metrados,
// partidas, presupuesto, duración, invalidaciones, provenance, estado.
// ---------------------------------------------------------------------------

export function exportSnapshotToMarkdown(snapshot: ProjectSnapshot): {
  fileName: string;
  mimeType: string;
  content: string;
} {
  const lines: string[] = [];
  lines.push(`# ARKI Snapshot ${snapshot.id}`);
  lines.push("");
  lines.push(`- Versión: ${snapshot.version}`);
  lines.push(`- Versión fuente: ${snapshot.sourceVersion}`);
  lines.push(`- Generado: ${snapshot.generatedAt}`);
  lines.push(`- Moneda: ${snapshot.budget.currency}`);
  lines.push(`- PriceBook: ${snapshot.budget.priceBookId} v${snapshot.budget.priceBookVersion}`);
  lines.push("");

  lines.push("## Presupuesto");
  lines.push(`- Base del modelo: S/ ${snapshot.budget.basePen.toFixed(2)}`);
  lines.push(`- Mamparas: S/ ${snapshot.budget.mamparasPen.toFixed(2)}`);
  lines.push(`- Total: S/ ${snapshot.budget.totalPen.toFixed(2)}`);
  lines.push("");

  lines.push("## Instancias de familia");
  for (const instance of snapshot.familyInstances) {
    lines.push(`### ${instance.id}`);
    lines.push(`- Familia: ${instance.familyId}`);
    lines.push(`- Tipo: ${instance.typeId}`);
    lines.push(`- Rol: ${instance.elementRole}`);
    lines.push(`- Host: ${instance.hostId ?? "—"}`);
    lines.push(`- Versión: ${instance.version}`);
    lines.push(`- Estado: ${instance.status}`);
    lines.push("- Parámetros:");
    for (const [key, value] of Object.entries(instance.parameters)) {
      lines.push(`  - ${key}: ${value}`);
    }
    const q = snapshot.mamparaQuantities[instance.id];
    if (q) {
      lines.push("- Metrados:");
      lines.push(`  - área vidrio: ${q.area_vidrio_m2} m²`);
      lines.push(`  - longitud perfiles: ${q.longitud_perfiles_m} ml`);
      lines.push(`  - herrajes: ${q.herrajes_und} und`);
      lines.push(`  - peso: ${q.peso_kg} kg`);
    }
    const c = snapshot.mamparaCosts[instance.id];
    if (c) {
      lines.push("- Partidas:");
      lines.push(`  - AL-01 vidrio: S/ ${c.partida_AL_01.toFixed(2)}`);
      lines.push(`  - AL-02 perfiles: S/ ${c.partida_AL_02.toFixed(2)}`);
      lines.push(`  - AL-03 herrajes: S/ ${c.partida_AL_03.toFixed(2)}`);
      lines.push(`  - total: S/ ${c.total_pen.toFixed(2)}`);
    }
    const s = snapshot.mamparaSchedule[instance.id];
    if (s) {
      lines.push(`- Duración: ${s.duracion_horas} h`);
    }
    const g = snapshot.mamparaGeometry[instance.id];
    if (g) {
      lines.push("- Geometría:");
      lines.push(`  - ancho: ${g.widthM} m`);
      lines.push(`  - alto: ${g.heightM} m`);
      lines.push(`  - profundidad: ${g.depthM} m`);
      lines.push(`  - paneles: ${g.panelCount}`);
    }
    lines.push("");
  }

  lines.push("## Materiales");
  for (const mat of MAMPARA_MATERIALS) {
    lines.push(
      `- ${mat.name}: ${mat.densityKgM3 ?? "—"} kg/m³, ${mat.costPenPerUnit ?? "—"} PEN/${mat.unit ?? "—"}`,
    );
  }
  lines.push("");

  lines.push("## Invalidaciones");
  if (snapshot.invalidations.length === 0) lines.push("- ninguna");
  else for (const inv of snapshot.invalidations) lines.push(`- ${inv}`);
  lines.push("");

  lines.push("## Provenance");
  if (snapshot.provenance.length === 0) lines.push("- ninguna");
  else
    for (const p of snapshot.provenance) {
      lines.push(`- ${p.entityKind}:${p.entityId} ${p.action} (${p.cause})`);
    }
  lines.push("");

  lines.push("## Estado del modelo");
  lines.push(`- Snapshot version: ${snapshot.version}`);
  lines.push(`- Family instances: ${snapshot.familyInstances.length}`);
  lines.push(`- Schedule tasks: ${snapshot.schedule.length}`);
  lines.push("");

  return {
    fileName: `snapshot-${snapshot.id}.md`,
    mimeType: "text/markdown;charset=utf-8",
    content: lines.join("\n"),
  };
}
