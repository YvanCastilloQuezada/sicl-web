import type { GameType } from "../pilot";

export type SimulationProfile = {
  name: string;
  totalRounds: number;
  ticketsPerRound: number;
  users: number;
  games: readonly GameType[];
  seed: string;
  initialBalancePerUser: number;
  outputReport: string;
  targetP95Ms: number;
  rtpTolerance: number;
};

export type VirtualUser = {
  id: number;
  openId: string;
  name: string;
};

export type GameStatistics = {
  tickets: number;
  cost: number;
  prize: number;
  responseTimesMs: number[];
};

export type SimulationReport = {
  timestamp: string;
  safety: {
    databaseTouched: false;
    networkCalls: false;
    usesProductionUsers: false;
    note: string;
  };
  config: SimulationProfile;
  durationMs: number;
  summary: {
    totalTickets: number;
    totalRounds: number;
    totalCost: number;
    totalPrize: number;
    overallRtp: number;
    errors: number;
    errorRate: number;
    balanceConsistent: boolean;
    initialBalance: number;
    finalBalance: number;
  };
  byGame: Partial<Record<GameType, {
    tickets: number;
    cost: number;
    prize: number;
    rtpObserved: number;
    rtpTheoretical: number;
    deviation: number;
  }>>;
  performance: {
    avgResponseTimeMs: number;
    p95ResponseTimeMs: number;
    p99ResponseTimeMs: number;
    maxResponseTimeMs: number;
    targetP95Ms: number;
    targetMet: boolean;
    scope: string;
  };
  validation: {
    minimumTicketsPerGame: number;
    rtpTolerance: number;
    rtpPassed: boolean;
    integrityPassed: boolean;
    performancePassed: boolean;
    byGame: Partial<Record<GameType, { eligible: boolean; passed: boolean; deviation: number }>>;
  };
  conclusions: string[];
};
