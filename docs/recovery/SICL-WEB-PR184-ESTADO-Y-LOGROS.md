# SICL-WEB — Documentación de recuperación, estado y logros

**PR:** #184 — SYNC: Integrar 56 commits locales de sicl-web  
**Repositorio:** `YvanCastilloQuezada/sicl-web`  
**Rama de origen:** `sync/sicl-web-56-commits`  
**Destino:** `main`  
**Estado:** Draft / auditoría pendiente / no fusionado  
**Fecha de referencia:** 20 de noviembre de 2026

## 1. Propósito de este documento

Este documento preserva el contexto técnico de los 56 commits que se publicaron en la rama de sincronización, identifica los principales subsistemas desarrollados, resume los logros visibles en los mensajes de commit y en el inventario de archivos, y establece qué debe verificarse antes de integrar a `main`.

## 2. Situación de recuperación

- El push directo a `main` fue rechazado por la regla GH013: los cambios deben ingresar mediante Pull Request.
- No se hizo force-push ni se reescribió la historia.
- Se creó y publicó `sync/sicl-web-56-commits`.
- Se abrió el PR #184 como Draft.
- La rama local reportada tenía 56 commits por delante de `origin/main`, sin cambios sin commit y con el working tree limpio.
- El PR está disponible para revisión y recuperación. **No está aprobado ni fusionado.**

## 3. Resumen ejecutivo: qué contiene esta evolución

La historia agrupa cinco grandes frentes:

1. **Generación arquitectónica y Funnel:** expansión de familias, variantes y shapes; generación de candidatos y funnel de selección; conexión con Cockpit y frontend.
2. **AGK y geometría:** tipos de feature, compilación de familias, asignación de shapes, geometría, regeneración y pruebas de integración.
3. **Heliodón / asoleamiento:** cálculo solar, sombras, ciudades peruanas, ubicación, altitud, visualización 3D y reporte normativo.
4. **Conocimiento, clima y normativa:** ranking, métricas, restricciones de proyecto, Köppen-Geiger, meteorología y estrategias bioclimáticas.
5. **Energía y sostenibilidad:** integración de EnergyPlus, pipeline de simulación, LCA / carbono incorporado y conectores de análisis climático/energético.

Este alcance se deriva del inventario de archivos y títulos de commits; no equivale a una auditoría funcional completa.

## 4. Logros identificados por subsistema

### 4.1 Generador arquitectónico y Funnel

**Cambios y logros reflejados en la historia:**
- Evolución del catálogo de familias arquitectónicas paramétricas.
- Ampliación de shapes y variantes.
- Generación de candidatos con intención de compilar a AGK desde etapas tempranas.
- Ranking y métricas de mérito para evaluar propuestas.
- Integración de Funnel en Cockpit y frontend.
- Implementación y conexión de familias hidráulicas.
- Pruebas de integración de shapes y funnel.

**Commits representativos:**
- `6c415e01` — 8 tipos de feature AGK + 23 familias paramétricas.
- `a74a5b25` — 24 familias, 10 shapes, métricas de mérito y arkiRanking.
- `5f919350` — 200 candidatos con AGK desde el inicio, familias y shapes.
- `65cb0cfe` — 40 familias, 120 shapes, métricas y 500 candidatos.
- `a7f4e077` — 40 familias, 120 shapes, 200 candidatos verificados.
- `d1dd8bdd` — visualización de shapes en Cockpit y Funnel conectado al frontend.
- `9db2887e`, `71018253` — familia hidráulica y conexión al Funnel, Cockpit, router y tests.

**Archivos relevantes:**
- `shared/arkiDynamicFamilies.ts`
- `shared/arkiDesignFunnel.ts`
- `shared/arkiDesignFunnel.test.ts`
- `client/src/pages/ArkiDesignFunnelPage.tsx`
- `client/src/components/ArkiCockpitFunnel.tsx`
- `client/src/pages/ArkiCockpitPage.tsx`
- `server/arkiDynamicFamilies.test.ts`

**Pendiente de verificar:** la secuencia real de generación y poda, cantidad efectiva de candidatos por etapa, criterios de mérito, diversidad, determinismo y que el Funnel completo opere de extremo a extremo.

### 4.2 AGK — Autoridad geométrica y compilación

**Cambios y logros reflejados:**
- Extensión del catálogo de tipos de feature AGK.
- Mapeo explícito de shapes a tipos de feature.
- Incorporación de tipos como OVERHANG y BRIDGE.
- Mejoras al family compiler y a la regeneración.
- Correcciones de TypeScript y de casos específicos de geometría.
- Tests de integración de shapes.

**Commits representativos:**
- `35f22dbd` — mapeo explícito de 120 shapes a 8 tipos de feature AGK.
- `1ef730f8` — OVERHANG y BRIDGE como tipos de feature.
- `da74ccd4` y `3a3f3a9f` — cierre de errores TypeScript reportados (62 → 0 en el contexto del commit).
- `6c415e01` — tipos de feature y familias paramétricas.

