# Revisión técnica del proyecto «Ruleta Perú»

**Archivo revisado:** `Ruleta Perú 28-7-2024.xlsm`  
**Autor registrado:** Yván Castillo  
**Fecha de creación registrada:** 13/06/2024  
**Última modificación registrada:** 24/08/2026  
**Alcance:** inspección estática del libro, sus fórmulas, estructura XML, controles, código VBA extraído y una copia recalculada. **No ejecuté macros, no realicé apuestas ni alteré el archivo original.** Esta es una revisión técnica del prototipo; no constituye una certificación de juego justo, seguridad, cumplimiento regulatorio ni operación con dinero real.

## 1. Opinión ejecutiva

Mi opinión es que el proyecto tiene una **idea funcional clara y una base de prototipo bastante avanzada**, pero todavía no lo consideraría listo para una operación real o para manejar dinero y datos personales sin una etapa de endurecimiento importante. El archivo combina una portada interactiva, formularios VBA, generación de cartillas, una base de 5.000 registros, cálculo de aciertos, clasificación de premios, reportes de ganadores y una simulación adicional de bingo/lotería. Esa amplitud demuestra trabajo y visión de producto.

Sin embargo, el diseño actual depende demasiado de macros, ActiveX, rutas locales y archivos externos. Además, la persistencia de una compra no aparece implementada en el flujo de aceptación revisado; la ruleta contiene al menos un desajuste de índices que puede impedir mostrar ciertos resultados; la prevención de repetición no se aplica como parece pretenderse; y la aleatoriedad usa caminos distintos, uno de ellos con una reducción modular potencialmente sesgada. Por ello, lo clasificaría como **prototipo demostrable, no sistema operativo confiable**.

| Dimensión | Evaluación | Comentario principal |
|---|---:|---|
| Concepto y propuesta | **8/10** | La navegación «Ruleta / Jackpot / Pagar» comunica bien la experiencia prevista. |
| Cobertura funcional | **7/10** | Hay formularios, cálculos, búsqueda, simulación y reportes, pero el flujo no está cerrado de punta a punta. |
| Calidad del cálculo | **5/10** | Las fórmulas recalculan sin errores visibles en la muestra, pero hay requisitos documentados que no coinciden con los resultados y reglas difíciles de auditar. |
| Robustez operativa | **3/10** | Hay rutas locales, vínculo externo, dependencia de ActiveX y ausencia de protección/validación de hoja. |
| Privacidad y control | **3/10** | Los teléfonos y jugadas quedan expuestos en la base y en la impresión; no se observa un esquema de acceso o enmascaramiento. |
| Preparación para producción | **2/10** | Requiere correcciones críticas, pruebas automatizadas y una arquitectura menos dependiente del equipo del autor. |

## 2. Qué contiene el libro

El archivo es un paquete XLSM íntegro, de aproximadamente 25,7 MB, con siete hojas visibles. Incluye un proyecto VBA embebido de aproximadamente 17,8 MB, seis artefactos ActiveX, un `calcChain.xml` de aproximadamente 1,1 MB y un vínculo externo a otro libro local. La integridad física del paquete es correcta: la prueba ZIP no reportó errores y la conversión a PDF/XLSX se completó; esto no equivale, sin embargo, a validar la lógica de negocio. [1] [2]

| Hoja | Contenido observado | Magnitud / estado | Función aparente |
|---|---|---:|---|
| `Inicio` | Portada gráfica y botones | `A1:X51`, sin celdas con datos | Menú de entrada a Ruleta, Jackpot y Pagar. |
| `Jugadas` | Calendario de juegos y reglas de distribución | 88 filas de juego, 194 fórmulas | Construcción de horario, identificadores y porcentajes/montos. |
| `Ganadores1y2` | Encabezados de boleto, nombre, celular, apuesta, aciertos y premios | Solo encabezados | Salida preparada para una hoja de ganadores. |
| `BaseDeDatos` | Boletos, celulares, apuestas, números, aciertos, bolilla adicional, premios y resúmenes | 5.000 filas; 45.039 fórmulas | Motor central de verificación y clasificación de resultados. |
| `RuleBingo 10x10` | Explicación de una lotería relámpago, ingresos, egresos y ejemplos | 54 fórmulas | Modelo conceptual/económico de una modalidad adicional. |
| `Tipos` | Tipos de jugada, cantidad de bolillas, aciertos, premios y porcentajes | 49 fórmulas | Tabla de reglas y distribución de premios. |
| `Registro` | Jugadores, celulares, apuestas, números y premios | 100 registros; 194 fórmulas | Registro de demostración y cartilla de bingo. |

