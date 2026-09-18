import type { CoreProject, Evidence, SpatialRegistration } from "@/api/sicl-client";

export type ProblemReadiness = "READY_FOR_SYNTHESIS" | "PARTIAL" | "BLOCKED" | "UNKNOWN";
export type ProblemItem = { id: string; text: string; basis: string; classification: "FACT" | "ASSUMPTION" | "PREFERENCE" | "UNKNOWN" | "INTERPRETATION" | "HYPOTHESIS"; spatialScope?: string };
export type DesignTension = { id: string; statement: string; basis: string[]; unresolved: true };
export type DesignQuestion = { id: string; question: string; basis: string[]; solution: false };
export type ArchitecturalIntent = { statement: string; classification: "DERIVED_INTERPRETATION"; basis: string[]; humanConfirmation: "REQUIRED" };
export type ArchitecturalProblem = {
  project: ProblemItem[]; site: ProblemItem[]; users: ProblemItem[]; program: ProblemItem[];
  objectives: ProblemItem[]; constraints: ProblemItem[]; preferences: ProblemItem[];
  known: ProblemItem[]; unknown: ProblemItem[]; tensions: DesignTension[]; designQuestions: DesignQuestion[];
  intent?: ArchitecturalIntent; readiness: ProblemReadiness; readinessBasis: string[]; blocking: string[];
  spatialScope: string; sourceProjectId?: string; sourceEvidenceIds: string[]; noDecision: true; noGeneration: true;
};

type AnyRecord = Record<string, unknown>;
const record = (value: unknown): AnyRecord => value && typeof value === "object" && !Array.isArray(value) ? value as AnyRecord : {};
const list = (value: unknown): unknown[] => Array.isArray(value) ? value : value && typeof value === "object" ? Object.values(value as AnyRecord) : value == null ? [] : [value];
const text = (value: unknown): string => typeof value === "string" ? value.trim() : value == null ? "" : JSON.stringify(value);
const items = (value: unknown, classification: ProblemItem["classification"], prefix: string, scope?: string): ProblemItem[] => list(value).map((entry, index): ProblemItem | null => {
  const r = record(entry); const label = text(r.label ?? r.name ?? r.title ?? r.description ?? r.statement ?? entry);
  return label ? { id: text(r.id ?? r[`${prefix}_id`] ?? `${prefix}-${index + 1}`), text: label, basis: `${prefix}.${text(r.id ?? index + 1)}`, classification, spatialScope: text(r.spatial_scope ?? scope) || undefined } : null;
}).filter((item): item is ProblemItem => Boolean(item));

function objectItems(value: unknown, classification: ProblemItem["classification"], prefix: string, scope?: string): ProblemItem[] {
  const r = record(value); return Object.entries(r).flatMap(([key, val]) => items({ id: key, value: val, label: `${key}: ${text(val)}` }, classification, prefix, scope));
}

