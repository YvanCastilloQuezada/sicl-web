# Archi — Fase 0: auditoría real del repositorio

**Fecha:** 2026-09-23

## 1. Identidad del árbol

```text
$ git rev-parse HEAD
c62183a5904f02aa0a935572454a5a35f9d167aa
$ git status --porcelain
 D client/src/components/ArkiNavigator.tsx
 M client/src/components/ArkiWorkspaceShell.tsx
 M client/src/contexts/ProjectContext.tsx
 M client/src/index.css
 M client/src/modules/GeneratorModule.tsx
 M scripts/test-navigator-layout.ts
 M scripts/test-no-inherited-cleanup.ts
?? ARCHI_CONTROLES_FUNCIONALES_16_MODULOS.md
?? ARKI_ADDENDUM_E_COD_LUKA.md
?? ARKI_AUDITORIA_ACTUAL_DEEPSEEK.md
?? ARKI_CONTRATO_UI3A_CANVAS_CONTEXT_PANEL_V2.md
?? ARKI_CONTRATO_UI3A_CANVAS_SELECCION.md
?? ARKI_DEEPSEEK_CURRENT_AUDIT.zip
?? ARKI_DEEPSEEK_CURRENT_AUDIT/
?? ARKI_FLUJO_TRABAJO_Y_PANELES.md
?? ARKI_PROTOCOLO_DESBLOQUEO_TEMPORAL_Y_REBLOQUEO.md
?? ARKI_ROADMAP_CORPORATIVO_V1.md
?? ARKI_VEREDICTO_CONTRATO_UI3A_V2.md
?? ARKI_VEREDICTO_REVISION_UI3A.md
?? DEEPSEEK_HANDOFF_2026_09_22.zip
?? DEEPSEEK_HANDOFF_2026_09_22.zip.sha256
?? DEEPSEEK_HANDOFF_2026_09_22/
?? DEEPSEEK_MD_SEPARADOS_2026_09_22/
?? FASE_0_AUDITORIA_REAL_2026-09-23.md
?? UI3A_DIFF.patch
?? UI3A_EVIDENCE.zip
?? UI3A_EVIDENCE.zip.sha256
?? UI3A_MANIFEST.json
?? UI3A_VERIFICATION_REPORT.md
?? client/src/canvas/
?? evidence/
?? scripts/create-ui3a-manifest.sh
?? scripts/run-fase0-audit.sh
?? scripts/test-bim-selection.ts
?? scripts/test-canvas-mount.ts
?? scripts/test-context-panel.ts
?? scripts/test-selection-info.ts
?? scripts/test-wall-door-canvas.ts
?? shared/arkiBimSelection.ts
?? shared/arkiContextPanel.ts
$ git log --oneline -10
[33mc62183a[m Checkpoint: Se eliminó completamente el panel flotante gris y se copió el Info Box derecho al panel fijo izquierdo. Ambos paneles muestran el mismo encabezado, estado de selección y contenido; el canvas permanece al centro en una distribución de tres partes. Build, check, test y verificación visual pasan.
[33m76ebd14[m Checkpoint: Se dejó la pantalla en tres partes: panel izquierdo fijo vacío, canvas central y Info Box fijo a la derecha. Se eliminaron textos y navegación duplicada del panel izquierdo. Build, test de layout y comprobación visual pasan.
[33m494a2fc[m Checkpoint: Se eliminó la barra visible que decía NAVEGADOR del Navigator fijo. La columna lateral, navegación de módulos, layout de tres columnas, build y test de layout continúan funcionando.
[33mef0b624[m Checkpoint: PATCH NOW 10 aplicado: corrección EXP-TEC/DossierModule, limpieza Navigator/status/toolbar/topbar/Generador, layout fijo de tres columnas, responsive y tests de evidencia. Build y regresión completa pasan.
[33m7bc2340[m Checkpoint: UI-2 v1.6 cerrada dentro del alcance taxonómico: SILC absorbida por Modelo BIM; 16 módulos canónicos; renombres Data, PRESUP-5D, GASTOS, EXP-TEC, O-M y ADM; matriz verificada visitante 2, user 14, specialist 15, corporate 16; GASTOS/O-M/ADM visibles para no-visitor y desactivados con tooltip; 17 outputs PASS y 8 capturas en paquete verificable. UI-3 permanece bloqueada.
[33mac311ff[m Checkpoint: UI-2 v1.3 implementada y verificada: PATCH NOW 8 aplicado. GeneratorModule, BimModule y DossierModule usan arki-module-body sin app-shell/sidebar/main-content; el tab bar usa MODULE_DEFINITIONS filtrado por rol; el workspace reserva solo canvas + Info Box; tipografía UI mínima 10 px; build, regresión, montaje y Navigator pasan. Sin cambios en shared, i18n ni backend.
[33m9fb8e3f[m Checkpoint: UI-2 v1.2 implementada y verificada: paleta Propuesta B, sidebar heredado eliminado, ModuleToolbar contextual, ArkiNavigator colapsado como overlay, chip de proyecto, diez tabs con estados, regresión completa y capturas desktop/móvil. Sin cambios en shared, i18n ni backend.
[33m9f46377[m Checkpoint: UI-2 opción B implementada y verificada: migración estructural del Generador al shell BIM, módulos Generator/BIM/Dossier/Metrics, ProjectContext, paleta Propuesta B, regresión completa y verificación funcional del preview. Se respetan las exclusiones de shared, i18n, backend, Avatar y canvas BIM nuevo.
[33m8bd43ed[m Checkpoint: Shell y gateway cableados al catálogo i18n en sus etiquetas principales; ARKI_LANGUAGES duplicado eliminado; catálogo de 8 idiomas, selector persistente, fallback, 64 casos de acceso, 16 estados y 12 outputs reales verificados.
[33m953c4bf[m Checkpoint: Paquete verificable con catálogo exacto de 8 idiomas, selector con persistencia local, función t con fallback, test-i18n-catalog, matriz de acceso 64 casos, estados de 16 módulos, 12 outputs reales, diff completo, manifest y ZIP validado.
$ git diff c62183a --stat
 client/src/components/ArkiNavigator.tsx      | 19 [31m----------[m
 client/src/components/ArkiWorkspaceShell.tsx | 44 [32m++++++++++[m[31m-------------[m
 client/src/contexts/ProjectContext.tsx       |  5 [32m+[m[31m--[m
 client/src/index.css                         | 53 [32m++++++++++[m[31m------------------[m
 client/src/modules/GeneratorModule.tsx       |  4 [32m+[m[31m--[m
 scripts/test-navigator-layout.ts             | 21 [32m++++[m[31m-------[m
 scripts/test-no-inherited-cleanup.ts         | 16 [32m+++++[m[31m----[m
 7 files changed, 58 insertions(+), 104 deletions(-)
$ git diff c62183a --name-only
client/src/components/ArkiNavigator.tsx
client/src/components/ArkiWorkspaceShell.tsx
client/src/contexts/ProjectContext.tsx
client/src/index.css
client/src/modules/GeneratorModule.tsx
scripts/test-navigator-layout.ts
scripts/test-no-inherited-cleanup.ts
```

## 2. Hashes de árboles y configuración

```text
shared 7473db6e940979795b47d7042de8f48722c28eae2a42b9cadc3ab6056b010dab
client/src 3f5ff7765df1b0ee6b46ead78ad817fc9ad433890aed32409094f814f5f6885e
package.json 0d95d7cd43c3db98481b9f9cc8e2356c9b60a5e6f04ee1fb627e96569759dbff
pnpm-lock.yaml a4190b27f57edc05941a2f75982789b76c4402c38ccd7c6842b0650fad7ca296
tsconfig.json 4bea0e0003e3c943f455346abc4854d1666d604adbaa6aa8eda11f94fb8f1396
```

## 3. Pruebas base

### pnpm check

```text
$ pnpm check
[WARN] The "pnpm" field in package.json is no longer read by pnpm. The following keys were ignored: "pnpm.patchedDependencies", "pnpm.overrides". See https://pnpm.io/settings for the new home of each setting.

> generador-familias@1.0.0 check /home/ubuntu/generador-familias
> tsc --noEmit

exit=0
```

### pnpm build

```text
$ pnpm build
[WARN] The "pnpm" field in package.json is no longer read by pnpm. The following keys were ignored: "pnpm.patchedDependencies", "pnpm.overrides". See https://pnpm.io/settings for the new home of each setting.

> generador-familias@1.0.0 build /home/ubuntu/generador-familias
> vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

vite v7.1.9 building for production...
transforming...
✓ 1632 modules transformed.
rendering chunks...
computing gzip size...
../dist/public/index.html                 367.73 kB │ gzip: 105.53 kB
../dist/public/assets/index-CUaiHeP_.css  133.00 kB │ gzip:  23.50 kB
../dist/public/assets/index-CUerGV7k.js   770.10 kB │ gzip: 204.81 kB

(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 4.11s

  dist/index.js  788b 

⚡ Done in 4ms
exit=0
```

### test-constructive

```text
$ pnpm tsx scripts/test-constructive.ts
[WARN] The "pnpm" field in package.json is no longer read by pnpm. The following keys were ignored: "pnpm.patchedDependencies", "pnpm.overrides". See https://pnpm.io/settings for the new home of each setting.
{
  "walls": 16,
  "spaces": 16,
  "columns": 72,
  "beams": 16,
  "slabs": 4,
  "foundations": 72,
  "stairs": 4,
  "floors": 4,
  "roofs": 1,
  "partitions": 4,
  "doors": 16,
  "windows": 320,
  "relations": 464,
  "netWallM2": 8028.6,
  "budgetPen": 4672910,
  "durationDays": 93,
  "ifcFile": "FAM-HEALTH-construction-semantic.ifc",
  "ifcSchema": "ARKI-IFC4-SEMANTIC-CONSTRUCTION-1.0"
}
exit=0
```

### test-serialization

```text
$ pnpm tsx scripts/test-serialization.ts
[WARN] The "pnpm" field in package.json is no longer read by pnpm. The following keys were ignored: "pnpm.patchedDependencies", "pnpm.overrides". See https://pnpm.io/settings for the new home of each setting.
{
  "status": "PASS",
  "wallCount": 16,
  "modelSummary": {
    "wallCount": 16,
    "spaceCount": 16,
    "foundationCount": 72,
    "columnCount": 72,
    "beamCount": 16,
    "slabCount": 4,
    "doorCount": 16,
    "windowCount": 320,
    "stairCount": 4,
    "floorElementCount": 4,
    "roofCount": 1,
    "partitionCount": 4,
    "relationCount": 464,
    "floorCount": 4,
    "totalNetWallAreaM2": 8028.6,
    "totalVolumeM3": 1364.86,
    "totalWeightKg": 56796306,
    "totalBudgetPen": 4672910,
    "totalDurationDays": 93,
    "doors": 16,
    "windows": 320,
    "interferences": 108
  },
  "checks": [
    "wallToDTO identidad con Muro.to_dict()",
    "wallFromDTO reconstrucción operativa",
    "metrado profundo campo por campo",
    "to_dict() reconstruido idéntico al original",
    "metrado recalculado coincide",
    "ConstructionModel round-trip completo"
  ]
}
exit=0
```

