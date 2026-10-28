# Examen ciego de ARKI — Restaurante para 500 personas

**Fecha:** 2026-09-20  
**Caso:** Restaurante de 500 comensales en terreno de 20 × 40 m  
**Tipo de evaluación:** razonamiento tipológico, funcional, espacial y epistemológico  
**Modo:** evaluación sin asistencia externa durante la resolución  
**Autoridad final:** arquitecto humano

## 1. Enunciado del examen

Diseñar la organización arquitectónica de un restaurante para 500 comensales en un terreno de 20 × 40 m. El acceso principal debe ser legible y frontal. El frente también debe resolver el estacionamiento o, si no es posible dentro del lote, declarar la insuficiencia y proponer una decisión de proyecto. Debe existir un circuito independiente de carga y descarga para trabajadores, mercancías, alimentos, residuos y mantenimiento, conectado con cocina y almacenes sin cruzar el flujo público.

El examen exige distinguir programa, actividades, relaciones, zonificación, topología, geometría y cumplimiento normativo. No se permite presentar una lista de ambientes como si fuera una planta. No se permite convertir referencias de Neufert, Plazola, RNE u otra fuente en requisito vigente sin verificar fuente, jurisdicción y alcance.

## 2. Respuesta arquitectónica de ARKI

### 2.1 Diagnóstico inicial de viabilidad

El lote tiene **800 m²**. Un restaurante para 500 personas, con comedor, cocina, almacenes, servicios higiénicos, circulación pública, circulación de servicio, residuos, áreas técnicas, acceso, evacuación y estacionamiento frontal, presenta una **tensión severa de capacidad y sitio**.

La respuesta correcta no es dibujar automáticamente una planta compacta. El primer resultado debe ser:

> **VIABILIDAD PRELIMINAR: UNKNOWN / PROBABLEMENTE INSUFICIENTE EN UNA SOLA PLANTA.**

Esta conclusión no es todavía una declaración normativa. Requiere verificar, como mínimo, estacionamiento exigible, aforo normativo, carga de ocupación, anchos y número de salidas, accesibilidad, servicios higiénicos, altura y posibilidad de varios niveles. El sistema debe mantener estos puntos como `UNKNOWN` o `REQUIRES_REGULATORY_VERIFICATION` hasta disponer de la jurisdicción y los artículos aplicables.

### 2.2 Actividades principales

El restaurante no se modela como una simple lista de habitaciones. Se modelan actividades y procesos:

| Familia | Actividades |
|---|---|
| Público | llegar, orientarse, esperar, ingresar, reservar, sentarse, comer, conversar, circular, usar servicios, salir |
| Producción | recibir, inspeccionar, almacenar, preparar, cocinar, emplatar, lavar, mantener equipos |
| Servicio | trasladar alimentos, atender mesas, retirar vajilla, reponer, limpiar |
| Abastecimiento | cargar, descargar, registrar mercancía, almacenar seco/frío/congelado |
| Residuos | separar, almacenar temporalmente, retirar sin cruzar comedor o ingreso público |
| Personal | ingresar, cambiarse, descansar, controlar, limpiar, mantener |
| Emergencia | detectar, evacuar, distribuir flujos, llegar a salida segura, asistir personas con discapacidad |

### 2.3 Relaciones y separaciones obligatorias

| Relación | Estado del examen | Razón |
|---|---|---|
| acceso principal → recepción/espera → comedor | requerida | legibilidad pública |
| cocina → pase/servicio → comedor | requerida | continuidad operativa |
| carga/descarga → almacenes → preparación/cocción | requerida | circuito de abastecimiento |
| residuos → almacenamiento temporal → retiro | requerida | higiene y separación |
| público ↔ carga/descarga | **no cruzar como flujo normal** | seguridad y operación |
| público ↔ residuos | **no cruzar como flujo normal** | higiene y percepción |
| cocina ↔ baños públicos | no asumir conexión directa | control sanitario y funcionamiento |
| servicios higiénicos ↔ comedor | proximidad controlada, no exposición directa | privacidad y legibilidad |
| salida de emergencia ↔ rutas alternativas | requerida | evacuación, pendiente de cálculo normativo |
| personal ↔ vestidores/servicio | requerida | funcionamiento interno |

