SICL FRONTEND SPECIFICATION v1.0
Documento Maestro de Especificación UX/UI
Proyecto: SICL — Spatial Intelligence Command Language
Versión: 1.0
Fecha: 15 de Septiembre, 2026
Autoridad: Product Owner (Yvan Castillo)
Estado: APROBADO PARA IMPLEMENTACIÓN
📑 ÍNDICE
Filosofía y Principios de Diseño
Arquitectura de la Experiencia
Sistema de Copilotos Especialistas
Modos de Inmersión Cognitiva
Sistema Cromático del Viaje
Especificación de Pantallas
Componentes Técnicos Reutilizables
Reglas Constitucionales Aplicadas a UX
Especificaciones Técnicas para el Desarrollador
Criterios de Aceptación
1. FILOSOFÍA Y PRINCIPIOS DE DISEÑO
1.1 Visión Central
SICL no es una herramienta de entrada de datos. Es un Copiloto de Decisión Asistida que guía al profesional a través de un viaje estructurado desde la definición del problema hasta la decisión formal, manteniendo siempre la Autoridad Humana como principio innegociable.
1.2 Principios Fundamentales
#
Principio
Descripción
P1
La IA recomienda, el Humano decide
Ninguna pantalla puede auto-aprobar, auto-decidir o sugerir que el sistema tiene autoridad final.
P2
Cero inferencia peligrosa
El sistema nunca asume, inventa o rellena datos sin confirmación explícita del usuario.
P3
Transparencia radical
Cada dato, método y fuente debe ser trazable. La incertidumbre se muestra explícitamente (UNKNOWN, INSUFFICIENT_DATA).
P4
Seleccionar > Escribir
Siempre que sea posible, ofrecer selección (chips, tarjetas, menús) en lugar de campos de texto libre.
P5
El viaje madura
La interfaz evoluciona visualmente de verde (inicio) a dorado (decisión), reflejando la maduración del proyecto.
P6
Fricción positiva en la decisión
El momento de la decisión debe sentirse solemne, no trivial. Requiere esfuerzo consciente.
P7
Agnosticismo de dominio
El mismo motor sirve para un mueble, un edificio, una ciudad o un país. Solo cambian las variables y el lenguaje.
1.3 Metáfora Central: El Viaje
El usuario no "llena formularios". Realiza un viaje de descubrimiento con un guía experto (el Copiloto) que:
Le explica cada etapa
Le sugiere métodos y variables
Le advierte de riesgos e incertidumbre
Pero nunca decide por él
2. ARQUITECTURA DE LA EXPERIENCIA
2.1 El Golden Path (Camino Dorado)
El flujo principal consta de 6 pantallas secuenciales, más una pantalla de certificado final:

12345678910111213
2.2 Barra de Progreso (Mapa del Viaje)
Siempre visible en la parte superior. No usar "Paso X de 7". Usar hitos con nombres:

1
✓ = Completado (color del acento de esa etapa)
● = Actual (color brillante, pulsante sutil)
🔒 = Bloqueado (gris, con candado)
Interacción: Al hacer clic en un hito completado, el usuario puede volver a esa pantalla para editar.
3. SISTEMA DE COPILOTOS ESPECIALISTAS
3.1 Concepto
El Copiloto no es un asistente genérico. Es un especialista con personalidad, vocabulario y foco adaptados al rol del usuario y la escala del proyecto.
3.2 Los 5 Copilotos Base
Copiloto
Ícono
Personalidad
Vocabulario Clave
Foco
Archi (SICL 1)
🏠
Preciso, técnico, normativo
FAR, asoleamiento, confort térmico, materialidad
Edificio / Sitio
Urban (SICL 2)
🏙️
Sistémico, social, dinámico
Zonificación, densidad, movilidad, espacio público
Ciudad / Territorio
Macro (SICL 3)
🗺️
Visionario, estratégico, de largo plazo
Escenario 2050, PIB, gobernanza, riesgo climático
Región / País
Product (Micro)
🪑
Ergonómico, manufacturero, de detalle
Ciclo de vida, resistencia, ergonomía, costo unitario
Objeto / Mobiliario
Analyst (Transversal)
📊
Analítico, metodológico, riguroso
Sensibilidad, procedencia, margen de error, correlación
Investigación
3.3 Estructura del Mensaje del Copiloto
Cada mensaje del Copiloto tiene 3 componentes obligatorios:

