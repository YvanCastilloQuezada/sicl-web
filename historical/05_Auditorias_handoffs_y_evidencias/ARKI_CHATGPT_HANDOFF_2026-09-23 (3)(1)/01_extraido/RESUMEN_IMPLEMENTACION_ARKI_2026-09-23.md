# ARKI — Resumen de implementación

**Fecha:** 23 de septiembre de 2026  
**Alcance:** estado acumulado hasta E7, ciclo 2  
**Regla:** este documento distingue código implementado de contratos, ideas y capacidades no demostradas.

## 1. Estado general

ARKI ya no es únicamente un generador de sólidos. El repositorio contiene un motor constructivo semántico, generación paramétrica, modelo BIM, planta 2D, visor 3D, selección, persistencia local-first, interoperabilidad IFC4 inicial, costos 5D, planificación 4D y detección geométrica de clashes.

Sin embargo, ARKI todavía no es un BIM authoring system profesional completo. E5, E6 y E7 quedaron en estados parciales o congelados porque la evidencia final exigida no se completó. La regla de estado se mantiene estricta: disponer de código no equivale a estar `VERIFIED` o `E2E_VERIFIED`.

| Entrega | Estado real |
|---|---|
| UI-1 + i18n | `APPROVE` dentro de su alcance |
| UI-2 v1.7 | `APPROVE` dentro de su alcance |
| UI-3A | implementada con validación de dominio y evidencia previa; su evolución continúa en la capa BIM |
| E5 | `E5-PREVIEW / IMPLEMENTATION FREEZE` |
| E6 | `PARTIAL / IMPLEMENTATION FREEZE` |
| E7 | `PARTIAL / ciclo 2 de 2`; pendiente de cierre probatorio |
| E8 | contrato propuesto, sin implementación |

## 2. Acceso, shell e internacionalización

Se implementó un gateway con cuatro accesos de permisos progresivos: visitante, usuario, especialista y corporativo. La matriz de acceso y los estados de los 16 módulos fueron centralizados y probados.

La aplicación tiene un shell BIM oscuro con la paleta Blue-Black basada en `#080736`, texto blanco y acentos cian, amarillo, naranja y verde. Incluye topbar, contexto de proyecto, tabs de módulos, toolbar contextual, estado operativo y layout de tres columnas.

Se implementó el catálogo exacto de ocho idiomas:

- español;
- inglés;
- portugués;
- francés;
- alemán;
- italiano;
- chino;
- japonés.

El selector de idioma tiene persistencia local y fallback mediante `t(key)`. UI-1 y los textos principales del shell fueron conectados al sistema i18n.

## 3. Los 16 módulos

La taxonomía canónica quedó fijada como:

1. Data.
2. Biblioteca.
3. Proyectos.
4. Generador.
5. Modelo BIM.
6. Planta.
7. Corte.
8. 3D.
9. Metrados.
10. PRESUP-5D.
11. GASTOS.
12. 4D.
13. Clashes.
14. EXP-TEC.
15. O-M.
16. ADM.

Los estados de módulo son explícitos. Un módulo `CONCEPTUAL`, `PARTIAL`, `NOT AVAILABLE` o `FUTURE REFERENCE` no se presenta como terminado.

## 4. Motor constructivo y familias

El motor compartido contiene un modelo constructivo semántico que representa, entre otros elementos:

- muros y particiones;
- espacios;
- cimentaciones;
- columnas;
- vigas;
- losas;
- puertas;
- ventanas;
- escaleras;
- pisos;
- cubiertas;
- relaciones entre elementos.

Las pruebas existentes generaron un modelo constructivo con:

```text
16 muros
16 espacios
72 columnas
16 vigas
4 losas
72 cimentaciones
4 escaleras
4 pisos
1 cubierta
4 particiones
16 puertas
320 ventanas
464 relaciones
```

También se implementaron familias dinámicas y conversiones de serialización para mantener coherencia entre dominio y DTO. Las pruebas validan identidad con `Muro.to_dict()`, reconstrucción operativa, áreas, volúmenes, pesos, metrados y round-trip de `ConstructionModel`.

## 5. UI-3A: planta 2D y selección BIM

Se eliminó el navegador heredado y se creó la capa de presentación BIM con:

