# Reporte de verificación del checkpoint `6919b747`

**Proyecto:** Multi Juegos Perú  
**Fecha de verificación:** 24 de agosto de 2026  
**Alcance:** contraste entre el checkpoint `6919b747` y las tareas de recalibración de Lotería y pruebas API end-to-end descritas en el documento del arquitecto.

> **Conclusión ejecutiva:** el checkpoint es consistente y verificable para el simulador aislado y la recalibración de Bingo. Sin embargo, **no incluye todavía** la recalibración de Lotería `v1.0.1` ni una suite HTTP end-to-end de tRPC. Por tanto, no debe declararse cumplido el plan de “3 días” hasta implementar y validar ambos entregables.

## 1. Base verificada del checkpoint

El checkpoint contiene un simulador aislado con perfiles rápido y extendido, informe JSON, prueba de integridad y una prueba reversible de liquidación real de Bingo. La batería más reciente verificada antes del checkpoint aprobó `pnpm check`, **22 pruebas Vitest** y una simulación extendida de 50 000 boletos sin errores de motor. La regla activa de Bingo quedó versionada como `v1.0.1`, con premio de 82 créditos y RTP teórico de 78,10 %. [1] [2] [3]

| Componente | Estado | Evidencia revisada | Veredicto |
|---|---|---|---|
| Simulador aislado | Implementado | Perfiles `quick` y `full`, reportes JSON, métricas de RTP y p95. | **Verificado** |
| Bingo `v1.0.1` | Implementado y activado | Regla persistida de 82 créditos, ronda auditada y test reversible `closeAndDrawRound`. | **Verificado** |
| Transparencia de Bingo | Implementada | Página pública muestra 78,10 % y estado “Recalibrado en piloto”. | **Verificado** |
| Lotería `v1.0.1` | No implementada | El motor mantiene la tabla 9 000 / 1 500 / 250 / 40. | **Pendiente** |
| API E2E HTTP | No implementada | No existe `server/api.e2e.test.ts` ni otra suite equivalente. | **Pendiente** |

## 2. Verificación de la recalibración de Lotería

La tabla vigente de Lotería sigue pagando 9 000, 1 500, 250 y 40 créditos para 6, 5, 4 y 3 aciertos respectivamente. La documentación técnica la identifica con un RTP teórico aproximado de **3,9060 %**, valor muy inferior al objetivo propuesto. [1] [2]

| Aciertos | Premio vigente en el motor | Premio propuesto por el arquitecto | Estado |
|---:|---:|---:|---|
| 6 | 9 000 cr. | 170 000 cr. | Pendiente |
| 5 | 1 500 cr. | 28 000 cr. | Pendiente |
| 4 | 250 cr. | 4 500 cr. | Pendiente |
| 3 | 40 cr. | 750 cr. | Pendiente |
| Ruleset de Lotería | `v1.0.0` actual | `v1.0.1` requerido | Pendiente |

La tabla propuesta en la documentación existente alcanza aproximadamente **72,50 % de RTP principal**, por lo que es matemáticamente coherente con el criterio de aceptación de 71,5–73,5 % si se implementa sin Bola Extra, Crédito Seguro ni pozo. [2] Es importante aclarar que el mismo documento recomienda una meta más amplia de 80–84 % para juegos de tickets y propone complementos opcionales. La decisión de `v1.0.1` debe fijar expresamente si el alcance es solo la tabla principal de 72,50 % o una versión posterior con componentes adicionales; no conviene mezclar ambos sin una regla y un RTP total publicado.

## 3. Verificación de las pruebas API end-to-end

El checkpoint sí cuenta con pruebas unitarias, de seguridad, de accesibilidad, de simulación y una integración reversible de Bingo. También existen rutas de salud y pruebas de sus auxiliares. No obstante, no hay evidencia de una suite que inicie el servidor HTTP y ejecute los contratos tRPC propuestos —autenticación, rondas, reserva de boleto, verificación, billetera y mercados— mediante `/api/trpc/*`. [3] [4]

| Flujo solicitado | Estado en `6919b747` | Observación de verificación |
|---|---|---|
| `GET /health` y `GET /health/db` | Parcialmente cubierto | Existen rutas y pruebas de auxiliares; falta suite HTTP integrada. |
| `auth.me` | No E2E | Hay prueba de cierre de sesión, no flujo autenticado HTTP completo. |
| `games.rounds` y `games.verify` | No E2E | La lógica existe, pero no hay prueba a través de tRPC/HTTP. |
| `games.reserveTicket` y `wallet.summary` | No E2E | La lógica de motor está probada; falta autenticación y contrato HTTP. |
| `market.list` | No E2E | El módulo existe, pero no hay prueba de endpoint HTTP. |

