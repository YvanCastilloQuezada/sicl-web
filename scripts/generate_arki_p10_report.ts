import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { p10Markdown, runP10KnowledgeTransferChallenge, validateP10Report } from "../client/src/components/arkiP10KnowledgeTransferChallenge";

const report = runP10KnowledgeTransferChallenge();
if (!validateP10Report(report)) throw new Error("P10 validation failed");
const dir = resolve("docs/arki-p10");
mkdirSync(dir, { recursive: true });
writeFileSync(resolve(dir, "ARKI-P10-KNOWLEDGE-TRANSFER-2026-09-20.json"), JSON.stringify(report, null, 2) + "\n");
writeFileSync(resolve(dir, "ARKI-P10-KNOWLEDGE-TRANSFER-2026-09-20.md"), p10Markdown(report));
console.log(JSON.stringify({ status: "PASS", battery: report.battery.length, knowledgeAfter: report.promotion.stateAfter, autonomy: report.autonomy.l10Process }, null, 2));
