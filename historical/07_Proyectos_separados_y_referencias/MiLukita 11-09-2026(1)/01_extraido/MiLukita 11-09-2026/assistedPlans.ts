export const ASSISTED_PLAN_GAME_TYPES = ["loteria_29", "loteria_39", "loteria_49", "loteria_59"] as const;
export type AssistedPlanGameType = (typeof ASSISTED_PLAN_GAME_TYPES)[number];

export const ASSISTED_PLAN_DEFINITIONS = [
  { code: "semana_4", name: "Plan semanal", durationWeeks: 1, confirmationsIncluded: 4, discountPercent: 0 },
  { code: "mes_16", name: "Plan mensual", durationWeeks: 4, confirmationsIncluded: 16, discountPercent: 10 },
  { code: "trimestre_48", name: "Plan trimestral", durationWeeks: 12, confirmationsIncluded: 48, discountPercent: 20 },
  { code: "semestre_96", name: "Plan semestral", durationWeeks: 24, confirmationsIncluded: 96, discountPercent: 30 },
  { code: "anual_192", name: "Plan anual", durationWeeks: 48, confirmationsIncluded: 192, discountPercent: 40 },
] as const;

export type AssistedPlanCode = (typeof ASSISTED_PLAN_DEFINITIONS)[number]["code"];

export function getAssistedPlanDefinition(code: string) {
  return ASSISTED_PLAN_DEFINITIONS.find((plan) => plan.code === code);
}

export function isAssistedPlanGameType(gameType: string): gameType is AssistedPlanGameType {
  return (ASSISTED_PLAN_GAME_TYPES as readonly string[]).includes(gameType);
}

export const ASSISTED_PLAN_DISCLOSURE = "El plan guarda una selección y un descuento virtual. Cada boleto requiere confirmación explícita; no existen débitos automáticos, cobros reales ni renovaciones automáticas.";
