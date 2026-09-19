# ARKI — D6.2R Contextual Strategy Synthesis

## Final gate

```text
D6.2A FOUNDATION = PASS
D6.2R L5 = DEMONSTRATED
D6.3 = NOT_EXECUTED_IN_THIS_CHECKPOINT
D6.4 = NOT_EXECUTED_IN_THIS_CHECKPOINT
D6.5 = NOT_EXECUTED_IN_THIS_CHECKPOINT
D7.0 = NOT_EXECUTED_IN_THIS_CHECKPOINT
```

The prior D6.2 blocked result remains preserved as history. This report records the subsequent contextual synthesis retest.

## Required report

- STRATEGIES PROVIDED = **0**
- STRATEGIC KNOWLEDGE RETRIEVED = **5**
- POTENTIAL STRATEGIES = **5**
- APPLICABLE STRATEGIES = **4**
- CONTEXTUAL STRATEGIES GENERATED = **4**
- REJECTED = **1**
- UNKNOWN EFFECTS / ASSUMPTIONS = **preserved on every contextual strategy**
- PROVENANCE = **complete**

## Distinction of stages

```text
STRATEGIC KNOWLEDGE ≠ RETRIEVAL ≠ APPLICABILITY ≠ CONTEXTUAL SYNTHESIS
```

Retrieved knowledge is the generic registry. Applicable strategies are the subset passing the current checks. Contextual strategies are generated hypotheses that bind source knowledge to the current cause, required effect, conditions, authority and mutability. They remain `HYPOTHESIS`, not verified design decisions.

## Generic output

| Strategy | Family | Contextual hypothesis | Epistemic status | Unknowns |
|---|---|---|---|---|
| SK-SEPARATE-SPATIAL | SPATIAL | Reduce incompatible interaction by changing spatial separation or interface distance. Applied to the current deficit through SK-SEPARATE-SPATIAL under interaction, journey, mutable interface, simultaneous demand; verify the required effect before any design move or mutation. | HYPOTHESIS | secondary flow interaction; regulatory consequence; Actual impact requires a later Design Move, candidate and verification. |
| SK-REROUTE-TOPOLOGICAL | TOPOLOGICAL | Reduce incompatible interaction by changing relationships, sequence or route connectivity without presupposing a room solution. Applied to the current deficit through SK-REROUTE-TOPOLOGICAL under interaction, journey, mutable interface, simultaneous demand; verify the required effect before any design move or mutation. | HYPOTHESIS | downstream scenario effects; accessibility impact; Actual impact requires a later Design Move, candidate and verification. |
| SK-CONTROL-ACCESS | CONTROL | Reduce incompatible interaction by changing access, permission or interface control. Applied to the current deficit through SK-CONTROL-ACCESS under interaction, journey, mutable interface, simultaneous demand; verify the required effect before any design move or mutation. | HYPOTHESIS | behavioral adaptation; equity/accessibility impact; Actual impact requires a later Design Move, candidate and verification. |
| SK-ALLOCATE-RESOURCE | ALLOCATIVE | Reduce incompatible interaction by allocating capacity, resources or users across compatible channels. Applied to the current deficit through SK-ALLOCATE-RESOURCE under interaction, journey, mutable interface, simultaneous demand; verify the required effect before any design move or mutation. | HYPOTHESIS | actual demand response; secondary resource effects; Actual impact requires a later Design Move, candidate and verification. |

## Negative controls

| Control | Effect match | Applicability | Result |
|---|---|---|---|
| Mandatory simultaneous operation | YES for temporal family | REJECTED | temporal separation conflicts with simultaneous-use condition |
| External authority + immutable target | POTENTIAL EFFECT MATCH | REJECTED / NOT APPLICABLE | authority EXTERNAL_AUTHORITY is not accepted by this strategy; geometry mutability is insufficient |
| Unknown authority and mutability | POTENTIAL KNOWLEDGE | UNKNOWN / rejected conservatively | Applicability cannot be verified without authority and mutability evidence. |

The controls demonstrate that effect match is not applicability, external authority does not authorize mutation, and UNKNOWN is not invented away.

## L5 acceptance

```text
ZERO SUPPLIED STRATEGIES = PASS
GENERAL KNOWLEDGE INDEPENDENT OF BENCHMARK = PASS
REQUIRED EFFECT BRIDGE = PASS
EFFECT RETRIEVAL = PASS
APPLICABILITY EVALUATION = PASS
AUTHORITY CHECK = PASS
MUTABILITY CHECK = PASS
CONTEXTUALIZATION = PASS
PROVENANCE = PASS
NO TYPOLOGY DISPATCH = PASS
UNKNOWN EXPLICIT = PASS
STRATEGIC PLURALITY = PASS
L5 = DEMONSTRATED
```

## Learning boundary

- Strategic knowledge was supplied/formalized by the D6.2A implementation.
- Strategies were retrieved and contextualized by the runtime.
- New autonomous architectural knowledge learned = `NONE`.
- K1 promotion = `NONE`.
- Persistence = `NOT_TESTED_IN_THIS_CHECKPOINT`.

This is a system capability demonstration, not autonomous learning or architectural canonization.

## Next gate

D6.2R now permits the bridge to resume at D6.3 under the macroorder. D6.3 must transform contextual strategies into Design Moves, select and compose operators generally, and generate candidates without manually supplied final geometry. It is not executed in this checkpoint.
