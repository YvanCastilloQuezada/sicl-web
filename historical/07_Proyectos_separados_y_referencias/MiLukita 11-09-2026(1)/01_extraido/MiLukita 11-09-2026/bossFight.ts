export const BOSS_FIGHT_PHASES = ["WAITING", "ACTIVE", "DEFEATED", "EXPIRED"] as const;
export type BossFightPhase = (typeof BOSS_FIGHT_PHASES)[number];

export type BossVector2 = { x: number; y: number };
export type BossState = {
  fightId: string;
  roundId: string;
  phase: BossFightPhase;
  bossPosition: BossVector2;
  bossHealth: number;
  maxHealth: number;
  patternIndex: number;
  patternStartedAt: number;
  updatedAt: number;
  lastEventId: string | null;
};
export type BossMovementPattern = { name: "SWEEP" | "PULSE" | "ORBIT"; durationMs: number; amplitude: number; speed: number };
export type BossHitInput = { playerId: string; requestId: string; clientTime: number; aim: BossVector2 };
export type BossHitResult = { accepted: boolean; reason: "HIT" | "OUT_OF_RANGE" | "WRONG_PHASE" | "DUPLICATE"; damage: number; state: BossState };

export const BOSS_PATTERNS: readonly BossMovementPattern[] = [
  { name: "SWEEP", durationMs: 6_000, amplitude: 0.72, speed: 1.4 },
  { name: "PULSE", durationMs: 5_000, amplitude: 0.42, speed: 2.1 },
  { name: "ORBIT", durationMs: 7_000, amplitude: 0.58, speed: 1.1 },
];

export function distance(a: BossVector2, b: BossVector2): number { return Math.hypot(a.x - b.x, a.y - b.y); }
export function projectBossPosition(pattern: BossMovementPattern, elapsedMs: number): BossVector2 {
  const t = elapsedMs / 1000;
  if (pattern.name === "SWEEP") return { x: Math.sin(t * pattern.speed) * pattern.amplitude, y: Math.cos(t * pattern.speed * 0.5) * 0.2 };
  if (pattern.name === "PULSE") { const pulse = Math.sin(t * pattern.speed) * pattern.amplitude; return { x: pulse, y: pulse * 0.6 }; }
  return { x: Math.cos(t * pattern.speed) * pattern.amplitude, y: Math.sin(t * pattern.speed) * pattern.amplitude };
}
