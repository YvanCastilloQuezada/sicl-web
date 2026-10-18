# Nomenclatura oficial y sincronización TV–PWA

**Proyecto:** Multi Juegos Perú  
**Documento:** Propuesta técnica y editorial para integración con TV y canal digital  
**Estado:** Diseño previo; no implica cambios de código ni activación de dinero real  
**Fecha:** 25 de agosto de 2026

## 1. Decisión editorial principal

La marca televisiva puede ser más breve y memorable que el identificador técnico, pero ambos deben aparecer en el expediente digital, en el verificador y en la documentación de auditoría. El nombre televisivo sirve para comunicar; el nombre técnico evita ambigüedades matemáticas.

La expresión **S/1** se reservará para una futura operación autorizada. Durante el piloto, la columna de precio debe decir **1 crédito virtual de referencia interna**, aunque el modelo contable utilice 1 crédito = 1 unidad PEN únicamente para conciliación de diseño. No existe cobro, retiro ni conversión.

## 2. Tabla oficial unificada

| Categoría | Nombre televisivo oficial propuesto | Nombre técnico actual | Clave técnica | Prefijo de comprobante | Precio piloto | RTP teórico vigente | Estado y observación |
|---|---|---|---|---|---:|---:|---|
| Ruleta | Ruleta Clásica | Ruleta piloto 0–36 | `ruleta` | BA | 1 crédito | 86,4865 % | El motor indica premio total de 32 por coincidencia exacta. La transparencia publicada contiene una cifra conflictiva de 48,65 % y debe revisarse antes de difusión. |
| Ruleta | Ruleta Mini | Ruleta 7 | `ruleta_7` | BB | 1 crédito | 85,7143 % | Variante simplificada; el 0 es verde y no cuenta como rojo/negro ni par/impar. |
| Ruleta | Ruleta Clásica 17 | Ruleta 17 | `ruleta_17` | BC | 1 crédito | 94,1176 % | Nombre televisivo diferenciado para no confundirla con la ruleta 0–36. |
| Ruleta | Ruleta Europea 27 | Ruleta 27 | `ruleta_27` | BD | 1 crédito | 96,2963 % | Variante técnica simplificada; la etiqueta “Europea” es editorial, no una afirmación de equivalencia regulatoria. |
| Ruleta | Ruleta Premium 37 | Ruleta 37 | `ruleta_37` | BE | 1 crédito | 97,2973 % | Variante de 37 casillas con apuestas simplificadas. |
| Jackpot | Jackpot | Jackpot piloto 5 posiciones | `jackpot` | CA | 1 crédito | 85,0426 % + pozo | Incluye sexta bola de consuelo bajo regla separada. |
| Bingo | Bingo Rápido | Bingo Flash | `bingo_flash` | DB | 1 crédito | 85,0549 % | Nombre televisivo propuesto para el bingo de tres números y diez extracciones. |
| Bingo | Bingo Números | Bingo Keno | `bingo_keno` | DC | 1 crédito | 85,0000 % | Conserva el nombre técnico Keno en auditoría; el nombre de pantalla puede ser Bingo Números. |
| Bingo | Bingo Americano | Bingo 75 | `bingo_75` | DD | 1 crédito | 85,1500 % estimado de transición | Requiere mantener la nota de validación empírica pendiente para la regla completa. |
| Bingo | Bingo Diario | Bingo piloto legado | `bingo` | DA | 1 crédito | 100 % del modelo simple | No debe presentarse como equivalente al Bingo 75; es una experiencia simplificada y separada. |
| Lotería | Lotería 19 | Lotería 19, 3/19 | `loteria_19` | AF | 1 crédito | 86,4809 % | Modalidad de entrada. |
| Lotería | Lotería 29 | Lotería 29, 6/29 | `loteria_29` | AA | 1 crédito | 92,2593 % | La cifra propuesta de 84,96 % no coincide con la tabla vigente; debe corregirse en la comunicación oficial. |
| Jackpot | Lotería 39 Extra | Lotería 39 MJP 6/39 + MJP Extra | `loteria_39` + extra | AB | 2 créditos | 75,1562 % | La tarifa total es 1 crédito base + 1 crédito Extra. La cifra de 85,15 % no corresponde al cálculo publicado para esta combinación. |
| Lotería | Lotería 39 MJP | Lotería 39 MJP, 6/39 | `loteria_39` | AB | 1 crédito | 87,0902 % | Debe conservar “MJP” en el expediente para distinguirla de la variante 5/39. |
| Lotería | Lotería 39 Cinco | Lotería 39, 5/39 | `loteria_39_5` | AK | 1 crédito | 85,0011 % | Nombre televisivo recomendado para evitar que la audiencia confunda 5/39 con 6/39. |
| Lotería | Lotería 49 | Lotería 49, 6/49 | `loteria_49` | AC | 1 crédito | 85,0821 % | La cifra propuesta de 84,93 % difiere del cálculo vigente. |
| Lotería | Lotería 59 | Lotería 59, 6/59 | `loteria_59` | AD | 1 crédito | 94,3736 % | Modalidad amplia; publicar siempre rango y cantidad de números. |
| Rápidos | Loto 3 | Pick 3 | `pick_3` | GC | 1 crédito | 85,1000 % | Dígitos 0–9, se permiten repeticiones y el orden importa. |
| Rápidos | Loto 4 | Pick 4 | `pick_4` | GD | 1 crédito | 85,1800 % | Dígitos 0–9, se permiten repeticiones y el orden importa. |
| Rápidos | Loto Express | Loto Express | `loto_express` | GF | 1 crédito | 85,0000 % | Ronda rápida cada 30 minutos en backend; la pauta televisiva debe mostrar solo sesiones seleccionadas. |
| Instantáneo digital | Raspa | Raspa Digital | `raspa_digital` | GB | 1 crédito | 85,0000 % | En TV se puede mostrar como segmento de revelación, pero no como sorteo físico. |
| Premium futuro | Raspa Premium | No implementado como modalidad independiente | — | — | No definido | No definido | No debe publicarse como activo hasta tener reglas, precio, RTP, comprobantes y pruebas propias. |
| Cartas | Trío 13 | Trío 13 | `cartas` | EA | 1 crédito | 86,8900 % | Puede presentarse con baraja clásica u otra temática visual sin cambiar la matemática. |
| Diferenciador | Sueldo de por vida | Sueldo de por vida | `sueldo_vida` | GA | 1 crédito | 86,0299 % | Las 24 cuotas son créditos virtuales; no son renta, pensión ni pago monetario. |
| Función transversal | Bola Extra | Paquetes de bola adicional de lotería | reglas específicas | AG–AJ según variante | +1 a +3 créditos | Variable | No agrupar automáticamente con el precio base; cada paquete requiere regla y RTP propios. |
| Función transversal | Lotes Mixtos | Creación por lote | múltiples claves | prefijo individual | Variable | El RTP depende de cada modalidad | Cada boleto conserva su comprobante y regla; no existe un RTP único del lote. |

