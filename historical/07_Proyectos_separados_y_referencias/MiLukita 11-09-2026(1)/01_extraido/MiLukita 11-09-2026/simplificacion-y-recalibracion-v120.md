# Simplificación de modalidades y recalibración RTP v1.2.0

**Estado:** aplicado al piloto virtual.  
**Alcance:** créditos virtuales no canjeables; sin pagos, retiros ni conversión monetaria.

## Decisión de catálogo

El catálogo de loterías queda limitado a **Lotería 19**, **Lotería 29**, **Lotería 39**, **Lotería 49** y **Lotería 59**. La Lotería 39 conserva su expediente MJP Extra separado. Se retiraron del código, catálogo, simulador y enum de base de datos la lotería clásica y las cinco variantes de consuelo.

Tras inventario previo, se eliminaron **16 rondas** y **6 rulesets** de variantes no autorizadas. No existían boletos ni previsualizaciones asociadas, por lo que la operación no eliminó comprobantes de usuarios. Esta eliminación es irreversible y fue confirmada expresamente antes de ejecutarse.

| Modalidad conservada | Selección | Precio virtual | Estado |
|---|---:|---:|---|
| Lotería 19 | 3 de 19 | 1 crédito | Activa |
| Lotería 29 | 6 de 29 | 1 crédito | Activa |
| Lotería 39 | 6 de 39 + MJP Extra opcional | 6 créditos base | Activa |
| Lotería 49 | 6 de 49 | 1 crédito | Activa |
| Lotería 59 | 6 de 59 | 1 crédito | Activa |

## Bolas adicionales de consuelo

Cada consuelo se incorpora al resultado HMAC del servidor como una extracción posterior y distinta de las extracciones principales. Solo se evalúa bajo la condición indicada; no acumula un segundo premio principal.

| Modalidad | Extracciones principales | Bola de consuelo | Condición exclusiva | Premio virtual | RTP teórico |
|---|---:|---:|---|---:|---:|
| Bingo Flash | 9 | 10.ª | Completar los 3 números exactamente en la 10.ª | 1 | 85,0549 % |
| Bingo Keno | 20 | 21.ª | Tener 4 aciertos tras 20 y lograr el 5.º con la 21.ª | 1 | 85,0000 % |
| Bingo 75 | 40 | 41.ª | Completar por primera vez una línea horizontal, vertical o diagonal con la 41.ª | 11 | 84,5636 % |
| Jackpot | 5 posiciones | 6.ª | Exactamente 2 coincidencias principales y coincidencia de una selección no acertada con la 6.ª | 1 | 85,0426 % |

En Bingo Flash, los premios principales por completar en las bolillas 3 a 9 son 34, 17, 10, 7, 3, 3 y 1 crédito. En Bingo Keno, la tabla por 5 a 10 aciertos es 10, 20, 46, 115, 270 y 580 créditos. En Bingo 75, una línea en las primeras 40 bolillas paga 1 crédito; si aparece por primera vez en la bolilla 41, el consuelo paga 11 créditos.

La tabla de Jackpot paga 5 créditos con cuatro coincidencias y 11&nbsp;900 créditos con cinco coincidencias. La sexta bola solo habilita el consuelo de un crédito bajo la condición anterior.

## Ruletas simplificadas cercanas a 85 %

Las Ruletas 17, 27 y 37 conservan únicamente **Color** y **Par/Impar**. El cero pierde en ambos tipos. Todos los premios y precios son cantidades enteras de créditos virtuales.

| Ruleta | Casillas | Precio virtual | Pago total al acertar | RTP teórico | House edge |
|---|---:|---:|---:|---:|---:|
| Ruleta 17 | 0–16 | 5 | 9 | 84,7059 % | 15,2941 % |
| Ruleta 27 | 0–26 | 9 | 16 | 85,5967 % | 14,4033 % |
| Ruleta 37 | 0–36 | 4 | 7 | 85,1351 % | 14,8649 % |

Para cada ruleta el RTP se obtiene como `(casillas ganadoras × pago total) ÷ (casillas totales × precio)`. Las cantidades se eligieron para mantener pagos enteros y una desviación reducida del objetivo del 85 %.

## Evidencia de implementación

La migración `0015_classy_zaran.sql` restringe los cuatro enums de modalidad a las variantes autorizadas. Se publicaron reglas `v1.2.0` y rondas nuevas para Jackpot, Bingo Flash, Bingo Keno, Bingo 75 y Ruletas 17/27/37. Las rondas previas sin boletos se archivaron antes de la publicación.

La validación posterior ejecutó `pnpm check` sin errores y `pnpm test` con **17 archivos y 46 pruebas aprobadas**. La cobertura incluye liquidación reversible de Bingo Flash y Keno, resultado de consuelo de Bingo 75, Jackpot con sexta bola, loterías autorizadas, reservas HTTP y RTP de ruletas.

> Las cifras de este documento pertenecen exclusivamente al piloto virtual. No constituyen una oferta de dinero real, una autorización regulatoria ni una promesa de valor económico.
