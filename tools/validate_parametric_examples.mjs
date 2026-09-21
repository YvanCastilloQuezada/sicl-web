import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const corpus = path.join(root, "client/src/content/parametric-examples");
const manifest = JSON.parse(fs.readFileSync(path.join(corpus, "manifest.json"), "utf8"));
if (manifest.contractVersion !== "ARKI-PARAMETRIC-EXAMPLE-CORPUS-1.0") throw new Error("Invalid corpus contract");
if (manifest.totalCommands !== 67 || manifest.examples.length !== 67) throw new Error("Expected exactly 67 command examples");
const ids = new Set();
for (const example of manifest.examples) {
  if (ids.has(example.exampleId)) throw new Error(`Duplicate example id: ${example.exampleId}`);
  ids.add(example.exampleId);
  if (!example.commandName || !example.command || !example.syntax || !example.learningObjective) throw new Error(`Incomplete example: ${example.exampleId}`);
  if (example.humanReviewRequired !== true) throw new Error(`Human review boundary missing: ${example.exampleId}`);
  const examplePath = path.join(corpus, example.path);
  if (!fs.existsSync(examplePath)) throw new Error(`Missing example file: ${example.path}`);
  const payload = JSON.parse(fs.readFileSync(examplePath, "utf8"));
  if (payload.exampleId !== example.exampleId || payload.commandName !== example.commandName) throw new Error(`Manifest/file mismatch: ${example.exampleId}`);
  for (const artifact of example.artifacts) {
    if (!fs.existsSync(path.join(path.dirname(examplePath), artifact))) throw new Error(`Missing artifact ${artifact} for ${example.exampleId}`);
  }
}
const design = manifest.examples.find((example) => example.commandName === "/GENERATE DESIGN");
if (!design || design.artifacts.length !== 3) throw new Error("The design example must include ARK, DYN and GHX artifacts");
console.log(JSON.stringify({ status: "PASS", totalExamples: manifest.examples.length, geometryPackages: manifest.examples.filter((example) => example.artifacts.length > 0).length, contractVersion: manifest.contractVersion }, null, 2));