### test-wall-coherence

```text
$ pnpm tsx scripts/test-wall-coherence.ts
[WARN] The "pnpm" field in package.json is no longer read by pnpm. The following keys were ignored: "pnpm.patchedDependencies", "pnpm.overrides". See https://pnpm.io/settings for the new home of each setting.
{
  "status": "PASS",
  "wallsChecked": 16,
  "checks": [
    "capas con espesor > 0",
    "capas con función válida",
    "aberturas dentro del muro",
    "aberturas con tipo válido",
    "áreas no negativas",
    "área neta == max(0, bruta - aberturas)",
    "volumen no negativo",
    "peso no negativo",
    "metrado.m2_muro == area neta redondeada",
    "metrado.m3_muro == volumen redondeado",
    "peso_total_kg == suma de capas",
    "metrado.peso_total_kg == peso_total_kg()",
    "coherencia DTO ↔ dominio"
  ]
}
exit=0
```

### test-wall-door-canvas

```text
$ pnpm tsx scripts/test-wall-door-canvas.ts
[WARN] The "pnpm" field in package.json is no longer read by pnpm. The following keys were ignored: "pnpm.patchedDependencies", "pnpm.overrides". See https://pnpm.io/settings for the new home of each setting.
{"status":"PASS","squareWalls":4,"doorId":"door-1","hostWallId":"muro-1-1","opening":{"id":"puerta-f33hwoz","tipo":"puerta","ancho_m":0.9,"alto_m":2.1,"posicion_m":5.55,"tipo_marco":"aluminio"}}
exit=0
```

### test-bim-selection

```text
$ pnpm tsx scripts/test-bim-selection.ts
[WARN] The "pnpm" field in package.json is no longer read by pnpm. The following keys were ignored: "pnpm.patchedDependencies", "pnpm.overrides". See https://pnpm.io/settings for the new home of each setting.
test-bim-selection: PASS
exit=0
```

## 4. Inventario de contratos y duplicación potencial