123
Ejemplo (Archi en Pantalla 2):
"He localizado tu sitio en Trujillo. Según SENAMHI, el clima es semiárido con 22°C promedio. ¿Coincide con la realidad de tu terreno o existe un microclima que deba considerar?"
[✓ Datos correctos] [✎ Ajustar manualmente]
3.4 Reglas de Comportamiento del Copiloto
Nunca decide. Siempre pregunta, sugiere o confirma.
Nunca oculta incertidumbre. Si un dato es estimado o faltante, lo dice explícitamente.
Adapta el lenguaje al modo. No le dice "FAR" a un empresario; le dice "coeficiente de edificabilidad".
Sugiere, no impone. Las sugerencias siempre tienen un botón [+ Agregar] o [Ignorar].
Recuerda el contexto. No repite preguntas ya respondidas.
4. MODOS DE INMERSIÓN COGNITIVA
4.1 Concepto
El usuario elige cómo quiere pensar durante el viaje. El modo cambia el lenguaje, la densidad de datos, los componentes visuales y el foco del análisis.
4.2 Los 5 Modos
🏗️ MODO ARQUITECTO / INGENIERO (Técnico)
Perfil: Creador técnico, enfocado en espacio y materia.
Densidad de datos: Media.
Lenguaje: Técnico (FAR, carga, asoleamiento, normativa).
Visualización principal: Modelo 3D volumétrico paramétrico.
Métodos sugeridos: Simulación energética, análisis estructural, normativa municipal.
Color de acento: Azul acero.
📈 MODO EMPRESARIO / EMPRENDEDOR (Negocio)
Perfil: Estratega, enfocado en ROI y velocidad.
Densidad de datos: Baja en técnico, alta en financiero.
Lenguaje: Financiero (CAPEX, OPEX, TIR, VAN, payback).
Visualización principal: Dashboards de KPIs, gráficos de flujo de caja.
Métodos sugeridos: Análisis de rentabilidad, costo de ciclo de vida (LCC), evaluación de mercado.
Color de acento: Verde esmeralda.
🔬 MODO INVESTIGADOR (Académico)
Perfil: Analista profundo, enfocado en rigor metodológico.
Densidad de datos: Máxima. Muestra todas las variables, fuentes y estados.
Lenguaje: Académico (procedencia, margen de error, correlación, sensibilidad).
Visualización principal: Gráficos de dispersión, mapas de calor, tablas de correlación.
Métodos sugeridos: Análisis de sensibilidad, Monte Carlo, AHP, TOPSIS.
Color de acento: Púrpura.
️ MODO MILITAR / COMANDO (Decisor bajo presión)
Perfil: Operador en contexto de restricciones rígidas y alto riesgo.
Densidad de datos: Filtrada por criticidad. Solo lo esencial.
Lenguaje: Sintético, de comando (objetivo, restricción, amenaza, ejecutar).
Visualización principal: Mapas tácticos, semáforos de riesgo (rojo/verde), alertas.
Métodos sugeridos: Análisis de riesgo, mitigación, cadena de mando.
Color de acento: Rojo óxido.
⚡ MODO ULTRA (Power User)
Perfil: Experto que quiere control total.
Densidad de datos: Total, sin filtros.
Lenguaje: Técnico directo, sin "cuentos" del Copiloto.
Visualización principal: Paneles redimensionables, acceso a JSON/SQL en vivo.
Interfaz: Dark mode por defecto, atajos de teclado, edición inline de datos.
Color de acento: Cian eléctrico.
4.3 Selector de Modo (Pantalla 1)
En la Pantalla 1, el usuario selecciona dos dimensiones:
FILA 1: ESCALA DEL PROYECTO

1
FILA 2: MODO DE INMERSIÓN

