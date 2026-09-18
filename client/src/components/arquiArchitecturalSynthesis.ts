import type { ArchitecturalProblem, ProblemItem } from "./arquiDesignProblem";

export type DriverBasis = "SITE" | "PROGRAM" | "USER" | "OBJECTIVE" | "CONSTRAINT" | "PREFERENCE" | "CONFIRMED_EVIDENCE" | "DESIGN_QUESTION" | "DERIVED_INTENT";
export type DesignDriver = { id: string; label: string; basis: string[]; basisKinds: DriverBasis[]; spatialScope: string };
export type ArchitecturalParti = {
  strategyId: string; organizingIdea: string; spatialStructure: "CENTRAL" | "LINEAR" | "CLUSTERED" | "PERIMETER" | "STACKED" | "HYBRID";
  massVoidConcept: string; circulationConcept: string; accessConcept: string; programDistributionConcept: string;
  siteRelationship: string; orientationConcept: string; verticalOrganization: string; transformationHints: string[];
  unresolvedQuestions: string[]; provenance: string[];
};
export type ArchitecturalStrategy = {
  id: string; name: string; family: "COURTYARD" | "LINEAR_BAR" | "COMPACT_VERTICAL";
  summary: string; designDrivers: string[]; moves: string[]; addressedTensions: string[]; addressedQuestions: string[];
  supportedObjectives: string[]; relevantConstraints: string[]; spatialPrinciples: string[]; expectedTradeoffs: string[];
  unknowns: string[]; knowledgeBasis: string[]; epistemicClass: "HYPOTHESIS"; parti: ArchitecturalParti;
  operationMapping: string[]; specialistRelevance: string[]; internallyCoherent: boolean; critique: string[];
};
export type ArchitecturalSynthesis = { readiness: ArchitecturalProblem["readiness"]; drivers: DesignDriver[]; strategies: ArchitecturalStrategy[]; sharedUnknowns: string[]; noWinner: true; noGeometryMutation: true; sourceProblemId: string; trace: string[] };

type TextItem = Pick<ProblemItem, "id" | "text" | "basis">;
const has = (items: TextItem[], pattern: RegExp) => items.filter((item) => pattern.test(item.text));
const firstText = (items: TextItem[], fallback: string) => items[0]?.text ?? fallback;
const unique = (items: string[]): string[] => items.filter((item, index) => items.indexOf(item) === index);

export function deriveDesignDrivers(problem: ArchitecturalProblem): DesignDriver[] {
  const scope = problem.spatialScope;
  const drivers: DesignDriver[] = [];
  const add = (id: string, label: string, items: TextItem[], kind: DriverBasis) => { if (items.length) drivers.push({ id, label, basis: items.slice(0, 3).map((item) => item.basis), basisKinds: [kind], spatialScope: scope }); };
  add("open-space", "Preserve or organize open space", has(problem.objectives, /open|abierto|vac[ií]o|courtyard|patio/i), "OBJECTIVE");
  add("compactness", "Balance compactness and openness", [...has(problem.preferences, /compact|huella|footprint|density|densidad/i), ...has(problem.constraints, /compact|huella|footprint|density|densidad/i)], "PREFERENCE");
  add("privacy", "Establish a public/private gradient", [...has(problem.preferences, /privacy|privacidad|private|privado/i), ...has(problem.objectives, /privacy|privacidad|private|privado/i)], "PREFERENCE");
  add("program-adjacency", "Organize program by adjacency and activity", problem.program, "PROGRAM");
  add("site-response", "Respond to known site and access conditions", problem.site, "SITE");
  add("tension-response", "Address unresolved project tensions", problem.tensions.map((item) => ({ id: item.id, text: item.statement, basis: item.basis.join("+") })), "DESIGN_QUESTION");
  if (problem.intent) drivers.push({ id: "derived-intent", label: "Translate the derived architectural intent into a spatial hypothesis", basis: problem.intent.basis, basisKinds: ["DERIVED_INTENT"], spatialScope: scope });
  return drivers;
}

