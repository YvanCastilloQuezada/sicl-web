# Browser/runtime verification

Runtime used: fresh production process `NODE_ENV=production PORT=4002 node dist/index.js`, public URL `https://4002-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer`.

The exact 14 routes were navigated again. Browser markdown and screenshots were captured under `/home/ubuntu/page_texts/` and `/home/ubuntu/screenshots/`; representative timed console outputs are preserved in `/home/ubuntu/console_outputs/`.

Key observations:

- `/arki-book`: meaningful `ARKI · LIBRO VIVO` render observed; 2/5/10/15-second timed checks were `RENDERED`.
- `/arki-research-review`: meaningful review UI and explicit permission message `You do not have required permission (10002)`.
- `/help/operations`: after 20 seconds, `Cargando módulo` was absent and the document had 29,537 characters including the operations manual; classified `RENDERED_SLOW`.
- `/security-events`: meaningful page and explicit admin permission/unavailable state.
- `/sources`: redirected to the Manus authentication page; classified `CONTROLLED_AUTH`.
- `/spatial`: meaningful explicit `Spatial representation unavailable` / `Core ... (503)` state; geometry was not fabricated.

No final route remained `UNKNOWN`, blank, or indefinitely suspended.
