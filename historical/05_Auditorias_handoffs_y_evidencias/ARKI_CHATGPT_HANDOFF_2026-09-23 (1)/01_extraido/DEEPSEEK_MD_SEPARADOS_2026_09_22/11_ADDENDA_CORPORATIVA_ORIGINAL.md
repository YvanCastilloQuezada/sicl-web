# ARKI — Adenda al contrato corporativo de producto BIM

**Versión:** 2.0  
**Fecha:** 22 de septiembre de 2026  
**Producto:** ARKI / Generador de Familias  
**Propietario del producto:** Product Owner de ARKI  
**Diseño funcional y especificación:** DeepSeek  
**Implementación, integración, compilación y verificación:** Manus  
**Estado:** Adenda aprobada para incorporar al contrato UI BIM y al roadmap corporativo

## 1. Propósito de la adenda

Esta adenda amplía el contrato de interfaz BIM existente para convertir ARKI en una plataforma corporativa de concepción, diseño, coordinación, documentación, construcción, entrega y operación de activos.

La adenda no reemplaza las entregas 1A, 1B ni 1C. Esas entregas constituyen el núcleo paramétrico ya verificado. Tampoco duplica el contrato visual del BIM Workspace. Añade los requisitos corporativos que no estaban suficientemente definidos: identidad y acceso, especialistas, disciplinas, familias adicionales, nivel de detalle, costos, interferencias, equipamiento, coordinación MEP, intercambio con Revit y criterios de cierre.

> ARKI podrá tener más capacidades internas que Revit. La interoperabilidad no exige reducir el modelo ARKI; exige definir una exportación controlada, trazable y degradable hacia las categorías y parámetros que el formato destino soporte.

## 2. Decisión sobre las páginas de acceso

La aplicación debe tener **cuatro entradas de acceso diferenciadas**, con un gateway común. No deben ser cuatro copias independientes de la aplicación ni cuatro logins desconectados.

### 2.1 Página 1 — Visitante y demostración pública

Ruta conceptual: `/visitante`.

Está dirigida a personas que desean conocer ARKI sin acceder a información privada.

Debe permitir consultar:

- Qué es ARKI.
- Qué tipos de proyectos soporta.
- Qué familias y disciplinas puede modelar.
- Demostraciones conceptuales.
- Capacidades de generación, costos, interferencias y expediente.
- Estado de cada capacidad: disponible, conceptual o en desarrollo.
- Documentación pública y contacto corporativo.

No debe mostrar proyectos, precios contractuales, modelos privados, documentos de clientes ni datos de especialistas.

Las acciones de esta página son informativas y deben llevar a una acción real: ver demostración, solicitar acceso, iniciar sesión o consultar documentación.

### 2.2 Página 2 — Usuario y proyecto

Ruta conceptual: `/usuario`.

Está dirigida al propietario, proyectista o usuario general que crea y administra proyectos.

Debe permitir:

- Crear, abrir, duplicar, archivar y buscar proyectos.
- Definir tipología, ubicación, programa, área, aforo y niveles.
- Generar familias y propuestas.
- Consultar espacios, muros, materiales y elementos.
- Guardar versiones y comparar alternativas.
- Consultar presupuesto referencial y cronograma conceptual.
- Abrir el expediente técnico.
- Solicitar revisión de especialistas.
- Exportar los formatos permitidos por el proyecto.

El usuario no debe poder alterar parámetros aprobados por un especialista sin generar una nueva versión y una invalidación explícita.

### 2.3 Página 3 — Especialista y coordinación técnica

Ruta conceptual: `/especialistas`.

Está dirigida a profesionales y revisores de arquitectura, estructuras, instalaciones, costos, coordinación BIM, seguridad y operación.

Debe permitir seleccionar una disciplina o rol:

- Arquitectura.
- Estructuras y cálculo estructural.
- Geotecnia y cimentaciones.
- Materiales, acabados y especificaciones.
- Costos, metrados y APU.
- Programación y control 4D.
- Coordinación BIM e interferencias.
- Instalaciones sanitarias.
- Instalaciones eléctricas.
- HVAC y climatización.
- Gases medicinales.
- Telecomunicaciones y datos.
- Seguridad electrónica y CCTV.
- Contra incendio.
- Transporte vertical.
- Seguridad, evacuación y accesibilidad.
- Operación y mantenimiento.