1
Combinación válida: El sistema permite cualquier combinación. Ejemplo: [ SICL 1] + [ Negocio] = Análisis de edificio con foco financiero.
5. SISTEMA CROMÁTICO DEL VIAJE
5.1 Filosofía
Cada pantalla tiene un color de fondo base con 8% de opacidad que evoluciona de verde (inicio) a dorado (decisión), reflejando la maduración del proyecto.
5.2 Paleta por Pantalla
Pantalla
Nombre
Color Base (8% opacidad)
Color de Acento
Sensación
1
Bienvenida
#E8F5E9 (Verde lima muy claro)
#4CAF50 (Verde menta)
Frescura, potencial
2
Contexto
#C8E6C9 (Verde hoja)
#2E7D32 (Verde bosque)
Anclaje, realidad
3
Objetivos
#F1F8E9 (Verde-amarillo)
#9E9D24 (Amarillo verdoso)
Definición, reglas
4
Evaluaciones
#FFF8E1 (Amarillo dorado)
#F57F17 (Naranja melocotón)
Medición, análisis
5
Council
#FBE9E7 (Naranja-rojo)
#D84315 (Rojo coral)
Intensidad, trade-offs
6
Decisión
#FFF3E0 (Dorado suave)
#FF8F00 (Dorado metálico)
Solemnidad, cierre
7
Certificado
#F3E5F5 (Púrpura claro)
#6A1B9A (Púrpura real)
Valor legal, trofeo
5.3 Transiciones
Fade de 300ms entre colores de fondo al cambiar de pantalla.
Los botones principales usan el color de acento de la pantalla actual.
Los textos siempre en #1A1A1A (casi negro) para legibilidad.
6. ESPECIFICACIÓN DE PANTALLAS
6.1 PANTALLA 1: BIENVENIDA Y SELECCIÓN
Objetivo: Calibrar el Copiloto y definir el alcance del viaje.
Layout:
Centrado vertical y horizontalmente.
Sin menús laterales ni navegación compleja.
Fondo: Verde lima al 8%.
Componentes:
Header minimalista:
Logo SICL (esquina superior izquierda, 40px alto).
Badge de sesión: "Sesión de [Nombre]" (esquina superior derecha).
Copiloto central:
Avatar circular (80px) con ícono de brújula.
Burbuja de diálogo (máx. 600px ancho):
"Hola. Soy tu copiloto de decisión. Te guiaré paso a paso para que tu proyecto sea trazable y defendible. Yo analizo, tú decides. Para empezar, ¿qué tipo de espacio o problema vamos a analizar hoy?"
FILA 1 — Selector de Escala (4 tarjetas):

123456
Cada tarjeta: 200px ancho, 120px alto.
Al hacer hover: tooltip con descripción (ej. "Ideal para anteproyectos, evaluación de alternativas de diseño, confort y normativa.").
Al seleccionar: borde de 3px en color de acento, fondo al 20% de opacidad.
FILA 2 — Selector de Modo (5 tarjetas pequeñas):

1
Cada tarjeta: 140px ancho, 80px alto.
Mismo comportamiento de selección que la FILA 1.
Botón de acción (solo se activa cuando ambas filas tienen selección):
Texto: "Continuar con [Escala] en modo [Modo] →"
Tamaño: 240px ancho, 56px alto.
Color: Acento de la pantalla (Verde menta).
Estado disabled: gris al 40% de opacidad.
Validaciones:
No se puede avanzar sin seleccionar escala y modo.
Al hacer clic en "Continuar", el sistema carga el perfil del Copiloto correspondiente.
6.2 PANTALLA 2: CONTEXTO Y SITIO
Objetivo: Anclar el proyecto en el mundo real con datos validados.
Layout:
Header del Copiloto (fijo, 120px alto).
Cuerpo dividido en 2 columnas (60% izquierda, 40% derecha).
Fondo: Verde hoja al 8%.
Header del Copiloto:
Título: "Contexto y Sitio"
Burbuja:
"Aquí anclamos tu proyecto en el mundo real. Definimos dónde existe y bajo qué condiciones físicas. Esto será la base de todas las evaluaciones."
Qué hacer: "Indica la ubicación y valida las condiciones que el sistema detectará automáticamente."
Qué NO hacer: "Aún no definas soluciones, alternativas ni objetivos."
Columna Izquierda (60%): Mapa Interactivo
Componente: Mapa de Leaflet o Mapbox (fullscreen dentro de la columna).
Acción: Usuario hace clic para soltar un pin o busca dirección en el buscador integrado.
Al soltar el pin: el sistema extrae coordenadas (lat, lng) y dispara la consulta de datos externos.
Columna Derecha (40%): Panel de Validación
Estado inicial: "Suelta un pin en el mapa para comenzar."
Después de soltar el pin, aparece un spinner: "Consultando bases de datos meteorológicas (SENAMHI, NASA POWER)..."
Después de 2-3 segundos, aparecen 3 tarjetas de validación:
Tarjeta 1: Clima