- `ContextPanel` izquierdo;
- `CanvasPlanView` central;
- `InfoBoxPanel` derecho;
- `SelectionProvider`;
- selección vacía, individual y múltiple;
- jerarquía de disciplina, nivel, categoría y elemento;
- filtros por disciplina, fase y categorías;
- niveles y viewport;
- grilla y ejes;
- selección sincronizada con el inspector.

La planta muestra un recinto cuadrado constructivo con cuatro muros y una puerta alojada en el muro. La prueba verificó la relación real entre `door-1`, el muro anfitrión y la abertura de 0,90 m.

## 6. SceneModel 3D

Se incorporó un modelo intermedio de escena que convierte el `ConstructionModel` en nodos 3D semánticos. El visor utiliza Three.js, React Three Fiber y Drei.

Se implementaron o conectaron:

- órbita;
- selección de elementos;
- capas y categorías;
- niveles;
- zonas espaciales;
- comparación de dos SceneModel;
- sincronización conceptual 2D/3D;
- cámaras técnicas;
- sección/clipping inicial;
- medición básica;
- viewpoints iniciales;
- aislamiento y congelación inicial;
- captura PNG del canvas con metadatos y hash.

La prueba de SceneModel validó 57 nodos, tres niveles, bounds de 16,5 m × 9,75 m × 10,8 m y las categorías constructivas principales.

La comparación de escenas detectó diferencias entre nodos modificados, añadidos, eliminados y sin cambios.

Estas capacidades todavía tienen deuda de E5 en controles independientes de comparación, clipping geométrico profesional, snapping profesional y persistencia completa de viewpoints.

## 7. Persistencia local-first

Se implementaron contratos para:

- sesiones;
- proyectos;
- versiones;
- snapshots;
- gates de aprobación;
- auditoría encadenada;
- migración de esquema;
- restauración por proyecto y versión.

IndexedDB fue extendido con stores formales y migración v2. La cadena de auditoría y la validación del gate se prueban de manera determinista.

La persistencia local-first está implementada. La colaboración multiusuario, sincronización remota, locks, merges y worksharing todavía no están implementados.

## 8. IFC4 e interoperabilidad

E6 incorporó:

- GlobalId determinista;
- mapeo entre `ArchiElementId` y `GlobalId`;
- exporter IFC4 semántico inicial;
- parser textual gobernado;
- adaptador real `web-ifc`/WASM;
- tres fixtures IFC4;
- `lossReport` inicial;
- panel para cargar IFC4;
- panel para exportar IFC4.

El parser real abrió un fixture con:

```text
schema: IFC4
entities: 29
status: PASS
```

Los tres fixtures IFC4 tienen hashes registrados. No obstante, IFC4 todavía es parcial. Falta geometría completa BRep/CSG/swept solids, materiales ricos, relaciones espaciales completas, propiedades completas, BCF, IDS y round-trip productivo integral.

## 9. E7 — costos 5D

Se implementaron contratos deterministas para:

- PriceBook;
- partidas;
- unidades;
- cantidades;
- precios unitarios;
- fuente y versión de precio;
- presupuesto directo;
- reconciliación cantidad × precio = costo.

La prueba actual produce:

```text
budget: 4650 PEN
```

El panel `PRESUP-5D` fue integrado al workspace y muestra el resultado derivado del contrato E7.

El catálogo corporativo completo, APU ampliado, rendimientos reales, costos contractuales y gastos de obra todavía no están cerrados.

## 10. E7 — planificación 4D

Se implementaron:

- actividades;
- duración;
- elementos relacionados;
- precedencias;
- detección de ciclos;
- cálculo de duración total;
- ruta crítica.

La prueba actual produce:

```text
scheduleDays: 7
criticalPath: A1 → A2
```

El panel `4D` fue integrado al workspace.

Todavía faltan recursos, calendarios, avance real, actualización de obra, ruta crítica con datos productivos y seguimiento de ejecución.

## 11. E7 — coordinación y clashes

Se implementó detección volumétrica real usando cajas dimensionales y tolerancia explícita. El detector omite elementos de la misma disciplina y genera clashes sólo cuando existe volumen de intersección positivo.

Cada clash conserva:

- identificador;
- elemento izquierdo;
- elemento derecho;
- disciplinas;
- volumen de intersección;
- severidad;
- estado.

