# Propuesta: Trío 13 y MultiMarket Perú virtual

> **Límite de lanzamiento:** las dos propuestas deben permanecer en **créditos virtuales**, sin Yape, depósitos, retiros, contratos transferibles ni equivalencia a soles. La investigación regulatoria no identificó una autorización específica para un mercado de predicción usuario a usuario sobre política, economía o sucesos mundiales; por ello no recomiendo monetizarlo sin una evaluación jurídica y de certificación formal. [1] [2]

## 1. Juego de cartas recomendado: Trío 13

Propongo **Trío 13**, un juego muy simple de entender y visualmente atractivo. En vez de elegir 13 cartas, la persona elige **tres rangos distintos** dentro de un mazo de 13 rangos; por ejemplo, `A`, `7` y `K`. El servidor baraja el conjunto y revela tres rangos ganadores. Se pagan premios por una, dos o tres coincidencias. Las figuras pueden mostrar animales, destinos peruanos o gemas, pero siempre deben conservar el mismo índice matemático.

| Parámetro | Diseño propuesto |
|---|---|
| Dominio | 13 rangos equivalentes: `A, 2–10, J, Q, K` o un catálogo temático de 13 elementos. |
| Selección | 3 rangos distintos. |
| Resultado | 3 rangos distintos extraídos sin reemplazo. |
| Costo del piloto | 10 créditos virtuales. |
| Barajado | Extracción sin reemplazo con HMAC-SHA-256 y rechazo uniforme, usando una semilla comprometida antes del cierre. |
| Evidencia | Hash de semilla, hash de boletos, orden revelado, reglas y expediente verificable. |

Las probabilidades exactas son las siguientes:

| Coincidencias | Probabilidad | Pago propuesto | Aporte al retorno |
|---:|---:|---:|---:|
| 3 | 0,349650 % | 700 cr. | 24,4755 % |
| 2 | 10,489510 % | 37 cr. | 38,8112 % |
| 1 | 47,202797 % | 5 cr. | 23,6014 % |
| 0 | 41,958042 % | 0 cr. | 0 % |

Con esos pagos, el **RTP base** es aproximadamente **86,89 %** y el margen teórico es **13,11 %**. En un futuro con dinero real, la tabla deberá certificarse y ajustarse a los requisitos aplicables; en piloto se expresa solo como créditos virtuales.

## 2. Variantes temáticas de cartas

El motor trabaja con los índices internos `1–13`. Cada tema es un catálogo versionado, de trece elementos exactos, que traduce el índice a una carta visual.

| Tema | Ejemplos de las 13 cartas | Observación |
|---|---|---|
| Baraja clásica | A, 2–10, J, Q, K | La opción más reconocible. |
| Fauna peruana | Cóndor, vicuña, oso de anteojos, jaguar, etc. | Requiere catálogo culturalmente revisado. |
| Rutas del Perú | Lima, Cusco, Arequipa, Iquitos, etc. | Deben ser 13 destinos predefinidos. |
| Gemas y minerales | Oro, plata, amatista, cuarzo, etc. | Buen encaje visual con el estilo premium. |
| Símbolos andinos | Elementos estilizados y no sagrados | Evitar usos irrespetuosos o engañosos. |

El jugador ve la temática, pero las probabilidades no cambian. No se deben permitir cartas con datos personales, nombres de personas reales, menores de edad o contenido ofensivo.

## 3. MultiMarket Perú: piloto de predicciones virtuales

MultiMarket no debe diseñarse como una página donde “la gente apuesta lo que quiera”. Un mercado útil necesita preguntas binarias, fecha de cierre, fuente de resolución, plazo, reglas de anulación y moderación antes de habilitar cualquier participación. La propuesta es una experiencia de **predicciones colectivas con créditos virtuales**, no una casa de apuestas ni una bolsa de dinero real.

| Elemento | Regla del piloto |
|---|---|
| Contrato | `Sí` o `No`; paga 100 créditos virtuales si el resultado se resuelve a favor y 0 si no. |
| Precio | Entre 1 y 99 créditos virtuales; se presenta como probabilidad implícita, no como certeza. |
| Liquidación | Se resuelve contra una fuente pública definida antes de abrir el mercado. |
| Cierre | Se bloquea antes del evento; no se permiten operaciones posteriores. |
| Reembolso | Mercado anulado si la fuente es ambigua, el evento cambia o no se puede resolver. |
| Saldo | Solo créditos virtuales del piloto; sin retiros ni conversión a soles. |
| Auditoría | Historial de precios, participantes agregados, reglas, decisión de resolución y fuente utilizada. |

Por ejemplo, un contrato `Sí` con precio de 60 créditos representa una probabilidad implícita cercana al 60 % antes de cualquier cargo teórico. En el piloto, no recomiendo comisión: el objetivo es probar la interfaz, comprensión de precios y calidad de las reglas, no generar margen. Si algún día se estudia una modalidad regulada, la comisión, el formador de mercado y la exposición deben ser objeto de una revisión legal y de riesgo independiente.

## 4. Categorías permitidas y prohibidas

La calidad del mercado depende más de sus reglas de inclusión que de la cantidad de preguntas. Durante el piloto, el catálogo debe ser curado; no hay publicación automática por usuarios.

