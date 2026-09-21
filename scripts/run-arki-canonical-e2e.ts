import { readFile } from "node:fs/promises";
import { executeCanonicalBrainAndD62, type CanonicalExecutionInput } from "../server/arkiCanonicalExecution";

const args = process.argv.slice(2);
if (args[0] === "--") args.shift();
const inputPath = args[0];
if (!inputPath) {
  console.error("Usage: SICL_CORE_URL=https://... SICL_CORE_SERVICE_TOKEN=... pnpm exec tsx scripts/run-arki-canonical-e2e.ts <input.json>");
  process.exit(2);
}

if (!process.env.SICL_CORE_URL?.trim()) {
  console.error("E2E_BLOCKED: SICL_CORE_URL is required; no local fallback is permitted.");
  process.exit(3);
}
if (!process.env.SICL_CORE_SERVICE_TOKEN?.trim()) {
  console.error("E2E_BLOCKED: SICL_CORE_SERVICE_TOKEN is required.");
  process.exit(3);
}

const input = JSON.parse(await readFile(inputPath, "utf8")) as CanonicalExecutionInput;
const result = await executeCanonicalBrainAndD62(input);
console.log(JSON.stringify({
  status: result.status,
  projectId: result.projectId,
  persistence: result.persistence,
  promotion: result.promotion,
  versions: result.versions,
  brain: { executionId: input.brainExecutionId, status: result.brain.status },
  d62: { executionId: input.d62ExecutionId, replayFingerprint: result.d62.replayFingerprint },
  commits: { brain: result.brainCommit, d62: result.d62Commit },
}, null, 2));
