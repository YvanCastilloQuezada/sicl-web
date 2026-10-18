# Lotes mixtos y posicionamiento responsable v1.0.0

## Reserva de hasta diez boletos virtuales

Una reserva por lote puede combinar tres tipos de selección en una misma ronda: números introducidos manualmente, números aleatorios generados por el servidor y repeticiones deliberadas de una combinación. El límite es de diez boletos por confirmación; todos conservan comprobante, hash e historial individual aun cuando tengan la misma combinación.

| Tipo de selección | Entrada de la persona | Resultado persistido |
|---|---|---|
| Manual | Seis números y, solo en Lotería 39, Extra opcional | Un boleto por copia solicitada |
| Aleatoria | Cantidad de boletos, sin elegir números | El servidor genera cada combinación única internamente por boleto y la revela antes de confirmar |
| Repetida | Una combinación manual y número de copias | Copias con mismo número principal/Extra, pero hash y comprobante propios |

La generación aleatoria de números de una selección no participa en el resultado del sorteo. El resultado oficial sigue dependiendo exclusivamente de la semilla comprometida del servidor al cerrar una ronda. Las combinaciones aleatorias se generan por el servidor al confirmar el lote y se devuelven de inmediato con sus comprobantes individuales; la persona puede configurar o retirar las porciones manuales y aleatorias antes de esa confirmación.

## Regla de costo y confirmación

El lote es virtual. La pantalla calculará el costo de cada boleto y el total antes de confirmar. MJP Extra permanece opcional por cada boleto de Lotería 39; añade un crédito virtual y registra el séptimo número. No se usarán débitos automáticos, conversiones a PEN, medios de pago ni renovaciones.

## Previsualización firmada y comprobantes

Antes del débito virtual final, la aplicación puede generar una previsualización de lote con identificador `PRV`, lista exacta de combinaciones, hash SHA-256, firma HMAC y vigencia máxima de diez minutos. La confirmación posterior valida la firma, el hash, la identidad, la ronda, la vigencia y el uso único de la previsualización. Si cualquiera de esas condiciones cambia, el lote debe generarse nuevamente.

Cada confirmación produce un identificador `LOT`, un evento de auditoría y comprobantes `TKT` individuales. La ruta `/lotes` permite filtrar los lotes por variante de Lotería, abrir sus comprobantes y descargar un archivo JSON con la lista de boletos, hashes, costo virtual, selección Extra y estado. El archivo declara explícitamente que es virtual, no contiene pagos ni permite conversión monetaria.

## Posicionamiento que sí puede publicarse

> **Loterías Perú — reglas visibles, números a tu elección y resultados verificables.**

Se puede afirmar que el piloto publica su RTP, tabla de premios, reglas versionadas, comprobantes y modo Aprender. También se puede describir que permite elegir entre dominios de 29, 39, 49 y 59 números y que MJP Extra duplica los premios elegibles cuando coincide el número Extra. No se publicarán comparaciones como “cuatro veces más chance”, “siete veces más premios” o declaraciones sobre el RTP de terceros sin una metodología comparable, una fuente vigente y revisión legal.