| Permitido en piloto, con fuente pública | No permitido durante el piloto |
|---|---|
| Entretenimiento y premios de industria ya anunciados. | Elecciones, campañas, encuestas políticas o decisiones legislativas. |
| Hitos verificables de productos, cultura y tecnología. | Violencia, conflictos, delitos, muerte, salud individual o desastres. |
| Resultados públicos de deportes si no se mezcla con apuestas reales. | Eventos sobre menores, personas privadas o datos personales. |
| Publicaciones oficiales con fecha y resultado inequívoco. | Mercados financieros, precios de activos, criptomonedas o recomendaciones de inversión. |
| Preguntas educativas o de cultura general con fecha de cierre. | Preguntas ambiguas, subjetivas, manipulables o creadas libremente sin moderación. |

El ejemplo “¿mañana darán una ley?” no es suficientemente preciso. Una versión válida tendría que decir algo como: “¿El Diario Oficial publicará una ley identificada por número antes de las 23:59 de una fecha concreta?”, nombrar la fuente de resolución y pasar revisión humana. Aun así, no lo incluiría en el primer piloto por el carácter político-legislativo y regulatorio del tema.

## 5. Cómo proponer mercados: tres alternativas

El sistema puede ayudar a investigar, pero no debe crear ni resolver mercados por sí solo. Estas son las alternativas viables:

| Enfoque | Cómo funciona | Ventajas | Riesgos y esfuerzo |
|---|---|---|---|
| Curaduría editorial | Un operador redacta la pregunta, fuente, fecha y regla de anulación. | Máxima claridad y menor riesgo. | Menos volumen de mercados. |
| Asistencia de investigación | El sistema sugiere borradores y fuentes públicas; un moderador aprueba, edita y publica. | Escala moderada sin perder control. | Requiere cola de revisión y trazabilidad. |
| Publicación automática | Un sistema investiga y crea mercados sin revisión. | Mayor volumen aparente. | No recomendable: riesgo de ambigüedad, manipulación, contenido sensible y resolución errónea. |

Para MultiMarket Perú recomiendo la segunda opción: **asistencia de investigación con aprobación humana obligatoria**. El sistema puede entregar una ficha de propuesta, pero una persona responsable debe validar la pregunta, el plazo, la fuente y la categoría antes de abrirla.

## 6. Interfaz propuesta

La navegación debe añadir una sección `MultiMarket` separada de `Juegos`. No debe usar el lenguaje de ruleta ni presentar urgencia artificial. La pantalla de cada mercado muestra la pregunta, el precio de `Sí` y `No`, el cierre, la fuente de resolución, la regla de anulación y una visualización histórica de probabilidades.

| Vista | Componentes principales |
|---|---|
| Inicio MultiMarket | Mercados destacados, filtros de categoría, calendario, explicación de precios y aviso de créditos virtuales. |
| Ficha de mercado | Pregunta binaria, Sí/No, precio, gráfico de evolución, fuente, cierre, reglas y expediente de resolución. |
| Proponer mercado | Formulario de borrador; no publica automáticamente; exige fuente verificable y fecha. |
| Moderación | Cola de revisión, riesgo, categoría, fuente, resolución y registro de cambios. |
| Perfil | Posiciones virtuales, resultados, límites de uso y comprensión de riesgo. |
| Pozos | Solo para juegos de azar; MultiMarket no mezcla pozos con contratos de predicción. |

## 7. Estado de la implementación del piloto

| Componente | Estado actual | Límite de seguridad |
|---|---|---|
| Trío 13 | Implementado en el motor verificable con premios de 700 / 37 / 5 créditos para 3 / 2 / 1 coincidencias. | Solo créditos virtuales; no puede canjearse ni retirarse. |
| MultiMarket | Implementada la infraestructura para contratos fijos Sí/No, posiciones virtuales, liquidación y anulación con reembolso. | Solo un operador administrador puede abrir, resolver o anular un mercado permitido. |
| Publicación | La interfaz pública muestra únicamente mercados con una fuente y regla de resolución ya publicadas. | No hay publicación de usuarios ni generación automática de preguntas. |
| Impacto social | La página de divulgación expresa una propuesta futura de hasta 1 % de utilidades netas. | El piloto no genera dinero ni aportes reales; no se descontarán premios automáticamente. |

## 8. Ruta de implementación recomendada

Primero implementaría **Trío 13** con una temática clásica, su expediente verificable y tabla visible. Después, crearía las pantallas estáticas de MultiMarket con datos de demostración claramente marcados como tales. La siguiente fase sería un módulo de mercados virtuales curados con una sola categoría de bajo riesgo, fuente pública predefinida y resolución manual auditada.

No implementaría aún investigación automatizada, preguntas políticas/económicas ni dinero real. Para automatizar propuestas futuras hay que elegir entre la curaduría editorial y la asistencia con aprobación humana; ambas son más seguras que publicar automáticamente contenido generado desde fuentes externas.

## Referencias

[1]: https://apuestasdeportivas.mincetur.gob.pe/ "Portal oficial de juegos online y apuestas deportivas de MINCETUR"

[2]: https://busquedas.elperuano.pe/dispositivo/NL/2095517-1 "Ley N.° 31557 — Ley que regula la explotación de los juegos a distancia y apuestas deportivas a distancia"
