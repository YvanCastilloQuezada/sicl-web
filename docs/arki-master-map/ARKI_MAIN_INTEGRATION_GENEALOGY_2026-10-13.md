# ARKI — Genealogía y plan de integración a main

Fecha: 2026-10-13
Estado: INVENTARIO PARCIAL VERIFICADO EN GITHUB; NO AUTORIZA MERGE SIN GATES.

## Base observada
- WEB main: `ec6ede75a13e6a346816dfd96816272926a575b9`.
- Ramas consultadas: >80 visibles en primera página de búsqueda (cursor adicional). No afirmar inventario exhaustivo.
- F7/F8: 438 commits ahead, 90 archivos; Árbol precedencias: 741/140; Autoensamblaje: 704/137; Autonomía: 712/143; Auditoría continuidad: 439/91. **No sumar** commits entre ramas.
- `audit/arbol-vivo-continuidad-20261011` está 1 commit por delante de `feat/f7-f8-integral-closure`; archivo exclusivo: `00_INICIO_ARKI.md`.
- `ace85/local-sync-20261011T233918Z` está 1 commit por delante de main y modifica solo 7 archivos de visor espacial UPAO001. La rama NO demuestra sincronización diaria del servidor.
- `feat/arki-autonomy-orchestrator-20261013` diverge respecto de `feat/arbol-vivo-autoensamblaje-20261011` (9 ahead, 1 behind al 2026-10-13). No promover directamente.

## Entradas de continuidad
- `00_START.md` en `feat/arbol-vivo-autoensamblaje-20261011`, no encontrado en main.
- `00_INICIO_ARKI.md` en `audit/arbol-vivo-continuidad-20261011`.
- No hay evidencia actual de escritura automática diaria del archivo en el servidor. Verificar servicio, timer, logs y commits antes de afirmar funcionamiento.

## Puertas y cola de integración
1. PR #58 `feat/arki-autonomy-memory-main-20261013` → main. SHA `bdfefedb38a0a8cc1dfdbdea097b77594141777f`; run `38443066124` FAILURE, job verify FAILURE; logs BlobNotFound. **BLOCKED**. Autorización condicional del propietario: solo merge con CI verde del SHA exacto, sin conflictos y seguridad verificada.
2. PR #57: orquestador y macroórdenes en rama experimental; descomponer en paquetes compatibles con main después de validar dependencias.
3. PR #56: inventario y planner, revisar relación con #57 y archivos compartidos antes de integración.
4. PR #49, #50, #52, #53, #54, #55: revisar SHA, base, solapamiento, pruebas, autoridad FROZEN, dependencias y riesgos; no asumir aceptación por estar abiertos.
5. Reconstruir historia por DAG: base/merge-base, cambios únicos por rama, rutas, contratos, CI y merges; clasificar `ALREADY_IN_MAIN`, `READY_FOR_GATE`, `BLOCKED`, `SUPERSEDED`, `UNKNOWN`.
6. Cada paquete pasa CI exact SHA, revisión de seguridad, ausencia de conflictos y autorización del propietario; documentar SHA de merge y pruebas post-merge.

## Restricciones
- Core autoridad de estado, AGK autoridad geométrica, D-2 autoridad semántica; ninguna rama experimental autopromueve estado canónico.
- No duplicar plataforma ARKI-02, temporizadores o archivos 00_START.
- No tocar MiLukita.
- Este documento es un mapa de trabajo; no certifica pruebas ni despliegue.

## Próxima acción verificable
- Recuperar evidencia del runner CI fallido y comprobar si hay infraestructura ARKI-02 disponible.
- Auditar el contenido exacto de las ramas de alto valor y reducirlas a PRs acotados contra main.
- Reconciliar 00_START y 00_INICIO_ARKI sin sobrescribir sus decisiones.
