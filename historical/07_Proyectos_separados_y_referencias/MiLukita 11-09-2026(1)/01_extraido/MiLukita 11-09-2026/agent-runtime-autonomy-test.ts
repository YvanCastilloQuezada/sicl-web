import { mkdir, writeFile } from "node:fs/promises";
import { runAgentRuntimeAutonomyTest } from "../shared/agentRuntimeAutonomy";

const report = runAgentRuntimeAutonomyTest();
const output = process.env.AUTONOMY_REPORT_PATH ?? "audit-package/AGENT_RUNTIME_AUTONOMY_TEST.json";
await mkdir(output.substring(0, output.lastIndexOf("/")) || ".", { recursive: true });
await writeFile(output, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ output, passed: report.passed, chainCompleted: report.chainCompleted, minutes: report.minutes, uniqueEventIds: report.uniqueEventIds, chaosPassed: report.chaos.every((scenario) => scenario.passed), killLukitaPassed: report.killLukita.passed }, null, 2));
