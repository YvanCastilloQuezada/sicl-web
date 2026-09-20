import { mkdirSync, writeFileSync } from "node:fs";
import {
  p94Markdown,
  runP94EvidenceLearningExperiment,
  validateP94Experiment,
} from "../client/src/components/arkiP94EvidenceLearningExperiment";

const result = runP94EvidenceLearningExperiment();
if (!validateP94Experiment(result)) throw new Error("P9.4 validation failed");
mkdirSync("docs/arki-p94", { recursive: true });
writeFileSync(
  "docs/arki-p94/ARKI-P94-EVIDENCE-TO-LEARNING-EXPERIMENT-2026-09-20.md",
  p94Markdown(result)
);
writeFileSync(
  "docs/arki-p94/ARKI-P94-EVIDENCE-TO-LEARNING-EXPERIMENT-2026-09-20.json",
  JSON.stringify(result, null, 2) + "\n"
);
console.log(
  JSON.stringify({
    status: "PASS_WITH_OBSERVATIONS",
    report:
      "docs/arki-p94/ARKI-P94-EVIDENCE-TO-LEARNING-EXPERIMENT-2026-09-20.md",
    json: "docs/arki-p94/ARKI-P94-EVIDENCE-TO-LEARNING-EXPERIMENT-2026-09-20.json",
  })
);
