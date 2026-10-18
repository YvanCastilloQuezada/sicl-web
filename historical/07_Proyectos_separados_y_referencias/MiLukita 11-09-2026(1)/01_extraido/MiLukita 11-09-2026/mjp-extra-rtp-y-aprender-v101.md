# MJP Extra, RTP público y modo Aprender v1.0.1

**Estado:** funciones activas únicamente dentro del piloto de créditos virtuales. No introducen dinero real, retiros, conversión a PEN, pagos ni compra automática.

## MJP Extra de Lotería 39

MJP Extra es una opción **por boleto** en Lotería 39. La persona elige seis números principales y, opcionalmente, un séptimo número diferente. El servidor sortea seis números principales y un número Extra entre los 33 números que no salieron como principales. Si el Extra seleccionado coincide, duplica los premios de 2, 3, 4 o 5 aciertos; el premio de seis aciertos no se multiplica.

| Elemento | Regla activa |
|---|---|
| Costo base | 6 créditos virtuales por boleto |
| Costo MJP Extra | +1 crédito virtual por boleto |
| Premios elegibles | 2–5 aciertos |
| Multiplicador | ×2 si coincide el número Extra |
| RTP base Lotería 39 | 85,1485 % |
| RTP con MJP Extra | 75,1562 % |
| Regla persistida | Lotería 39 `v1.0.1` |

El RTP con Extra es inferior al de la tabla base porque el precio adicional es mayor que el incremento esperado de premio. Esta diferencia se comunica de forma visible antes de confirmar el boleto y en la página de transparencia; nunca debe presentarse como una mejora automática de retorno.

## Trazabilidad

La selección Extra se registra en el hash del boleto, en el movimiento de billetera virtual y en la auditoría. Al liquidar la ronda, el expediente publica el número Extra resultante, el premio y si el multiplicador se aplicó. La prueba reversible `server/mjpExtra.test.ts` verifica un caso de cinco aciertos con Extra, que liquida 14 000 créditos virtuales y revierte toda la transacción de prueba.

## Tablero de RTP observado

La ruta pública `/rtp` muestra solamente rondas virtuales de Lotería 29, 39, 49 y 59 que estén liquidadas y tengan boletos confirmados. Por cada ronda se publican boletos, créditos gastados, premios pagados, retorno observado y retorno teórico ponderado conforme al costo efectivamente registrado. Si no existen rondas liquidadas, el tablero muestra un estado vacío; no genera datos de muestra.

> El RTP observado es una medición histórica de las rondas listadas; no predice ni garantiza el resultado de una participación individual.

## Modo Aprender

La ruta `/aprender` entrega 100 créditos de demostración que viven exclusivamente en la memoria del navegador. El sorteo didáctico usa números locales y no crea boletos, movimientos, planes, eventos de auditoría ni registros de servidor. Está diseñado para explicar la mecánica, no para reproducir ni sustituir el sorteo verificable del servidor.

## Validación

La validación de cierre incluyó comprobación TypeScript, el flujo HTTP de reserva MJP Extra, creación y confirmación manual de planes, consulta pública del tablero RTP y pruebas reversibles de liquidación. La revisión visual cubrió `/juegos/loteria_39`, `/rtp` y `/aprender` en formato de escritorio.
