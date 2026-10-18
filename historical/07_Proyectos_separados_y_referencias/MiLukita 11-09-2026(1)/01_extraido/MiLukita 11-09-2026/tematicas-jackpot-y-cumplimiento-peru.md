# Temáticas, tamaños de Jackpot y cumplimiento en Perú

> **Nota de cumplimiento:** esto es un análisis técnico de producto, no una opinión legal vinculante. Antes de activar dinero real, valida el programa de juego, RTP, tablas de pagos, sistema progresivo, RNG, controles de edad y protección del jugador con un laboratorio autorizado y asesoría especializada en Perú.

## Conclusión corta

**Sí recomiendo las temáticas**, pero como una capa visual sobre un conjunto de resultados con tamaño fijo, reglas publicadas y misma probabilidad para cada elemento. Un animal, país, color o letra no debe tener ventajas ocultas frente a otro. La plataforma debe mostrar siempre el número de opciones, el mapeo estable, la semilla y el RTP de la modalidad.

No recomiendo asumir que “70 % se reparte y 30 % es para la casa” sea una regla general permitida para juegos a distancia en Perú. La Ley N.° 31557 exige que las modalidades no afecten el porcentaje mínimo de retorno al público y somete los programas de juego, sistemas progresivos y porcentajes de retorno a autorización/certificación de MINCETUR. [1] El formato oficial 2025 de certificación menciona expresamente juegos con RTP inferior al mínimo de **85 %**, por lo que una política 70/30 (RTP 70 %) debe considerarse de alto riesgo de incumplimiento hasta contar con validación formal; no debe adoptarse como regla de lanzamiento. [3]

## 1. Temáticas para Ruleta y Jackpot

La forma correcta es separar el **motor matemático** de la **presentación temática**. El motor elige un índice de un conjunto cerrado; la interfaz muestra la etiqueta que corresponde a dicho índice. El catálogo debe estar versionado, visible antes de jugar e inmutable dentro de cada ronda.

| Tamaño del conjunto | Temas recomendados | Comentario de diseño |
|---:|---|---|
| 7 | Colores, días, constelaciones, regiones simbólicas | Adecuado para minirruleta; todas las opciones deben ser inequívocas. |
| 13 | Signos, instrumentos, tesoros, personajes ficticios | Funciona como ruleta rápida; usar icono, nombre y código interno. |
| 21 | Animales andinos, destinos peruanos, culturas prehispánicas estilizadas | Requiere curaduría y lista pública de 21 elementos. |
| 27 | Letras del alfabeto español moderno | Es la mejor temática de letras: 27 opciones exactas, sin letras dobles. |
| 37 | Números, animales, países, sabores, gemas u objetos coleccionables | Para conservar la ruleta clásica, el catálogo debe contener exactamente 37 elementos. |
| 49 | Países, aves, plantas, iconos, letras + símbolos | Conveniente para Jackpot 7×7; no usar nombres reales de usuarios. |

Los **nombres de personas** no son mi primera recomendación: pueden generar temas de identidad, homónimos, referencias a menores o confusión. Si se usan, deben ser personajes ficticios o arquetipos, sin datos personales y con un catálogo cerrado. Para países y animales, conviene incluir búsqueda, icono, etiqueta y un código permanente; no se debe cambiar una etiqueta después de la apertura de la ronda.

### Regla de transparencia propuesta

Para cada ronda debe publicarse una tabla como esta antes de aceptar participaciones:

| Campo público | Ejemplo |
|---|---|
| Modalidad | `Ruleta 27 · Letras` |
| Versión del catálogo | `letras-es-v1` |
| Opciones | `A, B, C, …, Ñ, …, Z` |
| Dominio matemático | Índices `0–26` |
| Probabilidad por opción | `1/27 = 3,7037 %` |
| RTP teórico | Porcentaje certificado de la tabla de pagos |
| Semilla comprometida | `SHA-256` de la semilla privada |

El sorteo selecciona un índice; la etiqueta es solo su traducción visual. De esta manera, “Cóndor”, “Perú” o “Ñ” tienen exactamente la misma probabilidad si ocupan una casilla del mismo conjunto.