El especialista debe ver únicamente los proyectos, documentos y disciplinas autorizados. Cada observación debe registrar autor, disciplina, fecha, versión, elemento afectado, estado, respuesta y evidencia.

### 2.4 Página 4 — Corporativo, costos e interferencias

Ruta conceptual: `/corporativo`.

Esta entrada atiende la operación corporativa y los módulos de mayor sensibilidad: costos, interferencias, estándares, biblioteca, aprobaciones y administración.

Debe incluir accesos separados por permisos a:

- Presupuesto y PriceBook.
- APU, S10 y CAPECO.
- Metrados contractuales.
- Cambios, adicionales y deductivos.
- Clashes e incidencias BCF.
- CDE y control documental.
- Bibliotecas corporativas.
- Plantillas, estándares y reglas.
- Auditoría y trazabilidad.
- Organizaciones, equipos y permisos.
- Integraciones y exportaciones.

El acceso a costos e interferencias no es un simple botón oculto. Debe ser un **perfil autorizado** con permisos, registro de actividad y separación de datos comerciales.

## 3. Arquitectura de navegación resultante

Todas las entradas deben abrir el mismo shell BIM cuando el usuario tenga un proyecto activo. El gateway inicial debe mostrar:

```text
ARKI
├── Visitante
├── Usuario / Proyecto
├── Especialista / Coordinación
└── Corporativo / Costos / Interferencias
```

Después del acceso:

```text
Shell BIM
├── Inicio
├── Proyectos
├── Biblioteca
├── Generador
├── Modelo BIM
├── Planta
├── Corte
├── 3D
├── Familias paramétricas
├── Metrados
├── Costos y APU
├── 4D y avance
├── Interferencias
├── Expediente técnico
├── Especialidades
├── CDE y aprobaciones
├── Activos y mantenimiento
└── Configuración
```

La visibilidad de cada módulo debe depender del perfil y del estado real del motor. Un módulo no disponible debe indicar el requisito faltante y no fingir funcionalidad.

## 4. Modelo corporativo de especialistas

Cada elemento ARKI debe poder tener:

- Disciplina responsable.
- Disciplina revisora.
- Autor.
- Estado de revisión.
- Versión.
- Fuente.
- Nivel de desarrollo.
- Nivel de información.
- Fecha de emisión.
- Observaciones.
- Aprobación requerida.
- Reglas de validación aplicables.

Estados mínimos:

```text
borrador
coordinación
observado
corregido
aprobado internamente
aprobado para emisión
emitido
obsoleto
```

La plataforma debe distinguir entre:

- Resultado generado automáticamente.
- Resultado revisado por un especialista.
- Resultado aprobado por el responsable.
- Resultado emitido para uso contractual.

No se debe presentar un cálculo heurístico como cálculo estructural firmado ni un precio referencial como presupuesto contractual.

## 5. Disciplinas y alcance técnico obligatorio

### 5.1 Arquitectura y espacios

El modelo debe contemplar espacios, niveles, zonas, usos, aforo, circulación, accesibilidad, puertas, ventanas, mamparas, vidrios, acabados, cielos, pisos, techos y mobiliario.

Cada espacio debe poder registrar nombre, uso, área, volumen, nivel, acabados, ocupación, requerimientos de equipamiento y relaciones con puertas, ventanas y sistemas MEP.

### 5.2 Muros y nivel de detalle de materiales

Un muro no puede representarse únicamente como un sólido genérico cuando el usuario solicite un nivel de detalle constructivo.

El muro debe poder describir, por cada cara y en orden constructivo:

```text
núcleo o soporte
ladrillo, bloque, concreto, drywall o sistema elegido
mortero o adhesivo
tarrajeo interior
tarrajeo exterior
imprimante o sellador
primera mano de pintura
segunda mano de pintura
acabado final
zócalo, junta o remate cuando corresponda
```

Cada capa debe incluir:

- Material.
- Función.
- Espesor.
- Unidad.
- Rendimiento.
- Desperdicio.
- APU asociado.
- Costo.
- Peso.
- Requerimiento de inspección.
- Especificación técnica.
- Acabado y color.
- Condición de aplicación.

La pintura debe poder diferenciar tipo y acabado, por ejemplo:

```text
látex, acrílica, esmalte, epóxica, poliuretano, anticorrosiva,
mate, satinado, semibrillante, brillante, texturado o sanitario
```

Los nombres son ejemplos de catálogo. La biblioteca corporativa debe permitir ampliarlos sin cambiar el contrato del muro.

### 5.3 Estructuras y cálculo estructural

El modelo debe incorporar una disciplina estructural separada del modelo arquitectónico. Debe contemplar:

- Ejes y niveles estructurales.
- Materiales estructurales.
- Columnas, vigas, losas, placas y muros de corte.
- Cimentaciones, zapatas, vigas de cimentación, losas y pilotes.
- Acero longitudinal, transversal, estribos, mallas, conectores y anclajes.
- Cargas permanentes y variables.
- Combinaciones de carga.
- Sismo, viento y condiciones de suelo.
- Predimensionamiento.
- Resultados de cálculo.
- Cuantías y detallado.
- Memoria y trazabilidad de hipótesis.

ARKI debe distinguir entre predimensionamiento conceptual y cálculo estructural verificable. La segunda categoría requiere revisión o integración con un motor especializado y aprobación de un ingeniero responsable.

### 5.4 Escaleras, rampas y transporte vertical

La biblioteca debe cubrir escaleras por tipología:

- Recta.
- En L.
- En U.
- Helicoidal.
- Caracol.
- Metálica.
- Concreto.
- Prefabricada.
- Emergencia.
- Marina.
- Mantenimiento.

También debe cubrir rampas, barandas, pasamanos y protecciones de borde.

Los ascensores deben ser familias paramétricas con:

- Ascensor de pasajeros.
- Ascensor camillero.
- Ascensor hospitalario.
- Ascensor panorámico.
- Montacargas.
- Montacamas.
- Plataforma salvaescaleras.

Cada ascensor debe vincularse con ducto, foso, sobre recorrido, niveles atendidos, puertas, carga, capacidad, velocidad, equipo, consumo, mantenimiento y espacios técnicos. La integración BIM debe incluir relaciones con estructura, arquitectura, electricidad, control, seguridad y evacuación.

### 5.5 Instalaciones sanitarias y agua caliente

El modelo debe contemplar:

- Agua fría.
- Agua caliente.
- Retorno de agua caliente.
- Desagüe.
- Ventilación sanitaria.
- Cisternas y tanques.
- Bombas.
- Válvulas.
- Medidores.
- Aparatos sanitarios.
- Sumideros y registros.
- Pendientes, diámetros, materiales y aislamiento.

Debe poder emitir cuadros de tuberías, accesorios, pruebas, pendientes, equipos y puntos de consumo.

### 5.6 HVAC y climatización

El catálogo debe incluir:

- Chillers.
- Calderas.
- Bombas de calor.
- Unidades manejadoras.
- Fan coils.
- Split y VRF.
- Ductos de suministro, retorno y extracción.
- Rejillas, difusores, dampers y filtros.
- Tuberías de refrigerante, agua helada y condensado.
- Aislamiento.
- Sensores, controles, termostatos y BMS.

Cada sistema debe relacionar equipo, espacio servido, caudal, potencia, ruido, mantenimiento y conexiones.

### 5.7 Gases medicinales y salud

Para tipologías de salud, el modelo debe contemplar:

- Oxígeno.
- Aire medicinal.
- Vacío.
- Óxido nitroso.
- Dióxido de carbono cuando corresponda.
- Centrales de gases.
- Bancos de cilindros.
- Alarmas.
- Válvulas de zona.
- Tomas murales y de techo.
- Tuberías, soportes, señalización y pruebas.

Las redes deben relacionarse con ambientes, equipos médicos, tableros, alarmas, mantenimiento y protocolos de seguridad.

### 5.8 Electricidad, seguridad y respaldo

El modelo debe contemplar:

- Acometida.
- Tableros generales y de distribución.
- Tableros de emergencia.
- Transformadores.
- Grupo electrógeno.
- UPS.
- Baterías.
- Luminarias.
- Tomacorrientes.
- Sistemas hospitalarios.
- Puesta a tierra.
- Pararrayos.
- Bandejas, canaletas y conduits.
- Cargas, circuitos, protecciones y cuadros.