1234567
Tarjeta 2: Humedad y Vientos

1234567
Tarjeta 3: Asoleamiento

1234567
Microclima (opcional, aparece después de confirmar las 3 tarjetas):
Mensaje del Copiloto:
"Estos son los datos oficiales de la estación más cercana. ¿Las condiciones reales de tu terreno coinciden, o existe un microclima (valle frío, sombra de cerro, brisa marina) que deba considerar?"
Botones: [✓ Coincide] [✎ Mi terreno es diferente]
Si elige "diferente", aparece un campo de texto: "Describe el microclima..." (máx. 200 caracteres).
Footer:
Botón secundario: "← Volver"
Botón principal: "Continuar a Objetivos →" (solo se activa si las 3 tarjetas están confirmadas).
Reglas de datos:
Cada dato confirmado se guarda como Fact con source, timestamp y coordinates.
Cada dato ajustado manualmente se guarda como Assumption con justification.
Si el usuario no confirma, el dato queda en estado PENDING.
6.3 PANTALLA 3: OBJETIVOS Y RESTRICCIONES
Objetivo: Definir las reglas del juego (metas y límites innegociables).
Layout:
Header del Copiloto (fijo).
Cuerpo: 2 columnas (Objetivos a la izquierda, Restricciones a la derecha).
Fondo: Verde-amarillo al 8%.
Header del Copiloto:
Título: "Objetivos y Restricciones"
Burbuja:
"Aquí definimos las reglas del juego. Separamos lo que quieres lograr (Objetivos) de lo que es innegociable (Restricciones). Usa el micrófono para hablar con naturalidad; yo lo organizaré por ti."
Zona de Entrada (centro, 100% ancho):
Botón de micrófono grande (80px diámetro), pulsante, color de acento.
Al hacer clic: onda de sonido animada, el usuario habla.
Al terminar: el sistema procesa y muestra tarjetas de confirmación.
Ejemplo de interacción:
Usuario dice: "Quiero maximizar la rentabilidad y el área verde, pero el presupuesto no puede pasar de 500,000 soles."
Sistema responde:
"Te escuché. He organizado tus ideas en 3 tarjetas. ¿Están correctas?"
Tarjetas de Confirmación (aparecen debajo del micrófono):
Tarjeta 1 (Objetivo):

1234567
Tarjeta 2 (Objetivo):

1234567
Tarjeta 3 (Restricción):

1234567
Sugerencias del Copiloto (aparecen después de confirmar las primeras tarjetas):
Mensaje:
"Como especialista, noto que cuando se busca maximizar rentabilidad, usualmente es crucial considerar también el costo de mantenimiento. ¿Te gustaría agregar alguno de estos objetivos relacionados?"
Tarjetas fantasma (borde punteado, ícono 💡):

123
Tablero de Tarjetas Apilables (después de confirmar):
Columna Objetivos (izquierda):
Título: "🎯 Objetivos (N)" donde N es la cantidad.
Lista de tarjetas confirmadas, reordenables por drag-and-drop (la más importante arriba).
Cada tarjeta muestra: ícono, nombre, dirección (⬆/⬇), botones editar/borrar.
Columna Restricciones (derecha):
Título: " Restricciones (N)"
Lista de tarjetas confirmadas, no reordenables (todas son innegociables).
Cada tarjeta muestra: ícono, nombre, valor+unidad, origen (Normativa/Cliente/Topografía/Presupuesto).
Footer:
Botón principal: "Continuar a Alternativas →" (solo se activa si hay al menos 1 objetivo y 1 restricción confirmados).
Reglas de datos:
Cada objetivo tiene: name, direction (maximize/minimize), priority (orden en la lista), source.
Cada restricción tiene: name, operator (≤, ≥, =), value, unit, source, hard (true/false).
6.4 PANTALLA 4: ALTERNATIVAS Y EVALUACIONES
Objetivo: Presentar opciones y medirlas contra los objetivos definidos.
Layout:
Header del Copiloto (fijo).
Sección 1: Tarjetas de Alternativas (arriba, 100% ancho).
Sección 2: Matriz Conversacional (abajo, 100% ancho).
Fondo: Amarillo dorado al 8%.
Header del Copiloto:
Título: "Alternativas y Evaluaciones"
Burbuja:
"Aquí presentamos tus opciones de diseño y las medimos contra tus objetivos. Yo te ayudo a estructurar los datos y sugiero métodos de evaluación; tú validas la realidad técnica."
Sección 1: Tarjetas de Alternativas
Título: "Tus Alternativas"
Botón: "+ Agregar alternativa" (abre modal con campo de nombre y opción de subir imagen).
Tarjetas en fila horizontal (scroll si hay más de 4):

