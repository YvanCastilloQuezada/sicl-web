# ARKI — BIM, expediente técnico integral y costos

## Conclusión

ARKI se amplió para tratar el proyecto como un sistema de información coordinado. El resultado previsto ya no es únicamente una imagen, una geometría conceptual o un archivo 3D. Es un **paquete de expediente técnico integral BIM**, compuesto por requisitos, modelos, documentos, planos, metrados, costos, cronogramas, revisiones, aprobaciones y datos de entrega.

La integración se mantiene dentro de un solo motor. El flujo es:

`PROJECT_STATE → SUPER ARCHITECT → GRAPHIC INTELLIGENCE → ETI-BIM → COST MODEL → HUMAN REVIEW`

La investigación confirmó que la metodología peruana debe configurarse por proyecto. La Guía Nacional BIM del MEF aporta la cadena OIR, AIR, PIR, EIR, BEP, CCA, matriz de responsabilidades, MIDP, TIDP, PIM, CDE y revisión de contenedores. Las pautas de expedientes del MEF organizan la entrega en estudios, aspectos generales, ingeniería y detalle, y presupuesto y cronograma [1] [2].

## Qué se implementó

### Contrato ETI-BIM

`ARKI-ETI-BIM-1.0` valida cinco bloques: estudios; documentos generales; ingeniería y detalle; costos y programación; y aprobación y entrega. El contrato registra el estado de cada documento, disciplina, responsable, versión, fuente, observaciones y aprobación.

También exige la trazabilidad de contenedores BIM. La ausencia de un EIR, BEP, LOIN, CDE, MIDP, TIDP, modelo federado o informe de coordinación se registra como faltante o UNKNOWN. ARKI no lo crea ficticiamente.

### Módulo de costos

`ARKI-COST-MODEL-1.0` separa ocho tipos de evidencia:

1. precio observado;
2. precio unitario de insumo;
3. análisis de precios unitarios;
4. cotización;
5. metrado;
6. presupuesto;
7. referencia IUPC;
8. cálculo derivado.

Cada línea conserva unidad, cantidad, precio, moneda, fecha, región, fuente, proveedor, impuestos, flete, instalación y nivel de confianza. El flujo canónico es:

`OBSERVACIÓN/COTIZACIÓN → PRECIO DE INSUMO → APU → METRADO → PRESUPUESTO → REVISIÓN HUMANA`

El IUPC del INEI se trata como una referencia estadística para reajuste o comparación temporal. No se interpreta como una cotización local automática [3].

El módulo no compra, no contrata proveedores y no adopta automáticamente precios obtenidos de Internet. La investigación web produce candidatos documentales; la adopción queda pendiente de validación humana.

## Estructura de expediente que ARKI debe solicitar

Para cada tipología, ARKI debe parametrizar el expediente a partir del sector, jurisdicción, fase, TDR, contrato y normativa vigente. La plantilla transversal incluye estudios previos, predio, riesgos, topografía, suelos, ambiente, arqueología y servicios; resumen ejecutivo, ficha, memorias, especificaciones y seguridad; planos, detalles, estructuras, arquitectura, instalaciones y equipamiento; metrados, APU, insumos, cotizaciones, gastos generales, utilidad, impuestos, fórmulas polinómicas y cronogramas; y finalmente observaciones, subsanaciones, aprobaciones, firmas, versiones y cierre.

En hospitales, la documentación investigada agrega evacuación, señalización, gases medicinales, aire acondicionado, comunicaciones, equipamiento médico y media tensión, según el nivel y el TDR aplicable. En transporte aparecen topografía, geotecnia, hidrología, tráfico, pavimentos, drenaje, puentes, seguridad vial y estudios de canteras. En educación aparecen estudios del predio, arquitectura, estructuras, instalaciones, equipamiento y programación de obra. Estos conjuntos son referencias sectoriales; no deben aplicarse sin validar su alcance [4] [5] [6].

## Capacidad multidisciplinaria

ARKI puede coordinar una base amplia para arquitectura, urbanismo, paisaje, estructuras, geotecnia, carreteras, puentes, hidráulica, sanitaria, eléctrica, mecánica, electromecánica, seguridad, hospitales, aeropuertos, costos, operación y mantenimiento. Esto significa que puede organizar requisitos, alternativas, interfaces, documentos y preguntas para cada especialidad.

No significa que el sistema pueda firmar, aprobar o sustituir a un ingeniero estructural, sanitario, eléctrico, mecánico, geotécnico, vial, aeronáutico, médico o profesional responsable. Los cálculos verificables, la responsabilidad legal, la aprobación normativa y la firma permanecen en gates de revisión especializada.

## Qué falta para que un proyecto sea un expediente BIM aprobado

La implementación crea el contrato y detecta faltantes. Para cerrar un proyecto real todavía se necesita información concreta: CUI o identificador, entidad, jurisdicción, tipología, predio, programa, TDR, EIR, BEP, LOIN, disciplinas, fuentes, modelos, levantamientos, normas vigentes, metrados, precios, cotizaciones, fecha base, impuestos, cronograma y responsables.

Por ello, el estado correcto es **IMPLEMENTED / INCOMPLETE UNTIL PROJECT EVIDENCE**. ARKI puede preparar y revisar el paquete; no debe declararlo expediente aprobado mientras no existan los documentos y las validaciones correspondientes.

## Fuentes investigadas

La investigación se apoyó en guías y documentos públicos del MEF, la Guía Nacional BIM, INEI, Contraloría/BID, PRONIED, entidades de salud, MTC y expedientes sectoriales. Los informes detallados se conservan en los archivos `workflow-bim-official.md`, `workflow-hospital.md`, `workflow-education.md`, `workflow-transport.md` y `workflow-costs.md`.

## Referencias

[1]: https://www.mef.gob.pe/planbimperu/docs/recursos/guia_nacional_BIM.pdf "Guía Nacional BIM del MEF"
[2]: https://www.mef.gob.pe/contenidos/inv_publica/docs/capacitaciones/Guia_Instructiva/4_Pautas_y_recomendaciones_para_la_elaboracion_de_expedientes_tecnicos.pdf "Pautas y recomendaciones para la elaboración de expedientes técnicos"
[3]: https://www.inei.gob.pe/media/MenuRecursivo/6_1.pdf "Metodología de los Índices Unificados de Precios de la Construcción"
[4]: https://doc.contraloria.gob.pe/BID/2022/BID_SCC280/Anexo02_Esp_Tecnicas_Generales_para_el_uso_del_BIM.pdf "Especificaciones técnicas generales para el uso del BIM"
[5]: https://www.mef.gob.pe/contenidos/inv_publica/anexos/instructivo_formato5_RD0005_2021EF6301.pdf "Instructivo del Formato N.° 05: Plan de Ejecución BIM"
[6]: https://www.mef.gob.pe/contenidos/comunicado/RLCE/Proyecto_Reglamento_LCE.pdf "Documento público consultado sobre Reglamento de la Ley de Contrataciones"
