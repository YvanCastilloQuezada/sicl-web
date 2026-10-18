# ARKI Technical Glossary for Architect v0.1

**Estado:** FORENSIC DRAFT / PENDING REVIEW

| Término | Definición técnica | En castellano sencillo | Analogía arquitectónica | Ejemplo ARKI |
|---|---|---|---|---|
| Kernel | Núcleo transversal que gobierna invariantes y estado | La base que mantiene ordenado el sistema | Cimentación y estructura portante | BKH-0–BKH-4 |
| Engine | Componente que ejecuta una responsabilidad | Un motor especializado | Equipo de cálculo específico | Constraint Engine |
| Fabric | Red que mantiene relaciones semánticas | Tejido que conecta elementos | Relaciones entre muro, espacio y puerta | BKH-1 |
| Schema | Forma y campos permitidos para datos | Molde obligatorio | Cuadro de datos de una partida | Transaction schema |
| Runtime | Sistema que ejecuta el programa | Lo que está funcionando ahora | Obra en ejecución | React/Vite runtime |
| State | Situación actual de una entidad | En qué estado se encuentra | Anteproyecto, aprobado o construido | TransactionStatus |
| Canonical | Fuente reconocida como autoridad | La versión oficial | Plano sellado que manda | Canonical state |
| Transaction | Unidad gobernada de cambio propuesto | Paquete de modificación controlado | Expediente de cambio | BKH-4 |
| Commit | Aplicación aceptada de un cambio | Hacer oficial un cambio | Aprobar y registrar una modificación | BKH4-3+; no implementado |
| Rollback | Reversión gobernada | Volver atrás sin borrar historia | Orden de reversión | No implementado |
| Undo | Operación que intenta revertir una acción | Deshacer | Deshacer una modificación | Futuro BKH-4 |
| Redo | Reaplicación validada de una acción | Rehacer | Volver a aplicar un cambio | Futuro BKH-4 |
| Atomicity | Todo o nada dentro de un límite | No dejar medio cambio | Una partida completa o no se aplica | Gate futuro |
| Persistence | Guardar datos para recuperarlos | Que no se pierdan al cerrar | Archivo del proyecto | IndexedDB bounded |
| Serialization | Convertir datos a formato transportable | Empaquetar datos | Exportar una ficha | JSON round-trip |
| Provenance | Origen y transformaciones de un dato | De dónde salió | Sello, autor y revisión | TransactionProvenance |
| Invariant | Regla que debe mantenerse | Regla que no se puede romper | Norma de diseño | UNKNOWN_NOT_VALID |
| Constraint | Condición que limita o evalúa | Lo permitido y lo prohibido | Retiro mínimo | BKH-2 |
| Dependency | Relación de dependencia causal | Algo necesita a otra cosa | Viga depende de apoyo | BKH-3 |
| Regeneration | Recalcular salidas afectadas | Actualizar lo que cambió | Redibujar planos afectados | BKH-3 |
| Semantic | Significado del objeto, no sólo su forma | Qué es el elemento | Muro como muro, no sólo volumen | BIM objects |
| Ontology | Catálogo formal de conceptos y relaciones | Vocabulario organizado | Cuadro de tipos constructivos | Relationship registry |
| Topology | Conectividad y vecindad | Qué toca o conecta | Muro que limita un espacio | Clashes/relationships |
| Graph | Nodos y conexiones | Mapa de relaciones | Diagrama de dependencias | Dirty-set graph |
| API | Interfaz para pedir servicios | Puerta de comunicación | Ventanilla con requisitos | Adapters |
| Adapter | Traduce entre contratos | Intérprete controlado | Traducir IFC a modelo ARKI | IFC adapter |
| Interface | Contrato de uso entre piezas | Qué se puede pedir | Detalle de unión | TypeScript types |
| Round-trip | Importar y volver a exportar conservando información | Ida y vuelta | Recibir y devolver planos sin pérdidas | IFC bounded tests |
| Regression | Repetición de pruebas anteriores | Verificar que no se rompió lo previo | Revisar planos tras una reforma | BKH-1/2/3 regression |
| Fixture | Caso de prueba controlado | Maqueta de laboratorio | Vivienda de prueba | IFC fixture |
| Hash | Huella digital de un archivo | Identificador de integridad | Precinto digital | SHA-256 |
| Manifest | Lista de archivos y hashes | Inventario verificable | Índice del expediente | Evidence manifest |
| Baseline | Punto congelado de comparación | Desde dónde se empieza | Estado del terreno antes de obra | BKH4 baseline |
| Delta | Cambio acotado entre versiones | Diferencia concreta | Adenda de planos | 95A |
| E2E | Prueba de extremo a extremo | Probar el recorrido completo | Desde diseño hasta expediente | E2E remains limited |
| IFC | Estándar abierto de intercambio BIM | Formato común BIM | Entregar modelo a otro software | IFC4 |
| BIM | Modelado de información de construcción | Modelo con objetos y datos | Edificio digital coordinado | ARKI goal |
| GIS | Información geográfica | Datos del territorio | Parcela y ciudad | Future/open |
| Digital Twin | Representación conectada de un activo real | Gemelo digital operativo | Edificio conectado durante su vida | Future/open |

La tabla explica términos; no convierte capacidades futuras en capacidades existentes.
