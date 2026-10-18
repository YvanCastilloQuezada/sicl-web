ARKI — Contrato UI-3A v2: Canvas BIM, selección semántica y ContextPanel
Versión: 2.0 (reemplaza a v1.0)
Estado: Propuesta para verificación de Manus contra código real
Base: Flujo de trabajo operativo v1.0 APPROVE, UI-2 v1.7 APPROVE
Alcance: Canvas 2D, selección semántica, ContextPanel, InfoBoxPanel
No autoriza código hasta verificación contra el repositorio

0. Cambio respecto a v1.0
El contrato UI-3A v1.0 estaba aprobado, pero fue escrito antes de que existiera el Flujo de trabajo operativo. Ese flujo resolvió que:

Panel izquierdo = contexto. Nivel, disciplina, fase, filtros, herramientas, árbol.

Panel derecho = inspector. Propiedades del elemento seleccionado.

Eso es incompatible con el contrato v1.0, que decía "ambos Info Box consumen el mismo contrato de selección". El v2.0 aplica la corrección.

1. Alcance
Incluye:

Canvas 2D funcional con grilla, ejes y niveles.

Planta generada desde ConstructionModel: muros, puertas, ventanas, columnas, vigas, losas.

Contrato de selección semántica (BimSelection).

Contrato de vista (CanvasView) para el panel izquierdo.

ContextPanel (izquierdo): nivel, disciplina, fase, filtros, árbol del modelo, zoom, pan, encuadre, herramientas.

InfoBoxPanel (derecho): propiedades, materiales, metrados, costo, partida, relaciones, provenance.

Selección individual con click.

Selección múltiple con Shift + click.

Selección vacía explícita.

Resaltado visual en el canvas.

Sincronización árbol ↔ canvas: seleccionar en uno resalta en el otro.

Zoom, pan, encuadre.

No incluye:

Corte, elevación, 3D.

Vistas sincronizadas.

Edición paramétrica.

Cuadros de planificación.

Command palette.

Undo/redo.

Reglas de coordinación.

BCF.

Importación/exportación nueva.

Backend.

Estos van a UI-3B, UI-3C, UI-3D.

2. Contratos nuevos
2.1 shared/arkiBimSelection.ts
ts
export type BimElementKind =
  | "wall" | "door" | "window" | "column" | "beam"
  | "slab" | "foundation" | "stair" | "floor"
  | "roof" | "partition" | "space";

export type BimSelectionItem = {
  elementId: string;
  kind: BimElementKind;
  category: string;
  family?: string;
  type?: string;
  discipline: string;
  level: number;
  phase?: string;
  properties: Record<string, string | number | boolean>;
  materials?: Array<{ name: string; thicknessM?: number; function?: string }>;
  metrics?: Record<string, number>;
  cost?: number;
  relatedIds: string[];
};

export type BimSelection = {
  mode: "empty" | "single" | "multiple";
  items: BimSelectionItem[];
  timestamp: string;
};

export function emptySelection(): BimSelection;
export function singleSelection(item: BimSelectionItem): BimSelection;
export function multipleSelection(items: BimSelectionItem[]): BimSelection;
export function selectionFromElement(element: unknown, kind: BimElementKind): BimSelectionItem;
Sin any. Sin Math.random(). Sin Date.now() en IDs. timestamp se toma del snapshot o de una fuente determinista.

2.2 client/src/canvas/types.ts
ts
export type CanvasViewport = {
  scale: number;
  translateX: number;
  translateY: number;
};

export type CanvasView = {
  kind: "plan";
  level: number;
  discipline: string | "all";
  phase: string | "all";
  visibleCategories: string[];
  showGrid: boolean;
  showAxes: boolean;
  viewport: CanvasViewport;
};

export type CanvasHit = {
  elementId: string;
  kind: BimElementKind;
  distance: number;
};
2.3 shared/arkiContextPanel.ts
Contrato del panel izquierdo:

ts
export type ContextLevel = {
  id: string;
  name: string;
  index: number;
};

export type ContextDiscipline = {
  id: string;
  name: string;
};

export type ContextTreeNode = {
  id: string;
  label: string;
  kind: "level" | "category" | "element";
  elementId?: string;
  children?: ContextTreeNode[];
};