123456
Sección 2: Matriz Conversacional
El Copiloto guía objetivo por objetivo.
Mensaje inicial:
"Empecemos a medir tus alternativas. Según tu primer objetivo Minimizar Costo, ¿qué método usarás para evaluar?"
Selector de Método (3 tarjetas sugeridas):

1234567891011121314151617
Matriz de Evaluación (después de seleccionar método):
Se adapta al método elegido. Ejemplo para LCC:

123456789101112
Estados del Dato (menú desplegable en cada celda):
[✓] Medido / Calculado (dato duro, fuente verificada)
[?] Estimado (aproximación del profesional)
[x] Faltante / Pendiente (no tengo el dato aún)
Navegación entre objetivos:
Después de completar un objetivo, el Copiloto pregunta:
"Datos registrados. ¿Evaluamos el siguiente objetivo (Confort Térmico) o pasamos al Consejo?"
Botones: [Siguiente objetivo →] [Ir al Consejo →]
Footer:
Botón principal: "Continuar al Consejo →" (solo se activa si todas las alternativas tienen al menos 1 evaluación completada).
Reglas de datos:
Cada evaluación tiene: alternative_id, objective_id, method, value, unit, state (measured/estimated/missing), source, timestamp.
El sistema calcula automáticamente el puntaje ponderado según los objetivos y sus prioridades.
6.5 PANTALLA 5: COUNCIL Y RECOMENDACIÓN (Simulador Paramétrico)
Objetivo: Mostrar trade-offs, conflictos y recomendación analítica con simulación interactiva en tiempo real.
Layout:
Header del Copiloto (fijo, tono más serio).
Cuerpo: 2 columnas (60% izquierda = Visualización, 40% derecha = Sliders).
Fondo: Naranja-rojo al 8%.
Header del Copiloto:
Título: "El Consejo y la Recomendación Analítica"
Burbuja:
"Hemos llegado al punto de análisis. He cruzado tus objetivos, restricciones y evaluaciones. Aquí están los hallazgos, los conflictos y mi recomendación. Recuerda: yo analizo, tú decides."
Columna Izquierda (60%): Zona de Visualización
Sección A: Mapa de Conflictos (Trade-offs)
Título: "⚖️ Mapa de Conflictos"
Visualización: Gráfico de barras comparativas o gráfico de radar.
Ejemplo:

1234567
Sección B: Modelo Paramétrico 3D (WebGL)
Componente: Visor 3D con React Three Fiber o Three.js.
Muestra el modelo volumétrico de las alternativas.
Se actualiza en tiempo real cuando el usuario mueve los sliders.
Si una alternativa viola una restricción, se resalta en rojo sutil.
Sección C: Tarjeta de Recomendación Analítica

123456789101112
Sección D: Alertas de Incertidumbre (si aplican)

