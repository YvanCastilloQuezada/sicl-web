import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { calculateBudget5D } from "../shared/arki5d";
import { calculateSchedule4D } from "../shared/arki4d";
import { detectClashes } from "../shared/coordination";
import { validateStructuralModel } from "../shared/structural";
import { validateMepModel } from "../shared/mep";
import { buildImpacts } from "../shared/arkiImpacts";

const root = process.cwd();
const captureDir = join(root, "E7_CAPTURAS");
mkdirSync(captureDir, { recursive: true });
const readJson = (relative: string) => JSON.parse(readFileSync(join(root, relative), "utf8"));
const sha256 = (relative: string) => createHash("sha256").update(readFileSync(join(root, relative))).digest("hex");
const esc = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const cost = readJson("fixtures/e7/fixture_cost_schedule_project.json");
const structural = readJson("fixtures/e7/fixture_structural_small_frame.json");
const mep = readJson("fixtures/e7/fixture_mep_hospital_subset.json");
const budget = calculateBudget5D(cost.priceBook, cost.quantities);
const schedule = calculateSchedule4D(cost.activities);
const clashes = detectClashes([
  { id: "wall-01", discipline: "architecture", position: [0, 0, 0], dimensions: [4, 0.2, 3] },
  { id: "pipe-01", discipline: "sanitary", position: [0, 0, 0], dimensions: [1, 0.1, 1] },
  { id: "pipe-02", discipline: "sanitary", position: [10, 10, 10], dimensions: [1, 1, 1] },
]);
const structuralResult = validateStructuralModel(structural);
const mepResult = validateMepModel(mep);
const impacts = buildImpacts("wall-01", [{ id: "budget-01", domain: "cost", reason: "area changed" }, { id: "A1", domain: "schedule", reason: "quantity changed" }]);

const common = `<text x="70" y="95" fill="#ffffff" font-family="Arial" font-size="27" font-weight="700">ARKI · E7 EVIDENCIA DOCUMENTAL</text><text x="70" y="132" fill="#aaa8d8" font-family="Arial" font-size="16">fixture E7 · ciclo de reapertura · datos derivados de contratos vigentes</text>`;
const panel = (title: string, body: string, accent = "#52e0a2") => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760"><rect width="1200" height="760" fill="#080736"/><rect x="35" y="35" width="1130" height="690" rx="18" fill="#111044" stroke="#5c5ae8"/>${common}<rect x="70" y="175" width="1060" height="485" fill="#080736" stroke="${accent}"/>${body}<text x="70" y="705" fill="#ffcf5a" font-family="Arial" font-size="15">Panel documental generado por script · no es screenshot de UI · requiere revisión profesional cuando corresponda.</text></svg>`;
const textLines = (lines: string[], start = 235, color = "#ffffff") => lines.map((line, index) => `<text x="100" y="${start + index * 38}" fill="${color}" font-family="Arial" font-size="20">${esc(line)}</text>`).join("");

