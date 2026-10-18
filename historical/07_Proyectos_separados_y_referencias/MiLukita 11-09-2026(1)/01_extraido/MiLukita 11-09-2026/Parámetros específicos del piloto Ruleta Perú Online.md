# Parámetros específicos del piloto Ruleta Perú Online

> **Estado del producto:** todos los importes de este documento son **créditos virtuales del piloto**. No representan dinero, no se pueden retirar, no se procesan pagos y Yape permanece desactivado.

## 1. Configuración por modalidad

| Modalidad | Selección del jugador | Dominio válido | Costo virtual base | Resultado del servidor | Premio virtual actual |
|---|---:|---|---:|---|---|
| **Ruleta** | 1 casilla | Entero de **0 a 36** | **20 cr.** | Número `0–36` y color | Coincidencia exacta: **360 cr. × cantidad de boletos** |
| **Jackpot** | 5 posiciones distintas | Enteros de **1 a 20** | **45 cr.** | 5 posiciones distintas `1–20` | 5 coincidencias: pozo repartido; 4 coincidencias: **1 200 cr. × cantidad**; 3 coincidencias: **240 cr. × cantidad** |
| **Bingo** | 1 cartilla | Cartilla **1, 2 o 3** | **35 cr.** | 15 llamados únicos `1–75` y una cartilla ganadora `1–3` | Cartilla exacta: **82 cr. × cantidad** |
| **Lotería** | 6 números distintos | Enteros de **1 a 49** | **25 cr.** | 6 números únicos `1–49` | Regla **v1.0.1**: 6 aciertos: **170 000 cr. × cantidad**; 5: **28 000**; 4: **4 500**; 3: **750** |

La compra permite entre **1 y 10 boletos ficticios** por operación. Los números repetidos se descartan; si la selección final no cumple exactamente la cantidad indicada por la modalidad, el backend rechaza la participación.

## 2. Datos específicos por juego

### Ruleta

La ruleta usa 37 resultados posibles, del `0` al `36`. El `0` se clasifica como **verde**. Los números rojos implementados son:

`1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36`.

Los demás números distintos de cero se clasifican como **negros**. La interfaz puede reproducir un giro de ruleta, pero ese movimiento es solo visual: el resultado se genera y se almacena en el servidor antes de que la interfaz lo represente.

| Regla | Valor |
|---|---:|
| Casillas | 37 |
| Selección requerida | 1 número |
| Apuesta virtual base | 20 cr. |
| Premio por número exacto | 360 cr. × cantidad |
| Color de 0 | Verde |

### Jackpot

El jugador elige cinco posiciones distintas de un conjunto de veinte. Cada ronda nueva de Jackpot empieza con un **pozo virtual inicial de 18 400 créditos**. Al confirmar un boleto, se incorpora al pozo el **35 % del costo virtual final** de ese boleto, es decir, después de aplicar el descuento por volumen.

| Regla | Valor |
|---|---:|
| Posiciones disponibles | 1–20 |
| Selección requerida | 5 posiciones sin repetir |
| Apuesta virtual base | 45 cr. |
| Pozo inicial por ronda | 18 400 cr. |
| Aporte al pozo | 35 % del costo virtual cobrado |
| 5 coincidencias | Pozo ÷ número de ganadores, redondeado hacia abajo |
| 4 coincidencias | 1 200 cr. × cantidad |
| 3 coincidencias | 240 cr. × cantidad |

Si no hay acertantes de cinco posiciones, el pozo de esa ronda no genera premio de categoría máxima. El modelo actual no transfiere automáticamente ese saldo a una ronda posterior: cada ronda tiene su propio campo de pozo.

### Bingo

En el piloto se selecciona una de tres cartillas virtuales. Al cerrar la ronda, el motor publica 15 llamados sin repetición de los números `1–75` y elige una cartilla ganadora `1–3`.

| Regla | Valor |
|---|---:|
| Cartillas disponibles | 1–3 |
| Selección requerida | 1 cartilla |
| Apuesta virtual base | 35 cr. |
| Llamados por ronda | 15 números únicos de 1–75 |
| Condición de premio implementada | Cartilla seleccionada = cartilla ganadora |
| Premio recalibrado | 82 cr. × cantidad |

> El texto de la interfaz menciona línea y cartón como conceptos del Bingo. Sin embargo, la liquidación vigente **solo premia la coincidencia de cartilla ganadora**; no existe todavía una tabla separada de premios de línea frente a cartón.

### Lotería

La Lotería pide seis números distintos de un universo de 49. Al confirmar la operación se crea un comprobante virtual con identificador `TKT-…`, hash del boleto y costo virtual. La ronda posterior calcula las coincidencias contra seis números sorteados sin repetición.

| Coincidencias | Premio virtual |
|---:|---:|
| 6 | 170 000 cr. × cantidad |
| 5 | 28 000 cr. × cantidad |
| 4 | 4 500 cr. × cantidad |
| 3 | 750 cr. × cantidad |
| 0–2 | 0 cr. |

