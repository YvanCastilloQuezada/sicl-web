"use strict";

const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const crypto = require("node:crypto");

const sha256 = data =>
  crypto.createHash("sha256").update(data).digest("hex");

function git(root, args) {
  return cp.execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    timeout: 30000,
    maxBuffer: 16 * 1024 * 1024
  }).trim();
}

function diagnose(root) {
  const base = fs.realpathSync(root);
  const head = git(base, ["rev-parse", "HEAD"]);
  const branch = git(base, ["branch", "--show-current"]);
  const dirty = git(base, ["status", "--porcelain"]);

  const files = git(base, ["ls-files", "-z"])
    .split("\0").filter(Boolean);

  const inventory = {
    totalTrackedFiles: files.length,
    tests: files.filter(x => /\.test\.[cm]?js$/.test(x)),
    contracts: files.filter(x =>
      /contract|schema|registry/i.test(x)
    ),
    modules: files.filter(x =>
      x.startsWith("tools/maqueta-viva/") &&
      /\.[cm]?js$/.test(x)
    )
  };

  const checks = [];

  function check(id, condition, detail) {
    checks.push({
      id,
      status: condition ? "PASS" : "FAIL",
      detail
    });
  }

  const frozen =
    "tools/maqueta-viva/historical/av-ui-001-frozen.html";

  const adapter =
    "tools/maqueta-viva/arki-av023-historical-ui.cjs";

  const registry =
    "tools/maqueta-viva/assembly-registry.json";

  const exists = name =>
    fs.existsSync(path.join(base, name));

  check(
    "AV028_HISTORICAL_UI_PRESENT",
    exists(frozen),
    frozen
  );

  check(
    "AV028_ADAPTER_PRESENT",
    exists(adapter),
    adapter
  );

  check(
    "AV028_REGISTRY_PRESENT",
    exists(registry),
    registry
  );

  check(
    "AV028_WORKTREE_CLEAN",
    dirty.length === 0,
    dirty.length ? "UNCOMMITTED_CHANGES" : "CLEAN"
  );

  const evidence = {};

  if (exists(frozen)) {
    evidence.historicalUiSha256 =
      sha256(fs.readFileSync(path.join(base, frozen)));

    check(
      "AV028_HISTORICAL_UI_IDENTITY",
      evidence.historicalUiSha256 ===
        "7d128094fc90f9d73aeff6bfc4b452f54b661c128a9383b5bc0738feb62040bc",
      evidence.historicalUiSha256
    );
  }

  const unknowns = [
    {
      id: "CORE_RUNTIME_INTEGRATION",
      status: "UNKNOWN",
      reason: "No se ha ejecutado una prueba E2E Core desde AV-028."
    },
    {
      id: "AGK_SIMULATION",
      status: "UNKNOWN",
      reason: "No se ha demostrado simulación geométrica real."
    },
    {
      id: "DELTA_6_2_LEARNING",
      status: "UNKNOWN",
      reason: "No se ha demostrado adquisición y evaluación de conocimiento."
    },
    {
      id: "CANONICAL_DEPENDENCY_PROPAGATION",
      status: "UNKNOWN",
      reason: "No se ha probado propagación canónica de dependencias."
    }
  ];

  const failures = checks.filter(x => x.status === "FAIL");

  const proposals = failures.map((x, index) => ({
    id: `AV028-P-${String(index + 1).padStart(3, "0")}`,
    sourceCheck: x.id,
    action: "INVESTIGATE_AND_PROPOSE_REPAIR",
    status: "PENDING_REVIEW",
    executionAuthorized: false,
    alternatives: [],
    metricsVerified: false
  }));

  const report = {
    schema: "ARKI-AV028-SELF-DIAGNOSIS-1",
    repository: base,
    head,
    branch,
    inventory,
    checks,
    evidence,
    unknowns,
    proposals,
    summary: {
      passed: checks.length - failures.length,
      failed: failures.length,
      unknown: unknowns.length
    },
    policy: {
      execution: "READ_ONLY",
      canonicalWrite: false,
      automaticRepair: false,
      poApproval: "REQUIRED",
      agkOnly: true,
      frozenContractsPreserved: true
    }
  };

  report.receiptSha256 = sha256(JSON.stringify(report));
  return report;
}

module.exports = { diagnose };

if (require.main === module) {
  try {
    if (process.argv.length !== 3) {
      throw Error("USAGE: node arki-av028-self-diagnosis.cjs REPO");
    }
    console.log(JSON.stringify(diagnose(process.argv[2]), null, 2));
  } catch (error) {
    console.error("ARKI_AV028_FAIL:", error.message);
    process.exitCode = 1;
  }
}
