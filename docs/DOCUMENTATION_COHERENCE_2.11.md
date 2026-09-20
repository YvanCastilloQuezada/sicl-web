# Documentación vigente del frontend ARKI

El frontend presenta el Core, no sustituye sus invariantes. `Guided Mode` es la experiencia inicial; `Expert Mode` es configurable. Help Center, Command Bar, mapa de módulos, formularios y tour inicial son capacidades de aprendizaje.

Las llamadas externas pasan por `server/coreHttpClient.ts`. `SICL_CORE_SERVICE_TOKEN` es server-side. Si falta `SICL_CORE_URL`, se muestra un estado de infraestructura no configurada.

Los manuales descargables se sincronizan desde `sicl-core/docs` mediante `scripts/sync-manuals.sh`. Los PDFs publicados en `client/public/manuals/` corresponden al último baseline sincronizado.

La integración vigente del Core incluye RFC-027 BIM/IFC, RFC-028 GIS/Catastro y RFC-029 Ollama. El frontend debe representar `PREVIEW_ONLY` y `HUMAN_REVIEW_REQUIRED` sin convertirlos en ejecuciones automáticas.

Documentos de primera lectura:

- `ARKI_FIRST_CONTACT_MANUAL.md`
- `HELP_SYSTEM.md`
- `COMMAND_BAR.md`
- `USER_MANUAL.md`
- `RFC-023_CORE_CONNECTIVITY_AND_DEPLOYMENT.md`
- `PROJECT_CLOSURE_REPORT.md`


## Auditoría RFC-015–026

La matriz vigente del Core se encuentra en `SICL Core current architecture matrix`. En particular, `monte_carlo_v1`, el filtro `feasible_pareto_front`, la generación evolutiva, las variables por escala, el corpus RNE y el Design Knowledge Agent deben presentarse como capacidades analíticas o de consulta, nunca como decisiones automáticas. RFC-019 de alias localizados es independiente del RFC-019 de escalas del Core.
