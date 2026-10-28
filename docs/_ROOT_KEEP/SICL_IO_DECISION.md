# Decisión arquitectónica: Investigación de Operaciones en SICL

## Decisión

Investigación de Operaciones entra en SICL como una **capa analítica extensible**. No se convierte en el núcleo de autoridad, no reemplaza el Core Contract y no produce decisiones automáticas.

Un método IO puede calcular, comparar, simular o diagnosticar. Su salida debe quedar vinculada a un proyecto, alternativa o escenario, con entradas, unidades, restricciones, supuestos, fuente de datos, versión del método, estado de factibilidad y diagnóstico. Una recomendación puede usar el resultado, pero una Decision solo puede ser registrada por una autoridad humana explícita.

## Métodos priorizados

| Fase | Método | Propósito | Estado de salida |
|---|---|---|---|
| 1 | Transporte y transbordo lineal | Asignar flujos entre orígenes, nodos y destinos | `OPTIMAL`, `INFEASIBLE`, `INSUFFICIENT_DATA` o `UNKNOWN` |
| 1 | Asignación de recursos | Distribuir recursos bajo capacidad y restricciones | Igual que transporte |
| 1 | MCDA ponderado | Comparar alternativas con criterios y pesos explícitos | `COMPARISON`, nunca Decision |
| 2 | Colas M/M/c | Analizar capacidad y espera bajo supuestos declarados | `CALCULATED` o `INSUFFICIENT_DATA` |
| 2 | Inventarios | Analizar reposición, demanda y riesgo de quiebre | `CALCULATED` o `INSUFFICIENT_DATA` |
| 3 | CPM/PERT | Calcular precedencias, holguras y ruta crítica | `CALCULATED` o `INCONSISTENT_NETWORK` |
| 3 | Monte Carlo | Propagar incertidumbre con distribuciones justificadas | `CALCULATED`, nunca certeza |

## Correcciones obligatorias al documento de visión

Los números de Chancay–Callao, capacidades, costos, probabilidades, puntuaciones MCDA, métricas de sensores y porcentajes de ahorro del material adjunto son **datos ilustrativos hasta que exista fuente, fecha, unidad y método de validación**. No deben entrar al Core como hechos.

La capa IO tampoco debe llamarse “Decision Engine” si esa expresión implica autoridad. La denominación recomendada es **SICL Analytical Methods Layer** o **SICL Operations Research Layer**.

Los modelos de IA pueden ayudar a formular un problema, explicar un resultado o detectar faltantes. No pueden aprobar el modelo mediante una palabra clave, sustituir la validación de datos ni activar publicación, contratación, operación de infraestructura o decisión pública.

## Ruta de implementación

La primera entrega segura es el catálogo contractual y la validación de entradas. Después se incorporan solvers deterministas con casos de prueba pequeños y reproducibles. La conexión con datos oficiales, BIM, GIS, sensores o APIs se implementa como adaptadores de evidencia independientes. Solo después se habilitan escenarios predictivos y simulaciones, siempre con incertidumbre y trazabilidad.

## Comparación explícita de los documentos 63 y 64

El documento 63 es principalmente una **expansión progresiva de visión y prototipos**: conversación entre modelos, carpetas de trabajo, BIM/GIS, gemelos digitales, IO, predicción y MCDA. Contiene ejemplos de código, cifras, coordenadas, métricas y resultados presentados con un grado de certeza mayor que el demostrado.

El documento 64 funciona como una **síntesis evaluativa** del documento anterior. Acierta al reconocer que IO, BIM, gemelos digitales y MCDA son direcciones coherentes, pero todavía subestima un punto: no basta con reemplazar datos simulados por datos reales. También hay que demostrar el contrato del método, su factibilidad, la calidad de los datos, la sensibilidad, la reproducibilidad y la separación entre recomendación y decisión.

| Categoría | Documento 63 | Documento 64 | Decisión SICL |
|---|---|---|---|
| Visión | Ecosistema multiescala con IA, BIM, GIS, IO, gemelos y predicción | Confirma que esa visión es coherente | Se conserva como visión de producto, no como capacidad ya probada |
| Capacidades factibles | Transporte, asignación, colas, inventarios, CPM/PERT, MCDA y coordinación entre modelos | Las identifica como módulos posteriores | Se incorporan mediante contratos y solvers independientes |
| Prototipos | Scripts, carpetas, dashboards y formatos de salida | Los trata como base conceptual | Se aceptan solo como prototipos; no constituyen validación profesional |
| Afirmaciones no demostradas | “APROBADO”, “gemelo digital vivo”, “LOD 400”, predicciones, ahorros y decisiones prescriptivas | Advierte sobre datos simulados y falsa precisión | Se rechazan como afirmaciones de producción hasta contar con evidencia verificable |

La diferencia más importante entre ambos documentos es de **nivel de cautela**, no de dirección estratégica. El documento 64 corrige parte del exceso de confianza del documento 63; SICL debe completar esa corrección con contratos ejecutables y estados explícitos de incertidumbre.
