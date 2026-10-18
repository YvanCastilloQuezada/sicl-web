import { MODULE_DEFINITIONS } from "../client/src/components/ArkiWorkspaceShell";

const allowed = new Set(["IMPLEMENTED", "VERIFIED", "PARTIAL", "CONCEPTUAL", "NOT AVAILABLE", "FUTURE REFERENCE"]);
if (MODULE_DEFINITIONS.length === 0) throw new Error("No modules declared");
for (const module of MODULE_DEFINITIONS) {
  if (!module.name || !module.icon || !allowed.has(module.status) || module.allowed.length === 0) throw new Error(`Invalid module state: ${module.name}`);
}
const uniqueNames = new Set(MODULE_DEFINITIONS.map(({ name }) => name));
if (uniqueNames.size !== MODULE_DEFINITIONS.length) throw new Error("Duplicate module name");
console.log(JSON.stringify({ status: "PASS", modules: MODULE_DEFINITIONS.length, statuses: [...new Set(MODULE_DEFINITIONS.map(({ status }) => status))] }, null, 2));
