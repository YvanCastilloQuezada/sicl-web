# Márgenes, probabilidades y evolución responsable del piloto

> **Alcance:** este análisis usa las reglas y créditos virtuales configurados en el piloto. No es una proyección de ingresos reales ni una aprobación regulatoria. Antes de cualquier operación con dinero real, las tablas de pago, auditoría del RNG, protección al usuario y encuadre legal deben validarse de forma independiente.

## 1. Lectura ejecutiva

El diseño actual tiene una economía desigual. **Ruleta** y **Jackpot** tienen un retorno teórico al jugador cercano al 49–54 % antes de bonos; **Lotería v1.0.1** retorna aproximadamente 72,50 % en su tabla principal; y **Bingo** fue recalibrado a 78,10 % tras la simulación aislada. El piloto sigue siendo exclusivamente virtual: no se habilitan pagos reales, retiros ni Yape. [1] [2]

Mi recomendación es usar un retorno teórico total objetivo de **80–84 %** en los juegos de tickets y una política pública de pozos: cuánto se aporta, quién participa, cuándo se cierra y cómo se sortean los fondos. Esto deja un margen técnico aproximado de **16–20 %** antes de costos, impuestos, fraude, medios de pago, promociones y soporte. No es una promesa de beneficio: el resultado real dependería del volumen, las promociones activas y los costos operativos.

## 2. Probabilidades y margen del diseño actual

El **retorno teórico al jugador (RTP)** es el premio esperado dividido entre el costo de una participación. El **margen teórico** es `100 % − RTP`. Los cálculos siguientes usan las fórmulas exactas de la implementación actual, sin descontar todavía las bonificaciones de bienvenida, misiones, recompensa diaria o promociones de racha. [1] [2]

| Modalidad actual | Probabilidad principal | Premio actual | RTP teórico | Margen teórico | Evaluación |
|---|---:|---:|---:|---:|---|
| Ruleta `0–36` | 1/37 = **2,7027 %** | 360 cr. con costo de 20 cr. | **48,6486 %** | **51,3514 %** | Margen muy alto para una experiencia de entretenimiento sostenido. |
| Jackpot, 5 posiciones | 1/C(20,5) = **0,00645 %** | Pozo; 4 aciertos: 1 200; 3: 240 | **49,0196 %** sin pozo | **50,9804 %** sin pozo | El pozo mejora el retorno, pero el resultado depende de participantes y del pozo inicial. |
| Bingo, cartilla ganadora | 1/3 = **33,3333 %** | 82 cr. con costo de 35 cr. | **78,0952 %** | **21,9048 %** | Recalibrado tras la simulación aislada; los pozos siguen desactivados. |
| Lotería `6/49` | 6 aciertos: **0,00000715 %** | 170 000 / 28 000 / 4 500 / 750 | **72,5014 %** | **27,4986 %** | Tabla principal activa en regla `v1.0.1`; Bola Extra, Crédito Seguro y pozo permanecen desactivados. |

En el Jackpot, con 100 boletos a 45 créditos, el pozo modelado sería 19 975 créditos y el RTP aproximado sube a **51,87 %**. Con 1 000 boletos sería 34 150 créditos y el RTP aproximado a **53,76 %**. Estos resultados incluyen el pozo inicial de 18 400 créditos y suponen la liquidación actual; no son una garantía de distribución real en cada ronda. [2]

## 3. Propuesta: minirruletas de 7, 13, 21 y 27 casillas

La idea de minirruletas es buena **si no fragmentas demasiado la audiencia**. No abriría las cuatro al mismo tiempo: empezaría con **7, 13 y 21 casillas**, y dejaría la de 27 como evento semanal. Cada una usa una selección única y un resultado HMAC verificable igual al de la ruleta principal, pero con un dominio menor.

Para un boleto de **10 créditos virtuales**, propongo estos premios directos. Se eligieron para lograr aproximadamente 77 % de RTP directo con importes enteros.

