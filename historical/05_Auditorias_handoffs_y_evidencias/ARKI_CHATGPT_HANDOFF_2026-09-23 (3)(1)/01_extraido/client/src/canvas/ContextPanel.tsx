import { useMemo } from "react";
import { Crosshair, Maximize2, Move, MousePointer2, Search } from "lucide-react";
import type { ConstructionModel } from "@shared/arkiConstructionOntology";
import { selectionFromElement, type BimElementKind } from "@shared/arkiBimSelection";
import type { ContextPanelState, ContextTreeNode } from "@shared/arkiContextPanel";
import type { CanvasView } from "./types";
import { useBimSelection } from "./SelectionProvider";

const kinds: Array<[keyof ConstructionModel, BimElementKind, string]> = [["walls", "wall", "Muros"], ["doors", "door", "Puertas"], ["windows", "window", "Ventanas"], ["columns", "column", "Columnas"], ["beams", "beam", "Vigas"], ["slabs", "slab", "Losas"]];

function treeForModel(model: ConstructionModel | null, level: number): ContextTreeNode[] {
  if (!model) return [];
  const groups: Array<[string, string, Array<[keyof ConstructionModel, BimElementKind, string]>]> = [["architecture", "Arquitectura", kinds.slice(0, 3)], ["structures", "Estructuras", kinds.slice(3)]];
  return groups.map(([disciplineId, disciplineLabel, disciplineKinds]) => ({
    id: disciplineId,
    label: disciplineLabel,
    kind: "discipline",
    children: [{
      id: `${disciplineId}-level-${level}`,
      label: `Nivel ${level + 1}`,
      kind: "level",
      children: disciplineKinds.map(([key, , label]) => ({
        id: `${disciplineId}-${key}-${level}`,
        label,
        kind: "category",
        children: (model[key] as Array<{ id: string; level?: number; nivel_piso?: number }>)
          .filter((item) => (item.level ?? item.nivel_piso ?? 0) === level)
          .map((item) => ({ id: `${disciplineId}-${item.id}`, label: item.id, kind: "element", elementId: item.id })),
      })),
    }],
  }));
}

export default function ContextPanel({ model, view, onViewChange, state }: { model: ConstructionModel | null; view: CanvasView; onViewChange: (view: CanvasView) => void; state: ContextPanelState }) {
  const { selection, select } = useBimSelection();
  const tree = useMemo(() => treeForModel(model, view.level), [model, view.level]);
  const flatElements = useMemo(() => model ? kinds.flatMap(([key, kind]) => (model[key] as Array<unknown>).map((element) => ({ element, kind }))) : [], [model]);
  const findElement = (elementId: string) => flatElements.find(({ element }) => (element as { id?: unknown }).id === elementId);
  const selectTreeItem = (elementId?: string) => { if (!elementId) return; const found = findElement(elementId); if (found) select(selectionFromElement(found.element, found.kind)); };
  const toggleCategory = (label: string) => onViewChange({ ...view, visibleCategories: view.visibleCategories.includes(label) ? view.visibleCategories.filter((item) => item !== label) : [...view.visibleCategories, label] });
  return <aside className="arki-context-panel" aria-label="Contexto del modelo BIM">
    <div className="arki-panel-title"><span>CONTEXTO</span><b>PLANTA</b></div>
    <label className="arki-panel-search"><Search size={13} /><input placeholder="Buscar elemento" aria-label="Buscar elemento" /></label>
    <div className="arki-context-fields"><label>Nivel<select value={view.level} onChange={(event) => onViewChange({ ...view, level: Number(event.target.value) })}>{state.levels.map((level) => <option key={level.id} value={level.index}>{level.name}</option>)}</select></label><label>Disciplina<select value={view.discipline} onChange={(event) => onViewChange({ ...view, discipline: event.target.value })}><option value="all">Todas</option>{state.disciplines.map((discipline) => <option key={discipline.id} value={discipline.id}>{discipline.name}</option>)}</select></label><label>Fase<select value={view.phase} onChange={(event) => onViewChange({ ...view, phase: event.target.value })}><option value="all">Todas</option>{state.phases.map((phase) => <option key={phase} value={phase}>{phase}</option>)}</select></label></div>
    <div className="arki-context-tools"><button className={state.tools[0].enabled ? "active" : ""} onClick={() => onViewChange({ ...view })} title="Seleccionar"><MousePointer2 size={14} /></button><button onClick={() => onViewChange({ ...view, viewport: { ...view.viewport, scale: Math.min(3, view.viewport.scale * 1.2) } })} title="Zoom"><Crosshair size={14} /></button><button onClick={() => onViewChange({ ...view, viewport: { ...view.viewport, translateX: view.viewport.translateX + 30 } })} title="Pan"><Move size={14} /></button><button onClick={() => onViewChange({ ...view, viewport: { scale: 1, translateX: 0, translateY: 0 } })} title="Encuadrar"><Maximize2 size={14} /></button></div>
    <div className="arki-context-section"><span className="arki-context-label">CATEGORÍAS VISIBLES</span>{kinds.map(([, , label]) => <label key={label} className="arki-check-row"><input type="checkbox" checked={view.visibleCategories.includes(label)} onChange={() => toggleCategory(label)} />{label}</label>)}</div>
    <div className="arki-context-section arki-tree"><span className="arki-context-label">ÁRBOL DEL MODELO</span>{tree.map((level) => <TreeNode key={level.id} node={level} selectedId={selection.items[0]?.elementId} onSelect={selectTreeItem} />)}</div>
  </aside>;
}

function TreeNode({ node, selectedId, onSelect }: { node: ContextTreeNode; selectedId?: string; onSelect: (id?: string) => void }) { return <div className={`arki-tree-node kind-${node.kind}`}><button className={selectedId === node.elementId ? "selected" : ""} onClick={() => onSelect(node.elementId)}>{node.label}</button>{node.children?.map((child) => <TreeNode key={child.id} node={child} selectedId={selectedId} onSelect={onSelect} />)}</div>; }
