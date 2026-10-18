import { access, readFile } from "node:fs/promises";
const read = (path: string) => readFile(new URL(path, import.meta.url), "utf8");
const shell = await read("../client/src/components/ArkiWorkspaceShell.tsx");
const contextPanel = await read("../client/src/canvas/ContextPanel.tsx");
const css = await read("../client/src/index.css");
let navigatorDeleted = false;
try { await access(new URL("../client/src/components/ArkiNavigator.tsx", import.meta.url)); } catch { navigatorDeleted = true; }
if (!navigatorDeleted) throw new Error("ArkiNavigator must be deleted by ADR-UI3A-001");
for (const forbidden of ["PERFIL LOCAL", "PE · RNE-PE", "ESCALA 1:100"]) if (shell.includes(forbidden)) throw new Error(`inherited shell cleanup remains: ${forbidden}`);
for (const forbidden of ["arki-navigator", "arki-left-info-box", "arki-navigator-empty"]) if (css.includes(forbidden)) throw new Error(`obsolete selector remains: ${forbidden}`);
for (const required of ["ContextPanel", "InfoBoxPanel", "CanvasPlanView", "240px minmax(0, 1fr) 260px", "@media (max-width: 1050px)", "@media (max-width: 720px)"]) if (!shell.includes(required) && !contextPanel.includes(required) && !css.includes(required)) throw new Error(`missing UI-3A rule: ${required}`);
console.log(JSON.stringify({ status: "PASS", navigatorDeleted, cleanup: true, fixedColumns: "240px / fluid / 260px", responsive: [1050, 720] }));
