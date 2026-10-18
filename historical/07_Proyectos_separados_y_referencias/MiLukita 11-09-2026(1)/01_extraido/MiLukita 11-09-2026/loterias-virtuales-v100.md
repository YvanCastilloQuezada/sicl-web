# Loterías virtuales v1.0.0 — 6/29, 6/39, 6/49 y 6/59

**Estado:** activas únicamente en el piloto gratuito. Todas las cifras de esta página son **créditos virtuales**. No hay pagos, depósitos, retiros, conversión a PEN ni derecho adquirido a migrar los saldos del piloto.

## Unidad interna de referencia

La plataforma conserva `1 crédito virtual = 1 unidad de referencia PEN` solo en la política contable de las reglas. El objetivo es evitar rediseñar escalas de precios y tablas durante una eventual evaluación futura. La política mantiene, sin excepción, `virtualOnly: true`, `redeemable: false`, `hasMonetaryValue: false`, `migrationRequiresLegalApproval: true` y `migrationRequiresExplicitUserAgreement: true`.

> La referencia interna no autoriza una conversión automática. Una modalidad con dinero real sería un producto nuevo y requeriría autorización, certificación técnica, aceptación expresa, reglas propias, controles de acceso y medios de pago autorizados.

## Tablas recalibradas

Las tablas se calcularon con `P(k) = C(6,k) × C(N−6,6−k) / C(N,6)`. El RTP es `Σ[P(k) × premio(k)] / precio`. La suma se verifica por código con `pnpm analyze:lotteries` y en pruebas unitarias; no se ha usado la tabla propuesta inicialmente porque sus probabilidades y RTP no coincidían con esa fórmula.

| Modalidad | Precio virtual | 6 aciertos | 5 aciertos | 4 aciertos | 3 aciertos | 2 aciertos | RTP exacto | Margen |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Lotería 6/29 | 10 cr. | 70 000 | 3 200 | 400 | 42 | 4 | **85,2288 %** | 14,7712 % |
| Lotería 6/39 | 6 cr. | 300 000 | 7 000 | 650 | 62 | 5 | **85,1485 %** | 14,8515 % |
| Lotería 6/49 | 4 cr. | 800 000 | 12 000 | 800 | 90 | 6 | **85,9077 %** | 14,0923 % |
| Lotería 6/59 | 2 cr. | 1 000 000 | 20 000 | 500 | 51 | 8 | **85,1452 %** | 14,8548 % |

Cada ronda se abre con una semilla de servidor comprometida mediante hash. El cierre produce un conjunto de boletos hasheado, semilla pública, resultado por HMAC-SHA-256 con rechazo uniforme, liquidación virtual y prueba pública. Las cuatro reglas están publicadas como `v1.0.0`; sus rondas activas se identifican en la consulta pública `games.rounds`.

## Validación de simulación

Se ejecutaron 100 000 boletos por variante, con usuarios ficticios, RNG sembrado y libro mayor en memoria. Los reportes JSON se guardan localmente en `.simulation-results/`. La muestra observó cero errores e integridad de saldo aprobada, pero los resultados observados variaron por los premios de baja frecuencia.

| Modalidad | RTP exacto | RTP observado en 100 000 boletos | Errores | Lectura correcta |
|---|---:|---:|---:|---|
| 6/29 | 85,2288 % | 86,89 % | 0 | Diagnóstico compatible con varianza muestral |
| 6/39 | 85,1485 % | 83,39 % | 0 | Diagnóstico compatible con varianza muestral |
| 6/49 | 85,9077 % | 83,95 % | 0 | Diagnóstico compatible con varianza muestral |
| 6/59 | 85,1452 % | 77,31 % | 0 | Muestra insuficiente para premio de alta varianza |

Una exigencia de desviación inferior a 1 punto porcentual en una única muestra de 100 000 boletos no es adecuada para tablas con premios muy escasos: el cálculo combinatorio exacto es el criterio de aceptación del RTP y la simulación funciona como control de implementación, integridad y rendimiento. No se ajustan semillas ni resultados para aparentar convergencia.

## Evidencia técnica

| Control | Resultado |
|---|---|
| Prueba matemática de cuatro RTP | Aprobada; cada tabla está entre 85 % y 86 % |
| Liquidación persistida reversible | Aprobada para el premio mayor de las cuatro tablas; la transacción se revierte |
| HTTP E2E | Reserva aislada de la lotería clásica y las cuatro variantes; costos 25/10/6/4/2 créditos comprobados y usuario temporal eliminado |
| Referencia interna PEN | Probada como no canjeable y sin valor monetario |

La revisión visual en escritorio confirmó que la página de transparencia expone el aviso de referencia interna sin mostrar precios en soles, que la Lotería 59 permite seleccionar números 1–59 y cobra 2 créditos virtuales, y que el inicio muestra el catálogo ampliado sin retirar el aviso permanente de piloto gratuito.

## Límite regulatorio

Para una modalidad futura, MINCETUR solicita declarar los porcentajes teóricos de retorno de corresponder, las reglas y una certificación de laboratorio autorizado. Los formatos de certificación contemplan contrastar el PRT mediante simulación o modelo matemático analítico. Esta documentación no representa homologación, autorización ni aprobación de un RTP mínimo para cualquier modalidad. [1] [2]

## Referencias

[1]: [MINCETUR — Autorización y homologación de modalidades de juego](https://www.gob.pe/94278-autorizacion-y-registro-homologacion-y-o-modificacion-de-modalidades-de-juego)

[2]: [MINCETUR — Formatos de certificado de cumplimiento 2025](https://apuestasdeportivas.mincetur.gob.pe/PDF/FORMATOS_CERTIFICADOS_CUMPLIMIENTO_2025.pdf)
