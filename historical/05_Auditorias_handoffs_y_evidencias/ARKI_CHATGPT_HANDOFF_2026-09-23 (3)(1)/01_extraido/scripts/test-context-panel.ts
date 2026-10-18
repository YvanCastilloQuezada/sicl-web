import { readFile } from "node:fs/promises";
import type { ContextPanelState } from "../shared/arkiContextPanel";

const state: ContextPanelState = { levels: [{ id: "level-0", name: "Nivel 1", index: 0 }], activeLevel: 0, disciplines: [{ id: "arquitectura", name: "Arquitectura" }], activeDiscipline: "all", phases: ["borrador"], activePhase: "all", visibleCategories: ["Muros"], tree: [{ id: "level-0", label: "Nivel 1", kind: "level" }], tools: [{ id: "select", label: "Seleccionar", enabled: true }, { id: "zoom", label: "Zoom", enabled: true }, { id: "pan", label: "Pan", enabled: true }, { id: "fit", label: "Encuadrar", enabled: true }], viewport: { scale: 1, translateX: 0, translateY: 0 } };
if (state.tree[0].kind !== "level" || state.tools.length !== 4 || state.visibleCategories.length !== 1) throw new Error("context panel contract failed");
const source = await readFile(new URL("../client/src/canvas/ContextPanel.tsx", import.meta.url), "utf8");
for (const required of ["Nivel", "Disciplina", "Fase", "ÁRBOL DEL MODELO", "Muros"]) if (!source.includes(required)) throw new Error(`ContextPanel missing ${required}`);
console.log("test-context-panel: PASS");
