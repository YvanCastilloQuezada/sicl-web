import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const catalogPath = path.join(root, "client/src/content/commands-catalog.json");
const outDir = path.join(root, "client/src/content/parametric-examples");
const examplesDir = path.join(outDir, "examples");
const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));

const concrete = {
  project_id: "EXAMPLE-ARCH-001",
  source_project_id: "EXAMPLE-ARCH-001",
  name: "Casa Demo Paramétrica",
  spatial_scope: "PROJECT",
  temporal_scope: "2026",
  objective_id: "OBJ-FUNCTIONALITY",
  "DRAFT|ACTIVE|CLOSED": "DRAFT",
  key: "functional_area",
  "MAXIMIZE|MINIMIZE": "MAXIMIZE",
  value: "daylight_and_functionality",
  operator: ">=",
  unit: "m",
  actor: "human-reviewer",
  role: "ARCHITECT",
  id: "ACTOR-001",
  authority: "PROJECT_OWNER",
  "interests_json constraints_json": "{\"interests\":[\"functionality\"],\"constraints\":[\"human_review\"]}",
  actor_id: "ACTOR-001",
  subject_type: "ALTERNATIVE",
  subject_id: "ALT-001",
  stance: "SUPPORT",
  statement: "La alternativa conserva circulación clara",
  cycle_id: "CYCLE-2026",
  horizon: "2026-2030",
  start_date: "2026-01-01",
  end_date: "2026-12-31",
  branch_id: "SCENARIO-BASE",
  source: "OWNER_BRIEF",
  review: "Revisar antes de aplicar",
  reason: "Ejemplo educativo y trazable",
  authority: "HUMAN_AUTHORITY",
  evidence_id: "EVID-001",
  type: "DOCUMENT",
  source_id: "SOURCE-001",
  url: "https://example.invalid/evidence-001",
  location: "Trujillo, Peru",
  agent_type: "PARTI",
  alternative_id: "ALT-001",
  method: "PARAMETRIC_MASSING",
  parameters_json: "{\"width\":24,\"depth\":16,\"height\":3.2,\"floors\":2,\"kind\":\"RECTANGULAR_MASS\"}",
  generation_id: "GEN-001",
  memory_id: "MEM-001",
  criterion_id: "CRITERION-DAYLIGHT",
  direction: "MAXIMIZE",
  scale: "BUILDING",
  scale_id: "BUILDING",
  plan_id: "PLAN-001",
  requirement_id: "REQ-001",
  regulation_id: "RNE-PERU",
  topic: "daylight",
  snapshot_id: "SNAP-001",
  decision_id: "DEC-001",
  event_id: "EVENT-001",
  state: "DRAFT",
};

function valueFor(argument) {
  const key = argument.name;
  if (concrete[key] !== undefined) return concrete[key];
  const lower = key.toLowerCase();
  if (lower.includes("json")) return "{}";
  if (lower.includes("id")) return `${key.replace(/[^a-z0-9]+/gi, "-").toUpperCase()}-001`;
  if (lower.includes("date")) return "2026-01-01";
  if (lower.includes("url")) return "https://example.invalid/reference";
  if (lower.includes("name")) return "Ejemplo ARKI";
  if (lower.includes("type")) return "ARCHITECTURAL";
  if (lower.includes("status") || lower.includes("state")) return "DRAFT";
  if (lower.includes("scale")) return "BUILDING";
  if (lower.includes("value")) return "1";
  return argument.required ? `example_${key.replace(/[^a-z0-9]+/gi, "_").toLowerCase()}` : undefined;
}

function commandText(command) {
  const args = command.arguments.map(valueFor).filter((value) => value !== undefined);
  return [command.name, ...args].join(" ");
}

function modeFor(command) {
  if (["human", "decision", "alternative", "exit"].includes(command.category)) return "DECIDE";
  if (["project", "site", "generate", "interpret", "memory", "status", "history"].includes(command.category)) return "EXPLORE";
  return "APPLY";
}

function expectedFor(command) {
  if (["human", "decision", "alternative"].includes(command.category)) return "Human review required; this example must not execute automatically.";
  if (["agent", "debate", "regulation", "planning", "snapshot"].includes(command.category)) return "Requires an authorized SICL/Core or external evidence context.";
  if (["generate"].includes(command.category)) return "Produces or describes a bounded proposal; native host execution is not claimed.";
  return "Creates a repeatable command-shaped example for learning and traceability.";
}

fs.rmSync(examplesDir, { recursive: true, force: true });
fs.mkdirSync(examplesDir, { recursive: true });