### 2.1 Correcciones que deben aceptarse antes de publicar

La tabla del documento recibido es una buena base de comunicación, pero no puede considerarse todavía una tabla matemática oficial porque contiene varias cifras incompatibles con el motor vigente. Las discrepancias principales son Lotería 29, Lotería 39 Extra, Lotería 49, las ruletas simplificadas y la ausencia de Lotería 39 5/39. La recomendación es separar siempre **nombre de pantalla**, **clave técnica**, **rango**, **cantidad elegida**, **precio en créditos virtuales** y **RTP de la regla versionada**.

También recomiendo no usar “Raspa Premium S/5” ni cualquier precio en soles como producto activo. Puede conservarse como idea de producto futuro, pero necesita una especificación independiente y aprobación posterior.

## 3. Flujo técnico exacto TV–QR–PWA

### 3.1 Principio de seguridad

La transmisión televisiva nunca genera ni modifica el resultado. El servidor cierra la ronda, bloquea las participaciones, publica el compromiso criptográfico, genera el resultado con el algoritmo autoritativo y entrega a la TV únicamente estados y evidencias. La TV es una capa de presentación; la PWA es una capa de interacción; el motor de rondas es la autoridad.

### 3.2 Flujo previo al programa

1. El operador selecciona una modalidad aprobada y una ronda específica. El servidor registra `broadcastId`, `roundId`, `gameType`, versión de reglas, horario de apertura, horario de cierre y zona horaria UTC.
2. El servidor crea o asigna la ronda y publica el hash de la semilla del servidor antes del cierre. El conjunto de boletos se mantiene abierto solo hasta la hora definida.
3. El servidor genera un payload QR firmado y de vida corta. Como mínimo contiene `broadcastId`, `roundId`, clave técnica, versión de reglas, fecha de expiración, URL pública y un nonce. El QR no contiene créditos, datos personales ni decisiones de premio.
4. El sistema gráfico de TV recibe una URL pública de lectura y muestra nombre televisivo, precio como crédito virtual, cuenta regresiva y QR. Si el QR caduca, el gráfico debe indicar “ronda cerrada” y no reutilizarlo.

### 3.3 Flujo del espectador en la PWA

1. El espectador escanea el QR con la cámara del celular. La PWA abre una ruta de campaña que valida el token firmado y consulta el estado público de la ronda.
2. La PWA presenta el nombre televisivo y, debajo, el nombre técnico abreviado: por ejemplo, “Lotería 39 Extra · 6/39 + Extra”. También muestra que se trata de créditos virtuales, el cierre y el RTP teórico de la regla aplicable.
3. El usuario selecciona sus números o activa generación aleatoria. La PWA envía la participación al backend con `broadcastId`, `roundId`, selección, modalidad y clave de idempotencia.
4. El backend valida autenticación cuando corresponda, límites de uso, reglas, duplicados, precio virtual y estado abierto de la ronda. La respuesta devuelve un comprobante individual con prefijo, por ejemplo `AB-XXX-XXX-XXX-XXX-XXX`.
5. La PWA muestra confirmación, hora UTC de cierre, regla aplicada y enlace a la verificación. No debe prometer que la participación influirá en el resultado ni mostrar probabilidades personalizadas engañosas.

