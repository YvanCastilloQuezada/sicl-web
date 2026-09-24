# ARKI-UI-GOVERNANCE-001 — A0.R2
## Informe final de verificación visual y runtime

### Alcance

A0.R2 ejecutó un barrido de sólo lectura sobre las **38 entradas canónicas** inventariadas en A0, utilizando el runtime de producción `node dist/index.js` en el puerto `4001`. No se modificaron componentes de producto, rutas, permisos, autenticación, configuración del Core ni datos de proyecto. Las capturas, textos extraídos y clasificaciones se conservaron como evidencia.

La línea base canónica observada fue `#root[data-arki-boot-stage="REACT_MOUNTED"]` en el runtime 4001, con fuente `ccdc6d95f87175fb0bbeba8fd64fb1cc2f07e85a` y bundle `assets/index-DNwvu7b4.js`.

### Resultado cuantitativo

| Métrica | Resultado |
|---|---:|
| Rutas declaradas | 38 |
| Rutas user-facing | 35 |
| Rutas alcanzables y renderizadas | 15 |
| Rutas bloqueadas | 20 |
| Rutas rotas con 404 inesperado | 0 |
| Rutas internas/fuera de producto | 0 |
| Rutas sin evidencia | 0 |
| Estados visuales capturados en el runtime 4001 | 110 |
| Ocurrencias estáticas de controles heredadas de A0 | 1.336 |

La categoría **bloqueada** no significa necesariamente defecto de producto. Incluye estados fail-closed por Core no conectado, dependencias espaciales 503, módulos lazy que permanecieron en `Cargando módulo` durante la ventana observada y rutas que redirigieron a autenticación. La evidencia distingue cada caso en `UI_SCREEN_REGISTRY_R2.json`.

### Pantallas funcionales verificadas

La pantalla inicial `/` y su alias `/arki` renderizan el primer contacto, QR contextual, entradas por intención, idioma español por defecto y acceso seguro. También exponen correctamente que el Core remoto no está conectado, sin inventar resultados.

`/arki-design-funnel` renderiza la secuencia S1/S2 con 16 propuestas, comparación económica, estados UNKNOWN, vistas Planta/3D/Corte/Programa y gate de selección humana. No se observó un ganador automático.

`/arki-generator` renderiza el generador paramétrico con tipología, capacidad, geometría, circulación, ambiente, servicios, costos, visor 3D/planta, validación normativa y balance hídrico. El estado conserva la distinción entre geometría conceptual y expediente técnico.

`/arki-bim-visor` renderiza el visor BIM con ARK/IFC, tolerancia de coordinación, detección de interferencias, coordinación MEP y predimensionamiento con revisión especialista.

`/arki-family-studio`, `/arki-super-architect`, `/multiobjective`, `/parametric-files`, `/luka-control-center`, `/ar-lu-orchestrator`, `/arki-tv`, `/help` y otras pantallas capturadas muestran sus controles y estados de gobernanza según el registro.

### Bloqueadores observados

El `Control Center`, `Operations`, `Parametric Runtime`, `Research Review` y `Sources`, entre otras rutas, permanecieron en el fallback de React `Cargando módulo` durante la observación. Esto se clasifica como **DEPENDENCY_BLOCKED**: el shell y React montan, pero no se pudo afirmar que el módulo lazy haya terminado de evaluar.

`/spatial-comparison` muestra un estado explícito `Core spatial representation unavailable (503)`. Este comportamiento es correcto desde la perspectiva de integridad: no fabrica geometría y pide configurar el transporte del Core.

Algunas rutas administrativas o de handoff redirigieron a Manus Login. Se clasifican como **AUTH_REQUIRED** y no se hizo takeover ni login durante esta auditoría. No se usó bypass.

### Evaluación profesional de la interfaz

La interfaz mantiene el lenguaje visual oscuro, minimalista y profesional solicitado. Las pantallas verificadas para diseño permiten tomar decisiones preliminares porque muestran parámetros, alternativas, vistas, costos, UNKNOWNs y gates humanos. El visor BIM comunica correctamente que la coordinación y el cálculo firmado no son sustituidos por una pantalla conceptual.

La experiencia no es todavía un recorrido completo de 38 rutas: el usuario encuentra una pantalla de espera en las rutas lazy bloqueadas y necesita un Core/configuración autenticada para las funciones que dependen de ellos. Esto debe tratarse como trabajo de integración/runtime, no como evidencia para rediseñar la UI funcional ya verificada.

### Integridad y límites

La auditoría fue visual y de runtime. No ejecutó acciones destructivas, no subió modelos, no escribió Project State, no aprobó propuestas, no publicó ARKI-TV, no conectó proveedores externos, no habilitó `LOCAL_CORE`, no configuró URLs de Core y no modificó código de producto.

El proceso de desarrollo temporal terminó posteriormente con `exit code 137` por la política de larga inactividad; no afecta la evidencia del runtime 4001, que fue inspeccionado por separado. Los procesos observados en otros puertos no se usaron como baseline canónico.

El paquete de evidencia incluye el registro JSON, atlas, matriz, grafo pantalla-control, runbook, capturas y manifiesto SHA-256. El estado de controles no ejecutados sigue siendo **NOT_TESTED**; una captura visible demuestra presencia, no que cada acción haya completado una mutación.

### Recomendación

La siguiente intervención mínima y segura es estabilizar el pipeline de lazy chunks y completar la conexión/configuración del Core sólo en un entorno autorizado, sin alterar la arquitectura ni saltarse autenticación. Después debe repetirse el mismo runbook para separar claramente: módulo cargado, acción no destructiva ejecutada, respuesta del Core y gate humano. No se recomienda iniciar una auditoría visual global nueva hasta resolver esos dos bloqueadores.

## Artefactos

- `UI_SCREEN_REGISTRY_R2.json`: registro machine-readable de 38 rutas, clasificación y evidencia.
- `PO_VISUAL_REVIEW_R2/ARKI_UI_VISUAL_ATLAS_R2.md`: atlas de pantallas.
- `PO_VISUAL_REVIEW_R2/UI_VISUAL_REVIEW_MATRIX_R2.md`: matriz de estados.
- `PO_VISUAL_REVIEW_R2/SCREEN_CONTROL_GRAPH_R2.md`: relación conservadora pantalla-control.
- `PO_VISUAL_REVIEW_R2/A0_STANDARD_RUNTIME_RUNBOOK.md`: procedimiento reproducible.
- `PO_VISUAL_REVIEW_R2/A0R2_EVIDENCE_MANIFEST.sha256.md`: hashes del paquete.

**Estado final:** A0.R2 cerrado como **verificación visual parcial pero reproducible**, sin reparaciones ni cambios de producto.

**Fecha de cierre:** 2026-09-24 UTC.
