# Source ↔ build trace

The current source and production build correspond for the 12 direct lazy imports: each source module exists, has a default export, and has a hashed production chunk with the matching basename. The build was regenerated during A1.0 with `pnpm build` and exited `0`. The entry bundle was `dist/public/assets/index-DNwvu7b4.js` at trace time.

`/arki` and `/audit` were classified by A0 as `BLOCKED_LAZY`, but their immediate route declarations point to `HashWorkspaceRoute` and `AuditRoute`, not direct lazy imports. Their nested paths must be traced separately in any later wave; A1.0 does not repair or reclassify product code.