export type ContextTool = {
  id: "select" | "zoom" | "pan" | "fit";
  label: string;
  enabled: boolean;
};

export type ContextPanelState = {
  levels: ContextLevel[];
  activeLevel: number;
  disciplines: ContextDiscipline[];
  activeDiscipline: string | "all";
  phases: string[];
  activePhase: string | "all";
  visibleCategories: string[];
  tree: ContextTreeNode[];
  tools: ContextTool[];
  viewport: CanvasViewport;
};
3. Archivos nuevos
text
shared/arkiBimSelection.ts
shared/arkiContextPanel.ts
client/src/canvas/types.ts
client/src/canvas/CanvasPlanView.tsx
client/src/canvas/ContextPanel.tsx
client/src/canvas/InfoBoxPanel.tsx
client/src/canvas/SelectionProvider.tsx
scripts/test-bim-selection.ts
scripts/test-canvas-mount.ts
scripts/test-selection-info.ts
scripts/test-context-panel.ts
4. Archivos modificados
client/src/components/ArkiWorkspaceShell.tsx

Pestaña Planta monta CanvasPlanView.

Panel izquierdo: monta ContextPanel en lugar del ArkiNavigator espejo actual.

Panel derecho: monta InfoBoxPanel.

client/src/components/ArkiNavigator.tsx

Deja de ser el panel izquierdo. Se reubica como componente interno del ContextPanel o se elimina. Decisión de implementación.

client/src/contexts/ProjectContext.tsx

Expone constructionModel: ConstructionModel | null además de building.

No se modifican:

MODULE_DEFINITIONS

isAccessAllowed

supportedLanguages

catalog

t()

useTranslation

Salvo que la revisión contra código real detecte incompatibilidad imprescindible, en cuyo caso Manus debe reportarlo como discrepancia antes de tocar.

5. Comportamiento del panel izquierdo (ContextPanel)
Sin selección:

Árbol visible con niveles → categorías → elementos.

Filtros activos.

Herramientas disponibles.

Nivel, disciplina y fase seleccionados.

Con selección:

Mismo contenido.

El árbol resalta el elemento seleccionado.

El canvas mantiene el resaltado.

Al hacer click en el árbol:

El elemento se selecciona en el canvas.

El InfoBoxPanel derecho se puebla.

El canvas hace zoom al elemento (opcional, decisión de implementación).

Al hacer click en el canvas:

El elemento se selecciona.

El árbol izquierdo resalta el elemento correspondiente.

El InfoBoxPanel derecho se puebla.

6. Comportamiento del panel derecho (InfoBoxPanel)
Sin selección:

Estado del modelo: cantidad de elementos.

Advertencias activas.

Última actualización (del snapshot, no del reloj).

Mensaje de ayuda: "Selecciona un elemento en el canvas o el árbol para inspeccionarlo."

Con una selección (muro):

ID, familia, tipo.

Nivel, disciplina, fase.

Dimensiones: longitud, espesor, altura.

Capas: ladrillo, tarrajeo interior, tarrajeo exterior, imprimante, pintura, acabado.

Metrado: m2_muro, m3_muro, peso_total_kg.

Costo: partida, precio unitario, parcial.

Actividad 4D vinculada.

Elementos relacionados.

Provenance (si existe en el snapshot).

Con selección múltiple:

Cantidad de elementos.

Categorías presentes.

Metrado total.

Costo total.

Acciones comunes (placeholder hasta UI-3D).

7. Criterios de aceptación
pnpm check pasa.

pnpm build pasa.

Los 17 tests actuales siguen pasando.

test-bim-selection.ts pasa.

test-canvas-mount.ts pasa.

test-selection-info.ts pasa.

test-context-panel.ts pasa.

Pestaña Planta renderiza muros, columnas, vigas y losas del ConstructionModel.

Click sobre un muro lo selecciona.

Shift + click añade a la selección.

Click fuera deselecciona.

Escape limpia la selección.

Panel izquierdo muestra árbol, filtros y herramientas.

Panel derecho muestra propiedades del elemento seleccionado.

Al seleccionar en el árbol, se resalta en el canvas.

Al seleccionar en el canvas, se resalta en el árbol.

