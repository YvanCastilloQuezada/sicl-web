import GeneratorModule from "../client/src/modules/GeneratorModule";
import BimModule from "../client/src/modules/BimModule";
import DossierModule from "../client/src/modules/DossierModule";
import MetricsModule from "../client/src/modules/MetricsModule";
import Home from "../client/src/pages/Home";

for (const [name, component] of Object.entries({ GeneratorModule, BimModule, DossierModule, MetricsModule, Home })) {
  if (typeof component !== "function") throw new Error(`${name} no exporta un componente`);
}
const homeSource = await import("node:fs/promises").then((fs) => fs.readFile(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8"));
for (const forbidden of ["function ConstructionPanel", "function DossierWorkspace", "function Metric"]) {
  if (homeSource.includes(forbidden)) throw new Error(`Home conserva lógica inline: ${forbidden}`);
}
const moduleSources = await Promise.all(["GeneratorModule.tsx", "BimModule.tsx", "DossierModule.tsx"].map((file) => import("node:fs/promises").then((fs) => fs.readFile(new URL(`../client/src/modules/${file}`, import.meta.url), "utf8"))));
for (const source of moduleSources) {
  if (source.includes('className="app-shell"') || source.includes('className="sidebar"') || source.includes('className="main-content"')) throw new Error("módulo conserva layout heredado");
  if (!source.includes("arki-module-body")) throw new Error("módulo sin arki-module-body");
}
console.log(JSON.stringify({ status: "PASS", modules: ["GeneratorModule", "BimModule", "DossierModule", "MetricsModule"], homeOrchestrator: true, inheritedLayout: false }));