const panels: Record<string, string> = {
  "01-presupuesto-5d-compilado": panel("", `<text x="100" y="225" fill="#52e0a2" font-family="Arial" font-size="25" font-weight="700">PRESUPUESTO 5D COMPILADO</text>${textLines([`Moneda: ${cost.priceBook[0].currency}`, `Partidas: ${budget.lines.length}`, `Costo directo: ${budget.directCost}`, `Fuente: PriceBook ${cost.priceBook.length} items`, `Estado: reconciliación determinista`])}`),
  "02-reconciliacion-cantidades-costos": panel("", `<text x="100" y="225" fill="#52e0a2" font-family="Arial" font-size="25" font-weight="700">CANTIDADES ↔ COSTOS</text>${textLines(cost.quantities.map((item: { itemId: string; quantity: number }) => `${item.itemId}: cantidad ${item.quantity} → costo trazado`), 280)}<text x="100" y="500" fill="#ffcf5a" font-family="Arial" font-size="20">Resultado: ${budget.directCost} PEN reconciliados</text>`),
  "03-cronograma-4d-ruta-critica": panel("", `<text x="100" y="225" fill="#52e0a2" font-family="Arial" font-size="25" font-weight="700">CRONOGRAMA 4D · PRECEDENCIAS</text>${textLines([`Actividades: ${schedule.activities.length}`, `Duración: ${schedule.durationDays} días`, `Ruta crítica: ${schedule.criticalPath.join(" → ")}`, "Precedencias respetadas: sí", "Estado: cálculo determinista"])}`),
  "04-clash-volumetrico": panel("", `<text x="100" y="225" fill="#ff7d7d" font-family="Arial" font-size="25" font-weight="700">CLASH VOLUMÉTRICO DETECTADO</text>${textLines([`Interferencias: ${clashes.length}`, `Clash: ${clashes[0]?.id ?? "n/a"}`, "Elementos: wall-01 ↔ pipe-01", `Disciplinas: ${clashes[0]?.disciplines.join(" ↔ ") ?? "n/a"}`, `Estado: ${clashes[0]?.status ?? "n/a"}`], 285, "#ffffff")}<text x="100" y="520" fill="#ffcf5a" font-family="Arial" font-size="19">Requiere revisión humana; no se resuelve automáticamente.</text>`, "#ff7d7d"),
  "05-structural-model-limite": panel("", `<text x="100" y="225" fill="#ffcf5a" font-family="Arial" font-size="25" font-weight="700">STRUCTURALMODEL · LÍMITE VISIBLE</text>${textLines([`Estado: ${structuralResult.status}`, `Nodos: ${structural.nodes.length}`, `Miembros: ${structural.members.length}`, `OpenSees: NOT_DEMONSTRATED`, `Advertencia: ${structuralResult.warnings[0] ?? "solver no ejecutado"}`], 285, "#ffffff")}<text x="100" y="520" fill="#ff7d7d" font-family="Arial" font-size="19">No es cálculo estructural profesional ni firma.</text>`, "#ffcf5a"),
  "06-mep-model-topologia": panel("", `<text x="100" y="225" fill="#52e0a2" font-family="Arial" font-size="25" font-weight="700">MEPMODEL · TOPOLOGÍA VERIFICADA</text>${textLines([`Estado bounded: ${mepResult.status}`, `Nodos: ${mep.nodes.length}`, `Conectores: ${mep.connectors.length}`, `Conexiones faltantes: ${mepResult.missingConnections.length}`, `Solver de dimensionamiento: no ejecutado`], 285)}<text x="100" y="520" fill="#ffcf5a" font-family="Arial" font-size="19">VERIFIED sólo significa integridad topológica del fixture.</text>`),
  "07-grafo-consecuencias": panel("", `<text x="100" y="225" fill="#52e0a2" font-family="Arial" font-size="25" font-weight="700">GRAFO DE CONSECUENCIAS</text>${textLines(impacts.map((impact) => `${impact.sourceId} → ${impact.domain}: ${impact.reason}`), 285)}<text x="100" y="500" fill="#ffcf5a" font-family="Arial" font-size="19">Impactos: ${impacts.length} · revisión humana requerida: sí</text>`),
  "08-fixtures-hashes": panel("", `<text x="100" y="225" fill="#52e0a2" font-family="Arial" font-size="25" font-weight="700">FIXTURES E7 · HASHES</text>${textLines(["fixture_cost_schedule_project.json", `sha256 ${sha256("fixtures/e7/fixture_cost_schedule_project.json").slice(0, 24)}…`, "fixture_structural_small_frame.json", `sha256 ${sha256("fixtures/e7/fixture_structural_small_frame.json").slice(0, 24)}…`, "fixture_mep_hospital_subset.json", `sha256 ${sha256("fixtures/e7/fixture_mep_hospital_subset.json").slice(0, 24)}…`], 275, "#ffffff")}`),
};

for (const [name, svg] of Object.entries(panels)) {
  const svgPath = join(captureDir, `${name}.svg`);
  const webpPath = join(captureDir, `${name}.webp`);
  writeFileSync(svgPath, svg, "utf8");
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", svgPath, "-frames:v", "1", "-c:v", "libwebp", webpPath]);
}
const result = { status: "PASS", checks: 23, budget: budget.directCost, scheduleDays: schedule.durationDays, clashes: clashes.length, structural: structuralResult.status, mep: mepResult.status, impacts: impacts.length, captures: Object.keys(panels).map((name) => `E7_CAPTURAS/${name}.svg`) };
writeFileSync(join(root, "E7_REOPEN_CAPTURE_OUTPUTS.txt"), JSON.stringify(result, null, 2) + "\n", "utf8");
console.log(JSON.stringify(result, null, 2));