12345678910
Columna Derecha (40%): Consola de Control (Sliders)
Sección A: Sliders de Peso (Importancia de objetivos)
Título: "Ajusta la importancia de tus objetivos"
Slider 1: "Importancia del Costo" [-----------------●------] 70%
Slider 2: "Importancia del Confort" [------●----------------] 30%
Slider 3: "Importancia del Área Verde" [----------●-----------] 55%
Sección B: Sliders de Variables (Análisis de sensibilidad)
Título: "¿Qué pasa si cambias estos datos?"
Slider 1: "Costo Opción B" [---●---------] 180,000 PEN (rango: 100,000 - 250,000)
Slider 2: "Confort Opción A" [--------●---] 7.5/10 (rango: 5 - 10)
Comportamiento de los Sliders:
Al mover cualquier slider, todos los componentes de la Columna Izquierda se recalculan en tiempo real (<50ms de latencia).
El gráfico de barras se actualiza.
El modelo 3D se actualiza (si la variable afecta la geometría).
La tarjeta de recomendación puede cambiar de alternativa.
El Copiloto muestra un mensaje dinámico:
"Al bajar el costo de la Opción B a 140,000 PEN, ahora se convierte en la opción recomendada con 82% de eficiencia."
Footer:
Botón secundario: "← Volver a Evaluaciones"
Botón principal: "Avanzar a Revisión Humana y Decisión →"
Reglas de datos:
Los sliders de peso modifican el cálculo de puntaje ponderado en tiempo real.
Los sliders de variables modifican los valores de evaluación y recalculan todo.
Ningún cambio en los sliders se guarda automáticamente. Solo se aplican a la sesión de simulación.
Para guardar cambios permanentes, el usuario debe volver a Evaluaciones y editar los datos.
6.6 PANTALLA 6: REVISIÓN HUMANA Y DECISIÓN
Objetivo: Formalizar la decisión con autoridad humana explícita, justificación y trazabilidad.
Layout:
Header del Copiloto (tono solemne, de notario).
Cuerpo: 1 columna centrada, max-width 800px.
Fondo: Dorado suave al 8%.
Header del Copiloto:
Título: "Revisión Humana y Decisión Final"
Burbuja:
"Hemos analizado todas las variables. Ahora te toca a ti. Como especialista, mi deber es recordarte que ninguna alternativa es perfecta. Tú tienes la autoridad final para elegir, incluso si eso significa ir en contra de mi recomendación analítica por razones subjetivas o estratégicas."
Sección 1: Resumen de la Decisión

12345678910
Sección 2: Los 4 Pilares de la Autoridad
Pilar 1: El Actor
Label: "¿Quién decide?"
Campo: [Yvan Castillo] (pre-llenado con login, editable).
Campo: "Rol" → [Arquitecto Principal ▼] (menú desplegable con roles predefinidos).
Pilar 2: Base de Autoridad
Label: "¿Por qué tienes derecho a decidir?"
Chips seleccionables (múltiple):

12
Pilar 3: Justificación (¡Aquí brilla el micrófono!)
Label: "Cuéntame brevemente por qué eliges esta opción"
Botón de micrófono (60px) + campo de texto (auto-transcribe el audio).
Placeholder: "Ej: Elijo la Opción A porque, aunque es más cara en mantenimiento, el cliente valora más la estética tradicional..."
Mínimo 20 caracteres.
Pilar 4: Confirmación Explícita
Checkbox grande:

1
Sección 3: Modelo Paramétrico Vivo (con tolerancia contractual)
Título: "Modelo aprobado (explora dentro del margen de tolerancia)"
Visor 3D con el modelo de la alternativa seleccionada.
Sliders activos pero limitados a ±2-3% de los valores aprobados.
Halo dorado sutil alrededor del modelo (indicando "versión sellada").
Si el usuario intenta salirse del rango:
El modelo se pone en rojo suave.
Mensaje: "⚠️ Fuera de tolerancia contractual (±2-3%). Se requiere nueva decisión."
El slider vuelve al límite automáticamente.
Sección 4: Botón de Sello
Botón grande, centrado:

123
Color: Dorado metálico.
Al hacer clic: animación de "sellado" (check dorado que aparece con efecto de tinta).
Validaciones antes de permitir el clic:
Alternativa seleccionada.
Actor y rol completados.
Al menos 1 base de autoridad seleccionada.
Justificación con mínimo 20 caracteres.
Checkbox de confirmación marcado.
Footer:
Botón secundario: "← Volver al Consejo"
6.7 PANTALLA 7: CERTIFICADO DE TRAZABILIDAD
Objetivo: Generar un documento inmutable, exportable y visual que certifique la decisión.
Layout:
Pantalla completa, sin navegación lateral.
Fondo: Púrpura claro al 8%.
Diseño tipo "documento legal" con bordes sutiles.
Sección 1: Header del Certificado

