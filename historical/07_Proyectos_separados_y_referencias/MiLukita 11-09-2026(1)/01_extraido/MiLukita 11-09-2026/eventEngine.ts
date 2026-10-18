export const EVENT_STATUSES = ["SCHEDULED", "PREPARING", "OPEN", "CLOSING", "LOCKED", "DRAWING", "RESULT_PENDING", "RESULT_VERIFIED", "PUBLISHED", "COMPLETED", "CANCELLED", "SUSPENDED", "ERROR", "RECOVERY"] as const;
export type EventStatus = (typeof EVENT_STATUSES)[number];

export type MjpEvent = {
  eventId: string;
  eventType: "GAME_DRAW";
  gameId: string;
  scheduledStart: number | null;
  participationOpen: number | null;
  participationClose: number | null;
  executionStart: number | null;
  executionEnd: number | null;
  status: EventStatus;
  rulesVersion: string | null;
  displayConfiguration: { title: string; virtualOnly: true };
  qrConfiguration: { enabled: boolean; roundId: string };
  verification: { available: boolean; roundId: string };
  recoveryState: "NORMAL" | "CONTINGENCY";
};

function publicStatus(state: string): EventStatus {
  switch (state) {
    case "draft": return "SCHEDULED";
    case "open": return "OPEN";
    case "locked": return "LOCKED";
    case "drawn": return "RESULT_VERIFIED";
    case "settled":
    case "archived": return "COMPLETED";
    default: return "ERROR";
  }
}

export function eventFromRound(round: {
  publicId: string;
  gameType: string;
  state: string;
  openAt?: Date | number | null;
  closeAt?: Date | number | null;
  drawAt?: Date | number | null;
  rulesetPublicId?: string | null;
}, title = round.gameType): MjpEvent {
  const toMs = (value?: Date | number | null) => value == null ? null : value instanceof Date ? value.getTime() : value;
  const status = publicStatus(round.state);
  return {
    eventId: round.publicId,
    eventType: "GAME_DRAW",
    gameId: round.gameType,
    scheduledStart: toMs(round.openAt),
    participationOpen: toMs(round.openAt),
    participationClose: toMs(round.closeAt),
    executionStart: toMs(round.drawAt),
    executionEnd: status === "COMPLETED" ? toMs(round.drawAt) : null,
    status,
    rulesVersion: round.rulesetPublicId ?? null,
    displayConfiguration: { title, virtualOnly: true },
    qrConfiguration: { enabled: true, roundId: round.publicId },
    verification: { available: ["RESULT_VERIFIED", "PUBLISHED", "COMPLETED"].includes(status), roundId: round.publicId },
    recoveryState: "NORMAL",
  };
}

export function eventStatusCanMove(from: EventStatus, to: EventStatus): boolean {
  const allowed: Record<EventStatus, readonly EventStatus[]> = {
    SCHEDULED: ["PREPARING", "CANCELLED"], PREPARING: ["OPEN", "CANCELLED", "ERROR"], OPEN: ["CLOSING", "SUSPENDED", "ERROR"],
    CLOSING: ["LOCKED", "ERROR"], LOCKED: ["DRAWING", "RECOVERY", "ERROR"], DRAWING: ["RESULT_PENDING", "ERROR"],
    RESULT_PENDING: ["RESULT_VERIFIED", "RECOVERY", "ERROR"], RESULT_VERIFIED: ["PUBLISHED", "COMPLETED"], PUBLISHED: ["COMPLETED"],
    COMPLETED: [], CANCELLED: [], SUSPENDED: ["OPEN", "CANCELLED", "RECOVERY"], ERROR: ["RECOVERY", "CANCELLED"], RECOVERY: ["PREPARING", "OPEN", "CANCELLED"],
  };
  return allowed[from]?.includes(to) ?? false;
}
