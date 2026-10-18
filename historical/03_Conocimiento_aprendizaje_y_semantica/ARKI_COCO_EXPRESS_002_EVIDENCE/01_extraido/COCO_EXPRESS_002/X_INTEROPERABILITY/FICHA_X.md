# Ficha X — Interoperabilidad

**Orden:** COCO-EXPRESS-002 FULL ARSENAL PRETRAINING  
**Alcance exclusivo:** X1 Revit round-trip; X2 DWG/DXF gobernado; X3 nubes de puntos; X4 IFC4x3.  
**Estado de evidencia:** **PARTIAL**. Esta ficha describe contratos, pruebas y límites; no afirma competencia profesional, certificación, conformidad normativa ni disponibilidad de Revit/AutoCAD/licencias o lectores de nube de puntos.

## CAPABILITY_ID: X1

- **NAME:** Revit round-trip gobernado (familias/RFA/RVT).
- **PURPOSE:** Preservar identidad, contexto y pérdidas explícitas al intercambiar un modelo ARKI con Revit; separar importación/exportación técnicamente ejecutada de verdad del modelo, coordinación aprobada o certificación.
- **CORE_CONCEPTS:** identidad estable de elemento; familia/tipo/instancia; host y restricciones; parámetros y unidades; versión de aplicación; vínculo modelo–revisión; pérdida/degradación; provenance; UNKNOWN; round-trip como evidencia comparativa, no como prueba de corrección.
- **PREREQUISITES:** contrato de identidad ARKI (`shared/identity/arkiGlobalId.ts`); `SceneModel` (`shared/arkiSceneModel.ts`); esquema de parámetros/unidades y reglas de host acordados; Revit/RFA/RVT real y adaptador autorizado; fixture antes/después; revisión humana cuando el intercambio afecte entregables.
- **INPUTS:** `SceneModel` con `projectId`, nodos, niveles, dimensiones y relaciones; archivo/exportación Revit; versión de software; unidades y sistema de coordenadas; reglas de mapeo; hash, revisión, timestamp y provenance.
- **OUTPUTS:** mapa elemento ARKI↔Revit; archivo de intercambio; informe de preservado/degradado/perdido (geometría, propiedades, relaciones); diagnósticos; contexto project/time/scenario/applicability/scale; estado epistémico por afirmación.
- **CORE_RELATIONSHIPS:** elemento–familia/tipo/instancia; instancia–host; elemento–nivel; relación documental `APPLIES_TO`; relación epistémica `DERIVED_FROM`; revisión–provenance. Ninguna relación importada se eleva a `VERIFIED` sin evidencia y revisión requeridas.
- **BASIC_METHODS_OR_ALGORITHMS:** asignar IDs deterministas; exportar/importar con tabla de mapeo; comparar conjuntos de identidad y parámetros con tolerancias declaradas; clasificar `preserved/degraded/lost`; conservar hash y cadena de transformaciones; bloquear promoción semántica cuando el adaptador no esté autorizado.
- **COMMON_FAILURES:** cambio de GUID/ID; host roto; familias anidadas o parámetros compartidos no mapeados; unidades/ coordenadas invertidas; geometría visualmente similar pero semánticamente distinta; pérdida silenciosa de relaciones; confundir “abrió/importó” con validez.
- **LIMITS:** ARKI sólo tiene visor/`SceneModel` y un exportador conceptual IFC4; la matriz existente declara **“Revit/RFA/RVT: No adaptador productivo”**. No se ejecutó Revit ni se generó RFA/RVT en este entorno. No hay solver, certificación ni firma.
- **PROFESSIONAL_BOUNDARY:** no sustituye revisión BIM, coordinación interdisciplinaria, QA/QC, juicio de arquitecto/ingeniero, entregable contractual o certificación.
- **ARKI_EXISTING_KNOWLEDGE:** `SceneModel` y `mapSceneIdentities`; `sceneIdentityRoundTrip` e informe de pérdida en `shared/ifc4/arkiIfc4.ts`; la matriz `E1_CONTRATO_PRODUCTO_ADRS/08_MATRIZ_COBERTURA_ARCHI_ARQUI_REVIT.md` declara objetivo de importación/exportación gobernada pero brecha de adaptador productivo.
- **ARKI_NEW_TRAINING:** contrato de round-trip con identidad, contexto y pérdida explícita; regla de no promoción; microejercicio TRANSFER que reutiliza identidad IFC como proxy seguro, sin presentarlo como integración Revit.
- **GAPS_REMAINING:** adaptador real RFA/RVT; lectura/escritura controlada; mapeo de familias, hosts, constraints y parámetros; pruebas multi-versión; fixtures de pérdida; validación de unidades/coordenadas; revisión humana y licencia/entorno reproducible.