## 2. Jackpot por tamaño de tablero

La propuesta de tableros `3×3` hasta `7×7` es viable, pero no deben tratarse todos como el mismo “jackpot”. A medida que aumenta el tablero, la probabilidad de acertar la combinación completa cae de forma muy pronunciada. La tabla siguiente supone que el jugador selecciona una cantidad de casillas igual al lado del tablero y que el servidor sortea la misma cantidad sin repetición.

| Variante | Casillas | Selección | Probabilidad de premio máximo | Probabilidad de 1 nivel inferior | Uso recomendado |
|---|---:|---:|---:|---:|---|
| Jackpot 3×3 | 9 | 3 | 1/84 = **1,190476 %** | 2 aciertos: **21,428571 %** | Minijuego diario; no pozo gigante. |
| Jackpot 4×4 | 16 | 4 | 1/1 820 = **0,054945 %** | 3 aciertos: **2,637363 %** | Sorteo diario o semanal corto. |
| Jackpot 5×5 | 25 | 5 | 1/53 130 = **0,001882 %** | 4 aciertos: **0,188218 %** | Pozo semanal. |
| Jackpot 6×6 | 36 | 6 | 1/1 947 792 = **0,000051 %** | 5 aciertos: **0,009241 %** | Evento quincenal o mensual. |
| Jackpot 7×7 | 49 | 7 | 1/85 900 584 = **0,00000116 %** | 6 aciertos: **0,000342 %** | No lo recomiendo para el piloto salvo que tenga premios secundarios claros y un pozo grande. |

La recomendación práctica es lanzar **3×3, 4×4 y 5×5** primero. El 3×3 debe repartir frecuentemente premios pequeños por 1 o 2 coincidencias; el 4×4 puede ofrecer tres niveles; y el 5×5 puede usar un pozo semanal más premios por 3 y 4 coincidencias. Los tamaños 6×6 y 7×7 producen una expectativa de premio máximo demasiado remota para un producto nuevo y corren el riesgo de comunicar una ilusión de accesibilidad.

### Tabla de pagos concreta para el piloto

La siguiente tabla usa un boleto de **10 créditos virtuales**. El RTP base se calcula solo con los premios directos. El RTP total incorpora un aporte de **7 % al pozo progresivo** y hasta **1 % en bonos no monetarios**, ambos publicados por anticipado. El pozo se debe devolver íntegramente mediante su regla pública de elegibilidad; no es ingreso de la casa.

| Variante | Premios directos por coincidencia | RTP base | Pozo + bonos | RTP total estimado | Margen teórico |
|---|---|---:|---:|---:|---:|
| 3×3 | 3: 90 cr.; 2: 29 cr.; 1: 1 cr. | 78,2143 % | 8 % | **86,2143 %** | **13,7857 %** |
| 4×4 | 4: 2 000 cr.; 3: 50 cr.; 2: 25 cr. | 78,5714 % | 8 % | **86,5714 %** | **13,4286 %** |
| 5×5 | 5: 30 000 cr.; 4: 1 200 cr.; 3: 140 cr. | 78,2985 % | 8 % | **86,2985 %** | **13,7015 %** |
| 6×6 | 6: 900 000 cr.; 5: 6 000 cr.; 4: 2 030 cr. | 78,1693 % | 8 % | **86,1693 %** | **13,8307 %** |
| 7×7 | 7: 4 000 000 cr.; 6: 300 000 cr.; 5: 32 000 cr. | 78,0893 % | 8 % | **86,0893 %** | **13,9107 %** |

Estos montos son una **propuesta de piloto en créditos virtuales**, no importes aprobados para dinero real. Antes de comercializarlos, deben ajustarse a límites de exposición, liquidez del pozo, impuestos y al RTP certificado de cada programa.

## 3. Margen y retorno: propuesta que no compromete el cumplimiento

