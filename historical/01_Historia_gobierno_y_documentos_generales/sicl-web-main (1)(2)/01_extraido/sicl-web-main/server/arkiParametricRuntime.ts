import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { hostWorkerCatalog } from "./parametricHostWorkers";
import { parseArkProposal } from "./arkiParametricExchange";

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
export type ParametricFormat = "DYN" | "DYF" | "GH" | "GHX" | "BLEND" | "ARKI_GRAPH" | "ARK";
export type ParametricCapability = "INSPECT" | "VALIDATE" | "EXECUTE" | "EXPORT";
export type ParametricNode = { id: string; op: "constant" | "add" | "multiply" | "rectangle_points" | "translate_points" | "scale_points"; params: Record<string, Json> };
export type ParametricGraph = { contractVersion: "ARKI-PARAMETRIC-1.0"; graphId: string; nodes: ParametricNode[]; outputs: string[]; units: string; tolerance: number; humanReviewRequired: true };
export type ParametricManifest = { artifactId: string; fileName: string; format: ParametricFormat | "UNKNOWN"; sizeBytes: number; checksum: string; parsed: boolean; declaredDependencies: string[]; capabilities: ParametricCapability[]; hostRequired: string | null; status: "INSPECTED" | "OPAQUE_HOST_REQUIRED" | "REJECTED" };

const formatFor = (fileName: string): ParametricFormat | "UNKNOWN" => {
  const extension = fileName.toLowerCase().split(".").pop();
  return extension === "dyn" ? "DYN" : extension === "dyf" ? "DYF" : extension === "gh" ? "GH" : extension === "ghx" ? "GHX" : extension === "blend" ? "BLEND" : extension === "ark" ? "ARK" : extension === "json" ? "ARKI_GRAPH" : "UNKNOWN";
};

function checksum(content: string | Buffer) { return `sha256:${createHash("sha256").update(content).digest("hex")}`; }

export function inspectParametricArtifact(input: { fileName: string; content: string | Buffer }): ParametricManifest {
  const format = formatFor(input.fileName);
  const raw = typeof input.content === "string" ? input.content : input.content.toString("utf8");
  const declaredDependencies: string[] = [];
  let parsed = false;
  if (format === "ARK") {
    const proposal = parseArkProposal(raw);
    if ("formatVersion" in proposal) { parsed = true; declaredDependencies.push(...proposal.source.provenance); }
  } else if (format === "DYN" || format === "DYF" || format === "ARKI_GRAPH") {
    try {
      const parsedJson = JSON.parse(raw) as Record<string, unknown>;
      parsed = true;
      const candidates = [parsedJson.dependencies, parsedJson.packages, parsedJson.customNodes];
      for (const candidate of candidates) if (Array.isArray(candidate)) for (const value of candidate) if (typeof value === "string") declaredDependencies.push(value);
    } catch { parsed = false; }
  } else if (format === "GHX") {
    parsed = raw.includes("<Archive") || raw.includes("<Grasshopper");
    const matches = raw.match(/(?:plugin|assembly|component)[^>]*>([^<]+)/gi) ?? [];
    declaredDependencies.push(...matches.slice(0, 50));
  }
  const opaque = format === "GH" || format === "BLEND";
  return {
    artifactId: `${format}-${checksum(input.content).slice(7, 23)}`,
    fileName: input.fileName,
    format,
    sizeBytes: Buffer.byteLength(input.content),
    checksum: checksum(input.content),
    parsed,
    declaredDependencies: Array.from(new Set(declaredDependencies)),
    capabilities: ["INSPECT", "VALIDATE"],
    hostRequired: format === "DYN" || format === "DYF" ? "Dynamo/Revit host for execution" : format === "GH" || format === "GHX" ? "Rhino/Grasshopper or Rhino.Compute for execution" : format === "BLEND" ? "Blender executable for execution" : null,
    status: format === "UNKNOWN" ? "REJECTED" : opaque ? "OPAQUE_HOST_REQUIRED" : "INSPECTED",
  };
}

function runWorker(request: ParametricGraph): Promise<Record<string, unknown>> {
  const python = process.env.ARKI_OSS_PYTHON ?? "python3";
  const worker = resolve(process.cwd(), "tools/arki_parametric_worker.py");
  return new Promise((resolvePromise) => {
    const child = spawn(python, [worker], { stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => { child.kill("SIGKILL"); resolvePromise({ status: "TIMEOUT", error: "parametric worker exceeded 120000ms" }); }, 120_000);
    child.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
    child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
    child.on("error", (error) => { clearTimeout(timer); resolvePromise({ status: "WORKER_FAILED", error: error.message }); });
    child.on("close", (code) => {
      clearTimeout(timer);
      try { resolvePromise({ ...(JSON.parse(stdout) as Record<string, unknown>), exitCode: code, stderr: stderr.trim() }); }
      catch { resolvePromise({ status: "WORKER_FAILED", error: stderr || "worker returned invalid JSON", exitCode: code }); }
    });
    child.stdin.end(JSON.stringify(request));
  });
}

export async function executeParametricGraph(request: ParametricGraph) {
  if (request.humanReviewRequired !== true) return { status: "REJECTED" as const, error: "humanReviewRequired must remain true" };
  if (request.tolerance <= 0 || request.tolerance > 1) return { status: "REJECTED" as const, error: "tolerance must be > 0 and <= 1" };
  if (request.nodes.length === 0 || request.nodes.length > 500) return { status: "REJECTED" as const, error: "nodes must contain 1..500 entries" };
  return runWorker(request);
}

export function parametricRuntimeCatalog() {
  return {
    version: "ARKI-PARAMETRIC-RUNTIME-1.0",
    architecture: "OWN_CONTROL_PLANE_WITH_OPTIONAL_HOST_ADAPTERS",
    deterministicKernel: "CPYTHON_BOUNDED_GRAPH",
    softRealtime: true,
    hardRealtime: false,
    capabilities: ["INSPECT", "VALIDATE", "EXECUTE", "EXPORT"] as ParametricCapability[],
    formats: ["DYN", "DYF", "GH", "GHX", "BLEND", "ARKI_GRAPH", "ARK"] as ParametricFormat[],
    humanReviewRequired: true,
    hosts: { dynamo: "EXTERNAL_HOST_REQUIRED", grasshopper: "EXTERNAL_HOST_REQUIRED", blender: "EXTERNAL_HOST_REQUIRED" },
    authorizedWorkers: hostWorkerCatalog(),
    transport: { ui: "WEBSOCKET_OPTIONAL", durableBus: "NATS_OR_REDIS_EXTERNAL_GATE" },
  };
}
