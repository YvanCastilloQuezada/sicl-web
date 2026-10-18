export type GameLifecycleStatus = "ACTIVE_CORE" | "SECONDARY" | "EXPERIMENTAL" | "DISABLED";

export type GameDefinition = {
  id: string;
  name: string;
  slug: string;
  status: GameLifecycleStatus;
  version: string;
  rulesVersion: string;
  rtpTheoretical: number;
  rtpPublished: number;
  minParticipation: number;
  maxParticipation: number;
  schedule: string;
  enabled: boolean;
  virtualOnly: true;
};

const entry = (definition: Omit<GameDefinition, "virtualOnly">): GameDefinition => ({ ...definition, virtualOnly: true });

export const GAME_REGISTRY: readonly GameDefinition[] = [
  entry({ id: "loteria_39", name: "Lotería 39", slug: "loteria-39", status: "ACTIVE_CORE", version: "1.0", rulesVersion: "published", rtpTheoretical: 0.8709023384, rtpPublished: 0.8709023384, minParticipation: 1, maxParticipation: 10, schedule: "round_based", enabled: true }),
  entry({ id: "pick_3", name: "Pick 3", slug: "pick-3", status: "ACTIVE_CORE", version: "1.0", rulesVersion: "published", rtpTheoretical: 0.851, rtpPublished: 0.851, minParticipation: 1, maxParticipation: 10, schedule: "every_30_minutes", enabled: true }),
  entry({ id: "bingo", name: "Bingo", slug: "bingo", status: "ACTIVE_CORE", version: "1.0.1", rulesVersion: "published", rtpTheoretical: 1, rtpPublished: 1, minParticipation: 1, maxParticipation: 10, schedule: "round_based", enabled: true }),
  entry({ id: "ruleta", name: "Ruleta", slug: "ruleta", status: "SECONDARY", version: "1.1", rulesVersion: "published", rtpTheoretical: 0.8648648649, rtpPublished: 0.8648648649, minParticipation: 1, maxParticipation: 10, schedule: "round_based", enabled: true }),
  entry({ id: "loteria_19", name: "Lotería 19", slug: "loteria-19", status: "SECONDARY", version: "1.0", rulesVersion: "published", rtpTheoretical: 0.8648090815, rtpPublished: 0.8648090815, minParticipation: 1, maxParticipation: 10, schedule: "round_based", enabled: true }),
  entry({ id: "loteria_29", name: "Lotería 29", slug: "loteria-29", status: "SECONDARY", version: "1.0", rulesVersion: "published", rtpTheoretical: 0.9225927329, rtpPublished: 0.9225927329, minParticipation: 1, maxParticipation: 10, schedule: "round_based", enabled: true }),
  entry({ id: "loteria_39_5", name: "Lotería 39 Cinco", slug: "loteria-39-cinco", status: "SECONDARY", version: "1.0", rulesVersion: "published", rtpTheoretical: 0.8500113763, rtpPublished: 0.8500113763, minParticipation: 1, maxParticipation: 10, schedule: "round_based", enabled: true }),
  entry({ id: "loteria_49", name: "Lotería 49", slug: "loteria-49", status: "SECONDARY", version: "1.0", rulesVersion: "published", rtpTheoretical: 0.8508206916, rtpPublished: 0.8508206916, minParticipation: 1, maxParticipation: 10, schedule: "round_based", enabled: true }),
  entry({ id: "loteria_59", name: "Lotería 59", slug: "loteria-59", status: "SECONDARY", version: "1.0", rulesVersion: "published", rtpTheoretical: 0.9437363266, rtpPublished: 0.9437363266, minParticipation: 1, maxParticipation: 10, schedule: "round_based", enabled: true }),
  entry({ id: "jackpot", name: "Jackpot", slug: "jackpot", status: "SECONDARY", version: "1.0", rulesVersion: "published", rtpTheoretical: 0.850426, rtpPublished: 0.850426, minParticipation: 1, maxParticipation: 10, schedule: "weekly", enabled: true }),
  entry({ id: "cartas", name: "Trío 13", slug: "trio-13", status: "SECONDARY", version: "1.0", rulesVersion: "published", rtpTheoretical: 0.8689, rtpPublished: 0.8689, minParticipation: 1, maxParticipation: 10, schedule: "round_based", enabled: true }),
  entry({ id: "pick_4", name: "Pick 4", slug: "pick-4", status: "EXPERIMENTAL", version: "1.0", rulesVersion: "published", rtpTheoretical: 0.8518, rtpPublished: 0.8518, minParticipation: 1, maxParticipation: 10, schedule: "every_2_hours", enabled: true }),
  entry({ id: "sueldo_vida", name: "Sueldo de por vida", slug: "sueldo-de-por-vida", status: "EXPERIMENTAL", version: "1.0", rulesVersion: "published", rtpTheoretical: 0.860299, rtpPublished: 0.860299, minParticipation: 1, maxParticipation: 10, schedule: "weekly", enabled: true }),
  entry({ id: "raspa_digital", name: "Raspa Digital", slug: "raspa", status: "EXPERIMENTAL", version: "1.0", rulesVersion: "published", rtpTheoretical: 0.85, rtpPublished: 0.85, minParticipation: 1, maxParticipation: 10, schedule: "instant", enabled: true }),
  entry({ id: "loto_diario", name: "Loto Diario", slug: "loto-diario", status: "EXPERIMENTAL", version: "1.0", rulesVersion: "published", rtpTheoretical: 0.852012, rtpPublished: 0.852012, minParticipation: 1, maxParticipation: 10, schedule: "daily", enabled: true }),
  entry({ id: "loto_express", name: "Loto Express", slug: "loto-express", status: "EXPERIMENTAL", version: "1.0", rulesVersion: "published", rtpTheoretical: 0.85, rtpPublished: 0.85, minParticipation: 1, maxParticipation: 10, schedule: "every_30_minutes", enabled: true }),
  entry({ id: "loteria_39_extra", name: "Lotería 39 Extra", slug: "loteria-39-extra", status: "EXPERIMENTAL", version: "1.0", rulesVersion: "published", rtpTheoretical: 0.751562, rtpPublished: 0.751562, minParticipation: 1, maxParticipation: 10, schedule: "round_based", enabled: true }),
  entry({ id: "ruleta_7", name: "Ruleta 7", slug: "ruleta-7", status: "EXPERIMENTAL", version: "1.0", rulesVersion: "published", rtpTheoretical: 0.8571428571, rtpPublished: 0.8571428571, minParticipation: 1, maxParticipation: 10, schedule: "round_based", enabled: true }),
  entry({ id: "ruleta_17", name: "Ruleta 17", slug: "ruleta-17", status: "EXPERIMENTAL", version: "1.0", rulesVersion: "published", rtpTheoretical: 0.9411764706, rtpPublished: 0.9411764706, minParticipation: 1, maxParticipation: 10, schedule: "round_based", enabled: true }),
  entry({ id: "ruleta_27", name: "Ruleta 27", slug: "ruleta-27", status: "EXPERIMENTAL", version: "1.0", rulesVersion: "published", rtpTheoretical: 0.962962963, rtpPublished: 0.962962963, minParticipation: 1, maxParticipation: 10, schedule: "round_based", enabled: true }),
  entry({ id: "ruleta_37", name: "Ruleta 37", slug: "ruleta-37", status: "EXPERIMENTAL", version: "1.0", rulesVersion: "published", rtpTheoretical: 0.972972973, rtpPublished: 0.972972973, minParticipation: 1, maxParticipation: 10, schedule: "round_based", enabled: true }),
];

export function getGameDefinition(id: string) {
  return GAME_REGISTRY.find((game) => game.id === id);
}

export function getEnabledGameDefinitions() {
  return GAME_REGISTRY.filter((game) => game.enabled && game.status !== "DISABLED");
}