| Variante | Probabilidad de acertar | Premio directo sugerido | RTP directo | Margen directo |
|---|---:|---:|---:|---:|
| Ruleta 7 | 1/7 = 14,2857 % | 54 cr. | 77,1429 % | 22,8571 % |
| Ruleta 13 | 1/13 = 7,6923 % | 100 cr. | 76,9231 % | 23,0769 % |
| Ruleta 21 | 1/21 = 4,7619 % | 162 cr. | 77,1429 % | 22,8571 % |
| Ruleta 27 | 1/27 = 3,7037 % | 208 cr. | 77,0370 % | 22,9630 % |

### Pozo semanal de minirruleta

La propuesta más transparente sería asignar **5 % del valor del boleto perdido** al pozo semanal de la modalidad. El jugador que no reciba un premio directo obtiene una entrada al pozo; el fondo se entrega íntegro en un sorteo semanal verificable. Matemáticamente, el aporte de ese pozo agrega entre **4,29 % y 4,81 %** de RTP esperado, según el número de casillas, por lo que el retorno total aproximado queda entre **81,29 % y 81,81 %**. El margen estimado queda entre **18,19 % y 18,71 %** antes de promociones y costos.

Para no incentivar persecución de pérdidas, recomiendo una regla adicional: **máximo una entrada al pozo semanal por cuenta y por día**, aunque una persona juegue varias rondas sin premio. El aporte puede seguir alimentando el pozo, pero comprar más boletos no aumenta ilimitadamente las opciones de esa persona.

| Elemento de pozo | Regla recomendada |
|---|---|
| Aporte | 5 % del valor de cada boleto no premiado. |
| Elegibilidad | 1 entrada por cuenta y por día como máximo. |
| Cierre | Viernes, 20:00, zona horaria `America/Lima`. |
| Sorteo | Semilla comprometida al inicio de la semana, hash de entradas al cierre y revelación posterior. |
| Premio | 100 % del pozo neto publicado; sin modificación manual. |
| Transparencia | Total acumulado, número de entradas elegibles, versión de reglas y expediente público. |

## 4. Lotería v1.0.1: tabla principal activa y extensiones desactivadas

Lotería conserva el formato 6/49 con costo de **25 créditos virtuales**. La regla publicada `v1.0.1` activa únicamente la siguiente tabla principal:

| Aciertos principales | Premio sugerido | Probabilidad | Aporte aproximado al RTP |
|---:|---:|---:|---:|
| 6 | 170 000 cr. | 0,00000715 % | 0,0486 % |
| 5 | 28 000 cr. | 0,00184499 % | 2,0664 % |
| 4 | 4 500 cr. | 0,09686197 % | 17,4352 % |
| 3 | 750 cr. | 1,76504039 % | 52,9512 % |
| 0–2 | 0 cr. en tabla principal | 98,13624550 % | 0 % |

La tabla principal tiene RTP exacto de **72,5014 %** (presentado como **72,50 %**). Las siguientes funciones son propuestas separadas y permanecen desactivadas, evitando prometer ganancias engañosas.

| Función propuesta | Operación | Efecto cuantitativo |
|---|---|---:|
| **Bola Extra gratuita** | Tras los seis números principales se extrae una séptima bola de las 43 restantes. Puede crear categorías `5 + extra` o `4 + extra`; la probabilidad de `5 + extra` es **0,00004291 %** y la de `4 + extra`, **0,00450521 %**. | Su premio debe declararse por separado; con importes moderados no altera demasiado el RTP. |
| **Crédito Seguro** | Si el boleto no obtiene premio principal ni de Bola Extra, acredita **2 créditos virtuales**. No debe llamarse “premio garantizado” sin explicar su valor exacto. | Añade **7,8509 %** de RTP esperado. |
| **Pozo mensual** | Cada boleto sin premio aporta 2 % del valor base al fondo. Entrega máxima: una entrada mensual por cuenta y por día. | Añade cerca de **1,9627 %** de RTP esperado si se devuelve íntegramente. |