### 5.9 Telecomunicaciones, Wi-Fi y redes

La plataforma debe incluir familias y relaciones para:

- Puntos de datos.
- Puntos de voz.
- Puntos de televisión.
- Puntos de audio y video.
- Racks.
- Gabinetes.
- Patch panels.
- Switches.
- Routers.
- Access points Wi-Fi.
- Antenas.
- Servidores.
- Fibra óptica.
- Cableado estructurado.
- Canalizaciones.
- UPS y respaldo.

Cada punto debe vincularse con rack, patch panel, switch, router, access point, espacio y sistema lógico.

### 5.10 CCTV, control de acceso y seguridad electrónica

El modelo debe contemplar:

- Cámaras interiores y exteriores.
- Cámaras fijas, domo, PTZ y térmicas.
- Grabadores.
- Monitores.
- Controladores.
- Lectores biométricos y de tarjetas.
- Cerraduras electrónicas.
- Intercomunicadores.
- Videoporteros.
- Sensores de movimiento, gas, inundación, temperatura y ocupación.
- Paneles de alarma, sirenas y pulsadores.

Las cámaras deben relacionarse con campo de visión, altura, orientación, cobertura, grabador, red, energía y espacio protegido.

### 5.11 Contra incendio, evacuación y accesibilidad

Debe incluir detectores, rociadores, gabinetes, hidrantes, válvulas, bombas, alarmas, señalización, rutas de evacuación, puertas de emergencia, iluminación y accesibilidad.

La coordinación debe incluir elementos relacionados, severidad de incumplimiento, norma aplicable, observación, responsable y estado.

### 5.12 Mobiliario y equipamiento

El catálogo debe cubrir mobiliario general, mobiliario de oficina, educativo, comercial, industrial, hotelero, hospitalario y de laboratorio.

También debe cubrir equipamiento, incluidos computadores, monitores, televisores, impresoras, servidores, equipos médicos, equipos de cocina, equipos de laboratorio, equipos de seguridad y equipos de mantenimiento.

Cada activo debe tener ubicación, dimensiones, conexiones requeridas, consumo, costo, fabricante, modelo, serie, garantía, vida útil y plan de mantenimiento cuando corresponda.

## 6. Biblioteca de familias y composición

La biblioteca corporativa debe mantener una clasificación compatible con Revit:

- Familias de sistema.
- Familias cargables.
- Familias in situ.
- Familias anidadas.

ARKI debe permitir que una familia compuesta incluya subfamilias sin duplicar entidades. Una mampara puede contener perfiles, vidrio, puerta, manija, cerradura, sellos y accesorios. Un ascensor puede contener cabina, puertas, botoneras, guías, equipo y controles.

Cada familia debe registrar parámetros, restricciones, planos de referencia, materiales, tipos, reglas de cantidad, costos, duración, mantenimiento, clasificación IFC y origen.

## 7. Nivel de detalle, información y desarrollo

Toda familia y elemento debe registrar por separado:

- Nivel geométrico.
- Nivel de información.
- Nivel de desarrollo.
- Estado de validación.
- Fuente de datos.
- Disciplina responsable.
- Uso permitido.

Los niveles no deben confundirse con una promesa de precisión. Un modelo con geometría detallada pero sin cálculo aprobado continúa siendo conceptual para la disciplina correspondiente.

## 8. Costos e interferencias como módulos con acceso controlado

### 8.1 Costos

El módulo de costos debe separar:

- Precio referencial.
- Precio regional.
- Precio contractual.
- APU.
- Insumos.
- Mano de obra.
- Equipos.
- Desperdicio.
- Transporte.
- Gastos generales.
- Utilidad.
- Impuestos.
- Moneda.
- Fecha de vigencia.
- Fuente.
- Versión.

Toda cifra debe poder rastrearse desde el elemento hasta la partida, el APU, el PriceBook y la fuente.

### 8.2 Interferencias

El módulo debe distinguir:

- Clash duro.
- Clash blando.
- Conflicto de espacio.
- Conflicto de mantenimiento.
- Conflicto normativo.
- Conflicto de secuencia.
- Conflicto de información.

Cada incidencia debe incluir elementos, disciplinas, ubicación, severidad, responsable, fecha límite, estado, comentarios, evidencia, viewpoint y relación con BCF cuando exista.

