# ARKI Árbol Vivo — Precedencias seguras (implementación aislada)

**Estado:** CANDIDATE / CI_NOT_VERIFIED / NO_CANONICAL_PROMOTION
**Rama:** `feat/arbol-vivo-precedencias-seguras-20261010`
**Alcance:** ensamblador asesor existente. No modifica Core, D-2, AGK, Universidad, estado maestro ni contratos FROZEN.

## Cambios
- La evidencia histórica no se convierte en verificación actual. `verified` exige `verification=CURRENTLY_VERIFIED|VERIFIED`, evidencia y estado compatible.
- La prioridad usa alcance transitivo de dependientes (`downstreamCount`), sin presentar el resultado como ruta crítica o urgencia.
- Dependencias desconocidas o inválidas producen alertas y `dependenciesResolved=false`; esto NO implica que las dependencias conocidas estén completadas.
- El algoritmo sigue usando el inventario experimental y fases F1–F10; no existe descubrimiento completo de repositorios, agenda temporal, ejecución autónoma ni simulación del gemelo.
- No se eliminan archivos ni ideas: falta verificar absorción, sucesor, referencias y contratos.

## Puertas pendientes
1. Ejecutar `node tools/maqueta-viva/arki-arbol-vivo-auto.test.cjs` en SHA exacto.
2. Validar suite global y regresiones, revisar condiciones de CI.
3. Recuperar dependencias reales desde contratos y código de ambos repositorios; inventario actual tiene cero dependencias declaradas.
4. Añadir identidad y procedencia por arista, análisis de ciclos, criticidad con duraciones y urgencia con fuentes.
5. Probar actualización incremental, conflictos FROZEN, continuidad y aprobación humana autenticada.

**NO EVIDENCE = NO GREEN.** El conteo de descendientes no sustituye un camino crítico CPM ni una orden de ejecución.

## Extensión: aristas tipadas y evidencia
- `dependencyEdges` es opcional y no sustituye el inventario canónico.
- Una arista `{type:"REQUIRES",targetId:"ID",status:"VERIFIED",evidenceRef:"referencia"}` puede entrar al DAG.
- `REQUIRES` sin evidencia produce `UNVERIFIED_PRECEDENCE` y NO se considera dependencia confirmada.
- `CROSS_PHASE` y otras relaciones no imponen precedencia temporal.
- Los `dependencies` históricos de tipo cadena siguen admitidos por compatibilidad, pero deben reconciliarse con evidencia antes de usarlos para decisiones de producción.
- Se añaden tests para aristas verificadas, aristas propuestas, autorreferencia y relaciones transversales.
- **CI:** el smoke run #395 PASS correspondió al commit anterior `a66453d...`; los cambios posteriores requieren CI nuevo sobre SHA exacto.

## Propuestas A/B/C contextualizadas
- El prototipo read-only muestra propuestas por fase desde `assembly-registry.json`.
- A/B/C tienen acciones distintas por dominio: KNOWLEDGE, GEOMETRY, TERRITORY, GOVERNANCE, GENERAL.
- Cada propuesta identifica pieza, objetivo, fuente histórica, baseline y puertas. No hay experimentos ejecutados ni aprendizaje certificado.
- El clasificador actual es determinista por términos del título; una clasificación incorrecta requiere revisión, nunca promoción automática.
- El instalador local `Install-ARKI-ArbolVivo.ps1` sigue apuntando a la rama experimental anterior. PR #55 NO está desplegado al acceso directo del usuario.
- Validación pendiente: ejecutar prueba sandbox `node tools/maqueta-viva/av-ui-001-readonly-prototype.test.cjs`, smoke CI en SHA exacto, E3 Edge visual y auditoría Red Team.