## CAPABILITY_ID: X2

- **NAME:** DWG/DXF gobernado.
- **PURPOSE:** Inspeccionar y representar CAD como evidencia de fuente, sin reparar, sobrescribir, convertir destructivamente ni promocionar geometría CAD desconocida a hecho semántico ARKI.
- **CORE_CONCEPTS:** fuente congelada; hash; formato/versión; handles; capas/bloques; ACIR; unidades y coordenadas explícitas o `UNKNOWN`; diagnósticos; pérdidas de conversión; `semanticPromotion: PROHIBITED`; provenance de entidad y documento.
- **PREREQUISITES:** fuente inmutable; hash; lector autorizado y versionado; matriz de unidades/coordenadas; política de no sobrescritura; catálogo de pérdidas; revisión de derivaciones.
- **INPUTS:** bytes DWG/DXF; nombre/extensión; versión; hash; lector y versión; sistema de unidades/coordenadas; reglas de transformación y referencias de proyecto/tiempo/escenario.
- **OUTPUTS:** `CadInspection`; `AcirDocument` (`ARKI-ACIR-1.0`); entidades con `UNKNOWN_CAD_FACT`; provenance; layers/bloques/instancias; diagnósticos `INFO/WARNING/ERROR/LOSS`; estado `PARSED/PARTIALLY_PARSED/UNSUPPORTED/CORRUPTED/UNKNOWN/CONVERSION_LOSS_DETECTED`.
- **CORE_RELATIONSHIPS:** fuente–hash; entidad–handle; entidad–capa/bloque; derivación–transformación; documento–provenance. Un hash demuestra identidad de bytes, no corrección geométrica ni autoría.
- **BASIC_METHODS_OR_ALGORITHMS:** congelar y hashear; inspeccionar antes de parsear; parsear a ACIR; validar números, hashes, provenance y diagnósticos; rechazar `PARSED` con errores/pérdidas no resueltas; serializar sólo tras validación; mantener unidades/coordenadas `UNKNOWN` si no hay evidencia.
- **COMMON_FAILURES:** confiar en la extensión; usar hash/import success como verdad; asumir metros; perder bloques/handles; reparar o sobrescribir fuente; convertir a BIM sin trazabilidad; marcar parseado con pérdida.
- **LIMITS:** `shared/arkiCadGateway.ts` ofrece gateway y lector sintético determinista para fixtures. `ABB001_DWG_SOURCE_INTEGRITY.json` registra fuentes AC1032/AutoCAD 2018 como sólo metadatos, con `NO_DWG_READER_AVAILABLE`, conteos no ejecutados y protección de sólo lectura. No se afirma lectura productiva DWG/DXF ni exportación.
- **PROFESSIONAL_BOUNDARY:** no certifica autenticidad, precisión, propiedad, cumplimiento CAD, planos “as-built” ni aptitud para construcción; requiere lector y revisión profesional autorizados.
- **ARKI_EXISTING_KNOWLEDGE:** `CadGateway`, tipos `CadProvenance`, `AcirDocument`, validadores, lector sintético y `assertNoCommercialProviderLoaded`; `ABB001_DWG_SOURCE_INTEGRITY.json` y forense binaria de fuente.
- **ARKI_NEW_TRAINING:** regla de gobierno de fuente y no promoción; conservación de unidades/provenance/UNKNOWN en el ejercicio NORMAL; separación explícita entre hash, importación y verdad; mutante de provenance detectado por oracle.
- **GAPS_REMAINING:** lector DWG/DXF autorizado; cobertura de entidades y versiones; resolución de unidades/coordenadas; round-trip CAD; comparación geométrica; manejo de xrefs/proxy/objetos; revisión de pérdidas y pruebas con fuentes reales sin alterar el congelado.

## CAPABILITY_ID: X3

