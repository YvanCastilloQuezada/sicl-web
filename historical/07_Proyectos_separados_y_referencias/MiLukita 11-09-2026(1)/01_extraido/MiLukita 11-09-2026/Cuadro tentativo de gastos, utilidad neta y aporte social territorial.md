# Cuadro tentativo de gastos, utilidad neta y aporte social territorial

> **Advertencia financiera y legal.** Soy una IA; este documento es un análisis de planeamiento, no asesoría financiera, tributaria ni legal definitiva. La operación actual es un piloto gratuito: no recauda dinero, no genera utilidad monetaria y, por tanto, no produce aporte social real. Antes de abrir una operación regulada, un abogado peruano, contador y especialista de cumplimiento deben validar la entidad, permisos, impuestos, contratos y mensajes publicitarios.

## Alcance y criterio de cálculo

El modelo considera una futura plataforma formalmente autorizada en Perú. Se parte del **Ingreso Neto de Juego (IN)**, equivalente a las apuestas y bonificaciones percibidas menos premios y devoluciones. SUNAT explica que, para el impuesto específico de juegos a distancia, a ese IN se descuenta un gasto de mantenimiento equivalente al 2 % y se aplica una tasa de 12 %; el efecto simplificado usado en el modelo es **11,76 % del IN**. [1] La renta empresarial en Régimen General se modela con una tasa de 29,5 % sobre utilidad gravable positiva. [2]

No se parte de “cada sol apostado” como utilidad. Primero existen premios, devoluciones, tributos, medios de pago, tecnología, cumplimiento, personal y reservas. Por ello, la frase **“tu dinero se queda en tu distrito” no debe emplearse**: sería más amplia de lo que la operación podría demostrar.

| Definición | Fórmula de planeamiento |
|---|---|
| Ingreso Neto de Juego (IN) | Apuestas + bonificaciones − premios − devoluciones. |
| Impuesto específico de juego | `IN × 11,76 %` en este modelo simplificado. |
| Utilidad antes de renta | `IN − impuesto específico − costos variables − gastos fijos`. |
| Impuesto a la renta | `MAX(0, utilidad antes de renta × 29,5 %)`; no se generan créditos por pérdidas en este cuadro. |
| Utilidad neta | `Utilidad antes de renta − impuesto a la renta`. |
| Fondo social | `MAX(0, utilidad neta × 1 %)`; nunca se descuenta de premios ni de saldos de jugadores. |

## Presupuesto mensual base: S/ 225 000 de gasto fijo

Las cifras siguientes son **envolventes presupuestarias**, no cotizaciones. Sirven para saber qué debe preguntarse a proveedores y qué partidas no se deben olvidar. El archivo Excel adjunto permite sustituir cada supuesto.

| Área | Gasto repetitivo mensual base (S/) | Finalidad |
|---|---:|---|
| Operación de juegos, juego responsable y prevención | 30 000 | Supervisión operativa, límites, revisiones de incidentes y controles de riesgo. |
| Atención al jugador y soporte extendido | 22 000 | Atención multicanal, reclamos y seguimiento de incidentes. |
| Riesgo de pagos, fraude y contracargos | 12 000 | Herramientas y analistas para KYC, alertas y conciliación. |
| Nube, DevSecOps y ciberseguridad | 18 000 | Infraestructura, monitoreo, respaldo, WAF, gestión de vulnerabilidades y respuesta. |
| IA, datos y analítica operativa | 14 000 | Presupuesto multiherramienta para análisis de fraude, soporte, previsión de demanda y borradores de curaduría con aprobación humana. |
| Licencias de sistemas y observabilidad | 9 000 | CRM, ticketing, logs, gestión de identidad, comunicaciones y monitoreo. |
| Contenido, comunidad y educación responsable | 10 000 | Reglas claras, comunicaciones no compulsivas y materiales educativos. |
| Marketing y adquisición responsable | 30 000 | Campañas, afiliados permitidos y medición; sin incentivos dirigidos a pérdidas. |
| **Subtotal operacional** | **145 000** |  |
| Dirección, producto, recursos humanos | 25 000 | Gestión, producto, coordinación y administración de personal. |
| Administración, contabilidad y finanzas | 12 000 | Contabilidad, tesorería, conciliación, reportes y presupuesto. |
| Asesoría legal, regulatoria y cumplimiento | 16 000 | Contratos, privacidad, MINCETUR, protección al consumidor y prevención. |
| Reserva de auditoría, certificación y pruebas | 18 000 | Reserva mensual para auditorías técnicas y revisiones independientes. |
| Oficina, seguros y administración corporativa | 9 000 | Gastos corporativos, pólizas y herramientas administrativas. |
| **Subtotal administración y finanzas** | **80 000** |  |
| **Total fijo mensual base** | **225 000** | Antes de cargos variables ligados al volumen. |