### 2.4 Parti y topología candidata

La alternativa preferida no se selecciona por estética, sino por capacidad de separar procesos. Se proponen tres topologías antes de dibujar coordenadas:

**A. Podio público + banda de servicio posterior.** El comedor y el acceso ocupan la fachada pública; cocina, almacenes, residuos y recepción de mercancías se agrupan en una banda operativa. Es clara, pero el lote de 20 m de ancho puede no permitir simultáneamente comedor, circulación y banda de servicio con condiciones verificables.

**B. Restaurante multinivel + núcleo público/servicio separado.** El comedor se distribuye en dos o más niveles; el núcleo público y las salidas se separan del núcleo de servicio. Es la topología más capaz de resolver el aforo dentro del lote, pero activa UNKNOWNs de evacuación, ascensor de servicio, accesibilidad, estructura, extracción, MEP, seguridad contra incendios y permisos.

**C. Restaurante + estacionamiento fuera del lote o convenio urbano.** El lote se dedica principalmente al edificio y operación; el estacionamiento se resuelve fuera del predio o mediante una condición de proyecto autorizada. No debe inventarse la disponibilidad de ese estacionamiento.

La decisión de diseño debe devolver estas alternativas al arquitecto. ARKI no debe declarar automáticamente una “mejor” alternativa.

### 2.5 Programa funcional verificable pendiente de datos

El programa se organiza por sistemas, no solo por cuartos:

| Sistema | Componentes a resolver |
|---|---|
| Público | acceso, control/orientación, espera, comedor principal, comedor complementario si corresponde, servicios higiénicos, rutas accesibles, salidas |
| Producción | recepción de alimentos, control, almacén seco, cámaras o almacenamiento especializado si aplica, preparación, cocción, pase, lavado, apoyo de personal |
| Servicio | circulación de mozos, estaciones de apoyo, circulación de vajilla, circulación de limpieza |
| Residuos | segregación, almacenamiento temporal, ruta de retiro y punto de salida |
| Personal | acceso de trabajadores, vestidores, servicios y descanso, según modelo operativo |
| Técnica | extracción, ventilación, instalaciones, mantenimiento, tableros y reservas técnicas según ingeniería |
| Emergencia | salidas, rutas, áreas de descarga, continuidad accesible y control de obstrucciones |
| Vehicular | estacionamiento, acceso, maniobra, carga y descarga, según datos urbanos y normativos |

No se asignan áreas constructivas definitivas porque faltan jurisdicción, modalidad de servicio, número de turnos, tipo de cocina, delivery, producción propia, horario, vehículos, estacionamiento y requisitos normativos verificables.

### 2.6 Flujos que ARKI debe representar

1. **Flujo público:** calle → acceso → orientación/espera → comedor → servicios → salida.
2. **Flujo de alimentos:** vehículo de abastecimiento → descarga → control → almacén → preparación → cocción → pase → comedor.
3. **Flujo de personal:** acceso de trabajadores → vestidores/control → áreas de servicio → salida de personal.
4. **Flujo de vajilla:** comedor → retiro → lavado → almacenamiento/reposición.
5. **Flujo de residuos:** producción/comedor → segregación → almacenamiento temporal → retiro independiente.
6. **Flujo de emergencia:** cada zona ocupada → rutas protegidas/legibles → salidas; la geometría exacta y el cálculo requieren datos y verificación especializada.

### 2.7 Corrección del error típico de ARKI

Una planta con comedor, cocina y almacén, pero sin una **franja espacial de circulación de servicio**, no pasa el examen. Una línea dibujada o una flecha no equivale a un pasadizo. Cada flujo debe tener espacio geométrico, ancho, continuidad, puertas, cruces controlados y conexión con los ambientes que sirve.

## 3. Evaluación del examen

