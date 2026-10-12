# 00 INICIO ARKI — Árbol Vivo y continuidad técnica

> Entrada de continuidad. Estado: AUDITORÍA EN CURSO. No es fuente canónica de decisiones ni sustituye Core, AGK o D-2.

## Instrucción para la próxima sesión

1. Leer este archivo antes de proponer código.
2. Verificar SHA y diferencias actuales de `main`, `feat/f7-f8-integral-closure` y `ace85/local-sync-20261011T233918Z` en Web, así como `main` y la rama sincronizada en Core, y `main` en ACS.
3. Revisar `tools/maqueta-viva/README.md`, `docs/arki-master-map/ARKI_MASTER_MAP_STATE.json`, `tools/maqueta-viva/assembly-registry.json` y contratos fundacionales. No reemplazar interfaz ni avances existentes.
4. Obtener evidencias reales de pruebas antes de cambiar estados. No inferir funcionamiento de ARKI-02 por la sola existencia de scripts.

## Propósito y superficies

- **Mapa Vivo**: orientación técnica para ChatGPT, arquitectura, dependencias, decisiones, versiones, pruebas y siguiente trabajo.
- **Árbol Vivo / Maqueta Viva**: interfaz de decisiones del propietario, F1–F10, columna vertebral y espinas por defecto, bandeja de piezas, escenarios y FROZEN.
- **Gemelo digital del propio ARKI**: representación temporal, experimentos aislados, evaluación de cambios y evidencia. No confundir con gemelos digitales de proyectos arquitectónicos.
- **Mejora y autorreparación**: detectar déficits, formular **tres alternativas comparables**, probarlas de forma aislada y presentarlas al propietario para seleccionar una. La selección y cambios FROZEN/canónicos no son automáticos.

## Repositorios y responsabilidades

- `YvanCastilloQuezada/sicl-web`: UI, Árbol Vivo, Mapa Vivo, coordinación. `main` observado `ec6ede75a13e6a346816dfd96816272926a575b9`.
- `YvanCastilloQuezada/sicl-core`: estado, decisiones, eventos, evidencia y autoridad. `main` observado `45fd21a6b41f67e2d25bffac1f8b7e236cc6555e`.
- `YvanCastilloQuezada/arki-acs`: laboratorio KNOW/RUN/UNDERSTAND/EVOLVE; no es runtime de producción ni puede promover geometría canónica. `main` observado `6a0612184ff1e8207e86117f6353d1976abec1d8`.
- Sincronización local ARKI-02 documentada: `ace85/local-sync-20261011T233918Z`, Web `1544b977ad34e84dc1c97b1f8f66f1a5acbf4d4b`, Core `88517bff478f912b92efa37ddd752f4528588d85`. No consta que se fusionara a `main`.

## Código existente comprobado en rama feat/f7-f8-integral-closure

- `tools/maqueta-viva/maqueta-viva.template.html`: interfaz local implementada.
- `tools/maqueta-viva/test-maqueta-viva.cjs`: pruebas offline de fases, espinas, escenarios, dependencias y FROZEN.
- `tools/maqueta-viva/Discover-ARKI-Incremental.mjs`: observación incremental limitada, no promoción canónica.
- `tools/maqueta-viva/Verify-ARKI-TwinTimeline.mjs`: historial Git de fases y verificación de replay.
- `tools/maqueta-viva/arki-executor-gate.mjs`: puerta de autorización PR, solo lectura; **no ejecuta reparaciones**.
- `.github/workflows/maqueta-viva-smoke.yml`: smoke de alcance limitado.
- El README advierte que el borrador del navegador no es integración canónica; la maqueta offline no detecta por sí sola ramas remotas.

## Reglas

- NO EVIDENCIA = NO VERDE; CLAIM ≠ IMPLEMENTED ≠ EXECUTED ≠ VERIFIED ≠ FROZEN.
- 3D-FIRST; geometría operacional canónica por AGK; decisiones y evidencia por Core; semántica según contratos D-2.
- No modificar FROZEN, no autoaprobar alternativas, no fingir ejecución de ARKI-02.
- Desarrollo en rama; pruebas; integración solo con evidencia. No reabrir aprobaciones de UI que el propietario ya validó; solicitar intervención solo para decisiones nuevas o pruebas manuales necesarias.
- ARKI-02 es la copia operativa del propietario; GitHub es respaldo versionado y vía de trabajo remota. La sincronización diaria debe verificarse, no suponerse.

## Trabajo actual

**Objetivo inmediato:** auditar y completar el Árbol Vivo existente, conservando su frontend aprobado.

**Hecho en esta intervención:** acceso a los tres repositorios, lectura del README y scripts principales de Maqueta Viva, comprobación de SHAs de main y rama sincronizada, apertura de rama de auditoría.

**Pendiente:** reconciliar ramas y código; inspeccionar el frontend completo, estado persistente, pruebas, integración ACS/Core y el mecanismo real de sincronización ARKI-02; ejecutar pruebas y corregir fallos demostrados; implementar ciclo de tres propuestas con pruebas en gemelo aislado; conectar evidencias a Mapa Vivo y Árbol Vivo.

**No ejecutado:** CI en ARKI-02, E3 navegador, pruebas E2E entre los tres repositorios, merges a main o despliegue.

## Regla de mantenimiento

Actualizar este documento con cada cambio relevante y su SHA, evidencia ejecutada, bloqueos y siguiente acción. Las pruebas y recibos detallados deben residir en archivos versionados separados; este índice los enlaza sin duplicarlos.