La capa de IA **no decide sorteos, RTP, premios ni resultados de mercados**. Se limita a clasificación de soporte, detección de anomalías, pronóstico de capacidad, conciliación de señales y preparación de borradores para revisión humana. En particular, MultiMarket debe continuar sin mercados políticos, financieros o creados automáticamente por usuarios.

## Escenarios tentativos de utilidad mensual

Los escenarios usan un cargo de procesamiento de pagos de 2,5 % del IN y un costo variable de plataforma/soporte de 3,0 % del IN como **supuestos editables**. La operación regulada requiere autorización y certificación de plataforma, programas de juego, sistemas progresivos y servicios principales; por ello, el presupuesto incluye una reserva específica de auditoría/certificación. [3]

| Concepto (S/ mensuales) | Conservador | Base | Escala |
|---|---:|---:|---:|
| Ingreso Neto de Juego (IN) | 180 000 | 350 000 | 700 000 |
| Impuesto específico de juegos (11,76 % IN) | (21 168) | (41 160) | (82 320) |
| Procesamiento de pagos (2,5 % IN) | (4 500) | (8 750) | (17 500) |
| Plataforma y soporte variable (3,0 % IN) | (5 400) | (10 500) | (21 000) |
| Gastos fijos | (200 000) | (225 000) | (260 000) |
| **Utilidad antes de renta** | **(51 068)** | **64 590** | **319 180** |
| Impuesto a la renta (29,5 % si hay ganancia) | — | (19 054) | (94 158) |
| **Utilidad neta** | **(51 068)** | **45 536** | **225 022** |
| **Aporte institucional social (1 % de utilidad neta)** | **0** | **455** | **2 250** |

El punto de equilibrio aproximado del caso base es **S/ 271 936 de IN mensual** antes de impuesto a la renta; el Excel contiene la fórmula. Esto explica por qué no conviene afirmar que habrá un aporte por distrito desde el primer mes: en el caso base anual, el fondo estimado sería solo S/ 5 464, insuficiente para fragmentarse de forma útil y auditable.

## Entidad y mecanismo de impacto recomendados

No recomiendo crear de inmediato una entidad propia mientras el producto siga siendo un piloto. La secuencia más prudente es iniciar, si algún día la operación estuviera legalmente habilitada, con **una organización existente y calificada** como receptora de donaciones; SUNAT prevé la calificación de entidades perceptoras por tres años, condicionada, entre otros, a RUC y registro de entidad inafecta o exonerada. [4]

Cuando el fondo anual supere un umbral que justifique su administración —por ejemplo, S/ 150 000 por año durante dos ejercicios consecutivos— convendría evaluar una **asociación civil independiente de interés social**, provisionalmente denominada *Fondo de Impacto Local Multi Juegos Perú*. La entidad operadora y la asociación no deberían compartir una administración sin contrapesos: deben tener cuentas bancarias separadas, consejo independiente, política de conflictos de interés, auditor externo, beneficiarios evaluados y reporte trimestral público.