### 3.4 Cierre y transmisión del resultado

1. Al llegar al cierre, el servidor cambia la ronda a `locked`; rechaza nuevas participaciones y fija el hash del conjunto de boletos.
2. El servidor ejecuta el sorteo autoritativo HMAC-SHA-256 con rechazo uniforme y la regla versionada de la ronda. La animación de bolillas o ruleta se limita a representar el resultado ya calculado.
3. El servidor registra semilla revelada, semilla pública, resultado, tabla aplicada, hash de boletos, versión de algoritmo y movimientos de liquidación virtual.
4. La API pública de TV devuelve un estado `drawn` con el resultado y el ID de verificación. El gráfico de TV muestra el resultado, la hora UTC y un segundo QR, destinado a “Verificar este sorteo”.
5. La PWA recibe el resultado por consulta periódica segura en la primera versión. Más adelante se puede añadir SSE o WebSocket para actualización en tiempo real, pero el resultado debe seguir siendo recuperable por HTTPS y no depender de una conexión permanente.
6. El usuario consulta su comprobante. La PWA muestra coincidencias, premio virtual, regla, estado de liquidación y enlace al verificador público. El verificador expone hash previo, semilla revelada, semilla pública, hash del conjunto, algoritmo, resultado y versión de reglas.

### 3.5 Estados de sincronización

| Estado | TV | PWA | Servidor |
|---|---|---|---|
| `scheduled` | Anuncia próxima ronda | Muestra cuenta regresiva | Ronda definida, aún no abierta |
| `open` | QR de participación | Permite seleccionar y confirmar | Acepta boletos y registra idempotencia |
| `locked` | Indica “participación cerrada” | Impide nuevos envíos | Congela boletos y hashes |
| `drawing` | Muestra animación neutral | Espera resultado | Ejecuta sorteo autoritativo |
| `drawn` | Muestra resultado y QR de verificación | Calcula coincidencias y premio virtual | Conserva expediente auditable |
| `verified` | Puede mostrar sello de verificación | Expone todos los campos de prueba | Sirve evidencia pública |
| `cancelled` | Informa anulación | Devuelve al historial sin premio | Conserva razón y auditoría |

### 3.6 Recomendación de infraestructura por fases

Para el piloto, basta una API pública de lectura, un generador de QR con firma, consulta periódica desde la PWA y una plantilla de gráficos para OBS, vMix u otro sistema de emisión. La integración en tiempo real mediante SSE o WebSocket puede esperar hasta que se mida la audiencia y se confirme el volumen. WhatsApp, SMS y control remoto deben tratarse como canales posteriores, cada uno con su propio consentimiento, costos, privacidad, conciliación y soporte.

## 4. Ideas de programación para TV y canal digital

El formato más sólido sería un programa principal de 25–30 minutos, con un bloque de juego rápido, un juego principal, un segmento visual de bingo o ruleta, un segmento semanal de Sueldo de por vida y un cierre de verificación. El canal digital puede reutilizar cada emisión en clips breves, tutoriales de probabilidades, explicación de créditos virtuales, resumen verificable y sesiones de práctica.

La interacción debe premiar la participación responsable y el aprendizaje, no la permanencia indefinida. Son recomendables un modo Aprender, pausas visibles, límites de sesión, ranking por constancia o precisión de predicciones y desafíos gratuitos. No conviene mostrar “ganadores” reales sin consentimiento documentado ni usar testimonios inventados; cualquier historia debe ser real y autorizada o presentarse como dramatización ficticia.

## 5. Decisión recomendada

Aprobar la nomenclatura de dos capas: **marca televisiva breve + clave técnica invariable**. Para la primera temporada, priorizar Loto 3, Lotería 19, Lotería 29, Lotería 39 MJP, Bingo Rápido, Ruleta Mini y Sueldo de por vida. Incorporar Lotería 39 Extra únicamente cuando se muestre con claridad que cuesta 2 créditos virtuales y que su RTP es independiente del RTP base.

Antes de producir piezas definitivas, deben cerrarse las cifras discrepantes en una única regla versionada, corregirse la transparencia pública y aprobarse el guion legal del aviso de piloto gratuito, créditos virtuales, ausencia de dinero real y ausencia de retiros.

## Referencias internas

1. `server/pilot.ts`: catálogo autoritativo del motor, precios, premios y reglas.
2. `shared/lotteryVariants.ts`: variantes de lotería, probabilidades y RTP teórico.
3. `shared/simplifiedGames.ts`: configuraciones de Bingo y Ruletas simplificadas.
4. `shared/ticketIdentifiers.ts`: prefijos y formato de comprobantes.
5. `client/src/pages/TransparenciaPage.tsx`: cifras actualmente expuestas al público.
6. `client/src/pages/Verify.tsx`: campos y pasos de verificación pública existentes.
7. `pasted_content_19.txt`: propuesta editorial de TV e interacción recibida del usuario.
