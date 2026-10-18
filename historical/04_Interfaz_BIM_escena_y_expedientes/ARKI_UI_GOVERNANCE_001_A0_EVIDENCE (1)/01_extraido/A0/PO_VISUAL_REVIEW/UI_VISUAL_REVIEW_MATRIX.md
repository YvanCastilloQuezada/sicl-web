# UI Visual Review Matrix — A0-V

> **Mode:** audit-only, read-only. No visual or product repair was performed.

| Screen ID | Area | Route | State | Screenshot | Purpose | Visible result | Visual issues |
|---|---|---|---|---|---|---|---|
| SCREEN-SHELL-001 | Global bootstrap | `/` | LOADING_BLOCKED | [open](screens/SCREEN-SHELL-001__root-loading.webp) | Verify current route surface | ARKI wordmark and Cargando Architectural Intelligence Workspace… are visible. No route controls are exposed. The page remains in the bootstrap shell. | LOADING_STATE_WEAK, PRIMARY_OBJECT_UNCLEAR, ARCHITECTURAL_CONTENT_TOO_SMALL |
| SCREEN-DF-001 | Design Funnel | `/arki-design-funnel` | LOADING_BLOCKED | [open](screens/SCREEN-DF-001__design-funnel-loading.webp) | Verify current route surface | The route does not reach the Design Funnel surface. No proposals, cost panel, architecture panel, or inspector are visible. | LOADING_STATE_WEAK, ARCHITECTURAL_CONTENT_TOO_SMALL |
| SCREEN-CC-001 | Control Center | `/control-center` | LOADING_BLOCKED | NOT_AVAILABLE | Verify current route surface | Navigation returned the same global loading shell. No raw screenshot path was exposed by the browser capture result for this navigation. | LOADING_STATE_WEAK, PRIMARY_ACTION_UNCLEAR |
| SCREEN-GEN-001 | Parametric Generator | `/arki-generator` | LOADING_BLOCKED | [open](screens/SCREEN-GEN-001__generator-loading.webp) | Verify current route surface | The route does not reach the generator controls. No family, variant, parameter, or export controls are visible. | LOADING_STATE_WEAK, PRIMARY_ACTION_UNCLEAR |

## Coverage

- Total routes discovered: **38**.
- Route surfaces with authentic visual evidence: **4**.
- Raw screenshots preserved: **3**.
- Routes not captured: **34**.
- Reason: the same global bootstrap loading shell remained active; capturing route-specific controls would require a repair and would violate A0-V.

