# Documentación vigente del frontend SiMS-DeI

El frontend presenta el Core, no sustituye sus invariantes. `Guided Mode` es la experiencia inicial; `Expert Mode` es configurable. Help Center, Command Bar, mapa de módulos, formularios y tour inicial son capacidades de aprendizaje.

Las llamadas externas pasan por `server/coreHttpClient.ts`. `SICL_CORE_SERVICE_TOKEN` es server-side. Si falta `SICL_CORE_URL`, se muestra un estado de infraestructura no configurada.

Los manuales descargables se sincronizan desde `sicl-core/docs` mediante `scripts/sync-manuals.sh`. Los PDFs publicados en `client/public/manuals/` corresponden al último baseline sincronizado.

La integración vigente del Core incluye RFC-027 BIM/IFC, RFC-028 GIS/Catastro y RFC-029 Ollama. El frontend debe representar `PREVIEW_ONLY` y `HUMAN_REVIEW_REQUIRED` sin convertirlos en ejecuciones automáticas.

Documentos de primera lectura:

- `SIMS_DEI_FIRST_CONTACT_MANUAL.md`
- `HELP_SYSTEM.md`
- `COMMAND_BAR.md`
- `USER_MANUAL.md`
- `RFC-023_CORE_CONNECTIVITY_AND_DEPLOYMENT.md`
- `PROJECT_CLOSURE_REPORT.md`