Para dinero real no usaría 70/30. Como criterio de diseño, apuntaría a un **RTP total publicado de 88–90 %** por programa de juego, dejando un margen bruto aproximado de 10–12 % antes de impuestos, fraude, pagos, soporte y promociones. Esta meta crea un colchón por encima del umbral de 85 % mencionado en el formato técnico de MINCETUR; no reemplaza la certificación exigible. [3]

| Componente de la tabla | Rango sugerido | Condición |
|---|---:|---|
| Premios directos | 78–82 % del valor de participación | Calculados por niveles de coincidencias. |
| Contribución a pozo | 5–7 % | Fondo visible y 100 % asignado a ganadores elegibles. |
| Bonos/misiones | 1–2 % | Tope por usuario y por periodo; nunca ocultos. |
| RTP total objetivo | **88–90 %** | Publicado por juego, tabla y versión. |
| Margen bruto teórico | **10–12 %** | Antes de costos e impuestos. |

El pozo debe especificar si es obligatorio u opcional, su valor base, el porcentaje de contribución, el criterio de distribución, tratamiento de empates y destino del saldo cuando no haya ganador. Esto coincide con la definición legal de sistema progresivo: un programa autorizado/registrado cuyo premio se incrementa según un porcentaje de las apuestas y las reglas aplicables. [1]

## 4. Modelo de pozo responsable

Un pozo semanal o mensual puede ser atractivo, pero debe evitar convertirse en una mecánica que empuje a perseguir pérdidas. Propongo una entrada gratuita o limitada: quien tenga una jugada no premiada recibe **máximo una entrada por día y por producto**, aunque haya realizado varias jugadas. Así el pozo no recompensa la repetición ilimitada.

| Campo del pozo | Requisito recomendado |
|---|---|
| Aporte | Porcentaje exacto visible por boleto, por ejemplo 6 %. |
| Elegibilidad | Una entrada por usuario, producto y día. |
| Periodo | Semanal para Jackpot/Bingo; mensual para Lotería. |
| Cierre | Fecha, hora y zona horaria `America/Lima` publicadas. |
| Elegidos | Lista final hasheada antes del sorteo. |
| Sorteo | Semilla comprometida, semilla revelada y verificador público. |
| Empates | Regla de división publicada antes de abrir el periodo. |
| Remanente | Se acumula o se liquida según una regla previamente versionada. |

## 5. Requisitos regulatorios que importan para el proyecto

La Ley N.° 31557 regula la explotación de juegos a distancia, define a MINCETUR como autoridad de autorización, supervisión y sanción, y prevé la certificación de plataformas, programas de juego, sistemas progresivos y porcentajes de retorno. También exige protección de menores y políticas de juego responsable. [1] El Reglamento fue aprobado por el Decreto Supremo N.° 005-2023-MINCETUR. [2]

El formato de certificación 2025 incluye, como tipos a ensayar, ruleta, Keno/Bingo, juegos de extracción de bolas, juegos virtuales, sistemas progresivos y juegos con RTP inferior al mínimo de 85 %. [3] Por ello, cada tema nuevo, tamaño de Jackpot, tabla de pagos o pozo debe considerarse una variante o programa a documentar y potencialmente certificar antes de comercializarse.

> **Decisión recomendada:** mantén el portal en piloto gratuito, implementa primero temáticas solo como catálogos equivalentes, y no fijes una política 70/30 ni cobres mediante Yape hasta obtener una validación expresa del programa de juego, del RTP y del sistema progresivo aplicable.

## Referencias

[1]: https://busquedas.elperuano.pe/dispositivo/NL/2095517-1 "Ley N.° 31557 — Ley que regula la explotación de los juegos a distancia y apuestas deportivas a distancia"

[2]: https://www.gob.pe/institucion/mincetur/normas-legales/4743535-005-2023-mincetur "Decreto Supremo N.° 005-2023-MINCETUR"

[3]: https://apuestasdeportivas.mincetur.gob.pe/PDF/FORMATOS_CERTIFICADOS_CUMPLIMIENTO_2025.pdf "Formatos de Certificado de Cumplimiento — MINCETUR, 2025"