| Alternativa | Uso recomendado | Ventaja | Riesgo o condición |
|---|---|---|---|
| Donar a entidad social existente calificada | Inicio de programa | Rápida implementación y menor carga institucional. | Verificar calificación, solvencia, proyecto, comprobantes y resultados. |
| Asociación civil independiente | Cuando el fondo sea material y recurrente | Gobierno propio, convocatoria regional y trazabilidad detallada. | Requiere constitución, RUC, gobierno, controles y eventual calificación SUNAT. |
| Municipalidad o beneficencia pública | Proyectos puntuales de escala relevante | Vincula el recurso a infraestructura o servicio local identificable. | La donación necesita procedimiento, evaluación técnica/legal y aceptación por acuerdo de concejo; no es la vía ágil para montos pequeños. [5] |

Las donaciones deducibles se sujetan a requisitos y límites. SUNAT señala que, para ciertas entidades calificadas, la deducción no puede exceder 10 % de la renta neta de tercera categoría tras compensación de pérdidas. [6] Este posible tratamiento tributario no se incluye como ahorro en el escenario: el modelo evita prometer un beneficio fiscal hasta contar con confirmación de un contador y documentos del receptor.

## Propuesta territorial sin mensajes engañosos

El indicador debe ser el **domicilio verificado voluntariamente del jugador adulto**, no cuánto apostó, cuánto perdió ni cuánto ganó. Vincular la asignación a pérdidas sería incompatible con juego responsable y puede incentivar un comportamiento dañino.

Propongo el siguiente protocolo una vez que exista fondo real:

| Etapa | Regla propuesta |
|---|---|
| Activación | Seis meses consecutivos con utilidad neta positiva, permisos vigentes y cuentas auditadas. |
| Aporte | Hasta 1 % de utilidad neta después de impuesto a la renta; cero si hay pérdida. |
| Premios y saldos | No se descuenta importe alguno de premios, depósitos ni billeteras. Una donación individual, si se habilita, será opcional y revocable antes de su confirmación. |
| Prioridad territorial | Primero región/departamento; distrito solo si el fondo del destino alcanza S/ 15 000 anuales y hay proyecto verificable. Los montos menores se acumulan a un fondo regional. |
| Selección | Convocatoria pública, ficha de elegibilidad, evaluación técnica, declaración de conflictos y publicación de beneficiarios. |
| Pago | Transferencia bancaria al receptor calificado o, para una municipalidad, tras aceptación y documentación aplicable. |
| Rendición | Tablero trimestral: utilidad neta elegible, aporte aprobado, destino, comprobante, avance físico y reporte final. |
| Administración | Los costos de auditoría y administración salen del presupuesto corporativo, no reducen el 1 % comprometido al beneficiario. |

### Lema recomendado

No usaría **“Multi Juegos Perú — tu dinero se queda en tu distrito”**. El mensaje sugiere que todo el dinero se devuelve al territorio, cuando existen premios, impuestos, costos y reservas. Las municipalidades además tienen su propio procedimiento de aceptación y control. [5]

La opción más defendible, una vez que haya operación y reportes, es:

> **Multi Juegos Perú — juega con transparencia; hasta 1 % de nuestra utilidad neta elegible apoya proyectos sociales verificables.**

Si se prueba el esquema territorial durante al menos un año, puede añadirse:

> **…con asignación regional publicada, según un reglamento de impacto.**

## Referencias

[1]: [SUNAT — Impuesto a los Juegos a Distancia y Apuestas Deportivas](https://orientacion.sunat.gob.pe/impuesto-a-los-juegos)

[2]: [SUNAT — Tasa del Impuesto a la Renta](https://orientacion.sunat.gob.pe/03-tasa-del-impuesto)

[3]: [Ley N.° 31557 — El Peruano](https://busquedas.elperuano.pe/dispositivo/NL/2095517-1)

[4]: [SUNAT — Calificación como entidad perceptora de donaciones](https://www.gob.pe/30791-solicitar-la-calificacion-como-entidad-perceptora-de-donaciones-en-la-sunat)

[5]: [gob.pe — Procedimiento para aceptar donaciones en municipalidades](https://www.gob.pe/12286-como-aprobar-donaciones-en-las-municipalidades)

[6]: [SUNAT — Donación como gasto deducible](https://orientacion.sunat.gob.pe/01-donacion-como-gasto-deducible)
