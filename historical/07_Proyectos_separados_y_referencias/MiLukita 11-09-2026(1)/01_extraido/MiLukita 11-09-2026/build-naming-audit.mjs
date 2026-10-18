import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = "/home/ubuntu/ruleta-peru-online";
const output = path.join(root, "docs", "MILUKITA_NAMING_MIGRATION_AUDIT.md");
const ignored = new Set([".git", "node_modules", "dist", ".manus-logs", "coverage"]);
const termPattern = /(MiLukita|LUKA|LUKITA|Lukallpa|Luka OS|LukaOS|Mi Lukita)/gi;
const canonical = {
  MiLukita: "marca/ecosistema matriz",
  "El Mundo de MiLukita": "universo/experiencia pública",
  LUKA: "personaje/presencia inteligente/agente",
  "LUKA OS": "sistema de orquestación e interacción",
  "LUKA AR": "experiencia de realidad aumentada",
  "LUKA TV": "experiencia de televisión",
  Lukallpa: "referencia histórica o término heredado; no marca activa",
  LUKITA: "término histórico/ambiguo: requiere revisión contextual",
};

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(ts|tsx|md|json|css|html|mjs|cjs|sql|txt)$/i.test(entry.name)) files.push(full);
  }
  return files;
}
function classify(file, line) {
  const rel = path.relative(root, file).replaceAll(path.sep, "/");
  if (rel.startsWith("docs/")) return /histor|legacy|snapshot|audit|validation|report|informe/i.test(rel + line) ? "documentación histórica/auditoría" : "documentación activa";
  if (rel.startsWith("client/")) return "UI/código activo";
  if (rel.startsWith("shared/")) return /test/i.test(rel) ? "test de contrato" : "contrato/código activo";
  if (rel.startsWith("server/")) return "backend/código activo";
  if (rel.startsWith("scripts/")) return "script operativo";
  return "configuración/metadata/asset";
}
function action(term, classification, line) {
  const normalized = term.toLowerCase();
  if (normalized === "lukallpa" && /client\//i.test(classification)) return ["revisar y reemplazar solo si es marca activa", "evitar eliminar trazabilidad", "medio"];
  if (normalized === "lukita" || normalized === "mi lukita") return ["revisar contexto; no reemplazar automáticamente", "puede ser UI histórica, código o dato persistente", "medio"];
  if (classification.includes("histórica")) return ["conservar", "preservar evidencia y compatibilidad", "bajo"];
  if (classification.includes("UI") && /Bienvenido a LUKA|Hola, soy LUKA|Mundo LUKA/i.test(line)) return ["conservar/alinear con jerarquía congelada", "LUKA debe ser presencia; MiLukita, universo", "bajo"];
  return ["conservar y validar contexto", "el término puede ser técnico, histórico o de producto", "bajo"];
}

const files = walk(root).filter((file) => !file.endsWith("MILUKITA_NAMING_MIGRATION_AUDIT.md"));
const rows = [];
const termCounts = new Map();
const classCounts = new Map();
for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  content.split(/\r?\n/).forEach((line, index) => {
    for (const match of line.matchAll(termPattern)) {
      const term = match[0];
      const classification = classify(file, line);
      const [act, reason, risk] = action(term, classification, line);
      const rel = path.relative(root, file).replaceAll(path.sep, "/");
      rows.push({ rel, line: index + 1, term, classification, act, reason, risk, reference: line.trim().replaceAll("|", "\\|").slice(0, 220) });
      termCounts.set(term, (termCounts.get(term) ?? 0) + 1);
      classCounts.set(classification, (classCounts.get(classification) ?? 0) + 1);
    }
  });
}
rows.sort((a, b) => a.rel.localeCompare(b.rel) || a.line - b.line);
const generatedAt = new Date().toISOString();
let md = `# Auditoría de migración nominal — MiLukita / LUKA\n\n`;
md += `**Código de orden:** MILUKITA-BRAND-FREEZE-001  \n**Fecha de generación:** ${generatedAt}  \n**Propósito:** auditar referencias activas e históricas sin ejecutar un reemplazo global ciego.\n\n`;
md += `## Conclusión ejecutiva\n\nLa nomenclatura canónica queda congelada: **MiLukita** es la marca/ecosistema; **El Mundo de MiLukita** es el universo público; **LUKA** es la presencia inteligente; **LUKA OS** es el sistema técnico; **LUKA AR** es la experiencia aumentada; y **LUKA TV** es la experiencia de televisión. Las apariciones de **Lukallpa/LUKITA** no se eliminan automáticamente: se clasifican para preservar trazabilidad, compatibilidad y evidencia histórica.\n\n`;
md += `## Criterios aplicados\n\n| Término | Función canónica | Regla |\n|---|---|---|\n`;
for (const [term, meaning] of Object.entries(canonical)) md += `| ${term} | ${meaning} | Revisar por contexto; no reemplazo global |\n`;
md += `\n## Resumen cuantitativo\n\n| Métrica | Valor |\n|---|---:|\n| Archivos inspeccionados | ${files.length} |\n| Referencias encontradas | ${rows.length} |\n| Términos distintos | ${termCounts.size} |\n| Archivos con referencias | ${new Set(rows.map((r) => r.rel)).size} |\n\n`;
md += `### Referencias por término\n\n| Término | Apariciones |\n|---|---:|\n`;
for (const [term, count] of [...termCounts.entries()].sort()) md += `| ${term} | ${count} |\n`;
md += `\n### Referencias por clasificación\n\n| Clasificación | Apariciones |\n|---|---:|\n`;
for (const [classification, count] of [...classCounts.entries()].sort()) md += `| ${classification} | ${count} |\n`;
md += `\n## Inventario detallado\n\n| Archivo | Línea | Término | Clasificación | Acción | Razón | Riesgo | Referencia |\n|---|---:|---|---|---|---|---|---|\n`;
for (const row of rows) md += `| ${row.rel} | ${row.line} | ${row.term} | ${row.classification} | ${row.act} | ${row.reason} | ${row.risk} | ${row.reference} |\n`;
md += `\n## Decisiones de migración\n\nNo se ejecutó ` + "`search-and-replace`" + ` global. Las rutas técnicas, contratos, nombres persistentes, snapshots, logs y documentos históricos se conservan salvo que exista una orden específica de migración compatible. La UI activa debe usar la jerarquía congelada y toda referencia ambigua queda registrada para revisión.\n\n`;
md += `## Límites constitucionales\n\nEsta orden no modifica RNG, RTP, ledger, settlement, wallet, reglas de juego, resultados, manifiestos protegidos ni ninguna autoridad de MJP CORE. Tampoco acredita por sí sola protección jurídica de nombres o activos; la evaluación jurídica permanece separada.\n\n`;
md += `## Integridad del expediente\n\nEl hash SHA-256 se calcula sobre este contenido antes de añadir esta línea.\n`;
const hash = crypto.createHash("sha256").update(md).digest("hex");
md += `**SHA-256 del contenido base:** \`${hash}\`\n`;
fs.writeFileSync(output, md);
console.log(JSON.stringify({ output, files: files.length, references: rows.length, hash }, null, 2));
