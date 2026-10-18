# Bingos y Ruletas Simplificadas v1.0.0

## Alcance del piloto

Las siete modalidades descritas en este documento usan **créditos virtuales**, rondas de servidor con HMAC-SHA-256 y comprobantes individuales. No aceptan pagos, no permiten retiros y no otorgan valor monetario. La selección automática prepara únicamente la selección del cartón o apuesta; el resultado proviene siempre del sorteo de servidor publicado al cerrar la ronda.

| Modalidad | Selección | Resultado verificable | Pago virtual | RTP teórico |
|---|---:|---:|---:|---:|
| Bingo Flash | 3 de 15 | 9 bolillas | 2–39 créditos según extracción | 93,6264 % |
| Bingo Keno | 10 de 80 | 20 bolillas | 10–670 créditos por 5–10 aciertos | 85,2885 % |
| Bingo 75 | Cartón B-I-N-G-O de 24 números | 40 bolillas | 2 créditos por línea | 89,1262 % |
| Ruleta 7 | Color o paridad | 0–6 | 2 créditos si acierta | 85,7143 % |
| Ruleta 17 | Color o paridad | 0–16 | 2 créditos si acierta | 94,1176 % |
| Ruleta 27 | Color o paridad | 0–26 | 2 créditos si acierta | 96,2963 % |
| Ruleta 37 | Color o paridad | 0–36 | 2 créditos si acierta | 97,2973 % |

## Bingos

**Bingo Flash** requiere tres números distintos entre 1 y 15. La tabla paga 39, 20, 13, 7, 4, 3 y 2 créditos si los tres números se completan, respectivamente, en la tercera a novena bolilla. El RTP se calcula ponderando cada posible instante de completado sobre las combinaciones de tres números de quince.

**Bingo Keno** admite diez números distintos entre 1 y 80. Tras 20 bolillas, las coincidencias de cinco a diez pagan 10, 20, 55, 135, 335 y 670 créditos. La tabla fue recalibrada desde la distribución hipergeométrica exacta; no se usó la tabla de ejemplo del documento adjunto porque su RTP calculado no correspondía a la cifra anunciada.

**Bingo 75** exige cinco números en las columnas B, I, G y O, y cuatro en N porque el centro es una casilla libre. El sistema acepta una fila, columna o diagonal completa tras 40 bolillas. El RTP resulta de la probabilidad de la unión de las doce líneas posibles —calculada mediante inclusión-exclusión— multiplicada por el premio fijo de dos créditos.

## Ruletas

Cada ruleta reserva el cero como resultado que no gana ni por Color ni por Par/Impar. Los demás resultados se alternan de forma equilibrada entre rojo/negro y par/impar. Una participación cuesta un crédito virtual y una coincidencia devuelve dos créditos en total. Por ello, el RTP de cada ruleta es `(n−1)/n`, donde `n` es la cantidad de resultados, y el house edge es su complemento.

La apuesta **Total** queda explícitamente fuera de la versión 1.0.0. No se muestra, no se acepta en API ni se incorpora a lotes hasta que exista una especificación y auditoría separadas.

## Selecciones, lotes y evidencia

El usuario puede seleccionar de forma manual o generar una combinación automática. Las validaciones de rango, unicidad, columnas B-I-N-G-O y tipo de apuesta se ejecutan en el servidor al confirmar. Las nuevas modalidades usan las mismas previsualizaciones firmadas de lote, límite de diez participaciones, hash por comprobante e historial auditado del piloto.

## Verificación de interfaz

La revisión de interfaz confirmó que `/bingos-simplificados` muestra Flash, Keno y el cartón B-I-N-G-O con sus cinco columnas; `/ruletas-simplificadas` muestra Ruleta 7, 17, 27 y 37 con RTP, house edge, Color y Par/Impar. Las siete rondas fueron publicadas en estado `open`. La prueba HTTP valida el lote firmado estructurado de Bingo 75, mientras las pruebas unitarias y de liquidación reversible cubren los pagos de todas las variantes.
