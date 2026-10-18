# ARKI-BOOK Deep Inventory

## Alcance y baseline

Auditoría **READ-ONLY** contra `YvanCastilloQuezada/sicl-web`, `main@a565a90952c5b219e97f73607ff32db29bf8712d`. `HEAD == origin/main`; el worktree tiene seis documentos no rastreados preexistentes bajo `docs/arki-inventory/` y no tiene archivos versionados modificados. No se escribieron código, corpus, schemas, base de datos, estados, checkpoints, commits, push ni deploy.

**Regla epistemológica:** documentación no equivale a implementación; implementación no equivale a demostración; ejecución o retrieval no equivalen a aprendizaje; transferencia no equivale a generalización; una mención tipológica no equivale a conocimiento ni a capacidad de diseño profesional. La autoridad final permanece en Product Owner, Chief Architect y profesionales especialistas según el tipo de decisión.

**Evidencia transversal:** `package.json` declara `check`, `test`, `build` y `start`; `client/src/App.tsx` expone las rutas; `server/routers.ts` contiene `appRouter`; `server/siclCore.ts` define snapshots, knowledge, reviews, decisions y reasoning executions; `server/arkiD62ReasoningHarness.ts` y `server/arkiD63GeometricBridge.ts` implementan los puentes locales. El checkpoint registrado en `docs/arki-l2/ARKI-L2-TRANSFER-RUNTIME.md` reporta 177/177 tests, TypeScript y build PASS, pero la presente auditoría no trató un reporte histórico como ejecución fresca.

## Evidencia, límites y autoridad humana

**Evidencia runtime:** los símbolos, rutas y pruebas locales citados demuestran contratos compilables o microcasos controlados; no se verificó un servidor HTTP vivo, navegación E2E ni escritura remota del SICL Core. **Evidencia histórica:** manifests y reportes D6.1–D6.4, E1-K y L2 corresponden a checkpoints que pueden tener HEAD distinto del baseline actual; se reutilizan como linaje, no como ejecución actual. **Estados canónicos:** se conservan literalmente estados como `DEMONSTRATED_PARTIAL`, `DEMONSTRATED_LOCAL`, `HISTORICAL_ONLY`, `FROZEN_BASELINE`, `NOT_VERIFIED`, `BLOCKED`, `UNKNOWN`, `AI_PROPOSED` y `K2_CANDIDATE` sin elevarlos.

**Limitaciones:** la evidencia local no prueba despliegue, rendimiento, conocimiento generalizado, validez normativa, constructibilidad, licencia profesional ni persistencia canónica remota. **Autoridad humana:** Product Owner y Chief Architect deciden alcance y aceptación; Human Architect y especialistas resuelven UNKNOWN, revisan geometría, normativa y uso profesional; la promoción de conocimiento y la aprobación de decisiones requieren revisión humana explícita. Esta auditoría no autoriza conexiones ni implementación.


## Inventario actual

`/arki-book` está declarado en `client/src/App.tsx`; `DashboardLayout.tsx` navega a él. `ArkiBookPage.tsx` define tres volúmenes, perfiles, acceso `PUBLIC|INTERNAL_ONLY`, filtros, capítulos y preferencias locales de tema/escala. `client/src/pages/arki-book.test.ts` verifica 23 capítulos tipológicos públicos, volúmenes, acceso interno, índice y controles de lectura.

| Elemento | Estado | Evidencia | Límite |
|---|---|---|---|
| Books/volumes/chapters/profiles | UI EXISTS + CONTENT EXISTS | `BOOK_VOLUMES`, `TYPOLOGY_CHAPTERS`, test | contenido embebido, no CMS/Core |
| Typologies | CONTENT EXISTS | 23 capítulos III-T | mención no es knowledge |
| Questions/evaluation/scoring | NOT_FOUND | no hooks/API/records en página/test | no assessment verificable |
| Progression/user state | NOT_FOUND | sólo localStorage de tema/escala | no learner state |
| Adaptive tutor | NOT_VERIFIED/NOT_FOUND | no contrato de adaptación | no progresión |
| Voice tutor | NOT_FOUND | botón/evento y adapter separado | no transcripción consumida |
| Vision tutor | NOT_FOUND | acción de contexto visual | no tutor semántico |
| Capability verification | NOT_FOUND | no scoring/certificación | no profesionalización |
| Persistence | PARTIAL | preferencias localStorage; proyectos en SICL | Book no lee/escribe snapshot |
| Knowledge relationship | DISCONNECTED | M0-K y reasoning separados | no canonical owner/link |
| Project relationship | DEMONSTRATED_PARTIAL | workspace lo llama “Lectura independiente” | no projectId en Book |

## Lectura epistemológica

El Libro es una superficie editorial implementada. No debe tratarse como almacén canónico de M0-K, tutor, examen o aprendizaje. `docs/arki-inventory/ARKI_EXTENSION_POTENTIAL_MAP.md` propone un libro adaptativo futuro, pero la propuesta es documentación. `shared/arkiKnowledgeCorpusFoundation.ts` separa vistas/manuales de knowledge y exige `HUMAN_REVIEW_REQUIRED`.

**REUSE:** catálogo, contenido, navegación y perfiles. **CONNECT:** curriculum↔project/evaluation. **EXTEND:** assessment, progression, learner state y multimodalidad. **BUILD:** tutor adaptativo si faltan contratos. **RESEARCH:** pedagogía, scoring y capability verification. La autoridad editorial y de dominio sigue en Product Owner, Chief Architect y revisores humanos.

## Referencias
[1] `client/src/App.tsx`
[2] `client/src/components/DashboardLayout.tsx`
[3] `client/src/pages/ArkiBookPage.tsx`
[4] `client/src/pages/arki-book.test.ts`
[5] `client/src/components/ProjectWorkspace.tsx`
[6] `shared/arkiKnowledgeCorpusFoundation.ts`
[7] `docs/arki-inventory/ARKI_EXTENSION_POTENTIAL_MAP.md`
