export type SchedulePriority = "HIGH" | "NORMAL" | "LOW";
export type SchedulePublicationState = "DRAFT" | "APPROVED" | "PUBLISHED";

export type ScheduleCandidate = {
  gameId: string;
  title: string;
  frequencyPerWeek: number;
  durationMinutes: number;
  priority: SchedulePriority;
  primeTime: boolean;
  minGapMinutes: number;
  category: string;
  rulesetValid?: boolean;
  rtpValidated?: boolean;
  experienceComplete?: boolean;
  contingencyConfigured?: boolean;
  contentConfigured?: boolean;
  tvConfigured?: boolean;
  mobileConfigured?: boolean;
  resourcesAvailable?: boolean;
};

export type ProgramEvent = {
  eventId: string;
  gameId: string;
  experienceId: string;
  startsAt: number;
  endsAt: number;
  durationMinutes: number;
};

export type ProgramBlock = {
  blockId: string;
  title: string;
  startsAt: number;
  endsAt: number;
  items: Array<{ kind: "OPENING" | "GAME" | "TRIVIA" | "INTERACTION" | "RESULT" | "TRANSITION"; gameId?: string; durationMinutes: number }>;
  events?: ProgramEvent[];
};

export type ScheduleValidation = {
  status: "VALID" | "WARNING" | "BLOCKED";
  conflicts: string[];
  warnings: string[];
};

export type ScheduleProposal = {
  blocks: ProgramBlock[];
  conflicts: string[];
  requiresApproval: true;
  published: boolean;
  publicationState?: SchedulePublicationState;
  validation?: ScheduleValidation;
  programId?: string;
};

export function proposeSchedule(candidates: ScheduleCandidate[], startAt: number, hours = 2): ScheduleProposal {
  const blocks: ProgramBlock[] = [];
  const conflicts: string[] = [];
  const ordered = [...candidates].sort((a, b) => Number(b.primeTime) - Number(a.primeTime) || b.priority.localeCompare(a.priority));
  let cursor = startAt;
  const endLimit = startAt + hours * 60 * 60 * 1000;
  for (const candidate of ordered) {
    if (candidate.durationMinutes <= 0 || candidate.frequencyPerWeek <= 0) { conflicts.push(`${candidate.gameId}: parámetros inválidos`); continue; }
    const start = cursor;
    const end = start + candidate.durationMinutes * 60 * 1000;
    if (end > endLimit) { conflicts.push(`${candidate.gameId}: fuera de ventana`); continue; }
    const previous = blocks.at(-1);
    if (previous && start < previous.endsAt) { conflicts.push(`${candidate.gameId}: solapamiento`); cursor = previous.endsAt + candidate.minGapMinutes * 60 * 1000; continue; }
    const eventId = `EVENT-${new Date(start).toISOString()}`;
    const experienceId = `EXP-${candidate.gameId}-${new Date(start).toISOString()}`;
    blocks.push({ blockId: `BLOCK-${new Date(start).toISOString()}`, title: `MJP ${candidate.primeTime ? "PRIME" : "INTERACTIVO"}`, startsAt: start, endsAt: end, items: [{ kind: "OPENING", durationMinutes: 1 }, { kind: "GAME", gameId: candidate.gameId, durationMinutes: Math.max(1, candidate.durationMinutes - 3) }, { kind: "RESULT", gameId: candidate.gameId, durationMinutes: 1 }, { kind: "TRANSITION", durationMinutes: 1 }], events: [{ eventId, gameId: candidate.gameId, experienceId, startsAt: start, endsAt: end, durationMinutes: candidate.durationMinutes }] });
    cursor = end + candidate.minGapMinutes * 60 * 1000;
  }
  const validation = validateScheduleCandidates(candidates, blocks, conflicts);
  return { blocks, conflicts, requiresApproval: true, published: false, publicationState: "DRAFT", validation };
}

export function validateScheduleCandidates(candidates: ScheduleCandidate[], blocks: ProgramBlock[], existingConflicts: string[] = []): ScheduleValidation {
  const conflicts = [...existingConflicts];
  const warnings: string[] = [];
  for (const candidate of candidates) {
    const required: Array<[keyof ScheduleCandidate, string]> = [
      ["rulesetValid", "ruleset válido"], ["rtpValidated", "RTP validado"], ["experienceComplete", "experiencia completa"],
      ["contingencyConfigured", "contingencia configurada"], ["contentConfigured", "contenido configurado"], ["tvConfigured", "TV configurada"],
      ["mobileConfigured", "configuración móvil"], ["resourcesAvailable", "recursos disponibles"],
    ];
    for (const [key, label] of required) if (candidate[key] === false) conflicts.push(`${candidate.gameId}: falta ${label}`);
    if (required.some(([key]) => candidate[key] === undefined)) warnings.push(`${candidate.gameId}: validación de infraestructura incompleta`);
  }
  for (let i = 1; i < blocks.length; i += 1) if (blocks[i - 1].endsAt > blocks[i].startsAt) conflicts.push(`${blocks[i].blockId}: solapamiento de bloques`);
  return { status: conflicts.length ? "BLOCKED" : warnings.length ? "WARNING" : "VALID", conflicts: Array.from(new Set(conflicts)), warnings: Array.from(new Set(warnings)) };
}

export function approveSchedule(proposal: ScheduleProposal, actor: string): ScheduleProposal {
  if (!actor.trim()) throw new Error("La aprobación requiere un actor humano.");
  if (proposal.publicationState !== "DRAFT") throw new Error("Solo una programación DRAFT puede aprobarse.");
  if (proposal.validation?.status === "BLOCKED") throw new Error("La programación está bloqueada por validaciones.");
  return { ...proposal, publicationState: "APPROVED", published: false, requiresApproval: true };
}

export function publishSchedule(proposal: ScheduleProposal, actor: string): ScheduleProposal {
  if (!actor.trim()) throw new Error("La publicación requiere un actor humano.");
  if (proposal.publicationState !== "APPROVED") throw new Error("Solo una programación APPROVED puede publicarse.");
  return { ...proposal, publicationState: "PUBLISHED", published: true, requiresApproval: true };
}
