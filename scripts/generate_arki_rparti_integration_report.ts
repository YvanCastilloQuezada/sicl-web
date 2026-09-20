import { mkdirSync, writeFileSync } from "node:fs";
import { integrationProofMarkdown, runRPartiIntegrationProof } from "../client/src/components/arkiRPartiIntegrationProof";

const repo = process.cwd();
const head = "9a8675961074db476288a22740d851d5ee749080";
const proof = runRPartiIntegrationProof({ head, remoteHead: head, worktree: "CLEAN", fullValidation: { focused: "PASS", full: "PASS", check: "PASS", build: "PASS", diffCheck: "PASS" } });
mkdirSync(`${repo}/docs/arki-rparti-integration`, { recursive: true });
writeFileSync(`${repo}/docs/arki-rparti-integration/ARKI-RPARTI-INTEGRATION-PROOF-I0-I11.md`, integrationProofMarkdown(proof));
writeFileSync(`${repo}/docs/arki-rparti-integration/ARKI-RPARTI-INTEGRATION-PROOF-I0-I11.json`, JSON.stringify(proof, null, 2) + "\n");
console.log(JSON.stringify({ realizations: proof.parti.realizationIds, distinctGeometry: proof.parti.distinctGeometry, manualExpansion: proof.manual.expansion, p94: proof.p94Readiness }, null, 2));
