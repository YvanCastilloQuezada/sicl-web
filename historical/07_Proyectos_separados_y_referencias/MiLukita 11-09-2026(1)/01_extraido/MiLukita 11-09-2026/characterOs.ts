export type CharacterStatus = "DRAFT" | "DESIGN" | "REVIEW" | "APPROVED" | "STAGED" | "ACTIVE" | "SUSPENDED" | "RETIRED";
export type CharacterRole = "MAIN_HOST" | "ASSISTANT" | "MASCOT" | "GUEST" | "THEMATIC";
export type CharacterChannel = "TV" | "WEB" | "MOBILE" | "TV_OVERLAY" | "SECOND_SCREEN" | "SOCIAL" | "SPECIAL_EVENT";
export type CharacterState = "IDLE" | "INTRO" | "PRESENTING" | "INTERACTING" | "WAITING" | "CELEBRATING" | "TRANSITION" | "RESULT" | "FAREWELL" | "HIDDEN" | "EMERGENCY";
export type PresentationIntensity = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type FallbackMode = "THREE_D" | "TWO_D" | "STATIC_CARD" | "TEXT_GRAPHIC_HOST";

export type CharacterProfile = {
  characterId: string;
  name: string;
  version: string;
  status: CharacterStatus;
  role: CharacterRole;
  type: "RESIDENT" | "GUEST" | "SEASONAL" | "SPECIAL" | "SPONSORED" | "COMMUNITY" | "THEMATIC";
  personality: readonly string[];
  allowedEvents: readonly string[];
  forbiddenEvents: readonly string[];
  allowedChannels: readonly CharacterChannel[];
  forbiddenChannels: readonly CharacterChannel[];
  maxAppearancesDay: number;
  maxAppearancesHour: number;
  minIntervalMinutes: number;
  maxConsecutiveAppearances: number;
  compatibleWith: readonly string[];
  incompatibleWith: readonly string[];
  approvedBy: string | null;
  approvedAt: string | null;
};

export type CastingProposal = {
  eventId: string;
  characterIds: readonly string[];
  reason: string;
  intensity: PresentationIntensity;
  channel: CharacterChannel;
  decision: "PENDING" | "AUTHORIZED" | "FALLBACK" | "REJECTED";
  decisionSource: "POLICY" | "HUMAN" | "SYSTEM";
  policyVersion: string;
};

export type CharacterPresentation = {
  characterId: string | null;
  state: CharacterState;
  intensity: PresentationIntensity;
  silentMode: boolean;
  fallback: FallbackMode | null;
  allowedToSpeak: boolean;
  source: "APPROVED_SCRIPT" | "STATIC_CARD" | "TEXT_GRAPHIC" | "NONE";
};

export const CHARACTER_STATE_TRANSITIONS: Readonly<Record<CharacterState, readonly CharacterState[]>> = {
  IDLE: ["INTRO", "PRESENTING", "HIDDEN", "EMERGENCY"],
  INTRO: ["PRESENTING", "TRANSITION", "HIDDEN", "EMERGENCY"],
  PRESENTING: ["INTERACTING", "WAITING", "TRANSITION", "RESULT", "FAREWELL", "HIDDEN", "EMERGENCY"],
  INTERACTING: ["WAITING", "CELEBRATING", "TRANSITION", "RESULT", "HIDDEN", "EMERGENCY"],
  WAITING: ["INTERACTING", "CELEBRATING", "TRANSITION", "RESULT", "HIDDEN", "EMERGENCY"],
  CELEBRATING: ["TRANSITION", "FAREWELL", "HIDDEN", "EMERGENCY"],
  TRANSITION: ["PRESENTING", "WAITING", "HIDDEN", "EMERGENCY"],
  RESULT: ["FAREWELL", "HIDDEN", "EMERGENCY"],
  FAREWELL: ["HIDDEN", "IDLE", "EMERGENCY"],
  HIDDEN: ["IDLE", "INTRO", "PRESENTING", "EMERGENCY"],
  EMERGENCY: ["HIDDEN", "IDLE"],
};

