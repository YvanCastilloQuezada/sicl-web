# Fases 2–4 — Boss Fight, Ledger y Simulación

**Estado:** implementación inicial validada en sandbox local  
**Fecha:** 26 de agosto de 2026  
**Entorno:** piloto de créditos virtuales; sin dinero real, retiros ni conversión monetaria.

## Fase 2 — Motor Boss Fight

El motor autoritativo se encuentra en `server/games/bossFightEngine.ts` y sus contratos compartidos en `shared/bossFight.ts`. El servidor conserva la fase, la salud, la posición, el patrón, las marcas temporales y el último evento. Los patrones iniciales son `SWEEP`, `PULSE` y `ORBIT`.

Cada impacto valida que el combate esté en fase `ACTIVE`, calcula la distancia entre el objetivo enviado y la posición server-side y rechaza los objetivos fuera del rango permitido. Los request IDs procesados se registran para impedir dobles impactos. Un impacto válido aplica 10 puntos de daño virtual; al llegar a cero, el jefe pasa a `DEFEATED`.

La interfaz `BossFightTestPanel` está ubicada en `ControlRoom` y requiere rol de operador. El router `bossFight` protege `start` y `expire` con `adminProcedure`, y `state` e `hit` con `protectedProcedure`. El panel no está integrado en `/tv`, Home, PWA u Overlay y no modifica RNG, RTP, reglas, wallet, liquidación ni MJP CORE.

## Fase 3 — Ledger de recompensas

Se añadió `server/rewards/rewardLedger.ts` como ledger virtual idempotente para dos tipos de recompensa: `TOURNAMENT_PRIZE` y `COOPERATIVE_ACHIEVEMENT`. Cada entrada contiene identificador, clave de idempotencia, destinatario virtual, importe entero positivo, motivo, fecha y metadatos opcionales.

La implementación evita doble abono cuando se repite la misma clave de idempotencia y mantiene balances virtuales separados por destinatario. En este bloque el ledger es un componente de dominio en memoria para pruebas y preproducción; todavía no es la persistencia financiera definitiva en base de datos. Antes de operación real debe integrarse con una transacción de base de datos, auditoría append-only, controles de autorización y reconciliación.

## Fase 4 — Simulación de 1,000 partidas

Se añadió `scripts/simulate-boss-1000.ts`, ejecutable mediante `pnpm simulate:boss1000`, usando la semilla determinista `milukita-boss-fight-1000-v1`. La simulación produce 859 victorias y 141 derrotas, equivalente a una tasa observada de **85.90%**, sobre un objetivo configurado de 85%. Generó 107,375 créditos virtuales: 85,900 en premios de torneo y 21,475 en logros cooperativos.

> La cifra del 85.90% es una observación de una muestra sintética bajo una probabilidad objetivo. No demuestra una garantía de victoria, RTP, rentabilidad, comportamiento de usuarios reales ni cumplimiento regulatorio. La comunicación pública debe mostrarla como resultado de simulación, no como promesa.

## Validación

| Control | Resultado |
|---|---|
| `pnpm check` | Aprobado |
| Pruebas focalizadas Boss Fight y ledger | Aprobadas |
| Suite ejecutada | 52 archivos aprobados, 1 omitido; 166 pruebas aprobadas, 4 omitidas |
| `pnpm simulate:boss1000` | 1,000 partidas reproducibles; 85.90% observado |
| Persistencia definitiva del ledger | Pendiente |
| Certificación externa de RNG/fairness | Pendiente |

## Próximos pasos técnicos

La siguiente iteración debe trasladar el ledger a una operación transaccional persistente y añadir pruebas de concurrencia e idempotencia contra la base de datos. Luego debe definirse el contrato de eventos del combate, autorización por sesión de jugador y reconciliación de resultados. Finalmente, la simulación debe ampliarse con sensibilidad sobre dificultad, tasa de acierto, número de jugadores y distribución de recompensas, sin presentarla como garantía comercial.

## 6. Persistencia y staging WebSocket

La tabla `virtual_reward_ledger` fue incorporada mediante la migración `drizzle/0027_fantastic_fabian_cortez.sql`, con clave única de idempotencia, relación a usuario, tipo de recompensa, importe, motivo y metadatos. El servicio `awardPersistentVirtualReward` acredita el wallet virtual y registra el movimiento correspondiente dentro de una transacción. Los endpoints `rewards.mine` y `rewards.award` quedaron protegidos; la acreditación administrativa exige `adminProcedure`.

Se ejecutó `pnpm load:realtime:ws` contra `ws://127.0.0.1:3000/realtime` con 100 clientes WebSocket reales. Se obtuvieron 100 JOIN, 100 reconexiones y cero errores. JOIN: p50 40.895 ms, p95 281.161 ms y p99 320.359 ms. Reconexión: p50 127.689 ms, p95 451.068 ms y p99 490.482 ms. Es una prueba de staging local de un proceso; no certifica red pública, base de datos bajo carga, balanceador ni multiinstancia.

## 7. Sensibilidad de dificultad

| Dificultad | Objetivo | Victorias observadas | Tasa observada | Recompensa total |
|---|---:|---:|---:|---:|
| EASY | 95% | 944/1,000 | 94.40% | 47,200 créditos |
| STANDARD | 85% | 853/1,000 | 85.30% | 85,300 créditos |
| HARD | 75% | 764/1,000 | 76.40% | 114,600 créditos |
| EXPERT | 60% | 603/1,000 | 60.30% | 150,750 créditos |

Estos resultados son muestras deterministas bajo objetivos configurados. No representan una promesa al usuario ni una garantía de victoria. Deben analizarse junto con dificultad efectiva, reglas de participación, límites responsables y presupuesto virtual.
