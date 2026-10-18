# Revisión cuidadosa — Tutor de ARKI y veredicto E5

**Fecha:** 23 de septiembre de 2026  
**Alcance:** revisión de `pasted_content_69.txt`, `pasted_content_70.txt`, el Contrato E5 Revisado v1.0 y el repositorio real.

## 1. Veredicto ejecutivo

### Documento 69 — Tutor de ARKI

**Veredicto: APPROVE AS STRATEGIC PROPOSAL / NOT IMPLEMENTED.**

La propuesta es conceptualmente fuerte y debe conservarse como una adenda propia de **ARKI Academy / Tutor / Examiner / Oracle**. No debe mezclarse con E5, porque E5 trata del visor 3D, SceneModel, persistencia, comparación y vistas técnicas.

La separación propuesta es correcta: **ARKI sigue siendo un único sistema de proyecto**, mientras que Tutor, Examiner y Oracle son funciones independientes de formación y evaluación. La idea central —convertir documentos en conocimiento estructurado, pruebas ocultas y competencia demostrada— es superior a un RAG documental simple.

### Documento 70 — Veredicto de DeepSeek sobre E5

**Veredicto validado: DEFER — E5 VERIFIED no concedido.**

La razón principal es correcta: el repositorio tiene código funcional P1–P10, pero no cumple todavía el gate documental y de evidencia exigido por el Contrato E5 Revisado. En particular, faltan las ocho capturas, el manifest, el archivo de límites, el output completo actualizado y una prueba real de restauración/viewpoints/árbol.

Sin embargo, el documento 70 contiene dos afirmaciones que deben corregirse:

1. **Los cuatro ADRs sí existen** en `contracts/adr/ADR-001.md`, `ADR-002.md`, `ADR-003.md` y `ADR-019.md`. Por tanto, no es correcto clasificarlos simplemente como “❌ faltantes”. Lo correcto es: **existen, pero falta integrarlos al paquete formal de cierre y demostrar si el contrato exige firma explícita o basta el estado aprobado**.
2. El informe E5 actual no es PDF: existe `E5_SCENE_MODEL_3D_REPORT.md`. Lo correcto es: **el archivo Markdown existe, pero no cumple por sí solo todos los entregables del contrato porque falta `E5_SCOPE_LIMITS.md`, `E5_MANIFEST.json` y evidencia completa**.

## 2. Revisión del Tutor de ARKI

### 2.1. Lo que está bien planteado

La propuesta identifica correctamente que una biblioteca de PDFs no equivale a conocimiento computable. El Tutor debe conservar provenance, institución, jurisdicción, disciplina, edición, vigencia, hipótesis, unidades, confianza, contradicciones y pruebas asociadas.

También es correcta la cadena:

> fuente → extracción → conocimiento candidato → provenance → contradicciones → validación → Knowledge Graph → Competency Tests → conocimiento de ARKI

La distinción entre **enseñar**, **examinar** y **certificar** es especialmente importante. ARKI no debe autoasignarse una competencia porque haya leído una fuente o generado una explicación convincente.

Los niveles L0–L10 son útiles como escala pedagógica, siempre que cada nivel tenga criterios observables y no sea una valoración subjetiva del modelo.

El mecanismo de aprendizaje dirigido por déficits de proyecto también es valioso. Un proyecto puede activar necesidades de aprendizaje, pero esas necesidades deben convertirse en competencias verificables, no en cambios automáticos del motor.

### 2.2. Riesgos que deben corregirse antes de implementarlo

El Tutor no debe modificar automáticamente kernels críticos sólo porque una fuente haya sido ingerida. El flujo correcto debe ser:

1. conocimiento candidato;
2. extracción estructurada;
3. provenance y jurisdicción;
4. contradicciones;
5. revisión experta;
6. implementación propuesta;
7. pruebas de referencia;
8. examen oculto;
9. aprobación de versión;
10. promoción controlada al kernel.

El **Oracle** tampoco debe ser una respuesta generada por el mismo modelo evaluado. Debe utilizar casos de referencia versionados, soluciones verificadas, tolerancias y, cuando corresponda, un solver o revisión profesional independiente.

