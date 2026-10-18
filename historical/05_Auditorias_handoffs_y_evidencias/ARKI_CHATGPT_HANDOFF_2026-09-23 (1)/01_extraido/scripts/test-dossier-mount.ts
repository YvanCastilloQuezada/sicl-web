import { readFile } from "node:fs/promises";
const shell = await readFile(new URL("../client/src/components/ArkiWorkspaceShell.tsx", import.meta.url), "utf8");
if (!shell.includes('activeModule === "EXP-TEC" ? <DossierModule')) throw new Error("DossierModule is not mounted for EXP-TEC");
if (shell.includes('activeModule === "Expediente"')) throw new Error("stale Expediente module condition remains");
if (!shell.includes('import DossierModule')) throw new Error("DossierModule import missing");
console.log(JSON.stringify({ status: "PASS", activeModule: "EXP-TEC", dossierMounted: true }));
