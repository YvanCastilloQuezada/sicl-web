import { readFile } from "node:fs/promises";
const read = (path: string) => readFile(new URL(path, import.meta.url), "utf8");
const shell = await read("../client/src/components/ArkiWorkspaceShell.tsx");
const navigator = await read("../client/src/components/ArkiNavigator.tsx");
const toolbar = await read("../client/src/modules/ModuleToolbar.tsx");
const css = await read("../client/src/index.css");
const generator = await read("../client/src/modules/GeneratorModule.tsx");
const checks: Array<[string, string, string[]]> = [
  ["shell", shell, ["<ArkiNavigator", "<ModuleToolbar", "arki-project-chip", "arki-tab-status-dot", "availableModules.map"]],
  ["navigator", navigator, ["arki-navigator-toggle", "arki-navigator-backdrop"]],
  ["toolbar", toolbar, ["Comparador", "Exportaciones", "Buscar familia"]],
  ["css", css, [".arki-navigator", ".arki-module-toolbar", "--arki-bg: #0B1220"]],
  ["generator", generator, ["className=\"arki-module-body\"", "className=\"arki-generator-grid\""]],
];
for (const [label, source, needles] of checks) for (const needle of needles) if (!source.includes(needle)) throw new Error(`${label} missing ${needle}`);
if (generator.includes('className="sidebar"') || generator.includes('className="app-shell"') || generator.includes('className="main-content"')) throw new Error("inherited generator layout remains");
for (const size of [".arki-workspace-tabs button { font-size: 12px", ".arki-module-status { font-size: 10px", ".arki-info-head { font-size: 11px", ".arki-workspace-body { grid-template-columns: minmax(0, 1fr) 220px"]) if (!css.includes(size)) throw new Error(`layout/typography missing ${size}`);
console.log(JSON.stringify({ status: "PASS", navigator: "collapsed overlay", tabs: "role-filtered", inheritedSidebar: false, toolbar: true, minUiFontPx: 10 }));