**Archivos relevantes:**
- `server/agk/agkTypeGuards.ts`
- `server/agk/familyCompiler.ts`
- `server/agk/familyCompiler.test.ts`
- `server/agk/regeneration.ts`
- `server/agk/types.ts`
- `server/arkiGeometryKernel.ts`
- `server/arkiShapesIntegration.test.ts`

**Pendiente de verificar:** que AGK siga siendo la única autoridad geométrica; validar topología, geometrías inválidas, casos de shapes no compilables, determinismo y contratos entre generador y kernel.

### 4.3 Heliodón / Asoleamiento

**Cambios y logros reflejados:**
- Motor solar canónico y catálogo de ciudades peruanas.
- Visualización de trayectoria solar y sombras.
- Controles de hora sincronizados con el visor 3D.
- Ubicación geográfica, altitud y datos de Ubigeo.
- Asoleamiento Studio integrado en Cockpit/menú de Estudios.
- Reporte imprimible de referencia normativa RNE A.040.
- Correcciones de mapas, coordenadas, hemisferio, imports y UX.

**Commits representativos:**
- `cc269ac1` — motor solar canónico ARKI-GIA.
- `f3083387` — catálogo de ciudades peruanas.
- `f55fe97c` — integración UI Asoleamiento en Cockpit.
- `9759fa26` — UI híbrida mapa + cascada y corrección matemática de azimut.
- `57df2f1e` — altitud en catálogo Ubigeo/UI.
- `f309951a` — visor 3D rotativo y sincronización slider-hora.
- `a06e7352` — arco solar, rayo de luz y sombra en terreno.
- `c0144637` — paredes con huecos para ingreso de luz por ventanas y puerta.
- `e025d093` — reporte RNE A.040 imprimible a PDF.

**Archivos relevantes:**
- `client/src/components/AsoleamientoStudio.tsx`
- `client/src/components/SolarHouse3D.tsx`
- `server/gia/heliodon/arkiPeruvianCities.ts`
- `server/gia/heliodon/arkiSolarEngine.ts`
- `server/gia/heliodon/arkiSolarReport.ts`
- `server/gia/heliodon/arkiSolarShadows.ts`
- `shared/arkiSolarUtils.ts`
- `shared/arkiUbigeoHierarchy.ts`
- `shared/arkiUbigeoMap.ts`
- `shared/arkiUbigeoMap.test.ts`

**Pendiente de verificar:** precisión de cálculos solares, convenciones de azimut, timezone, latitud/longitud, fechas solsticiales/equinocciales, sincronización UI, y validez técnica/normativa del reporte.

### 4.4 Clima, conocimiento y normativa

**Cambios y logros reflejados:**
- Motor climático basado en Open-Meteo y estrategias bioclimáticas Givoni.
- Clasificación climática Köppen-Geiger.
- Integración/fusión de capas normativas legacy y modular.
- Métricas, ranking de candidatos, decisiones arquitectónicas y derivación de restricciones del proyecto.
- Persistencia de candidatos podados.

**Commits representativos:**
- `54ef572c` — motor climático Open-Meteo + estrategias Givoni.
- `23794016` — Köppen-Geiger y normativa modular.
- `cdfcca18` — fusión de capa legacy y motor modular.

**Archivos relevantes:**
- `server/gia/meteo/arkiMeteoEngine.ts`
- `shared/arkiKoppenGeiger.ts`
- `shared/arkiGlobalClimate.test.ts`
- `shared/arkiMetrics.ts`
- `shared/arkiNormativeEngine.ts`
- `server/gia/knowledge/arkiArchitectDecision.ts`
- `server/gia/knowledge/arkiRanking.ts`
- `server/gia/knowledge/deriveProjectConstraints.ts`
- `server/gia/knowledge/persistPrunedCandidates.ts`
- `shared/arkiClimateUtils.ts`

**Pendiente de verificar:** fuente y cacheado de datos climáticos, tratamiento de errores de API, reproducibilidad, trazabilidad de restricciones, consistencia normativa y fundamento de las puntuaciones/ranking.

### 4.5 Energía, simulación y LCA

**Cambios y logros reflejados:**
- Pipeline de simulación energética con EnergyPlus.
- Correcciones de TypeScript y fallos de simulación.
- Scripts de ejecución y stack-check.
- Templates IDF y datos climáticos EPW.
- Motor inicial de carbono incorporado (LCA).
- Preparación de integración con Radiance/Honeybee y otras capas de análisis.

**Commits representativos:**
- `9cf124e9` — pipeline de simulación energética con EnergyPlus.
- `7cc3b475` — correcciones de TS y fallos en simulación.
- `e7857aaf` — motor básico de huella de carbono incorporado.
- `fd63535f` — integración LCA + Clima + Radiance via Honeybee, según el mensaje del commit.
- `a7d6dae3` — hito: pipeline energético desbloqueado con EnergyPlus 24.1.0.

**Archivos relevantes:**
- `server/gia/energy/arkiEnergyEngine.ts`
- `server/gia/energy/arkiEnergyEngine.test.ts`
- `server/gia/energy/templates/arki_baseline.idf`
- `server/gia/energy/templates/lima_1zone.idf`
- `server/gia/energy/weather/lima_pe.epw`
- `server/gia/energy/arki-stack-check.py`
- `server/gia/energy/energyplus/scripts/arki_energy_sim_v14.py`
- `shared/arkiLCACalculator.ts`
- `shared/arkiLCACalculator.test.ts`
- `tools/energy-test/test.idf`

