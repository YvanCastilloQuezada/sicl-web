#!/usr/bin/env node
/**
 * ARKI digital-twin gate 1: audit REAL Git-backed phase snapshots, not physical assets.
 * Read-only by default. Node 20+, Git, local repository history required.
 * Usage: node tools/maqueta-viva/Verify-ARKI-TwinTimeline.mjs [--out FILE]
 *        node tools/maqueta-viva/Verify-ARKI-TwinTimeline.mjs --self-test
 */
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { mkdirSync, writeFileSync } from "node:fs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const sourcePath = "docs/arki-master-map/ARKI_MASTER_MAP_STATE.json";
const sha256 = value => createHash("sha256").update(value).digest("hex");
const stable = value => JSON.stringify(value);
const fail = (code, detail = "") => { throw new Error(code + (detail ? ": " + detail : "")); };
const git = (...args) => execFileSync("git", ["-C", repoRoot, ...args], { encoding: "utf8", maxBuffer: 12 * 1024 * 1024, timeout: 20000 }).trim();

function parseSnapshot(raw, sha, capturedAt) {
  const state = JSON.parse(raw);
  const phases = state?.roadmap?.phases;
  if (!Array.isArray(phases) || phases.length !== 10) fail("PHASE_COUNT_NOT_TEN", sha);
  const ids = new Set(phases.map(p => p.id));
  if (ids.size !== 10 || [...ids].some(id => !/^F(?:10|[1-9])$/.test(id))) fail("PHASE_IDENTITY_INVALID", sha);
  if (!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?(?:Z|[+-]\d\d:\d\d)$/.test(capturedAt) || !Number.isFinite(Date.parse(capturedAt))) fail("COMMIT_TIMESTAMP_INVALID", sha);
  const assets = Object.fromEntries(phases.map(p => ["ARKI:PHASE:" + p.id, { phaseId: p.id, status: p.status, evidenceStatus: p.evidence_status ?? "UNKNOWN" }]));
  return { commit: sha, capturedAt, sourceHash: sha256(raw), sourceUpdatedAt: state.updated_at ?? null, assets };
}
function buildLedger(snapshots) {
  if (!snapshots.length) fail("NO_SOURCE_SNAPSHOTS");
  const events = [], checkpoints = [];
  let previous = {}, tail = "GENESIS";
  for (const snap of snapshots) {
    const keys = Object.keys(snap.assets).sort();
    if (keys.length !== 10) fail("ASSET_IDENTITY_COUNT_INVALID");
    for (const assetId of keys) {
      const next = snap.assets[assetId], before = previous[assetId];
      if (before && stable(before) === stable(next)) continue;
      const event = {
        seq: events.length + 1,
        kind: before ? "STATE_CHANGE_OBSERVED" : "INITIAL_STATE_OBSERVED",
        assetId,
        before: before ?? null,
        after: next,
        source: { repository: "YvanCastilloQuezada/sicl-web", path: sourcePath, commit: snap.commit, sha256: snap.sourceHash },
        recordedAt: snap.capturedAt,
        domainOccurredAt: null, // Git commit time is NOT physical/domain event time.
        temporalBasis: "GIT_COMMIT_TIME_ONLY",
        previousHash: tail,
      };
      event.hash = sha256(stable(event));
      events.push(event);
      tail = event.hash;
    }
    previous = Object.fromEntries(keys.map(k => [k, snap.assets[k]]));
    checkpoints.push({ commit: snap.commit, sourceHash: snap.sourceHash, eventCount: events.length, tailHash: tail, expected: previous });
  }
  return { events, checkpoints, tailHash: tail };
}
function verifyReplay(snapshots, ledger) {
  let tail = "GENESIS", index = 0;
  const observed = {};
  const sourceByCommit = new Map(snapshots.map(s => [s.commit, s]));
  for (const checkpoint of ledger.checkpoints) {
    while (index < checkpoint.eventCount) {
      const e = ledger.events[index];
      if (!e || e.seq !== index + 1 || e.previousHash !== tail) fail("LEDGER_CHAIN_BROKEN", String(index));
      const { hash, ...payload } = e;
      if (sha256(stable(payload)) !== hash) fail("LEDGER_HASH_MISMATCH", String(index));
      const source = sourceByCommit.get(e.source.commit);
      if (!source || source.sourceHash !== e.source.sha256 || e.recordedAt !== source.capturedAt) fail("PROVENANCE_MISMATCH", String(index));
      if (stable(observed[e.assetId] ?? null) !== stable(e.before)) fail("REPLAY_BEFORE_MISMATCH", e.assetId);
      if (e.domainOccurredAt !== null || e.temporalBasis !== "GIT_COMMIT_TIME_ONLY") fail("UNSUPPORTED_TEMPORAL_CLAIM");
      observed[e.assetId] = e.after;
      tail = hash;
      index++;
    }
    if (tail !== checkpoint.tailHash || stable(observed) !== stable(checkpoint.expected)) fail("CHECKPOINT_REPLAY_MISMATCH", checkpoint.commit);
  }
  if (index !== ledger.events.length || tail !== ledger.tailHash) fail("LEDGER_FINAL_MISMATCH");
  return { status: "PASS", checkpoints: ledger.checkpoints.length, events: index, finalHash: tail };
}
function loadRealHistory() {
  const lines = git("log", "--first-parent", "-n", "35", "--format=%H%x09%cI", "--", sourcePath).split(/\r?\n/).filter(Boolean).reverse();
  if (!lines.length) fail("NO_GIT_HISTORY_FOR_CANONICAL_STATE");
  return lines.map(line => {
    const [sha, capturedAt] = line.split("\t");
    if (!/^[0-9a-f]{40}$/.test(sha)) fail("INVALID_GIT_COMMIT", sha);
    const raw = execFileSync("git", ["-C", repoRoot, "show", sha + ":" + sourcePath], { encoding: "utf8", maxBuffer: 12 * 1024 * 1024, timeout: 20000 });
    return parseSnapshot(raw, sha, capturedAt);
  });
}
function report(snapshots, ledger, replay) {
  const first = snapshots[0], last = snapshots.at(-1);
  const changes = ledger.events.filter(e => e.kind === "STATE_CHANGE_OBSERVED");
  const timestamps = snapshots.map(s => Date.parse(s.capturedAt));
  const regressions = timestamps.slice(1).filter((v, i) => v < timestamps[i]).length;
  return {
    schema: "ARKI-TWIN-TEMPORAL-GATE-1.0",
    gate: "REAL_REPOSITORY_STATE_HISTORY_NOT_PHYSICAL_TWIN",
    verdict: "NOT_READY_FOR_OPERATIONAL_DIGITAL_TWIN",
    projectTimeline: replay.status === "PASS" ? "AUDITABLE_REPLAY_OF_GIT_OBSERVED_PHASE_STATE" : "BLOCKED",
    source: { repository: "YvanCastilloQuezada/sicl-web", path: sourcePath, firstCommit: first.commit, lastCommit: last.commit, firstSourceHash: first.sourceHash, lastSourceHash: last.sourceHash },
    evidence: {
      phaseIdentity: "PASS_10_STABLE_PHASE_IDS",
      physicalAssetIdentity: "NOT_DEMONSTRATED",
      recordedTimestamp: "GIT_COMMIT_TIME_ONLY",
      domainEventTimestamp: "NOT_AVAILABLE",
      provenance: "COMMIT_SHA_AND_SOURCE_SHA256_VERIFIED",
      historicalReplay: replay.status,
      physicalObservations: 0,
      liveSensorEvents: 0,
      simulationCalibration: "NOT_DEMONSTRATED",
      humanDecisionAuthority: "UNCHANGED",
    },
    metrics: { snapshots: snapshots.length, distinctPhaseAssets: 10, initialObservations: ledger.events.length - changes.length, observedChanges: changes.length, replayedEvents: replay.events, temporalRegressionsInGitHistory: regressions, replayCheckpoints: replay.checkpoints, ledgerTailHash: ledger.tailHash },
    changes: changes.slice(-40).map(e => ({ phase: e.assetId, recordedAt: e.recordedAt, sourceCommit: e.source.commit, before: e.before, after: e.after })),
    limitations: [
      "Git commits are source observations, not domain/field event records.",
      "Historical replay reconstructs F1-F10 roadmap states, not 3D geometry, operations, costs, sensors or as-built assets.",
      "No validated physical asset identifiers, measured telemetry, occurredAt, capture clock or sensor provenance.",
      "This audit reads the last 35 first-parent commits touching the canonical state; it is not full project history.",
      "No canonical mutation, frozen promotion, phase status change or operational decision is authorized."
    ],
    nextGate: "Provide one real asset register with stable IDs and one real timestamped field/event dataset with source fingerprints; validate event-time ordering, identity mapping and historical state reconstruction against independent observations."
  };
}
function selfTest() {
  const phases = Array.from({ length: 10 }, (_, i) => ({ id: "F" + (i + 1), status: "UNKNOWN", evidence_status: "UNKNOWN" }));
  const raw = x => JSON.stringify({ updated_at: "2026-10-07", roadmap: { phases: x } });
  const a = parseSnapshot(raw(phases), "a".repeat(40), "2026-10-07T10:00:00Z");
  const b = parseSnapshot(raw(phases.map((p, i) => i === 5 ? { ...p, status: "FROZEN" } : p)), "b".repeat(40), "2026-10-08T10:00:00Z");
  const snapshots = [a, b], ledger = buildLedger(snapshots);
  if (verifyReplay(snapshots, ledger).status !== "PASS" || ledger.events.length !== 11) fail("SELFTEST_REPLAY");
  const tampered = structuredClone(ledger); tampered.events[10].after.status = "FORGED";
  let caught = false; try { verifyReplay(snapshots, tampered); } catch (e) { caught = e.message.startsWith("LEDGER_HASH_MISMATCH"); }
  if (!caught) fail("SELFTEST_TAMPER_NOT_REJECTED");
  caught = false; try { parseSnapshot(raw(phases.slice(0, 9)), "c".repeat(40), "2026-10-08T10:00:00Z"); } catch (e) { caught = e.message.startsWith("PHASE_COUNT_NOT_TEN"); }
  if (!caught) fail("SELFTEST_INVALID_IDENTITY_NOT_REJECTED");
  console.log("SELF_TEST=PASS; SNAPSHOTS=2; EVENTS=11; TAMPER=REJECTED; INVALID_IDENTITY=REJECTED");
}
try {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) { selfTest(); process.exit(0); }
  if (args.some(x => x !== "--out" && x !== args[args.indexOf("--out") + 1] && x.startsWith("--"))) fail("UNKNOWN_ARGUMENT");
  const snapshots = loadRealHistory();
  const ledger = buildLedger(snapshots);
  const replay = verifyReplay(snapshots, ledger);
  const result = report(snapshots, ledger, replay);
  if (args.includes("--out")) {
    const target = args[args.indexOf("--out") + 1];
    if (!target || target.startsWith("--")) fail("OUTPUT_PATH_REQUIRED");
    const output = resolve(target);
    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(output, JSON.stringify(result, null, 2) + "\n", "utf8");
    console.error("REPORT_WRITTEN=" + output);
  }
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error("ARKI_TWIN_GATE_FAILED=" + error.message);
  process.exitCode = 1;
}