Zoom, pan y encuadre funcionan.

Determinismo: misma entrada, misma BimSelection.

Ningún elemento sin elementId determinista.

Sin any nuevos en client/src/canvas/, shared/arkiBimSelection.ts ni shared/arkiContextPanel.ts.

No se modificó MODULE_DEFINITIONS, isAccessAllowed, supportedLanguages ni catalog.

8. Tests
test-bim-selection.ts

emptySelection() produce mode "empty" con items: [].

singleSelection() produce mode "single".

multipleSelection() produce mode "multiple".

selectionFromElement() produce BimSelectionItem con elementId no vacío.

Determinismo: misma entrada, misma selección.

test-canvas-mount.ts

CanvasPlanView monta sin errores con building: null.

CanvasPlanView monta sin errores con building con constructionModel.

No hay any en el archivo.

test-selection-info.ts

Al seleccionar un Muro, InfoBoxPanel recibe BimSelectionItem con elementId, kind, family, materials, metrics, cost.

Con selección vacía, InfoBoxPanel recibe estado vacío.

test-context-panel.ts

ContextPanel recibe ContextPanelState válido.

El árbol contiene al menos un nodo de nivel.

Los filtros están presentes.

Las herramientas están presentes.

9. Exclusiones explícitas
UI-3A no implementa:

Corte, elevación, 3D.

Vistas sincronizadas entre planta, corte y 3D.

Edición paramétrica de elementos.

Cuadros de planificación derivados.

Command palette.

Atajos de teclado (W A, D R, etc.).

Undo/redo.

Reglas de coordinación automáticas.

Clash detection visual.

BCF.

Importación RFA/RVT/IFC/DWG/DXF.

Exportación nueva.

Backend.

Autenticación real.

10. Reglas de calidad
TypeScript estricto.

Sin any nuevos en los archivos de UI-3A.

Sin Math.random() para IDs.

Sin Date.now() en valores que deban ser deterministas.

Sin mutar props recibidas.

Sin excepciones silenciosas.

Sin TODO crítico sin documento de decisión.

Cada archivo nuevo con al menos un test o razón documentada.

11. Documentación obligatoria de la entrega
Cuando Manus implemente, debe entregar:

Resumen de cambios.

Archivos creados.

Archivos modificados.

Contratos conservados.

Decisiones nuevas.

Tests agregados.

Comandos ejecutados (21 outputs: 17 actuales + 4 nuevos).

Resultado real de cada test.

Riesgos.

Limitaciones.

Capturas:

Pestaña Planta con modelo cargado.

Muro seleccionado con panel derecho poblado.

Selección múltiple con Shift + click.

Selección vacía tras Escape.

Vista responsive 1050px (Info Box derecho colapsado).

Diff, manifest, hash SHA-256.

12. Procedimiento
Manus revisa este contrato contra el código real.

Reporta discrepancias, archivos duplicados, capacidades ausentes.

Veredicto: APPROVE, APPROVE WITH FIXES, REJECT, DEFER o PRODUCT OWNER DECISION REQUIRED.

Product Owner confirma si hay decisiones materiales.

Implementación UI-3A.

Verificación contra los 21 outputs y las 5 capturas.

UI-3B, UI-3C, UI-3D no arrancan hasta APPROVE o APPROVE WITH FIXES sobre UI-3A.

13. Qué no autoriza este contrato
No autoriza código hasta verificación de Manus.

No autoriza backend.

No autoriza tocar MODULE_DEFINITIONS, isAccessAllowed, supportedLanguages, catalog.

No autoriza abrir UI-3B, UI-3C, UI-3D.

No autoriza tocar shared/ fuera de los dos archivos nuevos.

No autoriza modificar ConstructionModel, Muro, StructuralElement ni DTOs.

No autoriza declarar Luka como dependencia.

Fin del Contrato UI-3A v2.0.

Este contrato reemplaza al v1.0. Sustituye el "Info Box izquierdo espejo" por el ContextPanel de contexto, conforme al Flujo de trabajo operativo v1.0 APPROVE.

Cuando Manus lo revise y confirme, arranca UI-3A. Cuando UI-3A cierre con APPROVE, arranca UI-3B.