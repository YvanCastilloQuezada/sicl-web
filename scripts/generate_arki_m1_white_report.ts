import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { m1WhiteSourceGateMarkdown, runM1WhiteSourceGate, validateM1WhiteSourceGate } from "../client/src/components/arkiM1WhiteSourceGate";

const report = runM1WhiteSourceGate({ head: "83aa7eb5ba2397a8dd5c77f825c27066591ae23c", remoteHead: "83aa7eb5ba2397a8dd5c77f825c27066591ae23c", workspaceFiles: [] });
if (!validateM1WhiteSourceGate(report)) throw new Error("M1 source gate validation failed");
const dir = resolve("docs/arki-m1-white");
mkdirSync(dir, { recursive: true });
writeFileSync(resolve(dir, "ARKI-M1-EDWARD-T-WHITE-SOURCE-GATE-2026-09-20.json"), JSON.stringify(report, null, 2) + "\n");
writeFileSync(resolve(dir, "ARKI-M1-EDWARD-T-WHITE-SOURCE-GATE-2026-09-20.md"), m1WhiteSourceGateMarkdown(report));
console.log(JSON.stringify({ status: "BLOCKED_BY_PRIMARY_SOURCE", contentEntries: report.inventory.sourceEntries, architecture: "SCHEMA_READY" }, null, 2));
