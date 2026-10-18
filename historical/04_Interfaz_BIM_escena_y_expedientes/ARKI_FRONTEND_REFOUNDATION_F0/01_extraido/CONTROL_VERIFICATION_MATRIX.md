# Control verification matrix — F0

The shell controls were verified through the production browser snapshot. Page-specific actions remain owned by their existing components and are not represented as verified merely because they are visible.

| Control class | Verification | Result | Evidence |
|---|---|---|---|
| Primary navigation | Route buttons render and expose `aria-current` on the active route | VERIFIED | `/control-center`, `/arki-design-funnel`, `/arki-bim-visor` snapshots |
| Project context | Active project code/version remains visible in `AppHeader` | VERIFIED | 4004 runtime browser output |
| Language | Spanish is the default option and visible labels are Spanish | VERIFIED | 4004 runtime browser output |
| Auth gate | Loading timeout resolves to authentication-required state; no bypass added | VERIFIED | `ArkiAppShell.tsx` |
| Design Funnel actions | Existing proposal, view and human-gate controls remain present | VERIFIED_VISIBLE / ACTIONS_NOT_EXHAUSTIVELY_RUN | Design Funnel snapshot |
| BIM controls | Import, interference detection and MEP coordination controls remain present | VERIFIED_VISIBLE / AUTH_REQUIRED_ON_INTERACTION | BIM snapshot; interaction redirected to real auth |
| Unknown controls | No fake success state is introduced by the shell | VERIFIED | Explicit status model and existing page boundaries |