## 9. Exportación e interoperabilidad con Revit

ARKI no debe limitar su ontología interna a las veinte categorías que una integración concreta de Revit soporte.

La exportación debe utilizar un mapa de correspondencia:

```text
Entidad ARKI
→ categoría destino
→ familia o tipo destino
→ parámetros compartidos
→ material destino
→ clasificación IFC
→ reglas de pérdida o aproximación
→ advertencias de exportación
```

Cuando ARKI tenga más características que el destino, el exportador debe:

1. Conservar el modelo completo en ARKI.
2. Exportar todo lo que tenga correspondencia directa.
3. Guardar la información adicional como parámetros compartidos, propiedades IFC, tablas o anexos.
4. Generar advertencias para lo que no tenga representación nativa.
5. No eliminar silenciosamente datos.
6. Generar un reporte de cobertura de exportación.

Formatos objetivo por fases:

```text
IFC4X3 conceptual y posteriormente validado
RVT/RFA mediante conector o exportador especializado
BCF para coordinación
CSV/JSON para costos, metrados y activos
PDF para expediente emitible
DXF/DWG cuando exista conector especializado
```

La exportación a Revit no debe declararse implementada solo porque existe un objeto JSON o IFC. Debe existir un archivo, un conector o una prueba de interoperabilidad verificable.

## 10. Requisitos de backend, seguridad y gobierno corporativo

La versión local actual puede continuar funcionando como prototipo. Para operación corporativa se requiere una plataforma con:

- Organizaciones.
- Usuarios.
- Roles.
- Permisos por proyecto, disciplina, documento y módulo.
- Autenticación.
- Recuperación de cuenta.
- Auditoría.
- Versionado.
- Almacenamiento persistente.
- Control documental.
- Copias de seguridad.
- Registro de exportaciones.
- Cifrado y validación de archivos.
- Separación de información comercial y técnica.

El acceso visitante puede ser público. Los otros tres accesos requieren identidad, sesión y autorización, aunque su primera implementación pueda usar un adaptador local claramente identificado como prototipo.

## 11. Fases de implementación revisadas

### Fase A — Identidad y shell

Gateway de cuatro entradas, perfil local, shell BIM, navegación, permisos visuales, estados vacíos, atajos y migración gradual de `Home.tsx`.

### Fase B — Proyecto y modelo

Proyectos, versiones, selección, espacios, muros, capas, familias, mamparas, geometría 2D/3D e Info Box.

### Fase C — Disciplinas técnicas

Arquitectura, estructuras, cálculo estructural, materiales y acabados, escaleras, ascensores, sanitarias, eléctricas, HVAC, agua caliente, gases medicinales, telecomunicaciones, Wi-Fi, CCTV, control de acceso y contra incendio.

### Fase D — Costos, metrados y 4D

PriceBook, APU, S10/CAPECO, costos regionales, metrados, presupuesto, planificación, avance, valorizaciones y cambios.

### Fase E — Coordinación e interferencias

Clash detection, reglas, incidencias, BCF, responsables, respuestas, cierre y auditoría.

### Fase F — Expediente técnico

Memorias, especificaciones, detalles constructivos, acabados, encofrados, revisión normativa, planos, anexos, PDF, emisión y firmas.

### Fase G — Interoperabilidad

IFC validado, mapeo a Revit, familias exportables, parámetros compartidos, BCF, PDF, DWG/DXF y reportes de cobertura.

### Fase H — Construcción y operación

Compras, subcontratos, calidad, seguridad, avance real, as-built, activos, mantenimiento, garantías, órdenes de trabajo y renovación.

## 12. Criterios de aceptación de esta adenda

La adenda se considera incorporada al contrato cuando exista:

1. Mapa de cuatro accesos y sus permisos.
2. Matriz de roles y especialistas.
3. Inventario de disciplinas y familias.
4. Contrato de muro por capas, acabados y APU.
5. Contrato de ascensores y su relación con niveles y sistemas.
6. Contrato de sistemas MEP, seguridad y telecomunicaciones.
7. Contrato de costos e interferencias.
8. Contrato de niveles de detalle e información.
9. Contrato de exportación ARKI → Revit/IFC con reporte de pérdida.
10. ADR de transición desde `Home.tsx` al shell BIM.
11. Pruebas por módulo y pruebas de regresión del núcleo 1A–1C.
12. Estados explícitos para implementado, conceptual, no disponible y pendiente de especialista.