123456789
Sección 2: Resumen de la Decisión (2 columnas)
Columna Izquierda (Datos):

12345678910111213141516171819202122232425
Columna Derecha (Visual):
Modelo 3D estático de la Opción A con los parámetros finales aprobados.
Etiqueta debajo: "Volumetría aprobada en DEC-001. Parámetros: 15m altura, 1500m² área."
Los sliders están desactivados (solo visualización).
Sección 3: Línea de Tiempo de Trazabilidad
Título: "Trazabilidad completa del proyecto"
Lista cronológica de eventos:

1234567
Sección 4: Alertas y Advertencias Registradas

12345678910
Sección 5: Acciones Finales
Botones:

1
Copiloto (mensaje final):
"Decisión registrada de forma inmutable. El ciclo de este proyecto ha concluido. Puedes exportar este reporte para tu cliente o municipalidad. ¿Deseas iniciar un nuevo proyecto?"
7. COMPONENTES TÉCNICOS REUTILIZABLES
7.1 CopilotBubble
Props: avatar, name, message, tone (friendly/serious/solemn)
Comportamiento: Burbuja de diálogo con avatar, texto adaptado al tono, animación de entrada suave.
7.2 SelectionCard
Props: icon, title, description, selected, onClick, tooltip
Comportamiento: Tarjeta seleccionable con borde de 3px al seleccionar, tooltip al hover.
7.3 StackedCard
Props: type (objective/restriction/alternative), title, value, direction, onEdit, onDelete, draggable
Comportamiento: Tarjeta apilable, reordenable por drag-and-drop (solo objetivos).
7.4 VoiceInput
Props: onTranscript, placeholder, size (small/medium/large)
Comportamiento: Botón de micrófono con onda de sonido animada, transcripción automática, confirmación antes de guardar.
7.5 Slider
Props: label, min, max, value, unit, onChange, locked, lockRange (para tolerancia contractual)
Comportamiento: Slider reactivo, actualiza estado global en tiempo real. Si locked=true, solo permite movimiento dentro de lockRange.
7.6 ParametricViewer3D
Props: modelData, sliders, toleranceMode, toleranceRange
Comportamiento: Visor 3D WebGL que se actualiza en tiempo real según los sliders. En modo tolerancia, muestra halo dorado y limita movimientos.
7.7 DataTableState
Props: rows, columns, onCellChange
Comportamiento: Tabla con celdas editables, cada celda tiene selector de estado (Medido/Estimado/Faltante).
7.8 ProgressBar
Props: steps (array de {name, status})
Comportamiento: Barra de progreso con hitos nombrados, no numéricos.
7.9 CertificateView
Props: decisionData, modelSnapshot, timeline, hash
Comportamiento: Vista de certificado inmutable, exportable a PDF.
8. REGLAS CONSTITUCIONALES APLICADAS A UX
8.1 Regla: Recommendation ≠ Decision
Implementación UX: En la Pantalla 5, el sistema muestra "Recomendación Analítica", nunca "Decisión". En la Pantalla 6, el usuario debe confirmar explícitamente. No hay botón "Aceptar recomendación" que salte la revisión humana.
8.2 Regla: Cero inferencia peligrosa
Implementación UX: El sistema nunca rellena datos automáticamente. Si un dato es estimado o faltante, se muestra explícitamente con íconos [?] o [x]. El usuario debe confirmar cada dato sugerido.
8.3 Regla: Estados explícitos
Implementación UX: Cada dato tiene un estado visible: MEASURED (✓), ESTIMATED (?), MISSING (x), UNKNOWN (—). Estos estados se propagan a la Recomendación y al Certificado.
8.4 Regla: Trazabilidad completa
Implementación UX: Cada acción del usuario genera un evento en la línea de tiempo. El Certificado muestra todos los eventos con timestamp, actor y datos.
8.5 Regla: Autoridad humana explícita
Implementación UX: La Pantalla 6 exige 4 pilares de autoridad (actor, rol, base, justificación) antes de permitir registrar la decisión.
8.6 Regla: Council read-only
Implementación UX: La Pantalla 5 muestra resultados de análisis pero no permite editar datos directamente. Para cambiar datos, el usuario debe volver a la Pantalla 4.
8.7 Regla: No exponer secretos
Implementación UX: Ningún token, clave o SICL_CORE_SERVICE_TOKEN aparece en el HTML, Local Storage o respuestas del navegador.
9. ESPECIFICACIONES TÉCNICAS PARA EL DESARROLLADOR
9.1 Stack Tecnológico Recomendado
Framework: React 18+ con TypeScript
Estado global: Zustand o Redux Toolkit
Estilos: Tailwind CSS con sistema de temas personalizado
Visualización 3D: React Three Fiber + Three.js
Gráficos: Recharts o Chart.js
Mapas: Leaflet o Mapbox GL
Voz: Web Speech API (nativa del navegador)
Exportación PDF: jsPDF o react-pdf
9.2 Arquitectura de Estado
typescript

