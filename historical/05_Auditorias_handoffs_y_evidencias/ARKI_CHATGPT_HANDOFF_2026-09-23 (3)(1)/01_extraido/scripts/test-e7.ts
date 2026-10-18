import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";
import { calculateBudget5D } from "../shared/arki5d";
import { calculateSchedule4D } from "../shared/arki4d";
import { detectClashes } from "../shared/coordination";
import { validateStructuralModel } from "../shared/structural";
import { validateMepModel } from "../shared/mep";
import { buildImpacts } from "../shared/arkiImpacts";

const cost = JSON.parse(await readFile(new URL("../fixtures/e7/fixture_cost_schedule_project.json", import.meta.url), "utf8"));
const structural = JSON.parse(await readFile(new URL("../fixtures/e7/fixture_structural_small_frame.json", import.meta.url), "utf8"));
const mep = JSON.parse(await readFile(new URL("../fixtures/e7/fixture_mep_hospital_subset.json", import.meta.url), "utf8"));
const budget = calculateBudget5D(cost.priceBook, cost.quantities);
const schedule = calculateSchedule4D(cost.activities);
const clashes = detectClashes([{ id: "wall-01", discipline: "architecture", position: [0, 0, 0], dimensions: [4, 0.2, 3] }, { id: "pipe-01", discipline: "sanitary", position: [0, 0, 0], dimensions: [1, 0.1, 1] }, { id: "pipe-02", discipline: "sanitary", position: [10, 10, 10], dimensions: [1, 1, 1] }]);
const structuralResult = validateStructuralModel(structural);
const mepResult = validateMepModel(mep);
const impacts = buildImpacts("wall-01", [{ id: "budget-01", domain: "cost", reason: "area changed" }, { id: "A1", domain: "schedule", reason: "quantity changed" }]);

const checks: Array<[string, boolean]> = [
  ["fixture cost loaded", cost.priceBook.length === 2], ["price book currency", cost.priceBook.every((item: { currency: string }) => item.currency === "PEN")], ["quantity positive", cost.quantities.every((item: { quantity: number }) => item.quantity > 0)], ["cost line count", budget.lines.length === 2], ["cost reconciliation", budget.directCost === 4650], ["cost total deterministic", budget.lines[0].total === 3700], ["activity count", schedule.activities.length === 2], ["schedule duration", schedule.durationDays === 7], ["critical path", schedule.criticalPath.join(",") === "A1,A2"], ["fixture structural loaded", structural.nodes.length === 2], ["structural member reference", structural.members[0].startNodeId === "N1"], ["structural stub honest", structuralResult.status === "NOT_DEMONSTRATED"], ["structural warning", structuralResult.warnings.length > 0], ["fixture MEP loaded", mep.nodes.length === 4], ["MEP disciplines", new Set(mep.nodes.map((node: { discipline: string }) => node.discipline)).size === 3], ["MEP connector validation", mepResult.missingConnections.length === 0], ["MEP limitation warning", mepResult.warnings.length > 0], ["clash detected", clashes.length === 1], ["clash discipline", clashes[0].disciplines.includes("sanitary")], ["clash open", clashes[0].status === "open"], ["impact count", impacts.length === 2], ["impact review gate", impacts.every((impact) => impact.requiresHumanReview)], ["all domains represented", new Set(impacts.map((impact) => impact.domain)).size === 2],
];
for (const [name, result] of checks) assert.equal(result, true, name);
console.log(JSON.stringify({ status: "PASS", checks: checks.length, budget: budget.directCost, scheduleDays: schedule.durationDays, clashes: clashes.length, structural: structuralResult.status, mep: mepResult.status, impacts: impacts.length }));