```text
shared/arkiContextPanel.ts:4:export type ContextTreeNode = { id: string; label: string; kind: "level" | "category" | "element"; elementId?: string; children?: ContextTreeNode[] };
shared/arkiContextPanel.ts:6:export type ContextPanelState = { levels: ContextLevel[]; activeLevel: number; disciplines: ContextDiscipline[]; activeDiscipline: string | "all"; phases: string[]; activePhase: string | "all"; visibleCategories: string[]; tree: ContextTreeNode[]; tools: ContextTool[]; viewport: ContextViewport };
shared/arkiBimSelection.ts:8:export type BimSelectionItem = {
shared/arkiBimSelection.ts:9:  elementId: string;
shared/arkiBimSelection.ts:24:export type BimSelection = {
shared/arkiBimSelection.ts:26:  items: BimSelectionItem[];
shared/arkiBimSelection.ts:30:export function emptySelection(): BimSelection {
shared/arkiBimSelection.ts:34:export function singleSelection(item: BimSelectionItem): BimSelection {
shared/arkiBimSelection.ts:35:  return { mode: "single", items: [item], timestamp: `snapshot:${item.elementId}` };
shared/arkiBimSelection.ts:38:export function multipleSelection(items: BimSelectionItem[]): BimSelection {
shared/arkiBimSelection.ts:39:  const ordered = [...items].sort((a, b) => a.elementId.localeCompare(b.elementId));
shared/arkiBimSelection.ts:40:  return ordered.length === 0 ? emptySelection() : { mode: "multiple", items: ordered, timestamp: `snapshot:${ordered.map((item) => item.elementId).join(",")}` };
shared/arkiBimSelection.ts:55:export function selectionFromElement(element: unknown, kind: BimElementKind): BimSelectionItem {
shared/arkiBimSelection.ts:57:  const elementId = typeof element.id === "string" ? element.id : "";
shared/arkiBimSelection.ts:58:  if (!elementId) throw new Error("BIM element requires a deterministic id");
shared/arkiBimSelection.ts:64:    return { elementId, kind, category: "Muros", family: "Muro constructivo", type: wall.tipo, discipline, level, phase: wall.estado, properties: { nombre: wall.nombre, funcion: wall.funcion, tipo: wall.tipo, longitudM: wall.longitud_m(), alturaM: wall.altura_m, espesorM: wall.espesor_total_m() }, materials: wall.capas.map((layer) => ({ name: layer.nombre, thicknessM: layer.espesor_m, function: layer.funcion })), metrics: { ...wall.metrado, areaBrutaM2: wall.area_bruta_m2(), areaNetaM2: wall.area_neta_m2(), volumeM3: wall.volumen_m3(), weightKg: wall.peso_total_kg() }, cost: wall.partidas.reduce((sum, item) => sum + item.parcial, 0), relatedIds: [...wall.aberturas.map((opening) => opening.id), ...wall.interferencias.map((item) => item.id)] };
shared/arkiBimSelection.ts:71:  return { elementId, kind, category, family: typeof element.name === "string" ? element.name : undefined, type: typeof element.function === "string" ? element.function : undefined, discipline, level, phase: typeof element.status === "string" ? element.status : undefined, properties: { name: typeof element.name === "string" ? element.name : elementId, ...geometry }, materials, metrics: { ...quantity }, cost: costs.reduce((sum, item) => isRecord(item) && typeof item.total === "number" ? sum + item.total : sum, 0), relatedIds: Array.isArray(element.tracesTo) ? element.tracesTo.filter((item): item is string => typeof item === "string") : [] };
shared/arkiSnapshotExports.ts:1:// ARKI — Snapshot Exports
shared/arkiSnapshotExports.ts:4:// Markdown: documento propio desde snapshot, no desde TechnicalDossier.
shared/arkiSnapshotExports.ts:7:import type { ProjectSnapshot } from "./arkiRecalculation";
shared/arkiSnapshotExports.ts:8:import { snapshotToConstructionModel } from "./arkiRecalculation";
shared/arkiSnapshotExports.ts:14:// Inserta entidades de FamilyInstance antes de ENDSEC;END-ISO-10303-21;.
shared/arkiSnapshotExports.ts:26:export function exportSnapshotToIfc(snapshot: ProjectSnapshot): {
shared/arkiSnapshotExports.ts:39:  const model = snapshotToConstructionModel(snapshot);
shared/arkiSnapshotExports.ts:41:    name: `Snapshot ${snapshot.id}`,
shared/arkiSnapshotExports.ts:64:      )},'FamilyInstance','${instance.familyId}','${instance.typeId}',${geometry.positionM.x},${geometry.positionM.y},${geometry.positionM.z},${geometry.widthM},${geometry.heightM},${geometry.depthM},${geometry.rotationDeg});`,
shared/arkiSnapshotExports.ts:154:export function exportSnapshotToMarkdown(snapshot: ProjectSnapshot): {
shared/arkiSnapshotExports.ts:160:  lines.push(`# ARKI Snapshot ${snapshot.id}`);
shared/arkiSnapshotExports.ts:166:  lines.push(`- PriceBook: ${snapshot.budget.priceBookId} v${snapshot.budget.priceBookVersion}`);
shared/arkiSnapshotExports.ts:241:  lines.push(`- Snapshot version: ${snapshot.version}`);
client/src/canvas/InfoBoxPanel.tsx:2:import type { BimSelection } from "@shared/arkiBimSelection";
client/src/canvas/InfoBoxPanel.tsx:3:import { useBimSelection } from "./SelectionProvider";
client/src/canvas/InfoBoxPanel.tsx:6:  const { selection } = useBimSelection();
client/src/canvas/InfoBoxPanel.tsx:11:function SingleInfo({ selection }: { selection: BimSelection }) { const item = selection.items[0]; return <div className="arki-inspector-content"><div className="arki-selected-title"><span>{item.category}</span><strong>{item.family ?? item.elementId}</strong><small>{item.elementId} · {item.type ?? "tipo no definido"}</small></div><InfoSection title="Contexto"><InfoRow label="Nivel" value={String(item.level + 1)} /><InfoRow label="Disciplina" value={item.discipline} /><InfoRow label="Fase" value={item.phase ?? "—"} /></InfoSection><InfoSection title="Propiedades">{Object.entries(item.properties).slice(0, 7).map(([key, value]) => <InfoRow key={key} label={key} value={String(value)} />)}</InfoSection>{item.materials && item.materials.length > 0 && <InfoSection title="Materiales">{item.materials.map((material) => <InfoRow key={material.name} label={material.function ?? "capa"} value={`${material.name}${material.thicknessM ? ` · ${material.thicknessM} m` : ""}`} />)}</InfoSection>}{item.metrics && <InfoSection title="Metrado">{Object.entries(item.metrics).slice(0, 7).map(([key, value]) => <InfoRow key={key} label={key} value={typeof value === "number" ? value.toLocaleString("es-PE") : String(value)} />)}</InfoSection>}<InfoSection title="Costo y trazabilidad"><InfoRow label="Costo parcial" value={item.cost ? `S/ ${item.cost.toLocaleString("es-PE")}` : "—"} /><InfoRow label="Relacionados" value={String(item.relatedIds.length)} /><InfoRow label="Snapshot" value={selection.timestamp.replace("snapshot:", "") || "—"} /></InfoSection></div>; }
client/src/canvas/InfoBoxPanel.tsx:12:function MultipleInfo({ selection }: { selection: BimSelection }) { const totalCost = selection.items.reduce((sum, item) => sum + (item.cost ?? 0), 0); return <div className="arki-inspector-content"><div className="arki-selected-title"><span>SELECCIÓN MÚLTIPLE</span><strong>{selection.items.length} elementos</strong><small>{new Set(selection.items.map((item) => item.category)).size} categorías</small></div><InfoSection title="Resumen"><InfoRow label="Elementos" value={String(selection.items.length)} /><InfoRow label="Categorías" value={String(new Set(selection.items.map((item) => item.category)).size)} /><InfoRow label="Costo total" value={`S/ ${totalCost.toLocaleString("es-PE")}`} /></InfoSection><InfoSection title="Elementos">{selection.items.slice(0, 10).map((item) => <InfoRow key={item.elementId} label={item.kind} value={item.elementId} />)}</InfoSection></div>; }
shared/arkiRecalculation.ts:6:import type { FamilyInstance } from "./arkiParametricFamilies";
shared/arkiRecalculation.ts:7:import type { ConstructionModel, ScheduleTask } from "./arkiConstructionOntology";
shared/arkiRecalculation.ts:8:import type { ConstructionModelDTO } from "./arkiConstructionDTOs";
shared/arkiRecalculation.ts:27:import type { PriceBook } from "./arkiPriceBook";
shared/arkiRecalculation.ts:63:  sourceSnapshotId: string;
shared/arkiRecalculation.ts:67:export type ProjectSnapshot = {
shared/arkiRecalculation.ts:72:  familyInstances: FamilyInstance[];
shared/arkiRecalculation.ts:73:  constructionModel: ConstructionModelDTO;
shared/arkiRecalculation.ts:103:  instance: FamilyInstance,
shared/arkiRecalculation.ts:106:): FamilyInstance {
shared/arkiRecalculation.ts:110:  const updated: FamilyInstance = {
shared/arkiRecalculation.ts:121:function recalculateMampara(instance: FamilyInstance): {
shared/arkiRecalculation.ts:139:  source: ProjectSnapshot;
shared/arkiRecalculation.ts:142:  priceBook: PriceBook;
shared/arkiRecalculation.ts:143:}): ProjectSnapshot {
shared/arkiRecalculation.ts:148:  let instances: FamilyInstance[] = input.source.familyInstances.map((i) => ({
shared/arkiRecalculation.ts:164:        sourceSnapshotId: input.source.id,
shared/arkiRecalculation.ts:248:export function createInitialSnapshot(input: {
shared/arkiRecalculation.ts:249:  model: ConstructionModel;
shared/arkiRecalculation.ts:250:  instances: FamilyInstance[];
shared/arkiRecalculation.ts:251:  priceBook: PriceBook;
shared/arkiRecalculation.ts:253:}): ProjectSnapshot {
shared/arkiRecalculation.ts:303:        elementIds: [],
shared/arkiRecalculation.ts:313:export function snapshotToConstructionModel(snapshot: ProjectSnapshot): ConstructionModel {
client/src/canvas/CanvasPlanView.tsx:2:import type { ConstructionModel, Muro } from "@shared/arkiConstructionOntology";
client/src/canvas/CanvasPlanView.tsx:3:import { selectionFromElement, type BimElementKind } from "@shared/arkiBimSelection";
client/src/canvas/CanvasPlanView.tsx:5:import { useBimSelection } from "./SelectionProvider";
client/src/canvas/CanvasPlanView.tsx:7:const kinds: Array<[keyof ConstructionModel, BimElementKind]> = [["walls", "wall"], ["columns", "column"], ["beams", "beam"], ["slabs", "slab"], ["doors", "door"], ["windows", "window"]];
client/src/canvas/CanvasPlanView.tsx:12:export default function CanvasPlanView({ model, view, onViewChange }: { model: ConstructionModel | null; view: CanvasView; onViewChange: (view: CanvasView) => void }) {
client/src/canvas/CanvasPlanView.tsx:13:  const { selection, select, clear } = useBimSelection();
client/src/canvas/CanvasPlanView.tsx:31:  const isSelected = (id: string) => selection.items.some((item) => item.elementId === id);
client/src/canvas/CanvasPlanView.tsx:36:  return <section className="arki-plan-canvas" aria-label="Canvas de planta BIM"><div className="arki-canvas-head"><div><span>CANVAS · PLANTA</span><b>Nivel {view.level + 1}</b></div><div><span>{elements.length} elementos</span><span>{model ? `${model.walls.length} muros · ${model.summary.doorCount} puertas` : "sin modelo"}</span><span>{selection.items.length} seleccionados</span></div></div><div className="arki-canvas-stage"><svg viewBox="0 0 1000 680" role="img" aria-label="Planta BIM con muros y puertas" onWheel={handleWheel} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={finishDrag} onPointerCancel={finishDrag} onClick={() => clear()}><defs><pattern id="arki-grid" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(148,163,184,.12)" strokeWidth="1" /></pattern></defs><rect width="1000" height="680" fill="url(#arki-grid)" /><g transform={`translate(${view.viewport.translateX} ${view.viewport.translateY}) scale(${view.viewport.scale})`}>{view.showAxes && <><line x1="60" y1="50" x2="950" y2="50" stroke="#60a5fa" strokeDasharray="4 4" /><line x1="60" y1="50" x2="60" y2="620" stroke="#60a5fa" strokeDasharray="4 4" /></>}{view.showGrid && <rect x="80" y="70" width="840" height="520" fill="none" stroke="rgba(103,232,249,.25)" />}{elements.map((item) => <PlanShape key={item.id} item={item} walls={walls} x={sx} y={sy} selected={isSelected(item.id)} onSelect={(event) => { event.stopPropagation(); select(selectionFromElement(item.element, item.kind), event.shiftKey); }} />)}</g></svg>{!model && <div className="arki-canvas-empty"><strong>Planta sin modelo</strong><span>Genera una propuesta para cargar el ConstructionModel.</span></div>}</div><div className="arki-canvas-foot"><span>Muros perimetrales · puerta P-1 · abertura 0.90 × 2.10 m</span><span>Click: seleccionar · Shift + click: añadir · Escape: limpiar</span><span>Zoom {Math.round(view.viewport.scale * 100)}%</span></div></section>;
shared/arkiMamparaFamily.ts:4:// Primera ArkiParametricFamily concreta. No toca DynamicBuildingFamily.
shared/arkiMamparaFamily.ts:8:  ArkiParametricFamily,
shared/arkiMamparaFamily.ts:9:  FamilyInstance,
shared/arkiMamparaFamily.ts:76:export const MAMPARA_FAMILY: ArkiParametricFamily = {
shared/arkiMamparaFamily.ts:270:  sourceSnapshotId: string;
shared/arkiMamparaFamily.ts:273:}): FamilyInstance {
shared/arkiMamparaFamily.ts:294:    sourceSnapshotId: input.sourceSnapshotId,
shared/arkiMamparaFamily.ts:300:// Conversión de FamilyInstance a MamparaParameters con validación.
shared/arkiMamparaFamily.ts:301:export function instanceToMamparaParameters(instance: FamilyInstance): MamparaParameters {
scripts/test-wall-door-canvas.ts:2:import { generateConstructionModel } from "../shared/arkiConstructionOntology";
scripts/test-wall-door-canvas.ts:8:const model = generateConstructionModel({ projectId: "demo-wall-door", name: "Demo muro y puerta", widthM: 12, depthM: 8, floors: 1, familyCategory: "RESIDENTIAL" });
shared/arkiPriceBook.ts:3:// No reemplaza APU_DATABASE. La envuelve mediante fromApuDatabase().
shared/arkiPriceBook.ts:4:// Compatibilidad hacia atrás: fromApuDatabase() produce un PriceBook estable.
shared/arkiPriceBook.ts:8:export type PriceBookSource =
shared/arkiPriceBook.ts:14:export type PriceBookCurrency = "PEN" | "USD";
shared/arkiPriceBook.ts:16:export type PriceBookUnit = "m2" | "m3" | "kg" | "und" | "ml";
shared/arkiPriceBook.ts:18:export type PriceBookItem = {
shared/arkiPriceBook.ts:21:  unit: PriceBookUnit;
shared/arkiPriceBook.ts:32:export type PriceBook = {
shared/arkiPriceBook.ts:36:  source: PriceBookSource;
shared/arkiPriceBook.ts:39:  currency: PriceBookCurrency;
shared/arkiPriceBook.ts:43:  items: PriceBookItem[];
shared/arkiPriceBook.ts:46:// Normaliza unidades del APU existente al tipo PriceBookUnit.
shared/arkiPriceBook.ts:47:function normalizeUnit(unit: string): PriceBookUnit {
shared/arkiPriceBook.ts:58:// Convierte APU_DATABASE existente en un PriceBook versionado.
shared/arkiPriceBook.ts:67:    currency?: PriceBookCurrency;
shared/arkiPriceBook.ts:71:): PriceBook {
shared/arkiPriceBook.ts:99:export function findPriceBookItem(
shared/arkiPriceBook.ts:100:  priceBook: PriceBook,
shared/arkiPriceBook.ts:102:): PriceBookItem | undefined {
shared/arkiPriceBook.ts:106:export function isPriceBookValid(item: PriceBookItem): boolean {
client/src/canvas/ContextPanel.tsx:3:import type { ConstructionModel } from "@shared/arkiConstructionOntology";
client/src/canvas/ContextPanel.tsx:4:import { selectionFromElement, type BimElementKind } from "@shared/arkiBimSelection";
client/src/canvas/ContextPanel.tsx:5:import type { ContextPanelState, ContextTreeNode } from "@shared/arkiContextPanel";
client/src/canvas/ContextPanel.tsx:7:import { useBimSelection } from "./SelectionProvider";
client/src/canvas/ContextPanel.tsx:9:const kinds: Array<[keyof ConstructionModel, BimElementKind, string]> = [["walls", "wall", "Muros"], ["doors", "door", "Puertas"], ["windows", "window", "Ventanas"], ["columns", "column", "Columnas"], ["beams", "beam", "Vigas"], ["slabs", "slab", "Losas"]];
client/src/canvas/ContextPanel.tsx:11:function treeForModel(model: ConstructionModel | null, level: number): ContextTreeNode[] {
client/src/canvas/ContextPanel.tsx:13:  return [{ id: `level-${level}`, label: `Nivel ${level + 1}`, kind: "level", children: kinds.map(([key, , label]) => ({ id: `${key}-${level}`, label, kind: "category", children: (model[key] as Array<{ id: string; level?: number; nivel_piso?: number }>).filter((item) => (item.level ?? item.nivel_piso ?? 0) === level).map((item) => ({ id: item.id, label: item.id, kind: "element", elementId: item.id })) })) }];
client/src/canvas/ContextPanel.tsx:16:export default function ContextPanel({ model, view, onViewChange, state }: { model: ConstructionModel | null; view: CanvasView; onViewChange: (view: CanvasView) => void; state: ContextPanelState }) {
client/src/canvas/ContextPanel.tsx:17:  const { selection, select } = useBimSelection();
client/src/canvas/ContextPanel.tsx:20:  const findElement = (elementId: string) => flatElements.find(({ element }) => (element as { id?: unknown }).id === elementId);
client/src/canvas/ContextPanel.tsx:21:  const selectTreeItem = (elementId?: string) => { if (!elementId) return; const found = findElement(elementId); if (found) select(selectionFromElement(found.element, found.kind)); };
client/src/canvas/ContextPanel.tsx:29:    <div className="arki-context-section arki-tree"><span className="arki-context-label">ÁRBOL DEL MODELO</span>{tree.map((level) => <TreeNode key={level.id} node={level} selectedId={selection.items[0]?.elementId} onSelect={selectTreeItem} />)}</div>
client/src/canvas/ContextPanel.tsx:33:function TreeNode({ node, selectedId, onSelect }: { node: ContextTreeNode; selectedId?: string; onSelect: (id?: string) => void }) { return <div className={`arki-tree-node kind-${node.kind}`}><button className={selectedId === node.elementId ? "selected" : ""} onClick={() => onSelect(node.elementId)}>{node.label}</button>{node.children?.map((child) => <TreeNode key={child.id} node={child} selectedId={selectedId} onSelect={onSelect} />)}</div>; }
shared/arkiConstructionDTOs.ts:18:  type ConstructionModel,
shared/arkiConstructionDTOs.ts:23:import type { ElementRelation, StructuralElement } from "./arkiConstructionElements";
shared/arkiConstructionDTOs.ts:57:// Paralelo a ConstructionModel con WallDTO[] en lugar de Muro[].
shared/arkiConstructionDTOs.ts:58:export type ConstructionModelDTO = {
shared/arkiConstructionDTOs.ts:65:  foundations: StructuralElement[];
shared/arkiConstructionDTOs.ts:66:  columns: StructuralElement[];
shared/arkiConstructionDTOs.ts:67:  beams: StructuralElement[];
shared/arkiConstructionDTOs.ts:68:  slabs: StructuralElement[];
shared/arkiConstructionDTOs.ts:69:  doors: StructuralElement[];
shared/arkiConstructionDTOs.ts:70:  windows: StructuralElement[];
shared/arkiConstructionDTOs.ts:71:  stairs: StructuralElement[];
shared/arkiConstructionDTOs.ts:72:  floors: StructuralElement[];
shared/arkiConstructionDTOs.ts:73:  roofs: StructuralElement[];
shared/arkiConstructionDTOs.ts:74:  partitions: StructuralElement[];
shared/arkiConstructionDTOs.ts:78:  summary: ConstructionModel["summary"];
shared/arkiConstructionDTOs.ts:79:  gates: ConstructionModel["gates"];
shared/arkiConstructionDTOs.ts:118:export function constructionModelToDTO(model: ConstructionModel): ConstructionModelDTO {
shared/arkiConstructionDTOs.ts:144:export function constructionModelFromDTO(dto: ConstructionModelDTO): ConstructionModel {
client/src/canvas/SelectionProvider.tsx:2:import { emptySelection, multipleSelection, singleSelection, type BimSelection, type BimSelectionItem } from "@shared/arkiBimSelection";
client/src/canvas/SelectionProvider.tsx:4:type SelectionContextValue = { selection: BimSelection; select: (item: BimSelectionItem, additive?: boolean) => void; clear: () => void };
client/src/canvas/SelectionProvider.tsx:8:  const [selection, setSelection] = useState<BimSelection>(() => emptySelection());
client/src/canvas/SelectionProvider.tsx:10:  const select = useCallback((item: BimSelectionItem, additive = false) => {
client/src/canvas/SelectionProvider.tsx:13:      const exists = current.items.some((candidate) => candidate.elementId === item.elementId);
client/src/canvas/SelectionProvider.tsx:14:      const next = exists ? current.items.filter((candidate) => candidate.elementId !== item.elementId) : [...current.items, item];
client/src/canvas/SelectionProvider.tsx:22:export function useBimSelection() {
client/src/canvas/SelectionProvider.tsx:24:  if (!context) throw new Error("useBimSelection must be used inside SelectionProvider");
scripts/test-context-panel.ts:2:import type { ContextPanelState } from "../shared/arkiContextPanel";
scripts/test-context-panel.ts:4:const state: ContextPanelState = { levels: [{ id: "level-0", name: "Nivel 1", index: 0 }], activeLevel: 0, disciplines: [{ id: "arquitectura", name: "Arquitectura" }], activeDiscipline: "all", phases: ["borrador"], activePhase: "all", visibleCategories: ["Muros"], tree: [{ id: "level-0", label: "Nivel 1", kind: "level" }], tools: [{ id: "select", label: "Seleccionar", enabled: true }, { id: "zoom", label: "Zoom", enabled: true }, { id: "pan", label: "Pan", enabled: true }, { id: "fit", label: "Encuadrar", enabled: true }], viewport: { scale: 1, translateX: 0, translateY: 0 } };
client/src/canvas/types.ts:1:import type { BimElementKind } from "@shared/arkiBimSelection";
client/src/canvas/types.ts:5:export type CanvasHit = { elementId: string; kind: BimElementKind; distance: number };
scripts/test-selection-info.ts:2:import { selectionFromElement } from "../shared/arkiBimSelection";
scripts/test-selection-info.ts:8:if (selection.elementId !== "muro-test-1" || selection.kind !== "wall") throw new Error("wall selection identity failed");
scripts/test-canvas-mount.ts:4:for (const required of ["ConstructionModel", "useBimSelection", "showGrid", "showAxes", "onWheel", "onPointerMove", "Escape"]) if (!source.includes(required)) throw new Error(`CanvasPlanView missing ${required}`);
scripts/test-bim-selection.ts:1:import { emptySelection, multipleSelection, selectionFromElement, singleSelection } from "../shared/arkiBimSelection";
scripts/test-bim-selection.ts:5:if (singleSelection(item).mode !== "single" || singleSelection(item).items[0].elementId !== "column-1") throw new Error("single selection failed");
scripts/test-bim-selection.ts:6:if (multipleSelection([item, { ...item, elementId: "beam-1", kind: "beam" }]).mode !== "multiple") throw new Error("multiple selection failed");
scripts/test-bim-selection.ts:7:if (selectionFromElement({ id: "column-1", level: 0 }, "column").elementId !== "column-1") throw new Error("deterministic element id failed");
client/src/modules/DossierModule.tsx:4:import { generateTechnicalDossier, technicalDossierMarkdown, type TechnicalDossier } from "@shared/arkiTechnicalDossier";
client/src/modules/DossierModule.tsx:7:function DossierWorkspace({ dossier, tab, onTab }: { dossier: TechnicalDossier; tab: "summary" | "specs" | "formwork" | "costs" | "normative" | "file"; onTab: (tab: "summary" | "specs" | "formwork" | "costs" | "normative" | "file") => void }) {
client/src/modules/DossierModule.tsx:8:  const tabs = [["summary", "Resumen"], ["specs", "Especificaciones"], ["formwork", "Encofrados"], ["costs", "APU / 5D"], ["normative", "RNE"], ["file", "Expediente"]] as const;
client/src/modules/DossierModule.tsx:18:    {tab === "formwork" && <div><div className="dossier-inline-summary"><strong>{formwork.length} elementos</strong><span>{formwork.reduce((sum, item) => sum + item.quantity.effectiveAreaM2, 0).toLocaleString("es-PE")} m² efectivos</span><span>{formwork.reduce((sum, item) => sum + item.quantity.props, 0).toLocaleString("es-PE")} puntales</span><span>Reutilización media {Math.round(formwork.reduce((sum, item) => sum + item.reuseCycles, 0) / Math.max(formwork.length, 1))} ciclos</span></div><div className="dossier-table"><div className="dossier-row dossier-row-head"><span>ELEMENTO</span><span>SISTEMA</span><span>ÁREA / JUEGOS</span><span>DESENCOFRADO</span></div>{formwork.slice(0, 12).map((item) => <div className="dossier-row" key={item.id}><span><b>{item.elementType}</b><small>{item.elementId}</small></span>{editing ? <select className="dossier-edit-select" value={item.system} onChange={(event) => updateFormwork(item.id, "system", event.target.value)}><option value="madera">Madera</option><option value="metalica">Metálica</option><option value="fenolica">Fenólica</option><option value="mixto">Mixto</option></select> : <span>{item.system}</span>}<span>{item.quantity.effectiveAreaM2} m² · {item.quantity.sets} juegos</span>{editing ? <span className="dossier-edit-pair"><input type="number" min="1" value={item.estimatedDays} onChange={(event) => updateFormwork(item.id, "estimatedDays", event.target.value)} /> días · <input type="number" min="1" value={item.reuseCycles} onChange={(event) => updateFormwork(item.id, "reuseCycles", event.target.value)} /> usos</span> : <span>{item.estimatedDays} días · {item.reuseCycles} usos</span>}</div>)}</div><small className="dossier-muted-note">Se muestran los primeros 12 elementos; el expediente conserva los {formwork.length} requerimientos.</small></div>}
client/src/modules/DossierModule.tsx:25:export default function DossierModule({ building }: { building: GeneratedBuilding | null }) { const dossier = useMemo(() => building?.constructionModel ? generateTechnicalDossier(building.constructionModel, building.context.city || "La Libertad", 1.04) : null, [building]); const [tab, setTab] = useState<"summary" | "specs" | "formwork" | "costs" | "normative" | "file">("summary"); if (!dossier) return <div className="arki-module-body"><div className="arki-empty-module"><strong>Expediente</strong><p>Genera una propuesta para mostrar el expediente.</p></div></div>; return <div className="arki-module-body"><DossierWorkspace dossier={dossier} tab={tab} onTab={setTab} /></div>; }
scripts/test-navigator-layout.ts:10:for (const [label, source, needles] of [["shell", shell, ["<ContextPanel", "<ModuleToolbar", "<InfoBoxPanel", "<CanvasPlanView", "activeModule === \"EXP-TEC\" ? <DossierModule"] as const], ["context", contextPanel, ["ÁRBOL DEL MODELO", "Disciplina", "Fase"] as const], ["canvas", canvas, ["showGrid", "onWheel", "onPointerMove", "useBimSelection"] as const], ["infobox", infoBox, ["Propiedades", "Materiales", "Metrado", "Costo y trazabilidad"] as const], ["toolbar", toolbar, ["Comparador", "Exportaciones", "Buscar familia"] as const], ["css", css, ["grid-template-columns: 240px minmax(0, 1fr) 260px", "@media (max-width: 1050px)", "@media (max-width: 720px)", ".arki-context-panel", ".arki-info-panel"] as const]]) for (const needle of needles) if (!source.includes(needle)) throw new Error(`${label} missing ${needle}`);
shared/arkiParametricFamilies.ts:99:export type ArkiParametricFamily = {
shared/arkiParametricFamilies.ts:141:export type FamilyInstance = {
shared/arkiParametricFamilies.ts:165:  sourceSnapshotId: string;
shared/arkiParametricFamilies.ts:174:  discipline: ArkiParametricFamily["discipline"];
shared/arkiParametricFamilies.ts:175:  host: ArkiParametricFamily["geometry"]["host"];
shared/arkiParametricFamilies.ts:176:}): ArkiParametricFamily {
shared/arkiParametricFamilies.ts:207:export function createEmptyFamilyInstance(input: {
shared/arkiParametricFamilies.ts:212:  elementRole: FamilyInstance["elementRole"];
shared/arkiParametricFamilies.ts:213:  sourceSnapshotId: string;
shared/arkiParametricFamilies.ts:214:}): FamilyInstance {
shared/arkiParametricFamilies.ts:224:    sourceSnapshotId: input.sourceSnapshotId,
client/src/modules/GeneratorModule.tsx:9:import { generateTechnicalDossier, technicalDossierMarkdown, type TechnicalDossier } from "@shared/arkiTechnicalDossier";
client/src/modules/GeneratorModule.tsx:56:  const dossier = useMemo(() => building?.constructionModel ? generateTechnicalDossier(building.constructionModel, city || "La Libertad", 1.04) : null, [building, city]);
client/src/modules/GeneratorModule.tsx:78:            <div className="results-toolbar"><div><h2>{building ? building.name : "Esperando una generación"}</h2><small className="generator-model-state">{constructionModel ? `${constructionModel.summary.wallCount} muros · ${constructionModel.summary.spaceCount} espacios disponibles en Planta` : "ConstructionModel pendiente"}</small></div><div className="toolbar-actions"><button className="secondary-button" onClick={saveVersion} disabled={!building}><Save size={15} /> Guardar</button><button className="secondary-button" onClick={() => setShowSpecs(!showSpecs)}><MoreHorizontal size={16} /></button></div></div>
client/src/modules/GeneratorModule.tsx:105:    <div className="construction-footer"><div><span className="construction-note"><span className="alert-dot info" />Metrados calculados</span><span className="construction-note"><span className="alert-dot info" />APU enlazado</span><span className="construction-note"><span className="alert-dot info" />Cronograma 4D enlazado</span><span className="construction-note"><span className="alert-dot warning" />Revisión especialista requerida</span></div><button className="semantic-ifc-button" onClick={onIfc}><Download size={14} /> Exportar IFC semántico</button></div>
client/src/modules/GeneratorModule.tsx:109:function DossierWorkspace({ dossier, tab, onTab }: { dossier: TechnicalDossier; tab: "summary" | "specs" | "formwork" | "costs" | "normative" | "file"; onTab: (tab: "summary" | "specs" | "formwork" | "costs" | "normative" | "file") => void }) {
client/src/modules/GeneratorModule.tsx:110:  const tabs = [["summary", "Resumen"], ["specs", "Especificaciones"], ["formwork", "Encofrados"], ["costs", "APU / 5D"], ["normative", "RNE"], ["file", "Expediente"]] as const;
client/src/modules/GeneratorModule.tsx:120:    {tab === "formwork" && <div><div className="dossier-inline-summary"><strong>{formwork.length} elementos</strong><span>{formwork.reduce((sum, item) => sum + item.quantity.effectiveAreaM2, 0).toLocaleString("es-PE")} m² efectivos</span><span>{formwork.reduce((sum, item) => sum + item.quantity.props, 0).toLocaleString("es-PE")} puntales</span><span>Reutilización media {Math.round(formwork.reduce((sum, item) => sum + item.reuseCycles, 0) / Math.max(formwork.length, 1))} ciclos</span></div><div className="dossier-table"><div className="dossier-row dossier-row-head"><span>ELEMENTO</span><span>SISTEMA</span><span>ÁREA / JUEGOS</span><span>DESENCOFRADO</span></div>{formwork.slice(0, 12).map((item) => <div className="dossier-row" key={item.id}><span><b>{item.elementType}</b><small>{item.elementId}</small></span>{editing ? <select className="dossier-edit-select" value={item.system} onChange={(event) => updateFormwork(item.id, "system", event.target.value)}><option value="madera">Madera</option><option value="metalica">Metálica</option><option value="fenolica">Fenólica</option><option value="mixto">Mixto</option></select> : <span>{item.system}</span>}<span>{item.quantity.effectiveAreaM2} m² · {item.quantity.sets} juegos</span>{editing ? <span className="dossier-edit-pair"><input type="number" min="1" value={item.estimatedDays} onChange={(event) => updateFormwork(item.id, "estimatedDays", event.target.value)} /> días · <input type="number" min="1" value={item.reuseCycles} onChange={(event) => updateFormwork(item.id, "reuseCycles", event.target.value)} /> usos</span> : <span>{item.estimatedDays} días · {item.reuseCycles} usos</span>}</div>)}</div><small className="dossier-muted-note">Se muestran los primeros 12 elementos; el expediente conserva los {formwork.length} requerimientos.</small></div>}
shared/arkiTechnicalDossier.ts:1:import type { ConstructionModel } from "./arkiConstructionOntology";
shared/arkiTechnicalDossier.ts:4:export type FormworkRequirement = { id: string; elementId: string; elementType: "column" | "beam" | "slab" | "foundation" | "wall"; system: "metalica" | "madera" | "fenolica" | "aluminio"; areaM2: number; volumeM3: number; reuseCycles: number; estimatedDays: number; releaseCondition: string; safetyNotes: string[]; quantity: { sets: number; effectiveAreaM2: number; faceVolumeM3: number; props: number; propLengthM: number; nailsKg: number; wireKg: number; releaseAgentL: number }; modelVersion?: number; elementVersion?: number; sourceSnapshotId?: string; status?: "derived" | "overridden" | "stale" };
shared/arkiTechnicalDossier.ts:7:export type TechnicalDossier = { title: string; version: string; modelId: string; specifications: TechnicalSpecification[]; formwork: FormworkRequirement[]; regionalPrices: RegionalPrice[]; normativeFindings: NormativeFinding[]; sections: Array<{ order: number; title: string; status: "ready" | "review_required" | "pending"; outputs: string[] }>; readiness: { percentage: number; blockers: string[]; specialistReviewRequired: boolean } };
shared/arkiTechnicalDossier.ts:22:export function generateFormworkRequirements(model: ConstructionModel): FormworkRequirement[] {
shared/arkiTechnicalDossier.ts:30:  for (const element of elements) { const reuseCycles = element.type === "slab" ? 12 : element.type === "foundation" ? 3 : element.type === "beam" ? 6 : 8; const sets = Math.max(1, Math.floor(10 / reuseCycles)); const props = element.type === "slab" ? Math.floor(element.area / 4) + 1 : element.type === "beam" ? Math.floor(Math.max(element.area / 3, 1)) + 1 : 0; const nailsFactor = element.type === "slab" ? .15 : element.type === "column" || element.type === "foundation" ? .2 : .18; requirements.push({ id: id("encofrado", element.id), elementId: element.id, elementType: element.type, system: element.type === "slab" ? "fenolica" : element.type === "column" ? "metalica" : "madera", areaM2: round(element.area), volumeM3: round(element.volume, 3), reuseCycles, estimatedDays: element.type === "foundation" ? 2 : element.type === "slab" ? 4 : 3, releaseCondition: element.type === "slab" ? "Verificar resistencia suficiente y puntales permanentes según cálculo." : "Liberar cuando el concreto alcance resistencia mínima aprobada por especialista.", safetyNotes: ["Revisar aplome, nivel y estabilidad antes del vaciado.", "Asegurar plataformas y accesos de trabajo.", "No desencofrar sin autorización de supervisión."], quantity: { sets, effectiveAreaM2: round(element.area * sets), faceVolumeM3: round(element.area * sets * .025, 4), props, propLengthM: round(props * (element.type === "slab" ? 2.5 : 3)), nailsKg: round(element.area * nailsFactor), wireKg: round(element.area * .08), releaseAgentL: round(element.area * .05) }, modelVersion: 1, elementVersion: 1, sourceSnapshotId: "snapshot:initial", status: "derived" }); }
shared/arkiTechnicalDossier.ts:36:export function reviewNormativeReadiness(model: ConstructionModel): NormativeFinding[] { const findings: NormativeFinding[] = []; const doorIssue = model.doors.filter((item) => item.quantity.areaM2 < .81); if (doorIssue.length) findings.push({ id: "rne-a120-door", specialty: "arquitectura", code: "RNE A.120", article: "Art. 8", status: "no_conforme", severity: "critica", parameter: "ancho de puerta accesible", current: "Menor a 0.90 m", expected: "≥ 0.90 m", recommendation: "Revisar puertas accesibles y rutas de evacuación." }); else findings.push({ id: "rne-a120-door", specialty: "arquitectura", code: "RNE A.120", article: "Art. 8", status: "conforme", severity: "baja", parameter: "ancho de puerta accesible", current: "0.90 m o superior", expected: "≥ 0.90 m", recommendation: "Mantener control dimensional en planos y obra." }); if (model.slabs.some((item) => item.quantity.volumeM3 / Math.max(item.quantity.areaM2, 1) < .15)) findings.push({ id: "rne-e060-slab", specialty: "estructuras", code: "RNE E.060", article: "Art. 8.2", status: "observado", severity: "alta", parameter: "espesor de losa", current: "Revisión pendiente", expected: "≥ 15 cm o cálculo aprobado", recommendation: "Verificar diseño estructural antes de emitir planos definitivos." }); findings.push({ id: "rne-a130-egress", specialty: "arquitectura", code: "RNE A.130", article: "Seguridad", status: "pendiente", severity: "alta", parameter: "evacuación", current: "No validado automáticamente", expected: "Rutas y aforo aprobados", recommendation: "Realizar revisión de evacuación y seguridad por especialista." }); findings.push({ id: "rne-e050-soil", specialty: "estructuras", code: "RNE E.050", article: "Suelos y cimentaciones", status: "pendiente", severity: "alta", parameter: "capacidad portante", current: "Dato conceptual", expected: "Estudio de suelos vigente", recommendation: "Adjuntar estudio geotécnico antes de definir cimentación." }); return findings; }
shared/arkiTechnicalDossier.ts:38:export function generateTechnicalDossier(model: ConstructionModel, region = "La Libertad", factor = 1.04): TechnicalDossier { const formwork = generateFormworkRequirements(model); const findings = reviewNormativeReadiness(model); const blockers = findings.filter((item) => item.status !== "conforme").map((item) => `${item.code}: ${item.recommendation}`); const sections = [{ order: 1, title: "Memoria descriptiva", status: "ready" as const, outputs: ["memoria-descriptiva.md"] }, { order: 2, title: "Especificaciones técnicas", status: "ready" as const, outputs: ["especificaciones-tecnicas.md"] }, { order: 3, title: "Planos y modelo IFC", status: "review_required" as const, outputs: ["planta.svg", "corte.svg", "modelo.ifc"] }, { order: 4, title: "Metrados, APU y encofrados", status: "ready" as const, outputs: ["presupuesto-5d.json", "encofrados.csv"] }, { order: 5, title: "Revisión RNE", status: blockers.length ? "review_required" as const : "ready" as const, outputs: ["reporte-rne.json"] }, { order: 6, title: "Firmas y emisión", status: "pending" as const, outputs: ["flujo-aprobacion.json", "expediente-manifiesto.json"] }]; const readiness = Math.round(sections.filter((item) => item.status === "ready").length / sections.length * 100); return { title: "Expediente técnico BIM ARKI", version: "3.1-local", modelId: model.projectId, specifications: DEFAULT_TECHNICAL_SPECIFICATIONS, formwork, regionalPrices: buildRegionalPrices(region, factor), normativeFindings: findings, sections, readiness: { percentage: readiness, blockers, specialistReviewRequired: true } }; }
shared/arkiTechnicalDossier.ts:40:export function technicalDossierMarkdown(dossier: TechnicalDossier): string { const lines = [`# ${dossier.title}`, ``, `Versión: ${dossier.version}`, `Modelo: ${dossier.modelId}`, `Preparación: ${dossier.readiness.percentage}%`, ``, `## Especificaciones técnicas`, ...dossier.specifications.map((item) => `### ${item.code} · ${item.title}\n${item.description}\nNormas: ${item.standards.join(", ")}\nAceptación: ${item.acceptance.join("; ")}`), ``, `## Encofrados`, `Total de requerimientos: ${dossier.formwork.length}`, ...dossier.formwork.slice(0, 30).map((item) => `- ${item.elementType} ${item.elementId}: ${item.areaM2} m², sistema ${item.system}, ${item.reuseCycles} usos, ${item.estimatedDays} días.`), ``, `## Revisión RNE`, ...dossier.normativeFindings.map((item) => `- ${item.code} · ${item.status}: ${item.recommendation}`), ``, `## Secciones`, ...dossier.sections.map((item) => `${item.order}. ${item.title} — ${item.status}`)]; return lines.join("\n"); }
scripts/test-recalculation.ts:7:import { APU_DATABASE } from "../shared/arkiConstructionOntology";
scripts/test-recalculation.ts:8:import { fromApuDatabase } from "../shared/arkiPriceBook";
scripts/test-recalculation.ts:16:  createInitialSnapshot,
scripts/test-recalculation.ts:23:  exportSnapshotToIfc,
scripts/test-recalculation.ts:24:  exportSnapshotToMarkdown,
scripts/test-recalculation.ts:25:} from "../shared/arkiSnapshotExports";
scripts/test-recalculation.ts:54:const priceBook = fromApuDatabase(APU_DATABASE, {
scripts/test-recalculation.ts:80:  sourceSnapshotId: "snapshot:initial",
scripts/test-recalculation.ts:85:const snapshot0 = createInitialSnapshot({
scripts/test-recalculation.ts:111:const ifc0 = exportSnapshotToIfc(snapshot0);
scripts/test-recalculation.ts:112:const md0 = exportSnapshotToMarkdown(snapshot0);
scripts/test-recalculation.ts:172:const ifc1 = exportSnapshotToIfc(snapshot1);
scripts/test-recalculation.ts:179:const md1 = exportSnapshotToMarkdown(snapshot1);
scripts/test-recalculation.ts:206:const ifc2 = exportSnapshotToIfc(snapshot2);
scripts/test-recalculation.ts:207:const md2 = exportSnapshotToMarkdown(snapshot2);
scripts/test-recalculation.ts:322:  snapshot1.provenance.every((p) => p.sourceSnapshotId === snapshot0.id),
shared/arkiProfessionalModules.ts:1:import type { ConstructionModel, ScheduleTask } from "./arkiConstructionOntology";
shared/arkiProfessionalModules.ts:15:export function buildFinancial5D(model: ConstructionModel): Construction5D {
shared/arkiProfessionalModules.ts:24:export function detectModelClashes(model: ConstructionModel): Clash[] {
shared/arkiProfessionalModules.ts:30:export function simulateConstruction(model: ConstructionModel): ConstructionSimulation {
shared/arkiProfessionalModules.ts:35:  return { resources, conflicts, criticalPath: { tasks: critical.map((task) => task.nombre), durationDays: critical.reduce((sum, task) => sum + task.duracion_dias, 0) }, logistics: { maxConcurrentTasks: Math.max(...model.schedule.map((task) => task.elementIds.length), 0), estimatedSiteAreaM2: Math.max(180, model.summary.spaceCount * 50), recommendations: ["Definir zonas de acopio por fase.", "Programar entregas just-in-time para reducir stock.", "Reservar rutas de circulación y mantenimiento MEP."] } };
shared/arkiProfessionalModules.ts:38:export function createApprovalWorkflow(model: ConstructionModel): ApprovalWorkflow { const requiredRoles = ["arquitecto", "ingeniero_estructural", "coordinador_bim", "jefe_proyecto"]; return { id: hash(`${model.projectId}:approval`), documentId: hash(`${model.projectId}:technical-file`), version: 1, requiredRoles, obtainedRoles: [], missingRoles: requiredRoles, progressPct: 0, status: "pending", legalStatus: "local_demo_only" }; }
shared/arkiProfessionalModules.ts:39:export function createCdeManifest(model: ConstructionModel, clashes: Clash[]): CdeManifest { const documents = [{ id: hash(`${model.projectId}:ifc`), name: "modelo-federado.ifc", type: "IFC", discipline: "BIM", version: 1, state: "wip" as const, sha256: hash(JSON.stringify(model.relations)) }, { id: hash(`${model.projectId}:schedule`), name: "cronograma-5d.json", type: "JSON", discipline: "planificacion", version: 1, state: "wip" as const, sha256: hash(JSON.stringify(model.schedule)) }]; return { projectId: model.projectId, state: "wip", documents, federatedModel: { name: "Modelo federado ARKI", version: 1, disciplines: ["arquitectura", "estructuras", "sanitarias", "electricas", "BIM"], totalElements: model.summary.wallCount + model.summary.columnCount + model.summary.beamCount + model.summary.slabCount + model.summary.doorCount + model.summary.windowCount, clashCount: clashes.length, budgetPen: model.summary.totalBudgetPen, durationDays: model.summary.totalDurationDays } }; }
shared/arkiProfessionalModules.ts:43:export function professionalSummary(model: ConstructionModel) { const clashes = detectModelClashes(model); const financial = buildFinancial5D(model); const simulation = simulateConstruction(model); return { financial, simulation, clashes, approval: createApprovalWorkflow(model), cde: createCdeManifest(model, clashes) }; }
scripts/test-budget-reconciliation.ts:2:// Entrega 1B — reconciliación entre partidas, APU, PriceBook y presupuesto del modelo.
scripts/test-budget-reconciliation.ts:5:import { APU_DATABASE } from "../shared/arkiConstructionOntology";
scripts/test-budget-reconciliation.ts:6:import { generateTechnicalDossier } from "../shared/arkiTechnicalDossier";
scripts/test-budget-reconciliation.ts:9:  findPriceBookItem,
scripts/test-budget-reconciliation.ts:10:  isPriceBookValid,
scripts/test-budget-reconciliation.ts:11:  type PriceBook,
scripts/test-budget-reconciliation.ts:12:} from "../shared/arkiPriceBook";
scripts/test-budget-reconciliation.ts:22:// --- PriceBook básico ---
scripts/test-budget-reconciliation.ts:23:const priceBook: PriceBook = fromApuDatabase(APU_DATABASE, {
scripts/test-budget-reconciliation.ts:32:assert(priceBook.schema === "ARKI-PRICE-BOOK-1.0", "PriceBook tiene schema correcto");
scripts/test-budget-reconciliation.ts:33:assert(priceBook.id === "PB-TEST-1B", "PriceBook id correcto");
scripts/test-budget-reconciliation.ts:34:assert(priceBook.version === 1, "PriceBook version correcta");
scripts/test-budget-reconciliation.ts:35:assert(priceBook.source === "ARKI_REFERENCIAL", "PriceBook source correcto");
scripts/test-budget-reconciliation.ts:36:assert(priceBook.currency === "PEN", "PriceBook currency correcta");
scripts/test-budget-reconciliation.ts:37:assert(priceBook.items.length === APU_DATABASE.length, "PriceBook tiene todos los items");
scripts/test-budget-reconciliation.ts:38:assert(priceBook.items.every(isPriceBookValid), "todos los items son válidos");
scripts/test-budget-reconciliation.ts:41:const priceBook2 = fromApuDatabase(APU_DATABASE, {
scripts/test-budget-reconciliation.ts:54:// --- Coherencia de items con APU original ---
scripts/test-budget-reconciliation.ts:55:for (const original of APU_DATABASE) {
scripts/test-budget-reconciliation.ts:56:  const item = findPriceBookItem(priceBook, original.codigo);
scripts/test-budget-reconciliation.ts:57:  assert(item, `item ${original.codigo} presente en PriceBook`);
scripts/test-budget-reconciliation.ts:68:// --- Reconciliación con ConstructionModel ---
scripts/test-budget-reconciliation.ts:82:  const item = findPriceBookItem(priceBook, partida.codigo);
scripts/test-budget-reconciliation.ts:86:      `partida ${partida.codigo} usa unitPrice del PriceBook`,
scripts/test-budget-reconciliation.ts:91:assert(partidasVerified > 0, "al menos una partida coincide con PriceBook");
scripts/test-budget-reconciliation.ts:122:const dossier = generateTechnicalDossier(model, "La Libertad", 1.04);
scripts/test-budget-reconciliation.ts:128:  assert(typeof req.sourceSnapshotId === "string", `encofrado ${req.id} tiene sourceSnapshotId`);
scripts/test-budget-reconciliation.ts:143:        "PriceBook schema, id, version, source, currency",
scripts/test-budget-reconciliation.ts:146:        "coherencia item ↔ APU original",
scripts/test-budget-reconciliation.ts:147:        "partidas del modelo referencian PriceBook",
scripts/test-budget-reconciliation.ts:149:        "encofrados con modelVersion, elementVersion, sourceSnapshotId, status",
shared/arkiConstructionElements.ts:1:import { APU_DATABASE, type ApuPartida, type Especialidad, type PartidaPresupuestal } from "./arkiConstructionOntology";
shared/arkiConstructionElements.ts:7:export type StructuralElement = { id: string; projectId: string; name: string; kind: "column" | "beam" | "slab" | "foundation" | "door" | "window" | "stair" | "floor" | "roof" | "partition"; function: ElementFunction; specialty: Especialidad; level: number; geometry: Record<string, number | string>; materials: Array<{ material: string; thicknessM?: number; grade?: string; finish?: string }>; quantity: { areaM2: number; volumeM3: number; lengthM: number; weightKg: number; units: number; metadata: Record<string, number | string> }; costs: ElementCost[]; interferences: Array<{ specialty: Especialidad; description: string; severity: "low" | "medium" | "high" }>; status: ElementStatus; createdAt: string; tracesTo: string[] };
shared/arkiConstructionElements.ts:11:const elementId = (kind: string, level: number, index: number) => `${kind}-${level + 1}-${index + 1}`;
shared/arkiConstructionElements.ts:12:const price = (code: string) => APU_DATABASE.find((item) => item.codigo === code)?.precio_unitario ?? 0;
shared/arkiConstructionElements.ts:14:const base = (input: { id: string; projectId: string; name: string; kind: StructuralElement["kind"]; function: ElementFunction; specialty: Especialidad; level: number; geometry: Record<string, number | string>; materials: StructuralElement["materials"]; quantity: StructuralElement["quantity"]; costs: ElementCost[]; tracesTo?: string[] }): StructuralElement => ({ ...input, interferences: [{ specialty: input.kind === "door" || input.kind === "window" ? "arquitectura" : "sanitarias", description: input.kind === "slab" ? "Pasos de instalaciones deben coordinarse antes del vaciado." : "Coordinar pases y reservas con especialidades MEP.", severity: "medium" }], status: "borrador", createdAt: new Date().toISOString(), tracesTo: input.tracesTo ?? [] });
shared/arkiConstructionElements.ts:16:export type GeneratedElementSet = { foundations: StructuralElement[]; columns: StructuralElement[]; beams: StructuralElement[]; slabs: StructuralElement[]; doors: StructuralElement[]; windows: StructuralElement[]; stairs: StructuralElement[]; floors: StructuralElement[]; roofs: StructuralElement[]; partitions: StructuralElement[]; relations: ElementRelation[]; budgetPen: number; totalWeightKg: number };
shared/arkiConstructionElements.ts:19:  const foundations: StructuralElement[] = []; const columns: StructuralElement[] = []; const beams: StructuralElement[] = []; const slabs: StructuralElement[] = []; const doors: StructuralElement[] = []; const windows: StructuralElement[] = []; const stairs: StructuralElement[] = []; const floors: StructuralElement[] = []; const roofs: StructuralElement[] = []; const partitions: StructuralElement[] = []; const relations: ElementRelation[] = [];
shared/arkiConstructionElements.ts:21:  for (let i = 0; i < columnCount; i += 1) { const x = i % 2 === 0 ? 0 : input.widthM; const y = Math.min(input.depthM, Math.floor(i / 2) * input.depthM / Math.max(1, columnCount / 2 - 1)); const id = elementId("column", 0, i); const quantity = { areaM2: .09, volumeM3: .09 * 3.6, lengthM: 3.6, weightKg: .09 * 3.6 * 2400 + .09 * 3.6 * 120, units: 1, metadata: { section: "0.30 × 0.30 m", steelKg: .09 * 3.6 * 120 } }; foundations.push(base({ id: `foundation-${i + 1}`, projectId: input.projectId, name: `Zapata aislada ${i + 1}`, kind: "foundation", function: "portante", specialty: "estructuras", level: 0, geometry: { x, y, widthM: 1.5, depthM: 1.5, thicknessM: .5 }, materials: [{ material: "concreto f210", grade: "f'c=210 kg/cm²" }, { material: "acero corrugado", grade: "fy=4200 kg/cm²" }], quantity: { areaM2: 2.25, volumeM3: 1.125, lengthM: 1.5, weightKg: 1.125 * 2400 + 67.5, units: 1, metadata: { excavationM3: 4.0 } }, costs: [cost("04.01.01", "Concreto estructural en cimentación", "m3", 1.125, "estructuras", "estructuras")] })); columns.push(base({ id, projectId: input.projectId, name: `Columna C-${i + 1}`, kind: "column", function: "portante", specialty: "estructuras", level: 0, geometry: { x, y, widthM: .3, depthM: .3, heightM: 3.6 }, materials: [{ material: "concreto armado", grade: "f'c=280 kg/cm²" }, { material: "acero corrugado", grade: "fy=4200 kg/cm²" }], quantity, costs: [cost("04.01.01", "Concreto armado en columnas", "m3", quantity.volumeM3, "estructuras", "estructuras")], tracesTo: [`foundation-${i + 1}`] })); relations.push({ id: `rel-foundation-column-${i + 1}`, fromId: id, toId: `foundation-${i + 1}`, relation: "rests_on", description: "Columna transmite carga a zapata aislada.", verified: false }); }
shared/arkiConstructionElements.ts:37:export function elementPartidas(elements: StructuralElement[]): PartidaPresupuestal[] { return elements.flatMap((element) => element.costs.map((item) => ({ id: `${element.id}-${item.code}`, codigo: item.code, descripcion: item.description, unidad: item.unit, metrado: item.quantity, precio_unitario: item.unitPrice, parcial: item.total, especialidad: item.specialty, fase: item.phase as PartidaPresupuestal["fase"] }))); }
client/src/i18n/catalog.ts:3:const es = { brand: "ARKI", workspace: "BIM WORKSPACE", activeProject: "PROYECTO ACTIVO", local: "LOCAL", help: "Ayuda", exit: "Salir", changeLanguage: "Cambiar idioma", prototype: "PROTOTIPO LOCAL", navigator: "NAVEGADOR", activeProfile: "PERFIL ACTIVO", engine: "MOTOR LOCAL OPERATIVO", infoBox: "INFO BOX", pendingSelection: "SELECCIÓN PENDIENTE", noSelection: "Sin selección", selectionPending: "El canvas aún no emite un contrato de selección.", moduleRegistered: "MÓDULO REGISTRADO", generator: "Generador dinámico de familias", pendingModule: "Este módulo está integrado al workspace, pero su integración de dominio aún está pendiente.", availableFromGenerator: "El generador funcional permanece disponible desde la pestaña Generador.", status: "Estado", units: "UNIDADES: MÉTRICO", discipline: "DISCIPLINA: ARQUITECTURA", phase: "FASE: PROPUESTA", ui1: "UI-1", visitor: "Visitante", user: "Usuario / Proyecto", specialist: "Especialista / Coordinación", corporate: "Corporativo", selected: "seleccionado", languagePrepared: "Selector preparado; traducción completa se implementará con el sistema i18n.", searchCommands: "Búsqueda de comandos", commandHint: "Usa las pestañas del workspace para navegar.", localDraft: "Borrador local listo", backendLater: "La persistencia corporativa se implementará en la fase de backend.", languageSelected: "Idioma seleccionado", projectName: "Generador de familias", localProfile: "PERFIL LOCAL", moduleStateShown: "El estado del módulo ahora se muestra en el canvas.", selectionUi2: "La selección de elementos se integrará con el canvas BIM en UI-2.", visibleStates: "ESTADOS UI-1 VISIBLES", commands: "Ctrl/Cmd+K COMANDOS", runtime: "PARAMETRIC BIM RUNTIME", gatewayKicker: "ESTACIÓN CORPORATIVA DE DISEÑO Y COORDINACIÓN", gatewayTitle: "Elige tu espacio", gatewayTitleAccent: "de trabajo.", gatewayDescription: "Una plataforma para pasar de la intención arquitectónica al modelo, el costo, la coordinación y el ciclo de vida del proyecto.", prototypeFooter: "PROTOTIPO LOCAL · UI-1 · NO ES AUTENTICACIÓN DE PRODUCCIÓN", standardsFooter: "PE · RNE-PE · IFC4X3", visitorSubtitle: "Explora ARKI", visitorDescription: "Conoce el motor BIM, las familias y el flujo completo sin acceder a información privada.", userSubtitle: "Diseña tu proyecto", userDescription: "Crea propuestas, revisa espacios, compara versiones y prepara tu expediente.", specialistSubtitle: "Revisa por disciplina", specialistDescription: "Trabaja con arquitectura, estructuras, MEP, costos, coordinación y construcción.", corporateSubtitle: "Costos e interferencias", corporateDescription: "Administra estándares, PriceBook, APU, clashes, CDE e integraciones.", demo: "Demostraciones", publicLibrary: "Biblioteca pública", documentation: "Documentación", projects: "Proyectos", generatorShort: "Generador", bimShort: "Modelo BIM", disciplines: "Disciplinas", review: "Revisión", interferences: "Interferencias", costs: "Costos", clashesShort: "Clashes", governance: "Gobierno", home: "Inicio", dataModule: "Data", library: "Biblioteca", projectsModule: "Proyectos", generatorModule: "Generador", bimModule: "Modelo BIM", plan: "Planta", section: "Corte", model3d: "3D", quantities: "Metrados", budget: "Presupuesto", budget5d: "PRESUP-5D", expensesModule: "GASTOS", contractCosts: "Costos contractuales", schedule4d: "4D", clashesModule: "Clashes", dossier: "Expediente", technicalDossier: "EXP-TEC", operationsManagement: "O-M", operations: "O&M", administration: "Administración", administrationModule: "ADM", unavailableModuleTooltip: "Módulo visible para este perfil; integración de dominio pendiente." } as const;
scripts/test-serialization.ts:2:// Entrega 1A — ida y vuelta Muro ↔ WallDTO ↔ JSON y ConstructionModel ↔ DTO ↔ JSON.
scripts/test-serialization.ts:84:// --- Round-trip de ConstructionModel ---
scripts/test-serialization.ts:127:        "ConstructionModel round-trip completo",
shared/arkiConstructionOntology.ts:1:import { generateElementSet, type ElementRelation, type StructuralElement } from "./arkiConstructionElements";
shared/arkiConstructionOntology.ts:22:export class Muro {
shared/arkiConstructionOntology.ts:82:export const APU_DATABASE: ApuPartida[] = [
shared/arkiConstructionOntology.ts:90:function apu(codigo: string) { return APU_DATABASE.find((item) => item.codigo === codigo)!; }
shared/arkiConstructionOntology.ts:94:export type ScheduleTask = { id: string; codigo: string; nombre: string; fase: "diseño" | "estructura" | "arquitectura" | "instalaciones" | "acabados" | "puesta_en_marcha"; duracion_dias: number; inicio_dia: number; fin_dia: number; predecessors: string[]; elementIds: string[]; costo_pen: number };
shared/arkiConstructionOntology.ts:95:export type ConstructionModel = { schema: "ARKI-CONSTRUCTION-MODEL-1.0"; projectId: string; generatedAt: string; ontologyLevel: "CONSTRUCTIVE_ELEMENTS"; spaces: ConstructionSpace[]; walls: Muro[]; foundations: StructuralElement[]; columns: StructuralElement[]; beams: StructuralElement[]; slabs: StructuralElement[]; doors: StructuralElement[]; windows: StructuralElement[]; stairs: StructuralElement[]; floors: StructuralElement[]; roofs: StructuralElement[]; partitions: StructuralElement[]; relations: ElementRelation[]; schedule: ScheduleTask[]; apuDatabase: ApuPartida[]; summary: { wallCount: number; spaceCount: number; foundationCount: number; columnCount: number; beamCount: number; slabCount: number; doorCount: number; windowCount: number; stairCount: number; floorElementCount: number; roofCount: number; partitionCount: number; relationCount: number; floorCount: number; totalNetWallAreaM2: number; totalVolumeM3: number; totalWeightKg: number; totalBudgetPen: number; totalDurationDays: number; doors: number; windows: number; interferences: number }; gates: { semanticElements: boolean; quantitiesCalculated: boolean; apuLinked: boolean; scheduleLinked: boolean; specialistReviewRequired: true; notes: string[] } };
shared/arkiConstructionOntology.ts:97:export function generateConstructionModel(input: { projectId: string; name: string; widthM: number; depthM: number; floors: number; familyCategory?: string }): ConstructionModel {
shared/arkiConstructionOntology.ts:126:  const schedule: ScheduleTask[] = [{ id: "task-design", codigo: "D-01", nombre: "Diseño y coordinación de espacios", fase: "diseño", duracion_dias: 10, inicio_dia: 1, fin_dia: 10, predecessors: [], elementIds: spaces.map((space) => space.id), costo_pen: r(total * .03) }];
shared/arkiConstructionOntology.ts:127:  for (let level = 0; level < levels; level += 1) { const levelWalls = walls.filter((wall) => wall.nivel_piso === level); const start = 11 + level * 14; schedule.push({ id: `task-structure-${level + 1}`, codigo: `E-${String(level + 1).padStart(2, "0")}`, nombre: `Estructura y muros · Nivel ${level + 1}`, fase: level === 0 ? "estructura" : "arquitectura", duracion_dias: 14, inicio_dia: start, fin_dia: start + 13, predecessors: level === 0 ? ["task-design"] : [`task-structure-${level}`], elementIds: levelWalls.map((wall) => wall.id), costo_pen: r(levelWalls.reduce((sum, wall) => sum + wall.partidas.reduce((subtotal, item) => subtotal + item.parcial, 0), 0) * .62) }); }
shared/arkiConstructionOntology.ts:128:  const finishStart = 11 + levels * 14; schedule.push({ id: "task-mep", codigo: "M-01", nombre: "Instalaciones y coordinación MEP", fase: "instalaciones", duracion_dias: 12, inicio_dia: finishStart, fin_dia: finishStart + 11, predecessors: [`task-structure-${levels}`], elementIds: walls.flatMap((wall) => wall.interferencias.map((item) => item.id)), costo_pen: r(total * .12) }); schedule.push({ id: "task-finishes", codigo: "A-01", nombre: "Acabados, pruebas y entrega", fase: "acabados", duracion_dias: 15, inicio_dia: finishStart + 12, fin_dia: finishStart + 26, predecessors: ["task-mep"], elementIds: walls.flatMap((wall) => wall.partidas.filter((item) => item.fase === "acabados").map((item) => item.id)), costo_pen: r(total * .25) });
shared/arkiConstructionOntology.ts:130:  return { schema: "ARKI-CONSTRUCTION-MODEL-1.0", projectId: input.projectId, generatedAt: new Date().toISOString(), ontologyLevel: "CONSTRUCTIVE_ELEMENTS", spaces, walls, foundations: elementSet.foundations, columns: elementSet.columns, beams: elementSet.beams, slabs: elementSet.slabs, doors: elementSet.doors, windows: elementSet.windows, stairs: elementSet.stairs, floors: elementSet.floors, roofs: elementSet.roofs, partitions: elementSet.partitions, relations: elementSet.relations, schedule, apuDatabase: APU_DATABASE, summary: { wallCount: walls.length, spaceCount: spaces.length, foundationCount: elementSet.foundations.length, columnCount: elementSet.columns.length, beamCount: elementSet.beams.length, slabCount: elementSet.slabs.length, doorCount: elementSet.doors.length, windowCount: elementSet.windows.length, stairCount: elementSet.stairs.length, floorElementCount: elementSet.floors.length, roofCount: elementSet.roofs.length, partitionCount: elementSet.partitions.length, relationCount: elementSet.relations.length, floorCount: levels, totalNetWallAreaM2: r(walls.reduce((sum, wall) => sum + wall.metrado.m2_muro, 0)), totalVolumeM3: r(walls.reduce((sum, wall) => sum + wall.metrado.m3_muro, 0), 3), totalWeightKg: r(walls.reduce((sum, wall) => sum + wall.metrado.peso_total_kg, 0) + elementSet.totalWeightKg, 0), totalBudgetPen: r(total + elementSet.budgetPen), totalDurationDays, doors: elementSet.doors.length, windows: elementSet.windows.length, interferences: walls.reduce((sum, wall) => sum + wall.interferencias.length, 0) + elementSet.columns.length + elementSet.beams.length + elementSet.slabs.length }, gates: { semanticElements: true, quantitiesCalculated: true, apuLinked: true, scheduleLinked: true, specialistReviewRequired: true, notes: ["Modelo constructivo conceptual generado desde la familia.", "Los precios APU son referenciales en soles y deben actualizarse con la base contractual.", "La coordinación estructural, sanitaria, eléctrica y mecánica requiere revisión especializada."] } };
shared/arkiConstructionOntology.ts:133:export function exportConstructionIfc(model: ConstructionModel, metadata: { name: string; familyId: string; city?: string; country?: string }) {
shared/arkiConstructionOntology.ts:147:  const emit = (element: StructuralElement) => { const ref = next++; elementRefs.push(ref); const entity = element.kind === "column" ? "IFCCOLUMN" : element.kind === "beam" ? "IFCBEAM" : element.kind === "slab" ? "IFCSLAB" : element.kind === "foundation" ? "IFCFOOTING" : element.kind === "door" ? "IFCDOOR" : element.kind === "window" ? "IFCWINDOW" : element.kind === "stair" ? "IFCSTAIR" : element.kind === "roof" ? "IFCROOF" : element.kind === "partition" ? "IFCWALLSTANDARDCASE" : "IFCSLAB"; lines.push(`#${ref}=${entity}(${step(ifcGuid(element.id))},${step(element.name)},'${element.kind}',${element.level});`); const prop = next++; lines.push(`#${prop}=IFCPROPERTYSET(${step(ifcGuid(`${element.id}:pset`))},${step(element.name)},'ARKI_ElementData',('area_m2',${element.quantity.areaM2},'volume_m3',${element.quantity.volumeM3},'weight_kg',${element.quantity.weightKg},'partidas',${element.costs.map((item) => item.code).join("|")},'specialty','${element.specialty}'));`, `#${next++}=IFCRELDEFINESBYPROPERTIES(${step(ifcGuid(`${element.id}:props`))},${step(element.name)},(#${ref}),#${prop});`); };
shared/arkiConstructionOntology.ts:157:export function constructionSummary(model: ConstructionModel) { return { ...model.summary, budgetFormatted: `S/ ${model.summary.totalBudgetPen.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`, ontology: model.ontologyLevel }; }
client/src/contexts/ProjectContext.tsx:3:import type { ConstructionModel } from "@shared/arkiConstructionOntology";
client/src/contexts/ProjectContext.tsx:4:const ProjectContext = createContext<{ building: GeneratedBuilding | null; constructionModel: ConstructionModel | null; setBuilding: (building: GeneratedBuilding | null) => void } | null>(null);
client/src/components/ArkiWorkspaceShell.tsx:18:import type { ContextPanelState } from "@shared/arkiContextPanel";
client/src/components/ArkiWorkspaceShell.tsx:46:function contextState(modelLevel: number, floorCount: number): ContextPanelState { return { levels: Array.from({ length: Math.max(1, floorCount) }, (_, index) => ({ id: `level-${index}`, name: `Nivel ${index + 1}`, index })), activeLevel: modelLevel, disciplines: [{ id: "arquitectura", name: "Arquitectura" }, { id: "estructuras", name: "Estructuras" }, { id: "sanitarias", name: "Sanitarias" }, { id: "electricas", name: "Eléctricas" }], activeDiscipline: "all", phases: ["borrador", "aprobado", "en_construccion", "construido"], activePhase: "all", visibleCategories: ["Muros", "Puertas", "Ventanas", "Columnas", "Vigas", "Losas"], tree: [], tools: [{ id: "select", label: "Seleccionar", enabled: true }, { id: "zoom", label: "Zoom", enabled: true }, { id: "pan", label: "Pan", enabled: true }, { id: "fit", label: "Encuadrar", enabled: true }], viewport: { scale: 1, translateX: 0, translateY: 0 } }; }
scripts/test-technical-dossier.ts:2:import { generateTechnicalDossier, technicalDossierMarkdown } from "../shared/arkiTechnicalDossier";
scripts/test-technical-dossier.ts:5:const dossier = generateTechnicalDossier(building.constructionModel, "La Libertad", 1.04);
shared/arkiDynamicFamilies.ts:1:import { generateConstructionModel, type ConstructionModel } from "./arkiConstructionOntology";
shared/arkiDynamicFamilies.ts:85:  constructionModel?: ConstructionModel;
shared/arkiDynamicFamilies.ts:173:    constructionModel: generateConstructionModel({ projectId: id, name: `${selectedFamily.name} · ${selectedVariant.name}`, widthM, depthM, floors, familyCategory: selectedFamily.category }),
```

## 5. Capacidades clave y límites observados

- La clasificación final debe contrastarse con el código y los outputs anteriores.
- Este informe no promueve capacidades profesionales no verificadas.
- La Fase 0 no implementa E1-E8 y no activa integraciones externas.

## 6. Veredicto de Fase 0

**APPROVE WITH FIXES — AUDITORÍA REAL EJECUTADA; E1-E8 AÚN DEFERIDOS.**

La identidad del árbol fue confirmada como `c62183a5904f02aa0a935572454a5a35f9d167aa`. El árbol de trabajo contiene cambios no committeados y numerosos archivos no rastreados, incluidos contratos, evidencia UI-3A, documentación de traspaso, la prueba muro-puerta y este informe. El diff contra el checkpoint muestra siete archivos modificados/eliminados; los archivos no rastreados deben separarse de los cambios de producto en el siguiente paquete.

`pnpm check`, `pnpm build`, `test-constructive`, `test-serialization`, `test-wall-coherence`, `test-wall-door-canvas` y `test-bim-selection` terminaron con `exit=0` en esta auditoría.

La cadena de dominio muro → abertura → puerta → relación con muro → selección tiene evidencia ejecutable. La evidencia visual del preview debe conservarse como condición bloqueante antes de promoverla a `E2E VERIFIED`.

### Fixes obligatorios antes de E1

1. Registrar por separado cambios de producto, evidencia, contratos y artefactos de traspaso.
2. Confirmar visualmente en el preview la selección de muro y puerta con Info Box completo.
3. Completar el mapa de ADR existente frente a ADR-EXTENSIÓN para evitar duplicación.
4. Resolver D1-D5 del Product Owner antes de E5: visor 3D, persistencia, parser IFC4, solver estructural y alcance normativo MEP.
5. Mantener E2-E8 en `DEFER` y no activar integraciones externas hasta que el baseline y los recursos estén autorizados.