Con esa tabla, Crédito Seguro y pozo, el RTP estimado es **82,3150 %** y el margen teórico es **17,6850 %**. El pozo mensual debe cerrar en una fecha fija, por ejemplo el último domingo del mes a las 20:00, con reglas y semilla publicadas con antelación.

> No recomiendo implementar una “segunda bola que sí o sí hace ganar” si la persona debe pagar más para usarla. Esa frase puede ocultar un costo o una devolución menor que el valor del boleto. Es más honesto llamarla **Crédito Seguro de 2 créditos virtuales**, declarar cuándo aplica y mostrar su aporte al RTP.

## 5. Propuesta para Bingo y pozo semanal

El Bingo fue recalibrado tras la simulación aislada: paga **82 créditos** con probabilidad de un tercio. Para una cartilla entre tres y costo de 35 créditos, esto produce RTP directo de **78,10 %**. Antes de añadir un pozo semanal se requieren reglas versionadas y nuevas pruebas.

Si cada cartilla sin premio aporta **4 % del boleto** a un pozo semanal, el aporte esperado es aproximadamente `4 % × 2/3 = 2,67 %`. El RTP total resulta cercano a **80,76 %** y el margen teórico a **19,24 %**.

También recomiendo evolucionar el Bingo a cartillas reales, no solo a una “cartilla ganadora” abstracta: el servidor debe generar las cartillas, publicar el orden de llamados, identificar línea/cartón y dividir el premio entre empates. Mientras no exista esa mecánica, la comunicación debe decir simplemente **“cartilla ganadora”**.

## 6. Frecuencia: interés sostenido, no uso compulsivo

No recomiendo configurar rondas cada pocos minutos ni diseñar comunicaciones para que la gente juegue de forma compulsiva. Para el piloto, conviene una agenda predecible, pocas ventanas y eventos comunitarios claros.

| Producto | Cadencia propuesta | Propósito |
|---|---|---|
| Minirruleta 7/13 | 2 ventanas al día: 13:00 y 19:00 | Sesiones cortas y programadas. |
| Minirruleta 21 | Miércoles y domingo, 20:30 | Evento de mayor premio, sin apertura continua. |
| Minirruleta 27 | Viernes, 21:00 | Evento semanal con pozo. |
| Lotería | Lunes, miércoles y sábado, 20:00 | Da tiempo para revisar reglas y comprobantes. |
| Bingo | Sábado, 18:00 | Formato social, con agenda pública. |
| Pozos semanales | Viernes o domingo, horario fijo | Cierre verificable y sin urgencia artificial. |

La retención saludable debe basarse en reglas claras, calendario, progreso visible, expedientes verificables, misiones no monetarias y decisiones informadas. Recomiendo mantener las notificaciones **desactivadas por defecto**, no emitir recordatorios tras pérdidas, no usar falsas alertas de “casi ganas”, no ofrecer multiplicadores por perder repetidamente y permitir límites de sesiones, pausas y exclusión temporal desde el perfil.

## 7. Decisión recomendada

Para la siguiente versión del piloto, implementaría primero la **minirruleta 7/13/21**, un **pozo semanal con tope de una entrada por día**, la corrección urgente de la tabla de **Bingo**, y una **Lotería 6/49 con Bola Extra y Crédito Seguro claramente etiquetado**. Todas estas decisiones deben publicarse como reglas versionadas y verificables antes de abrir la primera ronda.

No activaría pagos reales ni Yape hasta tener: pruebas de liquidación completas, revisión de cumplimiento aplicable, límites monetarios, verificación de edad cuando corresponda, política de autoexclusión, auditoría del RNG y transparencia de RTP por producto.

## Referencias

[1]: ../server/pilot.ts "Motor de reglas, sorteos, pagos virtuales y liquidación del piloto"
[2]: ./parametros-piloto-juegos.md "Ficha de parámetros configurados del piloto"
