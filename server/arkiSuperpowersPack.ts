import { executeArkiUnifiedMotor, type UnifiedMotorInput, type UnifiedMotorResult } from "./arkiUnifiedMotor";

export type ConsequenceClass = "DIRECT" | "SECONDARY" | "TERTIARY" | "POSSIBLE" | "UNKNOWN";
export type SuperpowerStatus = "PASS_WITH_BOUNDS" | "PARTIAL";

export type ConsequenceItem = {
  id: string;
  class: ConsequenceClass;
  domain: string;
  statement: string;
  rationale: string;
  evidence: string[];
  requiresHumanReview: true;
};

export type ValueOfInformationItem = {
  unknown: string;
  impactScore: number;
  priority: "FIRST" | "NEXT" | "LATER";
  why: string;
  resolutionPath: string;
  evidence: string[];
};

export type DivergenceResult = {
  alternativeIds: string[];
  pairwise: Array<{ left: string; right: string; similarityScore: number; verdict: "ARCHITECTURALLY_DIFFERENT" | "LOW_DIVERGENCE" | "UNKNOWN"; differingDimensions: string[] }>;
  conclusion: "DIVERGENT_SET" | "LOW_DIVERGENCE_SET" | "INSUFFICIENT_EVIDENCE";
  humanReviewRequired: true;
};

export type ArchitecturalDebtItem = {
  id: string;
  decision: string;
  immediateBenefit: string[];
  futureLiabilities: string[];
  affectedHorizon: string;
  evidenceStatus: "FACT" | "PARTIAL" | "UNKNOWN";
  risk: "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN";
  mitigation: string;
  humanReviewRequired: true;
};

export type CounterfactualResult = {
  baselineDecision: string;
  scenarios: Array<{ id: string; variation: string; affectedDomains: string[]; expectedConsequences: string[]; status: "AI_PROPOSED"; evidence: string[] }>;
  comparisonBasis: string[];
  humanReviewRequired: true;
};

export type SuperpowersInput = UnifiedMotorInput & {
  change?: string;
  baselineDecision?: string;
  alternatives?: Array<{ id: string; parti?: string; topology?: string; relationships?: string[]; circulation?: string; section?: string; massing?: string; structure?: string }>;
  decisions?: Array<{ id: string; decision: string; benefit?: string[]; liabilities?: string[]; horizon?: string; evidenceStatus?: "FACT" | "PARTIAL" | "UNKNOWN" }>;
};

export type SuperpowersPackResult = {
  version: "ARKI-SUPERPOWERS-PACK-1.0";
  motor: UnifiedMotorResult;
  consequenceRadar: { change: string; items: ConsequenceItem[]; status: SuperpowerStatus };
  valueOfInformation: { rankedUnknowns: ValueOfInformationItem[]; status: SuperpowerStatus };
  designDivergence: DivergenceResult;
  architecturalDebt: { items: ArchitecturalDebtItem[]; status: SuperpowerStatus };
  counterfactualExplorer: CounterfactualResult;
  status: SuperpowerStatus;
  claim: "TRANSVERSAL_DECISION_SUPPORT_ONLY";
  humanAuthority: "FINAL";
};

const unique = (items: string[]) => Array.from(new Set(items.filter(Boolean)));
const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9áéíóúüñ]+/gi, " ").trim();

