# ARKI Corporation — Waves 2–5

**Estado global:** `CORPORATION_WAVES_PARTIAL_WITH_BOUNDS`

Las Waves 2–5 se ejecutan sobre `ARKI-UNIFIED-MOTOR-1.0`. No crean un motor alternativo. Cada Wave añade un contrato especializado y conserva `HUMAN_AUTHORITY = FINAL`.

## Wave 2 — capacidad y desempeño

`server/arkiCorporationWaves.ts` implementa `evaluateWave2()`. Cada evidencia conserva dominio, valor, unidad, método, fuentes y estado epistemológico. Se cubren capacidad/área, accesibilidad, evacuación y clima/confort. La ausencia de mediciones produce `UNKNOWN` o `PARTIAL`; no se comprime silenciosamente el programa ni se convierte un indicador en una aprobación normativa.

**Estado:** `PARTIAL` cuando faltan mediciones; `READY_FOR_REVIEW` cuando existen datos estimados que requieren revisión; `PASS_WITH_BOUNDS` solamente cuando los datos suministrados son hechos trazables. Esto no equivale a certificación de accesibilidad, evacuación o confort.

## Wave 3 — ingeniería y entrega

`executeWave3()` reutiliza `calculateLifecycleBudget()` y `buildSemanticBimRepresentation()`. El presupuesto es transparente y depende de cantidades, precios, moneda, contingencia y horizonte suministrados. El BIM es semántico conceptual. Estructura, MEP, incendio y movilidad permanecen `SPECIALIST_REQUIRED`; IFC, RVT, DWG y GIS permanecen `REQUIRES_ADAPTER`.

**Estado:** `SPECIALIST_REQUIRED`. No se reclama documentación ejecutiva firmable ni exportación nativa profesional.

## Wave 4 — interfaces y colaboración

`executeWave4()` registra jurisdicción, fuentes regulatorias versionadas, usuarios y roles. Distingue SICL Core remoto configurado de modo local. Sin endpoint canónico, la persistencia multiusuario queda `NOT_DEMONSTRATED` y el estado es `BLOCKED`; con endpoint y fuentes oficiales puede llegar a `READY_FOR_REVIEW`, nunca a aprobación automática.

## Wave 5 — ecosistema y aprendizaje

`executeWave5()` define agentes consultivos con autoridad limitada, plantilla de lección para ARKI Academy, perfiles `JUNIOR`, `SENIOR`, `MASTER` y `CRAZY`, frontera pública/interna del Libro Vivo y registro de candidatos de aprendizaje. Los agentes pueden recuperar, comprobar o proponer, pero no decidir ni promover automáticamente conocimiento a `FACT`.

**Estado:** `READY_FOR_REVIEW`, con revisión humana, evaluación aleatoria y regresión obligatorias.

## Validación

La prueba focalizada `server/arkiCorporationWaves.test.ts` contiene **5/5 pruebas PASS**. También pasan TypeScript, build de producción y `git diff --check`.

## Límites actuales

Estas Waves no prueban por sí solas estructura, MEP, incendio, cumplimiento legal, permisos, costos de mercado, interoperabilidad nativa IFC/RVT/DWG/GIS, operación real, colaboración remota E2E ni aprendizaje autónomo. Su función es convertir esas áreas en contratos observables, con evidencia, estados y gates explícitos para la siguiente validación humana y profesional.

## Flujo resultante

`PROJECT INPUT → UNIFIED MOTOR → WAVE 2 EVIDENCE → WAVE 3 DELIVERY CONTRACT → WAVE 4 COLLABORATION / JURISDICTION → WAVE 5 LEARNING / ECOSYSTEM → HUMAN REVIEW`
