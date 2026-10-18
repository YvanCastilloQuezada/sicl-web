# Resultados del simulador aislado — 24 de agosto de 2026

## Alcance de la ejecución

El simulador nuevo ejecutó un libro mayor exclusivamente en memoria con usuarios ficticios, selección pseudoaleatoria sembrada y reglas de premio equivalentes a las vigentes. No importó Drizzle, no abrió conexiones de base de datos, no hizo llamadas HTTP y no modificó rondas, billeteras ni cuentas del piloto.

> Este resultado **no es** una prueba de carga de API, OAuth, SQL o interfaz. Mide el cálculo aislado de reglas y la conciliación de un libro mayor virtual.

## Resultados reproducibles

| Perfil | Boletos | Errores | Integridad de saldo | p95 de cálculo aislado | Resultado |
|---|---:|---:|---|---:|---|
| Rápido | 1 000 | 0 | Aprobada | 0,010 ms | Muestra diagnóstica; alta varianza esperable. |
| Extendido recalibrado | 50 000 | 0 | Aprobada | 0,005 ms | Motor en memoria estable; RTP no pasó la tolerancia estricta configurada de 1 pp. |

La conciliación se cumplió en ambas ejecuciones: **saldo inicial − costos + premios = saldo final**. El perfil extendido usó 100 rondas de 500 boletos, repartidas en 10 000 boletos por cada modalidad.

## Hallazgos de RTP

| Juego | RTP observado | RTP teórico del modelo vigente | Desviación | Evaluación |
|---|---:|---:|---:|---|
| Ruleta | 46,62 % | 48,65 % | −2,03 pp | Muestra extendida aún fuera de la tolerancia de 1 pp. |
| Jackpot | 51,25 % | 52,73 % | −1,47 pp | Incluye pozo modelado; requiere muestras mayores por varianza progresiva. |
| Bingo | 76,33 % | 78,10 % | −1,76 pp | Recalibrado a 82 cr.; ya no supera el costo, aunque la muestra aún excede la tolerancia estricta. |
| Lotería | 4,92 % | 3,91 % | +1,02 pp | Fuera por poco de la tolerancia; requiere repetición con muestra mayor. |
| Trío 13 | 92,42 % | 86,89 % | +5,53 pp | Fuera de tolerancia; repetir antes de afirmar convergencia. |

Tras la recalibración, el RTP global observado fue 51,54 %. La prueba no aprueba el criterio de convergencia inferior a 1 % porque las cinco modalidades excedieron la tolerancia configurada en esta muestra. Este resultado no implica un defecto de saldo ni un resultado de API/SQL: evidencia que se necesita una muestra mayor antes de sostener una conclusión de convergencia estricta.

## Decisión técnica

1. El simulador queda **aprobado como herramienta aislada**: es reproducible, conserva saldos y expone resultados/limitaciones en JSON.
2. La tabla de premios de **Bingo fue recalibrada a 82 créditos** por cartilla ganadora mediante reglas `v1.0.1`. Su RTP teórico pasó de 428,57 % a 78,10 %; los pozos continúan desactivados.
3. La siguiente ejecución debe ampliar las muestras por modalidad y complementar el motor aislado con pruebas end-to-end contra datos temporales eliminados al finalizar; no debe usar usuarios reales.

## Validación de Lotería v1.0.1

La simulación `pnpm simulate:loteria` ejecutó **1 000 rondas × 10 000 boletos**, para un total de **10 000 000 boletos** de Lotería. Usó semilla `multi-juegos-loteria-v101-10000`, 50 usuarios ficticios y un libro mayor solo en memoria. No tocó la base de datos ni la red.

| Métrica | Resultado |
|---|---:|
| RTP teórico de la tabla 170 000 / 28 000 / 4 500 / 750 | 72,5014 % |
| RTP observado | 72,6745 % |
| Desviación | +0,1731 pp |
| Errores | 0 |
| Integridad de saldo | Aprobada |
| p95 de cálculo aislado | 0,0066 ms |

El resultado observado queda dentro de la tolerancia de ±1 pp configurada para el perfil. El promedio se calcula de forma incremental y los percentiles de latencia usan una muestra acotada para que una ejecución de gran volumen no acumule millones de tiempos en memoria. Esta métrica sigue excluyendo HTTP, OAuth, SQL y renderizado.

## Activación persistida verificada

La activación administrativa generó la ronda abierta `RP-B-CU2CJ8PL`, ligada a la regla publicada `v1.0.1`. La política persistida declara `bingoCartillaPrize: 82`, y la auditoría contiene los eventos `round.opened` y `ruleset.activated` con el mismo importe. Las rondas históricas `v1.0.0`, si existieran con boletos confirmados, se conservan para cerrar con su premio histórico de 450 créditos; no se reescriben retroactivamente.

La prueba `server/bingoRecalibration.integration.test.ts` ejecutó el flujo real `closeAndDrawRound` contra las tablas del esquema del proyecto dentro de una **transacción que se revierte de forma deliberada**. El expediente reproducible usa ruleset `e2e-bingo-v101`, ronda `E2E-BINGO-V101` y boletos `E2E-T-B101-1`, `E2E-T-B101-2` y `E2E-T-B101-3`. La ejecución observada resolvió el boleto ganador `E2E-T-B101-2` con movimiento `virtual_prize`, clave de idempotencia `prize:E2E-T-B101-2` e importe de **82 créditos**. No hubo ningún boleto con 450 créditos y la ronda no existía al terminar la reversión. Por tanto no crea ni altera registros persistentes del piloto.

## Cómo repetir

Desde la raíz del proyecto:

```bash
pnpm simulate:quick
pnpm simulate:full
pnpm simulate:loteria
```

Los resultados se generan en `.simulation-results/` y están excluidos del control de versiones. Para una ruta específica se admite `pnpm simulate:quick --output /ruta/informe.json`.