export function deriveArchitecturalProblem(project: CoreProject | undefined, evidence: Evidence[], registrations: SpatialRegistration[]): ArchitecturalProblem {
  const p = record(project); const scope = text(p.spatial_scope ?? p.spatialScope ?? "UNKNOWN").toLowerCase() || "unknown";
  const projectLabel = text(p.name) || text(p.project_id) || "Unknown project";
  const projectItems: ProblemItem[] = [{ id: text(p.project_id) || "project", text: projectLabel, basis: `project.${text(p.project_id) || "unknown"}`, classification: "FACT", spatialScope: scope }];
  const site = [...objectItems(p.site ?? p.location ?? p.context, "FACT", "site", scope), ...registrations.filter((r) => ["LOCKED", "CONFIRMED", "REGISTERED", "AVAILABLE"].includes(text(r.status).toUpperCase())).map((r, i) => ({ id: text(r.registration_id ?? `registration-${i + 1}`), text: `Spatial registration: ${text(r.status)}`, basis: `registration.${text(r.registration_id ?? i + 1)}`, classification: "FACT" as const, spatialScope: scope }))];
  const users = [...items(p.users ?? p.user_groups ?? p.activities, "FACT", "users", scope), ...objectItems(p.users ?? p.activities, "FACT", "users", scope)];
  const program = [...items(p.program ?? p.programme, "FACT", "program", scope), ...objectItems(p.program ?? p.programme, "FACT", "program", scope)];
  const objectives = objectItems(p.objectives, "FACT", "objective", scope).concat(items(p.objectives, "FACT", "objective", scope));
  const constraints = objectItems(p.constraints, "FACT", "constraint", scope).concat(items(p.constraints, "FACT", "constraint", scope));
  const preferences = objectItems(p.preferences, "PREFERENCE", "preference", scope).concat(items(p.preferences, "PREFERENCE", "preference", scope));
  const known = evidence.filter((e) => !["AI_PROPOSED", "UNKNOWN", "ASSUMPTION"].includes(text(e.state ?? e.epistemic_state).toUpperCase())).map((e) => ({ id: e.evidence_id, text: e.statement, basis: `evidence.${e.evidence_id}`, classification: "FACT" as const, spatialScope: text(e.spatial_scope ?? scope) || undefined }));
  const unknown = evidence.filter((e) => ["AI_PROPOSED", "UNKNOWN", "ASSUMPTION"].includes(text(e.state ?? e.epistemic_state).toUpperCase())).map((e) => ({ id: e.evidence_id, text: e.statement || `Evidence ${e.evidence_id} requires clarification`, basis: `evidence.${e.evidence_id}`, classification: (text(e.state ?? e.epistemic_state).toUpperCase() === "ASSUMPTION" ? "ASSUMPTION" : "UNKNOWN") as ProblemItem["classification"], spatialScope: text(e.spatial_scope ?? scope) || undefined }));
  const tensions: DesignTension[] = [];
  if (objectives.length && constraints.length) tensions.push({ id: "tension-objective-constraint", statement: "Objectives must be pursued within the declared constraints; their trade-off remains unresolved.", basis: [objectives[0].basis, constraints[0].basis], unresolved: true });
  if (objectives.some((x) => /open|abierto|vac[ií]o/i.test(x.text)) && preferences.some((x) => /footprint|compact|huella/i.test(x.text))) tensions.push({ id: "tension-open-compact", statement: "Open-space objectives and compact-footprint preferences may pull the design in different directions.", basis: [objectives.find((x) => /open|abierto|vac[ií]o/i.test(x.text))!.basis, preferences.find((x) => /footprint|compact|huella/i.test(x.text))!.basis], unresolved: true });
  const designQuestions: DesignQuestion[] = tensions.map((tension) => ({ id: `question-${tension.id}`, question: `How should the project address this tension at the ${scope} scale without deciding a solution in advance?`, basis: tension.basis, solution: false }));
  const basis = [...objectives, ...constraints, ...preferences].slice(0, 4).map((x) => x.basis);
  const intent = basis.length >= 2 ? { statement: `The current project appears to seek a coherent response to its objectives and constraints at the ${scope} scale.`, classification: "DERIVED_INTERPRETATION" as const, basis, humanConfirmation: "REQUIRED" as const } : undefined;
  const blocking = !text(p.project_id) && !text(p.name) ? ["Project identity is missing."] : [];
  const readiness: ProblemReadiness = blocking.length ? "BLOCKED" : intent && (site.length || program.length || users.length) ? "READY_FOR_SYNTHESIS" : "PARTIAL";
  return { project: projectItems, site, users, program, objectives, constraints, preferences, known, unknown, tensions, designQuestions, intent, readiness, readinessBasis: [...(objectives.length ? ["Objectives are available."] : []), ...(constraints.length ? ["Constraints are available."] : []), ...(site.length ? ["Site/context information is available."] : []), ...(unknown.length ? ["Some information remains unknown and was not inferred."] : [])], blocking, spatialScope: scope, sourceProjectId: text(p.project_id) || undefined, sourceEvidenceIds: evidence.map((e) => e.evidence_id), noDecision: true, noGeneration: true };
}

export const architecturalProblemSummary = (problem: ArchitecturalProblem) => ({ readiness: problem.readiness, tensionCount: problem.tensions.length, questionCount: problem.designQuestions.length, unknownCount: problem.unknown.length, intentDerived: Boolean(problem.intent), spatialScope: problem.spatialScope });

export function answerDesignProblemQuestion(question: string, problem: ArchitecturalProblem): { answerKey: string; params?: Record<string, unknown> } {
  const q = question.toLowerCase();
  if (/what are we designing|qué estamos diseñando|qué diseñamos|brief|resumen/.test(q)) return { answerKey: "arqui.problem_answer_designing", params: { project: problem.project[0]?.text ?? "Unknown project", scope: problem.spatialScope } };
  if (/unknown|no sabemos|qué no sabemos|what don.t we know/.test(q)) return { answerKey: "arqui.problem_answer_unknown", params: { count: problem.unknown.length } };
  if (/conflict|contradic|conflicto|tensi/.test(q)) return { answerKey: "arqui.problem_answer_tensions", params: { count: problem.tensions.length } };
  if (/intent|intención/.test(q)) return { answerKey: "arqui.problem_answer_intent", params: { intent: problem.intent?.statement ?? "No derived intent yet" } };
  if (/block|bloque/.test(q)) return { answerKey: "arqui.problem_answer_blocking", params: { count: problem.blocking.length } };
  return { answerKey: "arqui.problem_answer_summary", params: { questions: problem.designQuestions.length, readiness: problem.readiness } };
}

export { items, objectItems };