- **NAME:** Nubes de puntos con trazabilidad.
- **PURPOSE:** Encapsular observaciones de nube de puntos (por ejemplo, puntos, densidad, clasificación y marco espacial) como observaciones acotadas, conservando provenance y UNKNOWN sin convertirlas en modelo construido, medición certificada o forecast.
- **CORE_CONCEPTS:** observación vs inferencia; punto/scan/registro; sensor y captura; timestamp; CRS/unidades; precisión/incertidumbre; densidad; clipping/decimación; escala/applicability; provenance; UNKNOWN; separación entre nube y geometría BIM.
- **PREREQUISITES:** archivo y hash; formato/lector (E57/LAS/LAZ u otro) autorizado; sistema de coordenadas y unidades; metadatos de sensor/captura; tolerancias; política de privacidad; fixture de observación y revisión experta.
- **INPUTS:** bytes o referencia de nube; puntos/atributos; sensor y estación; timestamp; CRS/unidades; proyecto, escenario y escala; transformaciones (registro, filtrado, decimación) con sus parámetros.
- **OUTPUTS:** índice/metadata de nube; observaciones con estado epistémico (por defecto `UNKNOWN` o `OBSERVED` sólo si el contrato lo permite); provenance por fuente y transformación; diagnósticos; incertidumbre y cobertura; ninguna afirmación geométrica no sustentada.
- **CORE_RELATIONSHIPS:** punto/scan–fuente; scan–estación/sensor; nube–proyecto; observación–tiempo; registro–transformación; observación–elemento sólo como `DERIVED_FROM` o correspondencia propuesta con evidencia. No equivale a relación de verdad construida.
- **BASIC_METHODS_OR_ALGORITHMS:** validar hash/encabezado/CRS/unidades; conservar puntos y metadatos; registrar transformaciones; calcular sólo estadísticas descriptivas etiquetadas; separar registro, clasificación y modelado; comparar contra fixture con tolerancia y reportar UNKNOWN cuando falte evidencia.
- **COMMON_FAILURES:** asumir que color o densidad prueba material; perder CRS/unidades; confundir registro exitoso con alineación correcta; llamar “as-built” a una captura sin fecha/control; eliminar outliers sin registrar; convertir observaciones en geometría certificada.
- **LIMITS:** no se encontró adaptador, parser, fixture ni contrato de nube de puntos específico en el alcance inspeccionado de ARKI; no se ejecutó lectura real E57/LAS/LAZ ni registro ICP. Este estado es **GAP**, no una capacidad disponible.
- **PROFESSIONAL_BOUNDARY:** no certifica levantamiento, tolerancias, seguridad, deformaciones, patologías, volumen, estado construido ni base legal; requiere metodología topográfica/geomática y revisión profesional.
- **ARKI_EXISTING_KNOWLEDGE:** reutilizables como fundamentos: provenance/hash generales, `RelationshipRecord` con `epistemicStatus`, `projectVersion`, `scenario`, `applicabilityScale`, y `UNKNOWN`; no hay módulo de nube específico identificado.
- **ARKI_NEW_TRAINING:** contrato conceptual de preservación de observación, units, applicability, scale, project/time/scenario; caso ADVERSARIAL que prueba que `imported: true` y hash no cambian `UNKNOWN`.
- **GAPS_REMAINING:** formatos y parsers; CRS/unidades; almacenamiento/indexación; registro cuantificado; incertidumbre; clasificación; rendimiento; fixture real; controles de acceso; contrato de correspondencia nube↔BIM y revisión experta.

## CAPABILITY_ID: X4

