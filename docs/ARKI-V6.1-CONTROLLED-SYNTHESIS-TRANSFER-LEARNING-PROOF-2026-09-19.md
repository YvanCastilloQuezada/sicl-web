# ARKI v6.1 — Controlled Synthesis, Transfer & Learning Proof

## Final status

**V6.1 = PARTIAL / PASS_WITH_OBSERVATIONS**

The experiment was executed against the v6.0 contracts without adding domain-specific repair engines. A partial result is intentional: unsupported capabilities remain not demonstrated.

## Baseline

- Repository: YvanCastilloQuezada/sicl-web
- Branch: feat/spatial-pilot-media-studio-v1
- Functional baseline: d47038d533b22368483cd7316a5c5239acfb0103
- Worktree during evaluation: DIRTY
- Baseline geometry: immutable; no mutation occurred.

## Central question

Can ARKI solve a structurally new case using prior knowledge without a domain-specific repair rule, while separating what it knew, received, reused, executed, adapted, inferred, learned, generalized and rejected?

**Result:** the current runtime can represent and guard the experiment, but it did not generate unseeded strategies or candidates. Therefore L5–L10 are not promoted.

## Cases A–F

| Case | Problem | Strategies generated | Candidates | Mutations | Re-evaluation | Comparison | Transfer | Generalization | Stop reason |
|---|---|---:|---:|---:|---|---|---|---|---|
| A_RESTAURANT_SOURCE | Incompatible dirty-return/service journey and public/operational restaurant conditions. | 0 | 0 | 0 | NOT_DEMONSTRATED | NOT_DEMONSTRATED | NOT_DEMONSTRATED | NOT_DEMONSTRATED | CAPABILITY GAP DETECTED: current v6.0 contract can classify and guard, but cannot generate unseeded strategies/candidates without a domain-specific implementation. |
| B_RESTAURANT_VARIANT | Materially changed geometry, capacity/demand and operating condition for a restaurant variant. | 0 | 0 | 0 | NOT_DEMONSTRATED | NOT_DEMONSTRATED | NOT_DEMONSTRATED | NOT_DEMONSTRATED | CAPABILITY GAP DETECTED: current v6.0 contract can classify and guard, but cannot generate unseeded strategies/candidates without a domain-specific implementation. |
| C_HOSPITAL_TRANSFER | Hospital journeys are incompatible and require a domain-specific clinical realization. | 0 | 0 | 0 | NOT_DEMONSTRATED | NOT_DEMONSTRATED | PARTIAL | NOT_DEMONSTRATED | CAPABILITY GAP DETECTED: current v6.0 contract can classify and guard, but cannot generate unseeded strategies/candidates without a domain-specific implementation. |
| D_LABORATORY_RESTRAINT | Laboratory/biosafety flow similarity with critical hazard, containment and specialist differences. | 0 | 0 | 0 | NOT_DEMONSTRATED | NOT_DEMONSTRATED | PARTIAL | NOT_DEMONSTRATED | CAPABILITY GAP DETECTED: current v6.0 contract can classify and guard, but cannot generate unseeded strategies/candidates without a domain-specific implementation. |
| E_PUBLIC_REALM_AUTHORITY | Accessible journey crosses the project boundary and depends on an external public realm under another authority. | 0 | 0 | 0 | NOT_DEMONSTRATED | NOT_DEMONSTRATED | NOT_DEMONSTRATED | NOT_DEMONSTRATED | CAPABILITY GAP DETECTED: current v6.0 contract can classify and guard, but cannot generate unseeded strategies/candidates without a domain-specific implementation. |
| F_MIXED_USE_CAPACITY | Shared capacity with overlapping demand and concurrency across mixed uses. | 0 | 0 | 0 | NOT_DEMONSTRATED | NOT_DEMONSTRATED | NOT_DEMONSTRATED | NOT_DEMONSTRATED | CAPABILITY GAP DETECTED: current v6.0 contract can classify and guard, but cannot generate unseeded strategies/candidates without a domain-specific implementation. |

### Strategy accounting

For every case:

- Strategies provided as input: none.
- Strategies retrieved: v6 cause model and transfer restraint contracts.
- Strategies generated: none.
- Strategies rejected: any fixture-specific repair strategy.
- Reason: the existing v6.0 runtime has no general unseeded strategy generator. Adding one only for these fixtures would violate the anti-hardcoding rule.

## Transfer matrix

| Source | Target | Decision | Evidence | Status |
|---|---|---|---|---|
| restaurant | hospital | ADAPT | Structural journey reasoning may transfer; clinical realization cannot be copied. | PARTIAL |
| restaurant | laboratory biosafety | DO_NOT_TRANSFER | Critical hazard/containment difference triggers restraint. | DEMONSTRATED |

The hospital case preserves only an abstract journey-separation reasoning and requires adaptation. The laboratory case rejects direct transfer because hazard, containment, process and specialist controls are critically different.

## Mandatory learning matrix