function consequenceRadar(input: SuperpowersInput): SuperpowersPackResult["consequenceRadar"] {
  const change = input.change?.trim() || "No se registró un cambio explícito; se analiza el estado actual.";
  const lower = normalize(change);
  const count = /\b(\d+)\b/.exec(lower)?.[1];
  const focus = /bus|pasaj|capacidad|aforo|occupancy|vehic/.test(lower) ? "capacity" : /presupuesto|cost|costo|budget/.test(lower) ? "cost" : /acceso|access|entrada/.test(lower) ? "access" : "project-state";
  const items: ConsequenceItem[] = [
    { id: "CR-01", class: "DIRECT", domain: focus === "capacity" ? "PROGRAM" : "PROJECT_STATE", statement: count ? `El cambio declara una variación cuantitativa de ${count}.` : `El cambio modifica ${focus}.`, rationale: "Se deriva literalmente del cambio suministrado.", evidence: ["USER_CHANGE", "PROJECT_INPUT"], requiresHumanReview: true },
    { id: "CR-02", class: "SECONDARY", domain: "FLOWS", statement: "Deben reevaluarse flujos, interfaces y capacidad operativa afectada.", rationale: "Las actividades, relaciones y condiciones del proyecto forman la red funcional.", evidence: ["ACTIVITIES", "RELATIONSHIPS", "CONDITIONS"], requiresHumanReview: true },
    { id: "CR-03", class: "TERTIARY", domain: "COST_AND_OPERATION", statement: "Puede cambiar el área, costo, operación, mantenimiento o energía.", rationale: "Son consecuencias plausibles, no medidas en este runtime.", evidence: ["UNKNOWN:SIMULATION", "UNKNOWN:COST"], requiresHumanReview: true },
    { id: "CR-04", class: "POSSIBLE", domain: "REGULATION_AND_SAFETY", statement: "Podrían cambiar evacuación, accesibilidad, normativa o estructura.", rationale: "No hay simulación ni verificación jurisdiccional ejecutada en el ciclo conceptual.", evidence: ["UNKNOWN:REGULATION", "UNKNOWN:STRUCTURE"], requiresHumanReview: true },
    { id: "CR-05", class: "UNKNOWN", domain: "UNRESOLVED", statement: "El impacto exacto permanece UNKNOWN hasta incorporar datos y pruebas específicas.", rationale: "No se debe convertir una propagación cualitativa en una afirmación de cumplimiento.", evidence: ["EPISTEMIC_BOUNDARY", "HUMAN_REVIEW_REQUIRED"], requiresHumanReview: true },
  ];
  return { change, items, status: input.change ? "PASS_WITH_BOUNDS" : "PARTIAL" };
}

function valueOfInformation(input: SuperpowersInput): SuperpowersPackResult["valueOfInformation"] {
  const unknowns = unique([...(input.unknowns ?? []), "Topografía exacta", "Acceso vial", "Aforo máximo", "Precios y costos locales"]);
  const rankedUnknowns = unknowns.map((unknown) => {
    const text = normalize(unknown);
    const impactScore = /topograf|acceso|aforo|capacidad|evacu|jurisdic|norm/.test(text) ? 94 : /costo|precio|presupuesto/.test(text) ? 68 : 24;
    const priority: ValueOfInformationItem["priority"] = impactScore >= 85 ? "FIRST" : impactScore >= 60 ? "NEXT" : "LATER";
    return { unknown, impactScore, priority, why: priority === "FIRST" ? "Puede cambiar decisiones de implantación, programa o seguridad." : "Su resolución reduce incertidumbre, pero no domina la estructura del problema.", resolutionPath: /topograf/.test(text) ? "LEVANTAMIENTO_TOPOGRAFICO" : /acceso/.test(text) ? "CONFIRMAR_ACCESO_Y_TRÁFICO" : /aforo|capacidad/.test(text) ? "VALIDAR_DEMANDA_Y_OPERACION" : /norm|jurisdic/.test(text) ? "FUENTE_OFICIAL_Y_REVISIÓN_PROFESIONAL" : "COTIZACIÓN_O_DATOS_DE_PROYECTO", evidence: ["UNKNOWN_REGISTER", "IMPACT_HEURISTIC"] };
  }).sort((a, b) => b.impactScore - a.impactScore);
  return { rankedUnknowns, status: "PASS_WITH_BOUNDS" };
}

function divergence(input: SuperpowersInput): DivergenceResult {
  const alternatives = input.alternatives ?? [
    { id: "A", parti: "spine", topology: "linear-separation", relationships: input.relationships.map((r) => `${r.from}-${r.to}`), circulation: "linear", section: "single", massing: "bar", structure: "regular" },
    { id: "B", parti: "hub", topology: "central-hub", relationships: input.relationships.map((r) => `${r.from}-${r.to}`), circulation: "central", section: "single", massing: "courtyard", structure: "regular" },
    { id: "C", parti: "rings", topology: "nested-rings", relationships: input.relationships.map((r) => `${r.from}-${r.to}`), circulation: "nested", section: "split-level", massing: "ring", structure: "regular" },
  ];
  const dimensions = (a: typeof alternatives[number], b: typeof alternatives[number]) => ["parti", "topology", "relationships", "circulation", "section", "massing", "structure"].filter((key) => JSON.stringify(a[key as keyof typeof a]) !== JSON.stringify(b[key as keyof typeof b]));
  const pairwise = alternatives.flatMap((left, index) => alternatives.slice(index + 1).map((right) => { const differingDimensions = dimensions(left, right); const similarityScore = Math.round((1 - differingDimensions.length / 7) * 100); return { left: left.id, right: right.id, similarityScore, verdict: differingDimensions.length >= 3 ? "ARCHITECTURALLY_DIFFERENT" as const : differingDimensions.length ? "LOW_DIVERGENCE" as const : "UNKNOWN" as const, differingDimensions }; }));
  return { alternativeIds: alternatives.map((item) => item.id), pairwise, conclusion: pairwise.length && pairwise.every((pair) => pair.verdict === "ARCHITECTURALLY_DIFFERENT") ? "DIVERGENT_SET" : pairwise.length ? "LOW_DIVERGENCE_SET" : "INSUFFICIENT_EVIDENCE", humanReviewRequired: true };
}