- **NAME:** IFC4x3 interoperable y gobernado.
- **PURPOSE:** Intercambiar entidades IFC con identidad y pérdida explícita, distinguiendo el soporte probado IFC4 del objetivo IFC4x3 y evitando tratar parseo/exportación como certificación o verdad del modelo.
- **CORE_CONCEPTS:** STEP; schema/version; entidades y EXPRESS IDs; GlobalId; mapeo ARKI; relaciones; propiedades; geometría; unidades; contexto; pérdida; determinismo; parser/exporter; provenance; UNKNOWN.
- **PREREQUISITES:** contrato IFC4x3 acordado; exporter/parser con schema explícito; reglas de GlobalId; mapeo de entidades/relaciones/propiedades; fixtures IFC4x3; validación de schema y unidades; comparador de round-trip; revisión humana.
- **INPUTS:** `SceneModel`; fixture IFC; schema declarado; `projectId`/versión; entidades, GlobalId, propiedades, relaciones y geometría; unidades/CRS; provenance y contexto.
- **OUTPUTS:** IFC exportado; parseo; mapa de identidades; loss report (`preserved/degraded/lost/propertiesLost/relationsLost`); diagnósticos; contexto completo; estado epistémico. El output no es certificado IFC ni aprobación de coordinación.
- **CORE_RELATIONSHIPS:** `SceneNode`↔GlobalId; entidad↔expressId; proyecto↔elemento; elemento↔propiedades/relaciones; entidad importada↔`DERIVED_FROM`; revisión↔provenance. `GlobalId` preservado no prueba geometría, propiedades ni semántica completa.
- **BASIC_METHODS_OR_ALGORITHMS:** generar IDs deterministas; exportar STEP; parsear schema/entidades; comparar identidades; clasificar pérdidas; verificar geometría soportada/partial/unsupported; conservar unidades y contexto; ejecutar fixtures y pruebas de regresión.
- **COMMON_FAILURES:** confundir IFC4 con IFC4x3; parser que sólo extrae GlobalId; perder relaciones/PropertySets; invalidar unidades/CRS; aceptar schema no declarado; asumir que `web-ifc` abre archivo equivale a conformidad; convertir hash o parse success en verdad.
- **LIMITS:** `shared/ifc4/arkiIfc4.ts` exporta/parsea **IFC4** y `webIfcAdapter.ts` devuelve el schema detectado; geometría avanzada tiene estados partial/unsupported. Las regresiones existentes pasan para fixtures IFC4 y GlobalId, pero no demuestran IFC4x3. El test local X ejecutado aquí usa un fixture IFC4 mínimo, no un validator IFC4x3.
- **PROFESSIONAL_BOUNDARY:** no certifica conformidad buildingSMART, coordinación, cantidades, constructibilidad, seguridad ni firma de entregables.
- **ARKI_EXISTING_KNOWLEDGE:** exporter/parser IFC4; `sceneIdentityRoundTrip`; `mapSceneIdentities`; `supportedIfcGeometry`; fixtures IFC4 y scripts `test-ifc4-*`; salida `ARKI_CAD_001C_IFC_REGRESSION_OUTPUTS.txt` con PASS de entidades/identidades y advertencia explícita de alcance IFC4.
- **ARKI_NEW_TRAINING:** diferenciar IFC4 probado de objetivo IFC4x3; preservar contexto epistémico en transferencia; ejercicio TRANSFER y guardas anti-promoción; reporte de gap IFC4x3.
- **GAPS_REMAINING:** soporte real IFC4x3 (schema, entidades, relaciones, property sets, geometría y unidades); validator/conformance; fixtures IFC4x3; round-trip multi-herramienta; cobertura de pérdidas; clasificación de cambios; revisión profesional.

## Reglas transversales X

1. **UNKNOWN se conserva:** ausencia de lector, unidades, CRS, precisión, semántica o validación no se rellena por intuición.
2. **Provenance no es verdad:** fuente, hash, import success, simulación, observación y forecast se reportan como evidencia del proceso o del dato, no como certificación.
3. **Contexto obligatorio cuando aplique:** `project`, `time`, `scenario`, `applicability`, `scale` y `units` viajan con el registro; una transformación debe agregar su historial, no borrarlo.
4. **Reutilización primero:** se usan `arkiGlobalId`, `SceneModel`, `arkiCadGateway`, relaciones/provenance existentes y el stack IFC4; no se agregaron módulos productivos nuevos ni se tocaron Product State, BKH, TX, E5–E8 o PF-H01.
5. **Estado global:** **PARTIAL** por evidencia real IFC4/CAD conceptual y ausencia de Revit productivo, nube de puntos y IFC4x3 probado.

## Evidencia ejecutada

Se ejecutó `/home/ubuntu/jobs/cbef0db18f21_a9/test_x_exercises.ts` con `pnpm exec tsx`: `status=PASS`, NORMAL/PASS, ADVERSARIAL/PASS, TRANSFER/PASS, `mutantsKilled=1`, `cadUnits=UNKNOWN`, `cadSemantic=PROHIBITED`, `ifcSchema=IFC4`, `epistemicStatus=UNKNOWN`. El mutante controlado elimina `provenance`; el oracle lo detecta. El código correcto `preserveEnvelope` queda intacto. La salida reproducible se conserva en `EXERCISES_X.txt`.