La hoja activa está configurada para abrir en la cuarta hoja, `BaseDeDatos`, no en la portada. Esto puede producir una primera impresión confusa para un operador, porque el usuario puede esperar ver el menú `Inicio` y encontrarse directamente con una tabla interna de datos. [1]

## 3. Funcionalidades identificadas

### 3.1. Portada y navegación

La hoja `Inicio` no depende de celdas de contenido: es una pantalla dibujada con imágenes y controles. Sus tres botones están enlazados a `AbrirUserFormJugar38`, `AbrirUserFormJackpot` y `AbrirUserFormNuevaCartilla`. La portada puede verse como una interfaz atractiva dentro de Excel, pero si las macros están deshabilitadas los botones dejan de ser funcionales; en una exportación a PDF solo aparece esencialmente la gráfica de portada. [3] [4]

### 3.2. Compra o creación de una jugada

`UserFormNuevaCartilla` permite seleccionar un juego a partir de la hoja `Jugadas`, elegir un multiplicador, definir una cantidad de jugadas, generar números aleatorios o seleccionar números manualmente, validar un DNI de ocho dígitos y un celular peruano de nueve dígitos iniciado en 9, cargar una imagen asociada a Yape, escuchar por voz el monto a pagar y generar un identificador textual del boleto. También tiene controles multimedia y funciones para limpiar la cartilla. [5]

El problema más importante es que el manejador `CommandButtonAceptar_Click` únicamente actualiza etiquetas y valida que existan opciones obligatorias; en el código revisado no escribe el nombre, DNI, celular, operación, juego, multiplicador ni números seleccionados en `BaseDeDatos`. La búsqueda exhaustiva en los módulos extraídos tampoco encontró una rutina alternativa que complete esa persistencia. Por tanto, **la pantalla parece preparada para registrar una venta, pero el flujo de aceptación no está cerrado**. Esto debe comprobarse en Excel con una prueba manual, pero técnicamente es una alerta crítica.

La función de impresión también parece incompleta. El formulario solicita una ruta de imagen y llama a `PrintForm`, pero el propio código indica que todavía falta implementar el guardado de la captura. Existe otra rutina de captura GDI en `Módulo2`, aunque depende de `MSComctlLib.PictureBox`, un componente ActiveX adicional y rutas/entornos Windows concretos. [5] [6]

### 3.3. Ruleta y jackpot

`UserFormRuleta` intenta ofrecer una experiencia televisiva: anima una bolita, reproduce video y música, anuncia por voz el número ganador, actualiza el premio, incrementa el jackpot y conserva una lista de resultados recientes. Usa `CryptGenRandom` de Windows para algunos valores aleatorios, pero también utiliza `Rnd` para otros importes y estados. `UserFormJackpot` sigue un patrón similar, con controles multimedia, premios calculados, voz y navegación entre formularios. [7]

La intención es buena, pero la implementación requiere una revisión matemática y de ciclo de vida. En `GetSecureRandomNumber`, cuatro bytes se combinan con XOR y luego se aplica `Mod 38`; esa transformación no es una selección uniforme por rechazo y puede introducir sesgo. Además, dentro del evento de giro se declara otra variable local `ultimosGanadores`, que oculta la variable de módulo utilizada en otros procedimientos; como consecuencia, la comprobación de «no repetir los últimos diez» no conserva el historial entre clics como aparenta.

También existe un desajuste de índices: `numerosCasillas` contiene los índices 1 a 38, mientras `valoresCasillas` está indexado de 0 a 37 y contiene los textos de la ruleta, incluidos `0` y `00`. Cuando el índice calculado resulta 38, la condición que verifica el límite no permite actualizar el resultado. Es un caso de borde que puede dejar la ruleta sin número/premio visible.

### 3.4. Motor de aciertos y premios

`BaseDeDatos` usa las columnas `A:J` como entrada: boleto, celular, multiplicador, tipo de apuesta y hasta seis números. Las columnas `K:O` calculan aciertos y coincidencias con bolillas adicionales/fijas; `P:R` transforman la categoría de resultado en descripciones de premio; `AD` genera un resumen como `2`, `A`, `2 + A`, `5 + F1` o `6`. El archivo contiene 5.000 filas precalculadas, con fórmulas matriciales/compartidas y referencias absolutas a las bolillas del sorteo. [1] [2]

En una prueba estática de los 5.000 registros actuales no encontré identificadores duplicados, números fuera de rango 1–50, números repetidos dentro de una jugada, apuestas fuera de 1–3 ni errores de cálculo cacheados. La copia convertida y recalculada tampoco produjo errores de fórmula. Es una señal positiva sobre la muestra existente, pero no demuestra que una nueva venta, un cambio de bolillas o una edición manual mantenga esas propiedades.

