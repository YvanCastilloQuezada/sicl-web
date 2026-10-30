#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import process from "node:process";
import { createHash } from "node:crypto";

const CORE_URL = process.env.SICL_CORE_URL?.trim().replace(/\/$/, "");
const TOKEN = process.env.SICL_CORE_SERVICE_TOKEN?.trim();
const PROJECT_IDS = (process.env.ARKI_MEMORY_PROJECT_IDS ?? "").split(",").map((value) => value.trim()).filter(Boolean);

function safeText(value, limit = 240) {
  return String(value ?? "").replace(/[\r\n\t]/g, " ").replace(/\s+/g, " ").slice(0, limit);
}

function awaitHash(value) {
  return createHash("sha256").update(String(value)).digest("hex").slice(0, 16);
}

function summarizePayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return "Sin resumen de payload";
  const candidate = payload.summary ?? payload.decision ?? payload.title ?? payload.description;
  return candidate ? safeText(candidate) : "Evento registrado; detalle conservado en Core";
}

export function buildProjection(projectId, checkpoint, events, generatedAt = new Date().toISOString()) {
  const rows = events.map(({ sequence, event, sha256 }) => ({
    sequence,
    event_id: event.event_id,
    event_type: event.event_type,
    workstream_id: event.workstream_id,
    occurred_at: event.occurred_at,
    recorded_at: event.recorded_at,
    actor_ref: event.actor ? "sha256:" + (awaitHash(event.actor)) : null,
    authority_ref: event.authority_ref ?? null,
    source_sha: event.source_sha ?? null,
    evidence_refs: Array.isArray(event.evidence_refs) ? event.evidence_refs.slice(0, 20) : [],
    summary: summarizePayload(event.payload),
    sha256,
  }));
  const lines = [
    "# ARKI — MEMORY CORE PROJECTION",
    "",
    "> Proyección regenerable desde SICL Core. No es fuente canónica, no captura transcripciones y no autoriza decisiones.",
    "",
    "- Proyecto: " + safeText(projectId, 128),
    "- Generado: " + generatedAt,
    "- Versión de proyecto: " + (checkpoint.project_version ?? "UNKNOWN"),
    "- Último evento Core: " + (checkpoint.last_event_id ?? 0),
    "- Eventos recuperados: " + rows.length,
    "",
    "## Historial",
    "",
    "| Secuencia | Fecha | Tipo | Workstream | Resumen | SHA-256 |",
    "|---:|---|---|---|---|---|",
  ];
  for (const row of rows) {
    lines.push("| " + row.sequence + " | " + safeText(row.occurred_at, 32) + " | " + safeText(row.event_type, 60) + " | " + safeText(row.workstream_id, 60) + " | " + row.summary.replaceAll("|", "\\|") + " | " + safeText(row.sha256, 64) + " |");
  }
  lines.push("", "## Límites epistemológicos", "", "- Core es la autoridad de eventos; este archivo es una proyección.", "- Una propuesta no se convierte en decisión por aparecer en el historial.", "- No se infiere ejecución, CI verde ni validación profesional desde un evento declarado.", "- La recuperación incremental debe continuar desde last_event_id.", "");
  return { project_id: projectId, generated_at: generatedAt, checkpoint, events: rows, markdown: lines.join("\n") };
}

async function requestCore(url) {
  const response = await fetch(CORE_URL + url, {
    headers: { accept: "application/json", authorization: "Bearer " + TOKEN },
    signal: AbortSignal.timeout(20_000),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error("CORE_HTTP_" + response.status + ":" + (body?.detail?.code ?? body?.code ?? "UNKNOWN"));
  return body;
}

export async function collectProject(projectId) {
  const checkpoint = await requestCore("/v1/projects/" + encodeURIComponent(projectId) + "/continuity/checkpoint");
  const events = [];
  let cursor = 0;
  let hasMore = true;
  while (hasMore) {
    const page = await requestCore("/v1/projects/" + encodeURIComponent(projectId) + "/continuity/events?after_id=" + cursor + "&limit=500");
    events.push(...(page.events ?? []));
    cursor = page.next_after_id ?? cursor;
    hasMore = Boolean(page.has_more);
    if (hasMore && events.length > 100_000) throw new Error("CONTINUITY_PROJECTION_LIMIT_EXCEEDED");
  }
  return buildProjection(projectId, checkpoint, events);
}

async function main() {
  if (!CORE_URL || !TOKEN || PROJECT_IDS.length === 0) {
    throw new Error("SICL_CORE_URL, SICL_CORE_SERVICE_TOKEN and ARKI_MEMORY_PROJECT_IDS are required");
  }
  const outputDir = process.env.ARKI_MEMORY_OUTPUT_DIR ?? "artifacts/arki-memory";
  await fs.mkdir(outputDir, { recursive: true });
  const manifest = { generated_at: new Date().toISOString(), source: "SICL_CORE", projects: [] };
  for (const projectId of PROJECT_IDS) {
    const projection = await collectProject(projectId);
    const fileBase = projectId.replace(/[^a-zA-Z0-9._-]/g, "_");
    await fs.writeFile(path.join(outputDir, fileBase + ".json"), JSON.stringify(projection, null, 2) + "\n", { mode: 0o600 });
    await fs.writeFile(path.join(outputDir, fileBase + ".md"), projection.markdown, { mode: 0o600 });
    manifest.projects.push({ project_id: projectId, last_event_id: projection.checkpoint.last_event_id, event_count: projection.events.length });
  }
  await fs.writeFile(path.join(outputDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n", { mode: 0o600 });
  console.log("ARKI MEMORY projection generated for " + manifest.projects.length + " project(s)");
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => { console.error(error instanceof Error ? error.message : "PROJECTION_FAILED"); process.exitCode = 1; });
}
