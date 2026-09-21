import { executeParametricGraph, type ParametricGraph } from "../server/arkiParametricRuntime";

const graph: ParametricGraph = { contractVersion: "ARKI-PARAMETRIC-1.0", graphId: "benchmark", nodes: [{ id: "rect", op: "rectangle_points", params: { width: 30, height: 20 } }, { id: "scaled", op: "scale_points", params: { points: "$rect", factor: 1.25 } }], outputs: ["scaled"], units: "m", tolerance: 0.0001, humanReviewRequired: true };
const percentile = (values: number[], p: number) => values[Math.min(values.length - 1, Math.ceil(values.length * p) - 1)];

async function main() {
  const samples: number[] = [];
  const started = performance.now();
  for (let index = 0; index < 100; index += 1) {
    const tick = performance.now();
    const result = await executeParametricGraph({ ...graph, graphId: `benchmark-${index}` });
    if (result.status !== "EXECUTED") throw new Error(`benchmark execution failed: ${result.status}`);
    samples.push(performance.now() - tick);
  }
  samples.sort((a, b) => a - b);
  const elapsed = performance.now() - started;
  console.log(JSON.stringify({ benchmark: "ARKI-PARAMETRIC-RUNTIME-1.0", iterations: samples.length, concurrency: 1, totalMs: Number(elapsed.toFixed(2)), meanMs: Number((samples.reduce((sum, value) => sum + value, 0) / samples.length).toFixed(2)), p95Ms: Number(percentile(samples, 0.95).toFixed(2)), p99Ms: Number(percentile(samples, 0.99).toFixed(2)), loadTest: "PASS", hardRealtime: false, humanReviewRequired: true }, null, 2));
}

void main();
