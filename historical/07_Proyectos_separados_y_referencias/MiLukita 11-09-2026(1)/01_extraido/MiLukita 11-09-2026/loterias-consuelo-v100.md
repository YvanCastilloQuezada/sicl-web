# Loterías de Consuelo v1.0.0

**Estado:** publicado exclusivamente para el piloto gratuito. Todos los importes son **créditos virtuales**, no dinero, no son convertibles y no admiten retiros. Esta especificación reemplaza la propuesta matemática inconsistente recibida como insumo y conserva los premios mayores solicitados en una configuración reproducible.

> **Separación obligatoria.** `Lot 39 Consuelo` es una modalidad nueva de **5/39** (`loteria_39_cons`). No cambia ni reutiliza la Lotería 39 MJP de **6/39** (`loteria_39`), sus boletos, sus reglas ni su MJP Extra histórico.

## Mecánica verificable

Cada ronda sortea primero `p` números principales sin reemplazo entre `1…N`, mediante HMAC-SHA-256 y muestreo por rechazo. Para las modalidades de consuelo, el servidor compromete y revela además el máximo de bolas adicionales de la variante, tomadas **sin reemplazo del conjunto que no salió entre las principales**. Un boleto elige el paquete de `b` bolas al confirmar su participación; el ticket utiliza el prefijo de las bolas reveladas correspondiente a `b`.

El consuelo se paga **una sola vez por boleto** si al menos una bola adicional seleccionada coincide con un número del boleto que no fue extraído entre los números principales. Es adicional al premio de la tabla del paquete; no hay multiplicadores, redondeos ni créditos fraccionarios.

La probabilidad de `j` aciertos principales se calcula con:

`P(J=j) = C(p,j) × C(N-p,p-j) / C(N,p)`.

La probabilidad de que el paquete de `b` bolas alcance al menos un número no acertado del boleto se calcula sumando cada `j`:

`P(consuelo) = Σ P(J=j) × [1 − C((N-p)-(p-j),b) / C(N-p,b)]`.

El script reproducible `scripts/recalibrar-loterias-con-bolas.mjs` y los cálculos compartidos en `shared/lotteryVariants.ts` implementan estas fórmulas. Las pruebas validan que cada RTP calculado coincide con el RTP publicado del paquete.

## Tablas base

| Modalidad nueva | Tipo técnico | Selección | Premio mayor virtual | Tabla base | RTP base calculado |
|---|---|---:|---:|---|---:|
| Lot 19 | `loteria_19` | 3/19 | 70 | 3: 70; 2: 16 | 86,4809 % |
| Lot 29 | `loteria_29_cons` | 4/29 | 80 | 4: 80; 3: 39; 2: 9 | 84,9648 % |
| Lot 39 Consuelo | `loteria_39_cons` | 5/39 | 100 000 | 5: 100 000; 4: 100; 3: 5; 2: 2; 1: 1 | 86,2534 % |
| Lot 49 | `loteria_49_cons` | 6/49 | 350 000 | 6: 350 000; 5: 100; 4: 20; 3: 8; 2: 5 | 84,9340 % |
| Lot 59 | `loteria_59_cons` | 6/59 | 1 200 000 | 6: 1 200 000; 5: 50; 4: 13; 3: 13; 2: 7 | 85,0514 % |

Los RTP base están dentro de la banda declarada de alrededor de 85 %. En configuraciones enteras que preservan el premio mayor, la exactitud decimal del 85,0000 % no siempre es alcanzable sin introducir fracciones; el piloto publica el cálculo efectivo en vez de declararlo como 85 % exacto.

## Paquetes de bolas de consuelo

| Modalidad | Bolas `b` | Costo total virtual | Tabla del paquete | Consuelo único | RTP combinado calculado |
|---|---:|---:|---|---:|---:|
| Lot 19 | 1 | 2 | 3: 70; 2: 17 | 5 | 85,1909 % |
| Lot 29 | 1 | 2 | 4: 80; 3: 59; 2: 10 | 5 | 84,9648 % |
| Lot 39 Consuelo | 1 | 2 | 5: 100 000; 4: 250; 3: 10; 2: 3; 1: 1 | 5 | 85,0250 % |
| Lot 49 | 1 | 2 | 6: 350 000; 5: 50; 4: 20; 3: 7; 2: 7 | 5 | 85,3884 % |
| Lot 49 | 2 | 3 | 6: 350 000; 5: 100; 4: 25; 3: 9; 2: 9 | 5 | 85,4020 % |
| Lot 59 | 1 | 2 | 6: 1 200 000; 5: 50; 4: 27; 3: 27; 2: 9 | 5 | 85,2977 % |
| Lot 59 | 2 | 3 | 6: 1 200 000; 5: 100; 4: 40; 3: 35; 2: 12 | 5 | 85,0850 % |
| Lot 59 | 3 | 4 | 6: 1 200 000; 5: 200; 4: 70; 3: 50; 2: 15 | 5 | 85,9831 % |

## Persistencia y auditoría

La migración `0013_jazzy_phalanx.sql` añadió el conteo `bonusBallCount` a cada boleto y habilitó inicialmente Lot 19 y Lot 39 Consuelo. La migración `0014_mean_xavin.sql` completó los tipos independientes para Lot 29, Lot 49 y Lot 59 de consuelo. Los tickets incorporan el conteo de bolas en su hash canónico, recibo, débito virtual, lote firmado y resultado de liquidación.

Los comprobantes nuevos usan prefijos sin colisión: `AF` para Lot 19, `AG` para Lot 29, `AH` para Lot 39 Consuelo, `AI` para Lot 49 y `AJ` para Lot 59. Los prefijos y expedientes históricos permanecen intactos.

## Validaciones ejecutadas

| Capa | Verificación |
|---|---|
| Unidad | RTP base, RTP de cada paquete, premios por tamaño de selección y consuelo único. |
| Integración reversible | Premio mayor para los nueve expedientes y liquidación persistida de un consuelo Lot 49 sin dejar registros. |
| Esquema | Enums ampliados de forma no destructiva y columna `bonusBallCount` con valor por defecto cero. |
| Interfaz | Selección manual, selección rápida, paquetes de bolas, costo visible, lotes firmados y controles móvil/escritorio. |

La activación se ejecutó con `scripts/bootstrap-consolation-lotteries.mjs`; quedaron rondas abiertas y rulesets `v1.0.0` separados para las cinco modalidades nuevas. La Lotería 39 MJP 6/39 sigue siendo una modalidad distinta.