| Case | K0 | Observed | K1 | Status |
|---|---|---|---|---|
| A_RESTAURANT_SOURCE | v6.0 contracts | CAPABILITY GAP DETECTED: current v6.0 contract can classify and guard, but cannot generate unseeded strategies/candidates without a domain-specific implementation. | No promoted learning candidate | NOT_DEMONSTRATED |
| B_RESTAURANT_VARIANT | v6.0 contracts | CAPABILITY GAP DETECTED: current v6.0 contract can classify and guard, but cannot generate unseeded strategies/candidates without a domain-specific implementation. | No promoted learning candidate | NOT_DEMONSTRATED |
| C_HOSPITAL_TRANSFER | v6.0 contracts | CAPABILITY GAP DETECTED: current v6.0 contract can classify and guard, but cannot generate unseeded strategies/candidates without a domain-specific implementation. | No promoted learning candidate | NOT_DEMONSTRATED |
| D_LABORATORY_RESTRAINT | v6.0 contracts | CAPABILITY GAP DETECTED: current v6.0 contract can classify and guard, but cannot generate unseeded strategies/candidates without a domain-specific implementation. | No promoted learning candidate | NOT_DEMONSTRATED |
| E_PUBLIC_REALM_AUTHORITY | v6.0 contracts | CAPABILITY GAP DETECTED: current v6.0 contract can classify and guard, but cannot generate unseeded strategies/candidates without a domain-specific implementation. | No promoted learning candidate | NOT_DEMONSTRATED |
| F_MIXED_USE_CAPACITY | v6.0 contracts | CAPABILITY GAP DETECTED: current v6.0 contract can classify and guard, but cannot generate unseeded strategies/candidates without a domain-specific implementation. | No promoted learning candidate | NOT_DEMONSTRATED |

No learning candidate was promoted. Execution, retrieval and the supplied macroorder remain input or reasoning activity, not learning.

## Autonomy evidence

| Level | Status | Evidence |
|---|---|---|
| L0_RECEIVES | DEMONSTRATED | Receives and registers the v6.1 macroorder. |
| L1_REPRESENTS | DEMONSTRATED | Represents problems, unknowns, provenance and typed transfer. |
| L2_DETECTS | PARTIAL | Detects the capability gap and hardcoding risk; no new geometric deficit was generated. |
| L3_DIAGNOSES | PARTIAL | Produces cause hypotheses but not supported/verified causes for the six cases. |
| L4_EVALUATES | DEMONSTRATED | Applies hard gates, authority, epistemic and transfer controls. |
| L5_GENERATES_STRATEGIES | NOT_DEMONSTRATED | No unseeded strategy was generated; strategy list remains empty. |
| L6_GENERATES_CANDIDATES | NOT_DEMONSTRATED | No candidate was generated without a fixture-specific strategy. |
| L7_MUTATES_SYNTHESIZES | NOT_DEMONSTRATED | No mutation occurred; no domain repair engine was added. |
| L8_REEVALUATES | NOT_DEMONSTRATED | No candidate existed for dependency-scoped reevaluation. |
| L9_COMPARES | PARTIAL | Transfer and restraint contracts compare domains, but no generated candidates were compared. |
| L10_GENERALIZES | NOT_DEMONSTRATED | Required persistence, positive transfer and generated adaptation evidence are absent. |

## Triple propagation and consistency

- Runtime / knowledge: NOT_PROMOTED: contract evaluation only
- Curriculum: REGISTERED / NOT_LEARNED
- Digital Book: REGISTERED / HUMAN_REVIEW_REQUIRED
- Runtime ↔ Curriculum ↔ Book consistency: **DEMONSTRATED**

The v6.1 delta was registered automatically in the delta registry, the three-volume curriculum index and the Digital Book index. The claims remain aligned: researched/contracted, not learned or generalized.

## Regressions and hard gates

- Software regression: the v6.1 focused suite passed; no v6.0 contract was replaced.
- Knowledge regression: no promotion occurred; history was preserved.
- Reasoning regression: unsupported L5–L10 claims were not emitted.
- Geometry regression: no mutation occurred; baseline remained immutable.
- Epistemic regression: UNKNOWN and NOT_DEMONSTRATED were preserved.
- Regulatory regression: no regulatory claim was generated.
- Hard gates: UNKNOWN was not treated as PASS, FAIL or a penalty; authority boundary blocked external mutation.

## Required capability gap

**CAPABILITY GAP DETECTED.** The current architecture has contracts for cause, design move, transfer and learning evidence, but lacks a general strategy generator that can produce unseeded strategies from a new problem and then construct candidates through canonical operators. The minimum general capability would be a provenance-bearing strategy synthesis layer connected to existing DesignMove/operator/mutation contracts, followed by dependency-scoped reevaluation and persistence tests. No domain-specific repair engine was created.

## Required final statuses

```text
STRATEGY_GENERATION = NOT_DEMONSTRATED
CANDIDATE_GENERATION = NOT_DEMONSTRATED
SYNTHESIS = NOT_DEMONSTRATED
REEVALUATION = NOT_DEMONSTRATED
COMPARISON = PARTIAL
POSITIVE_TRANSFER = PARTIAL
TRANSFER_RESTRAINT = DEMONSTRATED
PERSISTENCE = NOT_DEMONSTRATED
GENERALIZATION = NOT_DEMONSTRATED
KNOWLEDGE_REGRESSION = PASS_WITH_OBSERVATIONS
REASONING_REGRESSION = PASS
TRIPLE_PROPAGATION = DEMONSTRATED
RUNTIME_CURRICULUM_BOOK_CONSISTENCY = DEMONSTRATED
HUMAN_AUTHORITY = DEMONSTRATED
```

## Human authority remains required

The result does not authorize automatic canonization, project mutation, winner selection, professional certification or deployment. A truthful `NOT_DEMONSTRATED` is retained as the valid scientific outcome.

