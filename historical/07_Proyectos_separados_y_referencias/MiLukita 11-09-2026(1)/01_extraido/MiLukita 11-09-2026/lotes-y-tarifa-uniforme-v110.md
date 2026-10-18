# Lotes universales y tarifa uniforme v1.1.0

## Alcance activo

El piloto sigue siendo gratuito y usa exclusivamente créditos virtuales sin pagos, retiros, PEN cobrable ni conversión automática. La versión v1.1.0 extiende los lotes firmados de hasta diez participaciones a Ruleta, Jackpot, Bingo, Loterías y Trío 13. MultiMarket maneja su lote por separado para no mezclar un evento con otro: cada lote se limita a un único mercado curado y a posiciones `SÍ` o `NO`.

Cada previsualización contiene las selecciones finales, hash SHA-256, firma HMAC, propietario, recurso objetivo y vencimiento de diez minutos. La confirmación revisa firma, hash, estado abierto y saldo antes de crear comprobantes individuales y el evento de auditoría. Las selecciones aleatorias usan el generador criptográfico del servidor y se firman antes de confirmar; no intervienen en el sorteo ni crean compras automáticas.

| Modalidad | Lote manual | Lote aleatorio del servidor | Regla adicional |
| --- | --- | --- | --- |
| Ruleta | Número de 0 a 36, con copias permitidas | Número de 0 a 36 | Cada boleto recibe hash propio. |
| Jackpot | Cinco posiciones únicas de 1 a 20, con copias permitidas | Cinco posiciones únicas | Premio fijo v1.1.0, no pozo progresivo. |
| Bingo | Una cartilla de 1 a 5, con copias permitidas | Una cartilla de 1 a 5 | Cartilla ganadora verificable. |
| Loterías | Seis números por variante, con copias permitidas | Seis números únicos | MJP Extra se limita a Lotería 39. |
| Trío 13 | Tres rangos únicos, con copias permitidas | Tres rangos únicos | Barajado HMAC verificable. |
| MultiMarket | Lados SÍ/NO, con copias permitidas | Lado SÍ/NO uniforme | Un solo mercado curado por lote. |

## Tarifa uniforme y política de premios

Las reglas v1.1.0 utilizan **1 crédito virtual por participación** para Ruleta, Jackpot, Bingo, Lotería clásica 49, Lotería 29, Lotería 49, Lotería 59, Trío 13 y contratos MultiMarket. En MultiMarket, un contrato acertado paga 2 créditos virtuales; no se presenta como una cotización ni como una probabilidad garantizada del evento. Los descuentos por volumen se neutralizan para estas modalidades, pues una tarifa de 1 crédito no admite descuentos enteros trazables.

| Juego | Tarifa | Tabla de premio v1.1.0 | RTP teórico calculado |
| --- | ---: | --- | ---: |
| Ruleta | 1 cr. | Exacto: 31 cr. | 83,7838 % |
| Jackpot | 1 cr. | 5: 11 750; 4: 5; 3: 1 | 84,9781 % |
| Bingo | 1 cr. | Cartilla ganadora: 4, sobre 5 cartillas | 80,0000 % |
| Lotería clásica 49 | 1 cr. | 6: 200 000; 5: 2 500; 4: 160; 3: 21; 2: 2 | 85,0821 % |
| Lotería 29 | 1 cr. | 6: 7 000; 5: 320; 4: 46; 3: 5 | 84,8027 % |
| Lotería 49 | 1 cr. | 6: 200 000; 5: 2 500; 4: 160; 3: 21; 2: 2 | 85,0821 % |
| Lotería 59 | 1 cr. | 6: 500 000; 5: 10 000; 4: 250; 3: 25; 2: 4 | 84,6253 % |
| Trío 13 | 1 cr. | 3: 48; 2: 2; 1: 1 | 84,9650 % |

> **Excepción aprobada:** Lotería 39 conserva tarifa base de 6 créditos y MJP Extra opcional de +1 crédito, multiplicador ×2 en 2–5 aciertos y RTP publicado de 75,1562 % con Extra. No se fuerza a la tarifa uniforme porque esa combinación no puede preservar simultáneamente el costo adicional, el multiplicador y el RTP aprobado usando pagos enteros sostenibles.

## Migración operativa segura

La activación publicó reglas `v1.1.0` y archivó solamente rondas vacías de reglas anteriores. Ningún boleto histórico fue modificado. El expediente de activación abrió nuevas rondas para Ruleta, Jackpot, Bingo, Lotería clásica, Lotería 29, Lotería 49, Lotería 59 y Trío 13, manteniendo Lotería 39 fuera de esta migración por su excepción MJP Extra.

La vista de RTP ahora calcula la expectativa desde la tabla persistida en el ruleset de cada ronda, no desde la configuración actual del producto. Por tanto, las rondas históricas conservan su interpretación económica virtual y las nuevas rondas exhiben su política v1.1.0.