**Pendiente de verificar:** ejecución real reproducible en entorno limpio, disponibilidad/versionado de EnergyPlus, manejo de timeout/errores, outputs, unidades, supuestos energéticos y método de cálculo LCA.

## 5. Cambios en UI y flujo de usuario

El inventario evidencia:
- Funnel visual dentro del Cockpit.
- Panel de asoleamiento integrado en Estudios.
- Visualización solar 3D de vivienda con control horario.
- Mapa y cascada para análisis solar.
- Componentes para selección/representación de ubicación y datos de sitio.

Debe probarse el recorrido de usuario completo, no solo la presencia de los componentes en el código.

## 6. Datos geográficos

Se incorpora `shared/arkiUbigeoHierarchy.ts` y un archivo `shared/arkiUbigeoMap.ts` de tamaño considerable, con tests asociados. La historia de commits menciona incorporación de altitud y catálogo de ciudades peruanas.

**Antes de integrar:** verificar fuente, licencia, cobertura, consistencia de códigos Ubigeo, duplicados, campos faltantes y que el tamaño del dataset sea apropiado para el bundle/servidor.

## 7. Hallazgos de higiene del PR

La revisión de la lista de archivos del PR encontró elementos que deben investigarse y probablemente excluirse de la integración final:

- Backups `*.pre-*`, `*.bak`, `backup-before-fix`.
- Archivos de simulaciones temporales bajo `server/gia/energy/temp_sim_*`.
- Archivos de resultados (`eplusout.*`) y entradas repetidas de simulación.
- Datos climáticos o de prueba potencialmente repetidos.
- Un archivo `.pre-no-demo` de Funnel que parece copia de una versión previa.

**No se debe borrar de la rama de recuperación sin verificar contenido, procedencia y si alguna copia contiene código o datos únicos.** Los artefactos deben compararse con sus versiones activas; luego se puede eliminar selectivamente y actualizar `.gitignore`.

## 8. Lo que aún NO está demostrado

La presencia de archivos, tests y mensajes de commit no prueba por sí sola:
- Que todos los tests pasen en la rama actual.
- Que los motores estén integrados de punta a punta.
- Que EnergyPlus complete una simulación válida en un entorno limpio.
- Que la UI sea funcional y no tenga imports/rutas rotas.
- Que los resultados de Heliodón sean numéricamente correctos.
- Que la integración climática y normativa tenga trazabilidad y fuentes vigentes.
- Que los 56 commits sean todos necesarios o deban integrarse en bloque.

Estas comprobaciones requieren ejecutar el pipeline de validación y una auditoría de código más profunda.

## 9. Plan de auditoría previo a merge

### Fase A — Preservación
- Mantener la rama de sincronización intacta.
- Confirmar SHA de PR head y base.
- Descargar o archivar patch/diff como evidencia de recuperación.

### Fase B — Inventario y poda segura
- Clasificar cada archivo: código activo, test, documentación, dataset, plantilla, backup, output temporal.
- Comparar cada backup con el archivo activo.
- Identificar outputs de EnergyPlus y EPW duplicados.
- Revisar `.gitignore` y proponer reglas que no excluyan inputs canónicos.
- No borrar archivos únicos hasta decidir su destino.

### Fase C — Validación técnica
- Instalar dependencias de forma reproducible.
- TypeScript/typecheck.
- Tests unitarios y de integración.
- Tests del Funnel y AGK.
- Tests climáticos, solares, Ubigeo y LCA.
- Stack-check de EnergyPlus y simulación de ejemplo reproducible.
- Smoke test de Cockpit/UI.

### Fase D — Integración
- Preparar commits de limpieza en la rama PR, nunca directamente en `main`.
- Documentar los archivos eliminados y el motivo.
- Repetir pruebas.
- Solicitar revisión del PR.
- Merge solo después de evidencia y aprobación.

## 10. Conclusión

Estos 56 commits representan una evolución significativa de SICL-WEB/ARKI: Funnel generativo, expansión de familias/shapes, conexión con AGK, Heliodón y asoleamiento, clima y normativa, conocimiento/ranking, EnergyPlus y LCA.

La prioridad inmediata no es fusionar a ciegas ni eliminar archivos por extensión. Es conservar esta rama como punto de recuperación, documentar la evolución y realizar una limpieza controlada que distinga artefactos de desarrollo de activos reales.

## 11. Evidencia usada para esta versión

Esta documentación se elaboró a partir de:
- Inventario de archivos del PR #184 (paginación de archivos revisada).
- Lista de 56 commits del PR y sus mensajes.
- Estado de Git comunicado por el usuario: rama de sincronización publicada y working tree limpio.

No se ejecutaron tests, build, simulaciones ni lectura profunda de todos los archivos fuente para elaborar este documento. Por tanto, los logros descritos son **logros visibles en la historia e inventario**, no resultados de una auditoría funcional independiente.
