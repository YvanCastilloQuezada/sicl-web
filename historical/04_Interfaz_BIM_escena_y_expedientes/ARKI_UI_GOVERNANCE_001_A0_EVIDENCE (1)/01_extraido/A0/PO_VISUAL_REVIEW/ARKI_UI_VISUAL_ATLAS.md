# ARKI UI Visual Atlas — A0-V

> This atlas records what was actually observable during the run. It does not represent the intended or designed UI.

## Global finding

The browser reached the ARKI shell at the temporary preview URL, but the application remained at **“Cargando Architectural Intelligence Workspace…”**. The same result was observed for `/`, `/arki-design-funnel`, `/control-center`, and `/arki-generator`. No route-specific controls were visible, and the browser console contained no output during the check.

## Captured screens

### SCREEN-SHELL-001 — Global bootstrap

- Route: `/`
- State: `LOADING_BLOCKED`
- Screenshot: `screens/SCREEN-SHELL-001__root-loading.webp`
- Visible controls: none.
- Observed visual problems: LOADING_STATE_WEAK, PRIMARY_OBJECT_UNCLEAR, ARCHITECTURAL_CONTENT_TOO_SMALL.
- Notes: ARKI wordmark and Cargando Architectural Intelligence Workspace… are visible. No route controls are exposed. The page remains in the bootstrap shell.

### SCREEN-DF-001 — Design Funnel

- Route: `/arki-design-funnel`
- State: `LOADING_BLOCKED`
- Screenshot: `screens/SCREEN-DF-001__design-funnel-loading.webp`
- Visible controls: none.
- Observed visual problems: LOADING_STATE_WEAK, ARCHITECTURAL_CONTENT_TOO_SMALL.
- Notes: The route does not reach the Design Funnel surface. No proposals, cost panel, architecture panel, or inspector are visible.

### SCREEN-CC-001 — Control Center

- Route: `/control-center`
- State: `LOADING_BLOCKED`
- Screenshot: `not available`
- Visible controls: none.
- Observed visual problems: LOADING_STATE_WEAK, PRIMARY_ACTION_UNCLEAR.
- Notes: Navigation returned the same global loading shell. No raw screenshot path was exposed by the browser capture result for this navigation.

### SCREEN-GEN-001 — Parametric Generator

- Route: `/arki-generator`
- State: `LOADING_BLOCKED`
- Screenshot: `screens/SCREEN-GEN-001__generator-loading.webp`
- Visible controls: none.
- Observed visual problems: LOADING_STATE_WEAK, PRIMARY_ACTION_UNCLEAR.
- Notes: The route does not reach the generator controls. No family, variant, parameter, or export controls are visible.

## Uncaptured product surfaces

34 of the 38 inventoried routes were not captured as route-specific screens. They remain `NOT_CAPTURED_BOOTSTRAP_BLOCKED` in `UI_SCREEN_REGISTRY.json`. No screenshot was manufactured for them.

