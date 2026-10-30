import type { Express, Request, Response } from "express";
import { createHash } from "node:crypto";
import { z } from "zod";
import { createContext } from "./_core/context";
import { ENV } from "./_core/env";
import { getSiclProject } from "./db";
import {
  enqueueContinuityEvent,
  getContinuityOutboxEvent,
  getContinuityOutboxStatus,
  listPendingContinuityEvents,
  markContinuitySynced,
  recordContinuitySyncFailure,
} from "./continuityOutbox";
import { proxyCoreRequest } from "./coreHttpClient";

const EVENT_TYPES = [
  "SESSION_OPENED", "SESSION_CLOSED", "DECISION_RECORDED",
  "TASK_STARTED", "TASK_UPDATED", "TASK_BLOCKED", "TASK_COMPLETED",
  "EVIDENCE_ATTACHED", "ROADMAP_CHANGED", "HANDOFF_CREATED",
  "CORRECTION_RECORDED",
] as const;

const eventInput = z.object({
  eventType: z.enum(EVENT_TYPES),
  workstreamId: z.string().trim().min(1).max(160),
  occurredAt: z.string().datetime({ offset: true }),
  idempotencyKey: z.string().trim().min(1).max(200),
  authorityRef: z.string().trim().max(500).nullable().optional(),
  sourceSha: z.string().trim().max(128).nullable().optional(),
  evidenceRefs: z.array(z.string().trim().min(1).max(500)).max(100).default([]),
  correlationId: z.string().trim().max(160).optional(),
  supersedesEventId: z.string().trim().max(160).nullable().optional(),
  payload: z.record(z.string(), z.unknown()).default({}),
  confirmedByOwner: z.boolean().optional(),
}).strict().superRefine((value, ctx) => {
  const payloadJson = JSON.stringify(value.payload);
  if (Buffer.byteLength(payloadJson, "utf8") > 128 * 1024) {
    ctx.addIssue({ code: "custom", path: ["payload"], message: "CONTINUITY_PAYLOAD_TOO_LARGE" });
  }

  const sensitiveKey = /(?:password|passwd|secret|api[_-]?key|access[_-]?token|refresh[_-]?token|private[_-]?key|credential|authorization|cookie)/i;
  const inspect = (item: unknown, path: string, depth: number): void => {
    if (depth > 16 || !item || typeof item !== "object") return;
    if (Array.isArray(item)) {
      item.forEach((child, index) => inspect(child, `${path}[${index}]`, depth + 1));
      return;
    }
    for (const [key, child] of Object.entries(item as Record<string, unknown>)) {
      const childPath = path ? `${path}.${key}` : key;
      if (sensitiveKey.test(key)) {
        ctx.addIssue({ code: "custom", path: ["payload", childPath], message: "CONTINUITY_SENSITIVE_FIELD_REJECTED" });
        continue;
      }
      inspect(child, childPath, depth + 1);
    }
  };
  inspect(value.payload, "", 0);

  for (const [index, reference] of value.evidenceRefs.entries()) {
    try {
      const url = new URL(reference);
      if (["http:", "https:"].includes(url.protocol) && [...url.searchParams.keys()].some((key) => sensitiveKey.test(key))) {
        ctx.addIssue({ code: "custom", path: ["evidenceRefs", index], message: "CONTINUITY_SENSITIVE_URL_REJECTED" });
      }
    } catch { /* Evidence references may be non-URL identifiers. */ }
  }
});

let flushInProgress = false;

export async function flushPendingContinuityOutbox() {
  if (flushInProgress) return;
  flushInProgress = true;
  try {
    const pending = await listPendingContinuityEvents(25);
    for (const item of pending) {
      if (!item.event) {
        await recordContinuitySyncFailure(item.row.id, item.decryptError ?? "CONTINUITY_DECRYPTION_FAILED", true);
        continue;
      }
      try {
        const response = await proxyCoreRequest(
          `/v1/projects/${encodeURIComponent(item.row.projectId)}/continuity/events`,
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(item.event),
          },
        );
        let body: Record<string, unknown> = {};
        try { body = JSON.parse(response.body) as Record<string, unknown>; } catch { /* HTTP status remains the failure evidence. */ }
        if (response.status >= 200 && response.status < 300) {
          const sequence = Number(body.event_sequence);
          if (!Number.isSafeInteger(sequence) || sequence < 1) {
            await recordContinuitySyncFailure(item.row.id, "CORE_RESPONSE_MISSING_EVENT_SEQUENCE", true);
          } else {
            await markContinuitySynced(item.row.id, sequence);
          }
        } else {
          const detail = body.detail && typeof body.detail === "object"
            ? (body.detail as Record<string, unknown>)
            : body;
          const code = typeof detail.code === "string" ? detail.code : `CORE_HTTP_${response.status}`;
          const blocked = response.status === 400 || response.status === 401 ||
            response.status === 403 || response.status === 409 ||
            response.status === 413 || response.status === 422;
          await recordContinuitySyncFailure(item.row.id, code, blocked);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "CORE_SYNC_UNKNOWN_ERROR";
        await recordContinuitySyncFailure(item.row.id, message, false);
      }
    }
  } catch (error) {
    console.error("[ARKI continuity] outbox flush unavailable:", error instanceof Error ? error.message : "unknown");
  } finally {
    flushInProgress = false;
  }
}

