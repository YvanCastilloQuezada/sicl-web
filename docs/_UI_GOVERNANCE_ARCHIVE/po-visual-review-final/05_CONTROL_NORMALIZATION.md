# Control normalization

The static A0 registry contains **1336 static occurrences**. That number is not treated as the number of actual user-facing controls.

| Field | Result |
|---|---|
| STATIC_CONTROL_OCCURRENCES | 1336 |
| UNIQUE_CONTROL_DEFINITIONS | 615 |
| SHARED_COMPONENT_DEFINITIONS | 63 |
| RUNTIME_VISIBLE_CONTROL_INSTANCES | 0 element inventory entries across captured route text |
| RUNTIME_REACHABLE_CONTROLS | UNKNOWN_UNTESTED_ACTIONS |
| RUNTIME_TESTED_CONTROLS | UNKNOWN; no broad action sweep was executed |
| SOURCE_ONLY_CONTROLS | Not safely subtractable because source IDs and browser instance IDs differ |
| NON_USER_FACING_HANDLERS | UNKNOWN / source registry evidence required |

Deduplication uses component, label, type and source location when available. Shared components are counted separately from instances. A visible button is not classified as functional unless its action was safely exercised and its outcome observed.