Hay una inconsistencia entre la especificación escrita en `AN` y los datos resultantes: la nota indica que en `K` deberían aparecer solo resultados con cinco y seis aciertos, mientras la distribución actual de `K` contiene 1.632 casos de un acierto, 348 de dos, 41 de tres, 2 de cuatro, 10 de cinco y 4 de seis. Puede ser que la nota sea una regla antigua o que la fórmula esté mostrando información intermedia que no debía publicarse; en cualquier caso, debe definirse cuál es el comportamiento correcto.

### 3.5. Consulta de ganadores

`UserFormResultados` recorre `BaseDeDatos` y muestra en un `ListBox` los registros ganadores cuando el usuario busca por celular o boleto. Decide si el premio sale de `P`, `Q` o `R` según el valor de `AD`. Esta es una funcionalidad útil para atención al cliente y para consulta operativa.

La consulta se ejecuta en cada cambio de texto y utiliza coincidencia parcial con `InStr`. Eso permite encontrar un celular introduciendo solo una parte, pero puede devolver varios registros y exponer más información de la necesaria. Además, `UserFormResultados2` duplica prácticamente el mismo código y, en sus procedimientos, referencia `UserFormResultados` en lugar de operar claramente sobre sí mismo; esto aumenta el riesgo de corregir un formulario y dejar el otro desactualizado. [8]

### 3.6. Bingo y modelos económicos

`RuleBingo 10x10` y `Tipos` parecen ser módulos conceptuales o de simulación para probar precios, costos, porcentajes, ingresos y egresos. Son útiles para explorar la idea comercial, pero no están presentados como un modelo financiero auditado. En `RuleBingo 10x10`, por ejemplo, los tramos de ingreso/egreso muestran márgenes negativos en algunos rangos individuales, mientras que el total utiliza otras bases y multiplicadores; en `Tipos`, las proporciones y premios se calculan sobre constantes fijas. Antes de usar estas cifras para definir premios, conviene formalizar una tabla única de reglas y reconciliar cada ingreso con su egreso.

## 4. Hallazgos críticos y riesgos

