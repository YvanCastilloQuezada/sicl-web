import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const phase = process.env.ARKI_PHASE || "MO11";
const patterns = {
  F1: /projectstate|project.*state|humanreview|canonical|provenance|eventlog|identity|corehttp|sourcegate/i,
  F2: /delta62|knowledge|education|university|book|curat|examiner|research/i,
  F3: /architecturaldeveloper|integratedarchitect|reasoning|intelligence|agent|brief/i,
  F4: /parti|topolog|spatiallayout|spatialreason|d63|generat/i,
  F5: /designfunnel|evaluation|pareto|candidate|selection|counterfactual/i,
  F6: /agk|geometrykernel|persistentnaming|d63tod2|parametric|regeneration|occt/i,
  F7: /professional|economic|oece|s10interop|normative|cost|baseline/i,
  F8: /technicaldossier|f7f8closure|document|dossier|drawing|deliver/i,
  F9: /f9construction|constructionlineage|field|asbuilt|digitaltwin/i,
  F10: /operation|maintenance|lifecycle|telemetry|feedback|learning/i,
};
const dir = "artifacts/arki-phase-evidence";
fs.mkdirSync(dir, { recursive: true });
const receipt = {
  schema: "ARKI-PHASE-EVIDENCE-1", phase, timeUTC: new Date().toISOString(),
  repository: process.env.GITHUB_REPOSITORY || "local",
  sha: process.env.GITHUB_SHA || "LOCAL_UNPINNED",
  branch: process.env.GITHUB_REF_NAME || "local",
  declaration: "IMPLEMENTED_BY_PO; TEST_EVIDENCE_SEPARATE; PO_APPROVAL_REQUIRED",
  core: "NOT_RUN — cross-repository Core test runner not provisioned in this workflow",
  tests: [], status: "NOT_RUN", approval: "PO_PENDING"
};
const run = (name, cmd, args) => {
  const started = new Date().toISOString();
  const p = spawnSync(cmd, args, { encoding: "utf8", timeout: 30 * 60 * 1000, maxBuffer: 12 * 1024 * 1024, env: { ...process.env, CI: "true" } });
  const log = [p.stdout || "", p.stderr || "", p.error ? String(p.error) : ""].join("\n");
  fs.writeFileSync(path.join(dir, name + ".log"), log);
  const status = p.error ? "BLOCKED" : p.status === 0 ? "PASS" : "FAIL";
  receipt.tests.push({ name, command: [cmd, ...args].join(" "), started, status, exitCode: p.status, signal: p.signal });
  return status;
};
try {
  const files = [];
  const walk = (root) => {
    if (!fs.existsSync(root)) return;
    for (const item of fs.readdirSync(root, { withFileTypes: true })) {
      const full = path.join(root, item.name);
      if (item.isDirectory()) {
        if (!["node_modules", "dist", "artifacts", ".git", ".next"].includes(item.name)) walk(full);
      } else if (/\.(test|spec)\.[cm]?[jt]sx?$/.test(item.name)) files.push(full);
    }
  };
  for (const root of ["server", "shared", "client", "scripts", "tests"]) walk(root);
  const matched = phase === "MO11" ? files : files.filter(f => patterns[phase]?.test(f));
  receipt.discovery = { countAll: files.length, countMatched: matched.length, files: matched };
  if (matched.length === 0) {
    receipt.status = "BLOCKED";
    receipt.reason = "NO_PHASE_TEST_FILES_DISCOVERED; manual coverage mapping required";
  } else {
    const args = ["exec", "vitest", "run", ...matched];
    run("vitest-" + phase.toLowerCase(), "pnpm", args);
    if (phase === "MO11") {
      run("typescript", "pnpm", ["check"]);
      run("production-build", "pnpm", ["build"]);
    }
    receipt.status = receipt.tests.some(t => t.status === "FAIL") ? "FAIL" :
      receipt.tests.some(t => t.status === "BLOCKED") ? "BLOCKED" : "PASS_WEB_ONLY";
  }
} catch (e) {
  receipt.status = "BLOCKED";
  receipt.reason = String(e);
} finally {
  fs.writeFileSync(path.join(dir, "receipt-" + phase.toLowerCase() + ".json"), JSON.stringify(receipt, null, 2) + "\n");
  const lines = [
    "# ARKI " + phase + " — Evidence Receipt",
    "- Web: " + receipt.repository + "@" + receipt.sha,
    "- Phase: " + phase,
    "- Status: " + receipt.status,
    "- Core: " + receipt.core,
    "- PO: " + receipt.approval,
    "- Matched test files: " + (receipt.discovery?.countMatched ?? 0),
    ...receipt.tests.map(t => "- " + t.name + ": " + t.status + " (exit " + t.exitCode + ")"),
    "- Limit: PASS_WEB_ONLY is NOT phase acceptance or end-to-end validation."
  ];
  fs.writeFileSync(path.join(dir, "receipt-" + phase.toLowerCase() + ".md"), lines.join("\n") + "\n");
  console.log(lines.join("\n"));
}
if (receipt.status === "FAIL" || receipt.status === "BLOCKED") process.exitCode = 1;