function partiFor(family: ArchitecturalStrategy["family"], id: string, problem: ArchitecturalProblem, drivers: DesignDriver[]): ArchitecturalParti {
  const unknowns = problem.unknown.map((item) => item.text);
  const questions = problem.designQuestions.map((item) => item.question);
  const scope = problem.spatialScope;
  const base = { strategyId: id, accessConcept: problem.site.length ? "Access follows known site conditions; exact entry remains a hypothesis." : "Access point requires site confirmation.", orientationConcept: problem.site.length ? "Orient conceptually to documented site/context information only." : "Orientation requires verified site information.", verticalOrganization: problem.program.length ? "Vertical distribution remains conceptual; no floor-count mutation." : "Not determined because program data is incomplete.", unresolvedQuestions: questions, provenance: [...problem.sourceEvidenceIds, ...problem.objectives.map((x) => x.basis), ...problem.constraints.map((x) => x.basis)] };
  if (family === "COURTYARD") return { ...base, organizingIdea: "Perimeter mass around a protected shared void.", spatialStructure: "PERIMETER", massVoidConcept: "Occupied perimeter frames a central void without claiming performance.", circulationConcept: "A transition layer around the shared void links program zones.", programDistributionConcept: "More public uses toward the active edge; more private uses toward the protected interior.", siteRelationship: `Relate the perimeter concept to the known ${scope} context; verify edges before realization.`, transformationHints: ["CREATE CENTRAL VOID", "CREATE COURTYARD", "BUFFER PUBLIC / PRIVATE"] };
  if (family === "LINEAR_BAR") return { ...base, organizingIdea: "A linear bar establishes a clear sequence between access, shared space and program bands.", spatialStructure: "LINEAR", massVoidConcept: "Open space is organized as a longitudinal gap rather than a central courtyard.", circulationConcept: "A spine sequences public-to-private movement.", programDistributionConcept: "Program is distributed in bands along the primary sequence.", siteRelationship: `Align the bar concept to documented access or edge information at ${scope}; do not invent an orientation.`, transformationHints: ["CREATE SPINE", "ALIGN TO EDGE", "FILTER PUBLIC / PRIVATE"] };
  return { ...base, organizingIdea: "A concentrated vertical core preserves more ground-level openness.", spatialStructure: "STACKED", massVoidConcept: "Solid is concentrated to release a larger conceptual ground void.", circulationConcept: "A central core organizes vertical movement; exact cores are not modeled.", programDistributionConcept: "Compatible functions may stack by level; required adjacency remains unresolved.", siteRelationship: `Concentrate the conceptual mass only as a response to stated openness or density drivers at ${scope}.`, transformationHints: ["CONCENTRATE VERTICAL MASS", "CREATE OPEN GROUND", "SEPARATE PUBLIC / SERVICE"] };
}