La prueba actual produce:

```text
clashes: 1
```

El panel `Clashes` fue integrado al workspace.

Esto es un logro real, pero todavía no equivale a coordinación federada profesional. Faltan estados persistentes, responsables, resolución visual, BCF, federación multiarchivo y revisión completa interdisciplinar.

## 12. E7 — StructuralModel

Se creó un contrato para:

- nodos;
- posiciones;
- apoyos;
- barras;
- materiales;
- secciones;
- cargas;
- solver declarado.

Se implementó un stub OpenSees que valida referencias y estructura del modelo. Devuelve `NOT_DEMONSTRATED` cuando no se ejecuta un solver profesional.

Esto es intencional. ARKI no afirma realizar cálculo estructural profesional ni firmado.

## 13. E7 — MEPModel

Se creó un contrato topológico para:

- fuentes;
- ramales;
- dispositivos;
- conectores;
- dirección de conexión;
- sistema;
- disciplina;
- diámetro nominal.

El subset inicial cubre:

- gases medicinales;
- sanitarias;
- seguridad.

La validación actual comprueba conectores y referencias topológicas. El estado `VERIFIED` de MEP se limita a esa forma y topología. No significa cálculo hidráulico, dimensionamiento normativo ni firma profesional.

## 14. Consecuencias interdisciplinarias

Se implementó un grafo determinista de impactos que permite registrar que un cambio puede afectar:

- costo;
- cronograma;
- clash;
- estructura;
- MEP.

Cada impacto conserva origen, destino, dominio, motivo y necesidad de revisión humana.

El razonamiento causal completo de ARKI todavía es una capacidad objetivo. El grafo actual es una base determinista, no un razonador autónomo completo.

## 15. Pruebas y evidencia

Las pruebas reales más importantes incluyen:

- construcción;
- serialización;
- coherencia de muros;
- muro y puerta;
- selección BIM;
- SceneModel;
- comparación de escenas;
- persistencia IndexedDB;
- persistencia formal y auditoría;
- GlobalId;
- exportación IFC4;
- fixtures IFC4;
- parser `web-ifc`;
- test E7 de 23 checks.

En E7 ciclo 2 quedaron validados:

```text
pnpm check: PASS
pnpm build: PASS
test-e7: PASS — 23 checks
```

El build produce un warning de tamaño de bundles mayores a 500 kB. No impide compilar, pero es deuda de rendimiento.

## 16. Documentación y contratos creados

Se crearon contratos y documentos para:

- roadmap corporativo;
- flujo de trabajo y paneles;
- controles funcionales de 16 módulos;
- UI-3A;
- Computational Fabric;
- Computational Intelligence;
- Addenda de separación entre inteligencia y BIM Kernel;
- E5;
- E6;
- E7;
- E8 propuesto.

Estos documentos son gobierno y planificación. No deben confundirse con código implementado.

## 17. Lo que todavía no está implementado o cerrado

Continúan pendientes:

- Transaction Engine completo con undo/redo/rollback robusto.
- Parametric Constraint Engine completo.
- Grafo causal interdisciplinario completo.
- Documentation Compiler completo.
- Smart Components completos.
- MEP con cálculo real.
- StructuralModel con solver OpenSees real.
- Worksharing multiusuario.
- Performance Kernel para cientos de miles o millones de objetos.
- IFC productivo completo.
- BCF e IDS.
- DXF profesional.
- RVT/RFA nativo.
- Persistencia remota productiva.
- E8: EXP-TEC, O-M y gate final.
- Avatar ARKI.
- Luka.

## 18. Conclusión

ARKI tiene actualmente una base funcional real: genera elementos constructivos semánticos, los muestra en planta y 3D, permite selección, conserva snapshots locales, exporta e importa IFC4 de forma inicial, calcula costos y cronograma básicos, y detecta al menos un clash volumétrico real.

El proyecto no está terminado como plataforma BIM profesional. E5, E6 y E7 demostraron que el problema actual no es únicamente crear código, sino cerrar cada entrega con regresión, capturas, hashes, outputs y verificación extremo a extremo.

La siguiente fase propuesta es E8, limitada a expediente técnico, operación y mantenimiento y gate final. E8 aún no está autorizada para implementación.