Ninguna fase puede declararse completa únicamente porque exista una pantalla, un tipo TypeScript o un botón. Debe existir integración con el dominio, comportamiento verificable y evidencia de prueba.

## 13. Decisiones de producto pendientes

Estas decisiones no deben quedar implícitas:

- Si los cuatro accesos se implementan inicialmente como perfiles locales o con autenticación real.
- Qué especialistas pueden aprobar cada disciplina.
- Qué cálculo estructural externo se integrará o validará.
- Qué versión de Revit será objetivo del primer conector.
- Qué categorías ARKI se exportarán como familias nativas, parámetros compartidos o propiedades IFC.
- Qué contenidos serán referenciales y cuáles podrán emitirse.
- Qué catálogo de precios tendrá validez contractual.
- Qué tipologías priorizarán la primera biblioteca técnica.

Mientras una decisión no exista, la UI debe mostrarla como pendiente y no inventar un comportamiento.

## 14. Relación con el estado actual

El núcleo paramétrico 1A–1C está verificado con correcciones no bloqueantes. Ya existen familias declarativas, DTO, PriceBook, trazabilidad de encofrados, recálculo, mampara paramétrica, snapshots, presupuesto base más mamparas, 4D, IFC extendido y Markdown.

El proyecto actual todavía es un frontend estático con motor local. No tiene autenticación, organizaciones, permisos persistentes, cálculo estructural profesional, redes MEP completas, exportación RVT/RFA validada, PDF emitible ni mantenimiento operativo completo.

Por tanto, esta adenda **amplía el contrato y el roadmap**, pero no afirma que esas capacidades ya estén implementadas.

## 15. Regla de no duplicación

Antes de añadir un nuevo módulo se debe buscar si ya existe una entidad equivalente en:

```text
shared/arkiDynamicFamilies.ts
shared/arkiConstructionOntology.ts
shared/arkiConstructionElements.ts
shared/arkiParametricFamilies.ts
shared/arkiMamparaFamily.ts
shared/arkiPriceBook.ts
shared/arkiRecalculation.ts
shared/arkiTechnicalDossier.ts
```

Si existe, se debe extender o adaptar el contrato existente. No se deben crear dos muros, dos presupuestos, dos fuentes de precios, dos snapshots ni dos catálogos de familias que representen la misma realidad.

## 16. Regla corporativa de estado

Cada capacidad debe clasificarse como una de las siguientes:

```text
IMPLEMENTED
VERIFIED
E2E VERIFIED
CONCEPTUAL
PARTIAL
NOT AVAILABLE
PRODUCT DECISION REQUIRED
```

La etiqueta `E2E VERIFIED` solo puede usarse cuando se haya demostrado la interacción completa, desde la UI hasta el dominio, la salida y la persistencia o exportación correspondiente.

## 17. Orden para DeepSeek

DeepSeek debe actualizar el contrato UI BIM con esta adenda y entregar primero:

1. ADR de transición de `Home.tsx` al shell BIM.
2. Mapa de cuatro accesos y perfiles.
3. Matriz de módulos por rol y estado.
4. Inventario técnico de disciplinas y familias.
5. Contrato de exportación ARKI a Revit/IFC.
6. Wireflows de costos, interferencias, especialistas y revisión.
7. Plan de pruebas y criterios de aceptación.

No debe comenzar una reescritura completa de la interfaz hasta cerrar esos siete artefactos.

## Referencias

[1]: file:///home/ubuntu/generador-familias/ARKI_CONTRATO_UI_BIM_DEEPSEEK.md "Contrato de diseño y funcionalidad de la interfaz BIM"

[2]: file:///home/ubuntu/generador-familias/ARKI_ESTADO_COMPLETO_Y_PENDIENTES.md "Estado completo y pendientes de ARKI"

[3]: file:///home/ubuntu/generador-familias/ARKI_LISTA_COMPLETA_FAMILIAS_REVIT.md "Lista completa de familias según Revit"

[4]: file:///home/ubuntu/generador-familias/ARKI_VEREDICTO_ENTREGA_1C.md "Acta de verificación de la Entrega 1C"