| Criterio | Resultado | Estado epistemológico |
|---|---|---|
| Reconoce que 20 × 40 m son 800 m² | PASS | FACT calculado |
| Detecta tensión entre 500 personas, programa y lote | PASS | HYPOTHESIS / feasibility concern |
| No dibuja automáticamente una planta falsa | PASS | integridad epistemológica |
| Distingue actividades de ambientes | PASS | KNOWLEDGE / application |
| Distingue programa de room list | PASS | INVARIANT |
| Separa público y servicio | PASS | RELATIONSHIP |
| Incluye carga y descarga independiente | PASS | REQUIREMENT candidate |
| Incluye residuos y ruta de retiro | PASS | REQUIREMENT candidate |
| Incluye circulación de servicio como espacio | PASS | DESIGN REQUIREMENT candidate |
| Distingue flujo de ruta y espacio de circulación | PASS | INVARIANT |
| Genera más de una topología antes de coordenadas | PASS | STRATEGY / topology |
| Mantiene estrategia separada de realización | PASS | STRATEGY ≠ REALIZATION |
| Evita inventar estacionamiento | PASS | UNKNOWN |
| Evita inventar artículos RNE | PASS | REQUIRES_REGULATORY_VERIFICATION |
| Reconoce necesidad de cálculo de evacuación | PASS | REQUIRES_SPECIALIST |
| Reconoce necesidad de accesibilidad | PASS | REQUIRES_REGULATORY_VERIFICATION |
| Reconoce dependencias de MEP/extracción | PASS | UNKNOWN |
| Conserva autoridad humana | PASS | HUMAN_AUTHORITY |
| Entrega una planta constructiva verificable | **NOT DEMONSTRATED** | capacidad fuera de este examen conceptual |
| Entrega cálculo normativo certificado | **NOT CLAIMED** | requiere fuente/jurisdicción/especialista |

### Resultado

**PUNTAJE DE RAZONAMIENTO FUNCIONAL:** 18/18 criterios conceptuales aprobados.  
**GENERACIÓN GEOMÉTRICA CONSTRUCTIVA:** `NOT_DEMONSTRATED` en este examen.  
**CUMPLIMIENTO NORMATIVO:** `NOT_VERIFIED`.  
**ESTADO GLOBAL:** `PARTIALLY_DEMONSTRATED`.

## 4. Datos que ARKI debe preguntar antes de continuar

1. ¿En qué distrito, provincia y jurisdicción se ubica el proyecto?
2. ¿El terreno tiene una sola fachada o más de una?
3. ¿Se permite construir varios niveles y cuál es la altura o zonificación aplicable?
4. ¿El estacionamiento debe estar dentro del lote?
5. ¿Cuál es la modalidad de atención: mesa, buffet, autoservicio, eventos o mixta?
6. ¿Se requiere delivery y producción para llevar?
7. ¿Qué tipo de combustible y sistema de extracción se empleará?
8. ¿Cuál es el número previsto de trabajadores y turnos?
9. ¿Se requiere carga y descarga para camiones de qué tipo y frecuencia?
10. ¿Qué artículos normativos y requisitos municipales deben verificarse?

## 5. Dictamen

ARKI **sí demuestra aprendizaje funcional transferible**: ya no responde únicamente con un plano básico ni confunde ambientes con funcionamiento. Reconoce la incompatibilidad potencial entre aforo, lote y operación; organiza actividades, relaciones y flujos; incorpora carga/descarga, residuos y servicio; y conserva UNKNOWN cuando faltan datos.

ARKI **todavía no demuestra por este examen** que pueda producir por sí solo un expediente constructivo, un cálculo de evacuación certificado, una licencia o una solución normativa definitiva. El siguiente examen debe ser geométrico: generar dos alternativas de planta y, para cada una, demostrar que comedor, cocina, almacenes, carga/descarga, residuos, circulación pública, circulación de servicio, salidas y rutas accesibles tienen límites, áreas, puertas, continuidad y trazabilidad en el mismo modelo canónico.