## 3. Descuentos y bonificaciones

Los descuentos se aplican sobre el costo base multiplicado por el número de boletos. El precio final se calcula con:

`costo final = redondear(costo base × cantidad × (1 − descuento / 100))`.

| Nivel | Cantidad de boletos | Descuento | Multiplicador mostrado |
|---|---:|---:|---:|
| **Explora** | 1–2 | 0 % | ×1,00 |
| **Constancia** | 3–5 | 6 % | ×1,10 |
| **Impulso** | 6 o más | 12 % | ×1,25 |

El máximo operativo por compra es de diez boletos. El multiplicador se informa como condición promocional; la fórmula de liquidación de premio vigente usa la cantidad de boletos, no multiplica los premios automáticamente por `×1,10` o `×1,25`.

Además se incluye una promoción de **Racha de tres**: al confirmar cada tercera participación acumulada del jugador, y si esa promoción está activa, se acreditan **70 créditos virtuales**. Cada acreditación se registra como movimiento `promotion_bonus` y evento de auditoría.

## 4. Billetera, misiones e insignias

| Concepto | Parámetro |
|---|---:|
| Bonificación de bienvenida | 2 000 cr. una sola vez por usuario |
| Recompensa diaria | 180 cr. cada 24 horas |
| Misión `FIRST_TICKET` | Primer boleto confirmado; 80 cr.; insignia **Inicio verificado** |
| Misión `TWO_GAMES` | Participar en 2 modalidades distintas; 120 cr.; insignia **Explorador de mesa** |
| Misión `VERIFY_DRAW` | Consultar un expediente verificable; 60 cr.; insignia **Verificador público** |
| Límite de sesión inicial | 60 minutos |
| Opciones de límite disponibles | 30, 60, 90 o 120 minutos |
| Pausa voluntaria disponible | 0, 24, 168 o 720 horas |

La pausa voluntaria impide reservar nuevos boletos mientras esté vigente. Todos los movimientos de bienvenida, recompensa diaria, boleto, promoción, misión y premio se almacenan en el historial de billetera.

## 5. Semilla, hash y resultado verificable

Cada ronda nueva se abre durante **20 minutos**. Al crearse, el servidor genera una semilla secreta de **32 bytes aleatorios** y la codifica en hexadecimal. Por ello la semilla tiene normalmente **64 caracteres hexadecimales**.

| Elemento | Cómo se construye | Momento de publicación |
|---|---|---|
| Semilla privada de servidor | `randomBytes(32)` en hexadecimal | Se conserva en el servidor hasta el sorteo |
| Compromiso previo | `SHA-256(semilla privada)` | Al abrir la ronda |
| Hash de boletos | `SHA-256(JSON canónico de {publicId, ticketHash})` ordenado | Al cerrar la ronda |
| Semilla pública posterior | `PILOT:{ID_RONDA}:{primeros_16_caracteres_hash_boletos}` | Al cerrar la ronda |
| Contexto de sorteo | `{ID_RONDA}:{semilla_pública}:hmac-sha256-rejection-v1` | Al sortear |
| Algoritmo | `HMAC-SHA-256` con rechazo uniforme | Declarado como `hmac-sha256-rejection-v1` |

El rechazo uniforme evita usar un simple módulo sesgado. Para cada intento, el motor toma un entero sin signo de 32 bits del HMAC. Solo acepta el valor si es menor que `floor(2^32 / tamaño_del_dominio) × tamaño_del_dominio`; luego calcula el índice dentro del dominio. Si no se acepta, incrementa un contador y vuelve a calcular el HMAC.

Al cerrar una ronda, se revelan la semilla de servidor, semilla pública, hash de boletos, reglas utilizadas, algoritmo y resultado. La evidencia pública se consulta mediante el identificador de ronda `RP-…` en la pantalla **Verificar**.

## 6. Estados, auditoría y pagos

Las rondas usan los estados `draft`, `open`, `locked`, `drawn`, `settled` y `archived`. Actualmente, el panel de operador prepara rondas, publica revisiones de reglas, activa o pausa promociones y ejecuta el cierre/sorteo. El cierre liquida boletos y crea movimientos de premio solo si el monto calculado es mayor que cero.

Cada evento relevante añade una entrada encadenada de auditoría. El hash de un evento se calcula a partir del hash previo, tipo de evento, entidad, identificador público y contenido JSON canónico. Esto proporciona trazabilidad para aperturas de ronda, compra ficticia, cierre, premio, misión y promoción.

La capa futura de Yape ya tiene referencias, estados e idempotencia modelados, pero todas las referencias se crean con estado **`disabled`** durante el piloto. No existe flujo de cobro, transferencia ni retiro.

## 7. Ejemplo de costo

Una compra de cinco boletos de Lotería tiene costo base de `25 × 5 = 125 cr.`. Por pertenecer al nivel **Constancia**, aplica 6 % de descuento. El costo final es `redondear(125 × 0,94) = 118 cr.`. Ese importe se descuenta de la billetera virtual y se usa para el comprobante; no representa un pago real.