export function synthesizeArchitecturalStrategies(problem: ArchitecturalProblem): ArchitecturalSynthesis {
  const drivers = deriveDesignDrivers(problem);
  const sharedUnknowns = problem.unknown.map((item) => item.text);
  if (problem.readiness === "BLOCKED") return { readiness: problem.readiness, drivers, strategies: [], sharedUnknowns, noWinner: true, noGeometryMutation: true, sourceProblemId: problem.sourceProjectId ?? "unknown", trace: ["DESIGN_PROBLEM", "READINESS_BLOCKED", "NO_STRATEGY_GENERATED"] };
  const families: ArchitecturalStrategy["family"][] = ["COURTYARD", "LINEAR_BAR", "COMPACT_VERTICAL"];
  const strategies = families.map((family, index) => {
    const id = `strategy-${String.fromCharCode(65 + index).toLowerCase()}`;
    const parti = partiFor(family, id, problem, drivers);
    const addressedTensions = problem.tensions.map((tension) => tension.statement);
    const relevantConstraints = problem.constraints.map((item) => item.text);
    const supportedObjectives = problem.objectives.map((item) => item.text);
    const familyLabel = family === "COURTYARD" ? "Courtyard / protected void" : family === "LINEAR_BAR" ? "Linear bar / sequence" : "Compact vertical / released ground";
    const tradeoffs = family === "COURTYARD" ? ["Compactness may be reduced by the framed void.", "Privacy may improve conceptually while connectivity requires careful thresholds."] : family === "LINEAR_BAR" ? ["Clear sequence may constrain flexibility.", "Frontage and depth depend on verified site edges."] : ["Ground openness may increase dependence on vertical organization.", "Height and privacy tradeoffs require analysis and program confirmation."];
    const critique = [ ...(problem.unknown.length ? ["Some inputs remain unknown; this hypothesis must not be treated as a resolved design."] : []), ...(!problem.tensions.length ? ["No explicit project tension was available to test this strategy against."] : []) ];
    const strategy: ArchitecturalStrategy = { id, name: familyLabel, family, summary: `${parti.organizingIdea} This is a conceptual response to the current project problem.`, designDrivers: drivers.map((driver) => driver.id), moves: parti.transformationHints, addressedTensions, addressedQuestions: problem.designQuestions.map((q) => q.id), supportedObjectives, relevantConstraints, spatialPrinciples: [parti.spatialStructure, parti.massVoidConcept, parti.circulationConcept], expectedTradeoffs: tradeoffs, unknowns: sharedUnknowns, knowledgeBasis: [], epistemicClass: "HYPOTHESIS", parti, operationMapping: family === "COURTYARD" ? ["CREATE_COURTYARD", "SET_GAP"] : family === "LINEAR_BAR" ? ["CREATE_SPINE", "ALIGN_TO_EDGE"] : ["CONCENTRATE_VERTICAL_MASS", "CREATE_OPEN_GROUND"], specialistRelevance: ["BIOCLIMATIC", "STRUCTURAL", "REGULATORY"], internallyCoherent: true, critique };
    return strategy;
  });
  return { readiness: problem.readiness, drivers, strategies, sharedUnknowns, noWinner: true, noGeometryMutation: true, sourceProblemId: problem.sourceProjectId ?? "unknown", trace: ["DESIGN_PROBLEM", "ARCHITECTURAL_READING", "DESIGN_DRIVERS", "STRATEGIC_RESPONSES", "DESIGN_STRATEGY", "PARTI_HYPOTHESIS", "SPATIAL_PRINCIPLES"] };
}

export function modifyStrategy(strategy: ArchitecturalStrategy, instruction: string): ArchitecturalStrategy { return { ...strategy, id: `${strategy.id}-revised`, summary: `${strategy.summary} Human modification requested: ${instruction}`, epistemicClass: "HYPOTHESIS", critique: [...strategy.critique, "Revision remains a human-directed hypothesis; geometry was not mutated."], parti: { ...strategy.parti, unresolvedQuestions: [...strategy.parti.unresolvedQuestions, instruction], provenance: [...strategy.parti.provenance, "human.modification"] } } };
export function combineStrategies(primary: ArchitecturalStrategy, secondary: ArchitecturalStrategy): ArchitecturalStrategy { return { ...primary, id: `${primary.id}-plus-${secondary.id}`, name: `Hybrid: ${primary.name} + ${secondary.name}`, family: "COURTYARD", summary: `Hybrid hypothesis combining the organizing idea of ${primary.name} with the circulation concept of ${secondary.name}.`, moves: unique([...primary.moves, ...secondary.moves]), designDrivers: unique([...primary.designDrivers, ...secondary.designDrivers]), expectedTradeoffs: unique([...primary.expectedTradeoffs, ...secondary.expectedTradeoffs]), knowledgeBasis: unique([...primary.knowledgeBasis, ...secondary.knowledgeBasis]), critique: [...primary.critique, ...secondary.critique, "Combination preserves provenance from both source strategies."], parti: { ...primary.parti, strategyId: `${primary.id}-plus-${secondary.id}`, circulationConcept: secondary.parti.circulationConcept, provenance: unique([...primary.parti.provenance, ...secondary.parti.provenance, "human.combination"]) } }; }

export function answerStrategyQuestion(question: string, synthesis: ArchitecturalSynthesis): { answerKey: string; params?: Record<string, unknown> } { const q = question.toLowerCase(); if (/which is best|cu[aá]l es mejor|ganador|winner/.test(q)) return { answerKey: "arqui.synthesis_no_winner" }; if (/why|por qu[eé]|sentido/.test(q)) return { answerKey: "arqui.synthesis_trace_answer", params: { count: synthesis.strategies.length } }; if (/tradeoff|intercambio|tensi/.test(q)) return { answerKey: "arqui.synthesis_tradeoff_answer", params: { count: synthesis.strategies.length } }; return { answerKey: "arqui.synthesis_summary", params: { count: synthesis.strategies.length } }; }
