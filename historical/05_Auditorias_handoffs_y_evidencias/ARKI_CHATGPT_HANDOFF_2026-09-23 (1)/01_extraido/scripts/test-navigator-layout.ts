import { access, readFile } from "node:fs/promises";
const read = (path: string) => readFile(new URL(path, import.meta.url), "utf8");
const shell = await read("../client/src/components/ArkiWorkspaceShell.tsx");
const contextPanel = await read("../client/src/canvas/ContextPanel.tsx");
const canvas = await read("../client/src/canvas/CanvasPlanView.tsx");
const infoBox = await read("../client/src/canvas/InfoBoxPanel.tsx");
const toolbar = await read("../client/src/modules/ModuleToolbar.tsx");
const css = await read("../client/src/index.css");
try { await access(new URL("../client/src/components/ArkiNavigator.tsx", import.meta.url)); throw new Error("obsolete Navigator still exists"); } catch (error) { if (error instanceof Error && error.message === "obsolete Navigator still exists") throw error; }
for (const [label, source, needles] of [["shell", shell, ["<ContextPanel", "<ModuleToolbar", "<InfoBoxPanel", "<CanvasPlanView", "activeModule === \"EXP-TEC\" ? <DossierModule"] as const], ["context", contextPanel, ["ÁRBOL DEL MODELO", "Disciplina", "Fase"] as const], ["canvas", canvas, ["showGrid", "onWheel", "onPointerMove", "useBimSelection"] as const], ["infobox", infoBox, ["Propiedades", "Materiales", "Metrado", "Costo y trazabilidad"] as const], ["toolbar", toolbar, ["Comparador", "Exportaciones", "Buscar familia"] as const], ["css", css, ["grid-template-columns: 240px minmax(0, 1fr) 260px", "@media (max-width: 1050px)", "@media (max-width: 720px)", ".arki-context-panel", ".arki-info-panel"] as const]]) for (const needle of needles) if (!source.includes(needle)) throw new Error(`${label} missing ${needle}`);
console.log(JSON.stringify({ status: "PASS", navigator: "deleted", contextPanel: "fixed left column", canvas: "plan", infoBox: "fixed right column", columns: "240px / fluid / 260px", responsive: true, dossierMount: true }));