Para cumplir este entregable conviene exportar una instancia de aplicación testeable o levantar un servidor efímero durante la suite, crear un usuario de prueba aislado, ejecutar las llamadas tRPC con sesión válida y borrar o revertir los registros de prueba. No se debe reutilizar una cuenta ni una billetera de un jugador real.

## 4. Matriz de aceptación solicitada

| Criterio del documento adjunto | Resultado actual | Fundamentación |
|---|---|---|
| Lotería RTP ≈ 72,5 % en 10 000 boletos | **No cumple aún** | Motor y simulador siguen usando la tabla vigente de 3,9060 % teórico. |
| Pruebas E2E API pasan | **No cumple aún** | No hay archivo ni suite HTTP E2E. |
| `pnpm test` sin errores | **Cumple** | Última validación: 22 pruebas aprobadas. |
| `pnpm check` sin errores | **Cumple** | Validación TypeScript aprobada antes del checkpoint. |
| Documentación RTP actualizada | **Cumple para Bingo; pendiente para Lotería** | Transparencia muestra Bingo 78,10 %, Lotería conserva 3,91 %. |

## 5. Orden de trabajo recomendado

La siguiente secuencia protege la trazabilidad y evita modificar reglas vigentes de forma retroactiva:

| Fase | Actividad | Entregable verificable | Dependencia |
|---|---|---|---|
| 1 | Recalibrar Lotería | Regla `v1.0.1`, archivo de migración de rondas vacías, tabla pública y prueba de liquidación reversible. | Decisión explícita: 72,50 % principal. |
| 2 | Validar Lotería | Simulación aislada de 10 000 o más boletos, RTP observado dentro de la tolerancia acordada. | Fase 1. |
| 3 | Crear API E2E | Suite HTTP con usuario y datos de prueba reversibles; log de ejecución. | Aislamiento de sesión y datos. |
| 4 | Revalidar checkpoint | `pnpm check`, `pnpm test`, simulación, capturas y nuevo checkpoint. | Fases 1–3. |

El estimado del documento adjunto —un día de trabajo para Lotería y dos para API E2E— puede usarse como **referencia de esfuerzo**, no como compromiso de calendario. La duración real depende de la decisión del RTP total de Lotería, de la estrategia de sesión de pruebas y de los hallazgos de integración.

## 6. Límites de la verificación

Este reporte audita el estado técnico del piloto gratuito y virtual. No certifica juegos con dinero real, cumplimiento normativo, auditoría externa del RNG, seguridad de producción a escala ni aprobación de pagos. Las funciones de Yape permanecen desactivadas, y los créditos no son dinero ni admiten retiros.

## 7. Anexo de cierre posterior al checkpoint

Este informe conserva el diagnóstico histórico del checkpoint `6919b747`. Tras ese checkpoint se completaron los dos entregables entonces pendientes: Lotería `v1.0.1` y la suite HTTP end-to-end. La regla de Lotería activa declara premios de **170 000 / 28 000 / 4 500 / 750 créditos virtuales** y abrió la ronda `RP-L-9TLIRCPN`; los eventos `round.opened` y `ruleset.activated` quedaron encadenados en auditoría. La simulación aislada de 10 000 000 boletos obtuvo RTP observado de **72,6745 %** frente a **72,5014 %** teórico, con cero errores e integridad de saldo aprobada.

La nueva prueba `server/api.e2e.test.ts` ejecuta rutas HTTP reales para salud, identidad, rondas, verificación, mercados, billetera y reserva. La reserva autenticada crea un usuario temporal, verifica el débito virtual y elimina sus boletos, movimientos, auditoría, configuraciones, billetera y usuario al finalizar. La ejecución de cierre aprobó `pnpm check` y **26 pruebas Vitest**. El detalle reproducible y los límites de alcance están documentados en el reporte de cierre posterior. [5]

## Referencias

[1]: [Motor actual de premios y liquidación](../server/pilot.ts)  
[2]: [Márgenes, probabilidades y propuesta de Lotería](./margen-probabilidades-y-pozos-responsables.md)  
[3]: [Configuración del simulador aislado](../server/simulator/config.ts)  
[4]: [Prueba reversible de Bingo](../server/bingoRecalibration.integration.test.ts)
[5]: [Reporte de cierre de Lotería v1.0.1 y API HTTP E2E](./reporte-cierre-loteria-api-e2e-2026-08-24.md)
