# ARKI Three-Layer Architecture v1 — Implementation Note

ARKI remains one product, one application and one canonical knowledge/project-state system. The separation is architectural:

- **EDGE** interacts, previews and degrades gracefully.
- **BRAIN** explores, reasons, evaluates and generates candidates.
- **CORE/TRUST** validates and commits canonical state.
- **HUMAN** decides whenever the operation requires human authority.

The contract is implemented in `server/arkiThreeLayerArchitecture.ts`. It defines allowed dependencies, authority rules, epistemic promotion guards, core operations and a vertical proof harness.

The implementation reuses the existing SICL command catalog and Unified Motor. It does not create another language, another motor, another application or another knowledge truth.

## Invariants

`EDGE_CANNOT_SILENTLY_COMMIT`, `BRAIN_CANNOT_SILENTLY_DECIDE`, `CORE_DOES_NOT_NEED_UI_OR_WEBXR`, `ONE_CANONICAL_PROJECT_STATE`, `HUMAN_AUTHORITY_FINAL` and `UNKNOWN_NEVER_SILENTLY_BECOMES_FACT` are executable contract assertions.

## Vertical proof

`USER → EDGE → PARAMETRIC_EXPLORE → BRAIN_ANALYSIS → USER_APPLY → COMMAND_RESOLUTION → CORE_VALIDATION → PROJECT_STATE → HISTORY → CLOSE → REOPEN`

The preview is explicitly non-committing. Brain output is explicitly generated and requires a Core commit. Core commit is canonical and produces history. Reopen returns the same canonical marker.

## Scope boundary

Sentinel, Red, new AI engines, new AR engines, autonomous learning, new SICL commands and production infrastructure remain outside this order.