async function getOwnedPersistentProject(ownerId: number, projectId: string) {
  // The lookup is owner-scoped and the positive database ID proves the project is persisted.
  // Never accept the in-memory fallback as durable MEMORY ownership evidence.
  const project = await getSiclProject(ownerId, projectId);
  if (!project || !Number.isSafeInteger(project.id) || project.id <= 0 || project.ownerId !== ownerId) return null;
  return project;
}

async function authenticatedOwner(req: Request, res: Response) {
  const context = await createContext({ req, res });
  if (!context.user) {
    res.status(401).json({ code: "UNAUTHENTICATED" });
    return null;
  }
  return context.user;
}

export function registerContinuityApi(app: Express) {
  app.post("/api/continuity/projects/:projectId/events", async (req, res) => {
    const user = await authenticatedOwner(req, res);
    if (!user) return;
    const projectId = String(req.params.projectId ?? "");
    const project = await getOwnedPersistentProject(user.id, projectId);
    if (!project) { res.status(404).json({ code: "PROJECT_NOT_FOUND" }); return; }

    const parsed = eventInput.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ code: "CONTINUITY_EVENT_INVALID", issues: parsed.error.issues });
      return;
    }
    const input = parsed.data;
    if (input.eventType === "DECISION_RECORDED") {
      const ownerAuthority = user.role === "admin" && Boolean(ENV.ownerOpenId) && user.openId === ENV.ownerOpenId;
      if (!ownerAuthority || input.confirmedByOwner !== true || !input.authorityRef) {
        res.status(403).json({ code: "OWNER_HUMAN_AUTHORITY_REQUIRED" });
        return;
      }
    }

    const stableId = createHash("sha256").update(`${user.id}:${projectId}:${input.idempotencyKey}`).digest("hex").slice(0, 32);
    const event = {
      event_id: `SICL-${stableId}`,
      event_type: input.eventType,
      workstream_id: input.workstreamId,
      occurred_at: input.occurredAt,
      recorded_at: new Date().toISOString(),
      actor: user.openId,
      authority_ref: input.authorityRef ?? null,
      source_system: "SICL_WEB" as const,
      source_sha: input.sourceSha ?? null,
      evidence_refs: input.evidenceRefs,
      payload: input.payload,
      idempotency_key: input.idempotencyKey,
      correlation_id: input.correlationId ?? `SICL-${stableId}`,
      supersedes_event_id: input.supersedesEventId ?? null,
    };

    try {
      const queued = await enqueueContinuityEvent({ ownerId: user.id, projectId, event });
      await flushPendingContinuityOutbox();
      const current = await getContinuityOutboxEvent(user.id, projectId, queued.eventId);
      if (!current) throw new Error("CONTINUITY_OUTBOX_EVENT_NOT_FOUND");
      const aggregate = await getContinuityOutboxStatus(user.id, projectId);
      const code = current.status;
      res.status(code === "SYNCED" ? 200 : code === "BLOCKED" ? 409 : 202).json({
        code,
        eventId: current.eventId,
        sha256: current.sha256,
        coreSequence: current.coreSequence,
        attempts: current.attempts,
        lastError: current.lastError,
        outbox: aggregate,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "CONTINUITY_WRITE_FAILED";
      const conflict = message === "CONTINUITY_IDEMPOTENCY_CONFLICT";
      res.status(conflict ? 409 : 503).json({ code: message, retryable: !conflict });
    }
  });

  app.get("/api/continuity/projects/:projectId/events", async (req, res) => {
    const user = await authenticatedOwner(req, res);
    if (!user) return;
    const projectId = String(req.params.projectId ?? "");
    const project = await getOwnedPersistentProject(user.id, projectId);
    if (!project) { res.status(404).json({ code: "PROJECT_NOT_FOUND" }); return; }
    const afterId = Number(req.query.after_id ?? 0);
    if (!Number.isSafeInteger(afterId) || afterId < 0) { res.status(400).json({ code: "INVALID_CURSOR" }); return; }
    try {
      const response = await proxyCoreRequest(
        `/v1/projects/${encodeURIComponent(projectId)}/continuity/events?after_id=${afterId}`,
        { method: "GET" },
      );
      res.status(response.status).type(response.contentType).send(response.body);
    } catch {
      res.status(503).json({ code: "CORE_UNAVAILABLE" });
    }
  });

  app.get("/api/continuity/projects/:projectId/checkpoint", async (req, res) => {
    const user = await authenticatedOwner(req, res);
    if (!user) return;
    const projectId = String(req.params.projectId ?? "");
    const project = await getOwnedPersistentProject(user.id, projectId);
    if (!project) { res.status(404).json({ code: "PROJECT_NOT_FOUND" }); return; }
    try {
      const response = await proxyCoreRequest(
        `/v1/projects/${encodeURIComponent(projectId)}/continuity/checkpoint`,
        { method: "GET" },
      );
      if (response.status < 200 || response.status >= 300) {
        res.status(response.status).type(response.contentType).send(response.body);
        return;
      }
      const core = JSON.parse(response.body) as Record<string, unknown>;
      const outbox = await getContinuityOutboxStatus(user.id, projectId);
      res.status(200).json({ core, web_outbox: outbox });
    } catch {
      res.status(503).json({ code: "CORE_UNAVAILABLE" });
    }
  });
}