const examples = catalog.map((command, index) => {
  const number = String(index + 1).padStart(3, "0");
  const slug = command.name.replace(/^\//, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const exampleId = `EJEMPLO-${number}`;
  const directory = path.join(examplesDir, `${exampleId}-${slug}`);
  fs.mkdirSync(directory, { recursive: true });
  const payload = {
    exampleId,
    title: `Ejemplo ${number} · ${command.name}`,
    commandName: command.name,
    category: command.category,
    syntax: command.syntax,
    command: commandText(command),
    arguments: command.arguments.map((argument) => ({ ...argument, exampleValue: valueFor(argument) ?? null })),
    mode: modeFor(command),
    repeatability: "DETERMINISTIC_INPUT_EXAMPLE",
    executionBoundary: "CATALOG_EXAMPLE_ONLY",
    humanReviewRequired: true,
    expectedOutcome: expectedFor(command),
    learningObjective: `Aprender la sintaxis y el límite operativo de ${command.name}.`,
    provenance: ["commands-catalog.json", "ARKI-PARAMETRIC-RUNTIME", "user-authorized-example-corpus"],
    unknowns: ["Los efectos reales dependen del Project State, evidencia disponible y permisos del entorno."],
    artifacts: [],
  };
  if (command.name === "/GENERATE DESIGN") {
    const base = {
      projectId: "EXAMPLE-ARCH-001",
      name: `${exampleId}-parametric-mass` ,
      geometry: { kind: "RECTANGULAR_MASS", width: 24, depth: 16, height: 3.2, floors: 2, courtyardRatio: 0 },
      graph: { contractVersion: "ARKI-PARAMETRIC-1.0", graphId: `${exampleId}-mass`, nodes: [{ id: "width", op: "constant", params: { value: 24 } }, { id: "depth", op: "constant", params: { value: 16 } }, { id: "height", op: "constant", params: { value: 6.4 } }, { id: "mass", op: "rectangle_points", params: { width: 24, height: 16 } }], outputs: ["mass"], units: "m", tolerance: 0.001, humanReviewRequired: true },
    };
    fs.writeFileSync(path.join(directory, `${exampleId}.ark`), JSON.stringify({ formatVersion: "ARKI-ARK-1.0", ...base, humanReviewRequired: true, provenance: ["parametric-example-corpus"] }, null, 2) + "\n");
    fs.writeFileSync(path.join(directory, `${exampleId}.dyn`), JSON.stringify({ Version: "3.0.0", RunType: "Manual", Nodes: base.graph.nodes, Notes: ["Example only; execute in an approved Dynamo/Revit host."] }, null, 2) + "\n");
    fs.writeFileSync(path.join(directory, `${exampleId}.ghx`), `<?xml version="1.0" encoding="utf-8"?><Archive name="ARKI Example" major_version="1" minor_version="0"><items><item name="contractVersion">ARKI-PARAMETRIC-1.0</item><item name="humanReviewRequired">true</item><item name="projectId">EXAMPLE-ARCH-001</item></items></Archive>\n`);
    payload.artifacts = [`${exampleId}.ark`, `${exampleId}.dyn`, `${exampleId}.ghx`];
  }
  fs.writeFileSync(path.join(directory, "example.json"), JSON.stringify(payload, null, 2) + "\n");
  fs.writeFileSync(path.join(directory, "README.md"), `# ${payload.title}\n\n**Comando:** \`${payload.command}\`\n\n**Modo:** ${payload.mode}\n\n${payload.expectedOutcome}\n\nEste archivo es un ejemplo repetible y trazable; no afirma ejecución contra un Core remoto, Dynamo/Revit, Rhino/Grasshopper ni autoridad humana.\n`);
  return { ...payload, path: `examples/${exampleId}-${slug}/example.json` };
});

const manifest = {
  contractVersion: "ARKI-PARAMETRIC-EXAMPLE-CORPUS-1.0",
  generatedAt: "2026-09-21T00:00:00.000Z",
  sourceCatalog: "client/src/content/commands-catalog.json",
  totalCommands: examples.length,
  purpose: "Corpus didáctico y repetible para aprender comandos sin confundir ejemplos con ejecuciones reales.",
  rules: ["REUSE_BEFORE_EXTEND", "HUMAN_AUTHORITY_FINAL", "UNKNOWN_PRESERVED", "NO_NATIVE_HOST_CLAIM"],
  examples,
};
fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
fs.writeFileSync(path.join(outDir, "README.md"), [
  "# ARKI Parametric Example Corpus",
  "",
  `Este corpus contiene **${examples.length} ejemplos**, uno por comando del catálogo canónico. Cada ejemplo incluye sintaxis, valores concretos, modo operativo, límite de ejecución, objetivo didáctico, provenance y UNKNOWNs.`,
  "",
  "Los ejemplos se pueden repetir localmente como material de aprendizaje. No ejecutan automáticamente decisiones, Core remoto, hosts Dynamo/Revit, Rhino/Grasshopper ni acciones de autoridad humana.",
  "El ejemplo `/GENERATE DESIGN` incluye además un paquete `.ark`, `.dyn` y `.ghx` de intercambio; los binarios nativos profesionales requieren host autorizado.",
  "",
].join("\\n"));
console.log(JSON.stringify({ total: examples.length, outDir, geometryPackages: examples.filter((item) => item.artifacts.length).length }, null, 2));