| Prioridad | Hallazgo | Evidencia | Impacto |
|---|---|---|---|
| **P0** | No se observa persistencia de la compra desde `Aceptar` hacia `BaseDeDatos`. | `CommandButtonAceptar_Click` valida y actualiza etiquetas, pero no escribe registros. [5] | Puede generar boletos que el sistema no registra o no puede verificar posteriormente. |
| **P0** | Desajuste de índices en la ruleta. | `numerosCasillas` produce 1–38; `valoresCasillas` tiene posiciones 0–37. [7] | Un resultado puede no mostrarse ni activar correctamente el pago/anuncio. |
| **P0** | Prevención de repeticiones no confiable. | Variable local `ultimosGanadores` oculta el historial de módulo. [7] | La regla de no repetir puede no cumplirse entre giros. |
| **P0** | Aleatoriedad no auditable y con reducción modular. | `Xor` de bytes seguido de `Mod 38`; ausencia de registro inmutable del sorteo. [7] | No permite demostrar posteriormente cómo se generó cada resultado. |
| **P0** | Vínculo externo a un libro local y ruta absoluta del autor. | `file:///C:\Juegos\Loteria 29-7-2024.xlsm`, además de `C:\Juegos\` en metadatos. [1] [9] | Mensajes de actualización, resultados obsoletos, pérdida de funcionalidad o fuga de contexto local. |
| **P0** | Datos personales en hojas, formularios e impresión. | 5.000 celulares y jugadas completas visibles en `BaseDeDatos`/PDF. [2] [6] | Exposición innecesaria de PII, especialmente al compartir, imprimir o respaldar el libro. |
| **P1** | Dependencia de multimedia y ActiveX no incluidos. | Rutas `C:\0-Videos\`, `C:\0-Musica\`, `C:\Bolita*.gif`; seis artefactos ActiveX. [1] [7] | El sistema puede funcionar solo en el equipo original y fallar en otro Windows o con controles bloqueados. |
| **P1** | Sin validación de datos ni protección de hojas. | No se detectaron reglas de validación y las hojas no están protegidas. [1] [2] | Un operador puede sobrescribir bolillas, fórmulas, premios o identificadores sin alerta. |
| **P1** | Fechas y reglas codificadas para 2024. | Comboboxes desde 01/01/2024 a 31/12/2024 y horario fijo. [5] [7] | El producto queda temporalmente obsoleto y obliga a editar código para cada temporada. |
| **P1** | Identificadores y horario no comparten una fuente única. | `Jugadas!A` avanza por fecha diaria, mientras `Jugadas!B` recorre horas; el formato visual muestra `Rul1-...`. [1] [6] | Riesgo de buscar/pagar un boleto con fecha u hora equivocada. |
| **P2** | Código duplicado y rutinas heredadas. | Dos formularios de resultados similares; `Módulo3` contiene generadores con otra estructura de cartón/bolillas. [8] [10] | Mantenimiento difícil y riesgo de que una macro antigua escriba en columnas incompatibles. |
| **P2** | Reportes poco orientados a operación. | 391 páginas A4 en exportación; base y registro se imprimen como tablas extensas. [6] | Baja eficiencia para supervisión, arqueo y atención al cliente. |

## 5. Calidad de datos y consistencia observada

El conjunto actual tiene buenas señales de limpieza básica: los 5.000 boletos van de 1 a 5.000 sin duplicarse, los 5.000 celulares son únicos en la muestra, los tipos de apuesta están dentro de 1–3 y los números registrados están dentro de 1–50 sin repetición interna. También se identificaron 489 coincidencias de bolilla adicional, 4 casos con cinco aciertos y bolilla fija 1, 2 casos con bolilla fija 2 y 2 casos con bolilla fija 3. [2]

La siguiente tabla no es una auditoría estadística del juego; solo resume lo que se encontró en la muestra almacenada actualmente.

| Control estático | Resultado observado |
|---|---:|
| Filas de entrada en `BaseDeDatos` | 5.000 / 5.000 |
| Boletos únicos | 5.000 |
| Celulares únicos | 5.000 |
| Apuestas fuera de 1–3 | 0 |
| Números fuera de 1–50 | 0 |
| Jugadas con repetición interna | 0 |
| Errores de cálculo cacheados | 0 |
| Errores en copia recalculada | 0 |
| Registros no-cero en `Registro!F` | 0 de 100 |

El punto débil es que los buenos resultados describen una carga de demostración ya preparada, no un proceso controlado de captura. Sin reglas de validación, protección, historial y pruebas de extremo a extremo, basta con modificar una celda o abrir el libro en otro entorno para que la calidad deje de estar garantizada.

## 6. Recomendaciones priorizadas

### Prioridad P0: antes de cualquier uso con dinero real

Primero, debe cerrarse el ciclo de venta: seleccionar juego, capturar identidad mínima, guardar la operación con un ID único, almacenar los números, registrar fecha/hora, calcular el monto y emitir un comprobante. La operación debe escribirse una sola vez, tener estado —por ejemplo, `Creada`, `Pagada`, `Anulada`, `Premiada`— y conservar un registro de cambios. Si se mantiene Excel temporalmente, conviene separar una hoja de entradas protegida, una hoja de resultados calculados y un historial append-only respaldado automáticamente.

Segundo, debe fijarse una **especificación única de reglas**. Esa especificación debe definir cuántos números corresponden a cada modalidad, qué significa `A`, qué premios salen de `P`, `Q` y `R`, cómo se resuelven empates o múltiples premios y qué columnas son internas frente a las que se muestran al público. Después deben construirse casos de prueba con resultados conocidos: cero aciertos, uno a seis aciertos, adicional sin aciertos principales, cada fija, multiplicadores 1/2/3/5/10 y múltiples ganadores.

Tercero, debe corregirse la ruleta antes de volver a usarla: unificar las bases de índices, eliminar el sombreado de `ultimosGanadores`, reemplazar la selección `Mod 38` por una selección uniforme por rechazo y guardar el resultado junto con la fecha/hora, una semilla o mecanismo verificable y un identificador de sorteo. Para un sistema que pretenda ser confiable, el resultado no debería depender únicamente de una animación en un UserForm.

Cuarto, deben eliminarse el vínculo externo y las rutas absolutas. Los medios deben distribuirse con el proyecto o configurarse desde una pantalla de parámetros; si no existen, el formulario debe continuar sin bloquear la operación. La ruta `C:\Juegos\Loteria 29-7-2024.xlsm` debe eliminarse y luego verificarse que el libro no solicite actualizar vínculos al abrir.

Quinto, debe aplicarse minimización de datos: separar el celular y cualquier identificador personal de la vista pública, enmascarar números en reportes, limitar quién puede acceder a `BaseDeDatos`, proteger fórmulas y crear respaldos cifrados con control de versiones. No recomiendo distribuir el XLSM completo a operadores o terceros sin una política clara de acceso.

### Prioridad P1: robustez y mantenimiento

Conviene parametrizar fechas, horarios, precios, multiplicadores, premios, límites de números y rutas en una hoja `Configuración` protegida, en vez de codificarlos dentro de los formularios. La base debe transformarse en una tabla estructurada o, mejor aún, migrar a una base de datos ligera si se espera concurrencia, varios operadores o histórico real. También deben añadirse validaciones de entrada, mensajes de error consistentes, confirmación antes de borrar 5.000 filas y una copia automática antes de recalcular.

El VBA debe reorganizarse en módulos de servicio: `Sorteo`, `Ventas`, `Premios`, `Persistencia`, `Reportes` y `UI`. Las rutinas duplicadas de resultados deben unificarse; los procedimientos heredados de `Módulo3` deben eliminarse o aislarse; y los nombres de controles como `CheckBox55`, `Label101` o `ComboBox6` deben sustituirse por nombres semánticos. Esto reducirá el riesgo de que una modificación visual rompa la lógica.

### Prioridad P2: experiencia de usuario y presentación

La portada debería ser la hoja activa al abrir y mostrar un estado de conexión/compatibilidad cuando las macros estén deshabilitadas. La consulta de resultados debe pedir coincidencia exacta o mostrar solo los campos necesarios. La operación diaria necesita un tablero compacto con: juego actual, bolillas sorteadas, total recaudado, premios por categoría, ganadores, pagos pendientes y botón de cierre de ronda. El PDF de 391 páginas es útil como evidencia de que existe salida imprimible, pero no como reporte operativo.

## 7. Plan de trabajo recomendado

| Etapa | Entregable | Criterio de aceptación |
|---|---|---|
| 1. Reglas | Documento de reglas y matriz de casos de prueba | Cada tipo de apuesta y premio tiene una definición inequívoca. |
| 2. Corrección | Versión corregida de ruleta, índices, repetición e identificadores | Todos los casos de borde producen exactamente un resultado visible y registrado. |
| 3. Registro | Flujo de compra persistente con ID, estado y respaldo | Una compra aceptada aparece una sola vez y puede consultarse después. |
| 4. Seguridad | Eliminación de vínculos/rutas, protección, validaciones y minimización de PII | El libro abre en otro equipo con configuración documentada y sin exponer datos innecesarios. |
| 5. Pruebas | Suite manual/automatizada de cálculo y regresión | Los resultados conocidos coinciden antes y después de cambios. |
| 6. Operación piloto | Prueba con datos ficticios y sin dinero real | Se puede abrir ronda, sortear, calcular, consultar, cerrar y respaldar sin editar fórmulas. |

## 8. Veredicto final

**Sí vale la pena continuar el proyecto**, porque la interfaz, las modalidades y la intención de automatización ya forman un prototipo coherente. No recomiendo, en cambio, seguir agregando premios, animaciones o formularios antes de resolver persistencia, reglas, sorteo auditable, portabilidad y privacidad. El siguiente paso correcto no es “hacerlo más vistoso”, sino convertirlo en un sistema controlado: una sola fuente de verdad, una operación registrada, reglas testeables y resultados reproducibles/auditables.

Mi calificación general como prototipo es **5/10**: buena amplitud funcional y esfuerzo visible, pero con riesgos P0 que impiden considerarlo listo para producción. Con una refactorización enfocada y una batería de pruebas de extremo a extremo, puede evolucionar a una herramienta operativa; sin esas correcciones, seguirá siendo una demostración frágil dependiente del equipo donde fue creada.

## Referencias de evidencia

[1]: file:///home/ubuntu/ruleta_analysis.json "Informe estructural del libro XLSM"
[2]: file:///home/ubuntu/ruleta_consistency.txt "Pruebas de consistencia de la muestra"
[3]: file:///home/ubuntu/ruleta_xml/vmlDrawing1.vml "Botones y macros de la portada"
[4]: file:///home/ubuntu/ruleta_visual_findings.txt "Hallazgos visuales de la exportación"
[5]: file:///home/ubuntu/ruleta_vba/modules/UserFormNuevaCartilla.frm.txt "Código del formulario de compra"
[6]: file:///home/ubuntu/ruleta_render/workbook.txt "Texto extraído del PDF exportado"
[7]: file:///home/ubuntu/ruleta_vba/modules/UserFormRuleta.frm.txt "Código del formulario de ruleta"
[8]: file:///home/ubuntu/ruleta_vba/modules/UserFormResultados.frm.txt "Código del formulario de resultados"
[9]: file:///home/ubuntu/ruleta_xml/externalLink1.xml "Vínculo externo del libro"
[10]: file:///home/ubuntu/ruleta_vba/modules/Módulo3.bas.txt "Rutinas heredadas de generación y verificación"
