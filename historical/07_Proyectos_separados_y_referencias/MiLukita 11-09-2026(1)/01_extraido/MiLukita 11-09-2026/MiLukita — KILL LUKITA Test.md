# MiLukita — KILL LUKITA Test

**Orden:** 43-B · **Tipo:** diagnóstico, sin implementación de soluciones.

## Objetivo

Comprobar que el sistema mantiene TV, QR, interacción virtual, cierre, resultado y verificación cuando el personaje Lukita, sus guiones, su avatar o su capa de presentación están apagados o no disponibles.

## Hipótesis de seguridad

> Lukita puede presentar un estado autorizado, pero nunca puede ser la fuente del estado autorizado.

La cadena de autoridad definida en la documentación es `Round Engine → Draw Engine → Rule Engine → Credit/Settlement → Audit/Verify → MjpTvManifest → TV/Web/Overlay/Lukita`. El contrato `MjpTvManifest` marca a `MJP_CORE` como fuente autoritativa. La prueba debe validar esta dirección y no solo que la pantalla siga pintándose.

## Procedimiento reproducible propuesto

| Paso | Acción | PASS esperado | Estado actual |
|---|---|---|---|
| 1 | Preparar una ronda fixture abierta | Ronda y manifest válidos | Preparado por fixtures/pruebas |
| 2 | Confirmar TV/overlay sin Lukita | TV muestra estado, contador y QR/estado disponible | Parcial; QR se obtiene separado y `/tv` no lo proyecta |
| 3 | Desactivar el host visual o simular ausencia de script | No se rompe el cliente; aparece fallback neutral | No existe kill específico runtime |
| 4 | Continuar interacción celular | Juego usa estado del servidor y créditos virtuales | Módulos existentes; no probado en esta cadena |
| 5 | Cerrar ronda | Cierre proviene de MJP CORE | Arquitectónicamente separado |
| 6 | Obtener resultado | Resultado proviene de sorteo y reglas | Cubierto por pruebas de dominio |
| 7 | Verificar públicamente | `/verificar` funciona sin Lukita | Implementado como ruta pública |
| 8 | Revisar auditoría | Event Store/Auditor registra sin host visual | Event Store y Auditor Agent implementados; escenario KILL no ejecutado |

## Resultado diagnóstico

**NO PROBADO como prueba end-to-end.** La arquitectura es favorable: el visor 3D está aislado, la guía maestra prohíbe autoridad a Lukita, MjpTvManifest consume MJP CORE y el kill switch existente detiene automatización general. Pero no existe una operación o feature flag específica de “Lukita apagada”, ni un test que quite la capa visual y recorra todos los pasos.

Por lo tanto, no se debe afirmar todavía que MiLukita sobrevive operativamente a KILL LUKITA. El resultado correcto es: **independencia de autoridad PASS; continuidad runtime sin personaje NOT PROVEN**.

## Hallazgos

| ID | Prioridad | Problema → evidencia → impacto → solución futura → dependencia → prioridad |
|---|---|---|---|---|---|
| KILL-01 | P1 | No hay kill switch específico de Lukita → `server/autonomy.ts` solo expone control global `NORMAL/DEGRADED/STOPPED/MAINTENANCE` → no se conoce la conducta real al perder host/guion → añadir escenario de apagado aislado y fallback neutral → TV Client + capa de presentación → alta |
| KILL-02 | P1 | No existe E2E de continuidad sin Lukita → pruebas existentes cubren TV/overlay y QR, no el escenario combinado → riesgo de dependencia accidental futura → crear fixture E2E reversible → QA + MjpTvManifest → alta |
| KILL-03 | P2 | La ausencia de Lukita no está representada en el manifest → estados de recovery describen conexión, no host visual → diagnóstico insuficiente → añadir estado de disponibilidad de presentación sin autoridad → contrato manifest → media |
| KILL-04 | P2 | `/tv` y overlay no comparten actualmente una evidencia única de QR → QR del backend se consulta separado → una falla de Lukita podría ocultar también el puente de participación si se acopla en futuro → mantener QR independiente y probarlo → broadcast → media |

## Restricciones

Esta orden no implementa el kill switch específico ni modifica MJP CORE, MjpTvManifest, RNG, RTP, reglas, wallet, liquidación, permisos de agentes o autoridad de resultados.

## Validación técnica de la Orden 43-B

`pnpm check` terminó con código 0. `pnpm test` terminó con código 1: 40 archivos pasaron, 1 falló y 1 fue omitido; 127 pruebas pasaron y 4 fueron omitidas. El fallo corresponde a `server/api.e2e.test.ts` en `games.reserveTicket`, que devolvió HTTP 500 porque la ronda estaba cerrada mientras la prueba esperaba HTTP 200. `pnpm build` terminó con código 0, con warnings ya descritos en la auditoría maestra.

No se ejecutó un KILL LUKITA runtime en esta Orden. El documento conserva el estado correcto: separación arquitectónica PASS, continuidad end-to-end sin Lukita NOT PROVEN.

## Actualización posterior — worker y QR

El worker supervisado respeta el modo global `STOPPED` antes de ejecutar ciclos y registra `SCHEDULER_WORKER_BLOCKED`; esto aporta una barrera de automatización, pero no un kill switch específico del personaje. La prueba KILL LUKITA todavía requiere retirar o desactivar el host/guion/asset de Lukita y ejecutar un golden flow completo para comprobar que TV, QR unificado, celular, cierre, resultado y verificación continúan funcionando.

El QR unificado se origina en `MjpTvManifest` y no en Lukita. Una futura prueba de apagado puede conservar manifest, QR y estados del evento mientras elimina únicamente la capa de presentación.

La continuidad del contrato se amplió: `manifest.nextEvent` y `manifest.qr` permanecen disponibles desde el estado de MJP CORE, mientras que la UI de TV/overlay puede operar sin depender del visor 3D. Se añadió la simulación de autonomía y el worker supervisado respeta el kill switch global; no se ejecutó aún una prueba runtime que elimine el host visual de Lukita durante una sesión real.

**Criterio de cierre actualizado:** independencia de autoridad PASS; continuidad de TV → QR → celular → cierre → resultado → verificación sin Lukita continúa NOT PROVEN hasta ejecutar el procedimiento con fixture y evidencia de navegador/dispositivo.

**Estado actualizado:** KILL LUKITA runtime NO CERTIFICADO; aislamiento arquitectónico y bloqueo del worker ante `STOPPED` cubiertos por código y pruebas unitarias.
