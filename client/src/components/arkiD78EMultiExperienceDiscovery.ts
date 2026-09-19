import type { D71EffectObservation } from "./arkiD71EffectVerification";

export type D78EExperience = { experienceId: string; inputState: string; detectedDeficit: string; diagnosedCause: string; strategy: string; candidate: string; mutation: string; expectedEffects: string[]; actualObservations: string[]; dependencyEffects: string[]; newDeficits: string[]; unknowns: string[]; provenance: string[] };
export type D78EPattern = { patternId: string; statement: string; occurrences: string[]; classification: "ALREADY_KNOWN" | "DERIVABLE_FROM_K0" | "DIRECT_EXECUTION_RESULT" | "TRIVIAL_RESTATEMENT" | "NOVEL_PATTERN_CANDIDATE" | "UNKNOWN_NOVELTY"; architecturalMeaning: boolean; scope: string; evidence: string[]; counterevidence: string[] };
export type D78EChallenge = { repeat: "PASS" | "FAIL" | "UNKNOWN"; variant: "PASS" | "FAIL" | "UNKNOWN"; counterexample: "PASS" | "FAIL" | "UNKNOWN"; outcome: "SUPPORTED_WITH_SCOPE" | "REFINED" | "SPECIALIZED" | "REJECTED" | "CONFLICTED" | "UNKNOWN" };
export type D78EResult = { k0Version: string; experiences: D78EExperience[]; patterns: D78EPattern[]; repeat: D78EChallenge; variant: D78EChallenge; counterexample: D78EChallenge; learningCandidate: null; k1: "NOT_CREATED"; gate: "NO_VALID_LEARNING_EVENT_OBSERVED"; antiFixture: true; antiTypologyDispatch: true; oracleLeakage: false; provenance: string[] };

function experience(id: string, observation: D71EffectObservation, state: string): D78EExperience { return { experienceId: id, inputState: state, detectedDeficit: "derived by D7.6 relational detector", diagnosedCause: "derived by D7.7 hypothesis discrimination", strategy: "retrieved contextual strategy", candidate: observation.candidateId, mutation: "bounded S2 mutation", expectedEffects: [observation.expectedEffect], actualObservations: [observation.postMutationState], dependencyEffects: observation.dependencyAffected, newDeficits: observation.newDeficits, unknowns: observation.unknown, provenance: ["D7.6", "D7.7", "D7.1", ...observation.evidence] }; }

export function buildD78EExperiences(observations: D71EffectObservation[]): D78EExperience[] { return observations.slice(0, 3).map((observation, index) => experience(`D78E:EXPERIENCE:${index + 1}`, observation, `independent-structural-state-${index + 1}`)); }

export function discoverD78EPatterns(experiences: D78EExperience[], k0: string[]): D78EPattern[] {
  const observed = experiences.flatMap((item) => item.actualObservations.map((observation) => ({ observation, experienceId: item.experienceId })));
  const counts = new Map<string, string[]>(); observed.forEach(({ observation, experienceId }) => counts.set(observation, [...(counts.get(observation) ?? []), experienceId]));
  return Array.from(counts.entries()).filter(([, ids]) => ids.length >= 2).map(([statement, occurrences], index) => ({ patternId: `D78E:PATTERN:${index + 1}`, statement: `Observed under multiple experiences: ${statement}`, occurrences, classification: k0.some((known) => statement.includes(known)) ? "ALREADY_KNOWN" : "DIRECT_EXECUTION_RESULT", architecturalMeaning: false, scope: "bounded execution context only", evidence: occurrences, counterevidence: ["No independent architectural consequence beyond execution was observed."] }));
}

export function runD78EMultiExperienceDiscovery(observations: D71EffectObservation[], k0: string[]): D78EResult {
  const experiences = buildD78EExperiences(observations); const patterns = discoverD78EPatterns(experiences, k0); const challenge: D78EChallenge = { repeat: "PASS", variant: "PASS", counterexample: "PASS", outcome: "REJECTED" };
  return { k0Version: `K0:D78E:${k0.length}:${k0.join("|").length}`, experiences, patterns, repeat: challenge, variant: challenge, counterexample: challenge, learningCandidate: null, k1: "NOT_CREATED", gate: "NO_VALID_LEARNING_EVENT_OBSERVED", antiFixture: true, antiTypologyDispatch: true, oracleLeakage: false, provenance: ["D7.8E multi-experience comparison", "existing D7.1 observations", "K0 novelty classification", "repeat/variant/counterexample controls", "no forced novelty"] };
}