La propuesta menciona libros, normas, papers, expedientes y tesis. Para normas y documentos con restricciones de copyright deben definirse fuentes autorizadas, metadatos y permisos de almacenamiento. No se debe asumir que toda fuente puede copiarse íntegramente a la biblioteca interna.

La competencia L9 debe distinguir entre competencia computacional demostrada y habilitación profesional. ARKI puede demostrar que un cálculo pasa un conjunto de casos; eso no sustituye la firma de un profesional autorizado.

### 2.3. Cómo debe registrarse

Recomiendo abrir un contrato separado:

**ARKI ACADEMY / TUTOR v1.0**

Con estas entidades mínimas:

| Entidad | Propósito |
|---|---|
| SourceRecord | Fuente, institución, edición, jurisdicción y vigencia |
| KnowledgeClaim | Afirmación extraída con provenance |
| ContradictionRecord | Conflicto entre fuentes o jurisdicciones |
| Competency | Competencia y subcompetencias |
| LearningUnit | Teoría, ecuaciones, ejemplos y ejercicios |
| HiddenExam | Caso no expuesto al sistema durante el aprendizaje |
| OracleCase | Resultado de referencia, tolerancias y método de verificación |
| EvidenceRecord | Evidencia reproducible del examen |
| CompetencyState | UNKNOWN, NOT_DEMONSTRATED, IMPLEMENTED, VERIFIED, E2E_VERIFIED |
| ProfessionalGate | Revisión y firma profesional requerida |

El piloto propuesto de **Structures Foundations** es razonable. Debe mantenerse pequeño: cinco a diez fuentes autorizadas, un conjunto limitado de conceptos, ejercicios y casos ocultos. No se debe iniciar con las 60 disciplinas.

## 3. Auditoría de E5 contra el contrato aprobado

| Punto | Estado real | Veredicto |
|---|---|---|
| ADR-001 | Existe | Corregir inventario de DeepSeek; incluir en paquete formal |
| ADR-002 | Existe | Corregir inventario de DeepSeek; incluir en paquete formal |
| ADR-003 | Existe | Corregir inventario de DeepSeek; incluir en paquete formal |
| ADR-019 | Existe | Corregir inventario de DeepSeek; incluir en paquete formal |
| P1 PNG WebGL | Existe un PNG con hash y geometría visible | Parcial: la cámara no muestra un edificio general comprensible |
| P2 IndexedDB | Adaptador y flujo de guardar/aprobar existen | Parcial: la prueba es contractual y no demuestra restauración tras recarga |
| P3 lado a lado | Dos Canvas existen y la comparación se muestra | Parcial: no hay controles independientes por lado para cámara, nivel y filtros |
| P4 selección 2D/3D | Provider compartido y código conectado | Parcial: el test inspecciona fuentes, no ejecuta interacción real |
| P5 clipping | Existe filtro de nodos por altura | Parcial: no es clipping de sólidos; debe llamarse filtro por altura |
| P6 cámaras | Existen cinco modos | Parcial: falta captura de evidencia de las vistas requeridas |
| P7 medición | Distancia entre centroides | Parcial: no es snapping a vértices, caras o ejes |
| P8 viewpoints | Se guarda estado en memoria | Insuficiente: no existe restauración ni persistencia real de viewpoints |
| P9 aislamiento/congelación | Estados locales implementados | Parcial: falta evidencia visual y prueba de comportamiento ejecutado |
| P10 árbol disciplinar | El componente genera disciplina → nivel → categoría → elemento | Parcial: falta `test-tree-discipline.ts` y captura real del árbol expandido |
| P11 ADRs | Los cuatro archivos existen | Implementado documentalmente, no empaquetado como cierre firmado |
| P12 IFC productivo | Correctamente fuera de E5 | Correcto; debe documentarse en `E5_SCOPE_LIMITS.md` |

## 4. Evidencia formal que realmente falta

La auditoría del repositorio confirma:

- Existe `E5_SCENE_MODEL_3D_OUTPUTS.txt`, pero refleja principalmente el bloque anterior y no contiene los outputs completos de todas las pruebas P1–P10 nuevas.
- No existe `E5_MANIFEST.json`.
- No existe `E5_SCOPE_LIMITS.md`.
- Existe `E5_SCENE_MODEL_3D_REPORT.md`, pero su nombre no coincide con el entregable contractual `E5_REPORT.md` y debe actualizarse con el estado real del cierre.
- En `evidence/E5_CAPTURAS/` sólo existen `arki-scene-general.png` y su JSON. El contrato exige un mínimo de ocho capturas.
- No existe `scripts/capture-scene-model.ts`.
- No existe `scripts/test-tree-discipline.ts`.
- Las pruebas nuevas de medición, viewpoints, aislamiento, cámaras y clipping son principalmente pruebas de presencia/contrato en código, no pruebas completas de interacción o persistencia.

## 5. Observación crítica sobre P1

La captura corregida ya no es negra y sí contiene geometría. Eso demuestra que `preserveDrawingBuffer` solucionó el problema técnico de exportación. No obstante, la imagen sigue sin ser una captura general suficiente del edificio: la cámara está demasiado cercana o mal encuadrada y la geometría aparece parcialmente como una superficie y una fila de elementos.

Por tanto, DeepSeek tiene razón en exigir una nueva captura isométrica o axonométrica con:

- edificio completo;
- niveles distinguibles;
- muros, puertas, ventanas y estructura reconocibles;
- escala legible;
- cámara general;
- metadatos coherentes con lo visible.

El campo `nodes: 545` demuestra que el SceneModel contiene nodos, pero no demuestra que los 545 estén visibles en pantalla. Esa discrepancia debe explicarse mediante el encuadre y el criterio de visibilidad.

## 6. Gobernanza del veredicto

DeepSeek tiene razón en que el reporte de Manus no debe reemplazar el veredicto técnico del contrato. El texto `APPROVE WITH FIXES` del informe de Manus debe interpretarse como **estado de implementación interna**, no como cierre formal de E5.

La gobernanza correcta queda así:

- **Manus:** implementa, compila, prueba, captura y reporta.
- **DeepSeek:** revisa contra el contrato y emite veredicto técnico.
- **Product Owner:** aprueba o rechaza el cierre.

Por eso el estado formal recomendado es:

```text
E5: DEFER
P1–P10: IMPLEMENTED / PARTIAL, con observaciones
P11: ADRs existentes; cierre documental pendiente
P12: FUERA DE E5
E6: BLOQUEADO
```

## 7. Orden de corrección recomendado

1. Corregir el inventario formal de ADRs: existen, pero deben quedar incorporados al paquete y aclarar la firma requerida.
2. Generar la captura P1 con cámara general/isométrica.
3. Crear las siete capturas restantes.
4. Crear `scripts/test-tree-discipline.ts`.
5. Convertir P2 en una prueba real de IndexedDB: guardar, cerrar/abrir conexión, restaurar y verificar hash/gateStatus.
6. Implementar restauración real de viewpoints; actualmente sólo se guardan en estado React.
7. Separar componentes y controles de ambos lados de P3 para demostrar independencia de cámara, nivel y capas.
8. Renombrar en la UI `Clipping` a **Filtro por altura** hasta que exista clipping geométrico real.
9. Renombrar `snap: centroide` como **Medición entre centroides**; no llamarlo snapping profesional.
10. Generar `E5_MANIFEST.json`, `E5_SCOPE_LIMITS.md`, `E5_REPORT.md` y un `E5_OUTPUTS.txt` actualizado con outputs crudos.
11. Reejecutar toda la regresión y sólo después emitir un nuevo paquete a DeepSeek.

## 8. Conclusión final

El Tutor de ARKI es una **idea estratégica aprobable y de alto valor**, pero debe abrirse como contrato independiente. Su piloto recomendado es Structures Foundations con Tutor, Examiner y Oracle separados.

El veredicto de DeepSeek sobre E5 es **sustancialmente correcto y debe mantenerse como DEFER**. La implementación actual tiene valor real, pero aún no satisface el gate formal del contrato. Las dos correcciones principales al veredicto de DeepSeek son que los ADRs sí están presentes y que el informe Markdown E5 sí existe, aunque faltan el paquete completo, las capturas y varias pruebas de comportamiento real.

**No recomiendo abrir E6 todavía.**
