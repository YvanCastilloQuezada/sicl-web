export const GUIDED_CATALOGS = {
  spatialScopes: ["PAIS", "MACRO_REGION", "REGION", "PROVINCIA_METROPOLI", "DISTRITO_CIUDAD", "ZONA_BARRIO_SECTOR", "PARCELA_SITIO", "EDIFICACION", "SISTEMA", "ESPACIO", "OBJETO"],
  temporalScopes: ["PROYECTO", "CORTO_PLAZO", "MEDIANO_PLAZO", "LARGO_PLAZO", "ESCENARIO_2030", "ESCENARIO_2040", "ESCENARIO_2050"],
  stages: ["DRAFT", "ACTIVE", "CLOSED"],
  epistemicStates: ["FACT", "ASSUMPTION", "PREFERENCE"],
  variableTypes: ["OBJECTIVE", "CONSTRAINT", "PARAMETER"],
  feasibilityStates: ["FEASIBLE", "INFEASIBLE", "UNKNOWN", "INSUFFICIENT_DATA"],
  evidenceTypes: ["DOCUMENT", "OBSERVATION", "MEASUREMENT", "SIMULATION", "TESTIMONY", "INFERENCE"],
  authorityLevels: ["PROJECT_OWNER", "AUTHORIZED_ACTOR", "REVIEWER", "OBSERVER"],
  actorRoles: ["ARCHITECT", "CLIENT", "ENGINEER", "ECONOMIST", "REGULATOR", "COMMUNITY", "SYSTEM"],
  recommendationStates: ["PROPOSED", "REVIEWED", "ACCEPTED", "REJECTED"],
  reviewStates: ["PENDING", "APPROVED", "REJECTED", "CONDITIONAL"],
  decisionStates: ["PROPOSED", "AUTHORIZED", "REJECTED", "SUPERSEDED"],
  simulationMethods: ["deterministic_basic_v1", "sensitivity_linear_v1", "monte_carlo_v1"],
  generationMethods: ["parametric_grid_v1", "pattern_variation_v1", "evolutionary_v1", "llm_assisted_v1"],
  commandFamilies: ["PROJECT", "FACT", "ASSUMPTION", "PREFERENCE", "OBJECTIVE", "CONSTRAINT", "VARIABLE", "EVIDENCE", "ALTERNATIVE", "EVALUATE", "COMPARE", "RECOMMEND", "HUMAN", "DECISION", "AUDIT"],
} as const;

export type GuidedCatalogKey = keyof typeof GUIDED_CATALOGS;
