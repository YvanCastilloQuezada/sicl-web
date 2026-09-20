# ARKI — P9.4→P9.x Evidence-to-Learning Experimental Report

## Final state

P9_EVIDENCE_ACQUISITION = RESOLVED_FOR_EXPERIMENT
P9_PROJECT_DISCOVERY = PROJECT_DISCOVERY
P9_LEARNING_CANDIDATE = K2_CANDIDATE
P9_TRANSFER = ADAPT
P9_COUNTEREXAMPLE = SCOPE_REFINED
P9_GENERALIZATION = G1
P9_AUTONOMY = L9_COMPARES
P9_EPISTEMIC_STATE = PROJECT_ONLY_CANDIDATE / HUMAN_REVIEW_REQUIRED

## Selected UNKNOWN

- B-unknown-capacity: ¿Cuál es el perfil de ocupación y demanda de uso?
- Resolution path: Controlled scenario fixture with occupancy, staffing, equipment and event profile; never treated as real project fact.

## Evidence

- P9.4-E-001: SYNTHETIC_EXPERIMENTAL_EVIDENCE
- Supports: 36 participants; 2 staff; repair-learning equipment zone; high-demand event profile
- Does not support: real occupancy fact; regulatory compliance; permit approval; safe egress certification; universal architectural rule
- Validation: VALID_FOR_SCOPE

## Impact and propagation

- Impact: EVALUATION_ONLY; DIRECT_EFFECT.
- Before: CAPACITY=UNKNOWN; route compliance=UNKNOWN; geometry frozen
- After: CAPACITY=RESOLVED_FOR_EXPERIMENT; route compliance=UNKNOWN; geometry unchanged
- New deficits: Route width and egress capacity remain unknown; Regulatory applicability remains specialist-dependent

## Discovery and challenge

- Candidate: Occupancy profile is a project-specific dependency of the represented public route under the tested Project B scenarios.
- Derivation: Interaction among frozen project activities, existing route geometry, synthetic occupancy evidence and P9.4 reevaluation.
- Variant: CHANGES; The observation persists as a capacity dependency but the exact threshold is not generalized.
- Transfer: ADAPT; The dependency concept may be adapted as an evaluation prompt, but Project B's threshold and route evidence do not transfer; restaurant-specific aforo and RNE evidence are required.
- Counterexample: Supported only as a project-specific relationship between an occupancy scenario and represented route evaluation; not a universal route rule.

## Learning decision

- P9.4-CAPACITY-ROUTE-DEPENDENCY: K0_ABSENT → K2_CANDIDATE
- Class: L2_RELATIONSHIP; delta: ADD; generalization: G1.
- No automatic K1 promotion, winner, regulatory approval or architectural approval.

## Q1–Q16 summary

1. Q1: Yes, capacity was resolved for the controlled experiment.
2. Q2: Yes, the project evaluation state changed.
3. Q3: Evaluation only; geometry did not change.
4. Q4: Yes, a project-specific route-capacity observable emerged.
5. Q5: Yes, it was absent from frozen K0.
6. Q6: It emerged from project interaction, not retrieval or encoding.
7. Q7: Yes, PROJECT_ONLY.
8. Q8: Yes, K2_CANDIDATE.
9. Q9: It changed under a nearby occupancy variant.
10. Q10: Adaptation only; no threshold transfer.
11. Q11: Yes, spatial counterexample refined scope.
12. Q12: K2_CANDIDATE / PROJECT_ONLY.
13. Q13: L2 relationship.
14. Q14: G1 only.
15. Q15: No; L10 generalization was not demonstrated.
16. Q16: Human architect must decide evidence acceptance, geometry, regulation, specialist review and any project action.

NEXT_STEP_READY