export const LUKITA_PROFILE: CharacterProfile = {
  characterId: "lukita-main",
  name: "Lukita",
  version: "1.0",
  status: "ACTIVE",
  role: "MAIN_HOST",
  type: "RESIDENT",
  personality: ["cálida", "divertida", "confiable", "energética", "clara"],
  allowedEvents: ["*"],
  forbiddenEvents: [],
  allowedChannels: ["TV", "WEB", "MOBILE", "TV_OVERLAY", "SECOND_SCREEN"],
  forbiddenChannels: [],
  maxAppearancesDay: 24,
  maxAppearancesHour: 4,
  minIntervalMinutes: 5,
  maxConsecutiveAppearances: 3,
  compatibleWith: ["ruli", "mascota", "tematico-demo"],
  incompatibleWith: [],
  approvedBy: "OWNER",
  approvedAt: "2026-08-27T00:00:00.000Z",
};

export const CHARACTER_REGISTRY: readonly CharacterProfile[] = [
  LUKITA_PROFILE,
  { characterId: "ruli", name: "Ruli", version: "SPEC-0.1", status: "REVIEW", role: "ASSISTANT", type: "RESIDENT", personality: ["competitivo", "juguetón"], allowedEvents: ["TRIVIA_DEMO"], forbiddenEvents: [], allowedChannels: ["TV", "WEB", "MOBILE"], forbiddenChannels: [], maxAppearancesDay: 12, maxAppearancesHour: 2, minIntervalMinutes: 10, maxConsecutiveAppearances: 2, compatibleWith: ["lukita-main"], incompatibleWith: [], approvedBy: null, approvedAt: null },
  { characterId: "mascota", name: "Mascota", version: "SPEC-0.1", status: "REVIEW", role: "MASCOT", type: "SEASONAL", personality: ["amable", "visual"], allowedEvents: ["TRIVIA_DEMO"], forbiddenEvents: ["RESULT"], allowedChannels: ["TV", "WEB"], forbiddenChannels: ["SECOND_SCREEN"], maxAppearancesDay: 8, maxAppearancesHour: 1, minIntervalMinutes: 20, maxConsecutiveAppearances: 1, compatibleWith: ["lukita-main"], incompatibleWith: [], approvedBy: null, approvedAt: null },
  { characterId: "tematico-demo", name: "Personaje temático (SPEC/MOCK)", version: "SPEC-0.1", status: "DRAFT", role: "THEMATIC", type: "THEMATIC", personality: ["contextual"], allowedEvents: ["TRIVIA_DEMO"], forbiddenEvents: [], allowedChannels: ["TV", "WEB"], forbiddenChannels: ["MOBILE", "SECOND_SCREEN"], maxAppearancesDay: 2, maxAppearancesHour: 1, minIntervalMinutes: 60, maxConsecutiveAppearances: 1, compatibleWith: ["lukita-main"], incompatibleWith: [], approvedBy: null, approvedAt: null },
];

export function canTransitionCharacterState(previous: CharacterState, next: CharacterState): boolean { return CHARACTER_STATE_TRANSITIONS[previous].includes(next); }
export function isSilentCharacterPresentation(state: CharacterState): boolean { return state === "RESULT" || state === "EMERGENCY"; }
export function choosePresentationFallback(available: readonly FallbackMode[]): FallbackMode | null { return available[0] ?? null; }
export type CharacterAuditEvent = { type: "CHARACTER_SELECTION" | "CASTING_PROPOSAL" | "CASTING_DECISION" | "STATE_CHANGE" | "APPEARANCE" | "FALLBACK_ACTIVATION" | "LUKITA_KILL" | "LUKITA_RESTORE"; timestamp: string; eventId: string; characterId: string | null; decisionSource: "POLICY" | "HUMAN" | "SYSTEM"; policyVersion: string; reason: string };

export function canCharacterAppear(profile: CharacterProfile, eventId: string, channel: CharacterChannel): boolean {
  const eventAllowed = profile.allowedEvents.includes("*") || profile.allowedEvents.includes(eventId);
  return profile.status === "ACTIVE" && eventAllowed && !profile.forbiddenEvents.includes(eventId) && profile.allowedChannels.includes(channel) && !profile.forbiddenChannels.includes(channel);
}
export function createCharacterAuditEvent(input: Omit<CharacterAuditEvent, "timestamp"> & { timestamp?: string }): CharacterAuditEvent { return { ...input, timestamp: input.timestamp ?? new Date().toISOString() }; }
export function characterCanMutateCore(): false { return false; }
