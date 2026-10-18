import { BOSS_PATTERNS, distance, projectBossPosition, type BossFightPhase, type BossHitInput, type BossHitResult, type BossState } from "../../shared/bossFight";

export class BossFightEngine {
  private readonly processedRequests = new Set<string>();
  private state: BossState;

  constructor(roundId: string, fightId = `boss-${roundId}`, now = Date.now()) {
    this.state = { fightId, roundId, phase: "WAITING", bossPosition: { x: 0, y: 0 }, bossHealth: 100, maxHealth: 100, patternIndex: 0, patternStartedAt: now, updatedAt: now, lastEventId: null };
  }

  start(now = Date.now()): BossState { this.state = { ...this.state, phase: "ACTIVE", patternStartedAt: now, updatedAt: now }; return this.state; }
  expire(now = Date.now()): BossState { this.state = { ...this.state, phase: this.state.phase === "DEFEATED" ? "DEFEATED" : "EXPIRED", updatedAt: now }; return this.state; }
  getState(): BossState { return { ...this.state, bossPosition: { ...this.state.bossPosition } }; }

  tick(now = Date.now()): BossState {
    if (this.state.phase !== "ACTIVE") return this.getState();
    let patternIndex = this.state.patternIndex;
    let patternStartedAt = this.state.patternStartedAt;
    let elapsed = now - patternStartedAt;
    while (elapsed >= BOSS_PATTERNS[patternIndex].durationMs) {
      elapsed -= BOSS_PATTERNS[patternIndex].durationMs;
      patternIndex = (patternIndex + 1) % BOSS_PATTERNS.length;
      patternStartedAt = now - elapsed;
    }
    const pattern = BOSS_PATTERNS[patternIndex];
    this.state = { ...this.state, patternIndex, patternStartedAt, bossPosition: projectBossPosition(pattern, elapsed), updatedAt: now };
    return this.getState();
  }

  hit(input: BossHitInput, now = Date.now()): BossHitResult {
    if (this.processedRequests.has(input.requestId)) return { accepted: false, reason: "DUPLICATE", damage: 0, state: this.getState() };
    this.processedRequests.add(input.requestId);
    this.tick(now);
    if (this.state.phase !== "ACTIVE") return { accepted: false, reason: "WRONG_PHASE", damage: 0, state: this.getState() };
    const range = distance(input.aim, this.state.bossPosition);
    if (!Number.isFinite(range) || range > 0.18) return { accepted: false, reason: "OUT_OF_RANGE", damage: 0, state: this.getState() };
    const damage = 10;
    const health = Math.max(0, this.state.bossHealth - damage);
    this.state = { ...this.state, bossHealth: health, phase: health === 0 ? "DEFEATED" : "ACTIVE", updatedAt: now, lastEventId: `hit-${input.requestId}` };
    return { accepted: true, reason: "HIT", damage, state: this.getState() };
  }
}
