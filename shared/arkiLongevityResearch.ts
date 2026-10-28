/**
 * ARKI Longevity Research Module
 * 
 * Este módulo documenta el estado de la investigación de longevidad biológica.
 * Está EXPLÍCITAMENTE FUERA DE ALCANCE del proyecto ARKI actual.
 * 
 * Basado en: ARKI_LONGEVITY_RESEARCH_PROPOSAL.md
 */

export const ARKI_LONGEVITY_RESEARCH = {
  schema: "ARKI-LONGEVITY-RESEARCH-1.0",
  status: "OUT_OF_SCOPE",
  scope: "RESEARCH_ONLY",
  source: "ARKI_LONGEVITY_RESEARCH_PROPOSAL.md",
  proposalStatus: "PROPOSAL_NOT_ACTIVE",
  ethicalBoundaries: [
    "No ofrecer tratamientos no validados.",
    "Requiere supervisión profesional.",
    "Requiere evidencia científica.",
    "No es parte del producto ARKI actual."
  ],
  integration: "NONE"
} as const;

/**
 * Verifica si la investigación de longevidad está activa.
 * Siempre devuelve false, porque está fuera de alcance.
 */
export function isLongevityResearchActive(): boolean {
  return false;
}

/**
 * Obtiene el estado de la investigación de longevidad.
 */
export function getLongevityResearchStatus(): {
  status: string;
  scope: string;
  integration: string;
  boundaries: readonly string[];
} {
  return {
    status: ARKI_LONGEVITY_RESEARCH.status,
    scope: ARKI_LONGEVITY_RESEARCH.scope,
    integration: ARKI_LONGEVITY_RESEARCH.integration,
    boundaries: ARKI_LONGEVITY_RESEARCH.ethicalBoundaries
  };
}