12345678910111213141516
9.3 Performance Requirements
Transición entre pantallas: <300ms con fade de color.
Actualización de sliders en Pantalla 5: <50ms de latencia.
Carga del modelo 3D: <2s en conexión 4G.
Transcripción de voz: <1s de delay.
9.4 Responsive Design
Desktop (1920px+): Layout de 2 columnas completo.
Tablet (768px-1920px): Layout de 1 columna, componentes apilados.
Mobile (320px-768px): Layout de 1 columna, sliders verticales, modelo 3D en modal.
9.5 Accesibilidad
Todos los componentes deben ser navegables por teclado.
Contraste de texto mínimo: 4.5:1 (WCAG AA).
Labels ARIA en todos los formularios.
Soporte para lectores de pantalla.
9.6 Internacionalización
Sistema i18n preparado para español (default) e inglés.
Todos los textos del Copiloto deben estar en archivos de traducción.
Los modos cambian el diccionario de términos (ej. "FAR" en modo Técnico, "Coeficiente de edificabilidad" en modo Negocio).
10. CRITERIOS DE ACEPTACIÓN
10.1 Criterios Funcionales
El usuario puede completar el flujo completo (Pantalla 1 a 7) sin errores.
El Copiloto adapta su lenguaje según el modo seleccionado.
La entrada por voz funciona y transcribe correctamente.
Los sliders de la Pantalla 5 actualizan todos los componentes en <50ms.
El modelo 3D de la Pantalla 6 respeta la tolerancia contractual de ±2-3%.
El Certificado se exporta correctamente a PDF.
No hay secretos expuestos en el navegador.
10.2 Criterios de UX
Un usuario sin experiencia completa el flujo en <15 minutos.
La barra de progreso muestra hitos nombrados, no números.
Los colores de fondo evolucionan de verde a dorado según la pantalla.
Las sugerencias del Copiloto siempre tienen botón de ignorar.
La Pantalla 6 exige los 4 pilares de autoridad antes de permitir la decisión.
10.3 Criterios Constitucionales
Ninguna pantalla auto-aprueba o auto-decide.
Todos los datos tienen estado explícito (Medido/Estimado/Faltante).
La línea de tiempo registra todos los eventos con timestamp.
La Recomendación y la Decisión están visual y semánticamente separadas.
10.4 Criterios de Performance
Tiempo de carga inicial: <3s.
Transición entre pantallas: <300ms.
Latencia de sliders: <50ms.
Carga de modelo 3D: <2s.
📎 ANEXOS
Anexo A: Diccionario de Términos por Modo
(Se proporcionará en documento separado con todos los términos técnicos, financieros, académicos y de comando para cada modo).
Anexo B: Paleta de Colores Completa
(Se proporcionará en archivo Figma o JSON con todos los colores base, acentos, estados y variantes).
Anexo C: Wireframes de Alta Fidelidad
(Se proporcionará en archivo Figma con todos los componentes y pantallas diseñadas).
Anexo D: Contratos de API
(Se proporcionará en documento OpenAPI/Swagger con todos los endpoints del backend).
✅ APROBACIÓN
Documento aprobado por: Yvan Castillo (Product Owner)
Fecha de aprobación: 15 de Septiembre, 2026
Versión: 1.0
Estado: LISTO PARA IMPLEMENTACIÓN
FIN DEL DOCUMENTO