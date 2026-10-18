import { emptySelection, multipleSelection, selectionFromElement, singleSelection } from "../shared/arkiBimSelection";

const item = selectionFromElement({ id: "column-1", name: "Columna C-1", kind: "column", specialty: "estructuras", level: 0, geometry: { x: 1, y: 2 }, quantity: { volumeM3: 1 }, costs: [], tracesTo: [] }, "column");
if (emptySelection().mode !== "empty" || emptySelection().items.length !== 0) throw new Error("empty selection failed");
if (singleSelection(item).mode !== "single" || singleSelection(item).items[0].elementId !== "column-1") throw new Error("single selection failed");
if (multipleSelection([item, { ...item, elementId: "beam-1", kind: "beam" }]).mode !== "multiple") throw new Error("multiple selection failed");
if (selectionFromElement({ id: "column-1", level: 0 }, "column").elementId !== "column-1") throw new Error("deterministic element id failed");
console.log("test-bim-selection: PASS");