function debt(input: SuperpowersInput): SuperpowersPackResult["architecturalDebt"] {
  const decisions = input.decisions ?? [{ id: "AD-001", decision: input.baselineDecision ?? "No decisión explícita registrada", benefit: ["Simplificación o ahorro inmediato potencial"], liabilities: ["Conflicto operativo", "Dificultad de mantenimiento", "Limitación de expansión"], horizon: "YEAR_5_20", evidenceStatus: "PARTIAL" as const }];
  return { items: decisions.map((item) => ({ id: item.id, decision: item.decision, immediateBenefit: item.benefit ?? ["Beneficio inmediato no detallado"], futureLiabilities: item.liabilities ?? ["Liabilidad futura UNKNOWN"], affectedHorizon: item.horizon ?? "UNKNOWN", evidenceStatus: item.evidenceStatus ?? "UNKNOWN", risk: (item.liabilities?.length ?? 0) >= 2 ? "HIGH" : "UNKNOWN", mitigation: "Mantener abierta la decisión, medir la consecuencia y revisar antes de congelar." , humanReviewRequired: true })), status: decisions.length ? "PASS_WITH_BOUNDS" : "PARTIAL" };
}

function counterfactuals(input: SuperpowersInput): CounterfactualResult {
  const baselineDecision = input.baselineDecision ?? "Decisión actual no especificada; baseline = estado del proyecto recibido.";
  const scenarios = [
    ["CF-01", "Retirar el elemento organizador principal"], ["CF-02", "Cambiar a una organización lineal"], ["CF-03", "Aumentar la demanda o capacidad en 40%"], ["CF-04", "Bloquear el acceso principal"], ["CF-05", "Reducir el presupuesto en 25%"], ["CF-06", "Reducir el terreno o envolvente en 20%"], ["CF-07", "Invertir la orientación"], ["CF-08", "Duplicar la operación nocturna"],
  ].map(([id, variation]) => ({ id, variation, affectedDomains: ["PROGRAM", "FLOWS", "TOPOLOGY", "GEOMETRY", "COST", "OPERATION", "RISK"], expectedConsequences: ["Reevaluar relaciones y capacidad", "Comparar contra baseline", "Mantener UNKNOWN donde no exista simulación"], status: "AI_PROPOSED" as const, evidence: ["BASELINE_PROJECT_STATE", "COUNTERFACTUAL_HEURISTIC"] }));
  return { baselineDecision, scenarios, comparisonBasis: ["PROGRAM", "FLOWS", "TOPOLOGY", "GEOMETRY", "STRUCTURE", "CLIMATE", "REGULATION", "COST", "OPERATION", "RISK"], humanReviewRequired: true };
}

export function executeArkiSuperpowersPack(input: SuperpowersInput): SuperpowersPackResult {
  const motor = executeArkiUnifiedMotor(input);
  return { version: "ARKI-SUPERPOWERS-PACK-1.0", motor, consequenceRadar: consequenceRadar(input), valueOfInformation: valueOfInformation(input), designDivergence: divergence(input), architecturalDebt: debt(input), counterfactualExplorer: counterfactuals(input), status: "PASS_WITH_BOUNDS", claim: "TRANSVERSAL_DECISION_SUPPORT_ONLY", humanAuthority: "FINAL" };
}

export const SUPERPOWER_IDS = ["SP-01-CONSEQUENCE-RADAR", "SP-02-VALUE-OF-INFORMATION", "SP-03-DESIGN-DIVERGENCE", "SP-04-ARCHITECTURAL-DEBT", "SP-05-COUNTERFACTUAL-EXPLORER"] as const;

export function summarizeSuperpowers(result: SuperpowersPackResult) {
  return { version: result.version, ids: [...SUPERPOWER_IDS], status: result.status, consequenceItems: result.consequenceRadar.items.length, rankedUnknowns: result.valueOfInformation.rankedUnknowns.length, alternativesCompared: result.designDivergence.alternativeIds.length, debtItems: result.architecturalDebt.items.length, counterfactuals: result.counterfactualExplorer.scenarios.length, humanAuthority: result.humanAuthority, noProfessionalCompletionClaim: true };
}

export type { UnifiedMotorInput };
